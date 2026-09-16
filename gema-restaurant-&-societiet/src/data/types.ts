export type LocalizedText = {
  en: string;
  id: string;
};

export type ContentStatus = 'verified' | 'demo' | 'needs-confirmation';

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  description: LocalizedText;
  priceLabel: string;
  image?: string;
  dietaryNotes?: string[];
  featured?: boolean;
  signature?: boolean;
  contentStatus: ContentStatus;
}

export interface MenuCategory {
  id: string;
  name: LocalizedText;
  order: number;
}

export interface Event {
  id: string;
  slug: string;
  eyebrow: LocalizedText;
  title: LocalizedText;
  shortDescription: LocalizedText;
  fullDescription: LocalizedText;
  startDateTime: string; // ISO 8601
  endDateTime: string;   // ISO 8601
  eventType: string;
  coverImage: string;
  gallery?: string[];
  sampleMenu?: LocalizedText[];
  reservationType: 'ticket' | 'enquiry' | 'standard';
  reservationLabel: LocalizedText;
  capacityLabel: LocalizedText;
  priceLabel: LocalizedText;
  terms: LocalizedText;
  featured?: boolean;
  contentStatus: ContentStatus;
}

export interface JournalEntry {
  id: string;
  slug: string;
  category: LocalizedText;
  title: LocalizedText;
  excerpt: LocalizedText;
  bodyBlocks: { type: 'paragraph' | 'image' | 'quote', content: LocalizedText, url?: string }[];
  publishDate: string; // ISO 8601
  coverImage: string;
  authorLabel: string;
  relatedIds?: string[];
  contentStatus: ContentStatus;
}

export interface Recognition {
  id: string;
  year: string;
  title: LocalizedText;
  awardingBody: string;
  scope: 'restaurant' | 'chef';
  logoOrImage?: string;
  externalUrl?: string;
  contentStatus: ContentStatus;
}

export interface LocationData {
  name: string;
  fullAddress: string;
  mapUrl: string;
  phone: string;
  whatsappNumber: string;
  openingHours: LocalizedText[];
  services: string[];
  instagramUrl: string;
  contentStatus: Partial<Record<keyof LocationData, ContentStatus>>;
}

export interface Review {
  id: string;
  theme: string;
  text: LocalizedText;
  contentStatus: ContentStatus;
}
