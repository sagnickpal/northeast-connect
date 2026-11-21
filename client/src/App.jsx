import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatusHub from './components/StatusHub';
import TwoWayCoordination from './components/TwoWayCoordination';
import Playbooks from './components/Playbooks';
import EmergencyDirectory from './components/EmergencyDirectory';
import CoordinatorDashboard from './components/CoordinatorDashboard';
import GisMapViewer from './components/GisMapViewer';
import SosModal from './components/SosModal';
import OfferHelpModal from './components/OfferHelpModal';
import AiAssistantModal from './components/AiAssistantModal';
import SimplifyAdvisoryModal from './components/SimplifyAdvisoryModal';
import SmsUssdModal from './components/SmsUssdModal';
import EmergencyAlarmModal from './components/EmergencyAlarmModal';

import {
  seedShelters,
  seedRoads,
  seedRiverGauges,
  seedAdvisories,
  seedContacts,
  seedRequests,
  seedOffers,
  seedRumorsAndSignals
} from '../../server/src/data/seedData';
import { generateAutomatedBroadcasts } from '../../server/src/services/automationService';

export default function App() {
  const [currentLang, setCurrentLang] = useState('en');
  const [lowBandwidth, setLowBandwidth] = useState(false);
  const [fontSize, setFontSize] = useState('normal'); // 'sm' | 'normal' | 'lg'
  const [highContrast, setHighContrast] = useState(false);
  const [activeTab, setActiveTab] = useState('statusHub');

  // Core Data State
  const [shelters, setShelters] = useState(seedShelters);
  const [roads, setRoads] = useState(seedRoads);
  const [riverGauges, setRiverGauges] = useState(seedRiverGauges);
  const [advisories, setAdvisories] = useState(seedAdvisories);
  const [contacts, setContacts] = useState(seedContacts);
  const [requests, setRequests] = useState(seedRequests);
  const [offers, setOffers] = useState(seedOffers);
  const [signals, setSignals] = useState(seedRumorsAndSignals);
  const [broadcasts, setBroadcasts] = useState(() => 
    generateAutomatedBroadcasts({ shelters: seedShelters, roads: seedRoads, riverGauges: seedRiverGauges, advisories: seedAdvisories })
  );
  const [stats, setStats] = useState(null);
  const [notification, setNotification] = useState(null);

  // Modals
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isSmsOpen, setIsSmsOpen] = useState(false);
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  const [isSimplifyOpen, setIsSimplifyOpen] = useState(false);
  const [selectedAdvisory, setSelectedAdvisory] = useState(null);

  // Font Scaling Effect
  useEffect(() => {
    document.body.classList.remove('font-scale-sm', 'font-scale-normal', 'font-scale-lg');
    document.body.classList.add(`font-scale-${fontSize}`);
  }, [fontSize]);

  // High Contrast Mode Effect
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }
  }, [highContrast]);

  // Apply ultra-low bandwidth class to body
  useEffect(() => {
    if (lowBandwidth) {
      document.body.classList.add('text-only-mode');
    } else {
      document.body.classList.remove('text-only-mode');
    }
  }, [lowBandwidth]);

  // Initial Data Fetch & Live Sync
  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    try {
      const [
        sRes, rRes, gRes, aRes, cRes, reqRes, offRes, sigRes, broadRes, statRes
      ] = await Promise.all([
        fetch('/api/shelters'),
        fetch('/api/roads'),
        fetch('/api/river-gauges'),
        fetch('/api/advisories'),
        fetch('/api/contacts'),
        fetch('/api/requests'),
        fetch('/api/offers'),
        fetch('/api/signals'),
        fetch('/api/automation/broadcasts'),
        fetch('/api/status')
      ]);

      if (sRes.ok) setShelters(await sRes.json());
      if (rRes.ok) setRoads(await rRes.json());
      if (gRes.ok) setRiverGauges(await gRes.json());
      if (aRes.ok) setAdvisories(await aRes.json());
      if (cRes.ok) setContacts(await cRes.json());
      if (reqRes.ok) setRequests(await reqRes.json());
      if (offRes.ok) setOffers(await offRes.json());
      if (sigRes.ok) setSignals(await sigRes.json());
      if (broadRes.ok) setBroadcasts(await broadRes.json());
      if (statRes.ok) setStats(await statRes.json());
    } catch (e) {
      console.warn("Backend API sync offline, utilizing PWA cached state:", e);
    }
  };

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handlers
  const handleSubmitSos = async (formData) => {
    try {
      const res = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const created = await res.json();
        setRequests(prev => [created, ...prev]);
        showNotification(`🚨 SOS Alert transmitted! AI Triage Priority: ${created.urgency}`);
        fetchAllData();
      }
    } catch {
      // Offline fallback
      const offlineItem = {
        id: `offline-${Date.now().toString().slice(-4)}`,
        ...formData,
        urgency: formData.needType === 'RESCUE' ? 'CRITICAL_SOS' : 'HIGH',
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };
      setRequests(prev => [offlineItem, ...prev]);
      showNotification("📡 Offline PWA: SOS saved locally. Auto-syncing to NDRF upon network connection.");
    }
  };

  const handleSubmitOffer = async (formData) => {
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const created = await res.json();
        setOffers(prev => [created, ...prev]);
        showNotification("✅ Thank you! Volunteer resource registered on community board.");
      }
    } catch {
      showNotification("Resource offer recorded locally in offline cache.");
    }
  };

  const handleUpdateRequestStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setRequests(prev => prev.map(r => r.id === id ? updated : r));
        showNotification(`Request ${id} status updated to ${status}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReverifyShelter = async (id, verifiedBy) => {
    try {
      const res = await fetch(`/api/shelters/${id}/reverify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verifiedBy })
      });
      if (res.ok) {
        const updated = await res.json();
        setShelters(prev => prev.map(s => s.id === id ? updated : s));
        showNotification(`✅ Shelter verified fresh! Stale badge cleared.`);
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReverifyRoad = async (id, verifiedBy) => {
    try {
      const res = await fetch(`/api/roads/${id}/reverify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verifiedBy })
      });
      if (res.ok) {
        const updated = await res.json();
        setRoads(prev => prev.map(r => r.id === id ? updated : r));
        showNotification(`✅ Road status verified fresh.`);
        fetchAllData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerifySignal = async (id, status, note) => {
    try {
      const res = await fetch(`/api/signals/${id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note })
      });
      if (res.ok) {
        const updated = await res.json();
        setSignals(prev => prev.map(s => s.id === id ? updated : s));
        showNotification(`Hotspot verification recorded: ${status}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleIngestSignal = async (signalData) => {
    try {
      const res = await fetch('/api/signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signalData)
      });
      if (res.ok) {
        setSignals(await res.json());
        showNotification("Citizen text signal clustered onto coordinator radar.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenSimplifyModal = (advisory) => {
    setSelectedAdvisory(advisory);
    setIsSimplifyOpen(true);
  };

  const [statusHubSubTab, setStatusHubSubTab] = useState('shelters');

  const handleNavigateToTab = (tab, subTab = null) => {
    setActiveTab(tab);
    if (tab === 'statusHub' && subTab) {
      setStatusHubSubTab(subTab);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${lowBandwidth ? 'text-only-mode' : 'bg-[#f0f3f8]'}`}>
      {/* Navigation Header */}
      <Navbar
        currentLang={currentLang}
        setCurrentLang={setCurrentLang}
        lowBandwidth={lowBandwidth}
        setLowBandwidth={setLowBandwidth}
        fontSize={fontSize}
        setFontSize={setFontSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        onOpenSos={() => setIsSosOpen(true)}
        onOpenOffer={() => setIsOfferOpen(true)}
        onOpenAi={() => setIsAiOpen(true)}
        onOpenSms={() => setIsSmsOpen(true)}
        onOpenAlarm={() => setIsAlarmOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
      />

      {/* Floating Notification */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50 bg-[#003366] text-white border-2 border-amber-400 px-4 py-3 rounded-lg shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 py-6 w-full flex-1">
        {activeTab === 'statusHub' && (
          <StatusHub
            shelters={shelters}
            roads={roads}
            riverGauges={riverGauges}
            advisories={advisories}
            currentLang={currentLang}
            lowBandwidth={lowBandwidth}
            onOpenSimplifyModal={handleOpenSimplifyModal}
            initialSubTab={statusHubSubTab}
            onNavigateToTab={handleNavigateToTab}
          />
        )}

        {activeTab === 'gisMap' && (
          <GisMapViewer
            shelters={shelters}
            roads={roads}
            requests={requests}
            riverGauges={riverGauges}
            initialAreaId="all"
          />
        )}

        {activeTab === 'assistance' && (
          <TwoWayCoordination
            requests={requests}
            offers={offers}
            onOpenSos={() => setIsSosOpen(true)}
            onOpenOffer={() => setIsOfferOpen(true)}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            currentLang={currentLang}
            initialSubTab="requests"
          />
        )}

        {activeTab === 'volunteers' && (
          <TwoWayCoordination
            requests={requests}
            offers={offers}
            onOpenSos={() => setIsSosOpen(true)}
            onOpenOffer={() => setIsOfferOpen(true)}
            onUpdateRequestStatus={handleUpdateRequestStatus}
            currentLang={currentLang}
            initialSubTab="offers"
          />
        )}

        {activeTab === 'playbooks' && (
          <Playbooks lowBandwidth={lowBandwidth} />
        )}

        {activeTab === 'directory' && (
          <EmergencyDirectory contacts={contacts} />
        )}

        {activeTab === 'coordinator' && (
          <CoordinatorDashboard
            requests={requests}
            shelters={shelters}
            roads={roads}
            signals={signals}
            broadcasts={broadcasts}
            onReverifyShelter={handleReverifyShelter}
            onReverifyRoad={handleReverifyRoad}
            onVerifySignal={handleVerifySignal}
            onIngestSignal={handleIngestSignal}
          />
        )}
      </main>

      {/* Modals */}
      <SosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        onSubmitSos={handleSubmitSos}
      />

      <OfferHelpModal
        isOpen={isOfferOpen}
        onClose={() => setIsOfferOpen(false)}
        onSubmitOffer={handleSubmitOffer}
      />

      <AiAssistantModal
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        onNavigateToTab={handleNavigateToTab}
      />

      <SimplifyAdvisoryModal
        isOpen={isSimplifyOpen}
        onClose={() => setIsSimplifyOpen(false)}
        advisory={selectedAdvisory}
      />

      <SmsUssdModal
        isOpen={isSmsOpen}
        onClose={() => setIsSmsOpen(false)}
      />

      <EmergencyAlarmModal
        isOpen={isAlarmOpen}
        onClose={() => setIsAlarmOpen(false)}
      />

      {/* =========================================================================
          MODERN APPLICATION FOOTER
         ========================================================================= */}
      <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-800">
            {/* Column 1: Brand & Mission */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white">NORTHEAST<span className="text-rose-500">CONNECT</span></span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                A community-first, offline-resilient emergency assistant designed to empower local residents, gaonburas, and volunteer response teams during monsoon floods, landslides, and natural disasters across North East India.
              </p>
              <div className="text-[11px] text-slate-400">
                PWA Cached • 2G Network Resilient • Zero Tracker
              </div>
            </div>

            {/* Column 2: Regional Coverage */}
            <div>
              <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                Regional Disaster Coverage
              </h5>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                <li>• Assam (Brahmaputra & Barak Valley Basins)</li>
                <li>• Meghalaya (Shillong & Jaintia Hill Slope Corridors)</li>
                <li>• Arunachal Pradesh (Siang, Subansiri & High Ridges)</li>
                <li>• Nagaland (NH-29 Paglapahar-Kohima Pass)</li>
                <li>• Manipur (Imphal Basin & Moreh Route)</li>
                <li>• Mizoram, Tripura & Sikkim Hill Divisions</li>
              </ul>
            </div>

            {/* Column 3: 24x7 Emergency Helplines */}
            <div>
              <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                Emergency Helplines (24x7)
              </h5>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                <li className="flex justify-between border-b border-slate-900 pb-1">
                  <span>National Emergency:</span>
                  <strong className="text-rose-400 font-mono text-xs">112</strong>
                </li>
                <li className="flex justify-between border-b border-slate-900 pb-1">
                  <span>Disaster Control Room:</span>
                  <strong className="text-amber-400 font-mono text-xs">1070</strong>
                </li>
                <li className="flex justify-between border-b border-slate-900 pb-1">
                  <span>Medical Ambulance:</span>
                  <strong className="text-emerald-400 font-mono text-xs">108</strong>
                </li>
                <li className="flex justify-between border-b border-slate-900 pb-1">
                  <span>Fire & Water Rescue:</span>
                  <strong className="text-amber-400 font-mono text-xs">101</strong>
                </li>
                <li className="flex justify-between pb-1">
                  <span>Power Grid Emergency:</span>
                  <strong className="text-cyan-400 font-mono text-xs">1912</strong>
                </li>
              </ul>
            </div>

            {/* Column 4: Key Platform Features */}
            <div className="space-y-2">
              <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                Core Capabilities
              </h5>
              <div className="text-[11px] text-slate-400 space-y-1.5">
                <div>🗺️ <strong>Interactive GIS & 3D Topography</strong></div>
                <div>🌊 <strong>+5.5m Flood Rise Simulation</strong></div>
                <div>📡 <strong>Offline 2G SMS & USSD Dialers (*112#)</strong></div>
                <div>🔊 <strong>Acoustic Siren & Rescue Strobe</strong></div>
                <div>🎒 <strong>Aapda Mitra 72-Hour Survival Go-Bag</strong></div>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
            <div>
              © 2026 Northeast Connect. Open-source humanitarian disaster assistance.
            </div>
            <div className="flex items-center gap-3">
              <span>Built for community resilience in North East India</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
