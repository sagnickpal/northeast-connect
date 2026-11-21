import React, { useState } from 'react';
import { 
  X, 
  Bot, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  BookOpen, 
  ArrowRight 
} from 'lucide-react';
import { TricolorStrip } from './Emblems';

export default function AiAssistantModal({ isOpen, onClose, onAskAi, onNavigateToTab }) {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: "Namaskar! I am the **NDMA Disaster Operations & Survival AI Assistant**.\n\nI am strictly grounded in verified **National Disaster Management Authority (NDMA)** and **Assam/NE SDMA Standard Operating Procedures**.\n\nAsk me survival protocols, water purification steps, landslide precautions, or earthquake safety. *(Note: To protect lives, I do not guess live road or shelter conditions; I redirect you to the verified status hub).*",
      source: "NDMA & ASDMA Disaster Action Manual",
      isLiveRedirection: false
    }
  ]);
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "What should I do if a landslide blocks our approach road?",
    "How do I purify flood water using chlorine or alum?",
    "What are early signs of a hill landslide?",
    "How to manage a snakebite while waiting for rescue?",
    "Is NH-06 highway open right now?" // Shows guardrail in action!
  ];

  const handleSend = async (questionText) => {
    const q = questionText || query;
    if (!q.trim() || loading) return;

    const userMsg = { sender: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });
      const data = await res.json();
      setMessages(prev => [...prev, {
        sender: 'assistant',
        text: data.answer,
        source: data.groundedSource,
        isLiveRedirection: data.isLiveRedirection,
        suggestedActions: data.suggestedActions
      }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        sender: 'assistant',
        text: "Could not connect to AI server. Please refer to the offline Survival Playbooks in the top navigation.",
        source: "Offline Cache",
        isLiveRedirection: false
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full h-[85vh] flex flex-col border border-slate-300 overflow-hidden my-auto">
        {/* Government Header */}
        <div className="bg-gov-navy text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gov-blue p-2 rounded-lg border border-white/20">
              <Bot className="w-5 h-5 text-gov-saffron" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-white">NDMA Disaster Assistance AI</h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-1.5 py-0.2 rounded">
                  NDMA Grounded
                </span>
              </div>
              <p className="text-xs text-slate-300">Strictly verified disaster survival protocols & SOPs</p>
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

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-3.5 text-xs shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-gov-navy text-white rounded-br-none'
                    : m.isLiveRedirection
                      ? 'bg-amber-50 text-amber-950 border border-amber-300 rounded-bl-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed font-normal">
                  {m.text}
                </div>

                {m.source && (
                  <div className={`mt-2 pt-2 text-[10px] flex items-center gap-1 border-t ${
                    m.sender === 'user' 
                      ? 'border-gov-blue text-slate-300' 
                      : 'border-slate-100 text-slate-500 font-semibold'
                  }`}>
                    <ShieldCheck className="w-3.5 h-3.5 text-gov-green flex-shrink-0" />
                    <span>Grounded in: <strong>{m.source}</strong></span>
                  </div>
                )}

                {/* Suggested Navigation Actions */}
                {m.suggestedActions && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5 pt-1">
                    {m.suggestedActions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => {
                          onClose();
                          if (act.includes('Shelter') || act.includes('Road')) onNavigateToTab('statusHub');
                          if (act.includes('SOS')) onNavigateToTab('assistance');
                          if (act.includes('Playbook')) onNavigateToTab('playbooks');
                          if (act.includes('Contacts')) onNavigateToTab('directory');
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-gov-navy border border-slate-300 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1 transition-colors"
                      >
                        <span>{act}</span>
                        <ArrowRight className="w-3 h-3 text-gov-saffron" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-gov-navy bg-white p-3 rounded-xl border border-slate-200 max-w-xs shadow-sm">
              <Sparkles className="w-4 h-4 animate-spin text-gov-saffron" />
              <span>Retrieving verified NDMA survival standard...</span>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="p-2.5 bg-white border-t border-slate-200 overflow-x-auto scrollbar-none flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-500 flex-shrink-0">Suggested:</span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap border border-slate-200 flex-shrink-0 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask emergency survival question (e.g. how to make water drinkable)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-gov-navy focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-gov-navy hover:bg-gov-blue disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow"
          >
            <Send className="w-4 h-4 text-gov-saffron" />
          </button>
        </form>
      </div>
    </div>
  );
}