'use client';

import React from 'react';
import { motion } from 'motion/react';
import PageReveal from '@/components/motion/PageReveal';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { RecognitionItem } from '@/content/types';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { cn } from '@/lib/utils';

interface RecognitionClientProps {
  locale: Locale;
  recognitions: RecognitionItem[];
}

export default function RecognitionClient({ locale, recognitions }: RecognitionClientProps) {
  const { t, l } = getDictionary(locale);
  const prefersReduced = useReducedMotionSafe();

  return (
    <PageReveal title={t('nav.recognition')} className="bg-[var(--ivory-50)] min-h-screen pt-32 pb-28 md:pb-36">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Page Header with Refined View Archive Link */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-20">
          <div>
            <span className="font-condensed text-xs uppercase tracking-[0.25em] text-[var(--terracotta)] mb-3 block">
              GEMA Honors
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[var(--espresso-900)] leading-tight mb-4">
              {t('nav.recognition')}
            </h1>
            <p className="text-[var(--muted)] text-base md:text-lg leading-relaxed max-w-xl font-normal">
              {locale === 'id' 
                ? 'Arsip pengakuan kritis, penghargaan kuliner, dan catatan media terkemuka.' 
                : 'An archive of critical reception, culinary awards, and notable press mentions.'}
            </p>
          </div>

          {/* View Archive Link */}
          <div className="flex-shrink-0 pt-2 md:pt-0">
            <a
              href="#archive"
              onClick={(e) => e.preventDefault()}
              className="group inline-flex items-center gap-2 font-condensed uppercase tracking-widest text-xs text-[var(--muted)] hover:text-[var(--terracotta)] focus-visible:text-[var(--terracotta)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--terracotta)] transition-colors pb-1 border-b border-[var(--ivory-200)] hover:border-[var(--terracotta)] focus-visible:border-[var(--terracotta)]"
              aria-label={t('home.recognition.cta')}
            >
              <span>{t('home.recognition.cta')}</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="transition-transform duration-200 ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>

        {/* Clean Large Editorial List */}
        <div className="flex flex-col border-t border-[var(--ivory-200)]">
          {recognitions.map((rec, index) => {
            const titleText = l(rec.title);
            const content = (
              <>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8 w-full pr-12 md:pr-16">
                  {/* LEFT: Year (~12–16% column) */}
                  <div className="font-condensed tracking-widest text-xs md:text-sm text-[var(--muted)] w-full md:w-28 lg:w-32 flex-shrink-0">
                    {rec.year}
                  </div>

                  {/* CENTER: Main text group (dominant title + awarding body) */}
                  <div className="flex-grow md:pr-6 transition-transform duration-300 ease-out md:group-hover:translate-x-1 md:group-focus-visible:translate-x-1">
                    <h3 className="font-serif text-2xl sm:text-2xl md:text-3xl text-[var(--espresso-900)] leading-snug mb-1.5 md:mb-2 transition-colors duration-300 ease-out group-hover:text-[var(--terracotta)] group-focus-visible:text-[var(--terracotta)]">
                      {titleText}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-condensed uppercase tracking-wider text-xs text-[var(--muted)]">
                        {rec.awardingBody}
                      </span>
                      {rec.scope && (
                        <>
                          <span className="text-[var(--ivory-200)] text-xs" aria-hidden="true">•</span>
                          <span className="font-condensed uppercase tracking-wider text-[11px] text-[var(--muted)]/80">
                            {rec.scope === 'chef' ? 'Chef' : 'Restaurant'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT: Arrow indication with 28px resting inset desktop / 16px hover inset desktop */}
                <div className="absolute top-1/2 -translate-y-1/2 right-[20px] md:right-[28px] group-hover:right-[12px] md:group-hover:right-[16px] group-focus-visible:right-[12px] md:group-focus-visible:right-[16px] text-[var(--muted)]/60 group-hover:text-[var(--terracotta)] group-focus-visible:text-[var(--terracotta)] transition-all duration-300 ease-out flex items-center justify-center pointer-events-none">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </>
            );

            const rowClasses = cn(
              'group relative w-full block outline-none',
              'transition-all duration-300 ease-out',
              '-mx-4 px-4 sm:-mx-6 sm:px-6 md:mx-0 md:px-8 py-7 md:py-9',
              'hover:bg-[var(--ivory-100)]/80 focus-visible:bg-[var(--ivory-100)]/80',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--terracotta)]',
              'border-b border-[var(--ivory-200)] cursor-pointer'
            );

            return (
              <motion.div
                key={rec.id}
                initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-5%' }}
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : { delay: index * 0.06, duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }
                }
              >
                {rec.externalUrl ? (
                  <a
                    href={rec.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={rowClasses}
                    aria-label={`${titleText} — ${rec.awardingBody} (${rec.year})`}
                  >
                    {content}
                  </a>
                ) : (
                  <div
                    tabIndex={0}
                    role="article"
                    className={rowClasses}
                    aria-label={`${titleText} — ${rec.awardingBody} (${rec.year})`}
                  >
                    {content}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </PageReveal>
  );
}

