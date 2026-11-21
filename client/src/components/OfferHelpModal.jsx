import React, { useState } from 'react';
import { X, HandHeart, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function OfferHelpModal({ isOpen, onClose, onSubmitOffer }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    providerName: '',
    contactPerson: '',
    contactPhone: '',
    state: 'Assam',
    district: 'Kamrup Metropolitan',
    serviceType: 'BOAT_RESCUE',
    capacityOrQuantity: '',
    locationDetails: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitOffer(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-300 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg text-white">
              <HandHeart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase px-1.5 py-0.5 rounded">
                  Volunteer Network
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">Resource Registry</span>
              </div>
              <h3 className="font-black text-base text-white">Register Volunteer & Logistics Resource</h3>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Resource / Service Offered *
            </label>
            <select
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:ring-2 focus:ring-gov-navy focus:outline-none"
              required
            >
              <option value="BOAT_RESCUE">🚤 Motorized Boat / Rescue Raft</option>
              <option value="4X4_TRANSPORT">🚙 4x4 Snorkel Truck / Tractor Transport</option>
              <option value="MEDICAL_STAFF">🩺 Doctor / Paramedic / Trauma Care Kit</option>
              <option value="RELIEF_SUPPLIES">📦 Food Rations / Drinking Water Pouches</option>
              <option value="SHELTER_SPACE">🏠 Private Hall / Community Room Shelter</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Organization / Group / Volunteer Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Guwahati Youth Volunteers / Dr. Roy Clinic"
              value={formData.providerName}
              onChange={(e) => setFormData({ ...formData, providerName: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contact Person *</label>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">District *</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Capacity / Quantity Details *
            </label>
            <input
              type="text"
              placeholder="e.g. 2 country boats (10 persons each) OR 500 packed meal boxes daily"
              value={formData.capacityOrQuantity}
              onChange={(e) => setFormData({ ...formData, capacityOrQuantity: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Current Staging Location & Deployment Range *
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Stationed at Silchar Park Road. Ready to deploy across flooded wards 1-12 immediately upon call."
              value={formData.locationDetails}
              onChange={(e) => setFormData({ ...formData, locationDetails: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs"
              required
            />
          </div>

          <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gov-green" />
              <span>Verified under DM Act 2005</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gov-green hover:bg-emerald-700 text-white font-black px-5 py-2.5 rounded-lg text-xs shadow-md transition-all active:scale-95"
              >
                Register Resource
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}