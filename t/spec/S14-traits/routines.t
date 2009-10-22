use v6;
use Test;

plan *;

# L<S14/Traits/>

role description {
    has $.description is rw;
}

multi trait_mod:<is>(Routine $code, description, $arg) {
    $code does description($arg);
}
multi trait_mod:<is>(Routine $code, description) {
    $code does description("missing description!");
}
multi trait_mod:<is>(Routine $code, $arg, :$described!) {
    $code does description($arg);
}
multi trait_mod:<is>(Routine $code, :$described!) {
    $code does description("missing description!");
}


sub answer() is description('computes the answer') { 42 }
sub faildoc() is description { "fail" }
is answer(), 42, 'can call sub that has had a trait applied to it by role name with arg';
is &answer.description, 'computes the answer',  'description role applied and set with argument';
is faildoc(), "fail", 'can call sub that has had a trait applied to it by role name without arg';
is &faildoc.description, 'missing description!', 'description role applied without argument';

sub cheezburger is described("tasty") { "nom" }
sub lolcat is described { "undescribable" }

is cheezburger(), "nom", 'can call sub that has had a trait applied to it by named param with arg';
is &cheezburger.description, 'tasty',  'named trait handler applied other role set with argument';
is lolcat(), "undescribable", 'can call sub that has had a trait applied to it by named param without arg';
is &lolcat.description, 'missing description!', 'named trait handler applied other role without argument';

#?rakudo skip 'RT 69893'
{
    my $recorder = '';
    role woowoo { }
    multi trait_mod:<is>(Routine $c, woowoo) {
        $c.wrap: sub {
            $recorder ~= 'wrap';
        }
    }
    sub foo is woowoo { };
    lives_ok &foo, 'Can call subroutine that was wrapped by a trait';
    is $recorder, 'wrap', 'and the wrapper has been called once';
}

done_testing();

# vim: ft=perl6
