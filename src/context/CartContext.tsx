import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Product } from '../types/product';
import { CartItem, Coupon, CartSummary } from '../types/cart';
import { storage } from '../services/storage';
import { validateCoupon } from '../data/coupons';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  summary: CartSummary;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  applyCouponCode: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_DELIVERY_THRESHOLD = 50.0;
const STANDARD_DELIVERY_FEE = 4.99;

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => storage.get<CartItem[]>('cart', []));
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => storage.get<Coupon | null>('coupon', null));
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);

  // Sync cart items to localStorage whenever changed
  useEffect(() => {
    storage.set('cart', items);
  }, [items]);

  // Sync applied coupon to localStorage
  useEffect(() => {
    if (appliedCoupon) {
      storage.set('coupon', appliedCoupon);
    } else {
      storage.remove('coupon');
    }
  }, [appliedCoupon]);

  const addToCart = (product: Product, quantity: number = 1, selectedColor?: string, selectedSize?: string) => {
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(i => i.product.id === product.id);
      if (existingIndex > -1) {
        const next = [...prevItems];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity
        };
        return next;
      }
      return [...prevItems, { product, quantity, selectedColor, selectedSize }];
    });
    setIsCartDrawerOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    storage.remove('cart');
    storage.remove('coupon');
  };

  const summary = useMemo<CartSummary>(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    // Calculate product original-price discount
    const productOriginalTotal = items.reduce((sum, item) => sum + item.product.originalPrice * item.quantity, 0);
    const catalogDiscount = Math.max(0, productOriginalTotal - subtotal);

    // Delivery fee: Free if empty or if subtotal >= threshold
    const deliveryFee = items.length === 0 ? 0 : subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;

    // Coupon calculation
    let couponDiscount = 0;
    if (appliedCoupon && subtotal >= appliedCoupon.minOrderValue) {
      const rawDiscount = (subtotal * appliedCoupon.discountPercentage) / 100;
      couponDiscount = appliedCoupon.maxDiscount ? Math.min(rawDiscount, appliedCoupon.maxDiscount) : rawDiscount;
    }

    const total = Math.max(0, subtotal - couponDiscount + deliveryFee);

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(catalogDiscount * 100) / 100,
      deliveryFee: Math.round(deliveryFee * 100) / 100,
      couponDiscount: Math.round(couponDiscount * 100) / 100,
      appliedCoupon,
      total: Math.round(total * 100) / 100,
      totalItems
    };
  }, [items, appliedCoupon]);

  const applyCouponCode = (code: string): { success: boolean; message: string } => {
    const res = validateCoupon(code, summary.subtotal);
    if (!res.isValid || !res.coupon) {
      return { success: false, message: res.error || 'Invalid coupon' };
    }
    setAppliedCoupon(res.coupon);
    return { success: true, message: `Coupon ${res.coupon.code} applied! ${res.coupon.discountPercentage}% OFF` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        summary,
        isCartDrawerOpen,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
        applyCouponCode,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
