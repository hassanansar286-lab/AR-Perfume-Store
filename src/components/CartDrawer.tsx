import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import {
  CartItem,
  DeliveryMethod,
  PerfumeProduct,
  PerfumeSizeLabel,
} from '../types/perfume';
import { calculateCartSummary, formatPkr } from '../utils/pricing';
import { ResilientImage } from './ResilientImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  products: PerfumeProduct[];
  promoCode: string;
  onChangePromoCode: (code: string) => void;
  isFirstOrder: boolean;
  onToggleFirstOrder: (val: boolean) => void;
  deliveryMethod: DeliveryMethod;
  onUpdateQuantity: (productId: string, size: PerfumeSizeLabel, delta: number) => void;
  onRemoveItem: (productId: string, size: PerfumeSizeLabel) => void;
  onProceedToCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  products,
  promoCode,
  onChangePromoCode,
  isFirstOrder,
  onToggleFirstOrder,
  deliveryMethod,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const summary = calculateCartSummary(
    items,
    products,
    promoCode,
    isFirstOrder,
    deliveryMethod
  );

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
    >
      <div className="w-full max-w-md bg-[#FAF9F6] h-full flex flex-col border-l border-[#E5E1D8] shadow-xl">
        <div className="px-6 py-4 border-b border-[#E5E1D8] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-[#161514]" aria-hidden="true" />
            <h2 className="font-serif text-xl font-semibold text-[#161514]">
              Shopping Bag ({summary.totalBottles})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping bag"
            className="p-2 text-[#5C5954] hover:text-[#161514] rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-bottle bundle progress note */}
        {summary.totalBottles > 0 && summary.totalBottles < 3 && (
          <div className="px-6 py-2.5 bg-[#F2F0EC] border-b border-[#E5E1D8] text-xs text-[#161514]">
            {summary.totalBottles === 1
              ? 'Add 1 more perfume to unlock 5% Multi-Bottle Discount, or 2 more for 10% Off.'
              : '5% Buy-2 Discount applied. Add 1 more perfume to unlock 10% Off.'}
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-serif text-xl text-[#161514]">Your shopping bag is empty</p>
              <p className="mt-2 text-sm text-[#5C5954]">
                Explore our signature oud, floral, and fresh citrus compositions.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-5 py-2.5 text-xs font-medium bg-[#161514] text-[#FAF9F6] rounded-md"
              >
                Browse Perfumes
              </button>
            </div>
          ) : (
            items.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              if (!product) return null;
              const variant =
                product.variants.find((v) => v.size === item.size) ||
                product.variants[0];

              return (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex gap-4 pb-5 border-b border-[#E5E1D8]"
                >
                  <div className="w-20 h-20 rounded-md overflow-hidden bg-[#F2F0EC] shrink-0 border border-[#E5E1D8]">
                    <ResilientImage
                      src={product.image}
                      alt={product.name}
                      title={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-serif text-base font-semibold text-[#161514] truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs text-[#5C5954]">
                          {item.size} · {product.fragranceFamily}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.productId, item.size)}
                        aria-label={`Remove ${product.name}`}
                        className="p-1 text-[#5C5954] hover:text-[#161514]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center border border-[#D4CFC5] rounded bg-white">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          onClick={() =>
                            onUpdateQuantity(item.productId, item.size, -1)
                          }
                          className="p-1.5 text-[#161514] hover:text-[#8C6D3F]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          onClick={() =>
                            onUpdateQuantity(item.productId, item.size, 1)
                          }
                          className="p-1.5 text-[#161514] hover:text-[#8C6D3F]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-[#161514] tabular-nums">
                        {formatPkr(variant.pricePkr * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="px-6 py-5 bg-white border-t border-[#E5E1D8] space-y-4">
            {/* First order & promo controls */}
            <div className="space-y-2.5">
              <label className="flex items-center justify-between text-xs text-[#161514] cursor-pointer">
                <span>Apply First Order Discount (10% Off)</span>
                <input
                  type="checkbox"
                  checked={isFirstOrder}
                  onChange={(e) => onToggleFirstOrder(e.target.checked)}
                  className="w-4 h-4 accent-[#161514]"
                />
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => onChangePromoCode(e.target.value)}
                  placeholder="Promo code (FIRST10 or SEASON20)"
                  className="flex-1 px-3 py-2 text-xs bg-[#FAF9F6] border border-[#D4CFC5] rounded-md focus:outline-none focus:border-[#161514]"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-sm border-t border-[#F0EDE6] pt-3">
              <div className="flex justify-between text-[#5C5954]">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatPkr(summary.subtotalPkr)}</span>
              </div>
              {summary.multiBottleDiscountPkr > 0 && (
                <div className="flex justify-between text-[#70552E]">
                  <span>{summary.multiBottleLabel}</span>
                  <span className="tabular-nums">
                    -{formatPkr(summary.multiBottleDiscountPkr)}
                  </span>
                </div>
              )}
              {summary.promoDiscountPkr > 0 && (
                <div className="flex justify-between text-[#70552E]">
                  <span>{summary.promoLabel}</span>
                  <span className="tabular-nums">
                    -{formatPkr(summary.promoDiscountPkr)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#5C5954]">
                <span>Estimated Standard Delivery</span>
                <span className="tabular-nums">
                  {summary.deliveryChargePkr === 0
                    ? 'Free'
                    : formatPkr(summary.deliveryChargePkr)}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#161514] pt-2 border-t border-[#F0EDE6]">
                <span>Estimated Total</span>
                <span className="tabular-nums">{formatPkr(summary.totalPkr)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full py-3 px-4 text-sm font-medium bg-[#161514] text-[#FAF9F6] rounded-md hover:bg-[#2C2A28] transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
