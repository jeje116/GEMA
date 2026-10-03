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
import Script from 'next/script';
import { getNavigation, getSiteData } from '@/content/provider';
import { getSplashMediaConfig } from '@/lib/splashConfig';

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

  const [navigation, siteData, splashConfig] = await Promise.all([
    getNavigation(locale as Locale),
    getSiteData(locale as Locale),
    getSplashMediaConfig(),
  ]);

  return (
    <UIProvider>
      <RouteScrollReset />
      <GatewayExperience locale={locale as Locale} splashConfig={splashConfig} />
      <SiteHeader locale={locale as Locale} headerLinks={navigation?.headerLinks} siteData={siteData} />
      <main id="main-content" className="flex-1 bg-[var(--background)] min-h-screen">
        {children}
      </main>
      <SiteFooter locale={locale as Locale} footerLinks={navigation?.footerLinks} siteData={siteData} />
      <AudioControl locale={locale as Locale} />
      <MobileReserveBar locale={locale as Locale} />
      <ReservationOverlay locale={locale as Locale} whatsappNumber={siteData?.whatsappNumber} />
      <Script
        id="rd-loader-script"
        src="https://booking.resdiary.com/bundles/WidgetV2Loader.js"
        strategy="beforeInteractive"
      />
    </UIProvider>
  );
}
