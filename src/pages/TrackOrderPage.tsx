import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import {
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

export const TrackOrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const trackParam = searchParams.get('track');

  const { orders, advanceOrderStatus, getOrderById } = useOrder();
  const { success, info } = useToast();

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    trackParam || (orders[0]?.id ?? '')
  );

  const activeOrder = getOrderById(selectedOrderId) || orders[0];

  const handleAdvanceStatus = () => {
    if (!activeOrder) return;
    const updated = advanceOrderStatus(activeOrder.id);
    if (updated) {
      if (updated.status === 'Delivered') {
        success(`Order ${updated.id} has been marked as Delivered!`);
      } else {
        info(`Order ${updated.id} progress updated to: ${updated.status}`);
      }
    }
  };

  if (orders.length === 0) {
    return (
      <div className="py-20 bg-[#F8FAF8]">
        <div className="max-w-md mx-auto px-4 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-[#144333] mx-auto flex items-center justify-center">
            <Package className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#0F3427]">No Orders Found Yet</h1>
            <p className="text-xs text-slate-500 mt-2">
              You haven't placed any orders yet. Once you place an order, you can track real-time delivery milestones here.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F3427] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#144333]"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 bg-[#F8FAF8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0F3427] tracking-tight">
            Order Tracking & History
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time fulfillment telemetry for all locally saved DailyNest purchases
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Orders Master List (Left Column) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-emerald-950/5 shadow-subtle space-y-4">
            <h3 className="text-sm font-bold text-[#0F3427] uppercase tracking-wider">
              Recent Orders ({orders.length})
            </h3>

            <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
              {orders.map(order => {
                const isSelected = activeOrder?.id === order.id;
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#0F3427] bg-emerald-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-[#0F3427]">
                        {order.id}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'Delivered'
                            ? 'bg-fresh-100 text-fresh-800'
                            : 'bg-emerald-100 text-[#0F3427]'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-600">
                      <p className="font-medium text-slate-800">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''} &bull; Total: {formatCurrency(order.total)}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Order Detailed Tracking Timeline (Right Column) */}
          {activeOrder && (
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/5 shadow-subtle space-y-6">
              {/* Header Status Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-[#144333]">
                    {activeOrder.id}
                  </span>
                  <h2 className="text-xl font-bold text-[#0F3427] mt-0.5">
                    Status: {activeOrder.status}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Estimated Delivery: <strong>{activeOrder.estimatedDeliveryDate}</strong>
                  </p>
                </div>

                {/* Simulated Shipment Advance Button */}
                {activeOrder.status !== 'Delivered' && (
                  <button
                    onClick={handleAdvanceStatus}
                    className="px-4 py-2.5 bg-fresh-600 hover:bg-fresh-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 self-start sm:self-auto"
                    title="Click to simulate shipment moving to the next stage"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Advance Status (Simulate)</span>
                  </button>
                )}
              </div>

              {/* Visual Step Timeline */}
              <div className="py-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
                  Shipment Progress Timeline
                </h4>

                <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {activeOrder.trackingHistory.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-4">
                      {/* Node Icon */}
                      <div
                        className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                          step.completed
                            ? 'bg-[#12B76A] text-white shadow-sm ring-4 ring-fresh-100'
                            : step.current
                            ? 'bg-[#0F3427] text-white ring-4 ring-emerald-100 animate-pulse'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>

                      <div className="flex-grow">
                        <div className="flex items-baseline justify-between">
                          <h4
                            className={`text-sm font-bold ${
                              step.completed || step.current ? 'text-[#0F3427]' : 'text-slate-400'
                            }`}
                          >
                            {step.status}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {step.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Courier & Destination details */}
              <div className="p-4 rounded-2xl bg-neutral-50/80 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-500 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#144333]" /> Courier Partner:
                  </span>
                  <p className="font-bold text-slate-800 mt-1">DailyNest Express Logistics</p>
                  <p className="text-[11px] text-slate-400">Tracking: DNE-{activeOrder.id.replace('DN-', '')}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#144333]" /> Delivering to:
                  </span>
                  <p className="font-bold text-slate-800 mt-1">{activeOrder.shippingAddress.fullName}</p>
                  <p className="text-slate-600 truncate">{activeOrder.shippingAddress.street}, {activeOrder.shippingAddress.city}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
