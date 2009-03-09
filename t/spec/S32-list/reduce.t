use v6;

use Test;

=begin description

This test tests the C<reduce> builtin.

Reference:
L<"http://groups.google.com/groups?selm=420DB295.3000902%40conway.org">

=end description

plan 14;

# L<S29/List/=item reduce>

{
  my @array = <5 -3 7 0 1 -9>;
  my $sum   = 5 + -3 + 7 + 0 + 1 + -9; # laziness :)


  is((reduce { $^a + $^b }, 0, @array), $sum, "basic reduce works (1)");
#?rakudo skip 'named args'
  is((reduce { $^a + $^b }, 0, :values(@array)), $sum, "basic reduce works (2)");
#?rakudo skip 'closure as non-final argument'
  is((reduce { $^a + $^b }: 100, @array), 100 + $sum, "basic reduce works (3)");
#?rakudo skip 'method fallback to sub unimpl'
  is(({ $^a * $^b }.reduce: 1,2,3,4,5), 120, "basic reduce works (4)");
}

# Reduce with n-ary functions
{
  my @array  = <1 2 3 4 5 6 7 8>, undef;
  my $result = (((1 + 2 * 3) + 4 * 5) + 6 * 7) + 8 * undef;

  is (@array.reduce: { $^a + $^b * $^c }), $result, "n-ary reduce() works";
}


{
#?pugs 2 todo 'bug'
  is( 42.reduce( {$^a+$^b} ), 42,  "method form of reduce works on numbers");
  is( 'str'.reduce( {$^a+$^b} ), 'str', "method form of reduce works on strings");
  is ((42,).reduce: { $^a + $^b }), 42,      "method form of reduce should work on arrays";
}

{
  my $hash = {a => {b => {c => 42}}};
  my @reftypes;
  sub foo (Hash $hash, Str $key) {
    push @reftypes, $hash.WHAT;
    $hash.{$key};
  }
  is((reduce(&foo, $hash, <a b c>)), 42, 'reduce(&foo) (foo ~~ .{}) works three levels deep');
  is(@reftypes[0], "Hash", "first application of reduced hash subscript passed in a Hash");
  is(@reftypes[1], "Hash", "second application of reduced hash subscript passed in a Hash");
  is(@reftypes[2], "Hash", "third application of reduced hash subscript passed in a Hash");
}

#?rakudo todo 'Reduce of one element list. See #61610'
is( list(1).reduce({$^a * $^b}), 0, "Reduce of one element list produces correct result");

#?rakudo todo 'Reduce should use .count not .arity'
eval_lives_ok( 'reduce -> $a, $b, $c? { $a + $b * ($c//1) }, 1, 2', 'Use proper arity calculation');
