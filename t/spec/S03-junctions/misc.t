use v6;

use Test;

plan 99;

=begin pod

Misc. Junction tests 

=end pod

#?rakudo skip 'Null PMC access in get_integer() (RT #64184)'
isa_ok any(6,7), Junction;
is any(6,7).WHAT, Junction, 'Junction.WHAT works';

# avoid auto-threading on ok()
sub jok(Object $condition, $msg?) { ok ?($condition), $msg };

# L<S03/Junctive operators>
# L<S09/Junctions>
{

    # initalize them all to empty strings
    my $a = '';
    my $b = '';
    my $c = '';
    
    # make sure they all match to an empty string
    jok('' eq ($a & $b & $c), 'junction of ($a & $b & $c) matches an empty string');
    jok('' eq all($a, $b, $c), 'junction of all($a, $b, $c) matches an empty string');   
    
    # give $a a value
    $a = 'a';  
    
    # make sure that at least one of them matches 'a' 
    jok('a' eq ($b | $c | $a), 'junction of ($b | $c | $a) matches at least one "a"');
    jok('a' eq any($b, $c, $a), 'junction of any($b, $c, $a) matches at least one "a"');   

    jok('' eq ($b | $c | $a), 'junction of ($b | $c | $a) matches at least one empty string');
    jok('' eq any($b, $c, $a), 'junction of any($b, $c, $a) matches at least one empty string');
    
    # make sure that ~only~ one of them matches 'a'
    jok('a' eq ($b ^ $c ^ $a), 'junction of ($b ^ $c ^ $a) matches at ~only~ one "a"');
    jok('a' eq one($b, $c, $a), 'junction of one($b, $c, $a) matches at ~only~ one "a"');
    
    # give $b a value
    $b = 'a';
    
    # now this will fail
    jok('a' ne ($b ^ $c ^ $a), 'junction of ($b ^ $c ^ $a) matches at more than one "a"');              

    # change $b and give $c a value
    $b = 'b';
    $c = 'c';
    
    jok('a' eq ($b ^ $c ^ $a), 'junction of ($b ^ $c ^ $a) matches at ~only~ one "a"');
    jok('b' eq ($a ^ $b ^ $c), 'junction of ($a ^ $b ^ $c) matches at ~only~ one "b"');
    jok('c' eq ($c ^ $a ^ $b), 'junction of ($c ^ $a ^ $b) matches at ~only~ one "c"');  

    jok('a' eq ($b | $c | $a), 'junction of ($b | $c | $a) matches at least one "a"');
    jok('b' eq ($a | $b | $c), 'junction of ($a | $b | $c) matches at least one "b"');
    jok('c' eq ($c | $a | $b), 'junction of ($c | $a | $b) matches at least one "c"'); 

    ok(not(('a' eq ($b | $c | $a)) === Bool::False), 'junctional comparison doesn not mistakenly return both true and false');
    ok(not(('b' eq ($a | $b | $c)) === Bool::False), 'junctional comparison doesn not mistakenly return both true and false');
    ok(not(('c' eq ($c | $a | $b)) === Bool::False), 'junctional comparison doesn not mistakenly return both true and false'); 
    
    # test junction to junction
    jok(('a' | 'b' | 'c') eq ($a & $b & $c), 'junction ("a" | "b" | "c") matches junction ($a & $b & $c)');    
    jok(('a' & 'b' & 'c') eq ($a | $b | $c), 'junction ("a" & "b" & "c") matches junction ($a | $b | $c)'); 
    
    # mix around variables and literals
    
    jok(($a & 'b' & 'c') eq ('a' | $b | $c), 'junction ($a & "b" & "c") matches junction ("a" | $b | $c)');              
    jok(($a & 'b' & $c) eq ('a' | $b | 'c'), 'junction ($a & "b" & $c) matches junction ("a" | $b | "c")');              
    
}

# same tests, but with junctions as variables
{
        # initalize them all to empty strings
    my $a = '';
    my $b = '';
    my $c = '';
    
    my $all_of_them = $a & $b & $c;
    jok('' eq $all_of_them, 'junction variable of ($a & $b & $c) matches and empty string');
    
    $a = 'a';  
    
    my $any_of_them = $b | $c | $a;
    jok('a' eq $any_of_them, 'junction variable of ($b | $c | $a) matches at least one "a"');  
    jok('' eq $any_of_them, 'junction variable of ($b | $c | $a) matches at least one empty string');
    
    my $one_of_them = $b ^ $c ^ $a;
    jok('a' eq $one_of_them, 'junction variable of ($b ^ $c ^ $a) matches at ~only~ one "a"');
    
    $b = 'a';
    
    {
        my $one_of_them = $b ^ $c ^ $a;
        jok('a' ne $one_of_them, 'junction variable of ($b ^ $c ^ $a) matches at more than one "a"');              
    }
    
    $b = 'b';
    $c = 'c';
    
    {
        my $one_of_them = $b ^ $c ^ $a;    
        jok('a' eq $one_of_them, 'junction of ($b ^ $c ^ $a) matches at ~only~ one "a"');
        jok('b' eq $one_of_them, 'junction of ($a ^ $b ^ $c) matches at ~only~ one "b"');
        jok('c' eq $one_of_them, 'junction of ($c ^ $a ^ $b) matches at ~only~ one "c"');  
    }

    {
        my $any_of_them = $b | $c | $a;
        jok('a' eq $any_of_them, 'junction of ($b | $c | $a) matches at least one "a"');
        jok('b' eq $any_of_them, 'junction of ($a | $b | $c) matches at least one "b"');
        jok('c' eq $any_of_them, 'junction of ($c | $a | $b) matches at least one "c"'); 
    }

}

{
    my $j = 1 | 2;
    $j = 5;
    is($j, 5, 'reassignment of junction variable');
}

{
    my $j;
    my $k;
    my $l;

    $j = 1|2;
    is(~WHAT($j), 'Junction()', 'basic junction type reference test');

    $k=$j;
    is(~WHAT($k), 'Junction()', 'assignment preserves reference');

    # XXX does this next one make any sense?
    $l=\$j;
    is(~WHAT($l), 'Junction()', 'hard reference to junction');
}


=begin description

Tests junction examples from Synopsis 03 

j() is used to convert a junction to canonical string form, currently
just using .perl until a better approach presents itself.

=end description

# L<S03/Junctive operators>

# Canonical stringification of a junction
sub j (Junction $j) { return $j.perl }

{
    # L<S03/Junctive operators/They thread through operations>
    my $got;
    my $want;
    $got = ((1|2|3)+4);
    $want = (5|6|7);
    is( j($got), j($want), 'thread + returning junctive result');

    $got = ((1|2) + (3&4));
    $want = ((4|5) & (5|6));
    is( j($got), j($want), 'thread + returning junctive combination of results');

    # L<S03/Junctive operators/This opens doors for constructions like>
    # unless $roll == any(1..6) { print "Invalid roll" }
    my $roll;
    my $note;
    $roll = 3; $note = '';
    unless $roll == any(1..6) { $note = "Invalid roll"; };
    is($note, "", 'any() junction threading ==');

    $roll = 7; $note = '';
    unless $roll == any(1..6) { $note = "Invalid roll"; };
    is($note, "Invalid roll", 'any() junction threading ==');

    # if $roll == 1|2|3 { print "Low roll" }
    $roll = 4; $note = '';
    if $roll == 1|2|3 { $note = "Low roll" }
    is($note, "", '| junction threading ==');

    $roll = 2; $note = '';
    if $roll == 1|2|3 { $note = "Low roll" }
    is($note, "Low roll", '| junction threading ==');
}

#?rakudo skip 'Junctions as subscripts'
{
    # L<S03/Junctive operators/Junctions work through subscripting>
    my $got;
    my @foo;
    $got = ''; @foo = ();
    $got ~= 'y' if try { @foo[any(1,2,3)] };
    is($got, '', "junctions work through subscripting, 0 matches");

    $got = ''; @foo = (0,1);
    $got ~= 'y' if try { @foo[any(1,2,3)] };
    is($got, '', "junctions work through subscripting, 1 match");

    $got = ''; @foo = (1,1,1);
    $got ~= 'y' if try { @foo[any(1,2,3)] };
    is($got, '', "junctions work through subscripting, 3 matches");


    # L<S03/Junctive operators/Junctions are specifically unordered>
    # Compiler *can* reorder and parallelize but *may not* so don't test
    # for all(@foo) {...};  

    # Not sure what is expected
    #my %got = ('1' => 1); # Hashes are unordered too
    #@foo = (2,3,4);
    #for all(@foo) { %got{$_} = 1; };
    #is( %got.keys.sort.join(','), '1,2,3,4',
    #    'for all(...) { ...} as parallelizable');
}

=begin description

These are implemented but still awaiting clarification on p6l.

 On Fri, 2005-02-11 at 10:46 +1100, Damian Conway wrote:
 > Subject: Re: Fwd: Junctive puzzles.
 >
 > Junctions have an associated boolean predicate that's preserved across 
 > operations on the junction. Junctions also implicitly distribute across 
 > operations, and rejunctify the results.

=end description

# L<S03/Junctive operators/They thread through operations>

{
    my @subs = (sub {3}, sub {2});

    my $got;
    my $want;

    is(j(any(@subs)()), j(3|2), '.() on any() junction of subs');

    $want = (3&2);
    $got = all(@subs)();
    is(j($got), j($want), '.() on all() junction of subs');

    $want = (3^2);
    $got = one(@subs)();
    is(j($got), j($want), '.() on one() junction of subs');

    $want = none(3,2);
    $got = none(@subs)();
    is(j($got), j($want), '.() on none() junction of subs');

    $want = one( any(3,2), all(3,2) );
    $got = one( any(@subs), all(@subs) )();
    is(j($got), j($want), '.() on complex junction of subs');

    # Avoid future constant folding
    #my $rand = rand;
    #my $zero = int($rand-$rand);
    #my @subs = (sub {3+$zero}, sub {2+$zero});
}

# Check functional and operator versions produce the same structure
{
    is(j((1|2)^(3&4)), j(one(any(1,2),all(3,4))),
        '((1|2)^(3&4)) equiv to one(any(1,2),all(3,4))');

    is(j((1|2)&(3&4)), j(all(any(1,2),all(3,4))), 
        '((1|2)&(3&4)) equiv to all(any(1,2),all(3,4))');

    is(j((1|2)|(3&4)), j(any(any(1,2),all(3,4))),
        '((1|2)|(3&4)) equiv to any(any(1,2),all(3,4))');
}

# junction in boolean context
ok(?(0&0) == ?(0&&0), 'boolean context');
ok(?(0&1) == ?(0&&1), 'boolean context');
ok(?(1&1) == ?(1&&1), 'boolean context');
ok(?(1&0) == ?(1&&0), 'boolean context');
ok(!(?(0&0) != ?(0&&0)), 'boolean context');
ok(!(?(0&1) != ?(0&&1)), 'boolean context');
ok(!(?(1&1) != ?(1&&1)), 'boolean context');
ok(!(?(1&0) != ?(1&&0)), 'boolean context');


{
    my $c = 0;
    if 1 == 1 { $c++ }
    is $c, 1;
    if 1 == 1|2 { $c++ }
    is $c, 2;
    if 1 == 1|2|3 { $c++ }
    is $c, 3;

    $c++ if 1 == 1;
    is $c, 4;
    $c++ if 1 == 1|2;
    is $c, 5, 'if modifier with junction should be called once';

    $c = 0;
    $c++ if 1 == 1|2|3;
    is $c, 1, 'if modifier with junction should be called once';

    $c = 0;
    $c++ if 1 == any(1, 2, 3);
    is $c, 1, 'if modifier with junction should be called once';
}

{
    my @array = <1 2 3 4 5 6 7 8>;
    jok( all(@array) == one(@array), "all(@x) == one(@x) tests uniqueness(+ve)" );

    push @array, 6;
    jok( !( all(@array) == one(@array) ), "all(@x) == one(@x) tests uniqueness(-ve)" );

}

# used to be a rakudo regression (RT #60886)
ok ?(undef & undef ~~ undef), 'undef & undef ~~ undef works';

## See also S03-junctions/autothreading.t
#?rakudo skip 'substr on juctions'
{
  is substr("abcd", 1, 2), "bc", "simple substr";
  my $res = substr(any("abcd", "efgh"), 1, 2);
  isa_ok $res, "Junction";
  ok $res eq "bc", "substr on Junctions: bc";
  ok $res eq "fg", "substr on Junctions: fg";
}

#?rakudo skip 'substr on juctions'
{
  my $res = substr("abcd", 1|2, 2);
  isa_ok $res, "Junction";
  ok $res eq "bc", "substr on Junctions: bc"; 
  ok $res eq "cd", "substr on Junctions: cd";
}

#?rakudo skip 'substr on juctions'
{
  my $res = substr("abcd", 1, 1|2);
  isa_ok $res, "Junction";
  ok $res eq "bc", "substr on Junctions: bc"; 
  ok $res eq "b", "substr on Junctions: b"; 
}

#?rakudo skip 'index on juctions'
{
  my $res = index(any("abcd", "qwebdd"), "b");
  isa_ok $res, "Junction";
  ok $res == 1, "index on Junctions: 1";
  ok $res == 3, "index on Junctions: 3";
}

#?rakudo skip 'index on juctions'
{
  my $res = index("qwebdd", "b"|"w");
  isa_ok $res, "Junction";
  ok $res == 1, "index on Junctions: 1";
  ok $res == 3, "index on Junctions: 3";
}

# Naive implementation of comparing two Junctions
sub junction_diff(Object $this, Object $that) {
  if ($this.WHAT ne 'Junction()' and $that.WHAT ne 'Junction()') {
    return if $this ~~ $that;
  }
  if ($this.WHAT ne 'Junction()' and $that.WHAT eq 'Junction()') {
    return "This is not a Junction";
  }
  if ($this.WHAT eq 'Junction()' and $that.WHAT ne 'Junction()') {
    return "That is not a Junction";
  }
  my ($this_type) = $this.perl ~~ /^(\w+)/;
  my ($that_type) = $that.perl ~~ /^(\w+)/;
  if ($this_type ne $that_type) {
    return "This is $this_type, that is $that_type";
  }

  my @these = sort $this.eigenstates;
  my @those = sort $that.eigenstates;
  my @errors;
  for @these -> $value {
    if $value !~~ any(@those) {
      push @errors, "$value is missing from that";
    }
  }
  for @those -> $value {
    if $value !~~ any(@these) {
      push @errors, "$value is missing from this";
    }
  }
  return @errors if @errors;
  return;
}
{
  ok(! junction_diff(1, 1),     'no Junctions');
  is_deeply(junction_diff(1, 1|2), "This is not a Junction",  'Left value is not a Junction');
  is_deeply(junction_diff(1|2, 1), "That is not a Junction",  'Right value is not a Junction');
  ok(! junction_diff(1|2, 1|2), 'same any junctions');
  is_deeply(junction_diff(1|2, 1&2), 'This is any, that is all', 'different junction types');
  is_deeply(junction_diff(1|2|3, 1|2), ["3 is missing from that"], 'Value is missing from right side');
  is_deeply(junction_diff(1|2, 1|2|3), ["3 is missing from this"], 'Value is missing from left side');
}

# RT #63686
{
    lives_ok { try { for any(1,2) -> $x {}; } },
             'for loop over junction in try block';

    sub rt63686 {
        for any(1,2) -> $x {};
        return 'happiness';
    }
    is rt63686(), 'happiness', 'for loop over junction in sub';
}

# vim: ft=perl6
