use v6;

use Test;

# L<S02/Literals/"There is now a generalized adverbial form of Pair">

# See thread "Demagicalizing pair" on p6l started by Luke Palmer,
# L<"http://article.gmane.org/gmane.comp.lang.perl.perl6.language/4778/"> and
# L<"http://colabti.de/irclogger/irclogger_log/perl6?date=2005-10-09,Sun&sel=528#l830">.
# Also see L<"http://www.nntp.perl.org/group/perl.perl6.language/23532">.

# To summarize:
#   foo(a => 42);  # named
#   foo(:a(42));   # named
#
#   foo((a => 42));  # pair passed positionally
#   foo((:a(42)));   # pair passed positionally
#
#   my $pair = (a => 42);
#   foo($pair);      # pair passed positionally
#   foo(|$pair);     # named
#
#   S02 lists ':a' as being equivlaent to a => 1, so
#   the type of the value of that pair is Int, not Bool

plan 47;

sub f1 ($a, $b) { $a.WHAT ~ $b.WHAT }
{
    is f1(a     => 42, 23), 'Int()Int()', "'a => 42' is a named";
    is f1(:a(42),  23),     'Int()Int()', "':a(42)' is a named";

    is f1(:a,      23),     'Bool()Int()',  "':a' is a named";
    is f1(:!a,     23),     'Bool()Int()',  "':!a' is also named";

    is f1("a"   => 42, 23), 'Pair()Int()', "'\"a\" => 42' is a named";
    is f1(("a") => 42, 23), 'Pair()Int()', "'(\"a\") => 42' is a pair";
    is f1((a   => 42), 23), 'Pair()Int()', "'(a => 42)' is a pair";
    is f1(("a" => 42), 23), 'Pair()Int()', "'(\"a\" => 42)' is a pair";
    is f1((:a(42)),    23), 'Pair()Int()', "'(:a(42))' is a pair";
    is f1((:a),        23), 'Pair()Int()',  "'(:a)' is a pair";
    is f1((:!a),       23), 'Pair()Int()',  "'(:a)' is also a pair";
    is f1(:a[1, 2, 3], :b[]), 'Array()Array()', ':a[...] constructs an Array value';
    is f1(:a{b => 3}, :b{}), 'Hash()Hash()', ':a{...} constructs a Hash value';
}

{
    my $p = :a[1, 2, 3];
    is $p.key, 'a', 'correct key for :a[1, 2, 3]';
    is $p.value.join('|'), '1|2|3', 'correct value for :a[1, 2, 3]';
}

{
    my $p = :a{b => 'c'};
    is $p.key, 'a', 'correct key for :a{ b => "c" }';
    is $p.value.keys, 'b', 'correct value for :a{ b => "c" } (keys)';
    is $p.value.values, 'c', 'correct value for :a{ b => "c" } (values)';
}

sub f2 (:$a!) { WHAT($a) }
{
    my $f2 = &f2;

    isa_ok f2(a     => 42), Int, "'a => 42' is a named";
    isa_ok f2(:a(42)),      Int, "':a(42)' is a named";
    isa_ok f2(:a),          Bool,"':a' is a named";

    isa_ok(&f2.(:a),        Bool, "in '&f2.(:a)', ':a' is a named");
    isa_ok $f2(:a),         Bool, "in '\$f2(:a)', ':a' is a named";
    isa_ok $f2.(:a),        Bool, "in '\$f2.(:a)', ':a' is a named";

    dies_ok { f2("a"   => 42) }, "'\"a\" => 42' is a pair";
    dies_ok { f2(("a") => 42) }, "'(\"a\") => 42' is a pair";
    dies_ok { f2((a   => 42)) }, "'(a => 42)' is a pair";
    dies_ok { f2(("a" => 42)) }, "'(\"a\" => 42)' is a pair";
    dies_ok { f2((:a(42)))    }, "'(:a(42))' is a pair";
    dies_ok { f2((:a))        }, "'(:a)' is a pair";
    dies_ok { &f2.((:a))       }, "in '&f2.((:a))', '(:a)' is a pair";

    dies_ok { $f2((:a))       }, "in '\$f2((:a))', '(:a)' is a pair";
    dies_ok { $f2.((:a))      }, "in '\$f2.((:a))', '(:a)' is a pair";
    dies_ok { $f2(((:a)))     }, "in '\$f2(((:a)))', '(:a)' is a pair";
    dies_ok { $f2.(((:a)))    }, "in '\$f2.(((:a)))', '(:a)' is a pair";
}

sub f3 ($a) { WHAT($a) }
{
    my $pair = (a => 42);

    isa_ok f3($pair),  Pair, 'a $pair is not treated magically...';
    #?pugs todo '[,]'
    #?rakudo skip 'prefix:<|>'
    isa_ok f3(|$pair), Int,    '...but |$pair is';
}

sub f4 ($a)    { WHAT($a) }
sub get_pair () { (a => 42) }
{

    isa_ok f4(get_pair()),  Pair, 'get_pair() is not treated magically...';
    #?rakudo skip 'reduce meta op'
    isa_ok f4(|get_pair()), Int,    '...but |get_pair() is';
}

sub f5 ($a) { WHAT($a) }
{
    my @array_of_pairs = (a => 42);

    isa_ok f5(@array_of_pairs), Array,
        'an array of pairs is not treated magically...';
    #?rakudo skip 'prefix:<|>'
    isa_ok f5(|@array_of_pairs), Array, '...and |@array isn\'t either';
}

sub f6 ($a) { WHAT($a) }
{

    my %hash_of_pairs = (a => "str");

    ok (f6(%hash_of_pairs)).does(Hash), 'a hash is not treated magically...';
    #?pugs todo '[,]'
    #?rakudo skip 'reduce meta op'
    isa_ok f6([,] %hash_of_pairs), Str,  '...but [,] %hash is';
    isa_ok f6(|%hash_of_pairs),     Str,  '... and so is |%hash';
}

sub f7 (:$bar!) { WHAT($bar) }
{
    my $bar = 'bar';

    dies_ok { f7($bar => 42) },
        "variables cannot be keys of syntactical pairs (1)";
}

sub f8 (:$bar!) { WHAT($bar) }
{
    my @array = <bar>;

    dies_ok { f8(@array => 42) },
        "variables cannot be keys of syntactical pairs (2)";
}

sub f9 (:$bar!) { WHAT($bar) }
{
    my $arrayref = <bar>;

    dies_ok { f9($arrayref => 42) },
        "variables cannot be keys of syntactical pairs (3)";
}

# vim: ft=perl6
