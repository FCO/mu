use v6-alpha;

grammar MiniPerl6::Grammar {

use MiniPerl6::Grammar::Regex;
use MiniPerl6::Grammar::Mapping;
use MiniPerl6::Grammar::Control;

# XXX - move to v6.pm emitter
#sub array($data)    { use v5; @$data; use v6; }
 
my $Class_name;  # for diagnostic messages
sub get_class_name { $Class_name } 

token ident_digit {
    [ [ <.word> | _ | <.digit> ] <.ident_digit>
    |   ''
    ]    
}

token ident {
    [ <.word> | _ ] <.ident_digit>
}

token full_ident {
    <.ident>
    [   <'::'> <.full_ident>
    |   ''
    ]    
}

token namespace_before_ident {
    <.ident> <before <'::'> >
        [   <'::'> <.namespace_before_ident>
        |   ''
        ]   
}
token optional_namespace_before_ident {
    | <namespace_before_ident> <'::'> 
        { make ~$<namespace_before_ident> }
    | ''  
        { make '' }
}

token to_line_end {
    |  \N <.to_line_end>
    |  ''
}

token pod_begin {
    |   \n <'=end'> <.to_line_end>
    |   . <.to_line_end> <.pod_begin>
}

token pod_other {
    |   \n <'=cut'> <.to_line_end>
    |   . <.to_line_end> <.pod_other>
}

token ws {
    [
    |    <'#'> <.to_line_end>
    |    \n [
            |  <'=begin'>  <.pod_begin>
            |  <'=kwid'>   <.pod_other>
            |  <'=pod'>    <.pod_other>
            |  <'=for'>    <.pod_other>
            |  <'=head1'>  <.pod_other>
            |  ''
            ]
    |    \s
    ]
    [ <.ws> | '' ]
}

token opt_ws  {  <.ws> | ''  }
token opt_ws2 {  <.ws> | ''  }
token opt_ws3 {  <.ws> | ''  }

token parse {
    | <comp_unit>
        [
        |   <parse>
            { make [ $$<comp_unit>, @( $$<parse> ) ] }
        |   { make [ $$<comp_unit> ] }
        ]
    | { make [] }
}

token comp_unit {
    <.opt_ws> [\; <.opt_ws> | '' ]
    [ <'use'> <.ws> <'v6-'> <ident> <.opt_ws> \; <.ws>  |  '' ]
    
    [ <'class'> | <'grammar'> ]  <.opt_ws> <full_ident> <.opt_ws> 
    <'{'>
        { $Class_name := ~$<full_ident> }
        <.opt_ws>
        <exp_stmts>
        <.opt_ws>
    <'}'>
    <.opt_ws> [\; <.opt_ws> | '' ]
    {
        make ::CompUnit(
            'name'        => $$<full_ident>,
            'attributes'  => { },
            'methods'     => { },
            'body'        => $$<exp_stmts>,
        )
    }
}

token infix_op {
    <'+'> | <'-'> | <'*'> | <'/'> | eq | ne | <'=='> | <'!='> | <'&&'> | <'||'> | <'~~'> | <'~'> | '>'
    | 'x'
}

token hyper_op {
    <'>>'> | ''
}

token prefix_op {
    [ <'$'> | <'@'> | <'%'> | <'?'> | <'!'> | <'++'> | <'--'> | <'+'> | <'-'> | <'~'> ] 
    <before <'('> | <'$'> >
}

token declarator {
     <'my'> | <'state'> | <'has'> 
}

token exp2 { <exp> { make $$<exp> } }
token exp_stmts2 { <exp_stmts> { make $$<exp_stmts> } }

}
    #---- split into compilation units in order to use less RAM...
grammar MiniPerl6::Grammar {


token exp {
    # { say 'exp: going to match <term_meth> at ', $/.to; }
    <term_meth> 
    [
        <.opt_ws>
        <'??'>
        [
          <.opt_ws>  <exp>
          <.opt_ws>  <'!!'>
          <.opt_ws>
          <exp2>
          { make ::Apply(
            'namespace' => '',
            'code'      => 'ternary:<?? !!>',
            'arguments' => [ $$<term_meth>, $$<exp>, $$<exp2> ],
          ) }
        | { say '*** Syntax error in ternary operation' }
        ]
    |
        <.opt_ws>
        <infix_op>
        <.opt_ws>
        <exp>
          { make ::Apply(
            'namespace' => '',
            'code'      => 'infix:<' ~ $<infix_op> ~ '>',
            'arguments' => [ $$<term_meth>, $$<exp> ],
          ) }
    | <.opt_ws> <':='> <.opt_ws> <exp>
        { make ::Bind( 'parameters' => $$<term_meth>, 'arguments' => $$<exp>) }
    |   { make $$<term_meth> }
    ]
}

token opt_ident {  
    | <ident>  { make $$<ident> }
    | ''     { make 'postcircumfix:<( )>' }
}

token term_meth {
    <full_ident>
    [ 
       [ 
            '.new('   
            [ 
 	                <.opt_ws> <exp_mapping> <.opt_ws> \) 
 	                { 
 	                    # say 'Parsing Lit::Object ', $$<full_ident>, ($$<exp_mapping>).perl; 
 	                    make ::Lit::Object( 
 	                        'class'  => $$<full_ident>, 
 	                        'fields' => $$<exp_mapping> 
 	                    ) 
 	                } 
            | { say '*** Syntax Error parsing Constructor'; die() } 
            ] 
        ] 
        | 
        [ 
            '.' <hyper_op> <ident>
            [ \( <.opt_ws> <exp_seq> <.opt_ws> \)
                # { say 'found parameter list: ', $<exp_seq>.perl }
            | \: <.ws> <exp_seq> <.opt_ws>
            |
                {
                    make ::Call(
                        'invocant'  => ::Proto( 'name' => ~$<full_ident> ),
                        'method'    => $$<ident>,
                        'arguments' => [],
                        'hyper'     => $$<hyper_op>,
                    )
                }
            ]
            {
                make ::Call(
                    'invocant'  => ::Proto( 'name' => ~$<full_ident> ),
                    'method'    => $$<ident>,
                    'arguments' => $$<exp_seq>,
                    'hyper'     => $$<hyper_op>,
                )
            }
        ]
    ]
    |
    <exp_term>
    [ \.
        <hyper_op>
        <opt_ident>   # $obj.(42)
            [ \( 
                # { say 'testing exp_seq at ', $/.to }
                <.opt_ws> <exp_seq> <.opt_ws> \)
                # { say 'found parameter list: ', $<exp_seq>.perl }
            | \: <.ws> <exp_seq> <.opt_ws>
            |
                {
                    make ::Call(
                        'invocant'  => $$<exp_term>,
                        'method'    => $$<opt_ident>,
                        'arguments' => [],
                        'hyper'     => $$<hyper_op>,
                    )
                }
            ]
            {
                make ::Call(
                    'invocant'  => $$<exp_term>,
                    'method'    => $$<opt_ident>,
                    'arguments' => $$<exp_seq>,
                    'hyper'     => $$<hyper_op>,
                )
            }
    | \[ <.opt_ws> <exp> <.opt_ws> \]
         { make ::Index(  'obj' => $$<exp_term>, 'index_exp' => $$<exp> ) }   # $a[exp]
    | \{ <.opt_ws> <exp> <.opt_ws> \}
         { make ::Lookup( 'obj' => $$<exp_term>, 'index_exp' => $$<exp> ) }   # $a{exp}
    |    { make $$<exp_term> }
    ]
}

token sub_or_method_name {
    <full_ident> [ \. <ident> | '' ]
}

token opt_type {
    |   [ <'::'> | '' ]  <full_ident>   { make $$<full_ident> }
    |   ''                              { make '' }
}

token exp_term {
    | <var_ident>     { make $$<var_ident> }     # $variable
    | <prefix_op> <exp> 
          { make ::Apply(
            'namespace' => '',
            'code'      => 'prefix:<' ~ $<prefix_op> ~ '>',
            'arguments' => [ $$<exp> ],
          ) }
    | \( <.opt_ws> <exp> <.opt_ws> \)
        { make $$<exp> }   # ( exp )
    | \{ <.opt_ws> <exp_mapping> <.opt_ws> \}
        { make ::Lit::Hash( 'hash' => $$<exp_mapping> ) }   # { exp => exp, ... }
    | \[ <.opt_ws> <exp_seq> <.opt_ws> \]
        { make ::Lit::Array( 'array' => $$<exp_seq> ) }   # [ exp, ... ]
    | \$ \< <sub_or_method_name> \>
        { make ::Lookup( 
            'obj'   => ::Var( 'sigil' => '$', 'twigil' => '', 'name' => '/' ), 
            'index_exp' => ::Val::Buf( 'buf' => $$<sub_or_method_name> ) 
        ) }   # $<ident>
    | do <.opt_ws> \{ <.opt_ws> <exp_stmts> <.opt_ws> \}
        { make ::Do( 'block' => $$<exp_stmts> ) }   # do { stmt; ... }
    | <declarator> <.ws> <opt_type> <.opt_ws> <var_ident>   # my Int $variable
        { make ::Decl( 'decl' => $$<declarator>, 'type' => $$<opt_type>, 'var' => $$<var_ident> ) }
    | use <.ws> <full_ident>  [ - <ident> | '' ]
        { make ::Use( 'mod' => $$<full_ident> ) }
    | <val>     { make $$<val> }     # 'value'
    | <lit>     { make $$<lit> }     # [literal construct]
#   | <bind>    { make $$<bind>   }  # $lhs := $rhs
    | <token>   { make $$<token>  }  # token  { regex... }
    | <method_def>  { make $$<method_def> }  # method { code... }
    | <sub_def>     { make $$<sub_def>    }  # sub    { code... }
    | <control> { make $$<control> } # Various control structures.  Does _not_ appear in binding LHS
#   | <index>     # $obj[1, 2, 3]
#   | <lookup>    # $obj{'1', '2', '3'}
    | <apply>   { make $$<apply>  }  # self; print 1,2,3
}

#token index { XXX }
#token lookup { XXX }

}
    #---- split into compilation units in order to use less RAM...
grammar MiniPerl6::Grammar {

token var_sigil { \$ |\% |\@ |\& }

token var_twigil { [ \. | \! | \^ | \* ] | '' }

token var_name { <full_ident> | <'/'> | <digit> }

token var_ident {
    <var_sigil> <var_twigil> <optional_namespace_before_ident> <var_name>
    {
        make ::Var(
            'sigil'  => ~$<var_sigil>,
            'twigil' => ~$<var_twigil>,
            'namespace' => $$<optional_namespace_before_ident>,
            'name'   => ~$<var_name>,
        )
    }
}

token val {
    | <val_undef>  { make $$<val_undef> }  # undef
    # | $<exp> := <val_object>   # (not exposed to the outside)
    | <val_int>    { make $$<val_int>   }  # 123
    | <val_bit>    { make $$<val_bit>   }  # True, False
    | <val_num>    { make $$<val_num>   }  # 123.456
    | <val_buf>    { make $$<val_buf>   }  # 'moose'
}

token val_bit {
    | True  { make ::Val::Bit( 'bit' => 1 ) }
    | False { make ::Val::Bit( 'bit' => 0 ) }
}


}
    #---- split into compilation units in order to use less RAM...
grammar MiniPerl6::Grammar {


token val_undef {
    undef <!before \w >
    { make ::Val::Undef( ) }
}

token val_num {  
    XXX { make 'TODO: val_num' } 
}

token char_any {
    .
}

token single_quoted_unescape {
    |  \\ \'  <single_quoted_unescape>  
        { make "\'" ~ $<single_quoted_unescape> }
    |  \\ \"  <single_quoted_unescape>  
        { make "\"" ~ $<single_quoted_unescape> }
    |  \\ \\  <single_quoted_unescape>  
        { make "\\" ~ $<single_quoted_unescape> }
    |  <!before \' > <char_any> <single_quoted_unescape>
        { make $<char_any> ~ $<single_quoted_unescape> }
    |  ''    
}

token double_quoted_unescape {
    |  \\ \'  <double_quoted_unescape>  
        { make '\'' ~ $<double_quoted_unescape> }
    |  \\ \"  <double_quoted_unescape>  
        { make '"' ~ $<double_quoted_unescape> }
    |  \\ \\  <double_quoted_unescape>  
        { make "\\" ~ $<double_quoted_unescape> }
    |  \\ n  <double_quoted_unescape>  
        { make Main.newline ~ $<double_quoted_unescape> }
    |  <!before \" > <char_any> <double_quoted_unescape>
        { make $<char_any> ~ $<double_quoted_unescape> }
    |  ''    
}

token val_buf {
    | \" <double_quoted_unescape>  \" { make ::Val::Buf( 'buf' => $$<double_quoted_unescape> ) }
    | \' <single_quoted_unescape>  \' { make ::Val::Buf( 'buf' => $$<single_quoted_unescape> ) }
}

token digits {  \d  [ <digits> | '' ]  }

token val_int {
    <digits>
    { make ::Val::Int( 'int' => ~$/ ) }
}

token exp_stmts {
    | <exp>
        [
        |   <.opt_ws> [ \; | '' ] <.opt_ws> <exp_stmts>
            <.opt_ws> [ \; <.opt_ws> | '' ]
            { make [ $$<exp>, @( $$<exp_stmts> ) ] }
        |   <.opt_ws> [ \; <.opt_ws> | '' ]
            { make [ $$<exp> ] }
        ]
    | { make [] }
}

token exp_seq {
    | <exp>
        # { say 'exp_seq: matched <exp>' }
        [
        |   <.opt_ws> \, <.opt_ws> <exp_seq> 
            <.opt_ws> [ \, <.opt_ws> | '' ]
            { make [ $$<exp>, @( $$<exp_seq> ) ] }
        |   <.opt_ws> [ \, <.opt_ws> | '' ]
            { make [ $$<exp> ] }
        ]
    | 
        # { say 'exp_seq: end of match' }
        { make [] }
}

}
    #---- split into compilation units in order to use less RAM...
grammar MiniPerl6::Grammar {

token lit {
    #| <lit_seq>    { make $$<lit_seq>    }  # (a, b, c)
    #| <lit_array>  { make $$<lit_array>  }  # [a, b, c]
    #| <lit_hash>   { make $$<lit_hash>   }  # {a => x, b => y}
    #| <lit_code>   { make $$<lit_code>   }  # sub $x {...}
    | <lit_object> { make $$<lit_object> }  # ::Tree(a => x, b => y);
}

token lit_seq   {  XXX { make 'TODO: lit_seq'    } }
token lit_array {  XXX { make 'TODO: lit_array'  } }
token lit_hash  {  XXX { make 'TODO: lit_hash'   } }
token lit_code  {  XXX { make 'TODO - Lit::Code' } }

token lit_object {
    <'::'>
    <full_ident>
    \( 
    [
        <.opt_ws> <exp_mapping> <.opt_ws> \)
        {
            # say 'Parsing Lit::Object ', $$<full_ident>, ($$<exp_mapping>).perl;
            make ::Lit::Object(
                'class'  => $$<full_ident>,
                'fields' => $$<exp_mapping>
            )
        }
    | { say '*** Syntax Error parsing Constructor'; die() }
    ]
}

token bind {
    <exp>  <.opt_ws> <':='> <.opt_ws>  <exp2>
    {
        make ::Bind(
            'parameters' => $$<exp>,
            'arguments'  => $$<exp2>,
        )
    }
}

token call {
    <exp> \. <ident> \( <.opt_ws> <exp_seq> <.opt_ws> \)
    {
        make ::Call(
            'invocant'  => $$<exp>,
            'method'    => $$<ident>,
            'arguments' => $$<exp_seq>,
            'hyper'     => '',
        )
    }
}

token apply {
    <optional_namespace_before_ident> <full_ident>
    [
        [ \( <.opt_ws> <exp_seq> <.opt_ws> \)
        | <.ws> <exp_seq> <.opt_ws>
        ]
        {
            make ::Apply(
                'namespace' => $$<optional_namespace_before_ident>,
                'code'      => $$<full_ident>,
                'arguments' => $$<exp_seq>,
            )
        }
    |
        {
            make ::Apply(
                'namespace' => $$<optional_namespace_before_ident>,
                'code'      => $$<full_ident>,
                'arguments' => [],
            )
        }
    ]
}

token opt_name {  <ident> | ''  }


token var_invocant {
    |  <var_ident> \:    { make $$<var_ident> }
    |  { make ::Var( 
            'sigil'  => '$',
            'twigil' => '',
            'name'   => 'self',
         ) 
       }
}

token args_sig {
        <var_invocant>
        <.opt_ws> 
        # TODO - exp_seq / exp_mapping == positional / named 
        <exp_seq> 
        {
            # say ' invocant: ', ($$<var_invocant>).perl;
            # say ' positional: ', ($$<exp_seq>).perl;
            make ::Sig( 'invocant' => $$<var_invocant>, 'positional' => $$<exp_seq>, 'named' => { } );
        }
}

token method_sig {
    |   <.opt_ws> \( <.opt_ws>  <args_sig>  <.opt_ws>  \)
        { make $$<args_sig> }
    |   { make ::Sig( 
            'invocant' => ::Var( 
                'sigil'  => '$',
                'twigil' => '',
                'name'   => 'self' ), 
            'positional' => [ ], 
            'named' => { } ) }
}

token method_def {
    method
    <.ws>  <opt_name>  <.opt_ws> 
    <method_sig>
    <.opt_ws> \{ <.opt_ws>  
          # { say ' parsing statement list ' }
          <exp_stmts> 
          # { say ' got statement list ', ($$<exp_stmts>).perl } 
        <.opt_ws> 
    [   \}     | { say '*** Syntax Error in method \'', get_class_name(), '.', $$<name>, '\' near pos=', $/.to; die 'error in Block'; } ]
    {
        # say ' block: ', ($$<exp_stmts>).perl;
        make ::Method( 'name' => $$<opt_name>, 'sig' => $$<method_sig>, 'block' => $$<exp_stmts> );
    }
}

token sub_def {
    sub
    <.ws>  <opt_name>  <.opt_ws> 
    <method_sig>
    <.opt_ws> \{ <.opt_ws>  
          <exp_stmts> <.opt_ws> 
    [   \}     | { say '*** Syntax Error in sub \'', $$<name>, '\''; die 'error in Block'; } ]
    { make ::Sub( 'name' => $$<opt_name>, 'sig' => $$<method_sig>, 'block' => $$<exp_stmts> ) }
}

}
    #---- split into compilation units in order to use less RAM...
grammar MiniPerl6::Grammar {

token token {
    # { say 'parsing Token' }
    token
    <.ws>  <opt_name>  <.opt_ws> \{
        <MiniPerl6::Grammar::Regex.rule>
    \}
    {
        #say 'Token was compiled into: ', ($$<MiniPerl6::Grammar::Regex.rule>).perl;
        my $source := 'method ' ~ $<opt_name> ~ ' ( $grammar: $str, $pos ) { ' ~
            'my $MATCH; $MATCH := ::MiniPerl6::Match( \'str\' => $str, \'from\' => $pos, \'to\' => $pos, \'bool\' => 1 ); ' ~ 
            '$MATCH.bool := ( ' ~
                ($$<MiniPerl6::Grammar::Regex.rule>).emit ~
            '); ' ~
            '$MATCH }';
        #say 'Intermediate code: ', $source;
        my $ast := MiniPerl6::Grammar.exp_term( $source, 0 );
        # say 'Intermediate ast: ', $$ast.emit;
        make $$ast;
    }
}

}

=begin

=head1 NAME 

MiniPerl6::Grammar - Grammar for MiniPerl6

=head1 SYNOPSIS

    my $match := $source.parse;
    ($$match).perl;    # generated MiniPerl6 AST

=head1 DESCRIPTION

This module generates a syntax tree for the MiniPerl6 compiler.

=head1 AUTHORS

Flavio Soibelmann Glock <fglock@gmail.com>.
The Pugs Team E<lt>perl6-compiler@perl.orgE<gt>.

=head1 SEE ALSO

The Perl 6 homepage at L<http://dev.perl.org/perl6>.

The Pugs homepage at L<http://pugscode.org/>.

=head1 COPYRIGHT

Copyright 2006, 2009 by Flavio Soibelmann Glock, Audrey Tang and others.

This program is free software; you can redistribute it and/or modify it
under the same terms as Perl itself.

See L<http://www.perl.com/perl/misc/Artistic.html>

=end
