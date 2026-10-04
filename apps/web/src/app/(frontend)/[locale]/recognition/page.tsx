import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getRecognitions, getRecognitionPageData } from '@/content/provider';
import RecognitionClient from '@/components/recognition/RecognitionClient';
import { SITE_URL } from '@/lib/siteUrl';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const recognitionData = await getRecognitionPageData(locale as Locale);
  const title = recognitionData?.title || 'Recognition';
  const description = recognitionData?.subtitle || (locale === 'id' ? 'Pengakuan kritis, penghargaan kuliner, dan liputan media untuk GEMA Surabaya.' : 'Critical reception, culinary awards, and notable press mentions for GEMA Surabaya.');

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/recognition`,
      languages: {
        en: '/en/recognition',
        id: '/id/recognition',
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/recognition`,
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

export default async function RecognitionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const [recognitions, recognitionData] = await Promise.all([
    getRecognitions(locale as Locale),
    getRecognitionPageData(locale as Locale),
  ]);

  return (
    <RecognitionClient 
      locale={locale as Locale} 
      recognitions={recognitions} 
      recognitionData={recognitionData} 
    />
  );
}
