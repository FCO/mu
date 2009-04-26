use v6;

use Test;

plan 28;

=begin pod

Parameterized role tests, see L<S14/Roles>

Might need some more review and love --moritz

=end pod

#?pugs emit skip_rest('parameterized roles'); exit;
#?pugs emit =begin SKIP

# L<S14/Roles/to be considered part of the long name:>
  role InitialAttribVal[$val] {
    has $.attr = $val;
  }

my $a;
lives_ok {$a does InitialAttribVal[42]},
  "imperative does to apply a parametrized role (1)";
is $a.attr, 42,
  "attribute was initialized correctly (1)";
ok $a.HOW.does($a, InitialAttribVal),
  ".HOW.does gives correct information (1-1)";
ok $a.^does(InitialAttribVal),
  ".^does gives correct information (1-1)";
ok $a.HOW.does($a, InitialAttribVal[42]),
  ".HOW.does gives correct information (1-2)";
ok $a.^does(InitialAttribVal[42]),
  ".^does gives correct information (1-2)";

my $b;
lives_ok { $b does InitialAttribVal[23] },
  "imperative does to apply a parametrized role (2)";
is $b.attr, 23,
  "attribute was initialized correctly (2)";
ok $b.HOW.does($b, InitialAttribVal),
  ".HOW.does gives correct information (2-1)";
ok $b.^does(InitialAttribVal),
  ".^does gives correct information (2-1)";
ok $b.HOW.does($b, InitialAttribVal[23]),
  ".HOW.does gives correct information (2-2)";
ok $b.^does(InitialAttribVal[23]),
  ".^does gives correct information (2-2)";



# L<S14/Roles/A role's main type is generic by default>
role InitialAttribType[::vartype] {
    method hi(vartype $foo) { 42 }
}
my $c;
lives_ok { $c does InitialAttribType[Code] },
  "imperative does to apply a parametrized role (3)";
ok $c.HOW.does($c, InitialAttribType),
  ".HOW.does gives correct information (3-1)";
ok $c.^does(InitialAttribType),
  ".^does gives correct information (3-1)";
ok $c.HOW.does($c, InitialAttribType[Code]),
  ".HOW.does gives correct information (3-2)";
ok $c.^does(InitialAttribType[Code]),
  ".^does gives correct information (3-2)";
is $c.hi(sub {}), 42,
  "type information was processed correctly (1)";
dies_ok { $c.hi("not a code object") },
  "type information was processed correctly (2)";


# Parameterized role using both a parameter which will add to the "long name"
# of the role and one which doesn't.
# (Explanation: This one is easier. The two attributes $.type and $.name will
# be predefined (using the role parameterization). The $type adds to the long
# name of the role, $name does not. Such:
#   my $a does InitialAttribBoth["foo", "bar"];
#   my $b does InitialAttribBoth["foo", "grtz"];
#   $a ~~ InitialAttribBoth                ==> true
#   $b ~~ InitialAttribBoth                ==> true
#   $a ~~ InitialAttribBoth["foo"]         ==> true
#   $b ~~ InitialAttribBoth["foo"]         ==> true
#   $a ~~ InitialAttribBoth["foo", "bar"]  ==> false
#   $b ~~ InitialAttribBoth["foo", "grtz"] ==> false
# Heavy stuff, eh?)
  role InitialAttribBoth[Str $type;; Str $name] {
    has $.type = $type;
    has $.name = $name;
  }
my $d;
lives_ok { $d does InitialAttribBoth["type1", "name1"] },
  "imperative does to apply a parametrized role (4)";
ok $d.HOW.does($d, InitialAttribType),
  ".HOW.does gives correct information (4-1)";
ok $d.^does(InitialAttribType),
  ".^does gives correct information (4-1)";
#?rakudo 4 skip '.does with parametric roles'
ok $d.HOW.does($d, InitialAttribType["type1"]),
  ".HOW.does gives correct information (4-2)";
ok $d.^does(InitialAttribType["type1"]),
  ".^does gives correct information (4-2)";
ok !$d.HOW.does($d, InitialAttribType["type1", "name1"]),
  ".HOW.does gives correct information (4-3)";
ok !$d.^does(InitialAttribType["type1", "name1"]),
  ".^does gives correct information (4-3)";
is $d.type, "type1", ".type works correctly";
is $d.name, "name1", ".name works correctly";

#?pugs emit =end SKIP

# vim: ft=perl6
