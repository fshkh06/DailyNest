import React, { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';
import { Address } from '../../types/address';
import { useOrder } from '../../context/OrderContext';
import { useToast } from '../../context/ToastContext';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingAddress?: Address | null;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  isOpen,
  onClose,
  editingAddress
}) => {
  const { addAddress, updateAddress } = useOrder();
  const { success } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    houseFlat: '',
    street: '',
    area: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    addressType: 'Home' as 'Home' | 'Work' | 'Other',
    isDefault: false
  });

  useEffect(() => {
    if (editingAddress) {
      setFormData({
        fullName: editingAddress.fullName,
        mobileNumber: editingAddress.mobileNumber,
        houseFlat: editingAddress.houseFlat,
        street: editingAddress.street,
        area: editingAddress.area,
        city: editingAddress.city,
        state: editingAddress.state,
        postalCode: editingAddress.postalCode,
        country: editingAddress.country,
        addressType: editingAddress.addressType,
        isDefault: editingAddress.isDefault
      });
    } else {
      setFormData({
        fullName: '',
        mobileNumber: '',
        houseFlat: '',
        street: '',
        area: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'United States',
        addressType: 'Home',
        isDefault: false
      });
    }
  }, [editingAddress, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.street.trim() || !formData.city.trim() || !formData.postalCode.trim()) {
      return;
    }

    if (editingAddress) {
      updateAddress(editingAddress.id, formData);
      success('Address updated successfully');
    } else {
      addAddress(formData);
      success('New delivery address saved');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-emerald-950/10 max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-[#0F3427]">
              <MapPin className="w-5 h-5 text-[#144333]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F3427]">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              <p className="text-xs text-slate-500">Provide accurate details for reliable shipping</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Alex Johnson"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F3427]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number *</label>
              <input
                type="tel"
                required
                value={formData.mobileNumber}
                onChange={e => setFormData({ ...formData, mobileNumber: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F3427]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Flat / House / Building *</label>
              <input
                type="text"
                required
                value={formData.houseFlat}
                onChange={e => setFormData({ ...formData, houseFlat: e.target.value })}
                placeholder="Apt 4B, Pinecrest"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F3427]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Street Address *</label>
              <input
                type="text"
                required
                value={formData.street}
                onChange={e => setFormData({ ...formData, street: e.target.value })}
                placeholder="742 Evergreen Terrace"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F3427]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={e => setFormData({ ...formData, city: e.target.value })}
                placeholder="Seattle"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F3427]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">State / Province</label>
              <input
                type="text"
                value={formData.state}
                onChange={e => setFormData({ ...formData, state: e.target.value })}
                placeholder="WA"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F3427]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Postal Code *</label>
              <input
                type="text"
                required
                value={formData.postalCode}
                onChange={e => setFormData({ ...formData, postalCode: e.target.value })}
                placeholder="98101"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F3427]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Address Type</label>
            <div className="flex gap-3">
              {(['Home', 'Work', 'Other'] as const).map(type => (
                <button
                  type="button"
                  key={type}
                  onClick={() => setFormData({ ...formData, addressType: type })}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                    formData.addressType === type
                      ? 'bg-[#0F3427] text-white border-[#0F3427]'
                      : 'bg-neutral-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={e => setFormData({ ...formData, isDefault: e.target.checked })}
                className="rounded text-[#0F3427] focus:ring-[#0F3427]"
              />
              <span className="text-xs text-slate-700 font-medium">Set as default delivery address</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0F3427] hover:bg-[#144333] text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
