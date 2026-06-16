import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import { Heart, CheckCircle, Search, Clock } from 'lucide-react';

export default function RenterDashboardPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      api.get('/favorites').then(r => setFavoritesCount(r.data.data.length)),
      api.get('/bookings').then(r => setBookings(r.data.data)),
    ]).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const pendingCount = bookings.filter((b: any) => b.status === 'pending').length;
  const acceptedCount = bookings.filter((b: any) => b.status === 'accepted').length;

  const isNewUser = favoritesCount === 0 && bookings.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold text-neutral-900 mb-1">Welcome, {user?.fullName}</h1>
      <p className="text-neutral-500 mb-8">Here's an overview of your rental journey.</p>

      {isNewUser ? (
        <EmptyState
          icon={<Search className="w-12 h-12" />}
          title="Start your search"
          description="Browse properties to find your next home. Save properties you like to compare them later."
          action={{ label: 'Browse Listings', to: '/listings' }}
        />
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Link to="/favorites" className="bg-white rounded-2xl shadow-card p-6 hover:shadow-elevated transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center"><Heart className="w-6 h-6 text-red-500" /></div>
                <div>
                  <div className="text-2xl font-bold text-neutral-900">{favoritesCount}</div>
                  <div className="text-sm text-neutral-400">Saved Properties</div>
                </div>
              </div>
            </Link>
            <Link to="/my-bookings" className="bg-white rounded-2xl shadow-card p-6 hover:shadow-elevated transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center"><Clock className="w-6 h-6 text-amber-500" /></div>
                <div>
                  <div className="text-2xl font-bold text-neutral-900">{pendingCount}</div>
                  <div className="text-sm text-neutral-400">Pending Requests</div>
                </div>
              </div>
            </Link>
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-500" /></div>
                <div>
                  <div className="text-2xl font-bold text-neutral-900">{acceptedCount}</div>
                  <div className="text-sm text-neutral-400">Accepted Bookings</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          {bookings.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-display font-semibold text-neutral-900">Recent Booking Requests</h2>
                <Link to="/my-bookings" className="text-sm text-brand-600 hover:text-brand-700">View all</Link>
              </div>
              <div className="space-y-3">
                {bookings.slice(0, 3).map((booking: any) => (
                  <div key={booking.id} className="bg-white rounded-xl shadow-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={booking.property?.images?.[0]?.url || 'https://placehold.co/80'} alt={booking.property?.title || 'Property'} className="w-14 h-14 rounded-lg object-cover" loading="lazy" decoding="async" />
                      <div>
                        <p className="font-medium text-neutral-900 text-sm">{booking.property?.title || 'Property'}</p>
                        <p className="text-xs text-neutral-400">{new Date(booking.moveInDate).toLocaleDateString()} · {booking.durationMonths} months</p>
                      </div>
                    </div>
                    <Badge variant={booking.status === 'pending' ? 'warning' : booking.status === 'accepted' ? 'success' : 'danger'}>
                      {booking.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
