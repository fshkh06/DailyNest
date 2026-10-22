import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Product } from '../types/product';
import { storage } from '../services/storage';
import { ALL_PRODUCTS } from '../data/products';

interface RecentlyViewedContextType {
  recentIds: string[];
  recentProducts: Product[];
  addRecentlyViewed: (productId: string) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const MAX_RECENT_ITEMS = 12;

export const RecentlyViewedProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [recentIds, setRecentIds] = useState<string[]>(() => storage.get<string[]>('recently_viewed', []));

  useEffect(() => {
    storage.set('recently_viewed', recentIds);
  }, [recentIds]);

  const addRecentlyViewed = (productId: string) => {
    setRecentIds(prev => {
      const filtered = prev.filter(id => id !== productId);
      return [productId, ...filtered].slice(0, MAX_RECENT_ITEMS);
    });
  };

  const clearRecentlyViewed = () => {
    setRecentIds([]);
    storage.remove('recently_viewed');
  };

  const recentProducts = useMemo(() => {
    return recentIds
      .map(id => ALL_PRODUCTS.find(p => p.id === id))
      .filter((p): p is Product => Boolean(p));
  }, [recentIds]);

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentIds,
        recentProducts,
        addRecentlyViewed,
        clearRecentlyViewed
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export function useRecentlyViewed(): RecentlyViewedContextType {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
}
