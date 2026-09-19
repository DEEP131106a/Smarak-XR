import React, { useEffect, useState } from 'react';
import type { Monument, CreatureId } from '../types';
import { ProceduralModelBuilder } from '../utils/proceduralModels';
import { SACRED_CREATURES } from '../data/creatures';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { Smartphone, X, CheckCircle2, Sparkles, Loader2, QrCode, Layers, Compass } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { triggerHaptic } from '../utils/haptics';

interface Props {
  monument: Monument;
  onClose: () => void;
  onSwitchToCameraAR?: () => void;
}

export const ModelViewerWebXR: React.FC<Props> = ({ monument, onClose, onSwitchToCameraAR }) => {
  const [selectedItem, setSelectedItem] = useState<CreatureId | 'monument'>('monument');
  const [glbUrl, setGlbUrl] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<boolean>(true);
  const [showQRModal, setShowQRModal] = useState<boolean>(false);

  // Generate QR Code pointing to this experience on mobile
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    currentUrl
  )}&bgcolor=080912&color=f59e0b`;

  // Dynamically export selected procedural 3D model to GLB Blob
  useEffect(() => {
    setIsExporting(true);
    let isCancelled = false;

    try {
      const group =
        selectedItem === 'monument'
          ? ProceduralModelBuilder.buildMonument(monument.id, { reconstructionMode: true })
          : ProceduralModelBuilder.buildCreature(selectedItem, { reconstructionMode: true });

      const exporter = new GLTFExporter();
      exporter.parse(
        group,
        (gltf) => {
          if (isCancelled) return;
          const blob = new Blob([gltf as ArrayBuffer], { type: 'model/gltf-binary' });
          const url = URL.createObjectURL(blob);
          setGlbUrl((prevUrl) => {
            if (prevUrl) URL.revokeObjectURL(prevUrl);
            return url;
          });
          setIsExporting(false);
        },
        (error) => {
          console.error('GLTFExporter parsing error:', error);
          if (!isCancelled) setIsExporting(false);
        },
        { binary: true }
      );
    } catch (err) {
      console.error('Failed to export 3D model to GLB:', err);
      setIsExporting(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [selectedItem, monument.id]);

  const activeTitle =
    selectedItem === 'monument'
      ? monument.name
      : SACRED_CREATURES.find((c) => c.id === selectedItem)?.name || selectedItem;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-4 animate-in fade-in">
      <div className="relative w-full h-full max-w-5xl max-h-[92vh] rounded-3xl overflow-hidden glass-royal border border-amber-500/40 shadow-2xl flex flex-col">
        {/* Top Header */}
        <div className="relative z-20 flex items-center justify-between p-4 border-b border-white/10 bg-black/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-black shadow-lg shadow-amber-500/25">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel font-black text-white text-base sm:text-lg">
                  Native Mobile AR (Zero App Required)
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  Google ARCore & Apple Quick Look
                </span>
              </div>
              <p className="text-xs text-amber-200/70 font-outfit">
                Instant floor anchoring with realistic lighting, shadows, and true scale
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onSwitchToCameraAR && (
              <button
                onClick={() => {
                  triggerHaptic('tap');
                  onSwitchToCameraAR();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer"
              >
                <span>Live Camera AR</span>
              </button>
            )}

            <button
              onClick={() => setShowQRModal(true)}
              title="Scan QR to open on your phone"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-400/40 text-amber-300 text-xs font-semibold backdrop-blur-md transition-all cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Phone QR Code</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-gray-300 hover:text-white border border-white/15 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Model Selector Bar */}
        <div className="relative z-20 px-4 py-2 bg-black/40 border-b border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-xs font-semibold text-gray-400 flex items-center gap-1 shrink-0">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Select Model:</span>
          </span>

          <button
            onClick={() => {
              triggerHaptic('tap');
              soundEngine.playTempleBell(523, 1.2);
              setSelectedItem('monument');
            }}
            className={`px-3 py-1 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
              selectedItem === 'monument'
                ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/30'
                : 'bg-black/60 text-gray-300 hover:text-white border border-white/10'
            }`}
          >
            🏛️ {monument.name}
          </button>

          {SACRED_CREATURES.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                triggerHaptic('tap');
                soundEngine.playTempleBell(659, 1.2);
                setSelectedItem(c.id);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                selectedItem === c.id
                  ? 'bg-amber-500 text-black font-bold shadow-md shadow-amber-500/30'
                  : 'bg-black/60 text-gray-300 hover:text-white border border-white/10'
              }`}
            >
              ✨ {c.name}
            </button>
          ))}
        </div>

        {/* Main 3D Model-Viewer Viewport */}
        <div className="relative flex-1 w-full h-full bg-[#0a0c16] overflow-hidden flex items-center justify-center">
          {isExporting ? (
            <div className="flex flex-col items-center justify-center gap-3 p-6 text-center">
              <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
              <p className="font-cinzel font-bold text-white text-base">
                Synthesizing 3D GLB Geometry for Mobile AR...
              </p>
              <p className="text-xs text-amber-200/70 max-w-sm">
                Compiling procedural architectural vertices and PBR materials for Google Scene Viewer & Apple AR Quick Look.
              </p>
            </div>
          ) : glbUrl ? (
            <div className="relative w-full h-full">
              {/* @ts-expect-error model-viewer web component */}
              <model-viewer
                src={glbUrl}
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                auto-rotate
                shadow-intensity="1.5"
                shadow-softness="0.8"
                exposure="1.2"
                ar-scale="auto"
                style={{ width: '100%', height: '100%', backgroundColor: '#090a14' }}
                alt={`3D Model of ${activeTitle}`}
              >
                {/* Custom Native AR Button styled like royal gold artifact */}
                <button
                  slot="ar-button"
                  onClick={() => {
                    triggerHaptic('success');
                    soundEngine.playTempleBell(784, 2.5);
                  }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-black font-cinzel font-black text-sm shadow-2xl shadow-amber-500/50 border-2 border-amber-300 transform active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-5 h-5 text-black animate-spin" />
                  <span>View in Your Space (Native AR)</span>
                </button>
              {/* @ts-expect-error model-viewer web component */}
              </model-viewer>

              {/* Floating Help Banner for Mobile Users */}
              <div className="absolute top-4 left-4 right-4 md:left-6 md:w-96 p-3 rounded-2xl bg-black/80 backdrop-blur-md border border-amber-500/30 text-xs text-amber-100 pointer-events-none">
                <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
                  <Compass className="w-4 h-4" />
                  <span>How to Launch on Phone</span>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  On Android or iPhone, tap the gold <strong className="text-amber-300">"View in Your Space"</strong> button above. Point your camera at the floor or table, and the 3D model will anchor with real-world dimensions without downloading any app!
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 text-gray-400">
              <p>Model initialization failed. Please try selecting another model.</p>
            </div>
          )}
        </div>

        {/* Bottom Feature Footer */}
        <div className="relative z-20 p-3 bg-black/80 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-gray-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero App Download</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Real Physical Scale</span>
            </div>
            <div className="flex items-center gap-1.5 hidden sm:flex">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Real-time Shadows & Lighting</span>
            </div>
          </div>

          <button
            onClick={() => setShowQRModal(true)}
            className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold cursor-pointer ml-auto"
          >
            <Smartphone className="w-4 h-4" />
            <span>Switch to Phone View</span>
          </button>
        </div>

        {/* QR Code Modal for Desktop users wanting to test on phone */}
        {showQRModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in">
            <div className="relative w-full max-w-sm rounded-3xl p-6 glass-royal border border-amber-500/40 shadow-2xl text-center">
              <button
                onClick={() => setShowQRModal(false)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-black/60 hover:bg-black text-gray-300 hover:text-white border border-white/15 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-3">
                <QrCode className="w-6 h-6" />
              </div>

              <h3 className="font-cinzel font-black text-xl text-white mb-1">
                Scan with Your Phone
              </h3>
              <p className="text-xs text-amber-200/70 font-outfit mb-4">
                Open your iPhone Camera or Android Google Lens to experience {activeTitle} on your floor in AR.
              </p>

              <div className="p-4 rounded-2xl bg-black/70 border border-amber-500/30 flex flex-col items-center justify-center mb-4">
                <img
                  src={qrUrl}
                  alt="Phone AR QR Code"
                  className="w-48 h-48 rounded-xl border border-amber-500/40 shadow-lg shadow-amber-500/20"
                />
                <span className="mt-3 text-[11px] font-mono text-amber-300/80">
                  Instant WebXR Floor Placement
                </span>
              </div>

              <button
                onClick={() => setShowQRModal(false)}
                className="w-full py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs shadow-lg shadow-amber-500/20 hover:bg-amber-400 transition-all cursor-pointer"
              >
                Close QR Code
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
