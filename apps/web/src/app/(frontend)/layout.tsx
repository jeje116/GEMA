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

export const metadata: Metadata = {
  metadataBase: new URL('https://gemasurabaya.com'),
  title: {
    template: '%s | GEMA Restaurant Surabaya',
    default: 'GEMA Restaurant Surabaya',
  },
  description: 'Italian classics, served with a touch of art. Concept MVP.',
  openGraph: {
    type: 'website',
    siteName: 'GEMA Restaurant Surabaya',
    title: 'GEMA Restaurant Surabaya',
    description: 'Italian classics, served with a touch of art. Concept MVP.',
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
