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

  // Native IntersectionObserver with hysteresis for Chef media active state and audio ownership
  useEffect(() => {
    const el = mediaRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        const ratio = entry.intersectionRatio;

        // Enter threshold: >= 45% visible -> Chef active (suppress ambience, play Chef video with audio)
        if (ratio >= 0.45) {
          setIsChefActive(true);
          audioManager.handleChefEnter();
        }
        // Exit threshold: < 22% visible -> Chef inactive (pause video, restore ambience if previously active)
        else if (ratio < 0.22) {
          setIsChefActive(false);
          audioManager.handleChefExit();
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
      audioManager.handleChefExit();
    };
  }, []);

  // Lifecycle control for video playback & unmuted audio when active in viewport
  useEffect(() => {
    if (!homeAssets.chefVideo.src || !videoRef.current) return;
    const video = videoRef.current;

    if (isChefActive) {
      // RULE 1 & 4: Whenever Chef media is ACTIVE, Chef video MUST play UNMUTED with audible volume (1.0),
      // regardless of whether ambient backsound was ON or OFF.
      video.muted = false;
      video.volume = 1.0;
      video.play().catch((err) => {
        // Catch browser autoplay policy rejection if no prior user interaction
        console.warn('Chef video unmuted autoplay policy rejection:', err);
        video.muted = true;
        video.play().catch(() => {});
      });
    } else {
      // RULE 2: Whenever Chef media is INACTIVE, pause and mute
      video.pause();
      video.muted = true;
    }
  }, [isChefActive]);

  return (
    <section ref={containerRef} className="bg-[var(--ink)] text-white relative lg:h-[150vh]">
      {/* SVG ClipPath Definition — Widened (~25%) & Vertically Centered Organic Blob */}
      <svg className="w-0 h-0 absolute pointer-events-none" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="chef-blob-shape2" clipPathUnits="objectBoundingBox">
            <path d="M 0.7325,0.2455 C 0.843,0.3 0.95,0.3515 0.9645,0.4135 C 0.978,0.4755 0.8995,0.5475 0.8555,0.6255 C 0.812,0.704 0.8045,0.7885 0.733,0.829 C 0.6625,0.87 0.5285,0.8665 0.4075,0.855 C 0.2875,0.844 0.18,0.8245 0.1175,0.7825 C 0.0535,0.7405 0.033,0.6755 0.0445,0.622 C 0.056,0.5685 0.098,0.5265 0.103,0.4645 C 0.108,0.4025 0.0745,0.3205 0.1175,0.2525 C 0.1595,0.1845 0.277,0.1305 0.3925,0.132 C 0.508,0.1335 0.622,0.1905 0.7325,0.2455 Z" />
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

            {/* Right Media Column: Widened Blob (~25% wider, vertically centered) — Portrait 9:16 */}
            <div className="order-1 lg:order-2 w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[430px] max-h-[82vh] mx-auto flex items-center justify-center">
              <motion.div
                ref={mediaRef}
                style={prefersReduced ? {} : { filter: saturation }}
                className="w-full relative aspect-[9/16] flex items-center justify-center p-3 sm:p-4 my-auto cursor-pointer"
                onClick={() => {
                  const video = videoRef.current;
                  if (video && video.muted) {
                    video.muted = false;
                    video.volume = 1.0;
                  }
                }}
              >
                {/* Decorative Outline — matches widened shape exactly in 200×200 viewBox */}
                <svg
                  aria-hidden="true"
                  className="absolute -inset-3 sm:-inset-4 w-[calc(100%+24px)] sm:w-[calc(100%+32px)] h-[calc(100%+24px)] sm:h-[calc(100%+32px)] pointer-events-none"
                  viewBox="0 0 200 200"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M46.5,-50.9C68.6,-40.0,90.0,-29.7,92.9,-17.3C95.6,-4.9,79.9,9.5,71.1,25.1C62.4,40.8,60.9,57.7,46.6,65.8C32.5,74.0,5.7,73.3,-18.5,71.0C-42.5,68.8,-64.0,64.9,-76.5,56.5C-89.3,48.1,-93.4,35.1,-91.1,24.4C-88.8,13.7,-80.4,5.3,-79.4,-7.1C-78.4,-19.5,-85.1,-35.9,-76.5,-49.5C-68.1,-63.1,-44.6,-73.9,-21.5,-73.6C1.6,-73.3,24.4,-61.9,46.5,-50.9Z"
                    transform="translate(100 100)"
                    fill="none"
                    stroke="var(--terracotta)"
                    strokeWidth="1.2"
                    strokeOpacity="0.5"
                    vectorEffect="non-scaling-stroke"
                    className="transform -rotate-1 origin-center"
                  />
                </svg>

                {/* Portrait Media Container with Widened Blob ClipPath */}
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
