import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { getSiteData } from '@/content/provider';
import VisitClient from '@/components/visit/VisitClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const { t } = getDictionary(locale as Locale);

  return {
    title: `${t('nav.visit')} — GEMA`,
    description: 'Visit GEMA at Jl. Musi No. 21, Tegalsari, Surabaya. Opening hours, directions, and reservation guidelines.',
    alternates: {
      canonical: `/${locale}/visit`,
      languages: {
        en: '/en/visit',
        id: '/id/visit',
      },
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

  const siteData = await getSiteData();

  return <VisitClient locale={locale as Locale} siteData={siteData} />;
}
