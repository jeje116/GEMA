import React, { useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import { cn } from '../../lib/utils';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'landscape' | 'auto';
  parallax?: boolean;
  maskReveal?: boolean;
}

export default function ResponsiveImage({ 
  src, 
  alt, 
  className, 
  imgClassName,
  aspectRatio = 'auto',
  parallax = false,
  maskReveal = false
}: ResponsiveImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const prefersReduced = useReducedMotionSafe();

  const aspectClasses = {
    'video': 'aspect-video',
    'square': 'aspect-square',
    'portrait': 'aspect-[3/4]',
    'landscape': 'aspect-[4/3]',
    'auto': ''
  };

  return (
    <div className={cn("relative overflow-hidden bg-[var(--ivory-200)]", aspectClasses[aspectRatio], className)}>
      
      {/* Mask Reveal */}
      {!prefersReduced && maskReveal && (
        <motion.div
          initial={{ y: '0%' }}
          whileInView={{ y: '-100%' }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-0 z-10 bg-[var(--ivory-100)] pointer-events-none"
        />
      )}

      {/* Fallback pattern if image fails */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20zM20 0h20v20H20V0z" fill="currentColor" fillOpacity="0.05" fillRule="evenodd"/>
          </svg>
        </div>
      )}

      {/* The Image */}
      {!error && (
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          initial={prefersReduced ? {} : { scale: 1.1, opacity: 0 }}
          animate={loaded ? (prefersReduced ? { opacity: 1 } : { scale: 1, opacity: 1 }) : {}}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-700",
            !loaded && "opacity-0",
            imgClassName
          )}
        />
      )}
    </div>
  );
}
