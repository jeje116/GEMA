import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageProvider';
import { useReducedMotionSafe } from '../../hooks/useReducedMotionSafe';
import { events, getEventState } from '../../data/events';
import ResponsiveImage from '../../components/media/ResponsiveImage';
import { formatDate } from '../../i18n/LanguageProvider';

export default function EventsPreview() {
  const { t, l, language } = useLanguage();
  const prefersReduced = useReducedMotionSafe();

  const { ongoingEvent, upcomingEvents } = useMemo(() => {
    const allStates = events.map(e => ({ event: e, state: getEventState(e) }));
    
    // Find ongoing
    const ongoing = allStates.find(e => e.state === 'ongoing')?.event;
    
    // Find upcoming and sort by nearest
    const upcoming = allStates
      .filter(e => e.state === 'upcoming')
      .map(e => e.event)
      .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime());

    return { ongoingEvent: ongoing, upcomingEvents: upcoming };
  }, []);

  if (!ongoingEvent && upcomingEvents.length === 0) {
    return null; // Hide completely
  }

  const hasOngoing = !!ongoingEvent;
  const sectionTitle = hasOngoing ? t('home.events.now') : t('home.events.upcoming');
  const displayEvents = hasOngoing 
    ? [ongoingEvent, upcomingEvents[0]].filter(Boolean)
    : upcomingEvents.slice(0, 2);

  return (
    <section className="py-24 md:py-32 bg-[var(--white)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex justify-between items-end mb-16">
          <div className="flex items-center gap-4">
            {hasOngoing && !prefersReduced && (
              <motion.div 
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="w-2 h-2 rounded-full bg-[var(--terracotta)] mb-2"
              />
            )}
            <h2 className="font-serif text-3xl md:text-5xl text-[var(--espresso-900)]">
              {sectionTitle}
            </h2>
          </div>
          <Link 
            to="/events"
            className="font-condensed tracking-widest text-xs uppercase hover:text-[var(--terracotta)] transition-colors border-b border-transparent hover:border-[var(--terracotta)] pb-1"
          >
            {t('home.events.cta')}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {displayEvents.map((evt, idx) => (
            <motion.div
              key={evt.id}
              initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="group"
            >
              <Link to={`/events/${evt.slug}`} className="block overflow-hidden relative aspect-[4/3] mb-6">
                <ResponsiveImage 
                  src={evt.coverImage} 
                  alt={l(evt.title)}
                  className="w-full h-full transform group-hover:scale-[1.025] transition-transform duration-700"
                />
              </Link>
              <div>
                <p className="font-condensed tracking-widest text-xs uppercase text-[var(--terracotta)] mb-2">
                  {l(evt.eyebrow)}
                </p>
                <h3 className="font-serif text-2xl md:text-3xl text-[var(--espresso-900)] mb-3 group-hover:text-[var(--terracotta-dark)] transition-colors">
                  {l(evt.title)}
                </h3>
                <p className="font-condensed tracking-wide text-sm text-[var(--muted)] mb-4">
                  {formatDate(evt.startDateTime, language)}
                </p>
                <p className="text-[var(--muted)] line-clamp-2">
                  {l(evt.shortDescription)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
