export const LOCALES = ['en', 'id'] as const;

export const SITE_ROUTES = {
  home: ['/en', '/id'],
  menu: ['/en/menu', '/id/menu'],
  about: ['/en/about', '/id/about'],
  experience: ['/en/experience', '/id/experience'],
  occasions: ['/en/occasions', '/id/occasions'],
  journalList: ['/en/journal', '/id/journal'],
  eventsList: ['/en/events', '/id/events'],
  chef: ['/en/chef/mandif-warokka', '/id/chef/mandif-warokka'],
  visit: ['/en/visit', '/id/visit'],
  recognition: ['/en/recognition', '/id/recognition'],
};

export async function safeRevalidatePath(path: string, type: 'page' | 'layout' = 'page') {
  try {
    const { revalidatePath } = await import('next/cache');
    revalidatePath(path, type);
  } catch {
    // Gracefully handle execution outside Next.js request context
  }
}

/**
 * Returns true if an entity change is purely an internal draft save
 * that should NOT invalidate public production caches.
 */
export function shouldSkipPublicRevalidation(doc: any, previousDoc?: any): boolean {
  // If the document has draft versions enabled:
  // 1. Current status is draft AND previous status was draft (or non-existent): Skip revalidation.
  if (doc?._status === 'draft' && (!previousDoc || previousDoc._status === 'draft')) {
    return true;
  }
  // Otherwise, it was published, updated while published, or unpublished from published state:
  return false;
}

export async function revalidateHomepage() {
  await Promise.all([
    safeRevalidatePath('/en', 'page'),
    safeRevalidatePath('/id', 'page'),
  ]);
}

export async function revalidateMenu(includeHomepage = false) {
  const promises = [
    safeRevalidatePath('/en/menu', 'page'),
    safeRevalidatePath('/id/menu', 'page'),
  ];
  if (includeHomepage) {
    promises.push(
      safeRevalidatePath('/en', 'page'),
      safeRevalidatePath('/id', 'page')
    );
  }
  await Promise.all(promises);
}

export async function revalidateJournal(slug?: string) {
  const promises = [
    safeRevalidatePath('/en/journal', 'page'),
    safeRevalidatePath('/id/journal', 'page'),
    safeRevalidatePath('/en', 'page'),
    safeRevalidatePath('/id', 'page'),
  ];
  if (slug) {
    promises.push(
      safeRevalidatePath(`/en/journal/${slug}`, 'page'),
      safeRevalidatePath(`/id/journal/${slug}`, 'page')
    );
  }
  await Promise.all(promises);
}

export async function revalidateEvents(slug?: string) {
  const promises = [
    safeRevalidatePath('/en/events', 'page'),
    safeRevalidatePath('/id/events', 'page'),
    safeRevalidatePath('/en', 'page'),
    safeRevalidatePath('/id', 'page'),
  ];
  if (slug) {
    promises.push(
      safeRevalidatePath(`/en/events/${slug}`, 'page'),
      safeRevalidatePath(`/id/events/${slug}`, 'page')
    );
  }
  await Promise.all(promises);
}

export async function revalidateChef() {
  await Promise.all([
    safeRevalidatePath('/en', 'page'),
    safeRevalidatePath('/id', 'page'),
    safeRevalidatePath('/en/chef/mandif-warokka', 'page'),
    safeRevalidatePath('/id/chef/mandif-warokka', 'page'),
  ]);
}

export async function revalidateNavigation() {
  // 1. Localized layout trees
  await Promise.all([
    safeRevalidatePath('/[locale]', 'layout'),
    safeRevalidatePath('/en', 'layout'),
    safeRevalidatePath('/id', 'layout'),
  ]);

  // 2. Centralized route set to guarantee all prerendered pages reflect navigation changes
  const allRoutes = Object.values(SITE_ROUTES).flat();
  await Promise.all(allRoutes.map((route) => safeRevalidatePath(route, 'page')));
}

export async function revalidateSiteSettings() {
  // Site settings affect Header, Footer, Visit, and Reservation
  const affectedRoutes = [
    '/en',
    '/id',
    '/en/visit',
    '/id/visit',
    '/en/menu',
    '/id/menu',
  ];
  await Promise.all(affectedRoutes.map((route) => safeRevalidatePath(route, 'page')));
}

export async function revalidatePageMedia(group?: 'menu' | 'about' | 'experience' | 'occasions') {
  if (group) {
    const routes = SITE_ROUTES[group];
    if (routes) {
      await Promise.all(routes.map((route) => safeRevalidatePath(route, 'page')));
      return;
    }
  }
  // If no group specified, revalidate all page media consumers
  const pageMediaRoutes = [
    ...SITE_ROUTES.menu,
    ...SITE_ROUTES.about,
    ...SITE_ROUTES.experience,
    ...SITE_ROUTES.occasions,
  ];
  await Promise.all(pageMediaRoutes.map((route) => safeRevalidatePath(route, 'page')));
}

export async function revalidateAbout() {
  await Promise.all(SITE_ROUTES.about.map((route) => safeRevalidatePath(route, 'page')));
}

export async function revalidateExperience() {
  await Promise.all(SITE_ROUTES.experience.map((route) => safeRevalidatePath(route, 'page')));
}

export async function revalidateOccasions() {
  await Promise.all(SITE_ROUTES.occasions.map((route) => safeRevalidatePath(route, 'page')));
}

export async function revalidateVisit() {
  await Promise.all(SITE_ROUTES.visit.map((route) => safeRevalidatePath(route, 'page')));
}

export async function revalidateRecognition(slug?: string) {
  const promises = [
    safeRevalidatePath('/en/recognition', 'page'),
    safeRevalidatePath('/id/recognition', 'page'),
  ];
  if (slug) {
    promises.push(
      safeRevalidatePath(`/en/recognition/${slug}`, 'page'),
      safeRevalidatePath(`/id/recognition/${slug}`, 'page')
    );
  }
  await Promise.all(promises);
}

