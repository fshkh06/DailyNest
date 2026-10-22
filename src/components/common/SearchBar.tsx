import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { ALL_PRODUCTS } from '../../data/products';
import { Product } from '../../types/product';
import { ImageWithFallback } from './ImageWithFallback';
import { formatCurrency } from '../../utils/formatters';

const POPULAR_SUGGESTIONS = [
  'Headphones', 'Ergonomic Chair', 'Dutch Oven', 'Leather Backpack', 'Serum', 'Standing Desk', 'Smartwatch', 'Ceramic Mug'
];

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onSearchComplete?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  className = '',
  placeholder = 'Search 1,500+ essentials, tech, fashion...',
  autoFocus = false,
  onSearchComplete
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = useMemo<Product[]>(() => {
    const trimmed = query.trim().toLowerCase();
    if (trimmed.length < 2) return [];

    return ALL_PRODUCTS.filter(product => {
      return (
        product.name.toLowerCase().includes(trimmed) ||
        product.brand.toLowerCase().includes(trimmed) ||
        product.category.toLowerCase().includes(trimmed) ||
        product.subcategory.toLowerCase().includes(trimmed) ||
        product.tags.some(tag => tag.toLowerCase().includes(trimmed))
      );
    }).slice(0, 6);
  }, [query]);

  const handleSearchSubmit = (searchQuery: string) => {
    const term = searchQuery.trim();
    if (!term) return;
    setIsOpen(false);
    if (onSearchComplete) onSearchComplete();
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(query);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <div className="absolute left-3.5 text-slate-400 pointer-events-none">
          <Search className="w-4 h-4 text-emerald-800" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Search DailyNest products"
          className="w-full pl-10 pr-10 py-2.5 text-sm bg-white/95 text-slate-800 rounded-full border border-emerald-950/15 focus:border-[#144333] focus:ring-2 focus:ring-[#144333]/15 transition-all outline-none shadow-sm placeholder:text-slate-400"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
            aria-label="Clear search text"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-dropdown border border-emerald-950/10 overflow-hidden z-50 animate-slide-up">
          {/* If user is typing and results found */}
          {query.trim().length >= 2 ? (
            <div>
              <div className="px-4 py-2.5 bg-emerald-50/50 border-b border-emerald-950/5 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Products ({searchResults.length} matches)
                </span>
                <button
                  onClick={() => handleSearchSubmit(query)}
                  className="text-xs font-semibold text-[#144333] hover:underline flex items-center gap-1"
                >
                  View all results <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {searchResults.length > 0 ? (
                <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                  {searchResults.map(product => (
                    <button
                      key={product.id}
                      onClick={() => {
                        setIsOpen(false);
                        if (onSearchComplete) onSearchComplete();
                        navigate(`/product/${product.slug}`);
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-emerald-50/40 transition-colors text-left group"
                    >
                      <div className="w-11 h-11 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 border border-slate-200/50">
                        <ImageWithFallback
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-xs font-bold text-[#144333] tracking-wide uppercase">
                          {product.brand}
                        </p>
                        <p className="text-sm font-medium text-slate-800 truncate group-hover:text-[#0F3427]">
                          {product.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {product.category} &bull; {product.subcategory}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-sm font-bold text-[#0F3427]">
                          {formatCurrency(product.price)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-sm font-semibold text-slate-700">No matching products found</p>
                  <p className="text-xs text-slate-400 mt-1">Try searching by category, brand or simpler keywords.</p>
                </div>
              )}
            </div>
          ) : (
            /* Default prompt when clicking empty input */
            <div className="p-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-fresh-600" />
                <span>Trending Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SUGGESTIONS.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setQuery(tag);
                      handleSearchSubmit(tag);
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-100 hover:bg-[#DCEEE6] text-slate-700 hover:text-[#0F3427] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
