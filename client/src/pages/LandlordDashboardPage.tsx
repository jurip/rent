import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { Building2, Eye, Clock, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function LandlordDashboardPage() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [properties, setProperties] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [propRes, bookRes] = await Promise.all([
        api.get('/properties/landlord/mine'),
        api.get('/bookings'),
      ]);
      setProperties(propRes.data.data.properties || []);
      setBookings(bookRes.data.data || []);
      setTotalViews(propRes.data.data.properties?.reduce((sum: number, p: any) => sum + (p.views || 0), 0) || 0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleToggleStatus = async (propertyId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await api.patch(`/properties/${propertyId}`, { status: newStatus });
      loadData();
    } catch {}
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm('Are you sure? This will delete the property and all associated data.')) return;
    try {
      await api.delete(`/properties/${propertyId}`);
      loadData();
    } catch {}
  };

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

  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const isNewUser = properties.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-neutral-900 mb-1">Welcome, {user?.fullName}</h1>
          <p className="text-neutral-500">Manage your properties and booking requests.</p>
        </div>
        {!isNewUser && (
          <Button variant="primary" size="md" onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="w-4 h-4 mr-2" /> Add New Listing
          </Button>
        )}
      </div>

      {isNewUser ? (
        <EmptyState
          icon={<Building2 className="w-12 h-12" />}
          title="Create your first listing"
          description="Get started by adding your property. Once it's live, potential renters can find and book it."
          action={{ label: 'Create Listing', onClick: () => setShowCreateForm(true) }}
        />
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mb-3"><Building2 className="w-5 h-5 text-brand-600" /></div>
              <div className="text-2xl font-bold text-neutral-900">{properties.length}</div>
              <div className="text-sm text-neutral-400">Active Listings</div>
            </div>
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3"><Eye className="w-5 h-5 text-blue-600" /></div>
              <div className="text-2xl font-bold text-neutral-900">{totalViews}</div>
              <div className="text-sm text-neutral-400">Total Views</div>
            </div>
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-3"><Clock className="w-5 h-5 text-amber-600" /></div>
              <div className="text-2xl font-bold text-neutral-900">{pendingBookings}</div>
              <div className="text-sm text-neutral-400">Pending Requests</div>
            </div>
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-3"><Eye className="w-5 h-5 text-green-600" /></div>
              <div className="text-2xl font-bold text-neutral-900">{bookings.length - pendingBookings}</div>
              <div className="text-sm text-neutral-400">Processed Requests</div>
            </div>
          </div>

          {/* Property Management */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold text-neutral-900">Your Properties</h2>
              <Link to="/landlord/bookings" className="text-sm text-brand-600 hover:text-brand-700">View Booking Requests &rarr;</Link>
            </div>
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50">
                    <th className="text-left p-4 font-medium text-neutral-500">Property</th>
                    <th className="text-left p-4 font-medium text-neutral-500 hidden md:table-cell">Price</th>
                    <th className="text-left p-4 font-medium text-neutral-500 hidden md:table-cell">Status</th>
                    <th className="text-left p-4 font-medium text-neutral-500 hidden md:table-cell">Views</th>
                    <th className="text-right p-4 font-medium text-neutral-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((prop: any) => (
                    <tr key={prop.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={prop.images?.[0]?.thumbnailUrl || 'https://placehold.co/80'} alt={prop.title} className="w-12 h-12 rounded-lg object-cover hidden sm:block" loading="lazy" decoding="async" />
                          <div>
                            <p className="font-medium text-neutral-900">{prop.title}</p>
                            <p className="text-xs text-neutral-400">{prop.neighborhood}, {prop.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell text-neutral-700">${prop.price.toLocaleString()}/mo</td>
                      <td className="p-4 hidden md:table-cell">
                        <Badge variant={prop.status === 'active' ? 'success' : 'default'}>{prop.status}</Badge>
                      </td>
                      <td className="p-4 hidden md:table-cell text-neutral-500">{prop.views}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleToggleStatus(prop.id, prop.status)} className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors">
                            {prop.status === 'active' ? <ToggleRight className="w-4 h-4 text-green-500" /> : <ToggleLeft className="w-4 h-4" />}
                          </button>
                          <Link to={`/properties/${prop.id}`} className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-brand-600 transition-colors"><Eye className="w-4 h-4" /></Link>
                          <button onClick={() => handleDelete(prop.id)} className="p-2 rounded-lg hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Create Listing Form (simplified inline) */}
      {showCreateForm && (
        <CreateListingForm onCreated={() => { setShowCreateForm(false); loadData(); }} onCancel={() => setShowCreateForm(false)} />
      )}
    </div>
  );
}

function CreateListingForm({ onCreated, onCancel }: { onCreated: () => void; onCancel: () => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '', description: '', price: '', propertyType: 'apartment', bedrooms: '1', bathrooms: '1', squareFeet: '',
    furnished: false, availableDate: '', address: '', city: 'San Francisco', neighborhood: '', latitude: 37.7749, longitude: -122.4194, amenities: [] as string[],
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (field: string, value: any) => setForm(p => ({ ...p, [field]: value }));
  const toggleAmenity = (a: string) => {
    update('amenities', form.amenities.includes(a) ? form.amenities.filter(x => x !== a) : [...form.amenities, a]);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await api.post('/properties', {
        ...form,
        price: Number(form.price),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
        squareFeet: Number(form.squareFeet),
      });
      onCreated();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  const amenities = ['parking', 'gym', 'pool', 'pet-friendly', 'furnished', 'in-unit-laundry', 'dishwasher', 'air-conditioning', 'balcony', 'garden', 'security', 'elevator', 'storage', 'rooftop'];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-elevated max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
        <h2 className="text-xl font-display font-semibold mb-4">Create New Listing</h2>
        <div className="flex gap-2 mb-6">
          {['Details', 'Location', 'Amenities'].map((s, i) => (
            <div key={s} className={`flex-1 h-1 rounded-full ${step > i ? 'bg-brand-500' : 'bg-neutral-200'}`} />
          ))}
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}

        {step === 1 && (
          <div className="space-y-4">
            <input className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm" placeholder="Property Title" value={form.title} onChange={e => update('title', e.target.value)} />
            <textarea className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm resize-none" rows={3} placeholder="Description" value={form.description} onChange={e => update('description', e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" className="px-4 py-2.5 rounded-xl border border-neutral-200 text-sm" placeholder="Price/month" value={form.price} onChange={e => update('price', e.target.value)} />
              <select className="px-4 py-2.5 rounded-xl border border-neutral-200 text-sm" value={form.propertyType} onChange={e => update('propertyType', e.target.value)}>
                <option value="apartment">Apartment</option><option value="house">House</option><option value="condo">Condo</option><option value="studio">Studio</option>
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <input type="number" className="px-4 py-2.5 rounded-xl border border-neutral-200 text-sm" placeholder="Beds" value={form.bedrooms} onChange={e => update('bedrooms', e.target.value)} />
              <input type="number" className="px-4 py-2.5 rounded-xl border border-neutral-200 text-sm" placeholder="Baths" value={form.bathrooms} onChange={e => update('bathrooms', e.target.value)} />
              <input type="number" className="px-4 py-2.5 rounded-xl border border-neutral-200 text-sm" placeholder="SqFt" value={form.squareFeet} onChange={e => update('squareFeet', e.target.value)} />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.furnished} onChange={e => update('furnished', e.target.checked)} className="rounded" /> Furnished
              </label>
              <input type="date" className="px-4 py-2.5 rounded-xl border border-neutral-200 text-sm flex-1" value={form.availableDate} onChange={e => update('availableDate', e.target.value)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <input className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm" placeholder="Street Address" value={form.address} onChange={e => update('address', e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <input className="px-4 py-2.5 rounded-xl border border-neutral-200 text-sm" placeholder="City" value={form.city} onChange={e => update('city', e.target.value)} />
              <input className="px-4 py-2.5 rounded-xl border border-neutral-200 text-sm" placeholder="Neighborhood" value={form.neighborhood} onChange={e => update('neighborhood', e.target.value)} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-wrap gap-2">
            {amenities.map(a => (
              <button key={a} type="button" onClick={() => toggleAmenity(a)} className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-colors ${form.amenities.includes(a) ? 'bg-brand-100 text-brand-700 border-2 border-brand-300' : 'bg-neutral-50 text-neutral-500 border-2 border-transparent hover:border-neutral-200'}`}>
                {a.replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {step > 1 && <Button variant="ghost" size="sm" onClick={() => setStep(s => s - 1)}>Back</Button>}
          {step < 3 ? (
            <Button variant="primary" size="sm" className="ml-auto" onClick={() => setStep(s => s + 1)}>Next</Button>
          ) : (
            <Button variant="primary" size="sm" className="ml-auto" onClick={handleSubmit} disabled={submitting}>{submitting ? 'Creating...' : 'Create Listing'}</Button>
          )}
          <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
