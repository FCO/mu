use v5.10;
use MooseX::Declare;
use Emit::Yeast;
class AST::Block::SSA extends AST::Block {
    sub reference {
        "SMOP_REFERENCE(interpreter,$_[0])";
    }
    method emit_c {
        state $unique_func_id = 0;

        my $func_name = 'smop_yeast_' . $unique_func_id++;
        my $funcs = '';
        my $call_init_funcs = '';
        my $i = 0;
        my $code;
        my %labels;

        my %regs;
        my $reg_id = 0;
        
        my $constant_decls;
        my $init_constants = "static void ${func_name}_init(interpreter) {";

        my $constants_id = 0;
        my $constant = sub {
            my $c = $func_name . "_constant_" . $constants_id++;
            $constant_decls .= "static SMOP__Object* $c;\n";
            $init_constants .= "$c = $_[0];\n";
            $c;
        };

        for (@{$self->regs}) {
            $regs{'$'.$_} = $reg_id++;
        }

        my $value = sub {
            if ($_[0]->isa('AST::Reg')) {
                unless (defined $regs{$_[0]->real_name}) {
                    $regs{$_[0]->real_name} = $reg_id++;
                }
                "frame->reg[" . $regs{$_[0]->real_name} . "]";
            } elsif ($_[0]->isa('AST::StringConstant')) {
                my $str = $_[0]->value;
                # TODO properly quote characters
                $constant->('SMOP__NATIVE__idconst_createn("' . $str . '",' . length($_[0]->value) . ')');
            } elsif ($_[0]->isa('AST::IntegerConstant')) {
                $constant->('SMOP__NATIVE__int_create(' . $_[0]->value . ')');
            } elsif ($_[0]->isa('AST::Block::SSA')) {
                my ($func,$expr,$init) = $_[0]->emit_c;
                $funcs .= $func;
                $call_init_funcs .= $init;
                $constant->($expr);
            } else {
                $constant->(ref $_[0].'???');
            }
        };

        for my $block (@{$self->stmts}) {
            if ($block->id) {
                $labels{$block->id} = $i;
            }
            for my $stmt (@{$block->stmts}) {
                $i++; 
            }
        }
        $i = 0;
        for my $block (@{$self->stmts}) {
            for my $stmt (@{$block->stmts}) {
                $code .= "\n/*".$stmt->pretty."*/";
                $code .= "case $i:";
                if ($stmt->isa('AST::Goto')) {
                    $code .= "frame->pc = " . $labels{$stmt->block->id} . ";" . "break;\n"
                } elsif ($stmt->isa('AST::Branch')) {
                    $code .= "frame->pc = "
                        . $value->($stmt->cond)
                        . " == SMOP__NATIVE__bool_false ? "
                        . $labels{$stmt->else->id}
                        . " : "
                        . $labels{$stmt->then->id}
                        . ";break;\n";
                } elsif ($stmt->isa('AST::Reg')) {
                    # noop
                    $code .= ';';
                } elsif ($stmt->isa('AST::Assign')) {
                    if ($stmt->rvalue->isa('AST::Call')) {
                        my $type = $stmt->rvalue->capture->invocant->type_info->type;
                        $code .= $type->emit_call($i,$stmt,$value);
                    } else {
                        Emit::Yeast::assign($value->($stmt->lvalue),$value->($stmt->rvalue));
                    }
                } else {
                    $code .= "/*".ref($stmt)."*/\n";
                }
                $i++;
        }
    }
    ($funcs . $constant_decls . $init_constants . "}\n" . "static void " . $func_name . "(SMOP__Object* interpreter,SMOP__Yeast__Frame* frame) {" 
    . "  switch (frame->pc) {"
    . $code
    . "case $i : frame->pc = -1;\n" 
    .  "  }}\n","SMOP__Yeast_create(" . (scalar keys %regs)
    . ",(SMOP__Object*[]) {NULL}"
    . ",$func_name)","${call_init_funcs}${func_name}_init(interpreter);");
    }
}
