import { Coupon } from '../types/cart';

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'WELCOME10',
    discountPercentage: 10,
    minOrderValue: 40,
    maxDiscount: 25,
    description: '10% OFF on your order above $40 (Up to $25)'
  },
  {
    code: 'SAVE15',
    discountPercentage: 15,
    minOrderValue: 75,
    maxDiscount: 50,
    description: '15% OFF on orders over $75 (Up to $50)'
  },
  {
    code: 'DAILY20',
    discountPercentage: 20,
    minOrderValue: 120,
    maxDiscount: 70,
    description: 'Special DailyNest 20% discount on orders above $120'
  },
  {
    code: 'FIRSTORDER',
    discountPercentage: 25,
    minOrderValue: 50,
    maxDiscount: 60,
    description: '25% OFF on your very first order above $50'
  }
];

export function validateCoupon(code: string, subtotal: number): { isValid: boolean; coupon?: Coupon; error?: string } {
  const normalized = code.trim().toUpperCase();
  const coupon = AVAILABLE_COUPONS.find(c => c.code === normalized);
  
  if (!coupon) {
    return { isValid: false, error: 'Invalid coupon code. Try WELCOME10 or SAVE15.' };
  }
  
  if (subtotal < coupon.minOrderValue) {
    return { 
      isValid: false, 
      coupon,
      error: `Add $${(coupon.minOrderValue - subtotal).toFixed(2)} more to apply ${coupon.code}. Minimum order is $${coupon.minOrderValue}.` 
    };
  }
  
  return { isValid: true, coupon };
}
