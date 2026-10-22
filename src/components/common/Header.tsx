import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Heart,
  User as UserIcon,
  MapPin,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  LogOut,
  Package,
  Layers
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import { CATEGORIES_DATA } from '../../data/categories';
import { SearchBar } from './SearchBar';

export const Header: React.FC = () => {
  const { summary, openCartDrawer } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const { selectedAddress } = useOrder();
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const categoryMenuRef = useRef<HTMLDivElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close menus on route change
  useEffect(() => {
    setIsCategoryMenuOpen(false);
    setIsAccountMenuOpen(false);
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  // Click outside listener
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(e.target as Node)) {
        setIsCategoryMenuOpen(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <>
      {/* Top Banner Notice */}
      <div className="bg-[#0F3427] text-white text-[12px] font-medium py-1.5 px-4 text-center tracking-wide border-b border-[#144333]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-fresh-400 animate-pulse" />
            <span>Spring Edition: Free expedited delivery on orders over $50</span>
          </div>
          <div className="w-full sm:w-auto text-center sm:text-right flex items-center justify-center gap-4">
            <span className="text-emerald-200">Use code <strong className="text-white underline">WELCOME10</strong> for 10% off</span>
            <span className="hidden md:inline text-white/40">|</span>
            <Link to="/orders" className="hidden md:inline hover:text-fresh-300 transition-colors">
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-950/10 shadow-subtle transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-20">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-[#0F3427] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                  <div className="w-5 h-5 rounded-full border-2 border-fresh-400 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-extrabold tracking-tight text-[#0F3427] flex items-center">
                    Daily<span className="text-[#12B76A]">Nest</span>
                  </span>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-[#144333]/80 -mt-1 hidden sm:block">
                    Everything you need. Every day.
                  </p>
                </div>
              </Link>

              {/* Location Selector (Desktop) */}
              <button
                onClick={() => setIsLocationModalOpen(true)}
                className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50/70 hover:bg-emerald-100/60 border border-emerald-950/5 text-xs text-slate-700 transition-colors"
                title="Select delivery location"
              >
                <MapPin className="w-3.5 h-3.5 text-[#144333]" />
                <div className="text-left leading-tight">
                  <span className="block text-[10px] text-slate-500 font-medium">Deliver to</span>
                  <span className="font-bold text-[#0F3427] max-w-[120px] truncate block">
                    {selectedAddress ? `${selectedAddress.city}, ${selectedAddress.postalCode}` : 'Select City'}
                  </span>
                </div>
              </button>
            </div>

            {/* Search Bar (Desktop & Tablet) */}
            <div className="hidden md:block flex-1 max-w-xl mx-4">
              <SearchBar />
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Account Dropdown */}
              <div ref={accountMenuRef} className="relative">
                <button
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-emerald-50/60 text-slate-700 hover:text-[#0F3427] transition-all"
                  aria-label="User Account"
                >
                  <div className="w-9 h-9 rounded-full bg-emerald-100/80 text-[#0F3427] flex items-center justify-center font-bold text-sm border border-emerald-950/10 overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-4 h-4 text-[#0F3427]" />
                    )}
                  </div>
                  <div className="hidden lg:block text-left text-xs leading-tight">
                    <span className="text-[10px] text-slate-500 font-medium block">
                      {isAuthenticated ? 'Welcome back,' : 'Sign in'}
                    </span>
                    <span className="font-bold text-[#0F3427] truncate max-w-[100px] block">
                      {isAuthenticated ? user?.name.split(' ')[0] : 'My Account'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden lg:block" />
                </button>

                {/* Account Dropdown Menu */}
                {isAccountMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-dropdown border border-emerald-950/10 p-2 z-50 animate-slide-up">
                    {isAuthenticated ? (
                      <div>
                        <div className="p-3 bg-emerald-50/60 rounded-xl mb-2">
                          <p className="text-xs font-semibold text-slate-500">Signed in as</p>
                          <p className="text-sm font-bold text-[#0F3427] truncate">{user?.name}</p>
                          <p className="text-xs text-slate-600 truncate">{user?.email}</p>
                        </div>
                        <Link
                          to="/account"
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50/60 rounded-xl transition-colors font-medium"
                        >
                          <UserIcon className="w-4 h-4 text-[#144333]" /> My Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50/60 rounded-xl transition-colors font-medium"
                        >
                          <Package className="w-4 h-4 text-[#144333]" /> My Orders & Tracking
                        </Link>
                        <Link
                          to="/wishlist"
                          className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50/60 rounded-xl transition-colors font-medium"
                        >
                          <Heart className="w-4 h-4 text-[#144333]" /> My Wishlist
                        </Link>
                        <div className="border-t border-slate-100 my-1" />
                        <button
                          onClick={() => {
                            logout();
                            setIsAccountMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-medium text-left"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    ) : (
                      <div className="p-3">
                        <p className="text-xs text-slate-500 mb-3 font-medium">
                          Sign in to manage your orders, saved addresses, and wishlist.
                        </p>
                        <Link
                          to="/login"
                          className="block w-full py-2.5 px-4 bg-[#0F3427] hover:bg-[#144333] text-white text-center text-xs font-bold rounded-xl transition-colors shadow-sm mb-2"
                        >
                          Log In
                        </Link>
                        <Link
                          to="/register"
                          className="block w-full py-2 px-4 bg-emerald-50 hover:bg-emerald-100 text-[#0F3427] text-center text-xs font-bold rounded-xl transition-colors border border-emerald-950/10"
                        >
                          Create Free Account
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist Link */}
              <Link
                to="/wishlist"
                aria-label={`Wishlist with ${wishlistCount} items`}
                className="relative p-2.5 rounded-xl hover:bg-emerald-50/60 text-slate-700 hover:text-[#0F3427] transition-all"
              >
                <Heart className="w-5 h-5 text-slate-700" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Drawer Trigger */}
              <button
                onClick={openCartDrawer}
                aria-label={`Shopping cart with ${summary.totalItems} items`}
                className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0F3427] text-white hover:bg-[#144333] shadow-md transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-fresh-400" />
                <span className="text-xs font-bold hidden sm:inline">Cart</span>
                <span className="w-5 h-5 rounded-full bg-fresh-500 text-white text-[11px] font-bold flex items-center justify-center">
                  {summary.totalItems}
                </span>
              </button>

              {/* Mobile Hamburger Menu */}
              <button
                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                className="p-2 rounded-xl text-slate-700 hover:bg-emerald-50 md:hidden"
                aria-label="Toggle navigation menu"
              >
                {isMobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Category Navigation Bar (Desktop) */}
          <div className="hidden md:flex items-center justify-between border-t border-emerald-950/5 py-2.5">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {/* All Categories Mega Dropdown Button */}
              <div ref={categoryMenuRef} className="relative">
                <button
                  onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0F3427] text-white text-xs font-bold hover:bg-[#144333] transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-fresh-400" />
                  <span>All Categories</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {/* Categories Mega Dropdown */}
                {isCategoryMenuOpen && (
                  <div className="absolute top-full left-0 mt-3 w-[720px] bg-white rounded-2xl shadow-dropdown border border-emerald-950/10 p-6 z-50 animate-slide-up grid grid-cols-3 gap-6">
                    {CATEGORIES_DATA.map(cat => (
                      <div key={cat.id} className="group">
                        <Link
                          to={`/category/${cat.slug}`}
                          className="flex items-center gap-2 text-xs font-bold text-[#0F3427] hover:text-[#12B76A] mb-2 uppercase tracking-wider"
                        >
                          <span className="w-2 h-2 rounded-full bg-[#12B76A]" />
                          {cat.name}
                        </Link>
                        <ul className="space-y-1 pl-4 border-l border-emerald-100">
                          {cat.subcategories.slice(0, 4).map(sub => (
                            <li key={sub}>
                              <Link
                                to={`/category/${cat.slug}?sub=${encodeURIComponent(sub)}`}
                                className="text-xs text-slate-500 hover:text-[#0F3427] transition-colors hover:underline block truncate"
                              >
                                {sub}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Direct Category Links */}
              {CATEGORIES_DATA.map(cat => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-[#0F3427] hover:bg-emerald-50/70 transition-colors whitespace-nowrap"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Deals link on right */}
            <Link
              to="/deals"
              className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200/60 hover:bg-amber-100 transition-colors flex-shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Today's Deals</span>
            </Link>
          </div>

          {/* Search bar for Mobile (below header row) */}
          <div className="pb-3 md:hidden">
            <SearchBar placeholder="Search 1,500+ products..." />
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="md:hidden border-t border-emerald-950/10 bg-white px-4 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Shop by Category</span>
              <Link to="/deals" className="text-xs font-bold text-amber-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Today's Deals
              </Link>
            </div>

            <div className="space-y-1">
              {CATEGORIES_DATA.map(cat => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-[#0F3427]"
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-slate-400">{cat.itemCount} items</span>
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <Link
                to="/orders"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                <Package className="w-4 h-4 text-[#144333]" /> Track Orders
              </Link>
              <Link
                to="/account"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                <UserIcon className="w-4 h-4 text-[#144333]" /> My Account
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Location Picker Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-emerald-950/10 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-[#0F3427]">
                  <MapPin className="w-5 h-5 text-[#144333]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F3427]">Delivery Location</h3>
                  <p className="text-xs text-slate-500">Choose where to deliver your DailyNest items</p>
                </div>
              </div>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="p-3.5 rounded-2xl border-2 border-[#12B76A] bg-emerald-50/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F3427] uppercase">Current Default</span>
                  <span className="text-xs font-semibold text-[#12B76A]">Selected</span>
                </div>
                <p className="text-sm font-bold text-slate-800 mt-1">
                  {selectedAddress?.fullName || 'Alex Johnson'}
                </p>
                <p className="text-xs text-slate-600 mt-0.5">
                  {selectedAddress?.street}, {selectedAddress?.city}, {selectedAddress?.state} {selectedAddress?.postalCode}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsLocationModalOpen(false);
                navigate('/account?tab=addresses');
              }}
              className="w-full py-2.5 bg-[#0F3427] hover:bg-[#144333] text-white rounded-xl text-xs font-bold transition-colors"
            >
              Manage Saved Addresses
            </button>
          </div>
        </div>
      )}
    </>
  );
};
