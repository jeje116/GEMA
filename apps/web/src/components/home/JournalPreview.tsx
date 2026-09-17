'use client';

import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/i18n/config';
import { getDictionary, l } from '@/i18n/getDictionary';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { journalEntries } from '@/content/fixtures/journal';

export default function JournalPreview({ locale }: { locale: Locale }) {
  const { t } = getDictionary(locale);
  const prefersReduced = useReducedMotionSafe();

  const previewEntries = journalEntries.slice(0, 3);

  return (
    <section className="py-24 md:py-32 bg-[var(--white)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-16">
          <h2 className="font-serif text-3xl md:text-5xl text-[var(--espresso-900)]">
            {t('home.journal.title')}
          </h2>
          <Link 
            href={`/${locale}/journal`}
            className="font-condensed tracking-widest text-xs uppercase hover:text-[var(--terracotta)] transition-colors border-b border-transparent hover:border-[var(--terracotta)] pb-1 hidden md:block"
          >
            {locale === 'id' ? 'Lihat Jurnal' : 'View Journal'}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {previewEntries.map((entry, idx) => (
            <motion.div
              key={entry.id}
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="group"
            >
              <Link href={`/${locale}/journal/${entry.slug}`} className="block overflow-hidden relative aspect-[4/5] mb-6">
                <Image 
                  src={entry.coverImage} 
                  alt={l(entry.title, locale)}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transform group-hover:scale-[1.025] transition-transform duration-700"
                />
              </Link>
              <div>
                <p className="font-condensed tracking-widest text-xs uppercase text-[var(--muted)] mb-3">
                  {l(entry.category, locale)}
                </p>
                <h3 className="font-serif text-xl text-[var(--espresso-900)] mb-3 group-hover:text-[var(--terracotta-dark)] transition-colors">
                  {l(entry.title, locale)}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
          <Link 
            href={`/${locale}/journal`}
            className="font-condensed tracking-widest text-xs uppercase hover:text-[var(--terracotta)] transition-colors border-b border-transparent hover:border-[var(--terracotta)] pb-1"
          >
            {locale === 'id' ? 'Lihat Jurnal' : 'View Journal'}
          </Link>
        </div>
      </div>
    </section>
  );
}
