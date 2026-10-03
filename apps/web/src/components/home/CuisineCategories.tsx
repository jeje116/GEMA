'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/i18n/config';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { cn } from '@/lib/utils';
import { HomepageCuisineTeaser } from '@/content/provider';

interface CuisineCategoriesProps {
  locale: Locale;
  cuisineData?: HomepageCuisineTeaser;
}

export default function CuisineCategories({ locale, cuisineData }: CuisineCategoriesProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReduced = useReducedMotionSafe();

  const categories = [
    {
      id: 'item01',
      num: '01',
      label: cuisineData?.item01?.label || '',
      img: cuisineData?.item01?.image?.src || '',
      alt: cuisineData?.item01?.image?.alt || '',
      objectPosition: 'object-center',
    },
    {
      id: 'item02',
      num: '02',
      label: cuisineData?.item02?.label || '',
      img: cuisineData?.item02?.image?.src || '',
      alt: cuisineData?.item02?.image?.alt || '',
      objectPosition: 'object-center',
    },
    {
      id: 'item03',
      num: '03',
      label: cuisineData?.item03?.label || '',
      img: cuisineData?.item03?.image?.src || '',
      alt: cuisineData?.item03?.image?.alt || '',
      objectPosition: 'object-[center_35%]',
    },
    {
      id: 'item04',
      num: '04',
      label: cuisineData?.item04?.label || '',
      img: cuisineData?.item04?.image?.src || '',
      alt: cuisineData?.item04?.image?.alt || '',
      objectPosition: 'object-center',
    },
  ];

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden bg-[var(--espresso-900)] text-white">
      {/* Background Previews */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.45, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            {categories[activeIndex]?.img ? (
              <Image 
                src={categories[activeIndex].img} 
                alt={categories[activeIndex].alt}
                fill
                sizes="100vw"
                className={cn('object-cover', categories[activeIndex].objectPosition)}
              />
            ) : (
              <div className="w-full h-full bg-[var(--espresso-900)] opacity-60" />
            )}
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
        <div className="flex flex-col gap-8 md:gap-12">
          {categories.map((cat, index) => (
            <button
              key={cat.id}
              className="group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm inline-block w-fit cursor-pointer"
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
            >
              <motion.div 
                className="flex items-center gap-6 md:gap-8"
                animate={{ opacity: activeIndex === index ? 1 : 0.4 }}
                transition={{ duration: 0.3 }}
              >
                <span className="font-condensed text-xs md:text-sm tracking-widest uppercase hidden md:block">
                  {cat.num}
                </span>
                <h3 className={cn(
                  'font-serif text-4xl md:text-6xl transition-transform duration-300 ease-out',
                  activeIndex === index ? 'translate-x-4 md:translate-x-8' : 'translate-x-0'
                )}>
                  {cat.label}
                </h3>
              </motion.div>
            </button>
          ))}
        </div>
        
        <div className="mt-16">
          <Link 
            href={`/${locale}/menu`} 
            className="inline-flex items-center gap-2 font-condensed tracking-widest text-xs uppercase hover:text-[var(--terracotta)] transition-colors group"
          >
            {locale === 'id' ? 'Jelajahi Menu' : 'Explore the Menu'}
            <motion.span 
              className="inline-block"
              transition={{ duration: 0.2 }}
            >→</motion.span>
          </Link>
        </div>
      </div>
    </section>
  );
}
