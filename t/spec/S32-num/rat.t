use v6;

use Test;

plan *;

# Basic test functions specific to rational numbers.

# Test ways of making Rats
isa_ok(Rat.new(1,4), Rat, "Rat.new makes a Rat");
isa_ok(1 / 4, Rat, "/ makes a Rat");
isa_ok( 1.Int.Rat, Rat, "cast of Int makes a Rat");
#?rakudo skip 'Num.Rat not implemented yet in Rakudo-ng'
isa_ok( 1.Num.Rat, Rat, "cast of Num makes a Rat");

isa_ok( Rat.new, Rat, 'Rat.new is Rat' );
#?rakudo skip 'RT 69726, maybe related to RT 68958'
isa_ok( eval(Rat.new.perl), Rat, 'eval Rat.new.perl is Rat' );
isa_ok( eval(Rat.new(1, 3).perl), Rat, 'eval Rat.new(1, 3).perl is Rat' );
is( (eval Rat.new(1, 3).perl).nude, (1, 3), 'eval Rat.new(1, 3).perl is 1/3' );
isa_ok( eval((1/3).perl), Rat, 'eval (1/3).perl is Rat' );
is( (eval (1/3).perl).nude, (1, 3), 'eval (1/3).perl is 1/3' );

# Test ~
is(~(Rat.new(1,4)), ~(0.25e0), "Rats stringify properly");
is(~(Rat.new(-1,2)), ~(-0.5e0), "Rats stringify properly");
is(~(Rat.new(7,4)), ~(1.75e0), "Rats stringify properly");
is(~(Rat.new(7,-1)), ~(-7), "Rats stringify properly");

# Test new
is(Rat.new(1, -7).nude, (-1, 7), "Negative signs move to numerator");
is(Rat.new(-32, -33).nude, (32, 33), "Double negatives cancel out");
is(Rat.new(2, 4).nude, (1, 2), "Reduce to simplest form in constructor");
is(Rat.new(39, 33).nude, (13, 11), "Reduce to simplest form in constructor");
is(Rat.new(0, 33).nude, (0, 1), "Reduce to simplest form in constructor");
is(Rat.new(1451234131, 60).nude, (1451234131, 60), "Reduce huge number to simplest form in constructor");
is(Rat.new(1141234123, 0).nude, (1, 0), "Huge over zero becomes one over zero");
is(Rat.new(-7, 0).nude, (-1, 0), "Negative over zero becomes negative one over zero");
dies_ok( { Rat.new(0, 0) }, "Zero over zero is not a legal Rat");

# Test basic math
is(1 / 4 + 1 / 4, 1/2, "1/4 + 1/4 = 1/2");
isa_ok(1 / 4 + 1 / 4, Rat, "1/4 + 1/4 is a Rat");
is(1 / 4 + 2 / 7, 15/28, "1/4 + 2/7 = 15/28");
is(1 / 4 + 1, 5/4, "1/4 + 1 = 5/4");
isa_ok(1 / 4 + 1, Rat, "1/4 + 1 is a Rat");
is(1 + 1 / 4, 5/4, "1 + 1/4 = 5/4");
isa_ok(1 + 1 / 4, Rat, "1 + 1/4 is a Rat");

is(1 / 4 - 1 / 4, 0/1, "1/4 - 1/4 = 0/1");
is(1 / 4 - 3 / 4, -1/2, "1/4 - 3/4 = -1/2");
is((1 / 4 - 3 / 4).nude, (-1, 2), "1/4 - 3/4 = -1/2 is simplified internally");
isa_ok((1 / 4 - 3 / 4), Rat, "1/4 - 3/4 is a Rat");
is(1 / 4 - 1, -3/4, "1/4 - 1 = -3/4");
isa_ok(1 / 4 - 1, Rat, "1/4 - 1 is a Rat");
is(1 - 1 / 4, 3/4, "1 - 1/4 = 3/4");
isa_ok(1 - 1 / 4, Rat, "1 - 1/4 is a Rat");

is((2 / 3) * (5 / 4), 5/6, "2/3 * 5/4 = 5/6");
is(((2 / 3) * (5 / 4)).nude, (5, 6), "2/3 * 5/4 = 5/6 is simplified internally");
isa_ok((2 / 3) * (5 / 4), Rat, "2/3 * 5/4 is a Rat");
is((2 / 3) * 2, 4/3, "2/3 * 2 = 4/3");
isa_ok((2 / 3) * 2, Rat, "2/3 * 2 is a Rat");
is(((2 / 3) * 3).nude, (2, 1), "2/3 * 3 = 2 is simplified internally");
is(2 * (2 / 3), 4/3, "2 * 2/3 = 4/3");
isa_ok(2 * (2 / 3), Rat, "2 * 2/3 is a Rat");
is((3 * (2 / 3)).nude, (2, 1), "3 * 2/3 = 2 is simplified internally");

is((2 / 3) / (5 / 4), 8/15, "2/3 / 5/4 = 8/15");
isa_ok((2 / 3) / (5 / 4), Rat, "2/3 / 5/4 is a Rat");
is((2 / 3) / 2, 1/3, "2/3 / 2 = 1/3");
is(((2 / 3) / 2).nude, (1, 3), "2/3 / 2 = 1/3 is simplified internally");
isa_ok((2 / 3) / 2, Rat, "2/3 / 2 is a Rat");
is(2 / (1 / 3), 6, "2 / 1/3 = 6");
isa_ok(2 / (1 / 3), Rat, "2 / 1/3 is a Rat");
is((2 / (2 / 3)).nude, (3, 1), "2 / 2/3 = 3 is simplified internally");

{
    # use numbers that can be exactly represented as floating points
    # so there's no need to use is_approx 

    my $a = 1/2;
    is ++$a, 3/2, 'prefix:<++> on Rats';
    is $a++, 3/2, 'postfix:<++> on Rats (1)';
    is $a,   5/2, 'postfix:<++> on Rats (2)';
    $a = -15/8;
    is ++$a, -7/8, 'prefix:<++> on negative Rat';

    my $b = 5/2;
    is --$b, 3/2, 'prefix:<--> on Rats';
    is $b--, 3/2, 'postfix:<--> on Rats (1)';
    is $b,   1/2, 'postfix:<--> on Rats (2)';
    $b = -15/8;
    is --$b, -23/8, 'prefix:<--> on negative Rat';
}

# Give the arithmetical operators a workout

for (1/2, 2/3, -1/4, 4/5, 2/7, 65/8) -> $a {
    for (-7, -1, 0, 1, 2, 5, 7, 42) -> $b {
        is_approx($a + $b, $a.Num + $b.Num, "Rat + Int works ($a, $b)");
        is_approx($b + $a, $b.Num + $a.Num, "Int + Rat works ($a, $b)");
        is_approx($a - $b, $a.Num - $b.Num, "Rat - Int works ($a, $b)");
        is_approx($b - $a, $b.Num - $a.Num, "Int - Rat works ($a, $b)");
        is_approx($a * $b, $a.Num * $b.Num, "Rat * Int works ($a, $b)");
        is_approx($b * $a, $b.Num * $a.Num, "Int * Rat works ($a, $b)");
        is_approx($a / $b, $a.Num / $b.Num, "Rat / Int works ($a, $b)") if $b != 0;
        is_approx($b / $a, $b.Num / $a.Num, "Int / Rat works ($a, $b)");
    }

    for (1/2, 2/3, -1/4, 4/5, 2/7, 65/8) -> $b {
        is_approx($a + $b, $a.Num + $b.Num, "Rat + Rat works ($a, $b)");
        is_approx($b + $a, $b.Num + $a.Num, "Rat + Rat works ($a, $b)");
        is_approx($a - $b, $a.Num - $b.Num, "Rat - Rat works ($a, $b)");
        is_approx($b - $a, $b.Num - $a.Num, "Rat - Rat works ($a, $b)");
        is_approx($a * $b, $a.Num * $b.Num, "Rat * Rat works ($a, $b)");
        is_approx($b * $a, $b.Num * $a.Num, "Rat * Rat works ($a, $b)");
        is_approx($a / $b, $a.Num / $b.Num, "Rat / Rat works ($a, $b)");
        is_approx($b / $a, $b.Num / $a.Num, "Rat / Rat works ($a, $b)");
    }

    my $neg = -$a;
    isa_ok($neg, Rat, "prefix<-> generates a Rat on $a");
    is_approx($neg, -($a.Num), "prefix<-> generates the correct number for $a");
}

# used to be a (never ticketed) Rakudo bug: sin(Rat) died
# (note that trig on Rats is tested extensively in S32-trig)

#?rakudo skip 'sin NYI in Rakudo-ng'
is_approx sin(5.0e0), sin(10/2), 'sin(Rat) works';

# SHOULD: Add divide by zero / zero denominator tests
# Added three constructor tests above.  Unsure about the
# wisdom of allowing math with zero denominator Rats,
# so I'm holding off on writing tests for it.

# SHOULD: Add NaN / Inf tests

# Quick test of some basic mixed type math

is_approx (1 / 2) + 3.5e0, 4.0, "1/2 + 3.5 = 4.0";
is_approx 3.5e0 + (1 / 2), 4.0, "3.5 + 1/2 = 4.0";
is_approx (1 / 2) - 3.5e0, -3.0, "1/2 - 3.5 = -3.0";
is_approx 3.5e0 - (1 / 2), 3.0, "3.5 - 1/2 = 3.0";
is_approx (1 / 3) * 6.6e0, 2.2, "1/3 * 6.6 = 2.2";
is_approx 6.6e0 * (1 / 3), 2.2, "6.6 * 1/3 = 2.2";
is_approx (1 / 3) / 2.0e0, 1 / 6, "1/3 / 2.0 = 1/6";
is_approx 2.0e0 / (1 / 3), 6.0, "2.0 / 1/3 = 6.0";

is_approx (1 / 2) + 3.5e0 + 1i, 4.0 + 1i, "1/2 + 3.5 + 1i = 4.0 + 1i";
is_approx (3.5e0 + 1i) + (1 / 2), 4.0 + 1i, "(3.5 + 1i) + 1/2 = 4.0 + 1i";
is_approx (1 / 2) - (3.5e0 + 1i), -3.0 - 1i, "1/2 - (3.5 + 1i) = -3.0 - 1i";
is_approx (3.5e0 + 1i) - (1 / 2), 3.0 + 1i, "(3.5 + 1i) - 1/2 = 3.0 + 1i";
is_approx (1 / 3) * (6.6e0 + 1i), 2.2 + (1i/3), "1/3 * (6.6 + 1i) = 2.2 + (1/3)i";
is_approx (6.6e0 + 1i) * (1 / 3), 2.2 + (1i/3), "(6.6 + 1i) * 1/3 = 2.2 + (1/3)i";
is_approx (1 / 3) / 2.0i, 1 / (6.0i), "1/3 / 2.0i = 1/(6i)";
is_approx 2.0i / (1 / 3), 6.0i, "2.0i / 1/3 = 6.0i";

# Cast from Num uses an epsilon value.
#?rakudo 3 skip 'Num.Rat NYI in Rakudo-ng'
is( exp(1).Rat, Rat.new(2721, 1001), "Num to Rat with default epsilon");
is( exp(1).Rat(1e-4), Rat.new(193, 71), "Num to Rat with epsilon 1e-4");
is( exp(1).Rat(Rat.new(1,1e4.Int)), Rat.new(193, 71),
    "Num to Rat with epsilon of Rat");

is (5/4).Int,       1, 'Rat.Int';
#?rakudo skip '[4/3] NYI in Rakudo-ng'
is <a b c>.[4/3],  'b', 'Indexing an array with a Rat (RT 69738)';

is_approx 424/61731 + 832/61731, 424.Num / 61731.Num + 832.Num / 61731.Num, "424/61731 + 832/61731 works";
is_approx 424/61731 - 832/61731, 424.Num / 61731.Num - 832.Num / 61731.Num, "424/61731 - 832/61731 works";
is_approx 424/61731 + 833/123462, 424.Num / 61731.Num + 833.Num / 123462.Num, "424/61731 + 833/123462 works";
is_approx 424/61731 - 833/123462, 424.Num / 61731.Num - 833.Num / 123462.Num, "424/61731 - 833/123462 works";

isa_ok 424/61731 + 832/61731, Rat, "424/61731 + 832/61731 is a Rat";
isa_ok 424/61731 - 832/61731, Rat, "424/61731 - 832/61731 is a Rat";
isa_ok 424/61731 + 833/123462, Rat, "424/61731 + 833/123462 is a Rat";
isa_ok 424/61731 - 833/123462, Rat, "424/61731 - 833/123462 is a Rat";

is_approx 61731 + 832/61731, 61731.Num + 832.Num / 61731.Num, "61731 + 832/61731 works";
is_approx 832/61731 + 61731, 61731.Num + 832.Num / 61731.Num, "832/61731 + 61731 works";
is_approx 61731 - 832/61731, 61731.Num - 832.Num / 61731.Num, "61731 - 832/61731 works";
is_approx 832/61731 - 61731, 832.Num / 61731.Num - 61731.Num, "832/61731 - 61731 works";

is_approx 424/61731 + 832/61733, 424.Num / 61731.Num + 832.Num / 61733.Num, "424/61731 + 832/61733 works";
is_approx 424/61731 - 832/61733, 424.Num / 61731.Num - 832.Num / 61733.Num, "424/61731 - 832/61733 works";

is_approx (424/61731) * (832/61731), (424.Num / 61731.Num) * (832.Num / 61731.Num), "424/61731 * 832/61731 works";
is_approx (424/61731) / (61731/832), (424.Num / 61731.Num) / (61731.Num / 832.Num), "424/61731 / 61731/832 works";

is_approx 61731 * (61731/832), 61731.Num * (61731.Num / 832.Num), "61731 * 61731/832 works";
is_approx (61731/832) * 61731, 61731.Num * (61731.Num / 832.Num), "61731/832 * 61731 works";
is_approx (832/61731) / 61731, (832.Num / 61731.Num) / 61731.Num, "832/61731 / 61731 works";
is_approx 61731 / (832/61731), 61731.Num / (832.Num / 61731.Num), "61731 / 832/61731 works";

is_approx (424/61731) * (61731/61733), (424.Num / 61731.Num) * (61731.Num / 61733.Num), "424/61731 * 61731/61733 works";
#?rakudo todo 'Getting a Num when a Rat would be better'
isa_ok (424/61731) * (61731/61733), Rat, "424/61731 * 61731/61733 is a Rat";
is_approx (424/61731) / (61733/61731), (424.Num / 61731.Num) / (61733.Num / 61731.Num), "424/61731 / 61733/61731 works";
#?rakudo todo 'Getting a Num when a Rat would be better'
isa_ok (424/61731) / (61733/61731), Rat, "424/61731 / 61733/61731 is a Rat";

ok (1/2) == (1/2).Rat, 'Rat.Rat works';
isa_ok (1/2).Rat, Rat, '... and actually returns a Rat';

#?rakudo todo '=== on Rats'
ok 1/2 === 1/2, 'Rats are value types, so 1/2 === 1/2';
#?rakudo skip '!==='
ok 1/2 !=== 1/3, '=== with false outcome';

done_testing;

# vim: ft=perl6
