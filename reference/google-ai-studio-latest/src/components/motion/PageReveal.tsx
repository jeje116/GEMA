import React from 'react';
import { motion } from 'motion/react';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import { cn } from '../../lib/utils';

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
      {/* The Curtain */}
      <motion.div
        initial={{ y: '0%' }}
        animate={{ y: '-100%' }}
        transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        className="fixed inset-0 z-[60] bg-[var(--espresso-900)] flex items-center justify-center pointer-events-none"
      >
        {title && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="font-serif text-3xl md:text-5xl text-[var(--ivory-100)]"
          >
            {title}
          </motion.div>
        )}
      </motion.div>

      {/* The Page Content Reveal */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        className={cn("w-full", className)}
      >
        {children}
      </motion.div>
    </>
  );
}
