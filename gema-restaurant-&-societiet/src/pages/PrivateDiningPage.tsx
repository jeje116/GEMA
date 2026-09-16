import React from 'react';
import { motion } from 'motion/react';
import PageReveal from '../components/motion/PageReveal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useReducedMotionSafe } from '../hooks/useReducedMotionSafe';
import { useUI } from '../components/shared/UIContext';
import ResponsiveImage from '../components/media/ResponsiveImage';

export default function PrivateDiningPage() {
  const prefersReduced = useReducedMotionSafe();
  const { openReservation } = useUI();

  useDocumentMeta({
    title: 'Private Dining',
    canonicalPath: '/private-dining'
  });

  return (
    <PageReveal title="Private Dining" className="bg-[var(--ivory-50)] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h1 className="font-serif text-5xl md:text-7xl text-[var(--espresso-900)] mb-6">
            Private Dining
          </h1>
          <p className="text-[var(--muted)] text-lg">
            For intimate gatherings, business dinners, and special celebrations, GEMA offers exclusive spaces tailored to your needs.
          </p>
        </div>

        {/* Main Image */}
        <motion.div 
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="aspect-video w-full mb-24"
        >
          <ResponsiveImage 
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80" 
            alt="Private dining room"
          />
        </motion.div>

        {/* Spaces */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          <div>
            <h2 className="font-serif text-3xl text-[var(--espresso-900)] mb-4">The Wine Room</h2>
            <div className="font-condensed uppercase tracking-widest text-xs text-[var(--terracotta)] mb-6">Up to 12 Guests</div>
            <p className="text-[var(--muted)] mb-8">
              Surrounded by our curated wine collection, this semi-private space offers an intimate atmosphere while remaining connected to the energy of the main dining room. Ideal for celebrations and business dinners.
            </p>
            <button 
              onClick={openReservation}
              className="border-b border-[var(--ink)] font-condensed tracking-widest uppercase text-xs hover:text-[var(--terracotta)] hover:border-[var(--terracotta)] transition-colors pb-1"
            >
              Request The Wine Room
            </button>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-[var(--espresso-900)] mb-4">The Societiet Lounge</h2>
            <div className="font-condensed uppercase tracking-widest text-xs text-[var(--terracotta)] mb-6">Up to 30 Guests</div>
            <p className="text-[var(--muted)] mb-8">
              A fully private room featuring dedicated service, customizable lighting, and AV capabilities. The Societiet Lounge provides a discreet environment for larger gatherings, corporate events, and milestone celebrations.
            </p>
            <button 
              onClick={openReservation}
              className="border-b border-[var(--ink)] font-condensed tracking-widest uppercase text-xs hover:text-[var(--terracotta)] hover:border-[var(--terracotta)] transition-colors pb-1"
            >
              Request The Lounge
            </button>
          </div>
        </div>

        {/* Full Buyout */}
        <div className="bg-[var(--ink)] text-white p-12 md:p-24 text-center flex flex-col items-center">
          <h2 className="font-serif text-4xl mb-6">Full Restaurant Buyout</h2>
          <p className="max-w-2xl text-[var(--ivory-200)] mb-12">
            For large-scale events, weddings, and exclusive corporate functions, GEMA is available for complete buyouts, accommodating up to 120 guests seated or 150 for standing receptions. Our culinary team will work with you to design a bespoke menu and experience.
          </p>
          <button 
             onClick={openReservation}
            className="px-8 py-3 border border-white text-white font-condensed tracking-widest uppercase text-sm hover:bg-white hover:text-[var(--ink)] transition-colors inline-block"
          >
            Inquire About Buyouts
          </button>
        </div>

      </div>
    </PageReveal>
  );
}
