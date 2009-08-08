use v6;

use Test;

plan 9;

=begin pod

Very basic meta-class tests from L<S12/Introspection>

=end pod

class Foo:ver<0.0.1> {
    method bar ($param) returns Str {
        return "baz" ~ $param
    }
};

# L<S12/Introspection/should be called through the meta object>

#?pugs emit skip_rest('meta class NYI');
#?pugs emit exit;

ok(Foo.HOW.can(Foo, 'bar'), '... Foo can bar');
#?rakudo skip 'precedence of HOW'
ok(HOW(Foo).can(Foo, 'bar'), '... Foo can bar (anthoer way)');
#?rakudo skip 'precedence of prefix:<^>'
ok(^Foo.can(Foo, 'bar'), '... Foo can bar (another way)');
ok(Foo.^can('bar'), '... Foo can bar (as class method)');
ok(Foo.HOW.isa(Foo, Foo), '... Foo is-a Foo (of course)');
ok(Foo.^isa(Foo), '... Foo is-a Foo (of course) (as class method)');

# L<S12/Introspection/Class traits may include:>

#?rakudo skip '.name'
is Foo.^name(), 'Foo', '... the name() property is Foo';
#?rakudo skip '.version, version number parsing'
is Foo.^version(), v0.0.1, '... the version() property is 0.0.1';
#?rakudo skip '.layout'
is Foo.^layout, P6opaque, '^.layout';

# vim: ft=perl6
