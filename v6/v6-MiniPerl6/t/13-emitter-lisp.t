use v6-alpha;

class Main {
    say '1..4';
    my $m := ::Val::Num( num => 123 );
    # say $m.emit;
    if ($m.emit) eq '123' {
        say 'ok 1';
    }
    else {
        say 'not ok 1';
    }

    $m := ::Val::Buf( buf => 'abc' );
    say '# value is ', $m.emit;
    if ($m.emit) eq '"abc"' {
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

    $m := ::Lit::Array( array => [ ::Val::Int( int => 1 ), ::Val::Buf( buf => "2" ) ] );
    say '# array:  ', $m.emit;

# token

    token num1 { 5 }
    $m := Main.num1( '5', 0 );
    say '# match scalar: ', $$m;
    if ($$m) eq '5' {
        say 'ok 4';
    }
    else {
        say 'not ok 4';
    }

# make

    token num2 { 5 { make 123 } }
    $m := Main.num2( '5', 0 );
    say '# match scalar: ', $$m;
    say '# match capture: ', $m.capture;
    if ($m.capture) == 123 {
        say 'ok 5';
    }
    else {
        say 'not ok 5';
    }

# named subcapture

    token num3 { 5 <MiniPerl6::Grammar.word> 2 }
    $m := Main.num3( '5x2', 0 );
    say '# match scalar: ', $$m;
    say '# match capture: ', $m.capture;
    my $cap := scalar( ($m.hash){'MiniPerl6::Grammar.word'} );
    say '# match named capture: ', $cap;
    say '# bool value (true): ', ?$m;
    if ($cap eq 'x') {
        say 'ok 6';
    }
    else {
        say 'not ok 6';
    }
    $m := Main.num3( '5?2', 0 );
    say '# bool value (false): ', ?$m;
    if ($m) {
        say 'not ok 7';
    }
    else {
        say 'ok 7';
    }

}

