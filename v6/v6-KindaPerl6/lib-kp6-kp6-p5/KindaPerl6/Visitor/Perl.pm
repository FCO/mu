{

    package KindaPerl6::Visitor::Perl;

    # Do not edit this file - Perl 5 generated by KindaPerl6
    use v5;
    use strict;
    no strict 'vars';
    use constant KP6_DISABLE_INSECURE_CODE => 0;
    use KindaPerl6::Runtime::Perl5::KP6Runtime;
    my $_MODIFIED;
    BEGIN { $_MODIFIED = {} }
    BEGIN { $_ = ::DISPATCH( $::Scalar, "new", { modified => $_MODIFIED, name => "$_" } ); }
    {
        do {
            if ( ::DISPATCH( ::DISPATCH( ::DISPATCH( $GLOBAL::Code_VAR_defined, 'APPLY', $::KindaPerl6::Visitor::Perl ), "true" ), "p5landish" ) ) { }
            else {
                {
                    do {
                        ::MODIFIED($::KindaPerl6::Visitor::Perl);
                        $::KindaPerl6::Visitor::Perl = ::DISPATCH( ::DISPATCH( $::Class, 'new', ::DISPATCH( $::Str, 'new', 'KindaPerl6::Visitor::Perl' ) ), 'PROTOTYPE', );
                        }
                }
            }
        };
        ::DISPATCH(
            ::DISPATCH( $::KindaPerl6::Visitor::Perl, 'HOW', ),
            'add_method',
            ::DISPATCH( $::Str, 'new', 'visit' ),
            ::DISPATCH(
                $::Method,
                'new',
                sub {
                    my $result;
                    $result = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$result' } ) unless defined $result;
                    BEGIN { $result = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$result' } ) }
                    my $data;
                    $data = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$data' } ) unless defined $data;
                    BEGIN { $data = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$data' } ) }
                    my $item;
                    $item = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$item' } ) unless defined $item;
                    BEGIN { $item = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$item' } ) }
                    my $List__ = ::DISPATCH( $::Array, 'new', { modified => $_MODIFIED, name => '$List__' } );
                    my $node;
                    $node = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$node' } ) unless defined $node;
                    BEGIN { $node = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$node' } ) }
                    my $node_name;
                    $node_name = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$node_name' } ) unless defined $node_name;
                    BEGIN { $node_name = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$node_name' } ) }
                    $self = shift;
                    my $CAPTURE;
                    $CAPTURE = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$CAPTURE' } ) unless defined $CAPTURE;
                    BEGIN { $CAPTURE = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$CAPTURE' } ) }
                    ::DISPATCH_VAR( $CAPTURE, "STORE", ::CAPTURIZE( \@_ ) );
                    do {
                        ::MODIFIED($List__);
                        $List__ = ::DISPATCH( $CAPTURE, 'array', );
                    };
                    do {
                        ::MODIFIED($Hash__);
                        $Hash__ = ::DISPATCH( $CAPTURE, 'hash', );
                    };
                    do {
                        ::MODIFIED($node);
                        $node = ::DISPATCH( $List__, 'INDEX', ::DISPATCH( $::Int, 'new', 0 ) );
                    };
                    do {
                        ::MODIFIED($node_name);
                        $node_name = ::DISPATCH( $List__, 'INDEX', ::DISPATCH( $::Int, 'new', 1 ) );
                    };
                    do {
                        ::MODIFIED($result);
                        $result = ::DISPATCH( $::Str, 'new', '' );
                    };
                    do {
                        ::MODIFIED($result);
                        $result = ::DISPATCH( $GLOBAL::Code_infix_58__60__126__62_,
                            'APPLY', $result,
                            ::DISPATCH( $GLOBAL::Code_infix_58__60__126__62_, 'APPLY', ::DISPATCH( $::Str, 'new', '::' ), ::DISPATCH( $GLOBAL::Code_infix_58__60__126__62_, 'APPLY', $node_name, ::DISPATCH( $::Str, 'new', '( ' ) ) ) );
                    };
                    do {
                        ::MODIFIED($data);
                        $data = ::DISPATCH( $node, 'attribs', );
                    };
                    $item;
                    {
                        my $item;
                        $item = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$item' } ) unless defined $item;
                        BEGIN { $item = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$item' } ) }
                        for $item ( @{ ::DISPATCH( $GLOBAL::Code_prefix_58__60__64__62_, 'APPLY', ::DISPATCH( $GLOBAL::Code_keys, 'APPLY', ::DISPATCH( $GLOBAL::Code_prefix_58__60__37__62_, 'APPLY', $data ) ) )->{_value}{_array} } ) {
                            {
                                do {
                                    ::MODIFIED($result);
                                    $result = ::DISPATCH( $GLOBAL::Code_infix_58__60__126__62_,
                                        'APPLY', $result,
                                        ::DISPATCH( $GLOBAL::Code_infix_58__60__126__62_, 'APPLY', ::DISPATCH( $::Str, 'new', ' ' ), ::DISPATCH( $GLOBAL::Code_infix_58__60__126__62_, 'APPLY', $item, ::DISPATCH( $::Str, 'new', ' => ' ) ) ) );
                                };
                                do {
                                    if ( ::DISPATCH( ::DISPATCH( ::DISPATCH( ::DISPATCH( $data, 'LOOKUP', $item ), 'isa', ::DISPATCH( $::Str, 'new', 'Array' ) ), "true" ), "p5landish" ) ) {
                                        {
                                            my $subitem;
                                            $subitem = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$subitem' } ) unless defined $subitem;
                                            BEGIN { $subitem = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$subitem' } ) }
                                            do {
                                                ::MODIFIED($result);
                                                $result = ::DISPATCH( $GLOBAL::Code_infix_58__60__126__62_, 'APPLY', $result, ::DISPATCH( $::Str, 'new', '[ ' ) );
                                            };
                                            $subitem;
                                            {
                                                my $subitem;
                                                $subitem = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$subitem' } ) unless defined $subitem;
                                                BEGIN { $subitem = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$subitem' } ) }
                                                for $subitem ( @{ ::DISPATCH( $GLOBAL::Code_prefix_58__60__64__62_, 'APPLY', ::DISPATCH( $GLOBAL::Code_prefix_58__60__64__62_, 'APPLY', ::DISPATCH( $data, 'LOOKUP', $item ) ) )->{_value}{_array} } ) {
                                                    {
                                                        do {
                                                            if ( ::DISPATCH( ::DISPATCH( ::DISPATCH( $subitem, 'isa', ::DISPATCH( $::Str, 'new', 'Array' ) ), "true" ), "p5landish" ) ) {
                                                                {
                                                                    do {
                                                                        ::MODIFIED($result);
                                                                        $result = ::DISPATCH( $GLOBAL::Code_infix_58__60__126__62_, 'APPLY', $result, ::DISPATCH( $::Str, 'new', ' [ ... ], ' ) );
                                                                        }
                                                                }
                                                            }
                                                            else {
                                                                {
                                                                    do {
                                                                        ::MODIFIED($result);
                                                                        $result = ::DISPATCH( $GLOBAL::Code_infix_58__60__126__62_,
                                                                            'APPLY', $result, ::DISPATCH( $GLOBAL::Code_infix_58__60__126__62_, 'APPLY', ::DISPATCH( $subitem, 'emit', $self ), ::DISPATCH( $::Str, 'new', ', ' ) ) );
                                                                        }
                                                                }
                                                            }
                                                            }
                                                    }
                                                }
                                            };
                                            do {
                                                ::MODIFIED($result);
                                                $result = ::DISPATCH( $GLOBAL::Code_infix_58__60__126__62_, 'APPLY', $result, ::DISPATCH( $::Str, 'new', ' ], ' ) );
                                                }
                                        }
                                    }
                                    else {
                                        {
                                            do {
                                                if ( ::DISPATCH( ::DISPATCH( ::DISPATCH( ::DISPATCH( $data, 'LOOKUP', $item ), 'isa', ::DISPATCH( $::Str, 'new', 'Hash' ) ), "true" ), "p5landish" ) ) {
                                                    {
                                                        my $subitem;
                                                        $subitem = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$subitem' } ) unless defined $subitem;
                                                        BEGIN { $subitem = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$subitem' } ) }
                                                        do {
                                                            ::MODIFIED($result);
                                                            $result = ::DISPATCH( $GLOBAL::Code_infix_58__60__126__62_, 'APPLY', $result, ::DISPATCH( $::Str, 'new', '{ ' ) );
                                                        };
                                                        $subitem;
                                                        {
                                                            my $subitem;
                                                            $subitem = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$subitem' } ) unless defined $subitem;
                                                            BEGIN { $subitem = ::DISPATCH( $::Scalar, 'new', { modified => $_MODIFIED, name => '$subitem' } ) }
                                                            for $subitem (
                                                                @{ ::DISPATCH(
                                                                        $GLOBAL::Code_prefix_58__60__64__62_, 'APPLY',
                                                                        ::DISPATCH( $GLOBAL::Code_keys, 'APPLY', ::DISPATCH( $GLOBAL::Code_prefix_58__60__37__62_, 'APPLY', ::DISPATCH( $data, 'LOOKUP', $item ) ) )
                                                                        )->{_value}{_array}
                                                                }
                                                                )
                                                            {
                                                                {
                                                                    do {
                                                                        ::MODIFIED($result);
                                                                        $result = ::DISPATCH(
                                                                            $GLOBAL::Code_infix_58__60__126__62_,
                                                                            'APPLY', $result,
                                                                            ::DISPATCH(
                                                                                $GLOBAL::Code_infix_58__60__126__62_,
                                                                                'APPLY', $subitem,
                                                                                ::DISPATCH(
                                                                                    $GLOBAL::Code_infix_58__60__126__62_,
                                                                                    'APPLY',
                                                                                    ::DISPATCH( $::Str, 'new', ' => ' ),
                                                                                    ::DISPATCH(
                                                                                        $GLOBAL::Code_infix_58__60__126__62_, 'APPLY',
                                                                                        ::DISPATCH( ::DISPATCH( ::DISPATCH( $data, 'LOOKUP', $item ), 'LOOKUP', $subitem ), 'emit', $self ), ::DISPATCH( $::Str, 'new', ', ' )
                                                                                    )
                                                                                )
                                                                            )
                                                                        );
                                                                        }
                                                                }
                                                            }
                                                        };
                                                        do {
                                                            ::MODIFIED($result);
                                                            $result = ::DISPATCH( $GLOBAL::Code_infix_58__60__126__62_, 'APPLY', $result, ::DISPATCH( $::Str, 'new', ' }, ' ) );
                                                            }
                                                    }
                                                }
                                                else {
                                                    {
                                                        do {
                                                            if ( ::DISPATCH( ::DISPATCH( ::DISPATCH( ::DISPATCH( $data, 'LOOKUP', $item ), 'isa', ::DISPATCH( $::Str, 'new', 'Str' ) ), "true" ), "p5landish" ) ) {
                                                                {
                                                                    do {
                                                                        ::MODIFIED($result);
                                                                        $result = ::DISPATCH(
                                                                            $GLOBAL::Code_infix_58__60__126__62_,
                                                                            'APPLY', $result,
                                                                            ::DISPATCH(
                                                                                $GLOBAL::Code_infix_58__60__126__62_,
                                                                                'APPLY',
                                                                                ::DISPATCH( $::Str, 'new', chr(39) ),
                                                                                ::DISPATCH(
                                                                                    $GLOBAL::Code_infix_58__60__126__62_,
                                                                                    'APPLY',
                                                                                    ::DISPATCH( $data, 'LOOKUP', $item ),
                                                                                    ::DISPATCH( $GLOBAL::Code_infix_58__60__126__62_, 'APPLY', ::DISPATCH( $::Str, 'new', chr(39) ), ::DISPATCH( $::Str, 'new', ', ' ) )
                                                                                )
                                                                            )
                                                                        );
                                                                        }
                                                                }
                                                            }
                                                            else {
                                                                {
                                                                    do {
                                                                        ::MODIFIED($result);
                                                                        $result = ::DISPATCH( $GLOBAL::Code_infix_58__60__126__62_,
                                                                            'APPLY', $result,
                                                                            ::DISPATCH( $GLOBAL::Code_infix_58__60__126__62_, 'APPLY', ::DISPATCH( ::DISPATCH( $data, 'LOOKUP', $item ), 'emit', $self ), ::DISPATCH( $::Str, 'new', ', ' ) ) );
                                                                        }
                                                                }
                                                            }
                                                            }
                                                    }
                                                }
                                                }
                                        }
                                    }
                                    }
                            }
                        }
                    };
                    do {
                        ::MODIFIED($result);
                        $result = ::DISPATCH( $GLOBAL::Code_infix_58__60__126__62_, 'APPLY', $result, ::DISPATCH( $::Str, 'new', ') ' ) );
                        }
                }
            )
            )
    };
    1
}
