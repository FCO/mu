use v6;

use Test;

plan 9;

# L<S12/"Calling sets of methods"/"Any method can defer to the next candidate method in the list">

class Foo {
    # $.tracker is used to determine the order of calls.
    has $.tracker is rw;
    multi method doit()  {$.tracker ~= 'foo,'}
    multi method doit(Int $num) {$.tracker ~= 'fooint,'}
    method show  {$.tracker}
    method clear {$.tracker = ''}
}

class BarCallSame is Foo {
    multi method doit() {$.tracker ~= 'bar,'; callsame; $.tracker ~= 'ret1,'}
    multi method doit(Int $num) {$.tracker ~= 'barint,'; callsame; $.tracker ~= 'ret2,'}
}

{
    my $o = BarCallSame.new;
    $o.clear;
    $o.doit;
    is($o.show, 'bar,foo,ret1,', 'callsame inheritance test');
    $o.clear;
    is($o.show, '', 'sanity test for clearing');
    $o.doit(5);
    is($o.show, 'barint,fooint,ret2,', 'callsame multimethod/inheritance test');
}


class BarCallWithEmpty is Foo {
    multi method doit() {$.tracker ~= 'bar,'; callwith(); $.tracker ~= 'ret1,'}
    multi method doit(Int $num) {$.tracker ~= 'barint,'; callwith(); $.tracker ~= 'ret2,'}
}
#?rakudo skip 'callwith bugs plus issue with calling MMDs with different argument sets'
{
    my $o = BarCallWithEmpty.new;
    $o.clear;
    $o.doit;
    is($o.show, 'bar,foo,ret1,', 'callwith() inheritance test');
    $o.clear;
    is($o.show, '', 'sanity test for clearing');
    {
        $o.doit(5);
        is($o.show, 'barint,foo,ret2,', 'callwith() multimethod/inheritance test');
    }
}

class BarCallWithInt is Foo {
    multi method doit() {$.tracker ~= 'bar,'; callwith(42); $.tracker ~= 'ret1,'}
    multi method doit(Int $num) {$.tracker ~= 'barint,'; callwith(42); $.tracker ~= 'ret2,'}
}
#?rakudo skip 'callwith bugs plus issue with calling MMDs with different argument sets'
{
    my $o = BarCallWithInt.new;
    $o.clear;
    $o.doit;
    is($o.show, 'bar,fooint,ret1,', 'callwith(42) inheritance test');
    $o.clear;
    is($o.show, '', 'sanity test for clearing');
    $o.doit(5);
    is($o.show, 'barint,fooint,ret2,', 'callwith(42) multimethod/inheritance test');
}
