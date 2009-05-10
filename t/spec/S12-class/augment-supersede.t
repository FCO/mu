use v6;

use Test;

plan 5;

# L<S12/"Open vs Closed Classes"/"Otherwise you'll get a class redefinition error.">


#?rakudo emit #
use MONKEY_PATCHING;
{
    class Foo {
        method a {'called Foo.a'}
    }
    augment class Foo {
        method b {'called Foo.b'}
    }

    my $o = Foo.new;
    is($o.a, 'called Foo.a', 'basic method call works');
    is($o.b, 'called Foo.b', 'added method call works');

    ok(!eval('augment class NonExistent { }'), 'augment on non-existent class dies');
}

{
    class Bar {
        method c {'called Bar.c'}
    }
    supersede class Bar {
        method d {'called Bar.d'}
    }

    my $o = Bar.new;
    eval_dies_ok('$o.c', 'overridden method is gone completely');
    is($o.d, 'called Bar.d', 'new method is present instead');
}

# vim: ft=perl6
