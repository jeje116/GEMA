/**
 * CMS-007 Automated QA & Parity Test Suite
 *
 * Verifies:
 * 1. Media parity (Legacy 01..04 == Fixed item01..04)
 * 2. Reversible direct label edit on item01
 * 3. Reversible direct media edit on item01
 * 4. Independent EN vs ID localization
 * 5. Draft vs Published isolation
 * 6. CMS-006 Signature Dishes regression check
 */

import { getPayload } from 'payload';
import config from '../src/payload.config';
import { getHomepageData } from '../src/content/provider';

async function runQA() {
  console.log('==================================================');
  console.log('  CMS-007 AUTOMATED QA & PARITY TEST SUITE');
  console.log('==================================================\n');

  const payload = await getPayload({ config });

  // --- 1. MEDIA PARITY CHECK ---
  console.log('--- 1. MEDIA PARITY CHECK ---');
  const hp = await payload.findGlobal({ slug: 'homepage', overrideAccess: true, depth: 1 });
  const item01Img = typeof hp.cuisineTeaser?.item01?.image === 'object' ? hp.cuisineTeaser?.item01?.image?.id : hp.cuisineTeaser?.item01?.image;
  const item02Img = typeof hp.cuisineTeaser?.item02?.image === 'object' ? hp.cuisineTeaser?.item02?.image?.id : hp.cuisineTeaser?.item02?.image;
  const item03Img = typeof hp.cuisineTeaser?.item03?.image === 'object' ? hp.cuisineTeaser?.item03?.image?.id : hp.cuisineTeaser?.item03?.image;
  const item04Img = typeof hp.cuisineTeaser?.item04?.image === 'object' ? hp.cuisineTeaser?.item04?.image?.id : hp.cuisineTeaser?.item04?.image;

  console.log(`Legacy 01 expected: 2 | Fixed item01: ${item01Img} -> ${item01Img === 2 ? 'PASS' : 'FAIL'}`);
  console.log(`Legacy 02 expected: 3 | Fixed item02: ${item02Img} -> ${item02Img === 3 ? 'PASS' : 'FAIL'}`);
  console.log(`Legacy 03 expected: 4 | Fixed item03: ${item03Img} -> ${item03Img === 4 ? 'PASS' : 'FAIL'}`);
  console.log(`Legacy 04 expected: 5 | Fixed item04: ${item04Img} -> ${item04Img === 5 ? 'PASS' : 'FAIL'}`);

  if (item01Img !== 2 || item02Img !== 3 || item03Img !== 4 || item04Img !== 5) {
    throw new Error('Media parity check failed!');
  }

  // --- 2. LOCALIZATION CHECK (EN vs ID) ---
  console.log('\n--- 2. LOCALIZATION CHECK (EN vs ID) ---');
  const enData = await getHomepageData('en');
  const idData = await getHomepageData('id');

  console.log(`EN item01: "${enData?.cuisineTeaser?.item01?.label}" (expected: "Antipasti")`);
  console.log(`EN item02: "${enData?.cuisineTeaser?.item02?.label}" (expected: "Primi Piatti")`);
  console.log(`EN item03: "${enData?.cuisineTeaser?.item03?.label}" (expected: "Secondi & Grill")`);
  console.log(`EN item04: "${enData?.cuisineTeaser?.item04?.label}" (expected: "Dolci")`);

  console.log(`ID item01: "${idData?.cuisineTeaser?.item01?.label}" (expected: "Antipasti")`);
  console.log(`ID item02: "${idData?.cuisineTeaser?.item02?.label}" (expected: "Primi Piatti")`);
  console.log(`ID item03: "${idData?.cuisineTeaser?.item03?.label}" (expected: "Secondi & Panggang")`);
  console.log(`ID item04: "${idData?.cuisineTeaser?.item04?.label}" (expected: "Dolci")`);

  const locPass =
    enData?.cuisineTeaser?.item01?.label === 'Antipasti' &&
    enData?.cuisineTeaser?.item02?.label === 'Primi Piatti' &&
    enData?.cuisineTeaser?.item03?.label === 'Secondi & Grill' &&
    enData?.cuisineTeaser?.item04?.label === 'Dolci' &&
    idData?.cuisineTeaser?.item01?.label === 'Antipasti' &&
    idData?.cuisineTeaser?.item02?.label === 'Primi Piatti' &&
    idData?.cuisineTeaser?.item03?.label === 'Secondi & Panggang' &&
    idData?.cuisineTeaser?.item04?.label === 'Dolci';

  console.log(`Localization verification: [${locPass ? 'PASS' : 'FAIL'}]`);
  if (!locPass) throw new Error('Localization verification failed!');

  // --- 3. REVERSIBLE LABEL EDIT ON ITEM01 ---
  console.log('\n--- 3. REVERSIBLE LABEL EDIT (item01) ---');
  const originalLabel = enData?.cuisineTeaser?.item01?.label || 'Antipasti';
  const testLabel = 'Antipasti (Chef Selection)';

  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'en',
    data: {
      cuisineTeaser: {
        item01: { label: testLabel },
      },
      _status: 'published',
    },
    overrideAccess: true,
  });

  const editedData = await getHomepageData('en');
  console.log(`Edited label: "${editedData?.cuisineTeaser?.item01?.label}" (expected: "${testLabel}")`);
  const editPass = editedData?.cuisineTeaser?.item01?.label === testLabel;

  // Restore
  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'en',
    data: {
      cuisineTeaser: {
        item01: { label: originalLabel },
      },
      _status: 'published',
    },
    overrideAccess: true,
  });

  const restoredData = await getHomepageData('en');
  console.log(`Restored label: "${restoredData?.cuisineTeaser?.item01?.label}" (expected: "${originalLabel}")`);
  const restorePass = restoredData?.cuisineTeaser?.item01?.label === originalLabel;

  console.log(`Reversible label edit: [${editPass && restorePass ? 'PASS' : 'FAIL'}]`);
  if (!editPass || !restorePass) throw new Error('Reversible label edit failed!');

  // --- 4. REVERSIBLE MEDIA RELATIONSHIP EDIT (item01) ---
  console.log('\n--- 4. REVERSIBLE MEDIA EDIT (item01) ---');
  const originalMediaId = item01Img;
  const tempMediaId = item02Img; // Use existing media ID 3

  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'en',
    data: {
      cuisineTeaser: {
        item01: { image: tempMediaId },
      },
      _status: 'published',
    },
    overrideAccess: true,
  });

  const editedMediaHp = await payload.findGlobal({ slug: 'homepage', overrideAccess: true, depth: 0 });
  const editedMediaId = editedMediaHp.cuisineTeaser?.item01?.image;
  console.log(`Edited media ID: ${editedMediaId} (expected: ${tempMediaId})`);
  const mediaEditPass = editedMediaId === tempMediaId;

  // Restore
  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'en',
    data: {
      cuisineTeaser: {
        item01: { image: originalMediaId },
      },
      _status: 'published',
    },
    overrideAccess: true,
  });

  const restoredMediaHp = await payload.findGlobal({ slug: 'homepage', overrideAccess: true, depth: 0 });
  const restoredMediaId = restoredMediaHp.cuisineTeaser?.item01?.image;
  console.log(`Restored media ID: ${restoredMediaId} (expected: ${originalMediaId})`);
  const mediaRestorePass = restoredMediaId === originalMediaId;

  console.log(`Reversible media edit: [${mediaEditPass && mediaRestorePass ? 'PASS' : 'FAIL'}]`);
  if (!mediaEditPass || !mediaRestorePass) throw new Error('Reversible media edit failed!');

  // --- 5. DRAFT VS PUBLISHED ISOLATION ---
  console.log('\n--- 5. DRAFT VS PUBLISHED ISOLATION ---');
  const draftLabel = 'Antipasti (Draft Preview Only)';
  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'en',
    data: {
      cuisineTeaser: {
        item01: { label: draftLabel },
      },
      _status: 'draft',
    },
    draft: true,
    overrideAccess: true,
  });

  // Public published data should still show originalLabel
  const publicDataDuringDraft = await getHomepageData('en');
  console.log(`Public published during draft: "${publicDataDuringDraft?.cuisineTeaser?.item01?.label}" (expected: "${originalLabel}")`);
  const publicIsolated = publicDataDuringDraft?.cuisineTeaser?.item01?.label === originalLabel;

  // Draft query should show draftLabel
  const draftHp = await payload.findGlobal({
    slug: 'homepage',
    locale: 'en',
    draft: true,
    overrideAccess: true,
  });
  console.log(`Draft query: "${draftHp.cuisineTeaser?.item01?.label}" (expected: "${draftLabel}")`);
  const draftIsolated = draftHp.cuisineTeaser?.item01?.label === draftLabel;

  // Restore published state
  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'en',
    data: {
      cuisineTeaser: {
        item01: { label: originalLabel },
      },
      _status: 'published',
    },
    overrideAccess: true,
  });

  console.log(`Draft isolation: [${publicIsolated && draftIsolated ? 'PASS' : 'FAIL'}]`);
  if (!publicIsolated || !draftIsolated) throw new Error('Draft isolation verification failed!');

  // --- 6. CMS-006 SIGNATURE DISHES REGRESSION ---
  console.log('\n--- 6. CMS-006 SIGNATURE DISHES REGRESSION ---');
  const finalHp = await payload.findGlobal({ slug: 'homepage', overrideAccess: true, depth: 1 });
  const sigCount = finalHp.signatureDishes?.items?.length || 0;
  console.log(`Signature dishes count: ${sigCount} (expected: 4)`);
  const sigPass = sigCount === 4;
  console.log(`CMS-006 Regression Check: [${sigPass ? 'PASS' : 'FAIL'}]`);
  if (!sigPass) throw new Error('CMS-006 regression detected!');

  console.log('\n==================================================');
  console.log('  ALL CMS-007 AUTOMATED QA CHECKS PASSED');
  console.log('==================================================\n');
}

runQA()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('QA failed:', err);
    process.exit(1);
  });
