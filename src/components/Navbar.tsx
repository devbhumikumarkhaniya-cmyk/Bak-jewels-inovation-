import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, Menu, X, Globe, Sparkles, Ruler } from 'lucide-react';
import { Logo } from './Logo';
import { CurrencyCode } from '../types';
import { CURRENCIES } from '../data/products';

interface NavbarProps {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSearch: () => void;
  onOpenSizeGuide?: () => void;
  onReplayIntro?: () => void;
  activeCurrency: CurrencyCode;
  onChangeCurrency: (currency: CurrencyCode) => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSearch,
  onOpenSizeGuide,
  onReplayIntro,
  activeCurrency,
  onChangeCurrency,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const leftNavLinks = [
    { name: 'High Jewelry', target: 'hero' },
    { name: 'Collections', target: 'categories' },
    { name: 'Best Sellers', target: 'bestsellers' },
  ];

  const rightNavLinks = [
    { name: 'Bridal Vault', target: 'promo' },
    { name: 'Heritage', target: 'trust' },
    { name: 'Details', target: 'footer' },
  ];

  const allNavLinks = [...leftNavLinks, ...rightNavLinks];

  const handleLinkClick = (target: string) => {
    onNavigateSection(target);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-2xl transition-all duration-300">
      {/* 1. TOP LUXURY TICKER */}
      <div className="bg-[#070708] text-[#E5C07B] text-[10px] sm:text-[11px] py-1.5 px-4 tracking-[0.22em] uppercase font-semibold border-b border-[#D4AF37]/20 flex items-center justify-between relative">
        <div className="flex items-center justify-center gap-2 sm:gap-4 mx-auto font-medium">
          <span className="hidden md:inline text-gray-400 font-light">BAK Jewels Fine Haute Joaillerie •</span>
          <span className="text-[#F5E5B8]">Complimentary Insured Delivery</span>
          <span className="hidden sm:inline text-[#D4AF37]/40">•</span>
          <span className="hidden sm:inline">100% GIA & BIS Hallmarked Solid Gold</span>
          <span className="hidden lg:inline text-[#D4AF37]/40">•</span>
          <span className="hidden lg:inline">Handcrafted Luxury</span>
        </div>

        {/* Right Quick Controls */}
        <div className="absolute right-4 hidden md:flex items-center gap-3 text-[10px] font-normal normal-case">
          {/* Size Guide Button */}
          {onOpenSizeGuide && (
            <button
              onClick={onOpenSizeGuide}
              className="flex items-center gap-1 text-[#F5E5B8] hover:text-[#D4AF37] px-2 py-0.5 rounded border border-[#D4AF37]/30 bg-[#121215] transition-colors text-[10px] tracking-wider uppercase cursor-pointer"
              title="Jewelry Size Chart for Mobile, Laptop & Desktop"
            >
              <Ruler className="w-2.5 h-2.5 text-[#D4AF37]" />
              <span>Size Guide</span>
            </button>
          )}

          {/* Replay Intro Button */}
          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              className="flex items-center gap-1.5 text-gray-400 hover:text-[#D4AF37] px-2 py-0.5 rounded border border-gray-800 hover:border-[#D4AF37]/40 bg-[#121215] transition-colors text-[10px] tracking-wider uppercase cursor-pointer"
              title="Watch Intro Animation"
            >
              <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
              <span>Intro Film</span>
            </button>
          )}

          {/* Currency Dropdown */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1 text-[#E5C07B] hover:text-white px-2 py-0.5 rounded border border-[#D4AF37]/30 bg-[#121215] transition-colors uppercase tracking-wider text-[10px] cursor-pointer"
            >
              <Globe className="w-2.5 h-2.5 text-[#D4AF37]" />
              <span>{activeCurrency}</span>
              <span className="text-[8px] text-[#D4AF37]">▼</span>
            </button>

            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-1 w-24 bg-[#141418] border border-[#D4AF37]/40 rounded-lg shadow-2xl py-1 z-50">
                {Object.keys(CURRENCIES).map((currKey) => {
                  const c = CURRENCIES[currKey as CurrencyCode];
                  return (
                    <button
                      key={c.code}
                      onClick={() => {
                        onChangeCurrency(c.code);
                        setCurrencyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1 text-[11px] flex items-center justify-between hover:bg-[#202028] transition-colors ${
                        activeCurrency === c.code ? 'text-[#D4AF37] font-bold bg-[#1A1A24]' : 'text-gray-300'
                      }`}
                    >
                      <span>{c.code}</span>
                      <span className="text-[#D4AF37]">{c.symbol}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN OBSIDIAN & IMPERIAL GOLD NAVIGATION BAR */}
      <div className="h-18 sm:h-20 flex items-center justify-between px-4 sm:px-8 lg:px-12 bg-[#0C0C0E]/95 backdrop-blur-md border-b border-[#D4AF37]/20 z-10 transition-colors">
        
        {/* Left: Nav Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 text-[11px] uppercase tracking-[0.2em] font-semibold text-gray-200">
          {leftNavLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleLinkClick(link.target)}
              className="hover:text-[#D4AF37] transition-colors py-1 relative group cursor-pointer"
            >
              <span>{link.name}</span>
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-200 hover:text-[#D4AF37] transition-colors focus:outline-none cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Center: Official BAK Jewels Emblem Logo */}
        <div onClick={() => handleLinkClick('hero')} className="cursor-pointer">
          <Logo variant="light" size="md" />
        </div>

        {/* Right: Nav Links + Action Icons */}
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="hidden lg:flex items-center gap-6 text-[11px] uppercase tracking-[0.2em] font-semibold text-gray-200 border-r border-[#D4AF37]/20 pr-6">
            {rightNavLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleLinkClick(link.target)}
                className="hover:text-[#D4AF37] transition-colors py-1 relative group cursor-pointer"
              >
                <span>{link.name}</span>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#D4AF37] transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-2.5 sm:gap-4 text-gray-200">
            {/* Quick Size Guide Trigger for mobile / tablet */}
            {onOpenSizeGuide && (
              <button
                onClick={onOpenSizeGuide}
                className="p-2 text-gray-300 hover:text-[#D4AF37] hover:scale-105 transition-all relative cursor-pointer md:hidden"
                title="Size Guide"
                aria-label="Size Guide"
              >
                <Ruler className="w-5 h-5 stroke-[1.8]" />
              </button>
            )}

            {/* Search Trigger */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-gray-300 hover:text-[#D4AF37] hover:scale-105 transition-all relative cursor-pointer"
              title="Search Fine Jewellery"
              aria-label="Search Fine Jewellery"
            >
              <Search className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* Wishlist Trigger */}
            <button
              onClick={onOpenWishlist}
              className="p-2 text-gray-300 hover:text-[#D4AF37] hover:scale-105 transition-all relative cursor-pointer"
              title="View Wishlist"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.8]" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#D4AF37] text-black text-[9px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-[#D4AF37]/30">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="p-2 text-gray-300 hover:text-[#D4AF37] hover:scale-105 transition-all relative cursor-pointer flex items-center gap-1.5"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gradient-to-tr from-[#D4AF37] to-[#F5E5B8] text-black text-[9px] font-bold rounded-full flex items-center justify-center shadow-md">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0C0C0E] border-b border-[#D4AF37]/30 px-6 py-5 animate-fadeIn shadow-2xl">
          <div className="flex flex-col space-y-3 pb-3">
            {allNavLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleLinkClick(link.target)}
                className="text-left font-sans text-xs tracking-[0.2em] uppercase font-semibold text-gray-200 hover:text-[#D4AF37] py-2 transition-colors flex items-center justify-between border-b border-gray-800"
              >
                <span>{link.name}</span>
                <span className="text-[#D4AF37] text-xs">→</span>
              </button>
            ))}

            {onOpenSizeGuide && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSizeGuide();
                }}
                className="text-left font-sans text-xs tracking-[0.2em] uppercase font-semibold text-[#F5E5B8] py-2 flex items-center justify-between border-b border-gray-800"
              >
                <div className="flex items-center gap-2">
                  <Ruler className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Jewellery Size Guide</span>
                </div>
                <span className="text-[#D4AF37] text-xs">→</span>
              </button>
            )}

            {onReplayIntro && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onReplayIntro();
                }}
                className="text-left font-sans text-xs tracking-[0.2em] uppercase font-semibold text-[#D4AF37] py-2 flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Replay Intro Film</span>
              </button>
            )}

            <div className="pt-3 flex items-center justify-between text-xs border-t border-gray-800">
              <span className="text-[11px] font-medium text-gray-400">Direct Support:</span>
              <a href="tel:8401963367" className="font-semibold text-[#D4AF37] tracking-wider text-[11px]">
                8401963367
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

