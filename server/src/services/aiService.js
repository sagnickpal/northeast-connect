// AI Service for Northeast Connect
// 1. Multilingual Simplification & Translation (English, Assamese, Bengali, Bodo, Hindi, Meitei, Khasi, Mizo)
// 2. Smart Request Triage & Deduplication
// 3. Grounded RAG Emergency Guide Assistant (NDMA/ASDMA Grounded)
// 4. Rumor & Signal Clustering

import { ragKnowledgeBase } from '../data/seedData.js';

// --- FEATURE 1: MULTILINGUAL SIMPLIFICATION & TRANSLATION ---
const translationDictionary = {
  as: {
    // Assamese (অসমীয়া)
    "EMERGENCY ADVISORY": "জৰুৰীকালীন সতৰ্কবাৰ্তা",
    "CRITICAL": "অতি গুৰুতৰ",
    "HIGH": "উচ্চ বিপদ",
    "NORMAL": "স্বাভাৱিক",
    "WARNING": "সতৰ্কতা",
    "What to do right now": "এতিয়াই আপুনি কি কৰিব লাগিব",
    "Official Helpline": "চৰকাৰী হেল্পলাইন",
    "Boil water vigorously for at least 3 minutes": "খোৱা বা ৰন্ধাৰ আগতে পানী কমেও ৩ মিনিট ভালদৰে উতলাই লওক।",
    "Do not drink untreated flood or tap water": "বানপানী বা পোনপটীয়া টেপৰ পানী কেতিয়াও নাখাব।",
    "Collect chlorine/Halazone tablets from ward relief centre": "ওচৰৰ সাহায্য শিবিৰৰ পৰা ক্ল'ৰিন বা হেলোজোন টেবলেট সংগ্ৰহ কৰক।",
    "Stay away from fallen electric wires and submerged poles": "ছিঙি পৰা বিদ্যুৎৰ তাঁৰ আৰু পানীত নিমজ্জিত খুঁটাৰ পৰা দূৰত থাকক।",
    "Keep phone charged using emergency camps": "সাহায্য শিবিৰৰ জেনেৰেটৰত মোবাইল চাৰ্জ কৰি ৰাখক।",
    "Report electric spark to APDCL emergency 1912": "বিদ্যুৎৰ স্ফুলিংগ দেখিলে ততাতৈয়াকৈ ১৯১২ নম্বৰত খবৰ দিয়ক।",
    "Evacuate hill slope houses before nightfall": "নিশা হোৱাৰ আগতেই পাহাৰীয়া ঢালৰ বিপদজনক ঘৰ খালি কৰি শিবিৰলৈ যাওক।",
    "Watch for tilted trees and sudden muddy springs": "গছ হালি পৰা বা হঠাৎ বোকাময় পানী ওলোৱা লক্ষ্য কৰক।"
  },
  bn: {
    // Bengali (বাংলা)
    "EMERGENCY ADVISORY": "জরুরি সতর্কতা বিজ্ঞপ্তি",
    "CRITICAL": "চরম সংকটজনক",
    "HIGH": "উচ্চ ঝুঁকি",
    "NORMAL": "স্বাভাবিক",
    "WARNING": "সতর্কতা",
    "What to do right now": "এখনই আপনার করণীয়",
    "Official Helpline": "অফিসিয়াল হেল্পলাইন",
    "Boil water vigorously for at least 3 minutes": "পান বা রান্নার আগে জল কমপক্ষে ৩ মিনিট ভালোভাবে ফুটিয়ে নিন।",
    "Do not drink untreated flood or tap water": "বন্যার জল বা অপরিশোধিত কলের জল সরাসরি পান করবেন না।",
    "Collect chlorine/Halazone tablets from ward relief centre": "ওয়ার্ড রিলিফ কেন্দ্র থেকে ক্লোরিন বা হ্যালোজোন ট্যাবলেট সংগ্রহ করুন।",
    "Stay away from fallen electric wires and submerged poles": "ছেঁড়া বিদ্যুতের তার এবং জলের নিচে থাকা ট্রান্সফর্মার থেকে দূরে থাকুন।",
    "Keep phone charged using emergency camps": "ত্রাণ শিবিরের জেনারেটর পয়েন্ট থেকে মোবাইল চার্জ রাখুন।",
    "Report electric spark to APDCL emergency 1912": "বৈদ্যুতিক স্পার্ক দেখলে সাথে সাথে ১৯১২ নম্বরে জানান।",
    "Evacuate hill slope houses before nightfall": "রাত নামার আগেই ঝুঁকিপূর্ণ পাহাড়ের ঢালের বাড়ি ছেড়ে আশ্রয়কেন্দ্রে যান।",
    "Watch for tilted trees and sudden muddy springs": "গাছ হেলে পড়া বা পাহাড়ের মাটি থেকে হঠাৎ ঘোলা জল বের হওয়া খেয়াল করুন।"
  },
  brx: {
    // Bodo (बर’)
    "EMERGENCY ADVISORY": "गोनांथार सांग्रांथि खौरां",
    "CRITICAL": "जोबोद खस्थ'आरि",
    "HIGH": "सावग्रा खौरां",
    "NORMAL": "सरासनस्रा",
    "WARNING": "सांग्रांथि",
    "What to do right now": "दासिम नोंथाङा मा खालामनांगौ",
    "Official Helpline": "सोरखारि हेफाजाब नम्बर",
    "Boil water vigorously for at least 3 minutes": "दै लोंनायनि सिगां ३ मिनिट मोजाङै फुदुंना लों।",
    "Do not drink untreated flood or tap water": "दैबानानि मैला दैखौ लोंनो नाङा।",
    "Collect chlorine/Halazone tablets from ward relief centre": "रिलिफ केम्पनिफ्राय क्लोरिन ट्याब्लेट लायना लों।",
    "Stay away from fallen electric wires and submerged poles": "ग्लिदोंनाय मोब्लिब थारनिफ्राय गोजानाव था।",
    "Keep phone charged using emergency camps": "रिलिफ केम्पनिफ्राय मबाइल सार्ज खालामना लाखि।",
    "Report electric spark to APDCL emergency 1912": "मोब्लिबनि जुदि जुदि जाथाय जायोबा 1912 आव फोन खालाम।",
    "Evacuate hill slope houses before nightfall": "हर जाबायनि सिगां हाजो सिडाइनि न' गारनानै रिलिफ केम्पाव थां।",
    "Watch for tilted trees and sudden muddy springs": "फांथाय हेंखावनाय आरो हाजोनिफ्राय मैला दै ओंखारनायखौ नोजोर हो।"
  },
  hi: {
    // Hindi (हिंदी)
    "EMERGENCY ADVISORY": "आपातकालीन सुरक्षा सलाह",
    "CRITICAL": "अति संवेदनशील / जानलेवा",
    "HIGH": "उच्च जोखिम",
    "NORMAL": "सामान्य",
    "WARNING": "चेतावनी",
    "What to do right now": "इस समय आपको क्या कदम उठाने चाहिए",
    "Official Helpline": "आधिकारिक हेल्पलाइन",
    "Boil water vigorously for at least 3 minutes": "पीने या खाना पकाने से पहले पानी को कम से कम 3 मिनट तक अच्छी तरह उबालें।",
    "Do not drink untreated flood or tap water": "बाढ़ का पानी या सीधे नल का पानी बिना उबाले कभी न पिएं।",
    "Collect chlorine/Halazone tablets from ward relief centre": "राहत शिविर से क्लोरीन/हैलोजोन गोलियां प्राप्त करें।",
    "Stay away from fallen electric wires and submerged poles": "टूटे हुए बिजली के तारों और डूबे हुए खंभों से सुरक्षित दूरी बनाए रखें।",
    "Keep phone charged using emergency camps": "राहत शिविरों के जनरेटर पॉइंट से अपने मोबाइल फोन चार्ज रखें।",
    "Report electric spark to APDCL emergency 1912": "बिजली स्पार्किंग दिखने पर तुरंत 1912 या 112 पर कॉल करें।",
    "Evacuate hill slope houses before nightfall": "अंधेरा होने से पहले भूस्खलन संभावित ढलानों से सुरक्षित राहत शिविरों में जाएं।",
    "Watch for tilted trees and sudden muddy springs": "पेड़ों के झुकने या जमीन से अचानक मटमैला पानी फूटने पर तुरंत जगह खाली करें।"
  },
  mni: {
    // Meitei / Manipuri (মৈতৈলোন্)
    "EMERGENCY ADVISORY": "অকক্নবা চেক্সিন ৱাফম",
    "CRITICAL": "য়াম্না অকনবা",
    "HIGH": "চেক্সিন্নিংঙাই",
    "NORMAL": "ময়ায় ওইবা",
    "WARNING": "চেক্সিন খোঞ্জেল",
    "What to do right now": "হৌজিক তৌগদবা থবকশিং",
    "Official Helpline": "সরকারগী মতেং পাংফম নম্বর্",
    "Boil water vigorously for at least 3 minutes": "ঈশিং থকনবা মতমদা মিনিত ৩ হেন্না ফনা সৌহন্নু।",
    "Do not drink untreated flood or tap water": "ঈশিং ইচাউগী ঈশিং অহুম্বা চাতনা থক্লোইদবনি।",
    "Collect chlorine/Halazone tablets from ward relief centre": "রিলিফ কেম্পতগী ক্লোরিন ত্যাবলেৎ লৌদুনা শিজিন্নৌ।",
    "Stay away from fallen electric wires and submerged poles": "তুংলবা মৈগী ৱায়রশিং অমসুং ঈশিংদা লুপ্লবা পোষ্টশিংদগী লাপ্না লৈয়ু।",
    "Keep phone charged using emergency camps": "রিলিফ কেম্পকী জেনরেটরদগী ফোন চার্জ তৌদুনা থম্মু।",
    "Report electric spark to APDCL emergency 1912": "মৈগী স্পার্ক থোক্লবদি অথুবা মতমদা ১৯১২ দা পাও পীয়ু।",
    "Evacuate hill slope houses before nightfall": "নুমিৎ তাদ্রিঙৈদা চিং ময়াগী য়ুমশিং থাদোক্তুনা রিলিফ কেম্পতা চত্তুনা লৈয়ু।",
    "Watch for tilted trees and sudden muddy springs": "উ হিলবা অমসুং লাইরিংবা ঈশিং খোংদোরকপদা চেক্সিন্নৌ।"
  },
  kha: {
    // Khasi
    "EMERGENCY ADVISORY": "Ka Jingbthah Ha Ka Jingjia Kynsan",
    "CRITICAL": "Kaba Majur Bha",
    "HIGH": "Kaba Ma Bha",
    "NORMAL": "Kaba Jai Jai",
    "WARNING": "Ka Jingmaham",
    "What to do right now": "Kiei ban leh kloi kloi",
    "Official Helpline": "Helpline ba kyrpang",
    "Boil water vigorously for at least 3 minutes": "Shettit ia ka um duma 3 minit shwa ban dih lane shet jingbam.",
    "Do not drink untreated flood or tap water": "Wat dih ia ka um shlei lane um um ba jabieh.",
    "Collect chlorine/Halazone tablets from ward relief centre": "Shim ia ki dawai chlorine na ki relief camp.",
    "Stay away from fallen electric wires and submerged poles": "Kieng jngai na ki sain ding ba hap lane ki post ding ba ngam ha um.",
    "Keep phone charged using emergency camps": "Pynbiang charge ia ki mobile na ki relief camp generator.",
    "Report electric spark to APDCL emergency 1912": "Pyntip kloi lada iohi ding ba bthei sha 1912 lane 112.",
    "Evacuate hill slope houses before nightfall": "Kynriah noh na ki jaka ba stet ban twa shwa ban miet.",
    "Watch for tilted trees and sudden muddy springs": "Sharai ia ki dieng ba kyllon bad um ktieh ba mih khlem poi pyrkhat."
  },
  mzo: {
    // Mizo
    "EMERGENCY ADVISORY": "Chhiatrupna Thuchhuah Pawimawh",
    "CRITICAL": "Hlauhawm Zualpui",
    "HIGH": "Hlauhawm",
    "NORMAL": "Pangngai",
    "WARNING": "Fimkhurna Thu",
    "What to do right now": "Tun hnaia tih tur hmanhmawhthlak",
    "Official Helpline": "Sawrkar Helpline",
    "Boil water vigorously for at least 3 minutes": "Tui in tur leh chhum tur chu minute 3 tal chhum so hmasak tur a ni.",
    "Do not drink untreated flood or tap water": "Tuilian tui leh tui thianghlim lo reng reng in suh.",
    "Collect chlorine/Halazone tablets from ward relief centre": "Relief camp atangin tui tih thianghlimna chlorine damdawi la rawh.",
    "Stay away from fallen electric wires and submerged poles": "Electric hrui chat leh post tui chim chin hnaih reng reng suh.",
    "Keep phone charged using emergency camps": "Relief camp generator hmangin phone charge nung reng rawh.",
    "Report electric spark to APDCL emergency 1912": "Electric thir hrui meizik hmuh chuan 1912/112-ah hriattir nghal rawh.",
    "Evacuate hill slope houses before nightfall": "Kham thlang leh leimin hlauhawm hmun atangin khawthim hmain insawn chhuak rawh.",
    "Watch for tilted trees and sudden muddy springs": "Thing thle leh leilung tui chirh luang chhuak thut chian rawh."
  }
};

export function simplifyAndTranslateAdvisory(advisory, targetLang = 'en') {
  // 1. Simplify complex bureaucratic language into clear emergency bullet points
  const simplified = {
    originalId: advisory.id,
    language: targetLang,
    title: advisory.title,
    severity: advisory.severity,
    targetAudience: advisory.districts ? advisory.districts.join(', ') : advisory.state,
    plainSummary: advisory.summary,
    actionChecklist: advisory.actionSteps || [],
    helpline: "National Emergency Helpline: 112 | ASDMA State Control Room: 1070"
  };

  if (targetLang === 'en' || !translationDictionary[targetLang]) {
    return simplified;
  }

  const dict = translationDictionary[targetLang];

  // Generative translation mapping with regional dictionary substitutions
  const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const translatePhrase = (text) => {
    let result = text;
    for (const [eng, trans] of Object.entries(dict)) {
      if (text.toLowerCase().includes(eng.toLowerCase())) {
        result = result.replace(new RegExp(escapeRegExp(eng), 'gi'), trans);
      }
    }
    return result;
  };

  const translatedActions = (advisory.actionSteps || []).map(step => {
    // Match dictionary or approximate
    if (step.includes("boil water")) return dict["Boil water vigorously for at least 3 minutes"] || step;
    if (step.includes("tap water") || step.includes("river water")) return dict["Do not drink untreated flood or tap water"] || step;
    if (step.includes("chlorine") || step.includes("Halazone")) return dict["Collect chlorine/Halazone tablets from ward relief centre"] || step;
    if (step.includes("power cables") || step.includes("wires")) return dict["Stay away from fallen electric wires and submerged poles"] || step;
    if (step.includes("phones charged")) return dict["Keep phone charged using emergency camps"] || step;
    if (step.includes("APDCL") || step.includes("sparking")) return dict["Report electric spark to APDCL emergency 1912"] || step;
    if (step.includes("relocate") || step.includes("slopes")) return dict["Evacuate hill slope houses before nightfall"] || step;
    if (step.includes("tilting") || step.includes("muddy")) return dict["Watch for tilted trees and sudden muddy springs"] || step;
    return translatePhrase(step);
  });

  return {
    ...simplified,
    title: translatePhrase(advisory.title),
    severityText: dict[advisory.severity] || advisory.severity,
    headerTitle: dict["EMERGENCY ADVISORY"],
    actionHeader: dict["What to do right now"],
    helplineHeader: dict["Official Helpline"],
    actionChecklist: translatedActions
  };
}

// --- FEATURE 2: SMART REQUEST TRIAGE & DEDUPLICATION ---
export function triageHelpRequest(requestInput, existingRequests = []) {
  const text = `${requestInput.description || ''} ${requestInput.needType || ''} ${requestInput.landmark || ''}`.toLowerCase();
  
  // 1. Entity Extraction
  const extractedEntities = {
    needs: [],
    vulnerabilities: [],
    detectedPeopleCount: requestInput.peopleCount || 1,
    detectedLandmark: requestInput.landmark || "Not specified",
    extractedUrgencyKeywords: []
  };

  // Extract People Count if mentioned in description and not explicitly set
  const peopleMatch = text.match(/(\d+)\s*(people|persons|family members|adults|children|kids|members|souls)/i);
  if (peopleMatch && (!requestInput.peopleCount || requestInput.peopleCount === 1)) {
    extractedEntities.detectedPeopleCount = parseInt(peopleMatch[1], 10);
  }

  // Detect Needs
  if (/boat|rescue|trapped|stranded|submerged|drowning|roof|terrace|inundated/i.test(text)) {
    extractedEntities.needs.push("RESCUE_BOAT");
  }
  if (/medical|doctor|insulin|dialysis|oxygen|medicine|fever|pregnant|delivery|injured|fracture|heart/i.test(text)) {
    extractedEntities.needs.push("MEDICAL_EMERGENCY");
  }
  if (/water|drinking water|tube-well|well contaminated|thirsty|dehydration|jerrycan/i.test(text)) {
    extractedEntities.needs.push("DRINKING_WATER");
  }
  if (/food|hungry|starving|ration|rice|chira|biscuit|dry food|baby milk|cerelac/i.test(text)) {
    extractedEntities.needs.push("FOOD_RATIONS");
  }
  if (/baby|infant|newborn|formula|diaper/i.test(text)) {
    extractedEntities.needs.push("BABY_SUPPLIES");
  }
  if (/elderly|paralyzed|bedridden|old mother|old father|grandmother|grandfather/i.test(text)) {
    extractedEntities.needs.push("ELDERLY_CARE");
  }

  // Detect Vulnerabilities
  if (/infant|baby|toddler|newborn|child/i.test(text)) extractedEntities.vulnerabilities.push("infant");
  if (/pregnant|labor|expecting/i.test(text)) extractedEntities.vulnerabilities.push("pregnant");
  if (/elderly|paralyzed|bedridden|80 year|70 year|old age/i.test(text)) extractedEntities.vulnerabilities.push("elderly");
  if (/wound|injured|bleeding|bite|snake/i.test(text)) extractedEntities.vulnerabilities.push("injured");
  if (/roof|tin shed|submerged|water rising|knee deep|chest deep|neck deep/i.test(text)) extractedEntities.vulnerabilities.push("submerged_home");

  // 2. Urgency Classification
  let urgency = "LOW";
  let urgencyScore = 20;
  let urgencyReason = "Standard assistance request";

  const isLifeThreatening = extractedEntities.needs.includes("RESCUE_BOAT") || 
                           extractedEntities.vulnerabilities.includes("submerged_home") || 
                           extractedEntities.vulnerabilities.includes("injured") ||
                           extractedEntities.vulnerabilities.includes("pregnant");

  const hasHighVulnerabilities = extractedEntities.vulnerabilities.includes("infant") || 
                                extractedEntities.vulnerabilities.includes("elderly") ||
                                extractedEntities.needs.includes("MEDICAL_EMERGENCY");

  if (isLifeThreatening && hasHighVulnerabilities) {
    urgency = "CRITICAL_SOS";
    urgencyScore = 95;
    urgencyReason = "Life safety alert: Stranded individuals with vulnerable family members (infant/elderly/pregnant/injured) under rapid flooding or cut-off conditions.";
  } else if (isLifeThreatening || extractedEntities.needs.includes("MEDICAL_EMERGENCY")) {
    urgency = "CRITICAL_SOS";
    urgencyScore = 88;
    urgencyReason = "Immediate rescue or urgent medical aid required.";
  } else if (hasHighVulnerabilities || extractedEntities.needs.includes("DRINKING_WATER")) {
    urgency = "HIGH";
    urgencyScore = 75;
    urgencyReason = "Urgent humanitarian requirement (clean drinking water, infants, chronic medicine).";
  } else if (extractedEntities.needs.includes("FOOD_RATIONS")) {
    urgency = "MEDIUM";
    urgencyScore = 50;
    urgencyReason = "Essential dry food and supply requirement.";
  } else {
    urgency = "LOW";
    urgencyScore = 25;
    urgencyReason = "Informational or non-emergency support inquiry.";
  }

  // 3. Deduplication & Semantic Proximity Engine
  let duplicateMatch = null;
  const currentArea = (requestInput.villageOrArea || '').toLowerCase().trim();
  const currentPhone = (requestInput.contactPhone || '').replace(/\D/g, '').slice(-10);
  const currentTokens = new Set(`${requestInput.villageOrArea || ''} ${requestInput.landmark || ''} ${requestInput.requesterName || ''}`.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(w => w.length > 2));

  for (const existing of existingRequests) {
    if (existing.id === requestInput.id) continue;
    let score = 0;
    const reasons = [];

    // Check same phone number
    const existingPhone = (existing.contactPhone || '').replace(/\D/g, '').slice(-10);
    if (currentPhone && existingPhone && currentPhone === existingPhone) {
      score += 60;
      reasons.push("Exact matching phone number");
    }

    // Check geographic proximity
    const existingArea = (existing.villageOrArea || '').toLowerCase().trim();
    if (currentArea && existingArea && (currentArea.includes(existingArea) || existingArea.includes(currentArea))) {
      score += 35;
      reasons.push("Matching village/area name");
    }

    // Check landmark token overlap
    const existingTokens = new Set(`${existing.villageOrArea || ''} ${existing.landmark || ''} ${existing.requesterName || ''}`.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(w => w.length > 2));
    let intersectionCount = 0;
    for (const t of currentTokens) {
      if (existingTokens.has(t)) intersectionCount++;
    }
    const tokenOverlap = intersectionCount / Math.max(1, Math.min(currentTokens.size, existingTokens.size));
    if (tokenOverlap > 0.4) {
      score += Math.round(tokenOverlap * 40);
      reasons.push(`High landmark keyword overlap (${Math.round(tokenOverlap * 100)}%)`);
    }

    // Check GPS proximity if coordinates available
    if (requestInput.coordinates && existing.coordinates && requestInput.coordinates.lat && existing.coordinates.lat) {
      const dLat = Math.abs(requestInput.coordinates.lat - existing.coordinates.lat);
      const dLng = Math.abs(requestInput.coordinates.lng - existing.coordinates.lng);
      if (dLat < 0.003 && dLng < 0.003) { // within ~300 meters
        score += 40;
        reasons.push("GPS location within 300 meters");
      }
    }

    if (score >= 60) {
      duplicateMatch = {
        isDuplicate: true,
        matchedRequestId: existing.id,
        matchedRequester: existing.requesterName,
        similarityScore: Math.min(100, score),
        reasons,
        suggestedAction: "FLAG_AS_NEAR_DUPLICATE_OR_MERGE"
      };
      break;
    }
  }

  return {
    urgency,
    urgencyScore,
    urgencyReason,
    extractedEntities,
    duplicateMatch: duplicateMatch || { isDuplicate: false, similarityScore: 0 }
  };
}

// --- FEATURE 3: GROUNDED RAG EMERGENCY GUIDE ASSISTANT ---
export function answerEmergencyQueryGrounded(userQuery) {
  const query = userQuery.toLowerCase();
  
  // Guardrail check: Is user asking for LIVE shelter counts, live road status, or active flood gauges?
  const liveKeywords = ["is road open", "is nh-06 open", "is nh-29 open", "current road status", 
                        "shelter capacity", "how many beds in shelter", "which shelter is free right now", 
                        "water level in guwahati right now", "is brahmautra rising right now"];
  
  const isAskingForLiveStatus = liveKeywords.some(kw => query.includes(kw));
  if (isAskingForLiveStatus) {
    return {
      answer: "⚠️ **Live Safety Guardrail Active:**\n" +
              "To protect evacuee lives, AI agents are strictly restricted from guessing or estimating real-time road conditions, water levels, or shelter bed occupancies.\n\n" +
              "👉 **Please view the real-time verified data directly on this platform:**\n" +
              "• **Verified Shelters Tab**: Check verified live capacity and medical facilities\n" +
              "• **Road & Landslide Blockages Tab**: Check active highway closures (NH-6, NH-29) and clearing team ETAs\n" +
              "• **River Gauges & Advisories Tab**: Check Central Water Commission readings for Brahmaputra & Barak rivers.\n\n" +
              "For immediate rescue, dial **112** or submit an **SOS Help Request** via the top button.",
      groundedSource: "Northeast Connect Verified Status Hub (Live Authority Sync)",
      isLiveRedirection: true,
      suggestedActions: ["View Live Shelters", "View Road Blockages", "Log Emergency SOS"]
    };
  }

  // Semantic search over NDMA/ASDMA knowledge base
  let bestMatch = null;
  let highestScore = 0;

  for (const doc of ragKnowledgeBase) {
    let score = 0;
    const docLower = `${doc.topic} ${doc.title} ${doc.content}`.toLowerCase();

    // Query token scoring
    const tokens = query.split(/\s+/).filter(w => w.length > 2);
    tokens.forEach(token => {
      if (docLower.includes(token)) score += 1;
    });

    // Topic matching bonuses
    if (/flood|water|purif|drink|drown|roof|boat|snake/i.test(query) && doc.topic === "FLOOD_SURVIVAL") score += 5;
    if (/landslide|mud|slide|crack|hill|tree tilt|rockfall/i.test(query) && doc.topic === "LANDSLIDE_PREPAREDNESS") score += 5;
    if (/earthquake|tremor|quake|drop cover|aftershock|shaking/i.test(query) && doc.topic === "EARTHQUAKE_SAFETY") score += 5;
    if (/bag|pack|kit|emergency items|batteries|food supply|72 hour/i.test(query) && doc.topic === "EMERGENCY_GO_BAG") score += 5;

    if (score > highestScore) {
      highestScore = score;
      bestMatch = doc;
    }
  }

  if (bestMatch && highestScore > 0) {
    // Generate tailored, bulleted answer strictly from doc.content
    return {
      answer: `Here is the official survival guidance according to **${bestMatch.source}**:\n\n` +
              bestMatch.content + `\n\n` +
              `📌 *Remember: In any critical emergency involving trapped persons or immediate danger, submit an SOS request on this platform or call 112 immediately.*`,
      groundedSource: bestMatch.source,
      topic: bestMatch.topic,
      isLiveRedirection: false,
      suggestedActions: ["Download Offline Playbook", "Log SOS Request", "Check Emergency Contacts"]
    };
  }

  // Default fallback grounded in generic NDMA safety protocol
  return {
    answer: "According to National Disaster Management Authority (NDMA) Standard Operating Procedures for North East India:\n\n" +
            "1. **Safety First**: Prioritize human life over property. Disconnect electricity and LPG cylinders if water enters home.\n" +
            "2. **Evacuation**: Move elderly family members, pregnant women, and young children to higher ground or designated relief shelters early during daylight.\n" +
            "3. **Safe Water**: Always boil drinking water for 3 minutes or use Halazone chlorine tablets.\n" +
            "4. **Emergency Helplines**: Dial 112 (National Emergency), 1070 (State Disaster Management Control Room), or 108 (Ambulance).",
    groundedSource: "NDMA & ASDMA Disaster Management Action Checklist",
    topic: "GENERAL_SAFETY",
    isLiveRedirection: false,
    suggestedActions: ["View Action Playbooks", "Check Shelter Map", "Log SOS"]
  };
}

// --- FEATURE 4: RUMOR & SIGNAL CLUSTERING ---
export function clusterRawSignals(rawReports = [], existingClusters = []) {
  // Groups incoming unstructured messages into emerging hotspots
  const clusters = [...existingClusters];
  
  for (const report of rawReports) {
    const text = report.text.toLowerCase();
    let assigned = false;

    for (const cluster of clusters) {
      const locMatch = cluster.location.toLowerCase().split(/\s+/).some(word => word.length > 3 && text.includes(word));
      const topicMatch = cluster.headline.toLowerCase().split(/\s+/).some(word => word.length > 3 && text.includes(word));

      if (locMatch || topicMatch) {
        cluster.reportsCount += 1;
        cluster.rawSnippets.push(report.text);
        cluster.confidenceScore = Math.min(0.98, cluster.confidenceScore + 0.05);
        cluster.timestamp = new Date().toISOString();
        assigned = true;
        break;
      }
    }

    if (!assigned) {
      clusters.push({
        id: `sig-${Date.now().toString().slice(-4)}`,
        headline: report.headline || `Emerging Signal: ${report.text.slice(0, 45)}...`,
        location: report.location || "North East Region",
        reportsCount: 1,
        rawSnippets: [report.text],
        confidenceScore: 0.60,
        verificationStatus: "UNVERIFIED",
        coordinatorNote: "Awaiting field officer or DDMA phone verification.",
        actionTaken: "Monitored on Coordinator radar.",
        timestamp: new Date().toISOString()
      });
    }
  }

  return clusters;
}
