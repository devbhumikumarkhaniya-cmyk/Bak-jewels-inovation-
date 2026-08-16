import React, { useState } from 'react';
import { X, Sparkles, Ruler, CircleDot, Info, Check, Smartphone, Tablet, Laptop, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'rings' | 'bangles' | 'bracelets' | 'necklaces';
  defaultCategory?: 'rings' | 'bangles' | 'bracelets' | 'necklaces';
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'rings',
  defaultCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'rings' | 'bangles' | 'bracelets' | 'necklaces'>(
    defaultCategory || initialTab
  );
  const [selectedRingSize, setSelectedRingSize] = useState<number>(7);

  React.useEffect(() => {
    if (defaultCategory) {
      setActiveTab(defaultCategory);
    }
  }, [defaultCategory, isOpen]);

  if (!isOpen) return null;

  const ringSizes = [
    { us: 5, india: 10, uk: 'J 1/2', diameterMm: 15.7, circumMm: 49.3 },
    { us: 6, india: 12, uk: 'L 1/2', diameterMm: 16.5, circumMm: 51.9 },
    { us: 7, india: 14, uk: 'N 1/2', diameterMm: 17.3, circumMm: 54.4 },
    { us: 8, india: 16, uk: 'P 1/2', diameterMm: 18.1, circumMm: 57.0 },
    { us: 9, india: 18, uk: 'R 1/2', diameterMm: 19.0, circumMm: 59.5 },
    { us: 10, india: 20, uk: 'T 1/2', diameterMm: 19.8, circumMm: 62.1 },
    { us: 11, india: 22, uk: 'V 1/2', diameterMm: 20.6, circumMm: 64.6 },
    { us: 12, india: 24, uk: 'X 1/2', diameterMm: 21.4, circumMm: 67.2 },
  ];

  const bangleSizes = [
    { size: '2.2 (Small)', diameterInches: '2.125"', diameterMm: '54.0 mm', wristCircum: '6.5 - 6.8 inch' },
    { size: '2.4 (Medium-Small)', diameterInches: '2.250"', diameterMm: '57.2 mm', wristCircum: '6.9 - 7.2 inch' },
    { size: '2.6 (Standard / Popular)', diameterInches: '2.375"', diameterMm: '60.3 mm', wristCircum: '7.3 - 7.6 inch' },
    { size: '2.8 (Medium-Large)', diameterInches: '2.500"', diameterMm: '63.5 mm', wristCircum: '7.7 - 8.0 inch' },
    { size: '2.10 (Large)', diameterInches: '2.625"', diameterMm: '66.7 mm', wristCircum: '8.1 - 8.5 inch' },
  ];

  const braceletSizes = [
    { fit: 'Petite / Slim Wrist', lengthInch: '6.0 inch (15.2 cm)', idealFor: 'Wrist under 5.7 inch' },
    { fit: 'Small Wrist', lengthInch: '6.5 inch (16.5 cm)', idealFor: 'Wrist 5.8 - 6.2 inch' },
    { fit: 'Standard / Medium', lengthInch: '7.0 inch (17.8 cm)', idealFor: 'Wrist 6.3 - 6.7 inch (Most Popular)' },
    { fit: 'Comfort / Large', lengthInch: '7.5 inch (19.0 cm)', idealFor: 'Wrist 6.8 - 7.2 inch' },
    { fit: 'Relaxed / XL', lengthInch: '8.0 inch (20.3 cm)', idealFor: 'Wrist 7.3+ inch' },
  ];

  const necklaceSizes = [
    { name: 'Choker', length: '14" - 16" (35-40 cm)', position: 'Sits snugly around base of throat / collar' },
    { name: 'Princess (Standard)', length: '18" (45 cm)', position: 'Sits gracefully below collarbone (Most Popular)' },
    { name: 'Matinee', length: '20" - 22" (50-55 cm)', position: 'Sits comfortably at plunge / cleavage level' },
    { name: 'Opera', length: '24" - 28" (60-70 cm)', position: 'Rests over high-neck dresses & luxury evening wear' },
    { name: 'Rope / Lariat', length: '30"+ (75+ cm)', position: 'Can be worn long, knotted, or doubled' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-md">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative w-full max-w-3xl rounded-3xl bg-[#0E0E14] border border-[#D4AF37]/50 shadow-[0_0_60px_rgba(212,175,55,0.35)] text-gray-200 overflow-hidden my-4"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#181824] hover:bg-[#D4AF37] text-gray-300 hover:text-black border border-gray-700 transition-colors cursor-pointer"
            aria-label="Close Size Guide"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="p-5 sm:p-6 bg-[#08080C] border-b border-gray-800">
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37] mb-1">
              <Ruler className="w-3.5 h-3.5" />
              <span>Fine Jewelry Measurement & Size Guide</span>
            </div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
              Official Sizing Chart & Fitting Guide
            </h3>
            <p className="text-xs text-gray-400 font-sans mt-1">
              Optimized for all devices (Mobile, iPad, Laptop, PC). Choose the category below to view accurate dimensions.
            </p>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mt-4 pt-2 border-t border-gray-800/80">
              {[
                { id: 'rings', label: 'Ring Sizes' },
                { id: 'bangles', label: 'Bangles & Kadas' },
                { id: 'bracelets', label: 'Bracelets & Charms' },
                { id: 'necklaces', label: 'Necklaces & Chains' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                      : 'bg-[#14141E] text-gray-300 hover:text-white border border-gray-800 hover:border-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 max-h-[65vh] overflow-y-auto space-y-6 text-left">
            {/* ========================================================================= */}
            {/* TAB 1: RINGS */}
            {/* ========================================================================= */}
            {activeTab === 'rings' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm sm:text-base font-cinzel font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Indian & International Ring Size Chart</span>
                  </h4>
                  <span className="text-[11px] text-[#D4AF37] font-semibold">100% Free Resizing Guarantee</span>
                </div>

                {/* Ring Table */}
                <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-[#09090D]">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#14141E] text-gray-300 font-bold uppercase tracking-wider border-b border-gray-800 text-[10px] sm:text-[11px]">
                      <tr>
                        <th className="p-3">US Size</th>
                        <th className="p-3">India / Asian Size</th>
                        <th className="p-3">UK / AU</th>
                        <th className="p-3">Diameter (mm)</th>
                        <th className="p-3">Circumference (mm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60 font-sans">
                      {ringSizes.map((r) => {
                        const isSelected = selectedRingSize === r.us;
                        return (
                          <tr
                            key={r.us}
                            onClick={() => setSelectedRingSize(r.us)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-[#1C1C28] text-[#F5E5B8] font-bold'
                                : 'hover:bg-[#121218] text-gray-300'
                            }`}
                          >
                            <td className="p-3 flex items-center gap-1.5">
                              {isSelected && <CircleDot className="w-3 h-3 text-[#D4AF37]" />}
                              <span>Size {r.us}</span>
                            </td>
                            <td className="p-3 text-white font-medium">{r.india}</td>
                            <td className="p-3">{r.uk}</td>
                            <td className="p-3 text-gray-400 font-mono">{r.diameterMm} mm</td>
                            <td className="p-3 text-[#D4AF37] font-mono">{r.circumMm} mm</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* How to measure finger at home */}
                <div className="p-4 rounded-2xl bg-[#14141E] border border-gray-800 flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-white">How to measure your ring size at home:</p>
                    <p className="text-gray-300">
                      1. Wrap a strip of paper or thread comfortably around the base of your intended finger.
                    </p>
                    <p className="text-gray-300">
                      2. Mark where the ends overlap with a pen and measure the length in millimeters (Circumference).
                    </p>
                    <p className="text-[#F5E5B8]">
                      3. Standard Indian Women's Size is <strong>Size 12-14 (US 6-7)</strong> and Men's is <strong>Size 18-22 (US 9-11)</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: BANGLES & KADAS */}
            {/* ========================================================================= */}
            {activeTab === 'bangles' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm sm:text-base font-cinzel font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Indian Traditional Bangle & Kada Chart</span>
                  </h4>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-gray-800 bg-[#09090D]">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-[#14141E] text-gray-300 font-bold uppercase tracking-wider border-b border-gray-800 text-[10px] sm:text-[11px]">
                      <tr>
                        <th className="p-3">Indian Bangle Size</th>
                        <th className="p-3">Inner Diameter (Inches)</th>
                        <th className="p-3">Inner Diameter (mm)</th>
                        <th className="p-3">Wrist Circumference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/60 font-sans">
                      {bangleSizes.map((b) => (
                        <tr key={b.size} className="hover:bg-[#14141C] transition-colors text-gray-300">
                          <td className="p-3 font-semibold text-white">{b.size}</td>
                          <td className="p-3">{b.diameterInches}</td>
                          <td className="p-3 font-mono text-gray-400">{b.diameterMm}</td>
                          <td className="p-3 text-[#D4AF37] font-medium">{b.wristCircum}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-2xl bg-[#14141E] border border-gray-800 text-xs text-gray-300 space-y-1">
                  <p className="font-bold text-white">Bangle Measurement Tip:</p>
                  <p>
                    Bring your thumb and pinky finger together (as if sliding on a bangle), then measure the widest part of your hand with a measuring tape. <strong>2.4 & 2.6</strong> are the most common Indian women sizes.
                  </p>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: BRACELETS */}
            {/* ========================================================================= */}
            {activeTab === 'bracelets' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm sm:text-base font-cinzel font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Tennis, Chain & Charm Bracelet Lengths</span>
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {braceletSizes.map((br) => (
                    <div key={br.fit} className="p-3.5 rounded-2xl bg-[#12121A] border border-gray-800 hover:border-[#D4AF37]/60 transition-all space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white text-xs">{br.fit}</span>
                        <span className="text-[10px] font-bold text-black bg-[#D4AF37] px-2 py-0.5 rounded-full font-mono">
                          {br.lengthInch}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400">{br.idealFor}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-[#14141E] border border-gray-800 text-xs text-gray-300">
                  <p className="font-bold text-white mb-1">Open-Cuff & Butterfly Bangles:</p>
                  <p>Our open-cuff butterfly bangles and adjustable tension bracelets fit all wrists seamlessly with flexible 18K solid gold memory wire.</p>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 4: NECKLACES */}
            {/* ========================================================================= */}
            {activeTab === 'necklaces' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm sm:text-base font-cinzel font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Necklace & Pendant Chain Length Visualizer</span>
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {necklaceSizes.map((neck) => (
                    <div key={neck.name} className="p-3.5 rounded-2xl bg-[#12121A] border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-cinzel font-bold text-white text-xs sm:text-sm">{neck.name}</span>
                        <p className="text-[11px] text-gray-400 mt-0.5">{neck.position}</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#F5E5B8] bg-black/60 px-3 py-1 rounded-xl border border-gray-800 shrink-0">
                        {neck.length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Responsive Device Adaptability Indicator Banner */}
            <div className="pt-2 border-t border-gray-800">
              <div className="p-3.5 rounded-2xl bg-[#09090E] border border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-300">
                <span className="font-semibold text-[#F5E5B8] flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Adaptive Responsive Layout Active:
                </span>
                <div className="flex items-center gap-3 text-gray-400">
                  <span className="flex items-center gap-1"><Smartphone className="w-3 h-3 text-[#D4AF37]" /> Mobile</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Tablet className="w-3 h-3 text-[#D4AF37]" /> iPad / Tablet</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Laptop className="w-3 h-3 text-[#D4AF37]" /> Laptop</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Monitor className="w-3 h-3 text-[#D4AF37]" /> Computer</span>
                </div>
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:p-5 bg-[#08080C] border-t border-gray-800 flex items-center justify-between">
            <p className="text-[11px] text-gray-400 font-sans">
              Need custom sizing assistance? WhatsApp us at <strong className="text-[#D4AF37]">8401963367</strong>
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-[#181824] hover:bg-[#D4AF37] text-gray-200 hover:text-black text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-gray-700 hover:border-[#D4AF37]"
            >
              Got It
            </button>
          </div>

        </motion.div>
      </AnimatePresence>
    </div>
  );
};
