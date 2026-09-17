import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { getJournalEntries } from '@/content/provider';
import JournalClient from '@/components/journal/JournalClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const { t } = getDictionary(locale as Locale);

  return {
    title: `${t('nav.journal')} — GEMA`,
    description: 'Stories, recipes, seasonal reflections, and culinary heritage from GEMA Surabaya.',
    alternates: {
      canonical: `/${locale}/journal`,
      languages: {
        en: '/en/journal',
        id: '/id/journal',
      },
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

  const entries = await getJournalEntries(locale as Locale);

  return <JournalClient locale={locale as Locale} entries={entries} />;
}
