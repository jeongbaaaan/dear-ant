'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ToastState {
  message: string;
  id: number;
}

interface ToastContextType {
  toast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const toast = useCallback((message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { message, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-20 left-0 right-0 z-[60] flex flex-col items-center gap-2 pointer-events-none px-5">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="bg-slate-800 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-lg animate-toast pointer-events-auto"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
