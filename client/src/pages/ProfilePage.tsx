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
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSaved(false);
    if (passwordForm.newPassword.length < PASSWORD_MIN_LENGTH) {
      setPasswordError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirm) {
      setPasswordError('Passwords do not match');
      return;
    }
    try {
      await api.post('/auth/change-password', passwordForm);
      setPasswordSaved(true);
      setPasswordForm({ current: '', newPassword: '', confirm: '' });
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold text-neutral-900 mb-8">Profile Settings</h1>

      {saved && <div className="bg-green-50 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">Profile updated successfully!</div>}

      <form onSubmit={handleUpdate} className="bg-white rounded-2xl shadow-card p-6 mb-6 space-y-4">
        <h2 className="text-lg font-display font-semibold text-neutral-900 mb-4">Personal Information</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 text-xl font-semibold">
            {user?.fullName?.[0] || <User className="w-8 h-8" />}
          </div>
          <div>
            <p className="font-medium text-neutral-900">{user?.email}</p>
            <p className="text-sm text-neutral-400 capitalize">{user?.role}</p>
          </div>
        </div>
        <Input label="Full Name" value={form.fullName} onChange={(e) => setForm(p => ({ ...p, fullName: e.target.value }))} />
        <Input label="Phone" value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" variant="primary">Save Changes</Button>
      </form>

      <form onSubmit={handlePassword} className="bg-white rounded-2xl shadow-card p-6 space-y-4">
        <h2 className="text-lg font-display font-semibold text-neutral-900 mb-4">Change Password</h2>
        {passwordSaved && <div className="bg-green-50 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">Password changed successfully!</div>}
        <Input label="Current Password" type="password" value={passwordForm.current} onChange={(e) => setPasswordForm(p => ({ ...p, current: e.target.value }))} />
        <Input label="New Password" type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))} />
        <Input label="Confirm New Password" type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm(p => ({ ...p, confirm: e.target.value }))} />
        {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
        <Button type="submit" variant="outline">Change Password</Button>
      </form>
    </div>
  );
}
