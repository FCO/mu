// lib/MiniPerl6/Javascript/Runtime.js
//
// Runtime for "Perlito" MiniPerl6-in-Javascript
//
// AUTHORS
//
// Flavio Soibelmann Glock  fglock@gmail.com
// The Pugs Team  perl6-compiler@perl.org
//
// SEE ALSO
//
// The Perl 6 homepage at http://dev.perl.org/perl6
// The Pugs homepage at http://pugscode.org/
//
// COPYRIGHT
//
// Copyright 2009 by Flavio Soibelmann Glock and others.
// 
// This program is free software; you can redistribute it and/or modify it
// under the same terms as Perl itself.
// 
// See http://www.perl.com/perl/misc/Artistic.html


// class Main
if (typeof Main != 'object') {
  Main = function() {};
  Main = new Main;
}
(function () {
  // method newline
  Main.f_newline = function () {
    return "\n";
  }
  Main.f_lisp_escape_string = function (s) {
    var o = s;
    o.replace( /\\/g, "\\\\");
    o.replace( /"/g, "\\\"");
    return o;
  }
  Main.f_to_javascript_namespace = function (s) {
    var o = s;
    o.replace( /::/g, "$");
    return o;
  }
  Main._dump = function (o) {
    var out = [];
    for(var i in o) { 
      if ( i.match( /^v_/ ) ) {
        out.push( i.substr(2) + " => " + f_perl(o[i]) ) 
      }
    }
    return out.join(", ");
  }
})();

if (typeof MiniPerl6$Match != 'object') {
  MiniPerl6$Match = function() {};
  MiniPerl6$Match = new MiniPerl6$Match;
  MiniPerl6$Match.f_isa = function (s) { return s == 'MiniPerl6::Match' };
  MiniPerl6$Match.f_perl = function () { return '::MiniPerl6::Match(' + Main._dump(this) + ')' };
}
v_MATCH = { __proto__:MiniPerl6$Match };
MiniPerl6$Match.f_hash = function () { return this }

f_perl = function (o) {
  if ( o == null ) { return 'undef' };
  if ( typeof o.f_perl == 'function' ) { return o.f_perl() }
  if ( typeof o == 'object' && (o instanceof Array) ) {
    var out = [];
    for(var i = 0; i < o.length; i++) { out.push( f_perl(o[i]) ) }
    return "[" + out.join(", ") + "]";
  }
  switch (typeof o){
    case "string":   return '"' + Main.f_lisp_escape_string(o) + '"';
    case "function": return "function"; 
    case "number":   return o;
    case "boolean":  return o;
    case "undefined": return 'undef';
  }
    var out = [];
    for(var i in o) { 
      out.push( i + " => " + f_perl(o[i]) ) 
    }
    return '{' + out.join(", ") + '}';
}
f_isa = function (o, s) {
  if ( typeof o.f_isa == 'function' ) { return o.f_isa(s) }
  switch (typeof o){
    case "string":   return(s == 'Str');
    case "number":   return(s == 'Num');
  }
  if ( s == 'Array' && typeof o == 'object' && (o instanceof Array) ) { return(1) }
  return false;
}
f_scalar = function (o) { 
  if ( typeof o.f_scalar == 'function' ) { return o.f_scalar() }
  return o;
}
f_string = function (o) { 
  if ( typeof o.f_string == 'function' ) { return o.f_string() }
  return o;
}
f_bool = function (o) {
  if ( typeof o == 'boolean' ) { return o }
  if ( typeof o == 'number' ) { return o }
  if ( typeof o.f_bool == 'function' ) { return o.v_bool }
  if ( typeof o.length == 'number' ) { return o.length }
  return o;
}

// regex primitives
if (typeof MiniPerl6$Grammar != 'object') {
  MiniPerl6$Grammar = function() {};
  MiniPerl6$Grammar = new MiniPerl6$Grammar;
}
MiniPerl6$Grammar.f_word = function (v_str, v_pos) { 
    return {           
            __proto__:MiniPerl6$Match, 
            v_str:  v_str,
            v_from: v_pos, 
            v_to:   v_pos + 1,
            v_bool: v_str.substr(v_pos, 1).match(/\w/) != null
        };
} 
MiniPerl6$Grammar.f_digit = function (v_str, v_pos) { 
    return {           
            __proto__:MiniPerl6$Match, 
            v_str:  v_str,
            v_from: v_pos, 
            v_to:   v_pos + 1,
            v_bool: v_str.substr(v_pos, 1).match(/\d/) != null
        };
} 
MiniPerl6$Grammar.f_space = function (v_str, v_pos) { 
    return {           
            __proto__:MiniPerl6$Match, 
            v_str:  v_str,
            v_from: v_pos, 
            v_to:   v_pos + 1,
            v_bool: v_str.substr(v_pos, 1).match(/\s/) != null
        };
} 
MiniPerl6$Grammar.f_is_newline = function (v_str, v_pos) { 
    var m_ = v_str.substr(v_pos).match(/^(\r\n?|\n\r?)/);
    return {           
            __proto__:MiniPerl6$Match, 
            v_str:  v_str,
            v_from: v_pos, 
            v_to:   m_ != null ? v_pos + m_[0].length : v_pos,
            v_bool: m_ != null,
        };
} 
MiniPerl6$Grammar.f_not_newline = function (v_str, v_pos) { 
    return {           
            __proto__:MiniPerl6$Match, 
            v_str:  v_str,
            v_from: v_pos, 
            v_to:   v_pos + 1,
            v_bool: v_str.substr(v_pos, 1).match(/[^\r\n]/) != null
        };
} 

