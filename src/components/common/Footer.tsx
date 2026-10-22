import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Truck, RefreshCw, Award, Heart, Mail, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const Footer: React.FC = () => {
  const { success } = useToast();
  const [email, setEmail] = React.useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      success('Thank you for subscribing to DailyNest curations & exclusive perks!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#082118] text-white pt-16 pb-12 border-t border-emerald-900/50">
      {/* Value Proposition Highlights Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-emerald-900/40">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/40 border border-emerald-700/30 flex items-center justify-center flex-shrink-0 text-fresh-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Free Expedited Delivery</h4>
              <p className="text-xs text-emerald-300/70">On all qualifying orders over $50</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/40 border border-emerald-700/30 flex items-center justify-center flex-shrink-0 text-fresh-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Authentic & Verified</h4>
              <p className="text-xs text-emerald-300/70">100% genuine tested lifestyle products</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/40 border border-emerald-700/30 flex items-center justify-center flex-shrink-0 text-fresh-400">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Hassle-Free 30-Day Returns</h4>
              <p className="text-xs text-emerald-300/70">No questions asked return guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/40 border border-emerald-700/30 flex items-center justify-center flex-shrink-0 text-fresh-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">1,500+ Curated Products</h4>
              <p className="text-xs text-emerald-300/70">Across 7 everyday living categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-fresh-500 flex items-center justify-center shadow-md">
                <span className="w-4 h-4 rounded-full border-2 border-[#0F3427]" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white flex items-center">
                Daily<span className="text-[#12B76A]">Nest</span>
              </span>
            </Link>
            <p className="text-sm text-emerald-100/70 max-w-sm leading-relaxed">
              <strong>“Everything you need. Every day.”</strong> DailyNest is your destination for carefully designed lifestyle staples, ergonomic furniture, smart devices, conscious beauty, and timeless apparel.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-2">
                Join the Nest Journal
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex max-w-sm items-center gap-2">
                <div className="relative flex-grow">
                  <Mail className="w-4 h-4 text-emerald-400/60 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-emerald-950/80 border border-emerald-800/80 rounded-xl text-white placeholder:text-emerald-400/50 focus:outline-none focus:border-fresh-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-fresh-500 hover:bg-fresh-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-md"
                >
                  Join <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Explore Catalog
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-100/70">
              <li><Link to="/category/home-living" className="hover:text-fresh-400 transition-colors">Home & Living</Link></li>
              <li><Link to="/category/kitchen-dining" className="hover:text-fresh-400 transition-colors">Kitchen & Dining</Link></li>
              <li><Link to="/category/electronics-tech" className="hover:text-fresh-400 transition-colors">Electronics & Tech</Link></li>
              <li><Link to="/category/fashion-accessories" className="hover:text-fresh-400 transition-colors">Fashion & Accessories</Link></li>
              <li><Link to="/category/personal-care-beauty" className="hover:text-fresh-400 transition-colors">Personal Care & Beauty</Link></li>
              <li><Link to="/category/travel-lifestyle" className="hover:text-fresh-400 transition-colors">Travel & Lifestyle</Link></li>
              <li><Link to="/category/gifts-stationery" className="hover:text-fresh-400 transition-colors">Gifts & Stationery</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-100/70">
              <li><Link to="/orders" className="hover:text-fresh-400 transition-colors">Track Your Order</Link></li>
              <li><Link to="/account?tab=orders" className="hover:text-fresh-400 transition-colors">Order History</Link></li>
              <li><Link to="/account?tab=addresses" className="hover:text-fresh-400 transition-colors">Saved Addresses</Link></li>
              <li><Link to="/wishlist" className="hover:text-fresh-400 transition-colors">My Wishlist</Link></li>
              <li><Link to="/cart" className="hover:text-fresh-400 transition-colors">View Cart</Link></li>
              <li><span className="text-emerald-400/50 cursor-pointer hover:text-fresh-400">Delivery Information</span></li>
              <li><span className="text-emerald-400/50 cursor-pointer hover:text-fresh-400">Return Policy</span></li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-100/70">
              <li><span className="text-emerald-400/50 cursor-pointer hover:text-fresh-400">About DailyNest</span></li>
              <li><span className="text-emerald-400/50 cursor-pointer hover:text-fresh-400">Sustainability Pledge</span></li>
              <li><span className="text-emerald-400/50 cursor-pointer hover:text-fresh-400">Privacy Policy</span></li>
              <li><span className="text-emerald-400/50 cursor-pointer hover:text-fresh-400">Terms of Service</span></li>
              <li><span className="text-emerald-400/50 cursor-pointer hover:text-fresh-400">Refund Guidelines</span></li>
              <li><span className="text-emerald-400/50 cursor-pointer hover:text-fresh-400">Contact Us</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-emerald-900/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400/60">
        <p className="flex items-center gap-1">
          &copy; {new Date().getFullYear()} DailyNest Inc. All rights reserved. Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for everyday shoppers.
        </p>
        <div className="flex items-center gap-6">
          <span>Local Storage Architecture</span>
          <span>&bull;</span>
          <span>1,500+ Verified Products</span>
          <span>&bull;</span>
          <span className="text-fresh-400">Secure Client State</span>
        </div>
      </div>
    </footer>
  );
};
