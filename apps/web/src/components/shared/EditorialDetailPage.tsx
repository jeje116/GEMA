'use client';

import React from 'react';
import Link from 'next/link';
import PageReveal from '@/components/motion/PageReveal';
import ResponsiveImage from '@/components/media/ResponsiveImage';
import { Locale } from '@/i18n/config';

export interface EditorialBodyBlock {
  type: 'paragraph' | 'quote';
  content: string;
}

interface EditorialDetailPageProps {
  locale: Locale;
  title: string;
  category: string;
  date: string;
  authorOrSourceLabel?: string;
  coverImage: string;
  imageCaption?: string;
  excerpt?: string;
  bodyBlocks: EditorialBodyBlock[];
  backHref: string;
  backLabel: string;
  exploreMoreLabel: string;
}

export default function EditorialDetailPage({
  locale,
  title,
  category,
  date,
  authorOrSourceLabel,
  coverImage,
  imageCaption,
  excerpt,
  bodyBlocks,
  backHref,
  backLabel,
  exploreMoreLabel,
}: EditorialDetailPageProps) {
  return (
    <PageReveal title={title} className="bg-[var(--white)] min-h-screen pt-32 pb-24">
      <article>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link href={backHref} className="inline-flex items-center gap-2 font-condensed tracking-widest uppercase text-xs text-[var(--muted)] hover:text-[var(--espresso-900)] transition-colors mb-12 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> {backLabel}
          </Link>

          <header className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-condensed tracking-widest text-xs uppercase text-[var(--terracotta)]">
                {category}
              </span>
              <span className="text-[var(--ivory-200)]">|</span>
              <span className="font-condensed tracking-wide text-xs text-[var(--muted)]">
                {date}
              </span>
              {authorOrSourceLabel && (
                <>
                  <span className="text-[var(--ivory-200)]">|</span>
                  <span className="font-condensed tracking-wide text-xs text-[var(--muted)]">
                    {authorOrSourceLabel}
                  </span>
                </>
              )}
            </div>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-[var(--espresso-900)] leading-tight mb-8">
              {title}
            </h1>
          </header>

        </div>

        {/* Single Main Editorial Image with Caption */}
        <figure className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <div className="aspect-video w-full relative">
            <ResponsiveImage 
              src={coverImage} 
              alt={title}
              className="w-full h-full"
              priority
            />
          </div>
          {imageCaption && (
            <figcaption className="text-xs font-condensed tracking-wide text-[var(--muted)] mt-3 text-left">
              {imageCaption}
            </figcaption>
          )}
        </figure>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {excerpt && (
            <p className="text-xl md:text-2xl text-[var(--espresso-900)] font-serif italic mb-8 leading-relaxed">
              {excerpt}
            </p>
          )}

          <div className="flex flex-col gap-8 text-[var(--muted)] text-lg leading-relaxed">
            {bodyBlocks.map((block, idx) => {
              if (block.type === 'paragraph') {
                return (
                  <p key={idx} className="leading-relaxed">
                    {block.content}
                  </p>
                );
              }
              if (block.type === 'quote') {
                return (
                  <blockquote key={idx} className="border-l-2 border-[var(--terracotta)] pl-6 py-2 my-4 font-serif text-2xl text-[var(--espresso-900)] italic">
                    {block.content}
                  </blockquote>
                );
              }
              return null;
            })}
          </div>
          
          <nav aria-label="Explore more" className="mt-24 pt-12 border-t border-[var(--ivory-200)] text-center">
            <Link 
              href={backHref} 
              className="px-8 py-3 border border-[var(--ink)] text-[var(--ink)] font-condensed tracking-widest uppercase text-sm hover:bg-[var(--ink)] hover:text-white transition-colors inline-block"
            >
              {exploreMoreLabel}
            </Link>
          </nav>
        </div>
      </article>
    </PageReveal>
  );
}
