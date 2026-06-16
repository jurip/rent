import Button from './Button';
import { AlertTriangle } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = 'Something went wrong', onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-16 px-4">
      <AlertTriangle className="w-12 h-12 text-red-300 mx-auto mb-4" />
      <h3 className="text-lg font-display font-semibold text-neutral-700 mb-1">Oops!</h3>
      <p className="text-neutral-400 text-sm max-w-md mx-auto mb-6">{message}</p>
      {onRetry && (
        <Button variant="primary" size="md" onClick={onRetry}>Try Again</Button>
      )}
    </div>
  );
}
