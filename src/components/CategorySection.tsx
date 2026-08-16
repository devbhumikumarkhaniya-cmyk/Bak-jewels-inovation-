import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, X } from 'lucide-react';
import { CATEGORIES } from '../data/products';

interface CategorySectionProps {
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <section id="categories" className="relative overflow-hidden bg-[#0C0C0E] py-16 sm:py-20 border-b border-[#D4AF37]/20">
      
      {/* Subtle background luxury glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-[#D4AF37]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        {/* Section Heading with Stagger Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7 }}
          className="space-y-2 max-w-xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.3em] uppercase text-[#D4AF37]">
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>Curated High Jewelry Vaults</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-cinzel font-bold text-white tracking-tight">
            Shop by Category
          </h2>
          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-3" />
        </motion.div>

        {/* Circular Categories Grid with Motion */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08, delayChildren: 0.2 },
            },
          }}
          className="mt-12 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6 justify-items-center"
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;

            return (
              <motion.button
                key={cat.id}
                variants={{
                  hidden: { opacity: 0, scale: 0.85, y: 20 },
                  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
                }}
                whileHover={{ scale: 1.07, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelectCategory(cat.id)}
                className="flex flex-col items-center group cursor-pointer w-full focus:outline-none"
              >
                {/* Circular Image Container with Animated Gold Halo */}
                <div
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full p-1 transition-all duration-500 ${
                    isSelected
                      ? 'border-2 border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.6)] bg-[#1A1A24]'
                      : 'border border-gray-800 group-hover:border-[#D4AF37] group-hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] bg-[#141418]'
                  }`}
                >
                  {/* Rotating Gold Accent Ring on Hover */}
                  <div className="absolute inset-0 rounded-full border border-dashed border-[#D4AF37]/0 group-hover:border-[#D4AF37]/50 group-hover:animate-spin transition-all" style={{ animationDuration: '10s' }} />

                  <div className="w-full h-full rounded-full overflow-hidden bg-black flex items-center justify-center relative">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover object-center group-hover:scale-115 transition-transform duration-700 filter brightness-[1.02]"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Category Name */}
                <div className="mt-3 flex flex-col items-center">
                  <span
                    className={`text-[10px] sm:text-[11px] uppercase tracking-widest font-bold transition-all duration-300 ${
                      isSelected ? 'text-[#D4AF37] scale-105' : 'text-gray-300 group-hover:text-[#F5E5B8]'
                    }`}
                  >
                    {cat.name}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Category Active Filter Bar if selected */}
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-10 inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#181824] border border-[#D4AF37] text-xs text-gray-200 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
          >
            <span>Filtering vault: <strong className="font-semibold capitalize text-[#F5E5B8]">{selectedCategory}</strong></span>
            <button
              onClick={() => onSelectCategory('')}
              className="p-1 rounded-full hover:bg-gray-800 text-[#D4AF37] hover:text-white transition-colors cursor-pointer"
              title="Clear Filter"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

      </div>
    </section>
  );
};
