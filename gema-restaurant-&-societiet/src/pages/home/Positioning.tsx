import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../i18n/LanguageProvider';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';

export default function Positioning() {
  const { t } = useLanguage();
  const prefersReduced = useReducedMotionSafe();

  return (
    <section className="py-24 md:py-32 px-4 bg-[var(--ivory-50)] text-center">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <motion.h2 
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-serif text-3xl md:text-5xl leading-tight mb-8"
        >
          {t('home.positioning.text')}
        </motion.h2>
        
        <motion.div
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-block border border-[var(--ivory-200)] px-6 py-2 rounded-full text-xs uppercase tracking-widest font-condensed text-[var(--muted)]"
        >
          {t('home.positioning.dietary')}
        </motion.div>
      </div>
    </section>
  );
}
