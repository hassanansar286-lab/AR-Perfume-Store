export type FragranceFamily =
  | 'Oriental'
  | 'Woody'
  | 'Floral'
  | 'Fresh'
  | 'Citrus';

export type AudienceCategory = 'Unisex' | 'Men' | 'Women' | 'Gift Set';

export type PerfumeSizeLabel =
  | '10ml'
  | '30ml'
  | '50ml'
  | '100ml'
  | '5 × 50ml Set'
  | '5 × 10ml Set';

export interface SizeVariant {
  size: PerfumeSizeLabel;
  pricePkr: number;
  originalPricePkr?: number;
}

export interface ScentNotes {
  top: string[];
  middle: string[];
  base: string[];
}

export interface ProductReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface PerfumeProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  audience: AudienceCategory;
  fragranceFamily: FragranceFamily;
  secondaryFamily?: FragranceFamily;
  badgeText?: string;
  isGiftSet?: boolean;
  seasonalSaleNote?: string;
  image: string;
  defaultSize: PerfumeSizeLabel;
  variants: SizeVariant[];
  notes: ScentNotes;
  longevity: string;
  sillage: string;
  occasion: string;
  reviews: ProductReview[];
}

export interface CartItem {
  productId: string;
  size: PerfumeSizeLabel;
  quantity: number;
}

export type PaymentMethod =
  | 'Cash on Delivery (COD)'
  | 'Bank Transfer'
  | 'JazzCash'
  | 'Easypaisa'
  | 'Online Payment';

export type DeliveryMethod = 'Standard Delivery' | 'Express Delivery';

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  size: PerfumeSizeLabel;
  quantity: number;
  unitPricePkr: number;
  lineTotalPkr: number;
}

export interface OrderRecord {
  orderId: string;
  createdAt: string;
  status: 'Confirmed' | 'Preparing Shipment' | 'Dispatched' | 'Out for Delivery' | 'Delivered';
  customerName: string;
  phone: string;
  city: string;
  address: string;
  postalCode: string;
  paymentMethod: PaymentMethod;
  deliveryMethod: DeliveryMethod;
  items: OrderItemSnapshot[];
  subtotalPkr: number;
  multiBottleDiscountPkr: number;
  promoDiscountPkr: number;
  deliveryChargePkr: number;
  totalPkr: number;
  appliedPromoLabel?: string;
}
