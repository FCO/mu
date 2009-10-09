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
} (function() {
    // method newline
    Main.f_newline = function() {
        return "\n";
    }
    Main.f_lisp_escape_string = function(s) {
        var o = s;
        o = o.replace(/\\/g, "\\\\");
        o = o.replace(/"/g, "\\\"");
        o = o.replace(/\n/g, "\\n");
        return o;
    }
    Main.f_to_javascript_namespace = function(s) {
        var o = s;
        o = o.replace(/::/g, "$");
        return o;
    }
    Main._dump = function(o) {
        var out = [];
        for (var i in o) {
            if (i.match(/^v_/)) {
                out.push(i.substr(2) + " => " + f_perl(o[i]))
            }
        }
        return out.join(", ");
    }
})();

if (typeof MiniPerl6$Match != 'object') {
    MiniPerl6$Match = function() {};
    MiniPerl6$Match = new MiniPerl6$Match;
    MiniPerl6$Match.f_isa = function(s) {
        return s == 'MiniPerl6::Match'
    };
    MiniPerl6$Match.f_perl = function() {
        return '::MiniPerl6::Match(' + Main._dump(this) + ')'
    };
}
v_MATCH = {
    __proto__: MiniPerl6$Match
};
MiniPerl6$Match.f_hash = function() {
    return this
}

if (typeof say != 'function') {
    say = function(s) {
        print(s + "\n")
    }
}
if (typeof f_die != 'function') {
    f_die = function(s) {
        print("Died: " + s + "\n")
    }
}
if (typeof f_warn != 'function') {
    f_warn = function(s) {
        print("Warning: " + s + "\n")
    }
}
f_perl = function(o) {
    if (o == null) {
        return 'undef'
    };
    if (typeof o.f_perl == 'function') {
        return o.f_perl()
    }
    if (typeof o == 'object' && (o instanceof Array)) {
        var out = [];
        for (var i = 0; i < o.length; i++) {
            out.push(f_perl(o[i]))
        }
        return "[" + out.join(", ") + "]";
    }
    switch (typeof o) {
    case "string":
        return '"' + Main.f_lisp_escape_string(o) + '"';
    case "function":
        return "function";
    case "number":
        return o;
    case "boolean":
        return o;
    case "undefined":
        return 'undef';
    }
    var out = [];
    for (var i in o) {
        out.push(i + " => " + f_perl(o[i]))
    }
    return '{' + out.join(", ") + '}';
}
f_isa = function(o, s) {
    if (typeof o.f_isa == 'function') {
        return o.f_isa(s)
    }
    switch (typeof o) {
    case "string":
        return (s == 'Str');
    case "number":
        return (s == 'Num');
    }
    if (s == 'Array' && typeof o == 'object' && (o instanceof Array)) {
        return (1)
    }
    return false;
}
f_scalar = function(o) {
    if (typeof o == 'undefined') {
        return o
    }
    if (typeof o.f_scalar == 'function') {
        return o.f_scalar()
    }
    return o;
}
f_string = function(o) {
    if (typeof o.f_string == 'function') {
        return o.f_string()
    }
    return o;
}
f_bool = function(o) {
    if (o == null) {
        return o
    }
    if (typeof o == 'boolean') {
        return o
    }
    if (typeof o == 'number') {
        return o
    }
    if (typeof o.f_bool == 'function') {
        return o.v_bool
    }
    if (typeof o.length == 'number') {
        return o.length
    }
    return o;
}
f_pop = function(o) {
    return o.pop();
}
f_index = function (o, s) {
  return o.indexOf(s);
}
Main.chars = function(o) {
    if (typeof o.f_string == 'function') {
        return o.f_string().length
    }
    return o.length;
}

// regex primitives
if (typeof MiniPerl6$Grammar != 'object') {
    MiniPerl6$Grammar = function() {};
    MiniPerl6$Grammar = new MiniPerl6$Grammar;
}
MiniPerl6$Grammar.f_word = function(v_str, v_pos) {
    return {
        __proto__: MiniPerl6$Match,
        v_str: v_str,
        v_from: v_pos,
        v_to: v_pos + 1,
        v_bool: v_str.substr(v_pos, 1).match(/\w/) != null
    };
}
MiniPerl6$Grammar.f_digit = function(v_str, v_pos) {
    return {
        __proto__: MiniPerl6$Match,
        v_str: v_str,
        v_from: v_pos,
        v_to: v_pos + 1,
        v_bool: v_str.substr(v_pos, 1).match(/\d/) != null
    };
}
MiniPerl6$Grammar.f_space = function(v_str, v_pos) {
    return {
        __proto__: MiniPerl6$Match,
        v_str: v_str,
        v_from: v_pos,
        v_to: v_pos + 1,
        v_bool: v_str.substr(v_pos, 1).match(/\s/) != null
    };
}
MiniPerl6$Grammar.f_is_newline = function(v_str, v_pos) {
    var m_ = v_str.substr(v_pos).match(/^(\r\n?|\n\r?)/);
    return {
        __proto__: MiniPerl6$Match,
        v_str: v_str,
        v_from: v_pos,
        v_to: m_ != null ? v_pos + m_[0].length : v_pos,
        v_bool: m_ != null,
    };
}
MiniPerl6$Grammar.f_not_newline = function(v_str, v_pos) {
    return {
        __proto__: MiniPerl6$Match,
        v_str: v_str,
        v_from: v_pos,
        v_to: v_pos + 1,
        v_bool: v_str.substr(v_pos, 1).match(/[^\r\n]/) != null
    };
}

// Do not edit this file - Generated by MiniPerl6
// class MiniPerl6::Match
if (typeof MiniPerl6$Match != 'object') {
    MiniPerl6$Match = function() {};
    MiniPerl6$Match = new MiniPerl6$Match;
    MiniPerl6$Match.f_isa = function(s) {
        return s == 'MiniPerl6::Match'
    };
    MiniPerl6$Match.f_perl = function() {
        return '::MiniPerl6::Match(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor from
    MiniPerl6$Match.v_from = null;
    MiniPerl6$Match.f_from = function() {
        return this.v_from
    }
    // accessor to
    MiniPerl6$Match.v_to = null;
    MiniPerl6$Match.f_to = function() {
        return this.v_to
    }
    // accessor str
    MiniPerl6$Match.v_str = null;
    MiniPerl6$Match.f_str = function() {
        return this.v_str
    }
    // accessor bool
    MiniPerl6$Match.v_bool = null;
    MiniPerl6$Match.f_bool = function() {
        return this.v_bool
    }
    // accessor capture
    MiniPerl6$Match.v_capture = null;
    MiniPerl6$Match.f_capture = function() {
        return this.v_capture
    }
    // method scalar
    MiniPerl6$Match.f_scalar = function() {
        var v_self = this;
        try {
            if (f_bool(this.v_bool)) {
                if (f_bool((this.v_capture != null))) {
                    throw (this.v_capture)
                } else {};
                throw ((this.v_str).substr(this.v_from, (this.v_to - this.v_from)))
            } else {
                throw ("")
            }
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Match.f_scalar; // v8 bug workaround
    // method string
    MiniPerl6$Match.f_string = function() {
        var v_self = this;
        try {
            if (f_bool(this.v_bool)) {
                if (f_bool((this.v_capture != null))) {
                    throw (this.v_capture)
                } else {};
                throw ((this.v_str).substr(this.v_from, (this.v_to - this.v_from)))
            } else {
                throw ("")
            }
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Match.f_string; // v8 bug workaround
})();

;
// class Pair
if (typeof Pair != 'object') {
    Pair = function() {};
    Pair = new Pair;
    Pair.f_isa = function(s) {
        return s == 'Pair'
    };
    Pair.f_perl = function() {
        return '::Pair(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor key
    Pair.v_key = null;
    Pair.f_key = function() {
        return this.v_key
    }
    // accessor value
    Pair.v_value = null;
    Pair.f_value = function() {
        return this.v_value
    }
    // method perl
    Pair.f_perl = function() {
        var v_self = this;
        try {
            throw ((f_string(this.v_key) + f_string((f_string(" => ") + f_string(f_perl(this.v_value))))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Pair.f_perl; // v8 bug workaround
})();

;
// class Main
if (typeof Main != 'object') {
    Main = function() {};
    Main = new Main;
    Main.f_isa = function(s) {
        return s == 'Main'
    };
    Main.f_perl = function() {
        return '::Main(' + Main._dump(this) + ')'
    };
} (function() {
    // sub to_lisp_identifier
    Main.f_to_lisp_identifier = function(v_ident) {
        try {
            throw ((f_string("sv-") + f_string(v_ident)))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    // sub lisp_dump_object
    Main.f_lisp_dump_object = function(v_class_name, v_data) {
        try {
            throw ((f_string(v_class_name) + f_string((f_string("( ") + f_string((f_string((function(a_) {
                var out = [];
                if (typeof a_ == 'undefined') {
                    return out
                };
                for (var i = 0; i < a_.length; i++) {
                    out.push(f_perl(a_[i]))
                }
                return out;
            })(v_data).join(", ")) + f_string(" )")))))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
})();

;
// Do not edit this file - Generated by MiniPerl6
// class MiniPerl6::Javascript::LexicalBlock
if (typeof MiniPerl6$Javascript$LexicalBlock != 'object') {
    MiniPerl6$Javascript$LexicalBlock = function() {};
    MiniPerl6$Javascript$LexicalBlock = new MiniPerl6$Javascript$LexicalBlock;
    MiniPerl6$Javascript$LexicalBlock.f_isa = function(s) {
        return s == 'MiniPerl6::Javascript::LexicalBlock'
    };
    MiniPerl6$Javascript$LexicalBlock.f_perl = function() {
        return '::MiniPerl6::Javascript::LexicalBlock(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor block
    MiniPerl6$Javascript$LexicalBlock.v_block = null;
    MiniPerl6$Javascript$LexicalBlock.f_block = function() {
        return this.v_block
    }
    // accessor needs_return
    MiniPerl6$Javascript$LexicalBlock.v_needs_return = null;
    MiniPerl6$Javascript$LexicalBlock.f_needs_return = function() {
        return this.v_needs_return
    }
    // accessor top_level
    MiniPerl6$Javascript$LexicalBlock.v_top_level = null;
    MiniPerl6$Javascript$LexicalBlock.f_top_level = function() {
        return this.v_top_level
    }
    // method emit
    MiniPerl6$Javascript$LexicalBlock.f_emit = function() {
        var v_self = this;
        try {
            var v_str;
            var v_last_statement = null;
            if (f_bool((this.v_block))) {} else {
                throw ("null")
            };
            (v_str = "");
            (function(a_) {
                for (var i_ = 0; i_ < a_.length; i_++) {
                    (function(v_decl) {
                        if (f_bool((f_bool(f_isa(v_decl, "Decl")) && f_bool((v_decl.f_decl() == "my"))))) {
                            (v_str = (f_string(v_str) + f_string((f_string("var ") + f_string((f_string(v_decl.f_var().f_emit()) + f_string(" = null;")))))))
                        } else {}; if (f_bool((f_bool(f_isa(v_decl, "Bind")) && f_bool((f_bool(f_isa(v_decl.f_parameters(), "Decl")) && f_bool((v_decl.f_parameters().f_decl() == "my"))))))) {
                            (v_str = (f_string(v_str) + f_string((f_string("var ") + f_string((f_string(v_decl.f_parameters().f_var().f_emit()) + f_string(";")))))))
                        } else {}
                    })(a_[i_])
                }
            })(this.v_block);
            if (f_bool(this.v_needs_return)) {
                (v_last_statement = f_pop(this.v_block))
            } else {};
            (function(a_) {
                for (var i_ = 0; i_ < a_.length; i_++) {
                    (function(v_decl) {
                        if (f_bool((f_bool(f_isa(v_decl, "Decl")) && f_bool((v_decl.f_decl() == "my"))))) {} else {
                            (v_str = (f_string(v_str) + f_string((f_string(v_decl.f_emit()) + f_string(";")))))
                        }
                    })(a_[i_])
                }
            })(this.v_block);
            if (f_bool((f_bool(this.v_needs_return) && f_bool(v_last_statement)))) {
                if (f_bool(f_isa(v_last_statement, "If"))) {
                    (v_cond = v_last_statement.f_cond());
                    (v_body = v_last_statement.f_body());
                    (v_otherwise = v_last_statement.f_otherwise());
                    if (f_bool((f_bool(f_isa(v_cond, "Apply")) && f_bool((v_cond.f_code() == "prefix:<!>"))))) {
                        (v_cond = v_cond.f_arguments()[0]);
                        (v_body = v_last_statement.f_otherwise());
                        (v_otherwise = v_last_statement.f_body())
                    } else {}; if (f_bool((f_bool(f_isa(v_cond, "Var")) && f_bool((v_cond.f_sigil() == "@"))))) {
                        (v_cond = {
                            __proto__: Apply,
                            v_code: "prefix:<@>",
                            v_arguments: [v_cond],
                        })
                    } else {};
                    (v_body = {
                        __proto__: MiniPerl6$Javascript$LexicalBlock,
                        v_block: v_body,
                        v_needs_return: 1,
                    });
                    (v_otherwise = {
                        __proto__: MiniPerl6$Javascript$LexicalBlock,
                        v_block: v_otherwise,
                        v_needs_return: 1,
                    });
                    (v_str = (f_string(v_str) + f_string((f_string("if ( f_bool(") + f_string((f_string(v_cond.f_emit()) + f_string((f_string(") ) { ") + f_string((f_string(v_body.f_emit()) + f_string((f_string(" } else { ") + f_string((f_string(v_otherwise.f_emit()) + f_string(" }")))))))))))))))
                } else { if (f_bool((f_bool(f_isa(v_last_statement, "Return")) || f_bool(f_isa(v_last_statement, "For"))))) {
                        (v_str = (f_string(v_str) + f_string(v_last_statement.f_emit())))
                    } else {
                        (v_str = (f_string(v_str) + f_string((f_string("return(") + f_string((f_string(v_last_statement.f_emit()) + f_string(")")))))))
                    }
                }
            } else {}; if (f_bool(this.v_top_level)) {
                (v_str = (f_string("try { ") + f_string((f_string(v_str) + f_string((f_string(" } catch(err) { ") + f_string((f_string("if ( err instanceof Error ) { ") + f_string((f_string("throw(err) ") + f_string((f_string("} ") + f_string((f_string("else { ") + f_string((f_string("return(err) ") + f_string((f_string("} ") + f_string("} ")))))))))))))))))))
            } else {};
            throw (v_str)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Javascript$LexicalBlock.f_emit; // v8 bug workaround
})();

;
// class CompUnit
if (typeof CompUnit != 'object') {
    CompUnit = function() {};
    CompUnit = new CompUnit;
    CompUnit.f_isa = function(s) {
        return s == 'CompUnit'
    };
    CompUnit.f_perl = function() {
        return '::CompUnit(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor name
    CompUnit.v_name = null;
    CompUnit.f_name = function() {
        return this.v_name
    }
    // accessor attributes
    CompUnit.v_attributes = null;
    CompUnit.f_attributes = function() {
        return this.v_attributes
    }
    // accessor methods
    CompUnit.v_methods = null;
    CompUnit.f_methods = function() {
        return this.v_methods
    }
    // accessor body
    CompUnit.v_body = null;
    CompUnit.f_body = function() {
        return this.v_body
    }
    // method emit
    CompUnit.f_emit = function() {
        var v_self = this;
        try {
            var v_class_name;
            var v_str;
            (v_class_name = Main.f_to_javascript_namespace(this.v_name));
            (v_str = (f_string("// class ") + f_string((f_string(this.v_name) + f_string((f_string(Main.f_newline()) + f_string((f_string("if (typeof ") + f_string((f_string(v_class_name) + f_string((f_string(" != 'object') {") + f_string((f_string(Main.f_newline()) + f_string((f_string("  ") + f_string((f_string(v_class_name) + f_string((f_string(" = function() {};") + f_string((f_string(Main.f_newline()) + f_string((f_string("  ") + f_string((f_string(v_class_name) + f_string((f_string(" = new ") + f_string((f_string(v_class_name) + f_string((f_string(";") + f_string((f_string(Main.f_newline()) + f_string((f_string("  ") + f_string((f_string(v_class_name) + f_string((f_string(".f_isa = function (s) { return s == '") + f_string((f_string(this.v_name) + f_string((f_string("' };") + f_string((f_string(Main.f_newline()) + f_string((f_string("  ") + f_string((f_string(v_class_name) + f_string((f_string(".f_perl = function () { return '::") + f_string((f_string(this.v_name) + f_string((f_string("(' + Main._dump(this) + ')' };") + f_string((f_string(Main.f_newline()) + f_string((f_string("}") + f_string((f_string(Main.f_newline()) + f_string((f_string("(function () {") + f_string(Main.f_newline())))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))));
            (function(a_) {
                for (var i_ = 0; i_ < a_.length; i_++) {
                    (function(v_decl) {
                        if (f_bool((f_bool(f_isa(v_decl, "Decl")) && f_bool((v_decl.f_decl() == "my"))))) {
                            (v_str = (f_string(v_str) + f_string((f_string("  var ") + f_string((f_string(v_decl.f_var().f_emit()) + f_string((f_string(" = null;") + f_string(Main.f_newline())))))))))
                        } else {}; if (f_bool((f_bool(f_isa(v_decl, "Bind")) && f_bool((f_bool(f_isa(v_decl.f_parameters(), "Decl")) && f_bool((v_decl.f_parameters().f_decl() == "my"))))))) {
                            (v_str = (f_string(v_str) + f_string((f_string("  var ") + f_string((f_string(v_decl.f_parameters().f_var().f_emit()) + f_string((f_string(";") + f_string(Main.f_newline())))))))))
                        } else {}
                    })(a_[i_])
                }
            })(this.v_body);
            (function(a_) {
                for (var i_ = 0; i_ < a_.length; i_++) {
                    (function(v_decl) {
                        if (f_bool((f_bool(f_isa(v_decl, "Decl")) && f_bool((v_decl.f_decl() == "has"))))) {
                            (v_str = (f_string(v_str) + f_string((f_string("  // accessor ") + f_string((f_string(v_decl.f_var().f_name()) + f_string((f_string(Main.f_newline()) + f_string((f_string("  ") + f_string((f_string(v_class_name) + f_string((f_string(".v_") + f_string((f_string(v_decl.f_var().f_name()) + f_string((f_string(" = null;") + f_string((f_string(Main.f_newline()) + f_string((f_string("  ") + f_string((f_string(v_class_name) + f_string((f_string(".f_") + f_string((f_string(v_decl.f_var().f_name()) + f_string((f_string(" = function () { return this.v_") + f_string((f_string(v_decl.f_var().f_name()) + f_string((f_string(" }") + f_string(Main.f_newline())))))))))))))))))))))))))))))))))))
                        } else {}; if (f_bool(f_isa(v_decl, "Method"))) {
                            (v_sig = v_decl.f_sig());
                            (v_pos = v_sig.f_positional());
                            (v_invocant = v_sig.f_invocant());
                            (v_block = {
                                __proto__: MiniPerl6$Javascript$LexicalBlock,
                                v_block: v_decl.f_block(),
                                v_needs_return: 1,
                                v_top_level: 1,
                            });
                            (v_str = (f_string(v_str) + f_string((f_string("  // method ") + f_string((f_string(v_decl.f_name()) + f_string((f_string(Main.f_newline()) + f_string((f_string("  ") + f_string((f_string(v_class_name) + f_string((f_string(".f_") + f_string((f_string(v_decl.f_name()) + f_string((f_string(" = function (") + f_string((f_string((function(a_) {
                                var out = [];
                                if (typeof a_ == 'undefined') {
                                    return out
                                };
                                for (var i = 0; i < a_.length; i++) {
                                    out.push(a_[i].f_emit())
                                }
                                return out;
                            })((v_pos)).join(", ")) + f_string((f_string(") {") + f_string((f_string(Main.f_newline()) + f_string((f_string("    var ") + f_string((f_string(v_invocant.f_emit()) + f_string((f_string(" = this;") + f_string((f_string(Main.f_newline()) + f_string((f_string("    ") + f_string((f_string(v_block.f_emit()) + f_string((f_string(Main.f_newline()) + f_string((f_string("  }") + f_string((f_string(Main.f_newline()) + f_string((f_string("  ") + f_string((f_string(v_class_name) + f_string((f_string(".f_") + f_string((f_string(v_decl.f_name()) + f_string((f_string(";  // v8 bug workaround") + f_string(Main.f_newline())))))))))))))))))))))))))))))))))))))))))))))))))))))
                        } else {}; if (f_bool(f_isa(v_decl, "Sub"))) {
                            (v_sig = v_decl.f_sig());
                            (v_pos = v_sig.f_positional());
                            (v_block = {
                                __proto__: MiniPerl6$Javascript$LexicalBlock,
                                v_block: v_decl.f_block(),
                                v_needs_return: 1,
                                v_top_level: 1,
                            });
                            (v_str = (f_string(v_str) + f_string((f_string("  // sub ") + f_string((f_string(v_decl.f_name()) + f_string((f_string(Main.f_newline()) + f_string((f_string("  ") + f_string((f_string(v_class_name) + f_string((f_string(".f_") + f_string((f_string(v_decl.f_name()) + f_string((f_string(" = function (") + f_string((f_string((function(a_) {
                                var out = [];
                                if (typeof a_ == 'undefined') {
                                    return out
                                };
                                for (var i = 0; i < a_.length; i++) {
                                    out.push(a_[i].f_emit())
                                }
                                return out;
                            })((v_pos)).join(", ")) + f_string((f_string(") {") + f_string((f_string(Main.f_newline()) + f_string((f_string("    ") + f_string((f_string(v_block.f_emit()) + f_string((f_string(Main.f_newline()) + f_string((f_string("  }") + f_string(Main.f_newline())))))))))))))))))))))))))))))))))
                        } else {}
                    })(a_[i_])
                }
            })(this.v_body);
            (function(a_) {
                for (var i_ = 0; i_ < a_.length; i_++) {
                    (function(v_decl) {
                        if (f_bool((f_bool((f_bool((f_bool(f_isa(v_decl, "Decl")) && f_bool((f_bool((v_decl.f_decl() == "has")) || f_bool((v_decl.f_decl() == "my")))))) ? false : true)) && f_bool((f_bool((f_bool(f_isa(v_decl, "Method")) ? false : true)) && f_bool((f_bool(f_isa(v_decl, "Sub")) ? false : true))))))) {
                            (v_str = (f_string(v_str) + f_string((f_string(v_decl.f_emit()) + f_string(";")))))
                        } else {}
                    })(a_[i_])
                }
            })(this.v_body);
            return ((v_str = (f_string(v_str) + f_string((f_string("}") + f_string((f_string(")();") + f_string(Main.f_newline()))))))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    CompUnit.f_emit; // v8 bug workaround
})();

;
// class Val::Int
if (typeof Val$Int != 'object') {
    Val$Int = function() {};
    Val$Int = new Val$Int;
    Val$Int.f_isa = function(s) {
        return s == 'Val::Int'
    };
    Val$Int.f_perl = function() {
        return '::Val::Int(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor int
    Val$Int.v_int = null;
    Val$Int.f_int = function() {
        return this.v_int
    }
    // method emit
    Val$Int.f_emit = function() {
        var v_self = this;
        try {
            return (this.v_int)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Val$Int.f_emit; // v8 bug workaround
})();

;
// class Val::Bit
if (typeof Val$Bit != 'object') {
    Val$Bit = function() {};
    Val$Bit = new Val$Bit;
    Val$Bit.f_isa = function(s) {
        return s == 'Val::Bit'
    };
    Val$Bit.f_perl = function() {
        return '::Val::Bit(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor bit
    Val$Bit.v_bit = null;
    Val$Bit.f_bit = function() {
        return this.v_bit
    }
    // method emit
    Val$Bit.f_emit = function() {
        var v_self = this;
        try {
            return (this.v_bit)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Val$Bit.f_emit; // v8 bug workaround
})();

;
// class Val::Num
if (typeof Val$Num != 'object') {
    Val$Num = function() {};
    Val$Num = new Val$Num;
    Val$Num.f_isa = function(s) {
        return s == 'Val::Num'
    };
    Val$Num.f_perl = function() {
        return '::Val::Num(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor num
    Val$Num.v_num = null;
    Val$Num.f_num = function() {
        return this.v_num
    }
    // method emit
    Val$Num.f_emit = function() {
        var v_self = this;
        try {
            return (this.v_num)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Val$Num.f_emit; // v8 bug workaround
})();

;
// class Val::Buf
if (typeof Val$Buf != 'object') {
    Val$Buf = function() {};
    Val$Buf = new Val$Buf;
    Val$Buf.f_isa = function(s) {
        return s == 'Val::Buf'
    };
    Val$Buf.f_perl = function() {
        return '::Val::Buf(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor buf
    Val$Buf.v_buf = null;
    Val$Buf.f_buf = function() {
        return this.v_buf
    }
    // method emit
    Val$Buf.f_emit = function() {
        var v_self = this;
        try {
            return ((f_string("\"") + f_string((f_string(Main.f_lisp_escape_string(this.v_buf)) + f_string("\"")))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Val$Buf.f_emit; // v8 bug workaround
})();

;
// class Val::Undef
if (typeof Val$Undef != 'object') {
    Val$Undef = function() {};
    Val$Undef = new Val$Undef;
    Val$Undef.f_isa = function(s) {
        return s == 'Val::Undef'
    };
    Val$Undef.f_perl = function() {
        return '::Val::Undef(' + Main._dump(this) + ')'
    };
} (function() {
    // method emit
    Val$Undef.f_emit = function() {
        var v_self = this;
        try {
            return ("null")
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Val$Undef.f_emit; // v8 bug workaround
})();

;
// class Val::Object
if (typeof Val$Object != 'object') {
    Val$Object = function() {};
    Val$Object = new Val$Object;
    Val$Object.f_isa = function(s) {
        return s == 'Val::Object'
    };
    Val$Object.f_perl = function() {
        return '::Val::Object(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor class
    Val$Object.v_class = null;
    Val$Object.f_class = function() {
        return this.v_class
    }
    // accessor fields
    Val$Object.v_fields = null;
    Val$Object.f_fields = function() {
        return this.v_fields
    }
    // method emit
    Val$Object.f_emit = function() {
        var v_self = this;
        try {
            return (f_die("Val::Object - not used yet"))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Val$Object.f_emit; // v8 bug workaround
})();

;
// class Lit::Seq
if (typeof Lit$Seq != 'object') {
    Lit$Seq = function() {};
    Lit$Seq = new Lit$Seq;
    Lit$Seq.f_isa = function(s) {
        return s == 'Lit::Seq'
    };
    Lit$Seq.f_perl = function() {
        return '::Lit::Seq(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor seq
    Lit$Seq.v_seq = null;
    Lit$Seq.f_seq = function() {
        return this.v_seq
    }
    // method emit
    Lit$Seq.f_emit = function() {
        var v_self = this;
        try {
            return ((f_string("(") + f_string((f_string((function(a_) {
                var out = [];
                if (typeof a_ == 'undefined') {
                    return out
                };
                for (var i = 0; i < a_.length; i++) {
                    out.push(a_[i].f_emit())
                }
                return out;
            })(this.v_seq).join(", ")) + f_string(")")))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Lit$Seq.f_emit; // v8 bug workaround
})();

;
// class Lit::Array
if (typeof Lit$Array != 'object') {
    Lit$Array = function() {};
    Lit$Array = new Lit$Array;
    Lit$Array.f_isa = function(s) {
        return s == 'Lit::Array'
    };
    Lit$Array.f_perl = function() {
        return '::Lit::Array(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor array
    Lit$Array.v_array = null;
    Lit$Array.f_array = function() {
        return this.v_array
    }
    // method emit
    Lit$Array.f_emit = function() {
        var v_self = this;
        try {
            var v_needs_interpolation;
            (v_needs_interpolation = 0);
            (function(a_) {
                for (var i_ = 0; i_ < a_.length; i_++) {
                    (function(v_item) {
                        if (f_bool((f_bool((f_bool(f_isa(v_item, "Var")) && f_bool((v_item.f_sigil() == "@")))) || f_bool((f_bool(f_isa(v_item, "Apply")) && f_bool((v_item.f_code() == "prefix:<@>"))))))) {
                            (v_needs_interpolation = 1)
                        } else {}
                    })(a_[i_])
                }
            })(this.v_array);
            if (f_bool(v_needs_interpolation)) {
                var v_s;
                (v_s = "");
                (function(a_) {
                    for (var i_ = 0; i_ < a_.length; i_++) {
                        (function(v_item) {
                            if (f_bool((f_bool((f_bool(f_isa(v_item, "Var")) && f_bool((v_item.f_sigil() == "@")))) || f_bool((f_bool(f_isa(v_item, "Apply")) && f_bool((v_item.f_code() == "prefix:<@>"))))))) {
                                (v_s = (f_string(v_s) + f_string((f_string("(function(a_) { ") + f_string((f_string("for (var i_ = 0; i_ < a_.length ; i_++) { a.push(a_[i_]) }") + f_string((f_string("})(") + f_string((f_string(v_item.f_emit()) + f_string("); ")))))))))))
                            } else {
                                (v_s = (f_string(v_s) + f_string((f_string("a.push(") + f_string((f_string(v_item.f_emit()) + f_string("); ")))))))
                            }
                        })(a_[i_])
                    }
                })(this.v_array);
                return ((f_string("(function () { var a = []; ") + f_string((f_string(v_s) + f_string(" return a })()")))))
            } else {
                return ((f_string("[") + f_string((f_string((function(a_) {
                    var out = [];
                    if (typeof a_ == 'undefined') {
                        return out
                    };
                    for (var i = 0; i < a_.length; i++) {
                        out.push(a_[i].f_emit())
                    }
                    return out;
                })(this.v_array).join(", ")) + f_string("]")))))
            }
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Lit$Array.f_emit; // v8 bug workaround
})();

;
// class Lit::Hash
if (typeof Lit$Hash != 'object') {
    Lit$Hash = function() {};
    Lit$Hash = new Lit$Hash;
    Lit$Hash.f_isa = function(s) {
        return s == 'Lit::Hash'
    };
    Lit$Hash.f_perl = function() {
        return '::Lit::Hash(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor hash
    Lit$Hash.v_hash = null;
    Lit$Hash.f_hash = function() {
        return this.v_hash
    }
    // method emit
    Lit$Hash.f_emit = function() {
        var v_self = this;
        try {
            var v_fields;
            var v_str;
            (v_fields = this.v_hash);
            (v_str = "");
            (function(a_) {
                for (var i_ = 0; i_ < a_.length; i_++) {
                    (function(v_field) {
                        (v_str = (f_string(v_str) + f_string((f_string(v_field[0].f_emit()) + f_string((f_string(":") + f_string((f_string(v_field[1].f_emit()) + f_string(",")))))))))
                    })(a_[i_])
                }
            })((v_fields));
            return ((f_string("{ ") + f_string((f_string(v_str) + f_string(" }")))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Lit$Hash.f_emit; // v8 bug workaround
})();

;
// class Lit::Code
if (typeof Lit$Code != 'object') {
    Lit$Code = function() {};
    Lit$Code = new Lit$Code;
    Lit$Code.f_isa = function(s) {
        return s == 'Lit::Code'
    };
    Lit$Code.f_perl = function() {
        return '::Lit::Code(' + Main._dump(this) + ')'
    };
} (function() {
    1;
})();

;
// class Lit::Object
if (typeof Lit$Object != 'object') {
    Lit$Object = function() {};
    Lit$Object = new Lit$Object;
    Lit$Object.f_isa = function(s) {
        return s == 'Lit::Object'
    };
    Lit$Object.f_perl = function() {
        return '::Lit::Object(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor class
    Lit$Object.v_class = null;
    Lit$Object.f_class = function() {
        return this.v_class
    }
    // accessor fields
    Lit$Object.v_fields = null;
    Lit$Object.f_fields = function() {
        return this.v_fields
    }
    // method emit
    Lit$Object.f_emit = function() {
        var v_self = this;
        try {
            var v_fields;
            var v_str;
            (v_fields = this.v_fields);
            (v_str = "");
            (function(a_) {
                for (var i_ = 0; i_ < a_.length; i_++) {
                    (function(v_field) {
                        (v_str = (f_string(v_str) + f_string((f_string("v_") + f_string((f_string(v_field[0].f_buf()) + f_string((f_string(": ") + f_string((f_string(v_field[1].f_emit()) + f_string(",")))))))))))
                    })(a_[i_])
                }
            })((v_fields));
            return ((f_string("{ __proto__:") + f_string((f_string(Main.f_to_javascript_namespace(this.v_class)) + f_string((f_string(", ") + f_string((f_string(v_str) + f_string("}")))))))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Lit$Object.f_emit; // v8 bug workaround
})();

;
// class Index
if (typeof Index != 'object') {
    Index = function() {};
    Index = new Index;
    Index.f_isa = function(s) {
        return s == 'Index'
    };
    Index.f_perl = function() {
        return '::Index(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor obj
    Index.v_obj = null;
    Index.f_obj = function() {
        return this.v_obj
    }
    // accessor index_exp
    Index.v_index_exp = null;
    Index.f_index_exp = function() {
        return this.v_index_exp
    }
    // method emit
    Index.f_emit = function() {
        var v_self = this;
        try {
            return ((f_string(this.v_obj.f_emit()) + f_string((f_string("[") + f_string((f_string(this.v_index_exp.f_emit()) + f_string("]")))))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Index.f_emit; // v8 bug workaround
})();

;
// class Lookup
if (typeof Lookup != 'object') {
    Lookup = function() {};
    Lookup = new Lookup;
    Lookup.f_isa = function(s) {
        return s == 'Lookup'
    };
    Lookup.f_perl = function() {
        return '::Lookup(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor obj
    Lookup.v_obj = null;
    Lookup.f_obj = function() {
        return this.v_obj
    }
    // accessor index_exp
    Lookup.v_index_exp = null;
    Lookup.f_index_exp = function() {
        return this.v_index_exp
    }
    // method emit
    Lookup.f_emit = function() {
        var v_self = this;
        try {
            return ((f_string(this.v_obj.f_emit()) + f_string((f_string("[") + f_string((f_string(this.v_index_exp.f_emit()) + f_string("]")))))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Lookup.f_emit; // v8 bug workaround
})();

;
// class Var
if (typeof Var != 'object') {
    Var = function() {};
    Var = new Var;
    Var.f_isa = function(s) {
        return s == 'Var'
    };
    Var.f_perl = function() {
        return '::Var(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor sigil
    Var.v_sigil = null;
    Var.f_sigil = function() {
        return this.v_sigil
    }
    // accessor twigil
    Var.v_twigil = null;
    Var.f_twigil = function() {
        return this.v_twigil
    }
    // accessor namespace
    Var.v_namespace = null;
    Var.f_namespace = function() {
        return this.v_namespace
    }
    // accessor name
    Var.v_name = null;
    Var.f_name = function() {
        return this.v_name
    }
    // method emit
    Var.f_emit = function() {
        var v_self = this;
        try {
            var v_table;
            var v_ns;
            (v_table = {
                "$": "v_",
                "@": "List_",
                "%": "Hash_",
                "&": "Code_",
            });
            (v_ns = "");
            if (f_bool(this.v_namespace)) {
                (v_ns = (f_string(Main.f_to_javascript_namespace(this.v_namespace)) + f_string(".")))
            } else {};
            return ((f_bool((this.v_twigil == ".")) ? (f_string("this.v_") + f_string((f_string(this.v_name) + f_string("")))) : (f_bool((this.v_name == "/")) ? (f_string(v_table[this.v_sigil]) + f_string("MATCH")) : (f_string(v_table[this.v_sigil]) + f_string((f_string(v_ns) + f_string(this.v_name)))))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Var.f_emit; // v8 bug workaround
    // method plain_name
    Var.f_plain_name = function() {
        var v_self = this;
        try {
            if (f_bool(this.v_namespace)) {
                throw ((f_string(this.v_namespace) + f_string((f_string(".") + f_string(this.v_name)))))
            } else {};
            throw (this.v_name)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Var.f_plain_name; // v8 bug workaround
})();

;
// class Bind
if (typeof Bind != 'object') {
    Bind = function() {};
    Bind = new Bind;
    Bind.f_isa = function(s) {
        return s == 'Bind'
    };
    Bind.f_perl = function() {
        return '::Bind(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor parameters
    Bind.v_parameters = null;
    Bind.f_parameters = function() {
        return this.v_parameters
    }
    // accessor arguments
    Bind.v_arguments = null;
    Bind.f_arguments = function() {
        return this.v_arguments
    }
    // method emit
    Bind.f_emit = function() {
        var v_self = this;
        try {
            if (f_bool(f_isa(this.v_parameters, "Lit::Array"))) {
                (v_a = this.v_parameters.f_array());
                (v_str = "do { ");
                (v_i = 0);
                (function(a_) {
                    for (var i_ = 0; i_ < a_.length; i_++) {
                        (function(v_var) {
                            (v_bind = {
                                __proto__: Bind,
                                v_parameters: v_var,
                                v_arguments: {
                                    __proto__: Index,
                                    v_obj: this.v_arguments,
                                    v_index_exp: {
                                        __proto__: Val$Int,
                                        v_int: v_i,
                                    },
                                },
                            });
                            (v_str = (f_string(v_str) + f_string((f_string(" ") + f_string((f_string(v_bind.f_emit()) + f_string("; ")))))));
                            (v_i = (v_i + 1))
                        })(a_[i_])
                    }
                })((v_a));
                throw ((f_string(v_str) + f_string((f_string(this.v_parameters.f_emit()) + f_string(" }")))))
            } else {}; if (f_bool(f_isa(this.v_parameters, "Lit::Hash"))) {
                (v_a = this.v_parameters.f_hash());
                (v_b = this.v_arguments.f_hash());
                (v_str = "do { ");
                (v_i = 0);
                v_arg;
                (function(a_) {
                    for (var i_ = 0; i_ < a_.length; i_++) {
                        (function(v_var) {
                            (v_arg = {
                                __proto__: Val$Undef,
                            });
                            (function(a_) {
                                for (var i_ = 0; i_ < a_.length; i_++) {
                                    (function(v_var2) {
                                        if (f_bool((v_var2[0].f_buf() == v_var[0].f_buf()))) {
                                            (v_arg = v_var2[1])
                                        } else {}
                                    })(a_[i_])
                                }
                            })((v_b));
                            (v_bind = {
                                __proto__: Bind,
                                v_parameters: v_var[1],
                                v_arguments: v_arg,
                            });
                            (v_str = (f_string(v_str) + f_string((f_string(" ") + f_string((f_string(v_bind.f_emit()) + f_string("; ")))))));
                            (v_i = (v_i + 1))
                        })(a_[i_])
                    }
                })((v_a));
                throw ((f_string(v_str) + f_string((f_string(this.v_parameters.f_emit()) + f_string(" }")))))
            } else {}; if (f_bool(f_isa(this.v_parameters, "Lit::Object"))) {
                (v_class = this.v_parameters.f_class());
                (v_a = this.v_parameters.f_fields());
                (v_b = this.v_arguments);
                (v_str = "do { ");
                (v_i = 0);
                v_arg;
                (function(a_) {
                    for (var i_ = 0; i_ < a_.length; i_++) {
                        (function(v_var) {
                            (v_bind = {
                                __proto__: Bind,
                                v_parameters: v_var[1],
                                v_arguments: {
                                    __proto__: Call,
                                    v_invocant: v_b,
                                    v_method: v_var[0].f_buf(),
                                    v_arguments: [],
                                    v_hyper: 0,
                                },
                            });
                            (v_str = (f_string(v_str) + f_string((f_string(" ") + f_string((f_string(v_bind.f_emit()) + f_string("; ")))))));
                            (v_i = (v_i + 1))
                        })(a_[i_])
                    }
                })((v_a));
                throw ((f_string(v_str) + f_string((f_string(this.v_parameters.f_emit()) + f_string(" }")))))
            } else {}; if (f_bool(f_isa(this.v_parameters, "Call"))) {
                throw ((f_string("(") + f_string((f_string(this.v_parameters.f_invocant().f_emit()) + f_string((f_string(".v_") + f_string((f_string(this.v_parameters.f_method()) + f_string((f_string(" = ") + f_string((f_string(this.v_arguments.f_emit()) + f_string(")")))))))))))))
            } else {};
            return ((f_string("(") + f_string((f_string(this.v_parameters.f_emit()) + f_string((f_string(" = ") + f_string((f_string(this.v_arguments.f_emit()) + f_string(")")))))))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Bind.f_emit; // v8 bug workaround
})();

;
// class Proto
if (typeof Proto != 'object') {
    Proto = function() {};
    Proto = new Proto;
    Proto.f_isa = function(s) {
        return s == 'Proto'
    };
    Proto.f_perl = function() {
        return '::Proto(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor name
    Proto.v_name = null;
    Proto.f_name = function() {
        return this.v_name
    }
    // method emit
    Proto.f_emit = function() {
        var v_self = this;
        try {
            return (Main.f_to_javascript_namespace(this.v_name))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Proto.f_emit; // v8 bug workaround
})();

;
// class Call
if (typeof Call != 'object') {
    Call = function() {};
    Call = new Call;
    Call.f_isa = function(s) {
        return s == 'Call'
    };
    Call.f_perl = function() {
        return '::Call(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor invocant
    Call.v_invocant = null;
    Call.f_invocant = function() {
        return this.v_invocant
    }
    // accessor hyper
    Call.v_hyper = null;
    Call.f_hyper = function() {
        return this.v_hyper
    }
    // accessor method
    Call.v_method = null;
    Call.f_method = function() {
        return this.v_method
    }
    // accessor arguments
    Call.v_arguments = null;
    Call.f_arguments = function() {
        return this.v_arguments
    }
    // method emit
    Call.f_emit = function() {
        var v_self = this;
        try {
            var v_invocant;
            var v_meth;
            (v_invocant = this.v_invocant.f_emit());
            if (f_bool((v_invocant == "self"))) {
                (v_invocant = "this")
            } else {}; if (f_bool((this.v_method == "values"))) {
                if (f_bool(this.v_hyper)) {
                    f_die("not implemented")
                } else {
                    throw ((f_string("@{") + f_string((f_string(v_invocant) + f_string("}")))))
                }
            } else {}; if (f_bool((f_bool((this.v_method == "perl")) || f_bool((f_bool((this.v_method == "isa")) || f_bool((this.v_method == "scalar"))))))) {
                if (f_bool(this.v_hyper)) {
                    throw ((f_string("(function (a_) { ") + f_string((f_string("var out = []; ") + f_string((f_string("if ( typeof a_ == 'undefined' ) { return out }; ") + f_string((f_string("for(var i = 0; i < a_.length; i++) { ") + f_string((f_string("out.push( f_") + f_string((f_string(this.v_method) + f_string((f_string("(a_[i]) ) } return out;") + f_string((f_string(" })(") + f_string((f_string(v_invocant) + f_string(")")))))))))))))))))))
                } else {};
                throw ((f_string("f_") + f_string((f_string(this.v_method) + f_string((f_string("(") + f_string((f_string(v_invocant) + f_string((f_string((f_bool(this.v_arguments) ? (f_string(", ") + f_string((function(a_) {
                    var out = [];
                    if (typeof a_ == 'undefined') {
                        return out
                    };
                    for (var i = 0; i < a_.length; i++) {
                        out.push(a_[i].f_emit())
                    }
                    return out;
                })(this.v_arguments).join(", "))) : "")) + f_string(")")))))))))))
            } else {}; if (f_bool((this.v_method == "join"))) {
                throw ((f_string(v_invocant) + f_string((f_string(".") + f_string((f_string(this.v_method) + f_string((f_string("(") + f_string((f_string((function(a_) {
                    var out = [];
                    if (typeof a_ == 'undefined') {
                        return out
                    };
                    for (var i = 0; i < a_.length; i++) {
                        out.push(a_[i].f_emit())
                    }
                    return out;
                })(this.v_arguments).join(", ")) + f_string(")")))))))))))
            } else {}; if (f_bool((f_bool((this.v_method == "yaml")) || f_bool((f_bool((this.v_method == "say")) || f_bool((this.v_method == "chars"))))))) {
                if (f_bool(this.v_hyper)) {
                    throw ((f_string("(function (a_) { ") + f_string((f_string("var out = []; ") + f_string((f_string("if ( typeof a_ == 'undefined' ) { return out }; ") + f_string((f_string("for(var i = 0; i < a_.length; i++) { ") + f_string((f_string("out.push( Main.") + f_string((f_string(this.v_method) + f_string((f_string("(a_[i]) ) } return out;") + f_string((f_string(" })(") + f_string((f_string(v_invocant) + f_string(")")))))))))))))))))))
                } else { if (f_bool((this.v_arguments != null))) {
                        throw ((f_string("Main.") + f_string((f_string(this.v_method) + f_string((f_string("(") + f_string((f_string(v_invocant) + f_string((f_string(", ") + f_string((f_string((function(a_) {
                            var out = [];
                            if (typeof a_ == 'undefined') {
                                return out
                            };
                            for (var i = 0; i < a_.length; i++) {
                                out.push(a_[i].f_emit())
                            }
                            return out;
                        })(this.v_arguments).join(", ")) + f_string(")")))))))))))))
                    } else {
                        throw ((f_string("Main.") + f_string((f_string(this.v_method) + f_string((f_string("(") + f_string((f_string(v_invocant) + f_string(")")))))))))
                    }
                }
            } else {};
            (v_meth = this.v_method);
            if (f_bool((v_meth == "postcircumfix:<( )>"))) {
                (v_meth = "")
            } else {}; if (f_bool(this.v_hyper)) {
                return ((f_string("(function (a_) { ") + f_string((f_string("var out = []; ") + f_string((f_string("if ( typeof a_ == 'undefined' ) { return out }; ") + f_string((f_string("for(var i = 0; i < a_.length; i++) { ") + f_string((f_string("out.push( a_[i].f_") + f_string((f_string(v_meth) + f_string((f_string("() ) } return out;") + f_string((f_string(" })(") + f_string((f_string(v_invocant) + f_string(")")))))))))))))))))))
            } else {
                return ((f_string(v_invocant) + f_string((f_string(".f_") + f_string((f_string(v_meth) + f_string((f_string("(") + f_string((f_string((function(a_) {
                    var out = [];
                    if (typeof a_ == 'undefined') {
                        return out
                    };
                    for (var i = 0; i < a_.length; i++) {
                        out.push(a_[i].f_emit())
                    }
                    return out;
                })(this.v_arguments).join(", ")) + f_string(")")))))))))))
            }
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Call.f_emit; // v8 bug workaround
})();

;
// class Apply
if (typeof Apply != 'object') {
    Apply = function() {};
    Apply = new Apply;
    Apply.f_isa = function(s) {
        return s == 'Apply'
    };
    Apply.f_perl = function() {
        return '::Apply(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor code
    Apply.v_code = null;
    Apply.f_code = function() {
        return this.v_code
    }
    // accessor arguments
    Apply.v_arguments = null;
    Apply.f_arguments = function() {
        return this.v_arguments
    }
    // accessor namespace
    Apply.v_namespace = null;
    Apply.f_namespace = function() {
        return this.v_namespace
    }
    // method emit
    Apply.f_emit = function() {
        var v_self = this;
        try {
            var v_code;
            (v_code = this.v_code);
            if (f_bool(f_isa(v_code, "Str"))) {} else {
                throw ((f_string("(") + f_string((f_string(this.v_code.f_emit()) + f_string((f_string(")->(") + f_string((f_string((function(a_) {
                    var out = [];
                    if (typeof a_ == 'undefined') {
                        return out
                    };
                    for (var i = 0; i < a_.length; i++) {
                        out.push(a_[i].f_emit())
                    }
                    return out;
                })(this.v_arguments).join(", ")) + f_string(")")))))))))
            };
            if (f_bool((v_code == "self"))) {
                throw ("this")
            } else {}; if (f_bool((v_code == "false"))) {
                throw ("0")
            } else {}; if (f_bool((v_code == "make"))) {
                throw ((f_string("(v_MATCH.v_capture = ") + f_string((f_string((function(a_) {
                    var out = [];
                    if (typeof a_ == 'undefined') {
                        return out
                    };
                    for (var i = 0; i < a_.length; i++) {
                        out.push(a_[i].f_emit())
                    }
                    return out;
                })(this.v_arguments).join(", ")) + f_string(")")))))
            } else {}; if (f_bool((v_code == "say"))) {
                throw ((f_string("say(") + f_string((f_string((function(a_) {
                    var out = [];
                    if (typeof a_ == 'undefined') {
                        return out
                    };
                    for (var i = 0; i < a_.length; i++) {
                        out.push(a_[i].f_emit())
                    }
                    return out;
                })(this.v_arguments).join(" + ")) + f_string(")")))))
            } else {}; if (f_bool((v_code == "print"))) {
                throw ((f_string("print(") + f_string((f_string((function(a_) {
                    var out = [];
                    if (typeof a_ == 'undefined') {
                        return out
                    };
                    for (var i = 0; i < a_.length; i++) {
                        out.push(a_[i].f_emit())
                    }
                    return out;
                })(this.v_arguments).join(" + ")) + f_string(")")))))
            } else {}; if (f_bool((v_code == "warn"))) {
                throw ((f_string("warn(") + f_string((f_string((function(a_) {
                    var out = [];
                    if (typeof a_ == 'undefined') {
                        return out
                    };
                    for (var i = 0; i < a_.length; i++) {
                        out.push(a_[i].f_emit())
                    }
                    return out;
                })(this.v_arguments).join(" + ")) + f_string(")")))))
            } else {}; if (f_bool((v_code == "defined"))) {
                throw ((f_string("(") + f_string((f_string((function(a_) {
                    var out = [];
                    if (typeof a_ == 'undefined') {
                        return out
                    };
                    for (var i = 0; i < a_.length; i++) {
                        out.push(a_[i].f_emit())
                    }
                    return out;
                })(this.v_arguments).join(" ")) + f_string(" != null)")))))
            } else {}; if (f_bool((v_code == "substr"))) {
                throw ((f_string("(") + f_string((f_string(this.v_arguments[0].f_emit()) + f_string((f_string(").substr(") + f_string((f_string(this.v_arguments[1].f_emit()) + f_string((f_string(", ") + f_string((f_string(this.v_arguments[2].f_emit()) + f_string(")")))))))))))))
            } else {}; if (f_bool((v_code == "prefix:<~>"))) {
                throw ((f_string("(") + f_string((f_string((function(a_) {
                    var out = [];
                    if (typeof a_ == 'undefined') {
                        return out
                    };
                    for (var i = 0; i < a_.length; i++) {
                        out.push(a_[i].f_emit())
                    }
                    return out;
                })(this.v_arguments).join(" ")) + f_string(").f_string()")))))
            } else {}; if (f_bool((v_code == "prefix:<!>"))) {
                throw ((f_string("( f_bool(") + f_string((f_string((function(a_) {
                    var out = [];
                    if (typeof a_ == 'undefined') {
                        return out
                    };
                    for (var i = 0; i < a_.length; i++) {
                        out.push(a_[i].f_emit())
                    }
                    return out;
                })(this.v_arguments).join(" ")) + f_string(") ? false : true)")))))
            } else {}; if (f_bool((v_code == "prefix:<?>"))) {
                throw ((f_string("( f_bool(") + f_string((f_string((function(a_) {
                    var out = [];
                    if (typeof a_ == 'undefined') {
                        return out
                    };
                    for (var i = 0; i < a_.length; i++) {
                        out.push(a_[i].f_emit())
                    }
                    return out;
                })(this.v_arguments).join(" ")) + f_string(") ? true : false)")))))
            } else {}; if (f_bool((v_code == "prefix:<$>"))) {
                throw ((f_string("f_scalar(") + f_string((f_string((function(a_) {
                    var out = [];
                    if (typeof a_ == 'undefined') {
                        return out
                    };
                    for (var i = 0; i < a_.length; i++) {
                        out.push(a_[i].f_emit())
                    }
                    return out;
                })(this.v_arguments).join(" ")) + f_string(")")))))
            } else {}; if (f_bool((v_code == "prefix:<@>"))) {
                throw ((f_string("(") + f_string((f_string((function(a_) {
                    var out = [];
                    if (typeof a_ == 'undefined') {
                        return out
                    };
                    for (var i = 0; i < a_.length; i++) {
                        out.push(a_[i].f_emit())
                    }
                    return out;
                })(this.v_arguments).join(" ")) + f_string(")")))))
            } else {}; if (f_bool((v_code == "prefix:<%>"))) {
                throw ((f_string("(") + f_string((f_string((function(a_) {
                    var out = [];
                    if (typeof a_ == 'undefined') {
                        return out
                    };
                    for (var i = 0; i < a_.length; i++) {
                        out.push(a_[i].f_emit())
                    }
                    return out;
                })(this.v_arguments).join(" ")) + f_string(").f_hash()")))))
            } else {}; if (f_bool((v_code == "infix:<~>"))) {
                throw ((f_string("( f_string(") + f_string((f_string(this.v_arguments[0].f_emit()) + f_string((f_string(")") + f_string((f_string(" + f_string(") + f_string((f_string(this.v_arguments[1].f_emit()) + f_string(") )")))))))))))
            } else {}; if (f_bool((v_code == "infix:<+>"))) {
                throw ((f_string("(") + f_string((f_string((function(a_) {
                    var out = [];
                    if (typeof a_ == 'undefined') {
                        return out
                    };
                    for (var i = 0; i < a_.length; i++) {
                        out.push(a_[i].f_emit())
                    }
                    return out;
                })(this.v_arguments).join(" + ")) + f_string(")")))))
            } else {}; if (f_bool((v_code == "infix:<->"))) {
                throw ((f_string("(") + f_string((f_string((function(a_) {
                    var out = [];
                    if (typeof a_ == 'undefined') {
                        return out
                    };
                    for (var i = 0; i < a_.length; i++) {
                        out.push(a_[i].f_emit())
                    }
                    return out;
                })(this.v_arguments).join(" - ")) + f_string(")")))))
            } else {}; if (f_bool((v_code == "infix:<>>"))) {
                throw ((f_string("(") + f_string((f_string((function(a_) {
                    var out = [];
                    if (typeof a_ == 'undefined') {
                        return out
                    };
                    for (var i = 0; i < a_.length; i++) {
                        out.push(a_[i].f_emit())
                    }
                    return out;
                })(this.v_arguments).join(" > ")) + f_string(")")))))
            } else {}; if (f_bool((v_code == "infix:<&&>"))) {
                throw ((f_string("( f_bool(") + f_string((f_string(this.v_arguments[0].f_emit()) + f_string((f_string(")") + f_string((f_string(" && f_bool(") + f_string((f_string(this.v_arguments[1].f_emit()) + f_string(") )")))))))))))
            } else {}; if (f_bool((v_code == "infix:<||>"))) {
                throw ((f_string("( f_bool(") + f_string((f_string(this.v_arguments[0].f_emit()) + f_string((f_string(")") + f_string((f_string(" || f_bool(") + f_string((f_string(this.v_arguments[1].f_emit()) + f_string(") )")))))))))))
            } else {}; if (f_bool((v_code == "infix:<eq>"))) {
                throw ((f_string("(") + f_string((f_string((function(a_) {
                    var out = [];
                    if (typeof a_ == 'undefined') {
                        return out
                    };
                    for (var i = 0; i < a_.length; i++) {
                        out.push(a_[i].f_emit())
                    }
                    return out;
                })(this.v_arguments).join(" == ")) + f_string(")")))))
            } else {}; if (f_bool((v_code == "infix:<ne>"))) {
                throw ((f_string("(") + f_string((f_string((function(a_) {
                    var out = [];
                    if (typeof a_ == 'undefined') {
                        return out
                    };
                    for (var i = 0; i < a_.length; i++) {
                        out.push(a_[i].f_emit())
                    }
                    return out;
                })(this.v_arguments).join(" != ")) + f_string(")")))))
            } else {}; if (f_bool((v_code == "infix:<==>"))) {
                throw ((f_string("(") + f_string((f_string((function(a_) {
                    var out = [];
                    if (typeof a_ == 'undefined') {
                        return out
                    };
                    for (var i = 0; i < a_.length; i++) {
                        out.push(a_[i].f_emit())
                    }
                    return out;
                })(this.v_arguments).join(" == ")) + f_string(")")))))
            } else {}; if (f_bool((v_code == "infix:<!=>"))) {
                throw ((f_string("(") + f_string((f_string((function(a_) {
                    var out = [];
                    if (typeof a_ == 'undefined') {
                        return out
                    };
                    for (var i = 0; i < a_.length; i++) {
                        out.push(a_[i].f_emit())
                    }
                    return out;
                })(this.v_arguments).join(" != ")) + f_string(")")))))
            } else {}; if (f_bool((v_code == "ternary:<?? !!>"))) {
                throw ((f_string("( f_bool(") + f_string((f_string(this.v_arguments[0].f_emit()) + f_string((f_string(")") + f_string((f_string(" ? ") + f_string((f_string(this.v_arguments[1].f_emit()) + f_string((f_string(" : ") + f_string((f_string(this.v_arguments[2].f_emit()) + f_string(")")))))))))))))))
            } else {};
            (v_code = (f_string("f_") + f_string(this.v_code)));
            if (f_bool(this.v_namespace)) {
                (v_code = (f_string(Main.f_to_javascript_namespace(this.v_namespace)) + f_string((f_string(".") + f_string(v_code)))))
            } else {};
            return ((f_string(v_code) + f_string((f_string("(") + f_string((f_string((function(a_) {
                var out = [];
                if (typeof a_ == 'undefined') {
                    return out
                };
                for (var i = 0; i < a_.length; i++) {
                    out.push(a_[i].f_emit())
                }
                return out;
            })(this.v_arguments).join(", ")) + f_string(")")))))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Apply.f_emit; // v8 bug workaround
})();

;
// class Return
if (typeof Return != 'object') {
    Return = function() {};
    Return = new Return;
    Return.f_isa = function(s) {
        return s == 'Return'
    };
    Return.f_perl = function() {
        return '::Return(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor result
    Return.v_result = null;
    Return.f_result = function() {
        return this.v_result
    }
    // method emit
    Return.f_emit = function() {
        var v_self = this;
        try {
            throw ((f_string("throw(") + f_string((f_string(this.v_result.f_emit()) + f_string(")")))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Return.f_emit; // v8 bug workaround
})();

;
// class If
if (typeof If != 'object') {
    If = function() {};
    If = new If;
    If.f_isa = function(s) {
        return s == 'If'
    };
    If.f_perl = function() {
        return '::If(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor cond
    If.v_cond = null;
    If.f_cond = function() {
        return this.v_cond
    }
    // accessor body
    If.v_body = null;
    If.f_body = function() {
        return this.v_body
    }
    // accessor otherwise
    If.v_otherwise = null;
    If.f_otherwise = function() {
        return this.v_otherwise
    }
    // method emit
    If.f_emit = function() {
        var v_self = this;
        try {
            var v_cond;
            (v_cond = this.v_cond);
            if (f_bool((f_bool(f_isa(v_cond, "Apply")) && f_bool((v_cond.f_code() == "prefix:<!>"))))) {
                (v_if = {
                    __proto__: If,
                    v_cond: v_cond.f_arguments()[0],
                    v_body: this.v_otherwise,
                    v_otherwise: this.v_body,
                });
                throw (v_if.f_emit())
            } else {}; if (f_bool((f_bool(f_isa(v_cond, "Var")) && f_bool((v_cond.f_sigil() == "@"))))) {
                (v_cond = {
                    __proto__: Apply,
                    v_code: "prefix:<@>",
                    v_arguments: [v_cond],
                })
            } else {};
            return ((f_string("if ( f_bool(") + f_string((f_string(v_cond.f_emit()) + f_string((f_string(") ) { ") + f_string((f_string((function(a_) {
                var out = [];
                if (typeof a_ == 'undefined') {
                    return out
                };
                for (var i = 0; i < a_.length; i++) {
                    out.push(a_[i].f_emit())
                }
                return out;
            })(this.v_body).join(";")) + f_string((f_string(" } else { ") + f_string((f_string((function(a_) {
                var out = [];
                if (typeof a_ == 'undefined') {
                    return out
                };
                for (var i = 0; i < a_.length; i++) {
                    out.push(a_[i].f_emit())
                }
                return out;
            })(this.v_otherwise).join(";")) + f_string(" }")))))))))))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    If.f_emit; // v8 bug workaround
})();

;
// class For
if (typeof For != 'object') {
    For = function() {};
    For = new For;
    For.f_isa = function(s) {
        return s == 'For'
    };
    For.f_perl = function() {
        return '::For(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor cond
    For.v_cond = null;
    For.f_cond = function() {
        return this.v_cond
    }
    // accessor body
    For.v_body = null;
    For.f_body = function() {
        return this.v_body
    }
    // accessor topic
    For.v_topic = null;
    For.f_topic = function() {
        return this.v_topic
    }
    // method emit
    For.f_emit = function() {
        var v_self = this;
        try {
            return ((f_string("(function (a_) { for (var i_ = 0; i_ < a_.length ; i_++) { ") + f_string((f_string("(function (") + f_string((f_string(this.v_topic.f_emit()) + f_string((f_string(") { ") + f_string((f_string((function(a_) {
                var out = [];
                if (typeof a_ == 'undefined') {
                    return out
                };
                for (var i = 0; i < a_.length; i++) {
                    out.push(a_[i].f_emit())
                }
                return out;
            })(this.v_body).join(";")) + f_string((f_string(" })(a_[i_]) } })") + f_string((f_string("(") + f_string((f_string(this.v_cond.f_emit()) + f_string(")")))))))))))))))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    For.f_emit; // v8 bug workaround
})();

;
// class Decl
if (typeof Decl != 'object') {
    Decl = function() {};
    Decl = new Decl;
    Decl.f_isa = function(s) {
        return s == 'Decl'
    };
    Decl.f_perl = function() {
        return '::Decl(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor decl
    Decl.v_decl = null;
    Decl.f_decl = function() {
        return this.v_decl
    }
    // accessor type
    Decl.v_type = null;
    Decl.f_type = function() {
        return this.v_type
    }
    // accessor var
    Decl.v_var = null;
    Decl.f_var = function() {
        return this.v_var
    }
    // method emit
    Decl.f_emit = function() {
        var v_self = this;
        try {
            return (this.v_var.f_emit())
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Decl.f_emit; // v8 bug workaround
})();

;
// class Sig
if (typeof Sig != 'object') {
    Sig = function() {};
    Sig = new Sig;
    Sig.f_isa = function(s) {
        return s == 'Sig'
    };
    Sig.f_perl = function() {
        return '::Sig(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor invocant
    Sig.v_invocant = null;
    Sig.f_invocant = function() {
        return this.v_invocant
    }
    // accessor positional
    Sig.v_positional = null;
    Sig.f_positional = function() {
        return this.v_positional
    }
    // accessor named
    Sig.v_named = null;
    Sig.f_named = function() {
        return this.v_named
    }
    // method emit
    Sig.f_emit = function() {
        var v_self = this;
        try {
            return (" print 'Signature - TODO'; die 'Signature - TODO'; ")
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Sig.f_emit; // v8 bug workaround
})();

;
// class Method
if (typeof Method != 'object') {
    Method = function() {};
    Method = new Method;
    Method.f_isa = function(s) {
        return s == 'Method'
    };
    Method.f_perl = function() {
        return '::Method(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor name
    Method.v_name = null;
    Method.f_name = function() {
        return this.v_name
    }
    // accessor sig
    Method.v_sig = null;
    Method.f_sig = function() {
        return this.v_sig
    }
    // accessor block
    Method.v_block = null;
    Method.f_block = function() {
        return this.v_block
    }
    // method emit
    Method.f_emit = function() {
        var v_self = this;
        try {
            var v_sig;
            var v_invocant;
            var v_pos;
            var v_str;
            (v_sig = this.v_sig);
            (v_invocant = v_sig.f_invocant());
            (v_pos = v_sig.f_positional());
            (v_str = (function(a_) {
                var out = [];
                if (typeof a_ == 'undefined') {
                    return out
                };
                for (var i = 0; i < a_.length; i++) {
                    out.push(a_[i].f_emit())
                }
                return out;
            })((v_pos)).join(", "));
            return ((f_string("function ") + f_string((f_string(this.v_name) + f_string((f_string("(") + f_string((f_string(v_str) + f_string((f_string(") { ") + f_string((f_string({
                __proto__: MiniPerl6$Javascript$LexicalBlock,
                v_block: this.v_block,
                v_needs_return: 1,
                v_top_level: 1,
            }.f_emit()) + f_string(" }")))))))))))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Method.f_emit; // v8 bug workaround
})();

;
// class Sub
if (typeof Sub != 'object') {
    Sub = function() {};
    Sub = new Sub;
    Sub.f_isa = function(s) {
        return s == 'Sub'
    };
    Sub.f_perl = function() {
        return '::Sub(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor name
    Sub.v_name = null;
    Sub.f_name = function() {
        return this.v_name
    }
    // accessor sig
    Sub.v_sig = null;
    Sub.f_sig = function() {
        return this.v_sig
    }
    // accessor block
    Sub.v_block = null;
    Sub.f_block = function() {
        return this.v_block
    }
    // method emit
    Sub.f_emit = function() {
        var v_self = this;
        try {
            var v_sig;
            var v_pos;
            var v_str;
            (v_sig = this.v_sig);
            (v_pos = v_sig.f_positional());
            (v_str = (function(a_) {
                var out = [];
                if (typeof a_ == 'undefined') {
                    return out
                };
                for (var i = 0; i < a_.length; i++) {
                    out.push(a_[i].f_emit())
                }
                return out;
            })((v_pos)).join(", "));
            return ((f_string("function ") + f_string((f_string(this.v_name) + f_string((f_string("(") + f_string((f_string(v_str) + f_string((f_string(") { ") + f_string((f_string({
                __proto__: MiniPerl6$Javascript$LexicalBlock,
                v_block: this.v_block,
                v_needs_return: 1,
                v_top_level: 1,
            }.f_emit()) + f_string(" }")))))))))))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Sub.f_emit; // v8 bug workaround
})();

;
// class Do
if (typeof Do != 'object') {
    Do = function() {};
    Do = new Do;
    Do.f_isa = function(s) {
        return s == 'Do'
    };
    Do.f_perl = function() {
        return '::Do(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor block
    Do.v_block = null;
    Do.f_block = function() {
        return this.v_block
    }
    // method emit
    Do.f_emit = function() {
        var v_self = this;
        try {
            return ((f_string("(function () { ") + f_string((f_string({
                __proto__: MiniPerl6$Javascript$LexicalBlock,
                v_block: this.v_block,
                v_needs_return: 1,
            }.f_emit()) + f_string(" })()")))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Do.f_emit; // v8 bug workaround
})();

;
// class Use
if (typeof Use != 'object') {
    Use = function() {};
    Use = new Use;
    Use.f_isa = function(s) {
        return s == 'Use'
    };
    Use.f_perl = function() {
        return '::Use(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor mod
    Use.v_mod = null;
    Use.f_mod = function() {
        return this.v_mod
    }
    // method emit
    Use.f_emit = function() {
        var v_self = this;
        try {
            return ((f_string("// use ") + f_string((f_string(this.v_mod) + f_string(Main.f_newline())))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Use.f_emit; // v8 bug workaround
})();

;
// Do not edit this file - Generated by MiniPerl6
// class MiniPerl6::Grammar
if (typeof MiniPerl6$Grammar != 'object') {
    MiniPerl6$Grammar = function() {};
    MiniPerl6$Grammar = new MiniPerl6$Grammar;
    MiniPerl6$Grammar.f_isa = function(s) {
        return s == 'MiniPerl6::Grammar'
    };
    MiniPerl6$Grammar.f_perl = function() {
        return '::MiniPerl6::Grammar(' + Main._dump(this) + ')'
    };
} (function() {
    var v_Class_name = null;
    // sub get_class_name
    MiniPerl6$Grammar.f_get_class_name = function() {
        try {
            return (v_Class_name)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    // method ident_digit
    MiniPerl6$Grammar.f_ident_digit = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((function() {
                                var v_pos1;
                                (v_pos1 = v_MATCH.f_to());
                                return ((f_bool((function() {
                                    return ((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_word(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })())
                                })()) || f_bool((f_bool((function() {
                                    (v_MATCH.v_to = v_pos1);
                                    return ((f_bool(("_" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                                })()) || f_bool((function() {
                                    (v_MATCH.v_to = v_pos1);
                                    return ((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_digit(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })())
                                })())))))
                            })()) && f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_ident_digit(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })())))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return (1)
                        })())))
                    })())
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_ident_digit; // v8 bug workaround
    // method ident
    MiniPerl6$Grammar.f_ident = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_word(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })())
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool(("_" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                        })())))
                    })()) && f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ident_digit(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })())))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_ident; // v8 bug workaround
    // method full_ident
    MiniPerl6$Grammar.f_full_ident = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((f_bool(("::" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_full_ident(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })())))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return (1)
                        })())))
                    })())))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_full_ident; // v8 bug workaround
    // method namespace_before_ident
    MiniPerl6$Grammar.f_namespace_before_ident = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_tmp;
                        (v_tmp = v_MATCH);
                        (v_MATCH = {
                            __proto__: MiniPerl6$Match,
                            v_str: v_str,
                            v_from: v_tmp.f_to(),
                            v_to: v_tmp.f_to(),
                            v_bool: 1,
                        });
                        (v_MATCH.v_bool = (function() {
                            var v_pos1;
                            (v_pos1 = v_MATCH.f_to());
                            return ((function() {
                                return ((f_bool(("::" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0))
                            })())
                        })());
                        (v_tmp.v_bool = (f_bool(v_MATCH) ? true : false));
                        (v_MATCH = v_tmp);
                        return ((f_bool(v_MATCH) ? true : false))
                    })()) && f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((f_bool(("::" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_namespace_before_ident(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })())))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return (1)
                        })())))
                    })())))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_namespace_before_ident; // v8 bug workaround
    // method optional_namespace_before_ident
    MiniPerl6$Grammar.f_optional_namespace_before_ident = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_namespace_before_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["namespace_before_ident"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("::" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = (v_MATCH["namespace_before_ident"]).f_string()))
                    })()) || f_bool(1)))))))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool(1) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = ""))
                    })()) || f_bool(1)))))
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_optional_namespace_before_ident; // v8 bug workaround
    // method to_line_end
    MiniPerl6$Grammar.f_to_line_end = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_not_newline(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_to_line_end(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })())))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return (1)
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_to_line_end; // v8 bug workaround
    // method pod_begin
    MiniPerl6$Grammar.f_pod_begin = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_is_newline(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("=end" == (v_str).substr(v_MATCH.f_to(), 4))) ? (1 + (v_MATCH.v_to = (4 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_to_line_end(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })())))))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("" != (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_to_line_end(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_pod_begin(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })())))))
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_pod_begin; // v8 bug workaround
    // method pod_other
    MiniPerl6$Grammar.f_pod_other = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_is_newline(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("=cut" == (v_str).substr(v_MATCH.f_to(), 4))) ? (1 + (v_MATCH.v_to = (4 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_to_line_end(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })())))))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("" != (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_to_line_end(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_pod_other(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })())))))
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_pod_other; // v8 bug workaround
    // method ws
    MiniPerl6$Grammar.f_ws = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((f_bool(("#" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_to_line_end(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })())))
                        })()) || f_bool((f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_is_newline(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((function() {
                                var v_pos1;
                                (v_pos1 = v_MATCH.f_to());
                                return ((f_bool((function() {
                                    return ((f_bool((f_bool(("=begin" == (v_str).substr(v_MATCH.f_to(), 6))) ? (1 + (v_MATCH.v_to = (6 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_pod_begin(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })())))
                                })()) || f_bool((f_bool((function() {
                                    (v_MATCH.v_to = v_pos1);
                                    return ((f_bool((f_bool(("=kwid" == (v_str).substr(v_MATCH.f_to(), 5))) ? (1 + (v_MATCH.v_to = (5 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_pod_other(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })())))
                                })()) || f_bool((f_bool((function() {
                                    (v_MATCH.v_to = v_pos1);
                                    return ((f_bool((f_bool(("=pod" == (v_str).substr(v_MATCH.f_to(), 4))) ? (1 + (v_MATCH.v_to = (4 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_pod_other(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })())))
                                })()) || f_bool((f_bool((function() {
                                    (v_MATCH.v_to = v_pos1);
                                    return ((f_bool((f_bool(("=for" == (v_str).substr(v_MATCH.f_to(), 4))) ? (1 + (v_MATCH.v_to = (4 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_pod_other(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })())))
                                })()) || f_bool((f_bool((function() {
                                    (v_MATCH.v_to = v_pos1);
                                    return ((f_bool((f_bool(("=head1" == (v_str).substr(v_MATCH.f_to(), 6))) ? (1 + (v_MATCH.v_to = (6 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_pod_other(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })())))
                                })()) || f_bool((function() {
                                    (v_MATCH.v_to = v_pos1);
                                    return (1)
                                })())))))))))))
                            })())))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_space(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })())
                        })())))))
                    })()) && f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })())
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return (1)
                        })())))
                    })())))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_ws; // v8 bug workaround
    // method opt_ws
    MiniPerl6$Grammar.f_opt_ws = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })())
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return (1)
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_opt_ws; // v8 bug workaround
    // method opt_ws2
    MiniPerl6$Grammar.f_opt_ws2 = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })())
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return (1)
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_opt_ws2; // v8 bug workaround
    // method opt_ws3
    MiniPerl6$Grammar.f_opt_ws3 = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })())
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return (1)
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_opt_ws3; // v8 bug workaround
    // method parse
    MiniPerl6$Grammar.f_parse = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_comp_unit(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["comp_unit"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_parse(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["parse"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                return ((v_MATCH.v_capture = (function() {
                                    var a = [];
                                    a.push(f_scalar(v_MATCH["comp_unit"]));
                                    (function(a_) {
                                        for (var i_ = 0; i_ < a_.length; i_++) {
                                            a.push(a_[i_])
                                        }
                                    })((f_scalar(v_MATCH["parse"])));
                                    return a
                                })()))
                            })()) || f_bool(1)))))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((function() {
                                return ((v_MATCH.v_capture = [f_scalar(v_MATCH["comp_unit"])]))
                            })()) || f_bool(1)))
                        })())))
                    })())))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        return ((v_MATCH.v_capture = []))
                    })()) || f_bool(1)))
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_parse; // v8 bug workaround
    // method comp_unit
    MiniPerl6$Grammar.f_comp_unit = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((f_bool((";" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })())))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return (1)
                        })())))
                    })()) && f_bool((f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((f_bool(("use" == (v_str).substr(v_MATCH.f_to(), 3))) ? (1 + (v_MATCH.v_to = (3 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((f_bool(("v6-" == (v_str).substr(v_MATCH.f_to(), 3))) ? (1 + (v_MATCH.v_to = (3 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_ident(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["ident"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((f_bool((";" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })())))))))))))))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return (1)
                        })())))
                    })()) && f_bool((f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool(("class" == (v_str).substr(v_MATCH.f_to(), 5))) ? (1 + (v_MATCH.v_to = (5 + v_MATCH.f_to()))) : 0))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool(("grammar" == (v_str).substr(v_MATCH.f_to(), 7))) ? (1 + (v_MATCH.v_to = (7 + v_MATCH.f_to()))) : 0))
                        })())))
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_full_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["full_ident"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("{" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool((function() {
                        return ((v_Class_name = (v_MATCH["full_ident"]).f_string()))
                    })()) || f_bool(1))) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp_stmts(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp_stmts"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("}" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((f_bool((";" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })())))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return (1)
                        })())))
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: CompUnit,
                            v_name: f_scalar(v_MATCH["full_ident"]),
                            v_attributes: {},
                            v_methods: {},
                            v_body: f_scalar(v_MATCH["exp_stmts"]),
                        }))
                    })()) || f_bool(1)))))))))))))))))))))))))))))))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_comp_unit; // v8 bug workaround
    // method infix_op
    MiniPerl6$Grammar.f_infix_op = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool(("+" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool(("-" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool(("*" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool(("/" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("e" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool(("q" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("n" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool(("e" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool(("==" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool(("!=" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool(("&&" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool(("||" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool(("~~" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool(("~" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((">" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool(("x" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                })())))))))))))))))))))))))))))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_infix_op; // v8 bug workaround
    // method hyper_op
    MiniPerl6$Grammar.f_hyper_op = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((">>" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return (1)
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_hyper_op; // v8 bug workaround
    // method prefix_op
    MiniPerl6$Grammar.f_prefix_op = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool(("$" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                        })()) || f_bool((f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool(("@" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                        })()) || f_bool((f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool(("%" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                        })()) || f_bool((f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool(("?" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                        })()) || f_bool((f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool(("!" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                        })()) || f_bool((f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool(("++" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0))
                        })()) || f_bool((f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool(("--" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0))
                        })()) || f_bool((f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool(("+" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                        })()) || f_bool((f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool(("-" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool(("~" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                        })())))))))))))))))))))
                    })()) && f_bool((function() {
                        var v_tmp;
                        (v_tmp = v_MATCH);
                        (v_MATCH = {
                            __proto__: MiniPerl6$Match,
                            v_str: v_str,
                            v_from: v_tmp.f_to(),
                            v_to: v_tmp.f_to(),
                            v_bool: 1,
                        });
                        (v_MATCH.v_bool = (function() {
                            var v_pos1;
                            (v_pos1 = v_MATCH.f_to());
                            return ((f_bool((function() {
                                return ((f_bool(("(" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                            })()) || f_bool((function() {
                                (v_MATCH.v_to = v_pos1);
                                return ((f_bool(("$" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                            })())))
                        })());
                        (v_tmp.v_bool = (f_bool(v_MATCH) ? true : false));
                        (v_MATCH = v_tmp);
                        return ((f_bool(v_MATCH) ? true : false))
                    })())))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_prefix_op; // v8 bug workaround
    // method declarator
    MiniPerl6$Grammar.f_declarator = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool(("my" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool(("state" == (v_str).substr(v_MATCH.f_to(), 5))) ? (1 + (v_MATCH.v_to = (5 + v_MATCH.f_to()))) : 0))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool(("has" == (v_str).substr(v_MATCH.f_to(), 3))) ? (1 + (v_MATCH.v_to = (3 + v_MATCH.f_to()))) : 0))
                })())))))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_declarator; // v8 bug workaround
    // method exp2
    MiniPerl6$Grammar.f_exp2 = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["exp"])))
                    })()) || f_bool(1)))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_exp2; // v8 bug workaround
    // method exp_stmts2
    MiniPerl6$Grammar.f_exp_stmts2 = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp_stmts(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp_stmts"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["exp_stmts"])))
                    })()) || f_bool(1)))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_exp_stmts2; // v8 bug workaround
    // use MiniPerl6::Grammar::Regex
    ; // use MiniPerl6::Grammar::Mapping
    ; // use MiniPerl6::Grammar::Control
    ;
})();

;
// class MiniPerl6::Grammar
if (typeof MiniPerl6$Grammar != 'object') {
    MiniPerl6$Grammar = function() {};
    MiniPerl6$Grammar = new MiniPerl6$Grammar;
    MiniPerl6$Grammar.f_isa = function(s) {
        return s == 'MiniPerl6::Grammar'
    };
    MiniPerl6$Grammar.f_perl = function() {
        return '::MiniPerl6::Grammar(' + Main._dump(this) + ')'
    };
} (function() {
    // method exp
    MiniPerl6$Grammar.f_exp = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_term_meth(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["term_meth"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((f_bool(("??" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                                var v_pos1;
                                (v_pos1 = v_MATCH.f_to());
                                return ((f_bool((function() {
                                    return ((f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })()) && f_bool((f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_exp(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            (v_MATCH["exp"] = v_m2);
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })()) && f_bool((f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })()) && f_bool((f_bool((f_bool(("!!" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })()) && f_bool((f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_exp2(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            (v_MATCH["exp2"] = v_m2);
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })()) && f_bool((f_bool((function() {
                                        return ((v_MATCH.v_capture = {
                                            __proto__: Apply,
                                            v_namespace: "",
                                            v_code: "ternary:<?? !!>",
                                            v_arguments: [f_scalar(v_MATCH["term_meth"]), f_scalar(v_MATCH["exp"]), f_scalar(v_MATCH["exp2"])],
                                        }))
                                    })()) || f_bool(1)))))))))))))))
                                })()) || f_bool((function() {
                                    (v_MATCH.v_to = v_pos1);
                                    return ((f_bool((function() {
                                        return (say("*** Syntax error in ternary operation"))
                                    })()) || f_bool(1)))
                                })())))
                            })())))))
                        })()) || f_bool((f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_infix_op(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["infix_op"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_exp(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["exp"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                return ((v_MATCH.v_capture = {
                                    __proto__: Apply,
                                    v_namespace: "",
                                    v_code: (f_string("infix:<") + f_string((f_string(v_MATCH["infix_op"]) + f_string(">")))),
                                    v_arguments: [f_scalar(v_MATCH["term_meth"]), f_scalar(v_MATCH["exp"])],
                                }))
                            })()) || f_bool(1)))))))))))
                        })()) || f_bool((f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((f_bool((":=" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_exp(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["exp"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                return ((v_MATCH.v_capture = {
                                    __proto__: Bind,
                                    v_parameters: f_scalar(v_MATCH["term_meth"]),
                                    v_arguments: f_scalar(v_MATCH["exp"]),
                                }))
                            })()) || f_bool(1)))))))))))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((function() {
                                return ((v_MATCH.v_capture = f_scalar(v_MATCH["term_meth"])))
                            })()) || f_bool(1)))
                        })())))))))
                    })())))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_exp; // v8 bug workaround
    // method opt_ident
    MiniPerl6$Grammar.f_opt_ident = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["ident"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["ident"])))
                    })()) || f_bool(1)))))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool(1) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = "postcircumfix:<( )>"))
                    })()) || f_bool(1)))))
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_opt_ident; // v8 bug workaround
    // method term_meth
    MiniPerl6$Grammar.f_term_meth = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_full_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["full_ident"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((function() {
                                var v_pos1;
                                (v_pos1 = v_MATCH.f_to());
                                return ((function() {
                                    return ((f_bool((f_bool((".new(" == (v_str).substr(v_MATCH.f_to(), 5))) ? (1 + (v_MATCH.v_to = (5 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                                        var v_pos1;
                                        (v_pos1 = v_MATCH.f_to());
                                        return ((f_bool((function() {
                                            return ((f_bool((function() {
                                                var v_m2;
                                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                                if (f_bool(v_m2)) {
                                                    (v_MATCH.v_to = v_m2.f_to());
                                                    return (1)
                                                } else {
                                                    return (0)
                                                }
                                            })()) && f_bool((f_bool((function() {
                                                var v_m2;
                                                (v_m2 = v_grammar.f_exp_mapping(v_str, v_MATCH.f_to()));
                                                if (f_bool(v_m2)) {
                                                    (v_MATCH.v_to = v_m2.f_to());
                                                    (v_MATCH["exp_mapping"] = v_m2);
                                                    return (1)
                                                } else {
                                                    return (0)
                                                }
                                            })()) && f_bool((f_bool((function() {
                                                var v_m2;
                                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                                if (f_bool(v_m2)) {
                                                    (v_MATCH.v_to = v_m2.f_to());
                                                    return (1)
                                                } else {
                                                    return (0)
                                                }
                                            })()) && f_bool((f_bool((f_bool((")" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                                return ((v_MATCH.v_capture = {
                                                    __proto__: Lit$Object,
                                                    v_class: f_scalar(v_MATCH["full_ident"]),
                                                    v_fields: f_scalar(v_MATCH["exp_mapping"]),
                                                }))
                                            })()) || f_bool(1)))))))))))
                                        })()) || f_bool((function() {
                                            (v_MATCH.v_to = v_pos1);
                                            return ((f_bool((function() {
                                                say("*** Syntax Error parsing Constructor");
                                                return (f_die())
                                            })()) || f_bool(1)))
                                        })())))
                                    })())))
                                })())
                            })())
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((function() {
                                var v_pos1;
                                (v_pos1 = v_MATCH.f_to());
                                return ((function() {
                                    return ((f_bool((f_bool(("." == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_hyper_op(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            (v_MATCH["hyper_op"] = v_m2);
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })()) && f_bool((f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_ident(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            (v_MATCH["ident"] = v_m2);
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })()) && f_bool((function() {
                                        var v_pos1;
                                        (v_pos1 = v_MATCH.f_to());
                                        return ((f_bool((function() {
                                            return ((f_bool((f_bool(("(" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                                var v_m2;
                                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                                if (f_bool(v_m2)) {
                                                    (v_MATCH.v_to = v_m2.f_to());
                                                    return (1)
                                                } else {
                                                    return (0)
                                                }
                                            })()) && f_bool((f_bool((function() {
                                                var v_m2;
                                                (v_m2 = v_grammar.f_exp_seq(v_str, v_MATCH.f_to()));
                                                if (f_bool(v_m2)) {
                                                    (v_MATCH.v_to = v_m2.f_to());
                                                    (v_MATCH["exp_seq"] = v_m2);
                                                    return (1)
                                                } else {
                                                    return (0)
                                                }
                                            })()) && f_bool((f_bool((function() {
                                                var v_m2;
                                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                                if (f_bool(v_m2)) {
                                                    (v_MATCH.v_to = v_m2.f_to());
                                                    return (1)
                                                } else {
                                                    return (0)
                                                }
                                            })()) && f_bool((f_bool((f_bool((")" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                                return ((v_MATCH.v_capture = {
                                                    __proto__: Call,
                                                    v_invocant: {
                                                        __proto__: Proto,
                                                        v_name: (v_MATCH["full_ident"]).f_string(),
                                                    },
                                                    v_method: f_scalar(v_MATCH["ident"]),
                                                    v_arguments: f_scalar(v_MATCH["exp_seq"]),
                                                    v_hyper: f_scalar(v_MATCH["hyper_op"]),
                                                }))
                                            })()) || f_bool(1)))))))))))))
                                        })()) || f_bool((f_bool((function() {
                                            (v_MATCH.v_to = v_pos1);
                                            return ((f_bool((f_bool((":" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                                var v_m2;
                                                (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                                                if (f_bool(v_m2)) {
                                                    (v_MATCH.v_to = v_m2.f_to());
                                                    return (1)
                                                } else {
                                                    return (0)
                                                }
                                            })()) && f_bool((f_bool((function() {
                                                var v_m2;
                                                (v_m2 = v_grammar.f_exp_seq(v_str, v_MATCH.f_to()));
                                                if (f_bool(v_m2)) {
                                                    (v_MATCH.v_to = v_m2.f_to());
                                                    (v_MATCH["exp_seq"] = v_m2);
                                                    return (1)
                                                } else {
                                                    return (0)
                                                }
                                            })()) && f_bool((f_bool((function() {
                                                var v_m2;
                                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                                if (f_bool(v_m2)) {
                                                    (v_MATCH.v_to = v_m2.f_to());
                                                    return (1)
                                                } else {
                                                    return (0)
                                                }
                                            })()) && f_bool((f_bool((function() {
                                                return ((v_MATCH.v_capture = {
                                                    __proto__: Call,
                                                    v_invocant: {
                                                        __proto__: Proto,
                                                        v_name: (v_MATCH["full_ident"]).f_string(),
                                                    },
                                                    v_method: f_scalar(v_MATCH["ident"]),
                                                    v_arguments: f_scalar(v_MATCH["exp_seq"]),
                                                    v_hyper: f_scalar(v_MATCH["hyper_op"]),
                                                }))
                                            })()) || f_bool(1)))))))))))
                                        })()) || f_bool((function() {
                                            (v_MATCH.v_to = v_pos1);
                                            return ((f_bool((function() {
                                                return ((v_MATCH.v_capture = {
                                                    __proto__: Call,
                                                    v_invocant: {
                                                        __proto__: Proto,
                                                        v_name: (v_MATCH["full_ident"]).f_string(),
                                                    },
                                                    v_method: f_scalar(v_MATCH["ident"]),
                                                    v_arguments: [],
                                                    v_hyper: f_scalar(v_MATCH["hyper_op"]),
                                                }))
                                            })()) || f_bool(1)))
                                        })())))))
                                    })())))))))
                                })())
                            })())
                        })())))
                    })())))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp_term(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp_term"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((f_bool(("." == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_hyper_op(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["hyper_op"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ident(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["opt_ident"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_pos1;
                                (v_pos1 = v_MATCH.f_to());
                                return ((f_bool((function() {
                                    return ((f_bool((f_bool(("(" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })()) && f_bool((f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_exp_seq(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            (v_MATCH["exp_seq"] = v_m2);
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })()) && f_bool((f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })()) && f_bool((f_bool((")" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))))))))))
                                })()) || f_bool((f_bool((function() {
                                    (v_MATCH.v_to = v_pos1);
                                    return ((f_bool((f_bool((":" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })()) && f_bool((f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_exp_seq(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            (v_MATCH["exp_seq"] = v_m2);
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })()) && f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })())))))))
                                })()) || f_bool((function() {
                                    (v_MATCH.v_to = v_pos1);
                                    return ((f_bool((function() {
                                        return ((v_MATCH.v_capture = {
                                            __proto__: Call,
                                            v_invocant: f_scalar(v_MATCH["exp_term"]),
                                            v_method: f_scalar(v_MATCH["opt_ident"]),
                                            v_arguments: [],
                                            v_hyper: f_scalar(v_MATCH["hyper_op"]),
                                        }))
                                    })()) || f_bool(1)))
                                })())))))
                            })()) && f_bool((f_bool((function() {
                                return ((v_MATCH.v_capture = {
                                    __proto__: Call,
                                    v_invocant: f_scalar(v_MATCH["exp_term"]),
                                    v_method: f_scalar(v_MATCH["opt_ident"]),
                                    v_arguments: f_scalar(v_MATCH["exp_seq"]),
                                    v_hyper: f_scalar(v_MATCH["hyper_op"]),
                                }))
                            })()) || f_bool(1)))))))))))
                        })()) || f_bool((f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((f_bool(("[" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_exp(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["exp"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((f_bool(("]" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                return ((v_MATCH.v_capture = {
                                    __proto__: Index,
                                    v_obj: f_scalar(v_MATCH["exp_term"]),
                                    v_index_exp: f_scalar(v_MATCH["exp"]),
                                }))
                            })()) || f_bool(1)))))))))))))
                        })()) || f_bool((f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((f_bool(("{" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_exp(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["exp"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((f_bool(("}" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                return ((v_MATCH.v_capture = {
                                    __proto__: Lookup,
                                    v_obj: f_scalar(v_MATCH["exp_term"]),
                                    v_index_exp: f_scalar(v_MATCH["exp"]),
                                }))
                            })()) || f_bool(1)))))))))))))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((function() {
                                return ((v_MATCH.v_capture = f_scalar(v_MATCH["exp_term"])))
                            })()) || f_bool(1)))
                        })())))))))
                    })())))
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_term_meth; // v8 bug workaround
    // method sub_or_method_name
    MiniPerl6$Grammar.f_sub_or_method_name = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_full_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["full_ident"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((f_bool(("." == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_ident(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["ident"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })())))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return (1)
                        })())))
                    })())))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_sub_or_method_name; // v8 bug workaround
    // method opt_type
    MiniPerl6$Grammar.f_opt_type = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool(("::" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return (1)
                        })())))
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_full_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["full_ident"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["full_ident"])))
                    })()) || f_bool(1)))))))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool(1) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = ""))
                    })()) || f_bool(1)))))
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_opt_type; // v8 bug workaround
    // method exp_term
    MiniPerl6$Grammar.f_exp_term = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_var_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["var_ident"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["var_ident"])))
                    })()) || f_bool(1)))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_prefix_op(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["prefix_op"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Apply,
                            v_namespace: "",
                            v_code: (f_string("prefix:<") + f_string((f_string(v_MATCH["prefix_op"]) + f_string(">")))),
                            v_arguments: [f_scalar(v_MATCH["exp"])],
                        }))
                    })()) || f_bool(1)))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("(" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool((")" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["exp"])))
                    })()) || f_bool(1)))))))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("{" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp_mapping(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp_mapping"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("}" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Lit$Hash,
                            v_hash: f_scalar(v_MATCH["exp_mapping"]),
                        }))
                    })()) || f_bool(1)))))))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("[" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp_seq(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp_seq"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("]" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Lit$Array,
                            v_array: f_scalar(v_MATCH["exp_seq"]),
                        }))
                    })()) || f_bool(1)))))))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("$" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("<" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_sub_or_method_name(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["sub_or_method_name"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool((">" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Lookup,
                            v_obj: {
                                __proto__: Var,
                                v_sigil: "$",
                                v_twigil: "",
                                v_name: "/",
                            },
                            v_index_exp: {
                                __proto__: Val$Buf,
                                v_buf: f_scalar(v_MATCH["sub_or_method_name"]),
                            },
                        }))
                    })()) || f_bool(1)))))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("d" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("o" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("{" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp_stmts(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp_stmts"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("}" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Do,
                            v_block: f_scalar(v_MATCH["exp_stmts"]),
                        }))
                    })()) || f_bool(1)))))))))))))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_declarator(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["declarator"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_type(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["opt_type"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_var_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["var_ident"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Decl,
                            v_decl: f_scalar(v_MATCH["declarator"]),
                            v_type: f_scalar(v_MATCH["opt_type"]),
                            v_var: f_scalar(v_MATCH["var_ident"]),
                        }))
                    })()) || f_bool(1)))))))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("u" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("s" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("e" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_full_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["full_ident"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((f_bool(("-" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_ident(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["ident"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })())))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return (1)
                        })())))
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Use,
                            v_mod: f_scalar(v_MATCH["full_ident"]),
                        }))
                    })()) || f_bool(1)))))))))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_val(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["val"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["val"])))
                    })()) || f_bool(1)))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_lit(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["lit"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["lit"])))
                    })()) || f_bool(1)))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_token(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["token"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["token"])))
                    })()) || f_bool(1)))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_method_def(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["method_def"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["method_def"])))
                    })()) || f_bool(1)))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_sub_def(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["sub_def"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["sub_def"])))
                    })()) || f_bool(1)))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_control(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["control"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["control"])))
                    })()) || f_bool(1)))))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_apply(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["apply"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["apply"])))
                    })()) || f_bool(1)))))
                })())))))))))))))))))))))))))))))))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_exp_term; // v8 bug workaround
})();

;
// class MiniPerl6::Grammar
if (typeof MiniPerl6$Grammar != 'object') {
    MiniPerl6$Grammar = function() {};
    MiniPerl6$Grammar = new MiniPerl6$Grammar;
    MiniPerl6$Grammar.f_isa = function(s) {
        return s == 'MiniPerl6::Grammar'
    };
    MiniPerl6$Grammar.f_perl = function() {
        return '::MiniPerl6::Grammar(' + Main._dump(this) + ')'
    };
} (function() {
    // method var_sigil
    MiniPerl6$Grammar.f_var_sigil = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool(("$" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool(("%" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool(("@" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool(("&" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                })())))))))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_var_sigil; // v8 bug workaround
    // method var_twigil
    MiniPerl6$Grammar.f_var_twigil = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool(("." == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                        })()) || f_bool((f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool(("!" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                        })()) || f_bool((f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool(("^" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool(("*" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                        })())))))))
                    })())
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return (1)
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_var_twigil; // v8 bug workaround
    // method var_name
    MiniPerl6$Grammar.f_var_name = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_full_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["full_ident"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })())
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool(("/" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_digit(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["digit"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })())
                })())))))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_var_name; // v8 bug workaround
    // method var_ident
    MiniPerl6$Grammar.f_var_ident = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_var_sigil(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["var_sigil"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_var_twigil(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["var_twigil"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_optional_namespace_before_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["optional_namespace_before_ident"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_var_name(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["var_name"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Var,
                            v_sigil: (v_MATCH["var_sigil"]).f_string(),
                            v_twigil: (v_MATCH["var_twigil"]).f_string(),
                            v_namespace: f_scalar(v_MATCH["optional_namespace_before_ident"]),
                            v_name: (v_MATCH["var_name"]).f_string(),
                        }))
                    })()) || f_bool(1)))))))))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_var_ident; // v8 bug workaround
    // method val
    MiniPerl6$Grammar.f_val = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_val_undef(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["val_undef"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["val_undef"])))
                    })()) || f_bool(1)))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_val_int(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["val_int"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["val_int"])))
                    })()) || f_bool(1)))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_val_bit(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["val_bit"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["val_bit"])))
                    })()) || f_bool(1)))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_val_num(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["val_num"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["val_num"])))
                    })()) || f_bool(1)))))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_val_buf(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["val_buf"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["val_buf"])))
                    })()) || f_bool(1)))))
                })())))))))))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_val; // v8 bug workaround
    // method val_bit
    MiniPerl6$Grammar.f_val_bit = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((f_bool(("T" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("r" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("u" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("e" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Val$Bit,
                            v_bit: 1,
                        }))
                    })()) || f_bool(1)))))))))))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("F" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("a" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("l" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("s" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("e" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Val$Bit,
                            v_bit: 0,
                        }))
                    })()) || f_bool(1)))))))))))))
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_val_bit; // v8 bug workaround
})();

;
// class MiniPerl6::Grammar
if (typeof MiniPerl6$Grammar != 'object') {
    MiniPerl6$Grammar = function() {};
    MiniPerl6$Grammar = new MiniPerl6$Grammar;
    MiniPerl6$Grammar.f_isa = function(s) {
        return s == 'MiniPerl6::Grammar'
    };
    MiniPerl6$Grammar.f_perl = function() {
        return '::MiniPerl6::Grammar(' + Main._dump(this) + ')'
    };
} (function() {
    // method val_undef
    MiniPerl6$Grammar.f_val_undef = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((f_bool(("u" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("n" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("d" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("e" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("f" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_tmp;
                        (v_tmp = v_MATCH);
                        (v_MATCH = {
                            __proto__: MiniPerl6$Match,
                            v_str: v_str,
                            v_from: v_tmp.f_to(),
                            v_to: v_tmp.f_to(),
                            v_bool: 1,
                        });
                        (v_MATCH.v_bool = (function() {
                            var v_pos1;
                            (v_pos1 = v_MATCH.f_to());
                            return ((function() {
                                return ((f_bool(("w" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                            })())
                        })());
                        (v_tmp.v_bool = (f_bool(v_MATCH) ? false : true));
                        (v_MATCH = v_tmp);
                        return ((f_bool(v_MATCH) ? true : false))
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Val$Undef,
                        }))
                    })()) || f_bool(1)))))))))))))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_val_undef; // v8 bug workaround
    // method val_num
    MiniPerl6$Grammar.f_val_num = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((f_bool(("X" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("X" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("X" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = "TODO: val_num"))
                    })()) || f_bool(1)))))))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_val_num; // v8 bug workaround
    // method char_any
    MiniPerl6$Grammar.f_char_any = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool(("" != (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_char_any; // v8 bug workaround
    // method single_quoted_unescape
    MiniPerl6$Grammar.f_single_quoted_unescape = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((f_bool(("\\" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("'" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_single_quoted_unescape(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["single_quoted_unescape"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = (f_string("'") + f_string(v_MATCH["single_quoted_unescape"]))))
                    })()) || f_bool(1)))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("\\" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("\"" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_single_quoted_unescape(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["single_quoted_unescape"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = (f_string("\"") + f_string(v_MATCH["single_quoted_unescape"]))))
                    })()) || f_bool(1)))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("\\" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("\\" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_single_quoted_unescape(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["single_quoted_unescape"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = (f_string("\\") + f_string(v_MATCH["single_quoted_unescape"]))))
                    })()) || f_bool(1)))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_tmp;
                        (v_tmp = v_MATCH);
                        (v_MATCH = {
                            __proto__: MiniPerl6$Match,
                            v_str: v_str,
                            v_from: v_tmp.f_to(),
                            v_to: v_tmp.f_to(),
                            v_bool: 1,
                        });
                        (v_MATCH.v_bool = (function() {
                            var v_pos1;
                            (v_pos1 = v_MATCH.f_to());
                            return ((function() {
                                return ((f_bool(("'" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                            })())
                        })());
                        (v_tmp.v_bool = (f_bool(v_MATCH) ? false : true));
                        (v_MATCH = v_tmp);
                        return ((f_bool(v_MATCH) ? true : false))
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_char_any(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["char_any"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_single_quoted_unescape(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["single_quoted_unescape"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = (f_string(v_MATCH["char_any"]) + f_string(v_MATCH["single_quoted_unescape"]))))
                    })()) || f_bool(1)))))))))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return (1)
                })())))))))))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_single_quoted_unescape; // v8 bug workaround
    // method double_quoted_unescape
    MiniPerl6$Grammar.f_double_quoted_unescape = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((f_bool(("\\" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("'" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_double_quoted_unescape(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["double_quoted_unescape"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = (f_string("'") + f_string(v_MATCH["double_quoted_unescape"]))))
                    })()) || f_bool(1)))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("\\" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("\"" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_double_quoted_unescape(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["double_quoted_unescape"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = (f_string("\"") + f_string(v_MATCH["double_quoted_unescape"]))))
                    })()) || f_bool(1)))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("\\" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("\\" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_double_quoted_unescape(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["double_quoted_unescape"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = (f_string("\\") + f_string(v_MATCH["double_quoted_unescape"]))))
                    })()) || f_bool(1)))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("\\" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("n" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_double_quoted_unescape(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["double_quoted_unescape"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = (f_string(Main.f_newline()) + f_string(v_MATCH["double_quoted_unescape"]))))
                    })()) || f_bool(1)))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_tmp;
                        (v_tmp = v_MATCH);
                        (v_MATCH = {
                            __proto__: MiniPerl6$Match,
                            v_str: v_str,
                            v_from: v_tmp.f_to(),
                            v_to: v_tmp.f_to(),
                            v_bool: 1,
                        });
                        (v_MATCH.v_bool = (function() {
                            var v_pos1;
                            (v_pos1 = v_MATCH.f_to());
                            return ((function() {
                                return ((f_bool(("\"" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                            })())
                        })());
                        (v_tmp.v_bool = (f_bool(v_MATCH) ? false : true));
                        (v_MATCH = v_tmp);
                        return ((f_bool(v_MATCH) ? true : false))
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_char_any(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["char_any"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_double_quoted_unescape(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["double_quoted_unescape"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = (f_string(v_MATCH["char_any"]) + f_string(v_MATCH["double_quoted_unescape"]))))
                    })()) || f_bool(1)))))))))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return (1)
                })())))))))))))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_double_quoted_unescape; // v8 bug workaround
    // method val_buf
    MiniPerl6$Grammar.f_val_buf = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((f_bool(("\"" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_double_quoted_unescape(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["double_quoted_unescape"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("\"" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Val$Buf,
                            v_buf: f_scalar(v_MATCH["double_quoted_unescape"]),
                        }))
                    })()) || f_bool(1)))))))))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("'" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_single_quoted_unescape(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["single_quoted_unescape"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("'" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Val$Buf,
                            v_buf: f_scalar(v_MATCH["single_quoted_unescape"]),
                        }))
                    })()) || f_bool(1)))))))))
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_val_buf; // v8 bug workaround
    // method digits
    MiniPerl6$Grammar.f_digits = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_digit(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_digits(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["digits"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })())
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return (1)
                        })())))
                    })())))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_digits; // v8 bug workaround
    // method val_int
    MiniPerl6$Grammar.f_val_int = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_digits(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["digits"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Val$Int,
                            v_int: (v_MATCH).f_string(),
                        }))
                    })()) || f_bool(1)))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_val_int; // v8 bug workaround
    // method exp_stmts
    MiniPerl6$Grammar.f_exp_stmts = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_pos1;
                                (v_pos1 = v_MATCH.f_to());
                                return ((f_bool((function() {
                                    return ((f_bool((";" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                                })()) || f_bool((function() {
                                    (v_MATCH.v_to = v_pos1);
                                    return (1)
                                })())))
                            })()) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_exp_stmts(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["exp_stmts"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_pos1;
                                (v_pos1 = v_MATCH.f_to());
                                return ((f_bool((function() {
                                    return ((f_bool((f_bool((";" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })())))
                                })()) || f_bool((function() {
                                    (v_MATCH.v_to = v_pos1);
                                    return (1)
                                })())))
                            })()) && f_bool((f_bool((function() {
                                return ((v_MATCH.v_capture = (function() {
                                    var a = [];
                                    a.push(f_scalar(v_MATCH["exp"]));
                                    (function(a_) {
                                        for (var i_ = 0; i_ < a_.length; i_++) {
                                            a.push(a_[i_])
                                        }
                                    })((f_scalar(v_MATCH["exp_stmts"])));
                                    return a
                                })()))
                            })()) || f_bool(1)))))))))))))))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_pos1;
                                (v_pos1 = v_MATCH.f_to());
                                return ((f_bool((function() {
                                    return ((f_bool((f_bool((";" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })())))
                                })()) || f_bool((function() {
                                    (v_MATCH.v_to = v_pos1);
                                    return (1)
                                })())))
                            })()) && f_bool((f_bool((function() {
                                return ((v_MATCH.v_capture = [f_scalar(v_MATCH["exp"])]))
                            })()) || f_bool(1)))))))
                        })())))
                    })())))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        return ((v_MATCH.v_capture = []))
                    })()) || f_bool(1)))
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_exp_stmts; // v8 bug workaround
    // method exp_seq
    MiniPerl6$Grammar.f_exp_seq = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((f_bool(("," == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_exp_seq(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["exp_seq"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_pos1;
                                (v_pos1 = v_MATCH.f_to());
                                return ((f_bool((function() {
                                    return ((f_bool((f_bool(("," == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })())))
                                })()) || f_bool((function() {
                                    (v_MATCH.v_to = v_pos1);
                                    return (1)
                                })())))
                            })()) && f_bool((f_bool((function() {
                                return ((v_MATCH.v_capture = (function() {
                                    var a = [];
                                    a.push(f_scalar(v_MATCH["exp"]));
                                    (function(a_) {
                                        for (var i_ = 0; i_ < a_.length; i_++) {
                                            a.push(a_[i_])
                                        }
                                    })((f_scalar(v_MATCH["exp_seq"])));
                                    return a
                                })()))
                            })()) || f_bool(1)))))))))))))))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_pos1;
                                (v_pos1 = v_MATCH.f_to());
                                return ((f_bool((function() {
                                    return ((f_bool((f_bool(("," == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })())))
                                })()) || f_bool((function() {
                                    (v_MATCH.v_to = v_pos1);
                                    return (1)
                                })())))
                            })()) && f_bool((f_bool((function() {
                                return ((v_MATCH.v_capture = [f_scalar(v_MATCH["exp"])]))
                            })()) || f_bool(1)))))))
                        })())))
                    })())))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        return ((v_MATCH.v_capture = []))
                    })()) || f_bool(1)))
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_exp_seq; // v8 bug workaround
})();

;
// class MiniPerl6::Grammar
if (typeof MiniPerl6$Grammar != 'object') {
    MiniPerl6$Grammar = function() {};
    MiniPerl6$Grammar = new MiniPerl6$Grammar;
    MiniPerl6$Grammar.f_isa = function(s) {
        return s == 'MiniPerl6::Grammar'
    };
    MiniPerl6$Grammar.f_perl = function() {
        return '::MiniPerl6::Grammar(' + Main._dump(this) + ')'
    };
} (function() {
    // method lit
    MiniPerl6$Grammar.f_lit = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_lit_object(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["lit_object"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["lit_object"])))
                    })()) || f_bool(1)))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_lit; // v8 bug workaround
    // method lit_seq
    MiniPerl6$Grammar.f_lit_seq = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((f_bool(("X" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("X" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("X" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = "TODO: lit_seq"))
                    })()) || f_bool(1)))))))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_lit_seq; // v8 bug workaround
    // method lit_array
    MiniPerl6$Grammar.f_lit_array = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((f_bool(("X" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("X" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("X" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = "TODO: lit_array"))
                    })()) || f_bool(1)))))))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_lit_array; // v8 bug workaround
    // method lit_hash
    MiniPerl6$Grammar.f_lit_hash = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((f_bool(("X" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("X" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("X" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = "TODO: lit_hash"))
                    })()) || f_bool(1)))))))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_lit_hash; // v8 bug workaround
    // method lit_code
    MiniPerl6$Grammar.f_lit_code = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((f_bool(("X" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("X" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("X" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = "TODO - Lit::Code"))
                    })()) || f_bool(1)))))))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_lit_code; // v8 bug workaround
    // method lit_object
    MiniPerl6$Grammar.f_lit_object = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((f_bool(("::" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_full_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["full_ident"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("(" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_exp_mapping(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["exp_mapping"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((f_bool((")" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                return ((v_MATCH.v_capture = {
                                    __proto__: Lit$Object,
                                    v_class: f_scalar(v_MATCH["full_ident"]),
                                    v_fields: f_scalar(v_MATCH["exp_mapping"]),
                                }))
                            })()) || f_bool(1)))))))))))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((function() {
                                say("*** Syntax Error parsing Constructor");
                                return (f_die())
                            })()) || f_bool(1)))
                        })())))
                    })())))))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_lit_object; // v8 bug workaround
    // method bind
    MiniPerl6$Grammar.f_bind = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool((":=" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp2(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp2"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Bind,
                            v_parameters: f_scalar(v_MATCH["exp"]),
                            v_arguments: f_scalar(v_MATCH["exp2"]),
                        }))
                    })()) || f_bool(1)))))))))))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_bind; // v8 bug workaround
    // method call
    MiniPerl6$Grammar.f_call = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("." == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["ident"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("(" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp_seq(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp_seq"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool((")" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Call,
                            v_invocant: f_scalar(v_MATCH["exp"]),
                            v_method: f_scalar(v_MATCH["ident"]),
                            v_arguments: f_scalar(v_MATCH["exp_seq"]),
                            v_hyper: "",
                        }))
                    })()) || f_bool(1)))))))))))))))))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_call; // v8 bug workaround
    // method apply
    MiniPerl6$Grammar.f_apply = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_optional_namespace_before_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["optional_namespace_before_ident"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_full_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["full_ident"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((function() {
                                var v_pos1;
                                (v_pos1 = v_MATCH.f_to());
                                return ((f_bool((function() {
                                    return ((f_bool((f_bool(("(" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })()) && f_bool((f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_exp_seq(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            (v_MATCH["exp_seq"] = v_m2);
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })()) && f_bool((f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })()) && f_bool((f_bool((")" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))))))))))
                                })()) || f_bool((function() {
                                    (v_MATCH.v_to = v_pos1);
                                    return ((f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })()) && f_bool((f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_exp_seq(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            (v_MATCH["exp_seq"] = v_m2);
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })()) && f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })())))))
                                })())))
                            })()) && f_bool((f_bool((function() {
                                return ((v_MATCH.v_capture = {
                                    __proto__: Apply,
                                    v_namespace: f_scalar(v_MATCH["optional_namespace_before_ident"]),
                                    v_code: f_scalar(v_MATCH["full_ident"]),
                                    v_arguments: f_scalar(v_MATCH["exp_seq"]),
                                }))
                            })()) || f_bool(1)))))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((function() {
                                return ((v_MATCH.v_capture = {
                                    __proto__: Apply,
                                    v_namespace: f_scalar(v_MATCH["optional_namespace_before_ident"]),
                                    v_code: f_scalar(v_MATCH["full_ident"]),
                                    v_arguments: [],
                                }))
                            })()) || f_bool(1)))
                        })())))
                    })())))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_apply; // v8 bug workaround
    // method opt_name
    MiniPerl6$Grammar.f_opt_name = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["ident"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })())
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return (1)
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_opt_name; // v8 bug workaround
    // method var_invocant
    MiniPerl6$Grammar.f_var_invocant = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_var_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["var_ident"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool((":" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["var_ident"])))
                    })()) || f_bool(1)))))))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Var,
                            v_sigil: "$",
                            v_twigil: "",
                            v_name: "self",
                        }))
                    })()) || f_bool(1)))
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_var_invocant; // v8 bug workaround
    // method args_sig
    MiniPerl6$Grammar.f_args_sig = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_var_invocant(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["var_invocant"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp_seq(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp_seq"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Sig,
                            v_invocant: f_scalar(v_MATCH["var_invocant"]),
                            v_positional: f_scalar(v_MATCH["exp_seq"]),
                            v_named: {},
                        }))
                    })()) || f_bool(1)))))))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_args_sig; // v8 bug workaround
    // method method_sig
    MiniPerl6$Grammar.f_method_sig = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("(" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_args_sig(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["args_sig"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool((")" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["args_sig"])))
                    })()) || f_bool(1)))))))))))))))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Sig,
                            v_invocant: {
                                __proto__: Var,
                                v_sigil: "$",
                                v_twigil: "",
                                v_name: "self",
                            },
                            v_positional: [],
                            v_named: {},
                        }))
                    })()) || f_bool(1)))
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_method_sig; // v8 bug workaround
    // method method_def
    MiniPerl6$Grammar.f_method_def = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((f_bool(("m" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("e" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("t" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("h" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("o" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("d" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_name(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["opt_name"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_method_sig(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["method_sig"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("{" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp_stmts(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp_stmts"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool(("}" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((function() {
                                say("*** Syntax Error in method '" + f_get_class_name() + "." + f_scalar(v_MATCH["name"]) + "' near pos=" + v_MATCH.f_to());
                                return (f_die("error in Block"))
                            })()) || f_bool(1)))
                        })())))
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Method,
                            v_name: f_scalar(v_MATCH["opt_name"]),
                            v_sig: f_scalar(v_MATCH["method_sig"]),
                            v_block: f_scalar(v_MATCH["exp_stmts"]),
                        }))
                    })()) || f_bool(1)))))))))))))))))))))))))))))))))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_method_def; // v8 bug workaround
    // method sub_def
    MiniPerl6$Grammar.f_sub_def = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((f_bool(("s" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("u" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("b" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_name(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["opt_name"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_method_sig(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["method_sig"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("{" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp_stmts(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp_stmts"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool(("}" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((function() {
                                say("*** Syntax Error in sub '" + f_scalar(v_MATCH["name"]) + "'");
                                return (f_die("error in Block"))
                            })()) || f_bool(1)))
                        })())))
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Sub,
                            v_name: f_scalar(v_MATCH["opt_name"]),
                            v_sig: f_scalar(v_MATCH["method_sig"]),
                            v_block: f_scalar(v_MATCH["exp_stmts"]),
                        }))
                    })()) || f_bool(1)))))))))))))))))))))))))))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_sub_def; // v8 bug workaround
})();

;
// class MiniPerl6::Grammar
if (typeof MiniPerl6$Grammar != 'object') {
    MiniPerl6$Grammar = function() {};
    MiniPerl6$Grammar = new MiniPerl6$Grammar;
    MiniPerl6$Grammar.f_isa = function(s) {
        return s == 'MiniPerl6::Grammar'
    };
    MiniPerl6$Grammar.f_perl = function() {
        return '::MiniPerl6::Grammar(' + Main._dump(this) + ')'
    };
} (function() {
    // method token
    MiniPerl6$Grammar.f_token = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((f_bool(("t" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("o" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("k" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("e" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("n" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_name(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["opt_name"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("{" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = MiniPerl6$Grammar$Regex.f_rule(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["MiniPerl6::Grammar::Regex.rule"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("}" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_source;
                        var v_ast;
                        (v_source = (f_string("method ") + f_string((f_string(v_MATCH["opt_name"]) + f_string((f_string(" ( $grammar: $str, $pos ) { ") + f_string((f_string("my $MATCH; $MATCH := ::MiniPerl6::Match( 'str' => $str, 'from' => $pos, 'to' => $pos, 'bool' => 1 ); ") + f_string((f_string("$MATCH.bool := ( ") + f_string((f_string(f_scalar(v_MATCH["MiniPerl6::Grammar::Regex.rule"]).f_emit()) + f_string((f_string("); ") + f_string("$MATCH }")))))))))))))));
                        (v_ast = MiniPerl6$Grammar.f_exp_term(v_source, 0));
                        return ((v_MATCH.v_capture = f_scalar(v_ast)))
                    })()) || f_bool(1)))))))))))))))))))))))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_token; // v8 bug workaround
})();

;
// Do not edit this file - Generated by MiniPerl6
// class MiniPerl6::Grammar
if (typeof MiniPerl6$Grammar != 'object') {
    MiniPerl6$Grammar = function() {};
    MiniPerl6$Grammar = new MiniPerl6$Grammar;
    MiniPerl6$Grammar.f_isa = function(s) {
        return s == 'MiniPerl6::Grammar'
    };
    MiniPerl6$Grammar.f_perl = function() {
        return '::MiniPerl6::Grammar(' + Main._dump(this) + ')'
    };
} (function() {
    // method control
    MiniPerl6$Grammar.f_control = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ctrl_return(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["ctrl_return"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["ctrl_return"])))
                    })()) || f_bool(1)))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ctrl_leave(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["ctrl_leave"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["ctrl_leave"])))
                    })()) || f_bool(1)))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_if(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["if"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["if"])))
                    })()) || f_bool(1)))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_when(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["when"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["when"])))
                    })()) || f_bool(1)))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_for(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["for"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["for"])))
                    })()) || f_bool(1)))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_while(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["while"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["while"])))
                    })()) || f_bool(1)))))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_apply(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["apply"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["apply"])))
                    })()) || f_bool(1)))))
                })())))))))))))))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_control; // v8 bug workaround
    // method if
    MiniPerl6$Grammar.f_if = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((f_bool(("i" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("f" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("{" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp_stmts(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp_stmts"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("}" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((f_bool(("e" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("l" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("s" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("e" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((f_bool(("{" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_exp_stmts2(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["exp_stmts2"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((f_bool(("}" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                return ((v_MATCH.v_capture = {
                                    __proto__: If,
                                    v_cond: f_scalar(v_MATCH["exp"]),
                                    v_body: f_scalar(v_MATCH["exp_stmts"]),
                                    v_otherwise: f_scalar(v_MATCH["exp_stmts2"]),
                                }))
                            })()) || f_bool(1)))))))))))))))))))))))))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((function() {
                                return ((v_MATCH.v_capture = {
                                    __proto__: If,
                                    v_cond: f_scalar(v_MATCH["exp"]),
                                    v_body: f_scalar(v_MATCH["exp_stmts"]),
                                    v_otherwise: [],
                                }))
                            })()) || f_bool(1)))
                        })())))
                    })())))))))))))))))))))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_if; // v8 bug workaround
    // method when
    MiniPerl6$Grammar.f_when = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((f_bool(("w" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("h" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("e" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("n" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp_seq(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp_seq"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("{" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp_stmts(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp_stmts"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("}" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: When,
                            v_parameters: f_scalar(v_MATCH["exp_seq"]),
                            v_body: f_scalar(v_MATCH["exp_stmts"]),
                        }))
                    })()) || f_bool(1)))))))))))))))))))))))))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_when; // v8 bug workaround
    // method for
    MiniPerl6$Grammar.f_for = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((f_bool(("f" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("o" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("r" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("->" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_var_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["var_ident"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("{" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp_stmts(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp_stmts"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("}" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: For,
                            v_cond: f_scalar(v_MATCH["exp"]),
                            v_topic: f_scalar(v_MATCH["var_ident"]),
                            v_body: f_scalar(v_MATCH["exp_stmts"]),
                        }))
                    })()) || f_bool(1)))))))))))))))))))))))))))))))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_for; // v8 bug workaround
    // method while
    MiniPerl6$Grammar.f_while = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((f_bool(("w" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("h" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("i" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("l" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("e" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("{" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp_stmts(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp_stmts"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("}" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: While,
                            v_cond: f_scalar(v_MATCH["exp"]),
                            v_body: f_scalar(v_MATCH["exp_stmts"]),
                        }))
                    })()) || f_bool(1)))))))))))))))))))))))))))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_while; // v8 bug workaround
    // method ctrl_leave
    MiniPerl6$Grammar.f_ctrl_leave = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((f_bool(("l" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("e" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("a" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("v" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("e" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Leave,
                        }))
                    })()) || f_bool(1)))))))))))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_ctrl_leave; // v8 bug workaround
    // method ctrl_return
    MiniPerl6$Grammar.f_ctrl_return = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((f_bool(("r" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("e" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("t" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("u" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("r" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("n" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((function() {
                                var v_tmp;
                                (v_tmp = v_MATCH);
                                (v_MATCH = {
                                    __proto__: MiniPerl6$Match,
                                    v_str: v_str,
                                    v_from: v_tmp.f_to(),
                                    v_to: v_tmp.f_to(),
                                    v_bool: 1,
                                });
                                (v_MATCH.v_bool = (function() {
                                    var v_pos1;
                                    (v_pos1 = v_MATCH.f_to());
                                    return ((function() {
                                        return ((f_bool(("(" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                                    })())
                                })());
                                (v_tmp.v_bool = (f_bool(v_MATCH) ? true : false));
                                (v_MATCH = v_tmp);
                                return ((f_bool(v_MATCH) ? true : false))
                            })())
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })())
                        })())))
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Return,
                            v_result: f_scalar(v_MATCH["exp"]),
                        }))
                    })()) || f_bool(1)))))))))))))))))))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("r" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("e" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("t" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("u" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("r" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("n" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Return,
                            v_result: {
                                __proto__: Val$Undef,
                            },
                        }))
                    })()) || f_bool(1)))))))))))))))
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_ctrl_return; // v8 bug workaround
})();

;
// Do not edit this file - Generated by MiniPerl6
// class MiniPerl6::Grammar
if (typeof MiniPerl6$Grammar != 'object') {
    MiniPerl6$Grammar = function() {};
    MiniPerl6$Grammar = new MiniPerl6$Grammar;
    MiniPerl6$Grammar.f_isa = function(s) {
        return s == 'MiniPerl6::Grammar'
    };
    MiniPerl6$Grammar.f_perl = function() {
        return '::MiniPerl6::Grammar(' + Main._dump(this) + ')'
    };
} (function() {
    // method pair_key
    MiniPerl6$Grammar.f_pair_key = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["ident"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_tmp;
                        (v_tmp = v_MATCH);
                        (v_MATCH = {
                            __proto__: MiniPerl6$Match,
                            v_str: v_str,
                            v_from: v_tmp.f_to(),
                            v_to: v_tmp.f_to(),
                            v_bool: 1,
                        });
                        (v_MATCH.v_bool = (function() {
                            var v_pos1;
                            (v_pos1 = v_MATCH.f_to());
                            return ((f_bool((function() {
                                return ((f_bool(("=>" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0))
                            })()) || f_bool((function() {
                                (v_MATCH.v_to = v_pos1);
                                return ((function() {
                                    var v_m2;
                                    (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                                    if (f_bool(v_m2)) {
                                        (v_MATCH.v_to = v_m2.f_to());
                                        return (1)
                                    } else {
                                        return (0)
                                    }
                                })())
                            })())))
                        })());
                        (v_tmp.v_bool = (f_bool(v_MATCH) ? true : false));
                        (v_MATCH = v_tmp);
                        return ((f_bool(v_MATCH) ? true : false))
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Val$Buf,
                            v_buf: (v_MATCH["ident"]).f_string(),
                        }))
                    })()) || f_bool(1)))))))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["exp"])))
                    })()) || f_bool(1)))))
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_pair_key; // v8 bug workaround
    // method pair
    MiniPerl6$Grammar.f_pair = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_pair_key(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["pair_key"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("=>" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_exp(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["exp"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = [f_scalar(v_MATCH["pair_key"]), f_scalar(v_MATCH["exp"])]))
                    })()) || f_bool(1)))))))))))))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool((":" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_var_sigil(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["var_sigil"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["ident"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = [{
                            __proto__: Val$Buf,
                            v_buf: (v_MATCH["ident"]).f_string(),
                        },
                        {
                            __proto__: Var,
                            v_sigil: (f_scalar(v_MATCH["var_sigil"])).f_string(),
                            v_twigil: "",
                            v_name: f_scalar(v_MATCH["ident"]),
                        }]))
                    })()) || f_bool(1)))))))))
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_pair; // v8 bug workaround
    // method exp_mapping
    MiniPerl6$Grammar.f_exp_mapping = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_pair(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["pair"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((f_bool(("," == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_exp_mapping(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["exp_mapping"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                return ((v_MATCH.v_capture = (function() {
                                    var a = [];
                                    a.push(f_scalar(v_MATCH["pair"]));
                                    (function(a_) {
                                        for (var i_ = 0; i_ < a_.length; i_++) {
                                            a.push(a_[i_])
                                        }
                                    })((f_scalar(v_MATCH["exp_mapping"])));
                                    return a
                                })()))
                            })()) || f_bool(1)))))))))))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_pos1;
                                (v_pos1 = v_MATCH.f_to());
                                return ((f_bool((function() {
                                    return ((f_bool((f_bool(("," == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                                        var v_m2;
                                        (v_m2 = v_grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                                        if (f_bool(v_m2)) {
                                            (v_MATCH.v_to = v_m2.f_to());
                                            return (1)
                                        } else {
                                            return (0)
                                        }
                                    })())))
                                })()) || f_bool((function() {
                                    (v_MATCH.v_to = v_pos1);
                                    return (1)
                                })())))
                            })()) && f_bool((f_bool((function() {
                                return ((v_MATCH.v_capture = [f_scalar(v_MATCH["pair"])]))
                            })()) || f_bool(1)))))))
                        })())))
                    })())))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        return ((v_MATCH.v_capture = []))
                    })()) || f_bool(1)))
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar.f_exp_mapping; // v8 bug workaround
})();

;
// Do not edit this file - Generated by MiniPerl6
// class MiniPerl6::Grammar::Regex
if (typeof MiniPerl6$Grammar$Regex != 'object') {
    MiniPerl6$Grammar$Regex = function() {};
    MiniPerl6$Grammar$Regex = new MiniPerl6$Grammar$Regex;
    MiniPerl6$Grammar$Regex.f_isa = function(s) {
        return s == 'MiniPerl6::Grammar::Regex'
    };
    MiniPerl6$Grammar$Regex.f_perl = function() {
        return '::MiniPerl6::Grammar::Regex(' + Main._dump(this) + ')'
    };
} (function() {
    var Hash_rule_terms = null;
    // method ws
    MiniPerl6$Grammar$Regex.f_ws = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((function() {
                        var v_m2;
                        (v_m2 = MiniPerl6$Grammar.f_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })())
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar$Regex.f_ws; // v8 bug workaround
    // method rule_ident
    MiniPerl6$Grammar$Regex.f_rule_ident = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((function() {
                        var v_m2;
                        (v_m2 = MiniPerl6$Grammar.f_full_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })())
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_digit(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["digit"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })())
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar$Regex.f_rule_ident; // v8 bug workaround
    // method any
    MiniPerl6$Grammar$Regex.f_any = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool(("" != (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar$Regex.f_any; // v8 bug workaround
    // method literal
    MiniPerl6$Grammar$Regex.f_literal = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((f_bool(("\\" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("" != (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_literal(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["literal"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })())))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_tmp;
                        (v_tmp = v_MATCH);
                        (v_MATCH = {
                            __proto__: MiniPerl6$Match,
                            v_str: v_str,
                            v_from: v_tmp.f_to(),
                            v_to: v_tmp.f_to(),
                            v_bool: 1,
                        });
                        (v_MATCH.v_bool = (function() {
                            var v_pos1;
                            (v_pos1 = v_MATCH.f_to());
                            return ((function() {
                                return ((f_bool(("'" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                            })())
                        })());
                        (v_tmp.v_bool = (f_bool(v_MATCH) ? false : true));
                        (v_MATCH = v_tmp);
                        return ((f_bool(v_MATCH) ? true : false))
                    })()) && f_bool((f_bool((f_bool(("" != (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_literal(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["literal"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })())))))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return (1)
                })())))))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar$Regex.f_literal; // v8 bug workaround
    // method metasyntax_exp
    MiniPerl6$Grammar$Regex.f_metasyntax_exp = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((f_bool(("\\" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool(("" != (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))))
                        })()) || f_bool((f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((f_bool(("'" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_literal(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool(("'" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))))))
                        })()) || f_bool((f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((f_bool(("{" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_string_code(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool(("}" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))))))
                        })()) || f_bool((f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((f_bool(("<" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_metasyntax_exp(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((">" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))))))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((function() {
                                var v_tmp;
                                (v_tmp = v_MATCH);
                                (v_MATCH = {
                                    __proto__: MiniPerl6$Match,
                                    v_str: v_str,
                                    v_from: v_tmp.f_to(),
                                    v_to: v_tmp.f_to(),
                                    v_bool: 1,
                                });
                                (v_MATCH.v_bool = (function() {
                                    var v_pos1;
                                    (v_pos1 = v_MATCH.f_to());
                                    return ((function() {
                                        return ((f_bool((">" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                                    })())
                                })());
                                (v_tmp.v_bool = (f_bool(v_MATCH) ? false : true));
                                (v_MATCH = v_tmp);
                                return ((f_bool(v_MATCH) ? true : false))
                            })()) && f_bool((f_bool(("" != (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))))
                        })())))))))))
                    })()) && f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_metasyntax_exp(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["metasyntax_exp"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })())
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return (1)
                        })())))
                    })())))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar$Regex.f_metasyntax_exp; // v8 bug workaround
    // method char_range
    MiniPerl6$Grammar$Regex.f_char_range = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((f_bool(("\\" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool(("" != (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((function() {
                                var v_tmp;
                                (v_tmp = v_MATCH);
                                (v_MATCH = {
                                    __proto__: MiniPerl6$Match,
                                    v_str: v_str,
                                    v_from: v_tmp.f_to(),
                                    v_to: v_tmp.f_to(),
                                    v_bool: 1,
                                });
                                (v_MATCH.v_bool = (function() {
                                    var v_pos1;
                                    (v_pos1 = v_MATCH.f_to());
                                    return ((function() {
                                        return ((f_bool(("]" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                                    })())
                                })());
                                (v_tmp.v_bool = (f_bool(v_MATCH) ? false : true));
                                (v_MATCH = v_tmp);
                                return ((f_bool(v_MATCH) ? true : false))
                            })()) && f_bool((f_bool(("" != (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))))
                        })())))
                    })()) && f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_char_range(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["char_range"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })())
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return (1)
                        })())))
                    })())))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar$Regex.f_char_range; // v8 bug workaround
    // method char_class
    MiniPerl6$Grammar$Regex.f_char_class = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_rule_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })())
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("[" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_char_range(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool(("]" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))))))
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar$Regex.f_char_class; // v8 bug workaround
    // method string_code
    MiniPerl6$Grammar$Regex.f_string_code = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((f_bool(("\\" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool(("" != (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))))
                        })()) || f_bool((f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((f_bool(("'" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_literal(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool(("'" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))))))
                        })()) || f_bool((f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((f_bool(("{" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_string_code(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool(("}" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))))))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((function() {
                                var v_tmp;
                                (v_tmp = v_MATCH);
                                (v_MATCH = {
                                    __proto__: MiniPerl6$Match,
                                    v_str: v_str,
                                    v_from: v_tmp.f_to(),
                                    v_to: v_tmp.f_to(),
                                    v_bool: 1,
                                });
                                (v_MATCH.v_bool = (function() {
                                    var v_pos1;
                                    (v_pos1 = v_MATCH.f_to());
                                    return ((function() {
                                        return ((f_bool(("}" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                                    })())
                                })());
                                (v_tmp.v_bool = (f_bool(v_MATCH) ? false : true));
                                (v_MATCH = v_tmp);
                                return ((f_bool(v_MATCH) ? true : false))
                            })()) && f_bool((f_bool(("" != (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))))
                        })())))))))
                    })()) && f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_string_code(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["string_code"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })())
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return (1)
                        })())))
                    })())))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar$Regex.f_string_code; // v8 bug workaround
    // method parsed_code
    MiniPerl6$Grammar$Regex.f_parsed_code = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_string_code(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = (v_MATCH).f_string()))
                    })()) || f_bool(1)))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar$Regex.f_parsed_code; // v8 bug workaround
    // method named_capture_body
    MiniPerl6$Grammar$Regex.f_named_capture_body = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((f_bool(("(" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_rule(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["rule"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool((")" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            "capturing_group": f_scalar(v_MATCH["rule"]),
                        }))
                    })()) || f_bool(1)))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("[" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_rule(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["rule"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("]" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["rule"])))
                    })()) || f_bool(1)))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("<" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_metasyntax_exp(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["metasyntax_exp"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool((">" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Rul$Subrule,
                            v_metasyntax: f_scalar(v_MATCH["metasyntax_exp"]),
                        }))
                    })()) || f_bool(1)))))))))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        return (f_die("invalid alias syntax"))
                    })()) || f_bool(1)))
                })())))))))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar$Regex.f_named_capture_body; // v8 bug workaround
    // method variables
    MiniPerl6$Grammar$Regex.f_variables = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((f_bool(("$<" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_rule_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["rule_ident"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool((">" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = (f_string("$/{") + f_string((f_string("'") + f_string((f_string(v_MATCH["rule_ident"]) + f_string((f_string("'") + f_string("}"))))))))))
                    })()) || f_bool(1)))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = MiniPerl6$Grammar.f_var_sigil(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["MiniPerl6::Grammar.var_sigil"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = MiniPerl6$Grammar.f_digits(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["MiniPerl6::Grammar.digits"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = (f_string(v_MATCH["MiniPerl6::Grammar.var_sigil"]) + f_string((f_string("/[") + f_string((f_string(v_MATCH["MiniPerl6::Grammar.digits"]) + f_string("]"))))))))
                    })()) || f_bool(1)))))))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = MiniPerl6$Grammar.f_var_sigil(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["MiniPerl6::Grammar.var_sigil"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = MiniPerl6$Grammar.f_var_twigil(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["MiniPerl6::Grammar.var_twigil"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = MiniPerl6$Grammar.f_full_ident(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["MiniPerl6::Grammar.full_ident"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Rul$Var,
                            v_sigil: (v_MATCH["MiniPerl6::Grammar.var_sigil"]).f_string(),
                            v_twigil: (v_MATCH["MiniPerl6::Grammar.var_twigil"]).f_string(),
                            v_name: (v_MATCH["MiniPerl6::Grammar.full_ident"]).f_string(),
                        }))
                    })()) || f_bool(1)))))))))
                })())))))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar$Regex.f_variables; // v8 bug workaround
    // method rule_terms
    MiniPerl6$Grammar$Regex.f_rule_terms = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((f_bool(("(" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_rule(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["rule"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool((")" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Rul$Capture,
                            v_rule_exp: f_scalar(v_MATCH["rule"]),
                        }))
                    })()) || f_bool(1)))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("<(" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_rule(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["rule"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool((")>" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Rul$CaptureResult,
                            v_rule_exp: f_scalar(v_MATCH["rule"]),
                        }))
                    })()) || f_bool(1)))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("<after" == (v_str).substr(v_MATCH.f_to(), 6))) ? (1 + (v_MATCH.v_to = (6 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_rule(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["rule"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool((">" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Rul$After,
                            v_rule_exp: f_scalar(v_MATCH["rule"]),
                        }))
                    })()) || f_bool(1)))))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("<before" == (v_str).substr(v_MATCH.f_to(), 7))) ? (1 + (v_MATCH.v_to = (7 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_rule(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["rule"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool((">" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Rul$Before,
                            v_rule_exp: f_scalar(v_MATCH["rule"]),
                        }))
                    })()) || f_bool(1)))))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("<!before" == (v_str).substr(v_MATCH.f_to(), 8))) ? (1 + (v_MATCH.v_to = (8 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_rule(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["rule"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool((">" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Rul$NotBefore,
                            v_rule_exp: f_scalar(v_MATCH["rule"]),
                        }))
                    })()) || f_bool(1)))))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("<!" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_metasyntax_exp(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["metasyntax_exp"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool((">" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            "negate": {
                                "metasyntax": f_scalar(v_MATCH["metasyntax_exp"]),
                            },
                        }))
                    })()) || f_bool(1)))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("<+" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_char_class(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["char_class"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool((">" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Rul$CharClass,
                            v_chars: (v_MATCH["char_class"]).f_string(),
                        }))
                    })()) || f_bool(1)))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("<-" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_char_class(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["char_class"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool((">" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Rul$NegateCharClass,
                            v_chars: (v_MATCH["char_class"]).f_string(),
                        }))
                    })()) || f_bool(1)))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("'" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_literal(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["literal"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("'" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Rul$Constant,
                            v_constant: f_scalar(v_MATCH["literal"]),
                        }))
                    })()) || f_bool(1)))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("<" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool(("'" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_literal(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["literal"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("'" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((f_bool((">" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Rul$Constant,
                            v_constant: f_scalar(v_MATCH["literal"]),
                        }))
                    })()) || f_bool(1)))))))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("<" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_variables(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["variables"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((f_bool((">" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                return ((v_MATCH.v_capture = {
                                    __proto__: Rul$InterpolateVar,
                                    v_var: f_scalar(v_MATCH["variables"]),
                                }))
                            })()) || f_bool(1)))))))
                        })()) || f_bool((f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((f_bool(("?" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_metasyntax_exp(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["metasyntax_exp"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((f_bool((">" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                return ((v_MATCH.v_capture = {
                                    __proto__: Rul$SubruleNoCapture,
                                    v_metasyntax: f_scalar(v_MATCH["metasyntax_exp"]),
                                }))
                            })()) || f_bool(1)))))))))
                        })()) || f_bool((f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((f_bool(("." == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_metasyntax_exp(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["metasyntax_exp"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((f_bool((">" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                return ((v_MATCH.v_capture = {
                                    __proto__: Rul$SubruleNoCapture,
                                    v_metasyntax: f_scalar(v_MATCH["metasyntax_exp"]),
                                }))
                            })()) || f_bool(1)))))))))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_metasyntax_exp(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["metasyntax_exp"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((f_bool((">" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                return ((v_MATCH.v_capture = {
                                    __proto__: Rul$Subrule,
                                    v_metasyntax: f_scalar(v_MATCH["metasyntax_exp"]),
                                }))
                            })()) || f_bool(1)))))))
                        })())))))))
                    })())))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("{" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_parsed_code(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["parsed_code"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("}" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Rul$Block,
                            v_closure: f_scalar(v_MATCH["parsed_code"]),
                        }))
                    })()) || f_bool(1)))))))))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("\\" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((function() {
                            return ((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_any(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["any"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                return ((v_MATCH.v_capture = {
                                    __proto__: Rul$SpecialChar,
                                    v_char: f_scalar(v_MATCH["any"]),
                                }))
                            })()) || f_bool(1)))))
                        })())
                    })())))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("." == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Rul$Dot,
                        }))
                    })()) || f_bool(1)))))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((f_bool(("[" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_rule(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["rule"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("]" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["rule"])))
                    })()) || f_bool(1)))))))))
                })())))))))))))))))))))))))))))))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar$Regex.f_rule_terms; // v8 bug workaround
    // method rule_term
    MiniPerl6$Grammar$Regex.f_rule_term = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_variables(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["variables"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((f_bool((":=" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_named_capture_body(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["named_capture_body"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                return ((v_MATCH.v_capture = {
                                    __proto__: Rul$NamedCapture,
                                    v_rule_exp: f_scalar(v_MATCH["named_capture_body"]),
                                    v_capture_ident: f_scalar(v_MATCH["variables"]),
                                }))
                            })()) || f_bool(1)))))))))))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((function() {
                                return ((v_MATCH.v_capture = f_scalar(v_MATCH["variables"])))
                            })()) || f_bool(1)))
                        })())))
                    })())))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_rule_terms(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["rule_terms"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = f_scalar(v_MATCH["rule_terms"])))
                    })()) || f_bool(1)))))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        var v_tmp;
                        (v_tmp = v_MATCH);
                        (v_MATCH = {
                            __proto__: MiniPerl6$Match,
                            v_str: v_str,
                            v_from: v_tmp.f_to(),
                            v_to: v_tmp.f_to(),
                            v_bool: 1,
                        });
                        (v_MATCH.v_bool = (function() {
                            var v_pos1;
                            (v_pos1 = v_MATCH.f_to());
                            return ((f_bool((function() {
                                return ((f_bool(("]" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                            })()) || f_bool((f_bool((function() {
                                (v_MATCH.v_to = v_pos1);
                                return ((f_bool(("}" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                            })()) || f_bool((f_bool((function() {
                                (v_MATCH.v_to = v_pos1);
                                return ((f_bool((")" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                            })()) || f_bool((f_bool((function() {
                                (v_MATCH.v_to = v_pos1);
                                return ((f_bool((">" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                            })()) || f_bool((f_bool((function() {
                                (v_MATCH.v_to = v_pos1);
                                return ((f_bool((":" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                            })()) || f_bool((f_bool((function() {
                                (v_MATCH.v_to = v_pos1);
                                return ((f_bool(("?" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                            })()) || f_bool((f_bool((function() {
                                (v_MATCH.v_to = v_pos1);
                                return ((f_bool(("+" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                            })()) || f_bool((f_bool((function() {
                                (v_MATCH.v_to = v_pos1);
                                return ((f_bool(("*" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                            })()) || f_bool((f_bool((function() {
                                (v_MATCH.v_to = v_pos1);
                                return ((f_bool(("|" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                            })()) || f_bool((f_bool((function() {
                                (v_MATCH.v_to = v_pos1);
                                return ((f_bool(("&" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                            })()) || f_bool((function() {
                                (v_MATCH.v_to = v_pos1);
                                return ((f_bool(("/" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                            })())))))))))))))))))))))
                        })());
                        (v_tmp.v_bool = (f_bool(v_MATCH) ? false : true));
                        (v_MATCH = v_tmp);
                        return ((f_bool(v_MATCH) ? true : false))
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_any(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["any"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Rul$Constant,
                            v_constant: f_scalar(v_MATCH["any"]),
                        }))
                    })()) || f_bool(1)))))))
                })())))))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar$Regex.f_rule_term; // v8 bug workaround
    // method quant_exp
    MiniPerl6$Grammar$Regex.f_quant_exp = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((f_bool(("**" == (v_str).substr(v_MATCH.f_to(), 2))) ? (1 + (v_MATCH.v_to = (2 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = MiniPerl6$Grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("{" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_parsed_code(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["parsed_code"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((f_bool(("}" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            "closure": f_scalar(v_MATCH["parsed_code"]),
                        }))
                    })()) || f_bool(1)))))))))))))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool(("?" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                        })()) || f_bool((f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool(("*" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool(("+" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                        })())))))
                    })())
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar$Regex.f_quant_exp; // v8 bug workaround
    // method greedy_exp
    MiniPerl6$Grammar$Regex.f_greedy_exp = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool(("?" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                })()) || f_bool((f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool(("+" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return (1)
                })())))))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar$Regex.f_greedy_exp; // v8 bug workaround
    // method quantifier
    MiniPerl6$Grammar$Regex.f_quantifier = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = MiniPerl6$Grammar.f_opt_ws(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_rule_term(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["rule_term"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = MiniPerl6$Grammar.f_opt_ws2(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_quant_exp(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["quant_exp"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_greedy_exp(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["greedy_exp"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = MiniPerl6$Grammar.f_opt_ws3(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                return ((v_MATCH.v_capture = {
                                    __proto__: Rul$Quantifier,
                                    v_term: f_scalar(v_MATCH["rule_term"]),
                                    v_quant: f_scalar(v_MATCH["quant_exp"]),
                                    v_greedy: f_scalar(v_MATCH["greedy_exp"]),
                                    v_ws1: f_scalar(v_MATCH["MiniPerl6::Grammar.opt_ws"]),
                                    v_ws2: f_scalar(v_MATCH["MiniPerl6::Grammar.opt_ws2"]),
                                    v_ws3: f_scalar(v_MATCH["MiniPerl6::Grammar.opt_ws3"]),
                                }))
                            })()) || f_bool(1)))))))))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((function() {
                                return ((v_MATCH.v_capture = f_scalar(v_MATCH["rule_term"])))
                            })()) || f_bool(1)))
                        })())))
                    })())))))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar$Regex.f_quantifier; // v8 bug workaround
    // method concat_list
    MiniPerl6$Grammar$Regex.f_concat_list = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_quantifier(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["quantifier"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_concat_list(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["concat_list"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                return ((v_MATCH.v_capture = (function() {
                                    var a = [];
                                    a.push(f_scalar(v_MATCH["quantifier"]));
                                    (function(a_) {
                                        for (var i_ = 0; i_ < a_.length; i_++) {
                                            a.push(a_[i_])
                                        }
                                    })((f_scalar(v_MATCH["concat_list"])));
                                    return a
                                })()))
                            })()) || f_bool(1)))))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((function() {
                                return ((v_MATCH.v_capture = [f_scalar(v_MATCH["quantifier"])]))
                            })()) || f_bool(1)))
                        })())))
                    })())))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        return ((v_MATCH.v_capture = []))
                    })()) || f_bool(1)))
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar$Regex.f_concat_list; // v8 bug workaround
    // method concat_exp
    MiniPerl6$Grammar$Regex.f_concat_exp = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_concat_list(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["concat_list"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Rul$Concat,
                            v_concat: f_scalar(v_MATCH["concat_list"]),
                        }))
                    })()) || f_bool(1)))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar$Regex.f_concat_exp; // v8 bug workaround
    // method or_list_exp
    MiniPerl6$Grammar$Regex.f_or_list_exp = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((f_bool((function() {
                    return ((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_concat_exp(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["concat_exp"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((f_bool(("|" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0)) && f_bool((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_or_list_exp(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    (v_MATCH["or_list_exp"] = v_m2);
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool((function() {
                                return ((v_MATCH.v_capture = (function() {
                                    var a = [];
                                    a.push(f_scalar(v_MATCH["concat_exp"]));
                                    (function(a_) {
                                        for (var i_ = 0; i_ < a_.length; i_++) {
                                            a.push(a_[i_])
                                        }
                                    })((f_scalar(v_MATCH["or_list_exp"])));
                                    return a
                                })()))
                            })()) || f_bool(1)))))))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return ((f_bool((function() {
                                return ((v_MATCH.v_capture = [f_scalar(v_MATCH["concat_exp"])]))
                            })()) || f_bool(1)))
                        })())))
                    })())))
                })()) || f_bool((function() {
                    (v_MATCH.v_to = v_pos1);
                    return ((f_bool((function() {
                        return ((v_MATCH.v_capture = []))
                    })()) || f_bool(1)))
                })())))
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar$Regex.f_or_list_exp; // v8 bug workaround
    // method rule
    MiniPerl6$Grammar$Regex.f_rule = function(v_str, v_pos) {
        var v_grammar = this;
        try {
            var v_MATCH = null;
            (v_MATCH = {
                __proto__: MiniPerl6$Match,
                v_str: v_str,
                v_from: v_pos,
                v_to: v_pos,
                v_bool: 1,
            });
            (v_MATCH.v_bool = (function() {
                var v_pos1;
                (v_pos1 = v_MATCH.f_to());
                return ((function() {
                    return ((f_bool((function() {
                        var v_pos1;
                        (v_pos1 = v_MATCH.f_to());
                        return ((f_bool((function() {
                            return ((f_bool((function() {
                                var v_m2;
                                (v_m2 = v_grammar.f_ws(v_str, v_MATCH.f_to()));
                                if (f_bool(v_m2)) {
                                    (v_MATCH.v_to = v_m2.f_to());
                                    return (1)
                                } else {
                                    return (0)
                                }
                            })()) && f_bool((f_bool(("|" == (v_str).substr(v_MATCH.f_to(), 1))) ? (1 + (v_MATCH.v_to = (1 + v_MATCH.f_to()))) : 0))))
                        })()) || f_bool((function() {
                            (v_MATCH.v_to = v_pos1);
                            return (1)
                        })())))
                    })()) && f_bool((f_bool((function() {
                        var v_m2;
                        (v_m2 = v_grammar.f_or_list_exp(v_str, v_MATCH.f_to()));
                        if (f_bool(v_m2)) {
                            (v_MATCH.v_to = v_m2.f_to());
                            (v_MATCH["or_list_exp"] = v_m2);
                            return (1)
                        } else {
                            return (0)
                        }
                    })()) && f_bool((f_bool((function() {
                        return ((v_MATCH.v_capture = {
                            __proto__: Rul$Or,
                            v_or_list: f_scalar(v_MATCH["or_list_exp"]),
                        }))
                    })()) || f_bool(1)))))))
                })())
            })());
            return (v_MATCH)
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    MiniPerl6$Grammar$Regex.f_rule; // v8 bug workaround
})();

;
// Do not edit this file - Generated by MiniPerl6
// class Rul
if (typeof Rul != 'object') {
    Rul = function() {};
    Rul = new Rul;
    Rul.f_isa = function(s) {
        return s == 'Rul'
    };
    Rul.f_perl = function() {
        return '::Rul(' + Main._dump(this) + ')'
    };
} (function() {
    // sub constant
    Rul.f_constant = function(v_str) {
        try {
            var v_len;
            (v_len = Main.chars(v_str));
            if (f_bool((v_str == "\\"))) {
                (v_str = "\\\\")
            } else {}; if (f_bool((v_str == "'"))) {
                (v_str = "\\'")
            } else {}; if (f_bool(v_len)) {
                return ((f_string("( ( '") + f_string((f_string(v_str) + f_string((f_string("' eq substr( $str, $MATCH.to, ") + f_string((f_string(v_len) + f_string((f_string(")) ") + f_string((f_string("  ?? (1 + ( $MATCH.to := ") + f_string((f_string(v_len) + f_string((f_string(" + $MATCH.to ))") + f_string((f_string("  !! false ") + f_string(")")))))))))))))))))))
            } else {
                throw ("1")
            }
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
})();

;
// class Rul::Quantifier
if (typeof Rul$Quantifier != 'object') {
    Rul$Quantifier = function() {};
    Rul$Quantifier = new Rul$Quantifier;
    Rul$Quantifier.f_isa = function(s) {
        return s == 'Rul::Quantifier'
    };
    Rul$Quantifier.f_perl = function() {
        return '::Rul::Quantifier(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor term
    Rul$Quantifier.v_term = null;
    Rul$Quantifier.f_term = function() {
        return this.v_term
    }
    // accessor quant
    Rul$Quantifier.v_quant = null;
    Rul$Quantifier.f_quant = function() {
        return this.v_quant
    }
    // accessor greedy
    Rul$Quantifier.v_greedy = null;
    Rul$Quantifier.f_greedy = function() {
        return this.v_greedy
    }
    // accessor ws1
    Rul$Quantifier.v_ws1 = null;
    Rul$Quantifier.f_ws1 = function() {
        return this.v_ws1
    }
    // accessor ws2
    Rul$Quantifier.v_ws2 = null;
    Rul$Quantifier.f_ws2 = function() {
        return this.v_ws2
    }
    // accessor ws3
    Rul$Quantifier.v_ws3 = null;
    Rul$Quantifier.f_ws3 = function() {
        return this.v_ws3
    }
    // method emit
    Rul$Quantifier.f_emit = function() {
        var v_self = this;
        try {
            return (this.v_term.f_emit())
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Rul$Quantifier.f_emit; // v8 bug workaround
})();

;
// class Rul::Or
if (typeof Rul$Or != 'object') {
    Rul$Or = function() {};
    Rul$Or = new Rul$Or;
    Rul$Or.f_isa = function(s) {
        return s == 'Rul::Or'
    };
    Rul$Or.f_perl = function() {
        return '::Rul::Or(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor or_list
    Rul$Or.v_or_list = null;
    Rul$Or.f_or_list = function() {
        return this.v_or_list
    }
    // method emit
    Rul$Or.f_emit = function() {
        var v_self = this;
        try {
            return ((f_string("do { ") + f_string((f_string("my $pos1 := $MATCH.to; do{ ") + f_string((f_string((function(a_) {
                var out = [];
                if (typeof a_ == 'undefined') {
                    return out
                };
                for (var i = 0; i < a_.length; i++) {
                    out.push(a_[i].f_emit())
                }
                return out;
            })(this.v_or_list).join("} || do { $MATCH.to := $pos1; ")) + f_string("} }")))))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Rul$Or.f_emit; // v8 bug workaround
})();

;
// class Rul::Concat
if (typeof Rul$Concat != 'object') {
    Rul$Concat = function() {};
    Rul$Concat = new Rul$Concat;
    Rul$Concat.f_isa = function(s) {
        return s == 'Rul::Concat'
    };
    Rul$Concat.f_perl = function() {
        return '::Rul::Concat(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor concat
    Rul$Concat.v_concat = null;
    Rul$Concat.f_concat = function() {
        return this.v_concat
    }
    // method emit
    Rul$Concat.f_emit = function() {
        var v_self = this;
        try {
            return ((f_string("(") + f_string((f_string((function(a_) {
                var out = [];
                if (typeof a_ == 'undefined') {
                    return out
                };
                for (var i = 0; i < a_.length; i++) {
                    out.push(a_[i].f_emit())
                }
                return out;
            })(this.v_concat).join(" && ")) + f_string(")")))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Rul$Concat.f_emit; // v8 bug workaround
})();

;
// class Rul::Subrule
if (typeof Rul$Subrule != 'object') {
    Rul$Subrule = function() {};
    Rul$Subrule = new Rul$Subrule;
    Rul$Subrule.f_isa = function(s) {
        return s == 'Rul::Subrule'
    };
    Rul$Subrule.f_perl = function() {
        return '::Rul::Subrule(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor metasyntax
    Rul$Subrule.v_metasyntax = null;
    Rul$Subrule.f_metasyntax = function() {
        return this.v_metasyntax
    }
    // method emit
    Rul$Subrule.f_emit = function() {
        var v_self = this;
        try {
            var v_meth;
            (v_meth = (f_bool((1 + f_index(this.v_metasyntax, "."))) ? this.v_metasyntax : (f_string("$grammar.") + f_string(this.v_metasyntax))));
            return ((f_string("do { ") + f_string((f_string("my $m2 := ") + f_string((f_string(v_meth) + f_string((f_string("($str, $MATCH.to); ") + f_string((f_string("if $m2 { $MATCH.to := $m2.to; $MATCH{'") + f_string((f_string(this.v_metasyntax) + f_string((f_string("'} := $m2; 1 } else { false } ") + f_string("}")))))))))))))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Rul$Subrule.f_emit; // v8 bug workaround
})();

;
// class Rul::SubruleNoCapture
if (typeof Rul$SubruleNoCapture != 'object') {
    Rul$SubruleNoCapture = function() {};
    Rul$SubruleNoCapture = new Rul$SubruleNoCapture;
    Rul$SubruleNoCapture.f_isa = function(s) {
        return s == 'Rul::SubruleNoCapture'
    };
    Rul$SubruleNoCapture.f_perl = function() {
        return '::Rul::SubruleNoCapture(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor metasyntax
    Rul$SubruleNoCapture.v_metasyntax = null;
    Rul$SubruleNoCapture.f_metasyntax = function() {
        return this.v_metasyntax
    }
    // method emit
    Rul$SubruleNoCapture.f_emit = function() {
        var v_self = this;
        try {
            var v_meth;
            (v_meth = (f_bool((1 + f_index(this.v_metasyntax, "."))) ? this.v_metasyntax : (f_string("$grammar.") + f_string(this.v_metasyntax))));
            return ((f_string("do { ") + f_string((f_string("my $m2 := ") + f_string((f_string(v_meth) + f_string((f_string("($str, $MATCH.to); ") + f_string((f_string("if $m2 { $MATCH.to := $m2.to; 1 } else { false } ") + f_string("}")))))))))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Rul$SubruleNoCapture.f_emit; // v8 bug workaround
})();

;
// class Rul::Var
if (typeof Rul$Var != 'object') {
    Rul$Var = function() {};
    Rul$Var = new Rul$Var;
    Rul$Var.f_isa = function(s) {
        return s == 'Rul::Var'
    };
    Rul$Var.f_perl = function() {
        return '::Rul::Var(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor sigil
    Rul$Var.v_sigil = null;
    Rul$Var.f_sigil = function() {
        return this.v_sigil
    }
    // accessor twigil
    Rul$Var.v_twigil = null;
    Rul$Var.f_twigil = function() {
        return this.v_twigil
    }
    // accessor name
    Rul$Var.v_name = null;
    Rul$Var.f_name = function() {
        return this.v_name
    }
    // method emit
    Rul$Var.f_emit = function() {
        var v_self = this;
        try {
            var v_table;
            (v_table = {
                "$": "$",
                "@": "$List_",
                "%": "$Hash_",
                "&": "$Code_",
            });
            return ((f_string(v_table[this.v_sigil]) + f_string(this.v_name)))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Rul$Var.f_emit; // v8 bug workaround
})();

;
// class Rul::Constant
if (typeof Rul$Constant != 'object') {
    Rul$Constant = function() {};
    Rul$Constant = new Rul$Constant;
    Rul$Constant.f_isa = function(s) {
        return s == 'Rul::Constant'
    };
    Rul$Constant.f_perl = function() {
        return '::Rul::Constant(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor constant
    Rul$Constant.v_constant = null;
    Rul$Constant.f_constant = function() {
        return this.v_constant
    }
    // method emit
    Rul$Constant.f_emit = function() {
        var v_self = this;
        try {
            var v_str;
            (v_str = this.v_constant);
            return (Rul.f_constant(v_str))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Rul$Constant.f_emit; // v8 bug workaround
})();

;
// class Rul::Dot
if (typeof Rul$Dot != 'object') {
    Rul$Dot = function() {};
    Rul$Dot = new Rul$Dot;
    Rul$Dot.f_isa = function(s) {
        return s == 'Rul::Dot'
    };
    Rul$Dot.f_perl = function() {
        return '::Rul::Dot(' + Main._dump(this) + ')'
    };
} (function() {
    // method emit
    Rul$Dot.f_emit = function() {
        var v_self = this;
        try {
            return ((f_string("( ('' ne substr( $str, $MATCH.to, 1 )) ") + f_string((f_string("  ?? (1 + ($MATCH.to := 1 + $MATCH.to ))") + f_string((f_string("  !! false ") + f_string(")")))))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Rul$Dot.f_emit; // v8 bug workaround
})();

;
// class Rul::SpecialChar
if (typeof Rul$SpecialChar != 'object') {
    Rul$SpecialChar = function() {};
    Rul$SpecialChar = new Rul$SpecialChar;
    Rul$SpecialChar.f_isa = function(s) {
        return s == 'Rul::SpecialChar'
    };
    Rul$SpecialChar.f_perl = function() {
        return '::Rul::SpecialChar(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor char
    Rul$SpecialChar.v_char = null;
    Rul$SpecialChar.f_char = function() {
        return this.v_char
    }
    // method emit
    Rul$SpecialChar.f_emit = function() {
        var v_self = this;
        try {
            var v_char;
            (v_char = this.v_char);
            if (f_bool((v_char == "n"))) {
                (v_rul = {
                    __proto__: Rul$SubruleNoCapture,
                    v_metasyntax: "is_newline",
                });
                (v_rul = v_rul.f_emit());
                throw (v_rul)
            } else {}; if (f_bool((v_char == "N"))) {
                (v_rul = {
                    __proto__: Rul$SubruleNoCapture,
                    v_metasyntax: "not_newline",
                });
                (v_rul = v_rul.f_emit());
                throw (v_rul)
            } else {}; if (f_bool((v_char == "d"))) {
                (v_rul = {
                    __proto__: Rul$SubruleNoCapture,
                    v_metasyntax: "digit",
                });
                (v_rul = v_rul.f_emit());
                throw (v_rul)
            } else {}; if (f_bool((v_char == "s"))) {
                (v_rul = {
                    __proto__: Rul$SubruleNoCapture,
                    v_metasyntax: "space",
                });
                (v_rul = v_rul.f_emit());
                throw (v_rul)
            } else {};
            throw (Rul.f_constant(v_char))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Rul$SpecialChar.f_emit; // v8 bug workaround
})();

;
// class Rul::Block
if (typeof Rul$Block != 'object') {
    Rul$Block = function() {};
    Rul$Block = new Rul$Block;
    Rul$Block.f_isa = function(s) {
        return s == 'Rul::Block'
    };
    Rul$Block.f_perl = function() {
        return '::Rul::Block(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor closure
    Rul$Block.v_closure = null;
    Rul$Block.f_closure = function() {
        return this.v_closure
    }
    // method emit
    Rul$Block.f_emit = function() {
        var v_self = this;
        try {
            return ((f_string("(do { ") + f_string((f_string(this.v_closure) + f_string(" } || 1)")))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Rul$Block.f_emit; // v8 bug workaround
})();

;
// class Rul::InterpolateVar
if (typeof Rul$InterpolateVar != 'object') {
    Rul$InterpolateVar = function() {};
    Rul$InterpolateVar = new Rul$InterpolateVar;
    Rul$InterpolateVar.f_isa = function(s) {
        return s == 'Rul::InterpolateVar'
    };
    Rul$InterpolateVar.f_perl = function() {
        return '::Rul::InterpolateVar(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor var
    Rul$InterpolateVar.v_var = null;
    Rul$InterpolateVar.f_var = function() {
        return this.v_var
    }
    // method emit
    Rul$InterpolateVar.f_emit = function() {
        var v_self = this;
        try {
            say((f_string("# TODO: interpolate var ") + f_string((f_string(this.v_var.f_emit()) + f_string("")))));
            return (f_die())
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Rul$InterpolateVar.f_emit; // v8 bug workaround
})();

;
// class Rul::NamedCapture
if (typeof Rul$NamedCapture != 'object') {
    Rul$NamedCapture = function() {};
    Rul$NamedCapture = new Rul$NamedCapture;
    Rul$NamedCapture.f_isa = function(s) {
        return s == 'Rul::NamedCapture'
    };
    Rul$NamedCapture.f_perl = function() {
        return '::Rul::NamedCapture(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor rule_exp
    Rul$NamedCapture.v_rule_exp = null;
    Rul$NamedCapture.f_rule_exp = function() {
        return this.v_rule_exp
    }
    // accessor capture_ident
    Rul$NamedCapture.v_capture_ident = null;
    Rul$NamedCapture.f_capture_ident = function() {
        return this.v_capture_ident
    }
    // method emit
    Rul$NamedCapture.f_emit = function() {
        var v_self = this;
        try {
            say((f_string("# TODO: named capture ") + f_string((f_string(this.v_capture_ident) + f_string((f_string(" := ") + f_string((f_string(this.v_rule_exp.f_emit()) + f_string("")))))))));
            return (f_die())
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Rul$NamedCapture.f_emit; // v8 bug workaround
})();

;
// class Rul::Before
if (typeof Rul$Before != 'object') {
    Rul$Before = function() {};
    Rul$Before = new Rul$Before;
    Rul$Before.f_isa = function(s) {
        return s == 'Rul::Before'
    };
    Rul$Before.f_perl = function() {
        return '::Rul::Before(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor rule_exp
    Rul$Before.v_rule_exp = null;
    Rul$Before.f_rule_exp = function() {
        return this.v_rule_exp
    }
    // method emit
    Rul$Before.f_emit = function() {
        var v_self = this;
        try {
            return ((f_string("do { ") + f_string((f_string("my $tmp := $MATCH; ") + f_string((f_string("$MATCH := ::MiniPerl6::Match( 'str' => $str, 'from' => $tmp.to, 'to' => $tmp.to, 'bool' => 1  ); ") + f_string((f_string("$MATCH.bool := ") + f_string((f_string(this.v_rule_exp.f_emit()) + f_string((f_string("; ") + f_string((f_string("$tmp.bool := ?$MATCH; ") + f_string((f_string("$MATCH := $tmp; ") + f_string((f_string("?$MATCH; ") + f_string("}")))))))))))))))))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Rul$Before.f_emit; // v8 bug workaround
})();

;
// class Rul::NotBefore
if (typeof Rul$NotBefore != 'object') {
    Rul$NotBefore = function() {};
    Rul$NotBefore = new Rul$NotBefore;
    Rul$NotBefore.f_isa = function(s) {
        return s == 'Rul::NotBefore'
    };
    Rul$NotBefore.f_perl = function() {
        return '::Rul::NotBefore(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor rule_exp
    Rul$NotBefore.v_rule_exp = null;
    Rul$NotBefore.f_rule_exp = function() {
        return this.v_rule_exp
    }
    // method emit
    Rul$NotBefore.f_emit = function() {
        var v_self = this;
        try {
            return ((f_string("do { ") + f_string((f_string("my $tmp := $MATCH; ") + f_string((f_string("$MATCH := ::MiniPerl6::Match( 'str' => $str, 'from' => $tmp.to, 'to' => $tmp.to, 'bool' => 1  ); ") + f_string((f_string("$MATCH.bool := ") + f_string((f_string(this.v_rule_exp.f_emit()) + f_string((f_string("; ") + f_string((f_string("$tmp.bool := !$MATCH; ") + f_string((f_string("$MATCH := $tmp; ") + f_string((f_string("?$MATCH; ") + f_string("}")))))))))))))))))))
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Rul$NotBefore.f_emit; // v8 bug workaround
})();

;
// class Rul::NegateCharClass
if (typeof Rul$NegateCharClass != 'object') {
    Rul$NegateCharClass = function() {};
    Rul$NegateCharClass = new Rul$NegateCharClass;
    Rul$NegateCharClass.f_isa = function(s) {
        return s == 'Rul::NegateCharClass'
    };
    Rul$NegateCharClass.f_perl = function() {
        return '::Rul::NegateCharClass(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor chars
    Rul$NegateCharClass.v_chars = null;
    Rul$NegateCharClass.f_chars = function() {
        return this.v_chars
    }
    // method emit
    Rul$NegateCharClass.f_emit = function() {
        var v_self = this;
        try {
            say("TODO NegateCharClass");
            return (f_die())
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Rul$NegateCharClass.f_emit; // v8 bug workaround
})();

;
// class Rul::CharClass
if (typeof Rul$CharClass != 'object') {
    Rul$CharClass = function() {};
    Rul$CharClass = new Rul$CharClass;
    Rul$CharClass.f_isa = function(s) {
        return s == 'Rul::CharClass'
    };
    Rul$CharClass.f_perl = function() {
        return '::Rul::CharClass(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor chars
    Rul$CharClass.v_chars = null;
    Rul$CharClass.f_chars = function() {
        return this.v_chars
    }
    // method emit
    Rul$CharClass.f_emit = function() {
        var v_self = this;
        try {
            say("TODO CharClass");
            return (f_die())
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Rul$CharClass.f_emit; // v8 bug workaround
})();

;
// class Rul::Capture
if (typeof Rul$Capture != 'object') {
    Rul$Capture = function() {};
    Rul$Capture = new Rul$Capture;
    Rul$Capture.f_isa = function(s) {
        return s == 'Rul::Capture'
    };
    Rul$Capture.f_perl = function() {
        return '::Rul::Capture(' + Main._dump(this) + ')'
    };
} (function() {
    // accessor rule_exp
    Rul$Capture.v_rule_exp = null;
    Rul$Capture.f_rule_exp = function() {
        return this.v_rule_exp
    }
    // method emit
    Rul$Capture.f_emit = function() {
        var v_self = this;
        try {
            say("TODO RulCapture");
            return (f_die())
        } catch(err) {
            if (err instanceof Error) {
                throw (err)
            } else {
                return (err)
            }
        }
    }
    Rul$Capture.f_emit; // v8 bug workaround
})();

;
