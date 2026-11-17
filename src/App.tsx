import { useEffect, useMemo, useState } from 'react';
import { Mail, MessageCircle, Search, SlidersHorizontal } from 'lucide-react';
import {
  BUSINESS_CONTACT,
  INITIAL_SAMPLE_ORDERS,
  PRODUCTS,
  SIZE_PRICING_GUIDE,
  SPECIAL_OFFERS,
} from './data/products';
import {
  AudienceCategory,
  CartItem,
  DeliveryMethod,
  FragranceFamily,
  OrderRecord,
  PerfumeProduct,
  PerfumeSizeLabel,
  ProductReview,
} from './types/perfume';
import { ActiveRoute, Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailView } from './components/ProductDetailView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingSection } from './components/OrderTrackingSection';
import { ResilientImage } from './components/ResilientImage';

const HERO_IMAGE = '/src/assets/images/hero_luxury_atelier_1794923805838.jpg';

const AUDIENCE_FILTERS: ('All' | AudienceCategory)[] = [
  'All',
  'Unisex',
  'Men',
  'Women',
  'Gift Set',
];

const FAMILY_FILTERS: ('All' | FragranceFamily)[] = [
  'All',
  'Oriental',
  'Woody',
  'Floral',
  'Fresh',
  'Citrus',
];

export default function App() {
  const [products, setProducts] = useState<PerfumeProduct[]>(() => {
    try {
      const savedReviews = localStorage.getItem('ar_perfume_reviews');
      if (savedReviews) {
        const parsed: Record<string, ProductReview[]> = JSON.parse(savedReviews);
        return PRODUCTS.map((p) => ({
          ...p,
          reviews: parsed[p.id] ? [...parsed[p.id], ...p.reviews] : p.reviews,
        }));
      }
    } catch {
      // Ignore storage read errors
    }
    return PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ar_perfume_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem('ar_perfume_orders');
      return saved ? JSON.parse(saved) : INITIAL_SAMPLE_ORDERS;
    } catch {
      return INITIAL_SAMPLE_ORDERS;
    }
  });

  const [activeRoute, setActiveRoute] = useState<ActiveRoute>('storefront');
  const [selectedProductId, setSelectedProductId] = useState<string>(PRODUCTS[0].id);
  const [trackingQueryId, setTrackingQueryId] = useState<string>('AR-1042');

  const [audienceFilter, setAudienceFilter] = useState<'All' | AudienceCategory>('All');
  const [familyFilter, setFamilyFilter] = useState<'All' | FragranceFamily>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [showPromoBanner, setShowPromoBanner] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('Standard Delivery');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('ar_perfume_cart', JSON.stringify(cart));
    } catch {
      // Ignore storage write errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('ar_perfume_orders', JSON.stringify(orders));
    } catch {
      // Ignore storage write errors
    }
  }, [orders]);

  const showToast = (message: string) => {
    setToastMessage(message);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2600);
  };

  const totalBagItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchesAudience =
        audienceFilter === 'All' || p.audience === audienceFilter;
      const matchesFamily =
        familyFilter === 'All' ||
        p.fragranceFamily === familyFilter ||
        p.secondaryFamily === familyFilter;
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.fragranceFamily.toLowerCase().includes(q) ||
        p.notes.top.some((n) => n.toLowerCase().includes(q)) ||
        p.notes.middle.some((n) => n.toLowerCase().includes(q)) ||
        p.notes.base.some((n) => n.toLowerCase().includes(q));
      return matchesAudience && matchesFamily && matchesQuery;
    });
  }, [products, audienceFilter, familyFilter, searchQuery]);

  const handleNavigate = (route: ActiveRoute, sectionId?: string) => {
    setActiveRoute(route);
    if (route === 'storefront') {
      window.setTimeout(() => {
        if (sectionId === 'top' || !sectionId) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const el = document.getElementById(sectionId);
          el?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 40);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProductId(productId);
    setActiveRoute('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (
    productId: string,
    size: PerfumeSizeLabel,
    quantity = 1
  ) => {
    const product = products.find((p) => p.id === productId);
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === productId && item.size === size
      );
      if (existing) {
        return prev.map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId, size, quantity }];
    });
    if (product) {
      showToast(`Added ${product.name} (${size}) to your bag.`);
    }
  };

  const handleBuyNow = (
    productId: string,
    size: PerfumeSizeLabel,
    quantity = 1
  ) => {
    handleAddToCart(productId, size, quantity);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (
    productId: string,
    size: PerfumeSizeLabel,
    delta: number
  ) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId && item.size === size
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (productId: string, size: PerfumeSizeLabel) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.size === size))
    );
  };

  const handleAddReview = (
    productId: string,
    reviewData: Omit<ProductReview, 'id' | 'date' | 'verifiedPurchase'>
  ) => {
    const newReview: ProductReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-PK', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      verifiedPurchase: true,
    };

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, reviews: [newReview, ...p.reviews] } : p
      )
    );

    try {
      const savedRaw = localStorage.getItem('ar_perfume_reviews');
      const savedMap: Record<string, ProductReview[]> = savedRaw
        ? JSON.parse(savedRaw)
        : {};
      savedMap[productId] = [newReview, ...(savedMap[productId] || [])];
      localStorage.setItem('ar_perfume_reviews', JSON.stringify(savedMap));
    } catch {
      // Ignore storage write errors
    }
  };

  const handlePlaceOrder = (order: OrderRecord) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    setPromoCode('');
    setIsFirstOrder(false);
  };

  const handleApplyOfferCode = (code?: string) => {
    if (code) {
      setPromoCode(code);
      if (code === 'FIRST10') setIsFirstOrder(true);
      setIsCartOpen(true);
      showToast(`Code ${code} ready in your bag.`);
    } else {
      setIsCartOpen(true);
    }
  };

  const selectedProduct =
    products.find((p) => p.id === selectedProductId) || products[0];

  return (
    <div id="top" className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#161514]">
      <Navbar
        cartCount={totalBagItems}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
        activeRoute={activeRoute}
        showPromoBanner={showPromoBanner}
        onDismissPromo={() => setShowPromoBanner(false)}
      />

      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-40 bg-[#161514] text-[#FAF9F6] px-4 py-3 rounded-md shadow-lg text-xs sm:text-sm flex items-center gap-3"
        >
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="text-[#E5C687] font-medium underline underline-offset-4 whitespace-nowrap"
          >
            View Bag
          </button>
        </div>
      )}

      <main className="flex-1">
        {activeRoute === 'product' && (
          <ProductDetailView
            key={selectedProduct.id}
            product={selectedProduct}
            onBack={() => handleNavigate('storefront', 'collection')}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onAddReview={handleAddReview}
          />
        )}

        {activeRoute === 'track-order' && (
          <OrderTrackingSection
            orders={orders}
            initialSearchId={trackingQueryId}
            onBack={() => handleNavigate('storefront', 'collection')}
          />
        )}

        {activeRoute === 'storefront' && (
          <>
            {/* Section 1: Hero Editorial Showcase */}
            <section className="border-b border-[#E5E1D8]">
              <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-14 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                  <div className="lg:col-span-6 flex flex-col justify-center">
                    <p className="text-xs font-medium text-[#8C6D3F]">
                      Fine Fragrances · Nationwide Delivery in Pakistan
                    </p>
                    <h1 className="mt-3 font-serif text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.08] font-semibold text-[#161514] max-w-xl">
                      Discover Your Signature Scent – Elegance in Every Drop.
                    </h1>
                    <p className="mt-5 text-base text-[#5C5954] max-w-lg leading-relaxed">
                      From smoky Royal Oud and crisp Blue Ocean to delicate Damask Rose Elegance and curated Gift Collections—crafted for enduring sillage and everyday sophistication.
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleNavigate('storefront', 'collection')}
                        className="px-6 py-3 text-sm font-medium bg-[#161514] text-[#FAF9F6] rounded-md hover:bg-[#2C2A28] transition-colors whitespace-nowrap"
                      >
                        Explore Collection
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSelectProduct('royal-oud')}
                        className="px-6 py-3 text-sm font-medium border border-[#D4CFC5] text-[#161514] rounded-md hover:border-[#161514] transition-colors whitespace-nowrap"
                      >
                        Shop Royal Oud
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-6">
                    <div className="w-full h-full min-h-[280px] lg:min-h-[420px] rounded-lg overflow-hidden border border-[#E5E1D8] bg-[#F2F0EC]">
                      <ResilientImage
                        src={HERO_IMAGE}
                        alt="AR PERFUME STORE signature glass flacons on travertine stone"
                        title="AR PERFUME STORE"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Full-width 4-column value strip below hero split */}
                <div className="mt-10 pt-8 border-t border-[#E5E1D8] grid grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                  <div>
                    <p className="font-semibold text-[#161514]">10 Signature Editions</p>
                    <p className="mt-1 text-xs text-[#5C5954]">
                      10ml, 30ml, 50ml, 100ml & Gift Sets
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#161514]">Multi-Bottle Savings</p>
                    <p className="mt-1 text-xs text-[#5C5954]">
                      5% off 2 perfumes · 10% off 3+ perfumes
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#161514]">Cash on Delivery</p>
                    <p className="mt-1 text-xs text-[#5C5954]">
                      COD, JazzCash, Easypaisa & Bank Transfer
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#161514]">3–5 Working Days</p>
                    <p className="mt-1 text-xs text-[#5C5954]">
                      Standard & Express delivery across Pakistan
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Featured Product Collection Grid */}
            <section id="collection" className="max-w-7xl mx-auto px-4 sm:px-8 py-14 sm:py-16">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#161514]">
                    The Fragrance Collection
                  </h2>
                  <p className="mt-2 text-sm text-[#5C5954]">
                    Select any perfume to explore top, middle, and base notes, size options, and customer reviews.
                  </p>
                </div>

                <div className="relative w-full md:w-72">
                  <Search
                    className="w-4 h-4 text-[#5C5954] absolute left-3.5 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search oud, rose, citrus..."
                    aria-label="Search fragrances by name or note"
                    className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#D4CFC5] rounded-md focus:outline-none focus:border-[#161514]"
                  />
                </div>
              </div>

              {/* Interactive Filter Controls */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-8 border-b border-[#E5E1D8]">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#5C5954] mr-2">
                    <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Collection:</span>
                  </span>
                  {AUDIENCE_FILTERS.map((aud) => (
                    <button
                      key={aud}
                      type="button"
                      onClick={() => setAudienceFilter(aud)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        audienceFilter === aud
                          ? 'bg-[#161514] text-[#FAF9F6]'
                          : 'bg-[#F2F0EC] text-[#5C5954] hover:text-[#161514]'
                      }`}
                    >
                      {aud}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-[#5C5954] mr-2">Family:</span>
                  {FAMILY_FILTERS.map((fam) => (
                    <button
                      key={fam}
                      type="button"
                      onClick={() => setFamilyFilter(fam)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        familyFilter === fam
                          ? 'bg-[#8C6D3F] text-white'
                          : 'bg-[#F2F0EC] text-[#5C5954] hover:text-[#161514]'
                      }`}
                    >
                      {fam}
                    </button>
                  ))}
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="py-16 text-center bg-white border border-[#E5E1D8] rounded-lg mt-8">
                  <p className="font-serif text-xl text-[#161514]">
                    No fragrances match your current filter
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setAudienceFilter('All');
                      setFamilyFilter('All');
                      setSearchQuery('');
                    }}
                    className="mt-4 px-5 py-2 text-xs font-medium bg-[#161514] text-[#FAF9F6] rounded-md"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelectProduct={handleSelectProduct}
                      onQuickAdd={(id, size) => handleAddToCart(id, size, 1)}
                    />
                  ))}
                </div>
              )}

              <p className="mt-6 text-xs text-[#5C5954]">
                Note: Product names, descriptions, and prices represent proposed store editions curated for AR PERFUME STORE.
              </p>
            </section>

            {/* Section 3: Brand Story, Size-Based Pricing & Special Offers */}
            <section
              id="offers"
              className="bg-[#F2F0EC] border-y border-[#E5E1D8] py-14 sm:py-16"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Brand Story & Size-Based Pricing Table */}
                <div id="size-guide" className="lg:col-span-6 space-y-8">
                  <div>
                    <p className="text-xs font-medium text-[#8C6D3F]">
                      Our Philosophy
                    </p>
                    <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#161514]">
                      {BUSINESS_CONTACT.brandTagline}
                    </h2>
                    <p className="mt-4 text-sm sm:text-base text-[#3D3A36] leading-relaxed">
                      {BUSINESS_CONTACT.brandStory}
                    </p>
                  </div>

                  <div className="bg-white border border-[#E5E1D8] rounded-lg overflow-hidden">
                    <div className="px-5 py-4 border-b border-[#E5E1D8]">
                      <h3 className="font-serif text-xl font-semibold text-[#161514]">
                        Size-Based Pricing Guide
                      </h3>
                      <p className="text-xs text-[#5C5954] mt-0.5">
                        Available across signature single-bottle fragrances
                      </p>
                    </div>
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-[#E5E1D8] text-xs text-[#5C5954]">
                          <th className="py-3 px-5 font-medium">Perfume Size</th>
                          <th className="py-3 px-5 font-medium">Price Range</th>
                          <th className="py-3 px-5 font-medium hidden sm:table-cell">Format</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0EDE6]">
                        {SIZE_PRICING_GUIDE.map((row) => (
                          <tr key={row.size}>
                            <td className="py-3 px-5 font-semibold text-[#161514] tabular-nums">
                              {row.size}
                            </td>
                            <td className="py-3 px-5 font-medium text-[#161514] tabular-nums">
                              {row.priceRange}
                            </td>
                            <td className="py-3 px-5 text-xs text-[#5C5954] hidden sm:table-cell">
                              {row.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Special Offers & Discounts */}
                <div className="lg:col-span-6">
                  <div className="bg-white border border-[#E5E1D8] rounded-lg p-6 sm:p-8">
                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#161514]">
                      Special Offers & Discounts
                    </h3>
                    <p className="mt-1.5 text-sm text-[#5C5954]">
                      Bundle discounts apply automatically in your shopping bag. Promo codes can be activated below.
                    </p>

                    <div className="mt-6 divide-y divide-[#E5E1D8]">
                      {SPECIAL_OFFERS.map((offer) => (
                        <div
                          key={offer.title}
                          className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-[#161514]">
                                {offer.title}
                              </span>
                              <span className="text-xs font-semibold text-[#8C6D3F]">
                                · {offer.highlight}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-[#5C5954] leading-relaxed">
                              {offer.detail}
                            </p>
                          </div>

                          {offer.code && (
                            <button
                              type="button"
                              onClick={() => handleApplyOfferCode(offer.code)}
                              className="px-3.5 py-2 text-xs font-medium border border-[#161514] text-[#161514] rounded-md hover:bg-[#161514] hover:text-[#FAF9F6] transition-colors whitespace-nowrap shrink-0"
                            >
                              Apply {offer.code}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Section 4: Footer with Business Contact Details, Payment & Delivery Info */}
      <footer id="contact" className="bg-[#161514] text-[#FAF9F6] border-t border-[#2C2A28]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-14">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-[#2C2A28]">
            <div className="md:col-span-5">
              <p className="font-serif text-2xl font-semibold tracking-tight">
                {BUSINESS_CONTACT.brandName}
              </p>
              <p className="mt-2 text-sm text-[#C9C4BA]">
                {BUSINESS_CONTACT.heroTagline}
              </p>
              <p className="mt-4 text-xs text-[#9C978E] leading-relaxed max-w-sm">
                {BUSINESS_CONTACT.brandTagline} Nationwide Cash on Delivery and express dispatch across Pakistan.
              </p>
            </div>

            <div className="md:col-span-4 space-y-2.5 text-sm">
              <p className="font-semibold text-[#FAF9F6]">Customer Concierge</p>
              <a
                href={BUSINESS_CONTACT.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#C9C4BA] hover:text-white transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
                <span>WhatsApp: {BUSINESS_CONTACT.whatsappDisplay}</span>
              </a>
              <a
                href={`mailto:${BUSINESS_CONTACT.email}`}
                className="flex items-center gap-2 text-[#C9C4BA] hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[#C5A46D]" aria-hidden="true" />
                <span>Email: {BUSINESS_CONTACT.email}</span>
              </a>
              <p className="text-xs text-[#9C978E]">
                Customer Support: {BUSINESS_CONTACT.supportHours}
              </p>
              <p className="text-xs text-[#9C978E]">
                Business Location: {BUSINESS_CONTACT.location}
              </p>
            </div>

            <div className="md:col-span-3 space-y-2.5 text-sm">
              <p className="font-semibold text-[#FAF9F6]">Payment & Delivery</p>
              <ul className="space-y-1.5 text-xs text-[#C9C4BA]">
                <li>Cash on Delivery (COD)</li>
                <li>Bank Transfer · JazzCash · Easypaisa</li>
                <li>Online Payment</li>
                <li>Standard Delivery: 3–5 Working Days</li>
                <li>
                  <button
                    type="button"
                    onClick={() => handleNavigate('track-order')}
                    className="underline underline-offset-4 hover:text-white mt-1"
                  >
                    Track an Existing Order
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9C978E]">
            <p>© {new Date().getFullYear()} AR PERFUME STORE. All rights reserved.</p>
            <p>Pakistan · Fine Fragrances & Gift Collections</p>
          </div>
        </div>
      </footer>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        products={products}
        promoCode={promoCode}
        onChangePromoCode={setPromoCode}
        isFirstOrder={isFirstOrder}
        onToggleFirstOrder={setIsFirstOrder}
        deliveryMethod={deliveryMethod}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        products={products}
        promoCode={promoCode}
        isFirstOrder={isFirstOrder}
        deliveryMethod={deliveryMethod}
        onChangeDeliveryMethod={setDeliveryMethod}
        onPlaceOrder={handlePlaceOrder}
        onViewOrderTracking={(orderId) => {
          setTrackingQueryId(orderId);
          setActiveRoute('track-order');
        }}
      />
    </div>
  );
}
