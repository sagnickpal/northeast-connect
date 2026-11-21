import React from 'react';
import { 
  AlertTriangle, 
  WifiOff, 
  Globe, 
  HandHeart, 
  Bot, 
  MessageSquare, 
  BellRing,
  PhoneCall,
  Flame,
  Radio,
  Volume2,
  ShieldCheck,
  Eye,
  Mountain,
  PlusCircle,
  LifeBuoy
} from 'lucide-react';
import { languages, uiTranslations } from '../data/translations';

export default function Navbar({
  currentLang,
  setCurrentLang,
  lowBandwidth,
  setLowBandwidth,
  fontSize = 'normal',
  setFontSize,
  highContrast,
  setHighContrast,
  onOpenSos,
  onOpenOffer,
  onOpenAi,
  onOpenSms,
  onOpenAlarm,
  activeTab,
  setActiveTab,
  stats
}) {
  const t = uiTranslations[currentLang] || uiTranslations.en;

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 shadow-xl">
      {/* =========================================================================
          TIER 1: Utility & Accessibility Toolbar
         ========================================================================= */}
      <div className="bg-slate-950/80 backdrop-blur px-4 py-1.5 border-b border-slate-800/80 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Operational Status */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold text-slate-300">
              Emergency Operations Active • North East India
            </span>
          </div>

          {/* Right: Accessibility & 2G & Language Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Font Resizer */}
            {setFontSize && (
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5">
                <span className="text-[10px] text-slate-400 font-semibold mr-0.5">Text:</span>
                <button
                  onClick={() => setFontSize('sm')}
                  className={`px-1 text-[10px] rounded font-bold ${fontSize === 'sm' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Smaller Font Size"
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize('normal')}
                  className={`px-1 text-[10px] rounded font-bold ${fontSize === 'normal' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Normal Font Size"
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('lg')}
                  className={`px-1 text-[10px] rounded font-bold ${fontSize === 'lg' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Larger Font Size"
                >
                  A+
                </button>
              </div>
            )}

            {/* High Contrast Toggle */}
            {setHighContrast && (
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                  highContrast 
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-black' 
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
                title="Toggle High Contrast Mode"
              >
                {highContrast ? "Contrast: High" : "Contrast"}
              </button>
            )}

            {/* 2G Low Bandwidth Switch */}
            <button
              onClick={() => setLowBandwidth(!lowBandwidth)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border transition-all ${
                lowBandwidth 
                  ? 'bg-emerald-400 text-slate-950 font-black' 
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border-slate-700'
              }`}
              title="Disable heavy graphics & animations for 2G network"
            >
              <WifiOff className="w-3 h-3" />
              <span>{lowBandwidth ? "2G: Active" : "2G Mode"}</span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5">
              <Globe className="w-3 h-3 text-slate-400" />
              <select
                value={currentLang}
                onChange={(e) => setCurrentLang(e.target.value)}
                className="bg-transparent text-[11px] text-white focus:outline-none cursor-pointer py-0.5 font-medium"
                aria-label="Select Language"
              >
                {languages.map(l => (
                  <option key={l.code} value={l.code} className="bg-slate-900 text-white">
                    {l.native} ({l.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TIER 2: Brand Logo & Primary Action Bar
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('statusHub')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="bg-gradient-to-br from-rose-600 to-rose-700 p-2.5 rounded-xl shadow-lg border border-rose-500/40 text-white flex items-center justify-center">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                NORTHEAST<span className="text-rose-500">CONNECT</span>
              </h1>
              <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[9px] font-black uppercase px-1.5 py-0.2 rounded tracking-wider">
                Emergency 24x7
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Community Emergency Assistant • Flood, Landslide & Disaster Response
            </p>
          </div>
        </div>

        {/* Emergency Call-To-Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* SOS Help Button */}
          <button
            onClick={onOpenSos}
            className="bg-rose-600 hover:bg-rose-700 text-white font-black px-4 py-2 rounded-xl text-xs shadow-lg flex items-center gap-1.5 transition-all active:scale-95 border border-rose-500 animate-pulse"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{t.sosButton || "Need Help / SOS"}</span>
          </button>

          {/* Offer Help Button */}
          <button
            onClick={onOpenOffer}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-md flex items-center gap-1.5 transition-all active:scale-95 border border-emerald-500"
          >
            <HandHeart className="w-4 h-4" />
            <span className="hidden sm:inline">{t.offerButton || "Offer Supplies"}</span>
            <span className="sm:hidden">Offer</span>
          </button>

          {/* Siren / Strobe Alarm */}
          <button
            onClick={onOpenAlarm}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black p-2 rounded-xl text-xs border border-amber-600 shadow-md active:scale-95"
            title="Acoustic Siren & Rescue Strobe"
          >
            <BellRing className="w-4 h-4" />
          </button>

          {/* Offline SMS/USSD */}
          <button
            onClick={onOpenSms}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold p-2 rounded-xl text-xs border border-slate-700 shadow-sm"
            title="Offline 2G SMS & USSD Codes"
          >
            <MessageSquare className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          TIER 3: Navigation Bar
         ========================================================================= */}
      <nav className="bg-slate-950 text-white border-t border-slate-800" aria-label="Main Navigation">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 text-xs font-bold py-1 min-w-max">
            {/* 1. Status Hub */}
            <button
              onClick={() => setActiveTab('statusHub')}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'statusHub'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{t.tabs.statusHub}</span>
              {stats && (
                <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.2 rounded font-black">
                  {stats.activeReliefCamps} Camps
                </span>
              )}
            </button>

            {/* 2. GIS & 3D Topography Portal */}
            <button
              onClick={() => setActiveTab('gisMap')}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'gisMap'
                  ? 'bg-cyan-600 text-white shadow-md font-extrabold'
                  : 'text-cyan-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Mountain className="w-3.5 h-3.5" />
              <span>{t.tabs.gisMap || "GIS & 3D Map"}</span>
              <span className="bg-cyan-400/20 text-cyan-300 text-[9px] px-1 py-0.2 rounded font-black border border-cyan-400/30">
                3D LIVE
              </span>
            </button>

            {/* 3. Need Help / SOS Queue */}
            <button
              onClick={() => setActiveTab('assistance')}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'assistance'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>{t.tabs.assistance}</span>
              {stats && stats.activeSosRequests > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.2 rounded font-black">
                  {stats.activeSosRequests} SOS
                </span>
              )}
            </button>

            {/* 4. Volunteer & Logistics Reserve */}
            <button
              onClick={() => setActiveTab('volunteers')}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'volunteers'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <HandHeart className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.tabs.volunteers}</span>
            </button>

            {/* 5. Disaster Guidelines & Survival Go-Bag */}
            <button
              onClick={() => setActiveTab('playbooks')}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'playbooks'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{t.tabs.playbooks}</span>
            </button>

            {/* 6. Emergency Helplines Directory */}
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'directory'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.tabs.directory}</span>
            </button>

            {/* 7. Operations Control Room */}
            <button
              onClick={() => setActiveTab('coordinator')}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'coordinator'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-amber-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.tabs.coordinator}</span>
              {stats && (stats.criticalSosAlerts > 0 || stats.staleDataAlerts > 0) && (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 rounded">
                  {stats.criticalSosAlerts + stats.staleDataAlerts}
                </span>
              )}
            </button>

            {/* Vertical Divider */}
            <div className="h-5 w-[1px] bg-slate-800 mx-1"></div>

            {/* 8. AI Grounded Guide Assistant */}
            <button
              onClick={onOpenAi}
              className="bg-slate-800 hover:bg-slate-700 text-cyan-200 border border-cyan-400/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.aiGuideButton || "AI Guide"}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* =========================================================================
          TIER 4: Emergency Alert Banner Ticker
         ========================================================================= */}
      <div className="bg-rose-950 border-t border-rose-900/80 text-rose-200 px-4 py-1.5 flex items-center justify-between text-xs">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3 overflow-hidden">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="bg-rose-600 text-white text-[9px] font-black uppercase px-1.5 py-0.2 rounded flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              <span>LIVE ALERT</span>
            </span>
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="inline-block whitespace-nowrap animate-marquee text-[11px] font-semibold text-rose-100">
              🚨 <strong>NH-06 CLOSED:</strong> Sonapur tunnel landslide blocked. • <strong>BRAHMAPUTRA:</strong> Water level +0.44m above danger at Guwahati DC Court. • <strong>BARAK RIVER:</strong> Water rising at Silchar (+5 cm/hr). • <strong>FREE BEDS:</strong> Cotton Univ (140), Silchar HS (40). Dial <strong>112</strong> for rescue.
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}