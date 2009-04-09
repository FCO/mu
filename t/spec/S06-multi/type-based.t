use v6;
use Test;
plan 38;

# type based dispatching
#
#L<S06/"Longname parameters">
#L<S12/"Multisubs and Multimethods">

multi foo (Int $bar)   { "Int "  ~ $bar  }
multi foo (Str $bar)   { "Str "  ~ $bar  }
multi foo (Num $bar)   { "Num "  ~ $bar  }
multi foo (Bool $bar)  { "Bool " ~ $bar  }
multi foo (Regex $bar) { "Regex " ~ WHAT( $bar ) } # since Rule's don't stringify
multi foo (Sub $bar)   { "Sub " ~ $bar() }
multi foo (@bar) { "Array " ~ join(', ', @bar) }
multi foo (%bar)  { "Hash " ~ join(', ', %bar.keys.sort) }
multi foo (IO $fh)     { "IO" }

is(foo('test'), 'Str test', 'dispatched to the Str sub');
is(foo(2), 'Int 2', 'dispatched to the Int sub');

my $num = '4';
is(foo(1.4), 'Num 1.4', 'dispatched to the Num sub');
is(foo(1 == 1), 'Bool 1', 'dispatched to the Bool sub');
#?rakudo skip 'type Regex'
is(foo(/a/),'Regex Regex','dispatched to the Rule sub');
is(foo(sub { 'baz' }), 'Sub baz', 'dispatched to the Sub sub');

my @array = ('foo', 'bar', 'baz');
is(foo(@array), 'Array foo, bar, baz', 'dispatched to the Array sub');

my %hash = ('foo' => 1, 'bar' => 2, 'baz' => 3);
is(foo(%hash), 'Hash bar, baz, foo', 'dispatched to the Hash sub');

is(foo($*ERR), 'IO', 'dispatched to the IO sub');

# You're allowed to omit the "sub" when declaring a multi sub.
# L<S06/"Routine modifiers">

multi declared_wo_sub (Int $x) { 1 }
multi declared_wo_sub (Str $x) { 2 }
is declared_wo_sub(42),   1, "omitting 'sub' when declaring 'multi sub's works (1)";
is declared_wo_sub("42"), 2, "omitting 'sub' when declaring 'multi sub's works (2)";

# Test for slurpy MMDs
proto mmd {}  # L<S06/"Routine modifiers">
multi mmd () { 1 }
multi mmd (*$x, *@xs) { 2 }

is(mmd(), 1, 'Slurpy MMD to nullary');
is(mmd(1,2,3), 2, 'Slurpy MMD to listop via args');
is(mmd(1..3), 2, 'Slurpy MMD to listop via list');

{
    my %h = (:a<b>, :c<d>);
    multi sub sigil-t (&code) { 'Callable'      }
    multi sub sigil-t ($any)  { 'Any'           }
    multi sub sigil-t (@ary)  { 'Positional'    }
    multi sub sigil-t (%h)    { 'Associative'   }
    is sigil-t(1),          'Any',      'Sigil-based dispatch (Any)';
    is sigil-t({ $_ }),     'Callable', 'Sigil-based dispatch (Callable)';
    is sigil-t(<a b c>),    'Positional','Sigil-based dispatch (Arrays)';
    is sigil-t(%h),         'Associative','Sigil-based dispatch (Associative)';

}

{

    class Scissor { };
    class Paper   { };

    multi wins(Scissor $x, Paper   $y) { 1 };
    multi wins(::T     $x, T       $y) { 0 };
    multi wins($x, $y)                { -1 };

    is wins(Scissor.new, Paper.new),   1,  'Basic sanity';
    #?rakudo 2 skip 'RT 63276'
    is wins(Paper.new,   Paper.new),   0,  'multi dispatch with ::T generics';
    is wins(Paper.new,   Scissor.new), -1, 'fallback if there is a ::T variant';

    multi wins2(Scissor $x, Paper   $y) { 1 };
    multi wins2($x, $y where { $x.WHAT eq $y.WHAT }) { 0 };
    multi wins2($x, $y)                { -1 };
    is wins(Scissor.new, Paper.new),   1,  'Basic sanity 2';
    #?rakudo 2 skip 'subset types that involve multiple parameters'
    is wins(Paper.new,   Paper.new),   0,  'multi dispatch with faked generics';
    is wins(Paper.new,   Scissor.new), -1, 'fallback if there is a faked generic';
}

{
    multi m($x,$y where { $x==$y }) { 0 };
    multi m($x,$y) { 1 };

    #?rakudo 2 skip 'subset types that involve multiple parameters'
    is m(2, 3), 1, 'subset types involving mulitple parameters (fallback)';
    is m(1, 1), 0, 'subset types involving mulitple parameters (success)';
}

{
    multi f2 ($)        { 1 };
    multi f2 ($, $)     { 2 };
    multi f2 ($, $, $)  { 3 };
    multi f2 ($, $, @)  { '3+' };
    is f2(3),               1, 'arity-based dispatch to ($)';
    is f2('foo', f2(3)),    2, 'arity-based dispatch to ($, $)';
    is f2('foo', 4, 8),     3, 'arity-based dispatch to ($, $, $)';
    is f2('foo', 4, <a b>), '3+', 'arity-based dispatch to ($, $, @)';
}

{
    multi f3 ($ where 0 ) { 1 };
    multi f3 ($x)         { $x + 1 };
    is f3(0), 1, 'can dispatch to "$ where 0"';
    is f3(3), 4, '... and the ordinary dispatch still works';
}

# multi dispatch on typed containers 

{
    multi f4 (Int @a )  { 'Array of Int' }
    multi f4 (Str @a )  { 'Array of Str' }
    multi f4 (Array @a) { 'Array of Array' }
    multi f4 (Int %a)   { 'Hash of Int' }
    multi f4 (Str %a)   { 'Hash of Str' }
    multi f4 (Array %a) { 'Hash of Array' }

    my Int @a = 3, 4;
    my Str @b = <foo bar>;
    my Array @c = [1, 2], [3, 4];

    my Int %a = a => 1, b => 2;
    my Str %b = :a<b>, :b<c>;
    my Array %c = a => [1, 2], b => [3, 4];

    is f4(%a), 'Hash of Int',    'can dispatch on typed Hash (Int)';
    is f4(%b), 'Hash of Str',    'can dispatch on typed Hash (Str)';
    is f4(%c), 'Hash of Array',  'can dispatch on typed Hash (Array)';

    is f4(@a), 'Array of Int',   'can dispatch on typed Array (Int)';
    is f4(@b), 'Array of Str',   'can dispatch on typed Array (Str)';
    is f4(@c), 'Array of Array', 'can dispatch on typed Array (Array)';
}


# vim: ft=perl6
