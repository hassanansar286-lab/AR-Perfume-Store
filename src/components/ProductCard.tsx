import { Star } from 'lucide-react';
import { PerfumeProduct, PerfumeSizeLabel } from '../types/perfume';
import { formatPkr } from '../utils/pricing';
import { ResilientImage } from './ResilientImage';

interface ProductCardProps {
  product: PerfumeProduct;
  onSelectProduct: (productId: string) => void;
  onQuickAdd: (productId: string, size: PerfumeSizeLabel) => void;
}

export function ProductCard({
  product,
  onSelectProduct,
  onQuickAdd,
}: ProductCardProps) {
  const defaultVariant =
    product.variants.find((v) => v.size === product.defaultSize) ||
    product.variants[0];

  const avgRating =
    product.reviews.length > 0
      ? (
          product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      : '5.0';

  return (
    <article className="group flex flex-col bg-white border border-[#E5E1D8] rounded-lg overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <button
        type="button"
        onClick={() => onSelectProduct(product.id)}
        className="relative aspect-[4/3] w-full bg-[#F2F0EC] overflow-hidden text-left focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#8C6D3F]"
      >
        <ResilientImage
          src={product.image}
          alt={`${product.name} Eau de Parfum bottle`}
          title={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </button>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center justify-between gap-2 text-xs text-[#5C5954]">
          <span className="truncate">
            {product.defaultSize} · {product.audience} · {product.fragranceFamily}
          </span>
          {product.badgeText && (
            <span className="text-[#8C6D3F] font-medium whitespace-nowrap shrink-0">
              {product.badgeText}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => onSelectProduct(product.id)}
          className="mt-2 text-left focus-visible:outline-2 focus-visible:outline-[#8C6D3F]"
        >
          <h3 className="font-serif text-xl font-semibold text-[#161514] group-hover:text-[#8C6D3F] transition-colors">
            {product.name}
          </h3>
        </button>

        <p className="mt-1.5 text-sm text-[#5C5954] line-clamp-2 leading-relaxed">
          {product.tagline}
        </p>

        <div className="mt-3 pt-3 border-t border-[#F0EDE6] flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-[#161514] tabular-nums">
              {formatPkr(defaultVariant.pricePkr)}
            </span>
            {defaultVariant.originalPricePkr && (
              <span className="text-xs text-[#5C5954] line-through tabular-nums">
                {formatPkr(defaultVariant.originalPricePkr)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-[#5C5954] tabular-nums">
            <Star className="w-3.5 h-3.5 fill-[#8C6D3F] text-[#8C6D3F]" aria-hidden="true" />
            <span>{avgRating}</span>
            <span>({product.reviews.length})</span>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onQuickAdd(product.id, defaultVariant.size)}
            className="flex-1 py-2.5 px-4 text-xs font-medium bg-[#161514] text-[#FAF9F6] rounded-md hover:bg-[#2C2A28] transition-colors whitespace-nowrap shrink-0"
          >
            Add to Cart
          </button>
          <button
            type="button"
            onClick={() => onSelectProduct(product.id)}
            className="py-2.5 px-4 text-xs font-medium border border-[#D4CFC5] text-[#161514] rounded-md hover:border-[#161514] transition-colors whitespace-nowrap shrink-0"
          >
            Details
          </button>
        </div>
      </div>
    </article>
  );
}
