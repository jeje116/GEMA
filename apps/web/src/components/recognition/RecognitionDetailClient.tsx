'use client';

import React from 'react';
import { RecognitionItem } from '@/content/types';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import EditorialDetailPage, { EditorialBodyBlock } from '@/components/shared/EditorialDetailPage';

interface RecognitionDetailClientProps {
  locale: Locale;
  recognition: RecognitionItem;
}

export default function RecognitionDetailClient({ locale, recognition }: RecognitionDetailClientProps) {
  const { t, l } = getDictionary(locale);

  const bodyBlocks: EditorialBodyBlock[] = (recognition.bodyBlocks || [])
    .filter(block => block.type === 'paragraph' || block.type === 'quote')
    .map(block => ({
      type: block.type as 'paragraph' | 'quote',
      content: l(block.content),
    }));

  const categoryLabel = recognition.scope === 'chef'
    ? (locale === 'id' ? 'Koki' : 'Chef')
    : (locale === 'id' ? 'Restoran' : 'Restaurant');

  return (
    <EditorialDetailPage
      locale={locale}
      title={l(recognition.title)}
      category={categoryLabel}
      date={recognition.year || recognition.date || ''}
      authorOrSourceLabel={recognition.awardingBody}
      coverImage={recognition.coverImage || ''}
      imageCaption={recognition.imageCaption ? l(recognition.imageCaption) : undefined}
      excerpt={recognition.excerpt ? l(recognition.excerpt) : undefined}
      bodyBlocks={bodyBlocks}
      backHref={`/${locale}/recognition`}
      backLabel={locale === 'id' ? 'Kembali ke Pengakuan' : 'Back to Recognition'}
      exploreMoreLabel={locale === 'id' ? 'Jelajahi Pengakuan Lainnya' : 'Explore More Recognitions'}
    />
  );
}
