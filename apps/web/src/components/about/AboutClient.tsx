'use client';

import React from 'react';
import { motion } from 'motion/react';
import PageReveal from '@/components/motion/PageReveal';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import ResponsiveImage from '@/components/media/ResponsiveImage';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

interface AboutClientProps {
  locale: Locale;
}

export default function AboutClient({ locale }: AboutClientProps) {
  const { t } = getDictionary(locale);
  const prefersReduced = useReducedMotionSafe();

  return (
    <PageReveal title="About GEMA" className="bg-[var(--ivory-50)] min-h-screen">
      
      {/* Hero */}
      <div className="pt-40 pb-24 px-4 max-w-4xl mx-auto text-center">
        <h1 className="font-serif text-5xl md:text-7xl text-[var(--espresso-900)] mb-8">
          The Resonance of Good Taste
        </h1>
        <p className="text-[var(--muted)] text-lg leading-relaxed max-w-2xl mx-auto">
          GEMA, meaning &apos;echo&apos; or &apos;resonance&apos;, reflects our belief that a great meal continues to sound in the memory long after the table is cleared.
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
            <h2 className="font-serif text-3xl md:text-5xl text-[var(--espresso-900)] mb-6">The Origin</h2>
            <p className="text-[var(--muted)] mb-6 leading-relaxed">
              Born from a desire to bring elevated, authentic Italian dining to Surabaya, GEMA was conceived as more than a restaurant. It is a <em>Sociëteit</em>—a gathering place for those who appreciate the intersection of culinary tradition and contemporary art.
            </p>
            <p className="text-[var(--muted)] leading-relaxed">
              We sought to create a space that feels both cosmopolitan and deeply rooted in hospitality, where every detail is considered but the atmosphere remains effortless.
            </p>
          </motion.div>
          <div className="order-1 md:order-2 aspect-[4/5]">
            <ResponsiveImage 
              src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80" 
              alt="Restaurant details"
              maskReveal
              priority
            />
          </div>
        </div>

        {/* Section 2: The Philosophy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center mb-32">
          <div className="aspect-square">
            <ResponsiveImage 
              src="https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80" 
              alt="Culinary philosophy"
              maskReveal
            />
          </div>
          <motion.div
             initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true, margin: "-10%" }}
          >
            <h2 className="font-serif text-3xl md:text-5xl text-[var(--espresso-900)] mb-6">The Philosophy</h2>
            <p className="text-[var(--muted)] mb-6 leading-relaxed">
              Our kitchen operates on a simple principle: respect the ingredient. By combining classic Italian techniques with the finest available produce, we craft dishes that are comforting yet refined.
            </p>
            <p className="text-[var(--muted)] leading-relaxed">
              We adhere to a strict No Pork, No Lard policy, ensuring our culinary vision is accessible and respectful of our diverse community without ever compromising on flavor or technique.
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
            <h2 className="font-serif text-3xl md:text-5xl mb-6">The Architecture</h2>
            <p className="text-[var(--ivory-200)] mb-6 leading-relaxed">
              Housed in a thoughtfully restored building on Jl. Musi, the architecture of GEMA balances classical proportions with modern restraint. 
            </p>
            <p className="text-[var(--ivory-200)] leading-relaxed">
              Warm ivory tones, rich espresso wood, and strategic lighting create a canvas that shifts throughout the day, offering a different mood for a sunlit lunch versus an intimate evening dinner.
            </p>
          </motion.div>
          <div className="order-1 md:order-2 aspect-[3/4]">
            <ResponsiveImage 
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80" 
              alt="GEMA Architecture"
            />
          </div>
        </div>

      </div>
    </PageReveal>
  );
}
