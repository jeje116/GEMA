'use client';

import React from 'react';
import { JournalEntry } from '@/content/types';
import { formatDate } from '@/lib/date';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import EditorialDetailPage, { EditorialBodyBlock } from '@/components/shared/EditorialDetailPage';

interface JournalDetailClientProps {
  locale: Locale;
  entry: JournalEntry;
}

export default function JournalDetailClient({ locale, entry }: JournalDetailClientProps) {
  const { t, l } = getDictionary(locale);

  const bodyBlocks: EditorialBodyBlock[] = (entry.bodyBlocks || [])
    .filter(block => block.type === 'paragraph' || block.type === 'quote')
    .map(block => ({
      type: block.type as 'paragraph' | 'quote',
      content: l(block.content),
    }));

  return (
    <EditorialDetailPage
      locale={locale}
      title={l(entry.title)}
      category={l(entry.category)}
      date={formatDate(entry.publishDate, locale)}
      authorOrSourceLabel={entry.authorLabel}
      coverImage={entry.coverImage}
      imageCaption={entry.imageCaption ? l(entry.imageCaption) : undefined}
      excerpt={entry.excerpt ? l(entry.excerpt) : undefined}
      bodyBlocks={bodyBlocks}
      backHref={`/${locale}/journal`}
      backLabel={t('journal.back')}
      exploreMoreLabel={t('journal.exploreMore')}
    />
  );
}
