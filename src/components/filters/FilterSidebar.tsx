import React from 'react';
import { RotateCcw, Check, Star } from 'lucide-react';
import { FilterState } from '../../types/product';
import { formatCurrency } from '../../utils/formatters';

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  availableSubcategories: string[];
  availableBrands: string[];
  totalResults: number;
  onClearFilters: () => void;
  className?: string;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  setFilters,
  availableSubcategories,
  availableBrands,
  totalResults,
  onClearFilters,
  className = ''
}) => {
  const handleSubcategoryToggle = (sub: string) => {
    setFilters(prev => {
      const exists = prev.subcategories.includes(sub);
      const next = exists
        ? prev.subcategories.filter(s => s !== sub)
        : [...prev.subcategories, sub];
      return { ...prev, subcategories: next };
    });
  };

  const handleBrandToggle = (brand: string) => {
    setFilters(prev => {
      const exists = prev.brands.includes(brand);
      const next = exists
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand];
      return { ...prev, brands: next };
    });
  };

  return (
    <aside className={`bg-white rounded-3xl p-6 border border-emerald-950/5 shadow-subtle space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-[#0F3427]">Filters</h3>
          <p className="text-xs text-slate-500">{totalResults} products found</p>
        </div>
        <button
          onClick={onClearFilters}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Availability */}
      <div>
        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => setFilters(prev => ({ ...prev, inStockOnly: e.target.checked }))}
            className="w-4 h-4 rounded text-[#0F3427] focus:ring-emerald-500 border-slate-300"
          />
          <span className="text-xs font-bold text-slate-800">In Stock Only</span>
        </label>
      </div>

      {/* Price Range */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Max Price</h4>
          <span className="text-xs font-bold text-[#0F3427]">{formatCurrency(filters.maxPrice)}</span>
        </div>
        <input
          type="range"
          min="10"
          max="500"
          step="10"
          value={filters.maxPrice}
          onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0F3427]"
        />
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>$10</span>
          <span>$250</span>
          <span>$500+</span>
        </div>
      </div>

      {/* Subcategories (if available) */}
      {availableSubcategories.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Subcategories
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {availableSubcategories.map(sub => {
              const isChecked = filters.subcategories.includes(sub);
              return (
                <label key={sub} className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 hover:text-[#0F3427] transition-colors">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isChecked
                        ? 'bg-[#0F3427] border-[#0F3427] text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleSubcategoryToggle(sub)}
                    className="sr-only"
                  />
                  <span className="truncate">{sub}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Brands */}
      {availableBrands.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Brands
          </h4>
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {availableBrands.map(brand => {
              const isChecked = filters.brands.includes(brand);
              return (
                <label key={brand} className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700 hover:text-[#0F3427] transition-colors">
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isChecked
                        ? 'bg-[#0F3427] border-[#0F3427] text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleBrandToggle(brand)}
                    className="sr-only"
                  />
                  <span className="truncate">{brand}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Customer Rating */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Minimum Rating
        </h4>
        <div className="space-y-1.5">
          {[4.5, 4.0, 3.5].map(rating => (
            <button
              key={rating}
              onClick={() =>
                setFilters(prev => ({
                  ...prev,
                  minRating: prev.minRating === rating ? 0 : rating
                }))
              }
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-colors ${
                filters.minRating === rating
                  ? 'bg-emerald-50 text-[#0F3427] font-bold border border-emerald-300'
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-1.5 text-amber-500">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{rating} & above</span>
              </div>
              {filters.minRating === rating && <Check className="w-3.5 h-3.5 text-fresh-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum Discount */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Discount
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {[10, 20, 30].map(disc => (
            <button
              key={disc}
              onClick={() =>
                setFilters(prev => ({
                  ...prev,
                  minDiscount: prev.minDiscount === disc ? 0 : disc
                }))
              }
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                filters.minDiscount === disc
                  ? 'bg-[#0F3427] text-white shadow-sm'
                  : 'bg-neutral-100 text-slate-600 hover:bg-neutral-200'
              }`}
            >
              {disc}% or more
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
