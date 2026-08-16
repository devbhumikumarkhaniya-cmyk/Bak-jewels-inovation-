import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import bakLogoImg from '../assets/images/bak_jewels_logo_1786709287105.jpg';

interface IntroSplashProps {
  onComplete: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<number>(0);
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false);

  useEffect(() => {
    // Stage 1: Particles and glowing ring begin expanding (0ms)
    const t1 = setTimeout(() => setStage(1), 100);
    // Stage 2: Logo scales in with gold gleam reflection (600ms)
    const t2 = setTimeout(() => setStage(2), 600);
    // Stage 3: Brand text & tagline reveal (1400ms)
    const t3 = setTimeout(() => setStage(3), 1400);
    // Stage 4: Ready / auto transition countdown (3600ms)
    const t4 = setTimeout(() => {
      handleEnter();
    }, 4200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const handleEnter = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 700);
  };

  return (
    <div
      id="intro-splash"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070708] text-white transition-opacity duration-700 select-none overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
    >
      {/* Dynamic Background Rays & Ambient Golden Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,rgba(11,11,13,0.95)_70%,#050506_100%)] pointer-events-none" />
      
      {/* Shimmering Gold Dust Embers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#E5C07B]"
            style={{
              width: `${(i % 3) + 2}px`,
              height: `${(i % 3) + 2}px`,
              top: `${(i * 17) % 100}%`,
              left: `${(i * 23) % 100}%`,
              opacity: (i % 5 + 3) / 10,
              boxShadow: '0 0 8px #D4AF37',
              animation: `floatParticle ${4 + (i % 4)}s ease-in-out infinite alternate`,
              animationDelay: `${(i % 5) * 0.4}s`,
            }}
          />
        ))}
      </div>

      {/* Rotating Background Light Geometry */}
      <div
        className={`absolute w-[420px] sm:w-[580px] h-[420px] sm:h-[580px] rounded-full border border-[#D4AF37]/20 transition-all duration-1000 ${
          stage >= 1 ? 'scale-100 opacity-60' : 'scale-50 opacity-0'
        }`}
        style={{
          boxShadow: '0 0 60px rgba(212, 175, 55, 0.1)',
          animation: 'spinSlow 28s linear infinite',
        }}
      />
      <div
        className={`absolute w-[360px] sm:w-[500px] h-[360px] sm:h-[500px] rounded-full border border-[#D4AF37]/30 border-dashed transition-all duration-1000 ${
          stage >= 1 ? 'scale-100 opacity-40' : 'scale-75 opacity-0'
        }`}
        style={{
          animation: 'spinReverse 22s linear infinite',
        }}
      />

      {/* Main Logo Container with Cinematic Reveal */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-lg">
        
        {/* Glow behind the emblem */}
        <div
          className={`absolute -top-10 w-64 h-64 rounded-full bg-[#D4AF37]/25 blur-3xl transition-opacity duration-1000 pointer-events-none ${
            stage >= 2 ? 'opacity-100 scale-110' : 'opacity-0 scale-50'
          }`}
        />

        {/* The Authentic BAK Jewels Circular Logo Emblem */}
        <div
          className={`relative w-40 h-40 sm:w-52 sm:h-52 rounded-full p-1.5 transition-all duration-1000 transform ${
            stage >= 2
              ? 'scale-100 opacity-100 translate-y-0'
              : 'scale-75 opacity-0 translate-y-6'
          }`}
        >
          {/* Animated Gold Ring Halo */}
          <div
            className="absolute inset-0 rounded-full border-2 border-[#D4AF37] opacity-80"
            style={{
              boxShadow: '0 0 25px rgba(212, 175, 55, 0.6), inset 0 0 15px rgba(212, 175, 55, 0.4)',
              animation: 'pulseGlow 3s ease-in-out infinite alternate',
            }}
          />

          {/* Inner Logo Image */}
          <div className="w-full h-full rounded-full overflow-hidden bg-black shadow-2xl relative border border-[#D4AF37]/50">
            <img
              src={bakLogoImg}
              alt="BAK Jewels Luxury Fine Jewellery Logo"
              className="w-full h-full object-cover object-center"
            />
            {/* Shimmer Light Reflection Sweep */}
            <div
              className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/35 to-transparent transition-transform duration-1000 ${
                stage >= 2 ? 'translate-x-full translate-y-full' : '-translate-x-full -translate-y-full'
              }`}
              style={{
                transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                transitionDelay: '0.8s',
              }}
            />
          </div>

          {/* Top Crown Sparkle */}
          <div
            className={`absolute -top-3 left-1/2 -translate-x-1/2 transition-all duration-700 ${
              stage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`}
          >
            <Sparkles className="w-6 h-6 text-[#FFF1C2] drop-shadow-[0_0_8px_#D4AF37] animate-pulse" />
          </div>
        </div>

        {/* Brand Name with Gold Shimmer */}
        <div
          className={`mt-6 space-y-2 transition-all duration-1000 transform ${
            stage >= 3
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <h1 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[0.25em] text-transparent bg-clip-text bg-gradient-to-r from-[#F9E8B2] via-[#D4AF37] to-[#F3D78A] drop-shadow-[0_2px_12px_rgba(212,175,55,0.4)] uppercase">
              BAK JEWELS
            </h1>
            <div className="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>

          <p className="text-[11px] sm:text-xs font-sans tracking-[0.4em] uppercase text-[#E5C07B]/90 font-medium">
            Imperial Haute Joaillerie • Since 1984
          </p>

          <p className="text-xs text-gray-400 font-light max-w-sm mx-auto pt-1 leading-relaxed">
            Where certified diamonds and timeless craftsmanship meet eternal legacy.
          </p>
        </div>

        {/* Enter Boutique Button / Action */}
        <div
          className={`mt-8 transition-all duration-700 transform ${
            stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button
            onClick={handleEnter}
            className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E5C07B] to-[#C5A059] text-[#0A0A0B] font-bold text-xs uppercase tracking-[0.25em] shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <span>Enter Boutique</span>
            <ArrowRight className="w-4 h-4 text-[#0A0A0B] transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>

      {/* Skip Button Top Right */}
      <button
        onClick={handleEnter}
        className="absolute top-6 right-6 z-20 text-[11px] uppercase tracking-widest text-gray-400 hover:text-[#D4AF37] px-3 py-1.5 rounded-full border border-gray-800 hover:border-[#D4AF37]/50 transition-colors cursor-pointer"
      >
        Skip Intro ✕
      </button>

      {/* Bottom Status Ticker */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-10">
        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-light">
          Official Vault Access • 100% Certified Conflict-Free
        </span>
      </div>

    </div>
  );
};
