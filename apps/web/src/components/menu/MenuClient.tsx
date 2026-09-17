'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import PageReveal from '@/components/motion/PageReveal';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { cn } from '@/lib/utils';
import ResponsiveImage from '@/components/media/ResponsiveImage';
import { MenuCategory, MenuItem } from '@/content/types';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

interface MenuClientProps {
  locale: Locale;
  categories: MenuCategory[];
  items: MenuItem[];
}

export default function MenuClient({ locale, categories, items }: MenuClientProps) {
  const { t, l } = getDictionary(locale);
  const prefersReduced = useReducedMotionSafe();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef });
  const yImage = useTransform(scrollYProgress, [0, 1], [0, 150]);

  const scrollToCategory = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 160; // Approximate height of header + sticky nav
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: prefersReduced ? 'auto' : 'smooth'
      });
    }
  };

  return (
    <PageReveal title={t('menu.title')} className="bg-[var(--ivory-50)] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <h1 className="font-serif text-5xl md:text-7xl text-[var(--espresso-900)] mb-4">
              {t('menu.title')}
            </h1>
            <p className="text-[var(--muted)] max-w-md">
              {t('menu.philosophy')}
            </p>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-condensed tracking-widest uppercase text-[var(--muted)]">
            <span className="flex items-center gap-2">
              <span className="block w-2 h-2 rounded-full bg-[var(--terracotta)]" />
              {t('menu.signature')}
            </span>
          </div>
        </div>

      </div>

      {/* Hero Image */}
      <div className="w-full h-[300px] md:h-[500px] overflow-hidden relative mb-16" ref={containerRef}>
        <motion.div style={{ y: prefersReduced ? 0 : yImage }} className="w-full h-[130%] -top-[15%] relative">
          <ResponsiveImage 
            src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80" 
            alt="GEMA Pasta"
            priority
          />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12 lg:gap-24 relative">
        
        {/* Sticky Jump Links */}
        <div className="lg:w-48 flex-shrink-0">
          <nav aria-label="Menu categories" className="sticky top-28 hidden lg:flex flex-col gap-4 border-l border-[var(--ivory-200)] pl-6">
            <p className="font-condensed uppercase tracking-widest text-xs text-[var(--muted)] mb-2">Sections</p>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className="text-left font-serif text-lg text-[var(--espresso-900)] hover:text-[var(--terracotta)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus cursor-pointer"
              >
                {l(cat.name)}
              </button>
            ))}
          </nav>
          
          {/* Mobile Jump Links */}
          <nav aria-label="Menu categories mobile" className="lg:hidden flex overflow-x-auto pb-4 gap-6 scrollbar-hide sticky top-20 bg-[var(--ivory-50)]/90 backdrop-blur-sm z-30 pt-4 -mx-4 px-4 border-b border-[var(--ivory-200)]">
             {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className="whitespace-nowrap font-condensed tracking-widest text-xs uppercase text-[var(--espresso-900)] hover:text-[var(--terracotta)] transition-colors cursor-pointer"
              >
                {l(cat.name)}
              </button>
            ))}
          </nav>
        </div>

        {/* Menu Content */}
        <div className="flex-1">
          {categories.map((cat, index) => (
            <motion.div 
              key={cat.id} 
              id={cat.id}
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              className={cn("mb-24 scroll-mt-36", index === categories.length - 1 ? 'mb-0' : '')}
            >
              
              <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[var(--ink)] pb-4 mb-8 gap-4">
                <h2 className="font-serif text-3xl md:text-5xl text-[var(--espresso-900)]">
                  {l(cat.name)}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {items.filter(item => item.categoryId === cat.id).map((item) => (
                  <div key={item.id} className="group relative">
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="font-serif text-xl text-[var(--espresso-900)] group-hover:text-[var(--terracotta-dark)] transition-colors flex items-center gap-2 pr-4">
                        {item.name}
                        {item.signature && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--terracotta)] flex-shrink-0" title="Signature Dish" />
                        )}
                      </h3>
                      <div className="font-condensed text-sm tracking-widest">
                        {item.priceLabel}
                      </div>
                    </div>
                    
                    {item.description && (
                      <p className="text-[var(--muted)] text-sm mb-3">
                        {l(item.description)}
                      </p>
                    )}
                    
                    {item.dietaryNotes && item.dietaryNotes.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.dietaryNotes.map(tag => (
                          <span key={tag} className="text-[10px] font-condensed uppercase tracking-widest bg-[var(--ivory-200)] px-2 py-0.5 text-[var(--muted)]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </PageReveal>
  );
}
