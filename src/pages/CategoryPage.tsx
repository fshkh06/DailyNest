import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { getCategoryBySlug, CATEGORIES_DATA } from '../data/categories';
import { getProductsByCategory } from '../data/products';
import { ProductCard } from '../components/common/ProductCard';
import { FilterSidebar } from '../components/filters/FilterSidebar';
import { FilterDrawer } from '../components/filters/FilterDrawer';
import { SortDropdown } from '../components/filters/SortDropdown';
import { FilterState, SortOption, Product } from '../types/product';
import { SlidersHorizontal, ChevronLeft, ChevronRight, Home } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

const ITEMS_PER_PAGE = 24;

export const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const subParam = searchParams.get('sub');

  const category = getCategoryBySlug(slug || '');
  const allCategoryProducts = useMemo(() => {
    return category ? getProductsByCategory(category.name) : [];
  }, [category]);

  // Dynamic filter state
  const [filters, setFilters] = useState<FilterState>({
    subcategories: subParam ? [subParam] : [],
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

  // Sync subcategory param from URL
  useEffect(() => {
    if (subParam) {
      setFilters(prev => ({ ...prev, subcategories: [subParam] }));
    }
  }, [subParam]);

  // Reset page when category or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [slug, filters, sortOption]);

  // Extract available brands for this category
  const availableBrands = useMemo(() => {
    const brandSet = new Set<string>();
    allCategoryProducts.forEach(p => brandSet.add(p.brand));
    return Array.from(brandSet).sort();
  }, [allCategoryProducts]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return allCategoryProducts.filter(p => {
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
  }, [allCategoryProducts, filters]);

  // Sort products
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

  // Pagination calculation
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

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-[#0F3427]">Category Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The requested category could not be located.</p>
        <Link to="/" className="inline-block mt-4 px-6 py-2.5 bg-[#0F3427] text-white rounded-xl text-xs font-bold">
          Return to DailyNest Home
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 bg-[#F8FAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-[#0F3427] flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">{category.name}</span>
        </nav>

        {/* Category Header Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-[#0F3427] text-white p-8 sm:p-12 shadow-card">
          <div className="max-w-2xl relative z-10 space-y-3">
            <span className="px-3 py-1 rounded-full bg-white/15 text-fresh-300 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              {category.itemCount} Verified Products
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {category.name}
            </h1>
            <p className="text-sm text-emerald-100/80 leading-relaxed font-normal">
              {category.description}
            </p>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-25 pointer-events-none hidden md:block">
            <ImageWithFallback
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Subcategory Pills Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setFilters(prev => ({ ...prev, subcategories: [] }))}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filters.subcategories.length === 0
                ? 'bg-[#0F3427] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Subcategories ({allCategoryProducts.length})
          </button>
          {category.subcategories.map(sub => {
            const isSelected = filters.subcategories.includes(sub);
            return (
              <button
                key={sub}
                onClick={() => {
                  setFilters(prev => ({
                    ...prev,
                    subcategories: isSelected ? [] : [sub]
                  }));
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#0F3427] text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {sub}
              </button>
            );
          })}
        </div>

        {/* Main Content Layout (Sidebar + Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-1 sticky top-28">
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              availableSubcategories={category.subcategories}
              availableBrands={availableBrands}
              totalResults={sortedProducts.length}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Product Listing Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top Toolbar (Count, Mobile Filter, Sort) */}
            <div className="bg-white p-4 rounded-2xl border border-emerald-950/5 shadow-subtle flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-emerald-50 text-[#0F3427] rounded-xl text-xs font-bold border border-emerald-200"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>
                <p className="text-xs text-slate-500">
                  Showing <strong className="text-slate-800">{paginatedProducts.length}</strong> of{' '}
                  <strong className="text-slate-800">{sortedProducts.length}</strong> products
                </p>
              </div>

              <SortDropdown value={sortOption} onChange={setSortOption} />
            </div>

            {/* Products Grid */}
            {sortedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#144333] mx-auto flex items-center justify-center">
                  <SlidersHorizontal className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No matching products found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting or clearing your filters to see more results from this department.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2.5 bg-[#0F3427] text-white rounded-xl text-xs font-bold"
                >
                  Reset All Filters
                </button>
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
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
                  className="p-2 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  // Show current, first, last and immediate neighbors
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
                          window.scrollTo({ top: 300, behavior: 'smooth' });
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
                    window.scrollTo({ top: 300, behavior: 'smooth' });
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
        availableSubcategories={category.subcategories}
        availableBrands={availableBrands}
        totalResults={sortedProducts.length}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
};
