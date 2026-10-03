'use client';

import React from 'react';
import { motion } from 'motion/react';
import PageReveal from '@/components/motion/PageReveal';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { SiteData } from '@/content/types';
import { VisitPageData } from '@/content/provider';
import { useUI } from '@/components/shared/UIContext';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

interface VisitClientProps {
  locale: Locale;
  siteData: SiteData;
  visitData?: VisitPageData | null;
}

export default function VisitClient({ locale, siteData, visitData }: VisitClientProps) {
  const { t, l } = getDictionary(locale);
  const prefersReduced = useReducedMotionSafe();
  const { openReservation } = useUI();

  const mapEmbedUrl = siteData.fullAddress
    ? `https://maps.google.com/maps?q=${encodeURIComponent(siteData.fullAddress)}&z=16&output=embed`
    : 'https://maps.google.com/maps?q=Surabaya&z=16&output=embed';

  return (
    <PageReveal title={visitData?.title || t('nav.visit')} className="bg-[var(--ivory-50)] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mb-16">
          <h1 className="font-serif text-5xl md:text-7xl text-[var(--espresso-900)] mb-6">
            {visitData?.title || t('nav.visit')}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mb-24">
          
          {/* Map area */}
          <div className="lg:col-span-7">
            <div className="w-full aspect-square md:aspect-video bg-[var(--ivory-200)] relative p-4 flex flex-col overflow-hidden">
              <div className="w-full h-full relative z-10 border border-[var(--ivory-200)]">
                <iframe
                  title="Google Maps Location for Gema Restaurant & Societiet"
                  src={mapEmbedUrl}
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
                {t('visit.map.open')} &rarr;
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
              <h2 className="font-condensed tracking-widest text-xs uppercase text-[var(--muted)] mb-4">
                {visitData?.contactHeading || t('footer.contact')}
              </h2>
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
              <h2 className="font-condensed tracking-widest text-xs uppercase text-[var(--muted)] mb-4">
                {visitData?.reservationsHeading || t('footer.reserve')}
              </h2>
              <p className="text-[var(--muted)] text-sm mb-4">
                {visitData?.reservationsNote}
              </p>
              <button 
                onClick={openReservation}
                className="border-b border-[var(--ink)] font-condensed tracking-widest uppercase text-xs hover:text-[var(--terracotta)] hover:border-[var(--terracotta)] transition-colors pb-1 inline-block text-left cursor-pointer"
              >
                {t('visit.reserve')}
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
            <h3 className="font-serif text-xl text-[var(--espresso-900)] mb-3">
              {visitData?.dietaryPolicy.heading}
            </h3>
            <p className="text-[var(--muted)] text-sm leading-relaxed">
              {visitData?.dietaryPolicy.description}
            </p>
          </motion.div>

          <motion.div
             initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
          >
            <h3 className="font-serif text-xl text-[var(--espresso-900)] mb-3">
              {visitData?.dressCodePolicy.heading}
            </h3>
            <p className="text-[var(--muted)] text-sm leading-relaxed">
              {visitData?.dressCodePolicy.description}
            </p>
          </motion.div>

          <motion.div
             initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
          >
            <h3 className="font-serif text-xl text-[var(--espresso-900)] mb-3">
              {visitData?.parkingPolicy.heading}
            </h3>
            <p className="text-[var(--muted)] text-sm leading-relaxed">
              {visitData?.parkingPolicy.description}
            </p>
          </motion.div>
        </div>

      </div>
    </PageReveal>
  );
}

