import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Order, OrderStatus, PaymentMethod, TrackingStep } from '../types/order';
import { Address } from '../types/address';
import { CartItem } from '../types/cart';
import { storage } from '../services/storage';
import { getEstimatedDeliveryDate } from '../utils/formatters';

interface CreateOrderParams {
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  couponDiscount: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  userId?: string;
}

interface OrderContextType {
  orders: Order[];
  addresses: Address[];
  selectedAddress: Address | null;
  setSelectedAddress: (addr: Address | null) => void;
  addAddress: (address: Omit<Address, 'id'>) => Address;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  createOrder: (params: CreateOrderParams) => Order;
  getOrderById: (orderId: string) => Order | undefined;
  advanceOrderStatus: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    fullName: 'Alex Johnson',
    mobileNumber: '+1 (555) 349-8291',
    houseFlat: 'Apt 4B, Pinecrest Residences',
    street: '742 Evergreen Terrace',
    area: 'Downtown Financial District',
    city: 'Seattle',
    state: 'WA',
    postalCode: '98101',
    country: 'United States',
    addressType: 'Home',
    isDefault: true
  },
  {
    id: 'addr-2',
    fullName: 'Alex Johnson',
    mobileNumber: '+1 (555) 349-8291',
    houseFlat: 'Suite 800, Innovation Tower',
    street: '1200 4th Avenue',
    area: 'Belltown',
    city: 'Seattle',
    state: 'WA',
    postalCode: '98121',
    country: 'United States',
    addressType: 'Work',
    isDefault: false
  }
];

const TRACKING_STEPS_FLOW: { status: OrderStatus; description: string }[] = [
  { status: 'Order Placed', description: 'Your order has been recorded in our dispatch center.' },
  { status: 'Confirmed', description: 'Order verified and items allocated from the DailyNest warehouse.' },
  { status: 'Packed', description: 'Carefully packaged using recyclable eco-friendly protection.' },
  { status: 'Shipped', description: 'Handed over to our courier partner with real-time transit telemetry.' },
  { status: 'Out for Delivery', description: 'Courier agent is currently en-route to your designated address.' },
  { status: 'Delivered', description: 'Package successfully delivered and received at your doorstep.' }
];

function generateTrackingHistory(initialStatus: OrderStatus): TrackingStep[] {
  const currentIndex = TRACKING_STEPS_FLOW.findIndex(s => s.status === initialStatus);
  const now = new Date();

  return TRACKING_STEPS_FLOW.map((step, idx) => {
    const isCompleted = idx <= currentIndex;
    const isCurrent = idx === currentIndex;
    const timeOffset = (idx - currentIndex) * 4; // simulated hours
    const stepTime = new Date(now.getTime() + timeOffset * 3600 * 1000);

    return {
      status: step.status,
      timestamp: isCompleted ? stepTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }) : 'Pending',
      completed: isCompleted,
      current: isCurrent,
      description: step.description
    };
  });
}

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => storage.get<Order[]>('orders', []));
  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = storage.get<Address[]>('addresses', []);
    return saved.length > 0 ? saved : DEFAULT_ADDRESSES;
  });
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(() => {
    return addresses.find(a => a.isDefault) || addresses[0] || null;
  });

  useEffect(() => {
    storage.set('orders', orders);
  }, [orders]);

  useEffect(() => {
    storage.set('addresses', addresses);
  }, [addresses]);

  const addAddress = (addrData: Omit<Address, 'id'>): Address => {
    const newAddress: Address = {
      ...addrData,
      id: `addr-${Date.now()}`
    };

    setAddresses(prev => {
      let updated = [...prev];
      if (newAddress.isDefault || prev.length === 0) {
        updated = updated.map(a => ({ ...a, isDefault: false }));
        newAddress.isDefault = true;
      }
      return [...updated, newAddress];
    });

    if (newAddress.isDefault || !selectedAddress) {
      setSelectedAddress(newAddress);
    }
    return newAddress;
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    setAddresses(prev => {
      let updated = prev.map(a => (a.id === id ? { ...a, ...updates } : a));
      if (updates.isDefault) {
        updated = updated.map(a => (a.id === id ? a : { ...a, isDefault: false }));
      }
      return updated;
    });

    if (selectedAddress?.id === id) {
      setSelectedAddress(prev => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => {
      const remaining = prev.filter(a => a.id !== id);
      if (selectedAddress?.id === id) {
        setSelectedAddress(remaining[0] || null);
      }
      return remaining;
    });
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev =>
      prev.map(a => ({
        ...a,
        isDefault: a.id === id
      }))
    );
    const target = addresses.find(a => a.id === id);
    if (target) setSelectedAddress(target);
  };

  const createOrder = (params: CreateOrderParams): Order => {
    // Generate order ID format: DN-2026-XXXXX
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `DN-2026-${randomSuffix}`;

    const newOrder: Order = {
      id: orderId,
      userId: params.userId,
      items: params.items,
      subtotal: params.subtotal,
      discount: params.discount,
      deliveryFee: params.deliveryFee,
      couponDiscount: params.couponDiscount,
      total: params.total,
      shippingAddress: params.shippingAddress,
      paymentMethod: params.paymentMethod,
      status: 'Order Placed',
      createdAt: new Date().toISOString(),
      estimatedDeliveryDate: getEstimatedDeliveryDate(3),
      trackingHistory: generateTrackingHistory('Order Placed')
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(o => o.id.toLowerCase() === orderId.toLowerCase());
  };

  const advanceOrderStatus = (orderId: string): Order | undefined => {
    let updatedOrder: Order | undefined;

    setOrders(prev => {
      return prev.map(o => {
        if (o.id.toLowerCase() !== orderId.toLowerCase()) return o;

        const currentIndex = TRACKING_STEPS_FLOW.findIndex(s => s.status === o.status);
        if (currentIndex < TRACKING_STEPS_FLOW.length - 1) {
          const nextStatus = TRACKING_STEPS_FLOW[currentIndex + 1].status;
          updatedOrder = {
            ...o,
            status: nextStatus,
            trackingHistory: generateTrackingHistory(nextStatus)
          };
          return updatedOrder;
        }
        updatedOrder = o;
        return o;
      });
    });

    return updatedOrder;
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addresses,
        selectedAddress,
        setSelectedAddress,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        createOrder,
        getOrderById,
        advanceOrderStatus
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export function useOrder(): OrderContextType {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
