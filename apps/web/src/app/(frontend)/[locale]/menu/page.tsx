import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isValidLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/getDictionary';
import { getMenuCategories, getMenuItems, getPageMedia, getMenuPageData } from '@/content/provider';
import MenuClient from '@/components/menu/MenuClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const { t } = getDictionary(locale as Locale);
  const menuPageData = await getMenuPageData(locale as Locale);

  const title = menuPageData?.title || t('menu.title');
  const description = menuPageData?.philosophy || t('menu.philosophy');

  return {
    title: `${title} — GEMA`,
    description,
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

  const [categories, items, pageMedia, menuPageData] = await Promise.all([
    getMenuCategories(locale as Locale),
    getMenuItems(locale as Locale),
    getPageMedia(locale as Locale),
    getMenuPageData(locale as Locale),
  ]);

  return (
    <MenuClient 
      locale={locale as Locale} 
      categories={categories} 
      items={items} 
      pageMedia={pageMedia}
      menuPageData={menuPageData}
    />
  );
}
