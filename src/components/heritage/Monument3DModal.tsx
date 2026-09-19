import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, QrCode, Smartphone, Scan, Box, CheckCircle2,
  RotateCcw, ArrowRight, Sparkles, Info
} from "lucide-react";
import { MONUMENTS } from "../../data/monuments";
import type { CityItem } from "../../data/cityData";
import type { Monument, MonumentId } from "../../types";

const MONUMENT_NAME_MAP: [string, MonumentId][] = [
  ["golden temple",     "taj-mahal"],
  ["harmandir sahib",   "taj-mahal"],
  ["jallianwala",       "hawa-mahal"],
  ["wagah",             "qutub-minar"],
  ["akal takht",        "meenakshi-amman"],
  ["hawa mahal",        "hawa-mahal"],
  ["amber fort",        "kailasa-ellora"],
  ["city palace",       "hawa-mahal"],
  ["jantar mantar",     "konark-sun"],
  ["kashi vishwanath",  "meenakshi-amman"],
  ["sarnath",           "brihadisvara"],
  ["victoria memorial", "taj-mahal"],
  ["howrah",            "qutub-minar"],
  ["mattancherry",      "kailasa-ellora"],
  ["gateway of india",  "qutub-minar"],
  ["elephanta",         "kailasa-ellora"],
  ["qutub minar",       "qutub-minar"],
  ["taj mahal",         "taj-mahal"],
  ["konark",            "konark-sun"],
  ["meenakshi",         "meenakshi-amman"],
  ["hampi",             "hampi-chariot"],
  ["brihadisvara",      "brihadisvara"],
  ["ellora",            "kailasa-ellora"],
  ["sun temple",        "konark-sun"],
];

function resolveMonument(item: CityItem): Monument {
  const lower = item.name.toLowerCase();
  for (const [key, id] of MONUMENT_NAME_MAP) {
    if (lower.includes(key)) {
      const found = MONUMENTS.find(m => m.id === id);
      if (found) return found;
    }
  }
  const hash = [...item.id].reduce((a, c) => a + c.charCodeAt(0), 0);
  return MONUMENTS[hash % MONUMENTS.length];
}

interface Props {
  item: CityItem;
  onClose: () => void;
}

export const Monument3DModal: React.FC<Props> = ({ item, onClose }) => {
  const monument = resolveMonument(item);
  const [copied, setCopied] = useState(false);

  const baseUrl = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? 'https://smarak-ai.vercel.app'
    : window.location.origin;
  const arUrl = `${baseUrl}/?ar=${encodeURIComponent(monument.id)}&city=${encodeURIComponent(item.id)}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(arUrl)}&bgcolor=0e1117&color=f59e0b&qzone=2&format=png`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(arUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-3 sm:p-6 bg-black/92 backdrop-blur-2xl"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.85, y: 40, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 280 }}
          className="relative w-full max-w-lg bg-[#0e1117] rounded-3xl border border-amber-500/30 shadow-[0_0_60px_rgba(245,158,11,0.12)] overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-800/70 bg-stone-950/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <Box className="w-5 h-5 text-black" />
              </div>
              <div>
                <h2 className="text-white font-extrabold text-sm leading-tight">View in 3D / AR</h2>
                <p className="text-amber-400/70 text-xs mt-0.5">Scan QR with your phone camera</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 border border-stone-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-5 py-2.5 border-b border-amber-500/15 flex items-center gap-2.5">
            <img
              src={item.image}
              alt={item.name}
              className="w-10 h-10 rounded-xl object-cover border border-amber-500/30 flex-shrink-0"
            />
            <div className="min-w-0">
              <p className="text-white font-bold text-sm truncate">{item.name}</p>
              <p className="text-stone-400 text-xs">
                3D Model: <span className="text-amber-400">{monument.name}</span> · {monument.period}
              </p>
            </div>
            <span className="ml-auto flex-shrink-0 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 text-[10px] font-bold">
              AR Ready
            </span>
          </div>

          <div className="flex flex-col items-center px-6 py-7 gap-5">
            <div className="relative group">
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-br from-amber-500/40 to-orange-600/30 blur-md opacity-70 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-3 rounded-2xl bg-[#0a0c12] border-2 border-amber-500/50 shadow-2xl">
                <img
                  src={qrApiUrl}
                  alt="QR Code for AR"
                  width={200}
                  height={200}
                  className="w-[200px] h-[200px] rounded-xl"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-xl bg-[#0a0c12] border-2 border-amber-500 flex items-center justify-center shadow-lg">
                    <span className="text-lg">🛕</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full space-y-2.5">
              {([
                { icon: "scan",  step: "1", color: "text-amber-400",  text: "Open your phone camera and point it at the QR code above" },
                { icon: "phone", step: "2", color: "text-orange-400", text: "Tap the notification to open Smarak AI in your mobile browser" },
                { icon: "spark", step: "3", color: "text-emerald-400",text: "The 3D monument launches in AR — place it in your room!" },
              ] as const).map(({ step, color, text }) => (
                <div key={step} className="flex items-start gap-3 p-3 rounded-xl bg-stone-900/60 border border-stone-800/80">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0 text-xs font-black text-amber-400">
                    {step}
                  </div>
                  <p className={`text-stone-300 text-xs leading-relaxed ${color}`}>{text}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-stone-500">
              <Info className="w-3.5 h-3.5 text-amber-500/60" />
              <span>Works on Android (ARCore) · iOS (AR Quick Look) · Any modern browser</span>
            </div>
          </div>

          <div className="px-5 py-4 border-t border-stone-800/60 bg-stone-950/50 flex gap-3">
            <button
              onClick={handleCopyLink}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-xs font-bold transition-all"
            >
              {copied ? (
                <><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Copied!</>
              ) : (
                <><RotateCcw className="w-4 h-4" /> Copy AR Link</>
              )}
            </button>
            <a
              href={arUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black text-xs font-extrabold shadow-lg shadow-amber-500/25 transition-all"
            >
              Open in Browser <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
