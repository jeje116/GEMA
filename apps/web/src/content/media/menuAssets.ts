/**
 * Contextual media manifest for the Menu page (GEMA-017).
 * Single source of truth for editorial menu media references.
 */
export const menuAssets = {
  food: {
    src: '/media/menu/menu-food-overview.jpg',
    alt: {
      en: 'A selection of dishes served at GEMA',
      id: 'Pilihan hidangan yang disajikan di GEMA',
    },
    objectPosition: 'object-center',
  },
  beverage: {
    src: '/media/menu/menu-beverage-cocktail.jpg',
    alt: {
      en: 'A cocktail being prepared at GEMA',
      id: 'Koktail sedang disiapkan di GEMA',
    },
    objectPosition: '[object-position:50%_75%]',
  },
} as const;
