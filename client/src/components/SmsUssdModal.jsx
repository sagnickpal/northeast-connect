import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Phone, 
  Copy, 
  Check, 
  ExternalLink, 
  Terminal, 
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import { TricolorStrip } from './Emblems';

export default function SmsUssdModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('sms'); // sms, ussd
  const [district, setDistrict] = useState('KAMRUP');
  const [need, setNeed] = useState('BOAT RESCUE');
  const [people, setPeople] = useState('4');
  const [landmark, setLandmark] = useState('HATIGAON WARD 32 NAMGHAR');
  const [copied, setCopied] = useState(false);

  // USSD Interactive Simulator State
  const [ussdStep, setUssdStep] = useState('menu'); // menu, shelters, sos_sent
  const [ussdInput, setUssdInput] = useState('');

  const generatedSms = `SOS ${district.toUpperCase()} ${need.toUpperCase()} ${people}PPL ${landmark.toUpperCase()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSms);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUssdSubmit = (e) => {
    e.preventDefault();
    if (ussdInput === '1') {
      setUssdStep('shelters');
    } else if (ussdInput === '2') {
      setUssdStep('sos_sent');
    } else {
      setUssdStep('menu');
    }
    setUssdInput('');
  };

  const isIos = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const smsHref = isIos 
    ? `sms:112&body=${encodeURIComponent(generatedSms)}`
    : `sms:112?body=${encodeURIComponent(generatedSms)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-300 overflow-hidden my-auto">
        {/* Government Header */}
        <div className="bg-gov-navy text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gov-saffron text-slate-950 p-2 rounded-lg">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-gov-saffron text-slate-950 text-[10px] font-black uppercase px-1.5 py-0.2 rounded">
                  2G / Telecom Fallback
                </span>
                <span className="text-[11px] text-slate-300 font-semibold">Toll-Free 112 Gateway</span>
              </div>
              <h3 className="font-black text-base text-white">Offline SMS & USSD Emergency Gateway</h3>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-gov-blue rounded-lg text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <TricolorStrip className="h-1" />

        {/* Sub-Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('sms')}
            className={`flex-1 py-2.5 text-center transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'sms' 
                ? 'bg-white text-gov-navy border-b-2 border-gov-navy font-extrabold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-gov-navy" />
            <span>Format Emergency SMS (112)</span>
          </button>

          <button
            onClick={() => setActiveTab('ussd')}
            className={`flex-1 py-2.5 text-center transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'ussd' 
                ? 'bg-white text-gov-navy border-b-2 border-gov-navy font-extrabold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-4 h-4 text-gov-saffron" />
            <span>USSD Codes (*112#)</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {activeTab === 'sms' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-950">
                When mobile data and 4G/5G towers disconnect, standard GSM SMS towers often remain reachable. Send this standardized format to <strong>112</strong> or your State Disaster Helpline <strong>51969</strong>.
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Emergency Need</label>
                  <input
                    type="text"
                    value={need}
                    onChange={(e) => setNeed(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">People</label>
                  <input
                    type="number"
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-mono"
                  />
                </div>

                <div className="col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Landmark / Location</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded p-2 font-mono uppercase"
                  />
                </div>
              </div>

              {/* Formatted Output Box */}
              <div className="bg-slate-900 text-gov-saffron p-3.5 rounded-xl font-mono text-xs border border-slate-800 space-y-2">
                <div className="text-[10px] text-slate-400 uppercase tracking-widest">
                  Standardized SMS Syntax:
                </div>
                <div className="text-sm font-bold text-white break-all">
                  {generatedSms}
                </div>
                <div className="text-[10px] text-slate-400">
                  Recipient Number: <strong>112</strong> (Toll-Free National Emergency Service)
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleCopy}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 border border-slate-300 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-gov-green" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied SMS Text!' : 'Copy SMS Format'}</span>
                </button>

                <a
                  href={smsHref}
                  className="flex-1 bg-gov-navy hover:bg-gov-blue text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow transition-all active:scale-95"
                >
                  <ExternalLink className="w-4 h-4 text-gov-saffron" />
                  <span>Launch SMS App</span>
                </a>
              </div>
            </div>
          )}

          {activeTab === 'ussd' && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-slate-700">
                USSD codes work on <strong>any basic feature phone without mobile data</strong>. Dial the code on your numeric keypad to get an instant interactive text menu.
              </div>

              {/* USSD Keypad Dial Links */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="tel:*112%23"
                  className="bg-white border border-slate-300 p-2.5 rounded-lg flex items-center justify-between hover:border-gov-navy font-mono"
                >
                  <div>
                    <strong className="text-slate-900 text-sm block">*112#</strong>
                    <span className="text-[10px] text-slate-500 font-sans">National Emergency Portal</span>
                  </div>
                  <Phone className="w-4 h-4 text-gov-navy" />
                </a>

                <a
                  href="tel:*112*1%23"
                  className="bg-white border border-slate-300 p-2.5 rounded-lg flex items-center justify-between hover:border-gov-navy font-mono"
                >
                  <div>
                    <strong className="text-slate-900 text-sm block">*112*1#</strong>
                    <span className="text-[10px] text-slate-500 font-sans">Direct Rescue Alert</span>
                  </div>
                  <Phone className="w-4 h-4 text-gov-navy" />
                </a>
              </div>

              {/* Interactive USSD Terminal Simulator */}
              <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-xs border border-slate-800 shadow-inner space-y-3">
                <div className="text-[10px] text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-1">
                  USSD Session Simulator (*112#)
                </div>

                {ussdStep === 'menu' && (
                  <div>
                    <p className="text-slate-200 font-bold mb-2">
                      NDMA NORTH EAST CONNECT USSD GATEWAY:
                    </p>
                    <p>1. Nearest Safe Relief Camps</p>
                    <p>2. Broadcast Flash SOS to District Control Room</p>
                    <p>3. Active Highway & Landslide Closures</p>
                    <p>4. River Gauge Danger Alert</p>
                  </div>
                )}

                {ussdStep === 'shelters' && (
                  <div>
                    <p className="text-slate-200 font-bold mb-1">NEAREST VERIFIED SHELTERS:</p>
                    <p>1. Cotton Univ Hostel (140 beds free, Panbazar)</p>
                    <p>2. Silchar Govt Boys HS (40 beds free, Rangirkhari)</p>
                    <p>3. Dhemaji College Centre (80 beds free)</p>
                    <p className="text-amber-300 mt-2">Dial 0 to return to main menu</p>
                  </div>
                )}

                {ussdStep === 'sos_sent' && (
                  <div>
                    <p className="text-emerald-300 font-bold mb-1">✅ FLASH SOS RECEIVED AT ASDMA SEOC:</p>
                    <p>Your cell tower coordinates have been relayed to NDRF 1st Bn & local Circle Officer.</p>
                    <p className="text-amber-300 mt-2">Stay in high ground. Dial 0 to return.</p>
                  </div>
                )}

                {/* Simulated USSD Input */}
                <form onSubmit={handleUssdSubmit} className="flex gap-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    placeholder="Enter choice (1, 2, or 0)"
                    value={ussdInput}
                    onChange={(e) => setUssdInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 text-white px-2 py-1 rounded text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-gov-green text-white font-bold px-3 py-1 rounded text-xs"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="text-right border-t border-slate-100 pt-3">
            <button
              onClick={onClose}
              className="bg-gov-navy hover:bg-gov-blue text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}