use v6;
use Test;
plan 8;

# L<S12/"Multisubs and Multimethods">
# L<S06/Unpacking array parameters>

multi sub foo ([$a])            { return "one" }
multi sub foo ([$a,$b])         { return "two" }
multi sub foo ([$a,$b,$c])      { return "three" }
multi sub foo (*[$a,$b,$c,$d])  { return "four" }

my @a = (1);
my @b = (1,2);
my @c = (1,2,3);
my @d = (1,2,3,4);

is foo(@a), "one", "multi dispatch on array packed with one element";
is foo(@b), "two", "multi dispatch on array packed with two elements";
is foo(@c), "three", "multi dispatch on array packed with three elements";
is foo(@d), "four", "multi dispatch on array packed with four elements";
is foo(1,2,3,4), "four", "multi dispatch on slurpy packed with four elements";

multi sub bar ([$a,$b?])        { return "$a|$b" }
multi sub bar (*[$a,$b,$c?])     { return "$a+$b+$c" }

is bar(@a), "1|Any()", "multi dispatch on array packed with one required element + no optional";
is bar(@b), "1|2", "multi dispatch on array packed with one required element + one optional";
is bar(1,2,3), "1+2+3", "multi dispatch on slurpy packed with two required element + one optional";
