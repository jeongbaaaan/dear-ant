'use client';

import { ReactNode, useEffect } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function BottomSheet({ isOpen, onClose, title, children }: BottomSheetProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 animate-fade-backdrop"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl animate-slide-up-sheet max-h-[85vh] flex flex-col">
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-slate-200 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 pb-3">
            <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-6 pb-8 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
