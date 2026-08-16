import React, { useState, useMemo } from 'react';
import { X, Search, ArrowRight, Sparkles } from 'lucide-react';
import { Product, CurrencyConfig } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  currency: CurrencyConfig;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onSelectProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const trendingTags = ['Emerald Solitaire', 'Floral Diamond Ring', 'Chandelier Earrings', '18K Bangle', 'Bridal Choker', 'Platinum Band'];

  const results = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const lower = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.categoryLabel.toLowerCase().includes(lower) ||
        p.metal.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
    );
  }, [searchTerm, products]);

  if (!isOpen) return null;

  const formatPrice = (usdPrice: number) => {
    const converted = Math.round(usdPrice * currency.rate);
    return `${currency.symbol}${converted.toLocaleString()}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div className="flex min-h-full items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 text-center">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl bg-[#0E0E12] text-left shadow-2xl border border-[#D4AF37]/40 transition-all p-6 sm:p-8">
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-[#181822] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Search Input */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Search Haute Joaillerie Vault</span>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 bg-[#14141A] rounded-2xl border border-[#D4AF37]/40 focus-within:border-[#D4AF37] shadow-inner">
              <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search solitaires, necklaces, diamonds, carats, bridal sets..."
                className="w-full text-sm sm:text-base font-sans text-white placeholder-gray-500 bg-transparent focus:outline-none"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-xs text-gray-400 hover:text-white cursor-pointer">
                  Clear
                </button>
              )}
            </div>

            {/* Trending Quick Suggestions */}
            <div>
              <span className="text-[11px] text-gray-400 font-sans block mb-2 font-medium">
                Trending Searches:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {trendingTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="px-3 py-1 rounded-full bg-[#181822] text-gray-300 hover:bg-[#D4AF37] hover:text-black text-xs font-sans transition-colors border border-gray-800 cursor-pointer"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="mt-6 pt-4 border-t border-gray-800 max-h-80 overflow-y-auto space-y-3">
            {searchTerm.trim() && results.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-400">
                No matching creations found for "{searchTerm}". Try searching for "Diamond", "Emerald", or "Gold".
              </div>
            ) : (
              results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="p-3 bg-[#14141A] hover:bg-[#1C1C26] rounded-xl border border-gray-800 hover:border-[#D4AF37]/50 flex items-center justify-between gap-3 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-contain bg-black p-1 border border-gray-800"
                    />
                    <div>
                      <h4 className="font-cinzel font-semibold text-sm text-white group-hover:text-[#D4AF37] transition-colors">
                        {product.name}
                      </h4>
                      <span className="text-[11px] text-gray-400 font-sans">
                        {product.metal} • {product.categoryLabel}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-cinzel font-bold text-sm text-[#F5E5B8]">
                      {formatPrice(product.price)}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#D4AF37] transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
