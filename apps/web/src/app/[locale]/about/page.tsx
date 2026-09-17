import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import AboutClient from '@/components/about/AboutClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const { t } = getDictionary(locale as Locale);

  return {
    title: `${t('nav.about')} — GEMA`,
    description: 'Learn about the origin, philosophy, and architecture of GEMA — Indonesian Fine Dining & Sociëteit in Surabaya.',
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        en: '/en/about',
        id: '/id/about',
      },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return <AboutClient locale={locale as Locale} />;
}
