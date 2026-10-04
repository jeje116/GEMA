import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { getEventBySlug } from '@/content/provider';
import EventDetailClient from '@/components/events/EventDetailClient';
import { SITE_URL } from '@/lib/siteUrl';
import { createEventJsonLd, createBreadcrumbJsonLd } from '@/lib/jsonLd';

export const dynamic = 'force-dynamic';

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
  const title = l(event.title);
  const description = l(event.shortDescription) || l(event.fullDescription);
  const imageUrl = event.coverImage
    ? (event.coverImage.startsWith('http') ? event.coverImage : `${SITE_URL}${event.coverImage}`)
    : `${SITE_URL}/media/brand/gema-brand-2.png`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/events/${event.slug}`,
      languages: {
        en: `/en/events/${event.slug}`,
        id: `/id/events/${event.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/events/${event.slug}`,
      siteName: 'GEMA Restaurant & Societiet',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      images: [
        {
          url: imageUrl,
          alt: title,
        },
      ],
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

  const { l, t } = getDictionary(locale as Locale);
  const title = l(event.title);
  const imageUrl = event.coverImage
    ? (event.coverImage.startsWith('http') ? event.coverImage : `${SITE_URL}${event.coverImage}`)
    : undefined;

  const eventJsonLd = createEventJsonLd({
    name: title,
    description: l(event.shortDescription) || l(event.fullDescription),
    startDate: event.startDateTime,
    endDate: event.endDateTime || undefined,
    url: `${SITE_URL}/${locale}/events/${event.slug}`,
    image: imageUrl,
  });

  const breadcrumbsJsonLd = createBreadcrumbJsonLd([
    { name: t('nav.home') || 'Home', url: `${SITE_URL}/${locale}` },
    { name: t('nav.events') || 'Events', url: `${SITE_URL}/${locale}/events` },
    { name: title, url: `${SITE_URL}/${locale}/events/${event.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <EventDetailClient locale={locale as Locale} event={event} />
    </>
  );
}
