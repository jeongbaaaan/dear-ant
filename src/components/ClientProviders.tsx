'use client';

import { ReactNode } from 'react';
import { ToastProvider } from './Toast';
import PageTransition from './PageTransition';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <PageTransition>
        {children}
      </PageTransition>
    </ToastProvider>
  );
}
