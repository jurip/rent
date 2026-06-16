import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '@/lib/api';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Токен подтверждения не предоставлен.');
      return;
    }
    api.get(`/auth/verify-email?token=${token}`)
      .then(() => {
        setStatus('success');
        setMessage('Ваш email подтверждён. Теперь вы можете войти.');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Не удалось подтвердить email. Возможно, срок ссылки истёк.');
      });
  }, [token]);

  const statusClasses = {
    loading: 'bg-brand-50 text-brand-700',
    success: 'bg-green-50 text-green-700',
    error: 'bg-red-50 text-red-700',
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center bg-white rounded-2xl shadow-card p-8">
        {status === 'loading' && (
          <div className="flex justify-center mb-4">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-4 ${statusClasses[status]}`}>
          {status === 'loading' ? 'Проверка...' : status === 'success' ? 'Подтверждено!' : 'Ошибка'}
        </div>

        <p className="text-neutral-600 mb-6">{message}</p>

        {status !== 'loading' && (
          <Link to="/login">
            <span className="inline-flex px-6 py-3 bg-brand-600 text-white rounded-xl font-medium hover:bg-brand-700 transition-colors">
Перейти ко входу
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
