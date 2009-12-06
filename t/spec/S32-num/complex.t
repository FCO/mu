use v6;

use Test;

plan *;

# Basic tests functions specific to complex numbers.

isa_ok(1 + 2i, Complex, 'postfix:<i> creates a Complex number');

is_approx((2i)i, -2, 'postfix:<i> works on an imaginary number');
is_approx((2i + 3)i, -2 + 3i, 'postfix:<i> works on a Complex number');

#?rakudo 3 skip 'standalone i NYI'
is_approx(i, 1i, 'standalone i works to generate a Complex number');
is_approx(1 - i, 1 - 1i, 'standalone i works to generate a Complex number');
is_approx(2i * i, -2, 'standalone i works times a Complex number');

# checked with the open CAS system "yacas":
# In> (3+4*I) / (2-I)
# Out> Complex(2/5,11/5)
# In> (3+4*I) * (2-I)
# Out> Complex(10,5)
# etc
is_approx (3+4i)/(2-1i), 2/5 + (11/5)i, 'Complex division';
is_approx (3+4i)*(2-1i), 10+5i,         'Complex division';
is_approx (6+4i)/2,      3+2i,          'dividing Complex by a Real';
is_approx 2/(3+1i),      3/5 -(1/5)i,   'dividing a Real by a Complex';
is_approx 2 * (3+7i),    6+14i,         'Real * Complex';
is_approx (3+7i) * 2,    6+14i,         'Complex * Real';

isa_ok( eval((1+3i).perl), Complex, 'eval (1+3i).perl is Complex' );
is_approx( (eval (1+3i).perl), 1+3i, 'eval (1+3i).perl is 1+3i' );
isa_ok( eval((1+0i).perl), Complex, 'eval (1+0i).perl is Complex' );
is_approx( (eval (1+0i).perl), 1, 'eval (1+0i).perl is 1' );
isa_ok( eval((3i).perl), Complex, 'eval (3i).perl is Complex' );
is_approx( (eval (3i).perl), 3i, 'eval (3i).perl is 3i' );

# MUST: test .Str

my @examples = (0i, 1 + 0i, -1 + 0i, 1i, -1i, 2 + 0i, -2 + 0i, 2i, -2i,
                2 + 3i, 2 - 3i, -2 + 3i, -2 - 3i,
                cis(1.1), cis(3.1), cis(5.1), 35.unpolar(0.8), 40.unpolar(3.7));

for @examples -> $z {
    is_approx($z + 0, $z, "$z + 0 = $z");
    is_approx(0 + $z, $z, "0 + $z = $z");
    is_approx($z + 0.0, $z, "$z + 0.0 = $z");
    is_approx(0.0 + $z, $z, "0.0 + $z = $z");
    is_approx($z + 0 / 1, $z, "$z + 0/1 = $z");
    is_approx(0 / 1 + $z, $z, "0/1 + $z = $z");
    
    is_approx($z - 0, $z, "$z - 0 = $z");
    is_approx(0 - $z, -$z, "0 - $z = -$z");
    is_approx($z - 0.0, $z, "$z - 0.0 = $z");
    is_approx(0.0 - $z, -$z, "0.0 - $z = -$z");
    is_approx($z - 0 / 1, $z, "$z - 0/1 = $z");
    is_approx(0 / 1 - $z, -$z, "0/1 - $z = -$z");
    
    is_approx($z + 2, $z.re + 2 + ($z.im)i, "$z + 2");
    is_approx(2 + $z, $z.re + 2 + ($z.im)i, "2 + $z");
    is_approx($z + 2.5, $z.re + 2.5 + ($z.im)i, "$z + 2.5 = $z");
    is_approx(2.5 + $z, $z.re + 2.5 + ($z.im)i, "2.5 + $z = $z");
    is_approx($z + 3 / 2, $z.re + 3/2 + ($z.im)i, "$z + 3/2");
    is_approx(3 / 2 + $z, $z.re + 3/2 + ($z.im)i, "3/2 + $z");

    is_approx($z - 2, $z.re - 2 + ($z.im)i, "$z - 2");
    is_approx(2 - $z, -$z.re + 2 - ($z.im)i, "2 - $z");
    is_approx($z - 2.5, $z.re - 2.5 + ($z.im)i, "$z - 2.5 = $z");
    is_approx(2.5 - $z, -$z.re + 2.5 - ($z.im)i, "2.5 - $z = $z");
    is_approx($z - 3 / 2, $z.re - 3/2 + ($z.im)i, "$z - 3/2");
    is_approx(3 / 2 - $z, -$z.re + 3/2 - ($z.im)i, "3/2 - $z");
}

# L<S32::Numeric/Complex/=item re>
# L<S32::Numeric/Complex/=item im>

{
    is (1 + 2i).re, 1, 'Complex.re works';
    is (1 + 2i).im, 2, 'Complex.im works';
}

# used to be RT #68848
#?rakudo skip "NYI in Rakudo-ng"
{
    is_approx exp(3.0 * log(1i)), -1.83697e-16-1i,
              'exp(3.0 * log(1i))';
    sub iPower($a, $b) { exp($b * log($a)) };
    is_approx iPower(1i, 3.0), -1.83697e-16-1i, 'same as wrapped as sub';

}

done_testing;

# vim: ft=perl6
