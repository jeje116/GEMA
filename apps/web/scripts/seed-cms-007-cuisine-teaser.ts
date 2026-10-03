import { getPayload } from 'payload';
import config from '../src/payload.config';

export async function seedCuisineTeaser() {
  console.log('=== [CMS-007] SEEDING HOMEPAGE CUISINE TEASER ===');

  const payload = await getPayload({ config });

  // 1. Fetch current Homepage
  const current = await payload.findGlobal({
    slug: 'homepage',
    overrideAccess: true,
  });

  // 2. Fetch media records by sourceKey if available
  const mediaKeys = [
    'home.teaser.antipasti',
    'home.teaser.pasta',
    'home.teaser.grill',
    'home.teaser.dolci',
  ];

  const mediaDocs = await payload.find({
    collection: 'media',
    where: {
      sourceKey: { in: mediaKeys },
    },
    limit: 10,
    overrideAccess: true,
  });

  const mediaMap = new Map<string, number>();
  mediaDocs.docs.forEach((doc: any) => {
    if (doc.sourceKey) {
      mediaMap.set(doc.sourceKey, doc.id);
    }
  });

  const item01Img = mediaMap.get('home.teaser.antipasti') || (typeof current.cuisineTeaser?.item01?.image === 'object' ? current.cuisineTeaser?.item01?.image?.id : current.cuisineTeaser?.item01?.image);
  const item02Img = mediaMap.get('home.teaser.pasta') || (typeof current.cuisineTeaser?.item02?.image === 'object' ? current.cuisineTeaser?.item02?.image?.id : current.cuisineTeaser?.item02?.image);
  const item03Img = mediaMap.get('home.teaser.grill') || (typeof current.cuisineTeaser?.item03?.image === 'object' ? current.cuisineTeaser?.item03?.image?.id : current.cuisineTeaser?.item03?.image);
  const item04Img = mediaMap.get('home.teaser.dolci') || (typeof current.cuisineTeaser?.item04?.image === 'object' ? current.cuisineTeaser?.item04?.image?.id : current.cuisineTeaser?.item04?.image);

  console.log('Media IDs identified:');
  console.log(`  item01 (Antipasti): ${item01Img}`);
  console.log(`  item02 (Pasta): ${item02Img}`);
  console.log(`  item03 (Grill): ${item03Img}`);
  console.log(`  item04 (Dolci): ${item04Img}`);

  // 3. Update EN
  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'en',
    data: {
      cuisineTeaser: {
        item01: { label: 'Antipasti', image: item01Img },
        item02: { label: 'Primi Piatti', image: item02Img },
        item03: { label: 'Secondi & Grill', image: item03Img },
        item04: { label: 'Dolci', image: item04Img },
      },
      _status: 'published',
    },
    overrideAccess: true,
  });

  // 4. Update ID
  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'id',
    data: {
      cuisineTeaser: {
        item01: { label: 'Antipasti', image: item01Img },
        item02: { label: 'Primi Piatti', image: item02Img },
        item03: { label: 'Secondi & Panggang', image: item03Img },
        item04: { label: 'Dolci', image: item04Img },
      },
      _status: 'published',
    },
    overrideAccess: true,
  });

  console.log('✓ Homepage cuisine teaser seeded for EN and ID.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedCuisineTeaser()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Cuisine teaser seed failed:', err);
      process.exit(1);
    });
}
