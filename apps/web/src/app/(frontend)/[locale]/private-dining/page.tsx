import { permanentRedirect, notFound } from 'next/navigation';
import { isValidLocale } from '@/i18n/config';

export default async function PrivateDiningRedirectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  permanentRedirect(`/${locale}/occasions`);
}
