import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { AddressModal } from '../components/checkout/AddressModal';
import { formatCurrency } from '../utils/formatters';
import { PaymentMethod } from '../types/order';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Plus,
  CheckCircle2,
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  ArrowRight,
  ChevronRight,
  Check,
  ShoppingBag
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { items, summary, clearCart } = useCart();
  const { addresses, selectedAddress, setSelectedAddress, createOrder } = useOrder();
  const { user } = useAuth();
  const { error, success } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Demo Card input states
  const [cardData, setCardData] = useState({
    number: '•••• •••• •••• 4242',
    name: user?.name || 'Alex Johnson',
    expiry: '12/28',
    cvv: '•••'
  });

  // Demo UPI state
  const [upiId, setUpiId] = useState('alex@upi');

  if (items.length === 0) {
    return (
      <div className="py-20 bg-[#F8FAF8] text-center max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold text-[#0F3427]">Your cart is empty</h2>
        <p className="text-xs text-slate-500 mt-2">Add items to your cart before proceeding to checkout.</p>
        <Link to="/" className="inline-block mt-4 px-6 py-2.5 bg-[#0F3427] text-white rounded-xl text-xs font-bold">
          Explore Products
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      error('Please select or add a delivery address to continue.');
      setStep(1);
      return;
    }

    setIsPlacingOrder(true);
    await new Promise(res => setTimeout(res, 600)); // Natural simulated processing

    const newOrder = createOrder({
      items,
      subtotal: summary.subtotal,
      discount: summary.discount,
      deliveryFee: summary.deliveryFee,
      couponDiscount: summary.couponDiscount,
      total: summary.total,
      shippingAddress: selectedAddress,
      paymentMethod,
      userId: user?.id
    });

    // Clear cart in local storage
    clearCart();

    // Trigger celebratory confetti effect
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    success(`Order placed successfully! ID: ${newOrder.id}`);
    setIsPlacingOrder(false);
    navigate(`/order-confirmation/${newOrder.id}`);
  };

  return (
    <div className="py-10 bg-[#F8FAF8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Checkout Steps Stepper */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 py-4">
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-2 text-xs font-bold transition-colors ${
              step >= 1 ? 'text-[#0F3427]' : 'text-slate-400'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step > 1 ? 'bg-fresh-500 text-white' : step === 1 ? 'bg-[#0F3427] text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              {step > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
            </div>
            <span>Delivery Address</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-300" />

          <button
            onClick={() => selectedAddress && setStep(2)}
            className={`flex items-center gap-2 text-xs font-bold transition-colors ${
              step >= 2 ? 'text-[#0F3427]' : 'text-slate-400'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step > 2 ? 'bg-fresh-500 text-white' : step === 2 ? 'bg-[#0F3427] text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              {step > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
            </div>
            <span>Order Summary</span>
          </button>

          <ChevronRight className="w-4 h-4 text-slate-300" />

          <button
            onClick={() => selectedAddress && setStep(3)}
            className={`flex items-center gap-2 text-xs font-bold transition-colors ${
              step >= 3 ? 'text-[#0F3427]' : 'text-slate-400'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 3 ? 'bg-[#0F3427] text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              3
            </div>
            <span>Payment Method</span>
          </button>
        </div>

        {/* Step 1: Address Selection */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/5 shadow-subtle space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-[#0F3427]">Select Delivery Address</h2>
                <p className="text-xs text-slate-500 mt-0.5">Where should we deliver your DailyNest parcel?</p>
              </div>
              <button
                onClick={() => setIsAddressModalOpen(true)}
                className="px-4 py-2 bg-emerald-50 text-[#0F3427] hover:bg-emerald-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            {/* Address Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map(addr => {
                const isSelected = selectedAddress?.id === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                      isSelected
                        ? 'border-[#0F3427] bg-emerald-50/40 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-lg bg-neutral-100 text-[10px] font-bold uppercase text-slate-700">
                          {addr.addressType}
                        </span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded-lg bg-fresh-100 text-fresh-800 text-[10px] font-bold">
                            Default
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#0F3427] text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    <p className="font-bold text-slate-900 text-sm mt-3">{addr.fullName}</p>
                    <p className="text-xs text-slate-600 mt-1">{addr.houseFlat}, {addr.street}</p>
                    <p className="text-xs text-slate-600">{addr.city}, {addr.state} {addr.postalCode}</p>
                    <p className="text-xs text-slate-400 mt-2 font-mono">{addr.mobileNumber}</p>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                disabled={!selectedAddress}
                onClick={() => setStep(2)}
                className="px-8 py-3.5 bg-[#0F3427] hover:bg-[#144333] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all disabled:opacity-50"
              >
                <span>Continue to Summary</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Order Summary */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/5 shadow-subtle space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-bold text-[#0F3427]">Review Order Items</h2>
                <p className="text-xs text-slate-500 mt-0.5">Verify your selected items and pricing before payment</p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs font-bold text-[#144333] hover:underline"
              >
                Change Address
              </button>
            </div>

            {/* Selected Address Snippet */}
            {selectedAddress && (
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#144333] mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-[#0F3427]">Delivering to: {selectedAddress.fullName}</span>
                  <p className="text-slate-600">
                    {selectedAddress.houseFlat}, {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.postalCode}
                  </p>
                </div>
              </div>
            )}

            {/* Items summary */}
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-2">
              {items.map(item => (
                <div key={item.product.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800 line-clamp-1">{item.product.name}</p>
                      <p className="text-[11px] text-slate-400">Qty: {item.quantity} &bull; {formatCurrency(item.product.price)} each</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#0F3427]">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total calculation bar */}
            <div className="p-4 rounded-2xl bg-neutral-50 text-xs space-y-1.5 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal:</span>
                <span className="font-semibold text-slate-800">{formatCurrency(summary.subtotal)}</span>
              </div>
              {summary.couponDiscount > 0 && (
                <div className="flex justify-between text-fresh-700 font-semibold">
                  <span>Coupon ({summary.appliedCoupon?.code}):</span>
                  <span>-{formatCurrency(summary.couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery Fee:</span>
                <span className="font-semibold text-slate-800">
                  {summary.deliveryFee === 0 ? 'FREE' : formatCurrency(summary.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#0F3427] pt-2 border-t border-slate-200">
                <span>Final Total:</span>
                <span>{formatCurrency(summary.total)}</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="px-8 py-3.5 bg-[#0F3427] hover:bg-[#144333] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md"
              >
                <span>Proceed to Payment Method</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment Method Selection */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/5 shadow-subtle space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-[#0F3427]">Select Payment Method</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Frontend demonstration checkout &bull; Zero real charges will be made
              </p>
            </div>

            {/* Demo Notice Alert */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-[#0F3427] flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-fresh-600 flex-shrink-0" />
              <span>
                <strong>Demo Mode Active:</strong> All payment selections below are simulated locally. Your order will be stored safely in localStorage.
              </span>
            </div>

            {/* Payment Options */}
            <div className="space-y-3">
              {/* Card */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-[#0F3427] bg-emerald-50/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Credit / Debit Card (Simulated)</h4>
                      <p className="text-[11px] text-slate-500">Visa, Mastercard, Amex, RuPay</p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'card' ? 'border-[#0F3427]' : 'border-slate-300'
                    }`}
                  >
                    {paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-[#0F3427]" />}
                  </div>
                </div>

                {paymentMethod === 'card' && (
                  <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 gap-3 text-xs animate-fade-in">
                    <div className="col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Number</label>
                      <input
                        type="text"
                        value={cardData.number}
                        onChange={e => setCardData({ ...cardData, number: e.target.value })}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expiry</label>
                      <input
                        type="text"
                        value={cardData.expiry}
                        onChange={e => setCardData({ ...cardData, expiry: e.target.value })}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">CVV</label>
                      <input
                        type="text"
                        value={cardData.cvv}
                        onChange={e => setCardData({ ...cardData, cvv: e.target.value })}
                        className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 font-mono text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* UPI */}
              <div
                onClick={() => setPaymentMethod('upi')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-[#0F3427] bg-emerald-50/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">UPI / QR Payment (Simulated)</h4>
                      <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'upi' ? 'border-[#0F3427]' : 'border-slate-300'
                    }`}
                  >
                    {paymentMethod === 'upi' && <div className="w-2 h-2 rounded-full bg-[#0F3427]" />}
                  </div>
                </div>

                {paymentMethod === 'upi' && (
                  <div className="mt-4 pt-4 border-t border-slate-200 text-xs animate-fade-in">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Virtual Payment Address (VPA)</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 font-mono text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#0F3427] bg-emerald-50/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Cash on Delivery</h4>
                      <p className="text-[11px] text-slate-500">Pay conveniently with cash or card upon arrival</p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'cod' ? 'border-[#0F3427]' : 'border-slate-300'
                    }`}
                  >
                    {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-[#0F3427]" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Place Order CTA */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Back to Summary
              </button>
              <button
                disabled={isPlacingOrder}
                onClick={handlePlaceOrder}
                className="px-10 py-4 bg-[#0F3427] hover:bg-[#144333] text-white rounded-xl text-xs font-bold shadow-xl transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4 text-fresh-400" />
                <span>Place Order ({formatCurrency(summary.total)})</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Address Form Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />
    </div>
  );
};
