import { Star } from 'lucide-react';
import { clsx } from 'clsx';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export default function StarRating({ rating, maxRating = 5, size = 'md', interactive = false, onChange }: StarRatingProps) {
  const sizes = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-7 h-7' };

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxRating }).map((_, i) => {
        const filled = i < Math.floor(rating);
        const partial = !filled && i < rating;
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(i + 1)}
            className={clsx(
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default',
              'focus:outline-none'
            )}
          >
            <Star
              className={clsx(
                sizes[size],
                'transition-colors',
                filled ? 'text-amber-400 fill-amber-400' : partial ? 'text-amber-400 fill-amber-200' : 'text-neutral-200 fill-neutral-100'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
