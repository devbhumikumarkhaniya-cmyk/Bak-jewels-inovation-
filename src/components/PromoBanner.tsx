import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import bakLogoImg from '../assets/images/bak_jewels_logo_1786709287105.jpg';

interface PromoBannerProps {
  onDiscoverClick: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  onDiscoverClick,
}) => {
  return (
    <section id="promo" className="py-14 sm:py-20 bg-[#0C0C0E] relative overflow-hidden">
      
      {/* Background golden glow */}
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[400px] bg-[#D4AF37]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner Box with Deep Obsidian & Gold Halo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#111116] via-[#161622] to-[#0D0D12] border border-[#D4AF37]/40 shadow-[0_0_40px_rgba(212,175,55,0.2)]"
        >
          
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center min-h-[380px] sm:min-h-[420px]">
            
            {/* Left Content */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 z-10 flex flex-col justify-center text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1C28] border border-[#D4AF37]/45 text-[#F5E5B8] text-[9px] sm:text-[10px] tracking-[0.28em] uppercase font-semibold w-fit mb-4 shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
                <span>The Bridal & Heirloom Vault</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-cinzel font-bold text-white tracking-tight leading-tight"
              >
                Crafted for <br />
                <span className="font-script text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-[#FFF2CC] via-[#D4AF37] to-[#E5C07B] italic">
                  Life's Rarest Moments
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-gray-300 font-sans text-xs sm:text-sm max-w-md leading-relaxed mt-4"
              >
                Exquisite bridal sets and rare diamond solitaire creations handcrafted to tell your unique love story for generations to come.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="mt-6 flex items-center gap-4"
              >
                <button
                  onClick={onDiscoverClick}
                  className="inline-flex items-center gap-2.5 text-xs font-bold text-[#0C0C0E] bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] px-8 py-3.5 rounded-full uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.35)] cursor-pointer group"
                >
                  <span>Explore Series</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            </div>

            {/* Right Large Image with Zoom & Badge */}
            <div className="lg:col-span-6 relative h-64 sm:h-80 lg:h-full min-h-[320px] lg:min-h-[420px] overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=1200"
                alt="Bridal Fine Jewellery Masterpiece"
                className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-700 opacity-90 filter brightness-[1.02]"
                loading="lazy"
              />
              {/* Dark gradient blend on left side */}
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#111116] via-[#111116]/40 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 right-6 flex items-center gap-3 bg-black/75 backdrop-blur-md px-4 py-2 rounded-full border border-[#D4AF37]/40 shadow-xl">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-[#D4AF37]">
                  <img src={bakLogoImg} alt="BAK" className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[#F5E5B8] font-semibold">Bridal Collection</span>
              </div>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
};
