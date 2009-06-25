package VAST::parameter;
use utf8;
use strict;
use warnings;
use AST::Helpers;

sub emit_m0ld_ahsig_BIND {
    my ($m, $count) = @_;
    if ($m->{param_var}) {
      if ($m->{quant} eq '|') {
        call 'STORE' => (call 'postcircumfix:{ }' => reg '$scope',
			[ string $m->{param_var}{sigil}{sym}.$m->{param_var}{name}[0]{TEXT}]),
			  [ reg '$capture' ];
      } elsif ($m->{quant} eq '\\') {
        call 'STORE' => (call 'postcircumfix:{ }' => reg '$scope',
			[ string $m->{param_var}{sigil}{sym}.$m->{param_var}{name}[0]{TEXT}]),
			  [call 'positional' => reg '$capture',[integer($count) ]];;
      } else {
        call 'BIND' => (call 'postcircumfix:{ }' => reg '$scope',
			[ string $m->{param_var}{sigil}{sym}.$m->{param_var}{name}[0]{TEXT}]),
			  [call 'positional' => reg '$capture',[integer($count) ]];
      }
    } elsif ($m->{named_param}) {
        my $ident = $m->{named_param}{param_var}{name}[0]{TEXT};
        my $sigil = $m->{named_param}{param_var}{sigil}{sym};
        call 'BIND' => (call 'postcircumfix:{ }' => reg '$scope',
			[ string $sigil.$ident ]),
			  [call 'named' => reg '$capture',[string $ident ]];
    } else {
        XXX;
    }
}
sub emit_m0ld {
    my $m = shift;
    my $type;
    my $trait = $m->{trait}[0]{trait_auxiliary}{longname}{name}{identifier}{TEXT} || 'readonly';
    my $var;
    if ($m->{param_var}) {
        if ($m->{quant} eq '|') {
            $type = 'WholeCaptureParam';
        } elsif ($trait eq 'ref') {
            $type = 'RefParam';
        } elsif ($trait eq 'readonly') {
            $type = 'ReadonlyParam';
        } else {
            die "unknow type of param $trait";
        }
        $var = $m->{param_var};
    } elsif ($m->{named_param}) {
        $type = 'NamedReadonlyParam';
        $var = $m->{named_param}{param_var};
    }
    my $type_constraint = $m->{type_constraint}[0]{fulltypename}{typename}[0]{longname}{name}{identifier}{TEXT};
    my $param = FETCH(call new => lookupf($type));
    let $param, sub {
        my $param = shift;
        AST::Seq->new(stmts => [
            call(STORE => (call variable => $param),[ string $var->{sigil}{sym}.$var->{name}[0]{TEXT}]),
            call(STORE => (call name => $param),[ string $var->{name}[0]{TEXT} ]),
            $type_constraint ?  call(STORE => (call type => $param),[ lookupf($type_constraint) ]) : (),
            $param]
        );
    }
}


1;
