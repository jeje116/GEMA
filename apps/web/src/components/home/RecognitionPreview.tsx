'use client';

import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Locale } from '@/i18n/config';
import { getDictionary, l } from '@/i18n/getDictionary';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { recognitions } from '@/content/fixtures/recognition';

export default function RecognitionPreview({ locale }: { locale: Locale }) {
  const { t } = getDictionary(locale);
  const prefersReduced = useReducedMotionSafe();

  const demoRecs = recognitions.slice(0, 3);

  return (
    <section className="py-24 md:py-32 bg-[var(--ivory-50)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-16">
          <h2 className="font-serif text-3xl md:text-5xl text-[var(--espresso-900)]">
            {t('home.recognition.title')}
          </h2>
          <Link 
            href={`/${locale}/recognition`}
            className="font-condensed tracking-widest text-xs uppercase hover:text-[var(--terracotta)] transition-colors border-b border-transparent hover:border-[var(--terracotta)] pb-1"
          >
            {t('home.recognition.cta')}
          </Link>
        </div>

        <div className="flex flex-col">
          <motion.div 
            initial={prefersReduced ? { scaleX: 1 } : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="h-px bg-[var(--ivory-200)] origin-left"
          />

          {demoRecs.map((rec, index) => (
            <motion.div 
              key={rec.id}
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link 
                href={`/${locale}/recognition`}
                className="group flex flex-col md:flex-row md:items-center py-6 md:py-8 gap-4 md:gap-12 hover:bg-[var(--ivory-100)] transition-colors -mx-4 px-4 sm:mx-0 sm:px-0"
              >
                <div className="font-condensed tracking-widest text-sm text-[var(--muted)] w-24 flex-shrink-0">
                  {rec.year}
                </div>
                <div className="flex-grow">
                  <h3 className="font-serif text-xl md:text-2xl text-[var(--espresso-900)] group-hover:text-[var(--terracotta-dark)] transition-colors">
                    {l(rec.title, locale)}
                  </h3>
                  <p className="text-sm text-[var(--muted)] mt-1 font-condensed uppercase tracking-wide">
                    {rec.awardingBody}
                  </p>
                </div>
                <div className="hidden md:flex flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--muted)]">
                  →
                </div>
              </Link>
              
              <motion.div 
                initial={prefersReduced ? { scaleX: 1 } : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.8, ease: 'easeInOut' }}
                className="h-px bg-[var(--ivory-200)] origin-left"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
