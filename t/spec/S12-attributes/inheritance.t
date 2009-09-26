use v6;
use Test;
plan 5;

# test relation between attributes and inheritance

class A {
    has $.a;
}

class B is A {
    method accessor {
        return $.a
    }
}

my $o;
lives_ok {$o = B.new(a => 'blubb') }, 'Can initialize inherited attribute';
is $o.accessor, 'blubb',              'accessor can use inherited attribute';

class Artie61500 {
    has $!p = 61500;
}
#?rakudo todo 'RT #61500'
eval_dies_ok 'class Artay61500 is Artie61500 { method bomb { return $!p } }',
    'Compile error for subclass to access private attribute of parent';

class Parent {
    has $!priv = 23;
    method get { $!priv };
}

class Child is Parent {
    has $!priv = 42;
}

#?rakudo 2 todo 'RT 69260'
is Child.new().Parent::get(), 23,
   'private attributes do not leak from child to parent class (1)';

is Child.new().get(), 23,
   'private attributes do not leak from child to parent class (2)';

# vim: ft=perl6
