import { getPayload } from 'payload';
import config from '../src/payload.config';
import { getEvents, getEventBySlug } from '../src/content/provider';
import { events as fixtureEvents } from '../src/content/fixtures/events';

async function testEventsDomain() {
  console.log('=== [CMS-003 QA] TESTING DOMAIN 3: EVENTS ===\n');

  // 1. Fetch all events
  const eventsEn = await getEvents('en', { status: 'all' });
  const eventsId = await getEvents('id', { status: 'all' });

  console.log(`Fetched ${eventsEn.length} events from Payload.`);
  if (eventsEn.length !== 6 || eventsId.length !== 6) {
    throw new Error(`Expected 6 events, got EN: ${eventsEn.length}, ID: ${eventsId.length}`);
  }

  // 2. Exact Slug Comparison
  const sourceSlugs = fixtureEvents.map(e => e.slug).sort();
  const payloadSlugs = eventsEn.map(e => e.slug).sort();

  console.log('SOURCE EVENT SLUGS:');
  console.log(JSON.stringify(sourceSlugs, null, 2));
  console.log('PAYLOAD EVENT SLUGS:');
  console.log(JSON.stringify(payloadSlugs, null, 2));

  const slugMatch = JSON.stringify(sourceSlugs) === JSON.stringify(payloadSlugs);
  console.log(`\nSlug Match: ${slugMatch ? 'PASS' : 'FAIL'}`);
  if (!slugMatch) {
    throw new Error('Event slugs do not match fixture!');
  }

  // 3. Field Parity & Timestamps
  for (const fe of fixtureEvents) {
    const pe = eventsEn.find(e => e.slug === fe.slug);
    if (!pe) throw new Error(`Missing event in Payload: ${fe.slug}`);

    // Verify date parity (fixture generates dynamic dates relative to execution time; assert day offset within tolerance)
    const fStart = new Date(fe.startDateTime).getTime();
    const pStart = new Date(pe.startDateTime).getTime();
    const diffSeconds = Math.abs(fStart - pStart) / 1000;
    if (diffSeconds > 120) {
      throw new Error(`Timestamp mismatch for ${fe.slug}! Fixture: ${new Date(fe.startDateTime).toISOString()}, Payload: ${new Date(pe.startDateTime).toISOString()}`);
    }

    if (!pe.coverImage) {
      throw new Error(`Event ${fe.slug} missing coverImage!`);
    }
    console.log(`✓ Event "${fe.slug}": Date parity verified (${pStart}), coverImage: ${pe.coverImage}`);
  }

  // 4. Direct CMS Edit Test
  console.log('\n--- Direct CMS Edit Test on Event ---');
  const payload = await getPayload({ config });
  const testDocRes = await payload.find({
    collection: 'events',
    where: { slug: { equals: 'private-table-series' } },
    limit: 1,
    overrideAccess: true,
  });
  const testDoc = testDocRes.docs[0];
  const originalTitle = testDoc.title;

  console.log('Updating event title in Payload...');
  await payload.update({
    collection: 'events',
    id: testDoc.id,
    data: {
      title: 'CMS-EDIT-TEST: Private Culinary Series',
      _status: 'published',
    },
    locale: 'en',
    overrideAccess: true,
  });

  const publicAfterEdit = await getEventBySlug('private-table-series', 'en', false);
  console.log(`Public title after edit: "${publicAfterEdit?.title.en}"`);
  if (publicAfterEdit?.title.en !== 'CMS-EDIT-TEST: Private Culinary Series') {
    throw new Error('Direct CMS edit not reflected via public provider!');
  }
  console.log('✓ Direct CMS edit reflected in public provider.');

  console.log('Restoring original title in Payload...');
  await payload.update({
    collection: 'events',
    id: testDoc.id,
    data: {
      title: originalTitle,
      _status: 'published',
    },
    locale: 'en',
    overrideAccess: true,
  });

  const publicRestored = await getEventBySlug('private-table-series', 'en', false);
  if (publicRestored?.title.en !== originalTitle) {
    throw new Error('Failed to restore original title!');
  }
  console.log('✓ Original title successfully restored.');

  console.log('\n=== DOMAIN 3: EVENTS PASS ===\n');
}

testEventsDomain()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Events domain test failed:', err);
    process.exit(1);
  });
