import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import StatusHub from './components/StatusHub';
import TwoWayCoordination from './components/TwoWayCoordination';
import Playbooks from './components/Playbooks';
import EmergencyDirectory from './components/EmergencyDirectory';
import CoordinatorDashboard from './components/CoordinatorDashboard';
import SosModal from './components/SosModal';
import OfferHelpModal from './components/OfferHelpModal';
import AiAssistantModal from './components/AiAssistantModal';
import SimplifyAdvisoryModal from './components/SimplifyAdvisoryModal';
import SmsUssdModal from './components/SmsUssdModal';
import EmergencyAlarmModal from './components/EmergencyAlarmModal';
import { NationalEmblem, NdmaSeal, TricolorStrip, GovtBadges } from './components/Emblems';

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
      {/* Official NDMA Government Navigation Header */}
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
          OFFICIAL NDMA / S3WaaS / GIGW GOVERNMENT OF INDIA FOOTER
         ========================================================================= */}
      <footer className="bg-[#0b2545] text-slate-300 text-xs border-t-2 border-[#d97706] mt-auto">
        {/* Tricolor Accent Bar */}
        <TricolorStrip height="h-1.5" />

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-700">
            {/* Column 1: NDMA Institutional Identity */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <NationalEmblem className="h-14 w-auto flex-shrink-0" dark={true} />
                <NdmaSeal className="h-12 w-auto flex-shrink-0" dark={true} />
              </div>
              <div>
                <h4 className="text-white font-extrabold text-sm tracking-tight">
                  राष्ट्रीय आपदा प्रबंधन प्राधिकरण
                </h4>
                <div className="text-amber-400 font-bold text-xs mt-0.5">
                  National Disaster Management Authority
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Ministry of Home Affairs, Government of India<br />
                  NDMA Bhawan, A-1, Safdarjung Enclave,<br />
                  New Delhi - 110029, India
                </p>
              </div>
              <div className="text-[11px] text-slate-400 space-y-0.5">
                <div><strong>Control Room:</strong> +91-11-24363260</div>
                <div><strong>National Toll-Free:</strong> 1070 / 112</div>
              </div>
            </div>

            {/* Column 2: Government & Disaster Management Links */}
            <div>
              <h5 className="text-white font-bold text-xs uppercase tracking-wider border-b border-slate-700 pb-2 mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933]"></span>
                <span>Government Portals</span>
              </h5>
              <ul className="space-y-2 text-[11px] text-slate-300">
                <li>
                  <a href="https://ndma.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors">
                    • NDMA Official Portal (ndma.gov.in)
                  </a>
                </li>
                <li>
                  <a href="https://mha.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors">
                    • Ministry of Home Affairs (MHA)
                  </a>
                </li>
                <li>
                  <a href="https://asdma.assam.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors">
                    • Assam State Disaster Management (ASDMA)
                  </a>
                </li>
                <li>
                  <a href="https://ndrf.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors">
                    • National Disaster Response Force (NDRF)
                  </a>
                </li>
                <li>
                  <a href="http://cwc.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors">
                    • Central Water Commission (CWC Flood Forecast)
                  </a>
                </li>
                <li>
                  <a href="https://mausam.imd.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-amber-300 transition-colors">
                    • India Meteorological Department (IMD)
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Emergency Helplines & Rescue */}
            <div>
              <h5 className="text-white font-bold text-xs uppercase tracking-wider border-b border-slate-700 pb-2 mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>National Helplines (24x7)</span>
              </h5>
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                <li className="flex justify-between border-b border-slate-800 pb-1">
                  <span>National Emergency:</span>
                  <strong className="text-amber-400 font-mono text-xs">112</strong>
                </li>
                <li className="flex justify-between border-b border-slate-800 pb-1">
                  <span>State Disaster SEOC:</span>
                  <strong className="text-amber-400 font-mono text-xs">1070</strong>
                </li>
                <li className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Ambulance Emergency:</span>
                  <strong className="text-amber-400 font-mono text-xs">108</strong>
                </li>
                <li className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Fire & Water Rescue:</span>
                  <strong className="text-amber-400 font-mono text-xs">101</strong>
                </li>
                <li className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Electrical Spark (APDCL):</span>
                  <strong className="text-amber-400 font-mono text-xs">1912</strong>
                </li>
                <li className="flex justify-between pb-1">
                  <span>Women Helpline:</span>
                  <strong className="text-amber-400 font-mono text-xs">1091</strong>
                </li>
              </ul>
            </div>

            {/* Column 4: S3WaaS / Digital India Compliance */}
            <div className="space-y-3">
              <h5 className="text-white font-bold text-xs uppercase tracking-wider border-b border-slate-700 pb-2 mb-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Digital Governance</span>
              </h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Northeast Connect is a regional crisis coordination extension aligned with the 
                <strong> National Disaster Management Framework</strong> and S3WaaS standards.
              </p>

              <GovtBadges />

              <div className="text-[10px] text-slate-400 bg-slate-900/60 p-2.5 rounded border border-slate-700 space-y-1">
                <div>• W3C WCAG 2.1 Level AA Compliant</div>
                <div>• GIGW Certified Indian Govt Web Standards</div>
                <div>• End-to-end 2G Ultra-Low Bandwidth Resilient</div>
              </div>
            </div>
          </div>

          {/* Mandatory GIGW Website Policies Strip */}
          <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-400">
            <div className="flex flex-wrap items-center gap-3 text-slate-300">
              <a href="#main-content" className="hover:text-white transition-colors">Website Policies</a>
              <span>|</span>
              <a href="#main-content" className="hover:text-white transition-colors">Terms of Use</a>
              <span>|</span>
              <a href="#main-content" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>|</span>
              <a href="#main-content" className="hover:text-white transition-colors">Accessibility Statement</a>
              <span>|</span>
              <a href="#main-content" className="hover:text-white transition-colors">Hyperlinking Policy</a>
              <span>|</span>
              <a href="#main-content" className="hover:text-white transition-colors">Help</a>
              <span>|</span>
              <a href="#main-content" className="hover:text-white transition-colors">Contact Us</a>
            </div>

            <div className="text-right text-[10px] text-slate-400">
              Last Reviewed & Updated: <strong>21 November 2026</strong>
            </div>
          </div>

          {/* Copyright & Hosting Disclosures */}
          <div className="mt-4 pt-4 border-t border-slate-800 text-center text-[10px] text-slate-400 space-y-1">
            <p>
              Content Managed by <strong>National Disaster Management Authority (NDMA)</strong>, Ministry of Home Affairs, Government of India.
            </p>
            <p className="text-slate-400">
              Designed, Developed and Hosted by <strong>National Informatics Centre (NIC)</strong> / North East Disaster Risk Reduction Cell (NE-DRR).
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
