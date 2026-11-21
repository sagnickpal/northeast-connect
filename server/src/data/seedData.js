// Seed database for Northeast Connect - Community Emergency Assistant
// Covers Assam, Meghalaya, Arunachal Pradesh, Manipur, Mizoram, Nagaland, Tripura, Sikkim

export const seedShelters = [
  {
    id: "sh-001",
    name: "Cotton University Girls' Hostel Relief Camp",
    state: "Assam",
    district: "Kamrup Metropolitan",
    location: "Panbazar, Guwahati, Assam 781001",
    coordinates: { lat: 26.1865, lng: 91.7483 },
    capacity: 450,
    currentOccupancy: 310,
    availableSpace: 140,
    medicalAvailable: true,
    medicalDetails: "Paramedic team on duty 24/7; anti-venom, ORS, chlorine tablets in stock",
    foodAvailable: true,
    foodDetails: "Hot meals twice daily, dry ration packets, baby formula available",
    contactPerson: "Pranab Barman (Camp Officer, DDMA)",
    contactPhone: "+91 94350 12891",
    verifiedSource: "Kamrup Metro District Disaster Management Authority (DDMA)",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    isStale: false,
    accessibleBy: "Paved road, light vehicles and rescue trucks"
  },
  {
    id: "sh-002",
    name: "Silchar Govt Boys Higher Secondary School",
    state: "Assam",
    district: "Cachar",
    location: "Rangirkhari Point, Silchar, Cachar, Assam 788005",
    coordinates: { lat: 24.8197, lng: 92.7972 },
    capacity: 600,
    currentOccupancy: 560,
    availableSpace: 40,
    medicalAvailable: true,
    medicalDetails: "Civil Hospital Mobile Unit stationed; insulin & saline available",
    foodAvailable: true,
    foodDetails: "Community kitchen active; water tanker refilled every 4 hours",
    contactPerson: "Debashish Roy (SDRF Liaison)",
    contactPhone: "+91 98540 88219",
    verifiedSource: "Cachar District Administration / ASDMA",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 110).toISOString(), // ~2 hours ago
    isStale: false,
    accessibleBy: "Boat rescue access only; water logged around perimeter (knee deep)"
  },
  {
    id: "sh-003",
    name: "Shillong Community Hall & Indoor Sports Complex",
    state: "Meghalaya",
    district: "East Khasi Hills",
    location: "Laban, Shillong, Meghalaya 793004",
    coordinates: { lat: 25.5684, lng: 91.8741 },
    capacity: 350,
    currentOccupancy: 120,
    availableSpace: 230,
    medicalAvailable: true,
    medicalDetails: "First aid station; trauma counseling available",
    foodAvailable: true,
    foodDetails: "Dry packaged food and heated tea stations",
    contactPerson: "Daphishisha Lyngdoh (Social Welfare Officer)",
    contactPhone: "+91 94361 02934",
    verifiedSource: "East Khasi Hills DDMA / Meghalaya SDMA",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    isStale: false,
    accessibleBy: "All vehicles accessible; bypass Lower Lumparing slope"
  },
  {
    id: "sh-004",
    name: "Chumukedima Town Hall Emergency Center",
    state: "Nagaland",
    district: "Chümoukedima",
    location: "Near 2nd Gate, Chumukedima, Nagaland 797103",
    coordinates: { lat: 25.8016, lng: 93.7584 },
    capacity: 250,
    currentOccupancy: 245,
    availableSpace: 5,
    medicalAvailable: false,
    medicalDetails: "Urgent request pending for basic medical kit & bandage supplies",
    foodAvailable: true,
    foodDetails: "Church youth fellowship managing rice & dal supplies",
    contactPerson: "Kevilezo Angami (Village Council Secy)",
    contactPhone: "+91 94360 41102",
    verifiedSource: "Nagaland State Disaster Management Authority (NSDMA)",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(), // 14 hours ago (STALE!)
    isStale: true,
    accessibleBy: "NH-29 open; internal connecting road partially slushy"
  },
  {
    id: "sh-005",
    name: "Dhemaji College Flood Relief Centre",
    state: "Assam",
    district: "Dhemaji",
    location: "Dhemaji Station Road, Dhemaji, Assam 787057",
    coordinates: { lat: 27.4812, lng: 94.5786 },
    capacity: 500,
    currentOccupancy: 420,
    availableSpace: 80,
    medicalAvailable: true,
    medicalDetails: "Water purification units installed; pediatric medicines available",
    foodAvailable: true,
    foodDetails: "Cooked food distributed by local Red Cross unit",
    contactPerson: "Bikram Saikia (DDMA Field Officer)",
    contactPhone: "+91 94353 77120",
    verifiedSource: "Dhemaji DDMA / District Commissioner Office",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    isStale: false,
    accessibleBy: "Tractor and high-clearance 4x4 trucks only"
  },
  {
    id: "sh-006",
    name: "Pasighat Multi-Purpose Community Hall",
    state: "Arunachal Pradesh",
    district: "East Siang",
    location: "Bane Borang Road, Pasighat, Arunachal Pradesh 791102",
    coordinates: { lat: 28.0664, lng: 95.3265 },
    capacity: 300,
    currentOccupancy: 85,
    availableSpace: 215,
    medicalAvailable: true,
    medicalDetails: "General physician on call; thermal blankets available",
    foodAvailable: true,
    foodDetails: "Sufficient dry rations for 7 days",
    contactPerson: "Tage Tamo (Circle Officer, Disaster Mgmt)",
    contactPhone: "+91 94362 55910",
    verifiedSource: "East Siang DDMA",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 240).toISOString(), // 4 hours ago
    isStale: false,
    accessibleBy: "Open; clear road access"
  }
];

export const seedRoads = [
  {
    id: "rd-001",
    roadName: "NH-06 (Shillong - Silchar Highway)",
    stretch: "Sonapur Tunnel to Umkiang Section",
    state: "Meghalaya / Assam border",
    districts: ["East Jaintia Hills", "Cachar"],
    status: "CLOSED", // CLOSED, PARTIAL, RESTRICTED, OPEN
    hazardType: "Massive Mudslide & Rockfall",
    description: "Heavy continuous rains triggered major debris fall blocking both portals of Sonapur Tunnel. Approximately 120 vehicles stranded on either side.",
    clearanceETA: "6 to 8 hours (Border Roads Organisation / NHAI deploying 3 heavy excavators)",
    alternateRoute: "No direct heavy vehicular route. Light passenger vehicles diverted via Sutnga-Saipung road with SDRF pilot escort.",
    verifiedBy: "Meghalaya Police Traffic Control & BRO Project Dantak",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    isStale: false
  },
  {
    id: "rd-002",
    roadName: "NH-29 (Dimapur - Kohima Highway)",
    stretch: "Phesama - Paglapahar Stretch",
    state: "Nagaland",
    districts: ["Kohima", "Chümoukedima"],
    status: "PARTIAL",
    hazardType: "Subsidence & Stone Fall",
    description: "One lane opened for light passenger vehicles and emergency ambulances. Heavy goods trucks restricted until morning assessment.",
    clearanceETA: "Single lane operational; full two-lane clearance expected by tomorrow 10:00 AM",
    alternateRoute: "Via Jotsoma bypass for light SUVs only (caution: slippery mud terrain)",
    verifiedBy: "Nagaland PWD (NH) & District Police Control Room",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
    isStale: false
  },
  {
    id: "rd-003",
    roadName: "Guwahati - North Guwahati Ferry Crossing",
    stretch: "Brahmaputra Inland Waterways (Sukreswar Ghat to Rajaduar)",
    state: "Assam",
    districts: ["Kamrup Metro", "Kamrup Rural"],
    status: "CLOSED",
    hazardType: "Extreme River Swell & Dangerous Current",
    description: "All motorized passenger country boats and Ro-Pax vessel services suspended due to Brahmaputra river crossing danger level with floating logs and high current.",
    clearanceETA: "Suspended until river discharge falls below 48.50m (next review 4:00 PM)",
    alternateRoute: "Use Saraighat Bridge or new AIIMS bridge via Jalukbari",
    verifiedBy: "Inland Waterways Authority & Kamrup DDMA",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 50).toISOString(),
    isStale: false
  },
  {
    id: "rd-004",
    roadName: "Dhemaji - Jonai Sub-Division Rural Link Road",
    stretch: "Jiabharali / Gai River Causeway",
    state: "Assam",
    districts: ["Dhemaji"],
    status: "CLOSED",
    hazardType: "Embankment Breach & Water Overtopping",
    description: "30-meter embankment breach by Gai River overflow has submerged road under 4 feet of fast flowing flood water. Submersible culvert washed out.",
    clearanceETA: "Indefinite; awaiting Army/SDRF bailey bridge deployment",
    alternateRoute: "Use NH-15 via Gogamukh - Silapathar route",
    verifiedBy: "Water Resources Dept & Dhemaji Police",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago (STALE!)
    isStale: true
  },
  {
    id: "rd-005",
    roadName: "NH-102 (Imphal - Moreh International Highway)",
    stretch: "Khongkhang to Tengnoupal Pass",
    state: "Manipur",
    districts: ["Tengnoupal", "Kakching"],
    status: "RESTRICTED",
    hazardType: "Minor Landslip & Fog Blindness",
    description: "Debris cleared off main carriageway. Heavy fog and continuous drizzle. Convoys moving in batches under Assam Rifles escort.",
    clearanceETA: "Open for daylight transit only (06:00 to 17:00)",
    alternateRoute: "No alternate road available for border access",
    verifiedBy: "Manipur State Disaster Response Force & Tengnoupal DC",
    lastUpdated: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    isStale: false
  }
];

export const seedRiverGauges = [
  {
    river: "Brahmaputra",
    station: "Guwahati (DC Court Ghat)",
    district: "Kamrup Metropolitan, Assam",
    dangerLevel: "49.68 m",
    warningLevel: "48.68 m",
    currentLevel: "50.12 m",
    status: "ABOVE_DANGER", // NORMAL, WARNING, ABOVE_DANGER, SEVERE
    trend: "RISING (+3 cm/hr)",
    lastReadingTime: "Today, 09:30 AM",
    forecast: "Expected to rise by another 15 cm by 6:00 PM due to upper catchment rainfall in Arunachal Pradesh"
  },
  {
    river: "Barak",
    station: "Silchar (Annapurna Ghat)",
    district: "Cachar, Assam",
    dangerLevel: "19.83 m",
    warningLevel: "18.83 m",
    currentLevel: "20.45 m",
    status: "SEVERE",
    trend: "RISING (+5 cm/hr)",
    lastReadingTime: "Today, 09:15 AM",
    forecast: "Severe flood situation. Sluice gates at Bethukandi closed; reverse flow prevention active"
  },
  {
    river: "Brahmaputra",
    station: "Dibrugarh (Old Steamer Ghat)",
    district: "Dibrugarh, Assam",
    dangerLevel: "105.70 m",
    warningLevel: "104.70 m",
    currentLevel: "105.40 m",
    status: "WARNING",
    trend: "STEADY (0 cm/hr)",
    lastReadingTime: "Today, 08:45 AM",
    forecast: "Water level steady over last 3 hours, bank protection geotubes intact"
  },
  {
    river: "Kopili",
    station: "Kampur",
    district: "Nagaon, Assam",
    dangerLevel: "60.50 m",
    warningLevel: "59.50 m",
    currentLevel: "61.35 m",
    status: "ABOVE_DANGER",
    trend: "FALLING (-2 cm/hr)",
    lastReadingTime: "Today, 09:00 AM",
    forecast: "Receding slowly from record peak; low lying villages remain submerged"
  }
];

export const seedAdvisories = [
  {
    id: "adv-001",
    category: "DRINKING_WATER",
    title: "Mandatory Water Boiling & Halogenation Advisory",
    state: "Assam & Meghalaya",
    districts: ["Kamrup Metro", "Cachar", "East Khasi Hills"],
    severity: "HIGH",
    summary: "Floodwaters have contaminated municipal supply pipelines and borewells. Do not consume raw tap or tube-well water.",
    actionSteps: [
      "Vigorously boil water for at least 3 minutes before drinking or cooking.",
      "Collect chlorine / Halazone tablets from ward relief counters (1 tablet per 20 litres of clear water; wait 30 mins).",
      "Do not use contaminated river water even for washing kitchen utensils or brushing teeth."
    ],
    officialSource: "Public Health Engineering Dept (PHED) & National Health Mission",
    issuedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString()
  },
  {
    id: "adv-002",
    category: "POWER_GRID",
    title: "Precautionary Power Substation Shutdown",
    state: "Assam",
    districts: ["Cachar", "Hailakandi"],
    severity: "CRITICAL",
    summary: "33/11 kV Rangirkhari and Tarapur electrical substations de-energized to prevent fatal electrocution due to waterlogging.",
    actionSteps: [
      "Assume all fallen power cables, submerged light poles, and water bodies around transformers are electrically LIVE.",
      "Keep phones charged via emergency power banks or generator stations at designated relief camps.",
      "Report sparking wires immediately to APDCL emergency hotline 1912."
    ],
    officialSource: "Assam Power Distribution Company Ltd (APDCL)",
    issuedAt: new Date(Date.now() - 1000 * 60 * 150).toISOString()
  },
  {
    id: "adv-003",
    category: "WEATHER_LANDSLIDE",
    title: "Red Alert: High Risk Landslide Warning for Hill Roads",
    state: "Meghalaya & Nagaland",
    districts: ["East Khasi Hills", "West Jaintia Hills", "Kohima"],
    severity: "HIGH",
    summary: "Indian Meteorological Department (IMD) predicts extremely heavy rain (>200 mm) over next 24 hours. Steep slopes saturated.",
    actionSteps: [
      "Avoid all non-essential road travel along hillside highways and valley curves.",
      "Residents living under steep embankments should relocate to designated community shelters before nightfall.",
      "Watch for early warning signs: sudden tilting of trees, muddy spring water emerging from dry ground, new foundation cracks."
    ],
    officialSource: "Geological Survey of India & IMD Regional Meteorological Centre, Borjhar",
    issuedAt: new Date(Date.now() - 1000 * 60 * 200).toISOString()
  }
];

export const seedContacts = [
  {
    category: "STATE_SDMA",
    title: "State Disaster Management Authorities (Control Rooms)",
    contacts: [
      { name: "Assam State Disaster Management Authority (ASDMA)", number: "1070 / 1079 / 0361-2237221", location: "Dispur, Guwahati", state: "Assam" },
      { name: "Meghalaya State Disaster Management Authority (MSDMA)", number: "1070 / 0364-2502098", location: "Secretariat, Shillong", state: "Meghalaya" },
      { name: "Arunachal Pradesh Disaster Management (APSDMA)", number: "1070 / 0360-2212222", location: "Itanagar", state: "Arunachal Pradesh" },
      { name: "Nagaland State Disaster Management Authority (NSDMA)", number: "1070 / 0370-2291122", location: "Kohima", state: "Nagaland" },
      { name: "Manipur Relief & Disaster Management", number: "1070 / 0385-2443441", location: "Babupara, Imphal", state: "Manipur" },
      { name: "Mizoram Disaster Management & Rehabilitation", number: "1070 / 0389-2342520", location: "Aizawl", state: "Mizoram" },
      { name: "Tripura State Disaster Management Authority", number: "1070 / 0381-2416045", location: "Agartala", state: "Tripura" },
      { name: "Sikkim State Disaster Management Authority", number: "1070 / 03592-201075", location: "Tashiling, Gangtok", state: "Sikkim" }
    ]
  },
  {
    category: "NDRF_SDRF",
    title: "NDRF Battalions & SDRF Rescue Units",
    contacts: [
      { name: "NDRF 1st Battalion (Patgaon, Guwahati)", number: "+91 94359 62222 / 0361-2840284", role: "Specialized Water Rescue & Flood Evacuation", coverage: "Assam, Meghalaya, Tripura, Mizoram" },
      { name: "NDRF 12th Battalion (Doimukh, Itanagar)", number: "+91 94360 40123 / 0360-2277107", role: "High-Altitude Rescue, Landslides, Collapsed Structures", coverage: "Arunachal Pradesh, Nagaland, Manipur" },
      { name: "Assam Fire & Emergency Services / SDRF HQ", number: "101 / +91 94350 49999", role: "Speedboat deployment, rubber boat evacuation", coverage: "All Assam Districts" }
    ]
  },
  {
    category: "HOSPITALS_SNAKEBITE",
    title: "Major Trauma & Anti-Venom Stock Centers",
    contacts: [
      { name: "Gauhati Medical College & Hospital (GMCH)", number: "+91 361 2529457 / Emergency: 108", role: "Tertiary Trauma & Anti-Snake Venom (ASV) Stockpile", state: "Assam" },
      { name: "Silchar Medical College & Hospital (SMCH)", number: "+91 3842 240222 / Emergency: 108", role: "Barak Valley Primary Trauma & Dialysis", state: "Assam" },
      { name: "NEIGRIHMS (Shillong)", number: "+91 364 2538025 / Emergency: 108", role: "Super-specialty & Intensive Care", state: "Meghalaya" },
      { name: "RIMS (Regional Institute of Medical Sciences, Imphal)", number: "+91 385 2414625", role: "Emergency & Trauma Services", state: "Manipur" }
    ]
  }
];

export const seedRequests = [
  {
    id: "req-001",
    requesterName: "Bishnu Gogoi",
    contactPhone: "+91 98642 11980",
    state: "Assam",
    district: "Kamrup Metropolitan",
    villageOrArea: "Hatigaon, Ward 32 (Near Bhetapara Bridge)",
    landmark: "Behind Namghar, 2-storey yellow house with flooded ground floor",
    coordinates: { lat: 26.1325, lng: 91.7854 },
    needType: "RESCUE", // RESCUE, MEDICAL, WATER, FOOD, ELDERLY_BABY
    description: "Water level rose 4 feet in 3 hours. 6 family members stranded on tin rooftop including 78-year-old paralyzed grandmother and 2-year-old child. Need urgent motorized boat evacuation before dusk.",
    peopleCount: 6,
    vulnerabilities: ["elderly", "infant", "submerged_home"],
    urgency: "CRITICAL_SOS", // CRITICAL_SOS, HIGH, MEDIUM, LOW
    urgencyReason: "Life safety risk: elderly invalid and infant on roof with rapid rising water",
    status: "DISPATCHED", // PENDING, IN_PROGRESS, DISPATCHED, RESOLVED
    assignedTeam: "SDRF Team 04 (Mechanized Dinghy)",
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18 mins ago (SLA active!)
    slaMinutes: 15,
    isEscalated: true,
    duplicateGroupId: "cluster-hatigaon-01"
  },
  {
    id: "req-002",
    requesterName: "Mridul Gogoi (Brother of Bishnu)",
    contactPhone: "+91 94351 88721",
    state: "Assam",
    district: "Kamrup Metropolitan",
    villageOrArea: "Hatigaon Bhetapara bridge side",
    landmark: "Yellow 2 storey house near Namghar Hatigaon",
    coordinates: { lat: 26.1327, lng: 91.7856 },
    needType: "RESCUE",
    description: "Please send boat to my family in Hatigaon near Namghar. My brother and elderly mother on roof water everywhere.",
    peopleCount: 6,
    vulnerabilities: ["elderly", "infant"],
    urgency: "CRITICAL_SOS",
    urgencyReason: "Duplicate report of active emergency (sh-001)",
    status: "MERGED",
    assignedTeam: "Merged with req-001 (SDRF Team 04)",
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    slaMinutes: 15,
    isEscalated: false,
    duplicateGroupId: "cluster-hatigaon-01",
    isDuplicateOf: "req-001"
  },
  {
    id: "req-003",
    requesterName: "Lalmuanpuii Ralte",
    contactPhone: "+91 94361 77312",
    state: "Mizoram",
    district: "Aizawl",
    villageOrArea: "Durtlang Leitan, Sector 4",
    landmark: "Below Presbyterian Church junction",
    coordinates: { lat: 23.7745, lng: 92.7314 },
    needType: "MEDICAL",
    description: "Mother has diabetic ulcer and fever, road blocked by small debris slide. We have run out of insulin and clean water bottles.",
    peopleCount: 3,
    vulnerabilities: ["medical_chronic", "elderly"],
    urgency: "HIGH",
    urgencyReason: "Critical medicine depletion with road blocked",
    status: "IN_PROGRESS",
    assignedTeam: "YMA Disaster Relief Volunteer Unit",
    createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
    slaMinutes: 60,
    isEscalated: false,
    duplicateGroupId: null
  },
  {
    id: "req-004",
    requesterName: "Ranjit Rabha",
    contactPhone: "+91 94012 34567",
    state: "Assam",
    district: "Goalpara",
    villageOrArea: "Balijana Block, Dwarka Village",
    landmark: "Near LP School playground",
    coordinates: { lat: 26.1154, lng: 90.6212 },
    needType: "WATER",
    description: "All 4 village tube-wells inundated with muddy silt. 45 villagers have zero drinking water since yesterday. Halogen tablets and clean jerrycans needed urgently.",
    peopleCount: 45,
    vulnerabilities: ["clean_water_outage", "children"],
    urgency: "HIGH",
    urgencyReason: "Community-wide acute dehydration and waterborne risk",
    status: "PENDING",
    assignedTeam: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 70).toISOString(), // 70 mins ago (Exceeded SLA!)
    slaMinutes: 45,
    isEscalated: true,
    duplicateGroupId: null
  },
  {
    id: "req-005",
    requesterName: "Tenzin Dorjee",
    contactPhone: "+91 94360 88991",
    state: "Arunachal Pradesh",
    district: "West Kameng",
    villageOrArea: "Dirang Valley, Khasso camp",
    landmark: "Near Apple Nursery",
    coordinates: { lat: 27.3582, lng: 92.2341 },
    needType: "FOOD",
    description: "Cut off by bridge washaway. 12 migrant laborers and 2 families need dry ration, kerosene and tarpaulins for roof leaks.",
    peopleCount: 18,
    vulnerabilities: ["isolated"],
    urgency: "MEDIUM",
    urgencyReason: "Dry supplies needed, safe shelter currently intact",
    status: "PENDING",
    assignedTeam: null,
    createdAt: new Date(Date.now() - 1000 * 60 * 115).toISOString(),
    slaMinutes: 180,
    isEscalated: false,
    duplicateGroupId: null
  }
];

export const seedOffers = [
  {
    id: "off-001",
    providerName: "Barak Valley Rescue Volunteers (NGO)",
    contactPerson: "Dr. Anupam Bhattacharjee",
    contactPhone: "+91 94350 71192",
    state: "Assam",
    district: "Cachar",
    serviceType: "BOAT_RESCUE", // BOAT_RESCUE, 4X4_TRANSPORT, MEDICAL_STAFF, RELIEF_SUPPLIES, SHELTER_SPACE
    capacityOrQuantity: "2 Motorized Country Boats (15-person capacity each) + 4 trained divers",
    locationDetails: "Stationed at Park Road, Silchar. Ready to deploy across flooded wards 1-12",
    status: "ACTIVE", // ACTIVE, DEPLOYED, UNAVAILABLE
    verificationStatus: "VERIFIED",
    verifiedBy: "Cachar District Administration Liaison",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: "off-002",
    providerName: "Assam 4x4 Offroaders Club",
    contactPerson: "Jugal Kalita",
    contactPhone: "+91 98640 55123",
    state: "Assam",
    district: "Kamrup Metropolitan",
    serviceType: "4X4_TRANSPORT",
    capacityOrQuantity: "5 Snorkel-equipped 4x4 Mahindra Thars & Isuzu D-Max with winches and tow ropes",
    locationDetails: "Guwahati base; can transport emergency medicines, doctors, baby supplies through 3-foot waterlogged roads",
    status: "ACTIVE",
    verificationStatus: "VERIFIED",
    verifiedBy: "Kamrup Metro Civil Defence",
    createdAt: new Date(Date.now() - 1000 * 60 * 200).toISOString()
  },
  {
    id: "off-003",
    providerName: "Indian Medical Association - Shillong Chapter",
    contactPerson: "Dr. P. Nongrum",
    contactPhone: "+91 94361 22845",
    state: "Meghalaya",
    district: "East Khasi Hills",
    serviceType: "MEDICAL_STAFF",
    capacityOrQuantity: "6 General Practitioners + 4 Nurses with portable emergency trauma & suture kits",
    locationDetails: "Mobile medical camp van available to visit cut-off relief centres in Shillong suburbs",
    status: "ACTIVE",
    verificationStatus: "VERIFIED",
    verifiedBy: "Meghalaya Directorate of Health Services",
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString()
  },
  {
    id: "off-004",
    providerName: "Gurudwara Sri Guru Singh Sabha, Fancy Bazar",
    contactPerson: "Sardar Manjit Singh",
    contactPhone: "+91 94350 44910",
    state: "Assam",
    district: "Kamrup Metropolitan",
    serviceType: "RELIEF_SUPPLIES",
    capacityOrQuantity: "1,500 packed hot meals (khichdi/dal-rice) and 2,000 drinking water pouches ready every 6 hours",
    locationDetails: "Fancy Bazar, Guwahati; pickup available or can load into SDRF relief trucks",
    status: "ACTIVE",
    verificationStatus: "VERIFIED",
    verifiedBy: "Kamrup DDMA",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString()
  }
];

export const seedRumorsAndSignals = [
  {
    id: "sig-001",
    headline: "Embankment breach at Matmora / Subansiri dyke",
    location: "Dhakuakhana / Matmora, Lakhimpur District, Assam",
    reportsCount: 9,
    rawSnippets: [
      "Water rushing into village from Subansiri embankment near Matmora",
      "Dyke broke at Matmora people running to high road please confirm",
      "Hearing Matmora ring bund has collapsed, is it true?"
    ],
    confidenceScore: 0.88,
    verificationStatus: "VERIFIED_TRUE", // UNVERIFIED, INVESTIGATING, VERIFIED_TRUE, DEBUNKED_FALSE
    coordinatorNote: "Water Resources Executive Engineer confirmed 15m breach at ring dyke at 07:15 AM. 4 SDRF rescue boats dispatched.",
    actionTaken: "Issued flash evacuation warning for 6 downstream revenue villages; sirens sounded.",
    timestamp: new Date(Date.now() - 1000 * 60 * 65).toISOString()
  },
  {
    id: "sig-002",
    headline: "Rumor of complete collapse of Guwahati Saraighat Bridge",
    location: "Guwahati / Jalukbari, Assam",
    reportsCount: 14,
    rawSnippets: [
      "WhatsApp message saying Saraighat bridge pillars cracked and closed forever",
      "Someone forwarding audio that bridge is shaking and broken",
      "Traffic stopped at Jalukbari is bridge collapsed?"
    ],
    confidenceScore: 0.95,
    verificationStatus: "DEBUNKED_FALSE",
    coordinatorNote: "Strictly false rumor. NF Railway Chief Bridge Engineer & PWD completed physical inspection at 08:30 AM. Old & New Saraighat bridges are 100% structurally sound. Traffic slowed temporarily due to stalled truck, now normal.",
    actionTaken: "Fact-check bulletin pushed to all social channels and regional radio; cyber cell alerted.",
    timestamp: new Date(Date.now() - 1000 * 60 * 85).toISOString()
  },
  {
    id: "sig-003",
    headline: "Massive mudflow near Mawryngkneng junction (Shillong bypass)",
    location: "East Khasi Hills, Meghalaya",
    reportsCount: 4,
    rawSnippets: [
      "Mud sliding across highway near Mawryngkneng petrol pump",
      "Taxi drivers reporting thick mud blocking one side of Shillong bypass"
    ],
    confidenceScore: 0.72,
    verificationStatus: "INVESTIGATING",
    coordinatorNote: "Police Patrol Car 09 dispatched to verify. Earthmover on standby at Mawryngkneng outpost.",
    actionTaken: "Caution banner placed on live road status board pending field confirmation.",
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString()
  }
];

// Verified RAG Grounding Knowledge Base (Strict NDMA / ASDMA Standard Operating Procedures)
export const ragKnowledgeBase = [
  {
    topic: "FLOOD_SURVIVAL",
    title: "NDMA Standard Operating Procedure: Flash Flood & Riverine Inundation",
    source: "National Disaster Management Authority (NDMA) & ASDMA Guidelines 2024",
    content: `1. Immediate Actions During Rapid Rising Water:
- Move immediately to upper floors or the highest accessible ground. NEVER stay in basements or ground floor rooms when water rises above doorstep.
- Disconnect main electrical circuit breaker (MCB) and turn off LPG cylinder regulator before water reaches electrical outlets.
- Never attempt to walk, swim, or drive through moving flood waters. 6 inches of fast-moving water can knock down an adult; 12 inches can sweep away a small car; 24 inches can carry away SUVs and trucks.
- If trapped in a building, climb to the roof ONLY if necessary. Take a bright colored cloth (red/orange) or mirror/flashlight to signal rescue aircraft and boats. DO NOT hide in closed attics without roof hatch access, as rising water can trap you inside.

2. Water & Food Safety in Flood Camps:
- Flood water contains raw sewage, dead animals, agricultural pesticides, and industrial runoff. Never drink untreated flood water.
- Boil water vigorously for a rolling 3 minutes minimum.
- If boiling is impossible, use chlorine/Halazone tablets: add 1 tablet (or 2 drops of 5% unscented household bleach) per 4-5 litres of clear water; mix well and let stand for 30 minutes before drinking. If water is turbid/muddy, strain through clean layered cotton fabric or settle with a pinch of alum before chlorination.
- Discard any food that came into contact with flood waters, including sealed plastic bags (only hermetically sealed tin cans are safe after washing with boiled water).

3. Snakebite & Hazardous Animal Protocol in North East Floods:
- Snakes (King cobra, monocled cobra, banded krait, pit vipers) seek dry shelter on high ground, roofs, and tree branches during floods.
- Always tap a walking stick or illuminate ground with a torch before stepping into high grass or verandahs.
- In case of a snakebite: Keep the patient calm and completely still. Immobilize the bitten limb with a splint at heart level. DO NOT apply a tourniquet. DO NOT cut the wound or attempt to suck venom. Transport immediately to GMCH, SMCH, or district civil hospital where polyvalent anti-snake venom (ASV) is stocked.`
  },
  {
    topic: "LANDSLIDE_PREPAREDNESS",
    title: "Geological Survey of India & NDMA Landslide Evacuation Protocol",
    source: "NDMA National Landslide Risk Management Strategy & GSI Guidelines",
    content: `1. Early Warning Signs of an Impending Landslide:
- New cracks appearing in plaster, tile, brickwork, or foundations of hill slope houses.
- Doors or windows sticking or jamming for the first time.
- Outside walls, walkways, or fences pulling away from the building.
- Slowly widening cracks appearing on the ground, hill paths, or paved slopes.
- Tilting of utility poles, retaining walls, telephone poles, or trees.
- Sudden appearance of muddy water springs or sudden decrease in water level of a mountain creek despite continuous rain (indicates a debris dam upstream that may burst).

2. Immediate Action If a Landslide Is Imminent:
- Evacuate immediately perpendicular to the slide path. Do not run downhill in the direct path of falling debris; move horizontally across the slope to stable rock or ridge crest.
- If escape is impossible, curl into a tight ball and protect your head with arms and sturdy helmets/cushions behind heavy internal load-bearing furniture.
- Listen for unusual sounds like trees cracking or a loud rumbling sound like an oncoming train.
- Avoid river valleys and low gorges after heavy rain, as flash mudflows (lahars/debris flows) travel at speeds over 40 km/h.`
  },
  {
    topic: "EARTHQUAKE_SAFETY",
    title: "NDMA Zone V Seismic Safety & Survival Guidelines (North East India)",
    source: "NDMA Earthquake Preparedness Manual (Zone V High Seismic Risk)",
    content: `1. Indoors: Drop, Cover, and Hold On:
- DROP onto your hands and knees immediately. This position protects you from being knocked down and allows you to stay low.
- COVER your head and neck under a sturdy table or desk. If no shelter is nearby, drop next to an interior wall and cover your head and neck with your arms.
- HOLD ON to your shelter until the shaking stops. Be prepared to move with your shelter if it shifts.
- DO NOT run outside during shaking. Most injuries occur from falling bricks, glass, parapets, and exterior facade collapse.
- DO NOT use elevators. Stay away from glass windows, heavy mirrors, chandeliers, and high shelving.

2. Outdoors:
- Move to an open area away from buildings, streetlights, electrical wires, steep cut-slopes, and flyovers.
- If in a vehicle, pull over safely away from overpasses, bridges, and power lines; stay inside until shaking subsides.

3. Post-Earthquake Safety:
- Check for gas leaks (smell of sulfur) and turn off cylinder valves immediately. Do not light matches or candles.
- Check electrical wiring; trip main breakers if wires are frayed or submerged.
- Expect aftershocks. Be cautious of damaged buildings that may collapse in subsequent shocks.`
  },
  {
    topic: "EMERGENCY_GO_BAG",
    title: "Official Family Emergency Go-Bag Checklist (72-Hour Survival)",
    source: "NDMA & ASDMA Disaster Management Action Checklist",
    content: `Essential items to keep packed in a waterproof backpack near your front door:
1. Water: 3 litres per person per day for at least 3 days.
2. Food: 3-day supply of non-perishable food (chira/flattened rice, gur/jaggery, biscuits, roasted gram, canned food).
3. First Aid & Medicines: 7-day supply of personal prescription medicines (hypertension, diabetes, inhalers), ORS packets, Paracetamol, band-aids, antiseptic liquid, water purification tablets.
4. Vital Documents: Aadhar cards, voter IDs, land patta/deeds, insurance papers sealed in airtight Ziploc waterproof bags.
5. Lighting & Power: High-lumen LED torch with spare batteries, hand-crank or solar lantern, fully charged power bank with charging cables.
6. Communication & Signaling: Battery-operated AM/FM radio for emergency government broadcasts, loud emergency whistle (audible over roaring flood water), reflective tape or mirror.
7. Sanitation: Sanitary napkins, baby diapers/wet wipes, soap, chlorine drops.
8. Tools: Multi-tool swiss army knife, 15m nylon rope, duct tape, thick work gloves, emergency rain ponchos, and cash in small denominations.`
  }
];
