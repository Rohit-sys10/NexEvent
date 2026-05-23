import { Loader2 } from 'lucide-react';
import { useApiWakeState } from '../hooks/useApiWakeState';

export const ApiWakeIndicator = () => {
  const isWakingUp = useApiWakeState();

  if (!isWakingUp) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div
        className="flex items-center gap-3 rounded-full border border-slate-200 bg-white/95 px-4 py-2 text-sm font-medium text-slate-700 shadow-lg shadow-slate-200/70 backdrop-blur"
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
        <span>Server is waking up, please wait...</span>
      </div>
    </div>
  );
};