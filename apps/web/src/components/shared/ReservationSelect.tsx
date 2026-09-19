'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

interface ReservationSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  hasError?: boolean;
}

export default function ReservationSelect({
  id,
  value,
  onChange,
  options,
  placeholder = 'Select',
  hasError = false,
}: ReservationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full px-3 py-2.5 border rounded-none bg-[var(--ivory-50)] text-left flex items-center justify-between text-sm transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-focus min-h-[44px]',
          hasError ? 'border-red-500' : 'border-[var(--ivory-200)] hover:border-[var(--espresso-900)]/40',
          value ? 'text-[var(--espresso-900)]' : 'text-[var(--muted)]'
        )}
      >
        <span className={cn('truncate font-sans', value && 'font-medium')}>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-[var(--espresso-900)]/60 flex-shrink-0 ml-2 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={placeholder}
          className="absolute top-full left-0 right-0 mt-1 z-50 max-h-56 overflow-y-auto bg-[var(--ivory-50)] border border-[var(--espresso-900)]/20 shadow-xl p-1.5 space-y-0.5 rounded-xs"
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'w-full text-left px-3 py-2 text-sm flex items-center justify-between rounded-xs cursor-pointer transition-colors duration-150',
                  isSelected
                    ? 'bg-[#FAF6F0] text-[var(--espresso-900)] font-semibold border-l-2 border-[var(--terracotta)] pl-2.5 shadow-xs'
                    : 'text-[var(--espresso-800)] hover:bg-[var(--ivory-200)]/60'
                )}
              >
                <span className="font-sans">{option.label}</span>
                {isSelected && (
                  <span className="flex items-center gap-1 text-[var(--terracotta)] text-xs">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
