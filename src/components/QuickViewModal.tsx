import React, { useState } from 'react';
import { X, Star, ShieldCheck, Heart, ShoppingBag, Check, Gem, Zap, Ruler } from 'lucide-react';
import { Product, CurrencyConfig } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyConfig;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product, metal: string, size?: string, quantity?: number) => void;
  onOrderNow?: (product: Product, metal: string, size?: string) => void;
  onOpenSizeGuide?: (category?: 'rings' | 'bangles' | 'bracelets' | 'necklaces') => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
  currency,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onOrderNow,
  onOpenSizeGuide,
}) => {
  if (!isOpen || !product) return null;

  const [selectedMetal, setSelectedMetal] = useState<string>(product.metal);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.category === 'rings' ? 'Size 6 (16.5mm / Ind 12)' :
    product.category === 'bangles' ? 'Size 2.4 (57.2mm)' :
    product.category === 'bracelets' ? '7.0 inch (17.8 cm)' :
    product.category === 'necklaces' ? '18 inch Princess' : 'Standard'
  );
  const [quantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState(false);
  const [activeImage, setActiveImage] = useState<string>(product.image);

  const formatPrice = (usdPrice: number) => {
    const converted = Math.round(usdPrice * currency.rate);
    return `${currency.symbol}${converted.toLocaleString()}`;
  };

  const handleAdd = () => {
    onAddToCart(product, selectedMetal, selectedSize, quantity);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
    }, 1800);
  };

  const handleOrder = () => {
    if (onOrderNow) {
      onOrderNow(product, selectedMetal, selectedSize);
    }
  };

  const ringSizes = [
    'Size 5 (15.7mm / Ind 10)',
    'Size 6 (16.5mm / Ind 12)',
    'Size 7 (17.3mm / Ind 14)',
    'Size 8 (18.1mm / Ind 16)',
    'Size 9 (19.0mm / Ind 18)',
    'Size 10 (19.8mm / Ind 20)',
  ];

  const bangleSizes = [
    'Size 2.2 (Small - 54.0mm)',
    'Size 2.4 (Medium-Small - 57.2mm)',
    'Size 2.6 (Standard - 60.3mm)',
    'Size 2.8 (Medium-Large - 63.5mm)',
    'Size 2.10 (Large - 66.7mm)',
  ];

  const braceletSizes = [
    '6.0 inch (Petite)',
    '6.5 inch (Small)',
    '7.0 inch (Standard / Most Popular)',
    '7.5 inch (Comfort Fit)',
    '8.0 inch (Relaxed)',
  ];

  const necklaceSizes = [
    '16 inch (Choker Collar)',
    '18 inch (Princess Standard)',
    '20 inch (Matinee Cleavage)',
    '24 inch (Opera Evening)',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-6 text-center">
        <div className="relative w-full max-w-3xl transform overflow-hidden rounded-3xl bg-[#0E0E14] text-left shadow-2xl border border-[#D4AF37]/45 transition-all my-4">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#181824] hover:bg-[#D4AF37] text-gray-300 hover:text-black border border-gray-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left Column: Image Gallery */}
            <div className="p-5 sm:p-6 bg-[#08080A] flex flex-col justify-between items-center border-b md:border-b-0 md:border-r border-gray-800">
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-black border border-gray-800 flex items-center justify-center p-4 shadow-inner">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-contain filter contrast-[1.03]"
                />
                
                {product.certificate && (
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-[#161620]/90 text-[#F5E5B8] text-[9px] font-sans font-semibold tracking-wider flex items-center gap-1 border border-[#D4AF37]/40">
                    <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                    <span>{product.certificate}</span>
                  </div>
                )}
              </div>

              {/* Secondary Thumbs */}
              {product.secondaryImage && (
                <div className="flex gap-2.5 mt-3">
                  <button
                    onClick={() => setActiveImage(product.image)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all p-1 bg-black cursor-pointer ${
                      activeImage === product.image ? 'border-[#D4AF37]' : 'border-gray-800'
                    }`}
                  >
                    <img src={product.image} alt="" className="w-full h-full object-contain" />
                  </button>
                  <button
                    onClick={() => setActiveImage(product.secondaryImage!)}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all p-1 bg-black cursor-pointer ${
                      activeImage === product.secondaryImage ? 'border-[#D4AF37]' : 'border-gray-800'
                    }`}
                  >
                    <img src={product.secondaryImage} alt="" className="w-full h-full object-contain" />
                  </button>
                </div>
              )}

              {/* Guarantee note */}
              <div className="mt-3 pt-2.5 border-t border-gray-800 w-full text-[10px] text-gray-400 flex items-center justify-center gap-3">
                <span className="flex items-center gap-1 text-[#D4AF37]">
                  <Gem className="w-3 h-3" />
                  100% Conflict-Free
                </span>
                <span>•</span>
                <span>GIA / IGI Hallmarked</span>
              </div>
            </div>

            {/* Right Column: Product Specs & Actions */}
            <div className="p-5 sm:p-6 flex flex-col justify-between">
              <div>
                {/* Eyebrow & Category */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-sans tracking-[0.2em] uppercase font-bold text-[#D4AF37]">
                    {product.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1 text-xs">
                    <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                    <span className="font-semibold text-white">{product.rating}</span>
                    <span className="text-gray-400 text-[10px]">({product.reviewsCount})</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="mt-1.5 text-lg sm:text-xl font-cinzel font-semibold text-white tracking-tight">
                  {product.name}
                </h3>

                {/* Price */}
                <div className="mt-2 flex items-baseline gap-2.5">
                  <span className="text-xl font-cinzel font-bold text-[#F5E5B8]">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs font-sans text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="mt-2 text-xs font-sans text-gray-300 leading-relaxed">
                  {product.description}
                </p>

                {/* Metal Selector */}
                <div className="mt-3">
                  <label className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider block mb-1.5">
                    Metal Tone: <span className="text-[#D4AF37] font-bold">{selectedMetal}</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {product.metalOptions.map((metal) => (
                      <button
                        key={metal}
                        type="button"
                        onClick={() => setSelectedMetal(metal)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-sans font-medium border text-left transition-all cursor-pointer ${
                          selectedMetal === metal
                            ? 'border-[#D4AF37] bg-[#1E1E28] text-[#F5E5B8] shadow-[0_0_8px_rgba(212,175,55,0.25)]'
                            : 'border-gray-800 bg-[#121216] text-gray-300 hover:border-gray-600'
                        }`}
                      >
                        {metal}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Category Size Selector */}
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
                      {product.category === 'rings' ? 'Ring Size:' :
                       product.category === 'bangles' ? 'Bangle Size:' :
                       product.category === 'bracelets' ? 'Bracelet Length:' :
                       product.category === 'necklaces' ? 'Chain Length:' : 'Size / Length:'}
                    </label>
                    {onOpenSizeGuide && (
                      <button
                        type="button"
                        onClick={() => onOpenSizeGuide(
                          product.category === 'rings' ? 'rings' :
                          product.category === 'bangles' ? 'bangles' :
                          product.category === 'bracelets' ? 'bracelets' : 'necklaces'
                        )}
                        className="text-[10px] text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                      >
                        <Ruler className="w-3 h-3" />
                        <span>Size Chart</span>
                      </button>
                    )}
                  </div>

                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-[#14141A] border border-gray-700 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    {product.category === 'rings' && ringSizes.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                    {product.category === 'bangles' && bangleSizes.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                    {product.category === 'bracelets' && braceletSizes.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                    {product.category === 'necklaces' && necklaceSizes.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                    {!['rings', 'bangles', 'bracelets', 'necklaces'].includes(product.category) && (
                      <>
                        <option value="Standard Luxury Fit">Standard Luxury Fit</option>
                        <option value="Custom Bespoke Fit">Custom Bespoke Fit</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Action Buttons: Order Now + Add to Cart + Wishlist */}
              <div className="mt-5 pt-3.5 border-t border-gray-800 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleOrder}
                    className="py-3 px-3 rounded-full font-sans text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] text-black hover:scale-[1.02] shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 fill-black text-black" />
                    <span>Order Now</span>
                  </button>

                  <button
                    onClick={handleAdd}
                    className={`py-3 px-3 rounded-full font-sans text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer border ${
                      justAdded
                        ? 'bg-[#2E7D32] border-emerald-500 text-white'
                        : 'bg-[#181824] hover:bg-[#20202E] text-gray-200 hover:text-white border-gray-700 hover:border-[#D4AF37]'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Add to Bag</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => onToggleWishlist(product)}
                  className={`w-full py-2 rounded-full border text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    isWishlisted
                      ? 'bg-[#1E1E28] border-[#D4AF37] text-[#D4AF37]'
                      : 'bg-[#121216] border-gray-800 text-gray-400 hover:text-[#D4AF37]'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-[#D4AF37]' : ''}`} />
                  <span>{isWishlisted ? 'Saved in Vault Wishlist' : 'Add to Wishlist'}</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
