'use client';

import { useRef } from 'react';

interface DateInputProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
}

export default function DateInput({ value, onChange }: DateInputProps) {
  const [y = '', m = '', d = ''] = value.split('-');
  const yearRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);

  const update = (year: string, month: string, day: string) => {
    const yy = year.replace(/\D/g, '').slice(0, 4);
    const mm = month.replace(/\D/g, '').slice(0, 2);
    const dd = day.replace(/\D/g, '').slice(0, 2);

    if (yy && mm && dd) {
      onChange(`${yy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`);
    } else {
      onChange([yy, mm, dd].filter(Boolean).join('-'));
    }
  };

  const handleYear = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    update(digits, m, d);
    if (digits.length === 4) monthRef.current?.focus();
  };

  const handleMonth = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 2);
    const num = Number(digits);
    if (digits.length === 1 && num > 1) {
      update(y, `0${digits}`, d);
      dayRef.current?.focus();
      return;
    }
    if (digits.length === 2) {
      const clamped = Math.min(Math.max(num, 1), 12);
      update(y, String(clamped).padStart(2, '0'), d);
      dayRef.current?.focus();
      return;
    }
    update(y, digits, d);
  };

  const handleDay = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 2);
    const num = Number(digits);
    if (digits.length === 1 && num > 3) {
      update(y, m, `0${digits}`);
      dayRef.current?.blur();
      return;
    }
    if (digits.length === 2) {
      const clamped = Math.min(Math.max(num, 1), 31);
      update(y, m, String(clamped).padStart(2, '0'));
      dayRef.current?.blur();
      return;
    }
    update(y, m, digits);
  };

  const handleMonthKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !m) {
      yearRef.current?.focus();
    }
  };

  const handleDayKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !d) {
      monthRef.current?.focus();
    }
  };

  return (
    <div className="flex items-center gap-2 bg-surface-container-lowest rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary">
      <input
        ref={yearRef}
        type="text"
        inputMode="numeric"
        value={y}
        onChange={(e) => handleYear(e.target.value)}
        placeholder="YYYY"
        maxLength={4}
        className="w-16 text-center bg-transparent outline-none text-on-surface font-bold"
      />
      <span className="text-on-surface-variant">/</span>
      <input
        ref={monthRef}
        type="text"
        inputMode="numeric"
        value={m}
        onChange={(e) => handleMonth(e.target.value)}
        onKeyDown={handleMonthKey}
        placeholder="MM"
        maxLength={2}
        className="w-10 text-center bg-transparent outline-none text-on-surface font-bold"
      />
      <span className="text-on-surface-variant">/</span>
      <input
        ref={dayRef}
        type="text"
        inputMode="numeric"
        value={d}
        onChange={(e) => handleDay(e.target.value)}
        onKeyDown={handleDayKey}
        placeholder="DD"
        maxLength={2}
        className="w-10 text-center bg-transparent outline-none text-on-surface font-bold"
      />
    </div>
  );
}
