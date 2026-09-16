import { JournalEntry } from './types';

export const journalEntries: JournalEntry[] = [
  {
    id: 'jrn-1',
    slug: 'inside-gemas-fresh-pasta',
    category: { en: 'Culinary Process', id: 'Proses Kuliner' },
    title: { en: 'Inside GEMA\'s Fresh Pasta', id: 'Di Balik Pasta Segar GEMA' },
    excerpt: { en: 'Discover the dedication and technique behind our signature handmade pasta.', id: 'Temukan dedikasi dan teknik di balik pasta buatan tangan khas kami.' },
    bodyBlocks: [
      {
        type: 'paragraph',
        content: { 
          en: 'Pasta is more than just flour and eggs; it is a testament to patience, tradition, and touch. Every morning, our kitchen begins the rhythmic process of mixing, kneading, and resting the dough.', 
          id: 'Pasta lebih dari sekadar tepung dan telur; itu adalah bukti kesabaran, tradisi, dan sentuhan. Setiap pagi, dapur kami memulai proses berirama mencampur, menguleni, dan mengistirahatkan adonan.' 
        }
      },
      {
        type: 'image',
        content: { en: 'Chef kneading pasta dough.', id: 'Koki menguleni adonan pasta.' },
        url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80'
      },
      {
        type: 'paragraph',
        content: { 
          en: 'We source the finest local eggs and blend them with imported Italian flour to achieve the perfect hydration and texture. Whether it is the delicate folds of our ravioli or the satisfying bite of our bucatini, every shape is formed with intention.', 
          id: 'Kami mengambil telur lokal terbaik dan mencampurnya dengan tepung Italia impor untuk mencapai hidrasi dan tekstur yang sempurna. Baik itu lipatan halus ravioli kami atau gigitan yang memuaskan dari bucatini kami, setiap bentuk dibentuk dengan niat.' 
        }
      }
    ],
    publishDate: '2026-08-15T10:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80',
    authorLabel: 'GEMA Culinary Team',
    contentStatus: 'demo'
  },
  {
    id: 'jrn-2',
    slug: 'from-dough-to-fire',
    category: { en: 'Kitchen Secrets', id: 'Rahasia Dapur' },
    title: { en: 'From Dough to Fire: The Making of GEMA\'s Pizza', id: 'Dari Adonan ke Api: Pembuatan Pizza GEMA' },
    excerpt: { en: 'A closer look at our slow-fermented dough and the intense heat that brings it to life.', id: 'Melihat lebih dekat adonan fermentasi lambat kami dan panas intens yang menghidupkannya.' },
    bodyBlocks: [
      {
        type: 'paragraph',
        content: { 
          en: 'A great pizza relies on three things: time, temperature, and quality ingredients. Our dough is fermented slowly over 48 hours to develop complex flavors and a light, airy structure.', 
          id: 'Pizza yang enak bergantung pada tiga hal: waktu, suhu, dan bahan-bahan berkualitas. Adonan kami difermentasi perlahan selama 48 jam untuk mengembangkan rasa yang kompleks dan struktur yang ringan dan lapang.' 
        }
      },
      {
        type: 'paragraph',
        content: { 
          en: 'When it hits the wood-fired oven at blistering temperatures, the magic happens in less than 90 seconds. The crust blisters, the cheese melts into the San Marzano tomato base, and the result is a perfect balance of crisp and chew.', 
          id: 'Saat menyentuh oven kayu bakar pada suhu yang sangat panas, keajaiban terjadi dalam waktu kurang dari 90 detik. Keraknya melepuh, keju meleleh ke dalam dasar tomat San Marzano, dan hasilnya adalah keseimbangan sempurna antara renyah dan kenyal.' 
        }
      }
    ],
    publishDate: '2026-07-22T14:30:00Z',
    coverImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80',
    authorLabel: 'Chef Mandif',
    contentStatus: 'demo'
  },
  {
    id: 'jrn-3',
    slug: 'a-table-for-two',
    category: { en: 'Hospitality', id: 'Keramahan' },
    title: { en: 'A Table for Two: Celebrating at GEMA', id: 'Meja untuk Dua Orang: Merayakan di GEMA' },
    excerpt: { en: 'How we craft intimate moments and memorable experiences for special occasions.', id: 'Bagaimana kami menyusun momen intim dan pengalaman tak terlupakan untuk acara spesial.' },
    bodyBlocks: [
      {
        type: 'paragraph',
        content: { 
          en: 'At GEMA, we believe that dining is not just about sustenance; it is about connection. Societiet—our namesake—represents the gathering of people, the sharing of stories, and the celebration of life.', 
          id: 'Di GEMA, kami percaya bahwa bersantap bukan hanya tentang rezeki; ini tentang koneksi. Societiet—senama kami—mewakili berkumpulnya orang-orang, berbagi cerita, dan perayaan kehidupan.' 
        }
      },
      {
        type: 'paragraph',
        content: { 
          en: 'When guests choose to spend their anniversaries or birthdays with us, we consider it a profound privilege. From the subtle lighting to the pacing of the courses, every detail is orchestrated to ensure the focus remains on the connection across the table.', 
          id: 'Ketika tamu memilih untuk menghabiskan hari jadi atau ulang tahun mereka bersama kami, kami menganggapnya sebagai hak istimewa yang mendalam. Dari pencahayaan yang halus hingga tempo hidangan, setiap detail diatur untuk memastikan fokus tetap pada koneksi di seberang meja.' 
        }
      }
    ],
    publishDate: '2026-06-10T09:15:00Z',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
    authorLabel: 'GEMA Front of House',
    contentStatus: 'demo'
  }
];
