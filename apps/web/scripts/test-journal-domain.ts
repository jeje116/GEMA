import { getPayload } from 'payload';
import config from '../src/payload.config';
import { getJournalEntries, getJournalEntryBySlug, isJournalLocaleSubstantive } from '../src/content/provider';
import { journalEntries as fixtureEntries } from '../src/content/fixtures/journal';

async function testJournalDomain() {
  console.log('=== [CMS-003 QA] TESTING DOMAIN 2: JOURNAL ===\n');

  // 1. Article Count & Sorting
  const entriesEn = await getJournalEntries('en');
  const entriesId = await getJournalEntries('id');

  console.log(`Fetched ${entriesEn.length} articles from Payload.`);
  if (entriesEn.length !== 3 || entriesId.length !== 3) {
    throw new Error(`Expected 3 articles, got EN: ${entriesEn.length}, ID: ${entriesId.length}`);
  }

  // Verify sort order: newest first
  for (let i = 0; i < entriesEn.length - 1; i++) {
    const d1 = new Date(entriesEn[i].publishDate).getTime();
    const d2 = new Date(entriesEn[i + 1].publishDate).getTime();
    if (d1 < d2) {
      throw new Error(`Journal posts not sorted by publishDate descending! ${entriesEn[i].slug} before ${entriesEn[i+1].slug}`);
    }
  }
  console.log('✓ Articles correctly sorted by publishDate descending.');

  // 2. Block-Level Parity Audit
  console.log('\n--- Auditing Block-Level Parity Against Fixture ---');
  for (const fe of fixtureEntries) {
    const pe = entriesEn.find(e => e.slug === fe.slug);
    if (!pe) throw new Error(`Missing article: ${fe.slug}`);

    console.log(`Article: "${fe.slug}"`);
    console.log(`  Fixture blocks: ${fe.bodyBlocks.length}, Payload blocks: ${pe.bodyBlocks.length}`);
    if (fe.bodyBlocks.length !== pe.bodyBlocks.length) {
      throw new Error(`Block count mismatch for ${fe.slug}! Expected ${fe.bodyBlocks.length}, got ${pe.bodyBlocks.length}`);
    }

    for (let b = 0; b < fe.bodyBlocks.length; b++) {
      const fb = fe.bodyBlocks[b];
      const pb = pe.bodyBlocks[b];

      if (fb.type !== pb.type) {
        throw new Error(`Block ${b} type mismatch in ${fe.slug}! Expected ${fb.type}, got ${pb.type}`);
      }

      if (fb.type === 'paragraph') {
        if (fb.content.en !== pb.content.en) {
          throw new Error(`Block ${b} EN text mismatch in ${fe.slug}!`);
        }
        if (fb.content.id && fb.content.id !== pb.content.id) {
          throw new Error(`Block ${b} ID text mismatch in ${fe.slug}!`);
        }
      } else if (fb.type === 'image') {
        if (!pb.url) {
          throw new Error(`Block ${b} image url missing in ${fe.slug}!`);
        }
        console.log(`    Block ${b} image url: ${pb.url}`);
      }
    }
    console.log(`  ✓ Block sequence and text parity: PASS`);
  }

  // 3. Draft Isolation & Direct CMS Edit Test
  console.log('\n--- Testing Draft Isolation and Direct CMS Edit ---');
  const payload = await getPayload({ config });
  const testDocRes = await payload.find({
    collection: 'journal-posts',
    where: { slug: { equals: 'inside-gemas-fresh-pasta' } },
    limit: 1,
    overrideAccess: true,
  });
  const testDoc = testDocRes.docs[0];
  const originalTitle = testDoc.title;

  console.log('1. Updating article to draft with new title...');
  await payload.update({
    collection: 'journal-posts',
    id: testDoc.id,
    data: {
      title: 'DRAFT TITLE SHOULD NOT BE PUBLIC',
      _status: 'draft',
    },
    locale: 'en',
    overrideAccess: true,
  });

  const publicAfterDraft = await getJournalEntryBySlug('inside-gemas-fresh-pasta', 'en');
  console.log(`Public title after draft update: "${publicAfterDraft?.title.en}"`);
  if (publicAfterDraft?.title.en === 'DRAFT TITLE SHOULD NOT BE PUBLIC') {
    throw new Error('LEAK: Draft title is visible to public provider!');
  }
  console.log('✓ Draft isolation verified: Draft content does not leak to public.');

  console.log('2. Publishing edit...');
  await payload.update({
    collection: 'journal-posts',
    id: testDoc.id,
    data: {
      title: 'CMS-EDIT-TEST: The Art of Pasta Making',
      _status: 'published',
    },
    locale: 'en',
    overrideAccess: true,
  });

  const publicAfterPublish = await getJournalEntryBySlug('inside-gemas-fresh-pasta', 'en');
  console.log(`Public title after publish: "${publicAfterPublish?.title.en}"`);
  if (publicAfterPublish?.title.en !== 'CMS-EDIT-TEST: The Art of Pasta Making') {
    throw new Error('Direct CMS published edit not reflected via public provider!');
  }
  console.log('✓ Direct CMS published edit reflected in public provider.');

  console.log('3. Restoring original title and republishing...');
  await payload.update({
    collection: 'journal-posts',
    id: testDoc.id,
    data: {
      title: originalTitle,
      _status: 'published',
    },
    locale: 'en',
    overrideAccess: true,
  });

  const publicRestored = await getJournalEntryBySlug('inside-gemas-fresh-pasta', 'en');
  if (publicRestored?.title.en !== originalTitle) {
    throw new Error('Failed to restore original title!');
  }
  console.log('✓ Original title successfully restored.');

  console.log('\n=== DOMAIN 2: JOURNAL PASS ===\n');
}

testJournalDomain()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Journal domain test failed:', err);
    process.exit(1);
  });
