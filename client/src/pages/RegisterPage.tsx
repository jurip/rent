import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { UserPlus, Building2, User } from 'lucide-react';
import type { UserRole } from '@shared/types';
import { PASSWORD_MIN_LENGTH } from '@shared/constants';

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'renter' as UserRole,
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');
  const { register, isLoading, error, clearError } = useAuthStore();

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setValidationErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.fullName.trim() || form.fullName.length < 2) errors.fullName = 'Имя и фамилия обязательны (минимум 2 символа)';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Требуется корректный email';
    if (!form.phone.trim() || form.phone.length < 5) errors.phone = 'Требуется корректный номер телефона';
    if (form.password.length < PASSWORD_MIN_LENGTH) errors.password = `Пароль должен содержать минимум ${PASSWORD_MIN_LENGTH} символов`;
    if (form.password !== form.confirmPassword) errors.confirmPassword = 'Пароли не совпадают';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccessMessage('');
    if (!validate()) return;

    try {
      const result = await register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: form.role,
      });
      if (result.needsVerification) {
        setSuccessMessage('Регистрация прошла успешно! Проверьте почту для подтверждения аккаунта.');
      }
    } catch {
      // Error handled by store
    }
  };

  if (successMessage) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl shadow-card p-8">
            <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-display font-bold text-neutral-900 mb-2">Проверьте почту</h2>
            <p className="text-neutral-500 mb-6">{successMessage}</p>
            <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium transition-colors">
              Перейти ко входу
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">Создайте аккаунт</h1>
          <p className="text-neutral-500">Присоединяйтесь к RentHub и найдите идеальный дом</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>
          )}

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => update('role', 'renter')}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                form.role === 'renter'
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-neutral-200 text-neutral-500 hover:border-neutral-300'
              }`}
            >
              <User className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm font-medium">Арендатор</span>
            </button>
            <button
              type="button"
              onClick={() => update('role', 'landlord')}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                form.role === 'landlord'
                  ? 'border-brand-500 bg-brand-50 text-brand-700'
                  : 'border-neutral-200 text-neutral-500 hover:border-neutral-300'
              }`}
            >
              <Building2 className="w-5 h-5 mx-auto mb-1" />
              <span className="text-sm font-medium">Арендодатель</span>
            </button>
          </div>

          <Input label="Имя и фамилия" placeholder="Иван Петров" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} error={validationErrors.fullName} />
          <Input label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => update('email', e.target.value)} error={validationErrors.email} />
          <Input label="Телефон" type="tel" placeholder="+7 (999) 000-00-00" value={form.phone} onChange={(e) => update('phone', e.target.value)} error={validationErrors.phone} />
          <Input label="Пароль" type="password" placeholder={`Минимум ${PASSWORD_MIN_LENGTH} символов`} value={form.password} onChange={(e) => update('password', e.target.value)} error={validationErrors.password} />
          <Input label="Подтверждение пароля" type="password" placeholder="Повторите пароль" value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} error={validationErrors.confirmPassword} />

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
            <UserPlus className="w-4 h-4 mr-2" />
            {isLoading ? 'Создание аккаунта...' : 'Создать аккаунт'}
          </Button>

          <p className="text-center text-sm text-neutral-500">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium transition-colors">
              Войти
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
