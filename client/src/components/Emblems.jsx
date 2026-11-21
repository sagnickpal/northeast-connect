import React from 'react';

// Official State Emblem of India (Ashoka Lion Capital with Satyameva Jayate)
export function NationalEmblem({ className = "h-14 w-auto", dark = false }) {
  return (
    <svg 
      viewBox="0 0 120 160" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="State Emblem of India"
    >
      {/* Lion Capital Silhouette in Gold/Navy */}
      <g fill={dark ? "#d4af37" : "#003366"}>
        {/* Central Crown / Aureole */}
        <path d="M60 4 C50 4 48 10 44 14 C40 18 36 24 38 32 C40 38 46 42 50 44 C44 48 40 54 41 62 C42 70 48 76 54 78 L54 84 L66 84 L66 78 C72 76 78 70 79 62 C80 54 76 48 70 44 C74 42 80 38 82 32 C84 24 80 18 76 14 C72 10 70 4 60 4 Z" opacity="0.95" />
        
        {/* Left Lion Profile */}
        <path d="M36 20 C30 18 24 22 22 28 C20 34 22 42 26 46 C22 50 20 58 22 64 C24 72 32 76 38 78 L42 78 C38 72 36 64 38 56 C34 52 32 46 34 38 C35 32 38 26 36 20 Z" />
        
        {/* Right Lion Profile */}
        <path d="M84 20 C90 18 96 22 98 28 C100 34 98 42 94 46 C98 50 100 58 98 64 C96 72 88 76 82 78 L78 78 C82 72 84 64 82 56 C86 52 88 46 86 38 C85 32 82 26 84 20 Z" />

        {/* Abacus Base Platform */}
        <rect x="18" y="86" width="84" height="14" rx="2" fill={dark ? "#d4af37" : "#003366"} />
        
        {/* Ashoka Dharma Chakra in center of abacus */}
        <circle cx="60" cy="93" r="5" fill={dark ? "#0b2545" : "#ffffff"} stroke={dark ? "#d4af37" : "#003366"} strokeWidth="1.5" />
        {/* Bull on left, Horse on right */}
        <ellipse cx="36" cy="93" rx="4" ry="2" fill={dark ? "#0b2545" : "#ffffff"} />
        <ellipse cx="84" cy="93" rx="4" ry="2" fill={dark ? "#0b2545" : "#ffffff"} />

        {/* Bell-shaped Lotus Base */}
        <path d="M24 102 C28 108 34 114 42 116 C48 117 54 118 60 118 C66 118 72 117 78 116 C86 114 92 108 96 102 L98 105 C94 112 87 119 78 121 C72 122 66 123 60 123 C54 123 48 122 42 121 C33 119 26 112 22 105 Z" fill={dark ? "#d4af37" : "#003366"} />

        {/* Plinth Base */}
        <rect x="20" y="124" width="80" height="5" rx="1" fill={dark ? "#d4af37" : "#003366"} />
      </g>

      {/* Motto: सत्यमेव जयते (Satyameva Jayate) */}
      <text 
        x="60" 
        y="145" 
        textAnchor="middle" 
        fontFamily="'Noto Sans Devanagari', 'Mangal', 'Segoe UI', serif" 
        fontSize="12" 
        fontWeight="bold" 
        fill={dark ? "#d4af37" : "#003366"}
        letterSpacing="1"
      >
        सत्यमेव जयते
      </text>
    </svg>
  );
}

// Official NDMA Circular Seal Logo
export function NdmaSeal({ className = "h-14 w-14", dark = false }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="National Disaster Management Authority Emblem"
    >
      {/* Outer Blue Circle */}
      <circle cx="50" cy="50" r="48" fill="#003366" stroke="#d97706" strokeWidth="2.5" />
      {/* Inner Saffron Ring */}
      <circle cx="50" cy="50" r="44" fill="none" stroke="#ff9933" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="34" fill="#0b2545" stroke="#ffffff" strokeWidth="1" />

      {/* Top Text: राष्ट्रीय आपदा प्रबंधन प्राधिकरण */}
      <path id="curve-top" d="M 18,50 A 32,32 0 0,1 82,50" fill="none" />
      <text fontSize="5.5" fill="#ffffff" fontWeight="bold" letterSpacing="0.4">
        <textPath href="#curve-top" startOffset="50%" textAnchor="middle">
          रा. आ. प्र. प्रा. • NDMA
        </textPath>
      </text>

      {/* Center Shield / Map Silhouette & Relief Hands */}
      <g transform="translate(32, 28) scale(0.36)">
        {/* Stylized protective hand & emergency flame */}
        <path d="M50 5 L85 22 L85 58 C85 78 50 95 50 95 C50 95 15 78 15 58 L15 22 Z" fill="#d97706" stroke="#ffffff" strokeWidth="3" />
        <path d="M50 15 L75 28 L75 55 C75 70 50 83 50 83 C50 83 25 70 25 55 L25 28 Z" fill="#003366" />
        <path d="M50 25 C45 35 40 45 45 58 C47 62 50 65 53 62 C57 58 52 48 56 40 C60 50 65 60 62 68 C58 74 42 74 38 65 C34 56 42 42 50 25 Z" fill="#ff9933" />
      </g>

      {/* Bottom Text: भारत • INDIA */}
      <path id="curve-bot" d="M 82,50 A 32,32 0 0,1 18,50" fill="none" />
      <text fontSize="5.5" fill="#fcd34d" fontWeight="bold" letterSpacing="0.6">
        <textPath href="#curve-bot" startOffset="50%" textAnchor="middle">
          DISASTER MANAGEMENT
        </textPath>
      </text>
    </svg>
  );
}

// Indian National Flag Tricolor Ribbon Strip
export function TricolorStrip({ height = "h-1.5" }) {
  return (
    <div className={`w-full ${height} flex`}>
      <div className="flex-1 bg-[#FF9933]"></div> {/* Saffron */}
      <div className="flex-1 bg-[#FFFFFF]"></div> {/* White */}
      <div className="flex-1 bg-[#138808]"></div> {/* India Green */}
    </div>
  );
}

// Digital India & NIC Trust Badges
export function GovtBadges({ className = "flex items-center gap-3" }) {
  return (
    <div className={className}>
      <div className="border border-slate-300 rounded px-2 py-0.5 text-[9px] font-bold text-slate-700 bg-white">
        <span className="text-[#FF9933]">Digital</span> <span className="text-[#138808]">India</span>
      </div>
      <div className="border border-slate-300 rounded px-2 py-0.5 text-[9px] font-bold text-slate-700 bg-white">
        india.gov.in
      </div>
      <div className="border border-slate-300 rounded px-2 py-0.5 text-[9px] font-bold text-[#003366] bg-white">
        NIC Hosted
      </div>
    </div>
  );
}
