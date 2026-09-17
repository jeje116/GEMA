import { Locale } from '../i18n/config';
import {
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

import { events as rawEvents, getEventState } from './fixtures/events';
import { journalEntries as rawJournalEntries } from './fixtures/journal';
import { menuCategories as rawMenuCategories, menuItems as rawMenuItems } from './fixtures/menu';
import { occasionCategories as rawOccasionCategories, pastBrandEvents as rawPastBrandEvents } from './fixtures/occasions';
import { recognitions as rawRecognitions } from './fixtures/recognition';
import { reviews as rawReviews } from './fixtures/reviews';
import { siteData as rawSiteData } from './fixtures/site';

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
  getReviews(locale: Locale): Promise<ReviewItem[]>;
}

export const contentProvider: ContentProvider = {
  async getJournalEntries(_locale: Locale): Promise<JournalEntry[]> {
    return [...rawJournalEntries].sort(
      (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
    );
  },

  async getJournalEntryBySlug(slug: string, _locale: Locale): Promise<JournalEntry | null> {
    const entry = rawJournalEntries.find((e) => e.slug === slug);
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
    if (filter.status === 'active') {
      return rawEvents.filter((event) => {
        const state = getEventState(event);
        return state === 'upcoming' || state === 'ongoing';
      });
    }
    return [...rawEvents];
  },

  async getEventBySlug(slug: string, _locale: Locale, requireActive = true): Promise<Event | null> {
    const event = rawEvents.find((e) => e.slug === slug);
    if (!event) return null;
    if (requireActive) {
      const state = getEventState(event);
      if (state === 'past') return null;
    }
    return event;
  },

  async getMenuCategories(_locale: Locale): Promise<MenuCategory[]> {
    return [...rawMenuCategories].sort((a, b) => a.order - b.order);
  },

  async getMenuItems(_locale: Locale): Promise<MenuItem[]> {
    return [...rawMenuItems];
  },

  async getOccasionCategories(_locale: Locale): Promise<PrivateEventCategory[]>{
    return [...rawOccasionCategories];
  },

  async getPastBrandEvents(_locale: Locale): Promise<PastBrandEvent[]> {
    return [...rawPastBrandEvents];
  },

  async getSiteData(_locale: Locale): Promise<SiteData> {
    return { ...rawSiteData };
  },

  async getRecognition(_locale: Locale): Promise<RecognitionItem[]> {
    return [...rawRecognitions];
  },

  async getReviews(_locale: Locale): Promise<ReviewItem[]> {
    return [...rawReviews];
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
export const getReviews = (locale: Locale = 'en') => contentProvider.getReviews(locale);
