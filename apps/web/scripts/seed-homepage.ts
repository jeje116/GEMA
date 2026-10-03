import { getPayload } from 'payload';
import config from '../src/payload.config';

export async function seedHomepage() {
  console.log('=== [CMS-003] SEEDING HOMEPAGE EDITORIAL CONTENT ===');

  const payload = await getPayload({ config });

  // 1. Fetch current Homepage to preserve existing media relationships
  const current = await payload.findGlobal({
    slug: 'homepage',
    overrideAccess: true,
  });

  const heroImageId = typeof current.hero?.image === 'object' ? current.hero?.image?.id : current.hero?.image;
  const spacePrimaryId = typeof current.space?.imagePrimary === 'object' ? current.space?.imagePrimary?.id : current.space?.imagePrimary;
  const spaceSecondaryId = typeof current.space?.imageSecondary === 'object' ? current.space?.imageSecondary?.id : current.space?.imageSecondary;
  const cuisineTeaser = current.cuisineTeaser;

  console.log('Preserved media relations:');
  console.log(`  Hero: ${heroImageId}`);
  console.log(`  Space Primary: ${spacePrimaryId}, Secondary: ${spaceSecondaryId}`);
  console.log(`  Cuisine Teaser: ${cuisineTeaser ? 'present' : 'missing'}`);

  // 2. Update EN
  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      hero: {
        headline: 'The Gateway to Taste',
        kicker: 'GEMA RESTAURANT & SOCIETIET',
        support: 'Italian classics, served with a touch of art.',
        location: 'Surabaya, Indonesia',
        ctaPrimary: 'Reserve a Table',
        ctaSecondary: 'Explore the Menu',
        ctaLabel: 'Reserve a Table',
        image: heroImageId,
      },
      positioning: {
        text: 'A deep respect for ingredients, elevated by modern Italian technique. Every dish at GEMA is a balance of comfort and artistry, crafted for the table.',
        dietary: 'No Pork, No Lard',
      },
      signatureDishes: {
        title: 'Signature Dishes',
      },
      chefPreview: {
        text: 'More than 20 years cooking across the world. One new vision in Surabaya.',
        ctaLabel: 'Meet Chef Mandif',
      },
      eventsIntro: {
        ctaLabel: 'View All Events',
      },
      journalIntro: {
        title: 'Latest from GEMA',
        ctaLabel: 'Explore More Stories',
      },
      visitIntro: {
        title: 'Visit GEMA',
      },
      space: {
        title: 'The Space',
        text: 'Where warm ivory meets lush greenery. A room designed for conversation, connection, and culinary discovery.',
        ctaLabel: 'Discover the Experience',
        imagePrimary: spacePrimaryId,
        imageSecondary: spaceSecondaryId,
      },
      cuisineTeaser: cuisineTeaser ? {
        item01: { label: current.cuisineTeaser?.item01?.label || 'Antipasti', image: typeof current.cuisineTeaser?.item01?.image === 'object' ? current.cuisineTeaser?.item01?.image?.id : current.cuisineTeaser?.item01?.image },
        item02: { label: current.cuisineTeaser?.item02?.label || 'Primi Piatti', image: typeof current.cuisineTeaser?.item02?.image === 'object' ? current.cuisineTeaser?.item02?.image?.id : current.cuisineTeaser?.item02?.image },
        item03: { label: current.cuisineTeaser?.item03?.label || 'Secondi & Grill', image: typeof current.cuisineTeaser?.item03?.image === 'object' ? current.cuisineTeaser?.item03?.image?.id : current.cuisineTeaser?.item03?.image },
        item04: { label: current.cuisineTeaser?.item04?.label || 'Dolci', image: typeof current.cuisineTeaser?.item04?.image === 'object' ? current.cuisineTeaser?.item04?.image?.id : current.cuisineTeaser?.item04?.image },
      } : undefined,
      _status: 'published',
    },
    locale: 'en',
    overrideAccess: true,
  });

  // 3. Update ID
  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      hero: {
        headline: 'Gerbang Menuju Rasa',
        kicker: 'GEMA RESTAURANT & SOCIETIET',
        support: 'Klasik Italia, disajikan dengan sentuhan seni.',
        location: 'Surabaya, Indonesia',
        ctaPrimary: 'Pesan Meja',
        ctaSecondary: 'Jelajahi Menu',
        ctaLabel: 'Pesan Meja',
      },
      positioning: {
        text: 'Rasa hormat yang mendalam terhadap bahan-bahan, ditingkatkan dengan teknik Italia modern. Setiap hidangan di GEMA adalah keseimbangan antara kenyamanan dan seni, dibuat untuk dinikmati bersama.',
        dietary: 'Tanpa Babi, Tanpa Lemak Babi',
      },
      signatureDishes: {
        title: 'Hidangan Khas',
      },
      chefPreview: {
        text: 'Lebih dari 20 tahun memasak di seluruh dunia. Satu visi baru di Surabaya.',
        ctaLabel: 'Kenali Chef Mandif',
      },
      eventsIntro: {
        ctaLabel: 'Lihat Semua Acara',
      },
      journalIntro: {
        title: 'Terbaru dari GEMA',
        ctaLabel: 'Jelajahi Cerita Lainnya',
      },
      visitIntro: {
        title: 'Kunjungi GEMA',
      },
      space: {
        title: 'Ruang',
        text: 'Di mana warna gading yang hangat bertemu dengan tanaman hijau subur. Ruang yang dirancang untuk percakapan, koneksi, dan penemuan kuliner.',
        ctaLabel: 'Temukan Pengalaman',
      },
      cuisineTeaser: cuisineTeaser ? {
        item01: { label: 'Antipasti' },
        item02: { label: 'Primi Piatti' },
        item03: { label: 'Secondi & Panggang' },
        item04: { label: 'Dolci' },
      } : undefined,
      _status: 'published',
    },
    locale: 'id',
    overrideAccess: true,
  });

  console.log('✓ Homepage Global editorial content seeded for EN and ID.');

  // 4. Verify
  const verifyEn = await payload.findGlobal({ slug: 'homepage', locale: 'en', overrideAccess: true });
  const verifyId = await payload.findGlobal({ slug: 'homepage', locale: 'id', overrideAccess: true });

  console.log(`Verified Hero headline (EN): "${verifyEn.hero?.headline}", (ID): "${verifyId.hero?.headline}"`);
  console.log(`Verified Positioning (EN): "${verifyEn.positioning?.text?.substring(0, 30)}..."`);
  console.log(`Verified Space title (EN): "${verifyEn.space?.title}", (ID): "${verifyId.space?.title}"`);

  if (!verifyEn.hero?.headline || !verifyId.hero?.headline || !verifyEn.positioning?.text) {
    throw new Error('Homepage editorial verification failed!');
  }

  console.log('=== [CMS-003] HOMEPAGE SEED COMPLETE & VERIFIED ===\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedHomepage()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Homepage seed failed:', err);
      process.exit(1);
    });
}
