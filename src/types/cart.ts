import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  couponDiscount: number;
  appliedCoupon: Coupon | null;
  total: number;
  totalItems: number;
}
