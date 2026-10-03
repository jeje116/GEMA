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
  const homepageData = await getHomepageData(locale as Locale);
  const { t } = getDictionary(locale as Locale);

  const title = homepageData?.hero.headline || t('home.hero.headline');
  const description = homepageData?.hero.support || t('home.hero.support');

  return {
    title: `${title} — GEMA`,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        en: '/en',
        id: '/id',
      },
    },
  };
}

import { getHomepageData, getChefMedia, getSiteData, contentProvider } from '@/content/provider';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const [homepageData, chefMedia, events, journalEntries, siteData] = await Promise.all([
    getHomepageData(locale as Locale),
    getChefMedia(locale as Locale),
    contentProvider.getEvents(locale as Locale),
    contentProvider.getJournalEntries(locale as Locale),
    getSiteData(locale as Locale),
  ]);

  return (
    <PageReveal>
      <Hero locale={locale as Locale} media={homepageData?.hero.image} heroData={homepageData?.hero} />
      <Positioning locale={locale as Locale} positioningData={homepageData?.positioning} />
      <CuisineCategories locale={locale as Locale} cuisineData={homepageData?.cuisineTeaser} />
      <SignatureDishes 
        locale={locale as Locale} 
        title={homepageData?.signatureDishes?.title} 
        items={homepageData?.signatureDishes?.items} 
      />
      <SpacePreview locale={locale as Locale} spaceMedia={homepageData?.space} spaceData={homepageData?.space} />
      <ChefPreview locale={locale as Locale} chefMedia={chefMedia} chefPreviewData={homepageData?.chefPreview} />
      <EventsPreview locale={locale as Locale} events={events} eventsIntroData={homepageData?.eventsIntro} />
      <ReviewsPreview locale={locale as Locale} reviewsData={homepageData?.reviews} />
      <JournalPreview locale={locale as Locale} entries={journalEntries} journalIntroData={homepageData?.journalIntro} />
      <VisitPreview locale={locale as Locale} visitIntroData={homepageData?.visitIntro} siteData={siteData} />
    </PageReveal>
  );
}
