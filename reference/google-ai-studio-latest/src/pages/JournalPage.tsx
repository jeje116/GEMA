import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import PageReveal from '../components/motion/PageReveal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useLanguage, formatDate } from '../i18n/LanguageProvider';
import { useReducedMotionSafe } from '../hooks/useReducedMotionSafe';
import { journalEntries } from '../data/journal';
import ResponsiveImage from '../components/media/ResponsiveImage';
import { cn } from '../lib/utils';

export default function JournalPage() {
  const { t, l, language } = useLanguage();
  const prefersReduced = useReducedMotionSafe();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useDocumentMeta({
    title: t('nav.journal'),
    canonicalPath: '/journal'
  });

  const categories = useMemo(() => {
    const cats = new Set(journalEntries.map(e => e.category.en));
    return ['All', ...Array.from(cats)];
  }, []);

  const filteredEntries = useMemo(() => {
    return journalEntries
      .filter(e => activeCategory === 'All' || e.category.en === activeCategory)
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
  }, [activeCategory]);

  return (
    <PageReveal title={t('nav.journal')} className="bg-[var(--ivory-50)] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h1 className="font-serif text-5xl md:text-7xl text-[var(--espresso-900)] mb-6">
              {t('nav.journal')}
            </h1>
            <p className="text-[var(--muted)] text-lg">
              Stories from the kitchen, the farm, and the dining room.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 font-condensed tracking-widest text-xs uppercase">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "pb-1 border-b transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                  activeCategory === cat 
                    ? "text-[var(--ink)] border-[var(--ink)]" 
                    : "text-[var(--muted)] border-transparent hover:text-[var(--espresso-900)] hover:border-[var(--ivory-200)]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          <AnimatePresence mode="popLayout">
            {filteredEntries.map((entry) => (
              <motion.div
                key={entry.id}
                layout
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group flex flex-col"
              >
                <Link to={`/journal/${entry.slug}`} className="block overflow-hidden relative aspect-[4/5] mb-6">
                  <ResponsiveImage 
                    src={entry.coverImage} 
                    alt={l(entry.title)}
                    className="w-full h-full transform group-hover:scale-[1.025] transition-transform duration-700"
                  />
                </Link>
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-3">
                    <p className="font-condensed tracking-widest text-xs uppercase text-[var(--terracotta)]">
                      {l(entry.category)}
                    </p>
                    <p className="font-condensed tracking-wide text-xs text-[var(--muted)]">
                      {formatDate(entry.publishDate, language)}
                    </p>
                  </div>
                  <h2 className="font-serif text-2xl text-[var(--espresso-900)] mb-3 group-hover:text-[var(--terracotta-dark)] transition-colors">
                    {l(entry.title)}
                  </h2>
                  <p className="text-[var(--muted)] text-sm line-clamp-3 mb-4">
                    {l(entry.excerpt)}
                  </p>
                  <Link 
                    to={`/journal/${entry.slug}`}
                    className="mt-auto self-start border-b border-[var(--ink)] font-condensed tracking-widest uppercase text-[10px] hover:text-[var(--terracotta)] hover:border-[var(--terracotta)] transition-colors pb-0.5"
                  >
                    Read Story
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </PageReveal>
  );
}
