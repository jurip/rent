import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-display font-bold text-neutral-200 mb-4">404</h1>
        <h2 className="text-xl font-display font-semibold text-neutral-700 mb-2">Page not found</h2>
        <p className="text-neutral-400 mb-8 max-w-md">The page you're looking for doesn't exist or has been moved. Let's get you back on track.</p>
        <Link to="/">
          <Button variant="primary" size="lg">
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
