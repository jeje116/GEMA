import React from 'react';
import { motion } from 'motion/react';
import PageReveal from '../components/motion/PageReveal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useLanguage } from '../i18n/LanguageProvider';
import { useReducedMotionSafe } from '../hooks/useReducedMotionSafe';
import { siteData } from '../data/site';
import { useUI } from '../components/shared/UIContext';

export default function VisitPage() {
  const { t, l } = useLanguage();
  const prefersReduced = useReducedMotionSafe();
  const { openReservation } = useUI();

  useDocumentMeta({
    title: t('nav.visit'),
    canonicalPath: '/visit'
  });

  return (
    <PageReveal title={t('nav.visit')} className="bg-[var(--ivory-50)] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mb-16">
          <h1 className="font-serif text-5xl md:text-7xl text-[var(--espresso-900)] mb-6">
            {t('nav.visit')}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-24">
          
          {/* Map area */}
          <div className="lg:col-span-7">
            <div className="w-full aspect-square md:aspect-video bg-[var(--ivory-200)] relative p-4 flex flex-col">
               {/* Decorative Map BG */}
               <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid-large" width="80" height="80" patternUnits="userSpaceOnUse">
                      <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-large)" />
                </svg>
              </div>

              <div className="flex-1 bg-white flex items-center justify-center border border-[var(--ivory-200)] relative z-10 p-8 text-center flex-col">
                <div className="w-16 h-16 rounded-full bg-[var(--ink)]/5 flex items-center justify-center mb-6">
                  <div className="w-3 h-3 rounded-full bg-[var(--terracotta)]" />
                </div>
                <h2 className="font-serif text-2xl text-[var(--espresso-900)] mb-2">GEMA</h2>
                <p className="text-[var(--muted)] max-w-sm mx-auto mb-6">
                  {siteData.fullAddress}
                </p>
                <a 
                  href={siteData.mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-[var(--ink)] text-white font-condensed tracking-widest uppercase text-xs hover:bg-[var(--espresso-800)] transition-colors inline-block"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-5 flex flex-col gap-12">
            
            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-condensed tracking-widest text-xs uppercase text-[var(--muted)] mb-4">Hours of Operation</h2>
              <div className="flex flex-col gap-2 text-[var(--espresso-900)]">
                {siteData.openingHours.map((hours, idx) => (
                  <p key={idx} className={idx === siteData.openingHours.length - 1 ? 'text-xs text-[var(--muted)] mt-2' : ''}>
                    {l(hours)}
                  </p>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="font-condensed tracking-widest text-xs uppercase text-[var(--muted)] mb-4">Contact</h2>
              <div className="flex flex-col gap-2 text-[var(--espresso-900)]">
                <p><a href={`tel:${siteData.phone.replace(/[^0-9]/g, '')}`} className="hover:text-[var(--terracotta)] transition-colors">{siteData.phone}</a></p>
                <p><a href={`mailto:${siteData.email}`} className="hover:text-[var(--terracotta)] transition-colors">{siteData.email}</a></p>
              </div>
            </motion.div>

            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-condensed tracking-widest text-xs uppercase text-[var(--muted)] mb-4">Reservations</h2>
              <p className="text-[var(--muted)] text-sm mb-4">
                We strongly recommend booking in advance. For parties of 6 or more, please contact us directly.
              </p>
              <button 
                onClick={openReservation}
                className="border-b border-[var(--ink)] font-condensed tracking-widest uppercase text-xs hover:text-[var(--terracotta)] hover:border-[var(--terracotta)] transition-colors pb-1"
              >
                Reserve a Table
              </button>
            </motion.div>

          </div>

        </div>

        {/* Policies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 border-t border-[var(--ivory-200)]">
          <motion.div
             initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
          >
            <h3 className="font-serif text-xl text-[var(--espresso-900)] mb-3">Dietary</h3>
            <p className="text-[var(--muted)] text-sm leading-relaxed">
              Our kitchen adheres to a strict <strong>No Pork, No Lard</strong> policy. We can accommodate most allergies with 24 hours advance notice.
            </p>
          </motion.div>

          <motion.div
             initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
          >
            <h3 className="font-serif text-xl text-[var(--espresso-900)] mb-3">Dress Code</h3>
            <p className="text-[var(--muted)] text-sm leading-relaxed">
              Smart casual. We request that gentlemen avoid sleeveless shirts and open-toed shoes in the evening.
            </p>
          </motion.div>

          <motion.div
             initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
          >
            <h3 className="font-serif text-xl text-[var(--espresso-900)] mb-3">Parking</h3>
            <p className="text-[var(--muted)] text-sm leading-relaxed">
              Valet parking is available at the main entrance. Limited street parking is also available in the surrounding area.
            </p>
          </motion.div>
        </div>

      </div>
    </PageReveal>
  );
}
