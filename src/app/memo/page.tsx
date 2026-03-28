'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/Toast';
import BottomSheet from '@/components/BottomSheet';
import { SkeletonCard } from '@/components/Skeleton';
import PullToRefresh from '@/components/PullToRefresh';
import StockSearch from '@/components/StockSearch';
import NumberInput from '@/components/NumberInput';
import { clientStore, StoredMemo } from '@/lib/client-store';

type Memo = StoredMemo;

const actionConfig: Record<string, { label: string; chipBg: string; chipText: string }> = {
  buy: { label: 'Buy Long', chipBg: 'bg-secondary-container', chipText: 'text-on-secondary-container' },
  sell: { label: 'Sell Short', chipBg: 'bg-error-container/20', chipText: 'text-error' },
  hold: { label: 'Hold', chipBg: 'bg-surface-container', chipText: 'text-on-surface' },
  watch: { label: 'Watching', chipBg: 'bg-tertiary-container/30', chipText: 'text-on-tertiary-container' },
};

function getRecentDates(): { day: string; date: number; isToday: boolean }[] {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const result = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    result.push({ day: days[d.getDay()], date: d.getDate(), isToday: i === 0 });
  }
  return result;
}

export default function MemoPage() {
  const { toast } = useToast();
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [stockName, setStockName] = useState('');
  const [action, setAction] = useState<'buy' | 'sell' | 'hold' | 'watch'>('buy');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [memoText, setMemoText] = useState('');

  const loadMemos = useCallback(() => {
    setMemos(clientStore.listMemos());
    setLoading(false);
  }, []);

  useEffect(() => { loadMemos(); }, [loadMemos]);

  const resetForm = () => {
    setStockName('');
    setAction('buy');
    setPrice('');
    setQuantity('');
    setMemoText('');
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!stockName.trim()) return;
    const data = {
      stock_name: stockName.trim(),
      action,
      price: price ? Number(price) : undefined,
      quantity: quantity ? Number(quantity) : undefined,
      memo: memoText.trim() || undefined,
    };
    if (editingId) {
      clientStore.updateMemo(editingId, data);
    } else {
      clientStore.createMemo(data);
    }
    resetForm();
    setShowForm(false);
    loadMemos();
    toast('메모가 저장되었어요');
  };

  const handleEdit = (memo: Memo) => {
    setStockName(memo.stock_name);
    setAction(memo.action);
    setPrice(memo.price ? String(memo.price) : '');
    setQuantity(memo.quantity ? String(memo.quantity) : '');
    setMemoText(memo.memo || '');
    setEditingId(memo.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    try {
      clientStore.deleteMemo(id);
      setDeletingId(null);
      loadMemos();
      toast('메모가 삭제되었어요');
    } catch {
      toast('삭제에 실패했습니다.');
    }
  };

  // Stats calculations
  const stats = useMemo(() => {
    const buyMemos = memos.filter(m => m.action === 'buy' && m.price && m.quantity);
    const sellMemos = memos.filter(m => m.action === 'sell' && m.price && m.quantity);
    const totalBuy = buyMemos.reduce((s, m) => s + (m.price! * m.quantity!), 0);
    const totalSell = sellMemos.reduce((s, m) => s + (m.price! * m.quantity!), 0);
    const profit = totalSell - totalBuy;
    const winRate = memos.length > 0
      ? Math.round((sellMemos.filter(m => (m.price! * m.quantity!) > 0).length / Math.max(memos.length, 1)) * 100)
      : 0;
    return { profit, winRate, totalTrades: memos.length };
  }, [memos]);

  const dates = getRecentDates();

  // Mood insights
  const moodInsight = useMemo(() => {
    const withMood = memos.filter(m => m.mood_score !== undefined);
    if (withMood.length === 0) return null;
    const avg = Math.round(withMood.reduce((s, m) => s + (m.mood_score || 0), 0) / withMood.length);
    return avg <= 40 ? '안정적 (Calm)' : avg <= 65 ? '보통 (Neutral)' : '변동적 (Volatile)';
  }, [memos]);

  return (
    <main className="min-h-screen pb-32">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-header flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>psychiatry</span>
          </div>
          <h1 className="font-headline font-extrabold text-primary text-xl">저널</h1>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors active:scale-95 duration-200">
          <span className="material-symbols-outlined text-primary">notifications</span>
        </button>
      </header>

      <PullToRefresh onRefresh={async () => { setLoading(true); loadMemos(); }}>
        <div className="pt-24 px-6 max-w-2xl mx-auto space-y-10">
          {/* Summary Stats Bento */}
          <section className="grid grid-cols-2 gap-4">
            <div className="col-span-2 bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between">
              <div>
                <p className="font-bold text-xs text-on-surface-variant tracking-widest uppercase">Monthly Profit</p>
                <h2 className="font-headline font-bold text-4xl text-on-surface mt-2">
                  {stats.profit >= 0 ? '+' : ''}₩{Math.abs(stats.profit).toLocaleString() || '0'}
                </h2>
              </div>
              <div className="mt-6 flex items-center gap-2 text-primary font-bold">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {stats.profit >= 0 ? 'trending_up' : 'trending_down'}
                </span>
                <span className="text-sm">기록 기반 수익 현황</span>
              </div>
            </div>
            <div className="bg-surface-container p-6 rounded-xl">
              <p className="font-bold text-[10px] text-on-surface-variant tracking-widest uppercase">Win Rate</p>
              <h3 className="font-headline font-bold text-2xl text-on-surface mt-1">{stats.winRate}%</h3>
            </div>
            <div className="bg-surface-container-high p-6 rounded-xl">
              <p className="font-bold text-[10px] text-on-surface-variant tracking-widest uppercase">Total Trades</p>
              <h3 className="font-headline font-bold text-2xl text-on-surface mt-1">{stats.totalTrades} 건</h3>
            </div>
          </section>

          {/* New Entry CTA */}
          <section>
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-5 rounded-full font-headline font-bold text-lg flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
              오늘의 거래 기록하기
            </button>
          </section>

          {/* Recent Activity */}
          {loading ? (
            <div className="space-y-3">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : memos.length > 0 && (
            <section className="space-y-6">
              <div className="flex justify-between items-end">
                <h3 className="font-headline font-bold text-xl text-on-surface">최근 활동</h3>
                <Link href="/history" className="text-primary font-bold text-sm flex items-center gap-1">
                  전체보기 <span className="material-symbols-outlined text-sm">chevron_right</span>
                </Link>
              </div>

              {/* Date Scroller */}
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                {dates.map((d, i) => (
                  <div
                    key={i}
                    className={`flex-shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center ${
                      d.isToday
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-low text-on-surface'
                    }`}
                  >
                    <span className={`text-[10px] font-bold ${d.isToday ? 'opacity-80' : 'text-on-surface-variant'}`}>{d.day}</span>
                    <span className="text-xl font-extrabold">{d.date}</span>
                  </div>
                ))}
              </div>

              {/* Trade Entries */}
              <div className="space-y-4">
                {memos.slice(0, 5).map(memo => {
                  const ac = actionConfig[memo.action] || actionConfig.buy;
                  const amount = memo.price && memo.quantity ? memo.price * memo.quantity : null;

                  return (
                    <div key={memo.id} className="bg-surface-container-lowest p-6 rounded-xl space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`inline-block px-2 py-1 rounded ${ac.chipBg} ${ac.chipText} text-[10px] font-extrabold uppercase tracking-tighter mb-2`}>
                            {ac.label}
                          </span>
                          <h4 className="font-headline font-bold text-lg">{memo.stock_name}</h4>
                          <p className="text-on-surface-variant text-sm mt-1">
                            {memo.price ? `평단가 ₩${memo.price.toLocaleString()}` : ''}
                            {memo.quantity ? ` | 수량 ${memo.quantity}주` : ''}
                          </p>
                        </div>
                        {amount && (
                          <div className="text-right">
                            <p className="font-headline font-bold text-on-surface">
                              ₩{amount.toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                      {memo.memo && (
                        <div className="bg-surface p-4 rounded-lg italic text-sm text-on-surface-variant leading-relaxed">
                          &ldquo;{memo.memo}&rdquo;
                        </div>
                      )}

                      {/* Edit/Delete controls */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-on-surface-variant">
                          {new Date(memo.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEdit(memo)} className="text-on-surface-variant hover:text-primary transition-colors p-1" aria-label="수정">
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                          <button onClick={() => setDeletingId(memo.id)} className="text-on-surface-variant hover:text-error transition-colors p-1" aria-label="삭제">
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </div>

                      {deletingId === memo.id && (
                        <div className="pt-3 border-t border-surface-container flex items-center justify-between">
                          <span className="text-xs text-on-surface-variant">정말 삭제할까요?</span>
                          <div className="flex gap-2">
                            <button onClick={() => setDeletingId(null)} className="text-xs text-on-surface-variant px-3 py-1 rounded-lg">취소</button>
                            <button onClick={() => handleDelete(memo.id)} className="text-xs text-on-error bg-error px-3 py-1 rounded-lg font-bold">삭제</button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Empty State */}
          {!loading && memos.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center text-outline">
                <span className="material-symbols-outlined text-4xl">edit_note</span>
              </div>
              <div>
                <p className="font-headline font-bold text-lg">아직 기록이 없습니다</p>
                <p className="text-on-surface-variant">첫 거래를 기록해보세요.</p>
              </div>
            </div>
          )}

          {/* Insights Bento */}
          {memos.length > 0 && (
            <section className="grid grid-cols-2 gap-4">
              <div className="bg-tertiary-container/30 p-6 rounded-xl flex flex-col gap-3">
                <span className="material-symbols-outlined text-tertiary">psychology</span>
                <p className="text-xs font-bold text-on-tertiary-container">주간 감정 지수</p>
                <h4 className="font-headline font-bold text-lg">{moodInsight || '데이터 수집중'}</h4>
              </div>
              <div className="bg-surface-container-highest p-6 rounded-xl flex flex-col gap-3">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                <p className="text-xs font-bold text-on-surface-variant">AI 인사이트</p>
                <p className="text-xs font-medium leading-snug text-on-surface">
                  {memos.length >= 3
                    ? '꾸준한 기록이 쌓이고 있습니다. 패턴 분석이 가능해지고 있어요.'
                    : '3건 이상 기록하면 AI 인사이트가 활성화됩니다.'}
                </p>
              </div>
            </section>
          )}
        </div>
      </PullToRefresh>

      {/* BottomSheet for Create/Edit */}
      <BottomSheet
        isOpen={showForm}
        onClose={() => { setShowForm(false); resetForm(); }}
        title={editingId ? '메모 수정' : '새 메모'}
      >
        <div className="mb-3">
          <label className="block text-on-surface-variant text-xs font-bold mb-1.5">종목명</label>
          <StockSearch
            value={stockName}
            onChange={(name) => setStockName(name)}
            placeholder="종목명 또는 코드 검색"
          />
        </div>

        <div className="mb-3">
          <label className="block text-on-surface-variant text-xs font-bold mb-1.5">구분</label>
          <div className="grid grid-cols-4 gap-2">
            {(['buy', 'sell', 'hold', 'watch'] as const).map(key => (
              <button
                key={key}
                onClick={() => setAction(key)}
                className={`text-xs font-bold py-2.5 rounded-xl transition-all ${
                  action === key
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface'
                }`}
              >
                {key === 'buy' ? '매수' : key === 'sell' ? '매도' : key === 'hold' ? '보유' : '관심'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-on-surface-variant text-xs font-bold mb-1.5">가격 (선택)</label>
            <NumberInput value={price} onChange={setPrice} suffix="원" placeholder="0" />
          </div>
          <div>
            <label className="block text-on-surface-variant text-xs font-bold mb-1.5">수량 (선택)</label>
            <NumberInput value={quantity} onChange={setQuantity} suffix="주" placeholder="0" />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-on-surface-variant text-xs font-bold mb-1.5">메모</label>
          <textarea
            value={memoText}
            onChange={(e) => setMemoText(e.target.value)}
            placeholder="투자 판단 근거, 느낌, 메모 등을 자유롭게 적어주세요"
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary text-on-surface text-sm resize-none"
          />
        </div>

        <div className="pb-[env(safe-area-inset-bottom)]">
          <button
            onClick={handleSubmit}
            disabled={!stockName.trim()}
            className="w-full bg-primary hover:bg-primary-dim disabled:bg-surface-container disabled:text-on-surface-variant disabled:cursor-not-allowed text-on-primary font-bold py-3 rounded-xl transition-all active:scale-[0.98]"
          >
            {editingId ? '수정 완료' : '저장'}
          </button>
        </div>
      </BottomSheet>
    </main>
  );
}
