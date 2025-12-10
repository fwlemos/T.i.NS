import { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type ToastType = 'success' | 'error' | 'warning' | 'info';

type Toast = {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
};

type ToastContextType = {
    toast: (props: Omit<Toast, 'id'>) => void;
    dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const toast = useCallback(({ type, message, duration = 3000 }: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, type, message, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                dismiss(id);
            }, duration);
        }
    }, [dismiss]);

    return (
        <ToastContext.Provider value={{ toast, dismiss }}>
            {children}
            {createPortal(
                <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                    {toasts.map((t) => (
                        <div
                            key={t.id}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white transition-all transform animate-in slide-in-from-right-full",
                                t.type === 'success' && "bg-green-600",
                                t.type === 'error' && "bg-red-600",
                                t.type === 'warning' && "bg-amber-500",
                                t.type === 'info' && "bg-blue-600"
                            )}
                        >
                            {t.type === 'success' && <CheckCircle size={18} />}
                            {t.type === 'error' && <AlertCircle size={18} />}
                            {t.type === 'warning' && <AlertTriangle size={18} />}
                            {t.type === 'info' && <Info size={18} />}
                            <span className="text-sm font-medium">{t.message}</span>
                            <button onClick={() => dismiss(t.id)} className="ml-2 hover:opacity-80">
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
