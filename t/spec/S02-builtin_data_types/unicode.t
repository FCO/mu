use v6;

use Test;
plan 15;

#L<S02/"Built-In Data Types"/".bytes, .codes or .graphs">

# LATIN CAPITAL LETTER A, COMBINING GRAVE ACCENT
my Str $u = "\x[0041,0300]";
is $u.bytes, 3, 'combining À is three bytes as utf8';
is $u.codes, 2, 'combining À is two codes';
is $u.graphs, 1, 'combining À is one graph';
is "foo\r\nbar".codes, 8, 'CRLF is 2 codes';
is "foo\r\nbar".graphs, 7, 'CRLF is 1 graph';

# Speculation, .chars is unspecced, also use Bytes etc.
is $u.chars, 1, '.chars defaults to .graphs';

#L<S02/"Built-In Data Types"/"coerce to the proper units">
    $u = "\x[41,
            E1,
            41, 0300,
            41, 0302, 0323,
            E0]";

#?pugs 9 todo ''
is eval('substr $u, 3.as(Bytes),  1.as(Bytes)'),  "\x[41]",             'substr with Bytes as units - utf8';
is eval('substr $u, 3.as(Codes),  1.as(Codes)'),  "\x[0300]",           'substr with Codes as units - utf8';
is eval('substr $u, 4.as(Graphs), 1.as(Graphs)'), "\x[E0]",             'substr with Graphs as units - utf8';
is eval('substr $u, 3.as(Graphs), 1.as(Codes)'),  "\x[41]",             'substr with Graphs and Codes as units 1 - utf8';
is eval('substr $u, 4.as(Codes),  1.as(Graphs)'), "\x[41, 0302, 0323]", 'substr with Graphs and Codes as units 2 - utf8';
is eval('substr $u, 4.as(Bytes),  1.as(Codes)'),  "\x[0300]",           'substr with Bytes and Codes as units 1 - utf8';
is eval('substr $u, 1.as(Codes),  2.as(Bytes)'),  "\x[E1]",             'substr with Bytes and Codes as units 2 - utf8';
is eval('substr $u, 3.as(Bytes),  1.as(Graphs)'), "\x[41, 0300]",       'substr with Bytes and Graphs as units 1 - utf8';
is eval('substr $u, 3.as(Graphs), 1.as(Bytes)'),  "\x[41]",             'substr with Bytes and Graphs as units 2 - utf8';


#vim: ft=perl6
