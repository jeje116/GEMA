'use client';

import React from 'react';
import { motion } from 'motion/react';
import PageReveal from '@/components/motion/PageReveal';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { RecognitionItem } from '@/content/types';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

interface RecognitionClientProps {
  locale: Locale;
  recognitions: RecognitionItem[];
}

export default function RecognitionClient({ locale, recognitions }: RecognitionClientProps) {
  const { t, l } = getDictionary(locale);
  const prefersReduced = useReducedMotionSafe();

  return (
    <PageReveal title={t('nav.recognition')} className="bg-[var(--ivory-50)] min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-24">
          <h1 className="font-serif text-5xl md:text-7xl text-[var(--espresso-900)] mb-6">
            {t('nav.recognition')}
          </h1>
          <p className="text-[var(--muted)] text-lg">
            An archive of critical reception, awards, and notable press.
          </p>
        </div>

        <div className="flex flex-col">
          <motion.div 
            initial={prefersReduced ? { scaleX: 1 } : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="h-px bg-[var(--ivory-200)] origin-left"
          />

          {recognitions.map((rec, index) => (
            <motion.div 
              key={rec.id}
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: (index % 5) * 0.1, duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row md:items-baseline py-8 gap-4 md:gap-12 hover:bg-[var(--ivory-100)] transition-colors -mx-4 px-4 sm:mx-0 sm:px-0">
                <div className="font-condensed tracking-widest text-sm text-[var(--muted)] w-24 flex-shrink-0">
                  {rec.year}
                </div>
                <div className="flex-grow">
                  <h3 className="font-serif text-2xl md:text-3xl text-[var(--espresso-900)] mb-2">
                    {l(rec.title)}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <span className="font-condensed uppercase tracking-wide text-xs text-[var(--terracotta)]">
                      {rec.awardingBody}
                    </span>
                    {rec.externalUrl && (
                      <>
                        <span className="text-[var(--ivory-200)]">|</span>
                        <a 
                          href={rec.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-condensed uppercase tracking-wide text-xs text-[var(--muted)] hover:text-[var(--espresso-900)] border-b border-[var(--muted)] hover:border-[var(--espresso-900)] transition-colors pb-0.5"
                        >
                          Read Article
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <motion.div 
                initial={prefersReduced ? { scaleX: 1 } : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="h-px bg-[var(--ivory-200)] origin-left"
              />
            </motion.div>
          ))}
        </div>

      </div>
    </PageReveal>
  );
}
