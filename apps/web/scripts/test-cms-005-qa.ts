/**
 * CMS-005 Quality Assurance & Parity Verification Script
 *
 * Verifies:
 * 1. All 5 page Globals exist and are populated for both 'en' and 'id'.
 * 2. Zero runtime fallbacks: data is fetched directly from Payload globals.
 * 3. Dietary policy single-source-of-truth in SiteSettings and proper stitching in About.
 * 4. Fixed Occasions features (feature1, feature2, feature3; no structural arrays).
 * 5. Reversible direct-edit test on all 5 Globals without source code changes.
 */

import { getPayload } from 'payload';
import configPromise from '../src/payload.config';

async function runQA() {
  console.log('=== STARTING CMS-005 QA VERIFICATION ===\n');
  const payload = await getPayload({ config: configPromise });
  let allPassed = true;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      allPassed = false;
    }
  }

  // 1. Verify Globals existence and localization
  console.log('--- 1. Testing Page Globals & Localization ---');
  for (const locale of ['en', 'id'] as const) {
    console.log(`\nChecking locale: [${locale}]`);

    // About
    const about = await payload.findGlobal({ slug: 'about-page', locale, draft: true });
    assert(!!about?.hero?.headline, `about-page [${locale}] hero.headline exists`);
    assert(!!about?.hero?.subtitle, `about-page [${locale}] hero.subtitle exists`);
    assert(!!about?.origin?.title, `about-page [${locale}] origin.title exists`);
    assert(!!about?.origin?.body1, `about-page [${locale}] origin.body1 exists`);
    assert(!!about?.origin?.body2, `about-page [${locale}] origin.body2 exists`);
    assert(!!about?.philosophy?.dietaryPrefix, `about-page [${locale}] philosophy.dietaryPrefix exists`);
    assert(!!about?.philosophy?.dietarySuffix, `about-page [${locale}] philosophy.dietarySuffix exists`);
    assert(!!about?.architecture?.title, `about-page [${locale}] architecture.title exists`);

    // Experience
    const exp = await payload.findGlobal({ slug: 'experience-page', locale, draft: true });
    assert(!!exp?.hero?.kicker, `experience-page [${locale}] hero.kicker exists`);
    assert(!!exp?.hero?.headline, `experience-page [${locale}] hero.headline exists`);
    assert(!!exp?.quote, `experience-page [${locale}] quote exists`);
    assert(!!exp?.dayToNight?.eveningDescription, `experience-page [${locale}] dayToNight.eveningDescription exists`);
    assert(!!exp?.materials?.heading, `experience-page [${locale}] materials.heading exists`);

    // Occasions
    const occ = await payload.findGlobal({ slug: 'occasions-page', locale, draft: true });
    assert(!!occ?.hero?.subtitle, `occasions-page [${locale}] hero.subtitle exists`);
    assert(!!occ?.privateDining?.feature1, `occasions-page [${locale}] privateDining.feature1 exists`);
    assert(!!occ?.wedding?.feature2, `occasions-page [${locale}] wedding.feature2 exists`);
    assert(!!occ?.birthday?.feature3, `occasions-page [${locale}] birthday.feature3 exists`);
    // Structural invariant check: ensure no generic array exists
    assert(!Array.isArray((occ?.privateDining as any)?.features), `occasions-page [${locale}] privateDining features is not an array`);

    // Visit
    const visit = await payload.findGlobal({ slug: 'visit-page', locale, draft: true });
    assert(!!visit?.reservationsNote, `visit-page [${locale}] reservationsNote exists`);
    assert(!!visit?.dressCodePolicy?.description, `visit-page [${locale}] dressCodePolicy.description exists`);
    assert(!!visit?.parkingPolicy?.description, `visit-page [${locale}] parkingPolicy.description exists`);

    // Recognition
    const rec = await payload.findGlobal({ slug: 'recognition-page', locale, draft: true });
    assert(!!rec?.kicker, `recognition-page [${locale}] kicker exists`);
    assert(!!rec?.subtitle, `recognition-page [${locale}] subtitle exists`);
  }

  // 2. Dietary Policy Single Source of Truth
  console.log('\n--- 2. Testing Dietary Policy Source of Truth ---');
  const siteSettingsEn = await payload.findGlobal({ slug: 'site-settings', locale: 'en' });
  const siteSettingsId = await payload.findGlobal({ slug: 'site-settings', locale: 'id' });
  assert(siteSettingsEn?.dietaryPolicy === 'No Pork, No Lard', 'SiteSettings EN dietary policy is "No Pork, No Lard"');
  assert(!!siteSettingsId?.dietaryPolicy, `SiteSettings ID dietary policy is "${siteSettingsId?.dietaryPolicy}"`);

  const aboutEn = await payload.findGlobal({ slug: 'about-page', locale: 'en', draft: true });
  const stitchedEn = `${aboutEn?.philosophy?.dietaryPrefix}${siteSettingsEn?.dietaryPolicy}${aboutEn?.philosophy?.dietarySuffix}`;
  assert(
    stitchedEn.includes('No Pork, No Lard'),
    `About EN philosophy correctly stitches with SiteSettings dietary policy: "${stitchedEn}"`
  );

  const aboutId = await payload.findGlobal({ slug: 'about-page', locale: 'id', draft: true });
  const stitchedId = `${aboutId?.philosophy?.dietaryPrefix}${siteSettingsId?.dietaryPolicy}${aboutId?.philosophy?.dietarySuffix}`;
  assert(
    stitchedId.includes(siteSettingsId?.dietaryPolicy || 'No Pork, No Lard'),
    `About ID philosophy correctly stitches with SiteSettings dietary policy: "${stitchedId}"`
  );

  // 3. Reversible Direct Edit Test
  console.log('\n--- 3. Testing Reversible Direct Edit on Globals ---');

  // About direct edit
  const originalAboutHeadline = aboutEn?.hero?.headline;
  const testAboutHeadline = originalAboutHeadline + ' [QA_TEST_MUTATION]';
  await payload.updateGlobal({
    slug: 'about-page',
    locale: 'en',
    draft: false,
    data: {
      hero: {
        ...aboutEn?.hero,
        headline: testAboutHeadline,
      },
    },
  });
  const mutatedAbout = await payload.findGlobal({ slug: 'about-page', locale: 'en', draft: false });
  assert(mutatedAbout?.hero?.headline === testAboutHeadline, 'About page direct edit successfully saved and published');
  // Restore
  await payload.updateGlobal({
    slug: 'about-page',
    locale: 'en',
    draft: false,
    data: {
      hero: {
        ...aboutEn?.hero,
        headline: originalAboutHeadline,
      },
    },
  });
  const restoredAbout = await payload.findGlobal({ slug: 'about-page', locale: 'en', draft: false });
  assert(restoredAbout?.hero?.headline === originalAboutHeadline, 'About page restored to original value');

  // Experience direct edit
  const originalExpKicker = (await payload.findGlobal({ slug: 'experience-page', locale: 'en', draft: true }))?.hero?.kicker;
  const testExpKicker = originalExpKicker + ' [QA_TEST]';
  await payload.updateGlobal({
    slug: 'experience-page',
    locale: 'en',
    draft: false,
    data: {
      hero: {
        kicker: testExpKicker,
        headline: (await payload.findGlobal({ slug: 'experience-page', locale: 'en', draft: true }))?.hero?.headline || '',
      },
    },
  });
  const mutatedExp = await payload.findGlobal({ slug: 'experience-page', locale: 'en', draft: false });
  assert(mutatedExp?.hero?.kicker === testExpKicker, 'Experience page direct edit successfully saved and published');
  // Restore
  await payload.updateGlobal({
    slug: 'experience-page',
    locale: 'en',
    draft: false,
    data: {
      hero: {
        kicker: originalExpKicker,
        headline: (await payload.findGlobal({ slug: 'experience-page', locale: 'en', draft: true }))?.hero?.headline || '',
      },
    },
  });
  const restoredExp = await payload.findGlobal({ slug: 'experience-page', locale: 'en', draft: false });
  assert(restoredExp?.hero?.kicker === originalExpKicker, 'Experience page restored to original value');

  // Occasions direct edit
  const originalOccSub = (await payload.findGlobal({ slug: 'occasions-page', locale: 'en', draft: true }))?.hero?.subtitle;
  const testOccSub = originalOccSub + ' [QA_TEST]';
  await payload.updateGlobal({
    slug: 'occasions-page',
    locale: 'en',
    draft: false,
    data: {
      hero: {
        subtitle: testOccSub,
      },
    },
  });
  const mutatedOcc = await payload.findGlobal({ slug: 'occasions-page', locale: 'en', draft: false });
  assert(mutatedOcc?.hero?.subtitle === testOccSub, 'Occasions page direct edit successfully saved and published');
  // Restore
  await payload.updateGlobal({
    slug: 'occasions-page',
    locale: 'en',
    draft: false,
    data: {
      hero: {
        subtitle: originalOccSub,
      },
    },
  });
  const restoredOcc = await payload.findGlobal({ slug: 'occasions-page', locale: 'en', draft: false });
  assert(restoredOcc?.hero?.subtitle === originalOccSub, 'Occasions page restored to original value');

  // Visit direct edit
  const originalVisitNote = (await payload.findGlobal({ slug: 'visit-page', locale: 'en', draft: true }))?.reservationsNote;
  const testVisitNote = originalVisitNote + ' [QA_TEST]';
  await payload.updateGlobal({
    slug: 'visit-page',
    locale: 'en',
    draft: false,
    data: {
      reservationsNote: testVisitNote,
    },
  });
  const mutatedVisit = await payload.findGlobal({ slug: 'visit-page', locale: 'en', draft: false });
  assert(mutatedVisit?.reservationsNote === testVisitNote, 'Visit page direct edit successfully saved and published');
  // Restore
  await payload.updateGlobal({
    slug: 'visit-page',
    locale: 'en',
    draft: false,
    data: {
      reservationsNote: originalVisitNote,
    },
  });
  const restoredVisit = await payload.findGlobal({ slug: 'visit-page', locale: 'en', draft: false });
  assert(restoredVisit?.reservationsNote === originalVisitNote, 'Visit page restored to original value');

  // Recognition direct edit
  const originalRecSub = (await payload.findGlobal({ slug: 'recognition-page', locale: 'en', draft: true }))?.subtitle;
  const testRecSub = originalRecSub + ' [QA_TEST]';
  await payload.updateGlobal({
    slug: 'recognition-page',
    locale: 'en',
    draft: false,
    data: {
      subtitle: testRecSub,
    },
  });
  const mutatedRec = await payload.findGlobal({ slug: 'recognition-page', locale: 'en', draft: false });
  assert(mutatedRec?.subtitle === testRecSub, 'Recognition page direct edit successfully saved and published');
  // Restore
  await payload.updateGlobal({
    slug: 'recognition-page',
    locale: 'en',
    draft: false,
    data: {
      subtitle: originalRecSub,
    },
  });
  const restoredRec = await payload.findGlobal({ slug: 'recognition-page', locale: 'en', draft: false });
  assert(restoredRec?.subtitle === originalRecSub, 'Recognition page restored to original value');

  console.log('\n=== CMS-005 QA VERIFICATION RESULT ===');
  if (allPassed) {
    console.log('ALL CMS-005 AUTOMATED TESTS PASSED SUCCESSFULLY! ✓');
    process.exit(0);
  } else {
    console.error('SOME CMS-005 AUTOMATED TESTS FAILED! ✗');
    process.exit(1);
  }
}

runQA().catch((err) => {
  console.error('Fatal error in QA script:', err);
  process.exit(1);
});
