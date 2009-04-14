use v6;

use Test;

plan 4;

# L<S12/Introspection/"the object's identity value">
class Foo {}

my $num_objects = 20;

my %foos;
for (1 .. $num_objects) {
    my $f = Foo.new();
    %foos{$f.WHICH()} = 1
}

is(+%foos, $num_objects, '... all our .WHICH()s were unique');

# XXX is 'is required' specced? if so, where?
class Dog {
    has Str $.dogtag is required;
    has Num $.weight;
    method WHICH { $.dogtag }
}

my Dog $spot .= new(:dogtag<SPOT01>, :weight<10.1>);

# check that we can refer to a dog with its tag
#?pugs todo 'oo'
is(Dog.new(:dogtag<SPOT01>).weight, 10.1,
   "WHICH is one basis for memoized instances");

# test singletons
class Boosh {
    has $.name;
    has @.cast is rw;
    method BUILD {
        $!name = "The Mighty";
    }
    method WHICH {
        $.name;
    }
}

my $foo = Boosh.new;
is($foo."WHICH", "The Mighty", "Which Boosh?");
$foo.cast.push("Julian Barratt");
$foo.cast.push("Noel Fielding");

#?pugs todo 'oo'
is_deeply(Boosh.new.cast, [ "Julian Barratt", "Noel Fielding" ],
          "There is only one instance of $foo.WHICH $foo.WHAT");
