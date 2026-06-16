import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Lock } from 'lucide-react';
import { PASSWORD_MIN_LENGTH } from '@shared/constants';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Недействительная ссылка. Пожалуйста, запросите новую.');
      return;
    }
    if (password.length < PASSWORD_MIN_LENGTH) {
      setError(`Пароль должен содержать минимум ${PASSWORD_MIN_LENGTH} символов`);
      return;
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось сбросить пароль. Возможно, ссылка устарела.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center bg-white rounded-2xl shadow-card p-8">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-brand-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-neutral-900 mb-2">Пароль сброшен!</h2>
          <p className="text-neutral-500 mb-6">Ваш пароль обновлён. Теперь вы можете войти.</p>
          <Link to="/login">
            <Button variant="primary" size="lg">Войти</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">Установите новый пароль</h1>
          <p className="text-neutral-500">Придумайте надёжный пароль для вашего аккаунта</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-8 space-y-5">
          {!token && (
            <div className="bg-yellow-50 text-yellow-700 text-sm rounded-lg px-4 py-3">
              Отсутствует токен сброса.{' '}
              <Link to="/forgot-password" className="underline font-medium">Запросить новую ссылку</Link>
            </div>
          )}

          {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>}

          <Input label="Новый пароль" type="password" placeholder={`Минимум ${PASSWORD_MIN_LENGTH} символов`} value={password} onChange={(e) => setPassword(e.target.value)} />
          <Input label="Подтвердите новый пароль" type="password" placeholder="Повторите пароль" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? 'Сброс...' : 'Сбросить пароль'}
          </Button>
        </form>
      </div>
    </div>
  );
}
