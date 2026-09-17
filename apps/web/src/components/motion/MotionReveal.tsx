'use client';

import React, { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { useReducedMotionSafe } from '@/hooks/useReducedMotionSafe';

interface MotionRevealProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export default function MotionReveal({
  children,
  delay = 0,
  direction = 'up',
  className,
  ...props
}: MotionRevealProps) {
  const prefersReduced = useReducedMotionSafe();

  const getInitialOffset = () => {
    if (prefersReduced || direction === 'none') return { x: 0, y: 0 };
    switch (direction) {
      case 'up': return { x: 0, y: 30 };
      case 'down': return { x: 0, y: -30 };
      case 'left': return { x: 30, y: 0 };
      case 'right': return { x: -30, y: 0 };
    }
  };

  const offset = getInitialOffset();

  return (
    <motion.div
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
