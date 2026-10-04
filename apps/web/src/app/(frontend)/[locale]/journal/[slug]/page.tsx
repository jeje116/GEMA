import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { getJournalEntryBySlug, isJournalLocaleSubstantive, getSiteData } from '@/content/provider';
import JournalDetailClient from '@/components/journal/JournalDetailClient';
import { SITE_URL } from '@/lib/siteUrl';
import { createBreadcrumbJsonLd } from '@/lib/jsonLd';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const entry = await getJournalEntryBySlug(slug, locale as Locale);
  if (!entry) notFound();

  const { l } = getDictionary(locale as Locale);
  const isSubstantive = isJournalLocaleSubstantive(entry, locale as Locale);
  const title = l(entry.title);
  const description = l(entry.excerpt);
  const imageUrl = entry.coverImage
    ? (entry.coverImage.startsWith('http') ? entry.coverImage : `${SITE_URL}${entry.coverImage}`)
    : `${SITE_URL}/media/brand/gema-brand-2.png`;

  // SEO Fallback Rule: If Indonesian translation lacks substance, prevent indexation and canonicalize to English
  if (locale === 'id' && !isSubstantive) {
    return {
      title,
      description,
      robots: {
        index: false,
        follow: true,
      },
      alternates: {
        canonical: `/en/journal/${entry.slug}`,
        languages: {
          en: `/en/journal/${entry.slug}`,
        },
      },
    };
  }

  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `/${locale}/journal/${entry.slug}`,
      languages: {
        en: `/en/journal/${entry.slug}`,
        id: `/id/journal/${entry.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/journal/${entry.slug}`,
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

export default async function JournalDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const [entry, siteData] = await Promise.all([
    getJournalEntryBySlug(slug, locale as Locale),
    getSiteData(locale as Locale),
  ]);
  if (!entry) notFound();

  const { l, t } = getDictionary(locale as Locale);
  const title = l(entry.title);
  const imageUrl = entry.coverImage
    ? (entry.coverImage.startsWith('http') ? entry.coverImage : `${SITE_URL}${entry.coverImage}`)
    : undefined;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: l(entry.excerpt),
    image: imageUrl,
    datePublished: entry.publishDate,
    author: {
      '@type': 'Person',
      name: entry.authorLabel || 'GEMA Sociëteit',
    },
    publisher: {
      '@type': 'Restaurant',
      name: siteData?.name || 'GEMA Restaurant & Societiet',
      url: SITE_URL,
    },
    mainEntityOfPage: `${SITE_URL}/${locale}/journal/${entry.slug}`,
  };

  const breadcrumbsJsonLd = createBreadcrumbJsonLd([
    { name: t('nav.home') || 'Home', url: `${SITE_URL}/${locale}` },
    { name: t('nav.journal') || 'Journal', url: `${SITE_URL}/${locale}/journal` },
    { name: title, url: `${SITE_URL}/${locale}/journal/${entry.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <JournalDetailClient locale={locale as Locale} entry={entry} />
    </>
  );
}
