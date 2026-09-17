import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { getOccasionCategories, getPastBrandEvents } from '@/content/provider';
import OccasionsClient from '@/components/occasions/OccasionsClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const { t } = getDictionary(locale as Locale);

  return {
    title: `${t('nav.occasions')} — GEMA`,
    description: 'Private dinings, weddings, birthdays, and exclusive corporate events at GEMA Surabaya.',
    alternates: {
      canonical: `/${locale}/occasions`,
      languages: {
        en: '/en/occasions',
        id: '/id/occasions',
      },
    },
  };
}

export default async function OccasionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const [categories, brandEvents] = await Promise.all([
    getOccasionCategories(),
    getPastBrandEvents(),
  ]);

  return <OccasionsClient locale={locale as Locale} categories={categories} brandEvents={brandEvents} />;
}
