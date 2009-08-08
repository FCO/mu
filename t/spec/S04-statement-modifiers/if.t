use v6;

use Test;

plan 12;

# L<S04/"Conditional statements"/Conditional statement modifiers work as in Perl 5>

# test the if statement modifier
{
    my $a = 1;
    $a = 2 if 'a' eq 'a';
    is($a, 2, "post if");
}

{
    my $a = 1;
    $a = 3 if 'a' eq 'b';
    is($a, 1, "post if");
}

{
	my $answer = 1;
	my @x = 41, (42 if $answer), 43;
	my @y = 41, ($answer ?? 42 !! ()), 43;
	my @z = 41, 42, 43;
	is @y, @z, "sanity check";
	is @x, @y, "if expr on true cond"; 
}

{
	my $answer = 0;
	my @x = 41, (42 if $answer), 43;
	my @y = 41, ($answer ?? 42 !! ()), 43;
	my @z = 41, 43;
	is @y, @z, "sanity check";
	is @x, @y, "if expr on false cond"; 
}


#testing else part of the operator 
{
	my $answer = 0;
	my $x = $answer ?? 42 !! 43;
	is $x, 43, "?? || sanity check";
}

{
	sub foo() {
	 return if 1;
	 123;
	}
	
	my $ok = 1;
	for foo() -> @foo {
	    $ok = 0;
	}
	ok $ok, "condition in statement level respects context" 
}

{
    my $x = (3 if 1);
    my $y = (3 if 0);
    is $x, 3, '(3 if 1) worked in scalar context';
    ok !$y, 'my $y = (3 if 0) leaves $y false';
}

# return value of false 'if' should be Nil
# see http://rt.perl.org/rt3/Ticket/Display.html?id=66544

#?rakudo 2 todo 'RT #66544, return value of false statement modifying "if"'
{
    ok (42 if 0) ~~ undef, '"$something if 0" is Nil - (undef)';
    ok (42 if 0) ~~ (),    '"$something if 0" is Nil - (empty list)';
}

# vim: ft=perl6
