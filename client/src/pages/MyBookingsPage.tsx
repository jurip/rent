import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { Calendar, XCircle } from 'lucide-react';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const loadBookings = async () => {
    const params = filter ? `?status=${filter}` : '';
    const res = await api.get(`/bookings${params}`);
    setBookings(res.data.data || []);
    setIsLoading(false);
  };

  useEffect(() => { loadBookings(); }, [filter]);

  const handleCancel = async (id: string) => {
    try {
      await api.patch(`/bookings/${id}/cancel`);
      loadBookings();
    } catch {}
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div>
      </div>
    );
  }

  const statusFilters = ['', 'pending', 'accepted', 'rejected', 'cancelled'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold text-neutral-900 mb-6">My Booking Requests</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {statusFilters.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize whitespace-nowrap transition-colors ${filter === s ? 'bg-brand-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
            {s || 'All'} ({s ? bookings.filter(b => b.status === s).length : bookings.length})
          </button>
        ))}
      </div>

      {bookings.length === 0 ? (
        <EmptyState icon={<Calendar className="w-12 h-12" />} title="No booking requests" description="When you submit booking requests for properties, they will appear here." action={{ label: 'Browse Properties', to: '/listings' }} />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking: any) => (
            <div key={booking.id} className="bg-white rounded-2xl shadow-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img src={booking.property?.images?.[0]?.url || 'https://placehold.co/80'} alt={booking.property?.title || 'Property'} className="w-16 h-16 rounded-xl object-cover" loading="lazy" decoding="async" />
                <div>
                  <Link to={`/properties/${booking.propertyId}`} className="font-semibold text-neutral-900 hover:text-brand-600 transition-colors">
                    {booking.property?.title || 'Property'}
                  </Link>
                  <p className="text-sm text-neutral-500">Move-in: {new Date(booking.moveInDate).toLocaleDateString()} · {booking.durationMonths} months</p>
                  {booking.responseMessage && <p className="text-sm text-neutral-400 mt-1">Response: {booking.responseMessage}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={booking.status === 'pending' ? 'warning' : booking.status === 'accepted' ? 'success' : booking.status === 'rejected' ? 'danger' : 'default'}>
                  {booking.status}
                </Badge>
                {booking.status === 'pending' && (
                  <Button variant="ghost" size="sm" onClick={() => handleCancel(booking.id)}>
                    <XCircle className="w-4 h-4 text-red-400" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
