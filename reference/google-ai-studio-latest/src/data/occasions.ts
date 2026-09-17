import { PrivateEventCategory, PastBrandEvent } from './types';

export const occasionCategories: PrivateEventCategory[] = [
  {
    id: 'private-dining',
    title: { en: 'Private Dinings', id: 'Makan Malam Privat' },
    description: { 
      en: 'An exclusive culinary journey tailored for intimate gatherings, business dinners, or family celebrations. Enjoy a secluded space with dedicated service and bespoke menus.', 
      id: 'Perjalanan kuliner eksklusif yang dirancang untuk pertemuan intim, makan malam bisnis, atau perayaan keluarga. Nikmati ruang tersembunyi dengan layanan khusus dan menu yang disesuaikan.' 
    },
    image: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80',
    features: [
      { en: 'Customizable tasting menus', id: 'Menu tasting yang dapat disesuaikan' },
      { en: 'Dedicated sommelier', id: 'Sommelier khusus' },
      { en: 'Secluded atmosphere', id: 'Suasana yang tertutup dan intim' }
    ]
  },
  {
    id: 'wedding',
    title: { en: 'Weddings', id: 'Pernikahan' },
    description: { 
      en: 'Celebrate your union in an atmosphere of timeless elegance. From intimate ceremonies to grand receptions, our venue provides a breathtaking backdrop for your special day.', 
      id: 'Rayakan penyatuan Anda dalam suasana keanggunan yang abadi. Dari upacara intim hingga resepsi megah, tempat kami memberikan latar belakang yang menakjubkan untuk hari istimewa Anda.' 
    },
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80',
    features: [
      { en: 'Tailored banquet menus', id: 'Menu perjamuan yang disesuaikan' },
      { en: 'Event coordination', id: 'Koordinasi acara' },
      { en: 'Exclusive venue buyout', id: 'Sewa tempat eksklusif' }
    ]
  },
  {
    id: 'birthday',
    title: { en: 'Birthdays', id: 'Ulang Tahun' },
    description: { 
      en: 'Mark another year of life with an unforgettable celebration. Whether a vibrant party or an elegant dinner, we craft the perfect setting for you and your guests.', 
      id: 'Tandai usia baru dengan perayaan yang tak terlupakan. Baik pesta yang meriah atau makan malam yang elegan, kami merancang suasana yang sempurna untuk Anda dan tamu Anda.' 
    },
    image: 'https://images.unsplash.com/photo-1530103862676-de8892bc6cb4?auto=format&fit=crop&q=80',
    features: [
      { en: 'Artisanal birthday cakes', id: 'Kue ulang tahun artisanal' },
      { en: 'Themed decorations', id: 'Dekorasi tematik' },
      { en: 'Signature cocktails', id: 'Koktail khas' }
    ]
  }
];

export const pastBrandEvents: PastBrandEvent[] = [
  {
    id: 'mondial',
    brand: 'Mondial',
    title: { en: 'Exclusive Jewelry Showcase', id: 'Pameran Perhiasan Eksklusif' },
    image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80'
  },
  {
    id: 'frank-and-co',
    brand: 'Frank & Co',
    title: { en: 'Anniversary Gala Dinner', id: 'Makan Malam Gala Hari Jadi' },
    image: 'https://images.unsplash.com/photo-1599643478524-fb524b7a1493?auto=format&fit=crop&q=80'
  },
  {
    id: 'maharva',
    brand: 'Maharva',
    title: { en: 'Private Collection Launch', id: 'Peluncuran Koleksi Pribadi' },
    image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&q=80'
  }
];
