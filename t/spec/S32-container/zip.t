use v6;

use Test;

=begin pod

The zip() builtin and operator tests

=end pod

# L<S03/"Traversing arrays in parallel">
# L<S32::Containers/Container/"=item zip">

plan 12;

{
    my @a = (0, 2, 4);
    my @b = (1, 3, 5);

    my @e = (0 .. 5);

    #?rakudo emit #
    my @z; @z = zip(@a; @b);
    my @x; @x = (@a Z @b);

    #?rakudo skip 'zip() and semilists'
    is(~@z, ~@e, "simple zip");
    is(~@x, ~@e, "also with Z char");
};

{
    my @a = (0, 3);
    my @b = (1, 4);
    my @c = (2, 5);

    my @e = (0 .. 5);

    #?rakudo emit #
    my @z; @z = zip(@a; @b; @c);
    my @x; @x = (@a Z @b Z @c);

    #?rakudo skip 'zip() and semilists'
    is(~@z, ~@e, "zip of 3 arrays");
    is(~@x, ~@e, "also with Z char");
};

{
    my @a = (0, 4);
    my @b = (2, 6);
    my @c = (1, 3, 5, 7);

    # [((0, 2), 1), ((4, 6), 3), (undef, 5), (undef, 7)]
    my $todo = 'Seq(Seq(0,2),1), Seq(Seq(0,2),1), Seq(undef,5), Seq(undef,7)';
    my @e = eval $todo;

    #?rakudo emit #
    my @z; @z = zip(zip(@a; @b); @c);
    my @x; @x = ((@a Z @b) Z @c);

#?pugs 2 todo 'needs Seq'
    #?rakudo skip 'zip() and semilists'
    is(~@z, ~@e, "zip of zipped arrays with other array");
    #?rakudo skip 'test broken?'
    is(~@x, ~@e, "also as Z");
};

{
    my @a = (0, 2);
    my @b = (1, 3, 5);
    my @e = (0, 1, 2, 3);

    my @z = (@a Z @b);
    is(@z, @e, "zip uses length of shortest");
}

#?rakudo todo 'lvalue zip'
{
    my @a;
    my @b;

    (@a Z @b) = (1, 2, 3, 4);
    # XXX - The arrays below are most likely Seq's
#?pugs todo 'unimpl'
    is(@a, [1, 3], "first half of two zipped arrays as lvalues");
#?pugs todo 'unimpl'
    is(@b, [2, 4], "second half of the lvalue zip");
}

{
    my @a = (1..3, 5) Z (6..8, 10);
    is(@a, [1, 6, 2, 7, 3, 8, 5, 10], 'infix:<Z> imposes list context');
}

# mix arrays and ranges

is ('a'..'c' Z 1, 2, 3).join(','), 'a,1,b,2,c,3',
    'can mix arrays and ranges for infix:<Z>';

is ("a".."c" Z "?", "a".."b").join('|'), 'a|?|b|a|c|b',
    'can mix arrays and ranges for infix:<Z>';
