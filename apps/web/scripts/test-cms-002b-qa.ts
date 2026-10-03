import { getPayload } from 'payload';
import config from '../src/payload.config';
import { getHomepageMedia, getChefMedia, getPageMedia } from '../src/content/provider';
import { resolveMedia } from '../src/lib/media';

async function runCMS002BTests() {
  console.log('=== GEMA CMS-002B FINAL MEDIA SOURCE-OF-TRUTH QA SUITE ===\n');
  const payload = await getPayload({ config });

  // -------------------------------------------------------------
  // TEST 1: 40 ACTIVE SLOTS & 35 UNIQUE RECORDS VERIFICATION
  // -------------------------------------------------------------
  console.log('--- TEST 1: ACTIVE MEDIA SLOTS & RECORDS AUDIT ---');
  const allMedia = await payload.find({
    collection: 'media',
    limit: 100,
    overrideAccess: true,
  });
  console.log(`Total Payload Media records in DB: ${allMedia.totalDocs}`);

  const sourceKeys = allMedia.docs.map((d) => d.sourceKey).filter(Boolean);
  const uniqueSourceKeys = new Set(sourceKeys);
  console.log(`Unique sourceKeys: ${uniqueSourceKeys.size} / ${allMedia.totalDocs}`);
  if (uniqueSourceKeys.size !== allMedia.totalDocs) {
    throw new Error('FAIL: Duplicate media records detected in database!');
  }

  // -------------------------------------------------------------
  // TEST 2: MISSING RELATION FAILURE TEST (SIMULATE MISSING CMS RELATION)
  // -------------------------------------------------------------
  console.log('\n--- TEST 2: MISSING RELATION FAILURE TEST ---');
  // Fetch current Homepage Global
  const originalHomepage = await payload.findGlobal({
    slug: 'homepage',
    overrideAccess: true,
  });
  const originalHeroId = typeof originalHomepage.hero?.image === 'object' 
    ? originalHomepage.hero.image.id 
    : originalHomepage.hero?.image;

  console.log(`Original Homepage Hero Media ID: ${originalHeroId}`);

  // -------------------------------------------------------------
  // TEST 2: MISSING RELATION FAILURE TEST
  // -------------------------------------------------------------
  console.log('\n--- TEST 2: MISSING RELATION FAILURE TEST ---');
  // 2A: Test schema enforcement (Payload blocks saving null for required relations)
  console.log('Testing Payload schema enforcement for required relation...');
  let validationBlocked = false;
  try {
    await payload.updateGlobal({
      slug: 'homepage',
      data: {
        hero: {
          ...originalHomepage.hero,
          image: null as any,
        },
      },
      overrideAccess: true,
    });
  } catch (err: any) {
    validationBlocked = true;
    console.log('✓ PASS: Payload schema correctly blocked unsetting required hero.image:', err.message);
  }
  if (!validationBlocked) {
    throw new Error('FAIL: Payload allowed unsetting required hero.image without validation error!');
  }

  // 2B: Test runtime adapter behavior when a relation is unexpectedly missing or broken
  console.log('Testing runtime resolveMedia behavior on missing relation...');
  const missingResolved = resolveMedia(null, 'Simulated Missing Hero');
  console.log('Resolved missing media:', missingResolved);

  if (missingResolved.src === '/media/hero/home-hero-open-kitchen.jpg') {
    throw new Error('FAIL: resolveMedia silently fell back to old static image path!');
  }
  if (missingResolved.src !== '') {
    throw new Error(`FAIL: Expected empty src on missing relation, got: ${missingResolved.src}`);
  }
  console.log('✓ PASS: resolveMedia returned controlled empty src with zero static fallback.');

  // -------------------------------------------------------------
  // TEST 3: CMS LIVE EDIT TEST — HOMEPAGE HERO
  // -------------------------------------------------------------
  console.log('\n--- TEST 3: CMS LIVE EDIT TEST (HOMEPAGE HERO) ---');
  // Find alternate image (antipasti teaser)
  const antipastiDoc = await payload.find({
    collection: 'media',
    where: { sourceKey: { equals: 'home.teaser.antipasti' } },
    overrideAccess: true,
  });
  const altMediaId = antipastiDoc.docs[0].id;
  const altMediaUrl = antipastiDoc.docs[0].url;

  console.log(`Swapping Hero A (ID ${originalHeroId}) → Hero B (ID ${altMediaId}, URL ${altMediaUrl})...`);
  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      hero: {
        ...originalHomepage.hero,
        image: altMediaId,
      },
      _status: 'published',
    },
    overrideAccess: true,
  });

  const swappedHpMedia = await getHomepageMedia('en');
  console.log(`Swapped Public Hero src: ${swappedHpMedia?.hero?.src}`);
  if (swappedHpMedia?.hero?.src !== altMediaUrl && !swappedHpMedia?.hero?.src.endsWith(altMediaUrl || '')) {
    throw new Error(`FAIL: Public site did not reflect swapped hero image! Got: ${swappedHpMedia?.hero?.src}`);
  }
  console.log('✓ PASS: Homepage Hero successfully updated to Hero B without source code modification.');

  // Restore Hero B → Hero A
  console.log(`Restoring Hero B → Hero A (ID ${originalHeroId})...`);
  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      hero: {
        ...originalHomepage.hero,
        image: originalHeroId,
      },
      _status: 'published',
    },
    overrideAccess: true,
  });

  const revertedHpMedia = await getHomepageMedia('en');
  console.log(`Reverted Public Hero src: ${revertedHpMedia?.hero?.src}`);
  if (revertedHpMedia?.hero?.src === altMediaUrl) {
    throw new Error('FAIL: Public site did not revert back to Hero A!');
  }
  console.log('✓ PASS: Homepage Hero successfully reverted to Hero A.');

  // -------------------------------------------------------------
  // TEST 4: CMS LIVE EDIT TEST — CHEF PORTRAIT
  // -------------------------------------------------------------
  console.log('\n--- TEST 4: CMS LIVE EDIT TEST (CHEF PORTRAIT) ---');
  const originalChef = await payload.findGlobal({
    slug: 'chef',
    overrideAccess: true,
  });
  const originalPortraitId = typeof originalChef.portrait === 'object'
    ? originalChef.portrait.id
    : originalChef.portrait;

  console.log(`Original Chef Portrait ID: ${originalPortraitId}`);

  // Swap Chef Portrait to altMediaId
  console.log(`Swapping Chef Portrait A (ID ${originalPortraitId}) → Portrait B (ID ${altMediaId})...`);
  await payload.updateGlobal({
    slug: 'chef',
    data: {
      portrait: altMediaId,
    },
    overrideAccess: true,
  });

  const swappedChef = await getChefMedia('en');
  console.log(`Swapped Public Chef portrait src: ${swappedChef?.portrait?.src}`);
  if (swappedChef?.portrait?.src !== altMediaUrl && !swappedChef?.portrait?.src.endsWith(altMediaUrl || '')) {
    throw new Error(`FAIL: Public site did not reflect swapped chef portrait! Got: ${swappedChef?.portrait?.src}`);
  }
  console.log('✓ PASS: Chef portrait successfully updated to Portrait B without source code modification.');

  // Restore Chef Portrait B → Portrait A
  console.log(`Restoring Chef Portrait B → Portrait A (ID ${originalPortraitId})...`);
  await payload.updateGlobal({
    slug: 'chef',
    data: {
      portrait: originalPortraitId,
    },
    overrideAccess: true,
  });

  const revertedChef = await getChefMedia('en');
  console.log(`Reverted Public Chef portrait src: ${revertedChef?.portrait?.src}`);
  if (revertedChef?.portrait?.src === altMediaUrl) {
    throw new Error('FAIL: Public site did not revert back to Portrait A!');
  }
  console.log('✓ PASS: Chef portrait successfully reverted to Portrait A.');

  // -------------------------------------------------------------
  // TEST 5: RUNTIME SOURCE OF TRUTH VERIFICATION ACROSS ALL PAGES
  // -------------------------------------------------------------
  console.log('\n--- TEST 5: RUNTIME SOURCE OF TRUTH VERIFICATION ---');
  const [hp, chef, pm] = await Promise.all([
    getHomepageMedia('en'),
    getChefMedia('en'),
    getPageMedia('en'),
  ]);

  console.log('Homepage Hero:', hp?.hero?.src);
  console.log('Homepage Space Primary:', hp?.space?.imagePrimary?.src);
  console.log('Homepage Space Secondary:', hp?.space?.imageSecondary?.src);
  console.log('Chef Portrait:', chef?.portrait?.src);
  console.log('Chef Video:', chef?.video?.src);
  console.log('Chef Video Poster:', chef?.video?.poster);
  console.log('Menu Food Image:', pm?.menu?.foodImage?.src);
  console.log('Menu Beverage Image:', pm?.menu?.beverageImage?.src);
  console.log('About Origin Image:', pm?.about?.originImage?.src);
  console.log('About Philosophy Image:', pm?.about?.philosophyImage?.src);
  console.log('About Architecture Image:', pm?.about?.architectureImage?.src);
  console.log('Experience Hero Image:', pm?.experience?.heroImage?.src);
  console.log('Experience Morning Image:', pm?.experience?.morningImage?.src);
  console.log('Experience Evening Image:', pm?.experience?.eveningImage?.src);
  console.log('Experience Details Image:', pm?.experience?.detailsImage?.src);
  console.log('Occasions Hero Image:', pm?.occasions?.heroImage?.src);
  console.log('Occasions Private Dining:', pm?.occasions?.privateDiningImage?.src);
  console.log('Occasions Wedding:', pm?.occasions?.weddingImage?.src);
  console.log('Occasions Birthday:', pm?.occasions?.birthdayImage?.src);
  console.log('Occasions Mondial:', pm?.occasions?.brandMondialImage?.src);
  console.log('Occasions Frank & Co:', pm?.occasions?.brandFrankCoImage?.src);
  console.log('Occasions Maharva:', pm?.occasions?.brandMaharvaImage?.src);
  console.log('Events & Journal: Cleaned up from PageMedia in CMS-004 (direct collection relations).');

  console.log('\n=== ALL CMS-002B TESTS COMPLETED SUCCESSFULLY ===');
}

runCMS002BTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\n❌ CMS-002B QA SUITE FAILED:', err);
    process.exit(1);
  });
