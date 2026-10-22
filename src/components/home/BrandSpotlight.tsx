import React from 'react';
import { POPULAR_BRANDS } from '../../data/brands';
import { Sparkles } from 'lucide-react';

export const BrandSpotlight: React.FC = () => {
  return (
    <section className="py-14 bg-gradient-to-b from-[#F8FAF8] to-emerald-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-emerald-950/10 text-xs font-bold text-[#144333] mb-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-fresh-600" />
            <span>Trusted Craftsmanship</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F3427] tracking-tight">
            Popular Brands in the Nest
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Engineered by visionary studios committed to durability and modern design
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {POPULAR_BRANDS.map(brand => (
            <div
              key={brand.name}
              className="group bg-white p-4 rounded-2xl border border-emerald-950/5 shadow-subtle hover:shadow-card hover:border-emerald-300 transition-all text-center flex flex-col items-center justify-center min-h-[110px]"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 group-hover:bg-[#0F3427] text-[#0F3427] group-hover:text-white flex items-center justify-center font-black text-xs tracking-wider transition-colors shadow-sm mb-2">
                {brand.logoText.slice(0, 3)}
              </div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#0F3427] transition-colors truncate w-full">
                {brand.name}
              </h4>
              <p className="text-[10px] text-slate-400 truncate w-full mt-0.5">
                {brand.category}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
