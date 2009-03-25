
class Match {
  has $.match_rule;
  has $.match_string;
  has $.match_from;
  has $.match_to;
  has $.match_hash;
  has $.match_array;
  has $.match_boolean;
  method make_from_rsfth($r,$s,$f,$t,$h) {
    $.new('match_rule',$r,'match_string',$s,'match_from',$f,'match_to',$t,'match_hash',$h,'match_array',[],'match_boolean',1);
  };
  method match_new($b,$s,$a,$h,$f,$t) {
    $.new('match_bool',$b,'match_string',$s,'match_array',$a,'match_hash',$h,'match_from',$f,'match_to',$t);
  }
  method match_describe() {
    my $b; if $.match_boolean { $b = 't' } else { $b = 'F' };
    my $f = $.match_from;
    my $t = $.match_to;
    if !defined($f) { $f = "" }
    if !defined($t) { $t = "" }
    my $a; if $.match_array.elems { $a = $.match_array.match_describe } else { $a = '[]' };
    my $r = $.match_rule || "";
    my $s = $r~"<"~$b~','~$f~","~$t~",'"~$.match_string~"',"~$a~",\{";
    for $.match_hash.keys {
      my $k = $_;
      my $v = $.match_hash{$k};
      my $vs = 'undef';
      if defined($v) {
        $vs = $v.match_describe;
      }
      $s = $s ~ "\n  "~$k~" => "~$.indent_except_top($vs)~",";
    }
    if $.match_hash.keys.elems {$s = $s ~ "\n"}
    $s = $s ~ "}>";
  };
  method indent($s) {
    $s.re_gsub('(?m:^(?!\Z))','  ')
  };
  method indent_except_top($s) {
    $s.re_gsub('(?m:^(?<!\A)(?!\Z))','  ')
  };
  method from { $.match_from }
  method to { $.match_to }
};
class Array {
  method match_describe() {
    ("[\n" ~
     Match.indent($.map(sub ($e){$e.match_describe}).join(",\n")) ~
     "\n]")
  }
};
class Hash {
  method match_describe() {
    my $s = '{';
    for $.keys {
      my $k = $_;
      my $v = self.{$k};
      my $vs = 'undef';
      if defined($v) {
        $vs = $v.match_describe;
      }
      $s = $s ~ "\n  "~$k~" => "~Match.indent_except_top($vs)~",";
    }
    if $.keys.elems {$s = $s ~ "\n"}
    $s ~ "}"
  };
};
class Str {
  method match_describe() {
    "'"~self~"'"
  }
}
class Int {
  method match_describe() {
    "'"~self~"'"
  }
}
class Num {
  method match_describe() {
    "'"~self~"'"
  }
}
