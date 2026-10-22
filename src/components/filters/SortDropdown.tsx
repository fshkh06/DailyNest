import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { SortOption } from '../../types/product';

interface SortDropdownProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
  className?: string;
}

export const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Popularity', value: 'popularity' },
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-low-high' },
  { label: 'Price: High to Low', value: 'price-high-low' },
  { label: 'Customer Rating', value: 'rating' },
  { label: 'Highest Discount', value: 'discount' },
  { label: 'Most Reviewed', value: 'reviews' },
];

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange, className = '' }) => {
  return (
    <div className={`relative flex items-center gap-2 ${className}`}>
      <ArrowUpDown className="w-4 h-4 text-slate-400 hidden sm:block" />
      <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Sort by:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="text-xs font-bold text-[#0F3427] bg-white border border-emerald-950/10 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 cursor-pointer shadow-sm appearance-none"
      >
        {SORT_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
