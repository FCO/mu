use v6;
use Test;

=begin pod

This file was originally derived from the perl5 CPAN module Perl6::Rules,
version 0.3 (12 Apr 2004), file t/context.t.

=end pod

plan 7;

# L<< S05/The C<:p> (or C<:pos>) modifier >>

#?pugs emit force_todo(1..7);

my $str = "abcabcabc";
ok($str ~~ m:p/abc/, 'Continued match');

ok($/.to == 3, 'Continued match pos');

$str = "abcabcabc";
my $x = $str ~~ m:i:p/abc/;
# XXX shouldn't that be 6? I don't see why it should start over again...
ok($/.to == 3, 'Insensitive continued match pos');

$x = $str ~~ m:i:p/abc/;
ok($/.to == 6, 'Insensitive recontinued match pos');

$str = "abcabcabc";
my @x = $str ~~ m:i:g:p/abc/;
is("@x", "abc abc abc", 'Insensitive repeated continued match');
ok($/.to == 9, 'Insensitive repeated continued match pos');

$str = "abcabcabc";
@x = ?($str ~~ m:p:i:g/abc/);
ok($/.to == 3, 'Insensitive scalar repeated continued match pos');

# vim: ft=perl6
