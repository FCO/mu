{ package Main; 
# Do not edit this file - Perl 5 generated by HASH(0x1b0ede0)
# AUTHORS, COPYRIGHT: Please look at the source file.
use v5;
use strict;
no strict "vars";
use constant KP6_DISABLE_INSECURE_CODE => 0;
use KindaPerl6::Runtime::Perl5::Runtime;
my $_MODIFIED; INIT { $_MODIFIED = {} }
INIT { $_ = ::DISPATCH($::Scalar, "new", { modified => $_MODIFIED, name => "$_" } ); }
do {my $emit_p5; $emit_p5 = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$emit_p5' } )  unless defined $emit_p5; INIT { $emit_p5 = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$emit_p5' } ) }
;
my  $List_visitors = ::DISPATCH( $::ArrayContainer, 'new', { modified => $_MODIFIED, name => '$List_visitors' } ) ; 
;
my $code; $code = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$code' } )  unless defined $code; INIT { $code = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$code' } ) }
;
my $match; $match = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$match' } )  unless defined $match; INIT { $match = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$match' } ) }
;
my $parsed; $parsed = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$parsed' } )  unless defined $parsed; INIT { $parsed = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$parsed' } ) }
;
do { if (::DISPATCH(::DISPATCH(::DISPATCH(  ( $GLOBAL::Code_VAR_defined = $GLOBAL::Code_VAR_defined || ::DISPATCH( $::Routine, "new", )  ) 
, 'APPLY', $::Main )
,"true"),"p5landish") ) { do {my $emit_p5; $emit_p5 = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$emit_p5' } )  unless defined $emit_p5; INIT { $emit_p5 = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$emit_p5' } ) }
;
my  $List_visitors = ::DISPATCH( $::ArrayContainer, 'new', { modified => $_MODIFIED, name => '$List_visitors' } ) ; 
;
my $code; $code = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$code' } )  unless defined $code; INIT { $code = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$code' } ) }
;
my $match; $match = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$match' } )  unless defined $match; INIT { $match = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$match' } ) }
;
my $parsed; $parsed = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$parsed' } )  unless defined $parsed; INIT { $parsed = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$parsed' } ) }
;
} }  else { do {my $emit_p5; $emit_p5 = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$emit_p5' } )  unless defined $emit_p5; INIT { $emit_p5 = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$emit_p5' } ) }
;
my  $List_visitors = ::DISPATCH( $::ArrayContainer, 'new', { modified => $_MODIFIED, name => '$List_visitors' } ) ; 
;
my $code; $code = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$code' } )  unless defined $code; INIT { $code = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$code' } ) }
;
my $match; $match = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$match' } )  unless defined $match; INIT { $match = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$match' } ) }
;
my $parsed; $parsed = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$parsed' } )  unless defined $parsed; INIT { $parsed = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$parsed' } ) }
;
do {::MODIFIED($::Main);
$::Main = ::DISPATCH( ::DISPATCH( $::Class, 'new', ::DISPATCH( $::Str, 'new', 'Main' )
 )
, 'PROTOTYPE',  )
}} } }
; use KindaPerl6::Runtime::Perl5::KP6Runtime; use KindaPerl6::Grammar; use KindaPerl6::Traverse; use KindaPerl6::Ast; use KindaPerl6::Grammar::Regex; use KindaPerl6::Runtime::Perl6::Grammar; use KindaPerl6::Visitor::ExtractRuleBlock; use KindaPerl6::Visitor::Token; use KindaPerl6::Visitor::MetaClass; use KindaPerl6::Visitor::Global; use KindaPerl6::Visitor::Emit::Perl5; use KindaPerl6::Visitor::Emit::Perl5Regex; use KindaPerl6::Visitor::Emit::AstPerl; ::DISPATCH_VAR( $emit_p5, 'STORE', ::DISPATCH( $::KindaPerl6::Visitor::Emit::Perl5, 'new',  )
 )
; ::DISPATCH_VAR( ::DISPATCH( $emit_p5, 'visitor_args',  )
, 'STORE', do {my $emit_p5; $emit_p5 = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$emit_p5' } )  unless defined $emit_p5; INIT { $emit_p5 = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$emit_p5' } ) }
;
my  $List_visitors = ::DISPATCH( $::ArrayContainer, 'new', { modified => $_MODIFIED, name => '$List_visitors' } ) ; 
;
my $code; $code = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$code' } )  unless defined $code; INIT { $code = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$code' } ) }
;
my $match; $match = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$match' } )  unless defined $match; INIT { $match = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$match' } ) }
;
my $parsed; $parsed = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$parsed' } )  unless defined $parsed; INIT { $parsed = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$parsed' } ) }
;
::DISPATCH( $::Pair, 'new', { key => ::DISPATCH( $::Str, 'new', 'secure' )
, value => ::DISPATCH( $::Int, 'new', 1 )
 } )
} )
; $List_visitors; ::DISPATCH( $List_visitors, 'push', ::DISPATCH( $::KindaPerl6::Visitor::MetaClass, 'new',  )
 )
; ::DISPATCH( $List_visitors, 'push', ::DISPATCH( $::KindaPerl6::Visitor::Global, 'new',  )
 )
; ::DISPATCH( $List_visitors, 'push', ::DISPATCH( $::KindaPerl6::Visitor::Emit::Perl5Regex, 'new',  )
 )
; ::DISPATCH_VAR( $code, 'STORE', ::DISPATCH(  ( $GLOBAL::Code_slurp = $GLOBAL::Code_slurp || ::DISPATCH( $::Routine, "new", )  ) 
, 'APPLY',  )
 )
; ::DISPATCH(  ( $COMPILER::Code_env_init = $COMPILER::Code_env_init || ::DISPATCH( $::Routine, "new", )  ) 
, 'APPLY',  )
; ::DISPATCH_VAR( ::DISPATCH(  ( $GLOBAL::Code_ternary_58__60__63__63__32__33__33__62_ = $GLOBAL::Code_ternary_58__60__63__63__32__33__33__62_ || ::DISPATCH( $::Routine, "new", )  ) 
, 'APPLY', ::DISPATCH(  ( $GLOBAL::Code_VAR_defined = $GLOBAL::Code_VAR_defined || ::DISPATCH( $::Routine, "new", )  ) 
, 'APPLY',  ( $COMPILER::source_md5 = $COMPILER::source_md5 || ::DISPATCH( $::Scalar, "new", )  ) 
 )
,  ( $COMPILER::source_md5 = $COMPILER::source_md5 || ::DISPATCH( $::Scalar, "new", )  ) 
, do {::MODIFIED( ( $COMPILER::source_md5 = $COMPILER::source_md5 || ::DISPATCH( $::Scalar, "new", )  ) 
);
 ( $COMPILER::source_md5 = $COMPILER::source_md5 || ::DISPATCH( $::Scalar, "new", )  ) 
 = ::DISPATCH( $::Scalar, 'new',  )
} )
, 'STORE', ::DISPATCH( $::Str, 'new', 'temporary_value' )
 )
; ::DISPATCH_VAR( $_, 'STORE', $code )
; ::DISPATCH_VAR( $match, 'STORE', ::DISPATCH( $::KindaPerl6::Grammar, 'parse',  )
 )
; ::DISPATCH_VAR( $parsed, 'STORE', ::DISPATCH( $match, 'result',  )
 )
; ::DISPATCH( ::DISPATCH( $parsed, 'values',  )
, 'map', ::DISPATCH( $::Code, 'new', { code => sub { my $res; $res = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$res' } )  unless defined $res; INIT { $res = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$res' } ) }
;
my  $List__ = ::DISPATCH( $::ArrayContainer, 'new', { modified => $_MODIFIED, name => '$List__' } ) ; 
;
my $ast; $ast = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$ast' } )  unless defined $ast; INIT { $ast = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$ast' } ) }
;
my $CAPTURE; $CAPTURE = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$CAPTURE' } )  unless defined $CAPTURE; INIT { $CAPTURE = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$CAPTURE' } ) }
my  $List__ = ::DISPATCH( $::ArrayContainer, 'new', { modified => $_MODIFIED, name => '$List__' } ) ; 
::DISPATCH_VAR($CAPTURE,"STORE",::CAPTURIZE(\@_));::DISPATCH_VAR( $List__, 'STORE', ::DISPATCH( $CAPTURE, 'array',  )
 )
;do {::MODIFIED($Hash__);
$Hash__ = ::DISPATCH( $CAPTURE, 'hash',  )
};{ my $_param_index = 0;  if ( ::DISPATCH( $GLOBAL::Code_exists,  'APPLY',  ::DISPATCH(  $Hash__, 'LOOKUP',  ::DISPATCH( $::Str, 'new', 'ast' )  ) )->{_value}  )  { do {::MODIFIED($ast);
$ast = ::DISPATCH( $Hash__, 'LOOKUP', ::DISPATCH( $::Str, 'new', 'ast' )
 )
} }  elsif ( ::DISPATCH( $GLOBAL::Code_exists,  'APPLY',  ::DISPATCH(  $List__, 'INDEX',  ::DISPATCH( $::Int, 'new', $_param_index )  ) )->{_value}  )  { $ast = ::DISPATCH(  $List__, 'INDEX',  ::DISPATCH( $::Int, 'new', $_param_index++ )  );  } } ::DISPATCH(  ( $GLOBAL::Code_say = $GLOBAL::Code_say || ::DISPATCH( $::Routine, "new", )  ) 
, 'APPLY', ::DISPATCH( $ast, 'perl',  )
 )
; ::DISPATCH_VAR( $res, 'STORE', $ast )
; ::DISPATCH( $List_visitors, 'map', ::DISPATCH( $::Code, 'new', { code => sub { my  $List__ = ::DISPATCH( $::ArrayContainer, 'new', { modified => $_MODIFIED, name => '$List__' } ) ; 
;
my $visitor; $visitor = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$visitor' } )  unless defined $visitor; INIT { $visitor = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$visitor' } ) }
;
my $CAPTURE; $CAPTURE = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$CAPTURE' } )  unless defined $CAPTURE; INIT { $CAPTURE = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$CAPTURE' } ) }
my  $List__ = ::DISPATCH( $::ArrayContainer, 'new', { modified => $_MODIFIED, name => '$List__' } ) ; 
::DISPATCH_VAR($CAPTURE,"STORE",::CAPTURIZE(\@_));::DISPATCH_VAR( $List__, 'STORE', ::DISPATCH( $CAPTURE, 'array',  )
 )
;do {::MODIFIED($Hash__);
$Hash__ = ::DISPATCH( $CAPTURE, 'hash',  )
};{ my $_param_index = 0;  if ( ::DISPATCH( $GLOBAL::Code_exists,  'APPLY',  ::DISPATCH(  $Hash__, 'LOOKUP',  ::DISPATCH( $::Str, 'new', 'visitor' )  ) )->{_value}  )  { do {::MODIFIED($visitor);
$visitor = ::DISPATCH( $Hash__, 'LOOKUP', ::DISPATCH( $::Str, 'new', 'visitor' )
 )
} }  elsif ( ::DISPATCH( $GLOBAL::Code_exists,  'APPLY',  ::DISPATCH(  $List__, 'INDEX',  ::DISPATCH( $::Int, 'new', $_param_index )  ) )->{_value}  )  { $visitor = ::DISPATCH(  $List__, 'INDEX',  ::DISPATCH( $::Int, 'new', $_param_index++ )  );  } } ::DISPATCH_VAR( $res, 'STORE', ::DISPATCH( $res, 'emit', $visitor )
 )
 }, signature => ::DISPATCH( $::Signature, "new", { invocant => $::Undef, array    => ::DISPATCH( $::List, "new", { _array => [ ::DISPATCH( $::Signature::Item, 'new', { sigil  => '$', twigil => '', name   => 'visitor', value  => $::Undef, has_default    => ::DISPATCH( $::Bit, 'new', 0 )
, is_named_only  => ::DISPATCH( $::Bit, 'new', 0 )
, is_optional    => ::DISPATCH( $::Bit, 'new', 0 )
, is_slurpy      => ::DISPATCH( $::Bit, 'new', 0 )
, is_multidimensional  => ::DISPATCH( $::Bit, 'new', 0 )
, is_rw          => ::DISPATCH( $::Bit, 'new', 0 )
, is_copy        => ::DISPATCH( $::Bit, 'new', 0 )
,  } )
,  ] } ), return   => $::Undef, } )
,  } )
 )
; ::DISPATCH(  ( $GLOBAL::Code_print = $GLOBAL::Code_print || ::DISPATCH( $::Routine, "new", )  ) 
, 'APPLY', $res )
 }, signature => ::DISPATCH( $::Signature, "new", { invocant => $::Undef, array    => ::DISPATCH( $::List, "new", { _array => [ ::DISPATCH( $::Signature::Item, 'new', { sigil  => '$', twigil => '', name   => 'ast', value  => $::Undef, has_default    => ::DISPATCH( $::Bit, 'new', 0 )
, is_named_only  => ::DISPATCH( $::Bit, 'new', 0 )
, is_optional    => ::DISPATCH( $::Bit, 'new', 0 )
, is_slurpy      => ::DISPATCH( $::Bit, 'new', 0 )
, is_multidimensional  => ::DISPATCH( $::Bit, 'new', 0 )
, is_rw          => ::DISPATCH( $::Bit, 'new', 0 )
, is_copy        => ::DISPATCH( $::Bit, 'new', 0 )
,  } )
,  ] } ), return   => $::Undef, } )
,  } )
 )
}
; 1 }
