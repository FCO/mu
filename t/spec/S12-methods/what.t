use v6;

use Test;

=begin pod

=head1 DESCRIPTION

This test tests the C<WHAT> builtin.

=end pod

# L<S12/Introspection/"WHAT">

plan 14;

# Basic subroutine/method form tests for C<WHAT>.
{
  my $a = 3;
  ok((WHAT $a) === Int, "subroutine form of WHAT");
  ok(($a.WHAT) === Int, "method form of WHAT");
}

# Now testing basic correct inheritance.
{
  my $a = 3;
  ok($a.WHAT ~~ Num,    "an Int isa Num");
  ok($a.WHAT ~~ Object, "an Int isa Object");
}

# And a quick test for Code:
{
  my $a = sub ($x) { 100 + $x };
  ok($a.WHAT === Sub,    "a sub's type is Sub");
  ok($a.WHAT ~~ Routine, "a sub isa Routine");
  ok($a.WHAT ~~ Code,    "a sub isa Code");
}

# L<S12/Introspection/"which also bypasses the macros.">

{
    class Foo {
        method WHAT {'Bar'}
    }
    my $o = Foo.new;
    is($o."WHAT", 'Bar', '."WHAT" calls the method instead of the macro');
    #?rakudo todo '.WHAT not (easily overridable)'
    is($o.WHAT,   'Foo', '.WHAT still works as intended');
    my $meth = "WHAT";
    #?rakudo skip 'indirect method calls'
    is($o.$meth,  'Bar', '.$meth calls the method instead of the macro');
}

# these used to be Rakudo regressions, RT #62006

{
    # proto as a term
    lives_ok {  Match }, 'proto as a term lives';
    lives_ok { +Match }, 'numification of proto lives';
    isa_ok ("bac" ~~ /a/).WHAT, Match, '.WHAT on a Match works';
    is +("bac" ~~ /a/).WHAT, 0, 'numification of .WHAT of a Match works';
}

# RT #66928
{
    lives_ok { &infix:<+>.WHAT }, 'Can .WHAT built-in infix op';
    isa_ok &infix:<+>.WHAT, Multi, '.WHAT of built-in infix op is Multi';
}
