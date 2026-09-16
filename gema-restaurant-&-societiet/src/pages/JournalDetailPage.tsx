import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import PageReveal from '../components/motion/PageReveal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useLanguage, formatDate } from '../i18n/LanguageProvider';
import { journalEntries } from '../data/journal';
import ResponsiveImage from '../components/media/ResponsiveImage';

export default function JournalDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { l, language } = useLanguage();

  const entry = journalEntries.find(e => e.slug === slug);
  
  if (!entry) {
    return <Navigate to="/404" replace />;
  }

  useDocumentMeta({
    title: l(entry.title),
    description: l(entry.excerpt),
    canonicalPath: `/journal/${entry.slug}`
  });

  return (
    <PageReveal title={l(entry.title)} className="bg-[var(--white)] min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/journal" className="inline-flex items-center gap-2 font-condensed tracking-widest uppercase text-xs text-[var(--muted)] hover:text-[var(--espresso-900)] transition-colors mb-12 group">
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Journal
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-condensed tracking-widest text-xs uppercase text-[var(--terracotta)]">
              {l(entry.category)}
            </span>
            <span className="text-[var(--ivory-200)]">|</span>
            <span className="font-condensed tracking-wide text-xs text-[var(--muted)]">
              {formatDate(entry.publishDate, language)}
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
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="prose prose-lg md:prose-xl prose-headings:font-serif prose-headings:text-[var(--espresso-900)] prose-p:text-[var(--muted)] prose-a:text-[var(--terracotta)] prose-img:w-full prose-img:my-12 prose-blockquote:border-[var(--terracotta)] prose-blockquote:text-[var(--espresso-900)] max-w-none">
          {entry.bodyBlocks.map((block, idx) => {
            if (block.type === 'paragraph') {
              return <p key={idx} className="leading-relaxed mb-6">{l(block.content)}</p>;
            }
            if (block.type === 'image' && block.url) {
              return (
                <figure key={idx} className="my-8">
                  <ResponsiveImage src={block.url} alt={l(block.content)} className="w-full aspect-[16/9]" />
                  {block.content && (
                    <figcaption className="text-xs text-[var(--muted)] mt-2 font-condensed tracking-wide">
                      {l(block.content)}
                    </figcaption>
                  )}
                </figure>
              );
            }
            if (block.type === 'quote') {
              return (
                <blockquote key={idx} className="border-l-2 border-[var(--terracotta)] pl-6 my-8 italic text-[var(--espresso-900)]">
                  {l(block.content)}
                </blockquote>
              );
            }
            return null;
          })}
        </div>
        
        <div className="mt-24 pt-12 border-t border-[var(--ivory-200)] text-center">
          <Link 
            to="/journal" 
            className="px-8 py-3 border border-[var(--ink)] text-[var(--ink)] font-condensed tracking-widest uppercase text-sm hover:bg-[var(--ink)] hover:text-white transition-colors inline-block"
          >
            Explore More Stories
          </Link>
        </div>
      </div>

    </PageReveal>
  );
}
