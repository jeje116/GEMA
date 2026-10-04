'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { Locale } from '@/i18n/config';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { useUI } from '@/components/shared/UIContext';
import { cn } from '@/lib/utils';
import { audioManager } from '@/lib/audioManager';

import type { SplashConfig } from '@/lib/splashConfig';

type GatewayState = 'loading' | 'ready' | 'idle' | 'entered';


export default function GatewayExperience({
  locale,
  splashConfig,
}: {
  locale: Locale;
  splashConfig?: SplashConfig;
}) {
  const [state, setState] = useState<GatewayState>('loading');
  const pathname = usePathname();
  const prefersReduced = useReducedMotionSafe();
  const isMounted = useRef(true);
  const previousScrollRestorationRef = useRef<ScrollRestoration | null>(null);
  const { isGatewayEntered, setGatewayEntered } = useUI();

  // Responsive & client hydration state
  const [isClientMounted, setIsClientMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [fallbackTimeoutReached, setFallbackTimeoutReached] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isHomepage = pathname === '/' || pathname === `/${locale}` || pathname === `/${locale}/` || pathname === '/en' || pathname === '/id';

  // Responsive breakpoint tracking and client initialization
  useEffect(() => {
    const checkViewport = () => {
      const isMob = window.innerWidth < 768;
      setIsMobile(isMob);
    };
    checkViewport();
    setIsClientMounted(true);

    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Determine gateway appearance & scroll preservation
  useEffect(() => {
    isMounted.current = true;
    
    // Prime audio element in background for user gesture
    audioManager.getOrCreateAudio();

    if (isGatewayEntered) {
      setState('entered');
    } else {
      setState('loading');
      document.body.style.overflow = 'hidden';

      // Scope scroll normalization strictly to Homepage full document entrance
      if (isHomepage) {
        if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
          previousScrollRestorationRef.current = window.history.scrollRestoration;
          window.history.scrollRestoration = 'manual';
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    }

    return () => {
      isMounted.current = false;
      document.body.style.overflow = '';
      if (isHomepage && previousScrollRestorationRef.current && typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
        window.history.scrollRestoration = previousScrollRestorationRef.current;
      }
      const vid = videoRef.current;
      if (vid) {
        vid.pause();
        vid.removeAttribute('src');
        vid.querySelectorAll('source').forEach((s) => s.removeAttribute('src'));
        vid.load();
      }
    };
  }, [isGatewayEntered, isHomepage]);

  // Production reveal trigger: synchronized strictly with the native 'playing' event
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const handlePlaying = () => setVideoLoaded(true);

    if (!vid.paused && vid.currentTime > 0) {
      // Native playing event occurred prior to client hydration completion
      setVideoLoaded(true);
    } else {
      vid.addEventListener('playing', handlePlaying, { once: true });
    }

    return () => {
      vid.removeEventListener('playing', handlePlaying);
    };
  }, []);

  // Handle timeout fallback: marks fallback as active for slow networks without aborting background video
  useEffect(() => {
    if (prefersReduced) return;

    const timer = setTimeout(() => {
      if (isMounted.current && !videoLoaded) {
        setFallbackTimeoutReached(true);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [videoLoaded, prefersReduced]);

  const handleEnter = () => {
    if (state === 'entered') return;

    // Gateway interaction satisfies browser user-gesture requirement: immediately start ambient audio
    audioManager.startFromUserGesture();

    if (isHomepage) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }

    const vid = videoRef.current;
    if (vid) {
      vid.pause();
      vid.removeAttribute('src');
      vid.querySelectorAll('source').forEach((s) => s.removeAttribute('src'));
      vid.load();
    }

    setState('entered');
    setGatewayEntered();
    document.body.style.overflow = '';

    setTimeout(() => {
      if (isMounted.current) {
        const main = document.getElementById('main-content');
        if (main) {
          main.focus({ preventScroll: true });
        }
      }
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleEnter();
    }
  };

  const desktopVideoUrl = splashConfig?.desktopVideoUrl || '/media/splash/gema-splash-desktop.mp4';
  const mobileVideoUrl = splashConfig?.mobileVideoUrl || '/media/splash/gema-splash-mobile.mp4';
  const currentVideoUrl = isMobile ? mobileVideoUrl : desktopVideoUrl;

  // Overlay typography renders directly over the living scene once video starts playing
  const showDomOverlay = videoLoaded && !videoError;

  return (
    <AnimatePresence
      onExitComplete={() => {
        if (isHomepage && previousScrollRestorationRef.current && typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
          window.history.scrollRestoration = previousScrollRestorationRef.current;
        }
      }}
    >
      {state !== 'entered' && (
        <motion.button
          type="button"
          aria-label="Enter GEMA website"
          onClick={handleEnter}
          onPointerDown={handleEnter}
          onKeyDown={handleKeyDown}
          initial={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            y: prefersReduced ? 0 : '-100%',
          }}
          transition={{
            duration: prefersReduced ? 0.3 : 0.8,
            ease: prefersReduced ? 'linear' : [0.76, 0, 0.24, 1],
          }}
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center bg-[#F6F1EA] cursor-pointer outline-none border-none overflow-hidden select-none',
            'focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-focus'
          )}
        >
          {/* ========================================================= */}
          {/* 1. LIVING BACKGROUND / VIDEO LAYER                       */}
          {/* Always FULLSCREEN (100vw x 100dvh, object-cover, no letterbox) */}
          {/* ========================================================= */}
          <div data-splash-element="media-layer" className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
            {/* Same-Origin Local Video Stream (No poster attribute, early discovery via native source selection) */}
            {!prefersReduced && !videoError && (
              <video
                data-splash-element="video-stream"
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                onPlaying={() => setVideoLoaded(true)}
                onLoadedData={() => {
                  const vid = videoRef.current;
                  if (vid && vid.paused) {
                    vid.play().catch(() => {});
                  }
                }}
                onError={(e) => {
                  // Guard against bubbling events from non-matching source queries
                  if (e.target !== e.currentTarget) return;
                  if (videoRef.current && !videoRef.current.error) return;
                  setVideoError(true);
                }}
                className={cn(
                  'absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 motion-reduce:hidden',
                  videoLoaded ? 'opacity-100' : 'opacity-0'
                )}
              >
                <source
                  src={desktopVideoUrl}
                  media="(prefers-reduced-motion: no-preference) and (min-width: 768px)"
                  type="video/mp4"
                />
                <source
                  src={mobileVideoUrl}
                  media="(prefers-reduced-motion: no-preference) and (max-width: 767.98px)"
                  type="video/mp4"
                />
              </video>
            )}
          </div>

          {/* ========================================================= */}
          {/* 2. NEUTRAL GEMA REDUCED MOTION PRESENTATION (Zero photo)   */}
          {/* ========================================================= */}
          {prefersReduced && (
            <div
              data-splash-element="reduced-motion-presentation"
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-10"
            >
              <div className="relative w-48 sm:w-56 h-24 sm:h-28 mb-4 opacity-90">
                <Image
                  src="/media/splash/gema-dark.png"
                  alt="GEMA restaurant & societiet"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
              <div className="w-16 h-[1px] bg-[#BFA16F]/70 mb-3" />
              <p className="font-condensed text-[10px] sm:text-[11px] tracking-[0.3em] text-[#6b5743] uppercase font-light">
                ENTER
              </p>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. NEUTRAL GEMA LOADING STATE (Active only before video ready) */}
          {/* ========================================================= */}
          {!videoLoaded && !videoError && !prefersReduced && (
            <div
              data-splash-element="neutral-loading"
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-500 select-none z-10"
            >
              {/* Brand Logo Emblem */}
              <div className="relative w-44 sm:w-52 h-20 sm:h-24 mb-4 opacity-85">
                <Image
                  src="/media/splash/gema-dark.png"
                  alt="GEMA restaurant & societiet"
                  fill
                  priority
                  className="object-contain"
                />
              </div>

              {/* Minimal Warm Gold Hairline Indicator */}
              <div className="w-16 h-[1px] bg-[#BFA16F]/40 mb-3 overflow-hidden relative">
                <div className="absolute inset-0 bg-[#BFA16F] animate-pulse" />
              </div>

              {/* GEMA Brand Loading Label */}
              <p className="font-condensed text-[10px] sm:text-[11px] tracking-[0.3em] text-[#6b5743] uppercase font-light">
                LOADING
              </p>
            </div>
          )}

          {/* ========================================================= */}
          {/* 2. ACCESSIBLE TEXT LANDMARKS (Always present in DOM)      */}
          {/* ========================================================= */}
          <div className="sr-only">
            <p className="font-serif text-lg">Gema Restaurant &amp; Societiet</p>
            <p>CUCINA &bull; BUONA COMPAGNIA &bull; BELLA VITA</p>
            <p>ITALIAN FOOD BRINGS PEOPLE TOGETHER</p>
            <p>Welcome. GOOD FOOD. BRIGHTER DAYS.</p>
            <p>EST. 2025</p>
            <p>A TASTE OF ITALY ALWAYS</p>
          </div>

          {/* ========================================================= */}
          {/* 3. OVERLAY LAYER — DESKTOP VIEWPORT (>= 768px landscape) */}
          {/* ========================================================= */}
          <div
            className={cn(
              'hidden md:block absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700 z-10',
              showDomOverlay ? 'opacity-100' : 'opacity-0'
            )}
          >
            {/* Aspect container matching the 1672x941 desktop oracle */}
            <div className="relative w-full h-full max-w-[178vh] mx-auto overflow-hidden">
              {/* Top Motto Bar (oracle center_y ~ 6.8%) */}
              <div data-splash-element="motto" className="absolute top-[6.8%] left-0 right-0 text-center">
                <p className="font-condensed text-xs lg:text-sm tracking-[0.35em] text-[#6b5743] uppercase font-normal">
                  CUCINA &nbsp;&bull;&nbsp; BUONA COMPAGNIA &nbsp;&bull;&nbsp; BELLA VITA
                </p>
              </div>

              {/* Gema Brand Logo (oracle center_y ~ 25.4%) */}
              <div data-splash-element="logo" className="absolute top-[13.5%] left-1/2 -translate-x-1/2 w-72 lg:w-84 h-36 lg:h-40">
                <Image
                  src="/media/splash/gema-dark.png"
                  alt="Gema restaurant & societiet"
                  fill
                  priority
                  className="object-contain"
                />
              </div>

              {/* Right-aligned motto (oracle center_y ~ 31.8%, center_x ~ 76.2%) */}
              <div data-splash-element="italian-food" className="absolute left-[73.5%] top-[25.5%] text-left">
                <div className="font-serif text-[11px] lg:text-xs tracking-[0.3em] text-[#6c594c] uppercase leading-[1.75] font-light">
                  <p>ITALIAN</p>
                  <p>FOOD</p>
                  <p>BRINGS</p>
                  <p>PEOPLE</p>
                  <p>TOGETHER</p>
                </div>
              </div>

              {/* Divider with Central Quatrefoil (oracle center_y ~ 72.4%) */}
              <div data-splash-element="divider" className="absolute top-[71%] left-1/2 -translate-x-1/2 flex items-center justify-center gap-3 text-[#BFA16F]">
                <div className="h-[1px] w-28 lg:w-36 bg-[#BFA16F]/70" />
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-4 h-4">
                  <path d="M 12 3 C 14.2 3 16 4.8 16 7 C 18.2 7 20 8.8 20 11 C 20 13.2 18.2 15 16 15 C 16 17.2 14.2 19 12 19 C 9.8 19 8 17.2 8 15 C 5.8 15 4 13.2 4 11 C 4 8.8 5.8 7 8 7 C 8 4.8 9.8 3 12 3 Z" />
                </svg>
                <div className="h-[1px] w-28 lg:w-36 bg-[#BFA16F]/70" />
              </div>

              {/* Welcome Script (rebalanced safely below divider) */}
              <div data-splash-element="welcome" className="absolute top-[75.5%] left-1/2 -translate-x-1/2 w-52 lg:w-60 h-14 lg:h-16">
                <Image
                  src="/media/splash/welcome.png"
                  alt="Welcome"
                  fill
                  priority
                  className="object-contain"
                />
              </div>

              {/* Subtitle */}
              <div data-splash-element="good-food" className="absolute top-[84.5%] left-0 right-0 text-center">
                <p className="font-serif text-[11px] lg:text-xs tracking-[0.35em] text-[#523d2f] uppercase font-normal">
                  GOOD FOOD. BRIGHTER DAYS.
                </p>
              </div>

              {/* Decorative Terminator — Short Static Gold Hairline (SPLASH-008) */}
              <div
                data-splash-element="accent"
                className="absolute top-[88%] left-1/2 -translate-x-1/2 w-16 h-[1px] bg-[#BFA16F]/70"
              />

              {/* Bottom Left: EST. 2025 (SPLASH-009C: rebalanced to 5.0% for visual symmetry) */}
              <div
                data-splash-element="est"
                className="splash-bottom-meta-desktop absolute left-[5.0%] flex flex-col items-start gap-1 text-[#5c493c]"
              >
                <span className="font-serif text-[11px] tracking-[0.25em] uppercase font-light">
                  EST. 2025
                </span>
                <div className="w-8 h-[1px] bg-[#BFA16F]/70" />
              </div>

              {/* Bottom Right: A TASTE OF ITALY ALWAYS (SPLASH-009C: shifted right to 5.0% to occupy target corner area) */}
              <div
                data-splash-element="taste"
                className="splash-bottom-meta-desktop absolute right-[5.0%] text-right font-serif text-[10px] lg:text-[11px] tracking-[0.25em] uppercase leading-[1.6] text-[#5c493c] font-light"
              >
                <p>A TASTE</p>
                <p>OF ITALY</p>
                <p>ALWAYS</p>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 4. OVERLAY LAYER — MOBILE VIEWPORT (< 768px portrait)    */}
          {/* Responsive Content Groups adapting to viewport aspect     */}
          {/* ========================================================= */}
          <div
            className={cn(
              'block md:hidden absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700 z-10',
              showDomOverlay ? 'opacity-100' : 'opacity-0'
            )}
          >
            {/* GROUP A — TOP BRAND GROUP */}
            <div
              className="absolute left-0 right-0 flex flex-col items-center text-center select-none"
              style={{
                top: 'clamp(3rem, 7.5dvh, 4.5rem)',
              }}
            >
              {/* Motto Bar */}
              <p data-splash-element="motto" className="font-condensed text-[10px] tracking-[0.22em] text-[#6b5743] uppercase font-normal mb-[clamp(0.4rem,1.2dvh,0.8rem)]">
                CUCINA &nbsp;&bull;&nbsp; BUONA COMPAGNIA &nbsp;&bull;&nbsp; BELLA VITA
              </p>

              {/* Gema Brand Logo (unclipped source asset preserved) */}
              <div data-splash-element="logo" className="relative w-[56vw] max-w-[240px] h-[clamp(5.5rem,13dvh,8rem)] mb-[clamp(0.4rem,1.2dvh,0.8rem)]">
                <Image
                  src="/media/splash/gema-dark.png"
                  alt="Gema restaurant & societiet"
                  fill
                  priority
                  className="object-contain"
                />
              </div>

              {/* Italian Food block */}
              <div data-splash-element="italian-food" className="flex flex-col items-center gap-1.5 text-center">
                <div className="font-serif text-[10px] tracking-[0.25em] text-[#5a4638] uppercase leading-[1.65] font-light">
                  <p>ITALIAN FOOD</p>
                  <p>BRINGS PEOPLE</p>
                  <p>TOGETHER</p>
                </div>
                <div className="w-10 h-[1px] bg-[#BFA16F]/70 mt-0.5" />
              </div>
            </div>

            {/* LOWER CONTENT SECTION — GROUP B (WELCOME & DECORATIVE TERMINATOR) */}
            {/* Dynamically tracking safely below the background divider across all aspect ratios */}
            <div
              className="absolute left-0 right-0 flex flex-col items-center text-center select-none"
              style={{
                top: 'calc(max(64dvh, 50dvh + 24.8dvw) + clamp(1.2rem, 3.2dvh, 2rem))',
              }}
            >
              {/* Welcome Script */}
              <div data-splash-element="welcome" className="relative w-[38vw] max-w-[175px] h-[clamp(2.5rem,5.5dvh,3.5rem)] mb-1">
                <Image
                  src="/media/splash/welcome.png"
                  alt="Welcome"
                  fill
                  priority
                  className="object-contain"
                />
              </div>

              {/* Subtitle */}
              <p data-splash-element="good-food" className="font-serif text-[10px] tracking-[0.28em] text-[#523d2f] uppercase font-normal mb-1.5">
                GOOD FOOD. BRIGHTER DAYS.
              </p>

              {/* Short static gold hairline terminator */}
              <div data-splash-element="accent" className="w-16 h-[1px] bg-[#BFA16F]/70" />
            </div>

            {/* GROUP D — BOTTOM METADATA (SPLASH-009: Responsive Rebalanced) */}
            <div
              className="splash-bottom-meta-mobile absolute inset-x-0 bottom-0 flex items-end justify-between select-none pointer-events-none"
            >
              {/* Bottom Left: EST. 2025 */}
              <div data-splash-element="est" className="flex flex-col items-start gap-1 text-[#5c493c]">
                <span className="font-serif text-[10px] tracking-[0.22em] uppercase font-light">
                  EST. 2025
                </span>
                <div className="w-7 h-[1px] bg-[#BFA16F]/70" />
              </div>

              {/* Bottom Right: A TASTE OF ITALY ALWAYS */}
              <div data-splash-element="taste" className="text-right font-serif text-[9px] tracking-[0.22em] uppercase leading-[1.5] text-[#5c493c] font-light">
                <p>A TASTE</p>
                <p>OF ITALY</p>
                <p>ALWAYS</p>
              </div>
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
