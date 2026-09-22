import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export const WishlistContext = createContext(null);

const STORAGE_KEY = "velmora-wishlist";

function getInitialWishlist() {
  try {
    const savedWishlist =
      localStorage.getItem(STORAGE_KEY);

    if (!savedWishlist) {
      return [];
    }

    const parsedWishlist =
      JSON.parse(savedWishlist);

    return Array.isArray(parsedWishlist)
      ? parsedWishlist
      : [];
  } catch (error) {
    console.error(
      "Failed to load wishlist:",
      error
    );

    return [];
  }
}

export function WishlistProvider({
  children,
}) {
  const [items, setItems] = useState(
    getInitialWishlist
  );

  /* ==========================================
     SAVE TO LOCAL STORAGE
  ========================================== */

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items)
      );
    } catch (error) {
      console.error(
        "Failed to save wishlist:",
        error
      );
    }
  }, [items]);

  /* ==========================================
     ADD
  ========================================== */

  const addToWishlist = (product) => {
    if (!product) return;

    setItems((previous) => {
      const alreadyExists =
        previous.some(
          (item) =>
            String(item.id) ===
            String(product.id)
        );

      if (alreadyExists) {
        return previous;
      }

      return [
        ...previous,
        product,
      ];
    });
  };

  /* ==========================================
     REMOVE
  ========================================== */

  const removeFromWishlist = (id) => {
    setItems((previous) =>
      previous.filter(
        (item) =>
          String(item.id) !==
          String(id)
      )
    );
  };

  /* ==========================================
     TOGGLE
  ========================================== */

  const toggleWishlist = (product) => {
    if (!product) return;

    setItems((previous) => {
      const alreadyExists =
        previous.some(
          (item) =>
            String(item.id) ===
            String(product.id)
        );

      if (alreadyExists) {
        return previous.filter(
          (item) =>
            String(item.id) !==
            String(product.id)
        );
      }

      return [
        ...previous,
        product,
      ];
    });
  };

  /* ==========================================
     CHECK
  ========================================== */

  const isWishlisted = useCallback(
    (id) => {
      return items.some(
        (item) =>
          String(item.id) ===
          String(id)
      );
    },
    [items]
  );

  /* ==========================================
     CLEAR
  ========================================== */

  const clearWishlist = useCallback(() => {
    setItems([]);
  }, []);

  /* ==========================================
     COUNT
  ========================================== */

  const wishlistCount = useMemo(
    () => items.length,
    [items]
  );

  /* ==========================================
     CONTEXT VALUE
  ========================================== */

  const value = useMemo(
    () => ({
      items,
      wishlistCount,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      isWishlisted,
      clearWishlist,
    }),
    [
      items,
      wishlistCount,
      isWishlisted,
      clearWishlist,
    ]
  );

  return (
    <WishlistContext.Provider
      value={value}
    >
      {children}
    </WishlistContext.Provider>
  );
}