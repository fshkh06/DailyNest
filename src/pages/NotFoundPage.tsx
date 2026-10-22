import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, Compass, ArrowRight } from 'lucide-react';
import { CATEGORIES_DATA } from '../data/categories';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-20 bg-[#F8FAF8] flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-emerald-50 text-[#144333] mx-auto flex items-center justify-center font-black text-3xl border border-emerald-100 shadow-sm">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-[#0F3427]">Page Not Found</h1>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            The page you are looking for has been moved, removed, or never existed in our nest.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            to="/"
            className="px-6 py-3 bg-[#0F3427] hover:bg-[#144333] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            to="/category/home-living"
            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Browse Categories</span>
          </Link>
        </div>

        <div className="pt-8 border-t border-slate-200/80">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
            Popular Departments
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES_DATA.slice(0, 5).map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 hover:text-[#0F3427] hover:border-[#144333] transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
