'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { homeAssets } from '@/content/media/homeAssets';
import { audioManager } from '@/lib/audioManager';

export default function ChefPreview({ locale }: { locale: Locale }) {
  const { t } = getDictionary(locale);
  const prefersReduced = useReducedMotionSafe();
  const containerRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isChefActive, setIsChefActive] = useState(false);

  // Scroll saturation effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const saturation = useTransform(scrollYProgress, [0.3, 0.6], ['grayscale(100%)', 'grayscale(0%)']);

  // Native IntersectionObserver with hysteresis for Chef media active state and audio ducking
  useEffect(() => {
    const el = mediaRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const ratio = entry.intersectionRatio;

        // Enter threshold: >= 45% visible -> Chef active (duck audio, play video if present)
        if (ratio >= 0.45) {
          setIsChefActive(true);
          audioManager.setDucked(true);
        }
        // Exit threshold: < 22% visible -> Chef inactive (restore audio if user intent enabled, pause video)
        else if (ratio < 0.22) {
          setIsChefActive(false);
          audioManager.setDucked(false);
        }
        // Between 0.22 and 0.45: hysteresis zone, preserves current state
      },
      {
        threshold: [0, 0.22, 0.45, 0.7, 1.0],
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      audioManager.setDucked(false);
    };
  }, []);

  // Lifecycle control for video playback when active in viewport
  useEffect(() => {
    if (homeAssets.chefVideo.src && videoRef.current) {
      if (isChefActive) {
        videoRef.current.play().catch(() => {
          // Autoplay policy or format limitation handled safely
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isChefActive]);

  return (
    <section ref={containerRef} className="bg-[var(--ink)] text-white relative lg:h-[150vh]">
      {/* SVG ClipPath Definition — Approved Widened Blob (normalized to objectBoundingBox) */}
      <svg className="w-0 h-0 absolute pointer-events-none" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="chef-blob-shape2" clipPathUnits="objectBoundingBox">
            <path d="M 0.7725,0.2105 C 0.8615,0.265 0.948,0.3165 0.9595,0.3785 C 0.9705,0.4405 0.907,0.5125 0.8715,0.5905 C 0.8365,0.669 0.8305,0.7535 0.773,0.794 C 0.716,0.835 0.608,0.8315 0.5105,0.82 C 0.4135,0.809 0.327,0.7895 0.2765,0.7475 C 0.225,0.7055 0.2085,0.6405 0.2175,0.587 C 0.227,0.5335 0.261,0.4915 0.265,0.4295 C 0.269,0.3675 0.242,0.2855 0.2765,0.2175 C 0.3105,0.1495 0.405,0.0955 0.4985,0.097 C 0.5915,0.0985 0.6835,0.1555 0.7725,0.2105 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="lg:sticky lg:top-0 lg:h-screen w-full flex items-center overflow-hidden py-24 lg:py-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            
            {/* Left Content Column */}
            <div className="order-2 lg:order-1 max-w-md">
              <motion.h2 
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                className="font-serif text-3xl md:text-5xl leading-tight mb-8"
              >
                {t('home.chef.text')}
              </motion.h2>
              <motion.div
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ delay: 0.1 }}
              >
                <Link 
                  href={`/${locale}/chef/mandif-warokka`} 
                  className="px-8 py-3 border border-[var(--white)] text-[var(--white)] font-condensed tracking-widest uppercase text-sm hover:bg-[var(--white)] hover:text-[var(--ink)] transition-colors inline-block"
                >
                  {t('home.chef.cta')}
                </Link>
              </motion.div>
            </div>

            {/* Right Media Column: Widened Blob — Portrait 9:16 */}
            <div className="order-1 lg:order-2 w-full max-w-lg mx-auto">
              <motion.div
                ref={mediaRef}
                style={prefersReduced ? {} : { filter: saturation }}
                className="w-full relative aspect-[9/16] flex items-center justify-center p-3 sm:p-4"
              >
                {/* Decorative Outline — uses original 200×200 path for exact geometry match */}
                <svg
                  aria-hidden="true"
                  className="absolute -inset-3 sm:-inset-4 w-[calc(100%+24px)] sm:w-[calc(100%+32px)] h-[calc(100%+24px)] sm:h-[calc(100%+32px)] pointer-events-none"
                  viewBox="0 0 200 200"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M54.5,-57.9C72.3,-47,89.6,-36.7,91.9,-24.3C94.1,-11.9,81.4,2.5,74.3,18.1C67.3,33.8,66.1,50.7,54.6,58.8C43.2,67,21.6,66.3,2.1,64C-17.3,61.8,-34.6,57.9,-44.7,49.5C-55,41.1,-58.3,28.1,-56.5,17.4C-54.6,6.7,-47.8,-1.7,-47,-14.1C-46.2,-26.5,-51.6,-42.9,-44.7,-56.5C-37.9,-70.1,-19,-80.9,-0.3,-80.6C18.3,-80.3,36.7,-68.9,54.5,-57.9Z"
                    transform="translate(100 100)"
                    fill="none"
                    stroke="var(--terracotta)"
                    strokeWidth="1.2"
                    strokeOpacity="0.5"
                    vectorEffect="non-scaling-stroke"
                    className="transform -rotate-1 origin-center"
                  />
                </svg>

                {/* Portrait Media Container with Blobmaker Shape #2 ClipPath */}
                <div 
                  className="w-full h-full relative overflow-hidden bg-[#1a1310] shadow-2xl"
                  style={{ clipPath: 'url(#chef-blob-shape2)' }}
                >
                  {homeAssets.chefVideo.src ? (
                    <>
                      <video
                        ref={videoRef}
                        src={homeAssets.chefVideo.src}
                        poster={homeAssets.chefVideo.poster}
                        muted
                        playsInline
                        loop
                        preload="metadata"
                        onCanPlay={() => setIsVideoReady(true)}
                        className={`w-full h-full object-cover object-center transition-opacity duration-700 ${
                          isVideoReady ? 'opacity-100' : 'opacity-0'
                        }`}
                        aria-label="Chef Mandif Warokka culinary vision"
                      />
                      {!isVideoReady && (
                        <div className="absolute inset-0">
                          <Image
                            src={homeAssets.chefVideo.poster}
                            alt="Chef Mandif Warokka"
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            className="object-cover object-center"
                            priority={false}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    /* Staging Fallback: Displays verified chef reel poster while external Drive direct streaming is blocked */
                    <Image
                      src={homeAssets.chefVideo.poster}
                      alt="Chef Mandif Warokka"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover object-center"
                      priority={false}
                    />
                  )}
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
