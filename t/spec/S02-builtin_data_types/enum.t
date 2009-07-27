use v6;

use Test;

plan 40;
# L<S12/Enums>
{
    my %hash; eval '%hash = enum «:Mon(1) Tue Wed Thu Fri Sat Sun»';

    #is((%hash<Mon Tue Wed Thu Fri Sat Sun>) »eq« (1 .. 7)), "enum generated correct sequence");
    #?pugs 3 todo
    is(%hash<Mon>, 1, "first value ok");
    is(%hash<Thu>, 4, "fourth value ok");
    is(%hash<Sun>, 7, "last value ok");
};

{
    my %hash; eval '%hash = enum «:Two(2) Three Four»';

    #is((%hash<Two Three Four>) »eq« (2 .. 4)), "enum generated correct sequence");
    #?pugs 3 todo
    is(%hash<Two>, 2, "first value ok");
    is(%hash<Three>, 3, "second value ok");
    is(%hash<Four>, 4, "last value ok");
};

my %hash;

#?rakudo skip 'Parse error: Statement not terminated properly'
#?pugs 3 todo 'feature'
lives_ok { %hash = enum <<:Sun(1) :Mon(2) :Tue(3) :Wed(4) :Thu(5) :Fri(6) :Sat(7)>>; }, 'specifying keys and values works...';

is %hash.keys, <Sun Mon Tue Wed Thu Fri Sat>, '...and the right keys are assigned';

is %hash.values, 1..7, '...and the right values are assigned';

%hash = ();

#?rakudo skip 'Parse error: Statement not terminated properly'
#?pugs 3 todo 'feature'
lives_ok { %hash = enum <<:Sun(1) Mon Tue Wed Thu Fri Sat>>; }, 'specifying a value for only the first key works...';

is %hash.keys, <Sun Mon Tue Wed Thu Fri Sat>, '...and the right keys are assigned';

is %hash.values, 1..7, '...and the right values are assigned';

%hash = ();

#?rakudo skip 'Parse error: Statement not terminated properly'
#?pugs 3 todo 'feature'
lives_ok { %hash = enum «:Sun(1) Mon Tue Wed Thu Fri Sat»; }, 'french quotes work...';

is %hash.keys, <Sun Mon Tue Wed Thu Fri Sat>, '...and the right keys are assigned';

is %hash.values, 1..7, '...and the right values are assigned';

%hash = ();

#?rakudo skip 'Parse error: Statement not terminated properly'
#?pugs 3 todo 'feature'
lives_ok { %hash = enum <<:Sun(1) Mon Tue :Wed(4) Thu Fri Sat>>; }, 'specifying continuous values in the middle works...';

is %hash.keys, <Sun Mon Tue Wed Thu Fri Sat>, '...and the right keys are assigned';

is %hash.values, 1..7, '...and the right values are assigned';

%hash = ();

#?rakudo skip 'Parse error: Statement not terminated properly'
#?pugs 3 todo 'feature'
lives_ok { %hash = enum <<:Sun(1) Mon Tue :Wed(5) Thu Fri Sat>>; }, 'specifying different values in the middle works...';

is %hash.keys, <Sun Mon Tue Wed Thu Fri Sat>, '...and the right keys are assigned';

is %hash.values, (1, 2, 3, 5, 6, 7, 8), '...and the right values are assigned';

%hash = ();

#?rakudo skip 'Parse error: Statement not terminated properly'
#?pugs 3 todo 'feature'
lives_ok { %hash = enum «:Alpha<A> Bravo Charlie Delta Echo»; }, 'specifying a string up front works';

is %hash.keys, <Alpha Bravo Charlie Delta Echo>, '...and the right keys are assigned';

is %hash.values, <A B C D E>, '...and the right values are assigned';

%hash = ();

eval q[
lives_ok { %hash = enum <<:Alpha<A> Bravo Charlie Delta Echo>>; }, 'specifying a string up front works (Texas quotes)', :todo<feature>;
];

#?pugs todo 'feature'
is %hash.keys, <Alpha Bravo Charlie Delta Echo>, '...and the right keys are assigned';

#?pugs todo 'feature'
is %hash.values, <A B C D E>, '...and the right values are assigned';

%hash = ();

#?rakudo skip 'Parse error: Statement not terminated properly'
#?pugs 3 todo 'feature'
lives_ok { %hash = enum «:zero(0) one two three four five six seven eight nine :ten<a> eleven twelve thirteen fourteen fifteen»; }, 'mixing strings and integers works';

is %hash.keys, <zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen>, '...and the right keys are assigned';

is %hash.values, (0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'), '...and the right values are assigned';

%hash = ();

# RT #63826
{
    class EnumClass     { enum C <a b c> }
    #?rakudo todo 'RT #63826'
    lives_ok { EnumClass::C::a }, 'can refer to enum element in class';
    #?rakudo skip 'RT #63826'
    is EnumClass::C::a, 0, 'enum element in class has the right value';

    module EnumModule   { enum M <a b c> }
    #?rakudo todo 'RT #63826'
    lives_ok { EnumModule::M::a }, 'can refer to enum element in module';
    #?rakudo skip 'RT #63826'
    is EnumModule::M::b, 1, 'enum element in module has the right value';

    package EnumPackage { enum P <a b c> }
    #?rakudo todo 'RT #63826'
    lives_ok { EnumPackage::P::a }, 'can refer to enum element in package';
    #?rakudo skip 'RT #63826'
    is EnumPackage::P::c, 2, 'enum element in package has the right value';

    role EnumRole       { enum R <a b c> }
    #?rakudo todo 'RT #63826'
    lives_ok { EnumRole::R::a }, 'can refer to enum element in role';
    #?rakudo skip 'RT #63826'
    is EnumRole::R::a, 0, 'enum element in role has the right value';

    grammar EnumGrammar { enum G <a b c> }
    #?rakudo todo 'RT #63826'
    lives_ok { EnumGrammar::G::a }, 'can refer to enum element in grammar';
    #?rakudo skip 'RT #63826'
    is EnumGrammar::G::b, 1, 'enum element in grammar has the right value';
}
