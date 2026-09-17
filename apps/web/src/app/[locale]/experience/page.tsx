import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import ExperienceClient from '@/components/experience/ExperienceClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const { t } = getDictionary(locale as Locale);

  return {
    title: `${t('nav.experience')} — GEMA`,
    description: 'Experience the atmosphere, day-to-night ambiance, and architectural resonance of GEMA Surabaya.',
    alternates: {
      canonical: `/${locale}/experience`,
      languages: {
        en: '/en/experience',
        id: '/id/experience',
      },
    },
  };
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return <ExperienceClient locale={locale as Locale} />;
}
