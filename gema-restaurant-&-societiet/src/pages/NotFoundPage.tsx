import React from 'react';
import { Link } from 'react-router-dom';
import PageReveal from '../components/motion/PageReveal';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { useLanguage } from '../i18n/LanguageProvider';

export default function NotFoundPage() {
  const { t } = useLanguage();

  useDocumentMeta({
    title: t('404.title'),
  });

  return (
    <PageReveal className="bg-[var(--ivory-50)] min-h-screen flex items-center justify-center pt-20">
      <div className="text-center px-4">
        <h1 className="font-serif text-8xl text-[var(--espresso-900)] mb-4">404</h1>
        <h2 className="font-serif text-2xl text-[var(--espresso-900)] mb-6">{t('404.title')}</h2>
        <p className="text-[var(--muted)] mb-12 max-w-sm mx-auto">{t('404.text')}</p>
        <Link 
          to="/" 
          className="px-8 py-3 bg-[var(--ink)] text-white font-condensed tracking-widest uppercase text-sm hover:bg-[var(--espresso-800)] transition-colors inline-block"
        >
          {t('404.back')}
        </Link>
      </div>
    </PageReveal>
  );
}
