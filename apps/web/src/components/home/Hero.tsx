'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { useUI } from '@/components/shared/UIContext';
import { NormalizedMedia } from '@/lib/media';

export default function Hero({
  locale,
  media,
  heroData,
}: {
  locale: Locale;
  media?: NormalizedMedia;
  heroData?: {
    headline?: string;
    kicker?: string;
    support?: string;
    location?: string;
    ctaPrimary?: string;
    ctaSecondary?: string;
    image?: NormalizedMedia;
  };
}) {
  const { t } = getDictionary(locale);
  const prefersReduced = useReducedMotionSafe();
  const { openReservation } = useUI();

  const headline = heroData?.headline || t('home.hero.headline');
  const kicker = heroData?.kicker || t('home.hero.kicker');
  const support = heroData?.support || t('home.hero.support');
  const locationText = heroData?.location || t('home.hero.location');
  const ctaPrimary = heroData?.ctaPrimary || t('home.hero.cta.primary');
  const ctaSecondary = heroData?.ctaSecondary || t('home.hero.cta.secondary');

  const titleWords = headline.split(' ');
  const heroSrc = heroData?.image?.src || media?.src || '';
  const heroAlt = heroData?.image?.alt || media?.alt || '';

  React.useEffect(() => {
    if (!heroSrc && process.env.NODE_ENV !== 'production') {
      console.error('[Hero Error] Missing CMS hero image from Payload Homepage Global.');
    }
  }, [heroSrc]);

  return (
    <section className="relative h-screen min-h-[600px] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image with LCP priority */}
      <div className="absolute inset-0 z-0 bg-[var(--espresso-900)]">
        {heroSrc ? (
          <motion.div
            className="w-full h-full relative"
            initial={prefersReduced ? {} : { scale: 1.04 }}
            animate={prefersReduced ? {} : { scale: 1 }}
            transition={{ duration: 2.5, ease: 'easeOut' }}
          >
            <Image
              src={heroSrc}
              alt={heroAlt}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center brightness-[0.6] sepia-[0.1]"
            />
          </motion.div>
        ) : (
          <div className="w-full h-full bg-[var(--espresso-900)] opacity-80" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-[var(--white)] px-4 mt-16 max-w-4xl mx-auto flex flex-col items-center">
        <motion.p
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-condensed tracking-[0.2em] uppercase text-xs md:text-sm mb-6 text-[var(--ivory-100)]"
        >
          {kicker}
        </motion.p>

        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl mb-6 overflow-hidden flex flex-wrap justify-center gap-x-4 gap-y-2">
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={prefersReduced ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.6 + i * 0.1 }}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-lg md:text-xl font-light mb-2"
        >
          {support}
        </motion.p>
        
        <motion.p
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="font-condensed tracking-widest uppercase text-xs text-[var(--ivory-200)] mb-12"
        >
          {locationText}
        </motion.p>

        <motion.div
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="flex flex-col sm:flex-row gap-6 items-center"
        >
          <button 
            onClick={openReservation}
            className="px-8 py-3 bg-[var(--white)] text-[var(--ink)] font-condensed tracking-widest uppercase text-sm hover:bg-[var(--ivory-100)] transition-colors inline-block text-center cursor-pointer"
          >
            {ctaPrimary}
          </button>
          <Link 
            href={`/${locale}/menu`}
            className="px-8 py-3 border border-[var(--white)] text-[var(--white)] font-condensed tracking-widest uppercase text-sm hover:bg-white hover:text-[var(--ink)] transition-colors"
          >
            {ctaSecondary}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
