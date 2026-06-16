import Button from './Button';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; to?: string; onClick?: () => void };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-4">
      {icon && <div className="text-neutral-300 mb-4 flex justify-center">{icon}</div>}
      <h3 className="text-lg font-display font-semibold text-neutral-700 mb-1">{title}</h3>
      {description && <p className="text-neutral-400 text-sm max-w-md mx-auto mb-6">{description}</p>}
      {action && (
        action.to ? (
          <Link to={action.to}>
            <Button variant="primary" size="md">{action.label}</Button>
          </Link>
        ) : (
          <Button variant="primary" size="md" onClick={action.onClick}>{action.label}</Button>
        )
      )}
    </div>
  );
}
