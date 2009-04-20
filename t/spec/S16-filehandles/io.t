use v6;

use Test;

# L<S16/"Filehandles, files, and directories"/"open">
# L<S16/"Filehandles, files, and directories"/"close">
# L<S16/Unfiled/IO.get>

=begin pod

I/O tests

=end pod

plan 62;

#?pugs emit if $*OS eq "browser" {
#?pugs emit   skip_rest "Programs running in browsers don't have access to regular IO.";
#?pugs emit   exit;
#?pugs emit }


sub nonce () { return ".{$*PID}." ~ (1..1000).pick() }
my $filename = 'tempfile_filehandles_io' ~ nonce();

# create and write a file

my $out = open($filename, :w);
isa_ok($out, IO);
$out.say("Hello World");
$out.say("Foo Bar Baz");
$out.say("The End");
ok($out.close, 'file closed okay');

# read the file all possible ways

my $in1 = open($filename);
isa_ok($in1, IO);
my $line1a = get($in1);
is($line1a, "Hello World", 'get($in) worked (and autochomps)');
is $in1.ins, 1, 'read one line (.ins)';
my $line1b = get($in1);
is($line1b, "Foo Bar Baz", 'get($in) worked (and autochomps)');
is $in1.ins, 2, 'read two lines (.ins)';
my $line1c = get($in1);
is($line1c, "The End", 'get($in) worked');
is $in1.ins, 3, 'read three lines (.ins)';
ok($in1.close, 'file closed okay (1)');

my $in2 = open($filename);
isa_ok($in2, IO);
my $line2a = $in2.get();
is($line2a, "Hello World", '$in.get() worked');
my $line2b = $in2.get();
is($line2b, "Foo Bar Baz", '$in.get() worked');
my $line2c = $in2.get();
is($line2c, "The End", '$in.get() worked');
ok($in2.close, 'file closed okay (2)');

# L<S02/Files/you now write>
my $in3 = open($filename);
isa_ok($in3, IO);
#?rakudo 3 skip '$fh.get'
{
    my $line3a = $in3.get;
    is($line3a, "Hello World", '$in.get worked(1)');
    my $line3b = $in3.get;
    is($line3b, "Foo Bar Baz", '$in.get worked(2)');
    my $line3c = $in3.get;
    is($line3c, "The End", '$in.get worked(3)');
}
ok($in3.close, 'file closed okay (3)');

# append to the file

my $append = open($filename, :a);
isa_ok($append, IO);
$append.say("... Its not over yet!");
ok($append.close, 'file closed okay (append)');

# now read in in list context

my $in4 = open($filename);
isa_ok($in4, IO);
my @lines4 = lines($in4);
#?rakudo 2 todo 'line counts'
is(+@lines4, 4, 'we got four lines from the file');
is $in4.ins, 4, 'same with .ins';
is(@lines4[0], "Hello World", 'lines($in) worked in list context');
is(@lines4[1], "Foo Bar Baz", 'lines($in) worked in list context');
is(@lines4[2], "The End", 'lines($in) worked in list context');
is(@lines4[3], "... Its not over yet!", 'lines($in) worked in list context');
ok($in4.close, 'file closed okay (4)');

my $in5 = open($filename);
isa_ok($in5, IO);
my @lines5 = $in5.lines();
is(+@lines5, 4, 'we got four lines from the file');
is(@lines5[0], "Hello World", '$in.lines() worked in list context');
is(@lines5[1], "Foo Bar Baz", '$in.lines() worked in list context');
is(@lines5[2], "The End", '$in.lines() worked in list context');
is(@lines5[3], "... Its not over yet!", '$in.lines() worked in list context');
ok($in5.close, 'file closed okay (5)');

my $in6 = open($filename);
isa_ok($in6, IO);
my @lines6 = $in6.lines;
#?rakudo todo 'line counts'
is(+@lines6, 4, 'we got four lines from the file');
is(@lines6[0], "Hello World", '$in.lines worked in list context');
is(@lines6[1], "Foo Bar Baz", '$in.lines worked in list context');
is(@lines6[2], "The End", '$in.lines worked in list context');
is(@lines6[3], "... Its not over yet!", '$in.lines worked in list context');
ok($in6.close, 'file closed okay (6)');

# test reading a file into an array and then closing before 
# doing anything with the array (in other words, is pugs too lazy)
my $in7 = open($filename);
isa_ok($in7, IO);
my @lines7 = lines($in7,3);
push @lines7, "and finally" ~ $in7.get;
ok($in7.close, 'file closed okay (7)');
is(+@lines7, 4, 'we got four lines from the file (lazily)');
is(@lines7[0], "Hello World", 'lines($in,3) worked in list context');
is(@lines7[1], "Foo Bar Baz", 'lines($in,3) worked in list context');
is(@lines7[2], "The End", 'lines($in,3) worked in list context');
is(@lines7[3], "and finally... Its not over yet!", 'get($in) worked after lines($in,$n)');

#now be sure to delete the file as well

is(unlink($filename), 1, 'file has been removed');

# new file for testing other types of open() calls

my $out8 = open($filename, :w);
isa_ok($out8, IO);
$out8.say("Hello World");
ok($out8.close, 'file closed okay (out8)');

my $in8 = open($filename);
isa_ok($in8, IO);
my $line8_1 = get($in8);
is($line8_1, "Hello World", 'get($in) worked');
ok($in8.close, 'file closed okay (in8)');

my $fh9 = open($filename, :r, :w);  # was "<+" ? 
isa_ok($fh9, IO);
#my $line9_1 = get($fh9);
#is($line9_1, "Hello World");
#$fh9.say("Second line");
ok($fh9.close, 'file closed okay (9)');

#my $in9 = open($filename);
#isa_ok($in9, IO);
#my $line9_1 = get($in9);
#my $line9_2 = get($in9);
#is($line9_1, "Hello World", 'get($in) worked');
#is($line9_2, "Second line", 'get($in) worked');

#?rakudo skip ':rw on open() unimplemented'
{
    my $fh10 = open($filename, :rw);  # was "<+" ? 
    isa_ok($fh10, IO);
    #ok($fh10.close, 'file closed okay (10)');
}

#?pugs todo 'buggy on Win32'
ok(unlink($filename), 'file has been removed');
ok $filename !~~ :e, '... and the tempfile is gone, really';

# vim: ft=perl6
