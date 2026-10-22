import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductBySlug, getRecommendedProducts, ALL_PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { useToast } from '../context/ToastContext';
import { ProductGallery } from '../components/product/ProductGallery';
import { FrequentlyBoughtTogether } from '../components/product/FrequentlyBoughtTogether';
import { ProductReviews } from '../components/product/ProductReviews';
import { ProductCard } from '../components/common/ProductCard';
import { Rating } from '../components/common/Rating';
import { formatCurrency } from '../utils/formatters';
import {
  Heart,
  Share2,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
  Home,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = getProductBySlug(slug || '');

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addRecentlyViewed, recentProducts } = useRecentlyViewed();
  const { success } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Standard Natural');
  const [selectedSize, setSelectedSize] = useState('Standard Fit');

  // Record to recently viewed on mount
  useEffect(() => {
    if (product) {
      addRecentlyViewed(product.id);
      window.scrollTo(0, 0);
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-[#0F3427]">Product Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The product you are looking for does not exist in our catalog.</p>
        <Link to="/" className="inline-block mt-4 px-6 py-2.5 bg-[#0F3427] text-white rounded-xl text-xs font-bold">
          Return to DailyNest Home
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const similarProducts = getRecommendedProducts(product.category, product.id, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    success(`Added ${quantity}x "${product.name}" to cart`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    navigate('/checkout');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      success('Product link copied to clipboard!');
    }
  };

  return (
    <div className="py-8 bg-[#F8FAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-[#0F3427] flex items-center gap-1">
            <Home className="w-3.5 h-3.5" /> Home
          </Link>
          <span>/</span>
          <Link
            to={`/category/${product.category.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`}
            className="hover:text-[#0F3427]"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800 truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Hero Details (Gallery + Actions) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 sm:p-10 rounded-3xl border border-emerald-950/5 shadow-subtle">
          {/* Gallery Column */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Details & Actions Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Brand & Stock */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#144333] uppercase tracking-wider">
                  {product.brand}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    product.stock === 'in_stock'
                      ? 'bg-fresh-50 text-fresh-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {product.stock === 'in_stock' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({product.stockCount} available)
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" /> Low Stock (Only {product.stockCount} left)
                    </>
                  )}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F3427] leading-tight">
                {product.name}
              </h1>

              {/* Ratings */}
              <div className="flex items-center gap-4">
                <Rating rating={product.rating} reviewCount={product.reviewCount} size="md" />
                <span className="text-slate-300">|</span>
                <span className="text-xs text-slate-500 font-medium">Department: {product.subcategory}</span>
              </div>

              {/* Price Details */}
              <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-950/5 space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-[#0F3427]">
                    {formatCurrency(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-base text-slate-400 line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  )}
                  {product.discount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#12B76A] text-white">
                      Save {product.discount}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#144333] font-medium flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-fresh-600" />
                  {product.deliveryInfo} &bull; Ships in recyclable packaging
                </p>
              </div>

              {/* Description Snippet */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Color Selection Simulator */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Finish / Shade: <span className="font-normal text-slate-500">{selectedColor}</span>
                </label>
                <div className="flex gap-2">
                  {['Standard Natural', 'Matte Forest', 'Charcoal Slate'].map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 text-xs rounded-xl border transition-all ${
                        selectedColor === color
                          ? 'border-[#0F3427] bg-[#0F3427] text-white font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="inline-flex items-center border border-slate-200 rounded-xl bg-neutral-50">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-2 hover:bg-slate-200/60 rounded-l-xl text-slate-700 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 text-xs font-bold text-slate-800">{quantity}</span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-2 hover:bg-slate-200/60 rounded-r-xl text-slate-700 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-400">
                    Subtotal: <strong>{formatCurrency(product.price * quantity)}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* CTAs Row */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="py-3.5 px-4 bg-[#0F3427] hover:bg-[#144333] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-fresh-400" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="py-3.5 px-4 bg-fresh-600 hover:bg-fresh-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Secondary Actions (Wishlist & Share) */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    isWishlisted
                      ? 'border-rose-200 bg-rose-50 text-rose-600'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                  <span>{isWishlisted ? 'In Wishlist' : 'Add to Wishlist'}</span>
                </button>
                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
                  title="Share product link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Assurance Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-4 text-center text-[10px] text-slate-500">
                <div className="p-2 bg-neutral-50 rounded-xl">
                  <Truck className="w-4 h-4 mx-auto mb-1 text-slate-700" />
                  <span>Fast Delivery</span>
                </div>
                <div className="p-2 bg-neutral-50 rounded-xl">
                  <RotateCcw className="w-4 h-4 mx-auto mb-1 text-slate-700" />
                  <span>30-Day Returns</span>
                </div>
                <div className="p-2 bg-neutral-50 rounded-xl">
                  <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-slate-700" />
                  <span>Authentic Brand</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features & Detailed Technical Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Key Features */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/5 shadow-subtle space-y-4">
            <h3 className="text-lg font-bold text-[#0F3427]">Key Features & Craft</h3>
            <ul className="space-y-3">
              {product.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600">
                  <div className="w-5 h-5 rounded-full bg-fresh-100 text-fresh-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Specifications Table */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/5 shadow-subtle space-y-4">
            <h3 className="text-lg font-bold text-[#0F3427]">Specifications</h3>
            <div className="divide-y divide-slate-100 text-xs">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="py-2.5 flex justify-between gap-4">
                  <span className="font-semibold text-slate-500">{key}</span>
                  <span className="font-medium text-slate-800 text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Frequently Bought Together Bundle */}
        <FrequentlyBoughtTogether
          currentProduct={product}
          bundleProducts={similarProducts}
        />

        {/* Customer Reviews Section */}
        <ProductReviews
          productRating={product.rating}
          productReviewCount={product.reviewCount}
        />

        {/* Similar Products */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#0F3427]">You May Also Like</h3>
              <p className="text-xs text-slate-500">Complementary picks from the same collection</p>
            </div>
            <Link
              to={`/category/${product.category.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`}
              className="text-xs font-bold text-[#144333] hover:underline"
            >
              View More
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {similarProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Recently Viewed */}
        {recentProducts.length > 1 && (
          <section className="space-y-6 pt-6 border-t border-slate-200">
            <h3 className="text-xl font-bold text-[#0F3427]">Recently Viewed</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {recentProducts.filter(p => p.id !== product.id).slice(0, 4).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
