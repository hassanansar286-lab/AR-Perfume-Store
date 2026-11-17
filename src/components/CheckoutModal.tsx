import { useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import {
  CartItem,
  DeliveryMethod,
  OrderRecord,
  PaymentMethod,
  PerfumeProduct,
} from '../types/perfume';
import { calculateCartSummary, formatPkr } from '../utils/pricing';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  products: PerfumeProduct[];
  promoCode: string;
  isFirstOrder: boolean;
  deliveryMethod: DeliveryMethod;
  onChangeDeliveryMethod: (method: DeliveryMethod) => void;
  onPlaceOrder: (order: OrderRecord) => void;
  onViewOrderTracking: (orderId: string) => void;
}

const PAYMENT_METHODS: {
  method: PaymentMethod;
  helper: string;
}[] = [
  {
    method: 'Cash on Delivery (COD)',
    helper: 'Pay in cash to the courier upon parcel arrival anywhere in Pakistan.',
  },
  {
    method: 'JazzCash',
    helper: 'Account +92 341 9787786 · Share transaction reference on WhatsApp.',
  },
  {
    method: 'Easypaisa',
    helper: 'Account +92 341 9787786 · Instant mobile wallet settlement.',
  },
  {
    method: 'Bank Transfer',
    helper: 'IBAN details provided immediately upon order confirmation.',
  },
  {
    method: 'Online Payment',
    helper: 'Secure card / online payment verification.',
  },
];

export function CheckoutModal({
  isOpen,
  onClose,
  items,
  products,
  promoCode,
  isFirstOrder,
  deliveryMethod,
  onChangeDeliveryMethod,
  onPlaceOrder,
  onViewOrderTracking,
}: CheckoutModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Lahore');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    'Cash on Delivery (COD)'
  );
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  if (!isOpen) return null;

  const summary = calculateCartSummary(
    items,
    products,
    promoCode,
    isFirstOrder,
    deliveryMethod
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !address.trim()) return;

    const orderItems = items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        const variant =
          product.variants.find((v) => v.size === item.size) ||
          product.variants[0];
        return {
          productId: product.id,
          name: product.name,
          size: item.size,
          quantity: item.quantity,
          unitPricePkr: variant.pricePkr,
          lineTotalPkr: variant.pricePkr * item.quantity,
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    const newOrderId = `AR-${Math.floor(1050 + Math.random() * 8900)}`;
    const nowFormatted = new Date().toLocaleString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const labels = [summary.multiBottleLabel, summary.promoLabel].filter(Boolean);

    const order: OrderRecord = {
      orderId: newOrderId,
      createdAt: nowFormatted,
      status: 'Confirmed',
      customerName: customerName.trim(),
      phone: phone.trim(),
      city: city.trim(),
      address: address.trim(),
      postalCode: postalCode.trim() || '00000',
      paymentMethod,
      deliveryMethod,
      items: orderItems,
      subtotalPkr: summary.subtotalPkr,
      multiBottleDiscountPkr: summary.multiBottleDiscountPkr,
      promoDiscountPkr: summary.promoDiscountPkr,
      deliveryChargePkr: summary.deliveryChargePkr,
      totalPkr: summary.totalPkr,
      appliedPromoLabel: labels.length > 0 ? labels.join(' + ') : undefined,
    };

    setConfirmedOrder(order);
    onPlaceOrder(order);
  };

  const handleCloseModal = () => {
    setConfirmedOrder(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="Checkout"
    >
      <div className="w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#FAF9F6] border border-[#E5E1D8] rounded-lg shadow-2xl">
        <div className="sticky top-0 z-10 bg-[#FAF9F6] px-6 py-4 border-b border-[#E5E1D8] flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold text-[#161514]">
            {confirmedOrder ? 'Order Confirmed' : 'Complete Your Order'}
          </h2>
          <button
            type="button"
            onClick={handleCloseModal}
            aria-label="Close checkout"
            className="p-2 text-[#5C5954] hover:text-[#161514]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrder ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-start gap-3 bg-white border border-[#E5E1D8] rounded-lg p-5">
              <CheckCircle2 className="w-6 h-6 text-[#8C6D3F] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p className="font-serif text-xl font-semibold text-[#161514]">
                  Order #{confirmedOrder.orderId} Confirmed — Preparing Shipment
                </p>
                <p className="mt-1 text-sm text-[#5C5954]">
                  Thank you, {confirmedOrder.customerName}. Your order confirmation and courier tracking details are ready below.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-white border border-[#E5E1D8] rounded-lg p-5">
              <div>
                <p className="text-xs text-[#5C5954]">Delivery Destination</p>
                <p className="mt-1 font-medium text-[#161514]">
                  {confirmedOrder.customerName} ({confirmedOrder.phone})
                </p>
                <p className="text-[#5C5954]">
                  {confirmedOrder.address}, {confirmedOrder.city} {confirmedOrder.postalCode}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#5C5954]">Payment & Shipping</p>
                <p className="mt-1 font-medium text-[#161514]">
                  {confirmedOrder.paymentMethod}
                </p>
                <p className="text-[#5C5954]">
                  {confirmedOrder.deliveryMethod} · Total Due:{' '}
                  <span className="font-semibold text-[#161514] tabular-nums">
                    {formatPkr(confirmedOrder.totalPkr)}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-white border border-[#E5E1D8] rounded-lg p-5">
              <h3 className="text-sm font-semibold text-[#161514] mb-3">
                Receipt Summary
              </h3>
              <ul className="divide-y divide-[#F0EDE6] text-sm">
                {confirmedOrder.items.map((item) => (
                  <li
                    key={`${item.productId}-${item.size}`}
                    className="py-2 flex justify-between"
                  >
                    <span>
                      {item.name} ({item.size}) × {item.quantity}
                    </span>
                    <span className="font-medium tabular-nums">
                      {formatPkr(item.lineTotalPkr)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-[#E5E1D8] space-y-1 text-sm">
                <div className="flex justify-between text-[#5C5954]">
                  <span>Delivery Charges</span>
                  <span className="tabular-nums">
                    {confirmedOrder.deliveryChargePkr === 0
                      ? 'Free'
                      : formatPkr(confirmedOrder.deliveryChargePkr)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-[#161514] text-base pt-1">
                  <span>Total Payable</span>
                  <span className="tabular-nums">
                    {formatPkr(confirmedOrder.totalPkr)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  const id = confirmedOrder.orderId;
                  handleCloseModal();
                  onViewOrderTracking(id);
                }}
                className="flex-1 py-3 px-5 text-sm font-medium bg-[#161514] text-[#FAF9F6] rounded-md hover:bg-[#2C2A28]"
              >
                Track Order #{confirmedOrder.orderId}
              </button>
              <button
                type="button"
                onClick={handleCloseModal}
                className="py-3 px-5 text-sm font-medium border border-[#D4CFC5] text-[#161514] rounded-md hover:border-[#161514]"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-[#161514] mb-3">
                  1. Customer & Delivery Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="chk-name" className="block text-xs font-medium text-[#5C5954] mb-1">
                      Full Name
                    </label>
                    <input
                      id="chk-name"
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D4CFC5] rounded-md focus:outline-none focus:border-[#161514]"
                    />
                  </div>
                  <div>
                    <label htmlFor="chk-phone" className="block text-xs font-medium text-[#5C5954] mb-1">
                      Phone Number (WhatsApp / Call)
                    </label>
                    <input
                      id="chk-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+92 3XX XXXXXXX"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D4CFC5] rounded-md focus:outline-none focus:border-[#161514]"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label htmlFor="chk-address" className="block text-xs font-medium text-[#5C5954] mb-1">
                    Street Address
                  </label>
                  <input
                    id="chk-address"
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / Flat, Street, Sector or Block"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#D4CFC5] rounded-md focus:outline-none focus:border-[#161514]"
                  />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="chk-city" className="block text-xs font-medium text-[#5C5954] mb-1">
                      City
                    </label>
                    <select
                      id="chk-city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D4CFC5] rounded-md focus:outline-none focus:border-[#161514]"
                    >
                      <option value="Lahore">Lahore</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Quetta">Quetta</option>
                      <option value="Sialkot">Sialkot</option>
                      <option value="Other City (Pakistan)">Other City (Pakistan)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="chk-postal" className="block text-xs font-medium text-[#5C5954] mb-1">
                      Postal Code
                    </label>
                    <input
                      id="chk-postal"
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="e.g. 54000"
                      className="w-full px-3 py-2 text-sm bg-white border border-[#D4CFC5] rounded-md focus:outline-none focus:border-[#161514]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#161514] mb-2.5">
                  2. Delivery Speed
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => onChangeDeliveryMethod('Standard Delivery')}
                    className={`p-3.5 text-left rounded-md border transition-colors ${
                      deliveryMethod === 'Standard Delivery'
                        ? 'border-[#161514] bg-white'
                        : 'border-[#D4CFC5] bg-[#FAF9F6]'
                    }`}
                  >
                    <div className="flex justify-between text-sm font-medium text-[#161514]">
                      <span>Standard Delivery</span>
                      <span className="tabular-nums">
                        {summary.freeDeliveryEligible ? 'Free' : 'Rs. 250'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#5C5954]">
                      3–5 working days nationwide (Free over Rs. 5,000)
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => onChangeDeliveryMethod('Express Delivery')}
                    className={`p-3.5 text-left rounded-md border transition-colors ${
                      deliveryMethod === 'Express Delivery'
                        ? 'border-[#161514] bg-white'
                        : 'border-[#D4CFC5] bg-[#FAF9F6]'
                    }`}
                  >
                    <div className="flex justify-between text-sm font-medium text-[#161514]">
                      <span>Express Delivery</span>
                      <span className="tabular-nums">Rs. 550</span>
                    </div>
                    <p className="mt-1 text-xs text-[#5C5954]">
                      1–2 working days (Subject to city availability)
                    </p>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#161514] mb-2.5">
                  3. Payment Method
                </h3>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((pm) => {
                    const selected = paymentMethod === pm.method;
                    return (
                      <label
                        key={pm.method}
                        className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                          selected
                            ? 'border-[#161514] bg-white'
                            : 'border-[#D4CFC5] bg-[#FAF9F6]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={selected}
                          onChange={() => setPaymentMethod(pm.method)}
                          className="mt-1 accent-[#161514]"
                        />
                        <div>
                          <div className="text-sm font-medium text-[#161514]">
                            {pm.method}
                          </div>
                          <div className="text-xs text-[#5C5954]">{pm.helper}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="md:col-span-5">
              <div className="bg-white border border-[#E5E1D8] rounded-lg p-5 space-y-4">
                <h3 className="font-serif text-xl font-semibold text-[#161514]">
                  Order Summary
                </h3>

                <ul className="divide-y divide-[#F0EDE6] text-sm">
                  {items.map((item) => {
                    const product = products.find((p) => p.id === item.productId);
                    if (!product) return null;
                    const variant =
                      product.variants.find((v) => v.size === item.size) ||
                      product.variants[0];
                    return (
                      <li
                        key={`${item.productId}-${item.size}`}
                        className="py-2.5 flex justify-between gap-2"
                      >
                        <div>
                          <p className="font-medium text-[#161514]">{product.name}</p>
                          <p className="text-xs text-[#5C5954]">
                            {item.size} × {item.quantity}
                          </p>
                        </div>
                        <span className="font-medium tabular-nums text-[#161514]">
                          {formatPkr(variant.pricePkr * item.quantity)}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <div className="pt-3 border-t border-[#E5E1D8] space-y-1.5 text-sm">
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
                    <span>{deliveryMethod}</span>
                    <span className="tabular-nums">
                      {summary.deliveryChargePkr === 0
                        ? 'Free'
                        : formatPkr(summary.deliveryChargePkr)}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#E5E1D8] flex justify-between text-base font-semibold text-[#161514]">
                    <span>Total Payable</span>
                    <span className="tabular-nums">{formatPkr(summary.totalPkr)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 text-sm font-medium bg-[#161514] text-[#FAF9F6] rounded-md hover:bg-[#2C2A28] transition-colors"
                >
                  Confirm Order
                </button>

                <p className="text-xs text-[#5C5954] leading-relaxed">
                  Need help? Message our concierge on WhatsApp at +92 341 9787786 (Mon–Sat).
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
