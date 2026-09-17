import { SiteData } from '../types';

export const siteData: SiteData = {
  name: "GEMA Restaurant & Societiet",
  fullAddress: "Jl. Musi No. 32, Darmo, Kec. Wonokromo, Surabaya, Jawa Timur 60241, Indonesia",
  mapUrl: "https://maps.google.com/?q=Jl.+Musi+No.+32,+Darmo,+Kec.+Wonokromo,+Surabaya,+Jawa+Timur+60241,+Indonesia",
  phone: "0812-5220-0049",
  whatsappNumber: "6281252200049",
  email: "reservations@gemasurabaya.com",
  openingHours: [
    { en: "Monday - Sunday: 11:00 AM - 10:00 PM", id: "Senin - Minggu: 11:00 - 22:00" },
    { en: "Concept hours - confirm before production", id: "Waktu konsep - konfirmasi sebelum produksi" }
  ],
  services: ["dine-in", "takeaway"],
  instagramUrl: "https://instagram.com/gema.surabaya",
  contentStatus: {
    name: 'verified',
    fullAddress: 'verified',
    phone: 'verified',
    instagramUrl: 'verified',
    openingHours: 'needs-confirmation',
  }
};

export const DEMO_MODE = true;
