import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import PageReveal from '../components/motion/PageReveal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useLanguage, formatDate, formatTime } from '../i18n/LanguageProvider';
import { useReducedMotionSafe } from '../hooks/useReducedMotionSafe';
import { useUI } from '../components/shared/UIContext';
import { events, getEventState } from '../data/events';
import ResponsiveImage from '../components/media/ResponsiveImage';
import Markdown from 'react-markdown';

export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, l, language } = useLanguage();
  const prefersReduced = useReducedMotionSafe();
  const { openReservation } = useUI();

  const event = events.find(e => e.slug === slug);
  
  if (!event) {
    return <Navigate to="/404" replace />;
  }

  useDocumentMeta({
    title: l(event.title),
    description: l(event.shortDescription),
    canonicalPath: `/events/${event.slug}`
  });

  const state = getEventState(event);
  const isPast = state === 'past';

  return (
    <PageReveal title={l(event.title)} className="bg-[var(--ivory-50)] min-h-screen">
      
      {/* Hero Image */}
      <div className="w-full h-[50vh] md:h-[70vh] relative">
        <ResponsiveImage 
          src={event.coverImage} 
          alt={l(event.title)}
          className="w-full h-full"
          imgClassName="brightness-[0.8]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/80 via-transparent to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white max-w-7xl mx-auto">
          <p className="font-condensed tracking-widest text-xs uppercase text-[var(--terracotta)] mb-4">
            {l(event.eyebrow)}
          </p>
          <h1 className="font-serif text-4xl md:text-6xl max-w-3xl mb-4">
            {l(event.title)}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="prose prose-lg prose-headings:font-serif prose-headings:text-[var(--espresso-900)] prose-p:text-[var(--muted)] prose-a:text-[var(--terracotta)] max-w-none">
              <Markdown>{l(event.fullDescription)}</Markdown>
            </div>
          </div>

          {/* Sidebar / Meta */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 bg-white p-8 border border-[var(--ivory-200)] flex flex-col gap-8">
              
              <div>
                <h3 className="font-condensed tracking-widest text-xs uppercase text-[var(--muted)] mb-2">Date</h3>
                <p className="text-[var(--espresso-900)]">
                  {formatDate(event.startDateTime, language)}
                  {event.endDateTime && ` - ${formatDate(event.endDateTime, language)}`}
                </p>
              </div>

              <div>
                <h3 className="font-condensed tracking-widest text-xs uppercase text-[var(--muted)] mb-2">Time</h3>
                <p className="text-[var(--espresso-900)]">
                  {formatTime(event.startDateTime, language)}
                  {event.endDateTime && ` to ${formatTime(event.endDateTime, language)}`}
                </p>
              </div>

              {event.priceLabel && (
                <div>
                  <h3 className="font-condensed tracking-widest text-xs uppercase text-[var(--muted)] mb-2">Price</h3>
                  <p className="text-[var(--espresso-900)]">{l(event.priceLabel)}</p>
                </div>
              )}

              <div className="pt-6 border-t border-[var(--ivory-200)]">
                {isPast ? (
                  <p className="text-sm font-condensed tracking-widest text-[var(--muted)] uppercase text-center bg-[var(--ivory-100)] py-3">
                    Event Concluded
                  </p>
                ) : (
                  <button 
                    onClick={openReservation}
                    className="w-full bg-[var(--ink)] text-white py-4 font-condensed tracking-widest uppercase text-sm hover:bg-[var(--espresso-800)] transition-colors"
                  >
                    Request Reservation
                  </button>
                )}
              </div>
              
            </div>
          </div>

        </div>
      </div>

    </PageReveal>
  );
}
