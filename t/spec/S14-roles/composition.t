use v6;
use Test;
plan *;

# L<S14/Roles/"Roles may be composed into a class at compile time">

role rA {
    method mA1 {
        'mA1';
    }
    method mA2 {
        'mA2';
    }
};

role rB {
    method mB1 {
        'mB1';
    }
    method mB2 {
        'mB2';
    }
};

class C1 does rA {
    method mC1 {
        'mC1';
    }
};

my $x = C1.new();

is $x.mC1,      'mC1',      'Can call method of class with mixed in role';
is $x.mA1,      'mA1',      'Call first method from role';
is $x.mA2,      'mA2',      'Call second method from role';

class C2 does rA does rB {
    method mC2 {
        'mC2';
    }
}

my $y = C2.new();

is $y.mC2,      'mC2',      'Can call method of class with two roles mixed in';
is $y.mA1,      'mA1',      'Can call mixed in method (two roles) 1';
is $y.mA2,      'mA2',      'Can call mixed in method (two roles) 2';
is $y.mB1,      'mB1',      'Can call mixed in method (two roles) 3';
is $y.mB2,      'mB2',      'Can call mixed in method (two roles) 4';

ok C2 ~~ rA, 'class matches first role';
ok C2 ~~ rB, 'class matches second role';
ok rA !~~ C2, 'first role does not match class';
ok rB !~~ C2, 'second role does not match class';

role RT64002 does rA does rB {}
#?rakudo 2 todo 'RT #64002'
ok RT64002 ~~ rA, 'role matches first role it does';
ok RT64002 ~~ rB, 'role matches second role it does';
ok rA !~~ RT64002, 'role not matched by first role it does';
ok rB !~~ RT64002, 'role not matched by second role it does';

{
    class D1 does rA {
        method mA1 {
            'D1.mA1';
        }
    }

    my $z = D1.new();

    is $z.mA1,      'D1.mA1',   'Can override method in a role with method in a class';
}

# diamond composition
{
    role DA { 
        method foo { "OH HAI" };
    }
    role DB does DA { }
    role DC does DA { }
    class DD does DB does DC { };
    is DD.new.foo, 'OH HAI', 'diamond role composition';
    class DE is DB is DC { };
    is DE.new.foo, 'OH HAI', 'same with punning and inheritance';
}

# RT #69919
{
    role RT69919 {
        my $lex = 'Luthor';
        method rt69919 { return $lex }
    }
    class IL does RT69919 {}

    #?rakudo skip 'RT 69919, Null PMC access in type()'
    is IL.new.rt69919, 'Luthor', 'access lexical declared in role from method called via class that does the role';
}

done_testing;

# vim: syn=perl6
