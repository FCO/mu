use v6;
use Test;
plan 6;

# TODO: move this test to closure-parameters.t if it works in the future

# L<S06/Closure parameters>

our $collector = 2;
sub to_be_called($x) {
    $collector += $x;
}

sub tester(&my_sub) {
    my_sub(4);
}

tester(&to_be_called);
ok $collector == 6, 'Can call my_sub() if &my_sub was a parameter';

tester(sub ($x) { $collector = 3 * $x });
ok $collector == 12, 'same with anonymous sub';

sub tester2(&my_sub) { 1 }
dies_ok {tester2(42)}, "can't pass thing that doesn't do Callable";

sub not_returns_a_sub { 3 };
dies_ok {tester2(not_returns_a_sub)}, 
        "can't pass thing that doesn't do Callable";

is tester2({ 'block' }), 1, 'Can pass a block to a &parameter';

# RT #68578
{
    sub rt68578( Callable &x ) {}
    dies_ok { rt68578({ 'block' }) },
            "Can't pass something that isn't typed as returning Callable";
}

# vim: ft=perl6
