use v6;

use MONKEY_TYPING;

use Test;

# L<S02/Lists>
# XXX -- Lists are not real datatypes, but I haven't found a better location
# for this test. See
# L<"http://www.nntp.perl.org/group/perl.perl6.language/22924">

plan *;

# Indexing lists
{
  my $foo = 42;

  try { ($foo, "does_not_matter")[0] = 23 };
  #?pugs todo 'bug'
  is $foo, 23, "assigning a list element changed the original variable";
}

#?rakudo skip 'indexing with *-2'
{
  my $foo = 42;

  is ($foo, "does_not_matter")[*-2], 42,
    "indexing lists by a negative index works correctly";
}

# List construction does not create new containers
{
  my $foo = 42;

  #?pugs todo 'unspecced'
  ok ($foo, "does_not_matter")[0] =:= $foo,
    "list construction should not create new containers";
}

{
  my $foo = 42;
  #?pugs todo 'unspecced'
  ok ($foo, "does_not_matter", 17)[0,1][0] =:= $foo,
    "list construction and list slicing should not create new containers";
}

# Lists as lvalues
{
  my $foo = 42;
  my $bar = 43;

  ($foo, $bar) = (23, 24);
  ok $foo == 23 && $bar eq 24,
    "using lists as lvalues works";
}

{
  my $foo = 42;

  lives_ok { ($foo, *) = (23, 24) },
    "using lists with embedded Whatevers as lvalues works (1)";
  ok $foo == 23,
    "using lists with embedded Whatevers as lvalues works (2)";
}

# List slices as lvalues
{
  my $foo = 42;
  my $bar = 43;

  try { ($foo, 42, $bar, 19)[0, 2] = (23, 24) };
  #?rakudo todo 'lvalue list slices'
  ok $foo == 23 && $bar == 24,
    "using list slices as lvalues works (1)";

  #?rakudo todo 'lvalue list slices'
  dies_ok { ($foo, 42, $bar, 19)[1, 3] = (23, 24) },
    "using list slices as lvalues works (2)";
}

# Lists as lvalues used to swap variables
{
  my $foo = 42;
  my $bar = 23;

  ($foo, $bar) = ($bar, $foo);
  ok $foo == 23 && $bar == 42,
    "using lists as lvalues to swap two variables works";
}

{
  my $foo = 1;
  my $bar = 2;
  my $baz = 3;

  ($foo, $bar, $baz) = ($baz, $foo, $bar);
  ok $foo == 3 && $bar == 1 && $baz == 2,
    "using lists as lvalues to swap three variables works";
}

# Lists as lvalues to swap, this time we use binding instead of assignment
#?rakudo skip 'list binding'
{
  my $foo = 42;
  my $bar = 23;

  ($foo, $bar) := ($bar, $foo);
  ok $foo == 23 && $bar == 42,
    "using lists as lvalues in a binding operation to swap two variables works";

  $foo = "some_new_value";
  is $foo, "some_new_value",
    "the vars didn't lose the readwrite-ness";
}

#?rakudo skip 'list binding'
{
  my $foo = 1;
  my $bar = 2;
  my $baz = 3;

  ($foo, $bar, $baz) := ($baz, $foo, $bar);
  ok $foo == 3 && $bar == 1 && $baz == 2,
    "using lists as lvalues in a binding operation to swap three variables works";
}

#?rakudo skip 'auto-dereferencing of captures (?)'
{
  my @array    = (1,2,3);
  my $arrayref = \@array;

  is +$arrayref,    3, '\@array creates an arrayref (1)';
  is +$arrayref[1], 2, '\@array creates an arrayref (2)';
}

{
    sub List::rt62836 { 62836 }

    dies_ok { <1 2 3>.rt62836 },
            'call to user-declared sub in List:: class dies';
    eval '<1 2 3>.rt62836';
    ok "$!" ~~ /rt62836/,       'error message contains name of sub';
    ok "$!" ~~ /not \s+ found/, 'error message says "not found"';
    diag $!;
    ok "$!" ~~ /Seq|Parcel/,    'error message contains name of class';

    augment class List { method rt62836_x { 62836 } };
    #?rakudo skip 'unskip when "augment" works'
    is <1 2 3>.rt62836_x, 62836, 'call user-declared method in List:: class';
}

# RT #66304
{
    my $rt66304 = (1, 2, 4);
    isa_ok $rt66304, Seq, 'List assigned to scalar is-a Seq';
    #?rakudo todo 'exact list type'
    is( $rt66304.WHAT, (1, 2, 4).WHAT,
        'List.WHAT is the same as .WHAT of list assigned to scalar' );
    dies_ok { $rt66304[1] = 'ro' }, 'literal List element is immutable';
    is $rt66304, (1, 2, 4), 'List is not changed by attempted assignment';

    my $x = 44;
    $rt66304 = ( 11, $x, 22 );
    dies_ok { $rt66304[1] = 'rw' }, 'variable List element is immutable';
    is $x, 44, 'variable not changed via assignment to list element';
}

done_testing;

# vim: ft=perl6
