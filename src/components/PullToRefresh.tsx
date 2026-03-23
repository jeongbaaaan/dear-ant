'use client';

import { ReactNode } from 'react';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const { isRefreshing, pullDistance } = usePullToRefresh(onRefresh);

  return (
    <div>
      {/* Pull indicator */}
      <div
        className="flex justify-center overflow-hidden transition-all duration-200"
        style={{ height: pullDistance > 0 ? pullDistance : 0 }}
      >
        <div className={`flex items-center gap-2 text-slate-400 text-sm ${isRefreshing ? 'animate-pulse' : ''}`}>
          {isRefreshing ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
              <span>새로고침 중</span>
            </>
          ) : pullDistance > 60 ? (
            <span>놓으면 새로고침</span>
          ) : (
            <span>당겨서 새로고침</span>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}
