# http://perl6advent.wordpress.com/2009/12/12/day-12-modules-and-exporting/

use v6;
use Test;

plan 9;

BEGIN {
    @*INC.push: 't/spec/packages';
}

{
    eval_lives_ok 'use Fancy::Utilities', 'Can use Fancy::Utilities';

    use Fancy::Utilities;
    is Fancy::Utilities::lolgreet('Tene'), 'O HAI TENE', 'Referencing subs by fullname works';
    is lolgreet('Jnthn'), 'O HAI JNTHN', 'Exporting symbols works';
}

#?rakudo skip "Importing symbols by name doesn't work in current Rakudo"
{
    eval_lives_ok 'use Fancy::Utilities :shortgreet, :lolgreet;', 'Can import symbols by name';

    use Fancy::Utilities :shortgreet, :lolgreet;
    is lolgreet('Tene'), 'O HAI TENE', 'Explicitly importing symbols by name works';
    nok nicegreet('Jnthn'), 'Good morning, Jnthn!', 'Cannot use a sub not explicitly imported';
}

#?rakudo skip "Importing all symbols using :ALL doesn't work in current Rakudo"
{
    eval_lives_ok 'use Fancy::Utilities :ALL;', 'Can import everything marked for export using :ALL';

    use Fancy::Utilities :ALL;
    is lolrequest("Cake"), 'I CAN HAZ A cake?', 'Can use a sub marked as exported and imported via :ALL';
}

#?rakudo skip "Multi subs aren't imported by default in current Rakudo - is this to spec?"
{
    use Fancy::Utilities;
    is greet(), 'Hi!', "Multi subs are imported by default - is this to spec?";
}
