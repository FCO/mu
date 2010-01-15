use v6;
use Test;
plan *;

#L<S03/Smart matching/hash value slice truth>

{
    my %h = (a => 0, b => 0, c => 1, d => 2);
    sub notautoquoted_a { 'a' };
    sub notautoquoted_c { 'c' };

    ok  (%h ~~ .{'c'}),     '%hash ~~ .{true"}';
    ok !(%h ~~ .{'b'}),     '%hash ~~ .{false"}';
    ok  (%h ~~ .{<c d>}),   '%hash ~~ .{<true values>}';
    ok !(%h ~~ .{<c d a>}), '%hash ~~ .{<not all true>}';
    ok !(%h ~~ .{notautoquoted_a}), '~~. {notautoquoted_a}';
    ok  (%h ~~ .{notautoquoted_c}), '~~. {notautoquoted_c}';
    ok  (%h ~~ .<c>),     '%hash ~~ .<true"}';
    ok !(%h ~~ .<b>),     '%hash ~~ .<false"}';
    ok  (%h ~~ .<c d>),   '%hash ~~ .<true values>';
    ok !(%h ~~ .<c d a>), '%hash ~~ .<not all true>';
    ok !(%h ~~ .<c d f>), '%hash ~~ .<not all exist>';
}

done_testing;

# vim: ft=perl6
