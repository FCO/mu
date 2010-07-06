use v6;

use Test;
plan 53;

# smartlink to top and bottom of long table
# L<S03/Reduction operators/"Builtin reduce operators return the following identity values">
# L<S03/Reduction operators/"[Z]()       # []">

is ([**] ()), 1, "[**] () eq 1 (arguably nonsensical)";
is ([*] ()), 1, "[*] () eq 1";
ok( !([/] ()).defined, "[/] () should fail");
ok( !([%] ()).defined, "[%] () should fail");
ok( !([x] ()).defined, "[x] () should fail");
ok( !([xx] ()).defined, "[xx] () should fail");
is ([+&] ()), +^0, "[+&] () eq +^0";
ok( !([+<] ()).defined, "[+<] () should fail");
ok( !([+>] ()).defined, "[+>] () should fail");
ok( !([~&] ()).defined, "[~&] () should fail");
#?rakudo 2 skip "~< and ~> NYI"
ok( !([~<] ()).defined, "[~<] () should fail");
ok( !([~>] ()).defined, "[~>] () should fail");
is ([+] ()), 0, "[+] () eq 0";
is ([-] ()), 0, "[-] () eq 0";
is ([~] ()), '', "[~] () eq ''";
is ([+|] ()), 0, "[+|] () eq 0";
is ([+^] ()), 0, "[+^] () eq 0";
is ([~|] ()), '', "[~|] () eq ''";
is ([~^] ()), '', "[~^] () eq ''";
is ([&] ()).perl, all().perl, "[&] () eq all()";
is ([|] ()).perl, any().perl, "[|] () eq any()";
is ([^] ()).perl, one().perl, "[^] () eq one()";
is ([!==] ()), Bool::True, "[!==] () eq True";
is ([==] ()), Bool::True, "[==] () eq True";
is ([<] ()), Bool::True, "[<] () eq True";
is ([<=] ()), Bool::True, "[<=] () eq True";
is ([>] ()), Bool::True, "[>] () eq True";
is ([>=] ()), Bool::True, "[>=] () eq True";
is ([before] ()), Bool::True, "[before] () eq True";
is ([after] ()), Bool::True, "[after] () eq True";
is ([~~] ()), Bool::True, "[~~] () eq True";
is ([!~~] ()), Bool::True, "[!~~] () eq True";
is ([eq] ()), Bool::True, "[eq] () eq True)";
is ([!eq] ()), Bool::True, "[!eq] () eq True";
is ([lt] ()), Bool::True, "[lt] () eq True";
is ([le] ()), Bool::True, "[le] () eq True";
is ([gt] ()), Bool::True, "[gt] () eq True";
is ([ge] ()), Bool::True, "[ge] () eq True";
#?rakudo 2 skip '=!= NYI'
is ([=:=] ()), Bool::True, "[=:=] () eq True";
is ([!=:=] ()), Bool::True, "[!=:=] () eq True";
#?rakudo skip '=== still in PIR'
is ([===] ()), Bool::True, "[===] () eq True";
is ([!===] ()), Bool::True, "[!===] () eq True";
is ([eqv] ()), Bool::True, "[eqv] () eq True";
is ([!eqv] ()), Bool::True, "[!eqv] () eq True";
#?rakudo 3 skip "[...] not implemented"
is ([&&] ()), Bool::True, "[&&] () eq True";
is ([||] ()), Bool::True, "[||] () eq True";
is ([^^] ()), Bool::True, "[^^] () eq True";
is ([//] ()), Any, "[//] () is Any";
is ([,] ()), (), "[,] () eq ()";
is ([Z] ()), [], "[Z] () eq []";

is ([==] 3), Bool::True, 'unary [==]';
is ([!=] 3), Bool::True, 'unary [!=]';
#?rakudo 3 skip "[!==] not implemented"
is ([!==] 3), Bool::True, 'unary [!==]';

# vim: ft=perl6
