'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useUI } from './UIContext';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { cn } from '@/lib/utils';
import ResDiaryWidget from './ResDiaryWidget';

export default function ReservationOverlay({
  locale,
  whatsappNumber,
}: {
  locale: Locale;
  whatsappNumber?: string;
}) {
  const { isReservationOpen, closeReservation } = useUI();
  const { t } = getDictionary(locale);
  useEffect(() => {
    if (isReservationOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isReservationOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isReservationOpen) {
        closeReservation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isReservationOpen, closeReservation]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 transition-all duration-300',
        isReservationOpen ? 'pointer-events-auto' : 'pointer-events-none'
      )}
      inert={!isReservationOpen ? true : undefined}
      aria-hidden={!isReservationOpen}
    >
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300',
          isReservationOpen ? 'opacity-100' : 'opacity-0'
        )}
        onClick={closeReservation}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 bottom-0 w-full md:w-[560px] lg:w-[600px] bg-[var(--ivory-50)] shadow-2xl z-50 flex flex-col overflow-hidden transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
          isReservationOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reservation-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--ivory-200)] flex-shrink-0">
          <h2 id="reservation-title" className="font-serif text-2xl text-[var(--espresso-900)]">
            {t('reservation.title')}
          </h2>
          <button
            onClick={closeReservation}
            className="p-2 hover:bg-[var(--ivory-100)] rounded-full transition-colors cursor-pointer"
            aria-label="Close reservation modal"
          >
            <X className="w-5 h-5 text-[var(--muted)]" />
          </button>
        </div>

        {/* ResDiary Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <ResDiaryWidget
            isOpen={isReservationOpen}
            locale={locale}
            whatsappNumber={whatsappNumber}
          />
        </div>
      </div>
    </div>
  );
}
