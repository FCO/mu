use v6;
use Test;

# L<S06/List parameters/Slurpy parameters>

plan 63;

sub xelems(*@args) { @args.elems }
sub xjoin(*@args)  { @args.join('|') }

is xelems(1),          1,        'Basic slurpy params 1';
is xelems(1, 2, 5),    3,        'Basic slurpy params 2';

is xjoin(1),           '1',      'Basic slurpy params 3';
is xjoin(1, 2, 5),     '1|2|5',  'Basic slurpy params 4';

sub mixed($pos1, *@slurp) { "|$pos1|" ~ @slurp.join('!') }

is mixed(1),           '|1|',    'Positional and slurp params';
is mixed(1, 2, 3),     '|1|2!3', 'Positional and slurp params';
dies_ok { mixed()},              'at least one arg required';

#?rakudo skip 'types on slurpy params'
{
    sub x_typed_join(Int *@args){ @args.join('|') }
    is x_typed_join(1),           '1',      'Basic slurpy params with types 1';
    is x_typed_join(1, 2, 5),     '1|2|5',  'Basic slurpy params with types 2';
    dies_ok { x_typed_join(3, 'x') }, 'Types on slurpy params are checked';
}

sub first_arg      ( *@args         ) { ~@args[0]; }
sub first_arg_rw   ( *@args is rw   ) { ~@args[0]; }
sub first_arg_copy ( *@args is copy ) { ~@args[0]; }

is first_arg(1, 2, 3),      '1',  'can grab first item of a slurpy array';
is first_arg_rw(1, 2, 3),   '1',  'can grab first item of a slurpy array (is rw)';
is first_arg_copy(1, 2, 3), '1',  'can grab first item of a slurpy array (is copy)';

# test that shifting works
{
    sub func(*@m) {
        @m.shift;
        return @m;
    }
    #?pugs todo 'bug'
    is_deeply(func(5), [], "Shift from an array function argument works");
}


sub whatever {
    is(@_[3], 'd', 'implicit slurpy param flattens');
    is(@_[2], 'c', 'implicit slurpy param flattens');
    is(@_[1], 'b', 'implicit slurpy param flattens');
    is(@_[0], 'a', 'implicit slurpy param flattens');
}

whatever( 'a' p5=> 'b', 'c' p5=> 'd' );

# use to be t/spec/S06-signature/slurpy-params-2.t

# L<S06/List parameters/Slurpy parameters follow any required>

=begin pod

=head1 List parameter test

These tests are the testing for "List paameters" section of Synopsis 06

You might also be interested in the thread Calling positionals by name in
presence of a slurpy hash" on p6l started by Ingo
Blechschmidt L<http://www.nntp.perl.org/group/perl.perl6.language/22883>

=end pod


{
    # Positional with slurpy *%h and slurpy *@a
    my sub foo($n, *%h, *@a) { };
    my sub foo1($n, *%h, *@a) { $n }
    my sub foo2($n, *%h, *@a) { %h<x> + %h<y> + %h<n> }
    my sub foo3($n, *%h, *@a) { [+] @a }

## all pairs will be slurped into hash, except the key which has the same name
## as positional parameter
    diag('Testing with positional arguments');
    lives_ok { foo 1, x => 20, y => 300, 4000 },
    'Testing: `sub foo($n, *%h, *@a){ }; foo 1, x => 20, y => 300, 4000`';
    is (foo1 1, x => 20, y => 300, 4000), 1,
    'Testing the value for positional';
    is (foo2 1, x => 20, y => 300, 4000), 320,
    'Testing the value for slurpy *%h';
    is (foo3 1, x => 20, y => 300, 4000), 4000,
    'Testing the value for slurpy *@a';

    # XXX should this really die?
    #?rakudo todo 'positional params can be accessed as named ones'
    dies_ok { foo 1, n => 20, y => 300, 4000 },
    'Testing: `sub foo($n, *%h, *@a){ }; foo 1, n => 20, y => 300, 4000`';

## We *can* pass positional arguments as a 'named' pair with slurpy *%h.
## Only *remaining* pairs are slurped into the *%h
# Note: with slurpy *@a, you can pass positional params, But will be slurped into *@a
    diag('Testing without positional arguments');
    lives_ok { foo n => 20, y => 300, 4000 },
    'Testing: `sub foo($n, *%h, *@a){ }; foo n => 20, y => 300, 4000`';
#?rakudo 3 todo 'positional params can be passed as named ones'
    is (foo1 n => 20, y => 300, 4000), 20,
    'Testing the value for positional';
    is (foo2 n => 20, y => 300, 4000), 300,
    'Testing the value for slurpy *%h';
    is (foo3 n => 20, y => 300, 4000), 4000,
    'Testing the value for slurpy *@a';
}


{
    my sub foo ($n, *%h) { };
    ## NOTE: *NOT* sub foo ($n, *%h, *@a)
    #?pugs todo 'bug'
    #?rakudo todo ''
    dies_ok { foo 1, n => 20, y => 300 },
        'Testing: `sub foo($n, *%h) { }; foo 1, n => 20, y => 300`';
}

{
    my sub foo ($n, *%h) { };
    ## NOTE: *NOT* sub foo ($n, *%h, *@a)
    dies_ok { foo 1, x => 20, y => 300, 4000 },
        'Testing: `sub foo($n, *%h) { }; foo 1, x => 20, y => 300, 4000`';
}


# Named with slurpy *%h and slurpy *@a
# named arguments aren't required in tests below
{
    my sub foo(:$n, *%h, *@a) { };
    my sub foo1(:$n, *%h, *@a) { $n };
    my sub foo2(:$n, *%h, *@a) { %h<x> + %h<y> + %h<n> };
    my sub foo3(:$n, *%h, *@a) { [+] @a };
    
    diag("Testing with named arguments (named param isn't required)");
    lives_ok { foo 1, x => 20, y => 300, 4000 },
      'Testing: `sub foo(:$n, *%h, *@a){ }; foo 1, x => 20, y => 300, 4000`';
    ok (foo1 1, x => 20, y => 300, 4000) ~~ undef,
      'Testing value for named argument';
    is (foo2 1, x => 20, y => 300, 4000), 320,
      'Testing value for slurpy *%h';
    is (foo3 1, x => 20, y => 300, 4000), 4001,
      'Testing the value for slurpy *@a';
    
    ### named parameter pair will always have a higher "priority" while passing
    ### so %h<n> will always be undef
    lives_ok { foo1 1, n => 20, y => 300, 4000 },
      'Testing: `sub foo(:$n, *%h, *@a){ }; foo 1, n => 20, y => 300, 4000`';
    is (foo1 1, n => 20, y => 300, 4000), 20,
      'Testing the named argument';
    is (foo2 1, n => 20, y => 300, 4000), 300,
      'Testing value for slurpy *%h';
    is (foo3 1, n => 20, y => 300, 4000), 4001,
      'Testing the value for slurpy *@a';
}


# named with slurpy *%h and slurpy *@a
## Named arguments **ARE** required in tests below

#### ++ version
{
    my sub foo(:$n!, *%h, *@a){ };
    diag('Testing with named arguments (named param is required) (++ version)');
    lives_ok { foo 1, n => 20, y => 300, 4000 },
    'Testing: `my sub foo(+:$n, *%h, *@a){ }; foo 1, n => 20, y => 300, 4000 }`';
    #?pugs todo 'bug'
    dies_ok { foo 1, x => 20, y => 300, 4000 };
}

#### "trait" version
{
    my sub foo(:$n is required, *%h, *@a) { };
    diag('Testing with named arguments (named param is required) (trait version)');
    lives_ok { foo 1, n => 20, y => 300, 4000 },
    'Testing: `my sub foo(:$n is required, *%h, *@a){ }; foo 1, n => 20, y => 300, 4000 }`';
    #?pugs todo 'bug'
    #?rakudo todo ''
    dies_ok { foo 1, x => 20, y => 300, 4000 },
    'Testing: `my sub foo(:$n is required, *%h, *@a){ }; foo 1, x => 20, y => 300, 4000 }`';
}

##### Now slurpy scalar tests here.
=begin desc

=head1 List parameter test

These tests are the testing for "List parameters" section of Synopsis 06


=end desc

# L<S06/List parameters/Slurpy scalar parameters capture what would otherwise be the first elements of the variadic array:>

{
    sub first(*$f, *$s, *@r){ return $f };
    sub second(*$f, *$s, *@r){ return $s };
    sub rest(*$f, *$s, *@r){ return [+] @r };
    diag 'Testing with slurpy scalar';
    is first(1, 2, 3, 4, 5), 1,
       'Testing the first slurpy scalar...';
    is second(1, 2, 3, 4, 5), 2,
       'Testing the second slurpy scalar...';
    is rest(1, 2, 3, 4, 5), 12,
       'Testing the rest slurpy *@r';
}

# RT #61772
{
    my @array_in = <a b c>;

    sub no_copy( *@a         ) { @a }
    sub is_copy( *@a is copy ) { @a }

    my @not_copied = no_copy( @array_in );
    my @copied     = is_copy( @array_in );

    is @copied, @not_copied, 'slurpy array copy same as not copied';
}

# RT #64814
{
    sub slurp_any( Any *@a ) { @a[0] }
    lives_ok { slurp_any( 'foo' ) }, 'can call sub with (Any *@a) sig';
    is slurp_any( 'foo' ), 'foo', 'call to sub with (Any *@a) works';

    sub slurp_int( Int *@a ) { @a[0] }
    #?rakudo todo 'RT #64814'
    lives_ok { slurp_int( 27.Int ) }, 'can call sub with (Int *@a) sig';
    dies_ok { slurp_int( 'foo' ) }, 'dies: call (Int *@a) sub with string';
    #?rakudo skip 'RT #64814'
    is slurp_int( 27.Int ), 27, 'call to sub with (Int *@a) works';

    sub slurp_of_int( *@a of Int ) { @a[0] }
    #?rakudo 2 todo 'RT #64814'
    lives_ok { slurp_of_int( 64814.int ) }, 'can call (*@a of Int) sub';
    dies_ok { slurp_of_int( 'foo' ) }, 'dies: call (*@a of Int) with string';
    is slurp_of_int( 99.Int ), 99, 'call to (*@a of Int) sub works';

    class X64814 {}
    class Y64814 {
        method x_slurp ( X64814 *@a ) { 2 }
        method of_x ( *@a of X64814 ) { 3 }
        method x_array ( X64814 @a ) { 4 }
    }

    my $x = X64814.new;
    my $y = Y64814.new;
    #?rakudo todo 'RT #64814'
    lives_ok { $y.x_array( $x ) }, 'can call method with typed array sig';
    lives_ok { $y.of_x( $x ) }, 'can call method with "slurp of" sig';
    #?rakudo todo 'RT #64814'
    lives_ok { $y.x_slurp( $x ) }, 'can call method with typed slurpy sig';
    dies_ok { $y.x_array( 23 ) }, 'die calling method with typed array sig';
    #?rakudo todo 'RT #64814'
    dies_ok { $y.of_x( 17 ) }, 'dies calling method with "slurp of" sig';
    dies_ok { $y.x_slurp( 35 ) }, 'dies calling method with typed slurpy sig';
}

{
    my $count = 0;
    sub slurp_obj_thread(*@a) { $count++; }
    multi sub slurp_obj_multi(*@a) { $count++; }

    $count = 0;
    slurp_obj_thread(3|4|5);
    is $count, 1, 'Object slurpy param doesnt autothread';
    $count = 0;
    slurp_obj_multi(3|4|5);
    is $count, 1, 'Object slurpy param doesnt autothread';
}

#?rakudo skip 'Typed slurpy, junctions, and autothreading (RT 68142)'
##  Note:  I've listed these as though they succeed, but it's possible
##  that the parameter binding should fail outright.  --pmichaud
{
    my $count = 0;
    sub slurp_any_thread(Any *@a) { $count++; }
    multi sub slurp_any_multi(Any *@a) { $count++; }

    slurp_any_thread(3|4|5);
    is $count, 1, 'Any slurpy param doesnt autothread';
    $count = 0;
    slurp_any_multi(3|4|5);
    is $count, 1, 'Any slurpy param doesnt autothread';
}

# vim: ft=perl6
