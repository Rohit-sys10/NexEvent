import { cn } from '../../lib/ui';

export const Skeleton = ({ className = '' }) => {
  return <div className={cn('animate-pulse rounded-2xl bg-gray-200', className)} />;
};

export const EventCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <Skeleton className="h-40 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
};
