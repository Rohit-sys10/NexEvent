import { User } from 'lucide-react';
import { cn } from '../../lib/ui';

export const Avatar = ({ name = 'User', className = '' }) => {
  const initial = String(name).trim().charAt(0).toUpperCase();

  return (
    <div
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700',
        className
      )}
      title={name}
      aria-label={name}
    >
      {initial || <User className="h-4 w-4" />}
    </div>
  );
};
