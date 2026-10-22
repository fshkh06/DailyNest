import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { AVAILABLE_COUPONS } from '../data/coupons';
import { formatCurrency } from '../utils/formatters';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  Truck,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    summary,
    applyCouponCode,
    removeCoupon
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const { success, error } = useToast();
  const navigate = useNavigate();

  const freeDeliveryThreshold = 50.0;
  const progressPercent = Math.min(100, (summary.subtotal / freeDeliveryThreshold) * 100);
  const amountNeeded = Math.max(0, freeDeliveryThreshold - summary.subtotal);

  const handleApply = (codeToApply?: string) => {
    const code = codeToApply || couponCode;
    if (!code.trim()) return;
    const res = applyCouponCode(code);
    if (res.success) {
      success(res.message);
      setCouponCode('');
    } else {
      error(res.message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 bg-[#F8FAF8]">
        <div className="max-w-xl mx-auto px-4 text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-emerald-50 text-[#144333] mx-auto flex items-center justify-center">
            <ShoppingBag className="w-12 h-12" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-[#0F3427]">Your Shopping Cart is Empty</h1>
            <p className="text-sm text-slate-500 mt-2">
              Looks like you haven't added anything to your cart yet. Explore our 1,500+ curated products!
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0F3427] hover:bg-[#144333] text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <span>Explore DailyNest Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-[#F8FAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0F3427] tracking-tight">
              Shopping Cart
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {summary.totalItems} items in your basket
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Cart</span>
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200/80">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
            <span className="flex items-center gap-2 text-[#0F3427]">
              <Truck className="w-4 h-4 text-fresh-600" />
              {amountNeeded > 0
                ? `Add ${formatCurrency(amountNeeded)} more for FREE expedited delivery!`
                : 'Congratulations! You unlocked FREE expedited delivery!'}
            </span>
            <span className="font-bold text-[#144333]">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-fresh-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/5 shadow-subtle divide-y divide-slate-100 space-y-6">
            {items.map(item => (
              <div
                key={item.product.id}
                className="pt-6 first:pt-0 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-slate-200/60">
                    <ImageWithFallback
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-[#144333] uppercase tracking-wider">
                      {item.product.brand}
                    </span>
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="text-sm font-bold text-slate-800 hover:text-[#0F3427] block truncate transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {item.selectedColor || 'Standard Natural'} &bull; {item.product.deliveryInfo}
                    </p>
                    <p className="text-xs font-bold text-[#0F3427] sm:hidden mt-1">
                      {formatCurrency(item.product.price)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-neutral-50 shadow-sm">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-l-xl transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-800">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-r-xl transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[80px]">
                    <span className="text-sm font-bold text-[#0F3427]">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary & Coupon Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/5 shadow-subtle space-y-6">
              <h3 className="text-lg font-bold text-[#0F3427]">Order Summary</h3>

              {/* Coupon Section */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">Promo Code</label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      placeholder="e.g. WELCOME10"
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-neutral-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F3427] font-semibold uppercase"
                    />
                  </div>
                  <button
                    onClick={() => handleApply()}
                    className="px-4 py-2.5 bg-[#0F3427] text-white rounded-xl text-xs font-bold hover:bg-[#144333]"
                  >
                    Apply
                  </button>
                </div>

                {summary.appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-fresh-50 border border-fresh-200 text-xs text-fresh-800 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-fresh-600" />
                      {summary.appliedCoupon.code} applied ({summary.appliedCoupon.discountPercentage}% off)
                    </span>
                    <button onClick={removeCoupon} className="text-slate-400 hover:text-rose-600 text-[11px] underline">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="pt-1">
                    <span className="text-[11px] text-slate-400 font-medium block mb-1.5">Available coupons:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {AVAILABLE_COUPONS.map(c => (
                        <button
                          key={c.code}
                          onClick={() => handleApply(c.code)}
                          className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-emerald-50 text-[11px] font-mono font-bold text-[#144333] border border-slate-200 transition-colors"
                        >
                          {c.code}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Calculation Breakdown */}
              <div className="divide-y divide-slate-100 text-xs space-y-2.5 pt-2">
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(summary.subtotal)}</span>
                </div>
                {summary.couponDiscount > 0 && (
                  <div className="flex justify-between pt-2 text-fresh-700 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-{formatCurrency(summary.couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2">
                  <span className="text-slate-500">Expedited Delivery</span>
                  <span className="font-semibold text-slate-800">
                    {summary.deliveryFee === 0 ? (
                      <span className="text-fresh-600 uppercase font-bold text-[10px]">FREE</span>
                    ) : (
                      formatCurrency(summary.deliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-3 text-base font-extrabold text-[#0F3427]">
                  <span>Total Amount</span>
                  <span>{formatCurrency(summary.total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 px-6 bg-[#0F3427] hover:bg-[#144333] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-fresh-600" />
                <span>Safe & Secure Client-Side Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
