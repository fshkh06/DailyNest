import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { useWishlist } from '../context/WishlistContext';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { useToast } from '../context/ToastContext';
import { AddressModal } from '../components/checkout/AddressModal';
import { ProductCard } from '../components/common/ProductCard';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Address } from '../types/address';
import {
  User,
  Package,
  Heart,
  MapPin,
  Clock,
  Settings,
  LogOut,
  Bell,
  Plus,
  Trash2,
  Edit2,
  Check,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const { user, isAuthenticated, logout } = useAuth();
  const { orders, addresses, deleteAddress, setDefaultAddress } = useOrder();
  const { wishlistProducts } = useWishlist();
  const { recentProducts } = useRecentlyViewed();
  const { success } = useToast();
  const navigate = useNavigate();

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleEditAddress = (addr: Address) => {
    setEditingAddress(addr);
    setIsAddressModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="py-10 bg-[#F8FAF8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Profile Summary Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-950/5 shadow-subtle flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-[#0F3427] flex items-center justify-center font-extrabold text-2xl border-2 border-emerald-200 overflow-hidden shadow-sm">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user?.name?.[0]?.toUpperCase() || 'A'
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#144333] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                DailyNest Member
              </span>
              <h1 className="text-2xl font-extrabold text-[#0F3427] mt-1">
                {user?.name || 'Alex Johnson'}
              </h1>
              <p className="text-xs text-slate-500">{user?.email || 'alex@dailynest.com'}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-600">
                <span>{orders.length} Orders</span>
                <span>&bull;</span>
                <span>{wishlistProducts.length} Wishlist</span>
                <span>&bull;</span>
                <span>{addresses.length} Addresses</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Dashboard Grid (Sidebar Tabs + Tab View Content) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tabs Menu Column */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-3 border border-emerald-950/5 shadow-subtle space-y-1">
            {[
              { id: 'profile', label: 'My Profile', icon: User },
              { id: 'orders', label: 'My Orders', icon: Package, count: orders.length },
              { id: 'wishlist', label: 'Wishlist', icon: Heart, count: wishlistProducts.length },
              { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: addresses.length },
              { id: 'recent', label: 'Recently Viewed', icon: Clock },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#0F3427] text-white shadow-sm'
                      : 'text-slate-600 hover:bg-emerald-50/60 hover:text-[#0F3427]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content Display Column */}
          <div className="lg:col-span-9">
            {/* Tab: Profile */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/5 shadow-subtle space-y-6">
                <h3 className="text-lg font-bold text-[#0F3427]">Profile Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-slate-100">
                    <span className="text-slate-400 font-semibold block mb-1">Full Name</span>
                    <span className="text-sm font-bold text-slate-800">{user?.name || 'Alex Johnson'}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-slate-100">
                    <span className="text-slate-400 font-semibold block mb-1">Email Address</span>
                    <span className="text-sm font-bold text-slate-800">{user?.email || 'alex@dailynest.com'}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-slate-100">
                    <span className="text-slate-400 font-semibold block mb-1">Account Provider</span>
                    <span className="text-sm font-bold text-slate-800 uppercase">{user?.provider || 'local'}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-neutral-50 border border-slate-100">
                    <span className="text-slate-400 font-semibold block mb-1">Member Since</span>
                    <span className="text-sm font-bold text-slate-800">March 2026</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-3 text-xs text-[#0F3427]">
                  <ShieldCheck className="w-5 h-5 text-fresh-600 flex-shrink-0" />
                  <span>Your account data and session preferences are managed securely on your local device.</span>
                </div>
              </div>
            )}

            {/* Tab: Orders */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/5 shadow-subtle space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-[#0F3427]">My Orders</h3>
                  <Link to="/orders" className="text-xs font-bold text-[#144333] hover:underline">
                    View Live Tracker
                  </Link>
                </div>

                {orders.length === 0 ? (
                  <div className="py-12 text-center space-y-3">
                    <Package className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-sm font-bold text-slate-700">No orders placed yet</p>
                    <Link to="/" className="text-xs font-bold text-[#144333] underline">
                      Start browsing catalog
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(order => (
                      <div
                        key={order.id}
                        className="p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#0F3427]">{order.id}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-fresh-100 text-fresh-800">
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            {formatDate(order.createdAt)} &bull; {order.items.length} items &bull; Total: {formatCurrency(order.total)}
                          </p>
                        </div>
                        <Link
                          to={`/orders?track=${order.id}`}
                          className="px-4 py-2 bg-[#0F3427] hover:bg-[#144333] text-white rounded-xl text-xs font-bold flex items-center gap-1 self-start sm:self-auto shadow-sm"
                        >
                          <span>Track Order</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Saved Addresses */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/5 shadow-subtle space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-[#0F3427]">Saved Addresses</h3>
                  <button
                    onClick={() => {
                      setEditingAddress(null);
                      setIsAddressModalOpen(true);
                    }}
                    className="px-4 py-2 bg-[#0F3427] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-[#144333]"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Address
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map(addr => (
                    <div key={addr.id} className="p-5 rounded-2xl border border-slate-200 space-y-3 relative">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-lg bg-neutral-100 text-[10px] font-bold uppercase text-slate-700">
                          {addr.addressType}
                        </span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 rounded-lg bg-fresh-100 text-fresh-800 text-[10px] font-bold">
                            Default
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600">
                        <p className="font-bold text-slate-900 text-sm">{addr.fullName}</p>
                        <p>{addr.houseFlat}, {addr.street}</p>
                        <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                        <p className="text-slate-400 font-mono mt-1">{addr.mobileNumber}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        {!addr.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-xs font-bold text-[#144333] hover:underline"
                          >
                            Set Default
                          </button>
                        )}
                        <div className="flex items-center gap-2 ml-auto">
                          <button
                            onClick={() => handleEditAddress(addr)}
                            className="p-1.5 text-slate-400 hover:text-slate-700"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteAddress(addr.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Wishlist */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/5 shadow-subtle space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-[#0F3427]">Wishlist Items</h3>
                  <Link to="/wishlist" className="text-xs font-bold text-[#144333] hover:underline">
                    Manage Wishlist
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {wishlistProducts.slice(0, 6).map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Recently Viewed */}
            {activeTab === 'recent' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/5 shadow-subtle space-y-6">
                <h3 className="text-lg font-bold text-[#0F3427]">Recently Viewed</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {recentProducts.slice(0, 6).map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Notifications */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/5 shadow-subtle space-y-4">
                <h3 className="text-lg font-bold text-[#0F3427]">Notifications</h3>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="py-3 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-fresh-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">Welcome to DailyNest!</p>
                      <p className="text-slate-500 mt-0.5">Use code WELCOME10 for 10% off on your first order above $40.</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">Just now</span>
                    </div>
                  </div>
                  <div className="py-3 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-slate-800">Free Expedited Delivery Active</p>
                      <p className="text-slate-500 mt-0.5">Free delivery unlocked on all qualifying carts above $50.</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">Today</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Settings */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/5 shadow-subtle space-y-6">
                <h3 className="text-lg font-bold text-[#0F3427]">Account Settings</h3>
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50">
                    <div>
                      <p className="font-bold text-slate-800">Order Updates & SMS Alerts</p>
                      <p className="text-slate-500">Receive live delivery milestones and dispatch notices.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded text-[#0F3427]" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50">
                    <div>
                      <p className="font-bold text-slate-800">Seasonal Journal & New Arrivals</p>
                      <p className="text-slate-500">Weekly curations from the DailyNest editor.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded text-[#0F3427]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        editingAddress={editingAddress}
      />
    </div>
  );
};
