import { getPayload } from 'payload';
import config from '../../src/payload.config';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import path from 'path';

function loadPlaywright() {
  try {
    return require('playwright');
  } catch {
    const candidates = [
      process.env.PLAYWRIGHT_PATH,
      path.resolve(process.env.HOME || '', 'scratch_playwright/node_modules/playwright'),
      path.resolve(process.cwd(), 'node_modules/playwright'),
    ].filter((p): p is string => Boolean(p));

    for (const candidate of candidates) {
      try {
        return require(candidate);
      } catch {}
    }
    throw new Error(
      'Playwright could not be loaded. Ensure playwright is installed or set PLAYWRIGHT_PATH.'
    );
  }
}

const { chromium } = loadPlaywright();
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

async function testFullCmsCycle() {
  assertSafeTestDatabase();

  console.log('====================================================');
  console.log('   FULL EMPIRICAL CMS-TO-BROWSER VERIFICATION       ');
  console.log('====================================================\n');

  const payload = await getPayload({ config });
  const browser = await chromium.launch();

  async function getBrowserValues() {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE_URL}/en/experience`, { waitUntil: 'networkidle' });
    try {
      const btn = page.locator('button[aria-label="Enter GEMA website"]');
      if (await btn.isVisible({ timeout: 1000 })) {
        await btn.click();
        await page.waitForTimeout(1000);
      }
    } catch (e) {}

    const craftSection = page.locator('section:has-text("The Craft")');
    await craftSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);

    const heading = await craftSection.locator('h2').textContent();
    const intro = await craftSection.locator('p.italic').textContent();
    const body = await craftSection.locator('p.text-\\[var\\(--ivory-200\\)\\]').textContent();
    const img = craftSection.locator('img');
    const src = await img.getAttribute('src');
    const alt = await img.getAttribute('alt');

    await page.close();
    return {
      heading: heading?.trim() || '',
      intro: intro?.trim() || '',
      body: body?.trim() || '',
      src: src || '',
      alt: alt || '',
    };
  }

  const results: Record<string, any> = {};

  // -----------------------------------------------------------------
  // 1. HEADING TEST
  // -----------------------------------------------------------------
  console.log('--- 1. CMS HEADING TEST ---');
  const expDoc = await payload.findGlobal({ slug: 'experience-page', locale: 'en' });
  const originalHeading = expDoc.craft?.heading || 'The Craft';
  console.log('Initial approved Heading in CMS:', originalHeading);

  const initialBrowser = await getBrowserValues();
  console.log('Initial Browser Heading:', initialBrowser.heading);

  // Modify
  const tempHeading = 'The Craft (Artisanal Kitchen)';
  await payload.updateGlobal({
    slug: 'experience-page',
    locale: 'en',
    data: {
      ...expDoc,
      craft: {
        ...expDoc.craft,
        heading: tempHeading,
      },
      _status: 'published',
    },
    overrideAccess: true,
  });

  // Reload CMS
  const reloadedExp1 = await payload.findGlobal({ slug: 'experience-page', locale: 'en' });
  const persistedHeading = reloadedExp1.craft?.heading;
  console.log('Persisted Heading in CMS:', persistedHeading);

  // Browser check
  const modifiedBrowser1 = await getBrowserValues();
  console.log('Modified Browser Heading:', modifiedBrowser1.heading);

  // Restore
  await payload.updateGlobal({
    slug: 'experience-page',
    locale: 'en',
    data: {
      ...expDoc,
      craft: {
        ...expDoc.craft,
        heading: originalHeading,
      },
      _status: 'published',
    },
    overrideAccess: true,
  });

  const restoredBrowser1 = await getBrowserValues();
  console.log('Restored Browser Heading:', restoredBrowser1.heading);

  results.heading = {
    cmsEditable: persistedHeading === tempHeading,
    persistedAfterReload: persistedHeading === tempHeading,
    browserReflected: modifiedBrowser1.heading === tempHeading,
    restoredInCms: (await payload.findGlobal({ slug: 'experience-page', locale: 'en' })).craft?.heading === originalHeading,
    restoredInBrowser: restoredBrowser1.heading === originalHeading,
  };

  // -----------------------------------------------------------------
  // 2. INTRODUCTION TEST
  // -----------------------------------------------------------------
  console.log('\n--- 2. CMS INTRODUCTION TEST ---');
  const originalIntro = expDoc.craft?.intro || 'Behind every plate is a rhythm\nof preparation and precision.';
  console.log('Initial approved Intro in CMS:', originalIntro.replace(/\n/g, ' '));

  const tempIntro = 'Behind every plate is a rhythm of passion, preparation, and precision.';
  await payload.updateGlobal({
    slug: 'experience-page',
    locale: 'en',
    data: {
      ...expDoc,
      craft: {
        ...expDoc.craft,
        intro: tempIntro,
      },
      _status: 'published',
    },
    overrideAccess: true,
  });

  const persistedIntro = (await payload.findGlobal({ slug: 'experience-page', locale: 'en' })).craft?.intro;
  console.log('Persisted Intro in CMS:', persistedIntro);

  const modifiedBrowser2 = await getBrowserValues();
  console.log('Modified Browser Intro:', modifiedBrowser2.intro);

  // Restore
  await payload.updateGlobal({
    slug: 'experience-page',
    locale: 'en',
    data: {
      ...expDoc,
      craft: {
        ...expDoc.craft,
        intro: originalIntro,
      },
      _status: 'published',
    },
    overrideAccess: true,
  });

  const restoredBrowser2 = await getBrowserValues();
  console.log('Restored Browser Intro:', restoredBrowser2.intro.replace(/\n/g, ' '));

  results.intro = {
    cmsEditable: persistedIntro === tempIntro,
    persistedAfterReload: persistedIntro === tempIntro,
    browserReflected: modifiedBrowser2.intro === tempIntro,
    restoredInCms: (await payload.findGlobal({ slug: 'experience-page', locale: 'en' })).craft?.intro === originalIntro,
    restoredInBrowser: restoredBrowser2.intro.replace(/\n/g, ' ') === originalIntro.replace(/\n/g, ' '),
  };

  // -----------------------------------------------------------------
  // 3. BODY TEST
  // -----------------------------------------------------------------
  console.log('\n--- 3. CMS BODY TEST ---');
  const originalBody = expDoc.craft?.body || '';
  console.log('Initial approved Body in CMS:', originalBody.substring(0, 50) + '...');

  const tempBody = 'The culinary craft at GEMA transforms seasonal ingredients into exquisite dining experiences.';
  await payload.updateGlobal({
    slug: 'experience-page',
    locale: 'en',
    data: {
      ...expDoc,
      craft: {
        ...expDoc.craft,
        body: tempBody,
      },
      _status: 'published',
    },
    overrideAccess: true,
  });

  const persistedBody = (await payload.findGlobal({ slug: 'experience-page', locale: 'en' })).craft?.body;
  console.log('Persisted Body in CMS:', persistedBody);

  const modifiedBrowser3 = await getBrowserValues();
  console.log('Modified Browser Body:', modifiedBrowser3.body);

  // Restore
  await payload.updateGlobal({
    slug: 'experience-page',
    locale: 'en',
    data: {
      ...expDoc,
      craft: {
        ...expDoc.craft,
        body: originalBody,
      },
      _status: 'published',
    },
    overrideAccess: true,
  });

  const restoredBrowser3 = await getBrowserValues();
  console.log('Restored Browser Body:', restoredBrowser3.body.substring(0, 50) + '...');

  results.body = {
    cmsEditable: persistedBody === tempBody,
    persistedAfterReload: persistedBody === tempBody,
    browserReflected: modifiedBrowser3.body === tempBody,
    restoredInCms: (await payload.findGlobal({ slug: 'experience-page', locale: 'en' })).craft?.body === originalBody,
    restoredInBrowser: restoredBrowser3.body === originalBody,
  };

  // -----------------------------------------------------------------
  // 4. PHOTO SELECTION TEST
  // -----------------------------------------------------------------
  console.log('\n--- 4. CMS PHOTO SELECTION TEST ---');
  const pmDoc = await payload.findGlobal({ slug: 'page-media', depth: 1 });
  const originalPhotoId = (pmDoc.experience?.craftImage as any)?.id;
  const originalPhotoFilename = (pmDoc.experience?.craftImage as any)?.filename;
  console.log(`Initial Photo in CMS: ID ${originalPhotoId} (${originalPhotoFilename})`);

  const initialBrowser4 = await getBrowserValues();
  console.log('Initial Browser Photo Src:', initialBrowser4.src);

  // Switch to different existing Media record (ID 18: experience-hero.jpg)
  await payload.updateGlobal({
    slug: 'page-media',
    data: {
      ...pmDoc,
      experience: {
        ...pmDoc.experience,
        craftImage: 18,
      },
    },
    overrideAccess: true,
  });

  const reloadedPm4 = await payload.findGlobal({ slug: 'page-media', depth: 1 });
  const persistedPhotoId = (reloadedPm4.experience?.craftImage as any)?.id;
  const persistedPhotoFilename = (reloadedPm4.experience?.craftImage as any)?.filename;
  console.log(`Persisted Photo in CMS: ID ${persistedPhotoId} (${persistedPhotoFilename})`);

  const modifiedBrowser4 = await getBrowserValues();
  console.log('Modified Browser Photo Src:', modifiedBrowser4.src);

  // Restore Photo B (ID 43)
  await payload.updateGlobal({
    slug: 'page-media',
    data: {
      ...pmDoc,
      experience: {
        ...pmDoc.experience,
        craftImage: originalPhotoId,
      },
    },
    overrideAccess: true,
  });

  const restoredBrowser4 = await getBrowserValues();
  console.log('Restored Browser Photo Src:', restoredBrowser4.src);

  results.photo = {
    cmsEditable: persistedPhotoId === 18,
    persistedAfterReload: persistedPhotoId === 18,
    browserReflected: modifiedBrowser4.src.includes('experience-hero.jpg'),
    restoredInCms: ((await payload.findGlobal({ slug: 'page-media', depth: 1 })).experience?.craftImage as any)?.id === originalPhotoId,
    restoredInBrowser: restoredBrowser4.src.includes('experience-the-craft-chef-plating.webp'),
    isCmsSource: restoredBrowser4.src.startsWith('/api/media/file/'),
  };

  // -----------------------------------------------------------------
  // 5. IMAGE ALT TEXT TEST
  // -----------------------------------------------------------------
  console.log('\n--- 5. CMS IMAGE ALT TEXT TEST ---');
  const mediaPhotoB = await payload.findByID({ collection: 'media', id: originalPhotoId, locale: 'en' });
  const originalAlt = mediaPhotoB.alt || 'Chef plating a dish at GEMA';
  console.log('Initial Alt in CMS:', originalAlt);

  const initialBrowser5 = await getBrowserValues();
  console.log('Initial Browser Alt:', initialBrowser5.alt);

  const tempAlt = 'Master chef finishing pasta plating at GEMA pass';
  await payload.update({
    collection: 'media',
    id: originalPhotoId,
    locale: 'en',
    data: {
      alt: tempAlt,
    },
    overrideAccess: true,
  });

  const persistedAlt = (await payload.findByID({ collection: 'media', id: originalPhotoId, locale: 'en' })).alt;
  console.log('Persisted Alt in CMS:', persistedAlt);

  const modifiedBrowser5 = await getBrowserValues();
  console.log('Modified Browser Alt:', modifiedBrowser5.alt);

  // Restore
  await payload.update({
    collection: 'media',
    id: originalPhotoId,
    locale: 'en',
    data: {
      alt: originalAlt,
    },
    overrideAccess: true,
  });

  const restoredBrowser5 = await getBrowserValues();
  console.log('Restored Browser Alt:', restoredBrowser5.alt);

  results.alt = {
    cmsEditable: persistedAlt === tempAlt,
    persistedAfterReload: persistedAlt === tempAlt,
    browserReflected: modifiedBrowser5.alt === tempAlt,
    restoredInCms: (await payload.findByID({ collection: 'media', id: originalPhotoId, locale: 'en' })).alt === originalAlt,
    restoredInBrowser: restoredBrowser5.alt === originalAlt,
  };

  await browser.close();

  console.log('\n====================================================');
  console.log('        SUMMARY OF CMS EMPIRICAL QA CHECKS          ');
  console.log('====================================================');
  console.log(JSON.stringify(results, null, 2));

  const allPass =
    results.heading.cmsEditable && results.heading.browserReflected && results.heading.restoredInBrowser &&
    results.intro.cmsEditable && results.intro.browserReflected && results.intro.restoredInBrowser &&
    results.body.cmsEditable && results.body.browserReflected && results.body.restoredInBrowser &&
    results.photo.cmsEditable && results.photo.browserReflected && results.photo.restoredInBrowser && results.photo.isCmsSource &&
    results.alt.cmsEditable && results.alt.browserReflected && results.alt.restoredInBrowser;

  if (!allPass) {
    throw new Error('FAIL: Not all checks passed!');
  }

  console.log('\n✓ ALL 5 THE CRAFT CMS FIELDS EMPIRICALLY VERIFIED IN REAL BROWSER!');
}

testFullCmsCycle().catch((err) => {
  console.error('\n❌ CMS FULL CYCLE TEST FAILED:', err);
  process.exit(1);
});
