import React, { useState, useEffect, useRef } from 'react';
import { X, BellRing, Sun, Volume2, VolumeX, ShieldAlert, Radio } from 'lucide-react';
import { TricolorStrip } from './Emblems';

export default function EmergencyAlarmModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [sirenPlaying, setSirenPlaying] = useState(false);
  const [strobeActive, setStrobeActive] = useState(false);
  const [strobeColor, setStrobeColor] = useState('white');
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const lfoRef = useRef(null);
  const gainRef = useRef(null);

  // Clean up audio & strobe when modal closes or unmounts
  useEffect(() => {
    if (!isOpen) {
      stopSiren();
      setStrobeActive(false);
    }
    return () => {
      stopSiren();
    };
  }, [isOpen]);

  // Screen Strobe Effect
  useEffect(() => {
    let interval = null;
    if (strobeActive) {
      interval = setInterval(() => {
        setStrobeColor(prev => prev === 'white' ? '#dc2626' : 'white');
      }, 180);
    } else {
      setStrobeColor('white');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [strobeActive]);

  const startSiren = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(950, ctx.currentTime);

      // Modulate frequency between 650Hz and 1250Hz continuously
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.85, ctx.currentTime); // 0.85 sweeps per second
      lfoGain.gain.setValueAtTime(320, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);

      lfo.start();
      osc.start();

      oscRef.current = osc;
      lfoRef.current = lfo;
      gainRef.current = gain;
      setSirenPlaying(true);
    } catch (e) {
      console.warn("Audio Context blocked or failed:", e);
    }
  };

  const stopSiren = () => {
    if (lfoRef.current) {
      try {
        lfoRef.current.stop();
        lfoRef.current.disconnect();
      } catch {}
      lfoRef.current = null;
    }
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch {}
      oscRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
    setSirenPlaying(false);
  };

  const toggleSiren = () => {
    if (sirenPlaying) {
      stopSiren();
    } else {
      startSiren();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto"
      style={strobeActive ? { backgroundColor: strobeColor } : {}}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-300 overflow-hidden my-auto">
        <div className="bg-gov-red text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <BellRing className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-gov-saffron text-slate-950 text-[10px] font-black uppercase px-1.5 py-0.2 rounded">
                  Acoustic & Optical
                </span>
                <span className="text-[11px] text-red-100 font-semibold">Civil Defence Alarm</span>
              </div>
              <h3 className="font-black text-base text-white">Emergency Siren & Rescue Strobe</h3>
            </div>
          </div>
          <button 
            onClick={() => {
              stopSiren();
              setStrobeActive(false);
              onClose();
            }} 
            className="p-1.5 hover:bg-red-800 rounded-lg text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <TricolorStrip className="h-1" />

        <div className="p-5 space-y-5 text-center">
          <p className="text-xs text-slate-600 leading-relaxed">
            Use these acoustic and optical signals if isolated on rooftops or hill slopes to help IAF / NDRF helicopters and disaster rescue boats pinpoint your location through torrential rain and fog.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {/* Siren Button */}
            <button
              onClick={toggleSiren}
              className={`p-4 rounded-xl font-bold flex flex-col items-center justify-center gap-2 border transition-all active:scale-95 ${
                sirenPlaying
                  ? 'bg-gov-red text-white border-red-700 shadow-lg animate-pulse'
                  : 'bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100'
              }`}
            >
              {sirenPlaying ? <Volume2 className="w-7 h-7 text-white" /> : <VolumeX className="w-7 h-7 text-gov-red" />}
              <span className="text-xs">{sirenPlaying ? 'Stop Acoustic Siren' : 'Sound Loud Siren'}</span>
            </button>

            {/* Strobe Button */}
            <button
              onClick={() => setStrobeActive(!strobeActive)}
              className={`p-4 rounded-xl font-bold flex flex-col items-center justify-center gap-2 border transition-all active:scale-95 ${
                strobeActive
                  ? 'bg-gov-saffron text-slate-950 border-amber-600 shadow-lg'
                  : 'bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Sun className="w-7 h-7 text-gov-saffron" />
              <span className="text-xs">{strobeActive ? 'Disable Optical Strobe' : 'Flash Screen Strobe'}</span>
            </button>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-left text-xs space-y-1 text-slate-700">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 mb-1">
              <ShieldAlert className="w-4 h-4 text-gov-green" />
              <span>Standard Civil Distress Signaling Code:</span>
            </div>
            <p>• <strong>Acoustic:</strong> 3 distinct blasts repeated every 60 seconds.</p>
            <p>• <strong>Visual:</strong> 3 rapid flashes in sequence toward approaching rescue craft.</p>
            <p>• <strong>Ground-to-Air:</strong> Display brightly colored saffron, red, or orange cloth on roofs.</p>
          </div>

          <button
            onClick={() => {
              stopSiren();
              setStrobeActive(false);
              onClose();
            }}
            className="w-full bg-gov-navy hover:bg-gov-blue text-white font-bold py-2.5 rounded-lg text-xs transition-colors"
          >
            Close Emergency Signaling
          </button>
        </div>
      </div>
    </div>
  );
}