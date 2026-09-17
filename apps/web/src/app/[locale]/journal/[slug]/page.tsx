import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, LOCALES, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { getJournalEntries, getJournalEntryBySlug, isJournalLocaleSubstantive } from '@/content/provider';
import JournalDetailClient from '@/components/journal/JournalDetailClient';

export async function generateStaticParams() {
  const entries = await getJournalEntries('en');
  const params: { locale: string; slug: string }[] = [];

  for (const locale of LOCALES) {
    for (const entry of entries) {
      params.push({ locale, slug: entry.slug });
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

  const entry = await getJournalEntryBySlug(slug, locale as Locale);
  if (!entry) notFound();

  const { l } = getDictionary(locale as Locale);
  const isSubstantive = isJournalLocaleSubstantive(entry, locale as Locale);

  // SEO Fallback Rule: If Indonesian translation lacks substance, prevent indexation and canonicalize to English
  if (locale === 'id' && !isSubstantive) {
    return {
      title: `${l(entry.title)} — GEMA Journal`,
      description: l(entry.excerpt),
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
    title: `${l(entry.title)} — GEMA Journal`,
    description: l(entry.excerpt),
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
      title: l(entry.title),
      description: l(entry.excerpt),
      images: [entry.coverImage],
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

  const entry = await getJournalEntryBySlug(slug, locale as Locale);
  if (!entry) notFound();

  const { l } = getDictionary(locale as Locale);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: l(entry.title),
    description: l(entry.excerpt),
    image: entry.coverImage,
    datePublished: entry.publishDate,
    author: {
      '@type': 'Person',
      name: entry.authorLabel || 'GEMA Sociëteit',
    },
    publisher: {
      '@type': 'Restaurant',
      name: 'GEMA — Indonesian Fine Dining & Sociëteit',
      url: 'https://gemasurabaya.com',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <JournalDetailClient locale={locale as Locale} entry={entry} />
    </>
  );
}
