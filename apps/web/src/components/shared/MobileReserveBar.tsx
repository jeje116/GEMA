'use client';

import React from 'react';
import { useUI } from './UIContext';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

export default function MobileReserveBar({ locale }: { locale: Locale }) {
  const { t } = getDictionary(locale);
  const { openReservation } = useUI();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--ivory-50)] via-[var(--ivory-50)] to-transparent z-30 pb-safe">
      <button 
        onClick={openReservation}
        className="block text-center w-full bg-[var(--ink)] text-[var(--white)] py-4 font-condensed tracking-widest uppercase text-sm shadow-lg hover:bg-[var(--espresso-800)] transition-colors cursor-pointer"
      >
        {t('nav.reserve')}
      </button>
    </div>
  );
}
