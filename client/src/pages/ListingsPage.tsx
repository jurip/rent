import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '@/lib/api';
import PropertyCard from '@/components/property/PropertyCard';
import Skeleton from '@/components/ui/Skeleton';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Button from '@/components/ui/Button';
import { Search, SlidersHorizontal, Map, Grid3X3, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Property, PropertyListResponse } from '@shared/types';
import { SORT_OPTIONS, PROPERTY_TYPE_LABELS } from '@shared/constants';

export default function ListingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const page = Number(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const propertyType = searchParams.get('propertyType') || '';
  const minBedrooms = searchParams.get('minBedrooms') || '';
  const minBathrooms = searchParams.get('minBathrooms') || '';

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('pageSize', '12');
      params.set('sort', sort);
      if (search) params.set('search', search);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (propertyType) params.set('propertyType', propertyType);
      if (minBedrooms) params.set('minBedrooms', minBedrooms);
      if (minBathrooms) params.set('minBathrooms', minBathrooms);

      const res = await api.get<{ success: boolean; data: PropertyListResponse }>(`/properties?${params}`);
      setProperties(res.data.data.properties);
      setTotal(res.data.data.total);
      setTotalPages(res.data.data.totalPages);
    } catch {
      setError('Не удалось загрузить объекты. Пожалуйста, попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, sort, minPrice, maxPrice, propertyType, minBedrooms, minBathrooms]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') params.set('page', '1');
    setSearchParams(params);
  };

  const handleFavoriteToggle = async (propertyId: string, isFavorited: boolean) => {
    try {
      if (isFavorited) {
        await api.post(`/favorites/${propertyId}`);
      } else {
        await api.delete(`/favorites/${propertyId}`);
      }
    } catch {
      // Silently fail; optimistic update handled by PropertyCard state
    }
  };

  if (error) return <ErrorState message={error} onRetry={fetchProperties} />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search + Filters Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Поиск по городу или району..."
              value={search}
              onChange={(e) => updateParam('search', e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>
          <Button
            variant="outline"
            size="md"
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex-shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Фильтры
          </Button>
          <div className="flex items-center bg-neutral-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-neutral-500'}`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'map' ? 'bg-white shadow-sm' : 'text-neutral-500'}`}
            >
              <Map className="w-4 h-4" />
            </button>
          </div>
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="bg-white border border-neutral-200 rounded-xl px-3 py-3 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Filter Panel */}
        {filtersOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-white rounded-2xl shadow-card p-6 mb-4 grid grid-cols-2 md:grid-cols-5 gap-4"
          >
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">Мин. цена</label>
              <input type="number" placeholder="$0" value={minPrice} onChange={(e) => updateParam('minPrice', e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">Макс. цена</label>
              <input type="number" placeholder="$9999" value={maxPrice} onChange={(e) => updateParam('maxPrice', e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">Тип объекта</label>
              <select value={propertyType} onChange={(e) => updateParam('propertyType', e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm">
                <option value="">Все</option>
                <option value="apartment">{PROPERTY_TYPE_LABELS.apartment}</option>
                <option value="house">{PROPERTY_TYPE_LABELS.house}</option>
                <option value="condo">{PROPERTY_TYPE_LABELS.condo}</option>
                <option value="studio">{PROPERTY_TYPE_LABELS.studio}</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">Мин. спален</label>
              <select value={minBedrooms} onChange={(e) => updateParam('minBedrooms', e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm">
                <option value="">Любое</option>
                <option value="0">Студия</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">Мин. ванных</label>
              <select value={minBathrooms} onChange={(e) => updateParam('minBathrooms', e.target.value)} className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm">
                <option value="">Любое</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
            </div>
          </motion.div>
        )}

        {/* Results count */}
        {!isLoading && (
          <p className="text-sm text-neutral-400">Найдено {total} {total === 1 ? 'объект' : 'объектов'}</p>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden">
              <Skeleton className="h-52 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && properties.length === 0 && (
        <EmptyState
          icon={<Home className="w-12 h-12" />}
          title="Объекты не найдены"
          description="Попробуйте изменить параметры поиска или убрать некоторые фильтры."
          action={{ label: 'Сбросить фильтры', onClick: () => setSearchParams({}) }}
        />
      )}

      {/* Property Grid */}
      {!isLoading && properties.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => updateParam('page', String(p))}
          />
        </div>
      )}
    </div>
  );
}
