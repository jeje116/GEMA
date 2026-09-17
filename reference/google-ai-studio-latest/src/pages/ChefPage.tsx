import React from 'react';
import { motion } from 'motion/react';
import PageReveal from '../components/motion/PageReveal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useReducedMotionSafe } from '../hooks/useReducedMotionSafe';
import ResponsiveImage from '../components/media/ResponsiveImage';

export default function ChefPage() {
  const prefersReduced = useReducedMotionSafe();

  useDocumentMeta({
    title: 'Chef Mandif Warokka',
    canonicalPath: '/chef/mandif-warokka'
  });

  return (
    <PageReveal title="Chef Mandif Warokka" className="bg-[var(--ivory-50)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Sticky Image Column */}
          <div className="lg:col-span-5 relative">
            <div className="lg:sticky lg:top-32 w-full aspect-[3/4] overflow-hidden">
              <ResponsiveImage 
                src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80" 
                alt="Chef Mandif Warokka"
                className="w-full h-full"
                imgClassName="grayscale hover:grayscale-0 transition-all duration-1000"
              />
            </div>
          </div>

          {/* Scrolling Text Column */}
          <div className="lg:col-span-7 lg:pt-16">
            
            <motion.h1 
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-5xl md:text-7xl text-[var(--espresso-900)] mb-6"
            >
              Mandif Warokka
            </motion.h1>
            
            <motion.p 
               initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
              className="font-condensed uppercase tracking-widest text-xs text-[var(--terracotta)] mb-12"
            >
              Culinary Director
            </motion.p>

            <div className="prose prose-lg prose-p:text-[var(--muted)] prose-p:leading-relaxed max-w-none mb-16">
              <p>
                With over two decades of culinary experience spanning the globe, Chef Mandif Warokka brings a profound understanding of international techniques and flavor profiles to GEMA.
              </p>
              <p>
                His journey began with a deep appreciation for the fundamental building blocks of European cuisine, which he honed through rigorous training and practice in acclaimed kitchens across Europe and the Middle East before making his mark in Southeast Asia.
              </p>
              <p>
                Known for his meticulous attention to detail and uncompromising standards, Mandif approaches Italian cuisine not merely as a set of traditional recipes, but as a philosophy of ingredient respect.
              </p>
            </div>

            <motion.blockquote 
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              className="font-serif text-3xl md:text-4xl text-[var(--terracotta-dark)] italic leading-relaxed py-12 px-8 border-l border-[var(--terracotta)] mb-16"
            >
              "Surabaya has a vibrant, sophisticated palate. GEMA is my response to that—a place where technique serves comfort, and every dish is crafted for the table."
            </motion.blockquote>

            <div className="prose prose-lg prose-p:text-[var(--muted)] prose-p:leading-relaxed max-w-none">
              <p>
                At GEMA, he translates this philosophy into a menu that is both elevated and approachable. By insisting on the finest produce and refusing shortcuts, he ensures that every plate leaving the kitchen is a testament to culinary craftsmanship.
              </p>
            </div>

          </div>

        </div>

      </div>
    </PageReveal>
  );
}
