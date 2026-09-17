'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';
import { cn } from '@/lib/utils';

interface PageRevealProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export default function PageReveal({ children, className, title }: PageRevealProps) {
  const prefersReduced = useReducedMotionSafe();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <>
      {/* The Branded Transition Overlay Curtain */}
      <motion.div
        initial={{ y: '0%' }}
        animate={{ y: '-100%' }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        className="fixed inset-0 z-[60] bg-[var(--espresso-900)] flex flex-col items-center justify-center pointer-events-none px-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-[310px] md:w-[400px] h-28 md:h-36 flex items-center justify-center overflow-visible"
        >
          <Image
            src="/media/brand/gema-logo-light.png"
            alt="GEMA"
            width={400}
            height={400}
            priority
            className="w-[310px] md:w-[400px] h-auto object-contain"
          />
        </motion.div>
        {title && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.25, delay: 0.15 }}
            className="font-serif text-2xl md:text-3xl text-[var(--ivory-100)] mt-4 tracking-wide text-center"
          >
            {title}
          </motion.div>
        )}
      </motion.div>

      {/* The Page Content Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.35 }}
        className={cn('w-full', className)}
      >
        {children}
      </motion.div>
    </>
  );
}
