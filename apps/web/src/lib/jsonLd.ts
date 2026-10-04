/**
 * Factual, lightweight Schema.org JSON-LD builders.
 * Zero unverified properties, fake ratings, or placeholder awards.
 */

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function createBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function createRestaurantJsonLd({
  name,
  url,
  phone,
  fullAddress,
  sameAs = [],
  image,
}: {
  name: string;
  url: string;
  phone?: string;
  fullAddress?: string;
  sameAs?: string[];
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: name || 'GEMA Restaurant & Societiet',
    url,
    ...(phone ? { telephone: phone } : {}),
    servesCuisine: 'Italian',
    ...(fullAddress
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Jl. Musi No.32, Darmo, Kec. Wonokromo',
            addressLocality: 'Surabaya',
            addressRegion: 'Jawa Timur',
            postalCode: '60241',
            addressCountry: 'ID',
          },
        }
      : {}),
    ...(image ? { image } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function createEventJsonLd({
  name,
  description,
  startDate,
  endDate,
  url,
  image,
  locationName = 'GEMA Restaurant & Societiet',
}: {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  url: string;
  image?: string;
  locationName?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    ...(description ? { description } : {}),
    startDate,
    ...(endDate ? { endDate } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: locationName,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jl. Musi No.32, Darmo, Kec. Wonokromo',
        addressLocality: 'Surabaya',
        addressRegion: 'Jawa Timur',
        postalCode: '60241',
        addressCountry: 'ID',
      },
    },
    ...(image ? { image } : {}),
    url,
  };
}

export function createPersonJsonLd({
  name,
  jobTitle,
  description,
  url,
  image,
  worksForName = 'GEMA Restaurant & Societiet',
  worksForUrl,
}: {
  name: string;
  jobTitle?: string;
  description?: string;
  url: string;
  image?: string;
  worksForName?: string;
  worksForUrl?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    ...(jobTitle ? { jobTitle } : {}),
    ...(description ? { description } : {}),
    url,
    ...(image ? { image } : {}),
    ...(worksForName
      ? {
          worksFor: {
            '@type': 'Restaurant',
            name: worksForName,
            ...(worksForUrl ? { url: worksForUrl } : {}),
          },
        }
      : {}),
  };
}
