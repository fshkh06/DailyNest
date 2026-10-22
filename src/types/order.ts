import { CartItem } from './cart';
import { Address } from './address';

export type OrderStatus =
  | 'Order Placed'
  | 'Confirmed'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered';

export interface TrackingStep {
  status: OrderStatus;
  timestamp: string;
  completed: boolean;
  current: boolean;
  description: string;
}

export type PaymentMethod = 'cod' | 'upi' | 'card';

export interface Order {
  id: string; // e.g. DN-2026-XXXXX
  userId?: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  couponDiscount: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  estimatedDeliveryDate: string;
  trackingHistory: TrackingStep[];
}
