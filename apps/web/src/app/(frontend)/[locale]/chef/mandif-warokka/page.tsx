import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale } from '@/i18n/config';
import ChefClient from '@/components/chef/ChefClient';
import { getChefData } from '@/content/provider';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const chefData = await getChefData(locale as any);

  const title = `${chefData?.name || 'Mandif Warokka'} — ${chefData?.role || 'Culinary Director'} | GEMA`;
  const description = chefData?.previewText || chefData?.quote || (locale === 'id' ? 'Kenali Chef Mandif Warokka, Direktur Kuliner GEMA Surabaya.' : 'Learn about Chef Mandif Warokka, Culinary Director of GEMA Surabaya.');

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
  };
}

export default async function ChefPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const chefData = await getChefData(locale);

  return <ChefClient chefData={chefData} />;
}
