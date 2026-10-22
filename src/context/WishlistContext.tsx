import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../types/product';
import { storage } from '../services/storage';
import { ALL_PRODUCTS } from '../data/products';

interface WishlistContextType {
  wishlistIds: string[];
  wishlistProducts: Product[];
  toggleWishlist: (product: Product) => boolean; // returns true if added, false if removed
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => storage.get<string[]>('wishlist', []));

  useEffect(() => {
    storage.set('wishlist', wishlistIds);
  }, [wishlistIds]);

  const isInWishlist = (productId: string): boolean => {
    return wishlistIds.includes(productId);
  };

  const toggleWishlist = (product: Product): boolean => {
    let wasAdded = false;
    setWishlistIds(prev => {
      if (prev.includes(product.id)) {
        wasAdded = false;
        return prev.filter(id => id !== product.id);
      } else {
        wasAdded = true;
        return [...prev, product.id];
      }
    });
    return wasAdded;
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistIds(prev => prev.filter(id => id !== productId));
  };

  const clearWishlist = () => {
    setWishlistIds([]);
    storage.remove('wishlist');
  };

  const wishlistProducts = React.useMemo(() => {
    return ALL_PRODUCTS.filter(p => wishlistIds.includes(p.id));
  }, [wishlistIds]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistProducts,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        count: wishlistIds.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export function useWishlist(): WishlistContextType {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
