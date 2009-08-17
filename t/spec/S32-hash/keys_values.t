use v6;

use Test;

plan 16;

=begin pod

#Basic C<keys> and C<values> tests for hashes and pairs, see S32::Containers.

=end pod

my %hash = (a => 1, b => 2, c => 3, d => 4);

# L<S32::Containers/"Hash"/=item keys>
is(~%hash.keys.sort, "a b c d", '%hash.keys works');
is(~sort(keys(%hash)), "a b c d", 'keys(%hash) on hashes');
#?rakudo skip 'cannot parse named arguments'
is(~sort(keys(:array(%hash))), 'a b c d', 'keys(:array(%hash)) works with named args');
is(+%hash.keys, +%hash, 'we have the same number of keys as elements in the hash');

# L<S32::Containers/"Hash"/=item values>
is(~%hash.values.sort, "1 2 3 4", '%hash.values works');
is(~sort(values(%hash)), "1 2 3 4", 'values(%hash) works');
#?rakudo skip 'cannot parse named arguments'
is(~values(:array(%hash)), '1 2 3 4', 'values(:array(%hash)) works with named args');
is(+%hash.values, +%hash, 'we have the same number of keys as elements in the hash');

# keys and values on Pairs
my $pair = (a => 42);
#?rakudo 6 skip '.keys and .values on pairs'
is(~$pair.keys,   "a", '$pair.keys works');
is(~keys($pair),  "a", 'keys($pair) works');
is(+$pair.keys,     1, 'we have one key');

is(~$pair.values,  42, '$pair.values works');
is(~values($pair), 42, 'values($pair) works');
is(+$pair.values,   1, 'we have one value');

# test that .keys and .values work on Any values as well;

{
    my $x;
    lives_ok { $x.values }, 'Can call Any.values';
    lives_ok { $x.keys },   'Can call Any.keys';

}
#vim: ft=perl6
