'use client';

import { useRef, useState, useEffect } from 'react';

interface DateInputProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
}

export default function DateInput({ value, onChange }: DateInputProps) {
  const [parts, setParts] = useState(() => {
    const [y = '', m = '', d = ''] = value.split('-');
    return { y, m, d };
  });
  const yearRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);

  // 외부 value 변경 시 동기화
  useEffect(() => {
    const [y = '', m = '', d = ''] = value.split('-');
    setParts({ y, m, d });
  }, [value]);

  // 완성된 날짜만 부모에 전달
  const emitIfComplete = (y: string, m: string, d: string) => {
    if (y.length === 4 && m.length >= 1 && d.length >= 1) {
      const mm = m.padStart(2, '0');
      const dd = d.padStart(2, '0');
      onChange(`${y}-${mm}-${dd}`);
    }
  };

  const handleYear = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    setParts(p => ({ ...p, y: digits }));
    if (digits.length === 4) {
      emitIfComplete(digits, parts.m, parts.d);
      monthRef.current?.focus();
    }
  };

  const handleMonth = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 2);
    const num = Number(digits);

    if (digits.length === 1 && num > 1) {
      const padded = `0${digits}`;
      setParts(p => ({ ...p, m: padded }));
      emitIfComplete(parts.y, padded, parts.d);
      dayRef.current?.focus();
      return;
    }
    if (digits.length === 2) {
      const clamped = String(Math.min(Math.max(num, 1), 12)).padStart(2, '0');
      setParts(p => ({ ...p, m: clamped }));
      emitIfComplete(parts.y, clamped, parts.d);
      dayRef.current?.focus();
      return;
    }
    setParts(p => ({ ...p, m: digits }));
  };

  const handleDay = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 2);
    const num = Number(digits);

    if (digits.length === 1 && num > 3) {
      const padded = `0${digits}`;
      setParts(p => ({ ...p, d: padded }));
      emitIfComplete(parts.y, parts.m, padded);
      dayRef.current?.blur();
      return;
    }
    if (digits.length === 2) {
      const clamped = String(Math.min(Math.max(num, 1), 31)).padStart(2, '0');
      setParts(p => ({ ...p, d: clamped }));
      emitIfComplete(parts.y, parts.m, clamped);
      dayRef.current?.blur();
      return;
    }
    setParts(p => ({ ...p, d: digits }));
  };

  const handleYearKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && parts.y === '') {
      // 이미 비어있으면 아무것도 안 함
    }
  };

  const handleMonthKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && parts.m === '') {
      yearRef.current?.focus();
    }
  };

  const handleDayKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && parts.d === '') {
      monthRef.current?.focus();
    }
  };

  return (
    <div className="flex items-center gap-2 bg-surface-container-lowest rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary" role="group" aria-label="생년월일 입력">
      <input
        ref={yearRef}
        type="text"
        inputMode="numeric"
        value={parts.y}
        onChange={(e) => handleYear(e.target.value)}
        onKeyDown={handleYearKey}
        placeholder="YYYY"
        maxLength={4}
        aria-label="년도"
        className="w-16 text-center bg-transparent outline-none text-on-surface font-bold"
      />
      <span className="text-on-surface-variant" aria-hidden="true">/</span>
      <input
        ref={monthRef}
        type="text"
        inputMode="numeric"
        value={parts.m}
        onChange={(e) => handleMonth(e.target.value)}
        onKeyDown={handleMonthKey}
        placeholder="MM"
        maxLength={2}
        aria-label="월"
        className="w-10 text-center bg-transparent outline-none text-on-surface font-bold"
      />
      <span className="text-on-surface-variant" aria-hidden="true">/</span>
      <input
        ref={dayRef}
        type="text"
        inputMode="numeric"
        value={parts.d}
        onChange={(e) => handleDay(e.target.value)}
        onKeyDown={handleDayKey}
        placeholder="DD"
        maxLength={2}
        aria-label="일"
        className="w-10 text-center bg-transparent outline-none text-on-surface font-bold"
      />
    </div>
  );
}
