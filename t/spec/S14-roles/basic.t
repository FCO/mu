use v6;

use Test;

plan 31;

=begin description

Basic role tests from L<S14/Roles>

=end description

# L<S14/Roles>
# Basic definition
role Foo {}
class Bar does Foo {};

# Smartmatch and .HOW.does and .^does
my $bar = Bar.new();
ok ($bar ~~ Bar),               '... smartmatch our $bar to the Bar class';
ok ($bar.HOW.does($bar, Foo)),  '.HOW.does said our $bar does Foo';
ok ($bar.^does(Foo)),           '.^does said our $bar does Foo';
ok ($bar ~~ Foo),               'smartmatch said our $bar does Foo';

# Can also write does inside the class.
role Foo2 { method x { 42 } }
class Bar2 { does Foo2; }
my $bar2 = Bar2.new();
ok ($bar2 ~~ Foo2),          'smartmatch works when role is done inside class';
is $bar2.x, 42,              'method composed when role is done inside class';

# Mixing a Role into an Object using imperative C<does>
my $baz = 3;
ok defined($baz does Foo),      'mixing in our Foo role into $baz worked';
#?pugs skip 3 'feature'
ok $baz.HOW.does($baz, Foo),    '.HOW.does said our $baz now does Foo';
ok $baz.^does(Foo),             '.^does said our $baz now does Foo';
eval_dies_ok q{ $baz ~~ Baz },        'smartmatch against non-existent type dies';

# L<S14/Roles/but with a role keyword:>
# Roles may have methods
#?pugs skip "todo"
{
    role A { method say_hello(Str $to) { "Hello, $to" } }
    my Bar $a .= new();
    ok(defined($a does A), 'mixing A into $a worked');
    is $a.say_hello("Ingo"), "Hello, Ingo", 
        '$a "inherited" the .say_hello method of A';
}

# L<S14/Roles/Roles may have attributes:>
{
    role B { has $.attr is rw = 42 }
    my Bar $b .= new();
    $b does B;
    ok defined($b),        'mixing B into $b worked';
    is $b.attr, 42,        '$b "inherited" the $.attr attribute of B (1)';
    is ($b.attr = 23), 23, '$b "inherited" the $.attr attribute of B (2)';

    # L<S14/Run-time Mixins/"but creates a copy">
    # As usual, ok instead of todo_ok to avoid unexpected succeedings.
    my Bar $c .= new(),
    ok defined($c),             'creating a Foo worked';
    ok !($c ~~ B),              '$c does not B';
    ok (my $d = $c but B),      'mixing in a Role via but worked';
    ok !($c ~~ B),              '$c still does not B...';
    ok $d ~~ B,                 '...but $d does B';
}

# Using roles as type constraints.
role C { }
class DoesC does C { }
lives_ok { my C $x; },          'can use role as a type constraint on a variable';
lives_ok { my C $x = undef },   'can assign undef';
dies_ok { my C $x = 42 },       'type-check enforced';
dies_ok { my C $x; $x = 42 },   'type-check enforced in future assignments too';
lives_ok {my C $x = DoesC.new },'type-check passes for class doing role';
lives_ok { my C $x = 42 but C },'type-check passes when role mixed in';

class HasC {
    has C $.x is rw;
}
lives_ok { HasC.new },          'attributes typed as roles initialized OK';
lives_ok { HasC.new.x = DoesC.new },
                                'typed attribute accepts things it should';
lives_ok { HasC.new.x = undef },'typed attribute accepts things it should';
dies_ok { HasC.new.x = 42 },    'typed attribute rejects things it should';

# Checking if role does role
role D {
}

ok D ~~ Role, 'a role does the Role type';

# vim: ft=perl6
