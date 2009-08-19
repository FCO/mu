use v6;
use Test;

plan 15;

# L<S02/Names/An identifier is composed of an alphabetic character>

{
    sub don't($x) { !$x }

    ok don't(0),    "don't() is a valid sub name (1)";
    ok !don't(1),   "don't() is a valid sub name (2)";

    my $a'b'c = 'foo';
    is $a'b'c, 'foo', "\$a'b'c is a valid variable name";

    eval_dies_ok  q[sub foo-($x) { ... }],
                 'foo- (trailing hyphen) is not an identifier';
    eval_dies_ok  q[sub foo'($x) { ... }],
                 "foo' (trailing apostrophe) is not an identifier";
    eval_dies_ok  q[sub foob'4($x) { ... }],
                 "foob'4 is not a valid identifer (not alphabetic after apostrophe)";
    eval_dies_ok  q[sub foob-4($x) { ... }],
                 "foob-4 is not a valid identifer (not alphabetic after hyphen)";
    eval_lives_ok q[sub foo4'b($x) { ... }],
                 "foo4'b is a valid identifer";
}

{
    # This confirms that '-' in a sub name is legal.
    my sub foo-bar { 'foo-bar' }
    is foo-bar(), 'foo-bar', 'can call foo-bar()';
}

# RT #64656
{
    my sub do-check { 'do-check' }
    is do-check(), 'do-check', 'can call do-check()';
}

{
    # check with a different keyword
    sub if'a($x) {$x}
    is if'a(5), 5, "if'a is a valid sub name";
}

{
    my sub sub-check { 'sub-check' }
    is sub-check(), 'sub-check', 'can call sub-check';
}

{
    my sub method-check { 'method-check' }
    is method-check(), 'method-check', 'can call method-check';
}

# RT #65804
{
    sub sub($foo) { $foo }
    is sub('RT #65804'), 'RT #65804', 'sub named "sub" works';
}

# RT #68358
#?rakudo skip 'RT #68358'
{
    my ($x);
    sub my($a) { $a + 17 }
    $x = 5;
    is my($x), 23, 'call to sub named "my" works';
}

# vim: ft=perl6
