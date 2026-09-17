import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { getRecognitions } from '@/content/provider';
import RecognitionClient from '@/components/recognition/RecognitionClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const { t } = getDictionary(locale as Locale);

  return {
    title: `${t('nav.recognition')} — GEMA`,
    description: 'Critical reception, culinary awards, and notable press mentions for GEMA Surabaya.',
    alternates: {
      canonical: `/${locale}/recognition`,
      languages: {
        en: '/en/recognition',
        id: '/id/recognition',
      },
    },
  };
}

export default async function RecognitionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const recognitions = await getRecognitions();

  return <RecognitionClient locale={locale as Locale} recognitions={recognitions} />;
}
