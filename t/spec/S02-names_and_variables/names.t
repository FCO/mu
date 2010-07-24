use v6;

use Test;

plan 24;

# I'm using semi-random nouns for variable names since I'm tired of foo/bar/baz and alpha/beta/...

# L<S02/Names/>
# syn r14552

#?rakudo skip 'package variable autovivification'
{
    my $mountain = 'Hill';
    $Terrain::mountain  = 108;
    $Terrain::Hill::mountain = 1024;
    our $river = 'Terrain::Hill';
    is($mountain, 'Hill', 'basic variable name');
    is($Terrain::mountain, 108, 'variable name with package');
    is(Terrain::<$mountain>, 108, 'variable name with sigil not in front of package');
    is($Terrain::Hill::mountain, 1024, 'variable name with 2 deep package');
    is(Terrain::Hill::<$mountain>, 1024, 'varaible name with sigil not in front of 2 package levels deep');
    is($Terrain::($mountain)::mountain, 1024, 'variable name with a package name partially given by a variable ');
    is($::($river)::mountain, 1024, 'variable name with package name completely given by variable');
}

{
    my $bear = 2.16;
    is($bear,       2.16, 'simple variable lookup');
#?rakudo 4 skip '::{ } package lookup NYI'
    is($::{'bear'}, 2.16, 'variable lookup using $::{\'foo\'}');
    is(::{'$bear'}, 2.16, 'variable lookup using ::{\'$foo\'}');
    is($::<bear>,   2.16, 'variable lookup using $::<foo>');
    is(::<$bear>,   2.16, 'variable lookup using ::<$foo>');
}

#?rakudo skip '::{ } package lookup NYI'
{
    my $::<!@#$> =  2.22;
    is($::{'!@#$'}, 2.22, 'variable lookup using $::{\'symbols\'}');
    is(::{'$!@#$'}, 2.22, 'variable lookup using ::{\'$symbols\'}');
    is($::<!@#$>,   2.22, 'variable lookup using $::<symbols>');
    is(::<$!@#$>,   2.22, 'variable lookup using ::<$symbols>');

}

# RT #65138, Foo::_foo() parsefails
{
    module A {
        our sub _b() { 'sub A::_b' }
    }
    is A::_b(), 'sub A::_b', 'A::_b() call works';
}

# RT #63646
{
    dies_ok { OscarMikeGolf::whiskey_tango_foxtrot() },
            'dies when calling non-existent sub in non-existent package';
    dies_ok { Test::bravo_bravo_quebec() },
            'dies when calling non-existent sub in existing package';
    # RT #74520
    class TestA { };
    eval 'TestA::b(3, :foo)';
    ok "$!" ~~ / ' TestA::b' /, 'error message mentions function name';
}

# RT #71194
{
    sub self { 4 };
    is self(), 4, 'can define and call a sub self()';
}

# RT #69752
{
    eval 'Module.new';
    ok "$!" ~~ / 'Module' /,
        'error message mentions name not recognized, no maximum recursion depth exceeded';
}

# RT #74276
# Rakudo had troubles with names starting with Q
eval_lives_ok 'class Quox { }; Quox.new', 'class names can start with Q';

# RT #58488 
lives_ok {
    eval 'class A { has $.a};  my $a = A.new();';
    eval 'class A { has $.a};  my $a = A.new();';
    eval 'class A { has $.a};  my $a = A.new();';
}, 'can redefine a class in eval multiple times without permanent damange';

# vim: ft=perl6
