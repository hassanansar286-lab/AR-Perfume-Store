import { ShoppingBag, X } from 'lucide-react';

export type ActiveRoute = 'storefront' | 'product' | 'track-order';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onNavigate: (route: ActiveRoute, sectionId?: string) => void;
  activeRoute: ActiveRoute;
  showPromoBanner: boolean;
  onDismissPromo: () => void;
}

export function Navbar({
  cartCount,
  onOpenCart,
  onNavigate,
  activeRoute,
  showPromoBanner,
  onDismissPromo,
}: NavbarProps) {
  return (
    <div className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E5E1D8]">
      {showPromoBanner && (
        <div className="bg-[#161514] text-[#FAF9F6] px-4 py-1.5 text-xs flex items-center justify-center relative min-h-[32px]">
          <p className="text-center pr-8 truncate">
            First Order 10% Off (Code: FIRST10) · Buy 2 for 5% Off · Buy 3+ for 10% Off · Cash on Delivery Across Pakistan
          </p>
          <button
            type="button"
            onClick={onDismissPromo}
            aria-label="Dismiss promotional announcement"
            className="absolute right-3 p-1 text-[#FAF9F6]/80 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <header className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('storefront', 'top')}
          className="font-serif text-xl sm:text-2xl font-semibold tracking-tight text-[#161514] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8C6D3F]"
        >
          AR PERFUME STORE
        </button>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5C5954]"
        >
          <button
            type="button"
            onClick={() => onNavigate('storefront', 'collection')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#161514] hover:underline underline-offset-4 ${
              activeRoute === 'storefront' ? 'text-[#161514]' : ''
            }`}
          >
            Collection
          </button>
          <button
            type="button"
            onClick={() => onNavigate('storefront', 'offers')}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-[#161514] hover:underline underline-offset-4"
          >
            Offers
          </button>
          <button
            type="button"
            onClick={() => onNavigate('storefront', 'size-guide')}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-[#161514] hover:underline underline-offset-4"
          >
            Size Guide
          </button>
          <button
            type="button"
            onClick={() => onNavigate('track-order')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-[#161514] hover:underline underline-offset-4 ${
              activeRoute === 'track-order' ? 'text-[#161514] underline' : ''
            }`}
          >
            Track Order
          </button>
          <button
            type="button"
            onClick={() => onNavigate('storefront', 'contact')}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-[#161514] hover:underline underline-offset-4"
          >
            Contact
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Open shopping bag with ${cartCount} items`}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-medium bg-[#161514] text-[#FAF9F6] rounded-md hover:bg-[#2C2A28] transition-colors whitespace-nowrap shrink-0 tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8C6D3F]"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span>Bag ({cartCount})</span>
          </button>
        </div>
      </header>
    </div>
  );
}
