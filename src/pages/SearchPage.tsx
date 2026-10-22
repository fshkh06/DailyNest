import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ALL_PRODUCTS } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';
import { FilterSidebar } from '../components/filters/FilterSidebar';
import { FilterDrawer } from '../components/filters/FilterDrawer';
import { SortDropdown } from '../components/filters/SortDropdown';
import { FilterState, SortOption, Product } from '../types/product';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Home, ArrowRight } from 'lucide-react';

const ITEMS_PER_PAGE = 24;

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const rawQuery = searchParams.get('q') || '';
  const query = rawQuery.trim();

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    subcategories: [],
    brands: [],
    minPrice: 0,
    maxPrice: 500,
    minRating: 0,
    minDiscount: 0,
    inStockOnly: false,
    tags: []
  });

  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Reset pagination when query or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [query, filters, sortOption]);

  // Initial matching products
  const matchingProducts = useMemo(() => {
    if (!query) return ALL_PRODUCTS;

    const lower = query.toLowerCase();
    return ALL_PRODUCTS.filter(p => {
      return (
        p.name.toLowerCase().includes(lower) ||
        p.brand.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower) ||
        p.subcategory.toLowerCase().includes(lower) ||
        p.tags.some(t => t.toLowerCase().includes(lower))
      );
    });
  }, [query]);

  // Extract dynamic filters from matching pool
  const availableSubcategories = useMemo(() => {
    const set = new Set<string>();
    matchingProducts.forEach(p => set.add(p.subcategory));
    return Array.from(set).sort();
  }, [matchingProducts]);

  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    matchingProducts.forEach(p => set.add(p.brand));
    return Array.from(set).sort();
  }, [matchingProducts]);

  // Apply filters
  const filteredProducts = useMemo(() => {
    return matchingProducts.filter(p => {
      if (filters.subcategories.length > 0 && !filters.subcategories.includes(p.subcategory)) {
        return false;
      }
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) {
        return false;
      }
      if (p.price > filters.maxPrice) {
        return false;
      }
      if (filters.minRating > 0 && p.rating < filters.minRating) {
        return false;
      }
      if (filters.minDiscount > 0 && p.discount < filters.minDiscount) {
        return false;
      }
      if (filters.inStockOnly && p.stock === 'out_of_stock') {
        return false;
      }
      return true;
    });
  }, [matchingProducts, filters]);

  // Apply sorting
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortOption) {
      case 'price-low-high':
        return list.sort((a, b) => a.price - b.price);
      case 'price-high-low':
        return list.sort((a, b) => b.price - a.price);
      case 'rating':
        return list.sort((a, b) => b.rating - a.rating);
      case 'discount':
        return list.sort((a, b) => b.discount - a.discount);
      case 'reviews':
        return list.sort((a, b) => b.reviewCount - a.reviewCount);
      case 'newest':
        return list.sort((a, b) => b.id.localeCompare(a.id));
      case 'popularity':
        return list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.reviewCount - a.reviewCount);
      case 'recommended':
      default:
        return list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.rating - a.rating);
    }
  }, [filteredProducts, sortOption]);

  const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedProducts, currentPage]);

  const handleClearFilters = () => {
    setFilters({
      subcategories: [],
      brands: [],
      minPrice: 0,
      maxPrice: 500,
      minRating: 0,
      minDiscount: 0,
      inStockOnly: false,
      tags: []
    });
  };

  return (
    <div className="py-8 bg-[#F8FAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-[#0F3427] flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">Search Results</span>
        </nav>

        {/* Search Query Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-950/5 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Search Results</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F3427] tracking-tight">
              {query ? `“${query}”` : 'All Products Catalog'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Found <strong>{sortedProducts.length}</strong> matching items across 7 departments
            </p>
          </div>
          <SortDropdown value={sortOption} onChange={setSortOption} />
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 sticky top-28">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              availableSubcategories={availableSubcategories}
              availableBrands={availableBrands}
              totalResults={sortedProducts.length}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Results Grid Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Mobile Filter Button */}
            <div className="lg:hidden flex justify-between items-center bg-white p-3.5 rounded-2xl border border-slate-100">
              <span className="text-xs font-semibold text-slate-600">
                {sortedProducts.length} results
              </span>
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-[#0F3427] rounded-xl text-xs font-bold border border-emerald-200"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>

            {/* Empty State */}
            {sortedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#144333] mx-auto flex items-center justify-center">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  No products matched your search for “{query}”
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try checking your spelling, using broader search terms, or explore popular categories below.
                </p>

                <div className="flex flex-wrap justify-center gap-2 pt-2 max-w-md mx-auto">
                  {['Headphones', 'Cast Iron', 'Ergonomic Chair', 'Sneakers', 'Skincare', 'Backpack', 'Journal'].map(term => (
                    <Link
                      key={term}
                      to={`/search?q=${encodeURIComponent(term)}`}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-neutral-100 hover:bg-emerald-100 text-slate-700 hover:text-[#0F3427] transition-colors"
                    >
                      {term}
                    </Link>
                  ))}
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleClearFilters}
                    className="px-6 py-2.5 bg-[#0F3427] text-white rounded-xl text-xs font-bold shadow-md"
                  >
                    Reset All Filters
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(p => Math.max(1, p - 1));
                    window.scrollTo({ top: 200, behavior: 'smooth' });
                  }}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  if (
                    pageNum === 1 ||
                    pageNum === totalPages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 200, behavior: 'smooth' });
                        }}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                          currentPage === pageNum
                            ? 'bg-[#0F3427] text-white shadow-sm'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                  if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                    return <span key={pageNum} className="text-slate-400 text-xs px-1">...</span>;
                  }
                  return null;
                })}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage(p => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 200, behavior: 'smooth' });
                  }}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        availableSubcategories={availableSubcategories}
        availableBrands={availableBrands}
        totalResults={sortedProducts.length}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
};
