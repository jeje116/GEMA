'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import PageReveal from '@/components/motion/PageReveal';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import ResponsiveImage from '@/components/media/ResponsiveImage';
import { cn } from '@/lib/utils';
import { Locale } from '@/i18n/config';

export interface EditorialListingItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  categoryKey?: string;
  date: string;
  excerpt: string;
  coverImage: string;
}

export interface EditorialCategoryOption {
  key: string;
  label: string;
}

interface EditorialListingPageProps {
  locale: Locale;
  title: string;
  subtitle: string;
  items: EditorialListingItem[];
  categories?: EditorialCategoryOption[];
  routeBase: string; // e.g. `/${locale}/journal` or `/${locale}/recognition`
  readStoryLabel: string; // e.g. "Read Story" or "View Detail"
}

export default function EditorialListingPage({
  locale,
  title,
  subtitle,
  items,
  categories = [],
  routeBase,
  readStoryLabel,
}: EditorialListingPageProps) {
  const prefersReduced = useReducedMotionSafe();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const filteredItems = useMemo(() => {
    return items
      .filter(item => {
        if (activeCategory === 'All') return true;
        const itemCat = item.categoryKey || item.category;
        return itemCat === activeCategory;
      });
  }, [items, activeCategory]);

  return (
    <PageReveal title={title} className="bg-[var(--ivory-50)] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Page Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h1 className="font-serif text-5xl md:text-7xl text-[var(--espresso-900)] mb-6">
              {title}
            </h1>
            <p className="text-[var(--muted)] text-lg">
              {subtitle}
            </p>
          </div>
          
          {categories.length > 1 && (
            <nav aria-label="Category filter" className="flex flex-wrap gap-4 font-condensed tracking-widest text-xs uppercase">
              {categories.map(cat => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  className={cn(
                    "pb-1 border-b transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus cursor-pointer",
                    activeCategory === cat.key 
                      ? "text-[var(--ink)] border-[var(--ink)]" 
                      : "text-[var(--muted)] border-transparent hover:text-[var(--espresso-900)] hover:border-[var(--ivory-200)]"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </nav>
          )}
        </header>

        {/* Editorial Grid / Empty State */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-[var(--muted)] font-serif text-xl italic">
              {locale === 'id' ? 'Belum ada arsip yang dipublikasikan.' : 'No published entries at this time.'}
            </p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.article
                  key={item.id}
                  layout
                  initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4 }}
                  className="group flex flex-col"
                >
                  <Link href={`${routeBase}/${item.slug}`} className="block overflow-hidden relative aspect-[4/5] mb-6">
                    <ResponsiveImage 
                      src={item.coverImage} 
                      alt={item.title}
                      className="w-full h-full transform group-hover:scale-[1.025] transition-transform duration-700"
                    />
                  </Link>
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-center mb-3">
                      <p className="font-condensed tracking-widest text-xs uppercase text-[var(--terracotta)]">
                        {item.category}
                      </p>
                      <p className="font-condensed tracking-wide text-xs text-[var(--muted)]">
                        {item.date}
                      </p>
                    </div>
                    <h2 className="font-serif text-2xl text-[var(--espresso-900)] mb-3 group-hover:text-[var(--terracotta-dark)] transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-[var(--muted)] text-sm line-clamp-3 mb-4">
                      {item.excerpt}
                    </p>
                    <Link 
                      href={`${routeBase}/${item.slug}`}
                      className="mt-auto self-start border-b border-[var(--ink)] font-condensed tracking-widest uppercase text-[10px] hover:text-[var(--terracotta)] hover:border-[var(--terracotta)] transition-colors pb-0.5"
                    >
                      {readStoryLabel}
                    </Link>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </PageReveal>
  );
}
