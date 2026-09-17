import { Event } from '../types';

// Generate relative dates for demo purposes
const now = new Date();
const msPerDay = 24 * 60 * 60 * 1000;

function createDateString(daysOffset: number): string {
  return new Date(now.getTime() + daysOffset * msPerDay).toISOString();
}

export const events: Event[] = [
  // Ongoing Event
  {
    id: 'evt-1',
    slug: 'private-table-series',
    eyebrow: { en: 'Special Collaboration', id: 'Kolaborasi Spesial' },
    title: { en: 'Private Table Series', id: 'Seri Meja Privat' },
    shortDescription: { en: 'An exclusive tasting menu featuring seasonal ingredients.', id: 'Menu mencicipi eksklusif menampilkan bahan-bahan musiman.' },
    fullDescription: { en: 'Join us for an intimate culinary journey where Chef Mandif showcases the best of local and imported seasonal produce, crafted into modern Italian masterpieces.', id: 'Bergabunglah dengan kami dalam perjalanan kuliner intim di mana Chef Mandif memamerkan produk musiman lokal dan impor terbaik, yang diolah menjadi mahakarya Italia modern.' },
    startDateTime: createDateString(-1), // Started yesterday
    endDateTime: createDateString(1),    // Ends tomorrow
    eventType: 'Tasting Menu',
    coverImage: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80',
    reservationType: 'enquiry',
    reservationLabel: { en: 'Enquire Now', id: 'Tanya Sekarang' },
    capacityLabel: { en: '12 Seats per Session', id: '12 Kursi per Sesi' },
    priceLabel: { en: 'Rp 1.250.000 / person', id: 'Rp 1.250.000 / orang' },
    terms: { en: 'Advance booking required. Dietary requirements must be stated upon booking.', id: 'Diperlukan pemesanan di muka. Kebutuhan diet harus dicantumkan saat pemesanan.' },
    featured: true,
    contentStatus: 'demo'
  },
  // Upcoming Event 1
  {
    id: 'evt-2',
    slug: 'seasonal-tasting',
    eyebrow: { en: 'Spring Menu', id: 'Menu Musim Semi' },
    title: { en: 'Seasonal Tasting', id: 'Pencicipan Musiman' },
    shortDescription: { en: 'A fresh approach to Italian spring classics.', id: 'Pendekatan segar untuk masakan klasik musim semi Italia.' },
    fullDescription: { en: 'Celebrate the change of seasons with our new 5-course tasting menu, highlighting fresh herbs, delicate vegetables, and prime cuts of meat.', id: 'Rayakan pergantian musim dengan menu mencicipi 5 hidangan baru kami, menonjolkan rempah segar, sayuran halus, dan potongan daging utama.' },
    startDateTime: createDateString(14),
    endDateTime: createDateString(15),
    eventType: 'Dinner Event',
    coverImage: 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&q=80',
    reservationType: 'ticket',
    reservationLabel: { en: 'Reserve Your Seat', id: 'Pesan Kursi Anda' },
    capacityLabel: { en: '30 Seats Available', id: '30 Kursi Tersedia' },
    priceLabel: { en: 'Rp 950.000 / person', id: 'Rp 950.000 / orang' },
    terms: { en: 'Full payment required to secure reservation.', id: 'Pembayaran penuh diperlukan untuk mengamankan reservasi.' },
    featured: true,
    contentStatus: 'demo'
  },
  // Upcoming Event 2
  {
    id: 'evt-3',
    slug: 'sunday-society',
    eyebrow: { en: 'Weekend Gathering', id: 'Kumpul Akhir Pekan' },
    title: { en: 'Sunday Society', id: 'Masyarakat Minggu' },
    shortDescription: { en: 'A relaxed Sunday lunch featuring our signature sharing plates.', id: 'Makan siang hari Minggu yang santai menampilkan piring berbagi khas kami.' },
    fullDescription: { en: 'Gather your friends and family for a long, lazy Sunday lunch. Abundant portions, convivial atmosphere, and the true spirit of Societiet.', id: 'Kumpulkan teman dan keluarga Anda untuk makan siang hari Minggu yang panjang dan santai. Porsi berlimpah, suasana ramah, dan semangat sejati Societiet.' },
    startDateTime: createDateString(45),
    endDateTime: createDateString(45.5),
    eventType: 'Lunch',
    coverImage: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80',
    reservationType: 'standard',
    reservationLabel: { en: 'Reserve a Table', id: 'Pesan Meja' },
    capacityLabel: { en: 'Open Seating', id: 'Tempat Duduk Terbuka' },
    priceLabel: { en: 'A la carte', id: 'A la carte' },
    terms: { en: 'Standard reservation policy applies.', id: 'Berlaku kebijakan reservasi standar.' },
    contentStatus: 'demo'
  },
  // Past Event 1
  {
    id: 'evt-4',
    slug: 'an-evening-of-fresh-pasta',
    eyebrow: { en: 'Masterclass', id: 'Kelas Master' },
    title: { en: 'An Evening of Fresh Pasta', id: 'Malam Pasta Segar' },
    shortDescription: { en: 'A hands-on journey into the art of pasta making.', id: 'Perjalanan langsung ke dalam seni pembuatan pasta.' },
    fullDescription: { en: 'Guests joined Chef Mandif for an intimate masterclass, learning the secrets behind our signature fresh pasta, followed by a communal dinner.', id: 'Para tamu bergabung dengan Chef Mandif untuk kelas master yang intim, mempelajari rahasia di balik pasta segar khas kami, diikuti dengan makan malam bersama.' },
    startDateTime: createDateString(-30),
    endDateTime: createDateString(-29.8),
    eventType: 'Masterclass & Dinner',
    coverImage: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80',
    reservationType: 'ticket',
    reservationLabel: { en: 'View the story', id: 'Lihat cerita' },
    capacityLabel: { en: '10 Participants', id: '10 Peserta' },
    priceLabel: { en: 'Rp 1.500.000 / person', id: 'Rp 1.500.000 / orang' },
    terms: { en: 'Past Event', id: 'Acara Berlalu' },
    contentStatus: 'demo'
  },
  // Past Event 2
  {
    id: 'evt-5',
    slug: 'fire-and-flour',
    eyebrow: { en: 'Pizza Showcase', id: 'Pameran Pizza' },
    title: { en: 'Fire and Flour', id: 'Api dan Tepung' },
    shortDescription: { en: 'Celebrating the perfect wood-fired crust.', id: 'Merayakan kulit pizza bakar kayu yang sempurna.' },
    fullDescription: { en: 'A night dedicated to the art of Neapolitan-style pizza, featuring exclusive off-menu toppings and a deep dive into dough fermentation.', id: 'Malam yang didedikasikan untuk seni pizza ala Neapolitan, menampilkan pugasan eksklusif di luar menu dan penyelaman mendalam ke fermentasi adonan.' },
    startDateTime: createDateString(-90),
    endDateTime: createDateString(-89.8),
    eventType: 'Dinner Showcase',
    coverImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80',
    reservationType: 'standard',
    reservationLabel: { en: 'View the story', id: 'Lihat cerita' },
    capacityLabel: { en: 'Restaurant Capacity', id: 'Kapasitas Restoran' },
    priceLabel: { en: 'A la carte', id: 'A la carte' },
    terms: { en: 'Past Event', id: 'Acara Berlalu' },
    contentStatus: 'demo'
  },
  // Past Event 3
  {
    id: 'evt-6',
    slug: 'a-table-for-two',
    eyebrow: { en: 'Valentine Special', id: 'Spesial Valentine' },
    title: { en: 'A Table for Two', id: 'Meja untuk Dua Orang' },
    shortDescription: { en: 'An intimate evening of romance and fine dining.', id: 'Malam intim penuh romansa dan santapan mewah.' },
    fullDescription: { en: 'Couples celebrated love with our curated 7-course tasting menu, paired with ambient live acoustic music in our garden setting.', id: 'Pasangan merayakan cinta dengan menu mencicipi 7 hidangan kurasi kami, dipadukan dengan musik akustik live yang menenangkan di taman kami.' },
    startDateTime: createDateString(-180),
    endDateTime: createDateString(-179.8),
    eventType: 'Special Dinner',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
    reservationType: 'ticket',
    reservationLabel: { en: 'View the story', id: 'Lihat cerita' },
    capacityLabel: { en: 'Couples Only', id: 'Hanya Pasangan' },
    priceLabel: { en: 'Rp 2.000.000 / couple', id: 'Rp 2.000.000 / pasangan' },
    terms: { en: 'Past Event', id: 'Acara Berlalu' },
    contentStatus: 'demo'
  }
];

export function getEventState(event: Event, overrideNow?: Date): 'upcoming' | 'ongoing' | 'past' {
  const checkTime = overrideNow ? overrideNow.getTime() : Date.now();
  const start = new Date(event.startDateTime).getTime();
  const end = new Date(event.endDateTime).getTime();
  
  if (checkTime < start) return 'upcoming';
  if (checkTime <= end) return 'ongoing';
  return 'past';
}
