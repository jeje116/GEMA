import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale } from '@/i18n/config';
import ChefClient from '@/components/chef/ChefClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return {
    title: 'Chef Mandif Warokka — Culinary Director | GEMA',
    description: 'Learn about Chef Mandif Warokka, Culinary Director of GEMA Surabaya. International culinary journey and ingredient-focused philosophy.',
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

  return <ChefClient />;
}
