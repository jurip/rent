import { useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import api from '@/lib/api';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { User } from 'lucide-react';
import { PASSWORD_MIN_LENGTH } from '@shared/constants';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [form, setForm] = useState({ fullName: user?.fullName || '', phone: user?.phone || '' });
  const [passwordForm, setPasswordForm] = useState({ current: '', newPassword: '', confirm: '' });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaved(false);
    try {
      await api.patch('/users/profile', form);
      setSaved(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Не удалось обновить профиль');
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSaved(false);
    if (passwordForm.newPassword.length < PASSWORD_MIN_LENGTH) {
      setPasswordError(`Пароль должен содержать минимум ${PASSWORD_MIN_LENGTH} символов`);
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirm) {
      setPasswordError('Пароли не совпадают');
      return;
    }
    try {
      await api.post('/auth/change-password', passwordForm);
      setPasswordSaved(true);
      setPasswordForm({ current: '', newPassword: '', confirm: '' });
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Не удалось сменить пароль');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold text-neutral-900 mb-8">Настройки профиля</h1>

      {saved && <div className="bg-green-50 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">Профиль успешно обновлён!</div>}

      <form onSubmit={handleUpdate} className="bg-white rounded-2xl shadow-card p-6 mb-6 space-y-4">
        <h2 className="text-lg font-display font-semibold text-neutral-900 mb-4">Личная информация</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 text-xl font-semibold">
            {user?.fullName?.[0] || <User className="w-8 h-8" />}
          </div>
          <div>
            <p className="font-medium text-neutral-900">{user?.email}</p>
            <p className="text-sm text-neutral-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <Input label="Имя и фамилия" value={form.fullName} onChange={(e) => setForm(p => ({ ...p, fullName: e.target.value }))} />
        <Input label="Телефон" value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" variant="primary">Сохранить изменения</Button>
      </form>

      <form onSubmit={handlePassword} className="bg-white rounded-2xl shadow-card p-6 space-y-4">
        <h2 className="text-lg font-display font-semibold text-neutral-900 mb-4">Сменить пароль</h2>
        {passwordSaved && <div className="bg-green-50 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">Пароль успешно изменён!</div>}
        <Input label="Текущий пароль" type="password" value={passwordForm.current} onChange={(e) => setPasswordForm(p => ({ ...p, current: e.target.value }))} />
        <Input label="Новый пароль" type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))} />
        <Input label="Подтверждение нового пароля" type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm(p => ({ ...p, confirm: e.target.value }))} />
        {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
        <Button type="submit" variant="outline">Изменить пароль</Button>
      </form>
    </div>
  );
}
