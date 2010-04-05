use v6;
use Test;

plan *;

# L<S06/Required parameters/"Passing a named argument that cannot be bound to
# a normal subroutine is also a fatal error.">

{
    sub a($x = 4) {
        return $x;
    }
    is a(3), 3, 'Can pass positional arguments';
    eval_dies_ok('a(g=>7)', 'Dies on passing superfluous arguments');
}

{
    sub b($x) {
        return $x;
    }

    is b(:x(3)), 3, 'Can pass positional parameters as named ones';

    sub c(:$w=4){
        return $w;
    } 
    is c(w => 3), 3, 'Named argument passes an integer, not a Pair';
    my $w = 5;
    is c(:$w), 5, 'can use :$x colonpair syntax to call named arg';
    eval_dies_ok 'my $y; c(:$y)', 'colonpair with wrong variable name dies';
}

# L<S06/Named parameters>

sub simple_pos_param($x) { $x }
is simple_pos_param(x => 3), 3, "positional param may be addressed by name (1)";
is simple_pos_param(:x(3)),  3, "positional param may be addressed by name (2)";

# L<S06/Named parameters/marked by a prefix>
sub simple_pos_params (:$x) { $x }

is(simple_pos_params( x => 4 ), 4, "simple named param");


sub foo (:$x = 3) { $x }

is(foo(), 3, "not specifying named params that aren't mandatory works");

# part of RT 53814
#?pugs todo 'bug'
dies_ok({foo(4)}, "using a named as a positional fails");

is(foo( x => 5), 5, "naming named param also works");
is(foo( :x<5> ), 5, "naming named param adverb-style also works");

sub foo2 (:$x = 3, :$y = 5) { $x + $y }

is(foo2(), 8, "not specifying named params that aren't mandatory works (foo2)");
#?pugs 2 todo 'bug'
dies_ok({foo2(4)}, "using a named as a positional fails (foo2)");
dies_ok({foo2(4, 10)}, "using a named as a positional fails (foo2)");
is(foo2( x => 5), 10, "naming named param x also works (foo2)");
is(foo2( y => 3), 6, "naming named param y also works (foo2)");
is(foo2( x => 10, y => 10), 20, "naming named param x & y also works (foo2)");
is(foo2( :x(5) ), 10, "naming named param x adverb-style also works (foo2)");
is(foo2( :y(3) ), 6, "naming named param y adverb-style also works (foo2)");
is(foo2( :x(10), :y(10) ), 20, "naming named params x & y adverb-style also works (foo2)");
is(foo2( x => 10, :y(10) ), 20, "mixing fat-comma and adverb naming styles also works for named params (foo2)");
is(foo2( :x(10), y => 10 ), 20, "mixing adverb and fat-comma naming styles also works for named params (foo2)");

sub assign_based_on_named_positional ($x, :$y = $x) { $y } 


is(assign_based_on_named_positional(5), 5, "When we don't explicitly specify, we get the original value");
is(assign_based_on_named_positional(5, y => 2), 2, "When we explicitly specify, we get our value");
is(assign_based_on_named_positional('y'=>2), ('y'=>2), "When we explicitly specify, we get our value");
my $var = "y";
is(assign_based_on_named_positional($var => 2), ("y"=>2),
   "When we explicitly specify, we get our value");

# L<S06/Named arguments/multiple same-named arguments>
#?rakudo skip 'parsefail'
{
    sub named_array(:@x) { +«@x }

    is(eval('named_array(:x)'), (1), 'named array taking one named arg');
    is(eval('named_array(:x, :!x)'), (1, 0), 'named array taking two named args');
    is(eval('named_array(:x(1), :x(2), :x(3))'), (1, 2, 3), 'named array taking three named args');
}

# L<S06/Named arguments/Pairs intended as positional arguments>
#?rakudo skip 'parsefail'
{
    sub named_array2(@x, :@y) { (+«@x, 42, +«@y) }
    # +«(:x) is (0, 1)

    is(eval('named_array2(:!x, :y)'), (0, 42, 1), 'named and unnamed args - two named');
    is(eval('named_array2(:!x, y => 1)'), (0, 42, 1), 'named and unnamed args - two named - fatarrow');
    is(eval('named_array2(:y, :!x)'), (0, 42, 1), 'named and unnamed args - two named - backwards');
    is(eval('named_array2(:y, (:x))'), (0, 1, 42, 1), 'named and unnamed args - one named, one pair');
    is(eval('named_array2(1, 2)'), (1, 42), 'named and unnamed args - two unnamed');
    is(eval('named_array2(:!y, 1)'), (1, 42, 0), 'named and unnamed args - one named, one pos');
    is(eval('named_array2(1, :!y)'), (1, 42, 0), 'named and unnamed args - one named, one pos - backwards');
    is(eval('named_array2(:y, 1, :!y)'), (1, 42, 1, 0), 'named and unnamed args - two named, one pos');
    ok(eval('named_array2(:y, :y)').notdef, 'named and unnamed args - two named with same name');
    is(eval('named_array2(:y, (:x))'), (0, 1, 42, 1), 'named and unnamed args - passing parenthesized pair');
    is(eval('named_array2(:y, (:y))'), (0, 1, 42, 1), 'named and unnamed args - passing parenthesized pair of same name');
    is(eval('named_array2(:y, :z)'), (0, 1, 42, 1), 'named and unnamed args - passing pair of unrelated name');
    is(eval('named_array2(:y, "x" => 1)'), (0, 1, 42, 1), 'named and unnamed args - passing pair with quoted fatarrow');
}

# L<S06/Named parameters/They are marked by a prefix>
# L<S06/Required parameters/declared with a trailing>
sub mandatory (:$param!) {
    return $param;
}

is(mandatory(param => 5) , 5, "named mandatory parameter is returned");
eval_dies_ok('mandatory()',  "not specifying a mandatory parameter fails");

#?rakudo skip 'Cannot apply trait required to parameters yet'
{
    sub mandatory_by_trait (:$param is required) {
        return $param;
    }
    
    is(mandatory_by_trait(param => 5) , 5, "named mandatory parameter is returned");
    dies_ok( { mandatory_by_trait() }, "not specifying a mandatory parameter fails");
}


# L<S06/Named parameters/sub formalize>
sub formalize($text, :$case, :$justify) {
   return($text,$case,$justify); 
}

{
my ($text,$case,$justify)  = formalize('title', case=>'upper');
is($text,'title', "text param was positional");
ok($justify.notdef, "justification param was not given");
is($case, 'upper', "case param was named, and in justification param's position");
}

{
my ($text,$case,$justify)   = formalize('title', justify=>'left');
is($text,'title', "text param was positional");
is($justify, 'left', "justify param was named");
ok($case.notdef, "case was not given at all");
}

{
my  ($text,$case,$justify) = formalize("title", :justify<right>, :case<title>);

is($text,'title', "title param was positional");
is($justify, 'right', "justify param was named with funny syntax");
is($case, 'title', "case param was named with funny syntax");
}

{
sub h($a,$b,$d) { $d ?? h($b,$a,$d-1) !! $a~$b }

is(h('a','b',1),'ba',"parameters don\'t bind incorrectly");
}

# Slurpy Hash Params
{
sub slurpee(*%args) { return %args }
my %fellowship = slurpee(hobbit => 'Frodo', wizard => 'Gandalf');
is(%fellowship<hobbit>, 'Frodo', "hobbit arg was slurped");
is(%fellowship<wizard>, 'Gandalf', "wizard arg was slurped");
is(+%fellowship, 2, "exactly 2 arguments were slurped");
ok(%fellowship<dwarf>.notdef, "dwarf arg was not given");
}

{
    sub named_and_slurp(:$grass, *%rest) { return($grass, %rest) }
    my ($grass, %rest) = named_and_slurp(sky => 'blue', grass => 'green', fire => 'red');
    is($grass, 'green', "explicit named arg received despite slurpy hash");
    is(+%rest, 2, "exactly 2 arguments were slurped");
    is(%rest<sky>, 'blue', "sky argument was slurped");
    is(%rest<fire>, 'red', "fire argument was slurped");
    ok(%rest<grass>.notdef, "grass argument was NOT slurped");
}

{
    my $ref;
    sub setref($refin) {
        $ref = $refin;
    }
    my $aref = [0];
    setref(refin => $aref);
    $aref[0]++;
    is($aref[0], 1, "aref actually implemented");
    is($ref[0], 1, "ref is the same as aref");
}

{
    sub typed_named(Int :$x) { 1 }
    is(typed_named(:x(42)), 1,      'typed named parameters work...');
    is(typed_named(),       1,      '...when value not supplied also...');
    dies_ok({ typed_named("BBQ") }, 'and the type check is enforced');
}

{
    sub renames(:y($x)) { $x }
    is(renames(:y(42)),  42, 'renaming of parameters works');
    is(renames(y => 42), 42, 'renaming of parameters works');
    dies_ok { renames(:x(23)) }, 'old name is not available';
}

# L<S06/Parameters and arguments/"A signature containing a name collision">

eval_dies_ok 'sub rt68086( $a, $a ) { }', 'two sub params with the same name';

#?rakudo 3 todo 'sub params with the same name'
eval_dies_ok 'sub svn28865( $a, :a($b) ) {}',
             'sub params with the same name via renaming';
eval_dies_ok 'sub svn28865( $a, :a(@b) ) {}',
             'sub params with same name via renaming and different types';
eval_dies_ok 'sub svn28865( :$a, :@a ) {}',
             'sub params with the same name and different types';

{
    sub svn28870( $a, @a ) { return ( $a, +@a ) }

    my $item = 'bughunt';
    my @many = ( 22, 'twenty-two', 47 );

    is( svn28870( $item, @many ), ( 'bughunt', 3 ),
        'call to sub with position params of same name and different type' );
}

# RT #68524
{
    sub rt68524( :$a! ) {}
    ok( &rt68524.signature.perl ~~ m/\!/,
        '.signature.perl with required parameter includes requirement' );
}

# RT #69516
{
    sub rt69516( :f($foo) ) { "You passed '$foo' as 'f'" }
    ok( &rt69516.signature.perl ~~ m/ ':f(' \s* '$foo' \s* ')' /,
        'parameter rename appears in .signature.perl' );
}

# L<S06/Named parameters/Bindings happen in declaration order>
{
    my $t = '';
    sub order_test($a where { $t ~= 'a' },
                   $b where { $t ~= 'b' },
                   $c where { $t ~= 'c' }) { 8 };
    is order_test(c => 5, a => 3, b => 2), 8,
        'can fill positional by name';
    ok $t ~~ /a.*b/, '$a was bound before $b';
    ok $t ~~ /a.*c/, '$a was bound before $c';
    ok $t ~~ /b.*c/, '$b was bound before $c';
}

# RT #67558
{
    eval_dies_ok q[sub a(:$x, :foo($x) = $x) { $x }],
        'Cannot rename a parameter to an already existing positional';
    sub a(:$x, :foo($y) = $x) { $y };
    is a(x => 2), 2, 'Can fill named parameter with default from other named';
    is a(foo => 3), 3, 'Can fill in directly even it has a default value';
    is a(x => 2, foo => 3), 3, 'direct fill takes precedence';


}

{
    sub test_positional_named(:@a) { @a.join('|'); }
    is test_positional_named(:a(3, 4, 5)), '3|4|5',
        ':a(1, 2, 3) can be passed to a :@a parameter';
    is test_positional_named(:a[3, 4, 5]), '3|4|5',
        ':a[1, 2, 3] can be passed to a :@a parameter';
    is test_positional_named(:a<3 4 5>), '3|4|5',
        ':a<1 2 3> can be passed to a :@a parameter';

}

{
    sub quoted_named(:$x = 5) { $x };
    dies_ok { quoted_named( "x" => 5 ) }, 'quoted pair key => positional parameter';
}

done_testing;

# vim: ft=perl6
