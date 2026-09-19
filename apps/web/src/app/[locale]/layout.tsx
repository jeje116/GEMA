import { notFound } from 'next/navigation';
import { LOCALES, isValidLocale, type Locale } from '@/i18n/config';
import { UIProvider } from '@/components/shared/UIContext';
import SiteHeader from '@/components/layout/SiteHeader';
import SiteFooter from '@/components/layout/SiteFooter';
import AudioControl from '@/components/layout/AudioControl';
import MobileReserveBar from '@/components/shared/MobileReserveBar';
import ReservationOverlay from '@/components/shared/ReservationOverlay';
import GatewayExperience from '@/components/motion/GatewayExperience';
import RouteScrollReset from '@/components/layout/RouteScrollReset';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  return (
    <UIProvider>
      <RouteScrollReset />
      <GatewayExperience locale={locale as Locale} />
      <SiteHeader locale={locale as Locale} />
      <main id="main-content" className="flex-1 bg-[var(--background)] min-h-screen">
        {children}
      </main>
      <SiteFooter locale={locale as Locale} />
      <AudioControl locale={locale as Locale} />
      <MobileReserveBar locale={locale as Locale} />
      <ReservationOverlay locale={locale as Locale} />
    </UIProvider>
  );
}
