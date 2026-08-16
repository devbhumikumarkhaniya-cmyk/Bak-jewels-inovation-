import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { CartItem, CurrencyConfig } from '../types';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyConfig;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToOrder?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToOrder,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  if (!isOpen) return null;

  const rawSubtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const discountAmount = Math.round((rawSubtotal * discountPercent) / 100);
  const subtotal = rawSubtotal - discountAmount;
  const freeShippingThreshold = 500;
  const progressToFreeShipping = Math.min(100, (rawSubtotal / freeShippingThreshold) * 100);

  const formatPrice = (usdPrice: number) => {
    const converted = Math.round(usdPrice * currency.rate);
    return `${currency.symbol}${converted.toLocaleString()}`;
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ROYAL10' || promoCode.trim().toUpperCase() === 'BAK10') {
      setDiscountPercent(10);
      setPromoMessage('10% VIP Luxury Courtesy Applied!');
    } else if (promoCode.trim().toUpperCase() === 'BRIDAL15') {
      setDiscountPercent(15);
      setPromoMessage('15% Bridal Privileges Applied!');
    } else {
      setPromoMessage('Invalid coupon code. Try ROYAL10 or BRIDAL15.');
    }
  };

  const handleCheckout = () => {
    if (onProceedToOrder) {
      onProceedToOrder();
      return;
    }
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#F5E5B8', '#FFFFFF'],
      });
    }, 1200);
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
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h3 className="font-cinzel font-semibold text-base sm:text-lg tracking-wider text-[#F5E5B8]">
                Your Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-[#1A1A24] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="p-3 bg-[#14141A] border-b border-gray-800 text-xs">
            <div className="flex justify-between items-center mb-1 text-gray-300 font-medium">
              <span>
                {rawSubtotal >= freeShippingThreshold ? (
                  <strong className="text-[#D4AF37] font-semibold">✦ Unlocked Free Insured Armored Delivery!</strong>
                ) : (
                  <>Add <strong className="text-[#F5E5B8]">{formatPrice(freeShippingThreshold - rawSubtotal)}</strong> for Free Delivery</>
                )}
              </span>
              <span className="text-[#D4AF37] font-bold">{Math.round(progressToFreeShipping)}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F5E5B8] transition-all duration-500 rounded-full"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {checkoutComplete ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#181822] border-2 border-[#D4AF37] text-[#D4AF37] flex items-center justify-center shadow-[0_0_25px_rgba(212,175,55,0.4)]">
                  <Check className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h4 className="font-cinzel font-semibold text-2xl text-white">
                  Order Successfully Placed
                </h4>
                <p className="font-sans text-xs text-gray-400 max-w-xs leading-relaxed">
                  Your luxury jewelry order has been received. Our master jewellers and insured courier team are preparing your velvet presentation vault.
                </p>
                <div className="p-3 bg-[#141418] rounded-xl border border-[#D4AF37]/40 text-xs text-gray-300 w-full">
                  <span>Order Reference: <strong className="text-[#D4AF37]">#BAK-{Math.floor(100000 + Math.random() * 900000)}</strong></span>
                </div>
                <button
                  onClick={() => {
                    setCheckoutComplete(false);
                    onClearCart();
                    onClose();
                  }}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5E5B8] text-black font-bold text-xs tracking-wider uppercase cursor-pointer"
                >
                  Continue Browsing Vault
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#141418] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h4 className="font-cinzel font-medium text-lg text-white">
                  Your Shopping Bag is Empty
                </h4>
                <p className="font-sans text-xs text-gray-400 max-w-xs">
                  Discover our certified diamond solitaires, bridal sets, and handcrafted gold treasures.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5E5B8] text-black text-xs font-bold tracking-wider uppercase cursor-pointer"
                >
                  Explore Jewellery
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedMetal}`}
                  className="p-3.5 bg-[#14141A] rounded-2xl border border-gray-800 flex items-center gap-3.5 shadow-md"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-black border border-gray-800 overflow-hidden shrink-0 flex items-center justify-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h5 className="font-cinzel font-semibold text-xs sm:text-sm text-white truncate">
                      {item.product.name}
                    </h5>
                    <p className="font-sans text-[11px] text-[#D4AF37] font-medium">
                      {item.selectedMetal} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''}
                    </p>
                    <div className="mt-1 font-cinzel font-bold text-sm text-[#F5E5B8]">
                      {formatPrice(item.product.price)}
                    </div>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-1 cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center border border-gray-700 rounded-lg bg-[#0C0C0E]">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-gray-300 hover:text-[#D4AF37] cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-gray-300 hover:text-[#D4AF37] cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && !checkoutComplete && (
            <div className="p-5 bg-[#08080A] border-t border-[#D4AF37]/20 space-y-4">
              
              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code (e.g. ROYAL10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs uppercase rounded-xl border border-gray-700 bg-[#141418] text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1C1C24] hover:bg-[#D4AF37] hover:text-black text-gray-200 text-xs font-bold rounded-xl border border-[#D4AF37]/40 transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>
              {promoMessage && (
                <p className="text-[11px] text-[#D4AF37] font-medium">{promoMessage}</p>
              )}

              {/* Price Details */}
              <div className="space-y-1.5 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-white">{formatPrice(rawSubtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#D4AF37]">
                    <span>VIP Courtesy Privilege ({discountPercent}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured Armored Delivery</span>
                  <span className="text-[#D4AF37] font-semibold">COMPLIMENTARY</span>
                </div>
                <div className="pt-2 border-t border-gray-800 flex justify-between text-base font-cinzel font-bold text-[#F5E5B8]">
                  <span>Total Amount</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] text-black font-sans font-bold text-xs tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isCheckingOut ? (
                  <span className="animate-pulse">Securing Vault Gateway...</span>
                ) : (
                  <>
                    <span>Proceed to Secure Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>256-Bit Encrypted Checkout • GIA / IGI Certification Attached</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
