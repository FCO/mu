use v6;
use Test;
plan 4;

# L<S32::Containers/Hash/"Like hash assignment insofar">

my %ref1 = (a => 1, b => 2, c => 3);
my %ref2 = (a => [1, 4, 5], b => 2, c => 3);

{
    my %h;
    %h.push: 'b', 2, 'a', 1, 'c', 3;
    is_deeply %h, %ref1, 'basic Hash.push with alternating items';
    %h.push: (:a(4), :a(5));
    is_deeply %h, %ref2, 'stacking push works with pairs';

    my %g;
    %g.push: (a => 1), (c => 3), (b => 2);
    is_deeply %g, %ref1, 'basic Hash.push with pairs ';
    %g.push: 'a', 4, 'a', 5;
    #?rakudo skip 'Null PMC access in type()'
    is_deeply &g, %ref2, 'stacking push worsk with alternating items';
}

# vim: ft=perl6
