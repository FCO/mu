use v6;
use Test;

# Tests for auto-increment and auto-decrement operators
# originally from Perl 5, by way of t/operators/auto.t

plan 83;

#L<S03/Autoincrement precedence>

my $base = 10000;

my $x = 10000;
is(0 + ++$x - 1, $base);
is(0 + $x-- - 1, $base);
is(1 * $x,       $base);
is(0 + $x-- - 0, $base);
is(1 + $x,       $base);
is(1 + $x++,     $base);
is(0 + $x,       $base);
is(0 + --$x + 1, $base);
is(0 + ++$x + 0, $base);
is($x,           $base);

my @x;
@x[0] = 10000;
is(0 + ++@x[0] - 1, $base);
is(0 + @x[0]-- - 1, $base);
is(1 * @x[0],       $base);
is(0 + @x[0]-- - 0, $base);
is(1 + @x[0],       $base);
is(1 + @x[0]++,     $base);
is(0 + @x[0],       $base);
is(0 + ++@x[0] - 1, $base);
is(0 + --@x[0] + 0, $base);
is(@x[0],           $base);

my %z;
%z{0} = 10000;
is(0 + ++%z{0} - 1, $base);
is(0 + %z{0}-- - 1, $base);
is(1 * %z{0},       $base);
is(0 + %z{0}-- - 0, $base);
is(1 + %z{0},       $base);
is(1 + %z{0}++,     $base);
is(0 + %z{0},       $base);
is(0 + ++%z{0} - 1, $base);
is(0 + --%z{0} + 0, $base);
is(%z{0},           $base);

# Increment of a Str
#L<S03/Autoincrement precedence/Increment of a>

# XXX: these need to be re-examined and extended per changes to S03.
# Also, see the thread at
# http://www.nntp.perl.org/group/perl.perl6.compiler/2007/06/msg1598.html
# which prompted many of the changes to Str autoincrement/autodecrement.

my @auto_tests = (
    { init => '99',  inc => '100' },
    { init => 'a0',  inc => 'a1' },
    { init => 'Az',  inc => 'Ba' },
    { init => 'zz',  inc => 'aaa' },
    { init => 'A99', inc => 'B00' },
    { init => 'zi',  inc => 'zj',
      name => 'EBCDIC check (i and j not contiguous)' },
    { init => 'zr',  inc => 'zs',
      name => 'EBCDIC check (r and s not contiguous)' },
    { init => 'a1',  dec => 'a0' },
    { init => '100', dec => '099' },
    { init => 'Ba',  dec => 'Az' },
    { init => 'B00', dec => 'A99' },

    { init => '123.456',
      inc  => '124.456',
      name => '124.456, not 123.457' },
    { init => '/tmp/pix000.jpg',
      inc  => '/tmp/pix001.jpg',
      name => 'increment a filename' },
);

for @auto_tests -> %t {
    my $pre = %t<init>;

    # This is a check on the form of the @auto_tests
    my $tests_run = 0;
    ok( $pre.defined, "initial value '$pre' is defined" );

    if %t.exists( 'inc' ) {
        my $val = $pre;
        $val++;
        my $name = %t<name> // "'$pre'++ is '{%t<inc>}'";
        is( $val, %t<inc>, $name );
        $tests_run++;
    }
    if %t.exists( 'dec' ) {
        my $val = $pre;
        $val--;
        my $name = %t<name> // "'$pre'-- is '{%t<dec>}'";
        is( $val, %t<dec>, $name );
        $tests_run++;
    }

    # This is a check on the form of the @auto_tests
    ok( $tests_run > 0, "did some test for '$pre'" );
}


my $foo;

#?rakudo skip "test incorrect? Decrement of 'aaa' should fail"
$foo = 'aaa';
is(--$foo, 'aaa');

#?rakudo skip "test incorrect? Decrement of 'A00' should fail"
$foo = 'A00';
is(--$foo, 'A00');

{
    my $x;
    is ++$x, 1, 'Can autoincrement an undef variable (prefix)';

    my $y;
    $y++;
    is $y, 1, 'Can autoincrement an undef variable (postfix)';
}

{
    class Incrementor {
        has $.value;

        method succ() {
            Incrementor.new( value => $.value + 42);
        }
    }

    my $o = Incrementor.new( value => 0 );
    $o++;
    is $o.value, 42, 'Overriding succ catches postfix increment';
    ++$o;
    is $o.value, 84, 'Overriding succ catches prefix increment';
}

{
    class Decrementor {
        has $.value;

        method pred() {
            Decrementor.new( value => $.value - 42);
        }
    }

    my $o = Decrementor.new( value => 100 );
    $o--;
    is $o.value, 58, 'Overriding pred catches postfix decrement';
    --$o;
    is $o.value, 16, 'Overriding pred catches prefix decrement';
}

{
    # L<S03/Autoincrement precedence/Increment of a>
   
    my $x = "b";
    is $x.succ, 'c', '.succ for Str';
    is $x.pred, 'a', '.pred for Str';

    my $y = 1;
    is $y.succ, 2, '.succ for Int';
    is $y.pred, 0, '.pred for Int';

    my $z = Num.new();
    is $z.succ, 1 , '.succ for Num';
    is $z.pred, -1, '.pred for Num'
}
