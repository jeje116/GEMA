import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { getMenuCategories, getMenuItems } from '@/content/provider';
import MenuClient from '@/components/menu/MenuClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const { t } = getDictionary(locale as Locale);

  return {
    title: `${t('menu.title')} — GEMA`,
    description: t('menu.philosophy'),
    alternates: {
      canonical: `/${locale}/menu`,
      languages: {
        en: '/en/menu',
        id: '/id/menu',
      },
    },
  };
}

export default async function MenuPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  const [categories, items] = await Promise.all([
    getMenuCategories(),
    getMenuItems(),
  ]);

  return <MenuClient locale={locale as Locale} categories={categories} items={items} />;
}
