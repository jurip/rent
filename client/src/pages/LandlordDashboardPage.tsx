import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { PROPERTY_TYPE_LABELS, AMENITY_LABELS } from '@shared/constants';
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
    if (!confirm('Вы уверены? Это удалит объект и все связанные данные.')) return;
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
          <h1 className="text-2xl font-display font-bold text-neutral-900 mb-1">Добро пожаловать, {user?.fullName}</h1>
          <p className="text-neutral-500">Управляйте объектами и запросами на бронирование.</p>
        </div>
        {!isNewUser && (
          <Button variant="primary" size="md" onClick={() => setShowCreateForm(!showCreateForm)}>
            <Plus className="w-4 h-4 mr-2" /> Добавить объявление
          </Button>
        )}
      </div>

      {isNewUser ? (
        <EmptyState
          icon={<Building2 className="w-12 h-12" />}
          title="Создайте первое объявление"
          description="Начните с добавления объекта. После публикации потенциальные арендаторы смогут найти и забронировать его."
          action={{ label: 'Создать объявление', onClick: () => setShowCreateForm(true) }}
        />
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mb-3"><Building2 className="w-5 h-5 text-brand-600" /></div>
              <div className="text-2xl font-bold text-neutral-900">{properties.length}</div>
              <div className="text-sm text-neutral-400">Активные объявления</div>
            </div>
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3"><Eye className="w-5 h-5 text-blue-600" /></div>
              <div className="text-2xl font-bold text-neutral-900">{totalViews}</div>
              <div className="text-sm text-neutral-400">Всего просмотров</div>
            </div>
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-3"><Clock className="w-5 h-5 text-amber-600" /></div>
              <div className="text-2xl font-bold text-neutral-900">{pendingBookings}</div>
              <div className="text-sm text-neutral-400">Ожидающие запросы</div>
            </div>
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-3"><Eye className="w-5 h-5 text-green-600" /></div>
              <div className="text-2xl font-bold text-neutral-900">{bookings.length - pendingBookings}</div>
              <div className="text-sm text-neutral-400">Обработанные запросы</div>
            </div>
          </div>

          {/* Property Management */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-display font-semibold text-neutral-900">Ваши объекты</h2>
              <Link to="/landlord/bookings" className="text-sm text-brand-600 hover:text-brand-700">Запросы на бронирование &rarr;</Link>
            </div>
            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-100 bg-neutral-50">
                    <th className="text-left p-4 font-medium text-neutral-500">Объект</th>
                    <th className="text-left p-4 font-medium text-neutral-500 hidden md:table-cell">Цена</th>
                    <th className="text-left p-4 font-medium text-neutral-500 hidden md:table-cell">Статус</th>
                    <th className="text-left p-4 font-medium text-neutral-500 hidden md:table-cell">Просмотры</th>
                    <th className="text-right p-4 font-medium text-neutral-500">Действия</th>
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
                      <td className="p-4 hidden md:table-cell text-neutral-700">${prop.price.toLocaleString()}/мес</td>
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
      setError(err.response?.data?.message || 'Не удалось создать объявление');
    } finally {
      setSubmitting(false);
    }
  };

  const amenities = ['parking', 'gym', 'pool', 'pet-friendly', 'furnished', 'in-unit-laundry', 'dishwasher', 'air-conditioning', 'balcony', 'garden', 'security', 'elevator', 'storage', 'rooftop'];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-elevated max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
        <h2 className="text-xl font-display font-semibold mb-4">Новое объявление</h2>
        <div className="flex gap-2 mb-6">
          {['Детали', 'Расположение', 'Удобства'].map((s, i) => (
            <div key={s} className={`flex-1 h-1 rounded-full ${step > i ? 'bg-brand-500' : 'bg-neutral-200'}`} />
          ))}
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}

        {step === 1 && (
          <div className="space-y-4">
            <input className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm" placeholder="Название объекта" value={form.title} onChange={e => update('title', e.target.value)} />
            <textarea className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm resize-none" rows={3} placeholder="Описание" value={form.description} onChange={e => update('description', e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <input type="number" className="px-4 py-2.5 rounded-xl border border-neutral-200 text-sm" placeholder="Цена/мес" value={form.price} onChange={e => update('price', e.target.value)} />
              <select className="px-4 py-2.5 rounded-xl border border-neutral-200 text-sm" value={form.propertyType} onChange={e => update('propertyType', e.target.value)}>
                {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <input type="number" className="px-4 py-2.5 rounded-xl border border-neutral-200 text-sm" placeholder="Спальни" value={form.bedrooms} onChange={e => update('bedrooms', e.target.value)} />
              <input type="number" className="px-4 py-2.5 rounded-xl border border-neutral-200 text-sm" placeholder="Ванные" value={form.bathrooms} onChange={e => update('bathrooms', e.target.value)} />
              <input type="number" className="px-4 py-2.5 rounded-xl border border-neutral-200 text-sm" placeholder="м²" value={form.squareFeet} onChange={e => update('squareFeet', e.target.value)} />
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.furnished} onChange={e => update('furnished', e.target.checked)} className="rounded" /> С мебелью
              </label>
              <input type="date" className="px-4 py-2.5 rounded-xl border border-neutral-200 text-sm flex-1" value={form.availableDate} onChange={e => update('availableDate', e.target.value)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <input className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm" placeholder="Улица и дом" value={form.address} onChange={e => update('address', e.target.value)} />
            <div className="grid grid-cols-2 gap-3">
              <input className="px-4 py-2.5 rounded-xl border border-neutral-200 text-sm" placeholder="Город" value={form.city} onChange={e => update('city', e.target.value)} />
              <input className="px-4 py-2.5 rounded-xl border border-neutral-200 text-sm" placeholder="Район" value={form.neighborhood} onChange={e => update('neighborhood', e.target.value)} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-wrap gap-2">
            {amenities.map(a => (
              <button key={a} type="button" onClick={() => toggleAmenity(a)} className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-colors ${form.amenities.includes(a) ? 'bg-brand-100 text-brand-700 border-2 border-brand-300' : 'bg-neutral-50 text-neutral-500 border-2 border-transparent hover:border-neutral-200'}`}>
                {AMENITY_LABELS[a] || a.replace(/-/g, ' ')}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-3 mt-6">
          {step > 1 && <Button variant="ghost" size="sm" onClick={() => setStep(s => s - 1)}>Назад</Button>}
          {step < 3 ? (
            <Button variant="primary" size="sm" className="ml-auto" onClick={() => setStep(s => s + 1)}>Далее</Button>
          ) : (
            <Button variant="primary" size="sm" className="ml-auto" onClick={handleSubmit} disabled={submitting}>{submitting ? 'Создание...' : 'Создать объявление'}</Button>
          )}
          <Button variant="ghost" size="sm" onClick={onCancel}>Отмена</Button>
        </div>
      </div>
    </div>
  );
}
