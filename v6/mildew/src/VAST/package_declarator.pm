package VAST::package_declarator;
use utf8;
use strict;
use warnings;
use AST::Helpers;

sub oo_package_declarator {
    my $m = shift;
    my $name  = $m->{package_def}{module_name}[0]{longname}{name}{identifier}{TEXT};
    my $id_type_sub = AST::unique_id;

    my $how_type = '';
    if ($m->{SYM} eq 'knowhow') {
        $how_type = 'PrototypeHOW';
    } elsif ($m->{SYM} eq 'class') {
        $how_type = 'ClassHOW';
    } elsif ($m->{SYM} eq 'role') {
        $how_type = 'RoleHOW';
    } else {
        XXX;
    }

    
    my $init = $m->{package_def}{block}->emit_m0ld;

    my $mold = AST::Block->new(regs => $init->regs,stmts => [
        let(call(new=>FETCH(lookup("Package"))),sub {
            my $package = shift;
            let call("^!CREATE" => FETCH(lookup("p6opaque"))),sub {
                my $proto = shift;
                AST::Seq->new(stmts => [
                    call(STORE => call(name => $package),[string $name]),
                    call(STORE => call("postcircumfix:{ }" => FETCH(call(outer => reg '$scope')),
                                  [string $name]),[$proto]),
                    call(STORE => call("postcircumfix:{ }" => FETCH(call outer => reg '$scope'),
                                  [string $name.'::']),[$package]),
                    let(call(new=>FETCH(lookup("Package"))), sub {
			my $export = shift;
			AST::Seq->new(stmts => [
					  call(STORE => call("postcircumfix:{ }"=>$package,[string 'EXPORT::']),
					       [ $export ]),
					  call(STORE => call("postcircumfix:{ }"=>$export,[string 'ALL::']),
					       [ call(new=>FETCH(lookup('Package'))) ]),
					  call(STORE => call("postcircumfix:{ }"=>$export,[string 'DEFAULT::']),
					       [ call(new=>FETCH(lookup('Package'))) ]),
				      ]);
		    }),
                    call(STORE => call("postcircumfix:{ }" => FETCH(call(outer => reg '$scope')),
                                  [string '&'.$name]),[
			     call(new => FETCH(lookup('Code')),[],[string 'outer'=>reg '$scope',string 'mold' => AST::Block->new(regs=>['interpreter','scope'],stmts=>trailing_return([lookup('$?CLASS')]))])
                                  ]),
                    call(STORE => call("postcircumfix:{ }" => reg '$scope',[string '$?PACKAGE']),[$package]),
                    call(STORE => call("postcircumfix:{ }" => FETCH(call lookup => FETCH(call outer => reg '$scope'),[string '$?PACKAGE']),[string $name.'::']),[$package]),
                    call(STORE => call("postcircumfix:{ }" => reg '$scope',[string '$?CLASS']),[$proto]),
                    call(STORE => call("^!how" => $proto),[FETCH lookup($how_type)]),
                    call(STORE => call("^!who" => $proto),[$package])
                ]);
            };
        }),
        @{$init->stmts}
    ]);
    call("postcircumfix:( )" =>
	 call(new => FETCH(lookup('Code')),[],[string 'outer'=>reg '$scope',string 'mold' => $mold]),
	 [capturize()]
        );
}

sub plain_package_declarator {
    my $m = shift;
    my $name  = $m->{package_def}{module_name}[0]{longname}{name}{identifier}{TEXT};
    my $id_type_sub = AST::unique_id;

    my $init = $m->{package_def}{block}->emit_m0ld;

    my $mold = AST::Block->new(regs => $init->regs,stmts => [
        let(call(new=>FETCH(lookup("Package"))),sub {
            my $package = shift;
	    AST::Seq->new(stmts => [
		    call(STORE => call(name => $package),[string $name]),
                    call(STORE => call("postcircumfix:{ }" => reg '$scope',[string '$?PACKAGE']),[$package]),
                    call(STORE => call("postcircumfix:{ }" => FETCH(call outer => reg '$scope'),[string $name.'::']),[$package]),
                    let(call(new=>FETCH(lookup("Package"))), sub {
			my $export = shift;
			AST::Seq->new(stmts => [
					  call(STORE => call("postcircumfix:{ }"=>$package,[string 'EXPORT::']),
					       [ $export ]),
					  call(STORE => call("postcircumfix:{ }"=>$export,[string 'ALL::']),
					       [ call(new=>FETCH(lookup('Package'))) ]),
					  call(STORE => call("postcircumfix:{ }"=>$export,[string 'DEFAULT::']),
					       [ call(new=>FETCH(lookup('Package'))) ]),
				      ]);
		    }),
                    call(STORE => call("postcircumfix:{ }" => FETCH(call lookup => FETCH(call outer => reg '$scope'),[string '$?PACKAGE']),[string $name.'::']),[$package])
                 ]);
        }),
        @{$init->stmts}
    ]);
    call("postcircumfix:( )" =>
	 call(new => FETCH(lookup('Code')),[],[string 'outer'=>reg '$scope',string 'mold' => $mold]),
	 [capturize()]
        );
}

sub emit_m0ld {
    my $m = shift;
    if ($m->{SYM} eq 'knowhow') {
        oo_package_declarator($m);
    } elsif ($m->{SYM} eq 'class') {
        oo_package_declarator($m);
    } elsif ($m->{SYM} eq 'role') {
        oo_package_declarator($m);
    } elsif ($m->{SYM} eq 'module') {
	plain_package_declarator($m);
    } else {
        XXX;
    }
}

1;
