import React from 'react';
import { HOMEPAGE_TESTIMONIALS } from '../../data/brands';
import { Rating } from '../common/Rating';
import { Quote } from 'lucide-react';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const Testimonials: React.FC = () => {
  return (
    <section className="py-16 bg-[#F8FAF8] border-t border-emerald-950/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#144333] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-950/10">
            Real Experiences
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F3427] tracking-tight mt-2">
            Loved by Daily Shoppers
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Read authentic reviews from customers who rely on DailyNest every day
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOMEPAGE_TESTIMONIALS.map(t => (
            <div
              key={t.id}
              className="bg-white rounded-3xl p-6 border border-emerald-950/5 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Rating rating={t.rating} size="sm" showCount={false} />
                  <Quote className="w-5 h-5 text-emerald-200" />
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed mb-4">
                  "{t.comment}"
                </p>
                <div className="mb-4 pt-3 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Purchased</span>
                  <p className="text-xs font-semibold text-[#0F3427] line-clamp-1">{t.productName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-100 flex-shrink-0 border border-slate-200">
                  <ImageWithFallback src={t.avatar} alt={t.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-slate-400">{t.role} &bull; {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
