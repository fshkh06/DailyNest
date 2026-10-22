import React, { useState } from 'react';
import { Rating } from '../common/Rating';
import { Star, ThumbsUp, CheckCircle2, MessageSquare } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpfulCount: number;
}

const SAMPLE_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Daniel Vance',
    rating: 5,
    date: 'March 14, 2026',
    title: 'Outstanding quality and finish',
    comment: 'Exceeded all my expectations. The tactile feel of the materials is solid, packaging was immaculate and delivery was next day. Will order again without hesitation.',
    verified: true,
    helpfulCount: 24
  },
  {
    id: 'rev-2',
    author: 'Clara Henderson',
    rating: 5,
    date: 'February 28, 2026',
    title: 'A true daily essential',
    comment: 'I use this product every single day. Minimalist design fits my modern apartment aesthetic so seamlessly. Highly recommend to anyone on the fence.',
    verified: true,
    helpfulCount: 16
  },
  {
    id: 'rev-3',
    author: 'Aiden Brooks',
    rating: 4,
    date: 'January 19, 2026',
    title: 'Very good purchase for the price',
    comment: 'Great value compared to other retail alternatives. Solid construction and reliable utility. Only minor complaint is that the outer box had a small dent, but product inside was in pristine condition.',
    verified: true,
    helpfulCount: 8
  }
];

interface ProductReviewsProps {
  productRating: number;
  productReviewCount: number;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({
  productRating,
  productReviewCount
}) => {
  const [reviews, setReviews] = useState<ReviewItem[]>(SAMPLE_REVIEWS);
  const [newReviewText, setNewReviewText] = useState('');
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success } = useToast();

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewText.trim() || !newReviewAuthor.trim()) return;

    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      title: newReviewTitle.trim() || 'Verified DailyNest Purchase',
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewText.trim(),
      verified: true,
      helpfulCount: 0
    };

    setReviews([newRev, ...reviews]);
    setNewReviewText('');
    setNewReviewTitle('');
    setNewReviewAuthor('');
    setIsSubmitting(false);
    success('Thank you! Your verified review has been published.');
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-950/5 shadow-subtle my-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-slate-100 gap-6">
        <div>
          <h3 className="text-xl font-bold text-[#0F3427]">Customer Reviews</h3>
          <p className="text-xs text-slate-500 mt-1">Verified feedback from real DailyNest owners</p>
        </div>

        {/* Overall Rating Breakdown */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <span className="text-4xl font-extrabold text-[#0F3427]">{productRating.toFixed(1)}</span>
            <div className="mt-1">
              <Rating rating={productRating} showCount={false} size="sm" />
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{productReviewCount} total ratings</p>
          </div>
          <div className="h-12 w-px bg-slate-200 hidden sm:block" />
          <button
            onClick={() => setIsSubmitting(!isSubmitting)}
            className="px-5 py-2.5 bg-[#0F3427] hover:bg-[#144333] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            {isSubmitting ? 'Cancel' : 'Write a Review'}
          </button>
        </div>
      </div>

      {/* Review Submission Form */}
      {isSubmitting && (
        <form onSubmit={handleReviewSubmit} className="my-6 p-6 rounded-2xl bg-emerald-50/40 border border-emerald-100 space-y-4 animate-slide-up">
          <h4 className="text-sm font-bold text-[#0F3427]">Share Your Experience</h4>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Rating:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewReviewRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= newReviewRating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              value={newReviewAuthor}
              onChange={e => setNewReviewAuthor(e.target.value)}
              placeholder="Your Name"
              className="px-3.5 py-2.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F3427]"
            />
            <input
              type="text"
              value={newReviewTitle}
              onChange={e => setNewReviewTitle(e.target.value)}
              placeholder="Review Headline"
              className="px-3.5 py-2.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F3427]"
            />
          </div>

          <textarea
            required
            rows={3}
            value={newReviewText}
            onChange={e => setNewReviewText(e.target.value)}
            placeholder="What did you like or dislike about this product? How does it fit into your everyday routine?"
            className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:border-[#0F3427]"
          />

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsSubmitting(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#0F3427] text-white rounded-xl text-xs font-bold shadow-md hover:bg-[#144333]"
            >
              Submit Review
            </button>
          </div>
        </form>
      )}

      {/* Review List */}
      <div className="divide-y divide-slate-100 pt-6 space-y-6">
        {reviews.map(rev => (
          <div key={rev.id} className="pt-6 first:pt-0 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Rating rating={rev.rating} showCount={false} size="sm" />
                <h4 className="text-sm font-bold text-slate-800">{rev.title}</h4>
              </div>
              <span className="text-xs text-slate-400">{rev.date}</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">{rev.author}</span>
                {rev.verified && (
                  <span className="flex items-center gap-1 text-[11px] text-fresh-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified Purchase
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  setReviews(prev =>
                    prev.map(r =>
                      r.id === rev.id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
                    )
                  );
                }}
                className="flex items-center gap-1 hover:text-slate-600 transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Helpful ({rev.helpfulCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
