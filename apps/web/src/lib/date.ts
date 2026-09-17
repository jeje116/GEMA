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
