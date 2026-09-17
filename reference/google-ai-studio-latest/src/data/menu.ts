import { MenuCategory, MenuItem } from './types';

export const menuCategories: MenuCategory[] = [
  { id: 'antipasti', name: { en: 'Antipasti', id: 'Antipasti' }, order: 1 },
  { id: 'fresh-pasta', name: { en: 'Fresh Pasta', id: 'Pasta Segar' }, order: 2 },
  { id: 'pizza', name: { en: 'Pizza', id: 'Pizza' }, order: 3 },
  { id: 'carne-grill', name: { en: 'Carne / Grill', id: 'Daging / Panggangan' }, order: 4 },
  { id: 'dessert', name: { en: 'Dessert', id: 'Pencuci Mulut' }, order: 5 },
  { id: 'drinks', name: { en: 'Drinks', id: 'Minuman' }, order: 6 },
];

export const menuItems: MenuItem[] = [
  {
    id: 'antipasti-1',
    slug: 'burrata-caprese',
    name: 'Burrata Caprese',
    categoryId: 'antipasti',
    description: { en: 'Fresh burrata, heirloom tomatoes, basil oil, balsamic glaze.', id: 'Burrata segar, tomat pusaka, minyak kemangi, glasir balsamik.' },
    priceLabel: 'Rp 145.000',
    contentStatus: 'demo'
  },
  {
    id: 'antipasti-2',
    slug: 'beef-carpaccio',
    name: 'Beef Carpaccio',
    categoryId: 'antipasti',
    description: { en: 'Thinly sliced wagyu, truffle aioli, parmesan shavings, arugula.', id: 'Irisan tipis wagyu, aioli truffle, serutan parmesan, arugula.' },
    priceLabel: 'Rp 185.000',
    contentStatus: 'demo'
  },
  {
    id: 'antipasti-3',
    slug: 'calamari-fritti',
    name: 'Calamari Fritti',
    categoryId: 'antipasti',
    description: { en: 'Crispy calamari, lemon wedge, garlic aioli.', id: 'Cumi renyah, irisan lemon, aioli bawang putih.' },
    priceLabel: 'Rp 120.000',
    contentStatus: 'demo'
  },
  {
    id: 'pasta-1',
    slug: 'chicken-pistachio-stracciatella',
    name: 'Chicken Pistachio di Stracciatella',
    categoryId: 'fresh-pasta',
    description: { en: 'Handmade pasta, grilled chicken, pistachio pesto, fresh stracciatella cheese.', id: 'Pasta buatan tangan, ayam panggang, pesto pistachio, keju stracciatella segar.' },
    priceLabel: 'Rp 165.000',
    signature: true,
    featured: true,
    contentStatus: 'demo'
  },
  {
    id: 'pasta-2',
    slug: 'gnocchi-al-tartufo',
    name: 'Gnocchi al Tartufo',
    categoryId: 'fresh-pasta',
    description: { en: 'Potato gnocchi, black truffle cream, parmigiano reggiano.', id: 'Gnocchi kentang, krim truffle hitam, parmigiano reggiano.' },
    priceLabel: 'Rp 175.000',
    contentStatus: 'demo'
  },
  {
    id: 'pasta-3',
    slug: 'bucatini-amatriciana',
    name: 'Bucatini all\'Amatriciana',
    categoryId: 'fresh-pasta',
    description: { en: 'Thick hollow pasta, rich tomato sauce, cured beef, pecorino romano.', id: 'Pasta tebal berlubang, saus tomat kaya, daging sapi asap, pecorino romano.' },
    priceLabel: 'Rp 150.000',
    dietaryNotes: ['Beef'],
    contentStatus: 'demo'
  },
  {
    id: 'pasta-4',
    slug: 'ravioli-ricotta',
    name: 'Ravioli di Ricotta',
    categoryId: 'fresh-pasta',
    description: { en: 'Spinach and ricotta stuffed ravioli, sage brown butter.', id: 'Ravioli isi bayam dan ricotta, mentega cokelat sage.' },
    priceLabel: 'Rp 155.000',
    contentStatus: 'demo'
  },
  {
    id: 'pizza-1',
    slug: 'margherita',
    name: 'Margherita',
    categoryId: 'pizza',
    description: { en: 'San Marzano tomato, fresh mozzarella, basil, extra virgin olive oil.', id: 'Tomat San Marzano, mozzarella segar, kemangi, minyak zaitun extra virgin.' },
    priceLabel: 'Rp 135.000',
    contentStatus: 'demo'
  },
  {
    id: 'pizza-2',
    slug: 'quattro-formaggi',
    name: 'Quattro Formaggi',
    categoryId: 'pizza',
    description: { en: 'Mozzarella, gorgonzola, fontina, parmigiano, no tomato sauce.', id: 'Mozzarella, gorgonzola, fontina, parmigiano, tanpa saus tomat.' },
    priceLabel: 'Rp 165.000',
    signature: true,
    featured: true,
    contentStatus: 'demo'
  },
  {
    id: 'pizza-3',
    slug: 'diavola',
    name: 'Diavola',
    categoryId: 'pizza',
    description: { en: 'Tomato sauce, mozzarella, spicy beef salami, chili flakes.', id: 'Saus tomat, mozzarella, salami sapi pedas, serpihan cabai.' },
    priceLabel: 'Rp 155.000',
    contentStatus: 'demo'
  },
  {
    id: 'carne-1',
    slug: 'bistecca-fiorentina',
    name: 'Bistecca alla Fiorentina',
    categoryId: 'carne-grill',
    description: { en: '1kg dry-aged T-bone steak, roasted garlic, rosemary, sea salt.', id: '1kg steak T-bone dry-aged, bawang putih panggang, rosemary, garam laut.' },
    priceLabel: 'Rp 1.450.000',
    signature: true,
    featured: true,
    contentStatus: 'demo'
  },
  {
    id: 'carne-2',
    slug: 'filetto-manzo',
    name: 'Filetto di Manzo',
    categoryId: 'carne-grill',
    description: { en: '250g Black Angus tenderloin, red wine reduction, potato purée.', id: '250g tenderloin Black Angus, reduksi anggur merah, pure kentang.' },
    priceLabel: 'Rp 585.000',
    contentStatus: 'demo'
  },
  {
    id: 'carne-3',
    slug: 'pollo-arrosto',
    name: 'Pollo Arrosto',
    categoryId: 'carne-grill',
    description: { en: 'Wood-fired half chicken, lemon herb marinade, seasonal vegetables.', id: 'Setengah ayam panggang kayu bakar, bumbu rempah lemon, sayuran musiman.' },
    priceLabel: 'Rp 225.000',
    contentStatus: 'demo'
  },
  {
    id: 'dessert-1',
    slug: 'classic-tiramisu',
    name: 'Classic Tiramisu',
    categoryId: 'dessert',
    description: { en: 'Espresso-soaked ladyfingers, mascarpone cream, cocoa dust.', id: 'Ladyfinger rendam espresso, krim mascarpone, taburan kakao.' },
    priceLabel: 'Rp 95.000',
    signature: true,
    featured: true,
    contentStatus: 'demo'
  },
  {
    id: 'dessert-2',
    slug: 'panna-cotta',
    name: 'Panna Cotta',
    categoryId: 'dessert',
    description: { en: 'Vanilla bean panna cotta, mixed berry compote.', id: 'Panna cotta biji vanila, kompot buah beri campuran.' },
    priceLabel: 'Rp 85.000',
    contentStatus: 'demo'
  },
  {
    id: 'dessert-3',
    slug: 'gelato',
    name: 'Artisanal Gelato',
    categoryId: 'dessert',
    description: { en: 'Selection of daily flavors. Ask your server.', id: 'Pilihan rasa harian. Tanyakan pada pelayan Anda.' },
    priceLabel: 'Rp 55.000',
    contentStatus: 'demo'
  },
  {
    id: 'drinks-1',
    slug: 'espresso',
    name: 'Espresso',
    categoryId: 'drinks',
    description: { en: 'Classic Italian espresso.', id: 'Espresso Italia klasik.' },
    priceLabel: 'Rp 35.000',
    contentStatus: 'demo'
  },
  {
    id: 'drinks-2',
    slug: 'negroni-mocktail',
    name: 'Negroni Zero',
    categoryId: 'drinks',
    description: { en: 'Non-alcoholic botanical bitter, orange peel.', id: 'Pahit botani non-alkohol, kulit jeruk.' },
    priceLabel: 'Rp 75.000',
    contentStatus: 'demo'
  },
  {
    id: 'drinks-3',
    slug: 'acqua-panna',
    name: 'Acqua Panna',
    categoryId: 'drinks',
    description: { en: 'Still natural mineral water (750ml).', id: 'Air mineral alami (750ml).' },
    priceLabel: 'Rp 65.000',
    contentStatus: 'demo'
  }
];
