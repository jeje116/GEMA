'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/i18n/config';
import { getDictionary, l } from '@/i18n/getDictionary';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { menuItems } from '@/content/fixtures/menu';
import { homeAssets } from '@/content/media/homeAssets';

export default function SignatureDishes({ locale }: { locale: Locale }) {
  const { t } = getDictionary(locale);
  const prefersReduced = useReducedMotionSafe();
  const signatures = menuItems.filter((item) => item.signature).slice(0, 4);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Authentic asset map for verified signature dishes; unverified slots remain on fallback
  const authenticSignatureImages: Record<string, string> = {
    'woodfire-carne-1': homeAssets.signatures.steak.src, // Toploin Kiwami Eye Fillet MB9+
    'dolci-1': homeAssets.signatures.tiramisu.src, // Classic Tiramisu
  };

  const demoImages = [
    'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571877227200-a08c852cee34?auto=format&fit=crop&q=80',
  ];

  const getDishImage = (dish: (typeof signatures)[number], index: number) => {
    return dish.image || authenticSignatureImages[dish.id] || demoImages[index];
  };

  const next = () => setCurrentIndex((prev) => (prev + 1) % signatures.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + signatures.length) % signatures.length);

  if (signatures.length === 0) return null;

  return (
    <section className="py-24 md:py-32 bg-[var(--ivory-100)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex justify-between items-end">
          <h2 className="font-serif text-3xl md:text-5xl text-[var(--espresso-900)]">
            {t('home.signature.title')}
          </h2>
          <div className="flex gap-4">
            <button
              onClick={prev}
              className="p-2 hover:opacity-70 transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-focus cursor-pointer"
              aria-label="Previous dish"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </button>
            <button
              onClick={next}
              className="p-2 hover:opacity-70 transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-focus cursor-pointer"
              aria-label="Next dish"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Image Reveal */}
          <div className="relative aspect-square md:aspect-[4/3] w-full overflow-hidden bg-[var(--ivory-200)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={prefersReduced ? { opacity: 0 } : { y: '100%' }}
                animate={prefersReduced ? { opacity: 1 } : { y: '0%' }}
                exit={prefersReduced ? { opacity: 0 } : { y: '-100%' }}
                transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={getDishImage(signatures[currentIndex], currentIndex)} 
                  alt={signatures[currentIndex].name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Text Crossfade */}
          <div className="relative h-[250px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="absolute w-full"
              >
                <p className="font-condensed tracking-widest text-xs uppercase text-[var(--muted)] mb-4">
                  0{currentIndex + 1} / 0{signatures.length}
                </p>
                <h3 className="font-serif text-3xl md:text-4xl text-[var(--espresso-900)] mb-4">
                  {signatures[currentIndex].name}
                </h3>
                <p className="text-[var(--muted)] mb-8 max-w-md">
                  {l(signatures[currentIndex].description, locale)}
                </p>
                <Link 
                  href={`/${locale}/menu`} 
                  className="inline-block border-b border-[var(--ink)] pb-1 font-condensed tracking-widest text-xs uppercase hover:text-[var(--terracotta)] hover:border-[var(--terracotta)] transition-colors"
                >
                  {locale === 'id' ? 'Lihat Semua Menu' : 'View Full Menu'}
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
