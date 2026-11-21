import React, { useState } from 'react';
import { 
  Flame, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  RefreshCw, 
  Copy, 
  Check, 
  Send, 
  AlertTriangle, 
  MessageSquare, 
  FileText, 
  Share2,
  TrendingUp,
  Activity,
  Sparkles,
  Search,
  Radio,
  PhoneCall,
  ShieldCheck,
  Building2,
  Users,
  Compass
} from 'lucide-react';

export default function CoordinatorDashboard({
  requests,
  shelters,
  roads,
  signals,
  broadcasts,
  onReverifyShelter,
  onReverifyRoad,
  onVerifySignal,
  onIngestSignal
}) {
  const [activeTab, setActiveTab] = useState('escalations'); // escalations, freshness, broadcasts, signals
  const [copiedType, setCopiedType] = useState(null);
  const [newSignalText, setNewSignalText] = useState('');
  const [newSignalLocation, setNewSignalLocation] = useState('');

  const staleShelters = shelters.filter(s => s.isStale);
  const staleRoads = roads.filter(r => r.isStale);
  const escalatedRequests = requests.filter(r => r.isEscalated && r.status !== 'RESOLVED');

  const handleCopyBroadcast = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSignalSubmit = (e) => {
    e.preventDefault();
    if (!newSignalText.trim()) return;
    onIngestSignal({
      text: newSignalText,
      location: newSignalLocation || "North East Region"
    });
    setNewSignalText('');
    setNewSignalLocation('');
  };

  return (
    <div className="space-y-6">
      {/* Command Operations Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-900 text-white px-5 py-4 border-b border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-purple-600 text-white font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wide">
                  Incident Management
                </span>
                <span className="text-slate-400 text-xs font-semibold">
                  Field Operations & Rapid Triage
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                <span>Disaster Operations Command Center</span>
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Automated triage engine, 15-minute SOS SLA monitoring, multi-hazard data freshness audits, and cross-channel public broadcasts.
              </p>
            </div>

            {/* Live KPI Metric Badges */}
            <div className="flex items-center gap-2">
              <div className="bg-slate-800 border border-slate-700 px-3.5 py-2 rounded-xl text-center min-w-[95px]">
                <div className="text-[10px] text-red-300 font-bold uppercase tracking-wider">SLA Breaches</div>
                <div className="text-xl font-black text-red-400 mt-0.5 flex items-center justify-center gap-1">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>{escalatedRequests.length}</span>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 px-3.5 py-2 rounded-xl text-center min-w-[95px]">
                <div className="text-[10px] text-amber-300 font-bold uppercase tracking-wider">Stale Data</div>
                <div className="text-xl font-black text-amber-400 mt-0.5 flex items-center justify-center gap-1">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{staleShelters.length + staleRoads.length}</span>
                </div>
              </div>

              <div className="bg-slate-800 border border-slate-700 px-3.5 py-2 rounded-xl text-center min-w-[95px]">
                <div className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">Crowd Signals</div>
                <div className="text-xl font-black text-purple-300 mt-0.5 flex items-center justify-center gap-1">
                  <Radio className="w-4 h-4 text-purple-300" />
                  <span>{signals.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Tab Navigation */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
            <button
              onClick={() => setActiveTab('escalations')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all ${
                activeTab === 'escalations'
                  ? 'bg-gov-navy text-white shadow-md border-b-2 border-gov-red'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Flame className={`w-4 h-4 ${activeTab === 'escalations' ? 'text-red-400' : 'text-gov-red'}`} />
              <span>SLA Escalation Queue ({escalatedRequests.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('freshness')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all ${
                activeTab === 'freshness'
                  ? 'bg-gov-navy text-white shadow-md border-b-2 border-gov-saffron'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Clock className={`w-4 h-4 ${activeTab === 'freshness' ? 'text-amber-400' : 'text-gov-saffron'}`} />
              <span>Data Freshness & Expiry ({staleShelters.length + staleRoads.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('broadcasts')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all ${
                activeTab === 'broadcasts'
                  ? 'bg-gov-navy text-white shadow-md border-b-2 border-gov-green'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Share2 className={`w-4 h-4 ${activeTab === 'broadcasts' ? 'text-emerald-400' : 'text-gov-green'}`} />
              <span>Automated Bulletins & Broadcasts</span>
            </button>

            <button
              onClick={() => setActiveTab('signals')}
              className={`px-3.5 py-2 rounded-lg flex items-center gap-2 transition-all ${
                activeTab === 'signals'
                  ? 'bg-gov-navy text-white shadow-md border-b-2 border-purple-400'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Radio className={`w-4 h-4 ${activeTab === 'signals' ? 'text-purple-300' : 'text-purple-600'}`} />
              <span>Rumor & Hotspot Radar ({signals.length})</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1.5 pr-2">
            <span className="w-2 h-2 rounded-full bg-gov-green animate-pulse"></span>
            <span>Live Command Feed • 24x7 Control Room</span>
          </div>
        </div>
      </div>

      {/* --- SUBTAB 1: SLA ESCALATION QUEUE --- */}
      {activeTab === 'escalations' && (
        <div className="space-y-4">
          <div className="bg-red-50/80 border border-red-200 p-4 rounded-xl text-xs text-red-950 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-gov-red flex-shrink-0" />
              <span>
                <strong>15-Minute SOS Response SLA:</strong> Under incident response guidelines, all high-priority and roof-submerged SOS cases trigger an automated SMS/alert to the district coordinator if unassigned beyond 15 minutes.
              </span>
            </div>
            <span className="font-black bg-red-200 text-red-900 px-2.5 py-1 rounded text-[11px] uppercase tracking-wide">
              IRS Protocol Active
            </span>
          </div>

          {escalatedRequests.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center shadow-sm">
              <CheckCircle2 className="w-10 h-10 text-gov-green mx-auto mb-2" />
              <h4 className="font-extrabold text-base text-slate-900">Zero Active SLA Escalations</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                All critical rescue requests are assigned and actively attended to by SDRF, NDRF, and District Disaster Units within target response windows.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {escalatedRequests.map((req) => (
                <div key={req.id} className="bg-white rounded-xl shadow-sm border border-red-300 border-l-8 border-l-gov-red p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="bg-gov-red text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                          {req.urgency.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] bg-red-100 text-red-900 font-bold px-1.5 py-0.5 rounded">
                          ID: {req.id}
                        </span>
                      </div>
                      <h3 className="font-black text-base text-slate-900 mt-1">{req.requesterName}</h3>
                      <p className="text-xs text-slate-600 font-medium">{req.villageOrArea}, {req.district}, {req.state}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black text-gov-red bg-red-50 px-2.5 py-1 rounded border border-red-200">
                        Elapsed: {req.elapsedMinutes || 18}m / Target: {req.slaMinutes || 15}m
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50/70 p-2.5 rounded-lg border border-red-200 text-xs text-red-950">
                    <strong>IRS Escalation Trigger:</strong> {req.escalationReason || req.urgencyReason || 'SLA response window breached; Circle Officer & NDRF notified.'}
                  </div>

                  <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                    <p><strong>Emergency Need:</strong> {req.description}</p>
                    <p><strong>Physical Landmark:</strong> {req.landmark}</p>
                    <p><strong>Persons Trapped:</strong> {req.peopleCount} ({(req.vulnerabilities || []).join(', ')})</p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <a
                      href={`tel:${req.contactPhone.replace(/\s+/g, '')}`}
                      className="bg-gov-red hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Direct Dial: {req.contactPhone}</span>
                    </a>

                    <span className="text-[11px] text-slate-600 font-bold bg-slate-100 px-2 py-1 rounded">
                      Assigned: {req.assignedTeam || 'None (Immediate Dispatch Needed)'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- SUBTAB 2: DATA FRESHNESS & EXPIRY --- */}
      {activeTab === 'freshness' && (
        <div className="space-y-6">
          <div className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gov-saffron flex-shrink-0" />
              <span>
                <strong>Multi-Hazard Freshness Engine:</strong> Relief camp bed allocations older than 6 hours and highway clearance advisories older than 4 hours automatically switch to <em>"Needs Re-verification"</em> to prevent misrouting displaced citizens.
              </span>
            </div>
            <span className="font-black bg-amber-200 text-amber-900 px-2.5 py-1 rounded text-[11px] uppercase tracking-wide">
              Audit Tracker Active
            </span>
          </div>

          {/* Stale Shelters Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-gov-navy flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gov-saffron" />
                <span>Relief Camps Requiring Bed Count Re-Verification ({staleShelters.length})</span>
              </h3>
              <span className="text-xs text-slate-500 font-semibold">6-Hour Validity Window</span>
            </div>

            {staleShelters.length === 0 ? (
              <p className="text-xs text-gov-green font-bold bg-emerald-50 border border-emerald-200 p-3.5 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gov-green" />
                <span>All relief camp occupancy counts, sanitation, and medical stocks are fresh and verified within the 6-hour window.</span>
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {staleShelters.map((s) => (
                  <div key={s.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{s.name} ({s.district})</div>
                      <div className="text-amber-800 text-[11px] font-semibold mt-0.5">
                        Last verified: {new Date(s.lastUpdated).toLocaleTimeString()} ({s.dataAgeHours || 14} hours ago)
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Last recorded: {s.availableSpace} beds free of {s.capacity} capacity
                      </div>
                    </div>

                    <button
                      onClick={() => onReverifyShelter(s.id, "District Control Room Field Officer")}
                      className="bg-gov-saffron hover:bg-amber-600 text-slate-950 font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 text-xs shadow-sm transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Verify Bed Status Now</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stale Roads Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-gov-navy flex items-center gap-2">
                <Compass className="w-4 h-4 text-gov-saffron" />
                <span>Highway Passability Requiring Field Re-Verification ({staleRoads.length})</span>
              </h3>
              <span className="text-xs text-slate-500 font-semibold">4-Hour Validity Window</span>
            </div>

            {staleRoads.length === 0 ? (
              <p className="text-xs text-gov-green font-bold bg-emerald-50 border border-emerald-200 p-3.5 rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-gov-green" />
                <span>All National Highway clearances and landslide detour advisories are verified up to date.</span>
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {staleRoads.map((r) => (
                  <div key={r.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{r.roadName} ({r.stretch})</div>
                      <div className="text-amber-800 text-[11px] font-semibold mt-0.5">
                        Current Status: <strong>{r.status}</strong> — Age: {r.dataAgeHours || 18}h
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Reported Hazard: {r.hazardType}
                      </div>
                    </div>

                    <button
                      onClick={() => onReverifyRoad(r.id, "BRO / PWD NH Field Verification")}
                      className="bg-gov-saffron hover:bg-amber-600 text-slate-950 font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 text-xs shadow-sm transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Confirm Clearance Now</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- SUBTAB 3: AUTOMATED BULLETINS & BROADCASTS --- */}
      {activeTab === 'broadcasts' && broadcasts && (
        <div className="space-y-6">
          <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-gov-green flex-shrink-0" />
              <span>
                <strong>Automated Public Information Officer (PIO) Engine:</strong> Formats verified situational awareness data for WhatsApp community networks, 160-character Flash SMS broadcasts, and relief camp gate bulletins.
              </span>
            </div>
            <span className="font-black bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded text-[11px] uppercase tracking-wide">
              Official Releases
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 1. WhatsApp Format */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="font-extrabold text-sm text-gov-green flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Community Digest</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">Ward Groups</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-wrap max-h-72 overflow-y-auto">
                  {broadcasts.whatsappBulletin}
                </div>
              </div>

              <button
                onClick={() => handleCopyBroadcast(broadcasts.whatsappBulletin, 'whatsapp')}
                className="mt-3 w-full bg-gov-green hover:bg-emerald-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 text-xs transition-colors shadow-sm"
              >
                {copiedType === 'whatsapp' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedType === 'whatsapp' ? 'Copied to Clipboard!' : 'Copy WhatsApp Bulletin'}</span>
              </button>
            </div>

            {/* 2. Flash SMS Format */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="font-extrabold text-sm text-gov-navy flex items-center gap-1.5">
                    <Send className="w-4 h-4" />
                    <span>Flash SMS Bulletin</span>
                  </h4>
                  <span className="text-[10px] text-gov-navy font-black bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {broadcasts.smsBulletin.length} / 160 Chars
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-wrap max-h-72 overflow-y-auto">
                  {broadcasts.smsBulletin}
                </div>
              </div>

              <button
                onClick={() => handleCopyBroadcast(broadcasts.smsBulletin, 'sms')}
                className="mt-3 w-full bg-gov-navy hover:bg-gov-blue text-white font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 text-xs transition-colors shadow-sm"
              >
                {copiedType === 'sms' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedType === 'sms' ? 'Copied SMS Text!' : 'Copy Flash SMS'}</span>
              </button>
            </div>

            {/* 3. Notice Board Markdown Format */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>Camp Notice Board Bulletin</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded">Print Notice</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800 whitespace-pre-wrap max-h-72 overflow-y-auto">
                  {broadcasts.noticeBoardMarkdown}
                </div>
              </div>

              <button
                onClick={() => handleCopyBroadcast(broadcasts.noticeBoardMarkdown, 'notice')}
                className="mt-3 w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 text-xs transition-colors shadow-sm"
              >
                {copiedType === 'notice' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedType === 'notice' ? 'Copied Markdown!' : 'Copy Notice Form'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SUBTAB 4: RUMOR & SIGNAL HOTSPOTS RADAR --- */}
      {activeTab === 'signals' && (
        <div className="space-y-6">
          <div className="bg-purple-50/80 border border-purple-200 p-4 rounded-xl text-xs text-purple-950 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-purple-700 flex-shrink-0" />
              <span>
                <strong>Rumor Verification & Signal Clustering AI:</strong> Ingests unstructured crowd reports, groups correlated chatter into emerging hotspots, and verifies facts with local revenue circles to prevent mass panic.
              </span>
            </div>
            <span className="font-black bg-purple-200 text-purple-900 px-2.5 py-1 rounded text-[11px] uppercase tracking-wide">
              Fact Check Active
            </span>
          </div>

          {/* Citizen Report Ingest Form */}
          <form onSubmit={handleSignalSubmit} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 space-y-3">
            <h4 className="font-extrabold text-sm text-gov-navy flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Ingest Ground Chatter / Crowd Signal for Cluster Analysis:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Specific Location / Village / Highway (e.g. Silchar-Shillong road)"
                value={newSignalLocation}
                onChange={(e) => setNewSignalLocation(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="What is being reported? (e.g. Embankment seepage near Subansiri bridge)"
                value={newSignalText}
                onChange={(e) => setNewSignalText(e.target.value)}
                className="sm:col-span-2 bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <div className="text-right">
              <button
                type="submit"
                className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-sm transition-all"
              >
                Submit Signal to AI Clustering Engine
              </button>
            </div>
          </form>

          {/* Clustered Hotspot Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {signals.map((sig) => (
              <div
                key={sig.id}
                className={`bg-white rounded-xl shadow-sm border p-4 space-y-3 ${
                  sig.verificationStatus === 'VERIFIED_TRUE'
                    ? 'border-emerald-300 border-l-8 border-l-gov-green'
                    : sig.verificationStatus === 'DEBUNKED_FALSE'
                      ? 'border-red-300 border-l-8 border-l-gov-red'
                      : 'border-amber-300 border-l-8 border-l-gov-saffron'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      sig.verificationStatus === 'VERIFIED_TRUE'
                        ? 'bg-emerald-100 text-gov-green'
                        : sig.verificationStatus === 'DEBUNKED_FALSE'
                          ? 'bg-red-100 text-gov-red'
                          : 'bg-amber-100 text-amber-900'
                    }`}>
                      {sig.verificationStatus.replace('_', ' ')}
                    </span>
                    <h4 className="font-extrabold text-base text-slate-900 mt-1">{sig.headline}</h4>
                    <p className="text-xs text-slate-500 font-medium">{sig.location}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-700">
                      {sig.reportsCount} Reports Correlated
                    </div>
                    <div className="text-[11px] text-purple-700 font-black">
                      Confidence: {Math.round(sig.confidenceScore * 100)}%
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Citizen Text Snippets:</div>
                  {sig.rawSnippets.map((s, idx) => (
                    <div key={idx} className="text-xs text-slate-700 italic">
                      "{s}"
                    </div>
                  ))}
                </div>

                {sig.coordinatorNote && (
                  <div className="text-xs bg-slate-100 p-2.5 rounded-lg text-slate-800 border border-slate-200">
                    <strong>Official Verification Note:</strong> {sig.coordinatorNote}
                  </div>
                )}

                {/* Coordinator Verification Actions */}
                <div className="border-t border-slate-100 pt-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400">
                    Updated: {new Date(sig.timestamp).toLocaleTimeString()} IST
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onVerifySignal(sig.id, 'VERIFIED_TRUE', 'Confirmed by Circle Officer & dispatched emergency relief')}
                      className="bg-gov-green hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded text-xs shadow-sm transition-all"
                    >
                      Verify True
                    </button>
                    <button
                      onClick={() => onVerifySignal(sig.id, 'DEBUNKED_FALSE', 'Fact-checked by District Police / PWD. False panic rumor.')}
                      className="bg-gov-red hover:bg-red-700 text-white font-bold px-2.5 py-1 rounded text-xs shadow-sm transition-all"
                    >
                      Debunk Fake
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}