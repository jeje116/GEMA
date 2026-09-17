'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { useUI } from '@/components/shared/UIContext';
import { cn } from '@/lib/utils';
import { VolumeX } from 'lucide-react';
import { audioManager } from '@/lib/audioManager';

export default function AudioControl({ locale }: { locale: Locale }) {
  const [show, setShow] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const { t } = getDictionary(locale);
  const prefersReduced = useReducedMotionSafe();
  const { isGatewayEntered } = useUI();

  // Subscribe to real audio playback state
  useEffect(() => {
    const unsubscribe = audioManager.subscribe((state) => {
      setIsPlaying(state.isPlaying);
    });
    return unsubscribe;
  }, []);

  // Show control after gateway exit delay
  useEffect(() => {
    if (isGatewayEntered) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isGatewayEntered]);

  const toggleAudio = () => {
    const willPlay = !isPlaying;
    audioManager.toggle();
    if (willPlay) {
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-40 flex flex-col items-end gap-2">
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="bg-[var(--ink)] text-white text-xs px-3 py-1.5 rounded-sm font-condensed tracking-wide shadow-md"
          >
            {t('audio.toast')}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <motion.button
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          onClick={toggleAudio}
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 cursor-pointer',
            'bg-[var(--ivory-50)] text-[var(--ink)] border border-[var(--ivory-200)] shadow-sm',
            'hover:bg-[var(--ivory-100)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus'
          )}
          aria-label={isPlaying ? t('audio.off') : t('audio.on')}
          title={isPlaying ? t('audio.off') : t('audio.on')}
        >
          {isPlaying ? (
            <div className="flex items-end justify-center gap-[2px] h-4">
              <motion.div
                animate={!prefersReduced ? { height: ['4px', '12px', '4px'] } : {}}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                className="w-1 bg-current rounded-full"
              />
              <motion.div
                animate={!prefersReduced ? { height: ['12px', '6px', '12px'] } : {}}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                className="w-1 bg-current rounded-full"
              />
              <motion.div
                animate={!prefersReduced ? { height: ['6px', '14px', '6px'] } : {}}
                transition={{ repeat: Infinity, duration: 2.0, ease: 'easeInOut' }}
                className="w-1 bg-current rounded-full"
              />
            </div>
          ) : (
            <VolumeX className="w-5 h-5 opacity-70" />
          )}
        </motion.button>

        {!prefersReduced && (
          <motion.div
            initial={{ opacity: 0.3, scale: 1 }}
            animate={{ opacity: 0, scale: 1.35 }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 1 }}
            className="absolute inset-0 rounded-full border border-[var(--ink)] pointer-events-none"
          />
        )}
      </div>
    </div>
  );
}
