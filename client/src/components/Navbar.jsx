import React from 'react';
import { 
  AlertTriangle, 
  WifiOff, 
  Globe, 
  HelpCircle, 
  HandHeart, 
  Bot, 
  MessageSquare, 
  BellRing,
  PhoneCall,
  Flame,
  Radio,
  Volume2,
  ChevronRight,
  ShieldCheck,
  Eye,
  Search,
  Sparkles
} from 'lucide-react';
import { languages, uiTranslations } from '../data/translations';
import { NationalEmblem, NdmaSeal, TricolorStrip } from './Emblems';

export default function Navbar({
  currentLang,
  setCurrentLang,
  lowBandwidth,
  setLowBandwidth,
  fontSize = 'normal',
  setFontSize,
  highContrast = false,
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
    <header className="sticky top-0 z-40 bg-white shadow-md border-b border-slate-300">
      {/* =========================================================================
          TIER 1: GIGW / S3WaaS Top Utility & Accessibility Strip
         ========================================================================= */}
      <div className="bg-[#061e38] text-slate-200 text-[11px] font-medium border-b border-[#0a2e55]">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
          {/* Left: National Identity Header */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-100 flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#FF9933]"></span>
              <span>भारत सरकार | Government of India</span>
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-300 hidden sm:inline">गृह मंत्रालय | Ministry of Home Affairs</span>
            <span className="text-slate-500 hidden md:inline">•</span>
            <span className="text-amber-300 font-semibold hidden md:inline">पूर्वोत्तर आपातकालीन प्रकोष्ठ</span>
          </div>

          {/* Right: Accessibility Controls (Text resize, Contrast, Screen reader, Language) */}
          <div className="flex items-center gap-3">
            {/* Skip to Main Content */}
            <a 
              href="#main-content" 
              className="text-slate-300 hover:text-white underline hidden lg:inline text-[10px]"
            >
              {t.skipToMain || "Skip to main content"}
            </a>

            {/* Font Size Scaling: A- / A / A+ */}
            {setFontSize && (
              <div className="flex items-center bg-[#003366] border border-slate-600 rounded px-1.5 py-0.5 gap-1">
                <span className="text-[10px] text-slate-400 mr-0.5 hidden sm:inline">A11y:</span>
                <button
                  onClick={() => setFontSize('sm')}
                  className={`px-1 py-0.2 text-[10px] rounded font-bold ${fontSize === 'sm' ? 'bg-[#FF9933] text-slate-950 font-black' : 'text-slate-300 hover:text-white'}`}
                  title="Decrease Text Size"
                  aria-label="Decrease Text Size"
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize('normal')}
                  className={`px-1 py-0.2 text-[10px] rounded font-bold ${fontSize === 'normal' ? 'bg-[#FF9933] text-slate-950 font-black' : 'text-slate-300 hover:text-white'}`}
                  title="Normal Text Size"
                  aria-label="Normal Text Size"
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('lg')}
                  className={`px-1 py-0.2 text-[10px] rounded font-bold ${fontSize === 'lg' ? 'bg-[#FF9933] text-slate-950 font-black' : 'text-slate-300 hover:text-white'}`}
                  title="Increase Text Size"
                  aria-label="Increase Text Size"
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
                    : 'bg-[#003366] text-slate-200 border-slate-600 hover:bg-slate-700'
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
                  ? 'bg-emerald-400 text-slate-950 ring-2 ring-emerald-300' 
                  : 'bg-[#003366] text-slate-200 hover:bg-slate-700 border-slate-600'
              }`}
              title="Disable heavy images, animations and styles for slow 2G connectivity"
            >
              <WifiOff className="w-3 h-3" />
              <span>{lowBandwidth ? "2G Mode: ON" : "2G Mode"}</span>
            </button>

            {/* Regional Language Picker */}
            <div className="flex items-center gap-1 bg-[#003366] border border-slate-600 rounded px-1.5 py-0.5">
              <Globe className="w-3 h-3 text-slate-400" />
              <select
                value={currentLang}
                onChange={(e) => setCurrentLang(e.target.value)}
                className="bg-transparent text-[11px] text-white focus:outline-none cursor-pointer py-0.5 font-medium"
                aria-label="Select Language"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-[#0b2545] text-white">
                    {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TIER 2: Official NDMA Branding Header Banner
         ========================================================================= */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          {/* Left: National Emblem + NDMA Logo + Bilingual Title */}
          <div 
            className="flex items-center gap-3.5 cursor-pointer select-none" 
            onClick={() => setActiveTab('statusHub')}
          >
            {/* Ashoka Stambh / State Emblem of India */}
            <NationalEmblem className="h-14 sm:h-16 w-auto flex-shrink-0" />

            <div className="h-12 w-[1px] bg-slate-300 hidden sm:block"></div>

            {/* Official NDMA Circular Seal */}
            <NdmaSeal className="h-12 sm:h-14 w-auto flex-shrink-0" />

            {/* Bilingual Ministry & Authority Typography */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-extrabold text-[#003366] tracking-tight">
                  राष्ट्रीय आपदा प्रबंधन प्राधिकरण
                </span>
                <span className="bg-[#FF9933]/15 text-[#b45309] border border-[#FF9933]/40 text-[9px] uppercase font-black px-1.5 py-0.2 rounded">
                  भारत सरकार
                </span>
              </div>
              <h1 className="text-base sm:text-lg md:text-xl font-black text-[#003366] tracking-tight leading-tight">
                National Disaster Management Authority
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-600 font-semibold flex items-center gap-1.5 mt-0.5">
                <span>Ministry of Home Affairs, Government of India</span>
                <span className="text-slate-400">•</span>
                <span className="text-[#0e6606] font-bold">पूर्वोत्तर आपातकालीन प्रकोष्ठ (NE-DRR)</span>
              </p>
            </div>
          </div>

          {/* Right: Official Emergency Helpline Numbers & Rapid Citizen Actions */}
          <div className="flex items-center flex-wrap gap-2.5 ml-auto">
            {/* National Emergency Hotline Badges */}
            <div className="hidden lg:flex items-center gap-2 mr-2 bg-slate-50 border border-slate-300 rounded-lg p-1.5">
              <a
                href="tel:112"
                className="flex items-center gap-1.5 px-2 py-1 bg-red-50 hover:bg-red-100 border border-red-200 rounded text-red-900 transition-colors"
                title="Dial National Emergency"
              >
                <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
                <div className="text-left">
                  <div className="text-[9px] font-bold text-red-700 uppercase leading-none">Emergency</div>
                  <div className="text-xs font-black text-red-900 leading-tight">112</div>
                </div>
              </a>

              <a
                href="tel:1070"
                className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded text-[#003366] transition-colors"
                title="Dial State Disaster SEOC Helpline"
              >
                <div className="text-left">
                  <div className="text-[9px] font-bold text-blue-700 uppercase leading-none">Disaster SEOC</div>
                  <div className="text-xs font-black text-[#003366] leading-tight">1070</div>
                </div>
              </a>
            </div>

            {/* Primary Citizen Action Buttons */}
            <button
              onClick={onOpenSos}
              className="bg-[#b91c1c] hover:bg-red-800 text-white font-black px-3.5 py-2 rounded-md shadow flex items-center gap-2 text-xs uppercase tracking-wide transition-all transform active:scale-95 animate-pulse-sos border border-red-500"
            >
              <AlertTriangle className="w-4 h-4 text-white" />
              <span>{t.sosButton || "Emergency SOS"}</span>
            </button>

            <button
              onClick={onOpenOffer}
              className="bg-[#0e6606] hover:bg-green-800 text-white font-bold px-3 py-2 rounded-md text-xs shadow flex items-center gap-1.5 transition-all active:scale-95 border border-green-500"
            >
              <HandHeart className="w-4 h-4" />
              <span className="hidden sm:inline">{t.offerButton || "Offer Supplies"}</span>
              <span className="sm:hidden">Offer</span>
            </button>

            {/* Siren / Audio Distress Beacon */}
            <button
              onClick={onOpenAlarm}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black p-2 rounded-md text-xs border border-amber-600 shadow-sm active:scale-95"
              title="Activate acoustic emergency siren & visual strobe torch"
              aria-label="Emergency Siren"
            >
              <BellRing className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TIER 3: Primary Government Navigation Bar (Deep Navy Blue / Gold Accent)
         ========================================================================= */}
      <nav className="bg-[#003366] text-white shadow-inner border-b-2 border-[#d97706]" aria-label="Main Navigation">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 text-xs font-bold py-1 min-w-max">
            {/* 1. Status Hub (Home) */}
            <button
              onClick={() => setActiveTab('statusHub')}
              className={`px-3.5 py-2 rounded-t transition-all flex items-center gap-1.5 border-b-2 ${
                activeTab === 'statusHub'
                  ? 'bg-[#061e38] text-[#fcd34d] border-[#FF9933] shadow-sm font-extrabold'
                  : 'text-slate-100 hover:bg-[#0b3b60] hover:text-white border-transparent'
              }`}
            >
              <span>{t.tabs.statusHub}</span>
              {stats && (
                <span className="bg-[#d97706] text-slate-950 text-[10px] px-1.5 py-0.2 rounded font-black">
                  {stats.activeReliefCamps} Camps
                </span>
              )}
            </button>

            {/* 2. Need Help / SOS Queue */}
            <button
              onClick={() => setActiveTab('assistance')}
              className={`px-3.5 py-2 rounded-t transition-all flex items-center gap-1.5 border-b-2 ${
                activeTab === 'assistance'
                  ? 'bg-[#061e38] text-[#fcd34d] border-[#FF9933] shadow-sm font-extrabold'
                  : 'text-slate-100 hover:bg-[#0b3b60] hover:text-white border-transparent'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>{t.tabs.assistance}</span>
              {stats && stats.activeSosRequests > 0 && (
                <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.2 rounded font-black animate-pulse">
                  {stats.activeSosRequests} SOS
                </span>
              )}
            </button>

            {/* 3. Volunteer & Logistics Reserve */}
            <button
              onClick={() => setActiveTab('volunteers')}
              className={`px-3.5 py-2 rounded-t transition-all flex items-center gap-1.5 border-b-2 ${
                activeTab === 'volunteers'
                  ? 'bg-[#061e38] text-[#fcd34d] border-[#FF9933] shadow-sm font-extrabold'
                  : 'text-slate-100 hover:bg-[#0b3b60] hover:text-white border-transparent'
              }`}
            >
              <HandHeart className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.tabs.volunteers}</span>
            </button>

            {/* 4. Disaster Guidelines & Survival Go-Bag */}
            <button
              onClick={() => setActiveTab('playbooks')}
              className={`px-3.5 py-2 rounded-t transition-all flex items-center gap-1.5 border-b-2 ${
                activeTab === 'playbooks'
                  ? 'bg-[#061e38] text-[#fcd34d] border-[#FF9933] shadow-sm font-extrabold'
                  : 'text-slate-100 hover:bg-[#0b3b60] hover:text-white border-transparent'
              }`}
            >
              <span>{t.tabs.playbooks}</span>
            </button>

            {/* 5. Emergency Helplines Directory */}
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-3.5 py-2 rounded-t transition-all flex items-center gap-1.5 border-b-2 ${
                activeTab === 'directory'
                  ? 'bg-[#061e38] text-[#fcd34d] border-[#FF9933] shadow-sm font-extrabold'
                  : 'text-slate-100 hover:bg-[#0b3b60] hover:text-white border-transparent'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t.tabs.directory}</span>
            </button>

            {/* 6. Operations Control Room (DDMA / SDRF) */}
            <button
              onClick={() => setActiveTab('coordinator')}
              className={`px-3.5 py-2 rounded-t transition-all flex items-center gap-1.5 border-b-2 ${
                activeTab === 'coordinator'
                  ? 'bg-[#061e38] text-[#fcd34d] border-[#FF9933] shadow-sm font-extrabold'
                  : 'text-amber-200 hover:bg-[#0b3b60] hover:text-white border-transparent'
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
            <div className="h-5 w-[1px] bg-slate-500 mx-1"></div>

            {/* 7. AI Grounded Guide Assistant Button */}
            <button
              onClick={onOpenAi}
              className="bg-[#0b3b60] hover:bg-[#164e63] text-cyan-200 border border-cyan-400/40 px-2.5 py-1.5 rounded flex items-center gap-1 text-[11px] font-bold"
            >
              <Bot className="w-3.5 h-3.5 text-cyan-300" />
              <span>{t.aiGuideButton || "AI Guide"}</span>
            </button>

            {/* 8. Offline SMS / USSD Fallback */}
            <button
              onClick={onOpenSms}
              className="bg-[#0b3b60] hover:bg-[#164e63] text-amber-200 border border-amber-400/40 px-2.5 py-1.5 rounded flex items-center gap-1 text-[11px] font-bold"
              title="Generate standardized SMS or dial *112# USSD without internet"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
              <span>{t.smsFallbackButton || "SMS / USSD"}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* =========================================================================
          TIER 4: Live Official Emergency Alert Ticker / Marquee
         ========================================================================= */}
      <div className="bg-[#fffbeb] border-b border-amber-200 text-amber-950 text-xs py-1 px-4 flex items-center gap-3 overflow-hidden">
        <div className="flex-shrink-0 flex items-center gap-1.5 bg-[#d97706] text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-sm">
          <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
          <span>ताज़ा चेतावनी / FLASH ALERT</span>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="animate-ticker text-xs font-semibold text-slate-800">
            🚨 <strong>CWC FLOOD WARNING:</strong> Brahmaputra at Guwahati (DC Court Ghat) is flowing at 50.12 m (ABOVE DANGER LEVEL by 0.44 m; Trend: RISING +3 cm/hr) &nbsp;•&nbsp; 
            🛑 <strong>HIGHWAY ADVISORY:</strong> NH-06 Sonapur Tunnel section is CLOSED due to massive rockfall; clearance ETA 6-8 hours by BRO Project Dantak &nbsp;•&nbsp; 
            💧 <strong>HEALTH S.O.P.:</strong> Municipal drinking water advisory active in Cachar & Kamrup Metro — boil water for 3 minutes before drinking &nbsp;•&nbsp; 
            📞 <strong>EMERGENCY RESCUE:</strong> Dial toll-free 112 or 1070 for immediate NDRF water boat evacuation.
          </div>
        </div>
      </div>

      {/* =========================================================================
          TIER 5: Indian National Flag Tricolor Ribbon Strip
         ========================================================================= */}
      <TricolorStrip height="h-1" />
    </header>
  );
}
