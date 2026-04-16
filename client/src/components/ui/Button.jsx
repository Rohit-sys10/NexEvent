import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/ui';

const VARIANT_CLASS = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
  danger: 'bg-red-500 text-white hover:bg-red-600',
};

export const Button = ({
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={cn(
        'inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-medium shadow-sm transition-all duration-200 ease-in-out active:scale-95',
        VARIANT_CLASS[variant],
        fullWidth && 'w-full',
        isDisabled && 'cursor-not-allowed opacity-50',
        className
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};
