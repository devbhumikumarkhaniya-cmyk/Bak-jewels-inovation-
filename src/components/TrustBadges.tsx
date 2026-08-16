import React from 'react';
import { Gem, ShieldCheck, Truck, RefreshCw, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { TRUST_BADGES } from '../data/products';

export const TrustBadges: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Gem':
        return <Gem className="w-5 h-5 text-[#D4AF37] stroke-[1.8]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-[#D4AF37] stroke-[1.8]" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-[#D4AF37] stroke-[1.8]" />;
      case 'RefreshCw':
        return <RefreshCw className="w-5 h-5 text-[#D4AF37] stroke-[1.8]" />;
      default:
        return <Gem className="w-5 h-5 text-[#D4AF37]" />;
    }
  };

  return (
    <section id="trust" className="relative overflow-hidden bg-[#0A0A0E] border-b border-[#D4AF37]/25 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12 },
            },
          }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 items-center justify-between"
        >
          {TRUST_BADGES.map((badge) => (
            <motion.div
              key={badge.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
              }}
              whileHover={{ scale: 1.03, y: -2 }}
              className="flex items-center justify-center sm:justify-start gap-3.5 p-3 rounded-2xl bg-[#121218]/70 border border-gray-800/80 hover:border-[#D4AF37]/60 transition-all duration-300 shadow-md hover:shadow-[0_0_20px_rgba(212,175,55,0.18)] group cursor-default"
            >
              <div className="w-11 h-11 rounded-full bg-[#181824] border border-[#D4AF37]/35 flex items-center justify-center shrink-0 shadow-md group-hover:border-[#D4AF37] group-hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] group-hover:rotate-6 transition-all duration-300">
                {getIcon(badge.iconName)}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] sm:text-xs uppercase tracking-widest font-bold text-gray-200 group-hover:text-[#F5E5B8] transition-colors">
                  {badge.title}
                </span>
                <span className="text-[10px] sm:text-[11px] text-gray-400 font-light hidden sm:inline">
                  {badge.subtitle}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
