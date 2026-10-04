import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import AboutClient from '@/components/about/AboutClient';
import { getPageMedia, getAboutPageData, getSiteData } from '@/content/provider';
import { SITE_URL } from '@/lib/siteUrl';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const { t } = getDictionary(locale as Locale);
  const aboutData = await getAboutPageData(locale as Locale);

  const title = aboutData?.hero.headline || t('nav.about');
  const description = aboutData?.hero.subtitle || (locale === 'id' ? 'Pelajari asal usul, filosofi, dan arsitektur GEMA Restaurant & Societiet.' : 'Learn about the origin, philosophy, and architecture of GEMA Restaurant & Societiet.');

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/about`,
      languages: {
        en: '/en/about',
        id: '/id/about',
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/about`,
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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const [pageMedia, aboutData, siteData] = await Promise.all([
    getPageMedia(locale as Locale),
    getAboutPageData(locale as Locale),
    getSiteData(locale as Locale),
  ]);

  return (
    <AboutClient 
      locale={locale as Locale} 
      pageMedia={pageMedia} 
      aboutData={aboutData} 
      siteData={siteData} 
    />
  );
}
