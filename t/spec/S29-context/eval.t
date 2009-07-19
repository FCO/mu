use v6;
use Test;
plan 14;

# L<S29/Context/"=item eval">

=begin pod

Tests for the eval() builtin

=end pod

# eval should evaluate the code in the lexical scope of eval's caller
{
    sub make_eval_closure {
        my $a = 5;
        return sub ($s) {
            eval $s 
        };
    };
    is(make_eval_closure().('$a'), 5, 'eval runs code in the proper lexical scope');
}

is(eval('5'), 5, 'simple eval works and returns the value');
my $foo = 1234;
is(eval('$foo'), $foo, 'simple eval using variable defined outside');

# traps die?
ok(!eval('die; 1'), "eval can trap die");

ok(eval('my @a = (1); @a!<0>') ~~ undef, "eval returns undef on syntax error");

ok(!eval('use Poison; 1'), "eval can trap a fatal use statement");

sub v { 123 }
ok(v() == 123, "a plain subroutine");
eval 'sub v { 456 }';
#?rakudo todo 'eval can override subroutines (specced?)'
ok(v() == 456, "eval can overwrite a subroutine");

# L<S04/Exception handlers/Perl 6's eval function only evaluates strings, not blocks.>
dies_ok({eval {42}}, 'block eval is gone');

# RT #63978, eval didn't work in methods
{
    class EvalTester1 {
        method e($s) { eval $s };
    }
    is EvalTester1.e('5'),       5, 'eval works inside class methods';
    is EvalTester1.new.e('5'),   5, 'eval works inside instance methods';
}

#?rakudo skip 'lexicals outside class not visible inside class'
{
    my $x = 5;
    class EvalTester2 {
        method e($s) { eval "$s + \$x" };
    }
    is EvalTester2.e('1'),       6, 
       'eval works inside class methods, with outer lexicals';
    is EvalTester2.new.e('1'),   6, 
       'eval works inside instance methods, with outer lexicals';
}

#?rakudo skip 'eval(Buf)'
is eval("'møp'".encode('UTF-8')), 'møp', 'eval(Buf)';

# vim: ft=perl6
