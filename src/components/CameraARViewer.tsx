import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Monument, CreatureId } from '../types';
import { ProceduralModelBuilder } from '../utils/proceduralModels';
import { SACRED_CREATURES } from '../data/creatures';
import {
  Camera,
  RotateCw,
  X,
  Compass,
  Sparkles,
  CheckCircle2,
  Smartphone,
  Scan,
  Move,
} from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { triggerHaptic } from '../utils/haptics';

interface Props {
  monument: Monument;
  onClose: () => void;
  onUnlockBadge?: (name: string) => void;
  onOpenNativeAR?: () => void;
}

export const CameraARViewer: React.FC<Props> = ({
  monument,
  onClose,
  onUnlockBadge,
  onOpenNativeAR,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);

  // AR Modes: 'remote' (living room/table placement) vs 'onsite' (monument facade overlay)
  const [arMode, setArMode] = useState<'remote' | 'onsite'>('remote');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Transform controls
  const [scale, setScale] = useState(1.0);
  const [rotationY, setRotationY] = useState(0);
  const [reconstructionAlpha, setReconstructionAlpha] = useState(0.85);
  const [selectedCreatureId, setSelectedCreatureId] = useState<CreatureId | 'monument'>('monument');
  const [modelPosition, setModelPosition] = useState<[number, number, number]>([0, 0, 0]);

  // On-Site simulated location & compass
  const simulatedHeading = 42;
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [snapshotTaken, setSnapshotTaken] = useState(false);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const reticleRef = useRef<THREE.Mesh | null>(null);

  // 1. Initialize Camera Feed
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera not supported on this browser');
        }
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Rear camera on mobile
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraActive(true);
          setCameraError(null);
        }
      } catch (err) {
        console.warn('Camera access unavailable, using simulated environment:', err);
        setCameraError('Camera access not granted or unavailable. Simulated AR mode activated.');
        setCameraActive(false);
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // 2. Initialize Three.js AR Canvas
  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 1.8, 5.0);
    camera.lookAt(0, 0.8, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent to show camera underneath
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Realistic outdoor lighting matching sun
    const ambientLight = new THREE.AmbientLight(0xffeedd, 1.6);
    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.4);
    sunLight.position.set(4, 8, 4);
    scene.add(ambientLight);
    scene.add(sunLight);

    // Subtle blue fill light
    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.8);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    // Spatial Ground Reticle (AR Target Circle)
    const reticleGeo = new THREE.RingGeometry(1.4, 1.55, 32);
    const reticleMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const reticle = new THREE.Mesh(reticleGeo, reticleMat);
    reticle.rotation.x = -Math.PI / 2;
    reticle.position.set(0, 0.02, 0);
    scene.add(reticle);
    reticleRef.current = reticle;

    // Tap-to-Place Raycaster
    const raycaster = new THREE.Raycaster();
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // Horizontal ground at y=0

    const handleCanvasClick = (e: MouseEvent | TouchEvent) => {
      if (!container || !cameraRef.current) return;
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(new THREE.Vector2(x, y), cameraRef.current);
      const intersectionPoint = new THREE.Vector3();
      if (raycaster.ray.intersectPlane(groundPlane, intersectionPoint)) {
        // Clamp position within reasonable bounds
        const clampedX = Math.max(-4, Math.min(4, intersectionPoint.x));
        const clampedZ = Math.max(-4, Math.min(2, intersectionPoint.z));
        setModelPosition([clampedX, 0, clampedZ]);
        triggerHaptic('tap');
        soundEngine.playTempleBell(600, 0.8);
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('click', handleCanvasClick);

    // Build Initial 3D Model
    loadActiveModel();

    let animId: number;
    let clock = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      clock += 0.025;

      // Gentle pulsating reticle
      if (reticleRef.current) {
        const s = 1.0 + Math.sin(clock * 2) * 0.06;
        reticleRef.current.scale.set(s, s, s);
      }

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('click', handleCanvasClick);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  // Update Model when selection or properties change
  const loadActiveModel = () => {
    if (!sceneRef.current) return;

    if (modelGroupRef.current) {
      sceneRef.current.remove(modelGroupRef.current);
    }

    let newModel: THREE.Group;

    if (selectedCreatureId === 'monument') {
      newModel = ProceduralModelBuilder.buildMonument(monument.id, {
        reconstructionMode: true,
        opacity: arMode === 'onsite' ? reconstructionAlpha : 1.0,
      });
    } else {
      newModel = ProceduralModelBuilder.buildCreature(selectedCreatureId, {
        reconstructionMode: true,
      });
    }

    newModel.position.set(modelPosition[0], modelPosition[1], modelPosition[2]);
    newModel.scale.set(scale, scale, scale);
    newModel.rotation.y = rotationY;

    modelGroupRef.current = newModel;
    sceneRef.current.add(newModel);

    // Sync reticle position
    if (reticleRef.current) {
      reticleRef.current.position.set(modelPosition[0], 0.02, modelPosition[2]);
    }
  };

  useEffect(() => {
    loadActiveModel();
  }, [selectedCreatureId, arMode, monument.id]);

  useEffect(() => {
    if (modelGroupRef.current) {
      modelGroupRef.current.position.set(modelPosition[0], modelPosition[1], modelPosition[2]);
      modelGroupRef.current.scale.set(scale, scale, scale);
      modelGroupRef.current.rotation.y = rotationY;

      if (reticleRef.current) {
        reticleRef.current.position.set(modelPosition[0], 0.02, modelPosition[2]);
      }

      // If in onsite mode, adjust opacity of materials for time-travel cross-fade
      if (arMode === 'onsite') {
        modelGroupRef.current.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            child.material.transparent = true;
            child.material.opacity = reconstructionAlpha;
          }
        });
      }
    }
  }, [modelPosition, scale, rotationY, reconstructionAlpha, arMode]);

  // Simulate scanning of architectural features
  const handleScanFeature = () => {
    triggerHaptic('tap');
    setIsScanning(true);
    setScanResult(null);
    soundEngine.playTempleBell(880, 1.5);

    setTimeout(() => {
      setIsScanning(false);
      triggerHaptic('success');
      const randomHotspot = monument.hotspots[Math.floor(Math.random() * monument.hotspots.length)];
      setScanResult(`Target Locked: ${randomHotspot.title}. ${randomHotspot.fact}`);
      if (onUnlockBadge) {
        onUnlockBadge(`AR Discovery: ${randomHotspot.title}`);
      }
    }, 1800);
  };

  // Capture Snapshot Postcard
  const handleTakeSnapshot = () => {
    triggerHaptic('snap');
    soundEngine.playTempleBell(740, 2.0);
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4">
      <div className="relative w-full h-full max-w-6xl max-h-[92vh] rounded-3xl overflow-hidden glass-royal border border-amber-500/40 shadow-2xl flex flex-col">
        {/* Background Camera Feed / Fallback (No inverted mirroring for environment camera) */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#0a0c16]">
          {cameraActive ? (
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Simulated Ambient Courtyard / Room */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm scale-105"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at center, #1e1b4b 0%, #090a12 100%)',
                }}
              />
              <div className="relative z-10 text-center p-6 max-w-md bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
                <Smartphone className="w-10 h-10 mx-auto text-amber-400 mb-3 animate-bounce" />
                <h3 className="font-cinzel text-lg font-bold text-white mb-1">Simulated AR Camera Feed</h3>
                <p className="text-xs text-amber-200/80 mb-3 leading-relaxed">
                  {cameraError || 'Point your device at an open flat floor or monument facade.'}
                </p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs border border-amber-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>3D Spatial Grid Active</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Overlay Three.js WebGL Canvas */}
        <div ref={canvasMountRef} className="absolute inset-0 z-10 pointer-events-auto cursor-crosshair" />

        {/* Top Header Controls */}
        <div className="relative z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/90 via-black/50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-black shadow-lg shadow-amber-500/25">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel font-bold text-white text-base sm:text-lg">
                  {arMode === 'remote' ? 'Interactive Camera AR' : 'On-Site Monument Overlay'}
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium">
                  WebXR Active
                </span>
              </div>
              <p className="text-xs text-amber-200/70 font-outfit">
                {arMode === 'remote'
                  ? 'Tap anywhere on the floor/table to place • Drag sliders to resize & rotate'
                  : `Real-time GPS lock: ${monument.name} (${monument.location})`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Direct Switch to Native ARCore / Scene Viewer */}
            {onOpenNativeAR && (
              <button
                onClick={() => {
                  triggerHaptic('success');
                  soundEngine.playTempleBell(784, 1.8);
                  onOpenNativeAR();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-cinzel font-bold text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Native Floor AR</span>
              </button>
            )}

            {/* Mode Switcher: Remote vs On-Site */}
            <div className="flex items-center bg-black/60 backdrop-blur-md p-1 rounded-2xl border border-white/10 text-xs">
              <button
                onClick={() => setArMode('remote')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  arMode === 'remote'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-md font-semibold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Remote (Home)
              </button>
              <button
                onClick={() => setArMode('onsite')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  arMode === 'onsite'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-md font-semibold'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                On-Site (Present)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-gray-300 hover:text-white border border-white/15 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tap-to-Place Instruction Floating Pill */}
        {arMode === 'remote' && (
          <div className="relative z-20 self-center pointer-events-none mt-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs shadow-lg">
              <Move className="w-3.5 h-3.5 text-amber-400" />
              <span>Tap anywhere on screen to reposition model</span>
            </div>
          </div>
        )}

        {/* On-Site HUD Overlay (Compass Radar & Feature Scanner) */}
        {arMode === 'onsite' && (
          <div className="relative z-20 px-4 flex flex-col gap-2 pointer-events-none">
            <div className="flex items-center justify-between">
              {/* Compass Bearing */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/70 backdrop-blur-md border border-amber-500/30 text-amber-300 text-xs pointer-events-auto">
                <Compass className="w-4 h-4 animate-spin-slow" />
                <span>Bearing {simulatedHeading}° NE • 14m to Sanctum</span>
              </div>

              {/* Time-Travel Overlay Slider */}
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-black/70 backdrop-blur-md border border-amber-500/30 text-xs pointer-events-auto">
                <span className="text-gray-400">Ruins</span>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={reconstructionAlpha}
                  onChange={(e) => setReconstructionAlpha(parseFloat(e.target.value))}
                  className="w-24 sm:w-36 accent-amber-500 cursor-pointer"
                />
                <span className="text-amber-400 font-semibold">Golden Era</span>
              </div>
            </div>

            {/* AI Target Reticle Scanner */}
            <div className="self-center mt-6 pointer-events-auto text-center">
              <button
                onClick={handleScanFeature}
                disabled={isScanning}
                className="group relative flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-900/80 hover:bg-indigo-800 text-amber-300 border border-indigo-400/50 backdrop-blur-md shadow-xl transition-all"
              >
                <Scan className={`w-4 h-4 ${isScanning ? 'animate-spin' : 'group-hover:scale-110'}`} />
                <span>{isScanning ? 'Scanning Architectural Carvings...' : 'Scan Carvings & Motifs'}</span>
              </button>

              {scanResult && (
                <div className="mt-3 p-3 max-w-md rounded-2xl bg-[#0b0c1a]/95 backdrop-blur-xl border border-amber-500/50 shadow-2xl text-left animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Feature Identified by Smarak AR</span>
                  </div>

                  <p className="text-xs text-amber-100/90 leading-relaxed font-outfit">{scanResult}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Snapshot Notification Toast */}
        {snapshotTaken && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 px-5 py-2.5 rounded-2xl bg-amber-500 text-black font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>Souvenir Postcard Saved! Added to your Heritage Passport.</span>
          </div>
        )}

        <div className="flex-1" />

        {/* Bottom Panel: Creature / Monument Selector & AR Adjustment Controls */}
        <div className="relative z-20 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent flex flex-col gap-3">
          {/* 1. Item Selector: Choose Monument OR Sacred Creatures */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => {
                soundEngine.playTempleBell(520, 1.5);
                setSelectedCreatureId('monument');
              }}
              className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCreatureId === 'monument'
                  ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/30'
                  : 'bg-black/60 text-gray-300 hover:text-white border border-white/10'
              }`}
            >
              <span>🏛️ {monument.name}</span>
            </button>

            {SACRED_CREATURES.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  soundEngine.playTempleBell(620, 1.5);
                  setSelectedCreatureId(c.id);
                }}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedCreatureId === c.id
                    ? 'bg-amber-500 text-black font-bold shadow-lg shadow-amber-500/30'
                    : 'bg-black/60 text-gray-300 hover:text-white border border-white/10'
                }`}
              >
                <span>✨ {c.name}</span>
              </button>
            ))}
          </div>

          {/* 2. Scale & Rotation Sliders + Snapshot Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/10">
            {/* Scale Slider */}
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 text-xs">
              <span className="text-gray-400">Scale</span>
              <input
                type="range"
                min="0.3"
                max="2.5"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-20 sm:w-28 accent-amber-500 cursor-pointer"
              />
              <span className="text-amber-300 font-mono text-[11px]">{scale.toFixed(1)}x</span>
            </div>

            {/* Rotation Slider */}
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 text-xs">
              <RotateCw className="w-3.5 h-3.5 text-gray-400" />
              <input
                type="range"
                min="0"
                max={Math.PI * 2}
                step="0.05"
                value={rotationY}
                onChange={(e) => setRotationY(parseFloat(e.target.value))}
                className="w-20 sm:w-28 accent-amber-500 cursor-pointer"
              />
              <span className="text-amber-300 font-mono text-[11px]">
                {Math.round((rotationY * 180) / Math.PI)}°
              </span>
            </div>

            {/* Native AR launch button on mobile */}
            {onOpenNativeAR && (
              <button
                onClick={() => {
                  triggerHaptic('success');
                  onOpenNativeAR();
                }}
                className="sm:hidden flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Native AR</span>
              </button>
            )}

            {/* Snapshot Postcard Button */}
            <button
              onClick={handleTakeSnapshot}
              className="flex items-center gap-2 px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs shadow-xl shadow-amber-500/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer ml-auto"
            >
              <Camera className="w-4 h-4" />
              <span>Capture AR Photo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
