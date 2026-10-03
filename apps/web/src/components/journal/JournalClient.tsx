'use client';

import React, { useMemo } from 'react';
import { JournalEntry } from '@/content/types';
import { JournalPageData } from '@/content/provider';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { formatDate } from '@/lib/date';
import EditorialListingPage, { EditorialListingItem, EditorialCategoryOption } from '@/components/shared/EditorialListingPage';

interface JournalClientProps {
  locale: Locale;
  entries: JournalEntry[];
  journalPageData?: JournalPageData | null;
}

export default function JournalClient({ locale, entries, journalPageData }: JournalClientProps) {
  const { t, l } = getDictionary(locale);

  const categories = useMemo<EditorialCategoryOption[]>(() => {
    const cats = new Set(entries.map(e => e.category.en));
    return [
      { key: 'All', label: t('journal.filter.all') },
      ...Array.from(cats).map(c => ({ key: c, label: c })),
    ];
  }, [entries, t]);

  const items = useMemo<EditorialListingItem[]>(() => {
    return entries
      .slice()
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .map(entry => ({
        id: entry.id,
        slug: entry.slug,
        title: l(entry.title),
        category: l(entry.category),
        categoryKey: entry.category.en,
        date: formatDate(entry.publishDate, locale),
        excerpt: l(entry.excerpt),
        coverImage: entry.coverImage,
      }));
  }, [entries, locale, l]);

  return (
    <EditorialListingPage
      locale={locale}
      title={journalPageData?.title || t('nav.journal')}
      subtitle={journalPageData?.subtitle || (locale === 'id' ? 'Cerita dari dapur, kebun, dan ruang santap.' : 'Stories from the kitchen, the farm, and the dining room.')}
      items={items}
      categories={categories}
      routeBase={`/${locale}/journal`}
      readStoryLabel={t('journal.readStory')}
    />
  );
}
