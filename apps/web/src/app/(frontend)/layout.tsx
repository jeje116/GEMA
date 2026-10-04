import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter, Roboto_Condensed } from 'next/font/google';
import '@/styles/index.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-serif-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans-inter',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  variable: '--font-condensed-roboto',
  weight: ['400', '500', '600'],
  display: 'swap',
});

import { SITE_URL } from '@/lib/siteUrl';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s | GEMA Restaurant & Societiet',
    default: 'GEMA Restaurant & Societiet',
  },
  description: 'Italian classics, served with a touch of art. GEMA Restaurant & Societiet, Surabaya.',
  openGraph: {
    type: 'website',
    siteName: 'GEMA Restaurant & Societiet',
    title: 'GEMA Restaurant & Societiet',
    description: 'Italian classics, served with a touch of art. GEMA Restaurant & Societiet, Surabaya.',
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/media/brand/gema-brand-2.png`,
        alt: 'GEMA Restaurant & Societiet',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${robotoCondensed.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
