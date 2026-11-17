import { useState } from 'react';
import { ArrowLeft, Check, Package, Search, Truck } from 'lucide-react';
import { OrderRecord } from '../types/perfume';
import { formatPkr } from '../utils/pricing';

interface OrderTrackingSectionProps {
  orders: OrderRecord[];
  initialSearchId?: string;
  onBack: () => void;
}

const ORDER_STAGES: OrderRecord['status'][] = [
  'Confirmed',
  'Preparing Shipment',
  'Dispatched',
  'Out for Delivery',
  'Delivered',
];

export function OrderTrackingSection({
  orders,
  initialSearchId = 'AR-1042',
  onBack,
}: OrderTrackingSectionProps) {
  const [query, setQuery] = useState(initialSearchId);
  const [selectedOrderId, setSelectedOrderId] = useState(initialSearchId);

  const matchedOrder = orders.find(
    (o) => o.orderId.toUpperCase() === selectedOrderId.trim().toUpperCase()
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedOrderId(query.trim());
  };

  const currentStageIndex = matchedOrder
    ? ORDER_STAGES.indexOf(matchedOrder.status)
    : -1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-14">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#5C5954] hover:text-[#161514] mb-8"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Return to Storefront</span>
      </button>

      <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#161514]">
        Track Your Order
      </h1>
      <p className="mt-2 text-sm text-[#5C5954]">
        Enter your AR PERFUME STORE order reference (for example, AR-1042) to view live dispatch progress and itemized receipt details.
      </p>

      <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="w-4 h-4 text-[#5C5954] absolute left-3.5 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter Order ID (e.g. AR-1042)"
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#D4CFC5] rounded-md focus:outline-none focus:border-[#161514]"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-2.5 text-sm font-medium bg-[#161514] text-[#FAF9F6] rounded-md hover:bg-[#2C2A28] transition-colors whitespace-nowrap"
        >
          Check Status
        </button>
      </form>

      {orders.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-[#5C5954]">
          <span>Recent orders:</span>
          {orders.slice(0, 5).map((o) => (
            <button
              key={o.orderId}
              type="button"
              onClick={() => {
                setQuery(o.orderId);
                setSelectedOrderId(o.orderId);
              }}
              className={`px-2.5 py-1 rounded border transition-colors tabular-nums ${
                matchedOrder?.orderId === o.orderId
                  ? 'border-[#161514] bg-[#161514] text-[#FAF9F6]'
                  : 'border-[#D4CFC5] bg-white text-[#161514] hover:border-[#161514]'
              }`}
            >
              {o.orderId}
            </button>
          ))}
        </div>
      )}

      {matchedOrder ? (
        <div className="mt-8 bg-white border border-[#E5E1D8] rounded-lg p-6 sm:p-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E5E1D8]">
            <div>
              <p className="text-xs text-[#5C5954]">
                Order #{matchedOrder.orderId} · Placed {matchedOrder.createdAt}
              </p>
              <h2 className="mt-1 font-serif text-2xl font-semibold text-[#161514]">
                Status: {matchedOrder.status}
              </h2>
            </div>
            <div className="text-sm text-left sm:text-right">
              <p className="text-[#5C5954]">{matchedOrder.deliveryMethod}</p>
              <p className="font-semibold text-[#161514] tabular-nums">
                Total: {formatPkr(matchedOrder.totalPkr)} ({matchedOrder.paymentMethod})
              </p>
            </div>
          </div>

          {/* Progress Stepper */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {ORDER_STAGES.map((stage, idx) => {
              const completed = idx <= currentStageIndex;
              return (
                <div
                  key={stage}
                  className={`p-3 rounded-md border ${
                    completed
                      ? 'border-[#8C6D3F] bg-[#FAF9F6]'
                      : 'border-[#E5E1D8] bg-white opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-medium text-[#161514]">
                    {completed ? (
                      <Check className="w-3.5 h-3.5 text-[#8C6D3F]" aria-hidden="true" />
                    ) : (
                      <Package className="w-3.5 h-3.5 text-[#5C5954]" aria-hidden="true" />
                    )}
                    <span>Step {idx + 1}</span>
                  </div>
                  <p className="mt-1.5 text-xs font-semibold text-[#161514]">
                    {stage}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm pt-2">
            <div>
              <h3 className="font-semibold text-[#161514] mb-2">
                Shipping Address
              </h3>
              <p className="text-[#5C5954]">{matchedOrder.customerName}</p>
              <p className="text-[#5C5954]">{matchedOrder.phone}</p>
              <p className="text-[#5C5954]">
                {matchedOrder.address}, {matchedOrder.city} {matchedOrder.postalCode}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#161514] mb-2">
                Items Ordered
              </h3>
              <ul className="space-y-1.5 text-[#5C5954]">
                {matchedOrder.items.map((item) => (
                  <li
                    key={`${item.productId}-${item.size}`}
                    className="flex justify-between"
                  >
                    <span>
                      {item.name} ({item.size}) × {item.quantity}
                    </span>
                    <span className="font-medium text-[#161514] tabular-nums">
                      {formatPkr(item.lineTotalPkr)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E5E1D8] flex items-center gap-3 text-xs text-[#5C5954]">
            <Truck className="w-4 h-4 text-[#8C6D3F] shrink-0" aria-hidden="true" />
            <span>
              Standard delivery arrives in 3–5 working days. For urgent courier updates, contact WhatsApp +92 341 9787786.
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-8 bg-white border border-[#E5E1D8] rounded-lg p-8 text-center">
          <p className="font-serif text-xl text-[#161514]">
            No order found for "{selectedOrderId}"
          </p>
          <p className="mt-2 text-sm text-[#5C5954]">
            Verify your order code (e.g. AR-1042) or message us on WhatsApp at +92 341 9787786.
          </p>
        </div>
      )}
    </div>
  );
}
