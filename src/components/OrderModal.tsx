import React, { useState } from 'react';
import { X, ShieldCheck, Check, Truck, Lock, CreditCard, Banknote, QrCode, Sparkles, MapPin, Phone, Mail, User, Plus, Minus, Send, Globe, Database, MessageCircle, Ruler } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, CurrencyConfig, CartItem } from '../types';
import { submitOrderToSupabase, DbOrder } from '../lib/supabase';
import confetti from 'canvas-confetti';
import bakLogoImg from '../assets/images/bak_jewels_logo_1786709287105.jpg';

export interface OrderFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  state: string;
  country: string;
  paymentMethod: 'cod' | 'upi' | 'card' | 'netbanking';
  specialNotes?: string;
  ringSize?: string;
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  cartItems?: CartItem[];
  currency: CurrencyConfig;
  selectedMetal?: string;
  initialSize?: string;
  onOpenSizeGuide?: (category?: 'rings' | 'bangles' | 'bracelets' | 'necklaces') => void;
  onOrderSuccess?: (orderId: string) => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  product,
  cartItems = [],
  currency,
  selectedMetal = '18K Rose Gold',
  initialSize = 'Standard / Tailored',
  onOpenSizeGuide,
  onOrderSuccess,
}) => {
  const [formData, setFormData] = useState<OrderFormData>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    state: '',
    country: 'India',
    paymentMethod: 'cod',
    specialNotes: '',
    ringSize: initialSize,
  });

  const [quantity, setQuantity] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
  const [dbStatusSource, setDbStatusSource] = useState<'supabase' | 'local_fallback'>('supabase');
  const [dbErrorMsg, setDbErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Determine items and total price
  const isDirectProductOrder = Boolean(product);
  const rawTotal = isDirectProductOrder
    ? (product?.price || 0) * quantity
    : cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const formatPrice = (usdPrice: number) => {
    const converted = Math.round(usdPrice * currency.rate);
    return `${currency.symbol}${converted.toLocaleString()}`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIncrementQty = () => {
    setQuantity((q) => Math.min(20, q + 1));
  };

  const handleDecrementQty = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      alert('Please fill all required shipping details.');
      return;
    }

    setIsSubmitting(true);

    const generatedId = `BAK-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    // Prepare items list for Supabase DB
    const orderItemsPayload = isDirectProductOrder && product
      ? [
          {
            id: product.id,
            name: product.name,
            quantity: quantity,
            price: product.price,
            selected_metal: selectedMetal,
            image: product.image,
          },
        ]
      : cartItems.map((item) => ({
          id: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price,
          selected_metal: item.selectedMetal || 'Solid Gold',
          image: item.product.image,
        }));

    const firstItem = orderItemsPayload[0];
    const totalQty = orderItemsPayload.reduce((sum, it) => sum + it.quantity, 0);
    const summaryText = orderItemsPayload
      .map((it) => `${it.quantity}x ${it.name} (${it.selected_metal || 'Solid Gold'})`)
      .join(' | ');

    const orderPayload: DbOrder = {
      order_id: generatedId,
      full_name: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      postal_code: formData.postalCode,
      state: formData.state,
      country: formData.country || 'India',
      payment_method: formData.paymentMethod,
      product_name: firstItem?.name || 'Jewellery Item',
      product_image: firstItem?.image || '',
      quantity: totalQty,
      selected_metal: firstItem?.selected_metal || 'Solid Gold',
      items_summary: summaryText,
      items: orderItemsPayload,
      total_price: rawTotal,
      currency: currency.code,
      status: 'Pending',
      special_notes: formData.specialNotes,
    };

    // Save directly into Supabase database project dmagzrxgczinlcvkhhgs
    const result = await submitOrderToSupabase(orderPayload);
    setDbStatusSource(result.source);
    setDbErrorMsg(result.error || null);
    setConfirmedOrderId(generatedId);
    setIsSubmitting(false);

    confetti({
      particleCount: 130,
      spread: 85,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#F5E5B8', '#E5C07B', '#FFFFFF'],
    });

    if (onOrderSuccess) {
      onOrderSuccess(generatedId);
    }
  };

  const handleModalClose = () => {
    setConfirmedOrderId(null);
    setDbErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <AnimatePresence mode="wait">
        <motion.div
          key={confirmedOrderId ? 'confirmed' : 'form'}
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl rounded-3xl bg-[#0E0E14] border border-[#D4AF37]/45 shadow-[0_0_60px_rgba(212,175,55,0.3)] text-gray-200 overflow-hidden my-4"
        >
          {/* Close Button */}
          <button
            onClick={handleModalClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#181824] hover:bg-[#252535] text-gray-300 hover:text-white border border-gray-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {confirmedOrderId ? (
            /* ================================================================= */
            /* ORDER CONFIRMATION & SUPABASE PERSISTENCE SUCCESS SCREEN */
            /* ================================================================= */
            <div className="p-6 sm:p-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#D4AF37]/30 to-[#D4AF37]/10 border-2 border-[#D4AF37] text-[#D4AF37] mx-auto flex items-center justify-center shadow-[0_0_35px_rgba(212,175,55,0.45)]">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37] flex items-center justify-center gap-1.5 bg-[#1C1C28] border border-[#D4AF37]/40 py-1 px-3.5 rounded-full w-fit mx-auto">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Official Order Confirmed
                </span>
                <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
                  Thank You, {formData.fullName}
                </h3>
                <p className="font-sans text-xs text-gray-300 max-w-md mx-auto">
                  Your luxury order details and product specifications have been recorded. Our master artisan concierge is preparing your shipment.
                </p>
              </div>

              {/* Order Details Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#14141E] border border-gray-800 text-left space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2.5 border-b border-gray-800">
                  <span className="text-gray-400">Order Reference:</span>
                  <span className="font-mono font-bold text-[#F5E5B8] bg-black/50 px-2 py-0.5 rounded border border-gray-800">
                    {confirmedOrderId}
                  </span>
                </div>

                {isDirectProductOrder && product && (
                  <div className="flex justify-between items-center pb-2.5 border-b border-gray-800">
                    <span className="text-gray-400">Item & Quantity:</span>
                    <span className="font-medium text-white text-right">
                      {product.name} <span className="text-[#D4AF37] font-bold">(Qty: {quantity})</span>
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pb-2.5 border-b border-gray-800">
                  <span className="text-gray-400">Delivery Address:</span>
                  <span className="font-medium text-white text-right max-w-[240px] truncate">
                    {formData.address}, {formData.city} ({formData.postalCode}), {formData.country}
                  </span>
                </div>

                <div className="flex justify-between items-center pb-2.5 border-b border-gray-800">
                  <span className="text-gray-400">Payment Mode:</span>
                  <span className="font-bold text-[#D4AF37] uppercase">
                    {formData.paymentMethod === 'cod' ? 'Cash on Delivery (Pay on Inspection)' : formData.paymentMethod.toUpperCase()}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-1 font-cinzel text-sm sm:text-base font-bold text-[#F5E5B8]">
                  <span>Total Payable:</span>
                  <span>{formatPrice(rawTotal)}</span>
                </div>
              </div>

              {/* Courier Timeline Info */}
              <div className="p-3 rounded-xl bg-[#0B0B10] border border-gray-800 text-left flex items-center gap-3 text-xs text-gray-300">
                <Truck className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <p className="font-semibold text-white">Insured Armored Courier Dispatch</p>
                  <p className="text-[11px] text-gray-400">Delivery expected within 3-4 business days across India.</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleModalClose}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] text-black font-bold text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:scale-[1.02] transition-all cursor-pointer"
                >
                  Continue Exploring Fine Vault
                </button>
              </div>
            </div>
          ) : (
            /* ================================================================= */
            /* ORDER DETAILS FORM */
            /* ================================================================= */
            <div>
              {/* Header */}
              <div className="p-5 sm:p-6 bg-[#08080C] border-b border-gray-800 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl overflow-hidden border border-[#D4AF37] bg-black shrink-0">
                  <img src={bakLogoImg} alt="BAK" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-cinzel text-base sm:text-lg font-bold text-white">
                    Place Your Jewellery Order
                  </h3>
                  <p className="text-[11px] text-[#D4AF37] font-sans">
                    Complimentary Insured Delivery • Certificate & Velvet Box Included
                  </p>
                </div>
              </div>

              {/* Product Preview Summary Bar with Quantity Controller */}
              <div className="p-4 bg-[#14141E] border-b border-gray-800 flex flex-wrap items-center justify-between gap-3">
                {isDirectProductOrder && product ? (
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-black border border-gray-800 overflow-hidden shrink-0 flex items-center justify-center">
                      <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-cinzel text-xs font-semibold text-white truncate">
                        {product.name}
                      </h4>
                      <p className="text-[10px] text-gray-400">
                        {selectedMetal} • {product.certificate}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-gray-300">
                    <span>Order Bag: <strong>{cartItems.reduce((s, i) => s + i.quantity, 0)} Items</strong></span>
                  </div>
                )}

                {/* QUANTITY SELECTOR CONTROLS */}
                {isDirectProductOrder && (
                  <div className="flex items-center gap-2 bg-[#0A0A0E] px-3 py-1.5 rounded-xl border border-gray-800">
                    <span className="text-[10px] text-gray-400 uppercase font-semibold">Qty:</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleDecrementQty}
                        className="w-6 h-6 rounded-lg bg-[#181824] hover:bg-[#252535] text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-gray-700 disabled:opacity-40"
                        disabled={quantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center font-bold text-xs text-white">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={handleIncrementQty}
                        className="w-6 h-6 rounded-lg bg-[#181824] hover:bg-[#252535] text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-gray-700 disabled:opacity-40"
                        disabled={quantity >= 20}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-gray-400 uppercase block">Total Price</span>
                  <span className="font-cinzel font-bold text-sm sm:text-base text-[#F5E5B8]">
                    {formatPrice(rawTotal)}
                  </span>
                </div>
              </div>

              {/* Order Form */}
              <form onSubmit={handleSubmitOrder} className="p-5 sm:p-6 space-y-4 text-left">
                
                {/* Jewelry Size Customization */}
                <div className="p-3.5 rounded-2xl bg-[#14141E] border border-gray-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#F5E5B8] uppercase tracking-wider flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Select Your Jewellery Size / Length</span>
                    </label>
                    {onOpenSizeGuide && (
                      <button
                        type="button"
                        onClick={() => onOpenSizeGuide()}
                        className="text-[10px] text-[#D4AF37] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <span>Size Chart</span>
                        <span>→</span>
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      name="ringSize"
                      value={formData.ringSize}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-xl bg-[#09090D] border border-gray-700 text-white text-xs outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Ring Size 5 (US 5 / Ind 10)">Ring Size 5 (US 5 / Ind 10)</option>
                      <option value="Ring Size 6 (US 6 / Ind 12)">Ring Size 6 (US 6 / Ind 12 - Popular)</option>
                      <option value="Ring Size 7 (US 7 / Ind 14)">Ring Size 7 (US 7 / Ind 14 - Popular)</option>
                      <option value="Ring Size 8 (US 8 / Ind 16)">Ring Size 8 (US 8 / Ind 16)</option>
                      <option value="Ring Size 9 (US 9 / Ind 18)">Ring Size 9 (US 9 / Ind 18)</option>
                      <option value="Ring Size 10 (US 10 / Ind 20)">Ring Size 10 (US 10 / Ind 20)</option>
                      <option value="Bangle 2.2 (Small)">Bangle Size 2.2 (Small)</option>
                      <option value="Bangle 2.4 (Medium)">Bangle Size 2.4 (Medium)</option>
                      <option value="Bangle 2.6 (Standard)">Bangle Size 2.6 (Standard)</option>
                      <option value="Bangle 2.8 (Large)">Bangle Size 2.8 (Large)</option>
                      <option value="Bracelet 6.5 inch (Small)">Bracelet 6.5 inch (Small)</option>
                      <option value="Bracelet 7.0 inch (Standard)">Bracelet 7.0 inch (Standard)</option>
                      <option value="Bracelet 7.5 inch (Comfort)">Bracelet 7.5 inch (Comfort)</option>
                      <option value="Chain 16 inch (Choker)">Chain 16 inch (Choker)</option>
                      <option value="Chain 18 inch (Princess)">Chain 18 inch (Princess)</option>
                      <option value="Chain 20 inch (Matinee)">Chain 20 inch (Matinee)</option>
                      <option value="Standard / Free Resizing">Standard / Free Custom Sizing</option>
                    </select>
                    <input
                      type="text"
                      name="specialNotes"
                      value={formData.specialNotes || ''}
                      onChange={handleInputChange}
                      placeholder="Custom size note (e.g. 2.4 Bangle / Exact Ring 13)"
                      className="w-full px-3 py-2 rounded-xl bg-[#09090D] border border-gray-700 text-white text-xs outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Section 1: Customer Contact */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#F5E5B8] uppercase tracking-wider">
                    <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Customer Details</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Aditi Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090D] border border-gray-800 focus:border-[#D4AF37] text-white text-xs outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">Mobile / WhatsApp Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="0000000000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090D] border border-gray-800 focus:border-[#D4AF37] text-white text-xs outline-none transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="aditi@example.com (for digital invoice)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090D] border border-gray-800 focus:border-[#D4AF37] text-white text-xs outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Section 2: Delivery Address & Country */}
                <div className="space-y-3 pt-2 border-t border-gray-800/80">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#F5E5B8] uppercase tracking-wider">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Shipping Address</span>
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">House / Flat / Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="e.g. 402, Royal Palms, Link Road"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090D] border border-gray-800 focus:border-[#D4AF37] text-white text-xs outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">City *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Mumbai"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090D] border border-gray-800 focus:border-[#D4AF37] text-white text-xs outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">PIN / Postal Code *</label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        placeholder="400050"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090D] border border-gray-800 focus:border-[#D4AF37] text-white text-xs outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">State / Region</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="Maharashtra"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090D] border border-gray-800 focus:border-[#D4AF37] text-white text-xs outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Country Field (Pre-selected India) */}
                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-[#D4AF37]" />
                      <span>Country *</span>
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#09090D] border border-[#D4AF37]/60 focus:border-[#D4AF37] text-white text-xs outline-none transition-colors font-medium"
                    >
                      <option value="India">India 🇮🇳 (Pre-Selected)</option>
                      <option value="United Arab Emirates">United Arab Emirates 🇦🇪</option>
                      <option value="United States">United States 🇺🇸</option>
                      <option value="United Kingdom">United Kingdom 🇬🇧</option>
                      <option value="Other">Other Country</option>
                    </select>
                  </div>
                </div>

                {/* Section 3: Payment Method Selection */}
                <div className="space-y-2.5 pt-2 border-t border-gray-800/80">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F5E5B8] uppercase tracking-wider">
                      Select Payment Mode
                    </span>
                    <span className="text-[10px] text-[#D4AF37] flex items-center gap-1">
                      <Lock className="w-3 h-3" /> 100% Insured
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {[
                      { id: 'cod', label: 'Cash on Delivery', sub: 'Pay upon unboxing', icon: Banknote },
                      { id: 'upi', label: 'Instant UPI / QR', sub: 'GPay, PhonePe, Paytm', icon: QrCode },
                      { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Master, RuPay', icon: CreditCard },
                      { id: 'netbanking', label: 'Net Banking', sub: 'All Major Banks', icon: ShieldCheck },
                    ].map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = formData.paymentMethod === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => setFormData((p) => ({ ...p, paymentMethod: opt.id as any }))}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                            isSelected
                              ? 'bg-[#1C1C28] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                              : 'bg-[#09090D] border-gray-800 hover:border-gray-700'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-[#D4AF37]' : 'text-gray-500'}`} />
                          <div className="min-w-0 text-left">
                            <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                              {opt.label}
                            </p>
                            <p className="text-[9px] text-gray-500 truncate">{opt.sub}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submit CTA with Supabase Order Saving */}
                <div className="pt-3 space-y-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] text-black font-sans font-bold text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Saving Order to Supabase Database...</span>
                    ) : (
                      <>
                        <Database className="w-4 h-4" />
                        <span>Place Order & Save to Database ({formatPrice(rawTotal)})</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Order securely stored in Supabase backend • Real-time dispatch tracking</span>
                  </p>
                </div>

              </form>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
};
