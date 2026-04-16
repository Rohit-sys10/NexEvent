import { cn } from '../../lib/ui';

export const Input = ({ label, error, className = '', type = 'text', ...props }) => {
  return (
    <label className="block space-y-2">
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <input
        type={type}
        className={cn(
          'h-12 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 text-sm text-gray-800 shadow-sm outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500',
          error && 'border-red-400',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </label>
  );
};
