use v6;

use Test;

plan 33;

# L<S12/"Parallel dispatch"/"Any of the method call forms may be turned into a hyperoperator">
# syn r14547

class Foo {
    has $.count is rw;
    method doit {$.count++}
    method !priv {$.count++}
}

class Bar is Foo {
    method doit {$.count++;}
}

{
    my @o = (5..10).map({Foo.new(count => $_)});
    is(@o.map({.count}), (5..10), 'object sanity test');
    @o».doit;
    is(@o.map({.count}), (6..11), 'parallel dispatch using » works');
    @o>>.doit;
    is(@o.map({.count}), (7..12), 'parallel dispatch using >> works');
    @o»!priv;
    is(@o.map({.count}), (8..13), 'parallel dispatch to a private using »! works');
    @o>>!priv;
    is(@o.map({.count}), (9..14), 'parallel dispatch to a private using >>! works');
}

{
    my @o = (5..10).map({Foo.new(count => $_)});
    is(@o.map({.count}), (5..10), 'object sanity test');
    lives_ok({@o».?not_here},  'parallel dispatch using @o».?not_here lives');
    lives_ok({@o>>.?not_here}, 'parallel dispatch using @o>>.?not_here lives');
    dies_ok({@o».not_here},    'parallel dispatch using @o».not_here dies');
    dies_ok({@o>>.not_here},   'parallel dispatch using @o>>.not_here dies');

    @o».?doit;
    is(@o.map({.count}), (6..11), 'parallel dispatch using @o».?doit works');
    @o>>.?doit;
    is(@o.map({.count}), (7..12), 'parallel dispatch using @o>>.?doit works');
    #?rakudo 2 todo 'is_deeply does not think map results are the same as list on LHS'
    is_deeply @o».?not_here, @o.map({ Nil }),
              '$obj».?nonexistingmethod returns a list of Nil';
    is_deeply @o».?count, @o.map({.count}),
              '$obj».?existingmethod returns a list of the return values';
}

{
    my @o = (5..10).map({Bar.new(count => $_)});
    is(@o.map({.count}), (5..10), 'object sanity test');
    lives_ok({@o».*not_here},  'parallel dispatch using @o».*not_here lives');
    lives_ok({@o>>.*not_here}, 'parallel dispatch using @o>>.*not_here lives');
    dies_ok({@o».+not_here},   'parallel dispatch using @o».+not_here dies');
    dies_ok({@o>>.+not_here},  'parallel dispatch using @o>>.+not_here dies');

    @o».*doit;
    is(@o.map({.count}), (7..12), 'parallel dispatch using @o».*doit works');
    @o».+doit;
    is(@o.map({.count}), (9..14), 'parallel dispatch using @o».*doit works');
}

{
    is(<a bc def ghij klmno>».chars,  (1, 2, 3, 4, 5), '<list>».method works');
    is(<a bc def ghij klmno>>>.chars, (1, 2, 3, 4, 5), '<list>>>.method works');
}

{
    my @a = -1, 2, -3;
    my @b = -1, 2, -3;
    @a».=abs;
    is(@a, [1,2,3], '@list».=method works');
    @b>>.=abs;
    is(@b, [1,2,3], '@list>>.=method works');
}

# more return value checking
{
    class PDTest {
        has $.data;
        multi method mul(Int $a) {
            $.data * $a;
        }
        multi method mul(Num $a) {
            $.data * $a.Int  * 2
        }
    }

    my @a = (1..3).map: { PDTest.new(data => $_ ) };
    my $method = 'mul';

    is_deeply @a».mul(3), (3, 6, 9),  'return value of @a».method(@args)';
    is_deeply @a»."$method"(3), (3, 6, 9),  '... indirect';

    is_deeply @a».?mul(3), (3, 6, 9), 'return value of @a».?method(@args)';
    is_deeply @a».?"$method"(3), (3, 6, 9), '... indirect';

    #?rakudo 4 todo 'is_deeply does not think map results are the same as list on LHS'
    is_deeply @a».+mul(2), ([2, 4], [4, 8], [6, 12]),
              'return value of @a».+method is a list of lists';
    is_deeply @a».+"$method"(2), ([2, 4], [4, 8], [6, 12]),
              '... indirect';

    is_deeply @a».*mul(2), ([2, 4], [4, 8], [6, 12]),
              'return value of @a».*method is a list of lists';
    is_deeply @a».*"$method"(2), ([2, 4], [4, 8], [6, 12]),
              '... indirect';
}

# vim: ft=perl6
