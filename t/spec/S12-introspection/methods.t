use v6;

use Test;

plan 31;

=begin pod

Tests for .^methods from L<S12/Introspection>.

=end pod

# L<S12/Introspection/"get the method list of MyClass">

class A {
    method foo($param --> Any) { }
    multi method bar($thingy) { }
    multi method bar($thingy, $other_thingy) { }
}
class B is A {
    method foo($param) of Num { }
}
class C is A {
}
class D is B is C {
    multi method bar($a, $b, $c) { }
    method foo($param) returns Int { }
}

my (@methods, $meth1, $meth2);

@methods = C.^methods(:local);
is +@methods, 0, 'class C has no local methods (proto)';

@methods = C.new().^methods(:local);
is +@methods, 0, 'class C has no local methods (instance)';

@methods = B.^methods(:local);
is +@methods, 1, 'class B has one local methods (proto)';
is @methods[0].name(), 'foo', 'method name can be found';
ok @methods[0].signature.perl ~~ /'$param'/, 'method signature contains $param';
is @methods[0].returns, Num, 'method returns a Num (from .returns)';
is @methods[0].of, Num, 'method returns a Num (from .of)';
#?rakudo skip '.multi'
ok !@methods[0].multi, 'method is not a multimethod';

@methods = B.new().^methods(:local);
is +@methods, 1, 'class B has one local methods (instance)';
is @methods[0].name(), 'foo', 'method name can be found';
ok @methods[0].signature.perl ~~ /'$param'/, 'method signature contains $param';
is @methods[0].returns, Num, 'method returns a Num (from .returns)';
is @methods[0].of, Num, 'method returns a Num (from .of)';
#?rakudo skip '.multi'
ok !@methods[0].multi, 'method is not a multimethod';

@methods = A.^methods(:local);
is +@methods, 2, 'class A has two local methods (one only + one multi with two variants)';
my ($num_multis, $num_onlys);
for @methods -> $meth {
    if $meth.name eq 'foo' {
        $num_onlys++;
        #?rakudo skip '.multi'
        ok !$meth.multi, 'method foo is not a multimethod';
    } elsif $meth.name eq 'bar' {
        $num_multis++;
        #?rakudo skip '.multi'
        ok $meth.multi, 'method bar is a multimethod';
    }
}
is $num_onlys, 1, 'class A has one only method';
is $num_multis, 1, 'class A has one multi methods';

@methods = D.^methods();
ok +@methods > 5, 'got all methods in hierarchy plus more from Any/Object';
ok @methods[0].name eq 'foo' && @methods[1].name eq 'bar' ||
   @methods[0].name eq 'bar' && @methods[1].name eq 'foo',
   'first two methods from class D itself';
is @methods[2].name, 'foo', 'method from B has correct name';
is @methods[2].of, Num, 'method from B has correct return type';
ok @methods[3].name eq 'foo' && @methods[4].name eq 'bar' ||
   @methods[3].name eq 'bar' && @methods[4].name eq 'foo',
   'two methods from class A itself';

@methods = List.^methods();
ok +@methods > 0, 'can get methods for List (proto)';
@methods = (1, 2, 3).^methods();
ok +@methods > 0, 'can get methods for List (instance)';

@methods = Str.^methods();
ok +@methods > 0, 'can get methods for Str (proto)';
@methods = "i can haz test pass?".^methods();
ok +@methods > 0, 'can get methods for Str (instance)';

ok +List.^methods() > +Any.^methods(), 'List has more methods than Any';
ok +Any.^methods() > +Object.^methods(), 'Any has more methods than Objects';

ok +(D.^methods>>.name) > 0, 'can get names of methods in and out of our own classes';
