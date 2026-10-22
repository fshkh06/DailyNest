import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Timer, ArrowRight } from 'lucide-react';
import { getDealProducts } from '../../data/products';
import { ProductCard } from '../common/ProductCard';

export const FlashDeals: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 34, seconds: 12 });
  const dealProducts = getDealProducts(8);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-white border-y border-emerald-950/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Deals Header with Countdown */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 bg-amber-50/60 p-6 rounded-3xl border border-amber-200/60">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-[11px] font-bold uppercase tracking-wider mb-2 shadow-sm">
              <Timer className="w-3.5 h-3.5" />
              <span>Limited Time Offers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F3427] tracking-tight">
              Today's Deals
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Save up to 40% on top daily essentials before midnight
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              Ends in:
            </span>
            <div className="flex items-center gap-1.5 font-mono">
              <div className="bg-[#0F3427] text-white px-2.5 py-1.5 rounded-xl font-bold text-sm min-w-[36px] text-center shadow-sm">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <span className="font-bold text-slate-400">:</span>
              <div className="bg-[#0F3427] text-white px-2.5 py-1.5 rounded-xl font-bold text-sm min-w-[36px] text-center shadow-sm">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <span className="font-bold text-slate-400">:</span>
              <div className="bg-[#0F3427] text-white px-2.5 py-1.5 rounded-xl font-bold text-sm min-w-[36px] text-center shadow-sm">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
            </div>
            <Link
              to="/deals"
              className="ml-2 text-xs font-bold text-[#144333] hover:text-[#0F3427] flex items-center gap-1"
            >
              <span>All Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {dealProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
