use v6;

use Test;

plan *;

# L<S04/"Conditional statements"/Conditional statement modifiers work as in Perl 5>

# test the for statement modifier
{
    my $a = '';
    $a ~= $_ for ('a', 'b', 'a', 'b', 'a');
    is($a, "ababa", "post for with parens");
}

# without parens
{
    my $a = '';
    $a ~= $_ for 'a', 'b', 'a', 'b', 'a';
    is($a, "ababa", "post for without parens");
}

{
    my $a = 0;
    $a += $_ for (1 .. 10);
    is($a, 55, "post for 1 .. 10 with parens");
}

{
    my $a = 0;
    $a += $_ for 1 .. 10;
    is($a, 55, "post for 1 .. 10 without parens");
}

{
    my @a = (5, 7, 9);
    my $a = 3;
    $a *= $_ for @a;
    is($a, 3 * 5 * 7 * 9, "post for array");
}

{
    my @a = (5, 7, 9);
    my $i = 5;
    my sub check(Int $n){
        is($n, $i, "sub Int with post for");
        $i += 2;
    }
    check $_ for @a;
}

#?rakudo todo '{ ... } for 1..3 should execute the closure'
{
    my $a = 0;
    { $a++ } for 1..3;
    is $a, 3, 'the closure was called';
}

#?rakudo todo '{ ... } for 1..3 should execute the closure'
{
    my $a = 0;
    -> $i { $a += $i } for 1..3;
    is $a, 6, 'the closure was called';
}

# L<S04/The C<for> statement/for and given privately temporize>
{
    my $i = 0;
    $_ = 10;
    $i += $_ for 1..3;
    is $_, 10, 'outer $_ did not get updated in lhs of for';
    is $i, 1+2+3, 'postfix for worked';
}

# L<S04/The for statement/When used as statement modifiers on implicit blocks>

{
    $_ = 42;
    my @trace;
    @trace.push: $_ for 2, 3;
    is @trace.join(':'), '2:3', 'statement modifier "for" sets $_ correctl';
    is $_, 42, '"for" statement modifier restored $_ of outer block';
}

# RT 66622
{
    my $rt66622 = 66622 for 1, 2, 3;
    is $rt66622, 66622, 'statement modifier "for" makes no implicit block';
}

done_testing;

# vim: ft=perl6
