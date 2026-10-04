import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { getJournalEntries, getJournalPageData } from '@/content/provider';
import JournalClient from '@/components/journal/JournalClient';

import { SITE_URL } from '@/lib/siteUrl';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const { t } = getDictionary(locale as Locale);
  const journalPageData = await getJournalPageData(locale as Locale);

  const title = journalPageData?.title || t('nav.journal');
  const description = journalPageData?.subtitle || (locale === 'id' ? 'Cerita, resep, refleksi musiman, dan warisan kuliner dari GEMA Surabaya.' : 'Stories, recipes, seasonal reflections, and culinary heritage from GEMA Surabaya.');

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/journal`,
      languages: {
        en: '/en/journal',
        id: '/id/journal',
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/journal`,
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

export default async function JournalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const [entries, journalPageData] = await Promise.all([
    getJournalEntries(locale as Locale),
    getJournalPageData(locale as Locale),
  ]);

  return <JournalClient locale={locale as Locale} entries={entries} journalPageData={journalPageData} />;
}
