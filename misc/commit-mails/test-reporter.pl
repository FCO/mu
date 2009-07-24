#!/usr/bin/perl

use strict;
use warnings;
use 5.010;

use MIME::Lite;
use Pod::Usage;
use Getopt::Long;

my %OPT = (
    smtp => 'localhost',
);

Getopt::Long::Configure( 'bundling' );
GetOptions(
    'dir|d=s'     => \$OPT{dir},
    'from|f=s'    => \$OPT{from},
    'smtp=s'      => \$OPT{smtp},

    'help|h'      => sub { pod2usage(1) },
    'man'         => sub { pod2usage( -exitstatus => 0, -verbose => 2 ) },
) or pod2usage(2);

if ( ! $OPT{from} ) {
    warn "specify a 'from' address with -f";
    pod2usage(2);
}

chdir $OPT{dir} or die "Can't chdir to (-d) '$OPT{dir}': $!";

if ( 0 != system qq( git svn rebase --quiet 2> /dev/null > /dev/null ) ) {
    die "Can't update";
}

my $prev = 'ec0d6d9b012dd3b082394e57669507313d039baf';
if (-e 'previous_mail_hash') {
    $prev = `cat previous_mail_hash`;
    chomp $prev;
}

open my $h, '-|', 'git', qw(log --reverse --pretty=format:%H:%an:%s),
    "$prev..HEAD"
    or die "Error while launching git log: $!";

my $msg_rx = qr{
    test s?
    \s+
    (?: for \s+ )?
    \[?
        (?: bug | rt | perl )
        \s* [#]? (?<bugno> \d+ )
    \]?
}xmsi;

while (<$h>) {
    chomp;
    my ($hash, $author, $msg) = split /:/;

    next unless $msg =~ $msg_rx;

    my $bugno = $+{bugno};
    $prev = $hash;
    system("echo $prev > previous_mail_hash");

    my @files = filelist_for_hash($hash);
    next unless @files;

    my $files = @files == 1
        ? "$files[0]"
        : "at least one of these files: " . join(q{, }, @files);

    my $diff = qx/git show $hash/;
#    say $msg;
    my $mail = MIME::Lite->new(
            From    => $OPT{from},
            To      => 'perl6-bugs-followup@perl.org',
            Subject => "[perl #$bugno] tests available",
            Type    => 'TEXT',
            Data    => "This is an automatically generated mail to "
                       . "inform you that tests are now available in "
                       . $files
                       . "\n\n"
                       . $diff,
    );
    $mail->send('smtp', $OPT{smtp});
    sleep 1;
}
 
sub filelist_for_hash {
    my $hash = shift;
    my @res = qx/git show $hash/;
    chomp @res;
    return
        map { s{^b/}{}; $_ }
        map { (split ' ', $_, 2)[1] }
        grep { /^\+\+\+ b/ } @res;
}
__END__

=head1 NAME

test-reporter.pl -- report tests of RT tickets via email

=head1 SYNOPSIS

test-reporter.pl -d <dir>

 Options:
   -h, --help              brief help message
       --man               full documentation
   -d, --dir               where to find a git-svn checkout of pugs
   -f, --from              email address for the from line
       --smtp              SMTP server to use to send mail

=head1 DESCRIPTION

This is meant to be run as a cron job.  It assumes there's a checkout of
the Pugs repository using git-svn.  Specify the location of this repo
with the B<-d> option.  It will go there, update the repo, and look through
recent commits for commit messages of a form that indicates a test was
written for a bug report.  If it finds a commit like that, it will generate
an email to rt.perl.org to note the existence of the test in the ticket.

=head1 OPTIONS

=over 8

=item B<--help>

=item B<-h>

Print a brief help message and exit.

=item B<--man>

Print the full documentation and exit.

=item B<--dir>

=item B<-d>

This specifies the directory in which to find a checkout of the Pugs
repository using git-svn.

=item B<--from>

=item B<-f>

Specifies the email address to use on outgoing emails.

=item B<--smtp>

Default: localhost

SMTP server to use to send email.

=back

=head1 AUTHOR

Moritz Lenz

=cut
