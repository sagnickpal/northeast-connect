import React, { useState } from 'react';
import { 
  AlertTriangle, 
  HandHeart, 
  MapPin, 
  Phone, 
  Users, 
  Clock, 
  CheckCircle2, 
  LifeBuoy, 
  Truck, 
  Stethoscope, 
  Package, 
  Home, 
  Sparkles, 
  Copy, 
  Check, 
  PlusCircle, 
  ShieldCheck, 
  Flame, 
  ArrowRight,
  Filter,
  PhoneCall
} from 'lucide-react';
import { uiTranslations } from '../data/translations';
import { TricolorStrip } from './Emblems';

export default function TwoWayCoordination({
  requests,
  offers,
  onOpenSos,
  onOpenOffer,
  onUpdateRequestStatus,
  currentLang,
  initialSubTab = 'requests'
}) {
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab); // requests, offers
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);

  // Sync sub-tab when user navigates via top navigation
  React.useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const t = uiTranslations[currentLang] || uiTranslations.en;

  const filteredRequests = requests.filter(r => {
    if (urgencyFilter === 'ALL') return true;
    return r.urgency === urgencyFilter;
  });

  const handleCopyDetails = (req) => {
    const text = `🚨 RESCUE SOS: ${req.id} (${req.urgency})
📍 Location: ${req.villageOrArea}, ${req.district}, ${req.state}
🏠 Landmark: ${req.landmark}
👥 People: ${req.peopleCount} (${(req.vulnerabilities || []).join(', ')})
📞 Contact: ${req.contactPhone} (${req.requesterName})
📝 Need: ${req.description}`;
    navigator.clipboard.writeText(text);
    setCopiedId(req.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Official Government Incident Coordination Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gov-navy text-white px-5 py-4 border-b border-gov-blue">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-gov-saffron text-slate-950 font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wide">
                  Incident Response System (IRS)
                </span>
                <span className="text-slate-300 text-xs font-semibold">
                  Civil Protection & Community Operations
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                <span>आपदा राहत एवं नागरिक सहायता समन्वय</span>
                <span className="text-gov-saffron font-light hidden md:inline">|</span>
                <span className="text-slate-200 text-lg md:text-xl font-bold hidden md:inline">Citizen SOS & Relief Coordination</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Real-time citizen distress queue with automated AI triage and community volunteer logistics registry.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {activeSubTab === 'requests' ? (
                <button
                  onClick={onOpenSos}
                  className="bg-gov-red hover:bg-red-700 text-white text-xs font-black px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-md transition-all active:scale-95 border border-red-500"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Transmit New SOS Request</span>
                </button>
              ) : (
                <button
                  onClick={onOpenOffer}
                  className="bg-gov-green hover:bg-emerald-700 text-white text-xs font-black px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-md transition-all active:scale-95 border border-emerald-500"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Register Volunteer / Logistics Offer</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <TricolorStrip className="h-1" />

        {/* Sub-Header Tabs */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveSubTab('requests')}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${
                activeSubTab === 'requests'
                  ? 'bg-gov-navy text-white shadow-md border-b-2 border-gov-red'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <AlertTriangle className={`w-4 h-4 ${activeSubTab === 'requests' ? 'text-red-400' : 'text-gov-red'}`} />
              <span>Citizen SOS Queue</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                activeSubTab === 'requests' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {requests.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('offers')}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${
                activeSubTab === 'offers'
                  ? 'bg-gov-navy text-white shadow-md border-b-2 border-gov-green'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <HandHeart className={`w-4 h-4 ${activeSubTab === 'offers' ? 'text-emerald-400' : 'text-gov-green'}`} />
              <span>Volunteer & Logistics Resource Registry</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                activeSubTab === 'offers' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {offers.length}
              </span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5 pr-2">
            <span className="w-2 h-2 rounded-full bg-gov-green"></span>
            <span>Synchronized with District EOCs</span>
          </div>
        </div>
      </div>

      {/* --- SUBTAB 1: CITIZEN SOS QUEUE --- */}
      {activeSubTab === 'requests' && (
        <div className="space-y-4">
          {/* Urgency Filter Pills */}
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-600 font-bold flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-gov-navy" />
                <span>Filter Priority:</span>
              </span>
              {['ALL', 'CRITICAL_SOS', 'HIGH', 'MEDIUM', 'LOW'].map(u => (
                <button
                  key={u}
                  onClick={() => setUrgencyFilter(u)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    urgencyFilter === u
                      ? u === 'CRITICAL_SOS' 
                        ? 'bg-gov-red text-white shadow-sm' 
                        : u === 'HIGH' 
                          ? 'bg-gov-saffron text-slate-950 shadow-sm' 
                          : 'bg-gov-navy text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {u === 'ALL' ? 'All Requests' : u.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-semibold">
              Showing {filteredRequests.length} of {requests.length} incident reports
            </div>
          </div>

          {/* SOS List Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className={`bg-white rounded-xl shadow-sm border p-4 flex flex-col justify-between transition-all ${
                  req.urgency === 'CRITICAL_SOS'
                    ? 'border-red-300 border-l-8 border-l-gov-red bg-red-50/15'
                    : req.urgency === 'HIGH'
                      ? 'border-amber-300 border-l-8 border-l-gov-saffron'
                      : 'border-slate-200 border-l-8 border-l-slate-400'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        req.urgency === 'CRITICAL_SOS' 
                          ? 'bg-gov-red text-white' 
                          : req.urgency === 'HIGH'
                            ? 'bg-gov-saffron text-slate-950 font-bold'
                            : 'bg-slate-200 text-slate-800'
                      }`}>
                        {req.urgency.replace('_', ' ')}
                      </span>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        req.status === 'RESOLVED' 
                          ? 'bg-emerald-100 text-gov-green' 
                          : req.status === 'DISPATCHED'
                            ? 'bg-blue-100 text-gov-navy'
                            : req.status === 'MERGED'
                              ? 'bg-purple-100 text-purple-900'
                              : 'bg-slate-100 text-slate-800'
                      }`}>
                        Status: {req.status}
                      </span>

                      {req.isEscalated && (
                        <span className="bg-red-100 text-gov-red text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-1 border border-red-200">
                          <Flame className="w-3 h-3 text-gov-red" />
                          <span>SLA Breached (15m+)</span>
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{new Date(req.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST</span>
                    </div>
                  </div>

                  {/* Duplicate Detection Alert Badge */}
                  {req.duplicateGroupId && req.status === 'MERGED' && (
                    <div className="bg-purple-50 border border-purple-200 text-purple-900 text-xs p-2.5 rounded-lg mb-2.5">
                      <strong>AI Incident Deduplication:</strong> Identified as co-located duplicate of <code>{req.isDuplicateOf || 'req-001'}</code>. Merged with SDRF Team to avoid redundant boat sortie.
                    </div>
                  )}

                  {/* Requester & Location */}
                  <div className="mb-2.5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-base text-slate-900">{req.requesterName}</h4>
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        <Users className="w-3.5 h-3.5 text-gov-navy" />
                        <span>{req.peopleCount} affected</span>
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-gov-red flex-shrink-0" />
                      <span className="font-semibold">{req.villageOrArea}, {req.district}, {req.state}</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      <strong>Landmark:</strong> {req.landmark}
                    </p>
                  </div>

                  {/* Need Description */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-800 mb-3">
                    <p className="leading-relaxed">{req.description}</p>
                  </div>

                  {/* Vulnerability Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-3">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Vulnerabilities:</span>
                    {(req.vulnerabilities || []).map((v, idx) => (
                      <span key={idx} className="bg-red-50 text-red-900 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded-full capitalize">
                        {v.replace('_', ' ')}
                      </span>
                    ))}
                  </div>

                  {/* Assigned Team */}
                  {req.assignedTeam && (
                    <div className="text-xs bg-blue-50 text-gov-navy border border-blue-200 rounded p-2 mb-3 font-semibold">
                      <strong>Assigned Unit:</strong> {req.assignedTeam}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${req.contactPhone.replace(/\s+/g, '')}`}
                      className="bg-gov-green hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs shadow-sm transition-all"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call {req.contactPhone}</span>
                    </a>

                    <button
                      onClick={() => handleCopyDetails(req)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg border border-slate-300 transition-colors"
                      title="Copy structured SOS summary for WhatsApp / Radio"
                    >
                      {copiedId === req.id ? <Check className="w-3.5 h-3.5 text-gov-green" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={req.status}
                    onChange={(e) => onUpdateRequestStatus(req.id, e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded text-xs font-semibold px-2 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-navy"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="DISPATCHED">DISPATCHED</option>
                    <option value="RESOLVED">RESOLVED</option>
                    <option value="MERGED">MERGED (DUPLICATE)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- SUBTAB 2: VOLUNTEER & LOGISTICS RESOURCE REGISTRY --- */}
      {activeSubTab === 'offers' && (
        <div className="space-y-4">
          <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="font-extrabold text-gov-navy text-sm">Community Volunteer & Logistics Civil Defence Reserve</h4>
              <p className="text-emerald-900 mt-0.5">
                Verified motorized rescue boats, 4x4 snorkel trucks, medical trauma teams, and disaster community kitchens ready for deployment.
              </p>
            </div>
            <span className="bg-gov-green text-white font-black px-2.5 py-1 rounded text-[11px] uppercase tracking-wide">
              Resource Pool Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="bg-emerald-100 text-gov-green text-[10px] font-black uppercase px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200">
                      {offer.serviceType === 'BOAT_RESCUE' && <LifeBuoy className="w-3 h-3" />}
                      {offer.serviceType === '4X4_TRANSPORT' && <Truck className="w-3 h-3" />}
                      {offer.serviceType === 'MEDICAL_STAFF' && <Stethoscope className="w-3 h-3" />}
                      {offer.serviceType === 'RELIEF_SUPPLIES' && <Package className="w-3 h-3" />}
                      <span>{offer.serviceType.replace('_', ' ')}</span>
                    </span>

                    <span className="text-[11px] text-slate-500 font-semibold">
                      {offer.district}, {offer.state}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900">{offer.providerName}</h4>
                  <p className="text-xs text-emerald-900 font-bold mt-1 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200">
                    {offer.capacityOrQuantity}
                  </p>
                  <p className="text-xs text-slate-600 mt-2">
                    <strong>Staging Hub & Range:</strong> {offer.locationDetails}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-3 mt-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      Coordinator: <strong>{offer.contactPerson}</strong>
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <ShieldCheck className="w-3 h-3 text-gov-green" />
                      <span>Verified: {offer.verifiedBy}</span>
                    </div>
                  </div>

                  <a
                    href={`tel:${offer.contactPhone.replace(/\s+/g, '')}`}
                    className="bg-gov-green hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 text-xs shadow-sm transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call {offer.contactPhone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}