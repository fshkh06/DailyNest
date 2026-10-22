import React from 'react';
import { X } from 'lucide-react';
import { FilterSidebar } from './FilterSidebar';
import { FilterState } from '../../types/product';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  availableSubcategories: string[];
  availableBrands: string[];
  totalResults: number;
  onClearFilters: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  setFilters,
  availableSubcategories,
  availableBrands,
  totalResults,
  onClearFilters
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden animate-fade-in">
      <div onClick={onClose} className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col animate-slide-up">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50/50">
            <h3 className="text-base font-bold text-[#0F3427]">Refine Products</h3>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              availableSubcategories={availableSubcategories}
              availableBrands={availableBrands}
              totalResults={totalResults}
              onClearFilters={onClearFilters}
              className="border-0 shadow-none p-0"
            />
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#0F3427] hover:bg-[#144333] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
            >
              Apply Filters ({totalResults} Results)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
