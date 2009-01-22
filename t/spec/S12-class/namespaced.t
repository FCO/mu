use v6;

use Test;

plan 10;

=begin pod

Classes with names containing double colons and nested classes.

=end pod

class Foo::Bar {
    method baz {
        return 42;
    }
}

{
    my $foobar = Foo::Bar.new();
    is($foobar.baz, 42, 'methods can be called on classes with namespaces with ::');
}

class A {
    class B {
        method x { 2 }
        has $.y = 'b';
        method z { $!y }
    };
    method x { 1 }
    has $.y = 'a';
    method z { $!y }
};
{
    ok(A.new,           'could instantiate outer class');
    is(A.new.x,    1,   'called correct method on class A');
    is(A.new.y,    'a', 'could access attribute in class A');
    is(A.new.z,    'a', 'method access correct attribute in class A');
    ok(A::B.new,        'could instantiate nested class');
    is(A::B.new.x, 2,   'called correct method on class A::B');
    is(A::B.new.y, 'b', 'could access attribute in class A::B');
    is(A::B.new.z, 'b', 'method access correct attribute in class A::B');
    dies_ok({ B.new },  'class A::B not available outside of class as B');
}
