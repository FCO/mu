use v6;
use Test;
plan *;

# Test for proto definitions
class A { }
class B { }
class C is A is B { }
proto foo($x) { 1 }
multi foo(A $x) { 2 }
multi foo(B $x) { 3 }
is(foo(A.new), 2, 'dispatch on class worked');
is(foo(B.new), 3, 'dispatch on class worked');
is(foo(C.new), 1, 'ambiguous dispatch fell back to proto');
is(foo(42),    1, 'dispatch with no possible candidates fell back to proto');

{
    # Test that proto makes all further subs in the scope also be multi.
    proto bar() { "proto" }
    sub bar($x) { 1 }
    multi bar($x, $y) { 2 }
    multi sub bar($x, $y, $z) { 3 }
    sub bar($x, $y, $z, $a) { 4 }
    is bar(),  "proto", "called the proto";
    is bar(1),       1, "sub defined without multi has become one";
    is bar(1,2),     2, "multi ... still works, though";
    is bar(1,2,3),   3, "multi sub ... still works too";
    is bar(1,2,3,4), 4, "called another sub as a multi candidate, made a multi by proto";
}

# L<S03/"Reduction operators">
#?rakudo skip 1
{
    proto prefix:<[+]> (*@args) {
        my $accum = 0;
        $accum += $_ for @args;
        return $accum * 2; # * 2 is intentional here
    }

    is ([+] 1,2,3), 12, "[+] overloaded by proto definition";
}

# more similar tests
#?rakudo skip 'no custom operators yet'
{
    proto prefix:<moose> ($arg) { $arg + 1 }
    is (moose 3), 4, "proto definition of prefix:<moose> works";

    proto prefix:<elk> ($arg) {...}
    multi prefix:<elk> ($arg) { $arg + 1 }
    is (elk 3), 4, "multi definition of prefix:<elk> works";
}

#?rakudo todo 'RT #68242'
eval_dies_ok 'proto rt68242($a){};proto rt68242($c,$d){};',
    'attempt to define two proto subs with the same name dies';

# RT #65322
{
    my $rt65322 = q[
        multi sub rt65322( Int $n where 1 ) { 1 }
              sub rt65322( Int $n ) { 2 }
    ];
    eval_dies_ok $rt65322, "Can't define sub and multi sub without proto";
}

{
    eval_dies_ok q[
        multi sub i1(Int $x) {}
        sub i1(Int $x, Str $y) {} 
    ], 'declaring a multi and a single routine dies';

    #?rakudo todo 'RT 71810'
    eval_dies_ok q[
        sub i2(Int $x, Str $y) {1}
        sub i2(Int $x, Str $y) {2}
    ], 'declaring two only-subs with same name dies';



}

done_testing;

# vim: ft=perl6
