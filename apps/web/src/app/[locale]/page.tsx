import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import PageReveal from '@/components/motion/PageReveal';

import Hero from '@/components/home/Hero';
import Positioning from '@/components/home/Positioning';
import CuisineCategories from '@/components/home/CuisineCategories';
import SignatureDishes from '@/components/home/SignatureDishes';
import SpacePreview from '@/components/home/SpacePreview';
import ChefPreview from '@/components/home/ChefPreview';
import RecognitionPreview from '@/components/home/RecognitionPreview';
import EventsPreview from '@/components/home/EventsPreview';
import ReviewsPreview from '@/components/home/ReviewsPreview';
import JournalPreview from '@/components/home/JournalPreview';
import VisitPreview from '@/components/home/VisitPreview';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const { t } = getDictionary(locale as Locale);

  return {
    title: t('home.hero.headline'),
    description: t('home.hero.support'),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        id: '/id',
      },
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <PageReveal>
      <Hero locale={locale as Locale} />
      <Positioning locale={locale as Locale} />
      <CuisineCategories locale={locale as Locale} />
      <SignatureDishes locale={locale as Locale} />
      <SpacePreview locale={locale as Locale} />
      <ChefPreview locale={locale as Locale} />
      <RecognitionPreview locale={locale as Locale} />
      <EventsPreview locale={locale as Locale} />
      <ReviewsPreview locale={locale as Locale} />
      <JournalPreview locale={locale as Locale} />
      <VisitPreview locale={locale as Locale} />
    </PageReveal>
  );
}
