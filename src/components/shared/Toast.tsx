import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useToast, Toast as ToastType } from '@/hooks/useToast';
import { useEffect, useState } from 'react';

function ToastItem({ toast }: { toast: ToastType }) {
  const { removeToast } = useToast();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.max(0, prev - (100 / 30))); // 3000ms / 100ms intervals
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-lg overflow-hidden w-80 animate-in slide-in-from-right">
      <div className="border-l-4 border-primary p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">{getIcon()}</div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm mb-1">{toast.title}</h4>
            <p className="text-sm text-muted-foreground">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
