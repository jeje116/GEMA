import { getPayload } from 'payload';
import config from '../src/payload.config';
import { events } from '../src/content/fixtures/events';

const EVENT_MEDIA_MAP: Record<string, string> = {
  'private-table-series': 'events.private-table-series',
  'seasonal-tasting': 'events.seasonal-tasting',
  'sunday-society': 'events.sunday-society',
  'an-evening-of-fresh-pasta': 'shared.unsplash.1551183053-bf91a1d81141',
  'fire-and-flour': 'shared.unsplash.1513104890138-7c749659a591',
  'a-table-for-two': 'shared.unsplash.1517248135467-4c7edcad34c4',
};

export async function seedEvents() {
  console.log('=== [CMS-003] SEEDING EVENTS (6 EVENTS WITH EXACT TIMESTAMPS) ===');

  const sourceSlugs = events.map((e) => e.slug);
  console.log('SOURCE EVENT SLUGS:');
  console.log(JSON.stringify(sourceSlugs, null, 2));

  if (events.length !== 6) {
    throw new Error(`Expected 6 events in fixture, got ${events.length}`);
  }

  const payload = await getPayload({ config });

  // 1. Fetch Media records
  console.log('Fetching media records for events...');
  const mediaRecords = await payload.find({
    collection: 'media',
    where: {
      sourceKey: {
        in: Object.values(EVENT_MEDIA_MAP),
      },
    },
    limit: 20,
    overrideAccess: true,
  });

  const mediaByKey = new Map<string, number | string>();
  mediaRecords.docs.forEach((m: any) => {
    if (m.sourceKey) mediaByKey.set(m.sourceKey, m.id);
  });
  console.log(`Found ${mediaByKey.size} media records for events.`);

  // 2. Seed each event
  for (const event of events) {
    console.log(`Seeding event: "${event.slug}"...`);

    const mediaKey = EVENT_MEDIA_MAP[event.slug];
    const coverMediaId = mediaKey ? mediaByKey.get(mediaKey) : undefined;
    if (!coverMediaId) {
      throw new Error(`Missing cover media record for event slug: ${event.slug} (key: ${mediaKey})`);
    }

    const existing = await payload.find({
      collection: 'events',
      where: {
        slug: { equals: event.slug },
      },
      limit: 1,
      overrideAccess: true,
    });

    const dataEn: any = {
      title: event.title.en,
      slug: event.slug,
      eyebrow: event.eyebrow.en,
      shortDescription: event.shortDescription.en,
      fullDescription: event.fullDescription.en,
      startDateTime: event.startDateTime,
      endDateTime: event.endDateTime,
      priceLabel: event.priceLabel.en,
      coverImage: coverMediaId,
      featured: Boolean(event.featured),
      _status: 'published',
    };

    const dataId: any = {
      title: event.title.id || event.title.en,
      eyebrow: event.eyebrow.id || event.eyebrow.en,
      shortDescription: event.shortDescription.id || event.shortDescription.en,
      fullDescription: event.fullDescription.id || event.fullDescription.en,
      priceLabel: event.priceLabel.id || event.priceLabel.en,
      _status: 'published',
    };

    let docId: number | string;
    if (existing.docs.length > 0) {
      docId = existing.docs[0].id;
      await payload.update({
        collection: 'events',
        id: docId,
        data: dataEn,
        locale: 'en',
        overrideAccess: true,
      });
      await payload.update({
        collection: 'events',
        id: docId,
        data: dataId,
        locale: 'id',
        overrideAccess: true,
      });
    } else {
      const created = await payload.create({
        collection: 'events',
        data: dataEn,
        locale: 'en',
        overrideAccess: true,
      });
      docId = created.id;
      await payload.update({
        collection: 'events',
        id: docId,
        data: dataId,
        locale: 'id',
        overrideAccess: true,
      });
    }
    console.log(`✓ Event "${event.slug}" seeded and published.`);
  }

  // 3. Verification & Slug Parity Output
  const verify = await payload.find({
    collection: 'events',
    where: { _status: { equals: 'published' } },
    limit: 20,
    overrideAccess: true,
  });

  const payloadSlugs = verify.docs.map((d: any) => d.slug);
  console.log('\nPAYLOAD EVENT SLUGS:');
  console.log(JSON.stringify(payloadSlugs, null, 2));

  const sortedSource = [...sourceSlugs].sort();
  const sortedPayload = [...payloadSlugs].sort();
  const slugMatch = JSON.stringify(sortedSource) === JSON.stringify(sortedPayload);

  console.log(`\nSlug Match: ${slugMatch ? 'PASS' : 'FAIL'}`);
  console.log(`Final DB Published Events: ${verify.totalDocs} (Expected: 6)`);

  if (!slugMatch || verify.totalDocs !== 6) {
    throw new Error(`Event verification failed! Slugs match: ${slugMatch}, Total: ${verify.totalDocs}`);
  }

  console.log('=== [CMS-003] EVENTS SEED COMPLETE & VERIFIED ===\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedEvents()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Events seed failed:', err);
      process.exit(1);
    });
}
