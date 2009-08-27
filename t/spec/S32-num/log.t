use v6;
use Test;
plan 32;

=begin pod

Basic tests for the log() and log10() builtins

=end pod

# L<S32::Numeric/Num/"=item log">

is_approx(log(5), 1.6094379124341003, 'got the log of 5');
is_approx(log(0.1), -2.3025850929940455, 'got the log of 0.1');

# with given base:
#?rakudo 3 skip '3-arg log'
is_approx(log(8, 2), 3, 'log(8, 2) is 3'); 
is_approx(log(42, 23),  1.19205119221557, 'log(42, 23)');

# with non-Num
is_approx(log("42", "23"),  1.19205119221557, 'log(42, 23) with strings');

#?rakudo skip 'named args'
{
   is_approx(log(:x(5)), 1.6094379124341003, 'got the log of 5');
   is_approx(log(:x(0.1)), -2.3025850929940455, 'got the log of 0.1');
}

# L<S32::Numeric/Num/"=item log10">

is_approx(log10(5), 0.6989700043360187, 'got the log10 of 5');
is_approx(log10(0.1), -0.9999999999999998, 'got the log10 of 0.1');

is( log(0), -Inf, 'log(0) = -Inf');

is( log(Inf), Inf, 'log(Inf) = Inf');
is( log(-Inf), NaN, 'log(-Inf) = NaN');
is( log(NaN), NaN, 'log(NaN) = NaN');

is( log10(0), -Inf, 'log10(0) = -Inf');
is( log10(Inf), Inf, 'log10(Inf) = Inf');
is( log10(-Inf), NaN, 'log10(-Inf) = NaN');
is( log10(NaN), NaN, 'log10(NaN) = NaN');

#?rakudo skip 'named args'
{
   is_approx(log10(:x(5)), 0.6989700043360187, 'got the log10 of 5');
   is_approx(log10(:x(0.1)), -0.9999999999999998, 'got the log10 of 0.1');
}

# please add tests for complex numbers
#
# The closest I could find to documentation is here: http://tinyurl.com/27pj7c
# I use 1i instead of i since I don't know if a bare i will be supported

# log(exp(i pi)) = i pi log(exp(1)) = i pi
#?pugs 2 todo 'feature'
is_approx(log(-1 + 0i,), 0 + 1i * pi, "got the log of -1");
#?rakudo todo 'log10 of a Complex'
is_approx(log10(-1 + 0i), 0 + 1i * pi / log(10), "got the log10 of -1");

# log(exp(1+i pi)) = 1 + i pi
#?pugs 2 todo 'feature'
is_approx(log(-exp(1) + 0i), 1 + 1i * pi, "got the log of -e");
#?rakudo 1 todo 'complex log10()'
is_approx(log10(-10 + 0i), 1 + 1i * pi / log(10), "got the log10 of -10");
is_approx(log10(10), 1.0, 'log10(10)=1');

#?pugs todo 'feature'
is_approx(log((1+1i) / sqrt(2)), 0 + 1i * pi / 4, "got log of exp(i pi/4)");
is_approx(log(1i), 1i * pi / 2, "got the log of i (complex unit)");

#?rakudo 2 todo 'log10 of a Complex'
is_approx(log10(1i), 1i * pi / (2*log(10)), 'got the log10 of i');
is_approx(log10((1+1i) / sqrt(2)), 0 + 1i * pi / (4*log(10)), "got log10 of exp(i pi/4)");

#?pugs todo 'feature'
is_approx(log(-1i), -0.5i * pi , "got the log of -i (complex unit)");
#?rakudo todo 'log10 of a Complex'
is_approx(log10(-1i), -0.5i * pi / log(10), "got the log10 of -i (complex unit)");

# TODO: please add more testcases for log10 of complex numbers

#?rakudo 2 skip 'log10 of a Complex'
is_approx( (-1i).log10(), -0.5i*pi / log(10), " (i).log10 = - i  * pi/(2 log(10))");
isa_ok( log10(-1+0i), Complex, 'log10 of a complex returns a complex, not a list');
# vim: ft=perl6
