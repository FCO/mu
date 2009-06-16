use v6;

use Test;

plan 12;

# L<S12/"Construction and Initialization">

class OwnConstr {
    has $.x = 13;
    my $in_own = 0;
    method own() {
        $in_own++;
        return self.bless(self.CREATE(), :x(42));
    }
    method in_own {
        $in_own;
    }
}
ok OwnConstr.new ~~ OwnConstr, "basic class instantiation";
is OwnConstr.new.x, 13,        "basic attribute access";
# As usual, is instead of todo_is to suppress unexpected succeedings
is OwnConstr.in_own, 0,                   "own constructor was not called";
ok OwnConstr.own ~~ OwnConstr, "own construction instantiated its class";
is OwnConstr.own.x, 42,        "attribute was set from our constructor";
#?rakudo todo 'unknown'
is OwnConstr.in_own, 1,            "own constructor was actually called";


# L<"http://www.mail-archive.com/perl6-language@perl.org/msg20241.html">
# provide constructor for single positional argument

class Foo {
  has $.a;
  has $.string;
  
  method new ($self: Str $string) {
    my $s = $self.bless(*, string => $string);
    $!a = $string;
    return $s;
  }
}


ok Foo.new("a string") ~~ Foo, '... our Foo instance was created';

#?rakudo todo 'unknown'
is Foo.new("a string").a, 'a string', "our own 'new' was called", :todo<feature>;


# Using ".=" to create an object
{
  class Bar { has $.attr }
  my Bar $bar .= new(:attr(42));
  is $bar.attr, 42, "instantiating an object using .= worked (1)";
}
# Using ".=()" to create an object
{ 
  class Fooz { has $.x }
  my Fooz $f .= new(:x(1));
  is $f.x, 1, "instantiating an object using .=() worked";
}

{
  class Baz { has @.x is rw }
  my Baz $foo .= new(:x(1,2,3));
  lives_ok -> { $foo.x[0] = 3 }, "Array initialized in auto-constructor is not unwritable...";
  is $foo.x[0], 3, "... and keeps its value properly."
}	
