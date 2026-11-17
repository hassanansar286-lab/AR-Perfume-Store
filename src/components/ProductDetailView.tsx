import { useState } from 'react';
import {
  ArrowLeft,
  Check,
  Minus,
  Plus,
  ShieldCheck,
  Star,
  Truck,
} from 'lucide-react';
import {
  PerfumeProduct,
  PerfumeSizeLabel,
  ProductReview,
} from '../types/perfume';
import { formatPkr } from '../utils/pricing';
import { ResilientImage } from './ResilientImage';

interface ProductDetailViewProps {
  product: PerfumeProduct;
  onBack: () => void;
  onAddToCart: (productId: string, size: PerfumeSizeLabel, quantity: number) => void;
  onBuyNow: (productId: string, size: PerfumeSizeLabel, quantity: number) => void;
  onAddReview: (productId: string, review: Omit<ProductReview, 'id' | 'date' | 'verifiedPurchase'>) => void;
}

export function ProductDetailView({
  product,
  onBack,
  onAddToCart,
  onBuyNow,
  onAddReview,
}: ProductDetailViewProps) {
  const [selectedSize, setSelectedSize] = useState<PerfumeSizeLabel>(product.defaultSize);
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);

  // Review form state
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerCity, setReviewerCity] = useState('Lahore');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const activeVariant =
    product.variants.find((v) => v.size === selectedSize) || product.variants[0];

  const avgRating =
    product.reviews.length > 0
      ? (
          product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        ).toFixed(1)
      : '5.0';

  const handleAdd = () => {
    onAddToCart(product.id, activeVariant.size, quantity);
    setAddedFeedback(true);
    window.setTimeout(() => setAddedFeedback(false), 1800);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;
    onAddReview(product.id, {
      author: reviewerName.trim(),
      city: reviewerCity.trim() || 'Pakistan',
      rating: reviewRating,
      comment: reviewComment.trim(),
    });
    setReviewerName('');
    setReviewComment('');
    setReviewRating(5);
    setReviewSubmitted(true);
    window.setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 pb-24 md:pb-16">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#5C5954] hover:text-[#161514] transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Back to Collection</span>
      </button>

      {/* Contiguous PDP Layout: Sticky Gallery Left, Contiguous Purchase Module Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
        <div className="lg:col-span-6 lg:sticky lg:top-24">
          <div className="aspect-[4/3] w-full bg-[#F2F0EC] border border-[#E5E1D8] rounded-lg overflow-hidden">
            <ResilientImage
              src={product.image}
              alt={`${product.name} Eau de Parfum studio photograph`}
              title={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 border-t border-[#E5E1D8] pt-5 text-xs">
            <div>
              <p className="text-[#5C5954]">Longevity</p>
              <p className="mt-1 font-medium text-[#161514]">{product.longevity}</p>
            </div>
            <div>
              <p className="text-[#5C5954]">Sillage</p>
              <p className="mt-1 font-medium text-[#161514]">{product.sillage}</p>
            </div>
            <div>
              <p className="text-[#5C5954]">Occasion</p>
              <p className="mt-1 font-medium text-[#161514]">{product.occasion}</p>
            </div>
          </div>
        </div>

        {/* Right Purchase & Olfactory Module */}
        <div className="lg:col-span-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#5C5954]">
            <span>{product.audience}</span>
            <span aria-hidden="true">·</span>
            <span>
              Fragrance Family: {product.fragranceFamily}
              {product.secondaryFamily ? ` / ${product.secondaryFamily}` : ''}
            </span>
            {product.badgeText && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#8C6D3F] font-medium">{product.badgeText}</span>
              </>
            )}
          </div>

          <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#161514]">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1 text-[#8C6D3F] tabular-nums">
              <Star className="w-4 h-4 fill-[#8C6D3F]" aria-hidden="true" />
              <span className="font-semibold text-[#161514]">{avgRating}</span>
            </div>
            <span className="text-[#5C5954]">
              {product.reviews.length} verified customer{' '}
              {product.reviews.length === 1 ? 'review' : 'reviews'}
            </span>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-2xl sm:text-3xl font-semibold text-[#161514] tabular-nums">
              {formatPkr(activeVariant.pricePkr)}
            </span>
            {activeVariant.originalPricePkr && (
              <span className="text-base text-[#5C5954] line-through tabular-nums">
                {formatPkr(activeVariant.originalPricePkr)}
              </span>
            )}
            <span className="text-xs text-[#5C5954]">Inclusive of all taxes</span>
          </div>

          <p className="mt-5 text-sm sm:text-base text-[#3D3A36] leading-relaxed">
            {product.description}
          </p>

          {/* Size Selection */}
          <div className="mt-7">
            <div className="flex items-center justify-between text-xs mb-2.5">
              <span className="font-semibold text-[#161514]">
                Select Perfume Size
              </span>
              <span className="text-[#5C5954]">
                Selected: {activeVariant.size}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {product.variants.map((variant) => {
                const isSelected = variant.size === activeVariant.size;
                return (
                  <button
                    key={variant.size}
                    type="button"
                    onClick={() => setSelectedSize(variant.size)}
                    className={`py-2.5 px-3 text-left rounded-md border transition-colors ${
                      isSelected
                        ? 'border-[#161514] bg-[#161514] text-[#FAF9F6]'
                        : 'border-[#D4CFC5] bg-white text-[#161514] hover:border-[#161514]'
                    }`}
                  >
                    <div className="text-sm font-semibold whitespace-nowrap">
                      {variant.size}
                    </div>
                    <div
                      className={`text-xs tabular-nums ${
                        isSelected ? 'text-[#FAF9F6]/80' : 'text-[#5C5954]'
                      }`}
                    >
                      {formatPkr(variant.pricePkr)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity & Primary Actions */}
          <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="inline-flex items-center justify-between border border-[#D4CFC5] bg-white rounded-md px-2 h-11 sm:w-32 shrink-0">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2 text-[#161514] hover:text-[#8C6D3F] disabled:opacity-40"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-sm font-semibold tabular-nums">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="p-2 text-[#161514] hover:text-[#8C6D3F]"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 h-11 px-6 text-sm font-medium bg-[#161514] text-[#FAF9F6] rounded-md hover:bg-[#2C2A28] transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {addedFeedback ? (
                <>
                  <Check className="w-4 h-4" aria-hidden="true" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <span>Add to Cart — {formatPkr(activeVariant.pricePkr * quantity)}</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onBuyNow(product.id, activeVariant.size, quantity)}
              className="h-11 px-6 text-sm font-medium bg-[#8C6D3F] text-white rounded-md hover:bg-[#70552E] transition-colors whitespace-nowrap shrink-0"
            >
              Buy Now
            </button>
          </div>

          {/* Available Discounts Summary */}
          <div className="mt-7 pt-6 border-t border-[#E5E1D8]">
            <h2 className="text-sm font-semibold text-[#161514]">
              Available Offers & Discounts
            </h2>
            <ul className="mt-2.5 space-y-1.5 text-sm text-[#5C5954]">
              <li>First Order Discount: 10% off with code FIRST10</li>
              <li>Buy 2 Perfumes: 5% automatic bundle discount in bag</li>
              <li>Buy 3+ Perfumes: 10% automatic bundle discount in bag</li>
              {product.isGiftSet && (
                <li>Gift Collection: Special Bundle Pricing already applied</li>
              )}
              <li>Seasonal Sales: Up to 20% off with code SEASON20</li>
            </ul>
          </div>

          {/* Fragrance Pyramid */}
          <div className="mt-7 pt-6 border-t border-[#E5E1D8]">
            <h2 className="text-sm font-semibold text-[#161514] mb-3">
              Fragrance Notes Pyramid
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#F2F0EC] p-4 rounded-md">
                <p className="text-xs font-semibold text-[#8C6D3F]">Top Notes</p>
                <p className="mt-1.5 text-sm text-[#161514] leading-relaxed">
                  {product.notes.top.join(', ')}
                </p>
              </div>
              <div className="bg-[#F2F0EC] p-4 rounded-md">
                <p className="text-xs font-semibold text-[#8C6D3F]">Middle Notes</p>
                <p className="mt-1.5 text-sm text-[#161514] leading-relaxed">
                  {product.notes.middle.join(', ')}
                </p>
              </div>
              <div className="bg-[#F2F0EC] p-4 rounded-md">
                <p className="text-xs font-semibold text-[#8C6D3F]">Base Notes</p>
                <p className="mt-1.5 text-sm text-[#161514] leading-relaxed">
                  {product.notes.base.join(', ')}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery & Cash on Delivery Information */}
          <div className="mt-7 pt-6 border-t border-[#E5E1D8] grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Truck className="w-4 h-4 text-[#8C6D3F] mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-medium text-[#161514]">Nationwide Delivery</p>
                <p className="mt-0.5 text-xs text-[#5C5954] leading-relaxed">
                  Standard delivery in 3–5 working days (Free on orders Rs. 5,000+). Express delivery subject to availability.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-[#8C6D3F] mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-medium text-[#161514]">Cash on Delivery Available</p>
                <p className="mt-0.5 text-xs text-[#5C5954] leading-relaxed">
                  Pay via Cash on Delivery (COD), Bank Transfer, JazzCash, Easypaisa, or Online Payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Ratings & Reviews */}
      <section className="mt-16 pt-12 border-t border-[#E5E1D8] grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#161514]">
            Customer Reviews
          </h2>
          <p className="mt-2 text-sm text-[#5C5954]">
            Verified impressions from fragrance enthusiasts across Pakistan.
          </p>

          <form onSubmit={handleReviewSubmit} className="mt-6 space-y-4 bg-white border border-[#E5E1D8] rounded-lg p-6">
            <h3 className="text-base font-semibold text-[#161514]">
              Write a Review
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="rev-name" className="block text-xs font-medium text-[#5C5954] mb-1">
                  Your Name
                </label>
                <input
                  id="rev-name"
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="e.g. Hassan Ali"
                  className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#D4CFC5] rounded-md focus:outline-none focus:border-[#161514]"
                />
              </div>
              <div>
                <label htmlFor="rev-city" className="block text-xs font-medium text-[#5C5954] mb-1">
                  City
                </label>
                <input
                  id="rev-city"
                  type="text"
                  value={reviewerCity}
                  onChange={(e) => setReviewerCity(e.target.value)}
                  placeholder="e.g. Lahore"
                  className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#D4CFC5] rounded-md focus:outline-none focus:border-[#161514]"
                />
              </div>
            </div>

            <div>
              <span className="block text-xs font-medium text-[#5C5954] mb-1.5">
                Rating
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    aria-label={`Rate ${star} out of 5`}
                    className="p-1"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= reviewRating
                          ? 'fill-[#8C6D3F] text-[#8C6D3F]'
                          : 'text-[#D4CFC5]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="rev-comment" className="block text-xs font-medium text-[#5C5954] mb-1">
                Your Review
              </label>
              <textarea
                id="rev-comment"
                rows={3}
                required
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share longevity, projection, and scent notes..."
                className="w-full px-3 py-2 text-sm bg-[#FAF9F6] border border-[#D4CFC5] rounded-md focus:outline-none focus:border-[#161514]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-medium bg-[#161514] text-[#FAF9F6] rounded-md hover:bg-[#2C2A28] transition-colors"
            >
              Submit Review
            </button>

            {reviewSubmitted && (
              <p className="text-xs font-medium text-[#70552E]">
                Thank you. Your review has been published.
              </p>
            )}
          </form>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {product.reviews.map((review) => (
            <article
              key={review.id}
              className="bg-white border border-[#E5E1D8] rounded-lg p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-sm font-semibold text-[#161514]">
                    {review.author}
                  </span>
                  <span className="mx-2 text-[#D4CFC5]">·</span>
                  <span className="text-xs text-[#5C5954]">{review.city}</span>
                </div>
                <span className="text-xs text-[#5C5954]">{review.date}</span>
              </div>

              <div className="mt-2 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < review.rating
                        ? 'fill-[#8C6D3F] text-[#8C6D3F]'
                        : 'text-[#E5E1D8]'
                    }`}
                    aria-hidden="true"
                  />
                ))}
                {review.verifiedPurchase && (
                  <span className="ml-2 text-xs text-[#8C6D3F]">
                    Verified Buyer
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm text-[#3D3A36] leading-relaxed">
                {review.comment}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Mobile Sticky Bottom Buy Bar (<= 64px height, well under 15% mobile viewport cap) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#FAF9F6] border-t border-[#E5E1D8] px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-[#5C5954] truncate">{product.name} · {activeVariant.size}</p>
          <p className="text-sm font-semibold text-[#161514] tabular-nums">
            {formatPkr(activeVariant.pricePkr * quantity)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onBuyNow(product.id, activeVariant.size, quantity)}
          className="px-5 py-2.5 text-xs font-medium bg-[#161514] text-[#FAF9F6] rounded-md whitespace-nowrap shrink-0"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
