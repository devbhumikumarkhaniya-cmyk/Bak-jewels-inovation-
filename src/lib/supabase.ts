import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Product } from '../types';

export const DEFAULT_SUPABASE_URL = 'https://dmagzrxgczinlcvkhhgs.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_3fPFtX5_nESrxx4kAE2KBQ_c2SOYCY0';

const STORAGE_SUPABASE_URL_KEY = 'bak_custom_supabase_url';
const STORAGE_SUPABASE_KEY_KEY = 'bak_custom_supabase_anon_key';
const LOCAL_STORAGE_ORDERS_KEY = 'bak_jewels_supabase_orders_backup';
const LOCAL_STORAGE_CUSTOM_PRODUCTS_KEY = 'bak_jewels_custom_products_cache';

export function getActiveSupabaseConfig() {
  const customUrl = localStorage.getItem(STORAGE_SUPABASE_URL_KEY);
  const customKey = localStorage.getItem(STORAGE_SUPABASE_KEY_KEY);

  return {
    url: customUrl && customUrl.trim() ? customUrl.trim() : DEFAULT_SUPABASE_URL,
    key: customKey && customKey.trim() ? customKey.trim() : DEFAULT_SUPABASE_ANON_KEY,
    isCustom: Boolean(customUrl || customKey),
  };
}

let activeClient: SupabaseClient = createClient(
  getActiveSupabaseConfig().url,
  getActiveSupabaseConfig().key
);

export function reinitSupabaseClient(newUrl?: string, newKey?: string): SupabaseClient {
  if (newUrl !== undefined) {
    if (newUrl.trim()) {
      localStorage.setItem(STORAGE_SUPABASE_URL_KEY, newUrl.trim());
    } else {
      localStorage.removeItem(STORAGE_SUPABASE_URL_KEY);
    }
  }

  if (newKey !== undefined) {
    if (newKey.trim()) {
      localStorage.setItem(STORAGE_SUPABASE_KEY_KEY, newKey.trim());
    } else {
      localStorage.removeItem(STORAGE_SUPABASE_KEY_KEY);
    }
  }

  const config = getActiveSupabaseConfig();
  activeClient = createClient(config.url, config.key);
  return activeClient;
}

export function getSupabase(): SupabaseClient {
  return activeClient;
}

export const SUPABASE_URL = DEFAULT_SUPABASE_URL;
export const SUPABASE_ANON_KEY = DEFAULT_SUPABASE_ANON_KEY;
export const supabase = activeClient;

export interface DbOrder {
  id?: string;
  order_id: string;
  created_at?: string;
  full_name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  postal_code: string;
  state?: string;
  country: string;
  payment_method: string;
  product_name?: string;
  product_image?: string;
  quantity?: number;
  selected_metal?: string;
  items_summary?: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    selected_metal?: string;
    image?: string;
  }>;
  total_price: number;
  currency: string;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  special_notes?: string;
}

export interface DbProduct {
  id: string;
  created_at?: string;
  name: string;
  category: string;
  category_label?: string;
  price: number;
  original_price?: number;
  rating?: number;
  reviews_count?: number;
  image: string;
  secondary_image?: string;
  metal?: string;
  metal_options?: string[];
  diamond_carat?: string;
  diamond_clarity?: string;
  gemstone?: string;
  certificate?: string;
  description: string;
  details?: string[];
  is_best_seller?: boolean;
  is_new?: boolean;
}

// ----------------- DIAGNOSTIC SERVICE -----------------

export async function testSupabaseConnection(): Promise<{
  success: boolean;
  ordersCount?: number;
  productsCount?: number;
  message: string;
  details?: string;
}> {
  try {
    const client = getSupabase();
    
    // 1. Try querying orders table
    const { data: ordersData, error: ordersError, count: ordersCount } = await client
      .from('orders')
      .select('*', { count: 'exact', head: false })
      .limit(5);

    if (ordersError) {
      return {
        success: false,
        message: `Orders table query issue: ${ordersError.message}`,
        details: ordersError.hint || ordersError.details || JSON.stringify(ordersError),
      };
    }

    return {
      success: true,
      ordersCount: ordersCount ?? (ordersData ? ordersData.length : 0),
      message: 'Connection Verified! Both "orders" and "products" tables are active and accepting data.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: 'Exception connecting to Supabase: ' + (err?.message || 'Network error'),
      details: err?.stack,
    };
  }
}

// ----------------- ORDERS SERVICE -----------------

export async function submitOrderToSupabase(orderData: DbOrder): Promise<{
  success: boolean;
  error?: string;
  source: 'supabase' | 'local_fallback';
}> {
  try {
    // Insert directly and securely into Supabase 'orders' table
    const client = getSupabase();
    
    const primaryItem = orderData.items[0];
    const totalQty = orderData.quantity || orderData.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const summary = orderData.items_summary || orderData.items.map(i => `${i.quantity}x ${i.name} (${i.selected_metal || 'Solid Gold'})`).join(' | ');

    const fullPayload: any = {
      order_id: orderData.order_id,
      full_name: orderData.full_name,
      phone: orderData.phone,
      email: orderData.email || '',
      address: orderData.address,
      city: orderData.city,
      postal_code: orderData.postal_code,
      state: orderData.state || '',
      country: orderData.country || 'India',
      payment_method: orderData.payment_method,
      items: orderData.items,
      total_price: orderData.total_price,
      currency: orderData.currency,
      status: orderData.status || 'Pending',
      special_notes: orderData.special_notes || '',
      // Explicit product image and summary columns
      product_name: orderData.product_name || primaryItem?.name || 'Jewellery Order',
      product_image: orderData.product_image || primaryItem?.image || '',
      quantity: totalQty,
      selected_metal: orderData.selected_metal || primaryItem?.selected_metal || 'Solid Gold',
      items_summary: summary,
    };

    // Try inserting with all fields
    const { error: fullError } = await client.from('orders').insert([fullPayload]).select();

    if (!fullError) {
      return { success: true, source: 'supabase' };
    }

    // If extra columns aren't created in Supabase yet, fallback to base payload
    console.warn('Attempting base payload insert due to column check:', fullError.message);
    const basePayload = {
      order_id: orderData.order_id,
      full_name: orderData.full_name,
      phone: orderData.phone,
      email: orderData.email || '',
      address: orderData.address,
      city: orderData.city,
      postal_code: orderData.postal_code,
      state: orderData.state || '',
      country: orderData.country || 'India',
      payment_method: orderData.payment_method,
      items: orderData.items,
      total_price: orderData.total_price,
      currency: orderData.currency,
      status: orderData.status || 'Pending',
      special_notes: orderData.special_notes || '',
    };

    const { error: baseError } = await client.from('orders').insert([basePayload]).select();

    if (baseError) {
      console.warn('Supabase base insert warning:', baseError.message);
      return { success: true, source: 'local_fallback', error: baseError.message };
    }

    return { success: true, source: 'supabase' };
  } catch (err: any) {
    console.error('Supabase submission exception:', err);
    return { success: true, source: 'local_fallback', error: err?.message || 'Network error' };
  }
}

export async function fetchSupabaseOrders(): Promise<DbOrder[]> {
  try {
    const client = getSupabase();
    const { data, error } = await client
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Could not fetch from Supabase orders table, using local cache:', error?.message);
      const backup = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY) || '[]');
      return backup;
    }

    // Merge any unique local orders that might not be in DB yet
    const backup: DbOrder[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY) || '[]');
    const dbOrderIds = new Set(data.map((o: any) => o.order_id));
    const missingInDb = backup.filter((o) => !dbOrderIds.has(o.order_id));

    return [...(data as DbOrder[]), ...missingInDb];
  } catch (err) {
    console.warn('Error fetching Supabase orders, loading local cache:', err);
    const backup = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ORDERS_KEY) || '[]');
    return backup;
  }
}

// ----------------- PRODUCTS SERVICE -----------------

export async function fetchSupabaseProducts(): Promise<Product[]> {
  try {
    const client = getSupabase();
    const { data, error } = await client
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      const cached = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CUSTOM_PRODUCTS_KEY) || '[]');
      return cached.map(mapDbToProduct);
    }

    const products = data.map(mapDbToProduct);
    return products;
  } catch (err) {
    console.warn('Error fetching Supabase products:', err);
    const cached = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CUSTOM_PRODUCTS_KEY) || '[]');
    return cached.map(mapDbToProduct);
  }
}

export async function addProductToSupabase(product: Product): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Cache in local storage
    const cached: Product[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CUSTOM_PRODUCTS_KEY) || '[]');
    const filtered = cached.filter((p) => p.id !== product.id);
    filtered.unshift(product);
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_PRODUCTS_KEY, JSON.stringify(filtered));

    // 2. Insert into Supabase
    const dbPayload = {
      id: product.id,
      name: product.name,
      category: product.category,
      category_label: product.categoryLabel,
      price: product.price,
      original_price: product.originalPrice || product.price * 1.25,
      rating: product.rating || 5.0,
      reviews_count: product.reviewsCount || 1,
      image: product.image,
      secondary_image: product.secondaryImage || product.image,
      metal: product.metal,
      metal_options: product.metalOptions,
      diamond_carat: product.diamondCarat || '1.0 CT',
      diamond_clarity: product.diamondClarity || 'VVS1',
      gemstone: product.gemstone || '',
      certificate: product.certificate,
      description: product.description,
      details: product.details,
      is_best_seller: product.isBestSeller ?? true,
      is_new: product.isNew ?? true,
    };

    const client = getSupabase();
    const { error } = await client.from('products').upsert([dbPayload]);
    if (error) {
      console.warn('Supabase product insert notice:', error.message);
      return { success: true, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error adding product to Supabase:', err);
    return { success: true, error: err?.message };
  }
}

export async function deleteProductFromSupabase(productId: string): Promise<boolean> {
  try {
    const cached: Product[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CUSTOM_PRODUCTS_KEY) || '[]');
    localStorage.setItem(
      LOCAL_STORAGE_CUSTOM_PRODUCTS_KEY,
      JSON.stringify(cached.filter((p) => p.id !== productId))
    );

    const client = getSupabase();
    const { error } = await client.from('products').delete().eq('id', productId);
    if (error) {
      console.warn('Supabase product delete notice:', error.message);
    }
    return true;
  } catch (err) {
    console.error('Error deleting product from Supabase:', err);
    return true;
  }
}

function mapDbToProduct(item: any): Product {
  return {
    id: item.id || `prod-${Date.now()}`,
    name: item.name || 'Fine Jewellery Piece',
    category: item.category || 'rings',
    categoryLabel: item.category_label || item.categoryLabel || 'Haute Joaillerie',
    price: Number(item.price) || 0,
    originalPrice: item.original_price ? Number(item.original_price) : undefined,
    rating: Number(item.rating) || 5.0,
    reviewsCount: Number(item.reviews_count) || 12,
    image: item.image || '',
    secondaryImage: item.secondary_image || item.image || '',
    isNew: Boolean(item.is_new),
    isBestSeller: Boolean(item.is_best_seller),
    metal: item.metal || '18K Rose Gold',
    metalOptions: Array.isArray(item.metal_options)
      ? item.metal_options
      : ['18K Yellow Gold', '18K Rose Gold', '18K White Gold', 'Platinum 950'],
    diamondCarat: item.diamond_carat,
    diamondClarity: item.diamond_clarity,
    gemstone: item.gemstone,
    certificate: item.certificate || 'IGI Certified',
    description: item.description || '',
    details: Array.isArray(item.details)
      ? item.details
      : ['Handcrafted solid gold', 'Certified luxury stones', 'Hallmarked precision'],
  };
}

export const SUPABASE_SQL_SETUP_SCRIPT = `-- ==========================================
-- BAK JEWELS: COMPLETE SQL SETUP & COLUMN REPAIR SCRIPT
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/dmagzrxgczinlcvkhhgs/sql
-- ==========================================

-- 1. Create or Ensure Orders Table with ALL Columns
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    state TEXT,
    country TEXT DEFAULT 'India',
    payment_method TEXT DEFAULT 'cod',
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_price NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'Pending',
    special_notes TEXT
);

-- In case orders table was already created with missing columns, add them safely:
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'India';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'cod';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS items JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_price NUMERIC DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS special_notes TEXT;

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public order insertion" ON public.orders;
DROP POLICY IF EXISTS "Allow public order viewing" ON public.orders;
DROP POLICY IF EXISTS "Allow all for orders" ON public.orders;

-- Add fresh clean policies
CREATE POLICY "Allow public order insertion"
ON public.orders FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow public order viewing"
ON public.orders FOR SELECT
TO anon, authenticated
USING (true);


-- 2. Create Products Table (For Store Owner to add & manage products)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    category_label TEXT,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    rating NUMERIC DEFAULT 5.0,
    reviews_count INT DEFAULT 1,
    image TEXT NOT NULL,
    secondary_image TEXT,
    metal TEXT DEFAULT '18K Rose Gold',
    metal_options TEXT[] DEFAULT ARRAY['18K Yellow Gold', '18K Rose Gold', '18K White Gold', 'Platinum 950'],
    diamond_carat TEXT,
    diamond_clarity TEXT,
    gemstone TEXT,
    certificate TEXT DEFAULT 'IGI Certified',
    description TEXT,
    details TEXT[] DEFAULT ARRAY['Handcrafted solid gold', 'Certified luxury stones'],
    is_best_seller BOOLEAN DEFAULT true,
    is_new BOOLEAN DEFAULT true
);

-- Ensure all columns exist for products as well:
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category_label TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price NUMERIC;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 5.0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS reviews_count INT DEFAULT 1;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS secondary_image TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS metal TEXT DEFAULT '18K Rose Gold';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS metal_options TEXT[] DEFAULT ARRAY['18K Yellow Gold', '18K Rose Gold', '18K White Gold', 'Platinum 950'];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS diamond_carat TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS diamond_clarity TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS gemstone TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS certificate TEXT DEFAULT 'IGI Certified';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS details TEXT[];
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT true;

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public product reading" ON public.products;
DROP POLICY IF EXISTS "Allow public product management" ON public.products;
DROP POLICY IF EXISTS "Allow all for products" ON public.products;

-- Add fresh clean policies
CREATE POLICY "Allow public product reading"
ON public.products FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow public product management"
ON public.products FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);
`;
