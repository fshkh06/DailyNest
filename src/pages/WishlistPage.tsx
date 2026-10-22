import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { Rating } from '../components/common/Rating';
import { formatCurrency } from '../utils/formatters';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlistProducts, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { success } = useToast();

  const handleMoveToCart = (product: any) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
    success(`Moved "${product.name}" to your cart`);
  };

  if (wishlistProducts.length === 0) {
    return (
      <div className="py-20 bg-[#F8FAF8]">
        <div className="max-w-xl mx-auto px-4 text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <Heart className="w-12 h-12 fill-rose-100" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-[#0F3427]">Your Wishlist is Empty</h1>
            <p className="text-sm text-slate-500 mt-2">
              Save your favorite items here to purchase later or keep track of special deals.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0F3427] hover:bg-[#144333] text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <span>Discover Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-[#F8FAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0F3427] tracking-tight">
              My Wishlist
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {wishlistProducts.length} saved essentials
            </p>
          </div>
          <button
            onClick={clearWishlist}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Wishlist</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistProducts.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-2xl border border-emerald-950/5 shadow-subtle overflow-hidden flex flex-col justify-between group hover:shadow-card transition-all"
            >
              <div className="relative aspect-square bg-neutral-50">
                <Link to={`/product/${product.slug}`}>
                  <ImageWithFallback
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </Link>
                <button
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 text-rose-500 hover:bg-rose-50 shadow-sm"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 flex flex-col flex-grow justify-between space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-[#144333] uppercase">
                    {product.brand}
                  </span>
                  <Link
                    to={`/product/${product.slug}`}
                    className="text-xs font-bold text-slate-800 hover:text-[#0F3427] line-clamp-2 block mt-0.5"
                  >
                    {product.name}
                  </Link>
                  <div className="mt-2">
                    <Rating rating={product.rating} reviewCount={product.reviewCount} size="sm" />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-sm font-bold text-[#0F3427]">
                    {formatCurrency(product.price)}
                  </span>
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="px-3 py-1.5 rounded-xl bg-[#0F3427] hover:bg-[#144333] text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
