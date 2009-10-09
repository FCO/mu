use v6;
use Test;

# L<S32::IO/IO::DirectoryNode/chdir>

plan 10;

dies_ok { chdir() }, 'Cannot call chdir without an argument';

### Although you can use Unix style folder separator / to set folders, what's returned
### is in the native style, such as \ for windows
my $sep = '/';
if $*OS eq "MSWin32" {
    $sep = '\\';
}

# change to t subfolder and see if cwd is updated
my $subdir = 't';
if $subdir !~~ :d {
    skip 7, "Directory, '$subdir', does not exist";
}
else {
    my $cwd = $*CWD;
    ok chdir("$*CWD/$subdir"), 'chdir gave a true value';
    isnt $*CWD, $cwd, 'Directory has changed';
    is $*CWD, "$cwd{$sep}$subdir",
       "Current directory is '$subdir' subfolder (absolute)";

    # relative change back up.
    ok chdir( ".." ), 'chdir gave a true value';
    is $*CWD, $cwd, 'Change back up to .. worked';

    # relative change to t
    ok chdir( "$subdir" ), 'chdir gave a true value';
    is $*CWD, "$cwd{$sep}$subdir",
       "Current directory is '$subdir' subfolder (relative)";
}

my $no_subdir = 'lol does not exist';
if $no_subdir ~~ :d {
    skip 2, "subdir '$no_subdir' does exist, actually.";
}
else {
    lives_ok { chdir("$no_subdir") },
             'chdir to a non-existent does not by default throw an exception';
    ok !chdir("$no_subdir"),
       'change to non-existent directory gives a false value';
}

# vim: ft=perl6
