'use client';

import React from 'react';
import { motion } from 'motion/react';
import PageReveal from '@/components/motion/PageReveal';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { SiteData } from '@/content/types';
import { useUI } from '@/components/shared/UIContext';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

interface VisitClientProps {
  locale: Locale;
  siteData: SiteData;
}

export default function VisitClient({ locale, siteData }: VisitClientProps) {
  const { t, l } = getDictionary(locale);
  const prefersReduced = useReducedMotionSafe();
  const { openReservation } = useUI();

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
            <div className="w-full aspect-square md:aspect-video bg-[var(--ivory-200)] relative p-4 flex flex-col overflow-hidden">
              <div className="w-full h-full relative z-10 border border-[var(--ivory-200)]">
                <iframe
                  title="Google Maps Location for Gema Restaurant & Societiet"
                  src="https://maps.google.com/maps?q=Gema+Restaurant+Societiet+Jl+Musi+32+Surabaya&z=16&output=embed"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <a 
                href={siteData.mapUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-condensed tracking-widest uppercase text-xs text-[var(--muted)] hover:text-[var(--terracotta)] transition-colors flex items-center gap-1"
              >
                Open in Google Maps &rarr;
              </a>
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
                className="border-b border-[var(--ink)] font-condensed tracking-widest uppercase text-xs hover:text-[var(--terracotta)] hover:border-[var(--terracotta)] transition-colors pb-1 inline-block text-left cursor-pointer"
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
