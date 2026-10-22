import React from 'react';
import { Link } from 'react-router-dom';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { FlashDeals } from '../components/home/FlashDeals';
import { BrandSpotlight } from '../components/home/BrandSpotlight';
import { Testimonials } from '../components/home/Testimonials';
import { ProductCard } from '../components/common/ProductCard';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import {
  getTrendingProducts,
  getBestSellers,
  ALL_PRODUCTS
} from '../data/products';
import { ArrowRight, Sparkles, TrendingUp, Flame, Compass, Layers } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { recentProducts } = useRecentlyViewed();

  // Curated product slices for rich homepage sections
  const trendingProducts = getTrendingProducts(8);
  const bestSellers = getBestSellers(8);
  const newArrivals = ALL_PRODUCTS.slice(30, 38);
  const everydayEssentials = ALL_PRODUCTS.slice(100, 108);
  const seasonalPicks = ALL_PRODUCTS.slice(220, 228);
  const recommendedForYou = ALL_PRODUCTS.slice(450, 458);

  return (
    <div className="space-y-4">
      {/* 1. Hero Section */}
      <HeroBanner />

      {/* 2. Shop by Category */}
      <CategoryGrid />

      {/* 3. Trending Now Section */}
      <section className="py-14 bg-white border-b border-emerald-950/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-teal-50 text-[#144333]">
                <TrendingUp className="w-5 h-5 text-[#12B76A]" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-[#0F3427] tracking-tight">
                  Trending Now
                </h2>
                <p className="text-xs text-slate-500">Most engaged items across our network this week</p>
              </div>
            </div>
            <Link
              to="/category/electronics-tech"
              className="text-xs font-bold text-[#144333] hover:text-[#0F3427] flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {trendingProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Today's Deals Section */}
      <FlashDeals />

      {/* 5. Best Sellers Section */}
      <section className="py-14 bg-[#F8FAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-700">
                <Flame className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-[#0F3427] tracking-tight">
                  Best Sellers
                </h2>
                <p className="text-xs text-slate-500">Consistently top-rated for durability and daily comfort</p>
              </div>
            </div>
            <Link
              to="/category/kitchen-dining"
              className="text-xs font-bold text-[#144333] hover:text-[#0F3427] flex items-center gap-1 group"
            >
              <span>Explore All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Recommended For You Section */}
      <section className="py-14 bg-white border-y border-emerald-950/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-[#144333]">
                <Sparkles className="w-5 h-5 text-fresh-600" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-[#0F3427] tracking-tight">
                  Recommended For You
                </h2>
                <p className="text-xs text-slate-500">Curated daily picks based on timeless utility and craft</p>
              </div>
            </div>
            <Link
              to="/category/fashion-accessories"
              className="text-xs font-bold text-[#144333] hover:text-[#0F3427] flex items-center gap-1 group"
            >
              <span>See More</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {recommendedForYou.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 7. New Arrivals Section */}
      <section className="py-14 bg-[#F8FAF8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-teal-50 text-[#144333]">
                <Compass className="w-5 h-5 text-[#144333]" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-[#0F3427] tracking-tight">
                  New Arrivals
                </h2>
                <p className="text-xs text-slate-500">Fresh additions newly stocked in our catalog</p>
              </div>
            </div>
            <Link
              to="/category/personal-care-beauty"
              className="text-xs font-bold text-[#144333] hover:text-[#0F3427] flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Everyday Essentials Promo Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0F3427] via-[#144333] to-[#082118] text-white p-8 sm:p-12 shadow-card">
          <div className="max-w-xl space-y-4 relative z-10">
            <span className="px-3 py-1 rounded-full bg-fresh-500/30 text-fresh-300 text-xs font-bold uppercase tracking-wider border border-fresh-400/30">
              Seasonal Collection
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Curated for Mindful Living
            </h3>
            <p className="text-sm text-emerald-100/80 leading-relaxed font-normal">
              Designed to elevate every room with sustainable natural fibers, non-toxic ceramics, and whisper-quiet appliances.
            </p>
            <div className="pt-2">
              <Link
                to="/category/home-living"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-fresh-500 hover:bg-fresh-600 text-white font-bold text-xs transition-colors shadow-lg"
              >
                <span>Explore Home Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 lg:opacity-35 pointer-events-none hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
              alt="Everyday essentials lifestyle"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 9. Everyday Essentials Grid */}
      <section className="py-14 bg-white border-b border-emerald-950/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-[#144333]">
                <Layers className="w-5 h-5 text-[#144333]" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-[#0F3427] tracking-tight">
                  Everyday Essentials
                </h2>
                <p className="text-xs text-slate-500">Functional staples you'll reach for day in and day out</p>
              </div>
            </div>
            <Link
              to="/category/travel-lifestyle"
              className="text-xs font-bold text-[#144333] hover:text-[#0F3427] flex items-center gap-1 group"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {everydayEssentials.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 10. Popular Brands */}
      <BrandSpotlight />

      {/* 11. Seasonal Picks */}
      <section className="py-14 bg-white border-b border-emerald-950/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-[#0F3427] tracking-tight">
                Seasonal Favorites
              </h2>
              <p className="text-xs text-slate-500 mt-1">Refined palettes, cozy textures, and active travel gear</p>
            </div>
            <Link
              to="/category/gifts-stationery"
              className="text-xs font-bold text-[#144333] hover:text-[#0F3427] flex items-center gap-1"
            >
              <span>See Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {seasonalPicks.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 12. Recently Viewed (if available) */}
      {recentProducts.length > 0 && (
        <section className="py-14 bg-[#F8FAF8] border-b border-emerald-950/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-extrabold text-[#0F3427] tracking-tight">
                  Recently Viewed
                </h2>
                <p className="text-xs text-slate-500 mt-1">Pick up right where you left off</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {recentProducts.slice(0, 4).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 13. Customer Reviews */}
      <Testimonials />
    </div>
  );
};
