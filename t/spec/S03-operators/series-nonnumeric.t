use v6;
use Test;

plan *;

# L<S03/List infix precedence/'C<.succ> is assumed'>

#?rakudo skip 'loops'
{
    class Alternating {
        has Int $.val;
        method Str { 'A' ~ $.val }
        method succ { Alternating.new(val => -($.val + 1)) }
        method pred { Alternating.new(val => -($.val - 1)) }
    }
    our multi infix:<cmp> (Alternating $x, Alternating $y) { abs($x.val) cmp abs($y.val) }
    our multi infix:<cmp> (Alternating $x, Int $n)         { abs($x.val) cmp abs($n) }
    our multi infix:<eqv> (Alternating $x, Alternating $y) { abs($x.val) eqv abs($y.val) }
    our multi infix:<eqv> (Alternating $x, Int $n)         { abs($x.val) eqv abs($n) }
    my $f = { Alternating.new(val => $^v) };

    is ($f(0) ... $f(4)).join(' '), 'A0 A-1 A2 A-3 A4', 'finite increasing series with user class (1)';
    is ($f(0) ... 4).join(' '), 'A0 A-1 A2 A-3 A4', 'finite increasing series with user class (2)';
    is ($f(-9) ... 4).join(' '), 'A-9 A8 A-7 A6 A-5 A4', 'finite decreasing series with user class';
    is ($f(-9) ...^ 4).join(' '), 'A-9 A8 A-7 A6 A-5', 'finite decreasing exclusive series with user class (1)';
    is ($f(-9) ...^ -4).join(' '), 'A-9 A8 A-7 A6 A-5 A4', 'finite decreasing exclusive series with user class (2)';
    is ($f(2), { $_.succ.succ } ... 10).join(' '), 'A2 A4 A6 A8 A10', 'finite series with closure and user class (1)';
    is ($f(2), { $_.succ.succ } ... 9).join(' '), 'A2 A4 A6 A8', 'finite series with closure and user class (2)';
    is ($f(1), { $_.succ.succ } ... { $_.v**2 < 100 }).join(' '), 'A1 A3 A5 A7 A9', 'finite series with closure, termination function, and user class';
    is ($f(2) ... *)[^5].join(' '), 'A2 A-3 A4 A-5 A6', 'infinite increasing series with user class';
    is ($f(2), $f(1) ... *)[^5].join(' '), 'A2 A1 A0 A1 A-2', 'infinite decreasing series with user class';
    is ($f(0), $f(0) ... *)[^5].join(' '), 'A0 A0 A0 A0 A0', 'constant series with user class';
}

# L<S03/List infix precedence/that happen to represent single codepoints>
# character series

is ('a'  ... 'g').join(', '), 'a, b, c, d, e, f, g', 'finite series started with one letter';
is ('a'  ... *).[^7].join(', '), 'a, b, c, d, e, f, g', 'series started with one letter';
is ('a', 'b' ... *).[^10].join(', '), 'a, b, c, d, e, f, g, h, i, j', 'series started with two different letters';
is (<a b c> ... *).[^10].join(', '), "a, b, c, d, e, f, g, h, i, j", "character series started from array";
is ('z' ... 'a').[^10].join(', '), 'z, y, x, w, v, u, t, s, r, q', 'descending series started with one letter';
is (<z y> ... 'a').[^10].join(', '), 'z, y, x, w, v, u, t, s, r, q', 'descending series started with two different letters';
is (<z y m> ... 'a').[^10].join(', '), 'z, y, m, l, k, j, i, h, g, f', 'descending series started with three different letters';
is (<a b>, { .succ } ... *).[^7].join(', '), 'a, b, c, d, e, f, g', 'characters xand arity-1';
is ('x' ... 'z').join(', '), 'x, y, z', "series ending with 'z' don't cross to two-letter strings";
is ('A' ... 'z').elems, 'z'.ord - 'A'.ord + 1, "series from 'A' to 'z' is finite and of correct length";
is ('α' ... 'ω').elems, 'ω'.ord - 'α'.ord + 1, "series from 'α' to 'ω' is finite and of correct length";
#?rakudo 2 skip 'Unicode stuff'
is ('☀' ... '☕').join(''), '☀☁☂☃☄★☆☇☈☉☊☋☌☍☎☏☐☑☒☓☔☕', "series from '☀' to '☕'";
is ('☀' ...^ '☕').join(''), '☀☁☂☃☄★☆☇☈☉☊☋☌☍☎☏☐☑☒☓☔', "exclusive series from '☀' to '☕'";

# # L<S03/List infix precedence/doesn't terminate with a simple>
# the tricky termination test

ok ('A' ... 'ZZ').munch(1000).elems < 1000, "'A' ... 'ZZ' does not go on forever";
ok ('AA' ... 'Z').munch(1000).elems < 1000, "'AA' ... 'Z' does not go on forever";
ok ('ZZ' ... 'A').munch(1000).elems < 1000, "'ZZ' ... 'A' does not go on forever";
ok ('Z' ... 'AA').munch(1000).elems < 1000, "'Z' ... 'AA' does not go on forever";
#?rakudo skip '...^'
is ('A' ...^ 'ZZ')[*-1], 'ZY', "'A' ...^ 'ZZ' omits last element";

# be sure the test works as specced even for user classes
{
    class Periodic {
        has Int $.val;
        method Str { 'P' ~ $.val }
        method succ { Periodic.new(val => ($.val >= 2 ?? 0 !! $.val + 1)) }
        method pred { Periodic.new(val => ($.val <= 0 ?? 2 !! $.val - 1)) }
    }
    our multi infix:<cmp> (Periodic $x, Periodic $y) { $x.val cmp $y.val }
    our multi infix:<cmp> (Periodic $x, Int $n)      { $x.val cmp $n }
    our multi infix:<eqv> (Periodic $x, Periodic $y) { $x.val eqv $y.val }
    our multi infix:<eqv> (Periodic $x, Int $n)      { $x.val eqv $n }
    my $f = { Periodic.new(val => $^v) };
    
    #?rakudo todo 'unkonwn'
    is ($f(0) ... 5)[^7].join(' '), 'P0 P1 P2 P0 P1 P2 P0', 'increasing periodic series';
    is ($f(0) ... -1)[^7].join(' '), 'P0 P2 P1 P0 P2 P1 P0', 'decreasing periodic series';
    #?rakudo 4 skip 'loops'
    is ($f(0) ... 2).join(' '), 'P0 P1 P2', 'increasing not-quite-periodic series';
    is ($f(2) ... 0).join(' '), 'P2 P1 P0', 'decreasing not-quite-periodic series';
    is ($f(0) ...^ 2).join(' '), 'P0 P1', 'exclusive increasing not-quite-periodic series';
    is ($f(2) ...^ 0).join(' '), 'P2 P1', 'exclusive decreasing not-quite-periodic series';
}

done_testing;

# vim: ft=perl6
