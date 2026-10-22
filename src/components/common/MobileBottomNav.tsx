import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Layers, Search, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { summary, openCartDrawer } = useCart();
  const { count: wishlistCount } = useWishlist();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-emerald-950/10 md:hidden pb-safe">
      <div className="grid grid-cols-5 h-16 items-center px-2">
        {/* Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            isActive('/') ? 'text-[#0F3427] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className={`w-5 h-5 ${isActive('/') ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px]">Home</span>
        </Link>

        {/* Categories */}
        <Link
          to="/category/home-living"
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            isActive('/category') ? 'text-[#0F3427] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className={`w-5 h-5 ${isActive('/category') ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px]">Categories</span>
        </Link>

        {/* Wishlist */}
        <Link
          to="/wishlist"
          className={`relative flex flex-col items-center justify-center gap-1 transition-colors ${
            isActive('/wishlist') ? 'text-[#0F3427] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${isActive('/wishlist') ? 'stroke-[2.5]' : 'stroke-2'}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Wishlist</span>
        </Link>

        {/* Cart Drawer Trigger */}
        <button
          onClick={openCartDrawer}
          className="relative flex flex-col items-center justify-center gap-1 text-slate-500 hover:text-slate-800"
          aria-label="Open Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-2" />
            {summary.totalItems > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-fresh-600 text-white text-[9px] font-bold flex items-center justify-center">
                {summary.totalItems}
              </span>
            )}
          </div>
          <span className="text-[10px]">Cart</span>
        </button>

        {/* Account */}
        <Link
          to="/account"
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            isActive('/account') ? 'text-[#0F3427] font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className={`w-5 h-5 ${isActive('/account') ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px]">Account</span>
        </Link>
      </div>
    </nav>
  );
};
