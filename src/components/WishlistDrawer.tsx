import React from 'react';
import { X, Trash2, ShoppingBag, Heart, Zap } from 'lucide-react';
import { Product, CurrencyConfig } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProducts: Product[];
  currency: CurrencyConfig;
  onRemoveWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
  onOrderNow?: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistProducts,
  currency,
  onRemoveWishlist,
  onAddToCart,
  onOrderNow,
}) => {
  if (!isOpen) return null;

  const formatPrice = (usdPrice: number) => {
    const converted = Math.round(usdPrice * currency.rate);
    return `${currency.symbol}${converted.toLocaleString()}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0E0E12] text-gray-200 shadow-2xl border-l border-[#D4AF37]/35 flex flex-col">
          
          {/* Header */}
          <div className="p-5 bg-[#08080A] text-white flex items-center justify-between border-b border-[#D4AF37]/20">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#D4AF37] fill-[#D4AF37]" />
              <h3 className="font-cinzel font-semibold text-base sm:text-lg tracking-wider text-[#F5E5B8]">
                Vault Wishlist ({wishlistProducts.length})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-[#1A1A24] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {wishlistProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#141418] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Heart className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h4 className="font-cinzel font-medium text-lg text-white">
                  Your Wishlist is Empty
                </h4>
                <p className="font-sans text-xs text-gray-400 max-w-xs">
                  Save your desired butterfly charm bracelets, rings, and certified diamond sets.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5E5B8] text-black text-xs font-bold tracking-wider uppercase cursor-pointer shadow-md"
                >
                  Discover Collections
                </button>
              </div>
            ) : (
              wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-3.5 bg-[#14141A] rounded-2xl border border-gray-800 flex flex-col gap-3 shadow-md"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Image */}
                    <div className="w-16 h-16 rounded-xl bg-black border border-gray-800 overflow-hidden shrink-0 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h5 className="font-cinzel font-semibold text-xs sm:text-sm text-white truncate">
                        {product.name}
                      </h5>
                      <p className="font-sans text-[11px] text-[#D4AF37] font-medium">
                        {product.metal} • {product.categoryLabel}
                      </p>
                      <div className="mt-1 font-cinzel font-bold text-sm text-[#F5E5B8]">
                        {formatPrice(product.price)}
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => onRemoveWishlist(product.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-1 cursor-pointer shrink-0"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Actions for Wishlist item */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        onClose();
                        if (onOrderNow) onOrderNow(product);
                      }}
                      className="py-2 px-3 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F5E5B8] text-black text-[10px] font-bold tracking-wider uppercase flex items-center justify-center gap-1 cursor-pointer shadow-sm hover:scale-[1.02] transition-all"
                    >
                      <Zap className="w-3 h-3 fill-black text-black" />
                      <span>Order Now</span>
                    </button>

                    <button
                      onClick={() => {
                        onAddToCart(product);
                        onRemoveWishlist(product.id);
                      }}
                      className="py-2 px-3 rounded-xl bg-[#1C1C24] hover:bg-[#252535] text-gray-200 hover:text-white border border-gray-700 hover:border-[#D4AF37] text-[10px] font-semibold tracking-wider uppercase flex items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <ShoppingBag className="w-3 h-3 text-[#D4AF37]" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlistProducts.length > 0 && (
            <div className="p-5 bg-[#08080A] border-t border-[#D4AF37]/20">
              <button
                onClick={() => {
                  wishlistProducts.forEach((p) => onAddToCart(p));
                  onClose();
                }}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5E5B8] text-black font-sans font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Move All to Shopping Bag</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
