use v6;

use Test;

=begin kwid 

.isa() tests

These tests are specific to the .isa() which is attached to the
Perl6 Array "class". Which is actually @array.HOW.isa(), which 
is actually just the normal OO .isa(). This test does not attempt
to test anything other than the "normal" behavior of @array.isa()

Further clarification of .isa() can be found here:

L<"http://www.nntp.perl.org/group/perl.perl6.language/20974">
L<S29/Any/=item isa/>

=end kwid 

plan 15;

{ # invocant notation  
    my @arr = <1 2 3 4>;
    
    ok(@arr.isa(Array), '... @arr is-a Array (invocant notation)');
    ok(@arr.isa(List), '... @arr is-also-a List (invocant notation)');
    
    # check a failing case
    ok(!@arr.isa(Hash), '... @arr is-not-a Hash (invocant notation)');
}


{ # invocant notation   
    my $arr_ref = <1 2 3 4>;
    
    ok($arr_ref.isa(Array), '... $arr is-a Array (invocant notation)');
    ok($arr_ref.isa(List), '... $arr is-also-a List (invocant notation)');

    # check a failing case
    ok(!$arr_ref.isa(Hash), '... $arr is-not-a Hash (invocant notation)');      
}

# check error cases

{
    my @arr = <1 2 3 4>;
    eval_dies_ok 'isa(@arr, Array)', 'no sub called isa()';
    dies_ok { @arr.isa() }, '... isa() with a single arg is a failing case (invocant notation)';  
      
    dies_ok { @arr.isa(Array, Hash)  }, '... isa() with a extra args is a failing case (invocant notation)';        
}

## some edge cases, and weirdness

{ # check .isa() on inline values

    ok([1, 2, 3, 4].isa(Array), '... [1, 2, 3, 4].isa("Array") works');
    ok(![1, 2, 3, 4].isa(Hash), '... [1, 2, 3, 4].isa("Hash") fail predicably');    
}

class Thing {};
{
    my $thing = Thing.new();
    ok($thing.isa("Thing"));
    ok($thing.isa(Thing));
}
class Thing::something {};
{
    my $thing = Thing::something.new();
    ok($thing.isa("Thing::something"));
    ok($thing.isa(Thing::something));
}

# vim: ft=perl6
