import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, LOCALES, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { getRecognitions, getRecognitionBySlug } from '@/content/provider';
import RecognitionDetailClient from '@/components/recognition/RecognitionDetailClient';

export const dynamicParams = true;

export async function generateStaticParams() {
  const recognitions = await getRecognitions('en');
  const params: { locale: string; slug: string }[] = [];

  for (const locale of LOCALES) {
    for (const rec of recognitions) {
      if (rec.slug) {
        params.push({ locale, slug: rec.slug });
      }
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const recognition = await getRecognitionBySlug(slug, locale as Locale);
  if (!recognition) notFound();

  const { l } = getDictionary(locale as Locale);
  const title = l(recognition.title);
  const description = recognition.excerpt
    ? l(recognition.excerpt)
    : (recognition.awardingBody ? `${recognition.awardingBody} (${recognition.year || ''})` : 'GEMA Recognition');

  return {
    title: `${title} — GEMA`,
    description,
    alternates: {
      canonical: `/${locale}/recognition/${recognition.slug}`,
      languages: {
        en: `/en/recognition/${recognition.slug}`,
        id: `/id/recognition/${recognition.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      images: recognition.coverImage ? [recognition.coverImage] : undefined,
    },
  };
}

export default async function RecognitionDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();

  const recognition = await getRecognitionBySlug(slug, locale as Locale);
  if (!recognition) notFound();

  return <RecognitionDetailClient locale={locale as Locale} recognition={recognition} />;
}
