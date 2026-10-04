import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { getEvents, getEventsPageData } from '@/content/provider';
import EventsClient from '@/components/events/EventsClient';
import { SITE_URL } from '@/lib/siteUrl';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const { t } = getDictionary(locale as Locale);
  const eventsPageData = await getEventsPageData(locale as Locale);

  const title = eventsPageData?.title || t('nav.events');
  const description = eventsPageData?.subtitle || t('events.title');

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/events`,
      languages: {
        en: '/en/events',
        id: '/id/events',
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/events`,
      siteName: 'GEMA Restaurant & Societiet',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      images: [
        {
          url: `${SITE_URL}/media/brand/gema-brand-2.png`,
          alt: title,
        },
      ],
    },
  };
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  // Fetch all events (including ongoing, upcoming, and past for archive)
  const [events, eventsPageData] = await Promise.all([
    getEvents(locale as Locale, { status: 'all' }),
    getEventsPageData(locale as Locale),
  ]);

  return <EventsClient locale={locale as Locale} events={events} eventsPageData={eventsPageData} />;
}
