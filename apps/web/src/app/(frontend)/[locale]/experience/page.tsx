import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import ExperienceClient from '@/components/experience/ExperienceClient';
import { getPageMedia, getExperiencePageData } from '@/content/provider';
import { SITE_URL } from '@/lib/siteUrl';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const { t } = getDictionary(locale as Locale);
  const experienceData = await getExperiencePageData(locale as Locale);

  const title = experienceData?.hero.headline || t('nav.experience');
  const description = experienceData?.quote || (locale === 'id' ? 'Rasakan suasana dan kehangatan ruang GEMA.' : 'Experience the atmosphere and architectural resonance of GEMA.');

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/experience`,
      languages: {
        en: '/en/experience',
        id: '/id/experience',
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/experience`,
      siteName: 'GEMA Restaurant & Societiet',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      images: [
        {
          url: `${SITE_URL}/media/brand/gema-brand-2.png`,
          alt: title,
        },
      ],
    },
  };
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const [pageMedia, experienceData] = await Promise.all([
    getPageMedia(locale as Locale),
    getExperiencePageData(locale as Locale),
  ]);

  return (
    <ExperienceClient 
      locale={locale as Locale} 
      pageMedia={pageMedia} 
      experienceData={experienceData} 
    />
  );
}
