import { useState, useEffect } from 'react';
import api from '@/lib/api';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import { BOOKING_STATUS_LABELS } from '@shared/constants';
import { Inbox, Check, X, Mail } from 'lucide-react';

export default function BookingRequestsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState('');

  const loadBookings = async () => {
    const res = await api.get(`/bookings${filter ? `?status=${filter}` : ''}`);
    setBookings(res.data.data || []);
    setIsLoading(false);
  };

  useEffect(() => { loadBookings(); }, [filter]);

  const handleRespond = async (id: string, status: 'accepted' | 'rejected') => {
    try {
      await api.patch(`/bookings/${id}`, { status, responseMessage });
      setRespondingId(null);
      setResponseMessage('');
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

  const statusTabs = ['pending', 'accepted', 'rejected'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold text-neutral-900 mb-6">Запросы на бронирование</h1>

      <div className="flex gap-2 mb-6">
        {statusTabs.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${filter === s ? 'bg-brand-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
            {BOOKING_STATUS_LABELS[s] || s} ({bookings.filter(b => b.status === s).length})
          </button>
        ))}
      </div>

      {bookings.length === 0 ? (
        <EmptyState icon={<Inbox className="w-12 h-12" />} title="Нет запросов на бронирование" description={`Нет запросов на бронирование со статусом «${BOOKING_STATUS_LABELS[filter] || filter}».`} />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking: any) => (
            <div key={booking.id} className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={booking.property?.images?.[0]?.url || 'https://placehold.co/80'} alt={booking.property?.title || 'Property'} className="w-16 h-16 rounded-xl object-cover" loading="lazy" decoding="async" />
                  <div>
                    <p className="font-semibold text-neutral-900">{booking.property?.title || 'Property'}</p>
                    <p className="text-sm text-neutral-500">
                      От: {booking.renter?.fullName} ({booking.renter?.email}) · Заезд: {new Date(booking.moveInDate).toLocaleDateString()} · {booking.durationMonths} мес.
                    </p>
                    {booking.message && <p className="text-sm text-neutral-400 mt-1"><Mail className="w-3 h-3 inline mr-1" /> {booking.message}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={booking.status === 'pending' ? 'warning' : booking.status === 'accepted' ? 'success' : 'danger'}>{BOOKING_STATUS_LABELS[booking.status] || booking.status}</Badge>
                  {booking.status === 'pending' && (
                    <>
                      {respondingId === booking.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Текст ответа..."
                            value={responseMessage}
                            onChange={(e) => setResponseMessage(e.target.value)}
                            className="px-3 py-1.5 border border-neutral-200 rounded-lg text-xs w-40"
                          />
                          <Button variant="primary" size="sm" onClick={() => handleRespond(booking.id, 'accepted')}>
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => handleRespond(booking.id, 'rejected')}>
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => setRespondingId(booking.id)}>Ответить</Button>
                      )}
                    </>
                  )}
                  {booking.status !== 'pending' && booking.responseMessage && (
                    <p className="text-xs text-neutral-400">Ответ: {booking.responseMessage}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
