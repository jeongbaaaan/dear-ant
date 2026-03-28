'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import krxStocks from '@/data/krx-stocks.json';

interface Stock {
  code: string;
  name: string;
}

interface StockSearchProps {
  value: string;
  onChange: (name: string, code?: string) => void;
  placeholder?: string;
}

export default function StockSearch({ value, onChange, placeholder = '종목명 검색' }: StockSearchProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => { setQuery(value); }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results: Stock[] = useMemo(() => {
    if (!query || query.length < 1) return [];
    const q = query.toLowerCase();
    return (krxStocks as Stock[])
      .filter(s => s.name.toLowerCase().includes(q) || s.code.includes(q))
      .slice(0, 20);
  }, [query]);

  const handleSelect = (stock: Stock) => {
    setQuery(stock.name);
    onChange(stock.name, stock.code);
    setIsOpen(false);
    setHighlightIdx(-1);
  };

  const handleInputChange = (val: string) => {
    setQuery(val);
    onChange(val);
    setIsOpen(true);
    setHighlightIdx(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIdx(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIdx(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && highlightIdx >= 0) {
      e.preventDefault();
      handleSelect(results[highlightIdx]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (highlightIdx >= 0 && listRef.current) {
      const el = listRef.current.children[highlightIdx] as HTMLElement;
      el?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightIdx]);

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => query.length >= 1 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary text-on-surface text-sm"
          autoComplete="off"
        />
      </div>

      {isOpen && results.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/30 max-h-60 overflow-y-auto"
        >
          {results.map((stock, i) => (
            <li
              key={stock.code}
              onClick={() => handleSelect(stock)}
              className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors ${
                i === highlightIdx ? 'bg-primary-container' : 'hover:bg-surface-container'
              }`}
            >
              <span className="font-bold text-sm text-on-surface">{stock.name}</span>
              <span className="text-xs text-on-surface-variant">{stock.code}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
