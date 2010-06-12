use v6;
use Test;

plan 62;

#L<S04/The Relationship of Blocks and Declarations/"declarations, all
# lexically scoped declarations are visible"> 
{

    #?rakudo todo 'lexicals bug; RT #61838'
    eval_dies_ok('$x; my $x = 42', 'my() variable not yet visible prior to declaration');
    #?rakudo todo 'scoping bug'
    is(eval('my $x = 42; $x'), 42, 'my() variable is visible now (2)');
}


{
    my $ret = 42;
    eval_dies_ok '$ret = $x ~ my $x;', 'my() variable not yet visible (1)';
    is $ret, 42,                       'my() variable not yet visible (2)';
}

{
    my $ret = 42;
    lives_ok { $ret = (my $x) ~ $x }, 'my() variable is visible (1)';
    #?rakudo todo 'scoping bug'
    is $ret, "",                      'my() variable is visible (2)';
}

{
    sub answer { 42 }
    my &fortytwo = &answer;
    is &fortytwo(), 42,               'my variable with & sigil works (1)';
    is fortytwo(),  42,               'my variable with & sigil works (2)';
}

#?rakudo skip 'binding'
{
  my $was_in_sub;
  my &foo := -> $arg { $was_in_sub = $arg };
  foo(42);
  is $was_in_sub, 42, 'calling a lexically defined my()-code var worked';
}

eval_dies_ok 'foo(42)', 'my &foo is lexically scoped';

{
  is(do {my $a = 3; $a}, 3, 'do{my $a = 3; $a} works');
  is(do {1; my $a = 3; $a}, 3, 'do{1; my $a = 3; $a} works');
}

eval_lives_ok 'my $x = my $y = 0;', '"my $x = my $y = 0" parses';

#?rakudo skip 'fatal redeclarations'
{
    my $test = "value should still be set for arg, even if there's a later my";
    sub foo2 (*%p) {
        is(%p<a>, 'b', $test);
        my %p;
    }
    foo2(a => 'b');
}

my $a = 1;
ok($a, '$a is available in this scope');

if (1) { # create a new lexical scope
    ok($a, '$a is available in this scope');
    my $b = 1;
    ok($b, '$b is available in this scope');
}
eval_dies_ok '$b', '$b is not available in this scope';

# changing a lexical within a block retains the changed value
my $c = 1;
if (1) { # create a new lexical scope
    is($c, 1, '$c is still the same outer value');
    $c = 2;
}
is($c, 2, '$c is available, and the outer value has been changed');

# L<S04/The Relationship of Blocks and Declarations/prior to the first declaration>

my $d = 1;
{ # create a new lexical scope
    is($d, 1, '$d is still the outer $d');
    { # create another new lexical scope
        my $d = 2;
        is($d, 2, '$d is now the lexical (inner) $d');    
    }
}
is($d, 1, '$d has not changed');

# eval() introduces new lexical scope
#?rakudo todo 'scoping'
is( eval('
my $d = 1;
{ 
    my $d = 3 
}
$d;
'), 1, '$d is available, and the outer value has not changed' );

{
    # check closures with functions
    my $func;
    my $func2;
    if (1) { # create a new lexical scope
        my $e = 0;
        $func = sub { $e++ }; # one to inc
        $func2 = sub { $e };  # one to access it
    }

    eval_dies_ok '$e', '$e is not available in this scope';
    is($func2(), 0, '$func2() just returns the $e lexical which is held by the closure');
    $func();
    is($func2(), 1, '$func() increments the $e lexical which is held by the closure');
    $func();
    is($func2(), 2, '... and one more time just to be sure');
}

# check my as simultaneous lvalue and rvalue

is(eval('my $e1 = my $e2 = 42'), 42, 'can parse squinting my value');
is(eval('my $e1 = my $e2 = 42; $e1'), 42, 'can capture squinting my value');
is(eval('my $e1 = my $e2 = 42; $e2'), 42, 'can set squinting my variable');
#?rakudo skip 'item assignment'
is(eval('my $x = 1, my $y = 2; $y'), 2, 'precedence of my wrt = and ,');

# test that my (@array, @otherarray) correctly declares
# and initializes both arrays
{
    my (@a, @b);
    lives_ok { @a.push(2) }, 'Can use @a';
    lives_ok { @b.push(3) }, 'Can use @b';
    is ~@a, '2', 'push actually worked on @a';
    is ~@b, '3', 'push actually worked on @b';
}

my $result;
my $x = 0;
{
    while my $x = 1 { $result = $x; last };
    is $result, 1, 'my in while cond seen from body';
}

#?rakudo 2 todo 'scoping'
is(eval('while my $x = 1 { last }; $x'), 1, 'my in while cond seen after');

is(eval('if my $x = 1 { $x } else { 0 }'), 1, 'my in if cond seen from then');
#?rakudo skip 'Null PMC access in type()'
is(eval('if not my $x = 1 { 0 } else { $x }'), 1, 'my in if cond seen from else');
#?rakudo todo 'scoping'
is(eval('if my $x = 1 { 0 } else { 0 }; $x'), 1, 'my in if cond seen after');

# check proper scoping of my in loop initializer

#?rakudo 4 skip 'Null PMC access in type()'
is(eval('loop (my $x = 1, my $y = 2; $x > 0; $x--) { $result = $x; last }; $result'), 1, '1st my in loop cond seen from body');
is(eval('loop (my $x = 1, my $y = 2; $x > 0; $x--) { $result = $y; last }; $result'), 2, '2nd my in loop cond seen from body');
is(eval('loop (my $x = 1, my $y = 2; $x > 0; $x--) { last }; $x'), 1, '1st my in loop cond seen after');
is(eval('loop (my $x = 1, my $y = 2; $x > 0; $x--) { last }; $y'), 2, '2nd my in loop cond seen after');


# check that declaring lexical twice is noop
#?rakudo skip 'fatal redeclarations'
{
    my $f;
    $f = 5;
    my $f;
    is($f, 5, "two lexicals declared in scope is noop");
}

my $z = 42;
{
    my $z = $z;
    ok( $z.notdef, 'my $z = $z; can not see the value of the outer $z');
}

# interaction of my and eval
# yes, it's weird... but that's the way it is
# http://irclog.perlgeek.de/perl6/2009-03-19#i_1001177
{
    sub eval_elsewhere($str) {
        eval $str;
    }
    my $x = 4;
    is eval_elsewhere('$x + 1'), 5, 
       'eval() knows the pad where it is launched from';

    ok eval_elsewhere('!$y.defined'),
       '... but initialization of variables might still happen afterwards';

    # don't remove this line, or eval() will complain about 
    # $y not being declared
    my $y = 4;
}

# &variables don't need to be pre-declared
{
    #?rakudo todo '&-sigiled variables'
    eval_lives_ok '&x; 1', '&x does not need to be pre-declared';
    eval_dies_ok '&x()', '&x() dies when empty';
}

# RT #62766
{
    eval_lives_ok 'my $a;my $x if 0;$a = $x', 'my $x if 0';

    #?rakudo skip 'infinite loop? (noauto)'
    eval_lives_ok 'my $a;do { 1/0; my $x; CATCH { $a = $x.defined } }';

    {
        #?rakudo 2 todo 'OUTER and SETTING'
        ok eval('not OUTER::<$x>.defined'), 'OUTER::<$x>';
        ok eval('not SETTING:<$x>.defined'), 'SETTING::<$x>';
        my $x;
    }

    {
        my $a;
        #?rakudo skip 'infinite loop? (noauto)'
        eval_lives_ok 'do { 1/0;my Int $x;CATCH { $a = ?($x ~~ Int) } }';
        #?rakudo todo 'previous test skipped'
        ok $a, 'unreached declaration in effect at block start';
    }

    # XXX As I write this, this does not die right.  more testing needed.
    dies_ok { my Int $x = "abc" }, 'type error';
    #?rakudo todo 'type error not caught'
    dies_ok { eval '$x = "abc"'; my Int $x; }, 'also a type error';
}

{
    ok declare_later().notdef,
        'Can access variable returned from a named closure that is declared below the calling position';
    my $x;
    sub declare_later {
        $x;
    }
}

eval_lives_ok 'my (%h?)', 'my (%h?) lives';

#RT 63588
#?rakudo todo 'global my variables are not visible inside class declarations'
eval_lives_ok 'my $x = 3; class A { has .$y = $x; }; say A.new.y', 
        'global scoped variables are visible inside class definitions';

# vim: ft=perl6
