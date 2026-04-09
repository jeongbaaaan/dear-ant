'use client';

import { useState, useCallback } from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  formatter?: (value: number) => string;
  marks?: { value: number; label: string }[];
}

export default function SliderInput({
  label, value, onChange, min, max, step = 1, unit = '', formatter, marks,
}: SliderInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(value));

  const displayValue = formatter ? formatter(value) : `${value.toLocaleString()}${unit}`;

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    onChange(v);
    setInputValue(String(v));
  }, [onChange]);

  const handleInputSubmit = useCallback(() => {
    const parsed = Number(inputValue.replace(/,/g, ''));
    if (!isNaN(parsed)) {
      const clamped = Math.min(max, Math.max(min, parsed));
      onChange(clamped);
      setInputValue(String(clamped));
    }
    setIsEditing(false);
  }, [inputValue, min, max, onChange]);

  return (
    <div className="mb-0">
      <div className="flex justify-between items-center mb-2.5">
        <span className="text-[13px] font-semibold text-on-surface-secondary">{label}</span>
        {isEditing ? (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={handleInputSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
            autoFocus
            className="w-28 text-right text-base font-extrabold text-primary bg-transparent border-b-2 border-primary outline-none"
          />
        ) : (
          <button
            onClick={() => { setInputValue(String(value)); setIsEditing(true); }}
            className="text-base font-extrabold text-primary hover:underline cursor-pointer"
          >
            {displayValue}
          </button>
        )}
      </div>
      <input
        type="range"
        className="slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleSliderChange}
      />
      {marks && (
        <div className="flex justify-between mt-1.5">
          {marks.map((m) => (
            <span key={m.value} className="text-[11px] text-on-surface-quaternary">{m.label}</span>
          ))}
        </div>
      )}
    </div>
  );
}
