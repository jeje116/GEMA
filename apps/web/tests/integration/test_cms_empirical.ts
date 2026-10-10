import { getPayload } from 'payload';
import config from '../../src/payload.config';
import { getPageMedia, getExperiencePageData } from '../../src/content/provider';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

function assertSafeTestDatabase() {
  if (process.env.TEST_DATABASE_URI) {
    process.env.DATABASE_URI = process.env.TEST_DATABASE_URI;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('SAFETY GUARD: CMS mutating tests cannot run when NODE_ENV is "production"!');
  }

  if (process.env.ALLOW_CMS_MUTATING_TESTS !== 'true') {
    throw new Error(
      'SAFETY GUARD: CMS mutating tests are blocked by default to prevent accidental data modification.\n' +
      'To execute against an explicitly designated disposable test database, set ALLOW_CMS_MUTATING_TESTS=true.'
    );
  }

  const dbUri = process.env.DATABASE_URI || '';
  if (!dbUri) {
    throw new Error('SAFETY GUARD: DATABASE_URI is not defined.');
  }

  let parsed: URL;
  try {
    parsed = new URL(dbUri);
  } catch (err: any) {
    throw new Error(`SAFETY GUARD: Invalid DATABASE_URI format: ${err.message}`);
  }

  const hostname = parsed.hostname.toLowerCase();
  const dbName = parsed.pathname.replace(/^\//, '').toLowerCase();

  // 1. Production host / domain / DB name protection
  const isProdHost =
    hostname === '194.163.40.10' ||
    hostname.includes('gemagroup.id') ||
    hostname.includes('supabase.co') ||
    hostname.includes('neon.tech') ||
    hostname.includes('rds.amazonaws.com') ||
    dbName.includes('prod') ||
    dbName.includes('production');

  if (isProdHost) {
    throw new Error('SAFETY GUARD: CMS test blocked! DATABASE_URI targets a remote or production database.');
  }

  // 2. Hostname restriction: Must be local
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
  if (!isLocal) {
    throw new Error(`SAFETY GUARD: CMS test blocked! DATABASE_URI host "${hostname}" is non-local.`);
  }

  // 3. Database Identity Isolation: Prevent execution against normal development database
  const isNormalDevDb = dbName === 'gema_payload' || dbName === 'postgres' || dbName === '';
  if (isNormalDevDb) {
    throw new Error(
      `SAFETY GUARD: CMS test blocked! Target database is "${dbName}".\n` +
      'Mutating tests MUST NOT run against the normal development database ("gema_payload").\n' +
      'A dedicated disposable test database (e.g. "gema_test" or "payload_test") is required.\n' +
      'Provide TEST_DATABASE_URI="postgresql://.../gema_test".'
    );
  }

  // 4. Positive Identification: Require dedicated test database naming pattern
  const isTestDb = /(?:^test_|_test$|^.*_test_.*$|disposable)/.test(dbName);
  if (!isTestDb) {
    throw new Error(
      `SAFETY GUARD: Database "${dbName}" is not positively identified as a disposable test database.\n` +
      'Database name must contain "_test" or "disposable" (e.g., "gema_test", "disposable_cms").'
    );
  }

  // 5. Port-forwarding / proxy safeguard: Explicit confirmation of disposable DB identity
  if (process.env.CONFIRM_DISPOSABLE_DB !== 'true' && !process.env.TEST_DATABASE_URI) {
    throw new Error(
      'SAFETY GUARD: To protect against local port forwarding (e.g., SSH tunnels to remote DBs),\n' +
      'state-mutating tests require explicit declaration of a test database via TEST_DATABASE_URI\n' +
      'or setting CONFIRM_DISPOSABLE_DB=true.'
    );
  }
}

async function runEmpiricalCMSTest() {
  assertSafeTestDatabase();

  console.log('====================================================');
  console.log('  GEMA-018E THE CRAFT EMPIRICAL CMS LIFECYCLE TEST  ');
  console.log('====================================================\n');

  const payload = await getPayload({ config });
  const results: Record<string, any> = {};

  // Helper to fetch live rendered HTML from localhost frontend
  async function fetchFrontendCraft(): Promise<{ heading: string; intro: string; body: string; imgSrc: string; imgAlt: string }> {
    const res = await fetch(`${BASE_URL}/en/experience`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Frontend HTTP error: ${res.status}`);
    const html = await res.text();

    // Parse The Craft section specifically from HTML
    const craftSectionHtml = html.split('bg-[var(--ink)]')[1]?.split('</section>')[0] || '';

    const headingMatch = craftSectionHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
    const introMatch = craftSectionHtml.match(/<p[^>]*class="[^"]*italic[^"]*"[^>]*>([\s\S]*?)<\/p>/);
    const bodyMatch = craftSectionHtml.match(/<p[^>]*class="[^"]*text-\[var\(--ivory-200\)\][^"]*"[^>]*>([\s\S]*?)<\/p>/);
    const craftImgSrc = craftSectionHtml.match(/src="([^"]+)"/)?.[1] || '';
    const craftImgAlt = craftSectionHtml.match(/alt="([^"]+)"/)?.[1] || '';

    return {
      heading: headingMatch ? headingMatch[1].replace(/<[^>]+>/g, '').trim() : '',
      intro: introMatch ? introMatch[1].replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '').trim() : '',
      body: bodyMatch ? bodyMatch[1].replace(/<[^>]+>/g, '').trim() : '',
      imgSrc: craftImgSrc,
      imgAlt: craftImgAlt,
    };
  }

  // -------------------------------------------------------------
  // TEST 1: CMS HEADING LIFECYCLE
  // -------------------------------------------------------------
  console.log('--- TEST 1: CMS HEADING EDITABILITY & PERSISTENCE ---');
  const initialExp = await payload.findGlobal({ slug: 'experience-page', locale: 'en' });
  const initialHeading = initialExp.craft?.heading || 'The Craft';
  console.log(`1. Approved Initial Heading: "${initialHeading}"`);

  // Modify
  const tempHeading = 'The Craft (Artisanal Kitchen)';
  await payload.updateGlobal({
    slug: 'experience-page',
    locale: 'en',
    data: {
      ...initialExp,
      craft: {
        ...initialExp.craft,
        heading: tempHeading,
      },
      _status: 'published',
    },
    overrideAccess: true,
  });

  // Verify persistence after reload
  const reloadedHeadingDoc = await payload.findGlobal({ slug: 'experience-page', locale: 'en' });
  const persistedHeading = reloadedHeadingDoc.craft?.heading;
  console.log(`2. Modified Value Persisted in CMS: "${persistedHeading}"`);

  // Verify frontend reflection
  const frontendHeadingCheck = await fetchFrontendCraft();
  console.log(`3. Frontend Reflected Modified Heading: "${frontendHeadingCheck.heading}"`);

  // Restore
  await payload.updateGlobal({
    slug: 'experience-page',
    locale: 'en',
    data: {
      ...initialExp,
      craft: {
        ...initialExp.craft,
        heading: initialHeading,
      },
      _status: 'published',
    },
    overrideAccess: true,
  });

  const restoredHeadingDoc = await payload.findGlobal({ slug: 'experience-page', locale: 'en' });
  const restoredHeading = restoredHeadingDoc.craft?.heading;
  const frontendRestoredHeading = (await fetchFrontendCraft()).heading;
  console.log(`4. Restored in CMS: "${restoredHeading}", Restored on Frontend: "${frontendRestoredHeading}"`);

  results.heading = {
    editable: persistedHeading === tempHeading,
    persisted: persistedHeading === tempHeading,
    frontendReflected: frontendHeadingCheck.heading === tempHeading,
    restored: restoredHeading === initialHeading && frontendRestoredHeading === initialHeading,
  };

  // -------------------------------------------------------------
  // TEST 2: CMS INTRODUCTION LIFECYCLE
  // -------------------------------------------------------------
  console.log('\n--- TEST 2: CMS INTRODUCTION EDITABILITY & PERSISTENCE ---');
  const initialIntro = initialExp.craft?.intro || 'Behind every plate is a rhythm\nof preparation and precision.';
  console.log(`1. Approved Initial Intro: "${initialIntro.replace(/\n/g, ' ')}"`);

  const tempIntro = 'Behind every plate is a rhythm of passion, preparation, and precision.';
  await payload.updateGlobal({
    slug: 'experience-page',
    locale: 'en',
    data: {
      ...initialExp,
      craft: {
        ...initialExp.craft,
        intro: tempIntro,
      },
      _status: 'published',
    },
    overrideAccess: true,
  });

  const reloadedIntroDoc = await payload.findGlobal({ slug: 'experience-page', locale: 'en' });
  const persistedIntro = reloadedIntroDoc.craft?.intro;
  console.log(`2. Modified Intro Persisted in CMS: "${persistedIntro}"`);

  const frontendIntroCheck = await fetchFrontendCraft();
  console.log(`3. Frontend Reflected Modified Intro: "${frontendIntroCheck.intro}"`);

  // Restore
  await payload.updateGlobal({
    slug: 'experience-page',
    locale: 'en',
    data: {
      ...initialExp,
      craft: {
        ...initialExp.craft,
        intro: initialIntro,
      },
      _status: 'published',
    },
    overrideAccess: true,
  });

  const restoredIntro = (await payload.findGlobal({ slug: 'experience-page', locale: 'en' })).craft?.intro;
  const frontendRestoredIntro = (await fetchFrontendCraft()).intro;
  console.log(`4. Restored in CMS: "${restoredIntro?.replace(/\n/g, ' ')}", Frontend: "${frontendRestoredIntro.replace(/\n/g, ' ')}"`);

  results.intro = {
    editable: persistedIntro === tempIntro,
    persisted: persistedIntro === tempIntro,
    frontendReflected: frontendIntroCheck.intro.includes('passion'),
    restored: restoredIntro === initialIntro,
  };

  // -------------------------------------------------------------
  // TEST 3: CMS BODY LIFECYCLE
  // -------------------------------------------------------------
  console.log('\n--- TEST 3: CMS BODY EDITABILITY & PERSISTENCE ---');
  const initialBody = initialExp.craft?.body || '';
  console.log(`1. Approved Initial Body: "${initialBody.substring(0, 60)}..."`);

  const tempBody = 'The culinary craft at GEMA transforms seasonal ingredients into exquisite dining experiences.';
  await payload.updateGlobal({
    slug: 'experience-page',
    locale: 'en',
    data: {
      ...initialExp,
      craft: {
        ...initialExp.craft,
        body: tempBody,
      },
      _status: 'published',
    },
    overrideAccess: true,
  });

  const reloadedBody = (await payload.findGlobal({ slug: 'experience-page', locale: 'en' })).craft?.body;
  console.log(`2. Modified Body Persisted in CMS: "${reloadedBody}"`);

  const frontendBodyCheck = await fetchFrontendCraft();
  console.log(`3. Frontend Reflected Modified Body: "${frontendBodyCheck.body}"`);

  // Restore
  await payload.updateGlobal({
    slug: 'experience-page',
    locale: 'en',
    data: {
      ...initialExp,
      craft: {
        ...initialExp.craft,
        body: initialBody,
      },
      _status: 'published',
    },
    overrideAccess: true,
  });

  const restoredBody = (await payload.findGlobal({ slug: 'experience-page', locale: 'en' })).craft?.body;
  const frontendRestoredBody = (await fetchFrontendCraft()).body;
  console.log(`4. Restored in CMS: "${restoredBody?.substring(0, 40)}...", Frontend: "${frontendRestoredBody.substring(0, 40)}..."`);

  results.body = {
    editable: reloadedBody === tempBody,
    persisted: reloadedBody === tempBody,
    frontendReflected: frontendBodyCheck.body === tempBody,
    restored: restoredBody === initialBody && frontendRestoredBody === initialBody,
  };

  // -------------------------------------------------------------
  // TEST 4: CMS PHOTO SELECTION LIFECYCLE
  // -------------------------------------------------------------
  console.log('\n--- TEST 4: CMS PHOTO SELECTION EDITABILITY & PERSISTENCE ---');
  const initialPm = await payload.findGlobal({ slug: 'page-media', depth: 1 });
  const initialPhotoId = (initialPm.experience?.craftImage as any)?.id;
  const initialPhotoSrc = (initialPm.experience?.craftImage as any)?.url;
  console.log(`1. Approved Initial Photo in CMS: ID ${initialPhotoId} (${initialPhotoSrc})`);

  // Fetch another existing Media record to test selection change (Media ID 18: experience-hero.jpg)
  const altMedia = await payload.findByID({ collection: 'media', id: 18 });
  console.log(`   Switching craftImage to Media ID 18 (${altMedia.filename})...`);

  await payload.updateGlobal({
    slug: 'page-media',
    data: {
      ...initialPm,
      experience: {
        ...initialPm.experience,
        craftImage: 18,
      },
    },
    overrideAccess: true,
  });

  const reloadedPm = await payload.findGlobal({ slug: 'page-media', depth: 1 });
  const persistedPhotoId = (reloadedPm.experience?.craftImage as any)?.id;
  const persistedPhotoFilename = (reloadedPm.experience?.craftImage as any)?.filename;
  console.log(`2. Modified Photo Persisted in CMS: ID ${persistedPhotoId} (${persistedPhotoFilename})`);

  const frontendPhotoCheck = await fetchFrontendCraft();
  console.log(`3. Frontend Reflected Modified Photo URL: "${frontendPhotoCheck.imgSrc}"`);

  // Restore Photo B (ID 43)
  await payload.updateGlobal({
    slug: 'page-media',
    data: {
      ...initialPm,
      experience: {
        ...initialPm.experience,
        craftImage: initialPhotoId,
      },
    },
    overrideAccess: true,
  });

  const restoredPm = await payload.findGlobal({ slug: 'page-media', depth: 1 });
  const restoredPhotoId = (restoredPm.experience?.craftImage as any)?.id;
  const restoredPhotoFilename = (restoredPm.experience?.craftImage as any)?.filename;
  const frontendRestoredPhoto = (await fetchFrontendCraft()).imgSrc;
  console.log(`4. Restored in CMS: ID ${restoredPhotoId} (${restoredPhotoFilename}), Frontend: "${frontendRestoredPhoto}"`);

  results.photo = {
    editable: persistedPhotoId === 18,
    persisted: persistedPhotoId === 18,
    frontendReflected: frontendPhotoCheck.imgSrc.includes('experience-hero.jpg'),
    restored: restoredPhotoId === initialPhotoId && frontendRestoredPhoto.includes('experience-the-craft-chef-plating.webp'),
    isCmsSource: frontendRestoredPhoto.startsWith('/api/media/file/'),
  };

  // -------------------------------------------------------------
  // TEST 5: CMS IMAGE ALT TEXT LIFECYCLE
  // -------------------------------------------------------------
  console.log('\n--- TEST 5: CMS IMAGE ALT TEXT EDITABILITY & PERSISTENCE ---');
  const mediaPhotoB = await payload.findByID({ collection: 'media', id: initialPhotoId, locale: 'en' });
  const initialAlt = mediaPhotoB.alt || 'Chef plating a dish at GEMA';
  console.log(`1. Approved Initial Alt: "${initialAlt}"`);

  const tempAlt = 'Master chef finishing pasta plating at GEMA pass';
  await payload.update({
    collection: 'media',
    id: initialPhotoId,
    locale: 'en',
    data: {
      alt: tempAlt,
    },
    overrideAccess: true,
  });

  const reloadedAlt = (await payload.findByID({ collection: 'media', id: initialPhotoId, locale: 'en' })).alt;
  console.log(`2. Modified Alt Persisted in CMS: "${reloadedAlt}"`);

  const frontendAltCheck = await fetchFrontendCraft();
  console.log(`3. Frontend Reflected Modified Alt: "${frontendAltCheck.imgAlt}"`);

  // Restore
  await payload.update({
    collection: 'media',
    id: initialPhotoId,
    locale: 'en',
    data: {
      alt: initialAlt,
    },
    overrideAccess: true,
  });

  const restoredAlt = (await payload.findByID({ collection: 'media', id: initialPhotoId, locale: 'en' })).alt;
  const frontendRestoredAlt = (await fetchFrontendCraft()).imgAlt;
  console.log(`4. Restored in CMS: "${restoredAlt}", Frontend: "${frontendRestoredAlt}"`);

  results.alt = {
    editable: reloadedAlt === tempAlt,
    persisted: reloadedAlt === tempAlt,
    frontendReflected: frontendAltCheck.imgAlt === tempAlt,
    restored: restoredAlt === initialAlt && frontendRestoredAlt === initialAlt,
  };

  console.log('\n====================================================');
  console.log('       SUMMARY OF EMPIRICAL CMS LIFECYCLE QA        ');
  console.log('====================================================');
  console.log(JSON.stringify(results, null, 2));

  const allPassed =
    results.heading.editable && results.heading.restored &&
    results.intro.editable && results.intro.restored &&
    results.body.editable && results.body.restored &&
    results.photo.editable && results.photo.restored && results.photo.isCmsSource &&
    results.alt.editable && results.alt.restored;

  if (!allPassed) {
    throw new Error('FAIL: One or more CMS lifecycle checks failed!');
  }

  console.log('\n✓ ALL 5 THE CRAFT CMS LIFECYCLE TESTS PASSED EMPIRICALLY!');
  process.exit(0);
}

runEmpiricalCMSTest().catch((err) => {
  console.error('\n❌ CMS LIFECYCLE TEST FAILED:', err);
  process.exit(1);
});
