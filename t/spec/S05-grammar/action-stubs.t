use v6;

use Test;

plan 12;

# L<S05/Grammars/"and optionally pass an action object">

grammar A::Test::Grammar {
    rule  TOP { <a> <b> }
    token a   { 'a' \w+ {*} }
    token b   { 'b' \w+ {*} }
}

class An::Action1 {
    has $.in-a = 0;
    has $.in-b = 0;
    has $.calls = '';
    method a($/) {
        $!in-a++;
        $!calls ~= 'a';
    }
    method b($x) {    #OK not used
        $!in-b++;
        $!calls ~= 'b';
    }
}

ok A::Test::Grammar.parse('alpha beta'), 'basic sanity: .parse works';
my $action = An::Action1.new();
lives_ok { A::Test::Grammar.parse('alpha beta', :actions($action)) },
        'parse with :action (and no make) lives';
is $action.in-a, 1, 'first action has been called';
is $action.in-b, 1, 'second action has been called';
is $action.calls, 'ab', '... and in the right order';

# L<S05/Bracket rationalization/"An explicit reduction using the make function">

{
    grammar Grammar::More::Test {
        rule TOP { <a> <b><c> {*} }
        token a { \d+ {*} }
        token b { \w+ {*} }
        token c { '' }      # no action stub
    }
    class Grammar::More::Test::Actions {
        method TOP($/) {
            make [ $<a>.ast, $<b>.ast ];
        }
        method a($/) {
            make 3 + $/;
        }
        method b($/) {
            # the given/when is pretty pointless, but rakudo
            # used to segfault on it, so test it here
            # http://rt.perl.org/rt3/Ticket/Display.html?id=64208
            given 2 {
                when * {
                    make $/ x 3;
                }
            }
        }
        method c($/) {
            #die "don't come here";
            # There's an implicity {*} at the end now
        }
    }

    # there's no reason why we can't use the actions as class methods
    my $match = Grammar::More::Test.parse('39 b', :actions(Grammar::More::Test::Actions));
    ok $match, 'grammar matches';
    isa_ok $match.ast, Array, '$/.ast is an Array';
    ok $match.ast.[0] == 42,  'make 3 + $/ worked';
    is $match.ast.[1], 'bbb',  'make $/ x 3 worked';
}

# used to be a Rakudo regression, RT #64104
{
    grammar Math {
        token TOP { ^ <value> $ {*} }
        token value { \d+ {*} }
    }
    class Actions {
        method value($/) { make 1..$/};
        method TOP($/)   { make 1 + $/<value>};
    }
    my $match = Math.parse('234', :actions(Actions.new));
    ok $match,  'can parse with action stubs that make() regexes';
    is $match.ast, 235, 'got the right .ast';

}

# another former rakudo regression, RT #71514
{
    grammar ActionsTestGrammar {
        token TOP {
            ^ .+ $
        }
    }
    class TestActions {
        method TOP($/) {
            "a\nb".subst(/\n+/, '', :g);
            make 123;
        }
    }

    is ActionsTestGrammar.parse("ab\ncd", :actions(TestActions.new)).ast, 123,
        'Can call Str.subst in an action method without any trouble';
}


# vim: ft=perl6
