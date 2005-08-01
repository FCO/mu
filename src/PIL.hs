{-# OPTIONS_GHC -fglasgow-exts -cpp #-}

module PIL where
import qualified Data.Map as Map
import PIL.Tie
import PIL.Internals
import Control.Concurrent.STM
import System.IO.Unsafe (unsafePerformIO)

type Pad = Map.Map Sym Container    -- Pad maps symbols to containers

data Sym = MkSym
    { sigil  :: Char
    , twigil :: Maybe Char
    , name   :: Name
    }
    deriving (Eq, Ord, Show)

newtype Name = MkName String
    deriving (Eq, Ord, Show)

data Container
    = Scalar (Cell Scalar)  -- Scalar container
    | Array (Cell Array)    -- Array container
    | Hash (Cell Hash)      -- Hash container

{-|
'Cell' is either mutable (rebindable) or immutable, decided at compile time.
-}
data Cell a
    = Mut (TVar (Box a)) -- Mutable cell
    | Con (Box a)        -- Constant cell

{-|
'Box' comes in two flavours: Nontieable ('NBox') and Tieable ('TBox').
Once chosen, there is no way in runtime to revert this decision.

A Non-tieable container is comprised of an @Id@ and a storage of that type, which
can only be @Scalar@, @Array@ or @Hash@.  Again, there is no way to cast a
Scalar container into a Hash container at runtime.

A Tieable container also contains an @Id@ and a storage, but also adds a
tie-table that intercepts various operations for its type.
-}
data Box a
    = NBox { boxId :: Id, boxVal :: a }
    | TBox { boxId :: Id, boxVal :: a, boxTied :: Tieable a }


{-|
'Id' is an unique integer, with infinite supply.
-} 
newtype Id = MkId Int
    deriving (Eq, Ord, Show, Num, Arbitrary)

{-|
The type of tie-table must agree with the storage type.  Such a table
may be empty, as denoted by the nullary constructor "Untied".  Each of
the three storage types comes with its own tie-table layout.
-}
#ifdef HADDOCK
data Tieable a = Untied | TieScalar TiedScalar | TieArray TiedArray | TieHash TiedHash
#else
data Tieable a where
    Untied     :: Tieable a
    TieScalar  :: TiedScalar -> Tieable Scalar
    TieArray   :: TiedArray  -> Tieable Array
    TieHash    :: TiedHash   -> Tieable Hash
#endif

{-# NOINLINE idSource #-}
idSource :: TMVar Int
idSource = unsafePerformIO $ atomically (newTMVar 0)

newId :: STM Id
newId = do
   val <- takeTMVar idSource
   let next = val+1
   putTMVar idSource next
   return (MkId next)

-- | Sample Container: @%\*ENV@ is constant is HashEnv
hashEnv :: STM Container
hashEnv = fmap (Hash . Mut) $ do
    newTVar (TBox (-1) emptyHash $ TieHash (tieHash emptyHash))

hashNew :: STM Container
hashNew = fmap (Hash . Mut) $ do
    i <- newId
    newTVar (NBox i emptyHash)

#ifdef ASD

-- | Bind container @x@ to @y@
bind :: Container   -- ^ The @$x@ in @$x := $y@
     -> Container   -- ^ The @$y@ in @$x := $y@
     -> STM ()
{-|
To bind a container to another, we first check to see if they are of the
same tieableness.  If so, we simply overwrite the target one's Id,
storage and tie-table (if any).
-}
bind (TCon x) (TCon y) = writeSTRef x =<< readSTRef y
bind (NCon x) (NCon y) = writeSTRef x =<< readSTRef y

{-|
To bind an non-tieable container to a tieable one, we implicitly remove
any current ties on the target, although it can be retied later:
-}
bind (TCon x) (NCon y) = do
    (id, val) <- readSTRef y
    writeSTRef x (id, val, Untied)
{-|
To bind a tieable container to a tied one, we first check if it is
actually tied.  If yes, we throw a runtime exception.  If not, we
proceed as if both were non-tieable.
-}
bind (NCon x) (TCon y) = do
    (id, val, tied) <- readSTRef y
    case tied of
        Untied -> writeSTRef x (id, val)
        _      -> fail "Cannot bind a tied container to a non-tieable one"

{-|
Compare two containers for Id equivalence.  If the container types differ, this
will never return True.
-}
(=:=) :: Cell a -> Cell b -> STM Bool
x =:= y = do
    x_id <- readId x
    y_id <- readId y
    return (x_id == y_id)

-- | Read the Id field from a container
readId :: Cell a -> STM Id
readId (NCon x) = fmap fst $ readSTRef x
readId (TCon x) = fmap (\(id, _, _) -> id) $ readSTRef x

-- | Untie a container
untie :: Cell a -> STM ()
-- | Untie an non-tieable container is a no-op:
untie (NCon x) = return ()
-- | For a tieable container, we first invokes the "UNTIE" handler, then set
--   its "tied" slot to Untied:
untie (TCon x) = do
    (id, val, tied) <- readSTRef x
    case tied of
        Untied  -> return ()
        _       -> do
            tied `invokeTie` UNTIE
            writeSTRef x (id, val, Untied)

-- | This should be fine: @untie(%ENV); %foo := %ENV@
testOk :: (%i::Id) => STM ()
testOk = do
    x <- hashNew
    y <- hashEnv
    untie y
    bind x y

-- | This should fail: @%foo := %ENV@
testFail :: (%i::Id) => STM ()
testFail = do
    x <- hashNew
    y <- hashEnv
    bind x y

testEquiv :: (%i::Id) => STM (Cell a) -> STM (Cell b) -> STM Bool
testEquiv x y = do
    x' <- x
    y' <- y
    (x' =:= y')

testBind :: (%i::Id) => STM (Cell a) -> STM (Cell a) -> STM ()
testBind x y = do
    x' <- x
    y' <- y
    bind x' y'

-- Extremely small language

data Exp
    = Bind LV Exp
    | Untie LV
    deriving (Show, Eq, Ord)

data LV
    = HashENV
    | HashNew
    deriving (Show, Eq, Ord)

type GenContainer a = STM (Cell a)

class Evalable a b | a -> b where
    eval :: (%i :: Id) => a -> STM (Cell b)

instance Evalable Exp Hash where
    eval (Untie x) = do
        x' <- eval x
        untie x'
        return x'

instance Evalable LV Hash where
    eval HashNew = hashNew
    eval HashENV = hashEnv

instance Arbitrary LV where
    arbitrary = oneof (map return [HashENV, HashNew])
    coarbitrary = assert False undefined

prop_untie :: LV -> Bool
prop_untie x = try_ok (Untie x)

try_ok :: Evalable a b => a -> Bool
try_ok x = runST f
    where
    f :: STM Bool
    f = do
        let %i = 0
        eval x
        return True

tests :: IO ()
tests = do
    let %i = 0
    putStrLn "==> Anything can be untied"
    test prop_untie
    putStrLn "==> %ENV =:= %ENV;"
    print $ runST (testEquiv hashEnv hashEnv)
    putStrLn "==> %ENV =:= %foo;"
    print $ runST (testEquiv hashEnv hashNew)
    putStrLn "==> %foo =:= %bar;"
    print $ runST (testEquiv hashNew hashNew)
    putStrLn "==> %foo := %bar;"
    print $ runST (testBind hashNew hashNew)
    putStrLn "==> %ENV := %ENV;"
    print $ runST (testBind hashEnv hashEnv)
    putStrLn "==> untie(%ENV); %foo := %ENV;"
    print $ runST (testBind hashNew $ do { env <- hashEnv; untie env; return env })
    putStrLn "==> %foo := %ENV;"
    print $ runST (testBind hashNew hashEnv)

#endif
