import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { CheckCircle, Package, ArrowRight, Truck, MapPin, CreditCard, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useOrder();
  const order = getOrderById(orderId || '');

  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch {
      // safe fallback
    }
  }, []);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#0F3427]">Order Not Found</h2>
        <p className="text-xs text-slate-500">The requested order could not be retrieved from local records.</p>
        <Link to="/orders" className="inline-block px-6 py-2.5 bg-[#0F3427] text-white rounded-xl text-xs font-bold">
          View All Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#F8FAF8]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-slide-up">
        {/* Celebration Header Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-emerald-950/5 shadow-card space-y-4">
          <div className="w-20 h-20 rounded-full bg-fresh-50 text-fresh-600 mx-auto flex items-center justify-center shadow-inner">
            <CheckCircle className="w-10 h-10 text-fresh-600 stroke-[2.5]" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-fresh-700 bg-fresh-50 px-3.5 py-1 rounded-full border border-fresh-200">
              Order Confirmed
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F3427] tracking-tight mt-3">
              Order placed successfully!
            </h1>
            <p className="text-sm font-mono font-bold text-[#144333] mt-2">
              Order ID: <span className="underline decoration-fresh-400">{order.id}</span>
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-2">
              A confirmation summary has been saved to your browser's local orders. Estimated delivery by{' '}
              <strong className="text-slate-800">{order.estimatedDeliveryDate}</strong>.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={`/orders?track=${order.id}`}
              className="px-6 py-3 bg-[#0F3427] hover:bg-[#144333] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <Package className="w-4 h-4 text-fresh-400" />
              <span>Track Live Delivery</span>
            </Link>
            <Link
              to="/"
              className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/5 shadow-subtle space-y-6">
          <h3 className="text-lg font-bold text-[#0F3427]">Order Details</h3>

          {/* Delivery & Payment Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-neutral-50/80 border border-slate-100 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#144333]" /> Shipping Address:
              </span>
              <p className="font-bold text-slate-800">{order.shippingAddress.fullName}</p>
              <p className="text-slate-600">{order.shippingAddress.houseFlat}, {order.shippingAddress.street}</p>
              <p className="text-slate-600">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</p>
            </div>

            <div className="space-y-1">
              <span className="font-bold text-slate-500 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#144333]" /> Payment Method:
              </span>
              <p className="font-bold text-slate-800 uppercase">{order.paymentMethod}</p>
              <span className="font-bold text-slate-500 flex items-center gap-1.5 mt-2">
                <Truck className="w-3.5 h-3.5 text-[#144333]" /> Delivery Status:
              </span>
              <p className="text-fresh-700 font-bold">{order.status}</p>
            </div>
          </div>

          {/* Items breakdown */}
          <div className="divide-y divide-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">
              Purchased Items ({order.items.length})
            </h4>
            {order.items.map(item => (
              <div key={item.product.id} className="pt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="text-xs font-bold text-slate-800 hover:text-[#0F3427] line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-[11px] text-slate-400">Qty: {item.quantity} &bull; {formatCurrency(item.product.price)} each</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#0F3427]">
                  {formatCurrency(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="pt-4 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold text-slate-800">{formatCurrency(order.subtotal)}</span>
            </div>
            {order.couponDiscount > 0 && (
              <div className="flex justify-between text-fresh-700 font-bold">
                <span>Coupon Discount:</span>
                <span>-{formatCurrency(order.couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery:</span>
              <span className="font-bold text-slate-800">
                {order.deliveryFee === 0 ? 'FREE' : formatCurrency(order.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-[#0F3427] pt-2 border-t border-slate-200">
              <span>Grand Total:</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
