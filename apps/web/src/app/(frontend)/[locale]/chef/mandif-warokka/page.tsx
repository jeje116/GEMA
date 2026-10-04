import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import ChefClient from '@/components/chef/ChefClient';
import { getChefData } from '@/content/provider';
import { SITE_URL } from '@/lib/siteUrl';
import { createPersonJsonLd, createBreadcrumbJsonLd } from '@/lib/jsonLd';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const chefData = await getChefData(locale as Locale);

  const title = `${chefData?.name || 'Mandif Warokka'} — ${chefData?.role || 'Culinary Director'}`;
  const description = chefData?.previewText || chefData?.quote || (locale === 'id' ? 'Kenali Chef Mandif Warokka, Direktur Kuliner GEMA Surabaya.' : 'Learn about Chef Mandif Warokka, Culinary Director of GEMA Surabaya.');

  const portraitUrl = chefData?.portrait?.src
    ? (chefData.portrait.src.startsWith('http') ? chefData.portrait.src : `${SITE_URL}${chefData.portrait.src}`)
    : `${SITE_URL}/media/brand/gema-brand-2.png`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/chef/mandif-warokka`,
      languages: {
        en: '/en/chef/mandif-warokka',
        id: '/id/chef/mandif-warokka',
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/chef/mandif-warokka`,
      siteName: 'GEMA Restaurant & Societiet',
      locale: locale === 'id' ? 'id_ID' : 'en_US',
      images: [
        {
          url: portraitUrl,
          alt: chefData?.name || 'Mandif Warokka',
        },
      ],
    },
  };
}

export default async function ChefPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const chefData = await getChefData(locale as Locale);
  const { t } = getDictionary(locale as Locale);

  const portraitUrl = chefData?.portrait?.src
    ? (chefData.portrait.src.startsWith('http') ? chefData.portrait.src : `${SITE_URL}${chefData.portrait.src}`)
    : undefined;

  const personJsonLd = createPersonJsonLd({
    name: chefData?.name || 'Mandif Warokka',
    jobTitle: chefData?.role || 'Culinary Director',
    description: chefData?.biography || chefData?.quote || undefined,
    url: `${SITE_URL}/${locale}/chef/mandif-warokka`,
    image: portraitUrl,
    worksForName: 'GEMA Restaurant & Societiet',
    worksForUrl: SITE_URL,
  });

  const breadcrumbsJsonLd = createBreadcrumbJsonLd([
    { name: t('nav.home') || 'Home', url: `${SITE_URL}/${locale}` },
    { name: chefData?.name || 'Mandif Warokka', url: `${SITE_URL}/${locale}/chef/mandif-warokka` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <ChefClient chefData={chefData} />
    </>
  );
}
