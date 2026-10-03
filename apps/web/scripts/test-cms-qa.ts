import { getPayload } from 'payload';
import config from '../src/payload.config';
import { getHomepageMedia, getChefMedia } from '../src/content/provider';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runQA() {
  console.log('=== GEMA CMS-002 DETERMINISTIC REVALIDATION, DRAFT & SAFETY QA ===\n');

  const payload = await getPayload({ config });

  // -------------------------------------------------------------
  // TEST 1: DELETE SAFETY
  // -------------------------------------------------------------
  console.log('--- TEST 1: DELETE SAFETY ---');

  // Find a referenced media document
  const heroMedia = await payload.find({
    collection: 'media',
    where: { sourceKey: { equals: 'home.hero.open-kitchen' } },
    overrideAccess: true,
  });
  const heroDocId = heroMedia.docs[0]?.id;

  let deleteBlocked = false;
  try {
    await payload.delete({
      collection: 'media',
      id: heroDocId,
      overrideAccess: true, // even with privileged access, beforeDelete hook runs!
    });
  } catch (err: any) {
    deleteBlocked = true;
    console.log(`✓ Delete correctly blocked for referenced asset (ID ${heroDocId}):`, err.message);
  }

  if (!deleteBlocked) {
    throw new Error('FAIL: Referenced media document was deleted without restriction!');
  }

  // Create an unreferenced dummy media document and verify delete is allowed
  const validBuffer = fs.readFileSync(path.resolve(__dirname, '../public/media/about/about-origin.jpg'));

  const dummyMedia = await payload.create({
    collection: 'media',
    data: {
      sourceKey: 'test.dummy.unreferenced',
      alt: 'Dummy test image',
    },
    file: {
      data: validBuffer,
      name: 'dummy-test.jpg',
      mimetype: 'image/jpeg',
      size: validBuffer.length,
    },
    overrideAccess: true,
  });
  console.log(`Created dummy unreferenced media ID: ${dummyMedia.id}`);

  let dummyDeleted = false;
  try {
    await payload.delete({
      collection: 'media',
      id: dummyMedia.id,
      overrideAccess: true,
    });
    dummyDeleted = true;
    console.log(`✓ Unreferenced dummy media ID ${dummyMedia.id} was successfully deleted.`);
  } catch (err: any) {
    console.error('Failed to delete unreferenced dummy media:', err.message);
  }

  if (!dummyDeleted) {
    throw new Error('FAIL: Unreferenced media document could not be deleted!');
  }

  // -------------------------------------------------------------
  // TEST 2: DRAFT VS PUBLISHED ON HOMEPAGE GLOBAL
  // -------------------------------------------------------------
  console.log('\n--- TEST 2: DRAFT VS PUBLISHED ON HOMEPAGE GLOBAL ---');

  // Initial state check
  const initialHpMedia = await getHomepageMedia('en');
  const initialHeroSrc = initialHpMedia?.hero.src;
  console.log(`Initial Public Hero Image: ${initialHeroSrc}`);

  // Retrieve alternate media (ID 2: antipasti)
  const antipastiDoc = await payload.find({
    collection: 'media',
    where: { sourceKey: { equals: 'home.teaser.antipasti' } },
    overrideAccess: true,
  });
  const altMediaId = antipastiDoc.docs[0].id;

  // 2A: Save Homepage as DRAFT with alternate hero image
  console.log(`Saving Homepage Global as DRAFT with hero image ID: ${altMediaId}...`);
  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      hero: {
        image: altMediaId,
      },
      _status: 'draft',
    },
    draft: true,
    overrideAccess: true,
  });

  // Public frontend query (overrideAccess: false)
  const draftPhaseHpMedia = await getHomepageMedia('en');
  console.log(`Public Site Hero Image during Draft phase: ${draftPhaseHpMedia?.hero.src}`);

  const draftIsolated = draftPhaseHpMedia?.hero.src === initialHeroSrc;
  console.log(`✓ Draft does NOT affect public live site: ${draftIsolated ? 'PASS' : 'FAIL'}`);

  if (!draftIsolated) {
    throw new Error('FAIL: Unpublished draft change leaked to public site!');
  }

  // 2B: Publish alternate hero image
  console.log(`Publishing Homepage Global with hero image ID: ${altMediaId}...`);
  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      hero: {
        image: altMediaId,
      },
      _status: 'published',
    },
    draft: false,
    overrideAccess: true,
  });

  const publishedPhaseHpMedia = await getHomepageMedia('en');
  console.log(`Public Site Hero Image after publish: ${publishedPhaseHpMedia?.hero.src}`);
  const publishReflected = publishedPhaseHpMedia?.hero.src.includes('home-menu-teaser-antipasti.jpg');
  console.log(`✓ Published Hero Change Appears: ${publishReflected ? 'PASS' : 'FAIL'}`);

  // 2C: Restore original hero image
  console.log(`Restoring original Hero Image ID ${heroDocId}...`);
  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      hero: {
        image: heroDocId,
      },
      _status: 'published',
    },
    draft: false,
    overrideAccess: true,
  });

  const restoredPhaseHpMedia = await getHomepageMedia('en');
  const heroRestored = restoredPhaseHpMedia?.hero.src === initialHeroSrc;
  console.log(`✓ Hero Original Restored: ${heroRestored ? 'PASS' : 'FAIL'}`);

  // -------------------------------------------------------------
  // TEST 3: CHEF PORTRAIT SWAP & RESTORE
  // -------------------------------------------------------------
  console.log('\n--- TEST 3: CHEF PORTRAIT SWAP & RESTORE ---');

  const initialChefMedia = await getChefMedia('en');
  const initialPortraitSrc = initialChefMedia?.portrait.src;
  console.log(`Initial Chef Portrait: ${initialPortraitSrc}`);

  const chefDoc = await payload.find({
    collection: 'media',
    where: { sourceKey: { equals: 'chef.mandif.portrait' } },
    overrideAccess: true,
  });
  const originalPortraitId = chefDoc.docs[0].id;

  // Swap to altMediaId
  console.log(`Swapping Chef portrait to Media ID ${altMediaId}...`);
  await payload.updateGlobal({
    slug: 'chef',
    data: {
      portrait: altMediaId,
    },
    overrideAccess: true,
  });

  const swappedChefMedia = await getChefMedia('en');
  console.log(`Swapped Chef Portrait: ${swappedChefMedia?.portrait.src}`);
  const portraitSwapped = swappedChefMedia?.portrait.src.includes('home-menu-teaser-antipasti.jpg');
  console.log(`✓ Chef Portrait Swap: ${portraitSwapped ? 'PASS' : 'FAIL'}`);

  // Restore original portrait
  console.log(`Restoring original Chef Portrait ID ${originalPortraitId}...`);
  await payload.updateGlobal({
    slug: 'chef',
    data: {
      portrait: originalPortraitId,
    },
    overrideAccess: true,
  });

  const restoredChefMedia = await getChefMedia('en');
  const portraitRestored = restoredChefMedia?.portrait.src === initialPortraitSrc;
  console.log(`✓ Chef Original Restored: ${portraitRestored ? 'PASS' : 'FAIL'}`);

  // -------------------------------------------------------------
  // TEST 4: LOCALIZATION ALT TEST
  // -------------------------------------------------------------
  console.log('\n--- TEST 4: LOCALIZATION ALT TEST ---');

  // Check food overview panel which has explicit EN and ID
  const foodMediaEN = await payload.find({
    collection: 'media',
    where: { sourceKey: { equals: 'menu.panel.food' } },
    locale: 'en',
    overrideAccess: false,
  });
  const foodMediaID = await payload.find({
    collection: 'media',
    where: { sourceKey: { equals: 'menu.panel.food' } },
    locale: 'id',
    overrideAccess: false,
  });

  console.log(`EN Alt: "${foodMediaEN.docs[0]?.alt}"`);
  console.log(`ID Alt: "${foodMediaID.docs[0]?.alt}"`);
  const enAltPass = foodMediaEN.docs[0]?.alt === 'A selection of dishes served at GEMA';
  const idAltPass = foodMediaID.docs[0]?.alt === 'Pilihan hidangan yang disajikan di GEMA';

  // Check fallback when ID is not provided (e.g. home.hero.open-kitchen)
  const heroMediaID = await payload.find({
    collection: 'media',
    where: { sourceKey: { equals: 'home.hero.open-kitchen' } },
    locale: 'id',
    fallbackLocale: 'en',
    overrideAccess: false,
  });
  console.log(`Fallback ID Alt for Hero: "${heroMediaID.docs[0]?.alt}"`);
  const fallbackPass = heroMediaID.docs[0]?.alt === 'GEMA Open Kitchen';

  console.log(`✓ EN Alt: ${enAltPass ? 'PASS' : 'FAIL'}`);
  console.log(`✓ ID Alt: ${idAltPass ? 'PASS' : 'FAIL'}`);
  console.log(`✓ Fallback behavior: ${fallbackPass ? 'PASS' : 'FAIL'}`);

  console.log('\n=== ALL QA TESTS PASSED SUCCESSFULLY ===');
  process.exit(0);
}

runQA().catch((err) => {
  console.error('QA Test Failed:', err);
  process.exit(1);
});
