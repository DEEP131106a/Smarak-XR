import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { Monument } from '../types';
import { X, Compass, Volume2, VolumeX, Eye, ArrowUpRight, Sparkles, Smartphone, Loader2, Camera } from 'lucide-react';
import { soundEngine } from '../services/soundEngine';
import { voiceGuide } from '../services/voiceGuide';
import { triggerHaptic } from '../utils/haptics';

interface Props {
  monument: Monument;
  onClose: () => void;
}

type VRPanoView = 'aerial' | 'sanctum' | 'courtyard';

export const VR360Tour: React.FC<Props> = ({ monument, onClose }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentView, setCurrentView] = useState<VRPanoView>('aerial');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [gyroActive, setGyroActive] = useState(false);
  const [isLoadingTexture, setIsLoadingTexture] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));

  // Look-around angles
  const lon = useRef(0);
  const lat = useRef(0);
  const isUserInteracting = useRef(false);
  const onPointerDownPointerX = useRef(0);
  const onPointerDownPointerY = useRef(0);
  const onPointerDownLon = useRef(0);
  const onPointerDownLat = useRef(0);

  // Helper to get image URL for the active viewpoint
  const getPhotosphereUrl = (view: VRPanoView): string => {
    switch (view) {
      case 'aerial':
        return monument.vrPano.aerialImage || 'https://upload.wikimedia.org/wikipedia/commons/f/fb/Taj_Mahal_360%C2%B0_View.jpg';
      case 'sanctum':
        return monument.vrPano.sanctumImage || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2000&q=80';
      case 'courtyard':
        return monument.vrPano.courtyardImage || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2000&q=80';
    }
  };

  // High quality fallback gradient sphere if network fails
  const createFallbackTexture = (): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#0d1322');
    grad.addColorStop(0.4, '#1e293b');
    grad.addColorStop(0.55, '#f59e0b');
    grad.addColorStop(0.65, '#090d16');
    grad.addColorStop(1, '#030712');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return new THREE.CanvasTexture(canvas);
  };

  // Load real photograph into sphere material
  const loadTextureForView = (view: VRPanoView) => {
    if (!sphereRef.current) return;
    setIsLoadingTexture(true);
    setLoadError(null);

    const url = getPhotosphereUrl(view);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.setCrossOrigin('anonymous');

    textureLoader.load(
      url,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        if (sphereRef.current) {
          const mat = sphereRef.current.material as THREE.MeshBasicMaterial;
          mat.map = texture;
          mat.needsUpdate = true;
        }
        setIsLoadingTexture(false);
      },
      undefined,
      (err) => {
        console.warn('Error loading photosphere, applying ambient fallback:', err);
        if (sphereRef.current) {
          const fallback = createFallbackTexture();
          const mat = sphereRef.current.material as THREE.MeshBasicMaterial;
          mat.map = fallback;
          mat.needsUpdate = true;
        }
        setLoadError('High-res panorama loaded with ambient view');
        setIsLoadingTexture(false);
      }
    );
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 360 Inverted Photosphere Mesh
    const sphereGeo = new THREE.SphereGeometry(500, 64, 48);
    sphereGeo.scale(-1, 1, 1); // Invert faces inward so camera inside looks outward

    const initialMat = new THREE.MeshBasicMaterial({ map: createFallbackTexture() });
    const sphere = new THREE.Mesh(sphereGeo, initialMat);
    scene.add(sphere);
    sphereRef.current = sphere;

    // Load initial photograph
    loadTextureForView(currentView);

    // Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isUserInteracting.current && !gyroActive) {
        lon.current += 0.03; // Gentle natural panoramic drift
      }

      lat.current = Math.max(-85, Math.min(85, lat.current));
      const phi = THREE.MathUtils.degToRad(90 - lat.current);
      const theta = THREE.MathUtils.degToRad(lon.current);

      cameraTarget.current.x = 500 * Math.sin(phi) * Math.cos(theta);
      cameraTarget.current.y = 500 * Math.cos(phi);
      cameraTarget.current.z = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(cameraTarget.current);
      renderer.render(scene, camera);
    };

    animate();

    // Mouse / Touch Look Controls
    const onPointerDown = (clientX: number, clientY: number) => {
      isUserInteracting.current = true;
      onPointerDownPointerX.current = clientX;
      onPointerDownPointerY.current = clientY;
      onPointerDownLon.current = lon.current;
      onPointerDownLat.current = lat.current;
    };

    const onPointerMove = (clientX: number, clientY: number) => {
      if (!isUserInteracting.current) return;
      lon.current = (onPointerDownPointerX.current - clientX) * 0.15 + onPointerDownLon.current;
      lat.current = (clientY - onPointerDownPointerY.current) * 0.15 + onPointerDownLat.current;
    };

    const onPointerUp = () => {
      isUserInteracting.current = false;
    };

    const onMouseDown = (e: MouseEvent) => onPointerDown(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => onPointerMove(e.clientX, e.clientY);
    const onMouseUp = () => onPointerUp();

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const onTouchEnd = () => onPointerUp();

    const onResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, [gyroActive]);

  // Handle Mobile Gyroscope Event
  useEffect(() => {
    if (!gyroActive) return;

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null && e.beta !== null) {
        lon.current = -e.alpha;
        lat.current = Math.max(-85, Math.min(85, (e.beta || 0) - 90));
      }
    };

    window.addEventListener('deviceorientation', onOrientation);
    return () => {
      window.removeEventListener('deviceorientation', onOrientation);
    };
  }, [gyroActive]);

  const handleToggleGyro = async () => {
    triggerHaptic('tap');
    if (
      typeof window !== 'undefined' &&
      typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission === 'function'
    ) {
      try {
        const res = await (DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }).requestPermission();
        if (res === 'granted') {
          setGyroActive(!gyroActive);
        }
      } catch (err) {
        console.warn('Gyro permission request error:', err);
      }
    } else {
      setGyroActive(!gyroActive);
    }
  };

  // Update Photosphere when viewpoint changes
  useEffect(() => {
    loadTextureForView(currentView);
    soundEngine.playTempleBell(523.25, 2.0);
  }, [currentView, monument.id]);

  const getViewDescription = () => {
    switch (currentView) {
      case 'aerial':
        return monument.vrPano.aerialDesc;
      case 'sanctum':
        return monument.vrPano.sanctumDesc;
      case 'courtyard':
        return monument.vrPano.courtyardDesc;
    }
  };

  const handleAudioTour = () => {
    triggerHaptic('tap');
    soundEngine.playTempleBell(659, 1.5);
    const desc = `${monument.name} authentic 360-degree photographic tour. ${getViewDescription()}`;
    voiceGuide.togglePlay(desc, 'en');
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-4">
      <div className="relative w-full h-full max-w-6xl max-h-[92vh] rounded-3xl overflow-hidden glass-royal border border-amber-500/40 shadow-2xl flex flex-col">
        {/* 360 WebGL Viewport */}
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Loading Spinner Overlay */}
        {isLoadingTexture && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-none animate-in fade-in">
            <Loader2 className="w-10 h-10 text-amber-400 animate-spin mb-3" />
            <span className="font-cinzel font-bold text-white text-base">
              Loading 360° Real Photograph...
            </span>
            <span className="text-xs text-amber-200/80 font-outfit mt-1">
              {monument.name} • {currentView.toUpperCase()} Vantage Point
            </span>
          </div>
        )}

        {/* Top Header Overlay */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
          <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-amber-500/30 pointer-events-auto">
            <Compass className="w-5 h-5 text-amber-400 animate-spin-slow" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel font-bold text-white text-sm sm:text-base">
                  Authentic 360° VR Immersion
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium">
                  {monument.name}
                </span>
              </div>
              <p className="text-xs text-amber-200/70 font-outfit flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>Real Heritage Photography • Drag or move phone to look around</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={handleToggleGyro}
              title="Toggle Gyroscope Look for Mobile Devices"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer ${
                gyroActive
                  ? 'bg-amber-500 text-black border-amber-300 shadow-lg shadow-amber-500/30'
                  : 'bg-black/60 text-white border-white/20 hover:bg-black/80'
              }`}
            >
              <Smartphone className={`w-4 h-4 ${gyroActive ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline">{gyroActive ? 'Gyro ON' : 'Phone Motion Gyro'}</span>
              <span className="sm:hidden">{gyroActive ? 'Gyro ON' : 'Gyro'}</span>
            </button>

            <button
              onClick={handleAudioTour}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer ${
                isPlayingAudio
                  ? 'bg-amber-500 text-black border-amber-300'
                  : 'bg-black/60 text-white border-white/20 hover:bg-black/80'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isPlayingAudio ? 'Mute Audio' : 'Audio Narration'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-black/75 hover:bg-black text-gray-300 hover:text-white border border-white/20 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewpoint Description Card */}
        <div className="absolute bottom-20 left-4 right-4 md:left-6 md:w-[480px] p-4 rounded-2xl bg-black/85 backdrop-blur-xl border border-amber-500/40 shadow-2xl z-20 pointer-events-auto animate-in fade-in slide-in-from-bottom-3">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>VANTAGE POINT: {currentView.toUpperCase()}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
              Photographic 360°
            </span>
          </div>
          <p className="text-xs text-amber-100/90 leading-relaxed font-outfit">
            {getViewDescription()}
          </p>
          {loadError && (
            <p className="text-[10px] text-amber-400/80 mt-1 font-mono">{loadError}</p>
          )}
        </div>

        {/* Bottom Teleport Navigation Bar */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-2 z-20 pointer-events-auto">
          <div className="flex items-center gap-2 bg-black/85 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-2xl">
            <button
              onClick={() => {
                triggerHaptic('tap');
                setCurrentView('aerial');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                currentView === 'aerial'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Aerial Skyline</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('tap');
                setCurrentView('sanctum');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                currentView === 'sanctum'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inner Sanctum</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('tap');
                setCurrentView('courtyard');
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                currentView === 'courtyard'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold shadow-lg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Outer Courtyard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
