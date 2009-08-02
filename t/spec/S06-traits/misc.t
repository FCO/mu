use v6;

use Test;

plan 20;

=begin description

Testing parameter traits for subroutines

=end description

# L<S06/"Parameter traits">

my $foo=1;

# note: many of these errors can be detected at compile time, so need
# eval_dies_ok instead of dies_ok
#
# test twice, once with assignment and once with increment, rakudo
# used to catch the first but not the latter.
#
eval_dies_ok '
    my $tmp = 1;
    sub mods_param ($x) { $x++; }
    mods_param($tmp)
    ',
    'can\'t modify parameter, constant by default';

eval_dies_ok '
    my $tmp = 1;
    sub mods_param ($x) { $x = 1; }
    mods_param($tmp)
    ',
    'can\'t modify parameter, constant by default';

# is readonly
eval_dies_ok 'sub mods_param_constant ($x is readonly) { $x++; };
              mods_param_constant($foo);' ,
              'can\'t modify constant parameter, constant by default';

sub mods_param_rw ($x is rw) { $x++; }
#?rakudo todo "'is rw' can't modify constants"
dies_ok  { mods_param_rw(1) }, 'can\'t modify constant even if we claim it\'s rw';
sub mods_param_rw_does_nothing ($x is rw) { $x; }
lives_ok { mods_param_rw_does_nothing(1) }, 'is rw with non-lvalue should autovivify';

lives_ok  { mods_param_rw($foo) }, 'pass by "is rw" doesn\'t die';
is($foo, 2, 'pass by reference works');

#icopy
$foo=1;
sub mods_param_copy ($x is copy) {$x++;}
lives_ok { mods_param_copy($foo) }, 'is copy';
is($foo, 1, 'pass by value works');

# same test with default value
sub boom ($arg is copy = 0) { $arg++ }

lives_ok { boom(42) }, "can modify a copy";


# is ref
#?rakudo skip 'is ref'
{
    $foo=1;
    sub mods_param_ref ($x is ref) { $x++;  }
    dies_ok { mods_param_ref(1); }, 'is ref with non-lvalue';
    #?pugs todo
    lives_ok { mods_param_ref($foo); }, 'is ref with non-lvalue';
    #?pugs todo
    is($foo, 2, 'is ref works');
}


# with <-> we should still obey readonly traits
{
    my $anon1 = <-> $a is readonly, $b { $b++ };
    my $anon2 = <-> $a is readonly, $b { $a++ };
    my $x = 1;
    $anon1($x, $x);
    is($x, 2,                   '<-> does not override explicit traints (sanity)');
    dies_ok({ $anon2($x, $x) }, '<-> does not override explicit traints');
    is($x, 2,                   '<-> does not override explicit traints (sanity)');
}

# is context
# Doesn't even compile, which is lucky, because I don't understand it well
# enough to write an actual test...
ok(eval('sub my_format (*@data is context(Item)) { }; 1'), "is context - compile check");

# To do - check that is context actually works

#?rakudo todo 'RT 60966'
{
    eval 'sub oh_noes( $gack is nonesuch ) { }';

    ok  $!  ~~ Exception,  "Can't use an unknown trait";
    ok "$!" ~~ /trait/,    'error message mentions trait';
    ok "$!" ~~ /nonesuch/, 'error message mentions the name of the trait';
}

# vim: ft=perl6
