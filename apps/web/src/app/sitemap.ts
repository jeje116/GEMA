import { MetadataRoute } from 'next';
import { LOCALES } from '@/i18n/config';
import { getEvents, getJournalEntries, isJournalLocaleSubstantive } from '@/content/provider';

const BASE_URL = 'https://gemasurabaya.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [];

  const staticPaths = [
    '',
    '/menu',
    '/experience',
    '/about',
    '/chef/mandif-warokka',
    '/recognition',
    '/visit',
    '/occasions',
    '/events',
    '/journal',
  ];

  // Static routes for each locale
  for (const locale of LOCALES) {
    for (const path of staticPaths) {
      routes.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: path === '' || path === '/events' ? 'daily' : 'weekly',
        priority: path === '' ? 1.0 : 0.8,
      });
    }
  }

  // Dynamic Event routes
  const events = await getEvents('en', { status: 'all' });
  for (const locale of LOCALES) {
    for (const evt of events) {
      routes.push({
        url: `${BASE_URL}/${locale}/events/${evt.slug}`,
        lastModified: new Date(evt.startDateTime),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    }
  }

  // Dynamic Journal routes (with SEO gating for Indonesian entries)
  const journalEntries = await getJournalEntries('en');
  for (const entry of journalEntries) {
    // English is always substantive
    routes.push({
      url: `${BASE_URL}/en/journal/${entry.slug}`,
      lastModified: new Date(entry.publishDate),
      changeFrequency: 'monthly',
      priority: 0.7,
    });

    // Indonesian is included only if substantive
    if (isJournalLocaleSubstantive(entry, 'id')) {
      routes.push({
        url: `${BASE_URL}/id/journal/${entry.slug}`,
        lastModified: new Date(entry.publishDate),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }

  return routes;
}
