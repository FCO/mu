use v6;

use Test;

plan 28;

# L<S03/Changes to Perl 5 operators/flipflop operator is now done with>

# XXX more tests for fff

#?pugs 999 skip 'TODO: infix:<ff>'
sub my_take (Int $n, &f) { (1..$n).map: { f() ?? $_ !! Nil } }
sub always_false { 0 }
sub always_true  { 1 }

# Basic ff
{
   ok 1 ff 1, 'flip-flop operator implemented';
   ok 1 fff 1, 'fff operator implemented';
}

{
    my @result = my_take 5, { ?(always_false() ff always_false()) };
    is ~@result, "    ", "always_false() ff always_false()";
}
{
    my @result = my_take 5, { ?(always_false() fff always_false()) };
    is ~@result, "    ", "always_false() fff always_false()";
}

{
    my @result = my_take 5, { ?(always_false() ff always_true()) };
    is ~@result, "    ", "always_false() ff always_true()";
}
{
    my @result = my_take 5, { ?(always_false() fff always_true()) };
    is ~@result, "    ", "always_false() fff always_true()";
}

{
    my @result = my_take 5, { ?(always_true() ff always_true()) };
    ok all(@result), "always_true() ff always_true()";
}

{
    my @result = my_take 5, { ?(always_true() ff always_false()) };
    is ~@result, "1 2 3 4 5", "always_true() ff always_false()";
}

# Basic ^ff
{
    my @result = my_take 5, { ?(always_false() ^ff always_false()) };
    is ~@result, "    ", "always_false() ^ff always_false()";
}

{
    my @result = my_take 5, { ?(always_false() ^ff always_true()) };
    is ~@result, "    ", "always_false() ^ff always_true()";
}

#?rakudo todo "Very strange test..."
{
    my @result = my_take 5, { ?(always_true() ^ff always_true()) } || 1;
    diag(+@result ~ ' ' ~@result);
    my $first  = shift @result;

    ok !$first && all(@result), "always_true() ^ff always_true()";
}

{
    my @result = my_take 5, { ?(always_true() ^ff always_false()) };
    is ~@result, " 2 3 4 5", "always_true() ^ff always_false()";
}

# Basic ff^
{
    my @result = my_take 5, { ?(always_false() ff^ always_false()) };
    is ~@result, "    ", "always_false() ff^ always_false()";
}

{
    my @result = my_take 5, { ?(always_false() ff^ always_true()) };
    is ~@result, "    ", "always_false() ff^ always_true()";
}

{
    my @result = my_take 5, { ?(always_true() ff^ always_true()) };

    # XXX what should the result be?
}

{
    my @result = my_take 5, { ?(always_true() ff^ always_false()) };
    is ~@result, "1 2 3 4 5", "always_true() ff^ always_false()";
}

# RHS not evaluated when in "false" state (perldoc perlop, /flip-flop)
{
    my $bug = 1; 
    if 0 ff {$bug=2} { $bug = 3 }; 
    ok ($bug == 1), "RHS not evaluated in \"false\" state (ff)";

    $bug = 1; 
    if 0 ^ff {$bug=2} { $bug = 3 }; 
    ok ($bug == 1), "RHS not evaluated in \"false\" state (^ff)";

    $bug = 1;
    if 0 ff^ {$bug=2} { $bug = 3 }; 
    ok ($bug == 1), "RHS not evaluated in \"false\" state (ff^)";
}

# LHS not evaluated when in "true" state (perldoc perlop, /flip-flop)
{
    my $count = 0;
    for (1..2) -> {
        if sub { ++$count; } ff 0 { }
    }
    is($count, 1, "LHS not evaluated in \"true\" state (ff)");
   
    for (1..2) -> {
        if sub { ++$count; } ^ff 0 { }
    }
    is($count, 2, "LHS not evaluated in \"true\" state (^ff)");
    
    for (1..2) -> {
        if sub { ++$count; } ff^ 0 { }
    }
    is($count, 3, "LHS not evaluated in \"true\" state (ff^)");
}

# LHS always evaluated when in "false" state
#TODO Add same tests for RHS
{
    my $count = 0;
    my $got = 0;

    for (1..2) -> {
        if sub { $count++ == 1 } ff 0 { ++$got }
    }
    is($count, 2, "LHS evaluated in \"false\" state (ff)");
    is($got,   1, ".. and result used");
}
  
{
    my $count = 0;
    my $got = 0;
    for (1..3) -> {
        if sub { $count++ > 0 } ^ff 0 { ++$got }
    }
    is($count, 2, "LHS evaluated only in \"false\" state (^ff)");
    is($got,   1, ".. and result used");
}
    
{
    my $count = 0;
    my $got = 0;

    for (1..2) -> {
        if sub { $count++ == 1 } ff^ 0 { ++$got }
    }
    is($count, 2, "LHS evaluated in \"false\" state (ff^)");
    is($got,   1, ".. and result used");
}


# See thread "till (the flipflop operator, formerly ..)" on p6l started by Ingo
# Blechschmidt, especially Larry's reply:
# http://www.nntp.perl.org/group/perl.perl6.language/24098
{
    ok do { my sub foo ($x) { try { $x ff 0 } }; if foo(0) || !foo(1) || !foo(0) { die }},
    	"all sub invocations share the same ff-state";
}

# vim: ft=perl6
