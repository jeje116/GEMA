/**
 * Central staging media manifest for homepage assets.
 * Single source of truth for homepage media references.
 */
export const homeAssets = {
  hero: {
    // Approved single source across desktop and mobile
    src: '/media/hero/home-hero-open-kitchen.jpg',
    alt: 'GEMA Open Kitchen',
  },
  cuisineTeaser: [
    {
      id: 'antipasti',
      key: 'ANTIPASTI',
      name: { en: 'ANTIPASTI', id: 'ANTIPASTI' },
      img: '/media/teaser/home-menu-teaser-antipasti.jpg',
      alt: 'GEMA Antipasti — Crispy Fritto Misto',
      objectPosition: 'object-center',
    },
    {
      id: 'pasta',
      key: 'PASTA',
      name: { en: 'PASTA', id: 'PASTA' },
      img: '/media/teaser/home-menu-teaser-pasta.jpg',
      alt: 'GEMA Pasta — Fresh Spaghetti Sauté Plating',
      objectPosition: 'object-center',
    },
    {
      id: 'woodfire-grill',
      key: 'WOODFIRE & GRILL',
      name: { en: 'WOODFIRE & GRILL', id: 'WOODFIRE & GRILL' },
      img: '/media/teaser/home-menu-teaser-grill.jpg',
      alt: 'GEMA Woodfire & Grill — Sliced Grilled Wagyu Steak',
      // Prioritize the grilled steak in the upper-middle area
      objectPosition: 'object-[center_35%]',
    },
    {
      id: 'dolci',
      key: 'DOLCI',
      name: { en: 'DOLCI', id: 'DOLCI' },
      img: '/media/teaser/home-menu-teaser-dolci.jpg',
      alt: 'GEMA Dolci — Cocoa Dusted Signature Tiramisu',
      objectPosition: 'object-center',
    },
  ],
  experience: {
    indoor: {
      src: '/media/experience/home-experience-indoor.jpg',
      alt: 'GEMA Indoor Dining Room Architecture',
    },
    patio: {
      src: '/media/experience/home-experience-patio.jpg',
      alt: 'GEMA Lush Garden Patio Dining',
    },
  },
  signatures: {
    steak: {
      src: '/media/signature/home-signature-steak.jpg',
      alt: 'Toploin Kiwami Eye Fillet MB9+',
    },
    tiramisu: {
      src: '/media/signature/home-signature-tiramisu.jpg',
      alt: 'Classic Tiramisu',
    },
  },
  cocktail: {
    // Preserved for future beverage / bar showcase per GEMA-016A directive
    driveSource: 'QAR04031.jpg',
    note: 'Preserved for bar/beverage usage; not used in Menu Teaser',
  },
  diningRoom: {
    // Retained for another appropriate homepage or Experience/Space use
    src: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80',
    alt: 'GEMA Dining Room Interior',
    usageNote: 'Retained for future homepage or Experience/Space use',
  },
  chefVideo: {
    driveFileId: '1-FyV-tjBSYFPREnlLVztF09dCSut5Zv8',
    // Design-staging web derivative (H.264, 18s continuous loop, no audio track, fast-start)
    src: '/media/video/chef-home-loop.mp4',
    poster: 'https://lh3.googleusercontent.com/d/1-FyV-tjBSYFPREnlLVztF09dCSut5Zv8',
  },
};
