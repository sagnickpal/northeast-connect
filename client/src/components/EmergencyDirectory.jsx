import React, { useState } from 'react';
import { 
  PhoneCall, 
  Search, 
  Building2, 
  ShieldCheck, 
  MapPin, 
  LifeBuoy, 
  Stethoscope, 
  Copy, 
  Check, 
  ExternalLink,
  Phone
} from 'lucide-react';

export default function EmergencyDirectory({ contacts }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(null);

  const handleCopy = (num) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const filteredCategories = contacts.map(cat => {
    const matchingContacts = cat.contacts.filter(c => {
      const q = searchQuery.toLowerCase();
      return !q || 
        c.name.toLowerCase().includes(q) || 
        c.number.toLowerCase().includes(q) ||
        (c.state && c.state.toLowerCase().includes(q)) ||
        (c.role && c.role.toLowerCase().includes(q));
    });
    return { ...cat, contacts: matchingContacts };
  }).filter(cat => cat.contacts.length > 0);

  return (
    <div className="space-y-6">
      {/* Directory Header */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-red-600 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded">
                24x7 Emergency Hotlines
              </span>
              <span className="text-xs text-slate-300 font-semibold">
                North East Helplines & Rescue Units
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              Multi-Agency Emergency Helplines & Rescue Directory
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Direct hotlines to State Disaster Operations Centres (SEOC), NDRF Battalions, SDRF Speedboat Units, and Tertiary Trauma Hospitals across the 8 North East States.
            </p>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-right">
            <div className="text-[10px] text-amber-400 uppercase font-black">24x7 Citizen Line</div>
            <div className="text-sm font-black text-white">TOLL-FREE: 112 / 1070</div>
          </div>
        </div>
      </div>

      {/* Top Banner with Official 4 Quick Primary Dials */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Dial 112 */}
        <a
          href="tel:112"
          className="bg-white hover:bg-red-50 border-2 border-red-500 p-3.5 rounded-lg shadow-sm text-center transition-all transform active:scale-95 group"
        >
          <div className="text-2xl font-black text-red-700 group-hover:scale-105 transition-transform">112</div>
          <div className="text-xs font-black text-slate-900 uppercase mt-0.5">National Emergency</div>
          <div className="text-[10px] text-red-600 font-bold">Police • Fire • Disaster</div>
        </a>

        {/* Dial 1070 */}
        <a
          href="tel:1070"
          className="bg-white hover:bg-blue-50 border-2 border-[#003366] p-3.5 rounded-lg shadow-sm text-center transition-all transform active:scale-95 group"
        >
          <div className="text-2xl font-black text-[#003366] group-hover:scale-105 transition-transform">1070</div>
          <div className="text-xs font-black text-slate-900 uppercase mt-0.5">State Disaster SEOC</div>
          <div className="text-[10px] text-[#003366] font-bold">ASDMA / MSDMA / NSDMA</div>
        </a>

        {/* Dial 108 */}
        <a
          href="tel:108"
          className="bg-white hover:bg-green-50 border-2 border-[#138808] p-3.5 rounded-lg shadow-sm text-center transition-all transform active:scale-95 group"
        >
          <div className="text-2xl font-black text-[#138808] group-hover:scale-105 transition-transform">108</div>
          <div className="text-xs font-black text-slate-900 uppercase mt-0.5">Ambulance & Trauma</div>
          <div className="text-[10px] text-[#138808] font-bold">Free 24x7 Medical Rescue</div>
        </a>

        {/* Dial 1912 */}
        <a
          href="tel:1912"
          className="bg-white hover:bg-amber-50 border-2 border-[#d97706] p-3.5 rounded-lg shadow-sm text-center transition-all transform active:scale-95 group"
        >
          <div className="text-2xl font-black text-[#d97706] group-hover:scale-105 transition-transform">1912</div>
          <div className="text-xs font-black text-slate-900 uppercase mt-0.5">Electrical Spark</div>
          <div className="text-[10px] text-[#d97706] font-bold">APDCL Substation Emergency</div>
        </a>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search government directory by state name, NDRF battalion, trauma hospital, or control room..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003366] shadow-sm font-medium"
        />
      </div>

      {/* Directory Categories */}
      <div className="space-y-6">
        {filteredCategories.map((cat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm border border-slate-300 overflow-hidden">
            {/* Category Header in Deep Governance Navy */}
            <div className="bg-[#003366] text-white px-4 py-2.5 font-bold text-xs sm:text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="uppercase tracking-wide">{cat.title}</span>
              </span>
              <span className="text-[10px] bg-white/20 text-slate-100 font-bold px-2 py-0.5 rounded">
                {cat.contacts.length} Official Numbers
              </span>
            </div>

            <div className="divide-y divide-slate-200">
              {cat.contacts.map((contact, cIdx) => (
                <div key={cIdx} className="p-3.5 sm:p-4 hover:bg-slate-50 transition-colors flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-[#003366]">{contact.name}</h4>
                      {contact.state && (
                        <span className="text-[10px] font-black bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 uppercase">
                          {contact.state}
                        </span>
                      )}
                    </div>

                    {contact.role && (
                      <p className="text-xs text-slate-700 font-semibold mt-0.5">
                        {contact.role}
                      </p>
                    )}

                    {contact.coverage && (
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Jurisdiction: <strong>{contact.coverage}</strong>
                      </p>
                    )}

                    {contact.location && (
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-red-600" />
                        <span>{contact.location}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleCopy(contact.number)}
                      className="p-2 rounded border border-slate-300 bg-white hover:bg-slate-100 text-slate-700"
                      title="Copy phone number to clipboard"
                    >
                      {copiedNumber === contact.number ? (
                        <Check className="w-4 h-4 text-[#0e6606]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <a
                      href={`tel:${contact.number.split('/')[0].trim().replace(/[^\d+]/g, '')}`}
                      className="bg-[#0e6606] hover:bg-green-800 text-white font-bold px-3.5 py-2 rounded flex items-center gap-1.5 text-xs shadow-sm transition-colors"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>{contact.number.split('/')[0].trim()}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
