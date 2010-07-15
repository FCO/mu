use v6;

use Test;

plan 34;

# L<S06/Routine modifiers/>
# L<S06/Parameters and arguments/>

# multi sub with signature
multi sub foo() { "empty" }
multi sub foo($a) { "one" }    #OK not used
is(foo(), "empty", "multi sub with empty signature");
is(foo(42), "one", "multi sub with parameter list");

# multi sub without signature
multi sub bar { "empty" }
multi sub bar($a) { "one" }    #OK not used
is(bar(), "empty", "multi sub with no signature");
is(bar(42), "one", "multi sub with parameter list");

# multi without a routine type
multi baz { "empty" }
multi baz($a) { "one" }    #OK not used
is(baz(), "empty", "multi with no signature");
is(baz(42), "one", "multi with parameter list");

# multi with some parameters not counting in dispatch (;;) - note that if the
# second parameter is counted as part of the dispatch, then invoking with 2
# ints means they are tied candidates as one isn't narrower than the other.
# (Note Int is narrower than Num - any two types where one is narrower than
# the other will do it, though.)
multi foo(Int $a, Num $b) { 1 }    #OK not used
multi foo(Num $a, Int $b) { 2 }    #OK not used
multi bar(Int $a;; Num $b) { 1 }    #OK not used
multi bar(Num $a;; Int $b) { 2 }    #OK not used
my $lived = 0;
try { foo(1,1); $lived = 1 }
is($lived, 0, "dispatch tied as expected");
is(bar(1,1), 1, "not tied as only first type in the dispatch");

# not allowed to declare anonymous routines with only, multi or proto.
eval_dies_ok 'only sub {}', 'anonymous only sub is an error';
eval_dies_ok 'multi sub {}', 'anonymous multi sub is an error';
eval_dies_ok 'proto sub {}', 'anonymous proto sub is an error';
eval_dies_ok 'only {}', 'anonymous only is an error';
eval_dies_ok 'multi {}', 'anonymous multi is an error';
eval_dies_ok 'proto {}', 'anonymous proto is an error';
eval_dies_ok 'class A { only method {} }', 'anonymous only method is an error';
eval_dies_ok 'class B { multi method {} }', 'anonymous multi method is an error';
eval_dies_ok 'class C { proto method {} }', 'anonymous proto method is an error';

ok(&foo ~~ Multi, 'a multi does Multi');
ok(&foo ~~ Callable, 'a multi does Callable');
ok(~&foo ~~ /foo/,  'a multi stringifies sensibly');

# note - example in ticket [perl #58948] a bit more elaborate
{
    multi sub max($a, $b, $c) {return 9}    #OK not used

    lives_ok { max(1, 2, 3) }, 'use multi method to override builtin lives';
    is eval('max(1, 2, 3)'), 9, 'use multi method to override builtin';
}

# named and slurpy interaction - there have been bugs in the past on this front
{
    multi nsi_1(Int $x, Bool :$flag, *@vals) { "nsi 1" };    #OK not used
    is nsi_1(1),             'nsi 1', 'interaction between named and slurpy (1)';
    is nsi_1(1, 2, 3, 4, 5), 'nsi 1', 'interaction between named and slurpy (2)';

    multi nsi_2(Bool :$baz = Bool::False, *@vals) { "nsi 2" };    #OK not used
    is nsi_2(:baz(Bool::True), 1, 2, 3), 'nsi 2', 'interaction between named and slurpy (3)';
    is nsi_2(1, 2, 3),                   'nsi 2', 'interaction between named and slurpy (4)';
}

# RT #68234
{
    multi rt68234(:$key!) { 'with key' };    #OK not used
    multi rt68234(*%_)    { 'unknown' };    #OK not used
    is rt68234(:key), 'with key', 'can find multi method with key';
    #?rakudo skip 'RT #68234'
    is rt68234(:unknown), 'unknown', 'can find multi method with slurpy';
}

# RT #68158
{
    multi rt68158() { 1 }
    multi rt68158(*@x) { 2 }    #OK not used
    is rt68158(),  1, 'non-slurpy wins over slurpy';
    is rt68158(9), 2, 'slurpy called when non-slurpy can not bind';
}

# RT #64922
{
    multi rt64922($x, %h?) { 1 }    #OK not used
    multi rt64922(@x) { 2 }    #OK not used
    is rt64922(1),     1, 'optional parameter does not break type-based candidate sorting';
    is rt64922([1,2]), 2, 'optional parameter does not break type-based candidate sorting';
}

# RT #65672
{
    multi rt65672()   { 99 }
    multi rt65672($x) { $x }
    sub rt65672caller( &x ) { &x() }
    is rt65672caller( &rt65672 ), 99, 'multi can be passed as callable';
}

# We had a bug where the multiness leaked into a sub, so we got errors
# about anonymous methods not being allowed to be multi.
{
    multi sub kangaroo() { return method () { self * 2 } }
    my $m = kangaroo();
    is 21.$m(), 42, 'can write anonymous methods inside multi subs';
}

done_testing;

# vim: ft=perl6
