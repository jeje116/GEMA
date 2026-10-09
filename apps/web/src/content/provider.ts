import {
  BodyBlock,
  Event,
  JournalEntry,
  MenuCategory,
  MenuItem,
  PrivateEventCategory,
  PastBrandEvent,
  RecognitionItem,
  ReviewItem,
  SiteData,
} from './types';
import type { Locale } from '@/i18n/config';
import { getEventState } from '@/lib/date';
import { occasionCategories as rawOccasionCategories, pastBrandEvents as rawPastBrandEvents } from './fixtures/occasions';

import { getPayload, type Payload } from 'payload';
import config from '@payload-config';
import { resolveMedia, resolveVideo, NormalizedMedia, NormalizedVideo } from '@/lib/media';

let payloadClient: Payload | null = null;

async function isDraftMode(): Promise<boolean> {
  try {
    const { draftMode } = await import('next/headers');
    const draft = await draftMode();
    return draft.isEnabled;
  } catch {
    return false;
  }
}

async function getPayloadClient() {
  if (!payloadClient) {
    payloadClient = await getPayload({ config });
  }
  return payloadClient;
}

export interface HomepageCuisineItem {
  label: string;
  image: NormalizedMedia;
}

export interface HomepageCuisineTeaser {
  item01: HomepageCuisineItem;
  item02: HomepageCuisineItem;
  item03: HomepageCuisineItem;
  item04: HomepageCuisineItem;
}

export interface HomepageMediaData {
  hero: NormalizedMedia;
  cuisineTeaser: HomepageCuisineTeaser;
  space: {
    imagePrimary: NormalizedMedia;
    imageSecondary: NormalizedMedia;
  };
}

export interface ChefMediaData {
  portrait: NormalizedMedia;
  video: NormalizedVideo;
}

export interface PageMediaData {
  menu: {
    foodImage: NormalizedMedia;
    beverageImage: NormalizedMedia;
  };
  about: {
    originImage: NormalizedMedia;
    philosophyImage: NormalizedMedia;
    architectureImage: NormalizedMedia;
  };
  experience: {
    heroImage: NormalizedMedia;
    morningImage: NormalizedMedia;
    eveningImage: NormalizedMedia;
    detailsImage: NormalizedMedia;
    materialImage01?: NormalizedMedia | null;
    materialImage02?: NormalizedMedia | null;
    materialImage03?: NormalizedMedia | null;
    materialImage04?: NormalizedMedia | null;
    craftImage?: NormalizedMedia | null;
  };
  occasions: {
    heroImage: NormalizedMedia;
    privateDiningImage: NormalizedMedia;
    weddingImage: NormalizedMedia;
    birthdayImage: NormalizedMedia;
    brandMondialImage: NormalizedMedia;
    brandFrankCoImage: NormalizedMedia;
    brandMaharvaImage: NormalizedMedia;
  };
}

export interface MenuPageData {
  title: string;
  philosophy?: string;
  taxServiceFootnote?: string;
}

export async function getMenuPageData(locale: Locale = 'en'): Promise<MenuPageData | null> {
  try {
    const payload = await getPayloadClient();
    const menuPage = await payload.findGlobal({
      slug: 'menu-page',
      locale,
      overrideAccess: false,
    });
    if (menuPage) {
      return {
        title: menuPage.title || 'The Menu',
        philosophy: menuPage.philosophy || undefined,
        taxServiceFootnote: menuPage.taxServiceFootnote || undefined,
      };
    }
  } catch (err) {
    console.error('Failed to fetch menu-page global from Payload:', err);
  }
  return null;
}

export interface AboutPageData {
  hero: {
    headline: string;
    subtitle: string;
  };
  origin: {
    title: string;
    body1: string;
    body2: string;
  };
  philosophy: {
    title: string;
    body1: string;
    dietaryPrefix: string;
    dietarySuffix: string;
  };
  architecture: {
    title: string;
    body1: string;
    body2: string;
  };
}

export async function getAboutPageData(locale: Locale = 'en'): Promise<AboutPageData | null> {
  try {
    const payload = await getPayloadClient();
    const isDraft = await isDraftMode();
    const doc = await payload.findGlobal({
      slug: 'about-page',
      locale,
      draft: isDraft,
      overrideAccess: isDraft,
    });
    if (doc) {
      return {
        hero: {
          headline: doc.hero?.headline || '',
          subtitle: doc.hero?.subtitle || '',
        },
        origin: {
          title: doc.origin?.title || '',
          body1: doc.origin?.body1 || '',
          body2: doc.origin?.body2 || '',
        },
        philosophy: {
          title: doc.philosophy?.title || '',
          body1: doc.philosophy?.body1 || '',
          dietaryPrefix: doc.philosophy?.dietaryPrefix || '',
          dietarySuffix: doc.philosophy?.dietarySuffix || '',
        },
        architecture: {
          title: doc.architecture?.title || '',
          body1: doc.architecture?.body1 || '',
          body2: doc.architecture?.body2 || '',
        },
      };
    }
  } catch (err) {
    console.error('Failed to fetch about-page global from Payload:', err);
  }
  return null;
}

export interface ExperiencePageData {
  hero: {
    kicker: string;
    headline: string;
  };
  quote: string;
  dayToNight: {
    heading: string;
    subtitle: string;
    morningHeading: string;
    morningDescription: string;
    transitionQuote: string;
    eveningHeading: string;
    eveningDescription: string;
  };
  craft: {
    heading: string;
    intro: string;
    body: string;
  };
}

export async function getExperiencePageData(locale: Locale = 'en'): Promise<ExperiencePageData | null> {
  try {
    const payload = await getPayloadClient();
    const isDraft = await isDraftMode();
    const doc = await payload.findGlobal({
      slug: 'experience-page',
      locale,
      draft: isDraft,
      overrideAccess: isDraft,
    });
    if (doc) {
      return {
        hero: {
          kicker: doc.hero?.kicker || '',
          headline: doc.hero?.headline || '',
        },
        quote: doc.quote || '',
        dayToNight: {
          heading: doc.dayToNight?.heading || '',
          subtitle: doc.dayToNight?.subtitle || '',
          morningHeading: doc.dayToNight?.morningHeading || '',
          morningDescription: doc.dayToNight?.morningDescription || '',
          transitionQuote: doc.dayToNight?.transitionQuote || '',
          eveningHeading: doc.dayToNight?.eveningHeading || '',
          eveningDescription: doc.dayToNight?.eveningDescription || '',
        },
        craft: {
          heading: doc.craft?.heading || 'The Craft',
          intro: doc.craft?.intro || 'Behind every plate is a rhythm\nof preparation and precision.',
          body: doc.craft?.body || 'The experience at GEMA is shaped as much by what happens behind the pass as what arrives at the table. Open-kitchen energy, careful plating, and handmade detail give every dish its character.',
        },
      };
    }
  } catch (err) {
    console.error('Failed to fetch experience-page global from Payload:', err);
  }
  return null;
}

export interface OccasionsPageData {
  hero: {
    title: string;
    subtitle: string;
  };
  privateDining: {
    title: string;
    description: string;
    feature1: string;
    feature2: string;
    feature3: string;
  };
  wedding: {
    title: string;
    description: string;
    feature1: string;
    feature2: string;
    feature3: string;
  };
  birthday: {
    title: string;
    description: string;
    feature1: string;
    feature2: string;
    feature3: string;
  };
  brandExclusives: {
    heading: string;
    description: string;
  };
  brandEvents: {
    mondial: { brand: string; title: string };
    frankCo: { brand: string; title: string };
    maharva: { brand: string; title: string };
  };
}

export async function getOccasionsPageData(locale: Locale = 'en'): Promise<OccasionsPageData | null> {
  try {
    const payload = await getPayloadClient();
    const isDraft = await isDraftMode();
    const doc = await payload.findGlobal({
      slug: 'occasions-page',
      locale,
      draft: isDraft,
      overrideAccess: isDraft,
    });
    if (doc) {
      return {
        hero: {
          title: doc.hero?.title || 'Occasions',
          subtitle: doc.hero?.subtitle || '',
        },
        privateDining: {
          title: doc.privateDining?.title || '',
          description: doc.privateDining?.description || '',
          feature1: doc.privateDining?.feature1 || '',
          feature2: doc.privateDining?.feature2 || '',
          feature3: doc.privateDining?.feature3 || '',
        },
        wedding: {
          title: doc.wedding?.title || '',
          description: doc.wedding?.description || '',
          feature1: doc.wedding?.feature1 || '',
          feature2: doc.wedding?.feature2 || '',
          feature3: doc.wedding?.feature3 || '',
        },
        birthday: {
          title: doc.birthday?.title || '',
          description: doc.birthday?.description || '',
          feature1: doc.birthday?.feature1 || '',
          feature2: doc.birthday?.feature2 || '',
          feature3: doc.birthday?.feature3 || '',
        },
        brandExclusives: {
          heading: doc.brandExclusives?.heading || '',
          description: doc.brandExclusives?.description || '',
        },
        brandEvents: {
          mondial: {
            brand: doc.brandEvents?.mondial?.brand || 'Mondial',
            title: doc.brandEvents?.mondial?.title || '',
          },
          frankCo: {
            brand: doc.brandEvents?.frankCo?.brand || 'Frank & Co',
            title: doc.brandEvents?.frankCo?.title || '',
          },
          maharva: {
            brand: doc.brandEvents?.maharva?.brand || 'Maharva',
            title: doc.brandEvents?.maharva?.title || '',
          },
        },
      };
    }
  } catch (err) {
    console.error('Failed to fetch occasions-page global from Payload:', err);
  }
  return null;
}

export interface VisitPageData {
  title: string;
  contactHeading: string;
  reservationsHeading: string;
  reservationsNote: string;
  dietaryPolicy: {
    heading: string;
    description: string;
  };
  dressCodePolicy: {
    heading: string;
    description: string;
  };
  parkingPolicy: {
    heading: string;
    description: string;
  };
}

export async function getVisitPageData(locale: Locale = 'en'): Promise<VisitPageData | null> {
  try {
    const payload = await getPayloadClient();
    const isDraft = await isDraftMode();
    const doc = await payload.findGlobal({
      slug: 'visit-page',
      locale,
      draft: isDraft,
      overrideAccess: isDraft,
    });
    if (doc) {
      return {
        title: doc.title || 'Visit',
        contactHeading: doc.contactHeading || 'Contact',
        reservationsHeading: doc.reservationsHeading || 'Reservations',
        reservationsNote: doc.reservationsNote || '',
        dietaryPolicy: {
          heading: doc.dietaryPolicy?.heading || '',
          description: doc.dietaryPolicy?.description || '',
        },
        dressCodePolicy: {
          heading: doc.dressCodePolicy?.heading || '',
          description: doc.dressCodePolicy?.description || '',
        },
        parkingPolicy: {
          heading: doc.parkingPolicy?.heading || '',
          description: doc.parkingPolicy?.description || '',
        },
      };
    }
  } catch (err) {
    console.error('Failed to fetch visit-page global from Payload:', err);
  }
  return null;
}

export interface RecognitionPageData {
  kicker: string;
  title: string;
  subtitle: string;
}

export async function getRecognitionPageData(locale: Locale = 'en'): Promise<RecognitionPageData | null> {
  try {
    const payload = await getPayloadClient();
    const isDraft = await isDraftMode();
    const doc = await payload.findGlobal({
      slug: 'recognition-page',
      locale,
      draft: isDraft,
      overrideAccess: isDraft,
    });
    if (doc) {
      return {
        kicker: doc.kicker || '',
        title: doc.title || 'Recognition',
        subtitle: doc.subtitle || '',
      };
    }
  } catch (err) {
    console.error('Failed to fetch recognition-page global from Payload:', err);
  }
  return null;
}

export interface EventsPageData {
  title: string;
  subtitle: string;
}

export async function getEventsPageData(locale: Locale = 'en'): Promise<EventsPageData | null> {
  try {
    const payload = await getPayloadClient();
    const isDraft = await isDraftMode();
    const doc = await payload.findGlobal({
      slug: 'events-page',
      locale,
      draft: isDraft,
      overrideAccess: isDraft,
    });
    if (doc) {
      return {
        title: doc.title || "Discover what's happening around the table.",
        subtitle: doc.subtitle || '',
      };
    }
  } catch (err) {
    console.error('Failed to fetch events-page global from Payload:', err);
  }
  return null;
}

export interface JournalPageData {
  title: string;
  subtitle: string;
}

export async function getJournalPageData(locale: Locale = 'en'): Promise<JournalPageData | null> {
  try {
    const payload = await getPayloadClient();
    const isDraft = await isDraftMode();
    const doc = await payload.findGlobal({
      slug: 'journal-page',
      locale,
      draft: isDraft,
      overrideAccess: isDraft,
    });
    if (doc) {
      return {
        title: doc.title || 'Latest from GEMA',
        subtitle: doc.subtitle || '',
      };
    }
  } catch (err) {
    console.error('Failed to fetch journal-page global from Payload:', err);
  }
  return null;
}

export interface HomepageReviewItem {
  id: string;
  quote: string;
  attribution?: string;
  sourceType?: string;
  sourceLabel?: string;
  sourceUrl?: string;
}


export interface HomepageData {
  hero: {
    headline: string;
    kicker: string;
    support: string;
    location: string;
    ctaPrimary: string;
    ctaSecondary: string;
    image: NormalizedMedia;
  };
  positioning: {
    text: string;
    dietary: string;
  };
  signatureDishes: {
    title: string;
    items: MenuItem[];
  };
  chefPreview: {
    text: string;
    ctaLabel: string;
  };
  eventsIntro: {
    ctaLabel: string;
  };
  reviews: {
    kicker: string;
    items: HomepageReviewItem[];
  };
  journalIntro: {
    title: string;
    ctaLabel: string;
  };
  visitIntro: {
    title: string;
    locationHeading: string;
    servicesHeading: string;
  };
  space: {
    title: string;
    text: string;
    ctaLabel: string;
    imagePrimary: NormalizedMedia;
    imageSecondary: NormalizedMedia;
  };
  cuisineTeaser: HomepageCuisineTeaser;
}

export async function getHomepageData(locale: Locale = 'en'): Promise<HomepageData | null> {
  try {
    const payload = await getPayloadClient();
    const isDraft = await isDraftMode();
    const homepage = await payload.findGlobal({
      slug: 'homepage',
      depth: 2,
      locale,
      draft: isDraft,
      overrideAccess: isDraft,
    });

    if (homepage) {

      return {
        hero: {
          headline: homepage.hero?.headline || '',
          kicker: homepage.hero?.kicker || '',
          support: homepage.hero?.support || '',
          location: homepage.hero?.location || '',
          ctaPrimary: homepage.hero?.ctaPrimary || '',
          ctaSecondary: homepage.hero?.ctaSecondary || '',
          image: resolveMedia(homepage.hero?.image),
        },
        positioning: {
          text: homepage.positioning?.text || '',
          dietary: homepage.positioning?.dietary || '',
        },
        signatureDishes: {
          title: homepage.signatureDishes?.title || '',
          items: Array.isArray(homepage.signatureDishes?.items)
            ? homepage.signatureDishes.items
                .filter((item: any) => typeof item === 'object' && item !== null)
                .map((doc: any) => {
                  const catSlug = typeof doc.category === 'object' && doc.category ? doc.category.slug : doc.category;
                  const imageSrc = doc.image ? resolveMedia(doc.image).src : undefined;
                  return {
                    id: doc.sourceKey || String(doc.id),
                    slug: doc.sourceKey || String(doc.id),
                    name: doc.name || '',
                    categoryId: catSlug || '',
                    description: doc.description
                      ? (typeof doc.description === 'object' && doc.description ? doc.description : { en: String(doc.description || ''), id: String(doc.description || '') })
                      : undefined,
                    priceLabel: doc.priceLabel || '',
                    portion: doc.portion || undefined,
                    priceVariants: doc.priceVariants || undefined,
                    subhead: doc.subhead
                      ? (typeof doc.subhead === 'object' && doc.subhead ? doc.subhead : { en: String(doc.subhead || ''), id: String(doc.subhead || '') })
                      : undefined,
                    subheadNote: doc.subheadNote
                      ? (typeof doc.subheadNote === 'object' && doc.subheadNote ? doc.subheadNote : { en: String(doc.subheadNote || ''), id: String(doc.subheadNote || '') })
                      : undefined,
                    additionalNotes: doc.additionalNotes ? doc.additionalNotes.map((n: any) => n.note) : undefined,
                    isIntroBlock: Boolean(doc.isIntroBlock),
                    featured: Boolean(doc.featured),
                    signature: Boolean(doc.signature),
                    image: imageSrc,
                    contentStatus: 'verified' as const,
                  };
                })
            : [],
        },
        chefPreview: {
          text: homepage.chefPreview?.text || '',
          ctaLabel: homepage.chefPreview?.ctaLabel || '',
        },
        eventsIntro: {
          ctaLabel: homepage.eventsIntro?.ctaLabel || '',
        },
        reviews: {
          kicker: homepage.reviews?.kicker || '',
          items: Array.isArray(homepage.reviews?.items)
            ? homepage.reviews.items
                .filter((item: any) => typeof item === 'object' && item !== null && item.verificationStatus === 'verified' && item.isActive !== false)
                .map((doc: any) => ({
                  id: String(doc.id),
                  quote: doc.quote || '',
                  attribution: doc.attribution || undefined,
                  sourceType: doc.sourceType || undefined,
                  sourceLabel: doc.sourceLabel || undefined,
                  sourceUrl: doc.sourceUrl || undefined,
                }))
            : [],
        },
        journalIntro: {
          title: homepage.journalIntro?.title || '',
          ctaLabel: homepage.journalIntro?.ctaLabel || '',
        },
        visitIntro: {
          title: homepage.visitIntro?.title || '',
          locationHeading: homepage.visitIntro?.locationHeading || '',
          servicesHeading: homepage.visitIntro?.servicesHeading || '',
        },
        space: {
          title: homepage.space?.title || '',
          text: homepage.space?.text || '',
          ctaLabel: homepage.space?.ctaLabel || '',
          imagePrimary: resolveMedia(homepage.space?.imagePrimary),
          imageSecondary: resolveMedia(homepage.space?.imageSecondary),
        },
        cuisineTeaser: {
          item01: {
            label: homepage.cuisineTeaser?.item01?.label ?? '',
            image: resolveMedia(homepage.cuisineTeaser?.item01?.image),
          },
          item02: {
            label: homepage.cuisineTeaser?.item02?.label ?? '',
            image: resolveMedia(homepage.cuisineTeaser?.item02?.image),
          },
          item03: {
            label: homepage.cuisineTeaser?.item03?.label ?? '',
            image: resolveMedia(homepage.cuisineTeaser?.item03?.image),
          },
          item04: {
            label: homepage.cuisineTeaser?.item04?.label ?? '',
            image: resolveMedia(homepage.cuisineTeaser?.item04?.image),
          },
        },
      };
    }
  } catch (err) {
    console.error('Failed to fetch homepage data from Payload:', err);
  }
  return null;
}

export async function getHomepageMedia(locale: Locale = 'en'): Promise<HomepageMediaData | null> {
  const data = await getHomepageData(locale);
  if (!data) return null;
  return {
    hero: data.hero.image,
    cuisineTeaser: data.cuisineTeaser,
    space: {
      imagePrimary: data.space.imagePrimary,
      imageSecondary: data.space.imageSecondary,
    },
  };
}

export interface ChefData {
  name: string;
  role: string;
  biography: string;
  quote: string;
  ctaLabel: string;
  previewText: string;
  portrait: NormalizedMedia;
  video: NormalizedVideo;
}

export async function getChefData(locale: Locale = 'en'): Promise<ChefData | null> {
  try {
    const payload = await getPayloadClient();
    const chef = await payload.findGlobal({
      slug: 'chef',
      depth: 1,
      locale,
      overrideAccess: false,
    });

    if (chef) {
      return {
        name: chef.name || 'Mandif Warokka',
        role: chef.role || '',
        biography: chef.biography || '',
        quote: chef.quote || '',
        ctaLabel: chef.ctaLabel || '',
        previewText: chef.previewText || '',
        portrait: resolveMedia(chef.portrait),
        video: resolveVideo(chef.videoFile, chef.videoPoster),
      };
    }
  } catch (err) {
    console.error('Failed to fetch chef data from Payload:', err);
  }
  return null;
}

export async function getChefMedia(locale: Locale = 'en'): Promise<ChefMediaData | null> {
  const data = await getChefData(locale);
  if (!data) return null;
  return {
    portrait: data.portrait,
    video: data.video,
  };
}

export async function getPageMedia(locale: Locale = 'en'): Promise<PageMediaData | null> {
  try {
    const payload = await getPayloadClient();
    const pageMedia = await payload.findGlobal({
      slug: 'page-media',
      depth: 1,
      locale,
      overrideAccess: false,
    });

    if (pageMedia) {

      return {
        menu: {
          foodImage: resolveMedia(pageMedia.menu?.foodImage),
          beverageImage: resolveMedia(pageMedia.menu?.beverageImage),
        },
        about: {
          originImage: resolveMedia(pageMedia.about?.originImage),
          philosophyImage: resolveMedia(pageMedia.about?.philosophyImage),
          architectureImage: resolveMedia(pageMedia.about?.architectureImage),
        },
        experience: {
          heroImage: resolveMedia(pageMedia.experience?.heroImage),
          morningImage: resolveMedia(pageMedia.experience?.morningImage),
          eveningImage: resolveMedia(pageMedia.experience?.eveningImage),
          detailsImage: resolveMedia(pageMedia.experience?.detailsImage),
          materialImage01: pageMedia.experience?.materialImage01 ? resolveMedia(pageMedia.experience.materialImage01) : null,
          materialImage02: pageMedia.experience?.materialImage02 ? resolveMedia(pageMedia.experience.materialImage02) : null,
          materialImage03: pageMedia.experience?.materialImage03 ? resolveMedia(pageMedia.experience.materialImage03) : null,
          materialImage04: pageMedia.experience?.materialImage04 ? resolveMedia(pageMedia.experience.materialImage04) : null,
          craftImage: pageMedia.experience?.craftImage ? resolveMedia(pageMedia.experience.craftImage) : null,
        },
        occasions: {
          heroImage: resolveMedia(pageMedia.occasions?.heroImage),
          privateDiningImage: resolveMedia(pageMedia.occasions?.privateDiningImage),
          weddingImage: resolveMedia(pageMedia.occasions?.weddingImage),
          birthdayImage: resolveMedia(pageMedia.occasions?.birthdayImage),
          brandMondialImage: resolveMedia(pageMedia.occasions?.brandMondialImage),
          brandFrankCoImage: resolveMedia(pageMedia.occasions?.brandFrankCoImage),
          brandMaharvaImage: resolveMedia(pageMedia.occasions?.brandMaharvaImage),
        },
      };
    }
  } catch (err) {
    console.error('Failed to fetch page media from Payload:', err);
  }
  return null;
}

export interface ContentProvider {
  getJournalEntries(locale: Locale): Promise<JournalEntry[]>;
  getJournalEntryBySlug(slug: string, locale: Locale): Promise<JournalEntry | null>;
  isJournalLocaleSubstantive(entry: JournalEntry, locale: Locale): boolean;

  getEvents(locale: Locale, filter?: { status?: 'active' | 'all' }): Promise<Event[]>;
  getEventBySlug(slug: string, locale: Locale, requireActive?: boolean): Promise<Event | null>;

  getMenuCategories(locale: Locale): Promise<MenuCategory[]>;
  getMenuItems(locale: Locale): Promise<MenuItem[]>;

  getOccasionCategories(locale: Locale): Promise<PrivateEventCategory[]>;
  getPastBrandEvents(locale: Locale): Promise<PastBrandEvent[]>;

  getSiteData(locale: Locale): Promise<SiteData>;
  getRecognition(locale: Locale): Promise<RecognitionItem[]>;
  getRecognitionBySlug(slug: string, locale: Locale): Promise<RecognitionItem | null>;
  getReviews(locale: Locale): Promise<ReviewItem[]>;
}

export const contentProvider: ContentProvider = {
  async getJournalEntries(_locale: Locale): Promise<JournalEntry[]> {
    try {
      const payload = await getPayloadClient();
      const isDraft = await isDraftMode();
      const res = await payload.find({
        collection: 'journal-posts',
        where: isDraft ? undefined : {
          _status: { equals: 'published' },
        },
        sort: '-publishDate',
        locale: 'all',
        depth: 1,
        draft: isDraft,
        overrideAccess: isDraft,
      });

      if (res.docs && res.docs.length > 0) {
        return res.docs.map((doc: any) => {
          const coverSrc = doc.coverImage ? resolveMedia(doc.coverImage).src : '';

          const contentEn = doc.content?.en || doc.content;
          const contentId = doc.content?.id || doc.content;
          const rootEn = contentEn?.root || {};
          const rootId = contentId?.root || {};
          const childrenEn: any[] = rootEn.children || [];
          const childrenId: any[] = rootId.children || [];

          const bodyBlocks: BodyBlock[] = [];
          const maxBlocks = Math.max(childrenEn.length, childrenId.length);

          for (let i = 0; i < maxBlocks; i++) {
            const childEn = childrenEn[i] || {};
            const childId = childrenId[i] || {};
            const blockType = childEn.type || childId.type;

            if (blockType === 'paragraph') {
              const textEn = (childEn.children || []).map((c: any) => c.text || '').join('');
              const textId = (childId.children || []).map((c: any) => c.text || '').join('');
              bodyBlocks.push({
                type: 'paragraph',
                content: {
                  en: textEn,
                  id: textId || textEn,
                },
              });
            } else if (blockType === 'quote') {
              const textEn = (childEn.children || []).map((c: any) => c.text || '').join('');
              const textId = (childId.children || []).map((c: any) => c.text || '').join('');
              bodyBlocks.push({
                type: 'quote',
                content: {
                  en: textEn,
                  id: textId || textEn,
                },
              });
            }
          }

          return {
            id: String(doc.id),
            slug: doc.slug,
            category: {
              en: typeof doc.category === 'object' && doc.category ? doc.category.en : String(doc.category || ''),
              id: typeof doc.category === 'object' && doc.category ? doc.category.id : String(doc.category || ''),
            },
            title: {
              en: typeof doc.title === 'object' && doc.title ? doc.title.en : String(doc.title || ''),
              id: typeof doc.title === 'object' && doc.title ? doc.title.id : String(doc.title || ''),
            },
            excerpt: {
              en: typeof doc.excerpt === 'object' && doc.excerpt ? doc.excerpt.en : String(doc.excerpt || ''),
              id: typeof doc.excerpt === 'object' && doc.excerpt ? doc.excerpt.id : String(doc.excerpt || ''),
            },
            bodyBlocks,
            publishDate: doc.publishDate,
            coverImage: coverSrc,
            imageCaption: doc.imageCaption
              ? {
                  en: typeof doc.imageCaption === 'object' && doc.imageCaption ? doc.imageCaption.en || '' : String(doc.imageCaption || ''),
                  id: typeof doc.imageCaption === 'object' && doc.imageCaption ? doc.imageCaption.id || '' : String(doc.imageCaption || ''),
                }
              : undefined,
            authorLabel: doc.authorLabel || 'GEMA Team',
            contentStatus: 'verified',
          };
        });
      }
    } catch (err) {
      console.error('Failed to fetch journal entries from Payload:', err);
    }
    return [];
  },

  async getJournalEntryBySlug(slug: string, locale: Locale): Promise<JournalEntry | null> {
    const entries = await this.getJournalEntries(locale);
    const entry = entries.find((e) => e.slug === slug);
    return entry || null;
  },

  isJournalLocaleSubstantive(entry: JournalEntry, locale: Locale): boolean {
    if (locale === 'en') return true;
    if (locale === 'id') {
      const hasIdTitle = Boolean(entry.title.id && entry.title.id.trim().length > 0);
      const hasIdBody = entry.bodyBlocks.some(
        (b) => b.content.id && b.content.id.trim().length > 0
      );
      return hasIdTitle && hasIdBody;
    }
    return false;
  },

  async getEvents(_locale: Locale, filter = { status: 'active' as 'active' | 'all' }): Promise<Event[]> {
    try {
      const payload = await getPayloadClient();
      const isDraft = await isDraftMode();
      const res = await payload.find({
        collection: 'events',
        where: isDraft ? undefined : {
          _status: { equals: 'published' },
        },
        locale: 'all',
        depth: 1,
        limit: 50,
        draft: isDraft,
        overrideAccess: isDraft,
      });

      if (res.docs && res.docs.length > 0) {
        const mapped: Event[] = res.docs.map((doc: any) => {
          const coverSrc = doc.coverImage ? resolveMedia(doc.coverImage).src : '';

          return {
            id: String(doc.id),
            slug: doc.slug,
            eyebrow: {
              en: typeof doc.eyebrow === 'object' && doc.eyebrow ? doc.eyebrow.en : String(doc.eyebrow || ''),
              id: typeof doc.eyebrow === 'object' && doc.eyebrow ? doc.eyebrow.id : String(doc.eyebrow || ''),
            },
            title: {
              en: typeof doc.title === 'object' && doc.title ? doc.title.en : String(doc.title || ''),
              id: typeof doc.title === 'object' && doc.title ? doc.title.id : String(doc.title || ''),
            },
            shortDescription: {
              en: typeof doc.shortDescription === 'object' && doc.shortDescription ? doc.shortDescription.en : String(doc.shortDescription || ''),
              id: typeof doc.shortDescription === 'object' && doc.shortDescription ? doc.shortDescription.id : String(doc.shortDescription || ''),
            },
            fullDescription: {
              en: typeof doc.fullDescription === 'object' && doc.fullDescription ? doc.fullDescription.en : String(doc.fullDescription || ''),
              id: typeof doc.fullDescription === 'object' && doc.fullDescription ? doc.fullDescription.id : String(doc.fullDescription || ''),
            },
            startDateTime: doc.startDateTime,
            endDateTime: doc.endDateTime,
            eventType: 'Special Event',
            coverImage: coverSrc,
            reservationType: 'enquiry',
            reservationLabel: { en: 'Request Reservation', id: 'Minta Reservasi' },
            capacityLabel: { en: '', id: '' },
            priceLabel: {
              en: typeof doc.priceLabel === 'object' && doc.priceLabel ? doc.priceLabel.en : String(doc.priceLabel || ''),
              id: typeof doc.priceLabel === 'object' && doc.priceLabel ? doc.priceLabel.id : String(doc.priceLabel || ''),
            },
            terms: { en: '', id: '' },
            featured: Boolean(doc.featured),
            contentStatus: 'verified',
          };
        });

        if (filter.status === 'active') {
          return mapped.filter((event) => {
            const state = getEventState(event);
            return state === 'upcoming' || state === 'ongoing';
          });
        }
        return mapped;
      }
    } catch (err) {
      console.error('Failed to fetch events from Payload:', err);
    }
    return [];
  },

  async getEventBySlug(slug: string, locale: Locale, requireActive = true): Promise<Event | null> {
    const all = await this.getEvents(locale, { status: 'all' });
    const event = all.find((e) => e.slug === slug);
    if (!event) return null;
    if (requireActive) {
      const state = getEventState(event);
      if (state === 'past') return null;
    }
    return event;
  },

  async getMenuCategories(_locale: Locale): Promise<MenuCategory[]> {
    try {
      const payload = await getPayloadClient();
      const res = await payload.find({
        collection: 'menu-categories',
        where: {
          isActive: { equals: true },
        },
        sort: 'sortOrder',
        locale: 'all',
        limit: 50,
        overrideAccess: false,
      });

      if (res.docs && res.docs.length > 0) {
        return res.docs.map((doc: any) => ({
          id: doc.slug,
          name: {
            en: typeof doc.name === 'object' && doc.name ? doc.name.en : String(doc.name || ''),
            id: typeof doc.name === 'object' && doc.name ? doc.name.id : String(doc.name || ''),
          },
          order: doc.sortOrder,
          menuType: doc.menuType,
          sectionNote: doc.sectionNote
            ? {
                en: typeof doc.sectionNote === 'object' && doc.sectionNote ? doc.sectionNote.en : String(doc.sectionNote || ''),
                id: typeof doc.sectionNote === 'object' && doc.sectionNote ? doc.sectionNote.id : String(doc.sectionNote || ''),
              }
            : undefined,
        }));
      }
    } catch (err) {
      console.error('Failed to fetch menu categories from Payload:', err);
    }
    return [];
  },

  async getMenuItems(_locale: Locale): Promise<MenuItem[]> {
    try {
      const payload = await getPayloadClient();
      const res = await payload.find({
        collection: 'menu-items',
        where: {
          isAvailable: { equals: true },
        },
        depth: 1,
        limit: 200,
        sort: 'sortOrder',
        locale: 'all',
        overrideAccess: false,
      });

      if (res.docs && res.docs.length > 0) {
        return res.docs.map((doc: any) => {
          const catSlug = typeof doc.category === 'object' && doc.category ? doc.category.slug : doc.category;
          const imageSrc = doc.image ? resolveMedia(doc.image).src : undefined;

          return {
            id: doc.sourceKey || String(doc.id),
            slug: doc.sourceKey || String(doc.id),
            name: doc.name,
            categoryId: catSlug,
            description: doc.description
              ? {
                  en: typeof doc.description === 'object' && doc.description ? doc.description.en : String(doc.description || ''),
                  id: typeof doc.description === 'object' && doc.description ? doc.description.id : String(doc.description || ''),
                }
              : undefined,
            priceLabel: doc.priceLabel || '',
            portion: doc.portion || undefined,
            priceVariants: doc.priceVariants || undefined,
            subhead: doc.subhead
              ? {
                  en: typeof doc.subhead === 'object' && doc.subhead ? doc.subhead.en : String(doc.subhead || ''),
                  id: typeof doc.subhead === 'object' && doc.subhead ? doc.subhead.id : String(doc.subhead || ''),
                }
              : undefined,
            subheadNote: doc.subheadNote
              ? {
                  en: typeof doc.subheadNote === 'object' && doc.subheadNote ? doc.subheadNote.en : String(doc.subheadNote || ''),
                  id: typeof doc.subheadNote === 'object' && doc.subheadNote ? doc.subheadNote.id : String(doc.subheadNote || ''),
                }
              : undefined,
            additionalNotes: doc.additionalNotes ? doc.additionalNotes.map((n: any) => n.note) : undefined,
            isIntroBlock: Boolean(doc.isIntroBlock),
            featured: Boolean(doc.featured),
            signature: Boolean(doc.signature),
            image: imageSrc,
            contentStatus: 'verified',
          };
        });
      }
    } catch (err) {
      console.error('Failed to fetch menu items from Payload:', err);
    }
    return [];
  },

  async getOccasionCategories(locale: Locale): Promise<PrivateEventCategory[]> {
    const pageMedia = await getPageMedia(locale);
    return rawOccasionCategories.map((cat) => {
      let image = '';
      if (cat.id === 'private-dining') image = pageMedia?.occasions.privateDiningImage.src || '';
      else if (cat.id === 'wedding') image = pageMedia?.occasions.weddingImage.src || '';
      else if (cat.id === 'birthday') image = pageMedia?.occasions.birthdayImage.src || '';
      return { ...cat, image };
    });
  },

  async getPastBrandEvents(locale: Locale): Promise<PastBrandEvent[]> {
    const pageMedia = await getPageMedia(locale);
    return rawPastBrandEvents.map((evt) => {
      let image = '';
      if (evt.id === 'mondial') image = pageMedia?.occasions.brandMondialImage.src || '';
      else if (evt.id === 'frank-and-co') image = pageMedia?.occasions.brandFrankCoImage.src || '';
      else if (evt.id === 'maharva') image = pageMedia?.occasions.brandMaharvaImage.src || '';
      return { ...evt, image };
    });
  },

  async getSiteData(locale: Locale): Promise<SiteData> {
    try {
      const payload = await getPayloadClient();
      const settings = await payload.findGlobal({
        slug: 'site-settings',
        locale,
        overrideAccess: false,
      });

      if (settings) {
        return {
          name: settings.restaurantName || '',
          fullAddress: settings.fullAddress || '',
          locationLabel: settings.locationLabel || 'Surabaya, Indonesia',
          mapUrl: settings.mapUrl || '',
          phone: settings.phone || '',
          whatsappNumber: settings.whatsappNumber || '',
          email: settings.email || '',
          dietaryPolicy: settings.dietaryPolicy || (locale === 'id' ? 'Tanpa Babi, Tanpa Lemak Babi' : 'No Pork, No Lard'),
          openingHours: [],
          services: (settings.services as string[]) || ['dine-in'],
          instagramUrl: settings.instagramUrl || '',
          tiktokUrl: settings.tiktokUrl || '',
          contentStatus: {
            name: 'verified',
            fullAddress: 'verified',
            phone: 'verified',
            instagramUrl: 'verified',
          },
        };
      }
    } catch (err) {
      console.error('Failed to fetch site-settings from Payload:', err);
    }
    return {
      name: '',
      fullAddress: '',
      locationLabel: 'Surabaya, Indonesia',
      mapUrl: '',
      phone: '',
      whatsappNumber: '',
      email: '',
      dietaryPolicy: locale === 'id' ? 'Tanpa Babi, Tanpa Lemak Babi' : 'No Pork, No Lard',
      openingHours: [],
      services: ['dine-in'],
      instagramUrl: '',
      tiktokUrl: '',
      contentStatus: {},
    };
  },

  async getRecognition(locale: Locale): Promise<RecognitionItem[]> {
    try {
      const payload = await getPayloadClient();
      const isDraft = await isDraftMode();
      const res = await payload.find({
        collection: 'recognitions',
        where: {
          contentStatus: { equals: 'verified' },
        },
        locale,
        sort: '-year',
        limit: 100,
        draft: isDraft,
        overrideAccess: false,
      });

      if (res.docs && res.docs.length > 0) {
        return res.docs.map((doc: any) => {
          const coverImg = doc.coverImage ? resolveMedia(doc.coverImage).src : undefined;
          const contentEn = doc.content?.en || doc.content;
          const contentId = doc.content?.id || doc.content;
          const rootEn = contentEn?.root || {};
          const rootId = contentId?.root || {};
          const childrenEn: any[] = rootEn.children || [];
          const childrenId: any[] = rootId.children || [];

          const bodyBlocks: BodyBlock[] = [];
          const maxBlocks = Math.max(childrenEn.length, childrenId.length);

          for (let i = 0; i < maxBlocks; i++) {
            const childEn = childrenEn[i] || {};
            const childId = childrenId[i] || {};
            const blockType = childEn.type || childId.type;

            if (blockType === 'paragraph') {
              const textEn = (childEn.children || []).map((c: any) => c.text || '').join('');
              const textId = (childId.children || []).map((c: any) => c.text || '').join('');
              bodyBlocks.push({
                type: 'paragraph',
                content: {
                  en: textEn,
                  id: textId || textEn,
                },
              });
            } else if (blockType === 'quote') {
              const textEn = (childEn.children || []).map((c: any) => c.text || '').join('');
              const textId = (childId.children || []).map((c: any) => c.text || '').join('');
              bodyBlocks.push({
                type: 'quote',
                content: {
                  en: textEn,
                  id: textId || textEn,
                },
              });
            }
          }

          return {
            id: String(doc.id),
            slug: doc.slug || String(doc.id),
            year: String(doc.year || ''),
            date: doc.recognitionDate || String(doc.year || ''),
            title: {
              en: typeof doc.title === 'object' && doc.title ? doc.title.en || '' : String(doc.title || ''),
              id: typeof doc.title === 'object' && doc.title ? doc.title.id || '' : String(doc.title || ''),
            },
            awardingBody: doc.awardingBody || '',
            scope: doc.scope || 'restaurant',
            coverImage: coverImg,
            imageCaption: doc.imageCaption
              ? {
                  en: typeof doc.imageCaption === 'object' && doc.imageCaption ? doc.imageCaption.en || '' : String(doc.imageCaption || ''),
                  id: typeof doc.imageCaption === 'object' && doc.imageCaption ? doc.imageCaption.id || '' : String(doc.imageCaption || ''),
                }
              : undefined,
            excerpt: doc.excerpt
              ? {
                  en: typeof doc.excerpt === 'object' && doc.excerpt ? doc.excerpt.en || '' : String(doc.excerpt || ''),
                  id: typeof doc.excerpt === 'object' && doc.excerpt ? doc.excerpt.id || '' : String(doc.excerpt || ''),
                }
              : undefined,
            bodyBlocks,
            logoOrImage: doc.logoOrImage ? resolveMedia(doc.logoOrImage).src : undefined,
            externalUrl: doc.externalUrl || undefined,
            contentStatus: 'verified',
          };
        });
      }
    } catch (err) {
      console.error('Failed to fetch recognitions from Payload:', err);
    }
    return [];
  },

  async getRecognitionBySlug(slug: string, locale: Locale): Promise<RecognitionItem | null> {
    const items = await this.getRecognition(locale);
    const item = items.find((r) => r.slug === slug);
    return item || null;
  },

  async getReviews(locale: Locale): Promise<ReviewItem[]> {
    try {
      const payload = await getPayloadClient();
      const res = await payload.find({
        collection: 'reviews',
        where: {
          and: [
            { verificationStatus: { equals: 'verified' } },
            { isActive: { equals: true } },
          ],
        },
        locale,
        limit: 100,
        overrideAccess: false,
      });

      if (res.docs && res.docs.length > 0) {
        return res.docs.map((doc: any) => ({
          id: String(doc.id),
          theme: doc.sourceType || 'review',
          text: {
            en: doc.quote || '',
            id: doc.quote || '',
          },
          quote: doc.quote || '',
          attribution: doc.attribution || undefined,
          sourceType: doc.sourceType || undefined,
          sourceLabel: doc.sourceLabel || undefined,
          sourceUrl: doc.sourceUrl || undefined,
          contentStatus: 'verified',
        }));
      }
    } catch (err) {
      console.error('Failed to fetch reviews from Payload:', err);
    }
    return [];
  },
};

// Convenience named exports for direct usage
export const getJournalEntries = (locale: Locale = 'en') => contentProvider.getJournalEntries(locale);
export const getJournalEntryBySlug = (slug: string, locale: Locale = 'en') => contentProvider.getJournalEntryBySlug(slug, locale);
export const isJournalLocaleSubstantive = (entry: JournalEntry, locale: Locale) => contentProvider.isJournalLocaleSubstantive(entry, locale);
export const getEvents = (locale: Locale = 'en', filter?: { status?: 'active' | 'all' }) => contentProvider.getEvents(locale, filter);
export const getEventBySlug = (slug: string, locale: Locale = 'en', requireActive?: boolean) => contentProvider.getEventBySlug(slug, locale, requireActive);
export const getMenuCategories = (locale: Locale = 'en') => contentProvider.getMenuCategories(locale);
export const getMenuItems = (locale: Locale = 'en') => contentProvider.getMenuItems(locale);
export const getOccasionCategories = (locale: Locale = 'en') => contentProvider.getOccasionCategories(locale);
export const getPastBrandEvents = (locale: Locale = 'en') => contentProvider.getPastBrandEvents(locale);
export const getSiteData = (locale: Locale = 'en') => contentProvider.getSiteData(locale);
export const getRecognitions = (locale: Locale = 'en') => contentProvider.getRecognition(locale);
export const getRecognitionBySlug = (slug: string, locale: Locale = 'en') => contentProvider.getRecognitionBySlug(slug, locale);
export const getReviews = (locale: Locale = 'en') => contentProvider.getReviews(locale);

export interface NavLink {
  label: string;
  url: string;
}

export interface NavigationData {
  headerLinks: NavLink[];
  footerLinks: NavLink[];
}

export async function getNavigation(locale: Locale = 'en'): Promise<NavigationData | null> {
  try {
    const payload = await getPayloadClient();
    const nav = await payload.findGlobal({
      slug: 'navigation',
      locale,
      overrideAccess: false,
    });

    if (nav) {
      return {
        headerLinks: (nav.headerLinks || []).map((link: any) => ({
          label: link.label || '',
          url: link.url || '',
        })),
        footerLinks: (nav.footerLinks || []).map((link: any) => ({
          label: link.label || '',
          url: link.url || '',
        })),
      };
    }
  } catch (err) {
    console.error('Failed to fetch navigation from Payload:', err);
  }
  return null;
}

