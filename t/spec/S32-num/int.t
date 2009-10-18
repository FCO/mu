use v6;
use Test;
plan 70;

# L<S32::Numeric/Num/"=item truncate">
# truncate and int() are synonynms.
# Possibly more tests for truncate should be added here, too.

=begin pod

Basic tests for the int() builtin

=end pod

# basic sanity:
is(-0, 0, '-0 is the same as 0 - hey, they are integers ;-)');

isa_ok( eval(1.perl), Int, 'eval 1.perl is Int' );
is( eval(1.perl), 1, 'eval 1.perl is 1' );
isa_ok( eval((-12).perl), Int, 'eval -12.perl is Int' );
is( eval((-12).perl), -12, 'eval -12.perl is -12' );
isa_ok( eval(0.perl), Int, 'eval 0.perl is Int' );
is( eval(0.perl), 0, 'eval 0.perl is 0' );
isa_ok( eval((-0).perl), Int, 'eval -0.perl is Int' );
is( eval((-0).perl), -0, 'eval -0.perl is 0' );

is((-1).Int, -1, "(-1).Int is -1");
is(0.Int, 0, "int(0) is 0");
is(1.Int, 1, "int(1) is 1");
is(3.14159265.Int, 3, "int(3.14159265) is 3");
is((-3.14159265).Int, -3, "int(-3.14159265) is -3");

is(0.999.Int, 0, "int(0.999) is 0");
is(0.51.Int, 0, "int(0.51) is 0");
is(0.5.Int, 0, "int(0.5) is 0");
is(0.49.Int, 0, "int(0.49) is 0");
is(0.1.Int, 0, "int(0.1) is 0");
isa_ok(0.1.Int, Int, 'int(0.1) returns an Int');

is((-0.999).Int, 0, "int(-0.999) is 0");
is((-0.51).Int,  0, "int(-0.51) is 0");
is((-0.5).Int,   0, "int(-0.5) is 0");
is((-0.49).Int,  0, "int(-0.49) is 0");
is((-0.1).Int,   0, "int(-0.1) is 0");
isa_ok((-0.1).Int, Int, 'int(-0.1) returns an Int');

is(1.999.Int, 1, "int(1.999) is 1");
is(1.51.Int,  1, "int(1.51) is 1");
is(1.5.Int,   1, "int(1.5) is 1");
is(1.49.Int,  1, "int(1.49) is 1");
is(1.1.Int,   1, "int(1.1) is 1");

is((-1.999).Int, -1, "int(-1.999) is -1");
is((-1.51).Int, -1, "int(-1.51) is -1");
is((-1.5).Int, -1, "int(-1.5) is -1");
is((-1.49).Int, -1, "int(-1.49) is -1");
is((-1.1).Int, -1, "int(-1.1) is -1");

is('-1.999'.Int, -1, "int('-1.999') is -1");
is('0x123'.Int, 0x123, "int('0x123') is 0x123");
is('0d456'.Int, 0d456, "int('0d456') is 0d456");
is('0o678'.Int, 0o67, "int('0o678') is 0o67");
is('3e4d5'.Int, 3e4, "int('3e4d5') is 3e4");

{
    sub __int( $s ) {
        my $pos = $s.index('.');
        if ($pos > 0) { return substr($s, 0, $pos); }
        return $s;
    };

    # Check the defaulting to $_

    for 0, 0.0, 1, 50, 60.0, 99.99, 0.4, 0.6, -1, -50, -60.0, -99.99 {
        my $int = __int($_);
        is(.Int, $int, "integral value for $_ is $int");
        isa_ok(.Int, "Int");
    }
}

#?DOES 1
# Special values
is((1.9e3).Int, 1900, "int 1.9e3 is 1900");
#?pugs 3 todo 'bug'
#?rakudo 3 todo 'Inf and NaN not yet implemented'
is((Inf).Int,    Inf, "int Inf is Inf");
is((-Inf).Int,  -Inf, "int -Inf is -Inf");
is((NaN).Int,    NaN, "int NaN is NaN");

# RT #65132
eval_dies_ok 'int 3.14', 'dies: int 3.14 (prefix:int is gone)';

# vim: ft=perl6
