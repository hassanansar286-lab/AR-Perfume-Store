import { CartItem, DeliveryMethod, PerfumeProduct } from '../types/perfume';

export function formatPkr(amount: number): string {
  return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
}

export interface CartCalculation {
  totalBottles: number;
  subtotalPkr: number;
  multiBottleRate: number;
  multiBottleLabel: string | null;
  multiBottleDiscountPkr: number;
  promoRate: number;
  promoLabel: string | null;
  promoDiscountPkr: number;
  deliveryChargePkr: number;
  freeDeliveryEligible: boolean;
  totalPkr: number;
}

export function calculateCartSummary(
  items: CartItem[],
  products: PerfumeProduct[],
  promoCodeInput: string,
  isFirstOrder: boolean,
  deliveryMethod: DeliveryMethod
): CartCalculation {
  let subtotalPkr = 0;
  let totalBottles = 0;

  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product) continue;
    const variant =
      product.variants.find((v) => v.size === item.size) || product.variants[0];
    subtotalPkr += variant.pricePkr * item.quantity;
    totalBottles += item.quantity;
  }

  // Buy 2 Perfumes: 5% Discount | Buy 3+ Perfumes: 10% Discount
  let multiBottleRate = 0;
  let multiBottleLabel: string | null = null;
  if (totalBottles >= 3) {
    multiBottleRate = 0.1;
    multiBottleLabel = 'Buy 3+ Perfumes (10% Off)';
  } else if (totalBottles === 2) {
    multiBottleRate = 0.05;
    multiBottleLabel = 'Buy 2 Perfumes (5% Off)';
  }

  const multiBottleDiscountPkr = Math.round(subtotalPkr * multiBottleRate);
  const afterMultiBottle = subtotalPkr - multiBottleDiscountPkr;

  // Promo code or First Order Discount (FIRST10 = 10%, SEASON20 = 20%)
  const normalizedCode = promoCodeInput.trim().toUpperCase();
  let promoRate = 0;
  let promoLabel: string | null = null;

  if (normalizedCode === 'SEASON20') {
    promoRate = 0.2;
    promoLabel = 'Seasonal Sale (20% Off · SEASON20)';
  } else if (normalizedCode === 'FIRST10' || isFirstOrder) {
    promoRate = 0.1;
    promoLabel = 'First Order Discount (10% Off)';
  }

  const promoDiscountPkr = Math.round(afterMultiBottle * promoRate);
  const netMerchandise = Math.max(0, afterMultiBottle - promoDiscountPkr);

  const freeDeliveryEligible = netMerchandise >= 5000 || items.length === 0;
  let deliveryChargePkr = 0;
  if (items.length > 0) {
    if (deliveryMethod === 'Express Delivery') {
      deliveryChargePkr = 550;
    } else {
      deliveryChargePkr = freeDeliveryEligible ? 0 : 250;
    }
  }

  return {
    totalBottles,
    subtotalPkr,
    multiBottleRate,
    multiBottleLabel,
    multiBottleDiscountPkr,
    promoRate,
    promoLabel,
    promoDiscountPkr,
    deliveryChargePkr,
    freeDeliveryEligible,
    totalPkr: netMerchandise + deliveryChargePkr,
  };
}
