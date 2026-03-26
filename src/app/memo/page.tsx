'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useToast } from '@/components/Toast';
import BottomSheet from '@/components/BottomSheet';
import { SkeletonCard } from '@/components/Skeleton';
import PullToRefresh from '@/components/PullToRefresh';

interface Memo {
  id: string;
  stock_name: string;
  action: 'buy' | 'sell' | 'hold' | 'watch';
  price?: number;
  quantity?: number;
  memo: string;
  invest_mood?: string;
  decision_mode?: string;
  mood_score?: number;
  created_at: string;
  updated_at: string;
}

const actionConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  buy: { label: '매수', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200', icon: '↗' },
  sell: { label: '매도', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', icon: '↘' },
  hold: { label: '보유', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', icon: '●' },
  watch: { label: '관심', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', icon: '★' },
};

const moodGradeColor: Record<string, string> = {
  'A': 'bg-emerald-100 text-emerald-700',
  'B': 'bg-blue-100 text-blue-700',
  'C': 'bg-amber-100 text-amber-700',
  'D': 'bg-orange-100 text-orange-700',
  'F': 'bg-red-100 text-red-700',
};

type TabType = 'all' | 'portfolio' | 'insights';
type FilterType = 'all' | 'buy' | 'sell' | 'hold' | 'watch';

// 포트폴리오 요약
function PortfolioSummary({ memos }: { memos: Memo[] }) {
  const buyMemos = memos.filter(m => m.action === 'buy' && m.price && m.quantity);
  const sellMemos = memos.filter(m => m.action === 'sell' && m.price && m.quantity);
  const holdMemos = memos.filter(m => m.action === 'hold');
  const watchMemos = memos.filter(m => m.action === 'watch');

  const totalBuy = buyMemos.reduce((s, m) => s + (m.price! * m.quantity!), 0);
  const totalSell = sellMemos.reduce((s, m) => s + (m.price! * m.quantity!), 0);

  // 종목별 그룹
  const stockGroups: Record<string, { buys: Memo[]; sells: Memo[]; holds: Memo[]; watches: Memo[] }> = {};
  memos.forEach(m => {
    if (!stockGroups[m.stock_name]) {
      stockGroups[m.stock_name] = { buys: [], sells: [], holds: [], watches: [] };
    }
    if (m.action === 'buy') stockGroups[m.stock_name].buys.push(m);
    else if (m.action === 'sell') stockGroups[m.stock_name].sells.push(m);
    else if (m.action === 'hold') stockGroups[m.stock_name].holds.push(m);
    else stockGroups[m.stock_name].watches.push(m);
  });

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 요약 카드 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-rose-500 rounded-2xl p-4 text-white shadow-lg">
          <p className="text-white/60 text-xs font-medium">총 매수 금액</p>
          <p className="text-xl font-black mt-1">{totalBuy > 0 ? `${(totalBuy / 10000).toFixed(0)}만원` : '-'}</p>
          <p className="text-white/50 text-xs mt-1">{buyMemos.length}건</p>
        </div>
        <div className="bg-blue-500 rounded-2xl p-4 text-white shadow-lg">
          <p className="text-white/60 text-xs font-medium">총 매도 금액</p>
          <p className="text-xl font-black mt-1">{totalSell > 0 ? `${(totalSell / 10000).toFixed(0)}만원` : '-'}</p>
          <p className="text-white/50 text-xs mt-1">{sellMemos.length}건</p>
        </div>
        <div className="card-v3 p-4">
          <p className="text-green-800 text-xs font-medium">보유 종목</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{holdMemos.length}<span className="text-sm font-normal text-green-800">건</span></p>
        </div>
        <div className="card-v3 p-4">
          <p className="text-green-800 text-xs font-medium">관심 종목</p>
          <p className="text-2xl font-black text-amber-500 mt-1">{watchMemos.length}<span className="text-sm font-normal text-green-800">건</span></p>
        </div>
      </div>

      {/* 트레이딩 성과 - TraderSync 벤치마킹 */}
      {buyMemos.length > 0 && sellMemos.length > 0 && (
        <div className="card-v3 p-5">
          <h3 className="text-green-700 text-sm font-medium mb-4">트레이딩 성과</h3>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="text-center">
              <p className="text-xs text-green-800 mb-1">총 거래</p>
              <p className="text-xl font-black text-green-900">{buyMemos.length + sellMemos.length}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-green-800 mb-1">매수/매도 비율</p>
              <p className="text-xl font-black text-green-900">
                {Math.round((buyMemos.length / (buyMemos.length + sellMemos.length)) * 100)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-green-800 mb-1">실현 손익</p>
              <p className={`text-xl font-black ${totalSell - totalBuy >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {totalSell - totalBuy >= 0 ? '+' : ''}{((totalSell - totalBuy) / 10000).toFixed(0)}만
              </p>
            </div>
          </div>
          {/* P&L 바 */}
          <div className="h-2 rounded-full bg-green-100 overflow-hidden flex">
            <div className="bg-rose-400 h-full" style={{ width: `${Math.round((totalBuy / Math.max(totalBuy + totalSell, 1)) * 100)}%` }} />
            <div className="bg-blue-400 h-full" style={{ width: `${Math.round((totalSell / Math.max(totalBuy + totalSell, 1)) * 100)}%` }} />
          </div>
          <div className="flex justify-between mt-1 text-xs text-green-800">
            <span>매수 {(totalBuy / 10000).toFixed(0)}만</span>
            <span>매도 {(totalSell / 10000).toFixed(0)}만</span>
          </div>
        </div>
      )}

      {/* 종목별 현황 */}
      <div className="card-v3 p-5">
        <h3 className="text-green-700 text-sm font-medium mb-4">종목별 현황</h3>
        {Object.keys(stockGroups).length === 0 ? (
          <p className="text-green-400 text-sm text-center py-4">기록된 종목이 없습니다</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(stockGroups).map(([name, group]) => {
              const totalBuyAmt = group.buys.reduce((s, m) => s + ((m.price || 0) * (m.quantity || 0)), 0);
              const totalBuyQty = group.buys.reduce((s, m) => s + (m.quantity || 0), 0);
              const avgPrice = totalBuyQty > 0 ? Math.round(totalBuyAmt / totalBuyQty) : 0;
              const totalActions = group.buys.length + group.sells.length + group.holds.length + group.watches.length;

              return (
                <div key={name} className="border border-green-100 rounded-xl p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-green-900">{name}</h4>
                    <div className="flex items-center gap-1">
                      {group.buys.length > 0 && <span className="w-2 h-2 rounded-full bg-rose-400" />}
                      {group.sells.length > 0 && <span className="w-2 h-2 rounded-full bg-blue-400" />}
                      {group.holds.length > 0 && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                      {group.watches.length > 0 && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-green-800">
                    <span>총 {totalActions}건 기록</span>
                    {avgPrice > 0 && <span>평균 매수가 {avgPrice.toLocaleString()}원</span>}
                    {totalBuyQty > 0 && <span>{totalBuyQty}주</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// 감정 분석 인사이트
function MoodInsights({ memos }: { memos: Memo[] }) {
  const memosWithMood = memos.filter(m => m.invest_mood);

  // 등급별 매수/매도 분포
  const moodActionMap: Record<string, { buy: number; sell: number; hold: number; watch: number }> = {};
  memosWithMood.forEach(m => {
    const grade = m.invest_mood!;
    if (!moodActionMap[grade]) moodActionMap[grade] = { buy: 0, sell: 0, hold: 0, watch: 0 };
    moodActionMap[grade][m.action]++;
  });

  // 가장 많이 매수한 등급
  const buyByGrade = Object.entries(moodActionMap)
    .map(([grade, actions]) => ({ grade, buyCount: actions.buy }))
    .filter(g => g.buyCount > 0)
    .sort((a, b) => b.buyCount - a.buyCount);

  // 감정 흔들림 vs 매수 상관관계
  const buyMemos = memosWithMood.filter(m => m.action === 'buy' && m.mood_score !== undefined);
  const avgMoodOnBuy = buyMemos.length > 0
    ? Math.round(buyMemos.reduce((s, m) => s + (m.mood_score || 0), 0) / buyMemos.length)
    : null;

  // 판단 모드별 분포
  const modeMap: Record<string, number> = {};
  memosWithMood.forEach(m => {
    if (m.decision_mode) {
      modeMap[m.decision_mode] = (modeMap[m.decision_mode] || 0) + 1;
    }
  });
  const topMode = Object.entries(modeMap).sort((a, b) => b[1] - a[1])[0];

  if (memosWithMood.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <p className="text-green-800 text-sm mb-1">투자 리포트를 먼저 받아보세요</p>
        <p className="text-green-400 text-xs">리포트 후 메모를 작성하면 감정 분석이 시작됩니다</p>
        <Link
          href="/survey"
          className="inline-block mt-4 bg-green-900 hover:bg-green-800 text-white text-sm font-medium py-2 px-5 rounded-xl transition-all"
        >
          리포트 받으러 가기
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 핵심 인사이트 카드 */}
      <div className="bg-green-900 rounded-2xl p-5 text-white shadow-lg">
        <p className="text-white/60 text-xs font-medium mb-3">나의 투자 감정 패턴</p>
        <div className="space-y-2.5">
          {buyByGrade.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-lg">📊</span>
              <p className="text-sm">
                <strong>{buyByGrade[0].grade}등급</strong>일 때 가장 많이 매수했어요
                <span className="text-white/50 ml-1">({buyByGrade[0].buyCount}건)</span>
              </p>
            </div>
          )}
          {avgMoodOnBuy !== null && (
            <div className="flex items-center gap-2">
              <span className="text-lg">{avgMoodOnBuy > 50 ? '⚡' : '😌'}</span>
              <p className="text-sm">
                매수 시 평균 감정 흔들림 <strong>{avgMoodOnBuy}%</strong>
                <span className="text-white/50 ml-1">
                  ({avgMoodOnBuy > 50 ? '감정적 매수 경향' : '이성적 매수 경향'})
                </span>
              </p>
            </div>
          )}
          {topMode && (
            <div className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <p className="text-sm">
                주로 <strong>{topMode[0]} 모드</strong>에서 메모를 기록해요
                <span className="text-white/50 ml-1">({topMode[1]}건)</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 등급별 행동 분포 */}
      <div className="card-v3 p-5">
        <h3 className="text-green-700 text-sm font-medium mb-4">투자 무드별 행동 분포</h3>
        <div className="space-y-3">
          {['A', 'B', 'C', 'D', 'F'].map(grade => {
            const actions = moodActionMap[grade];
            if (!actions) return null;
            const total = actions.buy + actions.sell + actions.hold + actions.watch;
            if (total === 0) return null;

            return (
              <div key={grade}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${moodGradeColor[grade]}`}>
                      {grade}등급
                    </span>
                    <span className="text-xs text-green-800">{total}건</span>
                  </div>
                </div>
                <div className="flex h-3 rounded-full overflow-hidden bg-green-50">
                  {actions.buy > 0 && (
                    <div className="bg-rose-400 transition-all" style={{ width: `${(actions.buy / total) * 100}%` }} />
                  )}
                  {actions.sell > 0 && (
                    <div className="bg-blue-400 transition-all" style={{ width: `${(actions.sell / total) * 100}%` }} />
                  )}
                  {actions.hold > 0 && (
                    <div className="bg-emerald-400 transition-all" style={{ width: `${(actions.hold / total) * 100}%` }} />
                  )}
                  {actions.watch > 0 && (
                    <div className="bg-amber-400 transition-all" style={{ width: `${(actions.watch / total) * 100}%` }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-3 mt-4 text-xs text-green-800">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-rose-400" />매수</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-400" />매도</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-400" />보유</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400" />관심</div>
        </div>
      </div>

      {/* 주의 메시지 */}
      <div className="bg-green-50 rounded-2xl p-4">
        <p className="text-green-800 text-xs font-medium mb-1">💡 Dear,ANT의 팁</p>
        <p className="text-green-700 text-xs leading-relaxed">
          {avgMoodOnBuy !== null && avgMoodOnBuy > 50
            ? '감정이 높을 때 매수하는 경향이 있어요. 매수 전 한 번 더 생각해보는 습관을 길러보세요.'
            : '이성적으로 매수하는 좋은 습관을 가지고 있어요. 꾸준히 기록하면서 패턴을 확인해보세요.'}
        </p>
      </div>
    </div>
  );
}

export default function MemoPage() {
  const { toast } = useToast();
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 폼 상태
  const [stockName, setStockName] = useState('');
  const [action, setAction] = useState<'buy' | 'sell' | 'hold' | 'watch'>('watch');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [memoText, setMemoText] = useState('');

  const fetchMemos = useCallback(async () => {
    try {
      const res = await fetch('/api/memos');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMemos(data.memos || []);
    } catch (err) {
      console.error('Failed to fetch memos', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMemos(); }, [fetchMemos]);

  const filteredMemos = useMemo(() => {
    let result = memos;
    if (filter !== 'all') result = result.filter(m => m.action === filter);
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(m =>
        m.stock_name.toLowerCase().includes(q) || m.memo.toLowerCase().includes(q)
      );
    }
    return result;
  }, [memos, filter, searchQuery]);

  const resetForm = () => {
    setStockName('');
    setAction('watch');
    setPrice('');
    setQuantity('');
    setMemoText('');
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!stockName.trim() || !memoText.trim()) return;

    const body = {
      stock_name: stockName.trim(),
      action,
      price: price ? Number(price) : undefined,
      quantity: quantity ? Number(quantity) : undefined,
      memo: memoText.trim(),
    };

    try {
      if (editingId) {
        await fetch(`/api/memos/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      } else {
        await fetch('/api/memos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
      }
      resetForm();
      setShowForm(false);
      fetchMemos();
      toast('메모가 저장되었어요');
    } catch {
      toast('저장에 실패했습니다.');
    }
  };

  const handleEdit = (memo: Memo) => {
    setStockName(memo.stock_name);
    setAction(memo.action);
    setPrice(memo.price ? String(memo.price) : '');
    setQuantity(memo.quantity ? String(memo.quantity) : '');
    setMemoText(memo.memo);
    setEditingId(memo.id);
    setShowForm(true);
    setActiveTab('all');
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/memos/${id}`, { method: 'DELETE' });
      setDeletingId(null);
      fetchMemos();
      toast('메모가 삭제되었어요');
    } catch {
      toast('삭제에 실패했습니다.');
    }
  };

  // 액션별 카운트
  const actionCounts = useMemo(() => {
    const counts: Record<string, number> = { all: memos.length, buy: 0, sell: 0, hold: 0, watch: 0 };
    memos.forEach(m => { counts[m.action]++; });
    return counts;
  }, [memos]);

  return (
    <main className="min-h-screen py-12 px-6 pb-nav">
      <PullToRefresh onRefresh={async () => { setLoading(true); await fetchMemos(); }}>
      <div className="max-w-md mx-auto animate-fade-in">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-black text-green-900">트레이딩 저널</h1>
        </div>
        <p className="text-green-800 text-sm mb-5">매매 기록 · 포트폴리오 · 감정 분석</p>

        {/* 탭 네비게이션 */}
        <div className="flex bg-green-100 rounded-xl p-1 mb-5">
          {[
            { key: 'all' as TabType, label: '전체 메모' },
            { key: 'portfolio' as TabType, label: '포트폴리오' },
            { key: 'insights' as TabType, label: '감정 분석' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 text-sm font-medium py-2.5 rounded-lg transition-all ${
                activeTab === tab.key ? 'bg-green-900 text-white shadow-sm' : 'text-green-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <>
            {/* 포트폴리오 탭 */}
            {activeTab === 'portfolio' && <PortfolioSummary memos={memos} />}

            {/* 감정 분석 탭 */}
            {activeTab === 'insights' && <MoodInsights memos={memos} />}

            {/* 전체 메모 탭 */}
            {activeTab === 'all' && (
              <>
                {/* 새 메모 버튼 */}
                {!showForm && (
                  <button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="w-full mb-4 bg-green-900 hover:bg-green-800 text-white font-bold py-3.5 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">+</span> 새 메모 작성
                  </button>
                )}

                {/* 메모 작성/수정 BottomSheet */}
                <BottomSheet
                  isOpen={showForm}
                  onClose={() => { setShowForm(false); resetForm(); }}
                  title={editingId ? '메모 수정' : '새 메모'}
                >
                  <div className="mb-3">
                    <label className="block text-green-700 text-xs font-medium mb-1.5">종목명</label>
                    <input
                      type="text"
                      value={stockName}
                      onChange={(e) => setStockName(e.target.value)}
                      placeholder="예: 삼성전자, AAPL"
                      className="w-full px-4 py-2.5 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-300 text-green-900 text-sm"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-green-700 text-xs font-medium mb-1.5">구분</label>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(actionConfig).map(([key, config]) => (
                        <button
                          key={key}
                          onClick={() => setAction(key as typeof action)}
                          className={`text-xs font-bold py-2 rounded-xl border-2 transition-all ${
                            action === key
                              ? 'border-green-900 bg-green-900 text-white'
                              : 'border-green-200 text-green-800'
                          }`}
                        >
                          {config.icon} {config.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <label className="block text-green-700 text-xs font-medium mb-1.5">가격 (선택)</label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-2.5 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-300 text-green-900 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-green-700 text-xs font-medium mb-1.5">수량 (선택)</label>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-2.5 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-300 text-green-900 text-sm"
                      />
                    </div>
                  </div>

                  {/* 전략 태그 - Edgewonk 벤치마킹 */}
                  <div className="mb-3">
                    <label className="block text-green-700 text-xs font-medium mb-1.5">전략 태그 (선택)</label>
                    <div className="flex gap-1.5 flex-wrap">
                      {['스윙', '단타', '장기투자', '배당', 'ETF', '테마주', '실적', '기술적분석'].map(tag => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            const current = memoText;
                            if (current.includes(`#${tag}`)) {
                              setMemoText(current.replace(`#${tag} `, '').replace(`#${tag}`, ''));
                            } else {
                              setMemoText(current ? `${current} #${tag}` : `#${tag}`);
                            }
                          }}
                          className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                            memoText.includes(`#${tag}`)
                              ? 'bg-green-100 text-green-900 border-green-300'
                              : 'bg-white text-green-800 border-green-200'
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-green-700 text-xs font-medium mb-1.5">메모</label>
                    <textarea
                      value={memoText}
                      onChange={(e) => setMemoText(e.target.value)}
                      placeholder="투자 판단 근거, 느낌, 메모 등을 자유롭게 적어주세요"
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-300 text-green-900 text-sm resize-none"
                    />
                  </div>

                  <div className="pb-[env(safe-area-inset-bottom)]">
                    <button
                      onClick={handleSubmit}
                      disabled={!stockName.trim() || !memoText.trim()}
                      className="w-full bg-green-900 hover:bg-green-800 disabled:bg-green-200 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98]"
                    >
                      {editingId ? '수정 완료' : '저장'}
                    </button>
                  </div>
                </BottomSheet>

                {/* 검색 + 필터 */}
                {memos.length > 0 && !showForm && (
                  <div className="space-y-3 mb-4">
                    {/* 검색 */}
                    <div className="relative">
                      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-300" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                        <line x1="11" y1="11" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="종목명 또는 메모 검색"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-300 text-green-900 text-sm"
                      />
                    </div>

                    {/* 필터 칩 */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {(['all', 'buy', 'sell', 'hold', 'watch'] as FilterType[]).map(f => {
                        const label = f === 'all' ? '전체' : actionConfig[f].label;
                        const count = actionCounts[f];
                        return (
                          <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                              filter === f
                                ? 'bg-green-900 text-white border-green-900'
                                : 'bg-white text-green-800 border-green-200'
                            }`}
                          >
                            {label} {count > 0 && <span className="ml-0.5 opacity-70">{count}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 메모 목록 */}
                {memos.length === 0 && !showForm ? (
                  <div className="text-center py-16">
                    <p className="text-green-800 mb-2">아직 메모가 없습니다</p>
                    <p className="text-green-400 text-xs">투자 기록을 남겨보세요</p>
                  </div>
                ) : filteredMemos.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-green-400 text-sm">검색 결과가 없습니다</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredMemos.map((memo) => {
                      const ac = actionConfig[memo.action] || actionConfig.watch;
                      const date = new Date(memo.created_at).toLocaleDateString('ko-KR', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      });

                      return (
                        <div
                          key={memo.id}
                          className="bg-white rounded-2xl p-4 transition-all hover:shadow-sm"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${ac.bg} ${ac.color}`}>
                                {ac.icon} {ac.label}
                              </span>
                              <h4 className="font-bold text-green-900">{memo.stock_name}</h4>
                            </div>
                            <div className="flex items-center">
                              <button
                                onClick={() => handleEdit(memo)}
                                className="text-green-300 hover:text-green-700 transition-colors p-2.5"
                                aria-label="메모 수정"
                              >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M10 1.5L12.5 4L4.5 12H2V9.5L10 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setDeletingId(memo.id)}
                                className="text-green-300 hover:text-rose-500 transition-colors p-2.5"
                                aria-label="메모 삭제"
                              >
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                  <path d="M2 4H12M5 4V2.5H9V4M5.5 6.5V10.5M8.5 6.5V10.5M3 4L3.5 11.5H10.5L11 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </button>
                            </div>
                          </div>

                          {(memo.price || memo.quantity) && (
                            <div className="flex items-center gap-3 mb-2 text-xs text-green-800">
                              {memo.price && <span>{memo.price.toLocaleString()}원</span>}
                              {memo.quantity && <span>{memo.quantity}주</span>}
                              {memo.price && memo.quantity && (
                                <span className="text-green-700 font-medium">
                                  = {(memo.price * memo.quantity).toLocaleString()}원
                                </span>
                              )}
                            </div>
                          )}

                          <p className="text-green-700 text-sm leading-relaxed mb-2">{memo.memo}</p>

                          <div className="flex items-center justify-between">
                            <span className="text-green-400 text-xs">{date}</span>
                            <div className="flex items-center gap-1.5">
                              {memo.invest_mood && (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${moodGradeColor[memo.invest_mood] || 'bg-green-100 text-green-700'}`}>
                                  {memo.invest_mood}등급
                                </span>
                              )}
                              {memo.decision_mode && (
                                <span className="text-xs text-green-800">{memo.decision_mode}</span>
                              )}
                            </div>
                          </div>

                          {deletingId === memo.id && (
                            <div className="mt-3 pt-3 border-t border-green-100 flex items-center justify-between">
                              <span className="text-xs text-green-800">정말 삭제할까요?</span>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setDeletingId(null)}
                                  className="text-xs text-green-800 hover:text-green-700 px-3 py-1 rounded-lg"
                                >
                                  취소
                                </button>
                                <button
                                  onClick={() => handleDelete(memo.id)}
                                  className="text-xs text-white bg-rose-500 hover:bg-rose-600 px-3 py-1 rounded-lg font-medium"
                                >
                                  삭제
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
      </PullToRefresh>
    </main>
  );
}
