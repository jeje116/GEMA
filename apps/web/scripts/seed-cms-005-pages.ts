import { getPayload } from 'payload';
import config from '../src/payload.config';

export async function seedCMS005Pages() {
  console.log('\n==================================================');
  console.log('  SEEDING CMS-005 PAGE EDITORIAL GLOBALS');
  console.log('==================================================\n');

  const payload = await getPayload({ config });

  // 1. About Page Global
  console.log('1. Seeding about-page global...');
  await payload.updateGlobal({
    slug: 'about-page',
    locale: 'en',
    data: {
      hero: {
        headline: 'The Resonance of Good Taste',
        subtitle: "GEMA, meaning 'echo' or 'resonance', reflects our belief that a great meal continues to sound in the memory long after the table is cleared.",
      },
      origin: {
        title: 'The Origin',
        body1: 'Born from a desire to bring elevated, authentic Italian dining to Surabaya, GEMA was conceived as more than a restaurant. It is a Sociëteit—a gathering place for those who appreciate the intersection of culinary tradition and contemporary art.',
        body2: 'We sought to create a space that feels both cosmopolitan and deeply rooted in hospitality, where every detail is considered but the atmosphere remains effortless.',
      },
      philosophy: {
        title: 'The Philosophy',
        body1: 'Our kitchen operates on a simple principle: respect the ingredient. By combining classic Italian techniques with the finest available produce, we craft dishes that are comforting yet refined.',
        dietaryPrefix: 'We adhere to a strict ',
        dietarySuffix: ' policy, ensuring our culinary vision is accessible and respectful of our diverse community without ever compromising on flavor or technique.',
      },
      architecture: {
        title: 'The Architecture',
        body1: 'Housed in a thoughtfully restored building on Jl. Musi, the architecture of GEMA balances classical proportions with modern restraint.',
        body2: 'Warm ivory tones, rich espresso wood, and strategic lighting create a canvas that shifts throughout the day, offering a different mood for a sunlit lunch versus an intimate evening dinner.',
      },
    },
    overrideAccess: true,
  });

  await payload.updateGlobal({
    slug: 'about-page',
    locale: 'id',
    data: {
      hero: {
        headline: 'Resonansi Cita Rasa',
        subtitle: "GEMA, yang berarti 'gema' atau 'resonansi', mencerminkan keyakinan kami bahwa jamuan yang luar biasa terus bergema dalam ingatan jauh setelah meja dirapikan.",
      },
      origin: {
        title: 'Asal Usul',
        body1: 'Lahir dari keinginan untuk menghadirkan santapan Italia otentik yang berkelas ke Surabaya, GEMA dirancang lebih dari sekadar restoran. Ini adalah sebuah Sociëteit—tempat berkumpul bagi mereka yang menghargai pertemuan tradisi kuliner dan seni kontemporer.',
        body2: 'Kami berupaya menciptakan ruang yang terasa kosmopolitan namun berakar kuat pada keramahtamahan, di mana setiap detail dipertimbangkan namun suasana tetap santai tanpa beban.',
      },
      philosophy: {
        title: 'Filosofi',
        body1: 'Dapur kami beroperasi dengan prinsip sederhana: menghormati bahan baku. Dengan memadukan teknik klasik Italia dengan hasil bumi terbaik, kami meracik hidangan yang menenangkan namun tetap mewah.',
        dietaryPrefix: 'Kami mematuhi kebijakan ketat ',
        dietarySuffix: ' policy, memastikan visi kuliner kami dapat dinikmati oleh seluruh komunitas kami yang beragam tanpa pernah berkompromi pada rasa atau teknik.',
      },
      architecture: {
        title: 'Arsitektur',
        body1: 'Bertempat di bangunan yang dipugar dengan cermat di Jl. Musi, arsitektur GEMA menyeimbangkan proporsi klasik dengan keanggunan modern yang bersahaja.',
        body2: 'Nuansa gading yang hangat, kayu espresso yang kaya, dan pencahayaan strategis menciptakan kanvas yang bertransisi sepanjang hari, menawarkan suasana berbeda untuk makan siang cerah maupun makan malam intim.',
      },
    },
    overrideAccess: true,
  });
  console.log('✓ about-page seeded in EN and ID.');

  // 2. Experience Page Global
  console.log('2. Seeding experience-page global...');
  await payload.updateGlobal({
    slug: 'experience-page',
    locale: 'en',
    data: {
      hero: {
        kicker: 'The Atmosphere',
        headline: 'A Place to Linger',
      },
      quote: '“GEMA is designed to be a canvas for connection. Whether bathed in morning light or shadowed by evening candle glow, the room adapts to the conversations it holds.”',
      dayToNight: {
        heading: 'Day to Night',
        subtitle: 'From casual business lunches to intimate evening dining, the atmosphere shifts effortlessly.',
        morningHeading: 'Morning Light',
        morningDescription: 'Sunlight streams through the tall windows, warming the ivory walls and bringing out the rich textures of the natural wood.',
        transitionQuote: 'The transition is seamless. As the sun sets, the music shifts, the lights dim, and a different energy takes over the room.',
        eveningHeading: 'Evening Shadows',
        eveningDescription: 'Candlelight catches the subtle veining of the marble tables. The room feels closer, more intimate, designed for lingering over wine and dessert.',
      },
      craft: {
        heading: 'The Craft',
        intro: 'Behind every plate is a rhythm\nof preparation and precision.',
        body: 'The experience at GEMA is shaped as much by what happens behind the pass as what arrives at the table. Open-kitchen energy, careful plating, and handmade detail give every dish its character.',
      },
    },
    overrideAccess: true,
  });

  await payload.updateGlobal({
    slug: 'experience-page',
    locale: 'id',
    data: {
      hero: {
        kicker: 'Suasana',
        headline: 'Tempat untuk Menikmati Waktu',
      },
      quote: '“GEMA dirancang sebagai kanvas untuk menjalin hubungan. Baik saat bermandikan cahaya pagi maupun dinaungi temaram lilin malam, ruangan ini menyesuaikan diri dengan setiap percakapan yang hadir.”',
      dayToNight: {
        heading: 'Dari Pagi Hingga Malam',
        subtitle: 'Dari makan siang bisnis santai hingga jamuan malam intim, suasana berganti dengan mulus.',
        morningHeading: 'Cahaya Pagi',
        morningDescription: 'Cahaya matahari mengalir melalui jendela tinggi, menghangatkan dinding gading dan menonjolkan tekstur alami kayu.',
        transitionQuote: 'Transisinya berlangsung begitu alami. Saat matahari terbenam, musik berganti, lampu meredup, dan energi baru memenuhi ruangan.',
        eveningHeading: 'Bayang Malam',
        eveningDescription: 'Cahaya lilin memantul pada urat marmer meja. Ruangan terasa lebih akrab dan intim, dirancang untuk berlama-lama menikmati anggur dan hidangan penutup.',
      },
      // Note: Indonesian translation for The Craft is omitted per PO directive
      // to preserve existing localization architecture and report missing translation.
    },
    overrideAccess: true,
  });
  console.log('✓ experience-page seeded in EN and ID.');

  // 3. Occasions Page Global
  console.log('3. Seeding occasions-page global...');
  await payload.updateGlobal({
    slug: 'occasions-page',
    locale: 'en',
    data: {
      hero: {
        subtitle: 'Where unforgettable moments are crafted with precision, art, and hospitality.',
      },
      privateDining: {
        title: 'Private Dinings',
        description: 'An exclusive culinary journey tailored for intimate gatherings, business dinners, or family celebrations. Enjoy a secluded space with dedicated service and bespoke menus.',
        feature1: 'Customizable tasting menus',
        feature2: 'Dedicated sommelier',
        feature3: 'Secluded atmosphere',
      },
      wedding: {
        title: 'Weddings',
        description: 'Celebrate your union in an atmosphere of timeless elegance. From intimate ceremonies to grand receptions, our venue provides a breathtaking backdrop for your special day.',
        feature1: 'Tailored banquet menus',
        feature2: 'Event coordination',
        feature3: 'Exclusive venue buyout',
      },
      birthday: {
        title: 'Birthdays',
        description: 'Mark another year of life with an unforgettable celebration. Whether a vibrant party or an elegant dinner, we craft the perfect setting for you and your guests.',
        feature1: 'Artisanal birthday cakes',
        feature2: 'Themed decorations',
        feature3: 'Signature cocktails',
      },
      brandExclusives: {
        heading: 'Brand Exclusives',
        description: 'GEMA has been the chosen venue for prestigious product launches, gala dinners, and showcases by leading luxury brands.',
      },
      brandEvents: {
        mondial: {
          brand: 'Mondial',
          title: 'Exclusive Jewelry Showcase',
        },
        frankCo: {
          brand: 'Frank & Co',
          title: 'Anniversary Gala Dinner',
        },
        maharva: {
          brand: 'Maharva',
          title: 'Private Collection Launch',
        },
      },
    },
    overrideAccess: true,
  });

  await payload.updateGlobal({
    slug: 'occasions-page',
    locale: 'id',
    data: {
      hero: {
        subtitle: 'Di mana momen tak terlupakan dirangkai dengan presisi, seni, dan keramahtamahan.',
      },
      privateDining: {
        title: 'Makan Malam Privat',
        description: 'Perjalanan kuliner eksklusif yang dirancang untuk pertemuan intim, makan malam bisnis, atau perayaan keluarga. Nikmati ruang tersembunyi dengan layanan khusus dan menu yang disesuaikan.',
        feature1: 'Menu tasting yang dapat disesuaikan',
        feature2: 'Sommelier khusus',
        feature3: 'Suasana yang tertutup dan intim',
      },
      wedding: {
        title: 'Pernikahan',
        description: 'Rayakan penyatuan Anda dalam suasana keanggunan yang abadi. Dari upacara intim hingga resepsi megah, tempat kami memberikan latar belakang yang menakjubkan untuk hari istimewa Anda.',
        feature1: 'Menu perjamuan yang disesuaikan',
        feature2: 'Koordinasi acara',
        feature3: 'Sewa tempat eksklusif',
      },
      birthday: {
        title: 'Ulang Tahun',
        description: 'Tandai usia baru dengan perayaan yang tak terlupakan. Baik pesta yang meriah atau makan malam yang elegan, kami merancang suasana yang sempurna untuk Anda dan tamu Anda.',
        feature1: 'Kue ulang tahun artisanal',
        feature2: 'Dekorasi tematik',
        feature3: 'Koktail khas',
      },
      brandExclusives: {
        heading: 'Eksklusif Merek',
        description: 'GEMA telah menjadi tempat pilihan untuk peluncuran produk bergengsi, jamuan makan malam gala, dan pameran merek mewah terkemuka.',
      },
      brandEvents: {
        mondial: {
          brand: 'Mondial',
          title: 'Pameran Perhiasan Eksklusif',
        },
        frankCo: {
          brand: 'Frank & Co',
          title: 'Makan Malam Gala Hari Jadi',
        },
        maharva: {
          brand: 'Maharva',
          title: 'Peluncuran Koleksi Pribadi',
        },
      },
    },
    overrideAccess: true,
  });
  console.log('✓ occasions-page seeded in EN and ID.');

  // 4. Visit Page Global
  console.log('4. Seeding visit-page global...');
  await payload.updateGlobal({
    slug: 'visit-page',
    locale: 'en',
    data: {
      reservationsNote: 'We strongly recommend booking in advance. For parties of 6 or more, please contact us directly.',
      dietaryPolicy: {
        heading: 'Dietary',
        description: 'Our kitchen adheres to a strict No Pork, No Lard policy. We can accommodate most allergies with 24 hours advance notice.',
      },
      dressCodePolicy: {
        heading: 'Dress Code',
        description: 'Smart casual. We request that gentlemen avoid sleeveless shirts and open-toed shoes in the evening.',
      },
      parkingPolicy: {
        heading: 'Parking',
        description: 'Valet parking is available at the main entrance. Limited street parking is also available in the surrounding area.',
      },
    },
    overrideAccess: true,
  });

  await payload.updateGlobal({
    slug: 'visit-page',
    locale: 'id',
    data: {
      reservationsNote: 'Kami sangat menyarankan pemesanan di awal. Untuk rombongan 6 orang atau lebih, silakan hubungi kami secara langsung.',
      dietaryPolicy: {
        heading: 'Kebutuhan Diet',
        description: 'Dapur kami mematuhi kebijakan ketat Tanpa Babi, Tanpa Lemak Babi. Kami dapat mengakomodasi sebagian besar alergi dengan pemberitahuan 24 jam sebelumnya.',
      },
      dressCodePolicy: {
        heading: 'Aturan Berpakaian',
        description: 'Smart casual. Kami meminta para pria untuk menghindari baju tanpa lengan dan sepatu terbuka di malam hari.',
      },
      parkingPolicy: {
        heading: 'Parkir',
        description: 'Layanan valet parkir tersedia di pintu masuk utama. Parkir tepi jalan terbatas juga tersedia di area sekitar.',
      },
    },
    overrideAccess: true,
  });
  console.log('✓ visit-page seeded in EN and ID.');

  // 5. Recognition Page Global
  console.log('5. Seeding recognition-page global...');
  await payload.updateGlobal({
    slug: 'recognition-page',
    locale: 'en',
    data: {
      kicker: 'GEMA Honors',
      subtitle: 'An archive of critical reception, culinary awards, and notable press mentions.',
    },
    overrideAccess: true,
  });

  await payload.updateGlobal({
    slug: 'recognition-page',
    locale: 'id',
    data: {
      kicker: 'Kehormatan GEMA',
      subtitle: 'Arsip pengakuan kritis, penghargaan kuliner, dan catatan media terkemuka.',
    },
    overrideAccess: true,
  });
  console.log('✓ recognition-page seeded in EN and ID.');

  console.log('\n==================================================');
  console.log('  ALL CMS-005 PAGE GLOBALS SEEDED SUCCESSFULLY');
  console.log('==================================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedCMS005Pages()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}
