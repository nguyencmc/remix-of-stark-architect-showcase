import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import type { EmptyStateProps } from './types';

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-4">
      <Icon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {actionLabel && actionHref && (
        <Link to={actionHref}>
          <Button size="sm">{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
