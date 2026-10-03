export function formatDate(dateString: string, locale: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatTime(dateString: string, locale: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: locale === 'en',
    }).format(date);
  } catch {
    return dateString;
  }
}

import { Event } from '@/content/types';

export function getEventState(event: Event, overrideNow?: Date): 'upcoming' | 'ongoing' | 'past' {
  const checkTime = overrideNow ? overrideNow.getTime() : Date.now();
  const start = new Date(event.startDateTime).getTime();
  const end = new Date(event.endDateTime).getTime();
  
  if (checkTime < start) return 'upcoming';
  if (checkTime <= end) return 'ongoing';
  return 'past';
}
