'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import PageReveal from '@/components/motion/PageReveal';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import ResponsiveImage from '@/components/media/ResponsiveImage';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

interface ExperienceClientProps {
  locale: Locale;
}

export default function ExperienceClient({ locale }: ExperienceClientProps) {
  const { t } = getDictionary(locale);
  const prefersReduced = useReducedMotionSafe();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef });
  const yImage = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <PageReveal title={t('nav.experience')} className="bg-[var(--ivory-50)] min-h-screen">
      
      {/* Hero */}
      <div ref={heroRef} className="relative h-screen min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: prefersReduced ? 0 : yImage }} className="absolute inset-0 w-full h-[120%] -top-[10%] z-0">
          <ResponsiveImage 
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80" 
            alt="GEMA Interior"
            className="w-full h-full"
            imgClassName="brightness-[0.7]"
            priority
          />
        </motion.div>
        
        <motion.div style={{ opacity: prefersReduced ? 1 : opacityText }} className="relative z-10 text-center text-white px-4">
          <p className="font-condensed tracking-[0.2em] uppercase text-xs mb-6 text-[var(--ivory-200)]">The Atmosphere</p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl">A Place to Linger</h1>
        </motion.div>
      </div>

      {/* Editorial Introduction */}
      <section className="py-24 md:py-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p 
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            className="font-serif text-3xl md:text-4xl leading-relaxed text-[var(--espresso-900)] mb-12"
          >
            &ldquo;GEMA is designed to be a canvas for connection. Whether bathed in morning light or shadowed by evening candle glow, the room adapts to the conversations it holds.&rdquo;
          </motion.p>
        </div>
      </section>

      {/* Day to Night Masonry */}
      <section className="py-24 bg-[var(--white)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-[var(--ivory-200)] pb-8 gap-8">
            <h2 className="font-serif text-4xl md:text-5xl text-[var(--espresso-900)]">
              Day to Night
            </h2>
            <p className="font-condensed uppercase tracking-widest text-xs text-[var(--muted)] max-w-xs">
              From casual business lunches to intimate evening dining, the atmosphere shifts effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
            
            {/* Left Column */}
            <div className="md:col-span-5 flex flex-col gap-12">
              <motion.div
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
              >
                <div className="aspect-[4/5] mb-6">
                  <ResponsiveImage src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&q=80" alt="Daytime dining" />
                </div>
                <h3 className="font-serif text-2xl text-[var(--espresso-900)] mb-2">Morning Light</h3>
                <p className="text-[var(--muted)] text-sm">Sunlight streams through the tall windows, warming the ivory walls and bringing out the rich textures of the natural wood.</p>
              </motion.div>

              <motion.div
                 initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-10%" }}
              >
                <p className="font-serif text-3xl text-[var(--terracotta-dark)] italic leading-relaxed py-12 px-8 border-l border-[var(--terracotta)]">
                  The transition is seamless. As the sun sets, the music shifts, the lights dim, and a different energy takes over the room.
                </p>
              </motion.div>
            </div>

            {/* Right Column (Offset) */}
            <div className="md:col-span-7 md:pt-32 flex flex-col gap-12">
              <motion.div
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
              >
                <div className="aspect-video mb-6">
                  <ResponsiveImage src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80" alt="Evening atmosphere" />
                </div>
                <h3 className="font-serif text-2xl text-[var(--espresso-900)] mb-2">Evening Shadows</h3>
                <p className="text-[var(--muted)] text-sm max-w-md">Candlelight catches the subtle veining of the marble tables. The room feels closer, more intimate, designed for lingering over wine and dessert.</p>
              </motion.div>

              <motion.div
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
              >
                <div className="aspect-square mb-6 w-3/4 ml-auto">
                  <ResponsiveImage src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80" alt="Culinary details" />
                </div>
              </motion.div>
            </div>

          </div>

        </div>
      </section>

      {/* Materials */}
      <section className="py-24 md:py-32 bg-[var(--ink)] text-[var(--ivory-50)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            
            <div className="order-2 md:order-1 max-w-md">
              <h2 className="font-serif text-4xl md:text-5xl mb-8">The Materials</h2>
              <p className="text-[var(--ivory-200)] mb-6 leading-relaxed">
                We chose materials that age gracefully and tell a story. Warm terracotta, brushed brass, textured plaster walls, and Italian marble form the foundation of GEMA.
              </p>
              <p className="text-[var(--ivory-200)] leading-relaxed">
                These elements provide a neutral but textured backdrop that allows the colors of the food and the vibrancy of the guests to take center stage.
              </p>
            </div>

            <div className="order-1 md:order-2 grid grid-cols-2 gap-4">
              <motion.div 
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="aspect-square bg-[#8B5A47]"
              />
              <motion.div 
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="aspect-square bg-[#E8E4D9]"
              />
              <motion.div 
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="aspect-square bg-[#B5A18C]"
              />
              <motion.div 
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="aspect-square bg-[#2C2420]"
              />
            </div>
            
          </div>
        </div>
      </section>

    </PageReveal>
  );
}
