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
            className="w-full h-[400px] lg:h-[600px] bg-[var(--ivory-200)] p-4 sm:p-6 flex flex-col"
          >
            <div className="w-full h-full relative border border-[var(--ivory-200)] bg-[var(--ivory-100)] overflow-hidden shadow-sm">
              <iframe
                title="Google Maps Location for Gema Restaurant & Societiet"
                src="https://maps.google.com/maps?q=Gema+Restaurant+Societiet+Jl+Musi+32+Surabaya&z=16&output=embed"
                className="w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
