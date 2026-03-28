'use client';

import { useState, useEffect } from 'react';

interface NumberInputProps {
  value: number | string;
  onChange: (raw: string) => void;
  suffix?: string;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}

export default function NumberInput({
  value,
  onChange,
  suffix = '원',
  placeholder = '0',
  className = '',
  ariaLabel,
}: NumberInputProps) {
  const numVal = typeof value === 'string' ? Number(value) || 0 : value;
  const [display, setDisplay] = useState(numVal > 0 ? numVal.toLocaleString() : '');

  useEffect(() => {
    const n = typeof value === 'string' ? Number(value) || 0 : value;
    setDisplay(n > 0 ? n.toLocaleString() : '');
  }, [value]);

  const handleChange = (raw: string) => {
    const digits = raw.replace(/[^0-9]/g, '');
    const num = Number(digits) || 0;
    setDisplay(num > 0 ? num.toLocaleString() : '');
    onChange(String(num));
  };

  return (
    <div className="relative">
      <input
        type="text"
        inputMode="numeric"
        value={display}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={`w-full px-4 py-2.5 pr-12 rounded-xl bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary text-on-surface text-sm font-bold ${className}`}
      />
      {suffix && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">{suffix}</span>
      )}
    </div>
  );
}
