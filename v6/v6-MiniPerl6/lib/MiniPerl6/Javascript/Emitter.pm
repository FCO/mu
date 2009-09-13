use v6-alpha;

class MiniPerl6::Javascript::LexicalBlock {
    has @.block;
    method emit {
        if !(@.block) {
            return 'null';
        }
        my $str := '';
        for @.block -> $decl { 
            if $decl.isa( 'Decl' ) && ( $decl.decl eq 'my' ) {
                $str := $str ~ 'var ' ~ ($decl.var).emit ~ ' = undef;'; 
            }
            if $decl.isa( 'Bind' ) && ($decl.parameters).isa( 'Decl' ) && ( ($decl.parameters).decl eq 'my' ) {
                $str := $str ~ 'var ' ~ (($decl.parameters).var).emit ~ ';'; 
            }
        }
        for @.block -> $decl { 
            if (!( $decl.isa( 'Decl' ) && ( $decl.decl eq 'my' ))) {
                $str := $str ~ ($decl).emit ~ ';';
            }
        }; 
        return $str;
    }
}

class CompUnit {
    has $.name;
    has %.attributes;
    has %.methods;
    has @.body;
    method emit {
        my $class_name := Main::to_javascript_namespace($.name);
        my $str :=
            '// class ' ~ $.name ~ Main.newline
            ~ '(function () {' ~ Main.newline;

        for @.body -> $decl { 
            if $decl.isa( 'Decl' ) && ( $decl.decl eq 'my' ) {
                $str := $str ~ '  var ' ~ ($decl.var).emit ~ ' = null;' ~ Main.newline; 
            }
            if $decl.isa( 'Bind' ) && ($decl.parameters).isa( 'Decl' ) && ( ($decl.parameters).decl eq 'my' ) {
                $str := $str ~ '  var ' ~ (($decl.parameters).var).emit ~ ';' ~ Main.newline; 
            }
        }

        $str := $str ~ 'function ' ~ Main::to_javascript_namespace($.name) ~ '() {' ~ Main.newline;

        for @.body -> $decl { 
            if $decl.isa( 'Decl' ) && ( $decl.decl eq 'has' ) {
                $str := $str ~ 
'
  // accessor ' ~ ($decl.var).name ~ '
  this.' ~ ($decl.var).name ~ ' = null;
  this.f_' ~ ($decl.var).name ~ ' = function () { return this.' ~ ($decl.var).name ~ ' }
';
            }
            if $decl.isa( 'Method' ) {
                my $sig      := $decl.sig;
                my $pos      := $sig.positional;
                my $block    := ::MiniPerl6::Javascript::LexicalBlock( block => $decl.block );
                $str := $str ~
'
  // method ' ~ $decl.name ~ '
  this.f_' ~ $decl.name ~ ' = function (' ~ ((@$pos).>>emit).join(', ') ~ ') {
    ' ~ $block.emit ~ '
  }
';
            }
            if $decl.isa( 'Sub' ) {
                my $sig      := $decl.sig;
                my $pos      := $sig.positional;
                my $block    := ::MiniPerl6::Javascript::LexicalBlock( block => $decl.block );
                $str := $str ~
'
  // sub ' ~ $decl.name ~ '
  this.f_' ~ $decl.name ~ ' = function (' ~ ((@$pos).>>emit).join(', ') ~ ') {
    ' ~ $block.emit ~ '
  }
';
            }
        }; 
        $str := $str ~ '}' ~ Main.newline;
        $str := $str ~ Main::to_javascript_namespace($.name) 
                     ~ ' = new ' ~ Main::to_javascript_namespace($.name) ~ ';' ~ Main.newline;
        for @.body -> $decl { 
            if    (!( $decl.isa( 'Decl' ) && (( $decl.decl eq 'has' ) || ( $decl.decl eq 'my' )) ))
               && (!( $decl.isa( 'Method'))) 
               && (!( $decl.isa( 'Sub'))) 
            {
                $str := $str ~ ($decl).emit ~ ';';
            }
        }; 

        $str := $str ~ '}' 
            ~ ')();' ~ Main.newline;
    }

}

class Val::Int {
    has $.int;
    method emit { $.int }
}

class Val::Bit {
    has $.bit;
    method emit { $.bit }
}

class Val::Num {
    has $.num;
    method emit { $.num }
}

class Val::Buf {
    has $.buf;
    method emit { '"' ~ Main::lisp_escape_string($.buf) ~ '"' }
}

class Val::Undef {
    method emit { 'null' }
}

class Val::Object {
    has $.class;
    has %.fields;
    method emit {
        die 'Val::Object - not used yet';
    }
}

class Lit::Seq {
    has @.seq;
    method emit {
        '(' ~ (@.seq.>>emit).join(', ') ~ ')';
    }
}

class Lit::Array {
    has @.array;
    method emit {
        '[' ~ (@.array.>>emit).join(', ') ~ ']';
    }
}

class Lit::Hash {
    has @.hash;
    method emit {
        my $fields := @.hash;
        my $str := '';
        for @$fields -> $field { 
            $str := $str ~ ($field[0]).emit ~ ':' ~ ($field[1]).emit ~ ',';
        }; 
        '{ ' ~ $str ~ ' }';
    }
}

class Lit::Code {
    # XXX
    1;
}

class Lit::Object {
    has $.class;
    has @.fields;
    method emit {
        my $fields := @.fields;
        my $str := '';
        for @$fields -> $field { 
            $str := $str ~ ($field[0]).emit ~ ': ' ~ ($field[1]).emit ~ ',';
        }; 
        '{ __proto__:' ~ Main::to_javascript_namespace($.class) ~ ', ' ~ $str ~ '}';
    }
}

class Index {
    has $.obj;
    has $.index_exp;
    method emit {
        $.obj.emit ~ '[' ~ $.index_exp.emit ~ ']';
    }
}

class Lookup {
    has $.obj;
    has $.index_exp;
    method emit {
        $.obj.emit ~ '[' ~ $.index_exp.emit ~ ']';
    }
}

class Var {
    has $.sigil;
    has $.twigil;
    has $.namespace;
    has $.name;
    method emit {
        # Normalize the sigil here into $
        # $x    => $x
        # @x    => $List_x
        # %x    => $Hash_x
        # &x    => $Code_x
        my $table := {
            '$' => '',
            '@' => 'List_',
            '%' => 'Hash_',
            '&' => 'Code_',
        };
        my $ns := '';
        if $.namespace {
            $ns := Main::to_javascript_namespace($.namespace) ~ '.';
        }
           ( $.twigil eq '.' )
        ?? ( 'this.' ~ $.name ~ '' )
        !!  (    ( $.name eq '/' )
            ??   ( $table{$.sigil} ~ 'MATCH' )
            !!   ( $table{$.sigil} ~ $ns ~ $.name )
            )
    };
    method plain_name {
        if $.namespace {
            return $.namespace ~ '.' ~ $.name
        }
        return $.name
    };
}

class Bind {
    has $.parameters;
    has $.arguments;
    method emit {
        if $.parameters.isa( 'Lit::Array' ) {
            
            #  [$a, [$b, $c]] := [1, [2, 3]]
            
            my $a := $.parameters.array;
            #my $b := $.arguments.array;
            my $str := 'do { ';
            my $i := 0;
            for @$a -> $var { 
                my $bind := ::Bind( 
                    'parameters' => $var, 
                    # 'arguments' => ($b[$i]) );
                    'arguments'  => ::Index(
                        obj    => $.arguments,
                        index_exp  => ::Val::Int( int => $i )
                    )
                );
                $str := $str ~ ' ' ~ $bind.emit ~ '; ';
                $i := $i + 1;
            };
            return $str ~ $.parameters.emit ~ ' }';
        };
        if $.parameters.isa( 'Lit::Hash' ) {

            #  {:$a, :$b} := { a => 1, b => [2, 3]}

            my $a := $.parameters.hash;
            my $b := $.arguments.hash;
            my $str := 'do { ';
            my $i := 0;
            my $arg;
            for @$a -> $var {

                $arg := ::Val::Undef();
                for @$b -> $var2 {
                    #say "COMPARE ", ($var2[0]).buf, ' eq ', ($var[0]).buf;
                    if ($var2[0]).buf eq ($var[0]).buf {
                        $arg := $var2[1];
                    }
                };

                my $bind := ::Bind( 'parameters' => $var[1], 'arguments' => $arg );
                $str := $str ~ ' ' ~ $bind.emit ~ '; ';
                $i := $i + 1;
            };
            return $str ~ $.parameters.emit ~ ' }';
        };

        if $.parameters.isa( 'Lit::Object' ) {

            #  ::Obj(:$a, :$b) := $obj

            my $class := $.parameters.class;
            my $a     := $.parameters.fields;
            my $b     := $.arguments;
            my $str   := 'do { ';
            my $i     := 0;
            my $arg;
            for @$a -> $var {
                my $bind := ::Bind( 
                    'parameters' => $var[1], 
                    'arguments'  => ::Call( invocant => $b, method => ($var[0]).buf, arguments => [ ], hyper => 0 )
                );
                $str := $str ~ ' ' ~ $bind.emit ~ '; ';
                $i := $i + 1;
            };
            return $str ~ $.parameters.emit ~ ' }';
        };
    
        if $.parameters.isa( 'Call' ) {
            # $var.attr := 3;
            return '(' ~ ($.parameters.invocant).emit ~ '.' ~ $.parameters.method ~ ' = ' ~ $.arguments.emit ~ ')';
        }

        '(' ~ $.parameters.emit ~ ' = ' ~ $.arguments.emit ~ ')';
    }
}

class Proto {
    has $.name;
    method emit {
        Main::to_javascript_namespace($.name)        
    }
}

class Call {
    has $.invocant;
    has $.hyper;
    has $.method;
    has @.arguments;
    #has $.hyper;
    method emit {
        my $invocant := $.invocant.emit;
        if $invocant eq 'self' {
            $invocant := 'this';
        };

        if     ($.method eq 'values')
        { 
            if ($.hyper) {
                die "not implemented";
            }
            else {
                return '@{' ~ $invocant ~ '}';
            }
        };

        if     ($.method eq 'perl')
            || ($.method eq 'yaml')
            || ($.method eq 'say' )
            || ($.method eq 'join')
            || ($.method eq 'chars')
            || ($.method eq 'isa')
        { 
            if ($.hyper) {
                return 
                    '[ map { Main.' ~ $.method ~ '( $_, ' ~ ', ' ~ (@.arguments.>>emit).join(', ') ~ ')' ~ ' } @{ ' ~ $invocant ~ ' } ]';
            }
            else {
                return
                    'Main.' ~ $.method ~ '(' ~ $invocant ~ ', ' ~ (@.arguments.>>emit).join(', ') ~ ')';
            }
        };

        my $meth := $.method;
        if  $meth eq 'postcircumfix:<( )>'  {
             $meth := '';  
        };
        
        my $call := '.f_' ~ $meth ~ '(' ~ (@.arguments.>>emit).join(', ') ~ ')';
        if ($.hyper) {
            '[ map { $_' ~ $call ~ ' } @{ ' ~ $invocant ~ ' } ]';
        }
        else {
            $invocant ~ $call;
        };

    }
}

class Apply {
    has $.code;
    has @.arguments;
    has $.namespace;
    method emit {
        
        my $ns := '';
        if $.namespace {
            $ns := Main::to_javascript_namespace($.namespace) ~ '.';
        }
        my $code := $ns ~ $.code;

        if $code.isa( 'Str' ) { }
        else {
            return '(' ~ $.code.emit ~ ')->(' ~ (@.arguments.>>emit).join(', ') ~ ')';
        };

        if $code eq 'self'       { return 'this' };
        if $code eq 'false'      { return '0' };

        if $code eq 'make'       { return 'return(' ~ (@.arguments.>>emit).join(', ') ~ ')' };

        if $code eq 'say'        { return 'print('  ~ (@.arguments.>>emit).join(', ') ~ ')' };  # ' + "\\n")' };
        if $code eq 'print'      { return 'print('  ~ (@.arguments.>>emit).join(', ') ~ ')' };
        if $code eq 'warn'       { return 'warn('   ~ (@.arguments.>>emit).join(', ') ~ ')' };

        # if $code eq 'array'      { return '@{' ~ (@.arguments.>>emit).join(' ')    ~ '}' };

        if $code eq 'prefix:<~>' { return '("" . ' ~ (@.arguments.>>emit).join(' ') ~ ')' };
        if $code eq 'prefix:<!>' { return '('  ~ (@.arguments.>>emit).join(' ')    ~ ' ? 0 : 1)' };
        if $code eq 'prefix:<?>' { return '('  ~ (@.arguments.>>emit).join(' ')    ~ ' ? 1 : 0)' };

        if $code eq 'prefix:<$>' { return '(' ~ (@.arguments.>>emit).join(' ')    ~ ').string' };
        if $code eq 'prefix:<@>' { return '(' ~ (@.arguments.>>emit).join(' ')    ~ ').array' };
        if $code eq 'prefix:<%>' { return '(' ~ (@.arguments.>>emit).join(' ')    ~ ').hash' };

        if $code eq 'infix:<~>'  { return '('  ~ (@.arguments.>>emit).join(' + ')  ~ ')' };
        if $code eq 'infix:<+>'  { return '('  ~ (@.arguments.>>emit).join(' + ')  ~ ')' };
        if $code eq 'infix:<->'  { return '('  ~ (@.arguments.>>emit).join(' - ')  ~ ')' };
        if $code eq 'infix:<>>'  { return '('  ~ (@.arguments.>>emit).join(' > ')  ~ ')' };
        
        if $code eq 'infix:<&&>' { return '('  ~ (@.arguments.>>emit).join(' && ') ~ ')' };
        if $code eq 'infix:<||>' { return '('  ~ (@.arguments.>>emit).join(' || ') ~ ')' };
        if $code eq 'infix:<eq>' { return '('  ~ (@.arguments.>>emit).join(' == ') ~ ')' };
        if $code eq 'infix:<ne>' { return '('  ~ (@.arguments.>>emit).join(' != ') ~ ')' };
 
        if $code eq 'infix:<==>' { return '('  ~ (@.arguments.>>emit).join(' == ') ~ ')' };
        if $code eq 'infix:<!=>' { return '('  ~ (@.arguments.>>emit).join(' != ') ~ ')' };

        if $code eq 'ternary:<?? !!>' { 
            return '(' ~ (@.arguments[0]).emit ~
                 ' ? ' ~ (@.arguments[1]).emit ~
                 ' : ' ~ (@.arguments[2]).emit ~
                  ')' };
        
        'f_' ~ $code ~ '(' ~ (@.arguments.>>emit).join(', ') ~ ')';
    }
}

class Return {
    has $.result;
    method emit {
        return
        'return(' ~ $.result.emit ~ ')';
    }
}

class If {
    has $.cond;
    has @.body;
    has @.otherwise;
    method emit {
        my $cond := $.cond;

        if   $cond.isa( 'Apply' ) 
          && $cond.code eq 'prefix:<!>' 
        {
            my $if := ::If( cond => ($cond.arguments)[0], body => @.otherwise, otherwise => @.body );
            return $if.emit;
        }
        if   $cond.isa( 'Var' ) 
          && $cond.sigil eq '@' 
        {
            $cond := ::Apply( code => 'prefix:<@>', arguments => [ $cond ] );
        };
        'if (' ~ $cond.emit ~ ') { ' ~ (@.body.>>emit).join(';') ~ ' } else { ' ~ (@.otherwise.>>emit).join(';') ~ ' }';
    }
}

class For {
    has $.cond;
    has @.body;
    has @.topic;
    method emit {
        '(function (a_) { for (var i_ = 0; i_ < a_.length ; i_++) { ' 
            ~ '(function (' ~ $.topic.emit ~ ') { '
                ~ (@.body.>>emit).join(';') 
            ~ ' })(a_[i_]) } })' 
        ~ '(' ~ $.cond.emit ~ ')'
    }
}

class Decl {
    has $.decl;
    has $.type;
    has $.var;
    method emit {
        $.var.emit;
    }
}

class Sig {
    has $.invocant;
    has $.positional;
    has $.named;
    method emit {
        ' print \'Signature - TODO\'; die \'Signature - TODO\'; '
    };
}

class Method {
    has $.name;
    has $.sig;
    has @.block;
    method emit {
        my $sig := $.sig;
        my $invocant := $sig.invocant; 
        my $pos := $sig.positional;
        my $str := ((@$pos).>>emit).join(', ');  
        'function ' ~ $.name ~ '(' ~ $str ~ ') { ' ~ 
          ::MiniPerl6::Javascript::LexicalBlock( block => @.block ).emit ~ 
        ' }'
    }
}

class Sub {
    has $.name;
    has $.sig;
    has @.block;
    method emit {
        my $sig := $.sig;
        my $pos := $sig.positional;
        my $str := ((@$pos).>>emit).join(', ');  
        'function ' ~ $.name ~ '(' ~ $str ~ ') { ' ~ 
          ::MiniPerl6::Javascript::LexicalBlock( block => @.block ).emit ~ 
        ' }'
    }
}

class Do {
    has @.block;
    method emit {
        '(function () { ' ~ 
          ::MiniPerl6::Javascript::LexicalBlock( block => @.block ).emit ~ 
        ' })()'
    }
}

class Use {
    has $.mod;
    method emit {
        '// use ' ~ $.mod ~ Main.newline
    }
}

=begin

=head1 NAME 

MiniPerl6::Perl5::Emit - Code generator for MiniPerl6-in-Perl5

=head1 SYNOPSIS

    $program.emit  # generated Perl5 code

=head1 DESCRIPTION

This module generates Perl5 code for the MiniPerl6 compiler.

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
