import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Users, 
  MapPin, 
  Phone, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert 
} from 'lucide-react';
import { TricolorStrip } from './Emblems';

export default function SosModal({ isOpen, onClose, onSubmitSos }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    requesterName: '',
    contactPhone: '',
    state: 'Assam',
    district: 'Kamrup Metropolitan',
    villageOrArea: '',
    landmark: '',
    needType: 'RESCUE',
    peopleCount: 1,
    description: '',
    vulnerabilities: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const neDistricts = {
    'Assam': ['Kamrup Metropolitan', 'Cachar', 'Dhemaji', 'Dibrugarh', 'Nagaon', 'Barpeta', 'Goalpara', 'Morigaon', 'Dhubri'],
    'Meghalaya': ['East Khasi Hills', 'West Khasi Hills', 'Ri-Bhoi', 'East Jaintia Hills', 'West Garo Hills'],
    'Arunachal Pradesh': ['Papum Pare', 'East Siang', 'West Kameng', 'Changlang', 'Tawang'],
    'Manipur': ['Imphal East', 'Imphal West', 'Tengnoupal', 'Churachandpur', 'Thoubal'],
    'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Kolasib', 'Serchhip'],
    'Nagaland': ['Kohima', 'Dimapur', 'Chümoukedima', 'Mokokchung', 'Wokha'],
    'Tripura': ['West Tripura', 'Unakoti', 'Dhalai', 'South Tripura'],
    'Sikkim': ['East Sikkim', 'West Sikkim', 'North Sikkim', 'South Sikkim']
  };

  const handleVulnerabilityToggle = (val) => {
    setFormData(prev => {
      const exists = prev.vulnerabilities.includes(val);
      return {
        ...prev,
        vulnerabilities: exists 
          ? prev.vulnerabilities.filter(v => v !== val)
          : [...prev.vulnerabilities, val]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    onSubmitSos(formData);
    setTimeout(() => {
      setIsSubmitting(false);
      onClose();
    }, 500);
  };

  // Real-time AI preview calculation
  const desc = formData.description.toLowerCase();
  const isRoofOrWater = desc.includes('roof') || desc.includes('rising') || desc.includes('submerged') || desc.includes('trapped');
  const hasVulnerable = formData.vulnerabilities.length > 0 || desc.includes('infant') || desc.includes('elderly') || desc.includes('insulin');
  const predictedUrgency = (isRoofOrWater && hasVulnerable) || formData.needType === 'RESCUE'
    ? 'CRITICAL_SOS'
    : hasVulnerable || formData.needType === 'MEDICAL'
      ? 'HIGH'
      : 'MEDIUM';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col border border-slate-300 overflow-hidden my-auto">
        {/* Official Government Header */}
        <div className="bg-gov-navy text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gov-red p-2 rounded-lg text-white">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-gov-saffron text-slate-950 text-[10px] font-black uppercase px-1.5 py-0.2 rounded">
                  NDMA SOS
                </span>
                <span className="text-[11px] text-slate-300 font-semibold">Incident Response Form</span>
              </div>
              <h3 className="font-black text-base text-white">Emergency Assistance / SOS Incident Dispatch</h3>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-gov-blue rounded-lg text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <TricolorStrip className="h-1" />

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* AI Triage Real-Time Indicator */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gov-navy" />
              <div>
                <span className="font-semibold text-slate-700">Automated Triage Priority: </span>
                <span className={`font-black uppercase px-2 py-0.5 rounded text-[10px] ${
                  predictedUrgency === 'CRITICAL_SOS' 
                    ? 'bg-gov-red text-white' 
                    : predictedUrgency === 'HIGH'
                      ? 'bg-gov-saffron text-slate-950'
                      : 'bg-gov-navy text-white'
                }`}>
                  {predictedUrgency.replace('_', ' ')}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-slate-500 font-semibold">IRS 15m SLA Monitored</span>
          </div>

          {/* Need Category & People count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Type of Emergency Need *
              </label>
              <select
                value={formData.needType}
                onChange={(e) => setFormData({ ...formData, needType: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:ring-2 focus:ring-gov-navy focus:outline-none"
                required
              >
                <option value="RESCUE">🚤 Boat Rescue / Evacuation</option>
                <option value="MEDICAL">🩺 Urgent Medical / Insulin / Doctor</option>
                <option value="WATER">💧 Clean Drinking Water</option>
                <option value="FOOD">📦 Dry Food Rations / Baby Food</option>
                <option value="ELDERLY_BABY">👵 Elderly Care / Infant Diapers</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Number of People Affected *
              </label>
              <input
                type="number"
                min="1"
                max="500"
                value={formData.peopleCount}
                onChange={(e) => setFormData({ ...formData, peopleCount: parseInt(e.target.value) || 1 })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:ring-2 focus:ring-gov-navy focus:outline-none"
                required
              />
            </div>
          </div>

          {/* State and District */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">State *</label>
              <select
                value={formData.state}
                onChange={(e) => {
                  const newState = e.target.value;
                  const firstDist = (neDistricts[newState] || ['General'])[0];
                  setFormData({ ...formData, state: newState, district: firstDist });
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:ring-2 focus:ring-gov-navy focus:outline-none"
                required
              >
                {Object.keys(neDistricts).map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">District *</label>
              <select
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-semibold focus:ring-2 focus:ring-gov-navy focus:outline-none"
                required
              >
                {(neDistricts[formData.state] || []).map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Village / Area & Landmark */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Village / Ward / Street *</label>
              <input
                type="text"
                placeholder="e.g. Hatigaon, Ward 32"
                value={formData.villageOrArea}
                onChange={(e) => setFormData({ ...formData, villageOrArea: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Landmark / House Description *</label>
              <input
                type="text"
                placeholder="e.g. Near Namghar, yellow 2-storey house"
                value={formData.landmark}
                onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Contact Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Name / Contact Person *</label>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.requesterName}
                onChange={(e) => setFormData({ ...formData, requesterName: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (Direct) *</label>
              <input
                type="tel"
                placeholder="e.g. +91 94350 XXXXX"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Situation Description (What is happening right now?) *
            </label>
            <textarea
              rows="3"
              placeholder="e.g. Water is waist-deep on ground floor. We have moved to roof. Elderly mother needs insulin. Please send rescue boat before dark."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
              required
            />
          </div>

          {/* Vulnerability Checkboxes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Vulnerable Persons at Location (Select all that apply):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {[
                { id: 'infant', label: '👶 Infant / Child' },
                { id: 'pregnant', label: '🤰 Pregnant Woman' },
                { id: 'elderly', label: '👵 Elderly / Bedridden' },
                { id: 'injured', label: '🩹 Injured / Snakebite' },
                { id: 'submerged_home', label: '🌊 Trapped on Roof' },
                { id: 'clean_water_outage', label: '💧 No Drinking Water' }
              ].map(v => (
                <label key={v.id} className="flex items-center gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer text-slate-700 select-none hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.vulnerabilities.includes(v.id)}
                    onChange={() => handleVulnerabilityToggle(v.id)}
                    className="rounded text-gov-red focus:ring-gov-red"
                  />
                  <span>{v.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500 font-medium">
              Offline Queued • Relayed to District SEOC
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
                disabled={isSubmitting}
                className="bg-gov-red hover:bg-red-700 text-white font-black px-5 py-2.5 rounded-lg text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>{isSubmitting ? 'Transmitting SOS...' : 'Transmit SOS Alert'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}