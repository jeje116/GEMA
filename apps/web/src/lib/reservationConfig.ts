export type ReservationAreaId = 'indoor' | 'indoorGarden';

export interface AreaConfig {
  id: ReservationAreaId;
  name: { en: string; id: string };
  helper?: { en: string; id: string };
  openingTime: string; // '11:00' (11:00 AM)
  lastReservationTime: string; // '21:00' (9:00 PM)
  smokingFrom?: string; // '21:00'
}

export interface ReservationConfig {
  timezone: string; // 'Asia/Jakarta'
  slotIntervalMinutes: number; // 15
  areas: Record<ReservationAreaId, AreaConfig>;
}

export const reservationConfig: ReservationConfig = {
  timezone: 'Asia/Jakarta',
  slotIntervalMinutes: 15,
  areas: {
    indoor: {
      id: 'indoor',
      name: { en: 'Indoor', id: 'Indoor' },
      openingTime: '11:00',
      lastReservationTime: '21:00',
    },
    indoorGarden: {
      id: 'indoorGarden',
      name: { en: 'Indoor Garden', id: 'Indoor Garden' },
      helper: {
        en: 'Smoking area available from 9 PM',
        id: 'Area smoking tersedia mulai pukul 9 malam',
      },
      openingTime: '21:00',
      lastReservationTime: '21:00',
      smokingFrom: '21:00',
    },
  },
};

/**
 * Parses "HH:MM" format string to total minutes from midnight.
 */
export function parseTimeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Formats total minutes from midnight to "HH:MM" 24-hour string.
 */
export function formatMinutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Formats "HH:MM" (24h) to single clean display string with AM/PM (e.g. "1:15 PM", "9:00 PM").
 * Never displays duplicate raw values in parentheses.
 */
export function formatTimeSlotDisplay(timeStr: string): string {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const paddedMinute = m.toString().padStart(2, '0');
  return `${displayHour}:${paddedMinute} ${period}`;
}

/**
 * Formats "YYYY-MM-DD" string into locale-aware full date (e.g. "18 September 2026").
 */
export function formatDateDisplay(dateStr: string, locale: string = 'en'): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/**
 * Formats month and year for calendar header (e.g. "September 2026").
 */
export function formatMonthYear(year: number, month: number, locale: string = 'en'): string {
  const date = new Date(Date.UTC(year, month, 1));
  return new Intl.DateTimeFormat(locale === 'id' ? 'id-ID' : 'en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/**
 * Returns number of days in a given month (0-indexed month).
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Returns the weekday of the first day of the month (0 = Sunday, 6 = Saturday).
 */
export function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/**
 * Returns the current date in YYYY-MM-DD format using the restaurant's timezone (Asia/Jakarta).
 */
export function getJakartaDateString(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: reservationConfig.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return formatter.format(date);
}

/**
 * Returns current hours and minutes in the restaurant's timezone (Asia/Jakarta).
 */
export function getJakartaCurrentTime(date: Date = new Date()): { hours: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: reservationConfig.timezone,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(date);

  const hourStr = parts.find((p) => p.type === 'hour')?.value || '0';
  const minStr = parts.find((p) => p.type === 'minute')?.value || '0';
  return {
    hours: parseInt(hourStr, 10) % 24,
    minutes: parseInt(minStr, 10),
  };
}

/**
 * Generates array of time strings in "HH:MM" format from opening to lastReservationTime inclusive
 * using the configured interval.
 */
export function generateTimeSlots(
  openingTime: string,
  lastReservationTime: string,
  intervalMinutes: number = reservationConfig.slotIntervalMinutes
): string[] {
  const start = parseTimeToMinutes(openingTime);
  const end = parseTimeToMinutes(lastReservationTime);
  const slots: string[] = [];

  for (let m = start; m <= end; m += intervalMinutes) {
    slots.push(formatMinutesToTime(m));
  }

  return slots;
}

/**
 * For same-day reservations:
 * - Current time is rounded forward to the next valid 15-minute boundary
 * - If current time exactly equals a boundary, the started slot is disallowed and next slot is used
 * - Earlier slots are removed
 * Examples:
 * 13:07 -> 13:15
 * 13:15 -> 13:30
 * 20:46 -> 21:00
 * >= 21:00 -> 21:15 (no slots available)
 */
export function getEarliestSlotMinutesForToday(
  currentHours: number,
  currentMinutes: number,
  intervalMinutes: number = reservationConfig.slotIntervalMinutes
): number {
  const currentTotal = currentHours * 60 + currentMinutes;
  const remainder = currentTotal % intervalMinutes;
  if (remainder === 0) {
    return currentTotal + intervalMinutes;
  }
  return currentTotal + (intervalMinutes - remainder);
}

/**
 * Computes available reservation slots given a date and area.
 */
export function getAvailableReservationSlots({
  date,
  area,
  now = new Date(),
  config = reservationConfig,
}: {
  date: string;
  area: ReservationAreaId;
  now?: Date;
  config?: ReservationConfig;
}): string[] {
  const areaConfig = config.areas[area];
  if (!areaConfig) return [];

  const allSlots = generateTimeSlots(
    areaConfig.openingTime,
    areaConfig.lastReservationTime,
    config.slotIntervalMinutes
  );

  const todayStr = getJakartaDateString(now);

  // Past dates: no slots
  if (date < todayStr) {
    return [];
  }

  // Future dates: full slot range (11:00 to 21:00, 41 slots)
  if (date > todayStr) {
    return allSlots;
  }

  // Same-day: remove slots earlier than earliest available slot
  const { hours, minutes } = getJakartaCurrentTime(now);
  const earliestMinutes = getEarliestSlotMinutesForToday(hours, minutes, config.slotIntervalMinutes);

  return allSlots.filter((slot) => parseTimeToMinutes(slot) >= earliestMinutes);
}

/**
 * Checks whether smoking is permitted for an area and time.
 * Indoor Garden permits smoking from 21:00 onwards.
 */
export function isSmokingPermittedAtTime(
  area: ReservationAreaId,
  time: string,
  config: ReservationConfig = reservationConfig
): boolean {
  if (area !== 'indoorGarden') return false;
  const smokingFrom = config.areas.indoorGarden.smokingFrom;
  if (!smokingFrom) return false;
  return parseTimeToMinutes(time) >= parseTimeToMinutes(smokingFrom);
}

export const RESERVATION_MONTH_NAMES = {
  en: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  id: [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ],
};

const MONTH_NAMES_MAP: Record<string, number> = {
  // English full and abbreviations
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12,
  // Indonesian full and abbreviations
  januari: 1,
  februari: 2,
  maret: 3,
  mei: 5,
  juni: 6,
  juli: 7,
  agu: 8, ags: 8, agustus: 8,
  okt: 10, oktober: 10,
  des: 12, desember: 12,
};

export interface ParseDateResult {
  valid: boolean;
  date?: string; // YYYY-MM-DD
  error?: 'invalid' | 'past';
}

/**
 * Parses user-friendly typed date input into YYYY-MM-DD format with restaurant-local validation.
 * Supports:
 * - 18/09/2026, 18-09-2026, 18/9/2026
 * - 2026-09-18, 2026/09/18
 * - 18 Sep 2026, 18 September 2026, 18 Sept 2026, 18 Okt 2026
 *
 * Validates:
 * - Real calendar dates (e.g. 31/02/2026 -> invalid)
 * - Leap years
 * - Against minDate (past date -> 'past')
 */
export function parseReservationDateInput(
  input: string,
  minDate: string = getJakartaDateString()
): ParseDateResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { valid: false };
  }

  let day = 0;
  let month = 0;
  let year = 0;

  // Format 1: DD/MM/YYYY or DD-MM-YYYY (e.g. 18/09/2026, 18-09-2026)
  const dmyMatch = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  // Format 2: YYYY-MM-DD or YYYY/MM/DD (e.g. 2026-09-18)
  const ymdMatch = trimmed.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
  // Format 3: DD Month YYYY (e.g. 18 Sep 2026, 18 September 2026)
  const textMonthMatch = trimmed.match(/^(\d{1,2})[\s\-]+([A-Za-z]+)[\s\-]+(\d{4})$/);

  if (dmyMatch) {
    day = parseInt(dmyMatch[1], 10);
    month = parseInt(dmyMatch[2], 10);
    year = parseInt(dmyMatch[3], 10);
  } else if (ymdMatch) {
    year = parseInt(ymdMatch[1], 10);
    month = parseInt(ymdMatch[2], 10);
    day = parseInt(ymdMatch[3], 10);
  } else if (textMonthMatch) {
    day = parseInt(textMonthMatch[1], 10);
    const monthStr = textMonthMatch[2].toLowerCase();
    month = MONTH_NAMES_MAP[monthStr] || 0;
    year = parseInt(textMonthMatch[3], 10);
    if (!month) {
      return { valid: false, error: 'invalid' };
    }
  } else {
    return { valid: false, error: 'invalid' };
  }

  if (month < 1 || month > 12 || day < 1 || day > 31 || year < 1000) {
    return { valid: false, error: 'invalid' };
  }

  // Calendar reality check (leap year & month day limits)
  const testDate = new Date(Date.UTC(year, month - 1, day));
  if (
    testDate.getUTCFullYear() !== year ||
    testDate.getUTCMonth() !== month - 1 ||
    testDate.getUTCDate() !== day
  ) {
    return { valid: false, error: 'invalid' };
  }

  const formattedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  if (minDate && formattedDate < minDate) {
    return { valid: false, date: formattedDate, error: 'past' };
  }

  return { valid: true, date: formattedDate };
}

/**
 * Tolerant time slot filter.
 * IMPORTANT: ONLY filters elements from the valid `slots` array.
 * NEVER creates arbitrary times.
 *
 * Matches:
 * - "3" -> 3:00 PM, 3:15 PM, 3:30 PM, 3:45 PM
 * - "3:1" -> 3:15 PM
 * - "3:15" -> 3:15 PM
 * - "15:15" or "15:30" -> 3:15 PM or 3:30 PM
 * - "8:45" -> 8:45 PM
 * - "3:10" -> [] (no matching slot)
 */
export function filterTimeSlots(slots: string[], query: string): string[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return slots;

  const noSpaces = trimmed.replace(/\s+/g, '');
  const isAmQuery = noSpaces.endsWith('am');
  const isPmQuery = noSpaces.endsWith('pm');
  // Strip am/pm and replace dot with colon (e.g. 3.15 -> 3:15)
  const cleanQ = noSpaces.replace(/(am|pm)$/, '').replace('.', ':');

  return slots.filter((slot) => {
    const [h, m] = slot.split(':').map(Number);
    const period = h >= 12 ? 'pm' : 'am';

    if (isAmQuery && period !== 'am') return false;
    if (isPmQuery && period !== 'pm') return false;

    const displayHour = h === 0 ? 12 : h > 12 ? h - 12 : h;
    const displayHourStr = displayHour.toString();
    const minuteStr = m.toString().padStart(2, '0');
    const displayWithoutPeriod = `${displayHour}:${minuteStr}`; // e.g. "3:15"
    const displayWithPeriod = `${displayWithoutPeriod} ${period.toUpperCase()}`.toLowerCase(); // "3:15 pm"
    const displayCompact = `${displayHour}${minuteStr}`; // "315"
    const slot24h = slot; // "15:15"
    const slot24hCompact = slot.replace(':', ''); // "1515"
    const h24Str = h.toString();

    // 1. Exact or prefix match on 24-hour string (e.g. "15:15", "15:3", "15")
    if (slot24h.startsWith(cleanQ)) return true;
    if (cleanQ.length >= 3 && slot24hCompact.startsWith(cleanQ)) return true;

    // 2. Exact or prefix match on 12-hour display string (e.g. "3:15", "3:1", "8:45")
    if (displayWithoutPeriod.startsWith(cleanQ)) return true;
    if (displayCompact === cleanQ || (cleanQ.length >= 3 && displayCompact.startsWith(cleanQ))) return true;
    if (displayWithPeriod.startsWith(trimmed)) return true;

    // 3. Hour-only match: if user typed a single number without colon, check if it matches display hour or 24h hour
    // e.g. "3" -> displayHourStr === "3"
    if (!cleanQ.includes(':') && (displayHourStr === cleanQ || h24Str === cleanQ)) {
      return true;
    }

    return false;
  });
}
