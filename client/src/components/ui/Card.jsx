import { cn } from '../../lib/ui';

export const Card = ({ className = '', children, ...props }) => {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
