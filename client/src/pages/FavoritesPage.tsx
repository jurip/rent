import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import PropertyCard from '@/components/property/PropertyCard';
import EmptyState from '@/components/ui/EmptyState';
import Skeleton from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import { Heart, ArrowLeftRight } from 'lucide-react';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const loadFavorites = async () => {
    const res = await api.get('/favorites?sort=date_saved');
    setFavorites(res.data.data || []);
    setIsLoading(false);
  };

  useEffect(() => { loadFavorites(); }, []);

  const handleFavoriteToggle = async (propertyId: string, isFavorited: boolean) => {
    if (!isFavorited) {
      try {
        await api.delete(`/favorites/${propertyId}`);
        setFavorites((prev) => prev.filter((f) => f.propertyId !== propertyId));
      } catch {}
    }
  };

  const toggleSelect = (propertyId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(propertyId)) next.delete(propertyId);
      else if (next.size < 3) next.add(propertyId);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-900 mb-1">Saved Properties</h1>
          <p className="text-neutral-500">{favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved</p>
        </div>
        {favorites.length >= 2 && (
          <div className="flex gap-3">
            <Link to={`/favorites/compare?ids=${Array.from(selectedIds).join(',')}`}>
              <Button variant="outline" size="sm" disabled={selectedIds.size < 2}>
                <ArrowLeftRight className="w-4 h-4 mr-1.5" />
                Compare ({selectedIds.size})
              </Button>
            </Link>
          </div>
        )}
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-12 h-12" />}
          title="No saved properties yet"
          description="Start browsing and save the ones you love!"
          action={{ label: 'Browse Listings', to: '/listings' }}
        />
      ) : (
        <div className="space-y-4">
          {favorites.map((fav) => (
            <div key={fav.id} className="relative">
              <label className="absolute top-4 left-4 z-10">
                <input
                  type="checkbox"
                  checked={selectedIds.has(fav.propertyId)}
                  onChange={() => toggleSelect(fav.propertyId)}
                  disabled={selectedIds.size >= 3 && !selectedIds.has(fav.propertyId)}
                  className="w-5 h-5 rounded border-neutral-300 text-brand-600 focus:ring-brand-500"
                />
              </label>
              <PropertyCard
                property={fav.property}
                onFavoriteToggle={handleFavoriteToggle}
                isFavorited={true}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
