use v6;

use Test;

plan 48;

# L<S06/Required parameters/method:>
sub a_zero  ()           { };
sub a_one   ($a)         { };
sub a_two   ($a, $b)     { };
sub a_three ($a, $b, @c) { };
sub a_four  ($a, $b, @c, %d) { };

sub o_zero  ($x?, $y?)   { };
sub o_one   ($x, :$y)    { };
sub o_two   ($x, :$y!, :$z) { };

is &a_zero.arity,   0, '0 arity &sub';
is &a_one.arity,    1, '1 arity &sub';
is &a_two.arity,    2, '2 arity &sub';
is &a_three.arity,  3, '3 arity &sub';
is &a_four.arity,   4, '4 arity &foo';

is &a_zero.count,   0, '0 count &sub';
is &a_one.count,    1, '1 count &sub';
is &a_two.count,    2, '2 count &sub';
is &a_three.count,  3, '3 count &sub';
is &a_four.count,   4, '4 count &foo';

is &o_zero.arity,   0, 'arity 0 sub with optional params';
is &o_one.arity,    1, 'arity 1 sub with optional params';
is &o_two.arity,    2, 'arity with optional and required named params';

is &o_zero.count,   2, 'count on sub with optional params';
#?rakudo 2 todo 'bug'
is &o_one.count,    2, 'count on sub with optional params';
is &o_two.count,    3, 'count on sub with optional and required named params';

{
    sub b_zero  ()           { };
    sub b_one   ($)          { };
    sub b_two   ($, $)       { };
    sub b_three ($, $, @)    { };
    sub b_four  ($, $, @, %) { };
    is &b_zero.arity,   0, '0 arity &sub (sigils only)';
    is &b_one.arity,    1, '1 arity &sub (sigils only)';
    is &b_two.arity,    2, '2 arity &sub (sigils only)';
    is &b_three.arity,  3, '3 arity &sub (sigils only)';
    is &b_four.arity,   4, '4 arity &foo (sigils only)';

}

# It's not really specced in what way (*@slurpy_params) should influence
# .arity. Also it's unclear what the result of &multisub.arity is.
# See the thread "&multisub.arity?" on p6l started by Ingo Blechschmidt for
# details:
# L<http://thread.gmane.org/gmane.comp.lang.perl.perl6.language/4915>

{
    is ({ $^a         }.arity), 1,
        "block with one placeholder var has .arity == 1";
    is (-> $a { $a         }.arity), 1,
        "pointy block with one placeholder var has .arity == 1";
    is { $^a,$^b     }.arity, 2,
        "block with two placeholder vars has .arity == 2";
    is (-> $a, $b { $a,$b     }).arity, 2,
        "pointy block with two placeholder vars has .arity == 2";
    is { $^a,$^b,$^c }.arity, 3,
        "block with three placeholder vars has .arity == 3";
    is (-> $a, $b, $c { $a,$b,$c }).arity, 3,
        "pointy block with three placeholder vars has .arity == 3";

    is ({ $^a         }.count), 1,
        "block with one placeholder var has .count == 1";
    is (-> $a { $a         }.count), 1,
        "pointy block with one placeholder var has .count == 1";
    is { $^a,$^b     }.count, 2,
        "block with two placeholder vars has .count == 2";
    is (-> $a, $b { $a,$b     }).count, 2,
        "pointy block with two placeholder vars has .count == 2";
    is { $^a,$^b,$^c }.count, 3,
        "block with three placeholder vars has .count == 3";
    is (-> $a, $b, $c { $a,$b,$c }).count, 3,
        "pointy block with three placeholder vars has .count == 3";
}

{
    is { my $k; $^a         }.arity, 1,
        "additional my() vars don't influence .arity calculation (1-1)";
    is { my $k; $^a,$^b     }.arity, 2,
        "additional my() vars don't influence .arity calculation (1-2)";
    is { my $k; $^a,$^b,$^c }.arity, 3,
        "additional my() vars don't influence .arity calculation (1-3)";

    is { my $k; $^a         }.count, 1,
        "additional my() vars don't influence .count calculation (1-1)";
    is { my $k; $^a,$^b     }.count, 2,
        "additional my() vars don't influence .count calculation (1-2)";
    is { my $k; $^a,$^b,$^c }.count, 3,
        "additional my() vars don't influence .count calculation (1-3)";
}

{
    is { $^a;         my $k }.arity, 1,
        "additional my() vars don't influence .arity calculation (2-1)";
    is { $^a,$^b;     my $k }.arity, 2,
        "additional my() vars don't influence .arity calculation (2-2)";
    is { $^a,$^b,$^c; my $k }.arity, 3,
        "additional my() vars don't influence .arity calculation (2-3)";

    is { $^a;         my $k }.count, 1,
        "additional my() vars don't influence .count calculation (2-1)";
    is { $^a,$^b;     my $k }.count, 2,
        "additional my() vars don't influence .count calculation (2-2)";
    is { $^a,$^b,$^c; my $k }.count, 3,
        "additional my() vars don't influence .count calculation (2-3)";
}

# used to be a bug in Rakudo, RT #63744
{
    sub indirect-count(Code $c) { +$c.signature.params; }
    my $tester = -> $a, $b, $c? { ... };
    is +$tester.signature.params, 3, '+$obj.signature.params work';
    is +$tester.signature.params, indirect-count($tester),
       '... also when passed to a sub first';
}

#?rakudo todo 'bug #66868: Zero-arg sub interpreted as parameterless'
dies_ok { a_zero( 'hello', 'world' ) }, 'no matching sub signature';

# vim: ft=perl6
