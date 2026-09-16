import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageProvider';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import ResponsiveImage from '../../components/media/ResponsiveImage';

export default function ChefPreview() {
  const { t } = useLanguage();
  const prefersReduced = useReducedMotionSafe();
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Saturation animation on scroll
  const saturation = useTransform(scrollYProgress, [0.3, 0.6], ["grayscale(100%)", "grayscale(0%)"]);

  return (
    <section ref={containerRef} className="bg-[var(--ink)] text-white relative lg:h-[150vh]">
      {/* 
        On desktop, sticky content so it stays while scrolling past.
        On mobile, normal flow.
      */}
      <div className="lg:sticky lg:top-0 lg:h-screen w-full flex items-center overflow-hidden py-24 lg:py-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            
            <div className="order-2 lg:order-1 max-w-md">
              <motion.h2 
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                className="font-serif text-3xl md:text-5xl leading-tight mb-8"
              >
                {t('home.chef.text')}
              </motion.h2>
              <motion.div
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ delay: 0.1 }}
              >
                <Link 
                  to="/chef/mandif-warokka" 
                  className="px-8 py-3 border border-[var(--white)] text-[var(--white)] font-condensed tracking-widest uppercase text-sm hover:bg-[var(--white)] hover:text-[var(--ink)] transition-colors inline-block"
                >
                  {t('home.chef.cta')}
                </Link>
              </motion.div>
            </div>

            <div className="order-1 lg:order-2 w-full max-w-lg mx-auto">
              <motion.div
                style={prefersReduced ? {} : { filter: saturation }}
                className="w-full relative aspect-[3/4] overflow-hidden"
              >
                <ResponsiveImage
                  src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80"
                  alt="Chef Mandif Warokka"
                  className="w-full h-full"
                />
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
