import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const TOAST_STYLES = {
  success: {
    icon: CheckCircle2,
    tone: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  error: {
    icon: AlertCircle,
    tone: 'border-red-200 bg-red-50 text-red-700',
  },
};

export const Toaster = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => {
        const style = TOAST_STYLES[toast.type] || TOAST_STYLES.success;
        const Icon = style.icon;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-md transition-all duration-200 ease-in-out ${style.tone}`}
          >
            <Icon className="mt-0.5 h-4 w-4" />
            <p className="flex-1">{toast.message}</p>
            <button
              type="button"
              className="rounded p-0.5 hover:bg-black/5"
              onClick={() => removeToast(toast.id)}
              aria-label="Close toast"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
