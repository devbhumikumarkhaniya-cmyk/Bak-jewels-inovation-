export interface Product {
  id: string;
  name: string;
  category: 'rings' | 'necklaces' | 'earrings' | 'bangles' | 'mangalsutra' | 'pendants' | 'bracelets';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  secondaryImage?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  metal: '18K Yellow Gold' | '18K Rose Gold' | '18K White Gold' | 'Platinum 950';
  metalOptions: Array<'18K Yellow Gold' | '18K Rose Gold' | '18K White Gold' | 'Platinum 950'>;
  diamondCarat?: string;
  diamondClarity?: string;
  gemstone?: string;
  certificate: 'IGI Certified' | 'GIA Certified' | 'SGL Certified';
  description: string;
  details: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedMetal: string;
  selectedSize?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  image: string;
  itemCount: number;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // relative to USD
}

export type Currency = CurrencyConfig;
