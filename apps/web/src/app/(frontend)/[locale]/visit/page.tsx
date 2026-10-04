import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { getSiteData, getVisitPageData } from '@/content/provider';
import VisitClient from '@/components/visit/VisitClient';
import { SITE_URL } from '@/lib/siteUrl';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const { t } = getDictionary(locale as Locale);
  const [siteData, visitData] = await Promise.all([
    getSiteData(locale as Locale),
    getVisitPageData(locale as Locale),
  ]);

  const address = siteData.fullAddress;
  const description = locale === 'id'
    ? `Kunjungi GEMA di ${address}. Lokasi, petunjuk arah, dan panduan reservasi.`
    : `Visit GEMA at ${address}. Location, directions, and reservation guidelines.`;
  const title = visitData?.title || t('nav.visit');

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/visit`,
      languages: {
        en: '/en/visit',
        id: '/id/visit',
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/visit`,
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

export default async function VisitPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const [siteData, visitData] = await Promise.all([
    getSiteData(locale as Locale),
    getVisitPageData(locale as Locale),
  ]);

  return (
    <VisitClient 
      locale={locale as Locale} 
      siteData={siteData} 
      visitData={visitData} 
    />
  );
}
