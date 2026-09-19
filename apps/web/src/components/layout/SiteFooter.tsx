'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { siteData } from '@/content/fixtures/site';
import { useUI } from '@/components/shared/UIContext';

export default function SiteFooter({ locale }: { locale: Locale }) {
  const { t } = getDictionary(locale);
  const { openReservation } = useUI();

  return (
    <footer className="bg-[var(--ink)] text-[var(--ivory-100)] pt-16 md:pt-24 pb-8 md:pb-12 px-4 sm:px-6 md:px-8 border-t border-[var(--espresso-800)]/40">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16 md:mb-20">
          
          {/* Block 1: Unified Brand & Address */}
          <div className="lg:col-span-4">
            <Link
              href={`/${locale}`}
              aria-label="GEMA Restaurant & Societiet Home"
              className="inline-block mb-5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--terracotta)] rounded-sm"
            >
              <Image
                src="/media/brand/gema-brand-2.png"
                alt="GEMA Restaurant & Societiet"
                width={263}
                height={168}
                className="w-[170px] sm:w-[190px] md:w-[210px] h-auto object-contain transition-opacity duration-300 group-hover:opacity-85"
              />
            </Link>
            <address className="not-italic text-sm text-[var(--muted)] leading-relaxed space-y-2 max-w-xs">
              <p>{siteData.fullAddress}</p>
              <p className="pt-2">
                <a
                  href={`tel:${siteData.phone.replace(/[^0-9]/g, '')}`}
                  className="text-[var(--ivory-100)] hover:text-[var(--terracotta)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--terracotta)] rounded-sm"
                >
                  {siteData.phone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${siteData.email}`}
                  className="text-[var(--muted)] hover:text-[var(--terracotta)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--terracotta)] rounded-sm"
                >
                  {siteData.email}
                </a>
              </p>
            </address>
          </div>

          {/* Block 2: Navigation */}
          <div className="lg:col-span-3 lg:col-start-6">
            <h3 className="font-condensed uppercase tracking-widest text-xs text-[var(--muted)] mb-5">Navigation</h3>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li><Link href={`/${locale}/menu`} className="hover:text-[var(--terracotta)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--terracotta)] rounded-sm">{t('nav.menu')}</Link></li>
              <li><Link href={`/${locale}/experience`} className="hover:text-[var(--terracotta)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--terracotta)] rounded-sm">{t('nav.experience')}</Link></li>
              <li><Link href={`/${locale}/occasions`} className="hover:text-[var(--terracotta)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--terracotta)] rounded-sm">{t('nav.occasions')}</Link></li>
              <li><Link href={`/${locale}/events`} className="hover:text-[var(--terracotta)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--terracotta)] rounded-sm">{t('nav.events')}</Link></li>
              <li><Link href={`/${locale}/about`} className="hover:text-[var(--terracotta)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--terracotta)] rounded-sm">{t('nav.about')}</Link></li>
              <li><Link href={`/${locale}/journal`} className="hover:text-[var(--terracotta)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--terracotta)] rounded-sm">{t('nav.journal')}</Link></li>
              <li><Link href={`/${locale}/recognition`} className="hover:text-[var(--terracotta)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--terracotta)] rounded-sm">{t('nav.recognition')}</Link></li>
            </ul>
          </div>

          {/* Block 3: Contact & Reservation */}
          <div className="lg:col-span-2">
            <h3 className="font-condensed uppercase tracking-widest text-xs text-[var(--muted)] mb-5">{t('footer.contact')}</h3>
            <ul className="flex flex-col gap-2.5 text-sm mb-6">
              <li>
                <button
                  onClick={openReservation}
                  className="hover:text-[var(--terracotta)] transition-colors text-left inline-block cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--terracotta)] rounded-sm"
                >
                  {t('footer.reserve')}
                </button>
              </li>
              <li>
                <Link href={`/${locale}/visit`} className="hover:text-[var(--terracotta)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--terracotta)] rounded-sm">
                  {t('nav.visit')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Block 4: Social */}
          <div className="lg:col-span-2">
            <h3 className="font-condensed uppercase tracking-widest text-xs text-[var(--muted)] mb-5">{t('footer.social')}</h3>
            <div className="flex items-center gap-3 mb-4">
              <a
                href="https://www.tiktok.com/@gemarestaurant"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GEMA on TikTok"
                className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--ivory-100)] border border-[var(--espresso-800)] bg-[var(--espresso-900)]/40 hover:bg-[var(--espresso-900)] hover:text-[var(--terracotta)] hover:border-[var(--terracotta)] hover:-translate-y-0.5 hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--terracotta)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink)] transition-all duration-200 ease-out cursor-pointer"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.3 0 .59.04.86.12V9.39a6.38 6.38 0 0 0-.86-.06A6.34 6.34 0 0 0 3 15.67 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.33V8.84a8.3 8.3 0 0 0 5-1.63l-1.09-2.52z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/gema.surabaya/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GEMA on Instagram"
                className="w-10 h-10 rounded-full flex items-center justify-center text-[var(--ivory-100)] border border-[var(--espresso-800)] bg-[var(--espresso-900)]/40 hover:bg-[var(--espresso-900)] hover:text-[var(--terracotta)] hover:border-[var(--terracotta)] hover:-translate-y-0.5 hover:scale-[1.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--terracotta)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ink)] transition-all duration-200 ease-out cursor-pointer"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
            <div className="text-xs font-condensed tracking-wider text-[var(--muted)] space-y-1">
              <p>
                <a
                  href="https://www.instagram.com/gema.surabaya/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--terracotta)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--terracotta)] rounded-sm"
                >
                  @gema.surabaya
                </a>
              </p>
              <p>
                <a
                  href="https://www.tiktok.com/@gemarestaurant"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--terracotta)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--terracotta)] rounded-sm"
                >
                  @gemarestaurant
                </a>
              </p>
            </div>
          </div>

        </div>

        {/* Refined Divider & Bottom Bar */}
        <div className="border-t border-[var(--espresso-800)]/60 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-condensed tracking-wider text-[var(--muted)]">
          <p>© {new Date().getFullYear()} GEMA Restaurant & Societiet. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[var(--muted)]/80">
            <span>No Pork, No Lard</span>
            <span aria-hidden="true">•</span>
            <span>Surabaya, Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
