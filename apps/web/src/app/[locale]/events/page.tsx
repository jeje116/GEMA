import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { getEvents } from '@/content/provider';
import EventsClient from '@/components/events/EventsClient';

export const revalidate = 3600; // 1-hour bounded staleness ISR window

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const { t } = getDictionary(locale as Locale);

  return {
    title: `${t('nav.events')} — GEMA`,
    description: t('events.title'),
    alternates: {
      canonical: `/${locale}/events`,
      languages: {
        en: '/en/events',
        id: '/id/events',
      },
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
  const events = await getEvents(locale as Locale, { status: 'all' });

  return <EventsClient locale={locale as Locale} events={events} />;
}
