use v6-alpha;

class Main {
    say '1..3';
    my $m := ::MiniPerl6::Match( str => 'abcdef', from => 2, to => 4 );
    # say 'match scalar: ', $$m;
    if ($$m) eq 'cd' {
        say 'ok 1';
    }
    else {
        say 'not ok 1';
    }

    $<abc> := 3;
    # say '# value is [', $<abc>,']';
    if ($<abc>) == 3 {
        say 'ok 2';
    }
    else {
        say 'not ok 2';
    }

    $m := MiniPerl6::Grammar.word( 'abcdef', 2 );
    # say 'match scalar: ', $$m;
    if ($$m) eq 'c' {
        say 'ok 3';
    }
    else {
        say 'not ok 3';
    }
}
