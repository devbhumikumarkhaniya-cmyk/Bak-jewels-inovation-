import React from 'react';
import { Logo } from './Logo';
import { ShieldCheck, Gem, Phone, Mail, MapPin, UserCheck } from 'lucide-react';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateSection,
  onOpenAdmin,
}) => {
  return (
    <footer id="footer" className="bg-[#070708] text-gray-400 font-sans border-t border-[#D4AF37]/30">
      
      {/* Upper Brand & Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          
          {/* Col 1: Brand Identity */}
          <div className="space-y-4">
            <div onClick={() => onNavigateSection('hero')} className="cursor-pointer inline-block">
              <Logo variant="light" size="lg" />
            </div>

            <p className="text-xs text-gray-400 font-light leading-relaxed max-w-sm">
              Fine Haute Joaillerie crafted with certified diamonds, natural gemstones, and 100% hallmarked gold.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs text-gray-300">
              <div className="flex items-center gap-1.5 text-[#D4AF37]">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[11px] font-semibold tracking-wider uppercase">GIA Certified</span>
              </div>
              <span className="text-gray-700">•</span>
              <div className="flex items-center gap-1.5 text-[#D4AF37]">
                <Gem className="w-4 h-4" />
                <span className="text-[11px] font-semibold tracking-wider uppercase">18K Solid Gold</span>
              </div>
            </div>
          </div>

          {/* Col 2: (Highlights) BAKJEWELS - EXACT SPECIFIED DETAILS */}
          <div className="space-y-4 bg-[#101016] border border-[#D4AF37]/35 rounded-2xl p-6 shadow-[0_0_30px_rgba(212,175,55,0.08)]">
            <div className="border-b border-[#D4AF37]/25 pb-2.5">
              <h4 className="font-cinzel text-sm font-bold uppercase tracking-[0.2em] text-[#F5E5B8] flex items-center gap-2">
                <span>(Highlights) BAKJEWELS</span>
              </h4>
            </div>

            <div className="space-y-2.5 text-xs text-gray-300 font-sans">
              <div className="flex items-center gap-2.5">
                <span className="text-[#D4AF37] font-bold text-sm">°</span>
                <span className="text-gray-400">desinger :</span>
                <span className="font-semibold text-white uppercase tracking-wider">bhumika kumarkhaniya</span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[#D4AF37] font-bold text-sm">°</span>
                <span className="text-gray-400">contact :</span>
                <a
                  href="tel:8401963367"
                  className="font-semibold text-[#D4AF37] hover:underline tracking-wider"
                >
                  8401963367
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[#D4AF37] font-bold text-sm">°</span>
                <span className="text-gray-400">address :</span>
                <span className="font-semibold text-gray-200 tracking-wider">00000000</span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-[#D4AF37] font-bold text-sm">°</span>
                <span className="text-gray-400">email :</span>
                <a
                  href="mailto:bakjewels7@gmail.com"
                  className="font-semibold text-gray-200 hover:text-[#D4AF37] transition-colors"
                >
                  bakjewels7@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-xs font-bold uppercase tracking-[0.25em] text-[#F5E5B8]">
              Jewelry Collections
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateSection('bestsellers')}
                  className="hover:text-[#D4AF37] transition-colors text-left"
                >
                  Solitaire Rings & Bands
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('bestsellers')}
                  className="hover:text-[#D4AF37] transition-colors text-left"
                >
                  Diamond & Crystal Bracelets
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('bestsellers')}
                  className="hover:text-[#D4AF37] transition-colors text-left"
                >
                  Gold Bangles & Cuffs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('bestsellers')}
                  className="hover:text-[#D4AF37] transition-colors text-left"
                >
                  High Jewelry Earrings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('promo')}
                  className="hover:text-[#D4AF37] transition-colors text-left"
                >
                  Bridal Suites & Sets
                </button>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar with Copyright & Verified Payment Badges */}
      <div className="border-t border-gray-900 bg-[#050506] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <div className="flex items-center gap-3">
            <span>
              © {new Date().getFullYear()} BAK JEWELS. All rights reserved.
            </span>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-[10px] text-gray-600 hover:text-[#D4AF37] transition-colors cursor-pointer flex items-center gap-1 border-l border-gray-800 pl-3"
                title="Store Owner Portal"
              >
                <span>🔒 Owner Portal</span>
              </button>
            )}
          </div>
          
          {/* Payment Badges */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-widest text-gray-500">Encrypted Payments:</span>
            <div className="flex items-center gap-1.5 font-bold text-[10px] text-gray-400">
              <span className="px-2 py-0.5 rounded bg-[#16161B] border border-gray-800 text-gray-300">VISA</span>
              <span className="px-2 py-0.5 rounded bg-[#16161B] border border-gray-800 text-gray-300">MASTERCARD</span>
              <span className="px-2 py-0.5 rounded bg-[#16161B] border border-gray-800 text-gray-300">UPI / GPAY</span>
              <span className="px-2 py-0.5 rounded bg-[#16161B] border border-[#D4AF37]/30 text-[#D4AF37]">NET BANKING</span>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};
