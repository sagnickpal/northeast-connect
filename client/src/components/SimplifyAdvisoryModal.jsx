import React, { useState, useEffect } from 'react';
import { X, Sparkles, Globe, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { languages } from '../data/translations';

export default function SimplifyAdvisoryModal({ isOpen, onClose, advisory }) {
  if (!isOpen || !advisory) return null;

  const [targetLang, setTargetLang] = useState('as'); // Assamese by default
  const [simplifiedData, setSimplifiedData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSimplified();
  }, [advisory, targetLang]);

  const fetchSimplified = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          advisoryData: advisory,
          targetLang
        })
      });
      if (res.ok) {
        const data = await res.json();
        setSimplifiedData(data);
      } else {
        throw new Error('API returned error');
      }
    } catch (e) {
      console.warn('Backend simplify offline, using client fallback:', e);
      // Offline fallback: render advisory directly
      setSimplifiedData({
        title: advisory.title,
        severityText: advisory.severity,
        headerTitle: "EMERGENCY ADVISORY (OFFLINE)",
        plainSummary: advisory.summary,
        actionHeader: "Immediate Action Steps:",
        actionChecklist: advisory.actionSteps || [],
        helplineHeader: "Emergency Helpline",
        helpline: "National Emergency Helpline: 112 | ASDMA: 1070"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-300 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600/30 p-2 rounded-lg border border-indigo-400/30">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] font-black uppercase px-1.5 py-0.5 rounded">
                  Multilingual
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">Advisory Translator</span>
              </div>
              <h3 className="font-black text-base text-white">AI Multilingual Emergency Simplifier</h3>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Language Selector */}
          <div className="flex items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-bold text-gov-navy">
              <Globe className="w-4 h-4 text-gov-navy" />
              <span>Translate Advisory Into:</span>
            </div>

            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg text-xs font-bold px-3 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-gov-navy"
            >
              {languages.map(l => (
                <option key={l.code} value={l.code}>
                  {l.native} ({l.name})
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-500 space-y-2">
              <Sparkles className="w-6 h-6 animate-spin text-gov-navy mx-auto" />
              <p>Translating & simplifying advisory into regional dialect...</p>
            </div>
          ) : simplifiedData ? (
            <div className="space-y-4">
              <div className="border-l-4 border-l-gov-navy pl-3">
                <span className="text-[10px] font-black uppercase text-gov-navy tracking-wider">
                  {simplifiedData.headerTitle || "EMERGENCY ADVISORY"} • {simplifiedData.severityText || advisory.severity}
                </span>
                <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                  {simplifiedData.title}
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {simplifiedData.plainSummary}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <h5 className="font-extrabold text-xs text-gov-navy uppercase tracking-wide">
                  {simplifiedData.actionHeader || "What to do right now:"}
                </h5>
                <div className="space-y-2">
                  {simplifiedData.actionChecklist.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-gov-green flex-shrink-0 mt-0.5" />
                      <span className="font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <strong>{simplifiedData.helplineHeader || "Official Emergency Helpline"}:</strong> {simplifiedData.helpline}
              </div>
            </div>
          ) : null}

          <div className="text-right border-t border-slate-100 pt-3">
            <button
              onClick={onClose}
              className="bg-gov-navy hover:bg-gov-blue text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors"
            >
              Close Advisory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}