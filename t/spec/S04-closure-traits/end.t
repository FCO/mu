use v6;
use Test;

plan 3;

eval_lives_ok 'my $x = 3; END { $x * $x }',
              'outer lexicals are visible in END { ... } blocks';

my $a = 0;
#?rakudo 2 todo 'lexicals and eval()'
eval_lives_ok 'my $x = 3; END { $a = $x * $x };',
              'and those from eval as well';

is $a, 9, 'and they really worked';

# vim: ft=perl6
