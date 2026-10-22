import React, { useState } from 'react';
import { Plus, Check, ShoppingBag } from 'lucide-react';
import { Product } from '../../types/product';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { ImageWithFallback } from '../common/ImageWithFallback';
import { formatCurrency } from '../../utils/formatters';

interface FrequentlyBoughtTogetherProps {
  currentProduct: Product;
  bundleProducts: Product[];
}

export const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps> = ({
  currentProduct,
  bundleProducts
}) => {
  const { addToCart } = useCart();
  const { success } = useToast();

  const allItems = [currentProduct, ...bundleProducts.slice(0, 2)];
  const [selectedIds, setSelectedIds] = useState<string[]>(allItems.map(p => p.id));

  const toggleProduct = (id: string) => {
    if (id === currentProduct.id) return; // base product always included
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectedItems = allItems.filter(p => selectedIds.includes(p.id));
  const bundleTotal = selectedItems.reduce((sum, p) => sum + p.price, 0);
  const bundleOriginalTotal = selectedItems.reduce((sum, p) => sum + p.originalPrice, 0);
  const bundleSavings = Math.max(0, bundleOriginalTotal - bundleTotal);

  const handleAddBundleToCart = () => {
    selectedItems.forEach(item => {
      addToCart(item, 1);
    });
    success(`Added bundle (${selectedItems.length} items) to your cart!`);
  };

  if (bundleProducts.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-950/5 shadow-subtle my-10">
      <h3 className="text-lg font-bold text-[#0F3427] mb-2">
        Frequently Bought Together
      </h3>
      <p className="text-xs text-slate-500 mb-6">
        Curated companions designed to complement your everyday routine
      </p>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        {/* Visual Item Chain */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {allItems.map((prod, idx) => (
            <React.Fragment key={prod.id}>
              {idx > 0 && (
                <div className="text-slate-300">
                  <Plus className="w-5 h-5" />
                </div>
              )}
              <div
                onClick={() => toggleProduct(prod.id)}
                className={`relative group cursor-pointer p-2 rounded-2xl border transition-all ${
                  selectedIds.includes(prod.id)
                    ? 'border-emerald-600/40 bg-emerald-50/20'
                    : 'border-slate-200 bg-white opacity-50'
                }`}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-neutral-100 relative">
                  <ImageWithFallback
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                  />
                  {selectedIds.includes(prod.id) && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#12B76A] text-white flex items-center justify-center shadow-sm">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div className="mt-2 w-20 sm:w-24 text-center">
                  <p className="text-[11px] font-bold text-slate-800 truncate">{prod.name}</p>
                  <p className="text-xs font-bold text-[#0F3427]">{formatCurrency(prod.price)}</p>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Bundle Summary & CTA */}
        <div className="w-full lg:w-72 bg-neutral-50 rounded-2xl p-5 border border-slate-100 flex flex-col justify-between">
          <div className="space-y-1 mb-4">
            <span className="text-xs text-slate-500 font-medium">Bundle Price:</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#0F3427]">
                {formatCurrency(bundleTotal)}
              </span>
              {bundleSavings > 0 && (
                <span className="text-xs text-slate-400 line-through">
                  {formatCurrency(bundleOriginalTotal)}
                </span>
              )}
            </div>
            {bundleSavings > 0 && (
              <p className="text-xs font-semibold text-fresh-700">
                You save {formatCurrency(bundleSavings)}
              </p>
            )}
          </div>

          <button
            onClick={handleAddBundleToCart}
            className="w-full py-3 bg-[#0F3427] hover:bg-[#144333] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4 text-fresh-400" />
            <span>Add All {selectedItems.length} to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
