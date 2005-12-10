{-# OPTIONS_GHC -cpp -fglasgow-exts -funbox-strict-fields -fallow-overlapping-instances -fno-warn-orphans -fno-warn-incomplete-patterns -fallow-undecidable-instances #-}
{- Generated by DrIFT (Automatic class derivations for Haskell) -}
{-# LINE 1 "src/Pugs/PIL2.hs-drift" #-}

{-|
    Pugs Intermediate Language, version 2.

>   And the Tree that was withered shall be renewed,
>   And he shall plant it in the high places,
>   And the City shall be blessed.
>   Sing all ye people!

-}


module Pugs.PIL2 (
    PIL_Environment(..),
    PIL_Stmts(..), PIL_Stmt(..), PIL_Decl(..),
    PIL_Expr(..), PIL_Literal(..), PIL_LValue(..),
    TParam(..), TCxt(..), TEnv(..),
) where
import Pugs.AST hiding (Prim)
import Pugs.Internals hiding (get, put)
import Pugs.Types
import Emit.PIR
import DrIFT.Perl5
import DrIFT.Binary
import DrIFT.JSON

-- import DrIFT.XML
-- {-! global : Haskell2Xml !-}

{-! global : GhcBinary, Perl5, JSON !-}

#ifndef HADDOCK
-- the @s etc. here confuse Haddock.
{-|
    The plan here is to first compile the environment (subroutines,
    statements, etc.) to an abstract syntax tree ('PIL' -- Pugs Intermediate
    Language) using the 'compile' function and 'Compile' class.

- Unify the Apply and Bind forms into method calls.
    Apply becomes .postcircumfix:<( )>
    Bind becomes .infix:<:=>

- Compile-time object initiation built with opaque object binders

- A PIL tree is merely an (unordered!) set of static declarations;
  the responsibility of calling the main function -- let's call it &{''}
  just for fun -- resides on the runtime.

- Anonymous closures -- should they be lambda-lifted and given ANON
  names? If yes this gives us flexibility over CSE (common shared expression)
  optimization, but this may be BDUF.  No λ lifting for now.

- Okay, time to try a simple definition.

   [SRC] say "Hello, World!"
   [PIL] SigList.new('&').infix:<:=>(
            Code.new(
                body => [|
                    ::?MY.postcircumfix<{ }>('&say')
                        .postcircumfix<( )>(Str.new('Hello World'))
                |]
                ... # other misc attributes
            )
        )

    -- Compile time analysis of &say is needed here.
    -- We want to allow possibility of MMD (note _open_ pkgs by default)
       so there needs to be a generic form.
    -- Static binding performed as another optimization pass.

    -- Predefined objects (_always_ bound to the same thing in compiler)
        ::?MY       -- current lexical scope
        ::?OUR      -- current package scope
        Symbol resolution (static vs dynamic lookup) is to be done at
        pass-1 for PIL2.  The "&say" below is _definitely_ dynamic.
        Or is it?  Why?  Because @Larry mandates "multi &*say" instead
        of a more restricted form of ::* as a default lexical scope
        that closes over the toplevel program.  Maybe pursue a ruling
        toward the more static definition, otherwise all builtins become
        _slower_ to infer than userdefined code, which is Just Not Right.

    -- String construction -- handled like perl5 using overload qq""?
       Ask @Larry for ruling over constant creation and propagation rules.
       (probably "use a macro if you'd like to change")
       so, safe to assume a prim form in PIL level.

    -- We _really_ need a quasiquoting notation for macro generation;
       introduce moral equivalent of [|...|] in PIL form, probably just an
       "AST" node.  (in CLR they call it System.Reflection.Expression)
       -- problem with this is it's a closed set; if we are to extend AST
          on the compiler level --
          -- nah, we aren't bootstrapping yet. KISS.

    -- This is a very imperative view; the runtime would be carrying
       instructions of populating the ObjSpace (Smalltalk, Ruby-ish)
       rather than fitting an AST into a lexical evaluator environment
       (LISP, Scheme-ish)

    -- Need better annotator for inferrence to work, esp. now it's
       populated with redundant .postcircumfix calls.  OTOH, they
       can be assumed to be closed under separate-compilation regime,
       so we eventually regain the signature.  But it'd be much slower
       than the current PIL1.  Oy vey.

    -- OTOH, refactor into a Callable role and introduce .apply?
       This is integral's (sensible) suggestion, but we don't have a
       Role system working yet, so why bother.

-}
#endif

data PIL_Environment = PIL_Environment
    { pilGlob :: [PIL_Decl]
    , pilMain :: PIL_Stmts
    }
    deriving (Show, Eq, Ord, Typeable)

data PIL_Stmts = PNil
    | PStmts
        { pStmt  :: !PIL_Stmt
        , pStmts :: !PIL_Stmts
        }
    | PPad
        { pScope :: !Scope
        , pSyms  :: ![(VarName, PIL_Expr)]
        , pStmts :: !PIL_Stmts
        }
    deriving (Show, Eq, Ord, Typeable)

data PIL_Stmt = PNoop | PStmt { pExpr :: !PIL_Expr } | PPos
        { pPos  :: !Pos
        , pExp  :: !Exp
        , pNode :: !PIL_Stmt
        }
    deriving (Show, Eq, Ord, Typeable)

data PIL_Expr
    = PRawName { pRawName :: !VarName }
    | PExp { pLV  :: !PIL_LValue }
    | PLit { pLit :: !PIL_Literal }
    | PThunk { pThunk :: !PIL_Expr }
    | PCode
        { pType    :: !SubType
        , pParams  :: ![TParam]
        , pLValue  :: !Bool
        , pIsMulti :: !Bool
        , pBody    :: !PIL_Stmts
        }
    deriving (Show, Eq, Ord, Typeable)

data PIL_Decl = PSub
    { pSubName      :: !SubName
    , pSubType      :: !SubType
    , pSubParams    :: ![TParam]
    , pSubLValue    :: !Bool
    , pSubIsMulti   :: !Bool
    , pSubBody      :: !PIL_Stmts
    }
    deriving (Show, Eq, Ord, Typeable)

data PIL_Literal = PVal { pVal :: Val }
    deriving (Show, Eq, Ord, Typeable)

data PIL_LValue = PVar { pVarName :: !VarName }
    | PApp 
        { pCxt  :: !TCxt
        , pFun  :: !PIL_Expr
        , pInv  :: !(Maybe PIL_Expr)
        , pArgs :: ![PIL_Expr]
        }
    | PAssign
        { pLHS  :: ![PIL_LValue]
        , pRHS  :: !PIL_Expr
        }
    | PBind
        { pLHS  :: ![PIL_LValue]
        , pRHS  :: !PIL_Expr
        }
    deriving (Show, Eq, Ord, Typeable)

data TParam = MkTParam
    { tpParam   :: !Param
    , tpDefault :: !(Maybe (PIL_Expr))
    }
    deriving (Show, Eq, Ord, Typeable)

data TCxt
    = TCxtVoid | TCxtLValue !Type | TCxtItem !Type | TCxtSlurpy !Type
    | TTailCall !TCxt
    deriving (Show, Eq, Ord, Typeable)

data TEnv = MkTEnv
    { tLexDepth :: !Int                 -- ^ Lexical scope depth
    , tTokDepth :: !Int                 -- ^ Exp nesting depth
    , tCxt      :: !TCxt                -- ^ Current context
    , tReg      :: !(TVar (Int, String))-- ^ Register name supply
    , tLabel    :: !(TVar Int)          -- ^ Label name supply
    }
    deriving (Show, Eq, Ord, Typeable)

------------------------------------------------------------------------

instance Binary Exp where
    put_ _ _ = return ()
    get  _   = return Noop
instance Perl5 Exp where
    showPerl5 _ = "(undef)"
instance JSON Exp where
    showJSON _ = "null"

-- Non-canonical serialization... needs work
instance (Show (TVar a)) => Perl5 (TVar a) where
    showPerl5 _ = "(warn '<ref>')"
instance (Show (TVar a)) => JSON (TVar a) where
    showJSON _ = "null"

{-* Generated by DrIFT : Look, but Don't Touch. *-}
instance Binary PIL_Environment where
    put_ bh (PIL_Environment aa ab) = do
	    put_ bh aa
	    put_ bh ab
    get bh = do
    aa <- get bh
    ab <- get bh
    return (PIL_Environment aa ab)

instance Perl5 PIL_Environment where
    showPerl5 (PIL_Environment aa ab) =
	      showP5HashObj "PIL::Environment"
	      [("pilGlob", showPerl5 aa) , ("pilMain", showPerl5 ab)]

instance JSON PIL_Environment where
    showJSON (PIL_Environment aa ab) = showJSHashObj "PIL_Environment"
	     [("pilGlob", showJSON aa) , ("pilMain", showJSON ab)]

instance Binary PIL_Stmts where
    put_ bh PNil = do
	    putByte bh 0
    put_ bh (PStmts aa ab) = do
	    putByte bh 1
	    put_ bh aa
	    put_ bh ab
    put_ bh (PPad ac ad ae) = do
	    putByte bh 2
	    put_ bh ac
	    put_ bh ad
	    put_ bh ae
    get bh = do
	    h <- getByte bh
	    case h of
	      0 -> do
		    return PNil
	      1 -> do
		    aa <- get bh
		    ab <- get bh
		    return (PStmts aa ab)
	      2 -> do
		    ac <- get bh
		    ad <- get bh
		    ae <- get bh
		    return (PPad ac ad ae)
	      _ -> fail "invalid binary data found"

instance Perl5 PIL_Stmts where
    showPerl5 (PNil) = showP5Class "PNil"
    showPerl5 (PStmts aa ab) = showP5HashObj "PStmts"
	      [("pStmt", showPerl5 aa) , ("pStmts", showPerl5 ab)]
    showPerl5 (PPad aa ab ac) = showP5HashObj "PPad"
	      [("pScope", showPerl5 aa) , ("pSyms", showPerl5 ab) ,
	       ("pStmts", showPerl5 ac)]

instance JSON PIL_Stmts where
    showJSON (PNil) = showJSScalar "PNil"
    showJSON (PStmts aa ab) = showJSHashObj "PStmts"
	     [("pStmt", showJSON aa) , ("pStmts", showJSON ab)]
    showJSON (PPad aa ab ac) = showJSHashObj "PPad"
	     [("pScope", showJSON aa) , ("pSyms", showJSON ab) ,
	      ("pStmts", showJSON ac)]

instance Binary PIL_Stmt where
    put_ bh PNoop = do
	    putByte bh 0
    put_ bh (PStmt aa) = do
	    putByte bh 1
	    put_ bh aa
    put_ bh (PPos ab ac ad) = do
	    putByte bh 2
	    put_ bh ab
	    put_ bh ac
	    put_ bh ad
    get bh = do
	    h <- getByte bh
	    case h of
	      0 -> do
		    return PNoop
	      1 -> do
		    aa <- get bh
		    return (PStmt aa)
	      2 -> do
		    ab <- get bh
		    ac <- get bh
		    ad <- get bh
		    return (PPos ab ac ad)
	      _ -> fail "invalid binary data found"

instance Perl5 PIL_Stmt where
    showPerl5 (PNoop) = showP5Class "PNoop"
    showPerl5 (PStmt aa) = showP5HashObj "PStmt"
	      [("pExpr", showPerl5 aa)]
    showPerl5 (PPos aa ab ac) = showP5HashObj "PPos"
	      [("pPos", showPerl5 aa) , ("pExp", showPerl5 ab) ,
	       ("pNode", showPerl5 ac)]

instance JSON PIL_Stmt where
    showJSON (PNoop) = showJSScalar "PNoop"
    showJSON (PStmt aa) = showJSHashObj "PStmt"
	     [("pExpr", showJSON aa)]
    showJSON (PPos aa ab ac) = showJSHashObj "PPos"
	     [("pPos", showJSON aa) , ("pExp", showJSON ab) ,
	      ("pNode", showJSON ac)]

instance Binary PIL_Expr where
    put_ bh (PRawName aa) = do
	    putByte bh 0
	    put_ bh aa
    put_ bh (PExp ab) = do
	    putByte bh 1
	    put_ bh ab
    put_ bh (PLit ac) = do
	    putByte bh 2
	    put_ bh ac
    put_ bh (PThunk ad) = do
	    putByte bh 3
	    put_ bh ad
    put_ bh (PCode ae af ag ah ai) = do
	    putByte bh 4
	    put_ bh ae
	    put_ bh af
	    put_ bh ag
	    put_ bh ah
	    put_ bh ai
    get bh = do
	    h <- getByte bh
	    case h of
	      0 -> do
		    aa <- get bh
		    return (PRawName aa)
	      1 -> do
		    ab <- get bh
		    return (PExp ab)
	      2 -> do
		    ac <- get bh
		    return (PLit ac)
	      3 -> do
		    ad <- get bh
		    return (PThunk ad)
	      4 -> do
		    ae <- get bh
		    af <- get bh
		    ag <- get bh
		    ah <- get bh
		    ai <- get bh
		    return (PCode ae af ag ah ai)
	      _ -> fail "invalid binary data found"

instance Perl5 PIL_Expr where
    showPerl5 (PRawName aa) = showP5HashObj "PRawName"
	      [("pRawName", showPerl5 aa)]
    showPerl5 (PExp aa) = showP5HashObj "PExp" [("pLV", showPerl5 aa)]
    showPerl5 (PLit aa) = showP5HashObj "PLit" [("pLit", showPerl5 aa)]
    showPerl5 (PThunk aa) = showP5HashObj "PThunk"
	      [("pThunk", showPerl5 aa)]
    showPerl5 (PCode aa ab ac ad ae) = showP5HashObj "PCode"
	      [("pType", showPerl5 aa) , ("pParams", showPerl5 ab) ,
	       ("pLValue", showPerl5 ac) , ("pIsMulti", showPerl5 ad) ,
	       ("pBody", showPerl5 ae)]

instance JSON PIL_Expr where
    showJSON (PRawName aa) = showJSHashObj "PRawName"
	     [("pRawName", showJSON aa)]
    showJSON (PExp aa) = showJSHashObj "PExp" [("pLV", showJSON aa)]
    showJSON (PLit aa) = showJSHashObj "PLit" [("pLit", showJSON aa)]
    showJSON (PThunk aa) = showJSHashObj "PThunk"
	     [("pThunk", showJSON aa)]
    showJSON (PCode aa ab ac ad ae) = showJSHashObj "PCode"
	     [("pType", showJSON aa) , ("pParams", showJSON ab) ,
	      ("pLValue", showJSON ac) , ("pIsMulti", showJSON ad) ,
	      ("pBody", showJSON ae)]

instance Binary PIL_Decl where
    put_ bh (PSub aa ab ac ad ae af) = do
	    put_ bh aa
	    put_ bh ab
	    put_ bh ac
	    put_ bh ad
	    put_ bh ae
	    put_ bh af
    get bh = do
    aa <- get bh
    ab <- get bh
    ac <- get bh
    ad <- get bh
    ae <- get bh
    af <- get bh
    return (PSub aa ab ac ad ae af)

instance Perl5 PIL_Decl where
    showPerl5 (PSub aa ab ac ad ae af) = showP5HashObj "PSub"
	      [("pSubName", showPerl5 aa) , ("pSubType", showPerl5 ab) ,
	       ("pSubParams", showPerl5 ac) , ("pSubLValue", showPerl5 ad) ,
	       ("pSubIsMulti", showPerl5 ae) , ("pSubBody", showPerl5 af)]

instance JSON PIL_Decl where
    showJSON (PSub aa ab ac ad ae af) = showJSHashObj "PSub"
	     [("pSubName", showJSON aa) , ("pSubType", showJSON ab) ,
	      ("pSubParams", showJSON ac) , ("pSubLValue", showJSON ad) ,
	      ("pSubIsMulti", showJSON ae) , ("pSubBody", showJSON af)]

instance Binary PIL_Literal where
    put_ bh (PVal aa) = do
	    put_ bh aa
    get bh = do
    aa <- get bh
    return (PVal aa)

instance Perl5 PIL_Literal where
    showPerl5 (PVal aa) = showP5HashObj "PVal" [("pVal", showPerl5 aa)]

instance JSON PIL_Literal where
    showJSON (PVal aa) = showJSHashObj "PVal" [("pVal", showJSON aa)]

instance Binary PIL_LValue where
    put_ bh (PVar aa) = do
	    putByte bh 0
	    put_ bh aa
    put_ bh (PApp ab ac ad ae) = do
	    putByte bh 1
	    put_ bh ab
	    put_ bh ac
	    put_ bh ad
	    put_ bh ae
    put_ bh (PAssign af ag) = do
	    putByte bh 2
	    put_ bh af
	    put_ bh ag
    put_ bh (PBind ah ai) = do
	    putByte bh 3
	    put_ bh ah
	    put_ bh ai
    get bh = do
	    h <- getByte bh
	    case h of
	      0 -> do
		    aa <- get bh
		    return (PVar aa)
	      1 -> do
		    ab <- get bh
		    ac <- get bh
		    ad <- get bh
		    ae <- get bh
		    return (PApp ab ac ad ae)
	      2 -> do
		    af <- get bh
		    ag <- get bh
		    return (PAssign af ag)
	      3 -> do
		    ah <- get bh
		    ai <- get bh
		    return (PBind ah ai)
	      _ -> fail "invalid binary data found"

instance Perl5 PIL_LValue where
    showPerl5 (PVar aa) = showP5HashObj "PVar"
	      [("pVarName", showPerl5 aa)]
    showPerl5 (PApp aa ab ac ad) = showP5HashObj "PApp"
	      [("pCxt", showPerl5 aa) , ("pFun", showPerl5 ab) ,
	       ("pInv", showPerl5 ac) , ("pArgs", showPerl5 ad)]
    showPerl5 (PAssign aa ab) = showP5HashObj "PAssign"
	      [("pLHS", showPerl5 aa) , ("pRHS", showPerl5 ab)]
    showPerl5 (PBind aa ab) = showP5HashObj "PBind"
	      [("pLHS", showPerl5 aa) , ("pRHS", showPerl5 ab)]

instance JSON PIL_LValue where
    showJSON (PVar aa) = showJSHashObj "PVar"
	     [("pVarName", showJSON aa)]
    showJSON (PApp aa ab ac ad) = showJSHashObj "PApp"
	     [("pCxt", showJSON aa) , ("pFun", showJSON ab) ,
	      ("pInv", showJSON ac) , ("pArgs", showJSON ad)]
    showJSON (PAssign aa ab) = showJSHashObj "PAssign"
	     [("pLHS", showJSON aa) , ("pRHS", showJSON ab)]
    showJSON (PBind aa ab) = showJSHashObj "PBind"
	     [("pLHS", showJSON aa) , ("pRHS", showJSON ab)]

instance Binary TParam where
    put_ bh (MkTParam aa ab) = do
	    put_ bh aa
	    put_ bh ab
    get bh = do
    aa <- get bh
    ab <- get bh
    return (MkTParam aa ab)

instance Perl5 TParam where
    showPerl5 (MkTParam aa ab) = showP5HashObj "MkTParam"
	      [("tpParam", showPerl5 aa) , ("tpDefault", showPerl5 ab)]

instance JSON TParam where
    showJSON (MkTParam aa ab) = showJSHashObj "MkTParam"
	     [("tpParam", showJSON aa) , ("tpDefault", showJSON ab)]

instance Binary TCxt where
    put_ bh TCxtVoid = do
	    putByte bh 0
    put_ bh (TCxtLValue aa) = do
	    putByte bh 1
	    put_ bh aa
    put_ bh (TCxtItem ab) = do
	    putByte bh 2
	    put_ bh ab
    put_ bh (TCxtSlurpy ac) = do
	    putByte bh 3
	    put_ bh ac
    put_ bh (TTailCall ad) = do
	    putByte bh 4
	    put_ bh ad
    get bh = do
	    h <- getByte bh
	    case h of
	      0 -> do
		    return TCxtVoid
	      1 -> do
		    aa <- get bh
		    return (TCxtLValue aa)
	      2 -> do
		    ab <- get bh
		    return (TCxtItem ab)
	      3 -> do
		    ac <- get bh
		    return (TCxtSlurpy ac)
	      4 -> do
		    ad <- get bh
		    return (TTailCall ad)
	      _ -> fail "invalid binary data found"

instance Perl5 TCxt where
    showPerl5 (TCxtVoid) = showP5Class "TCxtVoid"
    showPerl5 (TCxtLValue aa) = showP5ArrayObj "TCxtLValue"
	      [showPerl5 aa]
    showPerl5 (TCxtItem aa) = showP5ArrayObj "TCxtItem" [showPerl5 aa]
    showPerl5 (TCxtSlurpy aa) = showP5ArrayObj "TCxtSlurpy"
	      [showPerl5 aa]
    showPerl5 (TTailCall aa) = showP5ArrayObj "TTailCall"
	      [showPerl5 aa]

instance JSON TCxt where
    showJSON (TCxtVoid) = showJSScalar "TCxtVoid"
    showJSON (TCxtLValue aa) = showJSArrayObj "TCxtLValue"
	     [showJSON aa]
    showJSON (TCxtItem aa) = showJSArrayObj "TCxtItem" [showJSON aa]
    showJSON (TCxtSlurpy aa) = showJSArrayObj "TCxtSlurpy"
	     [showJSON aa]
    showJSON (TTailCall aa) = showJSArrayObj "TTailCall" [showJSON aa]

instance Binary TEnv where
    put_ bh (MkTEnv aa ab ac ad ae) = do
	    put_ bh aa
	    put_ bh ab
	    put_ bh ac
	    put_ bh ad
	    put_ bh ae
    get bh = do
    aa <- get bh
    ab <- get bh
    ac <- get bh
    ad <- get bh
    ae <- get bh
    return (MkTEnv aa ab ac ad ae)

instance Perl5 TEnv where
    showPerl5 (MkTEnv aa ab ac ad ae) = showP5HashObj "MkTEnv"
	      [("tLexDepth", showPerl5 aa) , ("tTokDepth", showPerl5 ab) ,
	       ("tCxt", showPerl5 ac) , ("tReg", showPerl5 ad) ,
	       ("tLabel", showPerl5 ae)]

instance JSON TEnv where
    showJSON (MkTEnv aa ab ac ad ae) = showJSHashObj "MkTEnv"
	     [("tLexDepth", showJSON aa) , ("tTokDepth", showJSON ab) ,
	      ("tCxt", showJSON ac) , ("tReg", showJSON ad) ,
	      ("tLabel", showJSON ae)]

instance Binary Scope where
    put_ bh SState = do
	    putByte bh 0
    put_ bh SMy = do
	    putByte bh 1
    put_ bh SOur = do
	    putByte bh 2
    put_ bh SLet = do
	    putByte bh 3
    put_ bh STemp = do
	    putByte bh 4
    put_ bh SGlobal = do
	    putByte bh 5
    get bh = do
	    h <- getByte bh
	    case h of
	      0 -> do
		    return SState
	      1 -> do
		    return SMy
	      2 -> do
		    return SOur
	      3 -> do
		    return SLet
	      4 -> do
		    return STemp
	      5 -> do
		    return SGlobal
	      _ -> fail "invalid binary data found"

instance Perl5 Scope where
    showPerl5 (SState) = showP5Class "SState"
    showPerl5 (SMy) = showP5Class "SMy"
    showPerl5 (SOur) = showP5Class "SOur"
    showPerl5 (SLet) = showP5Class "SLet"
    showPerl5 (STemp) = showP5Class "STemp"
    showPerl5 (SGlobal) = showP5Class "SGlobal"

instance JSON Scope where
    showJSON (SState) = showJSScalar "SState"
    showJSON (SMy) = showJSScalar "SMy"
    showJSON (SOur) = showJSScalar "SOur"
    showJSON (SLet) = showJSScalar "SLet"
    showJSON (STemp) = showJSScalar "STemp"
    showJSON (SGlobal) = showJSScalar "SGlobal"

instance Binary SubType where
    put_ bh SubMethod = do
	    putByte bh 0
    put_ bh SubCoroutine = do
	    putByte bh 1
    put_ bh SubMacro = do
	    putByte bh 2
    put_ bh SubRoutine = do
	    putByte bh 3
    put_ bh SubBlock = do
	    putByte bh 4
    put_ bh SubPointy = do
	    putByte bh 5
    put_ bh SubPrim = do
	    putByte bh 6
    get bh = do
	    h <- getByte bh
	    case h of
	      0 -> do
		    return SubMethod
	      1 -> do
		    return SubCoroutine
	      2 -> do
		    return SubMacro
	      3 -> do
		    return SubRoutine
	      4 -> do
		    return SubBlock
	      5 -> do
		    return SubPointy
	      6 -> do
		    return SubPrim
	      _ -> fail "invalid binary data found"

instance Perl5 SubType where
    showPerl5 (SubMethod) = showP5Class "SubMethod"
    showPerl5 (SubCoroutine) = showP5Class "SubCoroutine"
    showPerl5 (SubMacro) = showP5Class "SubMacro"
    showPerl5 (SubRoutine) = showP5Class "SubRoutine"
    showPerl5 (SubBlock) = showP5Class "SubBlock"
    showPerl5 (SubPointy) = showP5Class "SubPointy"
    showPerl5 (SubPrim) = showP5Class "SubPrim"

instance JSON SubType where
    showJSON (SubMethod) = showJSScalar "SubMethod"
    showJSON (SubCoroutine) = showJSScalar "SubCoroutine"
    showJSON (SubMacro) = showJSScalar "SubMacro"
    showJSON (SubRoutine) = showJSScalar "SubRoutine"
    showJSON (SubBlock) = showJSScalar "SubBlock"
    showJSON (SubPointy) = showJSScalar "SubPointy"
    showJSON (SubPrim) = showJSScalar "SubPrim"

instance Binary Val where
    put_ bh VUndef = do
	    putByte bh 0
    put_ bh (VBool aa) = do
	    putByte bh 1
	    put_ bh aa
    put_ bh (VInt ab) = do
	    putByte bh 2
	    put_ bh ab
    put_ bh (VRat ac) = do
	    putByte bh 3
	    put_ bh ac
    put_ bh (VNum ad) = do
	    putByte bh 4
	    put_ bh ad
    put_ bh (VStr ae) = do
	    putByte bh 5
	    put_ bh ae
    put_ bh (VList af) = do
	    putByte bh 6
	    put_ bh af
    put_ bh (VType ag) = do
	    putByte bh 7
	    put_ bh ag
    get bh = do
	    h <- getByte bh
	    case h of
	      0 -> do
		    return VUndef
	      1 -> do
		    aa <- get bh
		    return (VBool aa)
	      2 -> do
		    ab <- get bh
		    return (VInt ab)
	      3 -> do
		    ac <- get bh
		    return (VRat ac)
	      4 -> do
		    ad <- get bh
		    return (VNum ad)
	      5 -> do
		    ae <- get bh
		    return (VStr ae)
	      6 -> do
		    af <- get bh
		    return (VList af)
	      7 -> do
		    ag <- get bh
		    return (VType ag)
	      _ -> fail "invalid binary data found"

instance Perl5 Val where
    showPerl5 (VUndef) = showP5Class "VUndef"
    showPerl5 (VBool aa) = showP5ArrayObj "VBool" [showPerl5 aa]
    showPerl5 (VInt aa) = showP5ArrayObj "VInt" [showPerl5 aa]
    showPerl5 (VRat aa) = showP5ArrayObj "VRat" [showPerl5 aa]
    showPerl5 (VNum aa) = showP5ArrayObj "VNum" [showPerl5 aa]
    showPerl5 (VStr aa) = showP5ArrayObj "VStr" [showPerl5 aa]
    showPerl5 (VList aa) = showP5ArrayObj "VList" [showPerl5 aa]
    showPerl5 (VType aa) = showP5ArrayObj "VType" [showPerl5 aa]

instance JSON Val where
    showJSON (VUndef) = showJSScalar "VUndef"
    showJSON (VBool aa) = showJSArrayObj "VBool" [showJSON aa]
    showJSON (VInt aa) = showJSArrayObj "VInt" [showJSON aa]
    showJSON (VRat aa) = showJSArrayObj "VRat" [showJSON aa]
    showJSON (VNum aa) = showJSArrayObj "VNum" [showJSON aa]
    showJSON (VStr aa) = showJSArrayObj "VStr" [showJSON aa]
    showJSON (VList aa) = showJSArrayObj "VList" [showJSON aa]
    showJSON (VType aa) = showJSArrayObj "VType" [showJSON aa]

instance Binary Cxt where
    put_ bh CxtVoid = do
	    putByte bh 0
    put_ bh (CxtItem aa) = do
	    putByte bh 1
	    put_ bh aa
    put_ bh (CxtSlurpy ab) = do
	    putByte bh 2
	    put_ bh ab
    get bh = do
	    h <- getByte bh
	    case h of
	      0 -> do
		    return CxtVoid
	      1 -> do
		    aa <- get bh
		    return (CxtItem aa)
	      2 -> do
		    ab <- get bh
		    return (CxtSlurpy ab)
	      _ -> fail "invalid binary data found"

instance Perl5 Cxt where
    showPerl5 (CxtVoid) = showP5Class "CxtVoid"
    showPerl5 (CxtItem aa) = showP5ArrayObj "CxtItem" [showPerl5 aa]
    showPerl5 (CxtSlurpy aa) = showP5ArrayObj "CxtSlurpy"
	      [showPerl5 aa]

instance JSON Cxt where
    showJSON (CxtVoid) = showJSScalar "CxtVoid"
    showJSON (CxtItem aa) = showJSArrayObj "CxtItem" [showJSON aa]
    showJSON (CxtSlurpy aa) = showJSArrayObj "CxtSlurpy" [showJSON aa]

instance Binary Type where
    put_ bh (MkType aa) = do
	    putByte bh 0
	    put_ bh aa
    put_ bh (TypeOr ab ac) = do
	    putByte bh 1
	    put_ bh ab
	    put_ bh ac
    put_ bh (TypeAnd ad ae) = do
	    putByte bh 2
	    put_ bh ad
	    put_ bh ae
    get bh = do
	    h <- getByte bh
	    case h of
	      0 -> do
		    aa <- get bh
		    return (MkType aa)
	      1 -> do
		    ab <- get bh
		    ac <- get bh
		    return (TypeOr ab ac)
	      2 -> do
		    ad <- get bh
		    ae <- get bh
		    return (TypeAnd ad ae)
	      _ -> fail "invalid binary data found"

instance Perl5 Type where
    showPerl5 (MkType aa) = showP5ArrayObj "MkType" [showPerl5 aa]
    showPerl5 (TypeOr aa ab) = showP5ArrayObj "TypeOr"
	      [showPerl5 aa , showPerl5 ab]
    showPerl5 (TypeAnd aa ab) = showP5ArrayObj "TypeAnd"
	      [showPerl5 aa , showPerl5 ab]

instance JSON Type where
    showJSON (MkType aa) = showJSArrayObj "MkType" [showJSON aa]
    showJSON (TypeOr aa ab) = showJSArrayObj "TypeOr"
	     [showJSON aa , showJSON ab]
    showJSON (TypeAnd aa ab) = showJSArrayObj "TypeAnd"
	     [showJSON aa , showJSON ab]

instance Binary Param where
    put_ bh (MkParam aa ab ac ad ae af ag ah ai) = do
	    put_ bh aa
	    put_ bh ab
	    put_ bh ac
	    put_ bh ad
	    put_ bh ae
	    put_ bh af
	    put_ bh ag
	    put_ bh ah
	    put_ bh ai
    get bh = do
    aa <- get bh
    ab <- get bh
    ac <- get bh
    ad <- get bh
    ae <- get bh
    af <- get bh
    ag <- get bh
    ah <- get bh
    ai <- get bh
    return (MkParam aa ab ac ad ae af ag ah ai)

instance Perl5 Param where
    showPerl5 (MkParam aa ab ac ad ae af ag ah ai) =
	      showP5HashObj "MkParam"
	      [("isInvocant", showPerl5 aa) , ("isOptional", showPerl5 ab) ,
	       ("isNamed", showPerl5 ac) , ("isLValue", showPerl5 ad) ,
	       ("isWritable", showPerl5 ae) , ("isLazy", showPerl5 af) ,
	       ("paramName", showPerl5 ag) , ("paramContext", showPerl5 ah) ,
	       ("paramDefault", showPerl5 ai)]

instance JSON Param where
    showJSON (MkParam aa ab ac ad ae af ag ah ai) =
	     showJSHashObj "MkParam"
	     [("isInvocant", showJSON aa) , ("isOptional", showJSON ab) ,
	      ("isNamed", showJSON ac) , ("isLValue", showJSON ad) ,
	      ("isWritable", showJSON ae) , ("isLazy", showJSON af) ,
	      ("paramName", showJSON ag) , ("paramContext", showJSON ah) ,
	      ("paramDefault", showJSON ai)]

instance Binary Pos where
    put_ bh (MkPos aa ab ac ad ae) = do
	    put_ bh aa
	    put_ bh ab
	    put_ bh ac
	    put_ bh ad
	    put_ bh ae
    get bh = do
    aa <- get bh
    ab <- get bh
    ac <- get bh
    ad <- get bh
    ae <- get bh
    return (MkPos aa ab ac ad ae)

instance Perl5 Pos where
    showPerl5 (MkPos aa ab ac ad ae) = showP5HashObj "MkPos"
	      [("posName", showPerl5 aa) , ("posBeginLine", showPerl5 ab) ,
	       ("posBeginColumn", showPerl5 ac) , ("posEndLine", showPerl5 ad) ,
	       ("posEndColumn", showPerl5 ae)]

instance JSON Pos where
    showJSON (MkPos aa ab ac ad ae) = showJSHashObj "MkPos"
	     [("posName", showJSON aa) , ("posBeginLine", showJSON ab) ,
	      ("posBeginColumn", showJSON ac) , ("posEndLine", showJSON ad) ,
	      ("posEndColumn", showJSON ae)]

--  Imported from other files :-
