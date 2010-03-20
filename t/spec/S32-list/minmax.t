use v6;

use Test;

plan 38;

# L<S32::Containers/List/=item min>
# L<S32::Containers/List/=item max>

=begin description

As per S32, the sub form requires a comparison function. The form without
comparison function is spelled [min]

=end description

my @array = (5,-3,7,0,1,-9); #NOTICE! The <> don't work like they should, rakudo devels! That's why we use this :/ --lue

# Tests for C<min>:
is @array.min,  -9, "basic method form of min works";
#?rakudo todo "Not sure why this is failing"
dies_ok {min(@array)}, 'min() requires comparison function';
#?rakudo skip 'named args'
is min({$^a <=> $^b }, :values(@array)), -9, "basic subroutine form of min works with named args";

is (@array.min: { $^a <=> $^b }), -9,
  "method form of min with identity comparison block works";

is min({ $^a <=> $^b }, @array), -9,
  "subroutine form of min with identity comparison block works";

is (@array.min: { abs $^a <=> abs $^b }), 0,
  "method form of min taking a comparision block works";
is min({ abs $^a <=> abs $^b }, @array), 0,
  "subroutine form of min taking a comparision block works";

#?rakudo 2 skip "Range.min not fully implemented yet"
is ((-10..10).min: { abs $^a <=> abs $^b }), 0,
  "method form of min on Ranges taking a comparision block works";

is ((1..10).min: { ($_-3) * ($_-5) }), 4,
  "method form of min taking an arity-1 comparison block works";

# Tests for C<max>:
is (@array.max),  7, "basic method form of max works";
is max({ $^a <=> $^b }, @array), 7, "basic subroutine form of max works";
#?rakudo skip 'named args'
is max(:values(@array)), 7, "basic subroutine form of max works with named args";

is (@array.max: { $^a <=> $^b }), 7,
  "method form of max with identity comparison block works";

#?rakudo skip "Range.max not fully implemented yet"
is ((-10..9).max: { abs $^a <=> abs $^b }), -10,
  "method form of max on Ranges taking a comparision block works";

is max({ $^a <=> $^b }, @array), 7,
  "subroutine form of max with identity comparison block works";

is (@array.max: { abs $^a <=> abs $^b }), -9,
  "method form of max taking a comparision block works";
is max({ abs $^a <=> abs $^b }, @array), -9,
  "subroutine form of max taking a comparision block works";

#?rakudo skip "Range.max not fully implemented yet"
is ((1..10).max: { ($_-3) * ($_-5) }), 10,
  "method form of max taking an arity-1 comparison block works";

# Error cases:
#?pugs 2 todo 'bug'
is 42.min, 42, ".min should work on scalars";
is 42.max, 42, ".max should work on scalars";
is (42,).min, 42, ".min should work on one-elem arrays";
is (42,).max, 42, ".max should work on one-elem arrays";

# Tests with literals:
is (1,2,3).max, 3, "method form of max with literals works";
is (1,2,3).min, 1, "method form of min with literals works";
is max({$^a <=> $^b}, 1,2,3),  3, "subroutine form of max with literals works";
is min({$^a <=> $^b}, 1,2,3),  1, "subroutine form of min with literals works";

# Try to read numbers from a file
@array = lines("t/spec/S32-list/numbers.data");
is @array.max, 5, "max of strings read from a file works";
is @array.min, -1, "min of strings read from a file works";

# Same, but numifying the numbers first
@array = map { +$_ }, @array;
is @array.max, 28, "max of strings read from a file works";
is @array.min, -80, "min of strings read from a file works";

is (1, Inf).max, Inf,"Inf is greater than 1";
is (-1, -Inf).min, -Inf,"-Inf is less than -1";
is (-Inf, Inf).min, -Inf,"-Inf is less than Inf";
is (-Inf, Inf).max, Inf,"Inf is greater than -Inf";

#############
#SIN FOUND!
#############
#The four below do not work in ANY implementation so far (the `right one' depends on your way of ordering the values 0, NaN, and Inf from least to greatest) The number of tests has been minused 4, from 46 to 42, for the time being.
#None of the three implementations (pugs, rakudo/alpha, rakudo/master) return what's set below. A trip to the Spec is the only solution, but I haven't enough time.
#for details, see http://irclog.perlgeek.de/perl6/2010-02-23#i_2022557
#sin found 22 Feb. 2010, 21:55 PST
#--lue
#############
#is (0, NaN).min, NaN,    "min(0,NaN)=NaN";
#is (Inf, NaN).min, NaN,    "max(Inf,NaN)=NaN";
#
#is (0, NaN).max, NaN,    "max(0,NaN)=NaN";
#is (Inf, NaN).max, NaN,    "max(Inf,NaN)=NaN";

is ([min] (5,10,-15,20)), -15, 'reduce min int';
is ([max] (5,10,-15,20)), 20, 'reduce max int';

is ([min] (5.1,10.3,-15.7,20.9)), -15.7, 'reduce min numeric';
is ([max] (5.4,10.7,-15.2,20.8)), 20.8, 'reduce max numeric';

# vim: ft=perl6
