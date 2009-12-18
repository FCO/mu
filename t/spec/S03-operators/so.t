use v6;
use Test;
plan 11;

# L<S03/Loose unary precedence>

ok(so 1,     "so 1 is true");
ok(so -1,    "so -1 is true");
ok(not so 0,  "not so 0 is true");
ok(so sub{}, 'so sub{} is true');
ok(so "x",   'so "x" is true');

my $a = 1; ok(so $a,    'so $true_var is true');
my $b = 0; ok(!(so $b), 'so $false_var is not true');

ok( so(so 42), "so(so 42) is true");
ok(not so(so 0), "so(so 0) is false");

ok(so Bool::True, "'Bool::True' is true");
ok(so True, "'True' is true");

# vim: ft=perl6
