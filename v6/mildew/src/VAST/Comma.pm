package VAST::Comma;
use utf8;
use strict;
use warnings;
use AST::Helpers;

#returns a list of nodes
sub emit_m0ld {
    my $m = shift;
    map {$_->emit_m0ld} @{$m->{list}};
}

1;
