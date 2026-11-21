import express from 'express';
import cors from 'cors';
import {
  seedShelters,
  seedRoads,
  seedRiverGauges,
  seedAdvisories,
  seedContacts,
  seedRequests,
  seedOffers,
  seedRumorsAndSignals
} from './data/seedData.js';
import {
  simplifyAndTranslateAdvisory,
  triageHelpRequest,
  answerEmergencyQueryGrounded,
  clusterRawSignals
} from './services/aiService.js';
import {
  runEscalationAudit,
  runFreshnessAudit,
  generateAutomatedBroadcasts
} from './services/automationService.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-Memory Database State (seeded with rich North East disaster context)
let shelters = [...seedShelters];
let roads = [...seedRoads];
let riverGauges = [...seedRiverGauges];
let advisories = [...seedAdvisories];
let contacts = [...seedContacts];
let requests = [...seedRequests];
let offers = [...seedOffers];
let signals = [...seedRumorsAndSignals];

// ---------------- API ROUTES ----------------

// System Health & Overview
app.get('/api/status', (req, res) => {
  const audit = runFreshnessAudit(shelters, roads);
  const activeRequests = requests.filter(r => r.status !== 'RESOLVED' && r.status !== 'MERGED');
  const criticalSos = activeRequests.filter(r => r.urgency === 'CRITICAL_SOS');

  res.json({
    status: 'ONLINE',
    region: 'North East India (AS, ML, AR, MN, MZ, NL, TR, SK)',
    activeReliefCamps: shelters.length,
    totalAvailableShelterBeds: shelters.reduce((acc, s) => acc + s.availableSpace, 0),
    activeRoadHazards: roads.filter(r => r.status !== 'OPEN').length,
    activeSosRequests: activeRequests.length,
    criticalSosAlerts: criticalSos.length,
    staleDataAlerts: audit.shelters.filter(s => s.isStale).length + audit.roads.filter(r => r.isStale).length,
    systemTime: new Date().toISOString()
  });
});

// 1. Shelters Hub
app.get('/api/shelters', (req, res) => {
  const { state, district, availableOnly } = req.query;
  const audit = runFreshnessAudit(shelters, roads);
  let list = audit.shelters;

  if (state) list = list.filter(s => s.state.toLowerCase() === state.toLowerCase());
  if (district) list = list.filter(s => s.district.toLowerCase().includes(district.toLowerCase()));
  if (availableOnly === 'true') list = list.filter(s => s.availableSpace > 0);

  res.json(list);
});

app.post('/api/shelters', (req, res) => {
  const newShelter = {
    id: `sh-${Date.now().toString().slice(-4)}`,
    ...req.body,
    availableSpace: (req.body.capacity || 100) - (req.body.currentOccupancy || 0),
    lastUpdated: new Date().toISOString(),
    isStale: false
  };
  shelters.unshift(newShelter);
  res.status(201).json(newShelter);
});

app.post('/api/shelters/:id/reverify', (req, res) => {
  const { id } = req.params;
  const { verifiedBy } = req.body;
  const shelter = shelters.find(s => s.id === id);
  if (!shelter) return res.status(404).json({ error: 'Shelter not found' });

  shelter.lastUpdated = new Date().toISOString();
  shelter.isStale = false;
  shelter.dataAgeHours = 0;
  shelter.freshnessBadge = "Verified Fresh (just now)";
  if (verifiedBy) shelter.verifiedSource = verifiedBy;
  if (req.body.currentOccupancy !== undefined) {
    shelter.currentOccupancy = req.body.currentOccupancy;
    shelter.availableSpace = shelter.capacity - shelter.currentOccupancy;
  }

  res.json(shelter);
});

// 2. Roads & Landslides Hub
app.get('/api/roads', (req, res) => {
  const audit = runFreshnessAudit(shelters, roads);
  res.json(audit.roads);
});

app.post('/api/roads/:id/reverify', (req, res) => {
  const { id } = req.params;
  const { verifiedBy, status, clearanceETA } = req.body;
  const road = roads.find(r => r.id === id);
  if (!road) return res.status(404).json({ error: 'Road entry not found' });

  road.lastUpdated = new Date().toISOString();
  road.isStale = false;
  road.dataAgeHours = 0;
  road.freshnessBadge = "Verified Clear/Current (just now)";
  if (verifiedBy) road.verifiedBy = verifiedBy;
  if (status) road.status = status;
  if (clearanceETA) road.clearanceETA = clearanceETA;

  res.json(road);
});

// 3. River Gauges & Advisories
app.get('/api/river-gauges', (req, res) => {
  res.json(riverGauges);
});

app.get('/api/advisories', (req, res) => {
  res.json(advisories);
});

// 4. Emergency Contacts Directory
app.get('/api/contacts', (req, res) => {
  res.json(contacts);
});

// 5. Help Requests (Need Help / SOS)
app.get('/api/requests', (req, res) => {
  const audited = runEscalationAudit(requests);
  res.json(audited);
});

app.post('/api/requests', (req, res) => {
  const input = req.body;
  
  // Apply AI Smart Triage & Deduplication
  const aiTriage = triageHelpRequest(input, requests);

  const isDup = aiTriage.duplicateMatch && aiTriage.duplicateMatch.isDuplicate;

  const newRequest = {
    id: `req-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
    requesterName: input.requesterName || "Anonymous Resident",
    contactPhone: input.contactPhone || "Not provided",
    state: input.state || "Assam",
    district: input.district || "Kamrup Metropolitan",
    villageOrArea: input.villageOrArea || "",
    landmark: input.landmark || "",
    coordinates: input.coordinates || null,
    needType: input.needType || "RESCUE",
    description: input.description || "",
    peopleCount: input.peopleCount || aiTriage.extractedEntities.detectedPeopleCount,
    vulnerabilities: (input.vulnerabilities && input.vulnerabilities.length > 0) ? input.vulnerabilities : aiTriage.extractedEntities.vulnerabilities,
    urgency: aiTriage.urgency,
    urgencyScore: aiTriage.urgencyScore,
    urgencyReason: aiTriage.urgencyReason,
    status: isDup ? "MERGED" : "PENDING",
    assignedTeam: isDup ? `Merged with ${aiTriage.duplicateMatch.matchedRequestId}` : null,
    createdAt: new Date().toISOString(),
    slaMinutes: aiTriage.urgency === 'CRITICAL_SOS' ? 15 : aiTriage.urgency === 'HIGH' ? 45 : 120,
    isEscalated: aiTriage.urgency === 'CRITICAL_SOS',
    duplicateGroupId: isDup ? aiTriage.duplicateMatch.matchedRequestId : null,
    isDuplicateOf: isDup ? aiTriage.duplicateMatch.matchedRequestId : null,
    aiAnalysis: aiTriage
  };

  requests.unshift(newRequest);
  res.status(201).json(newRequest);
});

app.patch('/api/requests/:id', (req, res) => {
  const { id } = req.params;
  const index = requests.findIndex(r => r.id === id);
  if (index === -1) return res.status(404).json({ error: 'Request not found' });

  requests[index] = {
    ...requests[index],
    ...req.body
  };

  res.json(requests[index]);
});

// 6. Volunteer & Supply Board (Offer Help)
app.get('/api/offers', (req, res) => {
  res.json(offers);
});

app.post('/api/offers', (req, res) => {
  const newOffer = {
    id: `off-${Date.now().toString().slice(-4)}`,
    ...req.body,
    status: "ACTIVE",
    verificationStatus: "VERIFIED",
    verifiedBy: req.body.verifiedBy || "Northeast Connect Community Admin",
    createdAt: new Date().toISOString()
  };
  offers.unshift(newOffer);
  res.status(201).json(newOffer);
});

// 7. Rumor & Signal Hotspots
app.get('/api/signals', (req, res) => {
  res.json(signals);
});

app.post('/api/signals', (req, res) => {
  const { text, location, headline } = req.body;
  if (!text) return res.status(400).json({ error: 'Report text is required' });

  signals = clusterRawSignals([{ text, location, headline }], signals);
  res.status(201).json(signals);
});

app.post('/api/signals/:id/verify', (req, res) => {
  const { id } = req.params;
  const { status, note, actionTaken } = req.body;
  const signal = signals.find(s => s.id === id);
  if (!signal) return res.status(404).json({ error: 'Signal not found' });

  if (status) signal.verificationStatus = status;
  if (note) signal.coordinatorNote = note;
  if (actionTaken) signal.actionTaken = actionTaken;
  signal.timestamp = new Date().toISOString();

  res.json(signal);
});

// 8. AI Endpoints
// Multilingual Simplification & Translation
app.post('/api/ai/simplify', (req, res) => {
  const { advisoryId, advisoryData, targetLang = 'en' } = req.body;
  const adv = advisoryData || advisories.find(a => a.id === advisoryId) || advisories[0];
  const simplified = simplifyAndTranslateAdvisory(adv, targetLang);
  res.json(simplified);
});

// Grounded RAG Emergency Guide Assistant
app.post('/api/ai/assistant', (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required' });

  const response = answerEmergencyQueryGrounded(query);
  res.json(response);
});

// 9. Automation Endpoints
app.get('/api/automation/broadcasts', (req, res) => {
  const audit = runFreshnessAudit(shelters, roads);
  const broadcasts = generateAutomatedBroadcasts({
    shelters: audit.shelters,
    roads: audit.roads,
    riverGauges,
    advisories
  });
  res.json(broadcasts);
});

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

// Serve static frontend build if present
app.use(express.static(clientDistPath));

// Fallback to index.html for SPA client-side routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.json({ message: "Northeast Connect API Server Online. Client build available at /" });
    }
  });
});

// Start Express Server with graceful port fallback
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`\n==================================================`);
    console.log(`  [NE Connect Server] Running on http://localhost:${port}`);
    console.log(`  API Endpoints: http://localhost:${port}/api/status`);
    console.log(`  Web Dashboard: http://localhost:${port}/`);
    console.log(`==================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`\n⚠️  Port ${port} is already in use by another application or background process.`);
      const nextPort = Number(port) + 1;
      console.log(`👉 Automatically trying fallback port ${nextPort}...`);
      startServer(nextPort);
    } else {
      console.error('Server error:', err);
    }
  });
};

// Export app for Vercel serverless functions and testing
export default app;

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  startServer(PORT);
}
