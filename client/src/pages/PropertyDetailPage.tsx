import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { MapPin, Bed, Bath, Maximize, Calendar, Heart, Share2, Building, ChevronLeft, ChevronRight, X, Phone, Mail } from 'lucide-react';
import type { Property } from '@shared/types';
import { PROPERTY_TYPE_LABELS, AMENITY_LABELS } from '@shared/constants';

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuthStore();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    api.get<{ success: boolean; data: Property }>(`/properties/${id}`)
      .then((res) => {
        setProperty(res.data.data);
        setError(null);
      })
      .catch((err) => {
        if (err.response?.status === 404) setError('404');
        else setError(err.response?.data?.message || 'Не удалось загрузить объект');
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleFavorite = async () => {
    if (!id) return;
    const newState = !favorited;
    setFavorited(newState);
    try {
      if (newState) await api.post(`/favorites/${id}`);
      else await api.delete(`/favorites/${id}`);
    } catch { setFavorited(!newState); }
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    // Could add toast notification
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-[400px] w-full rounded-2xl mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
          <div>
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error === '404') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl font-display font-bold text-neutral-300 mb-4">404</h1>
        <p className="text-neutral-500 mb-6">Объект не найден. Возможно, он был удалён или ссылка неверна.</p>
        <Link to="/listings"><Button variant="primary">Смотреть объявления</Button></Link>
      </div>
    );
  }

  if (!property) return null;

  const images = property.images?.length ? property.images : [{ id: '0', url: 'https://placehold.co/1200x800/e2e8f0/64748b?text=No+Image', thumbnailUrl: '', order: 0 }];

  return (
    <div>
      {/* Image Gallery */}
      <div className="relative bg-neutral-100">
        <div className="max-w-7xl mx-auto relative h-[300px] md:h-[450px]">
          <img
            src={images[currentImage]?.url}
            alt={property.title}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setLightboxOpen(true)}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={() => setCurrentImage((p) => (p - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentImage((p) => (p + 1) % images.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === currentImage ? 'bg-white w-6' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors" onClick={() => setLightboxOpen(false)} aria-label="Закрыть">
            <X className="w-8 h-8" aria-hidden="true" />
          </button>
          <img src={images[currentImage]?.url} alt={property?.title || 'Изображение объекта'} className="max-h-[90vh] max-w-[90vw] object-contain" decoding="async" />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setCurrentImage((p) => (p - 1 + images.length) % images.length); }}
                className="absolute left-4 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setCurrentImage((p) => (p + 1) % images.length); }}
                className="absolute right-4 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h1 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 mb-2">{property.title}</h1>
                  <p className="flex items-center gap-1.5 text-neutral-500">
                    <MapPin className="w-4 h-4" /> {property.neighborhood}, {property.city}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                  {isAuthenticated && user?.role === 'renter' && (
                    <Button variant="ghost" size="sm" onClick={handleFavorite}>
                      <Heart className={`w-4 h-4 transition-colors ${favorited ? 'text-red-500 fill-red-500' : ''}`} />
                    </Button>
                  )}
                </div>
              </div>
              <p className="text-2xl font-bold text-brand-600">
                {formatPrice(property.price)}<span className="text-base font-normal text-neutral-400">/мес</span>
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 p-5 bg-neutral-50 rounded-2xl">
              <div className="flex items-center gap-2"><Bed className="w-5 h-5 text-neutral-400" /><span className="text-sm font-medium">{property.bedrooms} {property.bedrooms === 0 ? 'Студия' : property.bedrooms === 1 ? 'Спальня' : 'Спальни'}</span></div>
              <div className="flex items-center gap-2"><Bath className="w-5 h-5 text-neutral-400" /><span className="text-sm font-medium">{property.bathrooms} {property.bathrooms === 1 ? 'Ванная' : 'Ванные'}</span></div>
              <div className="flex items-center gap-2"><Maximize className="w-5 h-5 text-neutral-400" /><span className="text-sm font-medium">{property.squareFeet.toLocaleString()} м²</span></div>
              <div className="flex items-center gap-2"><Building className="w-5 h-5 text-neutral-400" /><span className="text-sm font-medium">{PROPERTY_TYPE_LABELS[property.propertyType] || property.propertyType}</span></div>
              {property.yearBuilt && <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-neutral-400" /><span className="text-sm font-medium">Построен в {property.yearBuilt}</span></div>}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-3">Об этом объекте</h2>
              <p className="text-neutral-600 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div>
                <h2 className="text-xl font-display font-semibold text-neutral-900 mb-3">Удобства</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 px-3 py-2.5 bg-neutral-50 rounded-xl text-sm text-neutral-700">
                      <div className="w-2 h-2 bg-brand-400 rounded-full flex-shrink-0" />
                      {AMENITY_LABELS[a] || a.replace(/-/g, ' ')}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews placeholder */}
            <div>
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-3">Отзывы</h2>
              <p className="text-neutral-400 text-sm">Пока нет отзывов. Будьте первым, кто оставит отзыв!</p>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Landlord Card */}
            <div className="sticky top-24 bg-white rounded-2xl shadow-card p-6 space-y-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 font-semibold text-lg">
                    {property.landlord?.fullName?.[0] || 'L'}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{property.landlord?.fullName || 'Landlord'}</p>
                    <p className="text-sm text-neutral-400">Владелец объекта</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  {property.landlord?.email && (
                    <p className="flex items-center gap-2 text-neutral-500"><Mail className="w-4 h-4" /> {property.landlord.email}</p>
                  )}
                  {property.landlord?.phone && (
                    <p className="flex items-center gap-2 text-neutral-500"><Phone className="w-4 h-4" /> {property.landlord.phone}</p>
                  )}
                </div>
              </div>

              {isAuthenticated && user?.role === 'renter' && (
                <div className="space-y-3">
                  {!showBookingForm ? (
                    <Button variant="primary" size="lg" className="w-full" onClick={() => setShowBookingForm(true)}>
                      Запросить бронирование
                    </Button>
                  ) : (
                    <BookingRequestForm propertyId={property.id} onCancel={() => setShowBookingForm(false)} />
                  )}
                </div>
              )}
              {!isAuthenticated && (
                <Link to={`/login?redirect=/properties/${property.id}`}>
                  <Button variant="primary" size="lg" className="w-full">
                    Войдите, чтобы забронировать
                  </Button>
                </Link>
              )}
              {isAuthenticated && user?.role === 'landlord' && (
                <p className="text-sm text-neutral-400 text-center">Арендодатели не могут бронировать объекты</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingRequestForm({ propertyId, onCancel }: { propertyId: string; onCancel: () => void }) {
  const [moveInDate, setMoveInDate] = useState('');
  const [durationMonths, setDurationMonths] = useState(12);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await api.post('/bookings', { propertyId, moveInDate, durationMonths, message });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось отправить запрос на бронирование');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-medium text-neutral-700">Запрос отправлен!</p>
        <p className="text-xs text-neutral-400 mt-1">Владелец скоро ответит.</p>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Дата заезда</label>
        <input type="date" min={today} value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)} required className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm" />
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Срок</label>
        <select value={durationMonths} onChange={(e) => setDurationMonths(Number(e.target.value))} className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm">
          {[3, 6, 12, 24, 36].map((m) => <option key={m} value={m}>{m} мес.</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-neutral-500 mb-1">Сообщение</label>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Расскажите о себе владельцу..." rows={3} className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm resize-none" />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-2">
        <Button type="submit" variant="primary" size="sm" className="flex-1" disabled={submitting}>{submitting ? 'Отправка...' : 'Отправить запрос'}</Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Отмена</Button>
      </div>
    </form>
  );
}
