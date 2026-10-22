import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, CheckCircle, ShieldCheck, Truck, Star } from 'lucide-react';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const HeroBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#F0F7F4] via-[#F8FAF8] to-[#F8FAF8] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-emerald-950/5">
      {/* Background Decorative Circles */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-emerald-100/40 blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-[#12B76A]/5 blur-2xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-emerald-950/10 shadow-sm text-xs font-semibold text-[#0F3427] animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-fresh-600" />
              <span>Over 1,500+ handpicked products for modern living</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F3427] tracking-tight leading-[1.12]">
              Everything you need. <br className="hidden sm:inline" />
              <span className="text-[#12B76A]">Every day.</span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Discover everyday essentials, lifestyle favorites, smart accessories, fashion, beauty and more — all in one place.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                to="/category/home-living"
                className="px-7 py-3.5 rounded-xl bg-[#0F3427] hover:bg-[#144333] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#categories"
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-[#0F3427] font-bold text-sm border border-emerald-950/10 shadow-sm hover:border-[#144333]/30 transition-all active:scale-95"
              >
                Explore Categories
              </a>
            </div>

            {/* Micro Benefits Row */}
            <div className="pt-6 border-t border-emerald-950/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-medium">
                <Truck className="w-4 h-4 text-fresh-600" />
                <span>Free delivery over $50</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-fresh-600" />
                <span>Verified Quality Standards</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-4 h-4 text-fresh-600" />
                <span>Local Storage Architecture</span>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Presentation */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Feature Lifestyle Image Card */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-neutral-100">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1000&q=85"
                  alt="DailyNest Lifestyle Interior"
                  className="w-full h-full object-cover"
                />

                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Bottom Card Annotation */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-fresh-300">
                    Featured Collection
                  </span>
                  <h3 className="text-lg font-bold">Nordic Living Essentials</h3>
                  <p className="text-xs text-white/80 mt-0.5">Crafted for everyday tranquility</p>
                </div>
              </div>

              {/* Floating Badge 1: Customer Satisfaction */}
              <div className="absolute -top-4 -left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-card border border-emerald-950/5 flex items-center gap-3 animate-slide-up">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-amber-500">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-[#0F3427]">4.9 / 5.0</span>
                    <span className="text-[10px] text-slate-600">(1,400+ reviews)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">Customer Approved</p>
                </div>
              </div>

              {/* Floating Badge 2: Fast Delivery */}
              <div className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-card border border-emerald-950/5 flex items-center gap-3 animate-slide-up">
                <div className="w-10 h-10 rounded-xl bg-fresh-100 flex items-center justify-center text-[#144333]">
                  <Truck className="w-5 h-5 text-fresh-700" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#0F3427] block">Fast Dispatch</span>
                  <p className="text-[11px] text-slate-600 font-medium">Direct to your doorstep</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
