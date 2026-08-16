/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrustBadges } from './components/TrustBadges';
import { CategorySection } from './components/CategorySection';
import { BestSellersSection } from './components/BestSellersSection';
import { PromoBanner } from './components/PromoBanner';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';
import { OrderModal } from './components/OrderModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { IntroSplash } from './components/IntroSplash';
import { BEST_SELLER_PRODUCTS, CURRENCIES } from './data/products';
import { fetchSupabaseProducts } from './lib/supabase';
import { Product, CartItem, CurrencyCode } from './types';
import confetti from 'canvas-confetti';
import { Check, Heart, X } from 'lucide-react';

export default function App() {
  // Splash Intro Animation State
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // Dynamic Products State (Merged with Supabase)
  const [productsList, setProductsList] = useState<Product[]>(BEST_SELLER_PRODUCTS);

  // Load products from Supabase on mount
  const refreshProducts = useCallback(async () => {
    try {
      const customProducts = await fetchSupabaseProducts();
      if (customProducts && customProducts.length > 0) {
        // Merge custom products with defaults, avoiding duplicates
        const customIds = new Set(customProducts.map((p) => p.id));
        const remainingDefaults = BEST_SELLER_PRODUCTS.filter((p) => !customIds.has(p.id));
        setProductsList([...customProducts, ...remainingDefaults]);
      } else {
        setProductsList(BEST_SELLER_PRODUCTS);
      }
    } catch (err) {
      console.warn('Could not load Supabase products, using defaults:', err);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // State management
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: BEST_SELLER_PRODUCTS[0],
      quantity: 1,
      selectedMetal: '18K Rose Gold',
      selectedSize: 'Size 6 (Standard)',
    },
  ]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([
    BEST_SELLER_PRODUCTS[0].id,
    BEST_SELLER_PRODUCTS[1].id,
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeCurrency, setActiveCurrency] = useState<CurrencyCode>('USD');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  
  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [sizeGuideCategory, setSizeGuideCategory] = useState<'rings' | 'bangles' | 'bracelets' | 'necklaces'>('rings');
  
  // Order Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderTargetProduct, setOrderTargetProduct] = useState<Product | null>(null);
  const [orderTargetMetal, setOrderTargetMetal] = useState<string>('18K Rose Gold');
  const [orderTargetSize, setOrderTargetSize] = useState<string>('Ring Size 6 (US 6 / Ind 12 - Popular)');
  const [orderTargetCartItems, setOrderTargetCartItems] = useState<CartItem[]>([]);
  
  // Toast notification
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string; type: 'cart' | 'wishlist' } | null>(null);

  const showToast = (title: string, subtitle: string, type: 'cart' | 'wishlist') => {
    setToastMessage({ title, subtitle, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleOpenSizeGuide = (category?: 'rings' | 'bangles' | 'bracelets' | 'necklaces') => {
    if (category) {
      setSizeGuideCategory(category);
    }
    setIsSizeGuideOpen(true);
  };

  // Direct Order Flow Trigger
  const handleOpenOrderForProduct = (product: Product, metal?: string, size?: string) => {
    setOrderTargetProduct(product);
    setOrderTargetMetal(metal || product.metal);
    if (size) {
      setOrderTargetSize(size);
    } else {
      if (product.category === 'rings') setOrderTargetSize('Ring Size 6 (US 6 / Ind 12 - Popular)');
      else if (product.category === 'bangles') setOrderTargetSize('Bangle 2.4 (Medium)');
      else if (product.category === 'bracelets') setOrderTargetSize('Bracelet 7.0 inch (Standard)');
      else if (product.category === 'necklaces') setOrderTargetSize('Chain 18 inch (Princess)');
      else setOrderTargetSize('Standard / Free Resizing');
    }
    setOrderTargetCartItems([]);
    setIsOrderModalOpen(true);
  };

  const handleOpenOrderForCart = () => {
    if (cartItems.length === 0) return;
    setOrderTargetProduct(null);
    setOrderTargetCartItems(cartItems);
    setIsCartOpen(false);
    setIsOrderModalOpen(true);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1, metal?: string, size?: string) => {
    const chosenMetal = metal || product.metal;
    const chosenSize = size || 'Standard';

    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedMetal === chosenMetal &&
          item.selectedSize === chosenSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prev,
        {
          product,
          quantity,
          selectedMetal: chosenMetal,
          selectedSize: chosenSize,
        },
      ];
    });

    setRecentlyAddedId(product.id);
    setTimeout(() => setRecentlyAddedId(null), 2000);

    showToast('Added to Imperial Bag', `${product.name} has been added.`, 'cart');

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.85 },
      colors: ['#D4AF37', '#F5E5B8', '#FFFFFF'],
    });
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wishlist operations
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast('Removed from Vault', `${product.name} removed from wishlist.`, 'wishlist');
        return prev.filter((id) => id !== product.id);
      } else {
        showToast('Saved to Vault', `${product.name} added to your private wishlist.`, 'wishlist');
        return [...prev, product.id];
      }
    });
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return productsList;
    return productsList.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, productsList]);

  const wishlistProducts = useMemo(() => {
    return productsList.filter((p) => wishlistIds.includes(p.id));
  }, [wishlistIds, productsList]);

  // Smooth scroll helper
  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#0C0C0E] text-[#F3F4F6] font-sans selection:bg-[#D4AF37] selection:text-[#0C0C0E]">
      
      {/* 0. STARTING CINEMATIC LOGO INTRO ANIMATION */}
      {showIntro && (
        <IntroSplash onComplete={() => setShowIntro(false)} />
      )}

      {/* 1 & 2: TOP ANNOUNCEMENT TICKER & NAVIGATION */}
      <Navbar
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSizeGuide={() => handleOpenSizeGuide()}
        onReplayIntro={() => setShowIntro(true)}
        activeCurrency={activeCurrency}
        onChangeCurrency={setActiveCurrency}
        onNavigateSection={handleNavigateSection}
      />

      <main className="flex-1">
        {/* 3: HERO SECTION (Imperial Noir & Gold Luxury Showcase) */}
        <HeroSection
          onExploreClick={() => handleNavigateSection('bestsellers')}
          onOrderPiece={(visualId) => {
            const matched = productsList.find((p) => p.id === visualId) || productsList[0];
            handleOpenOrderForProduct(matched);
          }}
        />

        {/* 4: TRUST BADGES (Certified Diamonds, Armored Shipping, Lifetime Exchange) */}
        <TrustBadges />

        {/* 5: SHOP BY CATEGORY (Circular Vault Image Rims) */}
        <CategorySection
          selectedCategory={selectedCategory}
          onSelectCategory={(catId) => {
            setSelectedCategory(catId === selectedCategory ? null : catId);
            handleNavigateSection('bestsellers');
          }}
        />

        {/* 6: BEST SELLERS (Product Grid with dual Order Now & Add to Cart + Wishlist) */}
        <BestSellersSection
          products={filteredProducts.length > 0 ? filteredProducts : productsList}
          wishlistIds={wishlistIds}
          recentlyAddedId={recentlyAddedId}
          currency={CURRENCIES[activeCurrency]}
          onAddToCart={(p) => handleAddToCart(p)}
          onOrderNow={(p) => handleOpenOrderForProduct(p)}
          onToggleWishlist={handleToggleWishlist}
          onQuickView={(p) => setQuickViewProduct(p)}
          onViewAllClick={() => setSelectedCategory(null)}
        />

        {/* 7: PROMO BANNER (Bridal & Heirloom Vault Spotlight) */}
        <PromoBanner
          onDiscoverClick={() => handleNavigateSection('bestsellers')}
        />
      </main>

      {/* 9: FOOTER (Exact Highlights: bhumika kumarkhaniya, 8401963367, 00000000, bakjewels7@gmail.com & Owner Portal) */}
      <Footer
        onNavigateSection={handleNavigateSection}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* INTERACTIVE DRAWERS & MODALS */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        currency={CURRENCIES[activeCurrency]}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToOrder={handleOpenOrderForCart}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        currency={CURRENCIES[activeCurrency]}
        onRemoveWishlist={(id) => setWishlistIds((prev) => prev.filter((i) => i !== id))}
        onAddToCart={(p) => handleAddToCart(p)}
        onOrderNow={(p) => handleOpenOrderForProduct(p)}
      />

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        currency={CURRENCIES[activeCurrency]}
        isWishlisted={quickViewProduct ? wishlistIds.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onOpenSizeGuide={(cat) => handleOpenSizeGuide(cat)}
        onOrderNow={(p, metal, size) => {
          setQuickViewProduct(null);
          handleOpenOrderForProduct(p, metal, size);
        }}
      />

      {/* DEDICATED SUPABASE-INTEGRATED ORDER DETAILS MODAL */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        product={orderTargetProduct}
        cartItems={orderTargetCartItems}
        currency={CURRENCIES[activeCurrency]}
        selectedMetal={orderTargetMetal}
        initialSize={orderTargetSize}
        onOpenSizeGuide={(cat) => handleOpenSizeGuide(cat)}
        onOrderSuccess={() => {
          if (orderTargetCartItems.length > 0) {
            handleClearCart();
          }
        }}
      />

      {/* RESPONSIVE JEWELLERY SIZE GUIDE MODAL (Mobile, iPad, Laptop, PC Computer) */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        defaultCategory={sizeGuideCategory}
      />

      {/* PRIVATE OWNER ADMIN PORTAL (PROTECTED BY EMAIL & PASSWORD) */}
      <AdminPortalModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onProductsUpdated={refreshProducts}
        currency={CURRENCIES[activeCurrency]}
        allProducts={productsList}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={productsList}
        currency={CURRENCIES[activeCurrency]}
        onSelectProduct={(p) => setQuickViewProduct(p)}
      />

      {/* Interactive Luxury Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="px-4 py-3 rounded-2xl bg-[#14141A] text-white border border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.4)] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shrink-0">
              {toastMessage.type === 'cart' ? (
                <Check className="w-4 h-4 stroke-[3]" />
              ) : (
                <Heart className="w-4 h-4 fill-black" />
              )}
            </div>
            <div>
              <p className="text-xs font-cinzel font-bold text-[#F5E5B8]">
                {toastMessage.title}
              </p>
              <p className="text-[11px] font-sans text-gray-300">
                {toastMessage.subtitle}
              </p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-gray-400 hover:text-white ml-2 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
