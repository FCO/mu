use v6;
use Test;

plan 7;

BEGIN { @*INC.push('t/spec/packages') };

use Test::Util;

is_run "use v6;\n'a' =~ /foo/", {
    status  => { $_ != 0 },
    out     => '',
    err     => rx/line \s+ 2>>/
}, 'Parse error contains line number';

is_run "my \$x = 2 * 3;\ndie \$x", {
    status  => { $_ != 0 },
    out     => '',
    err     => all(rx/6/, rx/'line 2'>>/),
}, 'Runtime error contains line number';

is_run "use v6;\n\nsay 'Hello';\nsay 'a'.my_non_existent_method_6R5();",
    {
        status  => { $_ != 0 },
        out     => /Hello\r?\n/,
        err     => all(rx/my_non_existent_method_6R5/, rx/:i 'line 4'/),
    }, 'Method not found error mentions method name and line number';

# RT #75446
is_run 'use v6;
sub bar {
    pfff();
}

bar()',
    {
        status => { $_ != 0 },
        out     => '',
        err     => all(rx/pfff/, rx/'line 3'>>/),
    }, 'got the right line number for nonexisting sub inside another sub';

# RT #74348
{
    subset Even of Int where { $_ %% 2 };
    sub f(Even $x) { $x };
    eval 'f(3)';
    my $e = "$!";
    diag "Error message: $e";
    ok $e ~~ /:i 'type check'/,
        'subset type check fail mentions type check';
    ok $e ~~ /:i constraint/,
        'subset type check fail mentions constraint';
}

# RT #76112
is_run 'use v6;
class A { has $.x is rw };
A.new.x(42);',
    {
        status => { $_ != 0 },
        out     => '',
        err     => rx/'line 3'>>/,
    }, 'got the right line number for accessors';

# vim: ft=perl6
