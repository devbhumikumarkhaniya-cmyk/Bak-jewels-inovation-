import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShoppingBag,
  PlusCircle,
  Database,
  Trash2,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  RefreshCw,
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  LogOut,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Currency } from '../types';
import {
  fetchSupabaseOrders,
  fetchSupabaseProducts,
  addProductToSupabase,
  deleteProductFromSupabase,
  testSupabaseConnection,
  DbOrder
} from '../lib/supabase';

interface AdminPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductsUpdated?: () => void;
  currency: Currency;
  allProducts: Product[];
}

const AUTHORIZED_EMAIL = 'devbhumikumarkhaniya@gmail.com';
const AUTHORIZED_PASSWORD = '72*0*19*23*5*28';

export const AdminPortalModal: React.FC<AdminPortalModalProps> = ({
  isOpen,
  onClose,
  onProductsUpdated,
  currency,
  allProducts,
}) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active Tab: 'orders' | 'add-product' | 'inventory' | 'diagnostics'
  const [activeTab, setActiveTab] = useState<'orders' | 'add-product' | 'inventory' | 'diagnostics'>('orders');

  // Orders state
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Product form state
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState<'rings' | 'bracelets' | 'bangles' | 'earrings' | 'necklaces'>('rings');
  const [newProductPrice, setNewProductPrice] = useState('2450');
  const [newProductImage, setNewProductImage] = useState('https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80');
  const [newProductMetal, setNewProductMetal] = useState('18K Yellow Gold');
  const [newProductCertificate, setNewProductCertificate] = useState('IGI Certified & BIS Hallmarked');
  const [newProductDesc, setNewProductDesc] = useState('Handcrafted solid gold haute joaillerie featuring certified gemstones with pristine optical symmetry.');
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [productSuccessMsg, setProductSuccessMsg] = useState('');

  // Diagnostic state
  const [diagResult, setDiagResult] = useState<{
    success: boolean;
    ordersCount?: number;
    message: string;
    details?: string;
  } | null>(null);
  const [isTestingDb, setIsTestingDb] = useState(false);

  // Load orders when authenticated & opened
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadOrders();
    }
  }, [isOpen, isAuthenticated]);

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const data = await fetchSupabaseOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);

    setTimeout(() => {
      const cleanEmail = emailInput.trim().toLowerCase();
      const cleanPass = passwordInput.trim();

      if (cleanEmail === AUTHORIZED_EMAIL.toLowerCase() && cleanPass === AUTHORIZED_PASSWORD) {
        setIsAuthenticated(true);
        setAuthError('');
        loadOrders();
      } else {
        setAuthError('Invalid email or password. Access is strictly restricted to the store owner.');
      }
      setAuthLoading(false);
    }, 400);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmailInput('');
    setPasswordInput('');
    setAuthError('');
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewProductImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePublishProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim() || !newProductPrice || !newProductImage.trim()) {
      alert('Please provide Product Name, Price, and an Image URL or Upload.');
      return;
    }

    setIsSubmittingProduct(true);
    setProductSuccessMsg('');

    const newProd: Product = {
      id: `prod-custom-${Date.now()}`,
      name: newProductName.trim(),
      category: newProductCategory,
      categoryLabel: 'Haute Joaillerie Exclusive',
      price: parseFloat(newProductPrice) || 1500,
      originalPrice: (parseFloat(newProductPrice) || 1500) * 1.25,
      rating: 5.0,
      reviewsCount: 14,
      image: newProductImage.trim(),
      secondaryImage: newProductImage.trim(),
      isNew: true,
      isBestSeller: true,
      metal: newProductMetal,
      metalOptions: ['18K Yellow Gold', '18K Rose Gold', '18K White Gold', 'Platinum 950'],
      diamondCarat: '1.25 CT VVS1',
      diamondClarity: 'Flawless VVS1',
      certificate: newProductCertificate,
      description: newProductDesc.trim(),
      details: [
        'Solid 18K Certified Gold',
        'Official BIS Hallmarking stamp',
        'Lifetime polishing and authenticity guarantee',
      ],
    };

    try {
      await addProductToSupabase(newProd);
      setProductSuccessMsg(`"${newProductName}" successfully published to live website and Supabase!`);
      if (onProductsUpdated) {
        onProductsUpdated();
      }
      // Reset some fields
      setNewProductName('');
      setNewProductPrice('2450');
    } catch (err: any) {
      alert('Error saving product: ' + (err?.message || 'Network error'));
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (prodId: string) => {
    if (window.confirm('Are you sure you want to remove this product from the live catalog?')) {
      await deleteProductFromSupabase(prodId);
      if (onProductsUpdated) {
        onProductsUpdated();
      }
    }
  };

  const handleTestDatabase = async () => {
    setIsTestingDb(true);
    try {
      const res = await testSupabaseConnection();
      setDiagResult(res);
    } catch (err: any) {
      setDiagResult({
        success: false,
        message: 'Connection failed',
        details: err?.message,
      });
    } finally {
      setIsTestingDb(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="relative w-full max-w-5xl bg-[#0D0D12] text-gray-100 border border-[#D4AF37]/40 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#D4AF37]/25 bg-[#12121A] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1C1C28] border border-[#D4AF37]/50 flex items-center justify-center text-[#D4AF37]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-white">
                  BAK JEWELS <span className="text-[#D4AF37] font-sans text-xs tracking-widest uppercase ml-1">Owner Admin Portal</span>
                </h2>
                <p className="text-[11px] text-gray-400">
                  {isAuthenticated ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Logged in as: {AUTHORIZED_EMAIL}
                    </span>
                  ) : (
                    'Confidential Management Console'
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 text-xs font-semibold transition-all cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#1A1A24] hover:bg-[#252535] text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* MAIN BODY */}
          {!isAuthenticated ? (
            /* ================= LOGIN VIEW ================= */
            <div className="p-6 sm:p-12 max-w-md mx-auto w-full my-auto flex flex-col justify-center">
              <div className="text-center mb-8 space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1C1C28] to-[#121218] border border-[#D4AF37]/50 mx-auto flex items-center justify-center text-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.2)]">
                  <Lock className="w-7 h-7" />
                </div>
                <h3 className="font-cinzel text-2xl font-bold text-white tracking-wide">Owner Authentication</h3>
                <p className="text-xs text-gray-400 font-light">
                  Please enter your authorized store owner credentials to access Supabase live orders and publish products.
                </p>
              </div>

              {authError && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Email input */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1.5">
                    Owner Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="e.x. 00000@gmail.com"
                      className="w-full bg-[#171722] text-white placeholder-gray-500 border border-gray-700 focus:border-[#D4AF37] rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-gray-300 mb-1.5">
                    Master Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#D4AF37]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder="Enter master password"
                      className="w-full bg-[#171722] text-white placeholder-gray-500 border border-gray-700 focus:border-[#D4AF37] rounded-xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] text-black font-sans font-bold text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all cursor-pointer disabled:opacity-50"
                >
                  {authLoading ? 'Verifying Credentials...' : 'Unlock Admin Console'}
                </button>
              </form>
            </div>
          ) : (
            /* ================= AUTHENTICATED DASHBOARD ================= */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 px-6 py-2.5 bg-[#101017] border-b border-gray-800 overflow-x-auto shrink-0">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                    activeTab === 'orders'
                      ? 'bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                      : 'bg-[#181822] text-gray-300 hover:text-white hover:bg-[#20202E]'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Customer Orders ({orders.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('add-product')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                    activeTab === 'add-product'
                      ? 'bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                      : 'bg-[#181822] text-gray-300 hover:text-white hover:bg-[#20202E]'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Publish Product</span>
                </button>

                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                    activeTab === 'inventory'
                      ? 'bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                      : 'bg-[#181822] text-gray-300 hover:text-white hover:bg-[#20202E]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Inventory Catalog ({allProducts.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('diagnostics')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
                    activeTab === 'diagnostics'
                      ? 'bg-[#D4AF37] text-black shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                      : 'bg-[#181822] text-gray-300 hover:text-white hover:bg-[#20202E]'
                  }`}
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Supabase Status</span>
                </button>
              </div>

              {/* TAB CONTENT AREA */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* ---------- TAB 1: ORDERS DASHBOARD ---------- */}
                {activeTab === 'orders' && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-cinzel text-lg font-bold text-white flex items-center gap-2">
                          <span>Live Customer Orders</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#1C1C28] border border-[#D4AF37]/50 text-[#D4AF37] text-xs font-mono">
                            {orders.length} Total
                          </span>
                        </h3>
                        <p className="text-xs text-gray-400">
                          Directly synchronized with Supabase database table `orders`.
                        </p>
                      </div>

                      <button
                        onClick={loadOrders}
                        disabled={isLoadingOrders}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1C1C28] hover:bg-[#252535] border border-gray-700 text-xs font-semibold text-gray-200 hover:text-white transition-all cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOrders ? 'animate-spin text-[#D4AF37]' : ''}`} />
                        <span>Refresh Orders</span>
                      </button>
                    </div>

                    {isLoadingOrders ? (
                      <div className="py-20 text-center text-gray-400 space-y-3">
                        <RefreshCw className="w-8 h-8 mx-auto text-[#D4AF37] animate-spin" />
                        <p className="text-sm">Fetching real-time orders from Supabase...</p>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="py-16 text-center border border-dashed border-gray-800 rounded-2xl bg-[#101016] space-y-3">
                        <ShoppingBag className="w-10 h-10 mx-auto text-gray-600" />
                        <h4 className="text-sm font-semibold text-gray-300">No Orders Placed Yet</h4>
                        <p className="text-xs text-gray-500 max-w-sm mx-auto">
                          When customers order jewellery on the storefront, their name, phone number, address, product photo, and details will instantly appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {orders.map((order, idx) => {
                          const firstItem = order.items?.[0];
                          const orderImg = order.product_image || firstItem?.image;
                          const orderProdName = order.product_name || firstItem?.name || 'Jewellery Piece';
                          const orderQty = order.quantity || order.items?.reduce((s, it) => s + it.quantity, 0) || 1;
                          const formattedPrice = (order.total_price * currency.rate).toLocaleString('en-US', {
                            maximumFractionDigits: 0,
                          });

                          return (
                            <div
                              key={order.order_id || idx}
                              className="bg-[#13131C] border border-gray-800 hover:border-[#D4AF37]/50 rounded-2xl p-5 space-y-4 transition-all shadow-md"
                            >
                              {/* Order Top Bar */}
                              <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
                                <div>
                                  <span className="font-mono text-xs font-bold text-[#D4AF37]">
                                    #{order.order_id}
                                  </span>
                                  <div className="text-[11px] text-gray-400 flex items-center gap-1.5 mt-0.5">
                                    <Clock className="w-3 h-3 text-gray-500" />
                                    <span>
                                      {order.created_at ? new Date(order.created_at).toLocaleString() : 'Just now'}
                                    </span>
                                  </div>
                                </div>

                                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-300 border border-emerald-800">
                                  {order.status || 'Confirmed'}
                                </span>
                              </div>

                              {/* Customer Details */}
                              <div className="bg-[#0C0C12] p-3.5 rounded-xl border border-gray-850 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                                    {order.full_name}
                                  </span>
                                  <a
                                    href={`tel:${order.phone}`}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1C1C28] hover:bg-[#28283A] text-emerald-400 text-xs font-semibold border border-emerald-900/60 transition-colors"
                                  >
                                    <Phone className="w-3 h-3" />
                                    <span>{order.phone}</span>
                                  </a>
                                </div>

                                <div className="text-xs text-gray-300 flex items-start gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                                  <span>
                                    {order.address}, {order.city} {order.postal_code} {order.state ? `(${order.state})` : ''} - {order.country}
                                  </span>
                                </div>
                              </div>

                              {/* Ordered Items with Direct Image */}
                              <div className="flex items-center gap-3.5 bg-[#171722] p-3 rounded-xl border border-gray-800">
                                {orderImg ? (
                                  <img
                                    src={orderImg}
                                    alt={orderProdName}
                                    className="w-16 h-16 object-cover rounded-lg border border-[#D4AF37]/30 shrink-0"
                                  />
                                ) : (
                                  <div className="w-16 h-16 rounded-lg bg-gray-800 flex items-center justify-center text-gray-500 shrink-0">
                                    <ImageIcon className="w-6 h-6" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-bold text-white truncate">{orderProdName}</h4>
                                  <p className="text-[11px] text-gray-400">
                                    Qty: <strong className="text-white">{orderQty}</strong> • {order.selected_metal || '18K Solid Gold'}
                                  </p>
                                  <p className="text-xs font-bold text-[#D4AF37] mt-0.5 font-cinzel">
                                    Total: {currency.symbol} {formattedPrice} {currency.code}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* ---------- TAB 2: ADD PRODUCT ---------- */}
                {activeTab === 'add-product' && (
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div>
                      <h3 className="font-cinzel text-lg font-bold text-white">Publish New Jewellery Product</h3>
                      <p className="text-xs text-gray-400">
                        Fill in the details below to instantly publish the product to your live storefront and Supabase database.
                      </p>
                    </div>

                    {productSuccessMsg && (
                      <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span>{productSuccessMsg}</span>
                      </div>
                    )}

                    <form onSubmit={handlePublishProduct} className="space-y-4">
                      {/* Product Name */}
                      <div>
                        <label className="block text-xs uppercase font-semibold text-gray-300 mb-1">
                          Product Name / Title *
                        </label>
                        <input
                          type="text"
                          required
                          value={newProductName}
                          onChange={(e) => setNewProductName(e.target.value)}
                          placeholder="e.g. Royal Solitaire Diamond Ring"
                          className="w-full bg-[#161622] text-white border border-gray-700 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                        />
                      </div>

                      {/* Category & Price */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase font-semibold text-gray-300 mb-1">
                            Category *
                          </label>
                          <select
                            value={newProductCategory}
                            onChange={(e: any) => setNewProductCategory(e.target.value)}
                            className="w-full bg-[#161622] text-white border border-gray-700 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                          >
                            <option value="rings">Rings (अंगूठियां)</option>
                            <option value="necklaces">Necklaces (हार / पेंडेंट)</option>
                            <option value="bracelets">Bracelets (कंगन / ब्रेसलेट)</option>
                            <option value="bangles">Bangles (चूड़ियां)</option>
                            <option value="earrings">Earrings (झुमके / टॉप्स)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-semibold text-gray-300 mb-1">
                            Price in USD ($) *
                          </label>
                          <input
                            type="number"
                            required
                            min="10"
                            step="1"
                            value={newProductPrice}
                            onChange={(e) => setNewProductPrice(e.target.value)}
                            placeholder="2450"
                            className="w-full bg-[#161622] text-white border border-gray-700 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      {/* Image Upload & URL */}
                      <div className="space-y-2">
                        <label className="block text-xs uppercase font-semibold text-gray-300">
                          Product Image / Photo *
                        </label>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          {/* Live Preview */}
                          <div className="w-24 h-24 rounded-xl bg-[#171720] border border-[#D4AF37]/40 overflow-hidden shrink-0 flex items-center justify-center">
                            {newProductImage ? (
                              <img
                                src={newProductImage}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-gray-500" />
                            )}
                          </div>

                          <div className="flex-1 space-y-2 w-full">
                            {/* File Upload from Gallery */}
                            <div>
                              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#20202E] hover:bg-[#2A2A3C] text-gray-200 border border-gray-700 text-xs font-semibold cursor-pointer transition-colors">
                                <ImageIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                                <span>Upload Photo from Device Gallery</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageFileUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>

                            {/* Or paste Image URL */}
                            <input
                              type="url"
                              value={newProductImage}
                              onChange={(e) => setNewProductImage(e.target.value)}
                              placeholder="Or paste HD Image URL (e.g. https://...)"
                              className="w-full bg-[#161622] text-white border border-gray-700 focus:border-[#D4AF37] rounded-xl px-4 py-2 text-xs focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Gold & Certification */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs uppercase font-semibold text-gray-300 mb-1">
                            Metal Specification
                          </label>
                          <input
                            type="text"
                            value={newProductMetal}
                            onChange={(e) => setNewProductMetal(e.target.value)}
                            placeholder="18K Yellow Gold"
                            className="w-full bg-[#161622] text-white border border-gray-700 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase font-semibold text-gray-300 mb-1">
                            Certificate Authority
                          </label>
                          <input
                            type="text"
                            value={newProductCertificate}
                            onChange={(e) => setNewProductCertificate(e.target.value)}
                            placeholder="IGI Certified & BIS Hallmark"
                            className="w-full bg-[#161622] text-white border border-gray-700 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-xs uppercase font-semibold text-gray-300 mb-1">
                          Product Description
                        </label>
                        <textarea
                          rows={3}
                          value={newProductDesc}
                          onChange={(e) => setNewProductDesc(e.target.value)}
                          placeholder="Exquisite craftsmanship with certified natural brilliance..."
                          className="w-full bg-[#161622] text-white border border-gray-700 focus:border-[#D4AF37] rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none"
                        />
                      </div>

                      {/* Submit button */}
                      <button
                        type="submit"
                        disabled={isSubmittingProduct}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C5A059] text-black font-sans font-bold text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isSubmittingProduct ? 'Publishing to Store...' : 'Publish Product to Live Website'}
                      </button>
                    </form>
                  </div>
                )}

                {/* ---------- TAB 3: INVENTORY ---------- */}
                {activeTab === 'inventory' && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="font-cinzel text-lg font-bold text-white">Active Product Inventory</h3>
                      <p className="text-xs text-gray-400">
                        Manage and review all jewellery items currently visible on your store.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {allProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="bg-[#14141E] border border-gray-800 rounded-xl p-4 flex gap-3 items-center group relative overflow-hidden"
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-16 h-16 object-cover rounded-lg border border-gray-700 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">{prod.name}</h4>
                            <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] block">
                              {prod.category} • {prod.metal || '18K Gold'}
                            </span>
                            <span className="text-xs font-bold text-white font-cinzel">
                              ${prod.price.toLocaleString()}
                            </span>
                          </div>

                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="w-8 h-8 rounded-lg bg-red-950/40 hover:bg-red-900 border border-red-800/60 text-red-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ---------- TAB 4: DIAGNOSTICS ---------- */}
                {activeTab === 'diagnostics' && (
                  <div className="max-w-xl mx-auto space-y-6">
                    <div>
                      <h3 className="font-cinzel text-lg font-bold text-white">Supabase Cloud Database Diagnostics</h3>
                      <p className="text-xs text-gray-400">
                        Check real-time connectivity between this store applet and your Supabase PostgreSQL cluster.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#12121B] border border-gray-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-300">Database Engine:</span>
                        <span className="text-xs font-mono text-emerald-400">PostgreSQL (Supabase Cloud)</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-300">Project Endpoint:</span>
                        <span className="text-xs font-mono text-gray-400">dmagzrxgczinlcvkhhgs.supabase.co</span>
                      </div>

                      <button
                        onClick={handleTestDatabase}
                        disabled={isTestingDb}
                        className="w-full py-3 rounded-xl bg-[#202030] hover:bg-[#2A2A40] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isTestingDb ? 'animate-spin' : ''}`} />
                        <span>{isTestingDb ? 'Testing Connection...' : 'Run Live Diagnostic Test'}</span>
                      </button>

                      {diagResult && (
                        <div
                          className={`p-4 rounded-xl text-xs space-y-1 ${
                            diagResult.success
                              ? 'bg-emerald-950/50 border border-emerald-800 text-emerald-200'
                              : 'bg-red-950/50 border border-red-800 text-red-200'
                          }`}
                        >
                          <div className="font-bold flex items-center gap-1.5">
                            {diagResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-red-400" />}
                            <span>{diagResult.message}</span>
                          </div>
                          {diagResult.ordersCount !== undefined && (
                            <p className="text-[11px] text-gray-300">
                              Active orders in database: <strong>{diagResult.ordersCount}</strong>
                            </p>
                          )}
                          {diagResult.details && (
                            <p className="text-[10px] text-gray-400 font-mono mt-1">{diagResult.details}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
