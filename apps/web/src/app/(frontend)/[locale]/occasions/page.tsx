import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { getPageMedia, getOccasionsPageData } from '@/content/provider';
import OccasionsClient from '@/components/occasions/OccasionsClient';
import { SITE_URL } from '@/lib/siteUrl';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const { t } = getDictionary(locale as Locale);
  const occasionsData = await getOccasionsPageData(locale as Locale);

  const title = occasionsData?.hero.title || t('nav.occasions');
  const description = occasionsData?.hero.subtitle || (locale === 'id' ? 'Santap privat, pernikahan, ulang tahun, dan acara eksklusif di GEMA.' : 'Private dining, weddings, birthdays, and exclusive events at GEMA.');

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/occasions`,
      languages: {
        en: '/en/occasions',
        id: '/id/occasions',
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/occasions`,
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

export default async function OccasionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const [occasionsData, pageMedia] = await Promise.all([
    getOccasionsPageData(locale as Locale),
    getPageMedia(locale as Locale),
  ]);

  return (
    <OccasionsClient 
      locale={locale as Locale} 
      occasionsData={occasionsData} 
      pageMedia={pageMedia} 
    />
  );
}
