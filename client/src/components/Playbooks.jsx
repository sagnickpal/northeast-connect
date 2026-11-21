import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Waves, 
  Mountain, 
  Activity, 
  Backpack, 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  Printer, 
  CheckCircle2, 
  Info,
  Droplets,
  Zap,
  Flame,
  FileText,
  PhoneCall,
  Check,
  BookmarkCheck,
  Download
} from 'lucide-react';
import { TricolorStrip } from './Emblems';

const defaultGoBagItems = [
  { id: 'water', label: 'Drinking water (3 litres per person per day for 3 days in sealed containers)', category: 'VITAL', checked: false },
  { id: 'food', label: '3-day non-perishable dry food (chira, gur, roasted gram, energy biscuits, ORS)', category: 'VITAL', checked: false },
  { id: 'prescriptions', label: '7-day personal prescription medicines (hypertension, diabetes, asthma inhalers)', category: 'MEDICAL', checked: false },
  { id: 'firstaid', label: 'First aid kit (sterile gauze, antiseptic lotion, bandages, paracetamol, burn ointment)', category: 'MEDICAL', checked: false },
  { id: 'purification', label: 'Chlorine / Halazone water purification tablets or alum (fitkari) pieces', category: 'MEDICAL', checked: false },
  { id: 'documents', label: 'Aadhaar, Voter ID, Ration card, Land patta, Bank passbooks in sealed waterproof pouch', category: 'DOCS', checked: false },
  { id: 'torch', label: 'High-intensity LED flashlight / headlamp with 2 spare sets of alkaline batteries', category: 'POWER', checked: false },
  { id: 'powerbank', label: '10,000+ mAh power bank (fully charged) with charging cables in ziploc', category: 'POWER', checked: false },
  { id: 'whistle', label: 'High-decibel emergency whistle (audible across roaring flood waters and debris)', category: 'SAFETY', checked: false },
  { id: 'radio', label: 'Battery/Solar portable AM/FM transistor radio for official AIR disaster bulletins', category: 'SAFETY', checked: false },
  { id: 'sanitation', label: 'Sanitary pads, soap bar, disinfectant wipes, chlorine bleach drops, small towel', category: 'SANITATION', checked: false },
  { id: 'cash', label: 'Cash in small denomination currency notes (₹50, ₹100, ₹200; ATMs fail without grid)', category: 'FINANCE', checked: false },
  { id: 'clothing', label: 'Waterproof rain poncho, warm thermal set, sturdy non-slip rubber boots/shoes', category: 'CLOTHING', checked: false },
  { id: 'multitool', label: 'Swiss knife/multitool, 15-meter nylon climbing rope, duct tape, heavy work gloves', category: 'TOOLS', checked: false }
];

export default function Playbooks({ lowBandwidth }) {
  const [activePlaybook, setActivePlaybook] = useState('gobag'); // gobag, flood, landslide, earthquake
  const [goBagList, setGoBagList] = useState(() => {
    try {
      const saved = localStorage.getItem('ne_connect_gobag');
      return saved ? JSON.parse(saved) : defaultGoBagItems;
    } catch {
      return defaultGoBagItems;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('ne_connect_gobag', JSON.stringify(goBagList));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  }, [goBagList]);

  const toggleItem = (id) => {
    setGoBagList(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const resetGoBag = () => {
    setGoBagList(defaultGoBagItems);
  };

  const packedCount = goBagList.filter(i => i.checked).length;
  const progressPercent = Math.round((packedCount / goBagList.length) * 100);

  return (
    <div className="space-y-6">
      {/* Official Government Publication Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gov-navy text-white px-5 py-4 border-b border-gov-blue">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-gov-saffron text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wide">
                  NDMA Guidelines & SOPs
                </span>
                <span className="text-slate-300 text-xs font-semibold">
                  National Disaster Management Authority • Govt. of India
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                <span>राष्ट्रीय आपदा प्रबंधन दिशा-निर्देश (एसओपी)</span>
                <span className="text-gov-saffron font-light hidden md:inline">|</span>
                <span className="text-slate-200 text-lg md:text-xl font-bold hidden md:inline">National Disaster Management Standard Operating Procedures</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Standardised survival protocols, Aapda Mitra civil defence preparedness checklists, and hazard mitigation manuals for the North Eastern Region.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="bg-gov-blue hover:bg-slate-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg border border-white/20 flex items-center gap-2 shadow-sm transition-all"
                title="Print or Save official PDF manual for offline distribution"
              >
                <Printer className="w-4 h-4 text-gov-saffron" />
                <span>Print / Save PDF SOP</span>
              </button>
            </div>
          </div>
        </div>

        <TricolorStrip className="h-1" />

        {/* Playbook Navigation Tabs */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActivePlaybook('gobag')}
              className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${
                activePlaybook === 'gobag'
                  ? 'bg-gov-navy text-white shadow-md border-b-2 border-gov-saffron'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Backpack className={`w-4 h-4 ${activePlaybook === 'gobag' ? 'text-gov-saffron' : 'text-slate-600'}`} />
              <span>72-Hr Family Go-Bag</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                activePlaybook === 'gobag' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}>
                {packedCount}/{goBagList.length}
              </span>
            </button>

            <button
              onClick={() => setActivePlaybook('flood')}
              className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${
                activePlaybook === 'flood'
                  ? 'bg-gov-navy text-white shadow-md border-b-2 border-gov-saffron'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Waves className={`w-4 h-4 ${activePlaybook === 'flood' ? 'text-blue-400' : 'text-blue-600'}`} />
              <span>Floods & Brahmaputra Protocol</span>
            </button>

            <button
              onClick={() => setActivePlaybook('landslide')}
              className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${
                activePlaybook === 'landslide'
                  ? 'bg-gov-navy text-white shadow-md border-b-2 border-gov-saffron'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Mountain className={`w-4 h-4 ${activePlaybook === 'landslide' ? 'text-amber-400' : 'text-amber-600'}`} />
              <span>Landslides & Slope Stability</span>
            </button>

            <button
              onClick={() => setActivePlaybook('earthquake')}
              className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold flex items-center gap-2 transition-all ${
                activePlaybook === 'earthquake'
                  ? 'bg-gov-navy text-white shadow-md border-b-2 border-gov-saffron'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Activity className={`w-4 h-4 ${activePlaybook === 'earthquake' ? 'text-purple-400' : 'text-purple-600'}`} />
              <span>Earthquake (Zone V Seismic)</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5 pr-2">
            <span className="w-2 h-2 rounded-full bg-gov-green"></span>
            <span>Offline Cached • Section 35 DM Act 2005</span>
          </div>
        </div>
      </div>

      {/* --- PLAYBOOK 1: AAPDA MITRA 72-HOUR FAMILY GO-BAG CHECKLIST --- */}
      {activePlaybook === 'gobag' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden space-y-0">
          <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-gov-navy text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                    Aapda Mitra Standard
                  </span>
                  <span className="text-xs text-slate-500 font-bold">Civil Defence Survival Inventory</span>
                </div>
                <h3 className="text-lg md:text-xl font-black text-gov-navy flex items-center gap-2">
                  <Backpack className="w-5 h-5 text-gov-navy" />
                  <span>72-Hour Family Emergency Survival Go-Bag (आपदा किट)</span>
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Keep this waterproof backpack pre-packed and placed beside your exit door during monsoon and high-risk seismic periods. State is automatically preserved offline on your device.
                </p>
              </div>

              {/* Progress Box */}
              <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-sm min-w-[200px] text-right">
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="text-xs font-bold text-slate-600">Readiness Score:</span>
                  <span className={`text-base font-black ${
                    progressPercent === 100 ? 'text-gov-green' : progressPercent >= 50 ? 'text-gov-saffron' : 'text-gov-red'
                  }`}>
                    {progressPercent}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      progressPercent === 100 
                        ? 'bg-gov-green' 
                        : progressPercent >= 50 
                          ? 'bg-gov-saffron' 
                          : 'bg-gov-red'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500">
                  <span>{packedCount} of {goBagList.length} items verified</span>
                  <button
                    onClick={resetGoBag}
                    className="text-gov-navy hover:text-gov-red underline font-semibold"
                  >
                    Reset List
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Checklist Items Grid */}
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {goBagList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer select-none transition-all ${
                    item.checked 
                      ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950 shadow-sm' 
                      : 'bg-slate-50/80 border-slate-200 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {item.checked ? (
                      <CheckSquare className="w-5 h-5 text-gov-green" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className={`text-xs font-bold ${item.checked ? 'line-through text-slate-500 font-medium' : 'text-slate-900'}`}>
                      {item.label}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded border ${
                        item.category === 'VITAL' 
                          ? 'bg-red-50 text-red-700 border-red-200' 
                          : item.category === 'MEDICAL'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : item.category === 'DOCS'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-slate-200 text-slate-700 border-slate-300'
                      }`}>
                        {item.category}
                      </span>
                      {item.checked && (
                        <span className="text-[10px] text-gov-green font-bold flex items-center gap-0.5">
                          <Check className="w-3 h-3" />
                          <span>Packed</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Official Advice Footer */}
            <div className="mt-5 p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-950">
              <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Aapda Mitra Guideline Note:</strong> Check expiration dates of medical prescriptions and chlorine tablets every 6 months. Maintain one duplicate Go-Bag inside your vehicle if you live in high-risk Brahmaputra floodplain zones.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PLAYBOOK 2: FLOOD & RIVER PROTOCOL --- */}
      {activePlaybook === 'flood' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden space-y-0">
          <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-blue-50/60 to-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-800 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                Standard Operating Procedure (SOP-FL-01)
              </span>
              <span className="text-xs text-slate-500 font-bold">Assam, Meghalaya & Arunachal Riverine Inundation</span>
            </div>
            <h3 className="text-lg md:text-xl font-black text-gov-navy">
              बाढ़ प्रबंधन एवं निकासी मानक प्रक्रिया | Official Flood Survival & Evacuation Protocol
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Approved by NDMA and Assam State Disaster Management Authority (ASDMA) for Brahmaputra and Barak river basin communities.
            </p>
          </div>

          <div className="p-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: Evacuate */}
              <div className="bg-red-50/70 border border-red-200 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-red-950 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-gov-red" />
                    <span>1. Immediate Evacuation Triggers</span>
                  </h4>
                  <span className="bg-red-200 text-red-900 font-black text-[9px] px-1.5 py-0.5 rounded uppercase">Mandatory</span>
                </div>
                <ul className="text-xs text-red-900 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li>When floodwaters cross courtyard or plinth level with local river gauges rising at &gt;3 cm/hour.</li>
                  <li>When Village Headman (Gaonbura) or DDMA sounds siren, gong, or drum warning of upstream embankment breach.</li>
                  <li><strong>Evacuate before dusk:</strong> Never attempt night-time boat evacuation across swirling river currents.</li>
                  <li>Move elderly, pregnant women, infants, and differently-abled individuals in the very first rescue sortie.</li>
                </ul>
              </div>

              {/* Box 2: Electrical */}
              <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-amber-950 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-600" />
                    <span>2. Electrocution & Submersion Hazards</span>
                  </h4>
                  <span className="bg-amber-200 text-amber-900 font-black text-[9px] px-1.5 py-0.5 rounded uppercase">Life Threat</span>
                </div>
                <ul className="text-xs text-amber-900 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li>Turn off main domestic MCB electricity breakers and unscrew LPG gas cylinder regulators before evacuating.</li>
                  <li>Treat all standing water as electrified if transformers or fallen transmission poles are within 100 meters.</li>
                  <li>Never walk or drive into moving water: <strong>6 inches</strong> sweeps an adult off their feet; <strong>12 inches</strong> floats vehicles.</li>
                  <li>Do not touch damp walls or electrical outlets with wet feet or bare hands.</li>
                </ul>
              </div>

              {/* Box 3: Water Purification */}
              <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-blue-950 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-blue-600" />
                    <span>3. Potable Water Purification Protocols</span>
                  </h4>
                  <span className="bg-blue-200 text-blue-900 font-black text-[9px] px-1.5 py-0.5 rounded uppercase">Epidemic Control</span>
                </div>
                <ul className="text-xs text-blue-900 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li><strong>Boiling:</strong> Rolling boil for a minimum of 3 full minutes kills cholera, dysentery, and hepatitis A microbes.</li>
                  <li><strong>Chlorine Tablets:</strong> 1 tablet (Halazone) per 20 litres of clarified water; wait 30 minutes before drinking.</li>
                  <li><strong>Alum Pre-Treatment (Fitkari):</strong> Swirl a marble-sized piece of alum 3 times in turbid silt water; allow silt to settle for 20 minutes, decant clear supernatant water, and boil.</li>
                  <li>Never consume water from submerged hand pumps (tube-wells) until chlorinated.</li>
                </ul>
              </div>

              {/* Box 4: Rooftop & Snakebite */}
              <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-emerald-950 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-gov-green" />
                    <span>4. Rooftop Signaling & Snakebite Protocol</span>
                  </h4>
                  <span className="bg-emerald-200 text-emerald-900 font-black text-[9px] px-1.5 py-0.5 rounded uppercase">First Aid</span>
                </div>
                <ul className="text-xs text-emerald-900 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li><strong>Signaling Aerial Search:</strong> Fasten bright orange or red cloth to roof bamboo poles; use mirror or flashlight in sets of 3.</li>
                  <li><strong>Snakes on Elevated Platforms:</strong> Reptiles seek refuge on high ground during floods. Strike bamboo sticks on tin roofs before walking.</li>
                  <li><strong>In Case of Snakebite:</strong> Immobilize patient immediately; splint bitten limb below heart level. <strong>DO NOT</strong> cut, suck, or tie tight tourniquets. Transport immediately to GMCH/SMCH for Anti-Snake Venom (ASV).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PLAYBOOK 3: LANDSLIDE & HILL SLOPE CUT PROTOCOL --- */}
      {activePlaybook === 'landslide' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden space-y-0">
          <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-amber-50/60 to-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-800 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                Geological Survey of India (GSI) SOP-LS-03
              </span>
              <span className="text-xs text-slate-500 font-bold">Meghalaya, Mizoram, Nagaland, Sikkim & Hill Districts</span>
            </div>
            <h3 className="text-lg md:text-xl font-black text-gov-navy">
              भूस्खलन सुरक्षा एवं ढलान चेतावनी मानक | Landslide & Slope Stability Action Playbook
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Standard civil protection measures for heavy rainfall-triggered slope failures along national highways and cut slopes.
            </p>
          </div>

          <div className="p-5 space-y-4">
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
              <h4 className="font-extrabold text-sm text-gov-navy mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-gov-saffron" />
                <span>6 Definitive Early Warning Signs of an Impending Landslide:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-800">
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm flex items-start gap-2">
                  <span className="text-gov-red font-black text-sm">01</span>
                  <span>Sudden tension cracks or fissures opening in hillside soil, concrete yards, or road asphalt.</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm flex items-start gap-2">
                  <span className="text-gov-red font-black text-sm">02</span>
                  <span>Retaining walls, boundary fencing, telegraph poles, or trees tilting visibly downslope.</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm flex items-start gap-2">
                  <span className="text-gov-red font-black text-sm">03</span>
                  <span>Doors and windows suddenly jamming or sticking in hill-perched houses due to structural frame skew.</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm flex items-start gap-2">
                  <span className="text-gov-red font-black text-sm">04</span>
                  <span>New springs or muddy groundwater bursting spontaneously through hill slope faces.</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm flex items-start gap-2">
                  <span className="text-gov-red font-black text-sm">05</span>
                  <span>Sudden drastic decrease in stream discharge despite ongoing cloudburst (signals upstream debris dam formation).</span>
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm flex items-start gap-2">
                  <span className="text-gov-red font-black text-sm">06</span>
                  <span>Low rumbling roaring noise like a freight train accompanied by trees snapping loudly.</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50/80 border border-red-200 p-4 rounded-xl space-y-2">
                <h4 className="font-extrabold text-sm text-red-950 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-gov-red" />
                  <span>Immediate Survival Response When Slide Commences</span>
                </h4>
                <ul className="text-xs text-red-900 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li><strong>Evacuate Perpendicular:</strong> Run sideways (at a right angle to the path of sliding debris). <em>Never run downslope in front of the mudflow.</em></li>
                  <li><strong>Trapped Indoors:</strong> Curl into a tight fetal ball under robust timber tables or desks; shield head and cervical spine with pillows or helmets.</li>
                  <li><strong>Steer Clear of Ravines:</strong> Debris avalanches funnel down narrow stream channels at speeds exceeding 50 km/h.</li>
                </ul>
              </div>

              <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl space-y-2">
                <h4 className="font-extrabold text-sm text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-gov-green" />
                  <span>Post-Slide Rescue & Stability Inspection</span>
                </h4>
                <ul className="text-xs text-emerald-900 space-y-1.5 list-disc pl-4 leading-relaxed">
                  <li>Stay clear of the slide zone: Secondary retrogressive slides frequently follow primary movements.</li>
                  <li>Check for injured or trapped persons along slide flanks without entering unstable debris crowns.</li>
                  <li>Report severed telephone, power, or gas infrastructure to State PWD/BRO control rooms immediately.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- PLAYBOOK 4: EARTHQUAKE SEISMIC ZONE V PROTOCOL --- */}
      {activePlaybook === 'earthquake' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden space-y-0">
          <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-purple-50/60 to-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-purple-800 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                Seismic Zone V (Highest Vulnerability Region)
              </span>
              <span className="text-xs text-slate-500 font-bold">Entire North Eastern Region</span>
            </div>
            <h3 className="text-lg md:text-xl font-black text-gov-navy">
              भूकंप सुरक्षा: झुको, ढको और पकड़ो | Drop, Cover & Hold On Protocol
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Mandatory life-safety guidelines codified under the National Building Code (NBC 2016) and NDMA Earthquake Management Guidelines.
            </p>
          </div>

          <div className="p-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-red-50 border border-red-200 p-5 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="text-3xl font-black text-gov-red mb-1">1. DROP</div>
                  <div className="text-xs font-bold text-red-950 uppercase mb-2">झुको (Drop Down)</div>
                  <p className="text-xs text-red-900 leading-relaxed">
                    Drop onto your hands and knees immediately. This lowers your center of gravity and stops violent ground shaking from knocking you off your feet.
                  </p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="text-3xl font-black text-gov-saffron mb-1">2. COVER</div>
                  <div className="text-xs font-bold text-amber-950 uppercase mb-2">ढको (Take Cover)</div>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    Cover your head and neck beneath a sturdy wooden desk or dining table. If no table is available, crouch against an interior load-bearing masonry wall.
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="text-3xl font-black text-gov-green mb-1">3. HOLD ON</div>
                  <div className="text-xs font-bold text-emerald-950 uppercase mb-2">पकड़ो (Hold Securely)</div>
                  <p className="text-xs text-emerald-900 leading-relaxed">
                    Hold on to your shelter until shaking subsides entirely. Be prepared to shift along with the furniture as it slides across the floor.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
              <h4 className="font-extrabold text-sm text-gov-navy flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-gov-navy" />
                <span>Life-Safety Dos & Don'ts During and After Ground Motion:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-800">
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-gov-red font-bold block mb-1">❌ DO NOT Run Outside During Shaking</span>
                  Falling brick parapets, glass shards, loose facade plaster, and AC compressors cause 80%+ of earthquake casualties. Stay sheltered indoors until tremors halt.
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-gov-green font-bold block mb-1">✅ Inspect Gas Lines & Breakers</span>
                  If you detect a sulfur/gas odor, immediately open windows and shut main LPG valves. Never flip electrical switches, strike matches, or use lighters.
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-gov-red font-bold block mb-1">❌ DO NOT Use Elevators / Lifts</span>
                  Power grids will trip, trapping occupants in shafts. Use reinforced fire staircases once shaking terminates.
                </div>
                <div className="p-3 bg-white rounded-lg border border-slate-200">
                  <span className="text-gov-green font-bold block mb-1">✅ Anticipate Severe Aftershocks</span>
                  Structures weakened by primary shocks can collapse during aftershocks. Once safe, evacuate orderly to designated open recreation grounds.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}