import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageProvider';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import ResponsiveImage from '../../components/media/ResponsiveImage';

export default function SpacePreview() {
  const { t } = useLanguage();
  const prefersReduced = useReducedMotionSafe();

  return (
    <section className="py-24 md:py-32 bg-[var(--white)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
          
          <div className="md:col-span-5 md:col-start-1 flex flex-col items-start justify-center order-2 md:order-1">
            <motion.h2 
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              className="font-serif text-3xl md:text-5xl text-[var(--espresso-900)] mb-6"
            >
              {t('home.space.title')}
            </motion.h2>
            <motion.p 
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: 0.1 }}
              className="text-[var(--muted)] mb-8"
            >
              {t('home.space.text')}
            </motion.p>
            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: 0.2 }}
            >
              <Link 
                to="/experience" 
                className="px-8 py-3 border border-[var(--ink)] text-[var(--ink)] font-condensed tracking-widest uppercase text-sm hover:bg-[var(--ink)] hover:text-[var(--white)] transition-colors inline-block"
              >
                {t('home.space.cta')}
              </Link>
            </motion.div>
          </div>

          <div className="md:col-span-7 md:col-start-6 order-1 md:order-2 grid grid-cols-2 gap-4">
            <div className="mt-12 md:mt-24">
              <ResponsiveImage 
                src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80" 
                alt="Indoor dining"
                aspectRatio="portrait"
                maskReveal
              />
            </div>
            <div>
              <ResponsiveImage 
                src="https://images.unsplash.com/photo-1525640788966-69bdb028aa73?auto=format&fit=crop&q=80" 
                alt="Outdoor greenery"
                aspectRatio="portrait"
                maskReveal
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
