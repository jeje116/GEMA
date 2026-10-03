import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, LOCALES, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { getEventBySlug, getEvents } from '@/content/provider';
import EventDetailClient from '@/components/events/EventDetailClient';

export const revalidate = 3600; // 1-hour bounded staleness ISR window

export async function generateStaticParams() {
  const events = await getEvents('en', { status: 'all' });
  const params: { locale: string; slug: string }[] = [];

  for (const locale of LOCALES) {
    for (const evt of events) {
      params.push({ locale, slug: evt.slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const event = await getEventBySlug(slug, locale as Locale, false);
  if (!event) notFound();

  const { l } = getDictionary(locale as Locale);

  return {
    title: `${l(event.title)} — GEMA`,
    description: l(event.shortDescription),
    alternates: {
      canonical: `/${locale}/events/${event.slug}`,
      languages: {
        en: `/en/events/${event.slug}`,
        id: `/id/events/${event.slug}`,
      },
    },
    openGraph: {
      title: l(event.title),
      description: l(event.shortDescription),
      images: [event.coverImage],
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const event = await getEventBySlug(slug, locale as Locale, false);
  if (!event) notFound();

  return <EventDetailClient locale={locale as Locale} event={event} />;
}
