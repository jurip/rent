import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Пожалуйста, укажите корректный email');
      return;
    }
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: email.trim() });
      setSubmitted(true);
    } catch {
      setError('Что-то пошло не так. Пожалуйста, попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center bg-white rounded-2xl shadow-card p-8">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-brand-600" />
          </div>
          <h2 className="text-2xl font-display font-bold text-neutral-900 mb-2">Проверьте ваш email</h2>
          <p className="text-neutral-500 mb-6">
            Если аккаунт с таким email существует, мы отправили ссылку для сброса пароля.
          </p>
          <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium transition-colors">
            Вернуться ко входу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-neutral-900 mb-2">Забыли пароль?</h1>
          <p className="text-neutral-500">Введите ваш email, и мы отправим вам ссылку для сброса</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-8 space-y-5">
          {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>}

          <Input
            label="Email"
            type="email"
            placeholder="ваш@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isLoading}>
            {isLoading ? 'Отправка...' : 'Отправить ссылку'}
          </Button>

          <p className="text-center text-sm text-neutral-500">
            <Link to="/login" className="text-brand-600 hover:text-brand-700 font-medium transition-colors">
              Вернуться ко входу
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
