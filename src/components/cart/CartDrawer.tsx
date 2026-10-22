import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { formatCurrency } from '../../utils/formatters';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
    clearCart,
    summary,
    applyCouponCode,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const { success, error } = useToast();
  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const freeDeliveryThreshold = 50.0;
  const progressPercent = Math.min(100, (summary.subtotal / freeDeliveryThreshold) * 100);
  const amountNeededForFreeDelivery = Math.max(0, freeDeliveryThreshold - summary.subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCouponCode(couponInput);
    if (res.success) {
      success(res.message);
      setCouponInput('');
    } else {
      error(res.message);
    }
  };

  const handleCheckoutClick = () => {
    closeCartDrawer();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={closeCartDrawer}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-emerald-950/10 animate-slide-up">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-emerald-50/40">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#0F3427] text-white">
                <ShoppingBag className="w-5 h-5 text-fresh-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0F3427]">Shopping Cart</h2>
                <p className="text-xs text-slate-500">{summary.totalItems} items</p>
              </div>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-white transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Progress Bar */}
          <div className="p-4 bg-emerald-50/60 border-b border-emerald-100/80">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span className="flex items-center gap-1.5 text-[#0F3427]">
                <Truck className="w-3.5 h-3.5 text-fresh-600" />
                {amountNeededForFreeDelivery > 0
                  ? `Add ${formatCurrency(amountNeededForFreeDelivery)} for FREE expedited delivery`
                  : 'You unlocked FREE expedited delivery!'}
              </span>
              <span className="font-bold text-[#144333]">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden">
              <div
                className="h-full bg-fresh-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-[#144333]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Your cart is empty</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Explore our 1,500+ curated products and add your favorites to your cart.
                  </p>
                </div>
                <button
                  onClick={closeCartDrawer}
                  className="px-6 py-2.5 rounded-xl bg-[#0F3427] hover:bg-[#144333] text-white text-xs font-bold transition-all shadow-sm"
                >
                  Start Exploring
                </button>
              </div>
            ) : (
              items.map(item => (
                <div
                  key={item.product.id}
                  className="flex gap-3 p-3 rounded-2xl bg-neutral-50/60 border border-slate-100 hover:border-emerald-200 transition-colors"
                >
                  <div className="w-18 h-18 rounded-xl overflow-hidden bg-white border border-slate-200/60 flex-shrink-0">
                    <ImageWithFallback
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${item.product.slug}`}
                          onClick={closeCartDrawer}
                          className="text-xs font-bold text-slate-800 hover:text-[#0F3427] line-clamp-1 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-rose-500 p-0.5 rounded transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">
                        {item.product.brand}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-200 bg-white rounded-lg shadow-sm">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-slate-100 text-slate-600 transition-colors rounded-l-lg"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-slate-100 text-slate-600 transition-colors rounded-r-lg"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-[#0F3427]">
                          {formatCurrency(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-white space-y-4">
              {/* Coupon Bar */}
              <div className="space-y-2">
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-grow">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="Coupon (e.g. WELCOME10)"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F3427] uppercase font-semibold"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#0F3427] font-bold text-xs rounded-xl transition-colors border border-emerald-950/10"
                  >
                    Apply
                  </button>
                </form>

                {summary.appliedCoupon && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-fresh-50 border border-fresh-200 text-xs text-fresh-800 font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-fresh-600" />
                      Applied: {summary.appliedCoupon.code} ({summary.appliedCoupon.discountPercentage}% OFF)
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-slate-400 hover:text-rose-600 text-[11px] underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Price Details */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(summary.subtotal)}</span>
                </div>
                {summary.couponDiscount > 0 && (
                  <div className="flex justify-between text-fresh-700 font-medium">
                    <span>Coupon Savings</span>
                    <span>-{formatCurrency(summary.couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="font-semibold text-slate-800">
                    {summary.deliveryFee === 0 ? (
                      <span className="text-fresh-600 uppercase font-bold text-[10px]">FREE</span>
                    ) : (
                      formatCurrency(summary.deliveryFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#0F3427] pt-2 border-t border-slate-100">
                  <span>Estimated Total</span>
                  <span>{formatCurrency(summary.total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full py-3.5 px-4 bg-[#0F3427] hover:bg-[#144333] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex items-center justify-between text-xs px-1">
                  <Link
                    to="/cart"
                    onClick={closeCartDrawer}
                    className="text-slate-500 hover:text-[#0F3427] font-semibold underline"
                  >
                    View Full Cart Page
                  </Link>
                  <button
                    onClick={clearCart}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
