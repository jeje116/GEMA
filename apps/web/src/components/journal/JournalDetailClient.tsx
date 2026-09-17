'use client';

import React from 'react';
import Link from 'next/link';
import PageReveal from '@/components/motion/PageReveal';
import { JournalEntry } from '@/content/types';
import ResponsiveImage from '@/components/media/ResponsiveImage';
import { formatDate } from '@/lib/date';
import { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';

interface JournalDetailClientProps {
  locale: Locale;
  entry: JournalEntry;
}

export default function JournalDetailClient({ locale, entry }: JournalDetailClientProps) {
  const { l } = getDictionary(locale);

  return (
    <PageReveal title={l(entry.title)} className="bg-[var(--white)] min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href={`/${locale}/journal`} className="inline-flex items-center gap-2 font-condensed tracking-widest uppercase text-xs text-[var(--muted)] hover:text-[var(--espresso-900)] transition-colors mb-12 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Journal
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-condensed tracking-widest text-xs uppercase text-[var(--terracotta)]">
              {l(entry.category)}
            </span>
            <span className="text-[var(--ivory-200)]">|</span>
            <span className="font-condensed tracking-wide text-xs text-[var(--muted)]">
              {formatDate(entry.publishDate, locale)}
            </span>
            <span className="text-[var(--ivory-200)]">|</span>
            <span className="font-condensed tracking-wide text-xs text-[var(--muted)]">
              {entry.authorLabel}
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-[var(--espresso-900)] leading-tight mb-8">
            {l(entry.title)}
          </h1>
        </header>

      </div>

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="aspect-video w-full relative">
          <ResponsiveImage 
            src={entry.coverImage} 
            alt={l(entry.title)}
            className="w-full h-full"
            priority
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 text-[var(--muted)] text-lg leading-relaxed">
          {entry.bodyBlocks.map((block, idx) => {
            if (block.type === 'paragraph') {
              return (
                <p key={idx} className="leading-relaxed">
                  {l(block.content)}
                </p>
              );
            }
            if (block.type === 'image' && block.url) {
              return (
                <figure key={idx} className="my-6">
                  <div className="aspect-[16/10] overflow-hidden">
                    <ResponsiveImage src={block.url} alt={l(block.content)} className="w-full h-full" />
                  </div>
                  <figcaption className="text-xs font-condensed tracking-wide text-[var(--muted)] mt-2 italic text-center">
                    {l(block.content)}
                  </figcaption>
                </figure>
              );
            }
            if (block.type === 'quote') {
              return (
                <blockquote key={idx} className="border-l-2 border-[var(--terracotta)] pl-6 py-2 my-4 font-serif text-2xl text-[var(--espresso-900)] italic">
                  {l(block.content)}
                </blockquote>
              );
            }
            return null;
          })}
        </div>
        
        <div className="mt-24 pt-12 border-t border-[var(--ivory-200)] text-center">
          <Link 
            href={`/${locale}/journal`} 
            className="px-8 py-3 border border-[var(--ink)] text-[var(--ink)] font-condensed tracking-widest uppercase text-sm hover:bg-[var(--ink)] hover:text-white transition-colors inline-block"
          >
            Explore More Stories
          </Link>
        </div>
      </div>

    </PageReveal>
  );
}
