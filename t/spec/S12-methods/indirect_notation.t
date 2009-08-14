use v6;

use Test;

# L<S12/Methods/"Indirect object notation now requires a colon after the invocant, even if there are no arguments">

plan 39;


##### Without arguments
class T1
{
    method a
    {
        'test';
    }
}

{
    my T1 $o .= new;
    ok( "Still alive after new" );

    is( $o.a(), 'test', "The indirect object notation call without argument 1" );
#?rakudo skip 'unimpl parse error near $o:'
    is( (a $o:), 'test', "The indirect object notation call without arguments 2" );
}

##### With arguments
class T2
{
    method a( $x )
    {
        $x;
    }
}

{
    my T2 $o .= new;
    ok( "Still alive after new" );
    my $seed = 1000.rand;
    is( $o.a( $seed ), $seed, "The indirect object notation call with argument 1" );
#?rakudo skip 'unimpl parse error near $o:'
    is( (a $o: $seed), $seed, "The indirect object notation call with arguments 2" );
    my $name = 'a';
    eval_dies_ok('$name $o: $seed', 'Indirect object notation and indirect method calls cannot be combined');
}


# L<S12/Methods/"There are several forms of indirection for the method name">

{
    class A {
        method abc { 'abc' };
        method bcd { 'bcd' };
    }
    my $o = A.new();

    is $o."abc",    'abc',   'calling method with $object."methodname"';
    my $bc = 'bc';
    is $o."a$bc",   'abc',  'calling method with $object."method$name"';
    is $o."{$bc}d", 'bcd',  'calling method with $object."method$name"';


    my $meth = method { self.abc ~ self.bcd };
    is $o.$meth, 'abcbcd',   'calling method with $object.$methodref';
}

# L<S12/Methods/"$obj.@candidates(1,2,3)">
{
    class T3 {
        has $.x;
        has $.y;
        has $.called is rw = 0;

        our method m1 ()   { $!called++; "$.x|$.y" };
        our method m2 ()   { $!called++; "$.x,$.y"; nextsame() };
        our method m3 ()   { $!called++; "$.x~$.y" };
        our method m4 ()   { $!called++; callsame(); };
    }
    my @c = (&T3::m1, &T3::m2, &T3::m3);
    my $o = T3.new(:x<p>, :y<q>);

    is $o.@c(),         'p|q', 'called the first candidate in the list, which did not defer';
    is $o.called,       1,     'called only one method dispatch';
    
    @c.shift();
    $o.called = 0;
    is $o.@c,           'p~q', 'got result from method we defered to';
    is $o.called,       2,     'called total two methods during dispatch';

    @c.unshift(&T3::m4);
    $o.called = 0;
    is $o.@c,           'p~q', 'got result from method we defered to, via call';
    is $o.called,       3,     'called total three methods during dispatch';
}

# L<S12/Methods/"Another form of indirection relies on the fact">
#?rakudo skip '$obj.infix:<+>'
{
    is 1.infix:<+>(2),      3,      'Can call $obj.infix:<+>';
    my $op = '*';
    is 2.infix:{$op}(3),    6,      'can call $obj.infix:{$op}';
    is 2.infix:{'*'}(4),    8,      'can call $obj.infix:{"*"}';
    is 2.:<+>(7),           9,      'short form also works';
    my $x = 3;
    is $x.:<++>,            4,      '.:<++> defaults to prefix';
    is $x,                  4,      '... and it changed the variable';
}

dies_ok { 23."nonexistingmethod"() }, "Can't call nonexisting method";

{
    class T4 {
        has $.called = 0;
        our multi method m(Int $x) { $!called++; 'm-Int' }
        our multi method m(Num $x) { $!called++; 'm-Num' }

        our multi method n(Int $x) { $!called++; 'n-Int' }
        our multi method n(Num $x) { $!called++; 'n-Num' }
    }

    my $o = T4.new();
    my @cand-num = &T4::m, &T4::n;
    is ~$o.*@cand-num(3.4).sort, 'm-Num n-Num', '$o.*@cand(arg) (1)';
    is ~$o.*@cand-num(3).sort, 'm-Int m-Num n-Int n-Num', '$o.*@cand(arg) (2)';
    is $o.called, 6, 'right number of method calls';
    lives_ok { $o.*@cand-num() }, "it's ok with .* if no candidate matched (arity)";
    lives_ok { $o.*@cand-num([]) }, "it's ok with .* if no candidate matched (type)";

    $o = T4.new();
    is ~$o.+@cand-num(3.4).sort, 'm-Num n-Num', '$o.+@cand(arg) (1)';
    is ~$o.+@cand-num(3).sort, 'm-Int m-Num n-Int n-Num', '$o.+@cand(arg) (2)';
    is $o.called, 6, 'right number of method calls';
    dies_ok { $o.+@cand-num() }, "it's not ok with .+ if no candidate matched (arity)";
    dies_ok { $o.+@cand-num([]) }, "it's not ok with .+ if no candidate matched (type)";

    $o = T4.new();
    is ~$o.?@cand-num(3.4).sort, 'm-Num', '$o.?@cand(arg) (1)';
    is ~$o.?@cand-num(3).sort, 'm-Int', '$o.?@cand(arg) (2)';
    is $o.called, 2, 'right number of method calls';
    lives_ok { $o.?@cand-num() }, "it's ok with .? if no candidate matched (arity)";
    lives_ok { $o.?@cand-num([]) }, "it's ok with .? if no candidate matched (type)";
}

# vim: ft=perl6
