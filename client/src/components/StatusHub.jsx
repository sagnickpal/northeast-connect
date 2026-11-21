import React, { useState } from 'react';
import { 
  Building2, 
  AlertOctagon, 
  Waves, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ArrowRight,
  Filter,
  Search,
  Sparkles,
  ExternalLink,
  LifeBuoy,
  ChevronRight,
  Radio,
  Map as MapIcon,
  Mountain
} from 'lucide-react';
import { uiTranslations } from '../data/translations';

export default function StatusHub({
  shelters,
  roads,
  riverGauges,
  advisories,
  currentLang,
  lowBandwidth,
  onOpenSimplifyModal,
  initialSubTab = 'shelters',
  onNavigateToTab
}) {
  const t = uiTranslations[currentLang] || uiTranslations.en;
  const [selectedSubTab, setSelectedSubTab] = useState(initialSubTab); // shelters, roads, gauges, advisories
  const [filterState, setFilterState] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  // Sync if initialSubTab prop changes
  React.useEffect(() => {
    if (initialSubTab) {
      setSelectedSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const neStates = [
    'ALL', 'Assam', 'Meghalaya', 'Arunachal Pradesh', 'Manipur', 'Mizoram', 'Nagaland', 'Tripura', 'Sikkim'
  ];

  // Filtering shelters
  const filteredShelters = shelters.filter(s => {
    const matchesState = filterState === 'ALL' || s.state.toLowerCase() === filterState.toLowerCase();
    const matchesSearch = !searchQuery || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      s.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAvailable = !availableOnly || s.availableSpace > 0;
    return matchesState && matchesSearch && matchesAvailable;
  });

  // Filtering roads
  const filteredRoads = roads.filter(r => {
    const matchesState = filterState === 'ALL' || r.state.toLowerCase().includes(filterState.toLowerCase());
    const matchesSearch = !searchQuery || 
      r.roadName.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.stretch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.hazardType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesState && matchesSearch;
  });

  // Filtering river gauges
  const filteredGauges = riverGauges.filter(g => {
    return filterState === 'ALL' || (g.district && g.district.toLowerCase().includes(filterState.toLowerCase()));
  });

  // Filtering advisories
  const filteredAdvisories = advisories.filter(a => {
    return filterState === 'ALL' || (a.state && a.state.toLowerCase().includes(filterState.toLowerCase()));
  });

  const totalAvailableBeds = shelters.reduce((acc, s) => acc + (s.availableSpace || 0), 0);
  const blockedRoadCount = roads.filter(r => r.status !== 'OPEN').length;
  const risingGaugesCount = riverGauges.filter(g => g.status === 'ABOVE_DANGER' || g.status === 'SEVERE').length;

  return (
    <div className="space-y-6">
      {/* =========================================================================
          MODERN SITUATIONAL HERO BANNER
         ========================================================================= */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-xl shadow-lg border border-slate-700/80 overflow-hidden">
        <div className="p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-rose-600 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded tracking-wider shadow-sm">
                  Live Operations
                </span>
                <span className="text-xs text-slate-300 font-semibold">
                  Multi-Hazard Crisis Response • North East India
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Disaster Status & Community Relief Coordination Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Aggregated, verified field reports on safe relief shelter capacity, national highway blockages, Brahmaputra/Barak river gauges, and public health directives.
              </p>
            </div>

            <div className="text-right flex-shrink-0 bg-white/10 border border-white/20 px-3.5 py-2 rounded-lg backdrop-blur-sm">
              <div className="text-[10px] text-amber-300 uppercase tracking-widest font-black">Monsoon Watch</div>
              <div className="text-xs font-black text-white mt-0.5 flex items-center justify-end gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>FLOOD ALERT ACTIVE</span>
              </div>
            </div>
          </div>

          {/* 4 Official Government Real-Time KPI Cards (S3WaaS Framework) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            {/* Tile 1: Safe Shelters */}
            <div 
              onClick={() => setSelectedSubTab('shelters')}
              className="bg-white/95 text-slate-900 p-3.5 rounded-lg border-l-4 border-l-[#138808] cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
                <span>Relief Shelters</span>
                <Building2 className="w-4 h-4 text-[#138808]" />
              </div>
              <div className="text-xl font-black text-[#003366] group-hover:text-[#138808] transition-colors">
                {shelters.length} Active Camps
              </div>
              <div className="text-[11px] text-[#138808] font-bold mt-0.5">
                {totalAvailableBeds} beds available
              </div>
            </div>

            {/* Tile 2: Road Blockages */}
            <div 
              onClick={() => setSelectedSubTab('roads')}
              className="bg-white/95 text-slate-900 p-3.5 rounded-lg border-l-4 border-l-[#b91c1c] cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
                <span>Highway Hazard Status</span>
                <AlertOctagon className="w-4 h-4 text-[#b91c1c]" />
              </div>
              <div className="text-xl font-black text-[#b91c1c] group-hover:text-red-800 transition-colors">
                {blockedRoadCount} Blocked / Restricted
              </div>
              <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                BRO heavy clearing active
              </div>
            </div>

            {/* Tile 3: River Gauges */}
            <div 
              onClick={() => setSelectedSubTab('gauges')}
              className="bg-white/95 text-slate-900 p-3.5 rounded-lg border-l-4 border-l-[#0b3b60] cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
                <span>CWC River Flood Gauges</span>
                <Waves className="w-4 h-4 text-[#003366]" />
              </div>
              <div className="text-xl font-black text-[#003366] group-hover:text-blue-900 transition-colors">
                {risingGaugesCount} Above Danger
              </div>
              <div className="text-[11px] text-amber-700 font-bold mt-0.5">
                Brahmaputra & Barak rising
              </div>
            </div>

            {/* Tile 4: Health & Power S.O.P.s */}
            <div 
              onClick={() => setSelectedSubTab('advisories')}
              className="bg-white/95 text-slate-900 p-3.5 rounded-lg border-l-4 border-l-[#d97706] cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-1">
                <span>S.O.P. Health Advisories</span>
                <Zap className="w-4 h-4 text-[#d97706]" />
              </div>
              <div className="text-xl font-black text-[#d97706] group-hover:text-amber-800 transition-colors">
                {advisories.length} Active Directives
              </div>
              <div className="text-[11px] text-slate-600 font-semibold mt-0.5">
                Translated in 8 languages
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          GIS & 3D TOPOGRAPHY QUICK LAUNCH BANNER
         ========================================================================= */}
      <div className="bg-gradient-to-r from-slate-900 via-gov-navy to-slate-900 border border-slate-700 p-4 rounded-xl text-white flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-gov-blue p-2.5 rounded-lg border border-cyan-400/30 text-cyan-300">
            <Mountain className="w-6 h-6 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-gov-saffron text-slate-950 text-[10px] font-black uppercase px-1.5 py-0.2 rounded">
                Spatial GIS & 3D Engine
              </span>
              <span className="text-xs text-cyan-200 font-semibold">Geoinformatics Operations Cell</span>
            </div>
            <h3 className="text-base font-extrabold text-white mt-0.5">
              Disaster Area GIS Mapping & 3D Topographic Submersion View
            </h3>
            <p className="text-xs text-slate-300">
              Interactive satellite & contour GIS mapping of Brahmaputra/Barak flood basins, hill cut landslides, live SOS coordinates, and +5.5m 3D water rise simulation.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateToTab && onNavigateToTab('gisMap')}
          className="bg-gov-saffron hover:bg-amber-500 text-slate-950 font-black px-4 py-2.5 rounded-lg text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
        >
          <MapIcon className="w-4 h-4" />
          <span>Launch 3D GIS Portal</span>
        </button>
      </div>

      {/* =========================================================================
          GOVERNMENT SUB-NAVIGATION TABS & STATE SELECTOR
         ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 rounded-lg shadow-sm border border-slate-300">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedSubTab('shelters')}
            className={`px-3.5 py-2 rounded text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${
              selectedSubTab === 'shelters'
                ? 'bg-[#003366] text-white shadow-sm border-b-2 border-[#FF9933]'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{t.sheltersTitle}</span>
            <span className="bg-white/20 text-xs px-1.5 rounded-full font-bold">
              {shelters.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedSubTab('roads')}
            className={`px-3.5 py-2 rounded text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${
              selectedSubTab === 'roads'
                ? 'bg-[#003366] text-white shadow-sm border-b-2 border-[#FF9933]'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}
          >
            <AlertOctagon className="w-4 h-4 text-amber-400" />
            <span>{t.roadsTitle}</span>
            <span className="bg-red-600 text-white text-[10px] px-1.5 rounded font-black">
              {blockedRoadCount} blocked
            </span>
          </button>

          <button
            onClick={() => setSelectedSubTab('gauges')}
            className={`px-3.5 py-2 rounded text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${
              selectedSubTab === 'gauges'
                ? 'bg-[#003366] text-white shadow-sm border-b-2 border-[#FF9933]'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}
          >
            <Waves className="w-4 h-4 text-cyan-300" />
            <span>{t.gaugesTitle}</span>
          </button>

          <button
            onClick={() => setSelectedSubTab('advisories')}
            className={`px-3.5 py-2 rounded text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${
              selectedSubTab === 'advisories'
                ? 'bg-[#003366] text-white shadow-sm border-b-2 border-[#FF9933]'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{t.advisoriesTitle}</span>
            <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 rounded font-black">
              {advisories.length}
            </span>
          </button>
        </div>

        {/* State Filter Selector (Official S3WaaS standard) */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs font-bold text-slate-700 hidden sm:inline">State Filter:</span>
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded text-xs font-bold px-2.5 py-1.5 text-[#003366] focus:outline-none focus:ring-2 focus:ring-[#003366]"
            aria-label="Filter by North East State"
          >
            {neStates.map((st) => (
              <option key={st} value={st}>
                {st === 'ALL' ? 'All 8 North East States' : st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search & Toggle Bar (for Shelters & Roads) */}
      {(selectedSubTab === 'shelters' || selectedSubTab === 'roads') && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-300">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={`Search official verified records (${selectedSubTab === 'shelters' ? 'camp name, district, or landmark...' : 'highway NH, stretch, or landslide hazard...'})`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003366]"
            />
          </div>

          {selectedSubTab === 'shelters' && (
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer bg-slate-50 px-3 py-2 rounded border border-slate-300 select-none">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => setAvailableOnly(e.target.checked)}
                className="rounded text-[#003366] focus:ring-[#003366] w-4 h-4"
              />
              <span>Show only camps with available beds</span>
            </label>
          )}
        </div>
      )}

      {/* =========================================================================
          VIEW 1: SAFE SHELTERS & RELIEF CAMPS (GOVERNMENT S3WaaS STYLING)
         ========================================================================= */}
      {selectedSubTab === 'shelters' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredShelters.map((shelter) => {
            const percentFilled = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
            return (
              <div
                key={shelter.id}
                className="bg-white rounded-lg shadow-sm border border-slate-300 overflow-hidden flex flex-col justify-between transition-all hover:border-[#003366] hover:shadow-md"
              >
                {/* Government Card Official Header */}
                <div className="bg-[#0b3b60] text-white px-4 py-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FF9933] text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded">
                      {shelter.district}, {shelter.state}
                    </span>
                    {shelter.isStale && (
                      <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded">
                        ⚠️ Needs Re-verification
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-200 font-semibold">
                    Camp ID: <code className="text-amber-300 font-bold">{shelter.id}</code>
                  </div>
                </div>

                <div className="p-4">
                  {/* Camp Title & Location */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-base font-extrabold text-[#003366] leading-snug">{shelter.name}</h3>
                      <p className="text-xs text-slate-600 flex items-center gap-1 mt-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                        <span>{shelter.location}</span>
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className={`text-base font-black ${
                        shelter.availableSpace > 50 
                          ? 'text-[#0e6606]' 
                          : shelter.availableSpace > 0 
                            ? 'text-amber-700' 
                            : 'text-red-700'
                      }`}>
                        {shelter.availableSpace} {t.bedsAvailable}
                      </div>
                      <div className="text-[11px] text-slate-500 font-bold">
                        {shelter.currentOccupancy} / {shelter.capacity} {t.occupied} ({percentFilled}%)
                      </div>
                    </div>
                  </div>

                  {/* Occupancy Progress Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2.5 mb-3 overflow-hidden border border-slate-300">
                    <div 
                      className={`h-2.5 rounded-full transition-all ${
                        percentFilled > 90 ? 'bg-red-600' : percentFilled > 70 ? 'bg-amber-500' : 'bg-[#138808]'
                      }`}
                      style={{ width: `${percentFilled}%` }}
                    />
                  </div>

                  {/* Medical & Food Supply Facilities */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                    <div className="bg-slate-50 border border-slate-200 rounded p-2">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-0.5">
                        {shelter.medicalAvailable ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0e6606]" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-red-600" />
                        )}
                        <span>{t.medicalStaff}: {shelter.medicalAvailable ? 'Doctor on Duty' : 'Pending'}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight">
                        {shelter.medicalDetails}
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded p-2">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-0.5">
                        {shelter.foodAvailable ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0e6606]" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-red-600" />
                        )}
                        <span>{t.foodWater}: {shelter.foodAvailable ? 'Active Kitchen' : 'Ration Shortage'}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight">
                        {shelter.foodDetails}
                      </p>
                    </div>
                  </div>

                  {/* Road Access Condition */}
                  <div className="text-[11px] bg-blue-50 text-[#003366] border border-blue-200 rounded px-2.5 py-1 mb-2 font-medium">
                    <strong>Road Passability:</strong> {shelter.accessibleBy}
                  </div>
                </div>

                {/* Card Footer: Official DDMA Verification & Call Action */}
                <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-700 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#0e6606]" />
                      <span>{t.verifiedBy}: <strong>{shelter.verifiedSource}</strong></span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{t.lastUpdated}: {new Date(shelter.lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST</span>
                    </div>
                  </div>

                  <a
                    href={`tel:${shelter.contactPhone.replace(/\s+/g, '')}`}
                    className="bg-[#0e6606] hover:bg-green-800 text-white font-bold px-3 py-1.5 rounded flex items-center gap-1.5 text-xs transition-colors shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t.contactCamp}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          VIEW 2: ROAD & LANDSLIDE BLOCKAGES (NATIONAL HIGHWAY CONTROL BULLETIN)
         ========================================================================= */}
      {selectedSubTab === 'roads' && (
        <div className="space-y-4">
          <div className="bg-[#003366] text-white p-3.5 rounded-lg flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="font-extrabold text-sm sm:text-base">Border Roads Organisation (BRO) & NHAI Highway Bulletin</h3>
                <p className="text-[11px] text-slate-200">Active national highway closures, mudslides, bridge washes, and official diversions</p>
              </div>
            </div>
            <span className="bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded">
              High Traffic Caution
            </span>
          </div>

          {filteredRoads.map((road) => (
            <div
              key={road.id}
              className={`bg-white rounded-lg shadow-sm border overflow-hidden transition-all ${
                road.status === 'CLOSED'
                  ? 'border-red-300 border-l-8 border-l-red-600'
                  : road.status === 'PARTIAL'
                    ? 'border-amber-300 border-l-8 border-l-amber-500'
                    : 'border-blue-300 border-l-8 border-l-blue-600'
              }`}
            >
              <div className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs font-black uppercase rounded ${
                        road.status === 'CLOSED'
                          ? 'bg-red-600 text-white'
                          : road.status === 'PARTIAL'
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : 'bg-blue-600 text-white'
                      }`}>
                        {road.status === 'CLOSED' ? t.roadClosed : road.status === 'PARTIAL' ? t.roadPartial : t.roadRestricted}
                      </span>
                      <span className="text-xs font-bold text-slate-600">
                        {road.state} • {road.districts.join(', ')}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-[#003366] mt-1.5">{road.roadName}</h3>
                    <p className="text-xs font-bold text-red-700 mt-0.5">
                      {road.stretch} — Hazard: {road.hazardType}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-800 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded">
                      ⏱️ {t.clearanceETA}: <strong className="text-red-700">{road.clearanceETA}</strong>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-700 mb-3 bg-slate-50 p-2.5 rounded border border-slate-200">
                  {road.description}
                </p>

                {/* Detour Route Box */}
                <div className="bg-amber-50 border border-amber-200 text-amber-950 text-xs p-2.5 rounded mb-3 flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">{t.alternateDetour}:</strong> {road.alternateRoute}
                  </div>
                </div>

                {/* Verification Stamp */}
                <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2 font-medium">
                  <div className="flex items-center gap-1 text-slate-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#0e6606]" />
                    <span>Verified by: <strong>{road.verifiedBy}</strong></span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t.lastUpdated}: {new Date(road.lastUpdated).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* =========================================================================
          VIEW 3: RIVER WATER LEVEL GAUGES (CENTRAL WATER COMMISSION)
         ========================================================================= */}
      {selectedSubTab === 'gauges' && (
        <div className="space-y-4">
          <div className="bg-[#003366] text-white p-4 rounded-lg shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Waves className="w-6 h-6 text-cyan-300" />
              <div>
                <h3 className="font-extrabold text-base">Central Water Commission (CWC) Official Flood Gauges</h3>
                <p className="text-xs text-slate-200 mt-0.5">
                  Real-time hydrometric observation for Brahmaputra, Barak, Kopili, and Subansiri river basins
                </p>
              </div>
            </div>
            <span className="bg-red-600 text-white text-xs font-black px-2.5 py-1 rounded">
              Danger Levels Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGauges.map((gauge, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-sm border border-slate-300 overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-700">
                    {gauge.district}
                  </span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                    gauge.status === 'SEVERE'
                      ? 'bg-purple-700 text-white'
                      : gauge.status === 'ABOVE_DANGER'
                        ? 'bg-red-600 text-white'
                        : gauge.status === 'WARNING'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-[#138808] text-white'
                  }`}>
                    {gauge.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="p-4">
                  <h4 className="text-base font-extrabold text-[#003366]">
                    {gauge.river} River — {gauge.station}
                  </h4>

                  <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200 text-center my-3">
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Current Gauge</div>
                      <div className="text-base font-black text-red-600">{gauge.currentLevel}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Danger Level</div>
                      <div className="text-base font-bold text-slate-800">{gauge.dangerLevel}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Trend</div>
                      <div className="text-xs font-bold text-[#003366]">{gauge.trend}</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-blue-50/70 p-2 rounded border border-blue-100 leading-relaxed">
                    <strong>Official CWC Forecast:</strong> {gauge.forecast}
                  </p>

                  <div className="text-[10px] text-slate-500 mt-2 text-right">
                    Verified Reading: <strong>{gauge.lastReadingTime}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 4: WATER & POWER ADVISORIES (GOVERNMENT DIRECTIVES)
         ========================================================================= */}
      {selectedSubTab === 'advisories' && (
        <div className="space-y-4">
          <div className="bg-[#fffbeb] border border-amber-300 p-3.5 rounded-lg text-xs text-amber-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-700 flex-shrink-0" />
              <span>
                <strong>Official Health & Power Directives:</strong> Standard Operating Procedures issued by Public Health Engineering Dept (PHED) and APDCL. Simplified with AI into 8 North East regional languages.
              </span>
            </div>
            <span className="font-bold text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded">
              Multilingual S.O.P.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAdvisories.map((advisory) => (
              <div key={advisory.id} className="bg-white rounded-lg shadow-sm border border-slate-300 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      advisory.severity === 'CRITICAL' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-amber-400 text-slate-950 font-black'
                    }`}>
                      {advisory.severity} SEVERITY DIRECTIVE
                    </span>
                    <span className="text-[11px] text-slate-600 font-bold">
                      {advisory.districts ? advisory.districts.join(', ') : advisory.state}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-[#003366] mb-1">{advisory.title}</h3>
                  <p className="text-xs text-slate-600 mb-3">{advisory.summary}</p>

                  <div className="space-y-1.5 mb-4">
                    <strong className="text-xs text-slate-800 font-bold block">Immediate Citizen Actions:</strong>
                    {(advisory.actionSteps || []).map((step, sIdx) => (
                      <div key={sIdx} className="text-xs text-slate-800 flex items-start gap-1.5 bg-slate-50 p-2 rounded border border-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#0e6606] flex-shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">
                    Issuing Authority: <strong>{advisory.officialSource}</strong>
                  </span>

                  <button
                    onClick={() => onOpenSimplifyModal(advisory)}
                    className="bg-[#003366] hover:bg-[#0b3b60] text-white font-bold px-3 py-1.5 rounded flex items-center gap-1.5 text-xs transition-colors shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Translate into Regional Language</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
