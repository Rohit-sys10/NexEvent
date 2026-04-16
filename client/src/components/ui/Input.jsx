import { cn } from '../../lib/ui';

export const Input = ({ label, error, className = '', type = 'text', ...props }) => {
  return (
    <label className="block space-y-2">
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <input
        type={type}
        className={cn(
          'h-11 w-full rounded-2xl border border-gray-200 px-3 text-sm text-gray-800 outline-none transition-all duration-200 ease-in-out placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500',
          error && 'border-red-400',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </label>
  );
};
