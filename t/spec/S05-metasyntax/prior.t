use v6;

use Test;

=begin pod

This file was derived from the perl5 CPAN module Perl6::Rules,
version 0.3 (12 Apr 2004), file t/prior.t.

It has (hopefully) been, and should continue to be, updated to
be valid perl6.

=end pod

plan 11;

# L<S05/Nothing is illegal/To match whatever the prior successful regex>

# so rule prior matches a constant substring

if !eval('("a" ~~ /a/)') {
  skip_rest "skipped tests - rules support appears to be missing";
  exit;
} 

ok("A" !~~ m/<.prior>/, 'No prior successful match');

ok("A" ~~ m/<[A-Z]>/, 'Successful match');

ok("ABC" ~~ m/<.prior>/, 'Prior successful match');
ok("B" !~~ m/<.prior>/, 'Prior successful non-match');

ok("C" !~~ m/B/,  'Unsuccessful match');

ok("A" ~~ m/<.prior>/, 'Still prior successful match');
ok("A" ~~ m/<.prior>/, 'And still prior successful match');

ok("BA" ~~ m/B <.prior>/, 'Nested prior successful match');
# now the prior match is "BA"
ok("A" !~~ m/B <.prior>/, 'Nested prior successful non-match');
is ~$/, 'BA', 'matched all we wanted';

ok( 'A' !~~ m/<.prior>/, 'prior target updated');

