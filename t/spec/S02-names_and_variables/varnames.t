use v6;

use Test;

plan 6;

# L<S02/Names and Variables/special variables of Perl 5 are going away>

eval_dies_ok 'my $!', '$! can not be declared again';
eval_dies_ok 'my $/', 'nor can $/';

#?rakudo 2 todo 'proto on variable declarations'
eval_lives_ok 'my proto $!', '$! can be declared again if proto is used though';
eval_lives_ok 'my proto $/', 'as can $/';

eval_dies_ok 'my $f!ao = "beh";', "normal varnames can't have ! in their name";
eval_dies_ok 'my $fo:o::b:ar = "bla"', "var names can't have colons in their names either";


# vim: ft=perl6
