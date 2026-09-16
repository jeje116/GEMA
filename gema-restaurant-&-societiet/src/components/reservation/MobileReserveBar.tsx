import React from 'react';
import { useUI } from '../shared/UIContext';
import { useLanguage } from '../../i18n/LanguageProvider';

export default function MobileReserveBar() {
  const { openReservation } = useUI();
  const { t } = useLanguage();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[var(--ivory-50)] via-[var(--ivory-50)] to-transparent z-30 pb-safe">
      <button 
        onClick={openReservation}
        className="w-full bg-[var(--ink)] text-[var(--white)] py-4 font-condensed tracking-widest uppercase text-sm shadow-lg hover:bg-[var(--espresso-800)] transition-colors"
      >
        {t('nav.reserve')}
      </button>
    </div>
  );
}
