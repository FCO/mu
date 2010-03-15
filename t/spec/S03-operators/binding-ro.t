use v6;
use Test;

plan 8;

# L<S03/Item assignment precedence/bind and make readonly>

{
    my $x = 5;
    my $y = 3;
    $x ::= $y;
    is $x, 3, '::= on scalars took the value from the RHS';
    dies_ok { $x = 5 }; '... and made the LHS RO';
    is $x, 3, 'variable is still 3';
}

{
    my Int $a = 4;
    my Str $b;
    dies_ok { $b ::= $a },
        'Cannot ro-bind variables with incompatible type constraints';
}

{
    my @x = <a b c>;
    my @y = <d e>;

    @x ::= @y;
    is @x.join('|'), 'd|e', '::= on arrays';
    dies_ok { @x := <3 4 foo> }, '... make RO';
    is @x.join('|'), 'd|e', 'value unchanged';
    lives_ok { @x[2] = 'k' }, 'can still assign to items of RO array';
    is @x.join(''), 'd|e|k', 'assignment relly worked';
}

# vim: ft=perl6
