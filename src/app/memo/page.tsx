'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useToast } from '@/components/Toast';
import BottomSheet from '@/components/BottomSheet';
import { SkeletonCard } from '@/components/Skeleton';
import PullToRefresh from '@/components/PullToRefresh';
import StockSearch from '@/components/StockSearch';
import NumberInput from '@/components/NumberInput';
import CountUp from '@/components/CountUp';
import EmotionGrid from '@/components/EmotionGrid';
import { clientStore, StoredMemo } from '@/lib/client-store';
import type { Mood } from '@/lib/types';

type Memo = StoredMemo;

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

const actionConfig: Record<string, { label: string; labelKo: string; badge: string; dot: string }> = {
  buy:   { label: 'Buy Long',  labelKo: '매수', badge: 'badge-green', dot: 'bg-primary' },
  sell:  { label: 'Sell Short', labelKo: '매도', badge: 'badge-red',   dot: 'bg-error' },
  hold:  { label: 'Hold',      labelKo: '보유', badge: 'badge-amber', dot: 'bg-amber' },
  watch: { label: 'Watching',  labelKo: '관심', badge: 'badge-blue',  dot: 'bg-blue' },
};

/* Stock icon color palette — deterministic by first char code */
const iconColors = [
  { bg: 'bg-primary-container', text: 'text-primary' },
  { bg: 'bg-blue-container', text: 'text-blue' },
  { bg: 'bg-amber-container', text: 'text-amber' },
  { bg: 'bg-error-container', text: 'text-error' },
  { bg: 'bg-[#f3e5f5]', text: 'text-[#7b1fa2]' },
  { bg: 'bg-[#e0f2f1]', text: 'text-[#00695c]' },
];

function getStockIcon(name: string) {
  const initial = name.charAt(0);
  const code = name.charCodeAt(0);
  const palette = iconColors[code % iconColors.length];
  return { initial, ...palette };
}

type FilterKey = 'all' | 'buy' | 'sell' | 'watch';
type TabKey = 'trades' | 'portfolio' | 'emotion';

const moodToKorean: Record<string, Mood> = {
  calm: '평온',
  confident: '자신감',
  anxious: '불안',
  frustrated: '초조',
  fomo: '설렘',
  revenge: '초조',
};

const moodEmojiMap: Record<string, string> = {
  calm: '😌', confident: '😊', anxious: '😰', frustrated: '😤', fomo: '🔥', revenge: '💢',
};

export default function MemoPage() {
  const { toast } = useToast();
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filters & tabs
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [activeTab, setActiveTab] = useState<TabKey>('trades');

  // Form state
  const [stockName, setStockName] = useState('');
  const [action, setAction] = useState<'buy' | 'sell' | 'hold' | 'watch'>('buy');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [memoText, setMemoText] = useState('');
  const [tradeDate, setTradeDate] = useState(todayStr());
  const [tradeMood, setTradeMood] = useState<string>('');

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
    setTradeDate(todayStr());
    setTradeMood('');
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
      trade_mood: tradeMood || undefined,
    };
    if (editingId) {
      clientStore.updateMemo(editingId, data);
    } else {
      const customDate = tradeDate ? new Date(tradeDate + 'T12:00:00').toISOString() : undefined;
      clientStore.createMemo(data, customDate);
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

  // ── Stats ────────────────────────────────────────────────
  const stats = useMemo(() => {
    const buyMemos = memos.filter(m => m.action === 'buy' && m.price && m.quantity);
    const sellMemos = memos.filter(m => m.action === 'sell' && m.price && m.quantity);
    const totalBuy = buyMemos.reduce((s, m) => s + (m.price! * m.quantity!), 0);
    const totalSell = sellMemos.reduce((s, m) => s + (m.price! * m.quantity!), 0);
    const profit = totalSell - totalBuy;
    const profitPct = totalBuy > 0 ? (profit / totalBuy) * 100 : 0;
    const tradeCount = buyMemos.length + sellMemos.length;
    // Win rate: sell memos where profit assumed positive (simplified)
    const winCount = sellMemos.filter(() => profit >= 0).length;
    const winRate = tradeCount > 0 ? Math.round((winCount / tradeCount) * 100) : 0;
    return { profit, profitPct, totalTrades: memos.length, tradeCount, winRate };
  }, [memos]);

  // ── Portfolio (FIFO) ─────────────────────────────────────
  const portfolio = useMemo(() => {
    const holdings: Record<string, { qty: number; totalCost: number; buys: { price: number; qty: number }[] }> = {};
    // Process chronologically
    const sorted = [...memos].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    for (const m of sorted) {
      if (!m.price || !m.quantity) continue;
      const name = m.stock_name;
      if (!holdings[name]) holdings[name] = { qty: 0, totalCost: 0, buys: [] };
      if (m.action === 'buy') {
        holdings[name].buys.push({ price: m.price, qty: m.quantity });
        holdings[name].qty += m.quantity;
        holdings[name].totalCost += m.price * m.quantity;
      } else if (m.action === 'sell') {
        let remaining = m.quantity;
        while (remaining > 0 && holdings[name].buys.length > 0) {
          const oldest = holdings[name].buys[0];
          const take = Math.min(remaining, oldest.qty);
          holdings[name].totalCost -= oldest.price * take;
          holdings[name].qty -= take;
          oldest.qty -= take;
          remaining -= take;
          if (oldest.qty <= 0) holdings[name].buys.shift();
        }
      }
    }
    const items = Object.entries(holdings)
      .filter(([, v]) => v.qty > 0)
      .map(([name, v]) => ({
        name,
        qty: v.qty,
        avgPrice: Math.round(v.totalCost / v.qty),
        totalCost: v.totalCost,
      }));
    const totalValue = items.reduce((s, i) => s + i.totalCost, 0);
    return { items, totalValue };
  }, [memos]);

  // ── Weekly volume ────────────────────────────────────────
  const weeklyVolume = useMemo(() => {
    const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];
    const now = new Date();
    const result: { label: string; buy: number; sell: number; isToday: boolean }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      const dayMemos = memos.filter(m => m.created_at.startsWith(dateStr));
      result.push({
        label: dayLabels[d.getDay()],
        buy: dayMemos.filter(m => m.action === 'buy').length,
        sell: dayMemos.filter(m => m.action === 'sell').length,
        isToday: i === 0,
      });
    }
    return result;
  }, [memos]);

  const maxVolume = useMemo(() => Math.max(1, ...weeklyVolume.map(d => d.buy + d.sell)), [weeklyVolume]);

  // ── Emotion grid (7 days) ────────────────────────────────
  const emotionDays = useMemo(() => {
    const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];
    const now = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      const dayMemo = memos.find(m => m.created_at.startsWith(dateStr) && m.trade_mood);
      const mood = dayMemo?.trade_mood ? moodToKorean[dayMemo.trade_mood] : undefined;
      return {
        day: dayLabels[d.getDay()],
        mood,
        isToday: i === 6,
      };
    });
  }, [memos]);

  // ── Mood insight ─────────────────────────────────────────
  const moodInsight = useMemo(() => {
    const withMood = memos.filter(m => m.trade_mood);
    if (withMood.length < 2) return null;
    const anxiousSells = memos.filter(m => m.action === 'sell' && (m.trade_mood === 'anxious' || m.trade_mood === 'frustrated' || m.trade_mood === 'revenge'));
    if (anxiousSells.length > 0) {
      return `불안/답답 상태에서 ${anxiousSells.length}건 매도 발견 -- 감정적 매도 패턴이 보여요. 리포트를 먼저 확인해보세요.`;
    }
    const fomoCount = memos.filter(m => m.action === 'buy' && m.trade_mood === 'fomo').length;
    if (fomoCount > 0) {
      return `FOMO 상태에서 ${fomoCount}건 매수 발견 -- 충동적 매수에 주의하세요.`;
    }
    return '기록이 쌓이면 감정 패턴 인사이트가 활성화됩니다.';
  }, [memos]);

  // ── Filtered memos ───────────────────────────────────────
  const filteredMemos = useMemo(() => {
    if (activeFilter === 'all') return memos;
    return memos.filter(m => m.action === activeFilter);
  }, [memos, activeFilter]);

  // ── Unique stock count ───────────────────────────────────
  const uniqueStocks = useMemo(() => {
    return new Set(portfolio.items.map(i => i.name)).size;
  }, [portfolio]);

  // ── Tab: portfolio content (for portfolio tab) ───────────
  const portfolioTabContent = (
    <div className="card card-raised overflow-hidden">
      <div className="p-6 border-b border-surface-border">
        <h3 className="text-lg font-bold">포트폴리오 상세</h3>
      </div>
      {portfolio.items.length === 0 ? (
        <div className="p-10 text-center text-on-surface-tertiary">
          <span className="material-symbols-outlined text-3xl mb-2 block">inventory_2</span>
          <p className="text-sm">보유 종목이 없습니다</p>
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>종목</th>
              <th>수량</th>
              <th>평균 단가</th>
              <th>총 투자금</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.items.map((item) => {
              const icon = getStockIcon(item.name);
              return (
                <tr key={item.name}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${icon.bg} ${icon.text} flex items-center justify-center text-xs font-bold shrink-0`}>
                        {icon.initial}
                      </div>
                      <span className="font-semibold">{item.name}</span>
                    </div>
                  </td>
                  <td>{item.qty}주</td>
                  <td>{item.avgPrice.toLocaleString()}원</td>
                  <td className="font-semibold">{item.totalCost.toLocaleString()}원</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );

  // ── Tab: emotion analysis content ────────────────────────
  const emotionTabContent = (
    <div className="space-y-4">
      <div className="card card-raised p-6">
        <h3 className="text-lg font-bold mb-4">감정 기록 분석</h3>
        <EmotionGrid days={emotionDays} />
        {moodInsight && (
          <div className="mt-4 bg-primary-container rounded-xl p-4 flex items-start gap-2 text-sm text-primary">
            <span className="material-symbols-outlined text-base mt-0.5 shrink-0">lightbulb</span>
            {moodInsight}
          </div>
        )}
      </div>
      <div className="card card-raised p-6">
        <h3 className="text-lg font-bold mb-4">감정별 거래 분포</h3>
        {(() => {
          const moodCounts: Record<string, number> = {};
          memos.forEach(m => {
            if (m.trade_mood) moodCounts[m.trade_mood] = (moodCounts[m.trade_mood] || 0) + 1;
          });
          const entries = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
          if (entries.length === 0) return <p className="text-sm text-on-surface-tertiary">감정 기록이 없습니다</p>;
          const maxCount = Math.max(...entries.map(e => e[1]));
          return (
            <div className="space-y-3">
              {entries.map(([mood, count]) => (
                <div key={mood} className="flex items-center gap-3">
                  <span className="text-lg w-6 text-center">{moodEmojiMap[mood] || '?'}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{mood}</span>
                      <span className="text-on-surface-tertiary">{count}건</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${(count / maxCount) * 100}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );

  return (
    <PullToRefresh onRefresh={async () => { setLoading(true); loadMemos(); }}>
      <div className="space-y-8 animate-fadeIn">
        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-[28px] font-extrabold tracking-tight">트레이딩 저널</h1>
            <p className="text-sm text-on-surface-tertiary mt-1">매매 기록과 포트폴리오 현황</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="btn btn-primary"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            거래 기록하기
          </button>
        </div>

        {/* ── Stats Row ──────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card card-raised p-5">
            <p className="text-xs text-on-surface-tertiary mb-1.5">누적 손익</p>
            <p className={`text-2xl font-extrabold tracking-tight ${stats.profit >= 0 ? 'text-primary' : 'text-error'}`}>
              <CountUp end={Math.abs(stats.profit)} prefix={stats.profit >= 0 ? '+' : '-'} formatter={(n) => n.toLocaleString()} />
            </p>
            <p className={`text-xs font-semibold mt-1 ${stats.profit >= 0 ? 'text-primary' : 'text-error'}`}>
              {stats.profitPct >= 0 ? '+' : ''}{stats.profitPct.toFixed(1)}%
            </p>
          </div>
          <div className="card card-raised p-5">
            <p className="text-xs text-on-surface-tertiary mb-1.5">총 거래</p>
            <p className="text-2xl font-extrabold tracking-tight">
              <CountUp end={stats.totalTrades} />
            </p>
            <p className="text-xs text-on-surface-tertiary mt-1">전체 기록</p>
          </div>
          <div className="card card-raised p-5">
            <p className="text-xs text-on-surface-tertiary mb-1.5">승률</p>
            <p className="text-2xl font-extrabold tracking-tight">
              <CountUp end={stats.winRate} suffix="%" />
            </p>
            <p className="text-xs text-on-surface-tertiary mt-1">{stats.tradeCount}건 기준</p>
          </div>
          <div className="card card-raised p-5">
            <p className="text-xs text-on-surface-tertiary mb-1.5">보유 종목</p>
            <p className="text-2xl font-extrabold tracking-tight">
              <CountUp end={uniqueStocks} />
            </p>
            <p className="text-xs text-on-surface-tertiary mt-1 truncate">
              {portfolio.items.slice(0, 3).map(i => i.name).join(', ') || '-'}
            </p>
          </div>
        </div>

        {/* ── Tabs ───────────────────────────────────────── */}
        <div className="flex gap-1 bg-surface-container rounded-xl p-1 w-fit">
          {([
            { key: 'trades', label: '거래 기록' },
            { key: 'portfolio', label: '포트폴리오' },
            { key: 'emotion', label: '감정 분석' },
          ] as { key: TabKey; label: string }[]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-surface text-on-surface shadow-raised'
                  : 'text-on-surface-tertiary hover:text-on-surface-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Content Grid ───────────────────────────────── */}
        {loading ? (
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            {/* ── Main Column ──────────────────────────── */}
            <div>
              {activeTab === 'trades' && (
                <div className="card card-raised overflow-hidden">
                  {/* Filter chips + title */}
                  <div className="flex flex-wrap justify-between items-center p-5 pb-4 gap-3">
                    <h3 className="text-[17px] font-bold">거래 내역</h3>
                    <div className="flex gap-1.5">
                      {([
                        { key: 'all', label: '전체' },
                        { key: 'buy', label: '매수' },
                        { key: 'sell', label: '매도' },
                        { key: 'watch', label: '관심' },
                      ] as { key: FilterKey; label: string }[]).map(f => (
                        <button
                          key={f.key}
                          onClick={() => setActiveFilter(f.key)}
                          className={`chip ${activeFilter === f.key ? 'chip-active' : 'chip-default'}`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Data table */}
                  {filteredMemos.length === 0 ? (
                    <div className="p-10 text-center text-on-surface-tertiary">
                      <span className="material-symbols-outlined text-4xl mb-2 block">edit_note</span>
                      <p className="font-semibold">아직 기록이 없습니다</p>
                      <p className="text-sm mt-1">첫 거래를 기록해보세요.</p>
                    </div>
                  ) : (
                    <>
                      {/* Desktop table header */}
                      <div className="hidden md:grid grid-cols-[48px_1.2fr_80px_100px_100px_100px_80px] px-6 py-2.5 border-b border-surface-border">
                        <span className="text-[11px] font-semibold text-on-surface-quaternary uppercase tracking-wider"></span>
                        <span className="text-[11px] font-semibold text-on-surface-quaternary uppercase tracking-wider">종목</span>
                        <span className="text-[11px] font-semibold text-on-surface-quaternary uppercase tracking-wider">유형</span>
                        <span className="text-[11px] font-semibold text-on-surface-quaternary uppercase tracking-wider">수량</span>
                        <span className="text-[11px] font-semibold text-on-surface-quaternary uppercase tracking-wider">단가</span>
                        <span className="text-[11px] font-semibold text-on-surface-quaternary uppercase tracking-wider">금액</span>
                        <span className="text-[11px] font-semibold text-on-surface-quaternary uppercase tracking-wider">날짜</span>
                      </div>

                      {/* Rows */}
                      {filteredMemos.map(memo => {
                        const ac = actionConfig[memo.action] || actionConfig.buy;
                        const icon = getStockIcon(memo.stock_name);
                        const amount = memo.price && memo.quantity ? memo.price * memo.quantity : null;
                        const dateStr = new Date(memo.created_at).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });

                        return (
                          <div key={memo.id} className="group">
                            {/* Desktop row */}
                            <div className="hidden md:grid grid-cols-[48px_1.2fr_80px_100px_100px_100px_80px] px-6 py-3.5 border-b border-background items-center hover:bg-surface-dim transition-colors">
                              {/* Type dot */}
                              <div className="flex items-center justify-center">
                                <div className={`w-2 h-2 rounded-full ${ac.dot}`} />
                              </div>
                              {/* Stock */}
                              <div className="flex items-center gap-2.5">
                                <div className={`w-8 h-8 rounded-lg ${icon.bg} ${icon.text} flex items-center justify-center text-xs font-bold shrink-0`}>
                                  {icon.initial}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold">{memo.stock_name}</p>
                                  {memo.stock_code && <p className="text-[11px] text-on-surface-quaternary">{memo.stock_code}</p>}
                                </div>
                              </div>
                              {/* Badge */}
                              <div>
                                <span className={`badge ${ac.badge}`}>{ac.labelKo}</span>
                              </div>
                              {/* Qty */}
                              <p className="text-sm">{memo.quantity ? `${memo.quantity}주` : '—'}</p>
                              {/* Price */}
                              <p className="text-sm">{memo.price ? memo.price.toLocaleString() : '—'}</p>
                              {/* Amount */}
                              <p className={`text-sm font-bold ${memo.action === 'sell' ? 'text-error' : amount ? 'text-on-surface' : 'text-on-surface-tertiary'}`}>
                                {amount ? amount.toLocaleString() : '—'}
                              </p>
                              {/* Date */}
                              <p className="text-xs text-on-surface-quaternary">{dateStr}</p>
                            </div>

                            {/* Mobile row — card style */}
                            <div className="md:hidden p-4 border-b border-background">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-9 h-9 rounded-lg ${icon.bg} ${icon.text} flex items-center justify-center text-sm font-bold shrink-0`}>
                                    {icon.initial}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-semibold">{memo.stock_name}</p>
                                      <span className={`badge ${ac.badge}`}>{ac.labelKo}</span>
                                    </div>
                                    <p className="text-xs text-on-surface-tertiary mt-0.5">
                                      {memo.price ? `${memo.price.toLocaleString()}원` : ''}
                                      {memo.quantity ? ` x ${memo.quantity}주` : ''}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  {amount && (
                                    <p className="text-sm font-bold">{amount.toLocaleString()}</p>
                                  )}
                                  <p className="text-[11px] text-on-surface-quaternary">{dateStr}</p>
                                </div>
                              </div>
                              {memo.memo && (
                                <p className="text-xs text-on-surface-secondary mt-2 bg-surface-dim rounded-lg px-3 py-2 italic">&ldquo;{memo.memo}&rdquo;</p>
                              )}
                            </div>

                            {/* Expandable actions — hover on desktop, always on mobile via long-press/click */}
                            <div className="hidden group-hover:flex md:group-hover:flex px-6 py-2 bg-surface-dim border-b border-background items-center justify-between">
                              <span className="text-[11px] text-on-surface-quaternary">
                                {new Date(memo.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                {memo.trade_mood && (
                                  <span className="ml-1">{moodEmojiMap[memo.trade_mood]}</span>
                                )}
                              </span>
                              <div className="flex items-center gap-1">
                                <button onClick={() => handleEdit(memo)} className="text-on-surface-tertiary hover:text-primary transition-colors p-1" aria-label="수정">
                                  <span className="material-symbols-outlined text-base">edit</span>
                                </button>
                                <button onClick={() => setDeletingId(memo.id)} className="text-on-surface-tertiary hover:text-error transition-colors p-1" aria-label="삭제">
                                  <span className="material-symbols-outlined text-base">delete</span>
                                </button>
                              </div>
                            </div>

                            {/* Delete confirmation */}
                            {deletingId === memo.id && (
                              <div className="px-6 py-3 bg-error-container/30 border-b border-background flex items-center justify-between">
                                <span className="text-xs text-on-surface-secondary">정말 삭제할까요?</span>
                                <div className="flex gap-2">
                                  <button onClick={() => setDeletingId(null)} className="text-xs text-on-surface-tertiary px-3 py-1 rounded-lg hover:bg-surface-container">취소</button>
                                  <button onClick={() => handleDelete(memo.id)} className="text-xs text-on-primary bg-error px-3 py-1 rounded-lg font-bold">삭제</button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}

              {activeTab === 'portfolio' && portfolioTabContent}
              {activeTab === 'emotion' && emotionTabContent}
            </div>

            {/* ── Sidebar ──────────────────────────────── */}
            <div className="space-y-4">
              {/* Portfolio summary */}
              <div className="card card-raised p-6">
                <h4 className="text-[15px] font-bold flex items-center gap-1.5 mb-4">
                  <span className="material-symbols-outlined text-lg text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>pie_chart</span>
                  포트폴리오
                </h4>
                <div className="text-center mb-4">
                  <p className="text-xs text-on-surface-tertiary">총 평가금액</p>
                  <p className="text-[28px] font-extrabold text-primary tracking-tighter mt-1">
                    <CountUp end={portfolio.totalValue} formatter={(n) => n.toLocaleString()} />
                  </p>
                  <p className={`text-[13px] font-semibold ${stats.profit >= 0 ? 'text-primary' : 'text-error'}`}>
                    {stats.profit >= 0 ? '+' : ''}{stats.profit.toLocaleString()} ({stats.profitPct >= 0 ? '+' : ''}{stats.profitPct.toFixed(1)}%)
                  </p>
                </div>
                {portfolio.items.length === 0 ? (
                  <p className="text-xs text-on-surface-tertiary text-center py-2">보유 종목 없음</p>
                ) : (
                  <div className="divide-y divide-background">
                    {portfolio.items.map(item => {
                      const icon = getStockIcon(item.name);
                      return (
                        <div key={item.name} className="flex items-center gap-3 py-2.5">
                          <div className={`w-7 h-7 rounded-lg ${icon.bg} ${icon.text} flex items-center justify-center text-[11px] font-bold shrink-0`}>
                            {icon.initial}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold">{item.name}</p>
                            <p className="text-xs text-on-surface-tertiary">{item.qty}주 · 평단 {item.avgPrice.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold">{item.totalCost.toLocaleString()}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Weekly volume chart */}
              <div className="card card-raised p-6">
                <h4 className="text-[15px] font-bold flex items-center gap-1.5 mb-4">
                  <span className="material-symbols-outlined text-lg text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>bar_chart</span>
                  주간 거래량
                </h4>
                <div className="flex items-end gap-1.5 h-20 mb-2">
                  {weeklyVolume.map((d, i) => {
                    const buyH = maxVolume > 0 ? (d.buy / maxVolume) * 100 : 0;
                    const sellH = maxVolume > 0 ? (d.sell / maxVolume) * 100 : 0;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                        <div className="w-full flex flex-col items-stretch" style={{ height: '64px', justifyContent: 'flex-end' }}>
                          {d.buy > 0 && (
                            <div className="bg-primary rounded-t" style={{ height: `${Math.max(buyH * 0.64, 2)}px` }} />
                          )}
                          {d.sell > 0 && (
                            <div className="bg-error rounded-b" style={{ height: `${Math.max(sellH * 0.64, 2)}px` }} />
                          )}
                          {d.buy === 0 && d.sell === 0 && (
                            <div className="bg-surface-container rounded" style={{ height: '2px' }} />
                          )}
                        </div>
                        <span className={`text-[10px] ${d.isToday ? 'text-primary font-semibold' : 'text-on-surface-quaternary'}`}>
                          {d.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-4 text-xs text-on-surface-tertiary">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-primary inline-block" /> 매수
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-sm bg-error inline-block" /> 매도
                  </span>
                </div>
              </div>

              {/* Emotion grid */}
              <div className="card card-raised p-6">
                <h4 className="text-[15px] font-bold flex items-center gap-1.5 mb-4">
                  <span className="material-symbols-outlined text-lg text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>mood</span>
                  이번 주 감정
                </h4>
                <EmotionGrid days={emotionDays} />
                {moodInsight && (
                  <div className="mt-4 bg-primary-container rounded-xl p-3.5 flex items-start gap-2 text-[13px] text-primary leading-relaxed">
                    <span className="material-symbols-outlined text-base mt-0.5 shrink-0">lightbulb</span>
                    {moodInsight}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── BottomSheet for Create/Edit ────────────────── */}
      <BottomSheet
        isOpen={showForm}
        onClose={() => { setShowForm(false); resetForm(); }}
        title={editingId ? '메모 수정' : '새 메모'}
      >
        <div className="mb-3">
          <label className="block text-on-surface-secondary text-xs font-bold mb-1.5">종목명</label>
          <StockSearch
            value={stockName}
            onChange={(name) => setStockName(name)}
            placeholder="종목명 또는 코드 검색"
          />
        </div>

        <div className="mb-3">
          <label className="block text-on-surface-secondary text-xs font-bold mb-1.5">구분</label>
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
            <label className="block text-on-surface-secondary text-xs font-bold mb-1.5">가격 (선택)</label>
            <NumberInput value={price} onChange={setPrice} suffix="원" placeholder="0" />
          </div>
          <div>
            <label className="block text-on-surface-secondary text-xs font-bold mb-1.5">수량 (선택)</label>
            <NumberInput value={quantity} onChange={setQuantity} suffix="주" placeholder="0" />
          </div>
        </div>

        {!editingId && (
          <div className="mb-3">
            <label className="block text-on-surface-secondary text-xs font-bold mb-1.5">거래일 (선택)</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-tertiary text-lg">calendar_today</span>
              <input
                type="date"
                value={tradeDate}
                onChange={(e) => setTradeDate(e.target.value)}
                max={todayStr()}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-dim focus:outline-none focus:ring-2 focus:ring-primary text-on-surface text-sm"
              />
            </div>
            <p className="text-[11px] text-on-surface-tertiary mt-1">과거 거래도 날짜를 지정하여 기록할 수 있습니다</p>
          </div>
        )}

        <div className="mb-3">
          <label className="block text-on-surface-secondary text-xs font-bold mb-1.5">지금 기분 (선택)</label>
          <div className="flex gap-2 flex-wrap">
            {[
              { emoji: '😌', label: '평온', value: 'calm' },
              { emoji: '😊', label: '자신감', value: 'confident' },
              { emoji: '😰', label: '불안', value: 'anxious' },
              { emoji: '😤', label: '답답', value: 'frustrated' },
              { emoji: '🔥', label: 'FOMO', value: 'fomo' },
              { emoji: '💢', label: '복수매매', value: 'revenge' },
            ].map(m => (
              <button
                key={m.value}
                type="button"
                onClick={() => setTradeMood(tradeMood === m.value ? '' : m.value)}
                aria-pressed={tradeMood === m.value}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all ${
                  tradeMood === m.value
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface'
                }`}
              >
                <span>{m.emoji}</span>{m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-on-surface-secondary text-xs font-bold mb-1.5">메모</label>
          <textarea
            value={memoText}
            onChange={(e) => setMemoText(e.target.value)}
            placeholder="투자 판단 근거, 느낌, 메모 등을 자유롭게 적어주세요"
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl bg-surface-dim focus:outline-none focus:ring-2 focus:ring-primary text-on-surface text-sm resize-none"
          />
        </div>

        <div className="pb-[env(safe-area-inset-bottom)]">
          <button
            onClick={handleSubmit}
            disabled={!stockName.trim()}
            className="w-full bg-primary hover:bg-primary-dim disabled:bg-surface-container disabled:text-on-surface-tertiary disabled:cursor-not-allowed text-on-primary font-bold py-3 rounded-xl transition-all active:scale-[0.98]"
          >
            {editingId ? '수정 완료' : '저장'}
          </button>
        </div>
      </BottomSheet>
    </PullToRefresh>
  );
}
