import { MenuCategory, MenuItem } from '../types';

export const menuCategories: MenuCategory[] = [
  // FOOD CATEGORIES (11 in exact order)
  {
    id: 'cicchetti',
    name: { en: 'CICCHETTI / Snacks', id: 'CICCHETTI / Snacks' },
    order: 1,
    menuType: 'food'
  },
  {
    id: 'antipasti',
    name: { en: 'ANTIPASTI / Appetizers', id: 'ANTIPASTI / Appetizers' },
    order: 2,
    menuType: 'food'
  },
  {
    id: 'artisan-cold-cuts',
    name: { en: 'ARTISAN COLD CUTS', id: 'ARTISAN COLD CUTS' },
    order: 3,
    menuType: 'food',
    sectionNote: {
      en: 'All the artisan cold cut selection is served with homemade sourdough, gherkins and mustard.',
      id: 'All the artisan cold cut selection is served with homemade sourdough, gherkins and mustard.'
    }
  },
  {
    id: 'panini',
    name: { en: 'PANINI / Sandwich', id: 'PANINI / Sandwich' },
    order: 4,
    menuType: 'food',
    sectionNote: {
      en: 'All the Panini sandwich is made with sourdough focaccia bread.',
      id: 'All the Panini sandwich is made with sourdough focaccia bread.'
    }
  },
  {
    id: 'insalata',
    name: { en: 'INSALATA / Salad', id: 'INSALATA / Salad' },
    order: 5,
    menuType: 'food'
  },
  {
    id: 'zuppa',
    name: { en: 'ZUPPA / Soup', id: 'ZUPPA / Soup' },
    order: 6,
    menuType: 'food'
  },
  {
    id: 'pizzetta',
    name: { en: 'PIZZETTA / Small Pizza', id: 'PIZZETTA / Small Pizza' },
    order: 7,
    menuType: 'food',
    sectionNote: {
      en: 'Our Pizzetta is made with naturally fermented sourdough, rested for at least 24 hours. Baked at high heat, it develops light charring for a crisp texture and rich complex flavor.',
      id: 'Our Pizzetta is made with naturally fermented sourdough, rested for at least 24 hours. Baked at high heat, it develops light charring for a crisp texture and rich complex flavor.'
    }
  },
  {
    id: 'pasta',
    name: { en: 'PASTA', id: 'PASTA' },
    order: 8,
    menuType: 'food'
  },
  {
    id: 'woodfire-grill',
    name: { en: 'WOODFIRE & GRILL', id: 'WOODFIRE & GRILL' },
    order: 9,
    menuType: 'food'
  },
  {
    id: 'secondi',
    name: { en: 'SECONDI', id: 'SECONDI' },
    order: 10,
    menuType: 'food'
  },
  {
    id: 'dolci',
    name: { en: 'DOLCI / Dessert', id: 'DOLCI / Dessert' },
    order: 11,
    menuType: 'food'
  },

  // BEVERAGE CATEGORIES (9 in exact order)
  {
    id: 'cocktail',
    name: { en: 'COCKTAIL', id: 'COCKTAIL' },
    order: 1,
    menuType: 'beverage'
  },
  {
    id: 'mocktail',
    name: { en: 'MOCKTAIL', id: 'MOCKTAIL' },
    order: 2,
    menuType: 'beverage'
  },
  {
    id: 'signature-coffee',
    name: { en: 'SIGNATURE COFFEE', id: 'SIGNATURE COFFEE' },
    order: 3,
    menuType: 'beverage'
  },
  {
    id: 'coffee',
    name: { en: 'COFFEE', id: 'COFFEE' },
    order: 4,
    menuType: 'beverage'
  },
  {
    id: 'iced-tea',
    name: { en: 'ICED TEA', id: 'ICED TEA' },
    order: 5,
    menuType: 'beverage'
  },
  {
    id: 'hot-tea',
    name: { en: 'HOT TEA', id: 'HOT TEA' },
    order: 6,
    menuType: 'beverage'
  },
  {
    id: 'fresh-juice',
    name: { en: 'FRESH JUICE', id: 'FRESH JUICE' },
    order: 7,
    menuType: 'beverage'
  },
  {
    id: 'beer',
    name: { en: 'BEER', id: 'BEER' },
    order: 8,
    menuType: 'beverage'
  },
  {
    id: 'soft-drink-water',
    name: { en: 'SOFT DRINK & WATER', id: 'SOFT DRINK & WATER' },
    order: 9,
    menuType: 'beverage'
  }
];

export const menuItems: MenuItem[] = [
  // ==========================================
  // 1. CICCHETTI / Snacks
  // ==========================================
  {
    id: 'cicchetti-1',
    slug: 'ravioli-fritti',
    name: 'Ravioli Fritti',
    categoryId: 'cicchetti',
    description: { en: 'Beef Tounge, Mozzarella, Sweet Chili Dips', id: 'Beef Tounge, Mozzarella, Sweet Chili Dips' },
    priceLabel: 'Rp 65.000',
    contentStatus: 'verified'
  },
  {
    id: 'cicchetti-2',
    slug: 'patatine',
    name: 'Patatine',
    categoryId: 'cicchetti',
    description: { en: 'Gorgonzola Cream Dip', id: 'Gorgonzola Cream Dip' },
    priceLabel: 'Rp 49.000',
    contentStatus: 'verified'
  },
  {
    id: 'cicchetti-3',
    slug: 'gamberetti-fritti',
    name: 'Gamberetti Fritti',
    categoryId: 'cicchetti',
    description: { en: 'Shrimps, Spice Dust, Aioli Dip', id: 'Shrimps, Spice Dust, Aioli Dip' },
    priceLabel: 'Rp 69.000',
    contentStatus: 'verified'
  },
  {
    id: 'cicchetti-4',
    slug: 'parmesan-chips',
    name: 'Parmesan Chips',
    categoryId: 'cicchetti',
    description: { en: 'Salsa di Pomodoro', id: 'Salsa di Pomodoro' },
    priceLabel: 'Rp 55.000',
    contentStatus: 'verified'
  },
  {
    id: 'cicchetti-5',
    slug: 'truffle-fries',
    name: 'Truffle Fries',
    categoryId: 'cicchetti',
    description: { en: 'Truffle Aioli', id: 'Truffle Aioli' },
    priceLabel: 'Rp 65.000',
    contentStatus: 'verified'
  },
  {
    id: 'cicchetti-6',
    slug: 'tripple-fries-ragout',
    name: 'Tripple Fries Ragout',
    categoryId: 'cicchetti',
    description: { en: 'Braised Beef Ragout, Grana Padano DOP', id: 'Braised Beef Ragout, Grana Padano DOP' },
    priceLabel: 'Rp 65.000',
    contentStatus: 'verified'
  },

  // ==========================================
  // 2. ANTIPASTI / Appetizers
  // ==========================================
  {
    id: 'antipasti-1',
    slug: 'ricotta-cheese-balls',
    name: 'Ricotta Cheese Balls',
    categoryId: 'antipasti',
    description: { en: 'Marinara Sauce', id: 'Marinara Sauce' },
    priceLabel: 'Rp 60.000',
    contentStatus: 'verified'
  },
  {
    id: 'antipasti-2',
    slug: 'vongole-con-vino',
    name: 'Vongole Con Vino',
    categoryId: 'antipasti',
    description: { en: 'Tomato, Anchovies, Basil, White Wine', id: 'Tomato, Anchovies, Basil, White Wine' },
    priceLabel: 'Rp 85.000',
    contentStatus: 'verified'
  },
  {
    id: 'antipasti-3',
    slug: 'fritto-misto',
    name: 'Fritto Misto',
    categoryId: 'antipasti',
    description: { en: 'Calamari, Zucchini, Onion Ring, Tartar Sauce', id: 'Calamari, Zucchini, Onion Ring, Tartar Sauce' },
    priceLabel: 'Rp 75.000',
    contentStatus: 'verified'
  },
  {
    id: 'antipasti-4',
    slug: 'ostriche-grigliate',
    name: 'Ostriche Grigliate',
    categoryId: 'antipasti',
    description: { en: 'Nduja, Pesto, Carbonara', id: 'Nduja, Pesto, Carbonara' },
    priceLabel: 'Rp 185.000',
    contentStatus: 'verified'
  },

  // ==========================================
  // 3. ARTISAN COLD CUTS
  // ==========================================
  {
    id: 'coldcuts-1',
    slug: 'pancetta-miyazaki-a5-affumicato',
    name: 'Pancetta Miyazaki A5 Affumicato',
    categoryId: 'artisan-cold-cuts',
    portion: '80gr',
    priceLabel: 'Rp 300.000',
    contentStatus: 'verified'
  },
  {
    id: 'coldcuts-2',
    slug: 'chicken-pistachio-mortadella',
    name: 'Chicken Pistachio Mortadella',
    categoryId: 'artisan-cold-cuts',
    portion: '150gr',
    priceLabel: 'Rp 95.000',
    contentStatus: 'verified'
  },
  {
    id: 'coldcuts-3',
    slug: 'wagyu-beef-mortadella',
    name: 'Wagyu Beef Mortadella',
    categoryId: 'artisan-cold-cuts',
    portion: '150gr',
    priceLabel: 'Rp 98.000',
    contentStatus: 'verified'
  },

  // ==========================================
  // 4. PANINI / Sandwich
  // ==========================================
  {
    id: 'panini-1',
    slug: 'pistachio-chicken-mortadella-panini',
    name: 'Pistachio Chicken Mortadella',
    categoryId: 'panini',
    description: { en: 'Pistachio Aioli, Gherkin, Stracciatella', id: 'Pistachio Aioli, Gherkin, Stracciatella' },
    priceLabel: 'Rp 75.000',
    contentStatus: 'verified'
  },
  {
    id: 'panini-2',
    slug: 'mortadella-di-manzo-panini',
    name: 'Mortadella di Manzo',
    categoryId: 'panini',
    description: { en: 'Garlic Aioli, Red Onion, Gherkin, Bocconcini', id: 'Garlic Aioli, Red Onion, Gherkin, Bocconcini' },
    priceLabel: 'Rp 80.000',
    contentStatus: 'verified'
  },
  {
    id: 'panini-3',
    slug: 'miyazaki-a5-pancetta-panini',
    name: 'Miyazaki A5 Pancetta',
    categoryId: 'panini',
    description: { en: 'Pomodorini Salsa, Red Onion, Artichoke', id: 'Pomodorini Salsa, Red Onion, Artichoke' },
    priceLabel: 'Rp 110.000',
    contentStatus: 'verified'
  },
  {
    id: 'panini-4',
    slug: 'stracciatella-panini',
    name: 'Stracciatella',
    categoryId: 'panini',
    description: { en: 'Pomodorini Salsa, Extra Virgin Olive Oil', id: 'Pomodorini Salsa, Extra Virgin Olive Oil' },
    priceLabel: 'Rp 70.000',
    contentStatus: 'verified'
  },

  // ==========================================
  // 5. INSALATA / Salad
  // ==========================================
  {
    id: 'insalata-1',
    slug: 'stracciatella-pancetta-a5',
    name: 'Stracciatella Pancetta A5',
    categoryId: 'insalata',
    description: { en: 'Tomato, Red Onion, Stracciatella, Capers, Tomato Dressing, EVOO', id: 'Tomato, Red Onion, Stracciatella, Capers, Tomato Dressing, EVOO' },
    priceLabel: 'Rp 110.000',
    contentStatus: 'verified'
  },
  {
    id: 'insalata-2',
    slug: 'organic-kale-e-pancetta',
    name: 'Organic Kale e Pancetta',
    categoryId: 'insalata',
    description: { en: 'Frisse, Bronze Fennel, Fried Pancetta, Almond, Sliced Parmesan, Poached Egg, Cherry Tomato, Honey Mustard Dressing', id: 'Frisse, Bronze Fennel, Fried Pancetta, Almond, Sliced Parmesan, Poached Egg, Cherry Tomato, Honey Mustard Dressing' },
    priceLabel: 'Rp 98.000',
    contentStatus: 'verified'
  },
  {
    id: 'insalata-3',
    slug: 'burrata-e-red-beet',
    name: 'Burrata e Red Beet',
    categoryId: 'insalata',
    description: { en: 'Radicchio, Pickle Red Beet, Walnut, Balsamic Dressing', id: 'Radicchio, Pickle Red Beet, Walnut, Balsamic Dressing' },
    priceLabel: 'Rp 145.000',
    contentStatus: 'verified'
  },
  {
    id: 'insalata-4',
    slug: 'caesar-salad',
    name: 'Caesar Salad',
    categoryId: 'insalata',
    description: { en: 'Baby Romaine, Beef Bacon, Omega Hen Egg, Capers, Crouton, Grana Padano DOP', id: 'Baby Romaine, Beef Bacon, Omega Hen Egg, Capers, Crouton, Grana Padano DOP' },
    priceLabel: 'Rp 85.000',
    contentStatus: 'verified'
  },

  // ==========================================
  // 6. ZUPPA / Soup
  // ==========================================
  {
    id: 'zuppa-1',
    slug: 'crema-di-funghi',
    name: 'Crema di Funghi',
    categoryId: 'zuppa',
    description: { en: 'Wild Mushroom, Cream, White Wine Foam, Truffle', id: 'Wild Mushroom, Cream, White Wine Foam, Truffle' },
    priceLabel: 'Rp 80.000',
    contentStatus: 'verified'
  },
  {
    id: 'zuppa-2',
    slug: 'zuppa-di-pomodoro',
    name: 'Zuppa di Pomodoro',
    categoryId: 'zuppa',
    description: { en: 'Pomodorini, Tomato, Cream, Thyme, Basil', id: 'Pomodorini, Tomato, Cream, Thyme, Basil' },
    priceLabel: 'Rp 80.000',
    contentStatus: 'verified'
  },

  // ==========================================
  // 7. PIZZETTA / Small Pizza
  // ==========================================
  {
    id: 'pizzetta-1',
    slug: 'chicken-pistachio-di-stracciatella',
    name: 'Chicken Pistachio di Stracciatella',
    categoryId: 'pizzetta',
    description: { en: 'Kale, Pesto, Pistachio Aioli, Grana Padano DOP', id: 'Kale, Pesto, Pistachio Aioli, Grana Padano DOP' },
    priceLabel: 'Rp 115.000',
    signature: true,
    featured: true,
    contentStatus: 'verified'
  },
  {
    id: 'pizzetta-2',
    slug: 'quattro-formaggi',
    name: 'Quattro Formaggi',
    categoryId: 'pizzetta',
    description: { en: 'Blue Cheese, Mozzarella, Grana Padano, Pecorino AOP, Caramelized Onion, Honey, Truffle', id: 'Blue Cheese, Mozzarella, Grana Padano, Pecorino AOP, Caramelized Onion, Honey, Truffle' },
    priceLabel: 'Rp 95.000',
    signature: true,
    featured: true,
    contentStatus: 'verified'
  },
  {
    id: 'pizzetta-3',
    slug: 'ragu-di-manzo',
    name: 'Ragu di Manzo',
    categoryId: 'pizzetta',
    description: { en: 'Wagyu Beef Ragout, Beef Tripe, Grana Padano DOP', id: 'Wagyu Beef Ragout, Beef Tripe, Grana Padano DOP' },
    priceLabel: 'Rp 95.000',
    contentStatus: 'verified'
  },
  {
    id: 'pizzetta-4',
    slug: 'a-la-vodka',
    name: 'A La Vodka',
    categoryId: 'pizzetta',
    description: { en: 'Tomato Vodka, Mozzarella, Bechamel, Grana Padano DOP', id: 'Tomato Vodka, Mozzarella, Bechamel, Grana Padano DOP' },
    priceLabel: 'Rp 90.000',
    contentStatus: 'verified'
  },
  {
    id: 'pizzetta-5',
    slug: 'mortadella-di-manzo',
    name: 'Mortadella di Manzo',
    categoryId: 'pizzetta',
    description: { en: 'Tomato Cream, Pomodorini, Bocconcini, Pistachio', id: 'Tomato Cream, Pomodorini, Bocconcini, Pistachio' },
    priceLabel: 'Rp 110.000',
    contentStatus: 'verified'
  },
  {
    id: 'pizzetta-6',
    slug: 'burrata',
    name: 'Burrata',
    categoryId: 'pizzetta',
    description: { en: 'Pomodoro, Green Organic Salad, Balsamic, EVOO', id: 'Pomodoro, Green Organic Salad, Balsamic, EVOO' },
    priceLabel: 'Rp 145.000',
    contentStatus: 'verified'
  },
  {
    id: 'pizzetta-7',
    slug: 'margherita',
    name: 'Margherita',
    categoryId: 'pizzetta',
    description: { en: 'Pomodoro, Mozzarella, Basilico, Grana Padano DOP, EVOO', id: 'Pomodoro, Mozzarella, Basilico, Grana Padano DOP, EVOO' },
    priceLabel: 'Rp 78.000',
    contentStatus: 'verified'
  },
  {
    id: 'pizzetta-8',
    slug: 'il-funghi',
    name: 'Il Funghi',
    categoryId: 'pizzetta',
    description: { en: 'Stracciatella, White Champignon, Eringy, Portobello, Truffle, Grana Padano DOP', id: 'Stracciatella, White Champignon, Eringy, Portobello, Truffle, Grana Padano DOP' },
    priceLabel: 'Rp 98.000',
    contentStatus: 'verified'
  },

  // ==========================================
  // 8. PASTA
  // ==========================================
  {
    id: 'pasta-1',
    slug: 'pappardelle',
    name: 'Pappardelle',
    categoryId: 'pasta',
    description: { en: 'Marinara, Stracciatella, Basil, EVOO', id: 'Marinara, Stracciatella, Basil, EVOO' },
    priceLabel: 'Rp 110.000',
    contentStatus: 'verified'
  },
  {
    id: 'pasta-2',
    slug: 'penne-rigate',
    name: 'Penne Rigate',
    categoryId: 'pasta',
    description: { en: 'Tomato A La Vodka, Mozzarella, Stracciatella', id: 'Tomato A La Vodka, Mozzarella, Stracciatella' },
    priceLabel: 'Rp 125.000',
    contentStatus: 'verified'
  },
  {
    id: 'pasta-3',
    slug: 'conchiglie-lumache',
    name: 'Conchiglie Lumache',
    categoryId: 'pasta',
    description: { en: 'Escargot, Garlic, Butter, Parsley, Capers, Parmesan Crumbs', id: 'Escargot, Garlic, Butter, Parsley, Capers, Parmesan Crumbs' },
    priceLabel: 'Rp 125.000',
    contentStatus: 'verified'
  },
  {
    id: 'pasta-4',
    slug: 'ravioli-ricotta',
    name: 'Ravioli Ricotta',
    categoryId: 'pasta',
    description: { en: 'Ricotta Filling, Hazelnut, Mushroom, Cauliflower, White Wine Foam', id: 'Ricotta Filling, Hazelnut, Mushroom, Cauliflower, White Wine Foam' },
    priceLabel: 'Rp 140.000',
    contentStatus: 'verified'
  },
  {
    id: 'pasta-5',
    slug: 'potato-gnocchi',
    name: 'Potato Gnocchi',
    categoryId: 'pasta',
    description: { en: 'Almond, Formaggi Sauce, Grana Padano DOP, Truffle', id: 'Almond, Formaggi Sauce, Grana Padano DOP, Truffle' },
    priceLabel: 'Rp 135.000',
    contentStatus: 'verified'
  },
  {
    id: 'pasta-6',
    slug: 'linguine-nero',
    name: 'Linguine Nero',
    categoryId: 'pasta',
    description: { en: 'Squid Ink, Squid, Avruga Caviar, Capers', id: 'Squid Ink, Squid, Avruga Caviar, Capers' },
    priceLabel: 'Rp 150.000',
    contentStatus: 'verified'
  },
  {
    id: 'pasta-7',
    slug: 'mafaldine',
    name: 'Mafaldine',
    categoryId: 'pasta',
    description: { en: 'Ragù di Manzo, Béchamel, Marinara, Mozzarella', id: 'Ragù di Manzo, Béchamel, Marinara, Mozzarella' },
    priceLabel: 'Rp 130.000',
    contentStatus: 'verified'
  },
  {
    id: 'pasta-8',
    slug: 'fusilloni',
    name: 'Fusilloni',
    categoryId: 'pasta',
    description: { en: 'Salsiccia, Sweet Capsicum, Arrabbiata Sauce', id: 'Salsiccia, Sweet Capsicum, Arrabbiata Sauce' },
    priceLabel: 'Rp 130.000',
    contentStatus: 'verified'
  },
  {
    id: 'pasta-9',
    slug: 'casarecce',
    name: 'Casarecce',
    categoryId: 'pasta',
    description: { en: 'Tenderloin, Caramelized Onion, Bone Marrow, Cognac', id: 'Tenderloin, Caramelized Onion, Bone Marrow, Cognac' },
    priceLabel: 'Rp 220.000',
    contentStatus: 'verified'
  },
  {
    id: 'pasta-10',
    slug: 'bucatini',
    name: 'Bucatini',
    categoryId: 'pasta',
    description: { en: 'Pancetta Miyazaki A5, Grana Padano, Garlic, Omega Hen Egg', id: 'Pancetta Miyazaki A5, Grana Padano, Garlic, Omega Hen Egg' },
    priceLabel: 'Rp 160.000',
    contentStatus: 'verified'
  },
  {
    id: 'pasta-11',
    slug: 'paccheri',
    name: 'Paccheri',
    categoryId: 'pasta',
    description: { en: 'Beef Tongue, Gremolata, Pecorino AOP, Brandy', id: 'Beef Tongue, Gremolata, Pecorino AOP, Brandy' },
    priceLabel: 'Rp 150.000',
    contentStatus: 'verified'
  },
  {
    id: 'pasta-12',
    slug: 'linguine',
    name: 'Linguine',
    categoryId: 'pasta',
    description: { en: 'Vongole, Pomodorini, Garlic', id: 'Vongole, Pomodorini, Garlic' },
    priceLabel: 'Rp 125.000',
    contentStatus: 'verified'
  },

  // ==========================================
  // 9. WOODFIRE & GRILL
  // ==========================================
  // Intro Block: CHEF'S CUT
  {
    id: 'woodfire-intro-1',
    slug: 'chefs-cut',
    name: "CHEF'S CUT",
    categoryId: 'woodfire-grill',
    description: { en: "Kindly ask our servers for what's available", id: "Kindly ask our servers for what's available" },
    priceLabel: '',
    isIntroBlock: true,
    contentStatus: 'verified'
  },
  // Subhead: CARNE
  {
    id: 'woodfire-carne-1',
    slug: 'toploin-kiwami-eye-fillet-mb9',
    name: 'Toploin Kiwami Eye Fillet MB9+',
    categoryId: 'woodfire-grill',
    subhead: { en: 'CARNE', id: 'CARNE' },
    subheadNote: {
      en: 'Every steak comes with a choice of sauce and green salad.',
      id: 'Every steak comes with a choice of sauce and green salad.'
    },
    portion: '280gr / 320gr / 500gr',
    priceLabel: 'Rp 475.000 / Rp 525.000 / Rp 799.000',
    priceVariants: [
      { portion: '280gr', priceLabel: 'Rp 475.000' },
      { portion: '320gr', priceLabel: 'Rp 525.000' },
      { portion: '500gr', priceLabel: 'Rp 799.000' }
    ],
    signature: true,
    contentStatus: 'verified'
  },
  {
    id: 'woodfire-carne-2',
    slug: 'australian-wagyu-picanha',
    name: 'Australian Wagyu Picanha',
    categoryId: 'woodfire-grill',
    subhead: { en: 'CARNE', id: 'CARNE' },
    portion: '240gr',
    priceLabel: 'Rp 380.000',
    contentStatus: 'verified'
  },
  {
    id: 'woodfire-carne-3',
    slug: 'stockyard-gold-angus-ribeye',
    name: 'Stockyard Gold Angus Ribeye',
    categoryId: 'woodfire-grill',
    subhead: { en: 'CARNE', id: 'CARNE' },
    portion: '250gr / 500gr',
    priceLabel: 'Rp 675.000 / Rp 1.250.000',
    priceVariants: [
      { portion: '250gr', priceLabel: 'Rp 675.000' },
      { portion: '500gr', priceLabel: 'Rp 1.250.000' }
    ],
    contentStatus: 'verified'
  },
  {
    id: 'woodfire-carne-4',
    slug: 'stockyard-gold-angus-striploin',
    name: 'Stockyard Gold Angus Striploin',
    categoryId: 'woodfire-grill',
    subhead: { en: 'CARNE', id: 'CARNE' },
    portion: '250gr / 500gr',
    priceLabel: 'Rp 550.000 / Rp 975.000',
    priceVariants: [
      { portion: '250gr', priceLabel: 'Rp 550.000' },
      { portion: '500gr', priceLabel: 'Rp 975.000' }
    ],
    contentStatus: 'verified'
  },
  // Subhead: SIDES ADD
  {
    id: 'woodfire-side-1',
    slug: 'saute-mushroom',
    name: 'Saute Mushroom',
    categoryId: 'woodfire-grill',
    subhead: { en: 'SIDES ADD', id: 'SIDES ADD' },
    priceLabel: 'Rp 55.000',
    contentStatus: 'verified'
  },
  {
    id: 'woodfire-side-2',
    slug: 'spring-corn-butter',
    name: 'Spring Corn Butter',
    categoryId: 'woodfire-grill',
    subhead: { en: 'SIDES ADD', id: 'SIDES ADD' },
    priceLabel: 'Rp 50.000',
    contentStatus: 'verified'
  },
  {
    id: 'woodfire-side-3',
    slug: 'caramelized-italian-capsicum',
    name: 'Caramelized Italian Capsicum',
    categoryId: 'woodfire-grill',
    subhead: { en: 'SIDES ADD', id: 'SIDES ADD' },
    priceLabel: 'Rp 65.000',
    contentStatus: 'verified'
  },
  {
    id: 'woodfire-side-4',
    slug: 'creamy-spinach-lemon-gremolata',
    name: 'Creamy Spinach Lemon Gremolata',
    categoryId: 'woodfire-grill',
    subhead: { en: 'SIDES ADD', id: 'SIDES ADD' },
    priceLabel: 'Rp 60.000',
    contentStatus: 'verified'
  },
  {
    id: 'woodfire-side-5',
    slug: 'cassava-mousseline-beef-tallow',
    name: 'Cassava Mousseline Beef Tallow',
    categoryId: 'woodfire-grill',
    subhead: { en: 'SIDES ADD', id: 'SIDES ADD' },
    priceLabel: 'Rp 55.000',
    contentStatus: 'verified'
  },
  {
    id: 'woodfire-side-6',
    slug: 'roasted-potato-smoked-pancetta',
    name: 'Roasted Potato Smoked Pancetta',
    categoryId: 'woodfire-grill',
    subhead: { en: 'SIDES ADD', id: 'SIDES ADD' },
    priceLabel: 'Rp 60.000',
    contentStatus: 'verified'
  },
  {
    id: 'woodfire-side-7',
    slug: 'potato-mousseline',
    name: 'Potato Mousseline',
    categoryId: 'woodfire-grill',
    subhead: { en: 'SIDES ADD', id: 'SIDES ADD' },
    priceLabel: 'Rp 55.000',
    contentStatus: 'verified'
  },
  {
    id: 'woodfire-side-8',
    slug: 'handcut-triple-fries',
    name: 'Handcut Triple Fries',
    categoryId: 'woodfire-grill',
    subhead: { en: 'SIDES ADD', id: 'SIDES ADD' },
    priceLabel: 'Rp 45.000',
    contentStatus: 'verified'
  },
  // Subhead: SAUCES
  {
    id: 'woodfire-sauce-1',
    slug: 'natural-jus',
    name: 'Natural Jus',
    categoryId: 'woodfire-grill',
    subhead: { en: 'SAUCES', id: 'SAUCES' },
    priceLabel: 'Rp 25.000',
    contentStatus: 'verified'
  },
  {
    id: 'woodfire-sauce-2',
    slug: 'mushroom-sauce',
    name: 'Mushroom',
    categoryId: 'woodfire-grill',
    subhead: { en: 'SAUCES', id: 'SAUCES' },
    priceLabel: 'Rp 25.000',
    contentStatus: 'verified'
  },
  {
    id: 'woodfire-sauce-3',
    slug: 'blackpepper-sauce',
    name: 'Blackpepper',
    categoryId: 'woodfire-grill',
    subhead: { en: 'SAUCES', id: 'SAUCES' },
    priceLabel: 'Rp 25.000',
    contentStatus: 'verified'
  },
  {
    id: 'woodfire-sauce-4',
    slug: 'basilico-verde',
    name: 'Basilico Verde',
    categoryId: 'woodfire-grill',
    subhead: { en: 'SAUCES', id: 'SAUCES' },
    priceLabel: 'Rp 25.000',
    contentStatus: 'verified'
  },
  {
    id: 'woodfire-sauce-5',
    slug: 'port-wine',
    name: 'Port Wine',
    categoryId: 'woodfire-grill',
    subhead: { en: 'SAUCES', id: 'SAUCES' },
    priceLabel: 'Rp 50.000',
    contentStatus: 'verified'
  },

  // ==========================================
  // 10. SECONDI
  // ==========================================
  {
    id: 'secondi-1',
    slug: 'tasmanian-salmone-griglia',
    name: 'Tasmanian Salmone Griglia',
    categoryId: 'secondi',
    description: { en: 'Roasted Potato, Grilled Artichoke, Pomodorini Salsa', id: 'Roasted Potato, Grilled Artichoke, Pomodorini Salsa' },
    priceLabel: 'Rp 250.000',
    contentStatus: 'verified'
  },
  {
    id: 'secondi-2',
    slug: 'steak-and-fries',
    name: 'Steak & Fries',
    categoryId: 'secondi',
    description: { en: 'Toploin Kiwami (180gr), Peppercorn Sauce, Mushroom, Fries', id: 'Toploin Kiwami (180gr), Peppercorn Sauce, Mushroom, Fries' },
    priceLabel: 'Rp 320.000',
    contentStatus: 'verified'
  },
  {
    id: 'secondi-3',
    slug: 'roasted-probiotic-spring-chicken',
    name: 'Roasted Probiotic Spring Chicken',
    categoryId: 'secondi',
    description: { en: 'Roasted Potato, Saute Mushroom, Honey Mustard Gravy', id: 'Roasted Potato, Saute Mushroom, Honey Mustard Gravy' },
    priceLabel: 'Rp 150.000',
    contentStatus: 'verified'
  },
  {
    id: 'secondi-4',
    slug: 'wagyu-beef-brisket-burger',
    name: 'Wagyu Beef Brisket Burger',
    categoryId: 'secondi',
    description: { en: 'Wagyu Brisket Patty, Cheddar, Black Garlic, Natural Jus, Fries', id: 'Wagyu Brisket Patty, Cheddar, Black Garlic, Natural Jus, Fries' },
    priceLabel: 'Rp 155.000',
    additionalNotes: [
      'Add Pancetta (Rp 30.000)',
      'Add Wagyu Patty (Rp 60.000)',
      'Extra Mozzarella (Rp 10.000)'
    ],
    contentStatus: 'verified'
  },
  {
    id: 'secondi-5',
    slug: 'chicken-parm-ripiena',
    name: 'Chicken Parm Ripiena',
    categoryId: 'secondi',
    description: { en: 'Chicken Leg, Mozzarella, Mortadella, Pomodoro Cream Tequila', id: 'Chicken Leg, Mozzarella, Mortadella, Pomodoro Cream Tequila' },
    priceLabel: 'Rp 135.000',
    contentStatus: 'verified'
  },

  // ==========================================
  // 11. DOLCI / Dessert
  // ==========================================
  {
    id: 'dolci-1',
    slug: 'classic-tiramisu',
    name: 'Classic Tiramisu',
    categoryId: 'dolci',
    description: { en: 'Mascarpone, Coffee Liquid', id: 'Mascarpone, Coffee Liquid' },
    priceLabel: 'Rp 75.000',
    signature: true,
    contentStatus: 'verified'
  },
  {
    id: 'dolci-2',
    slug: 'rhum-baba',
    name: 'Rhum Baba',
    categoryId: 'dolci',
    description: { en: 'Vanilla Chantilly Espumas, Rhum Orange Glaze', id: 'Vanilla Chantilly Espumas, Rhum Orange Glaze' },
    priceLabel: 'Rp 85.000',
    contentStatus: 'verified'
  },
  {
    id: 'dolci-3',
    slug: 'valrhona-flourless-cake',
    name: 'Valrhona Flourless Cake',
    categoryId: 'dolci',
    description: { en: 'Dark Cherry Coulis, Strawberry Sorbet', id: 'Dark Cherry Coulis, Strawberry Sorbet' },
    priceLabel: 'Rp 95.000',
    contentStatus: 'verified'
  },
  {
    id: 'dolci-4',
    slug: 'panna-cotta',
    name: 'Panna Cotta',
    categoryId: 'dolci',
    description: { en: 'Mix Berry Compote, Vanilla Foam, Strawberry Caviar', id: 'Mix Berry Compote, Vanilla Foam, Strawberry Caviar' },
    priceLabel: 'Rp 64.000',
    contentStatus: 'verified'
  },
  {
    id: 'dolci-5',
    slug: 'gelato-and-sorbet',
    name: 'Gelato & Sorbet',
    categoryId: 'dolci',
    priceLabel: 'Rp 30.000 – Rp 50.000',
    priceVariants: [
      { label: 'Pistachio', priceLabel: 'Rp 50.000' },
      { label: 'Chocolate', priceLabel: 'Rp 30.000' },
      { label: 'Vanilla', priceLabel: 'Rp 30.000' },
      { label: 'Strawberry', priceLabel: 'Rp 30.000' }
    ],
    contentStatus: 'verified'
  },

  // ==========================================
  // BEVERAGE ITEMS
  // ==========================================

  // ==========================================
  // 1. COCKTAIL
  // ==========================================
  {
    id: 'cocktail-1',
    slug: 'negroni',
    name: 'Negroni',
    categoryId: 'cocktail',
    description: { en: 'Gin, Campari, Sweet Vermouth', id: 'Gin, Campari, Sweet Vermouth' },
    priceLabel: 'Rp 150.000',
    contentStatus: 'verified'
  },
  {
    id: 'cocktail-2',
    slug: 'aperol-spritz',
    name: 'Aperol Spritz',
    categoryId: 'cocktail',
    description: { en: 'Aperol, Prosecco, Soda Water', id: 'Aperol, Prosecco, Soda Water' },
    priceLabel: 'Rp 150.000',
    contentStatus: 'verified'
  },
  {
    id: 'cocktail-3',
    slug: 'limoncello-spritz',
    name: 'Limoncello Spritz',
    categoryId: 'cocktail',
    description: { en: 'Limoncello, Prosecco, Soda Water', id: 'Limoncello, Prosecco, Soda Water' },
    priceLabel: 'Rp 150.000',
    contentStatus: 'verified'
  },
  {
    id: 'cocktail-4',
    slug: 'bellini',
    name: 'Bellini',
    categoryId: 'cocktail',
    description: { en: 'Peach Puree, Peach Liquer, Prosecco', id: 'Peach Puree, Peach Liquer, Prosecco' },
    priceLabel: 'Rp 150.000',
    contentStatus: 'verified'
  },
  {
    id: 'cocktail-5',
    slug: 'margarita',
    name: 'Margarita',
    categoryId: 'cocktail',
    description: { en: 'Tequila, Triple Sec, Lime Juice', id: 'Tequila, Triple Sec, Lime Juice' },
    priceLabel: 'Rp 150.000',
    contentStatus: 'verified'
  },
  {
    id: 'cocktail-6',
    slug: 'martini',
    name: 'Martini',
    categoryId: 'cocktail',
    description: { en: 'Vodka or Gin, Dry Vermouth', id: 'Vodka or Gin, Dry Vermouth' },
    priceLabel: 'Rp 150.000',
    contentStatus: 'verified'
  },
  {
    id: 'cocktail-7',
    slug: 'espresso-martini',
    name: 'Espresso Martini',
    categoryId: 'cocktail',
    description: { en: 'Vodka, Coffee Liquer, Espresso', id: 'Vodka, Coffee Liquer, Espresso' },
    priceLabel: 'Rp 150.000',
    contentStatus: 'verified'
  },

  // ==========================================
  // 2. MOCKTAIL
  // ==========================================
  {
    id: 'mocktail-1',
    slug: 'velvet-bloom',
    name: 'Velvet Bloom',
    categoryId: 'mocktail',
    description: { en: 'Watermelon, Apple, Strawberry, Peach Syrup, Elderflower Syrup, Soda', id: 'Watermelon, Apple, Strawberry, Peach Syrup, Elderflower Syrup, Soda' },
    priceLabel: 'Rp 60.000',
    contentStatus: 'verified'
  },
  {
    id: 'mocktail-2',
    slug: 'sunset-serenade',
    name: 'Sunset Serenade',
    categoryId: 'mocktail',
    description: { en: 'Watermelon, Peach Syrup, Vanilla Syrup, Espresso Cream', id: 'Watermelon, Peach Syrup, Vanilla Syrup, Espresso Cream' },
    priceLabel: 'Rp 60.000',
    contentStatus: 'verified'
  },
  {
    id: 'mocktail-3',
    slug: 'cafetini',
    name: 'Cafetini',
    categoryId: 'mocktail',
    description: { en: 'Espresso, Vanilla, Caramel, Butterscotch, Rum', id: 'Espresso, Vanilla, Caramel, Butterscotch, Rum' },
    priceLabel: 'Rp 55.000',
    contentStatus: 'verified'
  },
  {
    id: 'mocktail-4',
    slug: 'virgin-spritz',
    name: 'Virgin Spritz',
    categoryId: 'mocktail',
    description: { en: 'Orange Bitter Syrup, Tonic Water', id: 'Orange Bitter Syrup, Tonic Water' },
    priceLabel: 'Rp 50.000',
    contentStatus: 'verified'
  },
  {
    id: 'mocktail-5',
    slug: 'virgin-mojito',
    name: 'Virgin Mojito',
    categoryId: 'mocktail',
    description: { en: 'Mint, Lime, Soda, Simple Syrup', id: 'Mint, Lime, Soda, Simple Syrup' },
    priceLabel: 'Rp 55.000',
    contentStatus: 'verified'
  },

  // ==========================================
  // 3. SIGNATURE COFFEE
  // ==========================================
  {
    id: 'sig-coffee-1',
    slug: 'bacio-di-fragola',
    name: 'Bacio di Fragola',
    categoryId: 'signature-coffee',
    description: { en: 'Espresso, Strawberry, Soda, Strawberry Cream, Strawberry Crumble', id: 'Espresso, Strawberry, Soda, Strawberry Cream, Strawberry Crumble' },
    priceLabel: 'Rp 55.000',
    contentStatus: 'verified'
  },
  {
    id: 'sig-coffee-2',
    slug: 'shakerato-al-limone',
    name: 'Shakerato al Limone',
    categoryId: 'signature-coffee',
    description: { en: 'Espresso, Yuzu Marmalade, Cream', id: 'Espresso, Yuzu Marmalade, Cream' },
    priceLabel: 'Rp 55.000',
    contentStatus: 'verified'
  },
  {
    id: 'sig-coffee-3',
    slug: 'vanilla-coke-espresso',
    name: 'Vanilla Coke Espresso',
    categoryId: 'signature-coffee',
    description: { en: 'Espresso, Vanilla, Cola, Espresso Cream', id: 'Espresso, Vanilla, Cola, Espresso Cream' },
    priceLabel: 'Rp 55.000',
    contentStatus: 'verified'
  },
  {
    id: 'sig-coffee-4',
    slug: 'crema-di-cafe',
    name: 'Crema di Cafè',
    categoryId: 'signature-coffee',
    description: { en: 'Espresso, Coffee Soda, Espresso Cream', id: 'Espresso, Coffee Soda, Espresso Cream' },
    priceLabel: 'Rp 55.000',
    contentStatus: 'verified'
  },

  // ==========================================
  // 4. COFFEE
  // ==========================================
  {
    id: 'coffee-1',
    slug: 'espresso',
    name: 'Espresso',
    categoryId: 'coffee',
    priceLabel: 'Rp 25.000',
    contentStatus: 'verified'
  },
  {
    id: 'coffee-2',
    slug: 'doppio',
    name: 'Doppio',
    categoryId: 'coffee',
    priceLabel: 'Rp 30.000',
    contentStatus: 'verified'
  },
  {
    id: 'coffee-3',
    slug: 'affogato',
    name: 'Affogato',
    categoryId: 'coffee',
    priceLabel: 'Rp 55.000',
    contentStatus: 'verified'
  },
  {
    id: 'coffee-4',
    slug: 'americano',
    name: 'Americano',
    categoryId: 'coffee',
    priceLabel: 'Rp 35.000',
    contentStatus: 'verified'
  },
  {
    id: 'coffee-5',
    slug: 'piccolo',
    name: 'Piccolo',
    categoryId: 'coffee',
    priceLabel: 'Rp 35.000',
    contentStatus: 'verified'
  },
  {
    id: 'coffee-6',
    slug: 'cafe-latte-cappucino',
    name: 'Café Latte / Cappucino',
    categoryId: 'coffee',
    priceLabel: 'Rp 40.000',
    contentStatus: 'verified'
  },
  {
    id: 'coffee-7',
    slug: 'cafe-mocha',
    name: 'Café Mocha',
    categoryId: 'coffee',
    priceLabel: 'Rp 50.000',
    contentStatus: 'verified'
  },
  {
    id: 'coffee-8',
    slug: 'pistachio-latte',
    name: 'Pistachio Latte',
    categoryId: 'coffee',
    priceLabel: 'Rp 50.000',
    contentStatus: 'verified'
  },
  {
    id: 'coffee-9',
    slug: 'butterscotch-sea-salt-latte',
    name: 'Butterscotch Sea Salt Latte',
    categoryId: 'coffee',
    priceLabel: 'Rp 55.000',
    contentStatus: 'verified'
  },
  {
    id: 'coffee-10',
    slug: 'brown-sugar-latte',
    name: 'Brown Sugar Latte',
    categoryId: 'coffee',
    priceLabel: 'Rp 50.000',
    contentStatus: 'verified'
  },
  {
    id: 'coffee-11',
    slug: 'caramel-machiato',
    name: 'Caramel Machiato',
    categoryId: 'coffee',
    priceLabel: 'Rp 55.000',
    contentStatus: 'verified'
  },
  {
    id: 'coffee-12',
    slug: 'coffee-tonic',
    name: 'Coffee Tonic',
    categoryId: 'coffee',
    priceLabel: 'Rp 50.000',
    contentStatus: 'verified'
  },
  {
    id: 'coffee-13',
    slug: 'chocolate',
    name: 'Chocolate',
    categoryId: 'coffee',
    priceLabel: 'Rp 45.000',
    contentStatus: 'verified'
  },

  // ==========================================
  // 5. ICED TEA
  // ==========================================
  {
    id: 'iced-tea-1',
    slug: 'iced-tea',
    name: 'Iced Tea',
    categoryId: 'iced-tea',
    priceLabel: 'Rp 30.000',
    contentStatus: 'verified'
  },
  {
    id: 'iced-tea-2',
    slug: 'iced-lemon-tea',
    name: 'Iced Lemon Tea',
    categoryId: 'iced-tea',
    priceLabel: 'Rp 40.000',
    contentStatus: 'verified'
  },
  {
    id: 'iced-tea-3',
    slug: 'iced-lychee-tea',
    name: 'Iced Lychee Tea',
    categoryId: 'iced-tea',
    priceLabel: 'Rp 40.000',
    contentStatus: 'verified'
  },
  {
    id: 'iced-tea-4',
    slug: 'iced-peach-tea',
    name: 'Iced Peach Tea',
    categoryId: 'iced-tea',
    priceLabel: 'Rp 40.000',
    contentStatus: 'verified'
  },

  // ==========================================
  // 6. HOT TEA
  // ==========================================
  {
    id: 'hot-tea-1',
    slug: 'brew-me-bali-breakfast',
    name: 'Brew Me Bali Breakfast',
    categoryId: 'hot-tea',
    priceLabel: 'Rp 35.000',
    contentStatus: 'verified'
  },
  {
    id: 'hot-tea-2',
    slug: 'brew-me-chamomile',
    name: 'Brew Me Chamomile',
    categoryId: 'hot-tea',
    priceLabel: 'Rp 35.000',
    contentStatus: 'verified'
  },
  {
    id: 'hot-tea-3',
    slug: 'brew-me-minty-breeze',
    name: 'Brew Me Minty Breeze',
    categoryId: 'hot-tea',
    priceLabel: 'Rp 35.000',
    contentStatus: 'verified'
  },
  {
    id: 'hot-tea-4',
    slug: 'brew-me-royal-earl-grey',
    name: 'Brew Me Royal Earl Grey',
    categoryId: 'hot-tea',
    priceLabel: 'Rp 35.000',
    contentStatus: 'verified'
  },
  {
    id: 'hot-tea-5',
    slug: 'brew-me-temple-of-rose',
    name: 'Brew Me Temple of Rose',
    categoryId: 'hot-tea',
    priceLabel: 'Rp 35.000',
    contentStatus: 'verified'
  },
  {
    id: 'hot-tea-6',
    slug: 'brew-me-lemongrass-delight',
    name: 'Brew Me Lemongrass Delight',
    categoryId: 'hot-tea',
    priceLabel: 'Rp 35.000',
    contentStatus: 'verified'
  },

  // ==========================================
  // 7. FRESH JUICE
  // ==========================================
  {
    id: 'fresh-juice-1',
    slug: 'fresh-juice-variety',
    name: 'Orange / Strawberry / Apple / Watermelon',
    categoryId: 'fresh-juice',
    priceLabel: 'Rp 50.000',
    contentStatus: 'verified'
  },

  // ==========================================
  // 8. BEER
  // ==========================================
  {
    id: 'beer-1',
    slug: 'bintang',
    name: 'Bintang',
    categoryId: 'beer',
    priceLabel: 'Rp 55.000',
    contentStatus: 'verified'
  },
  {
    id: 'beer-2',
    slug: 'heineken',
    name: 'Heineken',
    categoryId: 'beer',
    priceLabel: 'Rp 65.000',
    contentStatus: 'verified'
  },
  {
    id: 'beer-3',
    slug: 'corona',
    name: 'Corona',
    categoryId: 'beer',
    priceLabel: 'Rp 90.000',
    contentStatus: 'verified'
  },
  {
    id: 'beer-4',
    slug: 'guiness',
    name: 'Guiness',
    categoryId: 'beer',
    priceLabel: 'Rp 65.000',
    contentStatus: 'verified'
  },

  // ==========================================
  // 9. SOFT DRINK & WATER
  // ==========================================
  {
    id: 'soft-drink-1',
    slug: 'soft-drink',
    name: 'Soft Drink',
    categoryId: 'soft-drink-water',
    priceLabel: 'Rp 30.000',
    additionalNotes: ['Options: Coca Cola / Sprite / Tonic / Soda'],
    contentStatus: 'verified'
  },
  {
    id: 'soft-drink-2',
    slug: 'equil-natural-mineral-water-380ml',
    name: 'Equil Natural Mineral Water 380ml',
    categoryId: 'soft-drink-water',
    priceLabel: 'Rp 35.000',
    contentStatus: 'verified'
  },
  {
    id: 'soft-drink-3',
    slug: 'equil-sparkling-mineral-water-380ml',
    name: 'Equil Sparkling Mineral Water 380ml',
    categoryId: 'soft-drink-water',
    priceLabel: 'Rp 40.000',
    contentStatus: 'verified'
  }
];
