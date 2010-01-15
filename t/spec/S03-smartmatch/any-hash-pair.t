use v6;
use Test;
plan *;

#L<S03/Smart matching/Hash Pair test hash mapping>
{
    my %a = (a => 1, b => 'foo', c => Mu);
    ok  (%a ~~ b => 'foo'),         '%hash ~~ Pair (Str, +)';
    ok !(%a ~~ b => 'ugh'),         '%hash ~~ Pair (Str, -)';
    ok  (%a ~~ a => 1.0),           '%hash ~~ Pair (Num, +)';
    ok  (%a ~~ :b<foo>),            '%hash ~~ Colonpair';
    ok  (%a ~~ c => *.notdef),         '%hash ~~ Pair (.notdef, Mu)';
    ok  (%a ~~ d => *.notdef),         '%hash ~~ Pair (.notdef, Nil)';
    ok !(%a ~~ a => 'foo'),         '%hash ~~ Pair (key and val not paired)';
}

done_testing;

# vim: ft=perl6
