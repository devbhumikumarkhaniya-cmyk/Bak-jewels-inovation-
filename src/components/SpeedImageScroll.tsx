import React, { useState } from 'react';
import { Sparkles, Zap, ZoomIn, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import bakLogoImg from '../assets/images/bak_jewels_logo_1786709287105.jpg';

import pinkHeartBraceletImg from '../assets/images/pink_heart_bracelet_1786714017954.jpg';
import purpleButterflyBraceletImg from '../assets/images/purple_butterfly_bracelet_1786714029994.jpg';
import butterflyGoldRingImg from '../assets/images/butterfly_gold_ring_1786714041884.jpg';
import luxuryDiamondWatchImg from '../assets/images/luxury_diamond_watch_1786714055161.jpg';
import butterflyCuffBangleImg from '../assets/images/butterfly_cuff_bangle_1786714069258.jpg';
import butterflyDropEarringsImg from '../assets/images/butterfly_drop_earrings_1786714087867.jpg';

export interface VisualItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  tag?: string;
  carat?: string;
  price?: number;
}

export const DEFAULT_VISUAL_REEL: VisualItem[] = [
  {
    id: 'bak-bf-01',
    title: 'Blush Blossom & Heart Charm Bracelet',
    category: 'Charm Bracelet',
    tag: '18K Rose Gold',
    carat: 'Pink Sapphire & Diamond',
    price: 490,
    imageUrl: pinkHeartBraceletImg,
  },
  {
    id: 'bak-bf-02',
    title: 'Lavender Butterfly Silver Charm Bracelet',
    category: 'Butterfly Charm',
    tag: 'Velvet Box Vault',
    carat: 'Enamel & Micro-Pavé',
    price: 420,
    imageUrl: purpleButterflyBraceletImg,
  },
  {
    id: 'bak-bf-03',
    title: 'Enchanted Butterfly Dual-Wing Bypass Ring',
    category: 'Gold Bypass Ring',
    tag: '18K Yellow Gold',
    carat: 'Hand Enamel Wings',
    price: 580,
    imageUrl: butterflyGoldRingImg,
  },
  {
    id: 'bak-bf-04',
    title: 'Starlight Ombré Watch & Diamond Bracelet',
    category: 'Timepiece & Bracelet',
    tag: 'Marquise Diamonds',
    carat: '2.80 ct Marquise',
    price: 1850,
    imageUrl: luxuryDiamondWatchImg,
  },
  {
    id: 'bak-bf-05',
    title: 'Ethereal Crystal Butterfly Open Cuff Bangle',
    category: 'Open Cuff Bangle',
    tag: 'White Gold Wire',
    carat: 'Pear & Baguette Crystals',
    price: 790,
    imageUrl: butterflyCuffBangleImg,
  },
  {
    id: 'bak-bf-06',
    title: 'Cascading Butterfly Symphony Drop Earrings',
    category: 'Chandelier Drops',
    tag: 'Triple-Tier Wings',
    carat: 'Dangling Diamond Chains',
    price: 640,
    imageUrl: butterflyDropEarringsImg,
  },
];

export const SECONDARY_REEL: VisualItem[] = [
  {
    id: 'bak-bf-07',
    title: 'Crown Solitaire Diamond Engagement Ring',
    category: 'Solitaire Ring',
    tag: 'GIA D-Flawless',
    carat: '1.20 ct Diamond',
    price: 2450,
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=900',
  },
  {
    id: 'bak-bf-08',
    title: 'Imperial Emerald & Diamond Cascade Pendant',
    category: 'Emerald Pendant',
    tag: 'Zambian Emerald',
    carat: '1.20 ct Emerald',
    price: 1480,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=900',
  },
  {
    id: 'bak-bf-01-sec',
    title: 'Blush Blossom & Heart Charm Bracelet',
    category: 'Rose Gold Charm',
    tag: 'Romantic Collection',
    carat: 'Pink Crystals',
    price: 490,
    imageUrl: pinkHeartBraceletImg,
  },
  {
    id: 'bak-bf-03-sec',
    title: 'Enchanted Butterfly Dual-Wing Ring',
    category: 'Butterfly Ring',
    tag: '18K Hallmarked',
    carat: 'Twin Enamel',
    price: 580,
    imageUrl: butterflyGoldRingImg,
  },
  {
    id: 'bak-bf-05-sec',
    title: 'Ethereal Crystal Butterfly Open Cuff',
    category: 'Open Cuff Bangle',
    tag: 'Bypass Cuff',
    carat: 'Fancy Baguette Cut',
    price: 790,
    imageUrl: butterflyCuffBangleImg,
  },
  {
    id: 'bak-bf-06-sec',
    title: 'Cascading Butterfly Drop Earrings',
    category: 'Drop Earrings',
    tag: 'Shoulder Duster',
    carat: 'Triple Floating Tier',
    price: 640,
    imageUrl: butterflyDropEarringsImg,
  },
];

interface SpeedImageScrollProps {
  compact?: boolean;
  onSelectVisual?: (visual: VisualItem) => void;
  onOrderDirect?: (visual: VisualItem) => void;
}

export const SpeedImageScroll: React.FC<SpeedImageScrollProps> = ({
  compact = false,
  onSelectVisual,
  onOrderDirect,
}) => {
  const [isHoverPaused, setIsHoverPaused] = useState<boolean>(false);
  const [inspectModalVisual, setInspectModalVisual] = useState<VisualItem | null>(null);

  const durationSeconds = 18;
  const secondaryDurationSeconds = 22;

  const handleVisualClick = (visual: VisualItem) => {
    setInspectModalVisual(visual);
    if (onSelectVisual) {
      onSelectVisual(visual);
    }
  };

  return (
    <div
      id="speed-image-scroll"
      className={`relative w-full rounded-3xl overflow-hidden bg-gradient-to-b from-[#111116] via-[#0E0E12] to-[#08080B] border border-[#D4AF37]/35 shadow-2xl p-4 sm:p-5 ${
        compact ? 'my-2' : 'my-4'
      }`}
    >
      {/* Golden Aura Glow Background */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-[#D4AF37]/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-[#D4AF37]/8 blur-[100px] pointer-events-none" />

      {/* Clean Minimalist Header (Without speed/pause/add customization buttons) */}
      <div className="flex items-center justify-between mb-3.5 pb-3 border-b border-gray-800/80 relative z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="text-xs sm:text-sm font-cinzel font-bold text-white tracking-wider">
            High Jewelry Showcase
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-sans tracking-wider uppercase">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          <span>Hover to Pause • Click to Order</span>
        </div>
      </div>

      {/* Speed Image Reel: Track 1 (Scrolls Left) */}
      <div
        className="relative overflow-hidden py-1"
        onMouseEnter={() => setIsHoverPaused(true)}
        onMouseLeave={() => setIsHoverPaused(false)}
      >
        <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-16 bg-gradient-to-r from-[#111116] via-[#111116]/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-16 bg-gradient-to-l from-[#111116] via-[#111116]/80 to-transparent z-10 pointer-events-none" />

        <div
          className={`flex gap-3 sm:gap-4 w-max ${!isHoverPaused ? 'animate-scroll-left' : 'pause-animation'}`}
          style={{ '--scroll-duration': `${durationSeconds}s` } as React.CSSProperties}
        >
          {[...DEFAULT_VISUAL_REEL, ...DEFAULT_VISUAL_REEL].map((visual, idx) => (
            <div
              key={`${visual.id}-${idx}`}
              onClick={() => handleVisualClick(visual)}
              className="relative w-44 sm:w-56 h-56 sm:h-64 rounded-2xl overflow-hidden bg-[#15151E] border border-gray-800/80 hover:border-[#D4AF37] group cursor-pointer shrink-0 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(212,175,55,0.35)] flex flex-col justify-between"
            >
              {/* Image */}
              <div className="w-full h-full absolute inset-0 bg-black">
                <img
                  src={visual.imageUrl}
                  alt={visual.title}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 filter brightness-[1.02]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
              </div>

              {/* Top Badges */}
              <div className="relative z-10 p-2.5 flex items-center justify-between">
                <span className="text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm border border-[#D4AF37]/40 text-[#F5E5B8]">
                  {visual.category}
                </span>
                {visual.tag && (
                  <span className="text-[8px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-md bg-[#D4AF37]/90 text-black shadow-sm">
                    {visual.tag}
                  </span>
                )}
              </div>

              {/* Hover Prompt Badge */}
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <span className="px-3 py-1.5 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5" />
                  Inspect / Order
                </span>
              </div>

              {/* Bottom Details */}
              <div className="relative z-10 p-2.5 sm:p-3 text-left">
                <p className="text-xs sm:text-sm font-cinzel font-medium text-white group-hover:text-[#F5E5B8] transition-colors line-clamp-1">
                  {visual.title}
                </p>
                {visual.carat && (
                  <p className="text-[10px] font-sans text-gray-300 mt-0.5">
                    Spec: <strong className="text-[#D4AF37]">{visual.carat}</strong>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Speed Image Reel: Track 2 (Scrolls Right) */}
      {!compact && (
        <div
          className="relative overflow-hidden py-1 mt-2"
          onMouseEnter={() => setIsHoverPaused(true)}
          onMouseLeave={() => setIsHoverPaused(false)}
        >
          <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-16 bg-gradient-to-r from-[#111116] via-[#111116]/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-16 bg-gradient-to-l from-[#111116] via-[#111116]/80 to-transparent z-10 pointer-events-none" />

          <div
            className={`flex gap-3 sm:gap-4 w-max ${!isHoverPaused ? 'animate-scroll-right' : 'pause-animation'}`}
            style={{ '--scroll-duration': `${secondaryDurationSeconds}s` } as React.CSSProperties}
          >
            {[...SECONDARY_REEL, ...SECONDARY_REEL].map((visual, idx) => (
              <div
                key={`track2-${visual.id}-${idx}`}
                onClick={() => handleVisualClick(visual)}
                className="relative w-40 sm:w-52 h-48 sm:h-56 rounded-2xl overflow-hidden bg-[#15151E] border border-gray-800/80 hover:border-[#D4AF37] group cursor-pointer shrink-0 transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_0_25px_rgba(212,175,55,0.35)] flex flex-col justify-between"
              >
                <div className="w-full h-full absolute inset-0 bg-black">
                  <img
                    src={visual.imageUrl}
                    alt={visual.title}
                    className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 filter brightness-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                </div>

                <div className="relative z-10 p-2 flex items-center justify-between">
                  <span className="text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm border border-[#D4AF37]/40 text-[#F5E5B8]">
                    {visual.category}
                  </span>
                  {visual.tag && (
                    <span className="text-[8px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-md bg-[#1C1C28] text-gray-300 border border-gray-700">
                      {visual.tag}
                    </span>
                  )}
                </div>

                <div className="relative z-10 p-2.5 text-left">
                  <p className="text-xs font-cinzel font-medium text-white group-hover:text-[#F5E5B8] transition-colors line-clamp-1">
                    {visual.title}
                  </p>
                  {visual.carat && (
                    <p className="text-[9px] font-sans text-gray-300 mt-0.5">
                      Spec: <strong className="text-[#D4AF37]">{visual.carat}</strong>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: 4K HIGH-DEF INSPECTOR & ORDER ACTION */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {inspectModalVisual && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="relative w-full max-w-xl rounded-3xl bg-[#111116] border border-[#D4AF37]/60 shadow-[0_0_60px_rgba(212,175,55,0.4)] overflow-hidden text-left text-white flex flex-col"
            >
              <button
                onClick={() => setInspectModalVisual(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 hover:bg-black text-gray-300 hover:text-white border border-[#D4AF37]/40 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="relative w-full h-72 sm:h-80 bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={inspectModalVisual.imageUrl}
                  alt={inspectModalVisual.title}
                  className="w-full h-full object-contain filter brightness-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-[#D4AF37] bg-black">
                    <img src={bakLogoImg} alt="BAK" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[9px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-[#D4AF37]/50 text-[#F5E5B8]">
                    {inspectModalVisual.category}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-gray-800 pb-3">
                  <div>
                    <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white">
                      {inspectModalVisual.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-sans mt-0.5">
                      100% Conflict-Free Diamond & Solid Gold Vault
                    </p>
                  </div>
                  {inspectModalVisual.carat && (
                    <div className="text-right shrink-0">
                      <span className="text-[9px] text-gray-400 uppercase tracking-widest block">Spec</span>
                      <span className="font-cinzel text-xs sm:text-sm font-bold text-[#F5E5B8]">
                        {inspectModalVisual.carat}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <button
                    onClick={() => {
                      const item = inspectModalVisual;
                      setInspectModalVisual(null);
                      if (onOrderDirect) {
                        onOrderDirect(item);
                      }
                    }}
                    className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] text-black font-sans font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.35)] cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Zap className="w-3.5 h-3.5 fill-black text-black" />
                    <span>Order This Piece Now</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
