use v6;
use Test;

# L<S32::Containers/"List"/"=item grep">

=begin pod

built-in grep tests

=end pod

plan 44;

my @list = (1 .. 10);

{
    my @result = grep { ($_ % 2) }, @list;
    is(+@result, 5, 'we got a list back');
    is(@result[0], 1, 'got the value we expected');
    is(@result[1], 3, 'got the value we expected');
    is(@result[2], 5, 'got the value we expected');
    is(@result[3], 7, 'got the value we expected');
    is(@result[4], 9, 'got the value we expected');
}

#?rakudo skip 'calling a slurpy by name, RT 74344'
{
    my @result = grep({ ($_ % 2) }, :values(@list));
    is(+@result, 5, 'we got a list back');
    is(@result[0], 1, 'got the value we expected');
    is(@result[1], 3, 'got the value we expected');
    is(@result[2], 5, 'got the value we expected');
    is(@result[3], 7, 'got the value we expected');
    is(@result[4], 9, 'got the value we expected');
}

#?rakudo skip "adverbial block"
{
    my @result = @list.grep():{ ($_ % 2) };
    is(+@result, 5, 'we got a list back');
    is(@result[0], 1, 'got the value we expected');
    is(@result[1], 3, 'got the value we expected');
    is(@result[2], 5, 'got the value we expected');
    is(@result[3], 7, 'got the value we expected');
    is(@result[4], 9, 'got the value we expected');
}

#?rakudo skip "adverbial block"
{
    my @result = @list.grep :{ ($_ % 2) };
    is(+@result, 5, 'we got a list back');
    is(@result[0], 1, 'got the value we expected');
    is(@result[1], 3, 'got the value we expected');
    is(@result[2], 5, 'got the value we expected');
    is(@result[3], 7, 'got the value we expected');
    is(@result[4], 9, 'got the value we expected');
}

#?rakudo skip "closure as non-final argument"
{
    my @result = grep { ($_ % 2) }: @list;
    is(+@result, 5, 'we got a list back');
    is(@result[0], 1, 'got the value we expected');
    is(@result[1], 3, 'got the value we expected');
    is(@result[2], 5, 'got the value we expected');
    is(@result[3], 7, 'got the value we expected');
    is(@result[4], 9, 'got the value we expected');
}

{
  #?pugs 2 todo 'bug'
  is(42.grep({ 1 }), "42",     "method form of grep works on numbers");
  is('str'.grep({ 1 }), 'str', "method form of grep works on strings");
}

#
# Grep with mutating block
#
# L<S02/Names/"$_, $!, and $/ are context<rw> by default">

{
  my @array = <a b c d>;
  #?rakudo 2 skip 'test error -- is $_ rw here?'
  is ~(@array.grep({ $_ ~= "c"; 1 })), "ac bc cc dc",
    'mutating $_ in grep works (1)';
  is ~@array, "ac bc cc dc",
    'mutating $_ in grep works (2)';
}

# grep with last, next etc.

{
    is (1..16).grep({last if $_ % 5 == 0; $_ % 2 == 0}).join('|'),
       '2|4', 'last works in grep';
    is (1..12).grep({next if $_ % 5 == 0; $_ % 2 == 0}).join('|'),
       '2|4|6|8|12', 'next works in grep';
}

# since the test argument to .grep is a Matcher, we can also
# check type constraints:

{
    is (2, [], 4, [], 5).grep(Int).join(','),
       '2,4,5', ".grep with non-Code matcher";

    is grep(Int, 2, [], 4, [], 5).join(','),
       '2,4,5', "grep() with non-Code matcher";
}

# RT 71544
{
    my @in = ( 1, 1, 2, 3, 4, 4 );

# This test passes, but it's disabled because it doesn't belong here.
# It just kind of clarifies the test that follows.
#    is (map { $^a == $^b }, @in), (?1, ?0, ?1), 'map takes two at a time';

    #?rakudo skip 'RT 71544: grep arity sensitivity different from map'
    is (grep { $^a == $^b }, @in), (1, 1, 4, 4), 'grep takes two at a time';
}

{
    my @a = <a b c>;
    my @b = <b c d>;
    is @a.grep(any(@b)).join('|'), 'b|c', 'Junction matcher';

}

# seensible boolification
# RT #74056
# since rakudo returns an iterator (and not a list) and some internals leaked,
# a zero item list/iterator would return True, which is obviously wrong
{
    ok <0 1 2>.grep(1), 'Non-empty return value from grep is true (1)';
    ok <0 1 2>.grep(0), 'Non-empty return value from grep is true (2)';
    nok <0 1 2>.grep(3), 'Empty return value from grep is false';
}

# chained greps
{
    is ~(1...100).grep(* %% 2).grep(* %% 3), ~(6, 12 ... 100), "chained greps work";
}

done_testing;

# vim: ft=perl6
