'use client';

import React from 'react';
import Link from 'next/link';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { siteData } from '@/content/fixtures/site';
import { useUI } from '@/components/shared/UIContext';

export default function SiteFooter({ locale }: { locale: Locale }) {
  const { t } = getDictionary(locale);
  const { openReservation } = useUI();

  return (
    <footer className="bg-[var(--ink)] text-[var(--ivory-100)] pt-16 md:pt-24 pb-8 md:pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 md:mb-24">
          {/* Col 1: Brand */}
          <div className="md:col-span-1">
            <h2 className="font-serif text-3xl mb-4 tracking-wide text-white">GEMA</h2>
            <p className="font-condensed text-xs uppercase tracking-[0.2em] text-[var(--muted)] mb-6">
              Restaurant & Societiet
            </p>
            <p className="text-sm text-[var(--muted)] leading-relaxed mb-6">
              {siteData.fullAddress}
            </p>
            <p className="text-sm text-[var(--muted)]">
              {siteData.phone}
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h3 className="font-condensed uppercase tracking-widest text-xs text-[var(--muted)] mb-6">Navigation</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link href={`/${locale}/menu`} className="hover:text-[var(--terracotta)] transition-colors">{t('nav.menu')}</Link></li>
              <li><Link href={`/${locale}/experience`} className="hover:text-[var(--terracotta)] transition-colors">{t('nav.experience')}</Link></li>
              <li><Link href={`/${locale}/occasions`} className="hover:text-[var(--terracotta)] transition-colors">{t('nav.occasions')}</Link></li>
              <li><Link href={`/${locale}/events`} className="hover:text-[var(--terracotta)] transition-colors">{t('nav.events')}</Link></li>
              <li><Link href={`/${locale}/about`} className="hover:text-[var(--terracotta)] transition-colors">{t('nav.about')}</Link></li>
            </ul>
          </div>

          {/* Col 3: Contact & Reserve */}
          <div>
            <h3 className="font-condensed uppercase tracking-widest text-xs text-[var(--muted)] mb-6">{t('footer.contact')}</h3>
            <ul className="flex flex-col gap-3 text-sm mb-8">
              <li>
                <button
                  onClick={openReservation}
                  className="hover:text-[var(--terracotta)] transition-colors text-left inline-block cursor-pointer"
                >
                  {t('footer.reserve')}
                </button>
              </li>
              <li><Link href={`/${locale}/visit`} className="hover:text-[var(--terracotta)] transition-colors">{t('nav.visit')}</Link></li>
            </ul>
            
            <h3 className="font-condensed uppercase tracking-widest text-xs text-[var(--muted)] mb-4">{t('footer.social')}</h3>
            <p className="text-sm">
              <a href={siteData.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--terracotta)] transition-colors">
                Instagram
              </a>
            </p>
          </div>

          {/* Col 4: Note */}
          <div>
            <div className="border border-[var(--espresso-800)] p-6 rounded-sm bg-[var(--espresso-900)]/40">
              <p className="font-condensed text-xs tracking-wider text-[var(--muted)] leading-relaxed">
                {t('footer.demo.note')}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--espresso-800)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-condensed tracking-wider text-[var(--muted)]">
          <p>© {new Date().getFullYear()} GEMA Restaurant & Societiet. All rights reserved.</p>
          <div className="flex gap-6">
            <span>No Pork, No Lard</span>
            <span>Surabaya, Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
