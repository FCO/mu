use v6;
use Test;

plan *;

# L<S03/Meta operators/Nesting of metaoperators/Any infix function may be referred to as a noun either by the normal long form or a short form>

ok &infix:<+>  === &[+],  'long and short form are the same (+)';
ok &infix:<==> === &[==], 'long and short form are the same (==)';
is sort( &[<=>], <5 3 2 1 4> ), <1 2 3 4 5>, 'sort works using &[<=>]';

is &[+](1, 2), 3, '&[+] as a function';
is 1 [+] 2, 3, '[+] as an infix';

# test nesting with Rop -- tests stolen from reverse.t and nested in various ways

is 4 R[+] 5, 5 + 4, "4 R[+] 5";
isa_ok 4 R[+] 5, (5 + 4).WHAT, "4 R[+] 5 is the same type as 5 + 4";
is 4 [R-] 5, 5 - 4, "4 [R-] 5";
isa_ok 4 [R-] 5, (5 - 4).WHAT, "4 [R-] 5 is the same type as 5 - 4";
is 4 [R*] 5, 5 * 4, "4 [R*] 5";
isa_ok 4 [R*] 5, (5 * 4).WHAT, "4 [R*] 5 is the same type as 5 * 4";
is 4 R[/] 5, 5 / 4, "4 R[/] 5";
isa_ok 4 R[/] 5, (5 / 4).WHAT, "4 R[/] 5 is the same type as 5 / 4";

is 4 R[cmp] 5, 5 cmp 4, "4 R[cmp] 5";
isa_ok 4 R[cmp] 5, (5 cmp 4).WHAT, "4 R[cmp] 5 is the same type as 5 cmp 4";

is 3 R[/] 9 + 5, 8, 'R[/] gets precedence of /';
is 4 R[-] 5 [R/] 10, -2, "Rop gets the precedence of op";
is (10 R[...] 1, 3), (1, 3, 5, 7, 9), "Rop gets list_infix precedence correctly";

# test nesting with zip -- tests stolen from zip.t and nested

is (<a b> Z[~] <1 2>), <a1 b2>, 'zip-concat produces expected result';
is (1,2 [Z*] 3,4), (3,8), 'zip-product works';
is (1,2 [Z[cmp]] 3,2,0), (-1, 0), 'zip-cmp works';

# reduce

#?rakudo 2 skip "[[+]] doesn't work'"
is ([[+]] 1, 20, 300, 4000), 4321, "[[+]] works";
is ([R[+]] 1, 20, 300, 4000), 4321, "[R[+]] works";

# crazy stuff
{
    our sub infix:<blue>($a, $b) { 
        $a % $b 
    }
    is 1031 [blue] 4, 3, "1031 [blue] 4 == 3";
}

done_testing;

# vim: ft=perl6
