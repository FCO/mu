use v6;
use Test;

plan *;

class Parent {
    has $.x;
}

class Child is Parent {
    has $.y;
}

my $o;
lives_ok { $o =  Child.new(:x(2), :y(3)) }, 
         'can instantiate class with parent attributes';

is $o.y, 3, '... worked for the child';
is $o.x, 2, '... worked for the parent';

#?rakudo 3 todo 'parent attributes in initialization'
lives_ok { $o = Child.new( :y(4), Parent{ :x<5> }) }, 
         'can instantiate class with explicit specification of parent attrib';

is $o.y, 4, '... worked for the child';
is $o.x, 5, '... worked for the parent';

class GrandChild is Child {
}

#?rakudo 6 todo 'parent attributes in initialization'
lives_ok { $o = GrandChild.new( Child{ :y(4) }, Parent{ :x<5> }) },
         'can instantiate class with explicit specification of parent attrib (many parents)';
is $o.y, 4, '... worked for the class Child';
is $o.x, 5, '... worked for the class Parent';
lives_ok { $o = GrandChild.new( Parent{ :x<5> }, Child{ :y(4) }) }, 
         'can instantiate class with explicit specification of parent attrib (many parents, other order)';
is $o.y, 4, '... worked for the class Child (other order)';
is $o.x, 5, '... worked for the class Parent (other order)';

# RT #66204
{
    class RT66204 {}
    ok ! RT66204.defined, 'NewClass is not .defined';
    dies_ok { RT66204 .= new }, 'class asked to build itself refuses';
    ok ! RT66204.defined, 'NewClass is still not .defined';
}

# RT 71706
#?rakudo todo 'nested classes'
{
    class RT71706 {
        class RT71706::Artie {}
    }
    # TODO: check the error message, not just the timing.
    dies_ok { RT71706::Artie.new }, 'die trying to instantiate missing class';
}

done_testing;

# vim: ft=perl6
