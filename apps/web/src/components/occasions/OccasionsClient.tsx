'use client';

import React from 'react';
import { motion } from 'motion/react';
import PageReveal from '@/components/motion/PageReveal';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { useUI } from '@/components/shared/UIContext';
import { PrivateEventCategory, PastBrandEvent } from '@/content/types';
import ResponsiveImage from '@/components/media/ResponsiveImage';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

interface OccasionsClientProps {
  locale: Locale;
  categories: PrivateEventCategory[];
  brandEvents: PastBrandEvent[];
}

export default function OccasionsClient({ locale, categories, brandEvents }: OccasionsClientProps) {
  const { t, l } = getDictionary(locale);
  const prefersReduced = useReducedMotionSafe();
  const { openReservation } = useUI();

  return (
    <PageReveal title={t('nav.occasions')} className="bg-[var(--white)] min-h-screen">
      
      {/* Hero Section */}
      <div className="w-full h-[60vh] md:h-[70vh] relative">
        <ResponsiveImage 
          src="/media/occasions/occasions-hero.jpg" 
          alt="GEMA Occasions"
          className="w-full h-full"
          imgClassName="brightness-[0.7] object-[center_40%]"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center text-center p-6">
          <div className="max-w-3xl">
            <h1 className="font-serif text-5xl md:text-7xl text-white mb-6">
              {t('nav.occasions')}
            </h1>
            <p className="text-[var(--ivory-100)] text-lg md:text-xl font-light">
              Where unforgettable moments are crafted with precision, art, and hospitality.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        
        {/* Categories Section */}
        <div className="flex flex-col gap-24 md:gap-32 mb-32">
          {categories.map((category, index) => (
            <motion.div 
              key={category.id}
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }}
              className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-12 lg:gap-24 items-center`}
            >
              <div className="w-full md:w-1/2 aspect-[4/5] relative overflow-hidden">
                <ResponsiveImage 
                  src={category.image} 
                  alt={l(category.title)}
                  className="w-full h-full hover:scale-105 transition-transform duration-1000 ease-out"
                />
              </div>
              <div className="w-full md:w-1/2">
                <h2 className="font-serif text-4xl lg:text-5xl text-[var(--espresso-900)] mb-6">
                  {l(category.title)}
                </h2>
                <p className="text-[var(--muted)] text-lg mb-8 leading-relaxed">
                  {l(category.description)}
                </p>
                <ul className="flex flex-col gap-4 mb-10">
                  {category.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[var(--terracotta)] mt-1">•</span>
                      <span className="text-[var(--espresso-900)] font-condensed tracking-wide">
                        {l(feature)}
                      </span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={openReservation}
                  className="px-8 py-4 bg-[var(--ink)] text-white font-condensed tracking-widest uppercase text-sm hover:bg-[var(--espresso-800)] transition-colors inline-block text-center cursor-pointer"
                >
                  Inquire Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Brand Events Section */}
        <div className="border-t border-[var(--ivory-200)] pt-24">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl text-[var(--espresso-900)] mb-4">
              Brand Exclusives
            </h2>
            <p className="text-[var(--muted)] max-w-2xl mx-auto">
              GEMA has been the chosen venue for prestigious product launches, gala dinners, and showcases by leading luxury brands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {brandEvents.map((event, index) => (
              <motion.div 
                key={event.id}
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden mb-6 relative">
                  <ResponsiveImage 
                    src={event.image} 
                    alt={event.brand}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                </div>
                <h3 className="font-condensed uppercase tracking-widest text-xs text-[var(--terracotta)] mb-2">
                  {event.brand}
                </h3>
                <h4 className="font-serif text-xl md:text-2xl text-[var(--espresso-900)] group-hover:text-[var(--terracotta-dark)] transition-colors">
                  {l(event.title)}
                </h4>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </PageReveal>
  );
}
