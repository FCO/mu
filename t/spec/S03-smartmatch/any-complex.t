use v6;
use Test;
plan *;

{
    ok (1 + 2i)    ~~ (1 + 2i),  'Complex  ~~ Complex (+)';
    ok !((1 + 2i)  ~~ (1 + 1i)), 'Complex  ~~ Complex (-)';
    ok !((1 + 2i)  ~~ (2 + 2i)), 'Complex  ~~ Complex (-)';
    ok !((1 + 2i) !~~ (1 + 2i)), 'Complex !~~ Complex (-)';
    ok (1 + 2i)   !~~ (1 + 1i),  'Complex !~~ Complex (+)';
    ok (1 + 2i)   !~~ (2 + 2i),  'Complex !~~ Complex (+)';
    ok 3           ~~ (3 + 0i),  'Num  ~~ Complex (+)';
    ok !(2         ~~ (3 + 0i)), 'Num  ~~ Complex (-)';
    ok !(3         ~~ (3 + 1i)), 'Num  ~~ Complex (-)';
    ok !(3        !~~ (3 + 0i)), 'Num !~~ Complex (-)';
    ok  (2        !~~ (3 + 0i)), 'Num !~~ Complex (+)';
    ok  (3        !~~ (3 + 1i)), 'Num !~~ Complex (+)';
}

done_testing;

# vim: ft=perl6
