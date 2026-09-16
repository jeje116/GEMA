import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import PageReveal from '../components/motion/PageReveal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useLanguage } from '../i18n/LanguageProvider';
import { useReducedMotionSafe } from '../hooks/useReducedMotionSafe';
import { events, getEventState } from '../data/events';
import ResponsiveImage from '../components/media/ResponsiveImage';
import { formatDate } from '../i18n/LanguageProvider';

export default function EventsPage() {
  const { t, l, language } = useLanguage();
  const prefersReduced = useReducedMotionSafe();

  useDocumentMeta({
    title: t('nav.events'),
    description: t('events.title'),
    canonicalPath: '/events'
  });

  const allEvents = events.map(e => ({ event: e, state: getEventState(e) }));
  const ongoing = allEvents.filter(e => e.state === 'ongoing').map(e => e.event);
  const upcoming = allEvents.filter(e => e.state === 'upcoming').map(e => e.event).sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());
  const past = allEvents.filter(e => e.state === 'past').map(e => e.event).sort((a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime());

  const EventCard = ({ event, stateLabel }: { event: any, stateLabel?: string }) => (
    <Link to={`/events/${event.slug}`} className="group block">
      <div className="aspect-video w-full overflow-hidden mb-6 relative">
        <ResponsiveImage 
          src={event.coverImage} 
          alt={l(event.title)}
          className="w-full h-full transform group-hover:scale-[1.025] transition-transform duration-700"
        />
        {stateLabel && (
          <div className="absolute top-4 left-4 bg-[var(--ink)] text-white px-3 py-1 text-[10px] font-condensed tracking-widest uppercase">
            {stateLabel}
          </div>
        )}
      </div>
      <div>
        <p className="font-condensed tracking-widest text-xs uppercase text-[var(--terracotta)] mb-2">
          {l(event.eyebrow)}
        </p>
        <h3 className="font-serif text-2xl md:text-3xl text-[var(--espresso-900)] mb-2 group-hover:text-[var(--terracotta-dark)] transition-colors">
          {l(event.title)}
        </h3>
        <p className="font-condensed tracking-wide text-sm text-[var(--muted)] mb-3">
          {formatDate(event.startDateTime, language)}
        </p>
        <p className="text-[var(--muted)] line-clamp-2 text-sm">
          {l(event.shortDescription)}
        </p>
      </div>
    </Link>
  );

  return (
    <PageReveal title={t('nav.events')} className="bg-[var(--ivory-50)] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mb-24">
          <h1 className="font-serif text-5xl md:text-7xl text-[var(--espresso-900)] mb-6">
            {t('nav.events')}
          </h1>
          <p className="text-[var(--muted)] text-lg">
            {t('events.title')}
          </p>
        </div>

        {ongoing.length > 0 && (
          <section className="mb-24">
            <div className="flex items-center gap-3 mb-8 border-b border-[var(--ivory-200)] pb-4">
               {!prefersReduced && (
                <motion.div 
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="w-2 h-2 rounded-full bg-[var(--terracotta)]"
                />
              )}
              <h2 className="font-condensed uppercase tracking-widest text-sm text-[var(--espresso-900)]">
                {t('events.now')}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {ongoing.map(evt => <EventCard key={evt.id} event={evt} />)}
            </div>
          </section>
        )}

        {upcoming.length > 0 && (
          <section className="mb-24">
            <h2 className="font-condensed uppercase tracking-widest text-sm text-[var(--espresso-900)] mb-8 border-b border-[var(--ivory-200)] pb-4">
              {t('events.upcoming')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {upcoming.map(evt => <EventCard key={evt.id} event={evt} />)}
            </div>
          </section>
        )}

        {past.length > 0 && (
          <section>
            <h2 className="font-condensed uppercase tracking-widest text-sm text-[var(--muted)] mb-8 border-b border-[var(--ivory-200)] pb-4">
              {t('events.past')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {past.map(evt => <EventCard key={evt.id} event={evt} />)}
            </div>
          </section>
        )}

      </div>
    </PageReveal>
  );
}
