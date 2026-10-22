import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES_DATA } from '../../data/categories';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const CategoryGrid: React.FC = () => {
  return (
    <section id="categories" className="py-16 bg-[#F8FAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#144333] text-xs font-bold uppercase tracking-wider mb-2">
              <span>Curated Departments</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F3427] tracking-tight">
              Shop by Category
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Explore 1,500+ verified essentials across 7 specialized departments
            </p>
          </div>
          <Link
            to="/category/home-living"
            className="text-xs font-bold text-[#144333] hover:text-[#0F3427] flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>Browse All Departments</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES_DATA.map((cat, idx) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className={`group relative rounded-3xl overflow-hidden bg-white border border-emerald-950/5 shadow-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col ${
                idx === 0 ? 'sm:col-span-2 lg:col-span-2' : ''
              }`}
            >
              {/* Image container */}
              <div
                className={`relative overflow-hidden bg-neutral-100 ${
                  idx === 0 ? 'aspect-[16/9] sm:aspect-[2/1]' : 'aspect-[4/3]'
                }`}
              >
                <ImageWithFallback
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Top Badge */}
                <div className="absolute top-3.5 left-3.5">
                  <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-[#0F3427] shadow-sm">
                    {cat.itemCount} Products
                  </span>
                </div>

                {/* Arrow Icon */}
                <div className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md text-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all">
                  <ArrowUpRight className="w-4 h-4 text-[#0F3427]" />
                </div>

                {/* Bottom Overlay Text */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-white/80 line-clamp-1 mt-0.5 font-normal">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Subcategories preview tags */}
              <div className="p-4 bg-white flex flex-wrap gap-1.5 mt-auto border-t border-slate-50">
                {cat.subcategories.slice(0, 3).map(sub => (
                  <span
                    key={sub}
                    className="text-[11px] font-medium text-slate-600 bg-neutral-100 px-2.5 py-1 rounded-lg group-hover:bg-emerald-50 group-hover:text-[#0F3427] transition-colors truncate max-w-[140px]"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
