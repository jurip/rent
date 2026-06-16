import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-neutral-100 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-display font-bold text-neutral-700">
            <Home className="w-5 h-5 text-brand-600" />
            RentHub
          </Link>
          <p className="text-sm text-neutral-400">
            &copy; {new Date().getFullYear()} RentHub. Все права защищены.
          </p>
          <nav className="flex gap-6">
            <Link to="/listings" className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors">Поиск</Link>
            <a href="#" className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors">Конфиденциальность</a>
            <a href="#" className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors">Условия</a>
            <a href="#" className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors">Контакты</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
