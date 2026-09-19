'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { cn } from '@/lib/utils';
import {
  formatDateDisplay,
  formatMonthYear,
  getDaysInMonth,
  getFirstDayOfWeek,
  getJakartaDateString,
  parseReservationDateInput,
  RESERVATION_MONTH_NAMES,
} from '@/lib/reservationConfig';

interface ReservationDatePickerProps {
  id?: string;
  value: string; // canonical 'YYYY-MM-DD'
  onChange: (date: string) => void;
  minDate?: string; // 'YYYY-MM-DD'
  locale: Locale;
  placeholder?: string;
  hasError?: boolean;
}

const WEEKDAYS = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  id: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
};

export default function ReservationDatePicker({
  id = 'res-date',
  value,
  onChange,
  minDate,
  locale,
  placeholder = locale === 'id' ? '18 September 2026' : '18 September 2026',
  hasError = false,
}: ReservationDatePickerProps) {
  const { t } = getDictionary(locale);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const todayStr = minDate || getJakartaDateString();
  const [todayYear, todayMonth] = todayStr.split('-').map(Number);

  // Main field text input state (formatted display or active typing)
  const [inputValue, setInputValue] = useState<string>(() => {
    return value ? formatDateDisplay(value, locale) : '';
  });

  // Inline validation error (for manual typing)
  const [inlineError, setInlineError] = useState<string>('');

  // Synchronize input text when canonical value changes externally
  useEffect(() => {
    if (value) {
      setInputValue(formatDateDisplay(value, locale));
      setInlineError('');
    } else if (!inputValue) {
      setInputValue('');
    }
  }, [value, locale]);

  // View year and month for calendar popover
  const getInitialYearMonth = useCallback(() => {
    if (value) {
      const [y, m] = value.split('-').map(Number);
      return { year: y, month: m - 1 };
    }
    return { year: todayYear, month: todayMonth - 1 };
  }, [value, todayYear, todayMonth]);

  const [{ year: viewYear, month: viewMonth }, setViewMonthYear] = useState(getInitialYearMonth);

  // Sync calendar view when popover opens
  useEffect(() => {
    if (isOpen) {
      setViewMonthYear(getInitialYearMonth());
    }
  }, [isOpen, getInitialYearMonth]);

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
        inputRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Handle selecting a date from the calendar
  const handleSelectDay = (dayStr: string) => {
    onChange(dayStr);
    setInputValue(formatDateDisplay(dayStr, locale));
    setInlineError('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Manual typing handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputValue(text);

    if (!text.trim()) {
      onChange('');
      setInlineError('');
      return;
    }

    // Live validation if full parsable date
    const parsed = parseReservationDateInput(text, todayStr);
    if (parsed.valid && parsed.date) {
      onChange(parsed.date);
      setInlineError('');
      // Sync calendar view
      const [y, m] = parsed.date.split('-').map(Number);
      setViewMonthYear({ year: y, month: m - 1 });
    }
  };

  // Commit / validate on blur
  const handleInputBlur = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      onChange('');
      setInlineError('');
      return;
    }

    const parsed = parseReservationDateInput(trimmed, todayStr);
    if (parsed.valid && parsed.date) {
      onChange(parsed.date);
      setInputValue(formatDateDisplay(parsed.date, locale));
      setInlineError('');
      const [y, m] = parsed.date.split('-').map(Number);
      setViewMonthYear({ year: y, month: m - 1 });
    } else if (parsed.error === 'past') {
      setInlineError(
        locale === 'id'
          ? 'Tanggal yang sudah lewat tidak tersedia.'
          : 'Past dates are not available.'
      );
    } else {
      setInlineError(
        locale === 'id'
          ? 'Masukkan tanggal reservasi yang valid.'
          : 'Enter a valid reservation date.'
      );
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInputBlur();
      setIsOpen(false);
    }
  };

  // Month navigation
  const isPrevDisabled =
    viewYear < todayYear || (viewYear === todayYear && viewMonth <= todayMonth - 1);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPrevDisabled) return;
    setViewMonthYear((prev) => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { year: prev.year, month: prev.month - 1 };
    });
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewMonthYear((prev) => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { year: prev.year, month: prev.month + 1 };
    });
  };

  // Direct Year & Month selection
  const handleYearChange = (newYear: number) => {
    setViewMonthYear((prev) => {
      let newMonth = prev.month;
      if (newYear === todayYear && newMonth < todayMonth - 1) {
        newMonth = todayMonth - 1;
      }
      return { year: newYear, month: newMonth };
    });
  };

  const handleMonthChange = (newMonth: number) => {
    setViewMonthYear((prev) => ({ ...prev, month: newMonth }));
  };

  // Calendar calculations
  const totalDays = getDaysInMonth(viewYear, viewMonth);
  const startDay = getFirstDayOfWeek(viewYear, viewMonth);
  const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);
  const blankDays = Array.from({ length: startDay }, (_, i) => i);

  // Extendable rolling years (15 years)
  const availableYears = Array.from({ length: 15 }, (_, i) => todayYear + i);
  const monthNames = RESERVATION_MONTH_NAMES[locale] || RESERVATION_MONTH_NAMES.en;

  const hasValidationError = hasError || !!inlineError;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* 1. MAIN DATE FIELD (TYPEABLE INPUT + CALENDAR TOGGLE ICON) */}
      <div
        className={cn(
          'w-full border rounded-none bg-[var(--ivory-50)] flex items-center justify-between text-sm transition-colors min-h-[44px]',
          hasValidationError
            ? 'border-red-500'
            : 'border-[var(--ivory-200)] hover:border-[var(--espresso-900)]/40 focus-within:border-[var(--espresso-900)]/60 focus-within:ring-1 focus-within:ring-focus'
        )}
      >
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          placeholder={placeholder}
          aria-label={locale === 'id' ? 'Tanggal Pilihan' : 'Preferred Date'}
          aria-invalid={hasValidationError}
          aria-describedby={inlineError ? 'date-inline-error' : undefined}
          className="flex-1 bg-transparent px-3 py-2.5 text-sm font-sans text-[var(--espresso-900)] placeholder:text-[var(--muted)] focus:outline-none"
        />

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close calendar' : 'Open calendar'}
          aria-expanded={isOpen}
          className="p-2.5 text-[var(--espresso-900)]/60 hover:text-[var(--espresso-900)] transition-colors cursor-pointer flex-shrink-0"
        >
          <CalendarIcon className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Subtle Inline Validation Message */}
      {inlineError && (
        <p id="date-inline-error" role="alert" className="text-xs text-[var(--terracotta)] font-sans mt-1">
          {inlineError}
        </p>
      )}

      {/* 2. CALENDAR POPOVER */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label="Calendar date selector"
          className="absolute top-full left-0 mt-1 z-50 w-full sm:w-[330px] bg-[var(--ivory-50)] border border-[var(--espresso-900)]/20 shadow-xl p-3.5 rounded-xs"
        >
          {/* Top Row: Previous Month arrow | Month selector | Year selector | Next Month arrow */}
          <div className="flex items-center justify-between gap-1.5 mb-2.5 pb-2 border-b border-[var(--ivory-200)]">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={isPrevDisabled}
              aria-label="Previous month"
              className={cn(
                'w-7 h-7 rounded-full flex items-center justify-center transition-colors flex-shrink-0',
                isPrevDisabled
                  ? 'opacity-30 cursor-not-allowed text-[var(--muted)]'
                  : 'text-[var(--espresso-900)] hover:bg-[var(--ivory-200)]/60 cursor-pointer'
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 flex-1 justify-center">
              {/* Month Selector */}
              <div className="relative">
                <select
                  value={viewMonth}
                  onChange={(e) => handleMonthChange(Number(e.target.value))}
                  aria-label="Select month"
                  className="appearance-none bg-transparent text-xs sm:text-sm font-sans font-medium text-[var(--espresso-900)] pr-5 pl-2 py-1 rounded-xs hover:bg-[var(--ivory-200)]/50 focus:outline-none focus:ring-1 focus:ring-focus cursor-pointer border border-transparent hover:border-[var(--ivory-200)] transition-colors"
                >
                  {monthNames.map((name, idx) => {
                    const isPastMonth = viewYear === todayYear && idx < todayMonth - 1;
                    return (
                      <option
                        key={name}
                        value={idx}
                        disabled={isPastMonth}
                        className="bg-[var(--ivory-50)] text-[var(--espresso-900)]"
                      >
                        {name}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="w-3 h-3 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--espresso-900)]/60" />
              </div>

              {/* Year Selector */}
              <div className="relative">
                <select
                  value={viewYear}
                  onChange={(e) => handleYearChange(Number(e.target.value))}
                  aria-label="Select year"
                  className="appearance-none bg-transparent text-xs sm:text-sm font-sans font-medium text-[var(--espresso-900)] pr-5 pl-2 py-1 rounded-xs hover:bg-[var(--ivory-200)]/50 focus:outline-none focus:ring-1 focus:ring-focus cursor-pointer border border-transparent hover:border-[var(--ivory-200)] transition-colors"
                >
                  {availableYears.map((yr) => (
                    <option key={yr} value={yr} className="bg-[var(--ivory-50)] text-[var(--espresso-900)]">
                      {yr}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--espresso-900)]/60" />
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              aria-label="Next month"
              className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--espresso-900)] hover:bg-[var(--ivory-200)]/60 transition-colors cursor-pointer flex-shrink-0"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekdays Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {(WEEKDAYS[locale] || WEEKDAYS.en).map((dayName) => (
              <span
                key={dayName}
                className="text-[10px] font-condensed tracking-wider uppercase text-[var(--muted)] py-0.5 font-semibold select-none"
              >
                {dayName}
              </span>
            ))}
          </div>

          {/* Day Grid */}
          <div className="grid grid-cols-7 gap-1">
            {blankDays.map((b) => (
              <div key={`blank-${b}`} className="w-8 h-8 sm:w-8.5 sm:h-8.5" aria-hidden="true" />
            ))}

            {daysArray.map((day) => {
              const dayStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isPast = dayStr < todayStr;
              const isToday = dayStr === todayStr;
              const isSelected = dayStr === value;

              return (
                <button
                  key={day}
                  type="button"
                  disabled={isPast}
                  onClick={() => handleSelectDay(dayStr)}
                  aria-label={`${day} ${formatMonthYear(viewYear, viewMonth, locale)}`}
                  aria-selected={isSelected}
                  className={cn(
                    'w-8 h-8 sm:w-8.5 sm:h-8.5 flex items-center justify-center text-xs font-sans rounded-full transition-all duration-150',
                    isPast && 'opacity-30 text-[var(--muted)] cursor-not-allowed',
                    !isPast && !isSelected && 'text-[var(--espresso-900)] hover:bg-[var(--ivory-200)]/70 cursor-pointer',
                    isToday && !isSelected && 'ring-1 ring-[var(--espresso-900)]/40 font-semibold',
                    isSelected && 'bg-[#FAF6F0] text-[var(--espresso-900)] font-bold border border-[var(--terracotta)] shadow-xs ring-1 ring-[var(--terracotta)]'
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
