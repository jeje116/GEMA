import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageProvider';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import { useUI } from '../shared/UIContext';
import { cn } from '../../lib/utils';

type GatewayState = 'loading' | 'ready' | 'idle' | 'exiting' | 'entered';

export default function GatewayExperience() {
  const [state, setState] = useState<GatewayState>('loading');
  const location = useLocation();
  const { t } = useLanguage();
  const prefersReduced = useReducedMotionSafe();
  const isMounted = useRef(true);
  const { isGatewayEntered, setGatewayEntered } = useUI();

  // Determine if it should show
  useEffect(() => {
    isMounted.current = true;
    if (isGatewayEntered || location.pathname !== '/') {
      setState('entered');
      // Ensure we flag it as entered if they navigate away directly
      if (!isGatewayEntered) {
        setGatewayEntered();
      }
    } else {
      setState('loading');
      // Lock body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      isMounted.current = false;
      document.body.style.overflow = '';
    };
  }, [location.pathname, isGatewayEntered, setGatewayEntered]);

  // Sequence orchestration
  useEffect(() => {
    if (state !== 'loading' || prefersReduced) {
      if (state === 'loading' && prefersReduced) {
        setState('idle'); // Skip animation if reduced motion
      }
      return;
    }

    // Advance to idle state after the drawing sequence
    const timer = setTimeout(() => {
      if (isMounted.current && state === 'loading') {
        setState('idle');
      }
    }, 2800); // 2.8s total animation time

    return () => clearTimeout(timer);
  }, [state, prefersReduced]);

  const handleEnter = () => {
    if (state === 'entered') return;
    
    // Set state immediately to trigger AnimatePresence exit
    setState('entered');
    setGatewayEntered();
    document.body.style.overflow = '';
    
    // Focus the main content for accessibility after the animation completes
    setTimeout(() => {
      if (isMounted.current) {
        const main = document.getElementById('main-content');
        if (main) {
          main.focus();
        }
      }
    }, 600); // 600ms exit transition
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleEnter();
    }
  };

  if (state === 'entered') return null;

  return (
    <AnimatePresence>
      {state !== 'entered' && (
        <motion.button
          type="button"
          aria-label="Enter GEMA website"
          onClick={handleEnter}
          onKeyDown={handleKeyDown}
          initial={{ opacity: 1, y: 0 }}
          exit={{ 
            opacity: 0,
            y: '-100%' // Slide up like an ink curtain
          }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className={cn(
            "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--ivory-50)] cursor-pointer outline-none border-none",
            "focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-focus"
          )}
        >
          {/* Main Container */}
          <div className="relative flex flex-col items-center w-full max-w-4xl px-4 pointer-events-none">
            
            {/* Wordmark (0-1200ms) */}
            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: prefersReduced ? 0 : 0.2, duration: 1, ease: "easeOut" }}
              className="mb-8 md:mb-12"
            >
              <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl tracking-wide text-[#24150f] font-medium text-center">
                GEMA
              </h1>
              <p className="font-condensed tracking-[0.2em] text-xs md:text-sm text-[#352018] mt-2 uppercase text-center">
                Restaurant & Societiet
              </p>
            </motion.div>

            {/* Line Art Scene (700-2200ms) */}
            <motion.div 
              className="w-full max-w-2xl aspect-video relative flex items-center justify-center"
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: prefersReduced ? 0 : 0.7, duration: 1.5 }}
            >
              <svg viewBox="0 0 800 450" fill="none" stroke="#000000" strokeWidth="1.5" className="w-full h-full">
                {/* Arch elements */}
                <motion.path 
                  initial={prefersReduced ? { pathLength: 1 } : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: prefersReduced ? 0 : 0.7, duration: 1.2, ease: "easeInOut" }}
                  d="M100,400 L100,200 A150,150 0 0,1 400,200 L400,400 M500,400 L500,250 A100,100 0 0,1 700,250 L700,400" 
                />
                
                {/* Counter / Bar */}
                <motion.path
                  initial={prefersReduced ? { pathLength: 1 } : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: prefersReduced ? 0 : 1.0, duration: 1 }}
                  d="M200,320 L750,320 L750,380 L200,380 Z M250,320 L250,280"
                />

                {/* Hanging lights / foliage */}
                <motion.path
                  initial={prefersReduced ? { pathLength: 1 } : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: prefersReduced ? 0 : 1.2, duration: 1 }}
                  d="M150,50 L150,150 M300,30 L300,120 M600,40 L600,140 M550,140 A20,20 0 1,1 590,140 M140,150 A10,10 0 1,1 160,150"
                />
                
                {/* Hospitality actions (1400-2800ms) - e.g. a chef figure */}
                <motion.path
                  initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: prefersReduced ? 0 : 1.5, duration: 1 }}
                  d="M280,250 Q285,220 290,250 L285,320 M290,250 L310,270"
                  strokeWidth="2"
                />

                {/* Guest figures */}
                <motion.path
                  initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: prefersReduced ? 0 : 1.8, duration: 1 }}
                  d="M450,280 Q455,250 460,280 L455,380 M520,290 Q525,260 530,290 L525,380"
                  strokeWidth="1.5"
                />
              </svg>
            </motion.div>

            {/* Enter Instruction (1800ms+) */}
            <motion.div
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: prefersReduced ? 0 : 1.8, duration: 1 }}
              className="mt-12 text-[#756d64] font-condensed tracking-widest text-sm uppercase flex flex-col items-center gap-2"
            >
              <span className="hidden sm:inline">{t('gateway.enter.pointer')}</span>
              <span className="sm:hidden">{t('gateway.enter.touch')}</span>
              {/* Subtle animated dot */}
              {!prefersReduced && (
                <motion.div 
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="w-1.5 h-1.5 rounded-full bg-[#756d64] mt-2"
                />
              )}
            </motion.div>

          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
