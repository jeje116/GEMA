'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import PageReveal from '@/components/motion/PageReveal';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import ResponsiveImage from '@/components/media/ResponsiveImage';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { PageMediaData, ExperiencePageData } from '@/content/provider';

interface ExperienceClientProps {
  locale: Locale;
  pageMedia?: PageMediaData | null;
  experienceData?: ExperiencePageData | null;
}

export default function ExperienceClient({ locale, pageMedia, experienceData }: ExperienceClientProps) {
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
            src={pageMedia?.experience.heroImage.src || ''} 
            alt={pageMedia?.experience.heroImage.alt || 'GEMA dining room and garden terrace'}
            className="w-full h-full"
            imgClassName="brightness-[0.7]"
            priority
          />
        </motion.div>
        
        <motion.div style={{ opacity: prefersReduced ? 1 : opacityText }} className="relative z-10 text-center text-white px-4">
          <p className="font-condensed tracking-[0.2em] uppercase text-xs mb-6 text-[var(--ivory-200)]">
            {experienceData?.hero.kicker}
          </p>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl">
            {experienceData?.hero.headline}
          </h1>
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
            &ldquo;{experienceData?.quote}&rdquo;
          </motion.p>
        </div>
      </section>

      {/* Day to Night Masonry */}
      <section className="py-24 bg-[var(--white)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-[var(--ivory-200)] pb-8 gap-8">
            <h2 className="font-serif text-4xl md:text-5xl text-[var(--espresso-900)]">
              {experienceData?.dayToNight.heading}
            </h2>
            <p className="font-condensed uppercase tracking-widest text-xs text-[var(--muted)] max-w-xs">
              {experienceData?.dayToNight.subtitle}
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
                  <ResponsiveImage 
                    src={pageMedia?.experience.morningImage.src || ''} 
                    alt={pageMedia?.experience.morningImage.alt || 'Morning dining table at GEMA'} 
                  />
                </div>
                <h3 className="font-serif text-2xl text-[var(--espresso-900)] mb-2">
                  {experienceData?.dayToNight.morningHeading}
                </h3>
                <p className="text-[var(--muted)] text-sm">
                  {experienceData?.dayToNight.morningDescription}
                </p>
              </motion.div>

              <motion.div
                 initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true, margin: "-10%" }}
              >
                <p className="font-serif text-3xl text-[var(--terracotta-dark)] italic leading-relaxed py-12 px-8 border-l border-[var(--terracotta)]">
                  {experienceData?.dayToNight.transitionQuote}
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
                  <ResponsiveImage 
                    src={pageMedia?.experience.eveningImage.src || ''} 
                    alt={pageMedia?.experience.eveningImage.alt || 'Evening atmosphere'} 
                  />
                </div>
                <h3 className="font-serif text-2xl text-[var(--espresso-900)] mb-2">
                  {experienceData?.dayToNight.eveningHeading}
                </h3>
                <p className="text-[var(--muted)] text-sm max-w-md">
                  {experienceData?.dayToNight.eveningDescription}
                </p>
              </motion.div>

              <motion.div
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
              >
                <div className="aspect-square mb-6 w-3/4 ml-auto">
                  <ResponsiveImage 
                    src={pageMedia?.experience.detailsImage.src || ''} 
                    alt={pageMedia?.experience.detailsImage.alt || 'GEMA branded tableware and hospitality details'} 
                  />
                </div>
              </motion.div>
            </div>

          </div>

        </div>
      </section>

      {/* The Craft */}
      <section className="py-24 md:py-32 bg-[var(--ink)] text-[var(--ivory-50)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Editorial Text */}
            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              className="max-w-xl"
            >
              {/* Short thin horizontal editorial hairline */}
              <div className="w-12 h-px bg-[var(--terracotta)]/70 mb-8" />

              {/* Large serif heading */}
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[var(--ivory-50)] mb-8 tracking-tight">
                {experienceData?.craft?.heading || 'The Craft'}
              </h2>

              {/* Terracotta muted italic introduction */}
              <p className="font-serif text-2xl md:text-3xl italic text-[var(--terracotta)] leading-relaxed mb-6 whitespace-pre-line">
                {experienceData?.craft?.intro || 'Behind every plate is a rhythm\nof preparation and precision.'}
              </p>

              {/* Supporting paragraph in muted ivory */}
              <p className="text-[var(--ivory-200)] text-base md:text-lg leading-relaxed">
                {experienceData?.craft?.body || 'The experience at GEMA is shaped as much by what happens behind the pass as what arrives at the table. Open-kitchen energy, careful plating, and handmade detail give every dish its character.'}
              </p>
            </motion.div>

            {/* Right Column: Chef Plating Photography */}
            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              className="relative w-full aspect-[5/6] max-w-[340px] sm:max-w-[380px] md:max-w-[460px] lg:max-w-[470px] max-h-[560px] mx-auto md:ml-auto md:mr-0 overflow-hidden"
            >
              <ResponsiveImage
                src={pageMedia?.experience?.craftImage?.src || '/media/experience/experience-the-craft-chef-plating.webp'}
                alt={pageMedia?.experience?.craftImage?.alt || (locale === 'id' ? 'Chef menata hidangan di GEMA' : 'Chef plating a dish at GEMA')}
                className="w-full h-full aspect-[5/6]"
                imgClassName="object-cover object-[center_35%] brightness-[0.9]"
              />
            </motion.div>

          </div>
        </div>
      </section>

    </PageReveal>
  );
}
