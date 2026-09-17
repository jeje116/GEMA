import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../i18n/LanguageProvider';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import { reviews } from '../../data/reviews';
import { cn } from '../../lib/utils';

export default function ReviewsPreview() {
  const { t, l } = useLanguage();
  const prefersReduced = useReducedMotionSafe();
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % reviews.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);

  return (
    <section className="py-24 md:py-32 bg-[var(--ivory-100)] text-center relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <p className="font-condensed tracking-widest text-xs uppercase text-[var(--muted)] mb-12">
          {t('home.reviews.title')} <span className="opacity-50">({t('home.reviews.note')})</span>
        </p>

        <div className="relative h-[250px] md:h-[200px] flex flex-col justify-center items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="absolute w-full px-4"
            >
              <h3 className="font-serif text-2xl md:text-4xl text-[var(--espresso-900)] leading-relaxed md:leading-normal">
                "{l(reviews[currentIndex].text)}"
              </h3>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-6 mt-8">
          <button 
            onClick={prev} 
            className="w-10 h-10 rounded-full border border-[var(--ivory-200)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--espresso-900)] hover:border-[var(--espresso-900)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            aria-label="Previous review"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          
          <div className="flex gap-2 items-center">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to review ${idx + 1}`}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus p-2 rounded-full"
              >
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full transition-colors",
                  currentIndex === idx ? "bg-[var(--espresso-900)]" : "bg-[var(--ivory-200)]"
                )} />
              </button>
            ))}
          </div>

          <button 
            onClick={next} 
            className="w-10 h-10 rounded-full border border-[var(--ivory-200)] flex items-center justify-center text-[var(--muted)] hover:text-[var(--espresso-900)] hover:border-[var(--espresso-900)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
            aria-label="Next review"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
}
