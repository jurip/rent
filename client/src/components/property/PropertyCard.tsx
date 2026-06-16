import { Link } from 'react-router-dom';
import { Heart, Bed, Bath, Maximize, MapPin } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Property } from '@shared/types';
import { useAuthStore } from '@/stores/auth.store';

interface PropertyCardProps {
  property: Property;
  onFavoriteToggle?: (propertyId: string, isFavorited: boolean) => void;
  isFavorited?: boolean;
}

export default function PropertyCard({ property, onFavoriteToggle, isFavorited = false }: PropertyCardProps) {
  const { isAuthenticated } = useAuthStore();
  const [favorited, setFavorited] = useState(isFavorited);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    const newState = !favorited;
    setFavorited(newState);
    onFavoriteToggle?.(property.id, newState);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);

  return (
    <Link to={`/properties/${property.id}`} className="group block">
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-elevated transition-shadow duration-300"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={property.images?.[0]?.url || 'https://placehold.co/600x450/e2e8f0/64748b?text=No+Image'}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
          {/* Price overlay */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-neutral-900 px-3 py-1.5 rounded-xl text-sm font-semibold shadow-sm">
            {formatPrice(property.price)}<span className="text-neutral-400 font-normal">/mo</span>
          </div>
          {/* Favorite button */}
          {isAuthenticated && (
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={handleFavorite}
              className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  favorited ? 'text-red-500 fill-red-500' : 'text-neutral-400'
                }`}
                aria-hidden="true"
              />
            </motion.button>
          )}
          {/* Property type badge */}
          <div className="absolute top-3 left-3">
            <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm text-neutral-700 text-xs font-medium rounded-lg capitalize shadow-sm">
              {property.propertyType}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-neutral-900 mb-1 group-hover:text-brand-600 transition-colors line-clamp-1">
            {property.title}
          </h3>
          <p className="flex items-center gap-1 text-sm text-neutral-400 mb-3">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{property.neighborhood}, {property.city}</span>
          </p>
          <div className="flex items-center gap-4 text-sm text-neutral-500">
            <span className="flex items-center gap-1">
              <Bed className="w-4 h-4" /> {property.bedrooms}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="w-4 h-4" /> {property.bathrooms}
            </span>
            <span className="flex items-center gap-1">
              <Maximize className="w-4 h-4" /> {property.squareFeet.toLocaleString()} sqft
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
