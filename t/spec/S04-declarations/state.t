use v6;

use Test;

plan 36;

# L<S04/The Relationship of Blocks and Declarations/There is a new state declarator that introduces>

# RT #67040 -- state initialized with //= instead of =
# (I've put this test here since it gets buggered by later tests
#  unless RT #67058 has been fixed.)
{
    sub rt67040 {
        state $x //= 17;
        $x++;
        return $x;
    }

    is rt67040(), 18, 'Assignment to state variable with //= works.';
    is rt67040(), 19, 'Assignment to state variable with //= happens once.';
}

# state() inside subs
{
    sub inc () {
        state $svar;
        $svar++;
        return $svar;
    };

    is(inc(), 1, "state() works inside subs (#1)");
    is(inc(), 2, "state() works inside subs (#2)");
    is(inc(), 3, "state() works inside subs (#3)");
}

# state() inside coderefs
# L<S04/Closure traits/"semantics to any initializer, so this also works">
{
    my $gen = {
        # Note: The following line is only executed once, because it's equivalent
        # to
        #   state $svar will first { 42 };
        state $svar = 42;
        my $ret = { $svar++ };
    };

    my $a = $gen(); # $svar == 42
    $a(); $a();     # $svar == 44
    my $b = $gen(); # $svar == 44

    is $b(), 44, "state() works inside coderefs";
}

# state() inside for-loops
{
    for 1,2,3 -> $val {
        state $svar;
        $svar++;

        # Only check on last run
        if $val == 3 {
            is $svar, 3, "state() works inside for-loops";
        }
    }
}

# state with arrays.
{
    my @bar = 1,2,3;
    sub swatest {
        state (@foo) = @bar;
        my $x = @foo.join('|');
        @foo[0]++;
        return $x
    }
    is swatest(), '1|2|3', 'array state initialized correctly';
    is swatest(), '2|2|3', 'array state retained between calls';
}

# state with arrays.
{
    sub swainit_sub { 1,2,3 }
    sub swatest2 {
        state (@foo) = swainit_sub();
        my $x = @foo.join('|');
        @foo[0]++;
        return $x
    }
    is swatest2(), '1|2|3', 'array state initialized from call correctly';
    is swatest2(), '2|2|3', 'array state retained between calls';
}

# (state @foo) = @bar differs from state @foo = @bar
{
   my @bar = 1,2,3;
   sub swatest3 {
       (state @foo) = @bar;
       my $x = @foo.join('|');
       @foo[0]++;
       return $x
   }
   is swatest3(), '1|2|3', '(state @foo) = @bar is not state @foo = @bar';
   is swatest3(), '1|2|3', '(state @foo) = @bar is not state @foo = @bar';
}

# RHS of state is only run once per init
{
    my $rhs_calls = 0;
    sub impure_rhs {
        state $x = do { $rhs_calls++ }
    }
    impure_rhs() for 1..3;
    is $rhs_calls, 1, 'RHS of state $x = ... only called once';
}

# state will first {...}
#?pugs eval "parse error"
#?rakudo skip 'will first { ... }'
{
    my ($a, $b);
    my $gen = {
        state $svar will first { 42 };
        -> { $svar++ };
    }
    $a = $gen();    # $svar == 42
    $a(); $a();     # $svar == 44
    $b = $gen()();  # $svar == 44

    is $b, 44, 'state will first {...} works';
}

# Return of a reference to a state() var
#?rakudo skip 'references'
{
    my $gen = {
        state $svar = 42;
        \$svar;
    };

    my $svar_ref = $gen();
    $$svar_ref++; $$svar_ref++;

    $svar_ref = $gen();
    #?pugs todo "state bug"
    is $$svar_ref, 44, "reference to a state() var";
}

# Anonymous state vars
# L<http://groups.google.de/group/perl.perl6.language/msg/07aefb88f5fc8429>
#?pugs todo 'anonymous state vars'
#?rakudo skip 'references and anonymous state vars'
{
    # XXX -- currently this is parsed as \&state()
    my $gen = eval '{ try { \state } }';
    $gen //= sub { my $x; \$x };

    my $svar_ref = $gen();               # $svar == 0
    try { $$svar_ref++; $$svar_ref++ };  # $svar == 2

    $svar_ref = $gen();               # $svar == 2
    is try { $$svar_ref }, 2, "anonymous state() vars";
}

# L<http://www.nntp.perl.org/group/perl.perl6.language/20888>
# ("Re: Declaration and definition of state() vars" from Larry)
#?pugs eval 'Parse error'
{
    my ($a, $b);
    my $gen = {
        (state $svar) = 42;
        my $ret = { $svar++ };
    };

    $a = $gen();        # $svar == 42
    $a(); $a();         # $svar == 44
    $b = $gen()();      # $svar == 42
    is $b, 42, "state() and parens"; # svar == 43
}

# state() inside regular expressions
#?rakudo skip 'embedded closures in regexen'
{
    my $str = "abc";

    my $re  = {
    # Perl 5 RE, as we don't want to force people to install Parrot ATM. (The
    # test passes when using the Perl 6 RE, too.)
    $str ~~ s:Perl5/^(.)/{
      state $svar;
      ++$svar;
    }/;
    };
    $re();
    $re();
    $re();
    is +$str, 3, "state() inside regular expressions works";
}

# state() inside subs, chained declaration
{
    sub step () {
        state $svar = state $svar2 = 42;
        $svar++;
        $svar2--;
        return (+$svar, +$svar2);
    };

    is(step().join('|'), "43|41", "chained state (#1)");
    is(step().join('|'), "44|40", "chained state (#2)");
}

# state in cloned closures
{
    for <first second> {
        my $code = {
            state $foo = 42;
            ++$foo;
        };

        is $code(), 43, "state was initialized properly ($_ time)";
        is $code(), 44, "state keeps its value across calls ($_ time)";
    }
}

# state with multiple explicit calls to clone - a little bit subtle
{
    my $i = 0;
    my $func = { state $x = $i++; $x };
    my ($a, $b) = $func.clone, $func.clone; 
    is $a(), 0, 'state was initialized correctly for clone 1';
    is $b(), 1, 'state was initialized correctly for clone 2';
    is $a(), 0, 'state between clones is independent';
}

# recursive state with list assignment initialization happens only first time
{
    my $seensize;
    my sub fib (Int $n) {
	    state @seen = 0,1,1;
	    $seensize = +@seen;
	    @seen[$n] //= fib($n-1) + fib($n-2);
    }
    is fib(10), 55, "fib 10 works";
    is $seensize, 11, "list assignment state in fib memoizes";
}

# recursive state with [list] assignment initialization happens only first time
#?rakudo skip '@$foo syntax'
{
    my $seensize;
    my sub fib (Int $n) {
	    state $seen = [0,1,1];
	    $seensize = +@$seen;
	    $seen[$n] //= fib($n-1) + fib($n-2);
    }
    is fib(10), 55, "fib 2 works";
    is $seensize, 11, "[list] assignment state in fib memoizes";
}


{
    # now we're just being plain evil:
    subset A of Int where { $_ < state $x++ };
    my A $y = -4;
    # the compiler could have done some checks somehwere, so 
    # pick a reasonably high number
    dies_ok { $y = 900000 }, 'growing subset types rejects too high values';
    lives_ok { $y = 1 }, 'the state variable in subset types works (1)';
    lives_ok { $y = 2 }, 'the state variable in subset types works (2)';
    lives_ok { $y = 3 }, 'the state variable in subset types works (3)';
}

# vim: ft=perl6
