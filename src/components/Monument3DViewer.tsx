import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Monument, ArchitecturalHotspot } from '../types';
import { ProceduralModelBuilder } from '../utils/proceduralModels';
import type { LightingMode } from '../utils/proceduralModels';
import {
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Sparkles,
  Layers,
  RotateCw,
  Volume2,
  VolumeX,
  Eye,
  Info,
  Compass,
} from 'lucide-react';

import { voiceGuide } from '../services/voiceGuide';
import { soundEngine } from '../services/soundEngine';

interface Props {
  monument: Monument;
  onOpenAR?: () => void;
  onOpenVR?: () => void;
}

export const Monument3DViewer: React.FC<Props> = ({ monument, onOpenAR, onOpenVR }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [lighting, setLighting] = useState<LightingMode>('aarti');
  const [isWireframe, setIsWireframe] = useState(false);
  const [isReconstructed, setIsReconstructed] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<ArchitecturalHotspot | null>(null);
  const [hotspotScreenCoords, setHotspotScreenCoords] = useState<{ [id: string]: { x: number; y: number; visible: boolean } }>({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const lightsRef = useRef<{
    dir: THREE.DirectionalLight;
    amb: THREE.AmbientLight;
    point: THREE.PointLight;
  } | null>(null);

  // Orbit controls state
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const spherical = useRef({ radius: 8.5, theta: 0.6, phi: 1.1 });

  // Update lighting conditions
  const applyLighting = (mode: LightingMode) => {
    if (!lightsRef.current || !sceneRef.current) return;
    const { dir, amb, point } = lightsRef.current;

    switch (mode) {
      case 'dawn':
        sceneRef.current.background = new THREE.Color(0x1a1226);
        dir.color.setHex(0xffc5a1);
        dir.intensity = 1.4;
        dir.position.set(6, 4, 3);
        amb.color.setHex(0x714b67);
        amb.intensity = 0.9;
        point.color.setHex(0xfbbf24);
        point.intensity = 0.6;
        break;

      case 'noon':
        sceneRef.current.background = new THREE.Color(0x0a1128);
        dir.color.setHex(0xffffff);
        dir.intensity = 2.0;
        dir.position.set(2, 9, 4);
        amb.color.setHex(0x475569);
        amb.intensity = 1.2;
        point.color.setHex(0xfffbeb);
        point.intensity = 0.3;
        break;

      case 'aarti': // Golden hour temple aarti
        sceneRef.current.background = new THREE.Color(0x1a0f0a);
        dir.color.setHex(0xf97316);
        dir.intensity = 1.8;
        dir.position.set(7, 3, 2);
        amb.color.setHex(0xb45309);
        amb.intensity = 0.9;
        point.color.setHex(0xfef08a);
        point.intensity = 1.2;
        break;

      case 'night': // Moonlit starlight
        sceneRef.current.background = new THREE.Color(0x050714);
        dir.color.setHex(0x93c5fd);
        dir.intensity = 0.9;
        dir.position.set(-5, 6, -3);
        amb.color.setHex(0x1e1b4b);
        amb.intensity = 0.6;
        point.color.setHex(0x38bdf8);
        point.intensity = 0.4;
        break;
    }
  };

  // Build/Rebuild Model when options change
  const rebuildModel = () => {
    if (!sceneRef.current) return;

    if (modelGroupRef.current) {
      sceneRef.current.remove(modelGroupRef.current);
    }

    const newModel = ProceduralModelBuilder.buildMonument(monument.id, {
      wireframe: isWireframe,
      reconstructionMode: isReconstructed,
    });

    modelGroupRef.current = newModel;
    sceneRef.current.add(newModel);
  };

  // Initialize Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Ambient & Directional Lights
    const ambLight = new THREE.AmbientLight(0xffffff, 0.8);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    const pointLight = new THREE.PointLight(0xf59e0b, 0.8, 15);
    pointLight.position.set(0, 3, 0);

    scene.add(ambLight);
    scene.add(dirLight);
    scene.add(pointLight);
    lightsRef.current = { dir: dirLight, amb: ambLight, point: pointLight };

    // Starfield particles in the background
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 350;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 50;
      starPos[i + 1] = Math.random() * 25 + 2;
      starPos[i + 2] = (Math.random() - 0.5) * 50;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xf59e0b, size: 0.15, transparent: true, opacity: 0.7 });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // Initial model build
    rebuildModel();
    applyLighting(lighting);

    let animationFrameId: number;

    const updateCameraPosition = () => {
      const { radius, theta, phi } = spherical.current;
      camera.position.x = radius * Math.sin(phi) * Math.sin(theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.cos(theta);
      camera.lookAt(0, 1.5, 0);
    };

    // Animation Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && !isDragging.current) {
        spherical.current.theta += 0.004;
      }

      updateCameraPosition();
      starField.rotation.y += 0.0003;

      // Project hotspots from 3D coordinates to 2D screen positions
      if (camera && container) {
        const coords: { [id: string]: { x: number; y: number; visible: boolean } } = {};
        const rect = container.getBoundingClientRect();

        monument.hotspots.forEach((h) => {
          const v = new THREE.Vector3(...h.position);
          v.project(camera);

          // Check if behind camera
          const isVisible = v.z < 1;
          const x = ((v.x + 1) * rect.width) / 2;
          const y = ((-v.y + 1) * rect.height) / 2;

          coords[h.id] = { x, y, visible: isVisible };
        });

        setHotspotScreenCoords(coords);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Mouse / Touch Controls
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - prevMouse.current.x;
      const deltaY = e.clientY - prevMouse.current.y;
      prevMouse.current = { x: e.clientX, y: e.clientY };

      spherical.current.theta -= deltaX * 0.007;
      spherical.current.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, spherical.current.phi - deltaY * 0.007));
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      spherical.current.radius = Math.max(3.5, Math.min(18.0, spherical.current.radius + e.deltaY * 0.01));
    };

    // Touch events for mobile devices
    let touchDist = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        prevMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        touchDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDragging.current) {
        const deltaX = e.touches[0].clientX - prevMouse.current.x;
        const deltaY = e.touches[0].clientY - prevMouse.current.y;
        prevMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        spherical.current.theta -= deltaX * 0.008;
        spherical.current.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, spherical.current.phi - deltaY * 0.008));
      } else if (e.touches.length === 2) {
        const newDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const diff = touchDist - newDist;
        spherical.current.radius = Math.max(3.5, Math.min(18.0, spherical.current.radius + diff * 0.02));
        touchDist = newDist;
      }
    };

    const onTouchEnd = () => {
      isDragging.current = false;
    };

    const onResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const el = renderer.domElement;
    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, [monument.id]);

  // Re-run model creation when wireframe/reconstruction flags change
  useEffect(() => {
    rebuildModel();
  }, [isWireframe, isReconstructed]);

  // Re-run lighting when lighting state changes
  useEffect(() => {
    applyLighting(lighting);
  }, [lighting]);

  // Voice guide subscription
  useEffect(() => {
    const unsub = voiceGuide.subscribe((state) => {
      setIsSpeaking(state.isPlaying);
    });
    return () => {
      unsub();
      voiceGuide.stop();
    };
  }, []);

  const handleToggleVoice = () => {
    soundEngine.playTempleBell(659.25, 2.0);
    const text = lang === 'hi' ? monument.audioGuide.transcriptHi : monument.audioGuide.transcriptEn;
    voiceGuide.togglePlay(text, lang);
  };

  return (
    <div className="relative w-full h-[520px] md:h-[620px] rounded-3xl overflow-hidden glass-royal border border-amber-500/30 shadow-2xl select-none">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header Badge Overlay */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-500/30 pointer-events-auto shadow-lg">
          <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel font-bold text-white text-base tracking-wide">{monument.name}</span>
              <span className="font-yatra text-amber-400 text-xs px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/40">
                {monument.hindiName}
              </span>
            </div>
            <p className="text-xs text-amber-200/70 font-outfit">{monument.location} • {monument.period}</p>
          </div>
        </div>

        {/* Action Buttons: AR & VR */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {onOpenAR && (
            <button
              onClick={() => {
                soundEngine.playTempleBell(523.25, 2.5);
                onOpenAR();
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-semibold text-xs shadow-lg shadow-amber-500/25 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Launch AR</span>
            </button>
          )}

          {onOpenVR && (
            <button
              onClick={() => {
                soundEngine.playTempleBell(587.33, 2.5);
                onOpenVR();
              }}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-900/80 hover:bg-indigo-800 text-amber-300 border border-indigo-500/40 font-semibold text-xs shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
            >
              <Compass className="w-4 h-4" />
              <span>360° VR</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating 3D Hotspot Pins Projected on the Monument */}
      {monument.hotspots.map((h) => {
        const coord = hotspotScreenCoords[h.id];
        if (!coord || !coord.visible) return null;

        const isSelected = activeHotspot?.id === h.id;

        return (
          <div
            key={h.id}
            style={{
              position: 'absolute',
              left: `${coord.x}px`,
              top: `${coord.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
            className="z-20 pointer-events-auto transition-all"
          >
            <button
              onClick={() => {
                soundEngine.playTempleBell(783.99, 1.8);
                setActiveHotspot(isSelected ? null : h);
              }}
              className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md border transition-all transform hover:scale-110 shadow-lg ${
                isSelected
                  ? 'bg-amber-500 text-black border-white shadow-amber-500/50 ring-2 ring-amber-300'
                  : 'bg-black/75 text-amber-300 border-amber-500/50 hover:bg-amber-500 hover:text-black'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 group-hover:bg-black animate-pulse" />
              <span>{h.title}</span>
            </button>
          </div>
        );
      })}

      {/* Active Hotspot Info Card Modal */}
      {activeHotspot && (
        <div className="absolute bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 p-4 rounded-2xl bg-[#0e0c1f]/95 backdrop-blur-xl border border-amber-500/40 shadow-2xl z-30 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Info className="w-4 h-4" />
              </span>
              <h4 className="font-cinzel font-bold text-white text-sm">{activeHotspot.title}</h4>
            </div>
            <button
              onClick={() => setActiveHotspot(null)}
              className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10"
            >
              ✕
            </button>
          </div>
          <p className="mt-2 text-xs text-amber-100/80 leading-relaxed font-outfit">
            {activeHotspot.description}
          </p>
          <div className="mt-2.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/25">
            <p className="text-[11px] text-amber-300 font-medium">
              💡 <span className="font-bold">Architectural Secret:</span> {activeHotspot.fact}
            </p>
          </div>
        </div>
      )}

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Lighting Controls */}
        <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 pointer-events-auto shadow-lg">
          <button
            onClick={() => setLighting('dawn')}
            title="Sunrise (Usha)"
            className={`p-2 rounded-xl text-xs transition-all ${
              lighting === 'dawn' ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sunrise className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLighting('noon')}
            title="Surya Noon"
            className={`p-2 rounded-xl text-xs transition-all ${
              lighting === 'noon' ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLighting('aarti')}
            title="Evening Aarti (Sandhya)"
            className={`p-2 rounded-xl text-xs transition-all ${
              lighting === 'aarti' ? 'bg-orange-500/30 text-orange-300 border border-orange-500/50' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sunset className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLighting('night')}
            title="Moonlit Starlight (Ratri)"
            className={`p-2 rounded-xl text-xs transition-all ${
              lighting === 'night' ? 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Audio Guide Player */}
        <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/10 pointer-events-auto shadow-lg">
          <button
            onClick={handleToggleVoice}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
              isSpeaking
                ? 'bg-amber-500 text-black animate-pulse shadow-md shadow-amber-500/30'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            <span>{isSpeaking ? 'Stop Guide' : 'Audio Guide'}</span>
          </button>

          {/* Lang selector */}
          <div className="flex items-center rounded-lg bg-black/40 p-0.5 border border-white/10 text-[11px]">
            <button
              onClick={() => setLang('en')}
              className={`px-1.5 py-0.5 rounded ${lang === 'en' ? 'bg-amber-500 text-black font-semibold' : 'text-gray-400'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-1.5 py-0.5 rounded ${lang === 'hi' ? 'bg-amber-500 text-black font-semibold' : 'text-gray-400'}`}
            >
              हिन्दी
            </button>
          </div>
        </div>

        {/* Right: Architectural Modes (Wireframe, Golden Age, Auto-Rotate) */}
        <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 pointer-events-auto shadow-lg">
          <button
            onClick={() => setIsReconstructed(!isReconstructed)}
            title={isReconstructed ? 'Switch to Weathered Stone' : 'Switch to Golden Age Prime'}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-medium transition-all ${
              isReconstructed
                ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Golden Era</span>
          </button>

          <button
            onClick={() => setIsWireframe(!isWireframe)}
            title="Architectural X-Ray Wireframe"
            className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-medium transition-all ${
              isWireframe
                ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">X-Ray</span>
          </button>

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title="Turntable Auto Rotation"
            className={`p-1.5 rounded-xl text-xs transition-all ${
              autoRotate ? 'bg-amber-500/20 text-amber-300' : 'text-gray-400 hover:text-white'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }} />
          </button>
        </div>
      </div>
    </div>
  );
};
