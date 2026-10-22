import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';
import { ImageWithFallback } from './ImageWithFallback';
import { Rating } from './Rating';
import { formatCurrency } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { addToCart, items } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { success } = useToast();

  const isWishlisted = isInWishlist(product.id);
  const cartItem = items.find(i => i.product.id === product.id);
  const inCart = Boolean(cartItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    success(`Added "${product.name}" to your cart`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlist(product);
    if (added) {
      success(`Saved "${product.name}" to your wishlist`);
    }
  };

  return (
    <div
      className={`group relative flex flex-col bg-white rounded-2xl border border-emerald-950/5 shadow-subtle hover:shadow-card-hover hover:border-emerald-700/20 transition-all duration-300 overflow-hidden ${className}`}
    >
      {/* Image container */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-50/80">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <ImageWithFallback
            src={product.images[0]}
            alt={product.name}
            category={product.category}
            className="w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.discount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#12B76A] text-white shadow-sm">
              {product.discount}% OFF
            </span>
          )}
          {product.stock === 'low_stock' && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500 text-white shadow-sm">
              Only {product.stockCount} left
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 shadow-sm ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 scale-105'
              : 'bg-white/90 text-slate-500 hover:text-rose-500 hover:bg-white'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform duration-200 ${
              isWishlisted ? 'fill-rose-600 text-rose-600 animate-heart-burst' : ''
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Brand & Subcategory */}
        <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
          <span className="font-semibold text-[#144333] tracking-wide uppercase text-[10px]">
            {product.brand}
          </span>
          <span className="text-[11px] truncate max-w-[120px] text-slate-600">
            {product.subcategory}
          </span>
        </div>

        {/* Title */}
        <Link
          to={`/product/${product.slug}`}
          className="text-sm font-semibold text-slate-800 hover:text-[#144333] line-clamp-2 leading-snug transition-colors mb-2 min-h-[2.5rem]"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="mb-3">
          <Rating rating={product.rating} reviewCount={product.reviewCount} size="sm" />
        </div>

        {/* Price & Action Row */}
        <div className="mt-auto pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold text-[#0F3427]">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-500 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            <p className="text-[10px] text-emerald-800 font-medium">
              {product.deliveryInfo}
            </p>
          </div>

          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95 ${
              inCart
                ? 'bg-[#E2EBE6] text-[#0F3427] hover:bg-[#D1FADF]'
                : 'bg-[#0F3427] text-white hover:bg-[#144333] shadow-sm'
            }`}
          >
            {inCart ? (
              <>
                <Check className="w-3.5 h-3.5 text-fresh-600 stroke-[3]" />
                <span>Added ({cartItem?.quantity})</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
