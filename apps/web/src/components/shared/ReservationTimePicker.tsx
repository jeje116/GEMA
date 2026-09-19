'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Clock, Check, Search } from 'lucide-react';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { cn } from '@/lib/utils';
import { formatTimeSlotDisplay, filterTimeSlots } from '@/lib/reservationConfig';

interface ReservationTimePickerProps {
  id?: string;
  value: string; // HH:MM
  onChange: (time: string) => void;
  slots: string[];
  disabled?: boolean;
  disabledMessage?: string;
  placeholder?: string;
  hasError?: boolean;
  locale?: Locale;
}

export default function ReservationTimePicker({
  id = 'res-time',
  value,
  onChange,
  slots,
  disabled = false,
  disabledMessage,
  placeholder = 'Select a time',
  hasError = false,
  locale = 'en',
}: ReservationTimePickerProps) {
  const { t } = getDictionary(locale);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsListRef = useRef<HTMLDivElement>(null);

  // Filter slots using tolerant matching logic (STRICTLY filters valid slots only)
  const filteredSlots = filterTimeSlots(slots, searchQuery);

  // Sync state on open
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setHighlightedIndex(-1);
      // Auto-focus search input after short tick
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Close on outside click or Escape
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

  const handleSelect = (timeStr: string) => {
    onChange(timeStr);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  // Keyboard navigation inside search input
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredSlots.length > 0) {
        setHighlightedIndex((prev) => (prev < filteredSlots.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredSlots.length > 0) {
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredSlots.length - 1));
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredSlots.length) {
        handleSelect(filteredSlots[highlightedIndex]);
      } else if (filteredSlots.length === 1) {
        handleSelect(filteredSlots[0]);
      }
    }
  };

  const displayText = value
    ? formatTimeSlotDisplay(value)
    : disabled
    ? disabledMessage || placeholder
    : placeholder;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Closed State Trigger Button */}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'w-full px-3 py-2.5 border rounded-none text-left flex items-center justify-between text-sm transition-colors min-h-[44px]',
          disabled
            ? 'opacity-60 cursor-not-allowed bg-[var(--ivory-100)]/40 border-[var(--ivory-200)] text-[var(--muted)]'
            : 'bg-[var(--ivory-50)] cursor-pointer focus:outline-none focus:ring-1 focus:ring-focus',
          !disabled && hasError && 'border-red-500',
          !disabled && !hasError && 'border-[var(--ivory-200)] hover:border-[var(--espresso-900)]/40',
          value && !disabled ? 'text-[var(--espresso-900)]' : 'text-[var(--muted)]'
        )}
      >
        <span className={cn('truncate font-sans', value && !disabled ? 'font-medium' : '')}>{displayText}</span>
        <Clock className="w-4 h-4 text-[var(--espresso-900)]/60 flex-shrink-0 ml-2" aria-hidden="true" />
      </button>

      {/* Popover Time Listbox */}
      {isOpen && !disabled && (
        <div
          role="dialog"
          aria-label="Time slots"
          className="absolute top-full left-0 right-0 mt-1 z-50 bg-[var(--ivory-50)] border border-[var(--espresso-900)]/20 shadow-xl rounded-xs flex flex-col max-h-72 overflow-hidden"
        >
          {/* Search Header */}
          <div className="p-2 border-b border-[var(--ivory-200)] bg-[var(--ivory-50)] sticky top-0 z-10">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--espresso-900)]/50 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(-1);
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder={t('reservation.time.searchPlaceholder')}
                aria-label={t('reservation.time.searchPlaceholder')}
                className="w-full pl-8 pr-3 py-1.5 text-xs font-sans border border-[var(--ivory-200)] bg-[var(--ivory-50)] text-[var(--espresso-900)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-1 focus:ring-focus transition-colors"
              />
            </div>
          </div>

          {/* Slots Listbox */}
          <div
            ref={optionsListRef}
            role="listbox"
            aria-label="Time slots list"
            className="flex-1 overflow-y-auto p-1.5 space-y-0.5"
          >
            {slots.length === 0 ? (
              <div className="p-3 text-xs text-[var(--muted)] italic text-center">
                {disabledMessage || 'No slots available'}
              </div>
            ) : filteredSlots.length === 0 ? (
              <div className="p-3 text-xs text-[var(--terracotta)] font-sans italic text-center">
                {t('reservation.time.noMatch')}
              </div>
            ) : (
              filteredSlots.map((slot, index) => {
                const isSelected = slot === value;
                const isHighlighted = index === highlightedIndex;
                const formatted = formatTimeSlotDisplay(slot);

                return (
                  <button
                    key={slot}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(slot)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      'w-full text-left px-3 py-2 text-sm flex items-center justify-between rounded-xs cursor-pointer transition-colors duration-150',
                      isSelected
                        ? 'bg-[#FAF6F0] text-[var(--espresso-900)] font-semibold border-l-2 border-[var(--terracotta)] pl-2.5 shadow-xs'
                        : isHighlighted
                        ? 'bg-[var(--ivory-200)]/70 text-[var(--espresso-900)]'
                        : 'text-[var(--espresso-800)] hover:bg-[var(--ivory-200)]/60'
                    )}
                  >
                    <span className="font-sans tracking-wide">{formatted}</span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[var(--terracotta)] text-xs">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
