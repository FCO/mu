use v6;

use Test;

plan *;

# L<S12/"Multisubs and Multimethods">
# L<S12/"Multi dispatch">

class Foo {
    multi method bar() {
        return "Foo.bar() called with no args";
    }

    multi method bar(Str $str) {
        return "Foo.bar() called with Str : $str";
    }

    multi method bar(Int $int) {
        return "Foo.bar() called with Int : $int";
    }
    
    multi method bar(Num $num) {
        return "Foo.bar() called with Num : $num";
    }
    
    multi method baz($f) {
        return "Foo.baz() called with parm : $f";
    }
}


my $foo = Foo.new();
is($foo.bar(), 'Foo.bar() called with no args', '... multi-method dispatched on no args');

is($foo.bar("Hello"), 'Foo.bar() called with Str : Hello', '... multi-method dispatched on Str');

is($foo.bar(5), 'Foo.bar() called with Int : 5', '... multi-method dispatched on Int');
my $num = '4';
is($foo.bar(+$num), 'Foo.bar() called with Num : 4', '... multi-method dispatched on Num');

#?rakudo todo 'RT #66006'
eval '$foo.baz()';
ok ~$! ~~ /:i argument[s?]/, 'Call with wrong number of args should complain about args';

role R1 {
    method foo($x) { 1 }
}
role R2 {
    method foo($x, $y) { 2 }
}
eval_dies_ok 'class X does R1 does R2 { }', 'sanity: get composition conflict error';
class C does R1 does R2 {
    proto method foo() { "proto" }
}
my $obj = C.new;
is($obj.foo(),  'proto', 'proto caused methods from roles to be composed without conflict');
is($obj.foo('a'),     1, 'method composed into multi from role called');
is($obj.foo('a','b'), 2, 'method composed into multi from role called');


class Foo2 {
    multi method a($d) {
        "Any-method in Foo";
    }
}
class Bar is Foo2 {
    multi method a(Int $d) {
        "Int-method in Bar";
    }
}

is Bar.new.a("not an Int"), 'Any-method in Foo';

# RT #67024
#?rakudo todo 'redefintion of non-multi method (RT #67024)'
{
    eval 'class A { method a(){0}; method a($x){1} }';
    ok  $!  ~~ Exception, 'redefintion of non-multi method (RT 67024)';
    ok "$!" ~~ /multi/, 'error message mentions multi-ness';
}

{
    role R3 {
        has @.order;
        multi method b() { @.order.push( 'role' ) }
    }
    class C3 does R3 {
        multi method b() { @.order.push( 'class' ); nextsame }
    }

    my $c = C3.new;
    lives_ok { $c.b }, 'can call multi-method from class with role';

    is $c.order, <class role>, 'call order is correct for class and role'
}

{
    role R4 {
        has @.order;
        multi method b() { @.order.push( 'role'   ); nextsame }
    }
    class P4 {
        method b() {       @.order.push( 'parent' ) }
    }
    class C4 is P4 does R4 {
        multi method b() { @.order.push( 'class'  ); nextsame }
    }
    my $c = C4.new;
    lives_ok { $c.b }, 'call multi-method from class with parent and role';

    is $c.order, <class role parent>,
       'call order is correct for class, role, parent'
}

# RT 69192
{
    role R5 {
        multi method rt69192()       { push @.order, 'empty' }
        multi method rt69192(Str $a) { push @.order, 'Str'   }
    }
    role R6 {
        multi method rt69192(Num $a) { push @.order, 'Num'   }
    }
    class RT69192 { has @.order }

    {
        my RT69192 $bot .= new();
        ($bot does R5) does R6;
        $bot.*rt69192;
        is $bot.order, <empty>, 'multi method called once on empty signature';
    }

    {
        my RT69192 $bot .= new();
        ($bot does R5) does R6;
        $bot.*rt69192('RT #69192');
        is $bot.order, <Str>, 'multi method called once on Str signature';
    }

    {
        my RT69192 $bot .= new();
        ($bot does R5) does R6;
        $bot.*rt69192( 69192 );
        is $bot.order, <Num>, 'multi method called once on Num signature';
    }
}

{
    role RoleS {
        multi method d( Str $x ) { 'string' }
    }
    role RoleI {
        multi method d( Int $x ) { 'integer' }
    }
    class M does RoleS does RoleI {
        multi method d( Any $x ) { 'any' }
    }

    my M $m .= new;

    is $m.d( 876 ), 'integer', 'dispatch to one role';
    is $m.d( '7' ), 'string',  'dispatch to other role';
    is $m.d( 1.2 ), 'any',     'dispatch to the class with the roles';

    my @multi_method = $m.^methods.grep({ ~$_ eq 'd' });
    is @multi_method.elems, 1, '.^methods returns one element for a multi';

    my $routine = @multi_method[0];
    #?rakudo todo 'multi method appears as Routine per r27045'
    ok $routine ~~ Routine, 'multi method from ^methods is a Routine';
    my @candies = $routine.candidates;
    is @candies.elems, 3, 'got three candidates for multi method';

    ok @candies[0] ~~ Method, 'candidate 0 is a method';
    ok @candies[1] ~~ Method, 'candidate 1 is a method';
    ok @candies[2] ~~ Method, 'candidate 2 is a method';
}

done_testing;

# vim: ft=perl6
