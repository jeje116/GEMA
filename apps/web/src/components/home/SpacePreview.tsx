'use client';

import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { NormalizedMedia } from '@/lib/media';

interface SpacePreviewProps {
  locale: Locale;
  spaceMedia?: {
    imagePrimary?: NormalizedMedia;
    imageSecondary?: NormalizedMedia;
  };
  spaceData?: {
    title?: string;
    text?: string;
    ctaLabel?: string;
    imagePrimary?: NormalizedMedia;
    imageSecondary?: NormalizedMedia;
  };
}

export default function SpacePreview({ locale, spaceMedia, spaceData }: SpacePreviewProps) {
  const { t } = getDictionary(locale);
  const prefersReduced = useReducedMotionSafe();

  const title = spaceData?.title || t('home.space.title');
  const text = spaceData?.text || t('home.space.text');
  const ctaLabel = spaceData?.ctaLabel || t('home.space.cta');

  const indoorSrc = spaceData?.imagePrimary?.src || spaceMedia?.imagePrimary?.src || '';
  const indoorAlt = spaceData?.imagePrimary?.alt || spaceMedia?.imagePrimary?.alt || '';
  const patioSrc = spaceData?.imageSecondary?.src || spaceMedia?.imageSecondary?.src || '';
  const patioAlt = spaceData?.imageSecondary?.alt || spaceMedia?.imageSecondary?.alt || '';

  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      if (!indoorSrc) console.error('[SpacePreview Error] Missing CMS imagePrimary from Homepage Global.');
      if (!patioSrc) console.error('[SpacePreview Error] Missing CMS imageSecondary from Homepage Global.');
    }
  }, [indoorSrc, patioSrc]);

  return (
    <section className="py-24 md:py-32 bg-[var(--white)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
          <div className="md:col-span-5 md:col-start-1 flex flex-col items-start justify-center order-2 md:order-1">
            <motion.h2 
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              className="font-serif text-3xl md:text-5xl text-[var(--espresso-900)] mb-6"
            >
              {title}
            </motion.h2>
            <motion.p 
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ delay: 0.1 }}
              className="text-[var(--muted)] mb-8"
            >
              {text}
            </motion.p>
            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ delay: 0.2 }}
            >
              <Link 
                href={`/${locale}/experience`} 
                className="px-8 py-3 border border-[var(--ink)] text-[var(--ink)] font-condensed tracking-widest uppercase text-sm hover:bg-[var(--ink)] hover:text-[var(--white)] transition-colors inline-block"
              >
                {ctaLabel}
              </Link>
            </motion.div>
          </div>

          <div className="md:col-span-7 md:col-start-6 order-1 md:order-2 grid grid-cols-2 gap-4">
            <div className="mt-12 md:mt-24 relative aspect-[3/4] overflow-hidden bg-[var(--ivory-200)]">
              {!prefersReduced && (
                <motion.div
                  initial={{ y: '0%' }}
                  whileInView={{ y: '-100%' }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                  className="absolute inset-0 z-10 bg-[var(--ivory-100)] pointer-events-none"
                />
              )}
              <motion.div
                initial={prefersReduced ? {} : { scale: 1.06 }}
                whileInView={prefersReduced ? {} : { scale: 1 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="w-full h-full relative"
              >
                {indoorSrc ? (
                  <Image 
                    src={indoorSrc} 
                    alt={indoorAlt}
                    fill
                    sizes="(max-width: 768px) 50vw, 30vw"
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--ivory-200)] flex items-center justify-center opacity-30" aria-hidden="true">
                    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20zM20 0h20v20H20V0z" fill="currentColor" fillOpacity="0.05" fillRule="evenodd"/>
                    </svg>
                  </div>
                )}
              </motion.div>
            </div>
            <div className="relative aspect-[3/4] overflow-hidden bg-[var(--ivory-200)]">
              {!prefersReduced && (
                <motion.div
                  initial={{ y: '0%' }}
                  whileInView={{ y: '-100%' }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
                  className="absolute inset-0 z-10 bg-[var(--ivory-100)] pointer-events-none"
                />
              )}
              <motion.div
                initial={prefersReduced ? {} : { scale: 1.06 }}
                whileInView={prefersReduced ? {} : { scale: 1 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="w-full h-full relative"
              >
                {patioSrc ? (
                  <Image 
                    src={patioSrc} 
                    alt={patioAlt}
                    fill
                    sizes="(max-width: 768px) 50vw, 30vw"
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--ivory-200)] flex items-center justify-center opacity-30" aria-hidden="true">
                    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20zM20 0h20v20H20V0z" fill="currentColor" fillOpacity="0.05" fillRule="evenodd"/>
                    </svg>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
