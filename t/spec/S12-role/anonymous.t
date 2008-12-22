use v6;

use Test;

plan 13;

#?pugs 99 todo 'anonymous roles'

# L<S12/"Roles">
{
  my $a = 3;
  is $a, 3, "basic sanity";
  lives_ok { $a does role { has $.cool = "yeah" }}, "anonymous role mixin";
  is $a, 3, "still basic sanity";
  is $a.cool, "yeah", "anonymous role gave us an attribute";
}

# The same, but we story the anonymous role in a variable
{
  my $a = 3;
  is $a, 3, "basic sanity";
  my $role;
  lives_ok { $role = role { has $.cool = "yeah" } }, "anonymous role definition";
  lives_ok { $a does $role }, "anonymous role variable mixin";
  is $a, 3, "still basic sanity";
  is $a.cool, "yeah", "anonymous role variable gave us an attribute";
}

# Guarantee roles are really first-class-entities:
{
    sub role_generator(Str $val) {
      return role {
        has $.cool = $val;
      }
    }

  my $a = 3;
  is $a, 3, "basic sanity";
  lives_ok {$a does role_generator("hi")}, "role generating function mixin";
  is $a, 3, "still basic sanity";
  is $a.cool, "hi", "role generating function gave us an attribute";
}

# vim: ft=perl6
