use v6;

use Test;

=begin pod

We ought to be able to change a value when aliasing into it.

=end pod

plan 8;

#?pugs 8 todo 'rw aliasing'

{
    my %h = 1..4;
    lives_ok {
        for %h.values -> $v is rw { $v += 1 }
    }, 'aliases returned by %hash.values should be rw (1)';

    is %h<3>, 5, 'aliases returned by %hash.values should be rw (2)';
}

{
    my @a = 1..4;
    lives_ok {
        for @a.values -> $v is rw { $v += 1 }
    }, 'aliases returned by @array.values should be rw (1)';

    is @a[2], 4, 'aliases returned by @array.values should be rw (2)';
}

{
    my $pair = (a => 42);
    lives_ok {
        for $pair.value -> $v is rw { $v += 1 }
    }, 'aliases returned by $pair.values should be rw (1)';

    is $pair.value, 43, 'aliases returned by $pair.values should be rw (2)';
}

{
    my $var  = 42;
    my $pair = (a => $var);
    lives_ok {
        for $pair.value -> $v is rw { $v += 1 }
    }, 'aliases returned by $pair.values should be rw (1)';

    is $pair.value, 43, 'aliases returned by $pair.values should be rw (2)';
}

# (currently this dies with "Can't modify constant item: VInt 2")
