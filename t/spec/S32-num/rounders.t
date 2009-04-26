use v6;
use Test;
plan 50;

# L<S32::Numeric/Num/"=item round">
# L<S32::Numeric/Num/"=item floor">
# L<S32::Numeric/Num/"=item truncate">
# L<S32::Numeric/Num/"=item ceiling">

=begin pod

Basic tests for the round(), floor(), truncate() and ceiling() built-ins

=end pod

#?rakudo 4 skip 'Rounding NaN should give NaN'

is( floor(NaN), NaN, 'floor(NaN) is NaN');
is( round(NaN), NaN, 'round(NaN) is NaN');
is( ceiling(NaN), NaN,  'ceiling(NaN) is NaN');
is( truncate(NaN), NaN, 'truncate(NaN) is NaN');

#?rakudo 4 skip 'Rounding Inf should give Inf'

is( floor(Inf), Inf, 'floor(Inf) is Inf');
is( round(Inf), Inf, 'round(Inf) is Inf');
is( ceiling(Inf), Inf,  'ceiling(Inf) is Inf');
is( truncate(Inf), Inf, 'truncate(Inf) is Inf');

my %tests =
    ( ceiling => [ [ 1.5, 2 ], [ 2, 2 ], [ 1.4999, 2 ],
         [ -0.1, 0 ], [ -1, -1 ], [ -5.9, -5 ],
         [ -0.5, 0 ], [ -0.499, 0 ], [ -5.499, -5 ] ],
      floor => [ [ 1.5, 1 ], [ 2, 2 ], [ 1.4999, 1 ],
         [ -0.1, -1 ], [ -1, -1 ], [ -5.9, -6 ],
         [ -0.5, -1 ], [ -0.499, -1 ], [ -5.499, -6 ]  ],
      round => [ [ 1.5, 2 ], [ 2, 2 ], [ 1.4999, 1 ],
         [ -0.1, 0 ], [ -1, -1 ], [ -5.9, -6 ],
         [ -0.5, 0 ], [ -0.499, 0 ], [ -5.499, -5 ]  ],
      truncate => [ [ 1.5, 1 ], [ 2, 2 ], [ 1.4999, 1 ],
         [ -0.1, 0 ], [ -1, -1 ], [ -5.9, -5 ],
         [ -0.5, 0 ], [ -0.499, 0 ], [ -5.499, -5 ]  ],
    );

#?pugs emit if $?PUGS_BACKEND ne "BACKEND_PUGS" {
#?pugs emit     skip_rest "PIL2JS and PIL-Run do not support eval() yet.";
#?pugs emit     exit;
#?pugs emit }

for %tests.keys.sort -> $type {
    my @subtests = @(%tests{$type});	# XXX .[] doesn't work yet!
    for @subtests -> $test {
        my $code = "{$type}({$test[0]})";
        my $res = eval($code);

        if ($!) {
            #?pugs todo 'feature'
            flunk("failed to parse $code ($!)");
        } else {
            ok($res == $test[1], "$code == {$test[1]}");
        }
    }
}

#?rakudo skip 'named args'
{
for %tests.keys.sort -> $type {
    my @subtests = @(%tests{$type});    # XXX .[] doesn't work yet!
    for @subtests -> $test {
        my $code = "{$type}(:x({$test[0]}))";
        my $res = eval($code);

        if ($!) {
            #?pugs todo 'feature'
            flunk("failed to parse $code ($!)");
        } else {
            ok($res == $test[1], "$code == {$test[1]}");
        }
    }
    }
}

for %tests.keys.sort -> $t {
    isa_ok eval("{$t}(1.1)"), Int, "rounder $t returns an int";

}

# vim: ft=perl6
