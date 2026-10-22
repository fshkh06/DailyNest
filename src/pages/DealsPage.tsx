import React, { useMemo, useState } from 'react';
import { ALL_PRODUCTS } from '../data/products';
import { AVAILABLE_COUPONS } from '../data/coupons';
import { ProductCard } from '../components/common/ProductCard';
import { SortDropdown } from '../components/filters/SortDropdown';
import { SortOption } from '../types/product';
import { Sparkles, Tag, Timer, Copy, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const DealsPage: React.FC = () => {
  const { success } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('discount');

  // Filter only items with discounts
  const dealProducts = useMemo(() => {
    const deals = ALL_PRODUCTS.filter(p => p.discount >= 20);
    switch (sortOption) {
      case 'price-low-high':
        return deals.sort((a, b) => a.price - b.price);
      case 'price-high-low':
        return deals.sort((a, b) => b.price - a.price);
      case 'rating':
        return deals.sort((a, b) => b.rating - a.rating);
      case 'discount':
      default:
        return deals.sort((a, b) => b.discount - a.discount);
    }
  }, [sortOption]);

  const copyCoupon = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      success(`Coupon ${code} copied to clipboard!`);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  return (
    <div className="py-8 bg-[#F8FAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Deals Hero Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 text-white rounded-3xl p-8 sm:p-12 shadow-card space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider">
            <Timer className="w-3.5 h-3.5" />
            <span>Limited-Time Specials</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Today's Best Offers & Coupons
          </h1>
          <p className="text-sm text-amber-100 max-w-xl font-normal leading-relaxed">
            Take advantage of exclusive daily markdowns and active promo codes across home, tech, kitchen and lifestyle essentials.
          </p>

          {/* Active Promo Codes Row */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {AVAILABLE_COUPONS.map(c => (
              <div
                key={c.code}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 flex items-center justify-between"
              >
                <div>
                  <span className="font-mono text-sm font-extrabold tracking-wider">{c.code}</span>
                  <p className="text-[11px] text-amber-200 mt-0.5">{c.description}</p>
                </div>
                <button
                  onClick={() => copyCoupon(c.code)}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white text-white hover:text-amber-900 transition-colors flex items-center gap-1 text-xs font-bold"
                  title="Copy coupon code"
                >
                  {copiedCode === c.code ? <Check className="w-3.5 h-3.5 text-fresh-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-950/5 shadow-subtle flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-slate-800">
              Showing {dealProducts.length} discounted items (Up to 40% OFF)
            </span>
          </div>
          <SortDropdown value={sortOption} onChange={setSortOption} />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {dealProducts.slice(0, 48).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
