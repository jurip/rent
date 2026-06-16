import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import { Check, Minus } from 'lucide-react';

export default function ComparePage() {
  const [searchParams] = useSearchParams();
  const ids = (searchParams.get('ids') || '').split(',').filter(Boolean);
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all(ids.map((id) => api.get(`/properties/${id}`)))
      .then((results) => setProperties(results.map((r) => r.data.data)))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-96 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(price);

  const rows = [
    { label: 'Цена', render: (p: any) => formatPrice(p.price) + '/мес.' },
    { label: 'Тип', render: (p: any) => p.propertyType },
    { label: 'Спальни', render: (p: any) => p.bedrooms === 0 ? 'Студия' : String(p.bedrooms) },
    { label: 'Ванные', render: (p: any) => String(p.bathrooms) },
    { label: 'Площадь, кв. фт', render: (p: any) => p.squareFeet.toLocaleString() },
    { label: 'Меблировано', render: (p: any) => p.furnished ? <Check className="w-5 h-5 text-green-500" /> : <Minus className="w-5 h-5 text-neutral-300" /> },
    { label: 'Расположение', render: (p: any) => `${p.neighborhood}, ${p.city}` },
    { label: 'Удобства', render: (p: any) => p.amenities?.length || 0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display font-bold text-neutral-900">Сравнение объектов</h1>
        <Link to="/favorites"><Button variant="ghost" size="sm">Назад к избранному</Button></Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="p-4 text-left font-medium text-neutral-500 w-40">Характеристика</th>
              {properties.map((p) => (
                <th key={p.id} className="p-4 text-center">
                  <img src={p.images?.[0]?.thumbnailUrl || 'https://placehold.co/200'} alt={p.title} className="w-full h-36 object-cover rounded-xl mb-2" loading="lazy" decoding="async" />
                  <p className="font-semibold text-neutral-900 text-sm line-clamp-1">{p.title}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-neutral-50">
                <td className="p-4 font-medium text-neutral-500">{row.label}</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-4 text-center text-neutral-700">{row.render(p)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
