import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import Button from '@/components/ui/Button';
import { Home, Search, Heart, Menu, X, LogIn, UserPlus, Building2, LogOut, Settings } from 'lucide-react';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navLinks = isAuthenticated && user?.role === 'landlord'
    ? [
        { to: '/listings', label: 'Поиск', icon: Search },
        { to: '/landlord/dashboard', label: 'Панель управления', icon: Building2 },
      ]
    : [
        { to: '/listings', label: 'Поиск', icon: Search },
        { to: '/favorites', label: 'Избранное', icon: Heart },
      ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-xl font-display font-bold text-neutral-900">
          <Home className="w-6 h-6 text-brand-600" />
          <span>RentHub</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link to={user.role === 'landlord' ? '/landlord/dashboard' : '/dashboard'} className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                {user.fullName}
              </Link>
              <Link to="/profile">
                <Settings className="w-4 h-4 text-neutral-400 hover:text-neutral-600 transition-colors" />
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="w-4 h-4 mr-1.5" />
                  Войти
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Регистрация
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 rounded-xl transition-colors"
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
            <hr className="my-2 border-neutral-100" />
            {isAuthenticated && user ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-50 rounded-xl transition-colors">
                  <Settings className="w-5 h-5" /> Профиль
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors w-full">
                  <LogOut className="w-5 h-5" /> Выйти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-50 rounded-xl transition-colors">
                  <LogIn className="w-5 h-5" /> Войти
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-brand-600 hover:bg-brand-50 rounded-xl transition-colors">
                  <UserPlus className="w-5 h-5" /> Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
