import React from 'react';
import { Heart, ShoppingBag, Eye, Check, Sparkles, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { Product, Currency } from '../types';

interface BestSellersSectionProps {
  products: Product[];
  wishlistIds: string[];
  recentlyAddedId: string | null;
  currency: Currency;
  onAddToCart: (product: Product) => void;
  onOrderNow: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onViewAllClick: () => void;
}

export const BestSellersSection: React.FC<BestSellersSectionProps> = ({
  products,
  wishlistIds,
  recentlyAddedId,
  currency,
  onAddToCart,
  onOrderNow,
  onToggleWishlist,
  onQuickView,
  onViewAllClick,
}) => {
  const formatPrice = (amount: number) => {
    return `${currency.symbol}${(amount * currency.rate).toLocaleString('en-US', {
      maximumFractionDigits: 0,
    })}`;
  };

  return (
    <section id="bestsellers" className="relative overflow-hidden bg-[#09090C] py-14 sm:py-20 border-b border-[#D4AF37]/25">
      
      {/* Background ambient gold lighting */}
      <div className="absolute top-1/4 right-10 w-[450px] h-[450px] rounded-full bg-[#D4AF37]/6 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Clean Negative Space */}
        <div className="flex flex-col items-center justify-center text-center mb-12 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14141E] border border-[#D4AF37]/40 text-[#F5E5B8] text-[10px] sm:text-[11px] font-sans font-bold tracking-[0.25em] uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Imperial Signature Collection</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-cinzel font-bold text-white tracking-tight">
              Featured Jewellery Vault
            </h2>
            
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto my-2" />
          </motion.div>
        </div>

        {/* 3-Column / 4-Column Product Cards Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {products.slice(0, 6).map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            const isJustAdded = recentlyAddedId === product.id;

            return (
              <motion.div
                key={product.id}
                variants={{
                  hidden: { opacity: 0, y: 25 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
                }}
                whileHover={{ y: -6 }}
                className="group relative bg-[#111116] p-4 sm:p-5 rounded-3xl flex flex-col justify-between border border-gray-800/80 hover:border-[#D4AF37]/70 shadow-lg hover:shadow-[0_10px_35px_rgba(212,175,55,0.22)] transition-all duration-500 overflow-hidden"
              >
                {/* Subtle Card Shimmer */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                {/* Product Image Stage */}
                <div
                  className="h-60 sm:h-64 bg-black/80 rounded-2xl mb-4 overflow-hidden relative flex items-center justify-center cursor-pointer p-4 border border-gray-900 shadow-inner group/img"
                  onClick={() => onQuickView(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain object-center transform group-hover/img:scale-108 transition-transform duration-700 filter brightness-[1.02]"
                    loading="lazy"
                  />

                  {/* Status Badges */}
                  {product.isNew && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-[#D4AF37] to-[#F5E5B8] text-black px-2.5 py-0.5 rounded-full text-[8px] font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(212,175,55,0.4)] animate-pulse">
                      NEW
                    </div>
                  )}
                  {product.isBestSeller && !product.isNew && (
                    <div className="absolute top-3 right-3 bg-[#181824] border border-[#D4AF37]/60 text-[#F5E5B8] px-2.5 py-0.5 rounded-full text-[8px] font-bold tracking-widest uppercase shadow-md">
                      BESTSELLER
                    </div>
                  )}

                  {/* Wishlist Button with Pop Animation */}
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product);
                    }}
                    className="absolute top-3 left-3 p-2 rounded-full bg-[#14141C]/90 backdrop-blur-sm text-gray-300 hover:text-[#D4AF37] shadow-md transition-colors cursor-pointer border border-gray-800 hover:border-[#D4AF37] z-10"
                    title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 transition-transform ${
                        isWishlisted ? 'fill-[#D4AF37] text-[#D4AF37] scale-110' : 'stroke-[2]'
                      }`}
                    />
                  </motion.button>

                  {/* Quick View Hover Button */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto">
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onQuickView(product);
                      }}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5E5B8] text-black font-sans text-[10px] font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick View</span>
                    </motion.button>
                  </div>
                </div>

                {/* Card Info */}
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold block mb-1">
                    {product.metal} • {product.categoryLabel}
                  </span>
                  
                  <h3
                    onClick={() => onQuickView(product)}
                    className="text-sm font-cinzel font-medium text-white hover:text-[#F5E5B8] transition-colors cursor-pointer line-clamp-1 mb-2"
                  >
                    {product.name}
                  </h3>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-[#F5E5B8] font-cinzel text-base font-bold">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* TWO DIRECT ACTION BUTTONS: "Order Now" & "Add to Cart" */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-800/90">
                  
                  {/* Option 1: Direct Order Now */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onOrderNow(product)}
                    className="w-full py-2.5 px-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] text-black font-sans font-bold text-[11px] tracking-wider uppercase shadow-md hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-black fill-black" />
                    <span>Order Now</span>
                  </motion.button>

                  {/* Option 2: Add to Cart */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onAddToCart(product)}
                    className={`w-full py-2.5 px-2 rounded-xl font-sans font-semibold text-[11px] tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer border ${
                      isJustAdded
                        ? 'bg-[#2E7D32] border-emerald-500 text-white shadow-[0_0_12px_rgba(46,125,50,0.4)]'
                        : 'bg-[#181822] hover:bg-[#20202E] text-gray-200 hover:text-white border-gray-700 hover:border-[#D4AF37]'
                    }`}
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </motion.button>

                </div>

              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
};
