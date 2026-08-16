import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { SpeedImageScroll } from './SpeedImageScroll';
import { LuxuryParticles } from './LuxuryParticles';

interface HeroSectionProps {
  onExploreClick: () => void;
  onOrderPiece?: (visualId?: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onOrderPiece,
}) => {
  return (
    <section id="hero" className="relative overflow-hidden bg-[#08080B] text-[#F3F4F6] min-h-[580px] lg:min-h-[660px] flex flex-col justify-center border-b border-[#D4AF37]/30 py-10 sm:py-14">
      
      {/* Luxury Golden Dust Floating Particle Simulation */}
      <LuxuryParticles density={35} speed={0.4} />

      {/* Dynamic Ambient Background Lighting */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none" />

      {/* Golden Glow Spheres */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#D4AF37]/20 via-[#997929]/10 to-transparent blur-[120px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Clean, High-Impact Top Header with Breathing Room */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-8">
          
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#13131A] border border-[#D4AF37]/45 text-[#F5E5B8] text-[10px] sm:text-xs tracking-[0.25em] uppercase font-semibold shadow-[0_0_15px_rgba(212,175,55,0.15)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
            <span>Imperial Haute Joaillerie</span>
          </motion.div>

          {/* Minimalist Headline with Elegant Script Accent */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-cinzel font-bold tracking-tight text-white leading-tight"
          >
            Elegance That Lasts{' '}
            <span className="font-script text-5xl sm:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-[#FFF2CC] via-[#D4AF37] to-[#E5C07B] inline-block font-normal drop-shadow-[0_4px_16px_rgba(212,175,55,0.3)]">
              Forever
            </span>
          </motion.h1>

          {/* Brief, Airy Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-gray-300 font-sans text-xs sm:text-sm max-w-lg mx-auto font-light leading-relaxed"
          >
            Fine handcrafted certified diamond jewellery, butterfly heirlooms & custom 18K solid gold creations.
          </motion.p>

          {/* Clean Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex items-center justify-center pt-2"
          >
            <button
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] text-[#0A0A0C] font-sans font-bold text-xs tracking-[0.18em] uppercase shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:shadow-[0_0_35px_rgba(212,175,55,0.55)] hover:scale-105 transition-all cursor-pointer"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </motion.div>

        </div>

        {/* Speed Image Scroll Stream Component */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full"
        >
          <SpeedImageScroll
            onOrderDirect={(visual) => {
              if (onOrderPiece) onOrderPiece(visual.id);
            }}
          />
        </motion.div>

      </div>
    </section>
  );
};
