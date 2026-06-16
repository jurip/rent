import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/dashboard';

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!email.trim()) errors.email = 'Email обязателен';
    else if (!/\S+@\S+\.\S+/.test(email)) errors.email = 'Неверный формат email';
    if (!password) errors.password = 'Пароль обязателен';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (!validate()) return;

    try {
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch {
      // Error is handled by store
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">С возвращением</h1>
          <p className="text-neutral-500">Войдите в аккаунт, чтобы продолжить</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-8 space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={validationErrors.email}
              autoComplete="email"
            />
          </div>

          <div>
            <Input
              label="Пароль"
              type="password"
              placeholder="Введите ваш пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={validationErrors.password}
              autoComplete="current-password"
            />
          </div>

          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-brand-600 hover:text-brand-700 transition-colors">
Забыли пароль?
            </Link>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
            <LogIn className="w-4 h-4 mr-2" />
            {isLoading ? 'Вход...' : 'Войти'}
          </Button>

          <p className="text-center text-sm text-neutral-500">
            Нет аккаунта?{' '}
            <Link to="/register" className="text-brand-600 hover:text-brand-700 font-medium transition-colors">
              Создать
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
