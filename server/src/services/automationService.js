// Practical Automation Workflows Engine for Northeast Connect
// 1. Automated Alert & Status Escalation
// 2. Scheduled Data Sync & Expiry (Freshness Engine)
// 3. Automated Digest & Broadcast Formatting (WhatsApp, Flash SMS, Camp Notice Board)

export function runEscalationAudit(requests = []) {
  const now = Date.now();
  const updatedRequests = requests.map(req => {
    const createdTime = new Date(req.createdAt).getTime();
    const elapsedMinutes = Math.floor((now - createdTime) / (1000 * 60));
    const sla = req.slaMinutes || (req.urgency === 'CRITICAL_SOS' ? 15 : req.urgency === 'HIGH' ? 45 : 120);

    const isOverdue = elapsedMinutes > sla && req.status !== 'RESOLVED' && req.status !== 'MERGED';
    const minutesLeft = Math.max(0, sla - elapsedMinutes);

    return {
      ...req,
      elapsedMinutes,
      slaMinutes: sla,
      minutesRemaining: minutesLeft,
      isOverdue,
      isEscalated: req.isEscalated || isOverdue,
      escalationReason: isOverdue 
        ? `SLA Breach: Request has been in '${req.status}' state for ${elapsedMinutes} mins (Target SLA: ${sla} mins). Auto-escalated to District Disaster Response Coordinator.`
        : req.urgencyReason
    };
  });

  return updatedRequests;
}

export function runFreshnessAudit(shelters = [], roads = []) {
  const now = Date.now();
  const SHELTER_EXPIRY_MS = 6 * 60 * 60 * 1000; // 6 hours
  const ROAD_EXPIRY_MS = 4 * 60 * 60 * 1000;    // 4 hours

  const updatedShelters = shelters.map(s => {
    const updatedTime = new Date(s.lastUpdated).getTime();
    const ageHours = ((now - updatedTime) / (1000 * 60 * 60)).toFixed(1);
    const isStale = (now - updatedTime) > SHELTER_EXPIRY_MS;

    return {
      ...s,
      dataAgeHours: parseFloat(ageHours),
      isStale,
      freshnessBadge: isStale 
        ? `⚠️ Stale — Needs Re-verification (${ageHours}h ago)` 
        : `Verified Fresh (${ageHours}h ago)`
    };
  });

  const updatedRoads = roads.map(r => {
    const updatedTime = new Date(r.lastUpdated).getTime();
    const ageHours = ((now - updatedTime) / (1000 * 60 * 60)).toFixed(1);
    const isStale = (now - updatedTime) > ROAD_EXPIRY_MS;

    return {
      ...r,
      dataAgeHours: parseFloat(ageHours),
      isStale,
      freshnessBadge: isStale 
        ? `⚠️ Stale Road Status (${ageHours}h ago)` 
        : `Verified Clear/Current (${ageHours}h ago)`
    };
  });

  return { shelters: updatedShelters, roads: updatedRoads };
}

export function generateAutomatedBroadcasts({ shelters = [], roads = [], riverGauges = [], advisories = [] }) {
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });
  
  // 1. WhatsApp Community Broadcast (Rich formatted, emoji bullets)
  const openShelters = shelters.filter(s => !s.isStale && s.availableSpace > 0).slice(0, 3);
  const criticalRoads = roads.filter(r => r.status === 'CLOSED').slice(0, 3);
  const activeAdvisory = advisories[0] || null;

  const whatsappBulletin = 
`🚨 *NORTH EAST CONNECT - EMERGENCY STATUS BULLETIN*
📅 *Issued:* ${timestamp} IST
📡 *Verified by:* State Disaster Management Authorities (ASDMA / MSDMA)

🔴 *CRITICAL ROAD & LANDSLIDE CLOSURES:*
${criticalRoads.map(r => `• *${r.roadName}* (${r.stretch}): CLOSED due to ${r.hazardType}. ETA: ${r.clearanceETA}`).join('\n')}

🟢 *ACTIVE VERIFIED RELIEF SHELTERS (Vacancies Available):*
${openShelters.map(s => `• *${s.name}* (${s.district}): *${s.availableSpace} beds free* (Cap: ${s.capacity}). Doctor on duty: ${s.medicalAvailable ? 'YES' : 'NO'}. Contact: ${s.contactPhone}`).join('\n')}

💧 *KEY WATER & ADVISORY ALERT:*
${activeAdvisory ? `• *${activeAdvisory.title}*: ${activeAdvisory.summary}` : '• Water levels above danger mark. Boil all drinking water 3 minutes.'}

📞 *EMERGENCY RESCUE HELPLINES:*
• National Emergency: 112
• Assam SDMA Control Room: 1070 / 1079
• NDRF 1st Bn (Water Rescue): +91 94359 62222
• Medical Emergency / Ambulance: 108

🌐 *Live Portal & Low-Bandwidth Mode:* https://northeast-connect.gov.in
_Please share in local ward & village groups to keep community safe._`;

  // 2. Flash SMS (< 160 characters)
  const closedRoadShort = criticalRoads[0] ? `${criticalRoads[0].roadName.split('(')[0].trim()} CLOSED` : 'Highways on caution';
  const freeShelterShort = openShelters[0] ? `${openShelters[0].name.slice(0, 16)} (${openShelters[0].availableSpace} beds)` : 'Camps active';
  const smsBulletin = `EMERGENCY ${timestamp.slice(0, 11)}: ${closedRoadShort}. Shelter: ${freeShelterShort}. Dial 112 for rescue. Boil water 3 min. Web: neconnect.in`.slice(0, 160);

  // 3. High-Contrast Printable Notice Board Format (Markdown)
  const noticeBoardMarkdown = 
`# 🚨 DISTRICT EMERGENCY RELIEF BULLETIN
**POST ON CAMP GATE / PANCHAYAT BHAWAN NOTICE BOARD**
*Date & Time of Verification: ${timestamp} IST*

---

## 1. 🛑 CURRENT ROAD & HIGHWAY STATUS
${roads.map(r => `
### ${r.roadName} — [STATUS: **${r.status}**]
- **Section:** ${r.stretch} (${r.state})
- **Hazard:** ${r.hazardType}
- **Current Situation:** ${r.description}
- **Clearance ETA:** ${r.clearanceETA}
- **Detour / Alternate:** ${r.alternateRoute}
- **Verified by:** ${r.verifiedBy} (${r.lastUpdated.slice(11, 16)} IST)
`).join('\n')}

---

## 2. 🏕️ VERIFIED RELIEF CAMPS & SAFE SHELTERS
| Camp Name | District | Space Available | Medical Staff | Food / Water | Camp Officer |
|---|---|---|---|---|---|
${shelters.map(s => `| **${s.name}** | ${s.district} | **${s.availableSpace} beds** (${s.currentOccupancy}/${s.capacity}) | ${s.medicalAvailable ? '✅ Doctor on Duty' : '❌ First aid only'} | ${s.foodAvailable ? '✅ Kitchen Active' : '⚠️ Ration Needed'} | ${s.contactPerson} (${s.contactPhone}) |`).join('\n')}

---

## 3. 🌊 RIVER GAUGE MONITORING (CENTRAL WATER COMMISSION)
| River | Gauge Station | Current Level | Danger Level | Status & Trend |
|---|---|---|---|---|
${riverGauges.map(g => `| **${g.river}** | ${g.station} | **${g.currentLevel}** | ${g.dangerLevel} | **${g.status}** (${g.trend}) |`).join('\n')}

---

## 4. 📞 EMERGENCY HELPLINES & RESCUE COORDINATION
- **National Emergency Number (All Services):** \`112\`
- **State Disaster Operation Centre (SEOC):** \`1070\`
- **Fire & Water Rescue Boat Services:** \`101\`
- **Ambulance & Trauma Care:** \`108\`
- **Electricity & Spark Emergency (APDCL):** \`1912\`
- **NDRF 1st Battalion Guwahati:** \`+91 94359 62222\`
`;

  return {
    timestamp,
    whatsappBulletin,
    smsBulletin,
    noticeBoardMarkdown
  };
}
