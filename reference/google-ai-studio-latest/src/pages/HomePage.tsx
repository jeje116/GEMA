import React from 'react';
import PageReveal from '../components/motion/PageReveal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useLanguage } from '../i18n/LanguageProvider';

// Home Sections
import Hero from './home/Hero';
import Positioning from './home/Positioning';
import CuisineCategories from './home/CuisineCategories';
import SignatureDishes from './home/SignatureDishes';
import SpacePreview from './home/SpacePreview';
import ChefPreview from './home/ChefPreview';
import RecognitionPreview from './home/RecognitionPreview';
import EventsPreview from './home/EventsPreview';
import ReviewsPreview from './home/ReviewsPreview';
import JournalPreview from './home/JournalPreview';
import VisitPreview from './home/VisitPreview';

export default function HomePage() {
  const { t } = useLanguage();
  
  useDocumentMeta({
    title: t('home.hero.headline'),
    description: t('home.hero.support'),
    canonicalPath: '/'
  });

  return (
    <PageReveal>
      <Hero />
      <Positioning />
      <CuisineCategories />
      <SignatureDishes />
      <SpacePreview />
      <ChefPreview />
      <RecognitionPreview />
      <EventsPreview />
      <ReviewsPreview />
      <JournalPreview />
      <VisitPreview />
    </PageReveal>
  );
}
