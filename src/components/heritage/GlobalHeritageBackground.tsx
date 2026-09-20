import React, { useEffect, useState } from 'react';

const HERITAGE_BACKDROP_IMAGES = [
  { src: '/images/vaisakhi-procession.jpg', alt: 'Vaisakhi procession in Punjab' },
  { src: '/images/amber-fort.png', alt: 'Amber Fort in Rajasthan' },
  { src: '/images/dhol_tasha.jpg', alt: 'Traditional dhol tasha musicians' },
  { src: '/images/warli.png', alt: 'Warli folk art from India' },
  { src: '/images/gobindgarh.jpg', alt: 'Gobindgarh heritage fort' },
  { src: '/images/sukhna-lake.png', alt: 'Sukhna Lake beneath the Shivalik hills' },
];

export const GlobalHeritageBackground: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener('change', updateMotionPreference);
    return () => mediaQuery.removeEventListener('change', updateMotionPreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % HERITAGE_BACKDROP_IMAGES.length);
    }, 8500);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {HERITAGE_BACKDROP_IMAGES.map((image, index) => (
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1800ms] ${
            index === activeIndex ? 'opacity-45' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-[#080a10]/55" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.2),transparent_62%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#080a10]/65 via-transparent to-[#080a10]/82" />
    </div>
  );
};
