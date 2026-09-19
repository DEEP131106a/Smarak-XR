import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { SACRED_CREATURES } from '../data/creatures';
import type { SacredCreature } from '../types';
import { ProceduralModelBuilder } from '../utils/proceduralModels';
import {
  Sparkles,
  Shield,
  Eye,
  Camera,
  Award,
  Volume2,
  VolumeX,
  Compass,
} from 'lucide-react';

import { soundEngine } from '../services/soundEngine';
import { voiceGuide } from '../services/voiceGuide';
import { triggerHaptic } from '../utils/haptics';


interface Props {
  onOpenARWithCreature: (creature: SacredCreature) => void;
  onClaimBadge: (badgeTitle: string) => void;
}

export const CreatureLoreSection: React.FC<Props> = ({ onOpenARWithCreature, onClaimBadge }) => {
  const [selectedCreature, setSelectedCreature] = useState<SacredCreature>(SACRED_CREATURES[0]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const mountRef = useRef<HTMLDivElement>(null);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const creatureGroupRef = useRef<THREE.Group | null>(null);

  // Initialize creature 3D preview
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2.0, 5.0);
    camera.lookAt(0, 1.2, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambLight = new THREE.AmbientLight(0xffeedd, 1.2);
    const dirLight = new THREE.DirectionalLight(0xfffbeb, 2.0);
    dirLight.position.set(4, 6, 4);
    const goldPoint = new THREE.PointLight(0xf59e0b, 1.2, 10);
    goldPoint.position.set(0, 2, 0);

    scene.add(ambLight);
    scene.add(dirLight);
    scene.add(goldPoint);

    // Glowing podium ring
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1.4, 1.55, 32),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.05;
    scene.add(ring);

    loadCreatureModel(selectedCreature);

    let animId: number;
    let clock = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      clock += 0.01;

      if (creatureGroupRef.current) {
        creatureGroupRef.current.rotation.y = clock * 0.8;
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
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  const loadCreatureModel = (creature: SacredCreature) => {
    if (!sceneRef.current) return;
    if (creatureGroupRef.current) {
      sceneRef.current.remove(creatureGroupRef.current);
    }
    const model = ProceduralModelBuilder.buildCreature(creature.id, {
      reconstructionMode: true,
    });
    creatureGroupRef.current = model;
    sceneRef.current.add(model);
  };

  const handleSelectCreature = (c: SacredCreature) => {
    triggerHaptic('tap');
    soundEngine.playTempleBell(587.33, 2.0);
    setSelectedCreature(c);
    loadCreatureModel(c);
    voiceGuide.stop();
    setIsSpeaking(false);
  };

  const handleToggleVoice = () => {
    triggerHaptic('tap');
    soundEngine.playTempleBell(659.25, 2.0);
    const text = `${selectedCreature.name}, ${selectedCreature.title}. ${selectedCreature.mythology}`;
    voiceGuide.togglePlay(text, 'en');
    setIsSpeaking(!isSpeaking);
  };


  return (
    <section className="relative w-full py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Title */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Smarak Vahanas & Temple Bestiary</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-cinzel font-black tracking-tight text-white mb-4">
          Sacred Creatures Carved in Stone
        </h2>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-amber-100/70 font-outfit">
          Discover the mythological beasts, divine vahanas, and celestial chimeras guarding India’s temples and palaces.
        </p>
      </div>

      {/* Creature Tab Selector */}
      <div className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
        {SACRED_CREATURES.map((c) => {
          const isSelected = selectedCreature.id === c.id;
          return (
            <button
              key={c.id}
              onClick={() => handleSelectCreature(c)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all transform cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black shadow-xl shadow-amber-500/30 scale-105'
                  : 'glass-royal text-gray-300 hover:text-white hover:border-amber-500/50'
              }`}
            >
              <span>{c.name}</span>
              <span className="text-[11px] opacity-75 font-yatra">({c.sanskritName.split('/')[0].trim()})</span>
            </button>
          );
        })}
      </div>

      {/* Main Feature Grid: 3D Turntable + Mythic Lore Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: 3D Turntable Preview */}
        <div className="lg:col-span-6 relative h-[420px] sm:h-[480px] rounded-3xl glass-royal border border-amber-500/30 shadow-2xl overflow-hidden flex items-center justify-center">
          <div ref={mountRef} className="w-full h-full" />

          {/* Overlay Badge */}
          <div className="absolute top-4 left-4 p-3 rounded-2xl bg-black/70 backdrop-blur-md border border-amber-500/30">
            <h4 className="font-cinzel font-bold text-white text-base">{selectedCreature.name}</h4>
            <p className="font-yatra text-xs text-amber-400">{selectedCreature.sanskritName}</p>
          </div>

          {/* AR & Badge Actions */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                soundEngine.playTempleBell(523, 2.0);
                onOpenARWithCreature(selectedCreature);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs shadow-lg shadow-amber-500/25 transition-all transform hover:scale-105 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Spawn in AR</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('success');
                soundEngine.playTempleBell(880, 2.0);
                onClaimBadge(selectedCreature.badgeTitle);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-400/40 text-amber-300 font-semibold text-xs transition-all backdrop-blur-md cursor-pointer"
            >

              <Award className="w-4 h-4 text-amber-400" />
              <span>Collect Badge</span>
            </button>
          </div>
        </div>

        {/* Right: Mythic Lore & Architectural Facts */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="p-6 rounded-3xl glass-royal border border-amber-500/30 shadow-2xl">
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                {selectedCreature.title}
              </span>

              <button
                onClick={handleToggleVoice}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-amber-300 text-xs border border-white/10 transition-all cursor-pointer"
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isSpeaking ? 'Mute' : 'Listen Lore'}</span>
              </button>
            </div>

            <h3 className="text-2xl font-cinzel font-bold text-white mb-2">
              {selectedCreature.name} • {selectedCreature.sanskritName}
            </h3>

            <p className="text-sm text-amber-100/90 leading-relaxed font-outfit mb-5">
              {selectedCreature.mythology}
            </p>

            <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300">Spiritual Symbolism: </span>
                  <span className="text-amber-100/80 font-outfit">{selectedCreature.symbolism}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Eye className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-cyan-300">Chimeric Anatomy: </span>
                  <span className="text-amber-100/80 font-outfit">{selectedCreature.anatomy}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Compass className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-300">Primary Monuments: </span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedCreature.primaryMonuments.map((m) => (
                      <span
                        key={m}
                        className="px-2 py-0.5 rounded-md bg-white/10 text-amber-200 text-[11px] font-medium"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
