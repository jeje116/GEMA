import { getPayload } from 'payload';
import config from '../src/payload.config';

interface SlotCheck {
  slot: string;
  originalSource: string;
  sourceKey: string;
  expectedType: 'image' | 'video';
}

const ALL_SLOTS: SlotCheck[] = [
  {
    slot: 'Homepage Hero',
    originalSource: '/media/hero/home-hero-open-kitchen.jpg',
    sourceKey: 'home.hero.open-kitchen',
    expectedType: 'image',
  },
  {
    slot: 'Homepage Cuisine Antipasti',
    originalSource: '/media/teaser/home-menu-teaser-antipasti.jpg',
    sourceKey: 'home.teaser.antipasti',
    expectedType: 'image',
  },
  {
    slot: 'Homepage Cuisine Pasta',
    originalSource: '/media/teaser/home-menu-teaser-pasta.jpg',
    sourceKey: 'home.teaser.pasta',
    expectedType: 'image',
  },
  {
    slot: 'Homepage Cuisine Grill',
    originalSource: '/media/teaser/home-menu-teaser-grill.jpg',
    sourceKey: 'home.teaser.grill',
    expectedType: 'image',
  },
  {
    slot: 'Homepage Cuisine Dolci',
    originalSource: '/media/teaser/home-menu-teaser-dolci.jpg',
    sourceKey: 'home.teaser.dolci',
    expectedType: 'image',
  },
  {
    slot: 'Homepage Space Indoor',
    originalSource: '/media/experience/home-experience-indoor.jpg',
    sourceKey: 'home.space.indoor',
    expectedType: 'image',
  },
  {
    slot: 'Homepage Space Patio',
    originalSource: '/media/experience/home-experience-patio.jpg',
    sourceKey: 'home.space.patio',
    expectedType: 'image',
  },
  {
    slot: 'Homepage Signature Steak',
    originalSource: '/media/signature/home-signature-steak.jpg',
    sourceKey: 'home.signature.steak',
    expectedType: 'image',
  },
  {
    slot: 'Homepage Signature Tiramisu',
    originalSource: '/media/signature/home-signature-tiramisu.jpg',
    sourceKey: 'home.signature.tiramisu',
    expectedType: 'image',
  },
  {
    slot: 'Homepage Signature Pizzetta 1',
    originalSource: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80',
    sourceKey: 'shared.unsplash.1551183053-bf91a1d81141',
    expectedType: 'image',
  },
  {
    slot: 'Homepage Signature Pizzetta 2',
    originalSource: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80',
    sourceKey: 'shared.unsplash.1513104890138-7c749659a591',
    expectedType: 'image',
  },
  {
    slot: 'Chef Video (Chef Preview)',
    originalSource: '/media/video/chef-home-loop.mp4',
    sourceKey: 'chef.mandif.home-video',
    expectedType: 'video',
  },
  {
    slot: 'Chef Video Poster',
    originalSource: 'https://lh3.googleusercontent.com/d/1-FyV-tjBSYFPREnlLVztF09dCSut5Zv8',
    sourceKey: 'chef.mandif.home-video-poster',
    expectedType: 'image',
  },
  {
    slot: 'Chef Portrait',
    originalSource: '/media/chef/chef-mandif-warokka.jpg',
    sourceKey: 'chef.mandif.portrait',
    expectedType: 'image',
  },
  {
    slot: 'Menu Food Panel',
    originalSource: '/media/menu/menu-food-overview.jpg',
    sourceKey: 'menu.panel.food',
    expectedType: 'image',
  },
  {
    slot: 'Menu Beverage Panel',
    originalSource: '/media/menu/menu-beverage-cocktail.jpg',
    sourceKey: 'menu.panel.beverage',
    expectedType: 'image',
  },
  {
    slot: 'About Origin',
    originalSource: '/media/about/about-origin.jpg',
    sourceKey: 'about.origin',
    expectedType: 'image',
  },
  {
    slot: 'About Philosophy',
    originalSource: '/media/about/about-philosophy.jpg',
    sourceKey: 'about.philosophy',
    expectedType: 'image',
  },
  {
    slot: 'About Architecture',
    originalSource: '/media/about/about-architecture.jpg',
    sourceKey: 'about.architecture',
    expectedType: 'image',
  },
  {
    slot: 'Experience Hero',
    originalSource: '/media/experience/experience-hero.jpg',
    sourceKey: 'experience.hero',
    expectedType: 'image',
  },
  {
    slot: 'Experience Morning',
    originalSource: '/media/experience/experience-day-morning.jpg',
    sourceKey: 'experience.morning',
    expectedType: 'image',
  },
  {
    slot: 'Experience Evening',
    originalSource: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80',
    sourceKey: 'experience.evening',
    expectedType: 'image',
  },
  {
    slot: 'Experience Details',
    originalSource: '/media/experience/experience-culinary-details.jpg',
    sourceKey: 'experience.details',
    expectedType: 'image',
  },
  {
    slot: 'Occasions Hero',
    originalSource: '/media/occasions/occasions-hero.jpg',
    sourceKey: 'occasions.hero',
    expectedType: 'image',
  },
  {
    slot: 'Occasions Private Dining',
    originalSource: '/media/occasions/occasions-private-dining.jpg',
    sourceKey: 'occasions.private-dining',
    expectedType: 'image',
  },
  {
    slot: 'Occasions Wedding',
    originalSource: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80',
    sourceKey: 'occasions.wedding',
    expectedType: 'image',
  },
  {
    slot: 'Occasions Birthday',
    originalSource: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80',
    sourceKey: 'occasions.birthday',
    expectedType: 'image',
  },
  {
    slot: 'Occasions Brand Mondial',
    originalSource: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80',
    sourceKey: 'occasions.brand.mondial',
    expectedType: 'image',
  },
  {
    slot: 'Occasions Brand Frank & Co',
    originalSource: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80',
    sourceKey: 'occasions.brand.frank-co',
    expectedType: 'image',
  },
  {
    slot: 'Occasions Brand Maharva',
    originalSource: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&q=80',
    sourceKey: 'occasions.brand.maharva',
    expectedType: 'image',
  },
  {
    slot: 'Event Private Table Series',
    originalSource: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80',
    sourceKey: 'events.private-table-series',
    expectedType: 'image',
  },
  {
    slot: 'Event Seasonal Tasting',
    originalSource: 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&q=80',
    sourceKey: 'events.seasonal-tasting',
    expectedType: 'image',
  },
  {
    slot: 'Event Sunday Society',
    originalSource: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80',
    sourceKey: 'events.sunday-society',
    expectedType: 'image',
  },
  {
    slot: 'Event Wine Discovery',
    originalSource: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80',
    sourceKey: 'shared.unsplash.1551183053-bf91a1d81141',
    expectedType: 'image',
  },
  {
    slot: 'Event Pasta Masterclass',
    originalSource: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80',
    sourceKey: 'shared.unsplash.1513104890138-7c749659a591',
    expectedType: 'image',
  },
  {
    slot: 'Event Aperitivo Hour',
    originalSource: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
    sourceKey: 'shared.unsplash.1517248135467-4c7edcad34c4',
    expectedType: 'image',
  },
  {
    slot: 'Journal Inside Fresh Pasta (Cover)',
    originalSource: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80',
    sourceKey: 'journal.fresh-pasta.cover',
    expectedType: 'image',
  },
  {
    slot: 'Journal Inside Fresh Pasta (Body)',
    originalSource: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80',
    sourceKey: 'shared.unsplash.1551183053-bf91a1d81141',
    expectedType: 'image',
  },
  {
    slot: 'Journal From Dough to Fire (Cover)',
    originalSource: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80',
    sourceKey: 'shared.unsplash.1513104890138-7c749659a591',
    expectedType: 'image',
  },
  {
    slot: 'Journal A Table for Two (Cover)',
    originalSource: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
    sourceKey: 'shared.unsplash.1517248135467-4c7edcad34c4',
    expectedType: 'image',
  },
];

async function main() {
  const payload = await getPayload({ config });

  console.log('=== GEMA CMS-002 MEDIA PARITY & DEDUPLICATION AUDIT ===\n');

  const allMediaDocs = await payload.find({
    collection: 'media',
    limit: 100,
    overrideAccess: true,
  });

  const totalMediaInDb = allMediaDocs.totalDocs;
  const sourceKeyMap = new Map<string, any>();
  const duplicates: string[] = [];

  for (const doc of allMediaDocs.docs) {
    const sk = (doc as any).sourceKey;
    if (sk) {
      if (sourceKeyMap.has(sk)) {
        duplicates.push(sk);
      } else {
        sourceKeyMap.set(sk, doc);
      }
    }
  }

  const photoSlots = ALL_SLOTS.filter(s => s.expectedType === 'image').length;
  const videoSlots = ALL_SLOTS.filter(s => s.expectedType === 'video').length;

  console.log(`TOTAL ACTIVE SLOTS: ${ALL_SLOTS.length}`);
  console.log(`- Active Photo Slots: ${photoSlots}`);
  console.log(`- Active Video Slots: ${videoSlots}`);
  console.log(`UNIQUE MEDIA ASSETS / PAYLOAD RECORDS: ${sourceKeyMap.size}`);
  console.log(`TOTAL PAYLOAD MEDIA DOCUMENTS: ${totalMediaInDb}`);
  console.log(`DUPLICATE MEDIA RECORDS: ${duplicates.length}\n`);

  if (duplicates.length > 0) {
    console.error('FAILED: Found duplicates:', duplicates);
    process.exit(1);
  }

  console.log('| Slot | Original Source | Payload sourceKey | Media Record ID | MIME | Match |');
  console.log('|---|---|---|---|---|---|');

  let allMatch = true;
  for (const slot of ALL_SLOTS) {
    const doc = sourceKeyMap.get(slot.sourceKey);
    const match = Boolean(doc && doc.id);
    if (!match) allMatch = false;

    const mime = doc?.mimeType || 'unknown';
    console.log(`| ${slot.slot} | \`${slot.originalSource.slice(0, 45)}${slot.originalSource.length > 45 ? '...' : ''}\` | \`${slot.sourceKey}\` | ${doc?.id || 'MISSING'} | ${mime} | ${match ? 'PASS' : 'FAIL'} |`);
  }

  console.log('\nAudit Result:', allMatch ? 'ALL 40 SLOTS VERIFIED PASS' : 'FAILED');
  process.exit(allMatch ? 0 : 1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
