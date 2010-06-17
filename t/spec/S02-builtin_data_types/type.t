use v6;
use Test;

=begin description

Basic tests about variables having built-in types assigned

=end description

# L<S02/"Built-In Data Types"/"A variable's type is a constraint indicating what sorts">

plan *;

{
    ok(try {my Int $foo; 1}, 'compile my Int $foo');
    ok(try {my Str $bar; 1}, 'compile my Str $bar');
}

ok(do {my Int $foo; $foo ~~ Int}, 'Int $foo isa Int');
ok(do {my Str $bar; $bar ~~ Str}, 'Str $bar isa Str');

my Int $foo;
my Str $bar;

{
    #?pugs 1 todo
    dies_ok({$foo = 'xyz'},      'Int restricts to integers');
    dies_ok { $foo = Mu },       'Int does not accept Mu';
    is(($foo = 42),       42,    'Int is an integer');

    #?pugs 1 todo
    dies_ok({$bar = 42},         'Str restricts to strings');
    dies_ok { $bar = Mu },       'Str does not accept Mu';
    is(($bar = 'xyz'),    'xyz', 'Str is a strings');
}

my $baz of Int;
{
    dies_ok({$baz = 'xyz'},      'of Int restricts to integers');
    is(($baz = 42),       42,    'of Int is an integer');
}

# L<S02/Built-In Data Types/Variables with native types do not support undefinedness>
#?rakudo skip 'native types (causes false positives if marked with todo)'
{
    eval_lives_ok('my int $alpha = 1',    'Has native type int');
    eval_dies_ok('my int $alpha = Nil', 'native int type cannot be undefined');
    lives_ok({my Int $beta = Nil},      'object Int type can be undefined');
    eval_lives_ok('my num $alpha = 1',    'Has native type num');
    eval_dies_ok('my num $alpha = Nil', 'native num type cannot be undefined');
    lives_ok({my Num $beta = Nil},      'object Num type can be undefined');
}

# L<S02/Parameter types/Parameters may be given types, just like any other variable>
{
    sub paramtype (Int $i) {return $i+1}
    is(paramtype(5), 6, 'sub parameters with matching type');
    eval_dies_ok('paramtype("foo")', 'sub parameters with non-matching type dies');
}

{
    # test contributed by Ovid++
    sub fact (Int $n) {
        if 0 == $n {
            1;
        }
        else {
            $n * fact($n - 1);
        }
    }
    is fact(5), 120, 'recursive factorial with type contstraints work';
}

# Num accepts Int too.
{
    my Num $n;
    $n = 42;
    is $n, 42, 'Num accepts Int too';
}

# L<S02/Return types/a return type can be specified before or after the name>
#?rakudo skip 'return type checking'
{
    # Check with explicit return.
    my sub returntype1 (Bool $pass) returns Str { return $pass ?? 'ok' !! -1}
    my sub returntype2 (Bool $pass) of Int { return $pass ?? 42 !! 'no'}
    my Bool sub returntype3 (Bool $pass)   { return $pass ?? Bool::True !! ':('}
    my sub returntype4 (Bool $pass --> Str) { return $pass ?? 'ok' !! -1}

    is(returntype1(Bool::True), 'ok', 'good return value works (returns)');
    dies_ok({ returntype1(Bool::False) }, 'bad return value dies (returns)');
    is(returntype2(Bool::True), 42, 'good return value works (of)');
    dies_ok({ returntype2(Bool::False) }, 'bad return value dies (of)');

    is(returntype3(Bool::True), True, 'good return value works (my Type sub)');
    dies_ok({ returntype3(Bool::False) }, 'bad return value dies (my Type sub)');

    is(returntype4(Bool::True), 'ok', 'good return value works (-->)');
    dies_ok({ returntype4(Bool::False) }, 'bad return value dies (-->)');
}

#?rakudo skip 'return type checking'
{
    # Check with implicit return.
    my sub returntype1 (Bool $pass) returns Str { $pass ?? 'ok' !! -1}
    my sub returntype2 (Bool $pass) of Int { $pass ?? 42 !! 'no'}
    my Bool sub returntype3 (Bool $pass)   { $pass ?? Bool::True !! ':('}
    my sub returntype4 (Bool $pass --> Str) { $pass ?? 'ok' !! -1}

    is(returntype1(Bool::True), 'ok', 'good implicit return value works (returns)');
    dies_ok({ returntype1(Bool::False) }, 'bad implicit return value dies (returns)');
    is(returntype2(Bool::True), 42, 'good implicit return value works (of)');
    dies_ok({ returntype2(Bool::False) }, 'bad implicit return value dies (of)');

    is(returntype3(Bool::True), True, 'good implicit return value works (my Type sub)');
    dies_ok({ returntype3(Bool::False) }, 'bad implicit return value dies (my Type sub)');

    is(returntype4(Bool::True), 'ok', 'good implicit return value works (-->)');
    dies_ok({ returntype4(Bool::False) }, 'bad implicit return value dies (-->)');
}

#?rakudo skip '"as" return type coercion'
{
    # the following two are the same type of behavior
    # S02: "It is possible for the of type to disagree with the as type"
    my Rat sub returntype4 ($pass)     as Num {$pass ?? 11 / 10 !! 1}
    my sub returntype5 ($pass --> Rat) as Num {$pass ?? 11 /  5 !! 2}

    is(returntype4(True), 1.1, 'good return value works (my Type sub as OtherType)');
    eval_dies_ok('returntype4(False)', 'bad return value dies (my Type sub as OtherType)');
    is(returntype5(True), 2.2, 'good return value works (--> Type as OtherType)');
    eval_dies_ok('returntype5(False)', 'bad return value dies (--> Type as OtherType)');
}

{
    eval_dies_ok('my Int Str $x', 'multiple prefix constraints not allowed');
    eval_dies_ok('sub foo(Int Str $x) { }', 'multiple prefix constraints not allowed');
    eval_dies_ok('sub foo(--> Int Str) { }', 'multiple prefix constraints not allowed');
    eval_dies_ok('our Int Str sub foo() { }', 'multiple prefix constraints not allowed');
}

{
    # TODO: many more of these are possible
    ok Any ~~ Mu, 'Any ~~ Mu';
    ok Mu !~~ Any, 'Mu !~~ Any';
    ok Mu !~~ Int, 'Mu !~~ Int';

    ok Int ~~ Num, 'Int ~~ Num';
    ok Num !~~ Int, 'Num !~~ Int';

    ok Array ~~ List, 'Array is a kind of List';
    ok List !~~ Array, 'A Seq is not an Array';
    ok Seq ~~ Positional, 'A Seq does Positional';
    ok Array ~~ Positional, 'Array does Positional too';
}

done_testing;

# vim: ft=perl6
