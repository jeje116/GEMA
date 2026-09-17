'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/i18n/config';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'fresh-pasta', key: 'Fresh Pasta', img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80' },
  { id: 'pizza', key: 'Pizza', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80' },
  { id: 'carne-grill', key: 'Carne / Grill', img: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80' },
  { id: 'dessert', key: 'Dessert', img: 'https://images.unsplash.com/photo-1571877227200-a08c852cee34?auto=format&fit=crop&q=80' }
];

export default function CuisineCategories({ locale }: { locale: Locale }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReduced = useReducedMotionSafe();

  const getCatName = (id: string) => {
    if (locale === 'id') {
      const map: Record<string, string> = {
        'fresh-pasta': 'Pasta Segar',
        'pizza': 'Pizza',
        'carne-grill': 'Daging / Panggangan',
        'dessert': 'Pencuci Mulut'
      };
      return map[id] || id;
    }
    return categories.find(c => c.id === id)?.key || id;
  };

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
            <Image 
              src={categories[activeIndex].img} 
              alt={categories[activeIndex].key}
              fill
              sizes="100vw"
              className="object-cover"
            />
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
                  0{index + 1}
                </span>
                <h3 className={cn(
                  'font-serif text-4xl md:text-6xl transition-transform duration-300 ease-out',
                  activeIndex === index ? 'translate-x-4 md:translate-x-8' : 'translate-x-0'
                )}>
                  {getCatName(cat.id)}
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
