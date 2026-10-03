'use client';

import React, { useMemo } from 'react';
import { RecognitionItem } from '@/content/types';
import { RecognitionPageData } from '@/content/provider';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import EditorialListingPage, { EditorialListingItem, EditorialCategoryOption } from '@/components/shared/EditorialListingPage';

interface RecognitionClientProps {
  locale: Locale;
  recognitions: RecognitionItem[];
  recognitionData?: RecognitionPageData | null;
}

export default function RecognitionClient({ locale, recognitions, recognitionData }: RecognitionClientProps) {
  const { t, l } = getDictionary(locale);

  const categories = useMemo<EditorialCategoryOption[]>(() => {
    if (recognitions.length === 0) return [];
    return [
      { key: 'All', label: t('journal.filter.all') || 'All' },
      { key: 'restaurant', label: locale === 'id' ? 'Restoran' : 'Restaurant' },
      { key: 'chef', label: locale === 'id' ? 'Koki' : 'Chef' },
    ];
  }, [recognitions, locale, t]);

  const items = useMemo<EditorialListingItem[]>(() => {
    return recognitions.map(rec => ({
      id: rec.id,
      slug: rec.slug || String(rec.id),
      title: l(rec.title),
      category: rec.scope === 'chef' ? (locale === 'id' ? 'Koki' : 'Chef') : (locale === 'id' ? 'Restoran' : 'Restaurant'),
      categoryKey: rec.scope,
      date: rec.year || rec.date || '',
      excerpt: rec.excerpt ? l(rec.excerpt) : rec.awardingBody,
      coverImage: rec.coverImage || '',
    }));
  }, [recognitions, locale, l]);

  return (
    <EditorialListingPage
      locale={locale}
      title={recognitionData?.title || (locale === 'id' ? 'Pengakuan' : 'Recognition')}
      subtitle={recognitionData?.subtitle || (locale === 'id' ? 'Arsip pengakuan kritis, penghargaan kuliner, dan catatan media terkemuka.' : 'An archive of critical reception, culinary awards, and notable press mentions.')}
      items={items}
      categories={categories}
      routeBase={`/${locale}/recognition`}
      readStoryLabel={locale === 'id' ? 'Lihat Detail' : 'View Detail'}
    />
  );
}
