'use client';

import React from 'react';
import { motion } from 'motion/react';
import PageReveal from '@/components/motion/PageReveal';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import ResponsiveImage from '@/components/media/ResponsiveImage';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { PageMediaData, AboutPageData } from '@/content/provider';
import { SiteData } from '@/content/types';

interface AboutClientProps {
  locale: Locale;
  pageMedia?: PageMediaData | null;
  aboutData?: AboutPageData | null;
  siteData?: SiteData | null;
}

export default function AboutClient({ locale, pageMedia, aboutData, siteData }: AboutClientProps) {
  const { t } = getDictionary(locale);
  const prefersReduced = useReducedMotionSafe();

  const dietarySentence = aboutData?.philosophy
    ? `${aboutData.philosophy.dietaryPrefix}${siteData?.dietaryPolicy || 'No Pork, No Lard'}${aboutData.philosophy.dietarySuffix}`
    : '';

  return (
    <PageReveal title="About GEMA" className="bg-[var(--ivory-50)] min-h-screen">
      
      {/* Hero */}
      <div className="pt-40 pb-24 px-4 max-w-4xl mx-auto text-center">
        <h1 className="font-serif text-5xl md:text-7xl text-[var(--espresso-900)] mb-8">
          {aboutData?.hero.headline}
        </h1>
        <p className="text-[var(--muted)] text-lg leading-relaxed max-w-2xl mx-auto">
          {aboutData?.hero.subtitle}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        
        {/* Section 1: The Origin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center mb-32">
          <motion.div
             initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-10%" }}
             className="order-2 md:order-1"
          >
            <h2 className="font-serif text-3xl md:text-5xl text-[var(--espresso-900)] mb-6">
              {aboutData?.origin.title}
            </h2>
            <p className="text-[var(--muted)] mb-6 leading-relaxed">
              {aboutData?.origin.body1}
            </p>
            <p className="text-[var(--muted)] leading-relaxed">
              {aboutData?.origin.body2}
            </p>
          </motion.div>
          <div className="order-1 md:order-2 aspect-[4/5]">
            <ResponsiveImage 
              src={pageMedia?.about.originImage.src || ''} 
              alt={pageMedia?.about.originImage.alt || 'GEMA branded tableware detail'}
              maskReveal
              priority
            />
          </div>
        </div>

        {/* Section 2: The Philosophy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center mb-32">
          <div className="aspect-square">
            <ResponsiveImage 
              src={pageMedia?.about.philosophyImage.src || ''} 
              alt={pageMedia?.about.philosophyImage.alt || 'Culinary spices and aromatics'}
              maskReveal
            />
          </div>
          <motion.div
             initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-10%" }}
          >
            <h2 className="font-serif text-3xl md:text-5xl text-[var(--espresso-900)] mb-6">
              {aboutData?.philosophy.title}
            </h2>
            <p className="text-[var(--muted)] mb-6 leading-relaxed">
              {aboutData?.philosophy.body1}
            </p>
            <p className="text-[var(--muted)] leading-relaxed">
              {dietarySentence}
            </p>
          </motion.div>
        </div>

        {/* Section 3: The Architecture */}
        <div className="bg-[var(--ink)] text-[var(--ivory-50)] p-8 md:p-24 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div
             initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-10%" }}
             className="order-2 md:order-1"
          >
            <h2 className="font-serif text-3xl md:text-5xl mb-6">
              {aboutData?.architecture.title}
            </h2>
            <p className="text-[var(--ivory-200)] mb-6 leading-relaxed">
              {aboutData?.architecture.body1}
            </p>
            <p className="text-[var(--ivory-200)] leading-relaxed">
              {aboutData?.architecture.body2}
            </p>
          </motion.div>
          <div className="order-1 md:order-2 aspect-[3/4]">
            <ResponsiveImage 
              src={pageMedia?.about.architectureImage.src || ''} 
              alt={pageMedia?.about.architectureImage.alt || 'GEMA interior architecture'}
            />
          </div>
        </div>

      </div>
    </PageReveal>
  );
}

