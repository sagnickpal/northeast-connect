# Northeast Connect (PS05)
## Community Emergency Assistant — North East Development & Disaster Management

**Northeast Connect** is an offline-resilient, lightweight, mobile-first community emergency assistant designed specifically for disaster-prone regions of North East India (Assam, Meghalaya, Arunachal Pradesh, Manipur, Mizoram, Nagaland, Tripura, and Sikkim). It empowers communities and district administrations during severe floods (Brahmaputra/Barak basin), landslides (NH-06, NH-29 cuts), Zone V earthquakes, and cloudburst emergencies.

---

## 🌟 Key Highlights & Architecture

### 1. Lightweight, Mobile-First & Low-Bandwidth Platform
- **Ultra-Low Bandwidth Mode**: Global toggle in the top bar switches to high-contrast, pure text, monospace rendering with zero decorative images/animations, designed for 2G EDGE networks and low battery emergencies.
- **PWA Offline Resilience**: Progressive Web App with Service Worker (`sw.js`) caching all safe shelter locations, road blockage maps, survival playbooks, and emergency contacts.
- **Offline SOS Queue**: Help requests submitted without network connectivity are saved in local storage with automatic sync once a signal is detected.
- **SMS & USSD Fallback**: One-tap standardized SMS generator (`SOS [DISTRICT] [NEED] [PEOPLE] [LANDMARK]` to `112`), with `sms:112` and interactive USSD (`*112#`) code dialer for basic feature phones.

### 2. Verified Emergency Info & Status Hub
- **Safe Shelters & Relief Camps**: Real-time bed occupancy, capacity, doctor availability, hot food kitchen status, and direct contact numbers for Camp Officers.
- **Road & Landslide Blockages**: Live highway passability on critical routes (NH-06 Shillong-Silchar, NH-29 Dimapur-Kohima, NH-102 Imphal-Moreh, Dhemaji rural causeways) with clearance ETAs and alternate detours.
- **River Water Level Gauges**: Central Water Commission (CWC) readings for Brahmaputra (Guwahati DC Court, Dibrugarh), Barak (Annapurna Ghat, Silchar), and Kopili (Kampur) with danger mark comparisons and flood trend forecasts.
- **Water & Power Advisories**: Public Health Engineering Department (PHED) boiling mandates, halogen tablet distribution points, and electrical substation safety warnings.
- **Strict Verification Tags**: All records show verified authorities (e.g., *Kamrup DDMA*, *BRO Project Dantak*) and exact timestamps.

### 3. Two-Way Assistance & Resource Coordination
- **Need Help / SOS**: Residents or ward gaonburas can log structured emergency requests with location, landmark, count of affected persons, and vulnerability tags (infant, pregnant, elderly, injured, roof-trapped).
- **Offer Help Board**: Volunteers, NGOs, and community groups can register available mechanized boats, 4x4 snorkel trucks, medical doctors, and hot meal kitchens.
- **Real-Time Lifecycle Tracking**: `PENDING` ➔ `IN_PROGRESS` ➔ `DISPATCHED` ➔ `RESOLVED` (or `MERGED`).

### 4. Preparedness & Action Playbooks
- **Interactive 72-Hour Family Go-Bag**: Interactive checklist that saves checked state locally, tracking essential water, chira/gur rations, medications, waterproof document pouches, and whistles.
- **Flood Survival Protocol**: Flash flood vs riverine inundation, rooftop signaling, electrical shutoffs, water purification with alum/chlorine tablets, and snakebite first-aid protocol.
- **Landslide Protocol**: 6 early warning signs (tilted trees, muddy springs, foundation cracks), perpendicular evacuation routes, and hill road safety.
- **Earthquake Survival**: NDMA Zone V seismic Drop-Cover-Hold On protocol and post-quake gas/power shutoff.

### 5. AI Capabilities
1. **Multilingual Simplification & Translation**:
   - Converts bureaucratic government notices into concise, grade-school level action points.
   - Translates into 8 regional languages: **English**, **অসমীয়া (Assamese)**, **বাংলা (Bengali)**, **बर’ (Bodo)**, **हिंदी (Hindi)**, **মৈতৈলোন্ (Meitei/Manipuri)**, **Khasi**, and **Mizo**.
2. **Smart Request Triage & Deduplication**:
   - Classifies incoming SOS text into urgency tiers (`CRITICAL_SOS`, `HIGH`, `MEDIUM`, `LOW`).
   - Extracts key entities (village, landmark, count of victims, vulnerability badges).
   - Detects near-duplicate reports from the same household/neighborhood using semantic and geographic token overlap, preventing redundant boat rescue sorties.
3. **Grounded RAG Emergency Guide Assistant**:
   - Grounded strictly in verified NDMA (National Disaster Management Authority) and ASDMA standard operating procedures.
   - Answers survival and preparedness questions with official citations.
   - **Strict Safety Guardrail**: Explicitly refuses to hallucinate or guess real-time road conditions or shelter bed numbers; redirects users to the live verified Status Hub.
4. **Rumor & Signal Clustering**:
   - Ingests messy, unstructured crowd chatter and SMS snippets.
   - Clusters related messages by location and hazard topic.
   - Surfaces emerging hotspots with confidence scores for field coordinators to verify or debunk.

### 6. Practical Automation Workflows
1. **Automated Alert & Status Escalation**:
   - Monitors an active 15-minute response SLA on `CRITICAL_SOS` cases.
   - Auto-escalates overdue requests to the District Disaster Response Coordinator.
2. **Scheduled Data Sync & Expiry (Freshness Engine)**:
   - Scans shelters (6h expiry) and road statuses (4h expiry).
   - Marks outdated records as *"⚠️ Stale — Needs Re-verification"* so evacuees are not misled.
   - Provides 1-click coordinator re-verification.
3. **Automated Digest & Broadcast Formatting**:
   - Automatically formats real-time situation reports into:
     - **WhatsApp Community Broadcast** (rich text with emojis, shelter counts, and helplines)
     - **Flash SMS** (compact, under 160 characters for telecom cell broadcast)
     - **High-Contrast Notice Board Markdown** (for camp gates and DC office walls)

---

## 📁 Project Structure

```
northeast-connect/
├── client/                          # React + Vite Frontend
│   ├── public/
│   │   ├── manifest.json            # PWA Web App Manifest
│   │   └── sw.js                    # PWA Service Worker (Offline Cache)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Top header, 2G mode toggle, language picker
│   │   │   ├── StatusHub.jsx        # Shelters, roads, river gauges, advisories
│   │   │   ├── TwoWayCoordination.jsx # SOS queue & Volunteer supply board
│   │   │   ├── Playbooks.jsx        # Go-bag checklist & survival playbooks
│   │   │   ├── EmergencyDirectory.jsx # Direct-dial verified phone directory
│   │   │   ├── CoordinatorDashboard.jsx # SLA radar, freshness, broadcasts, rumors
│   │   │   ├── SosModal.jsx         # Structured SOS request form with AI preview
│   │   │   ├── OfferHelpModal.jsx   # Volunteer registration modal
│   │   │   ├── AiAssistantModal.jsx # Grounded RAG emergency guide assistant
│   │   │   ├── SimplifyAdvisoryModal.jsx # Multilingual AI simplifier modal
│   │   │   ├── SmsUssdModal.jsx     # SMS syntax generator & USSD dialer
│   │   │   └── EmergencyAlarmModal.jsx # Acoustic siren & screen strobe torch
│   │   ├── data/
│   │   │   └── translations.js      # 8-language UI translation dictionary
│   │   ├── App.jsx                  # Main application orchestrator
│   │   ├── index.css                # Tailwind directives & ultra-low bandwidth CSS
│   │   └── main.jsx                 # Client entry point
│   ├── index.html                   # HTML entry with PWA registration
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                          # Express.js Backend & AI Services
│   ├── src/
│   │   ├── data/
│   │   │   └── seedData.js          # North East India disaster datasets & RAG KB
│   │   ├── services/
│   │   │   ├── aiService.js         # Multilingual translation, triage & RAG
│   │   │   └── automationService.js # Escalation, freshness & broadcast engine
│   │   └── server.js                # Express API & static dist server
│   ├── test-e2e.js                  # Verification test suite
│   └── package.json
└── package.json                     # Monorepo scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm (v9 or newer)

### 1. Installation
In the project root directory:
```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Build Frontend
```bash
cd client
npm run build
```

### 3. Run the Application
Start the unified full-stack server (serves the API and React PWA client on port 5000):
```bash
cd ../server
npm start
```
Open your browser at:
👉 **`http://localhost:5000`**

### 4. Running the Verification Test Suite
```bash
cd server
node test-e2e.js
```
