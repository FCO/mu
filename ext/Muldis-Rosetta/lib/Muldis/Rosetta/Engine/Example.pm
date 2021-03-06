use v6;

use Muldis::Rosetta::Interface;

###########################################################################
###########################################################################

module Muldis::Rosetta::Engine::Example-0.7.0 {
    # Note: This given version applies to all of this file's packages.

###########################################################################

sub new_machine of Muldis::Rosetta::Engine::Example::Public::Machine
        (Array :$exp_ast_lang!, Any :$machine_config!) {
    return ::Muldis::Rosetta::Engine::Example::Public::Machine.new(
        :exp_ast_lang($exp_ast_lang), :machine_config($machine_config) );
}

###########################################################################

} # module Muldis::Rosetta::Engine::Example

###########################################################################
###########################################################################

class Muldis::Rosetta::Engine::Example::Public::Machine {
    does Muldis::Rosetta::Interface::Machine;

    # Allow objects of these to update Machine' "assoc" list re themselves.
    trusts Muldis::Rosetta::Engine::Example::Public::Process;

    # User-supplied config data for this Machine object.
    # For the moment, the Example Engine doesn't actually have anything
    # that can be config in this way, so input $machine_config is ignored.
    has Any $!exp_ast_lang;
    has Any $!machine_config;

    # Lists of user-held objects associated with parts of this Machine.
    # For each of these, Hash keys are obj .WHERE/addrs, vals the objs.
    # These should be weak obj-refs, so objs disappear from here
    has Hash $!assoc_processes;

###########################################################################

submethod BUILD (Array :$exp_ast_lang!, Any :$machine_config!) {

    # TODO: input checks.
    $!exp_ast_lang   = [$exp_ast_lang.values];
    $!machine_config = $machine_config;

    $!assoc_processes = {};

    return;
}

submethod DESTROY () {
    # TODO: check for active trans and rollback ... or member VM does it.
    # Likewise with closing open files or whatever.
    return;
}

###########################################################################

method fetch_exp_ast_lang of Array () {
    return [$!exp_ast_lang.values];
}

method store_exp_ast_lang (Array :$lang!) {
    # TODO: input checks.
    $!exp_ast_lang = [$lang.values];
    return;
}

###########################################################################

method new_process
        of Muldis::Rosetta::Engine::Example::Public::Process () {
    return ::Muldis::Rosetta::Engine::Example::Public::Process.new(
        :machine(self) );
}

method assoc_processes of Array () {
    return [$!assoc_processes.values];
}

###########################################################################

} # class Muldis::Rosetta::Engine::Example::Public::Machine

###########################################################################
###########################################################################

class Muldis::Rosetta::Engine::Example::Public::Process {
    does Muldis::Rosetta::Interface::Process;

    # Allow objects of these to update Process' "assoc" list re themselves.
    trusts Muldis::Rosetta::Engine::Example::Public::Var;
    trusts Muldis::Rosetta::Engine::Example::Public::FuncBinding;
    trusts Muldis::Rosetta::Engine::Example::Public::ProcBinding;

    has Muldis::Rosetta::Engine::Example::Public::Machine $!machine;

    # Lists of user-held objects associated with parts of this Process.
    # For each of these, Hash keys are obj .WHERE/addrs, vals the objs.
    # These should be weak obj-refs, so objs disappear from here
    has Hash $!assoc_vars;
    has Hash $!assoc_func_bindings;
    has Hash $!assoc_proc_bindings;

    # Maintain actual state of the this DBMS' virtual machine.
    # TODO: the VM itself should be in another file, this attr with it.
    has Int $!trans_nest_level;

###########################################################################

submethod BUILD
        (Muldis::Rosetta::Engine::Example::Public::Machine :$machine!) {

    # TODO: input checks.

    $!machine = $machine;
#    $machine!assoc_vars.{self.WHERE} = self;
#    weaken $machine!assoc_vars.{self.WHERE};

    $!assoc_vars          = {};
    $!assoc_func_bindings = {};
    $!assoc_proc_bindings = {};

    $!trans_nest_level = 0;

    return;
}

submethod DESTROY () {
    # TODO: check for active trans and rollback ... or member VM does it.
    # Likewise with closing open files or whatever.
    return;
}

###########################################################################

method new_var of Muldis::Rosetta::Engine::Example::Public::Var
        (Str :$decl_type!) {
    return ::Muldis::Rosetta::Engine::Example::Public::Var.new(
        :process(self), :decl_type($decl_type) );
}

method assoc_vars of Array () {
    return [$!assoc_vars.values];
}

method new_func_binding
        of Muldis::Rosetta::Engine::Example::Public::FuncBinding () {
    return ::Muldis::Rosetta::Engine::Example::Public::FuncBinding.new(
        :process(self) );
}

method assoc_func_bindings of Array () {
    return [$!assoc_func_bindings.values];
}

method new_proc_binding
        of Muldis::Rosetta::Engine::Example::Public::ProcBinding () {
    return ::Muldis::Rosetta::Engine::Example::Public::ProcBinding.new(
        :process(self) );
}

method assoc_proc_bindings of Array () {
    return [$!assoc_proc_bindings.values];
}

###########################################################################

method call_func of Muldis::Rosetta::Interface::Var
        (Str :$func_name!, Hash :$args!) {

#    my $f = ::Muldis::Rosetta::Engine::Example::Public::FuncBinding.new(
#        :process(self) );

    my $result = ::Muldis::Rosetta::Engine::Example::Public::Var.new(
        :process(self), :decl_type('sys.Core.Universal.Universal') );

#    $f.bind_func( :func_name($func_name) );
#    $f.bind_result( :var($result) );
#    $f.bind_params( :args($args) );

#    $f.call();

    return $result;
}

###########################################################################

method call_proc (Str :$proc_name!, Hash :$upd_args!, Hash :$ro_args!) {

#    my $p = ::Muldis::Rosetta::Engine::Example::Public::ProcBinding.new(
#        :process(self) );

#    $p.bind_proc( :proc_name($proc_name) );
#    $p.bind_upd_params( :args($upd_args) );
#    $p.bind_ro_params( :args($ro_args) );

#    $p.call();

    return;
}

###########################################################################

method trans_nest_level of Int () {
    return $!trans_nest_level;
}

method start_trans () {
    # TODO: the actual work.
    $!trans_nest_level ++;
    return;
}

method commit_trans () {
    die q{commit_trans(): Could not commit a transaction;}
            ~ q{ none are currently active.}
        if $!trans_nest_level == 0;
    # TODO: the actual work.
    $!trans_nest_level --;
    return;
}

method rollback_trans () {
    die q{rollback_trans(): Could not rollback a transaction;}
            ~ q{ none are currently active.}
        if $!trans_nest_level == 0;
    # TODO: the actual work.
    $!trans_nest_level --;
    return;
}

###########################################################################

} # class Muldis::Rosetta::Engine::Example::Public::Process

###########################################################################
###########################################################################

class Muldis::Rosetta::Engine::Example::Public::Var {
    does Muldis::Rosetta::Interface::Var;

    has Muldis::Rosetta::Engine::Example::Public::Process $!process;

    has Muldis::Rosetta::Engine::Example::VM::Var $!var;
    # TODO: cache Perl-Hosted Muldis D version of $!var.

###########################################################################

submethod BUILD (Muldis::Rosetta::Engine::Example::Public::Process
        :$process!, Str :$decl_type!) {

    # TODO: input checks.

    $!process = $process;
#    $process!assoc_vars.{self.WHERE} = self;
#    weaken $process!assoc_vars.{self.WHERE};

#    $!var = ::Muldis::Rosetta::Engine::Example::VM::Var.new(
#        :decl_type($decl_type) ); # TODO; or some such

    return;
}

submethod DESTROY () {
#    $!process!assoc_vars.delete( self.WHERE );
    return;
}

###########################################################################

method fetch_ast of Array () {
#    return $!var.as_phmd(); # TODO; or some such
}

method store_ast (Array :$ast!) {
    # TODO: input checks.
#    $!var = from_phmd( $ast ); # TODO; or some such
    return;
}

###########################################################################

} # class Muldis::Rosetta::Engine::Example::Public::Var

###########################################################################
###########################################################################

class Muldis::Rosetta::Engine::Example::Public::FuncBinding {
    does Muldis::Rosetta::Interface::FuncBinding;

###########################################################################

# TODO.

###########################################################################

} # class Muldis::Rosetta::Engine::Example::Public::FuncBinding

###########################################################################
###########################################################################

class Muldis::Rosetta::Engine::Example::Public::ProcBinding {
    does Muldis::Rosetta::Interface::ProcBinding;

###########################################################################

# TODO.

###########################################################################

} # class Muldis::Rosetta::Engine::Example::Public::ProcBinding

###########################################################################
###########################################################################

=pod

=encoding utf8

=head1 NAME

Muldis::Rosetta::Engine::Example -
Self-contained reference implementation of a Muldis Rosetta Engine

=head1 VERSION

This document describes Muldis::Rosetta::Engine::Example version 0.7.0 for
Perl 6.

It also describes the same-number versions for Perl 6 of
Muldis::Rosetta::Engine::Example::Public::Machine,
Muldis::Rosetta::Engine::Example::Public::Process,
Muldis::Rosetta::Engine::Example::Public::Var,
Muldis::Rosetta::Engine::Example::Public::FuncBinding, and
Muldis::Rosetta::Engine::Example::Public::ProcBinding.

=head1 SYNOPSIS

I<This documentation is pending.>

=head1 DESCRIPTION

B<Muldis::Rosetta::Engine::Example>, aka the I<Muldis Rosetta Example
Engine>, aka I<Example>, is the self-contained and pure-Perl reference
implementation of Muldis Rosetta.  It is included in the Muldis Rosetta
core distribution to allow the core to be completely testable on its own.

Example is coded intentionally in a simple fashion so that it is easy to
maintain and and easy for developers to study.  As a result, while it
performs correctly and reliably, it also performs quite slowly; you should
only use Example for testing, development, and study; you should not use it
in production.  (See the L<Muldis::Rosetta::SeeAlso> file for a list of
other Engines that are more suitable for production.)

This C<Muldis::Rosetta::Engine::Example> file is the main file of the
Example Engine, and it is what applications quasi-directly invoke; its
C<Muldis::Rosetta::Engine::Example::Public::\w+> classes directly
do/subclass the roles/classes in L<Muldis::Rosetta::Interface>.  The other
C<Muldis::Rosetta::Engine::Example::\w+> files are used internally by this
file, comprising the rest of the Example Engine, and are not intended to be
used directly in user code.

I<This documentation is pending.>

=head1 INTERFACE

I<This documentation is pending; this section may also be split into
several.>

=head1 DIAGNOSTICS

I<This documentation is pending.>

=head1 CONFIGURATION AND ENVIRONMENT

I<This documentation is pending.>

=head1 DEPENDENCIES

This file requires any version of Perl 6.x.y that is at least 6.0.0.

It also requires these Perl 6 classes that are in the current distribution:
L<Muldis::Rosetta::Interface-0.7.0|Muldis::Rosetta::Interface>.

=head1 INCOMPATIBILITIES

None reported.

=head1 SEE ALSO

Go to L<Muldis::Rosetta> for the majority of distribution-internal
references, and L<Muldis::Rosetta::SeeAlso> for the majority of
distribution-external references.

=head1 BUGS AND LIMITATIONS

I<This documentation is pending.>

=head1 AUTHOR

Darren Duncan (C<perl@DarrenDuncan.net>)

=head1 LICENSE AND COPYRIGHT

This file is part of the Muldis Rosetta framework.

Muldis Rosetta is Copyright © 2002-2008, Darren Duncan.

See the LICENSE AND COPYRIGHT of L<Muldis::Rosetta> for details.

=head1 TRADEMARK POLICY

The TRADEMARK POLICY in L<Muldis::Rosetta> applies to this file too.

=head1 ACKNOWLEDGEMENTS

The ACKNOWLEDGEMENTS in L<Muldis::Rosetta> apply to this file too.

=cut
