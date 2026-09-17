'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Locale } from '@/i18n/config';
import { getDictionary, l } from '@/i18n/getDictionary';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { useUI } from '@/components/shared/UIContext';
import { siteData } from '@/content/fixtures/site';

export default function VisitPreview({ locale }: { locale: Locale }) {
  const { t } = getDictionary(locale);
  const prefersReduced = useReducedMotionSafe();
  const { openReservation } = useUI();

  return (
    <section className="py-24 md:py-32 bg-[var(--ivory-50)] border-t border-[var(--ivory-200)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.h2 
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              className="font-serif text-3xl md:text-5xl text-[var(--espresso-900)] mb-12"
            >
              {t('nav.visit')} GEMA
            </motion.h2>
            
            <div className="flex flex-col gap-8">
              <motion.div
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="font-condensed tracking-widest text-xs uppercase text-[var(--muted)] mb-3">Location</h3>
                <p className="text-[var(--espresso-900)] max-w-sm leading-relaxed mb-4">
                  {siteData.fullAddress}
                </p>
                <a
                  href={siteData.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-condensed tracking-widest uppercase hover:text-[var(--terracotta)] transition-colors border-b border-[var(--terracotta)] pb-0.5"
                >
                  Open in Google Maps
                </a>
              </motion.div>

              <motion.div
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-condensed tracking-widest text-xs uppercase text-[var(--muted)] mb-3">Hours</h3>
                <div className="flex flex-col gap-1 text-[var(--espresso-900)]">
                  {siteData.openingHours.map((hours, idx) => (
                    <p key={idx} className={idx === siteData.openingHours.length - 1 ? 'text-xs text-[var(--muted)] mt-2' : ''}>
                      {l(hours, locale)}
                    </p>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="font-condensed tracking-widest text-xs uppercase text-[var(--muted)] mb-3">Services</h3>
                <div className="flex gap-4">
                  {siteData.services.map((service, idx) => (
                    <span key={idx} className="capitalize text-[var(--espresso-900)] bg-[var(--ivory-100)] px-3 py-1 text-sm border border-[var(--ivory-200)]">
                      {service.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
            
            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ delay: 0.4 }}
              className="mt-12"
            >
              <button 
                onClick={openReservation}
                className="px-8 py-3 bg-[var(--ink)] text-[var(--white)] font-condensed tracking-widest uppercase text-sm hover:bg-[var(--espresso-800)] transition-colors inline-block cursor-pointer"
              >
                {t('nav.reserve')}
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="w-full h-[400px] lg:h-[600px] bg-[var(--ivory-200)] flex items-center justify-center p-8"
          >
            <div className="w-full h-full border border-[var(--muted)]/20 relative flex items-center justify-center bg-[var(--ivory-100)]">
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[var(--ink)]/5 flex items-center justify-center mb-4">
                  <div className="w-4 h-4 rounded-full bg-[var(--terracotta)] animate-pulse" />
                </div>
                <p className="font-serif text-xl text-[var(--espresso-900)]">Surabaya</p>
                <p className="font-condensed uppercase tracking-widest text-[var(--muted)] text-xs mt-2">Jawa Timur</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
