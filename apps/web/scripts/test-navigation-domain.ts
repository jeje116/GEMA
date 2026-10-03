import { getPayload } from 'payload';
import config from '../src/payload.config';
import { getNavigation } from '../src/content/provider';
import { getDictionary } from '../src/i18n/getDictionary';

async function testNavigationDomain() {
  console.log('=== TESTING NAVIGATION DOMAIN (CMS-003) ===\n');
  const payload = await getPayload({ config });

  // 1. Fetch navigation data for EN and ID
  const enNav = await getNavigation('en');
  const idNav = await getNavigation('id');

  if (!enNav || !idNav) {
    console.error('FAIL: Could not retrieve navigation data from Payload Local API.');
    process.exit(1);
  }

  console.log(`Header links: EN=${enNav.headerLinks.length}, ID=${idNav.headerLinks.length} (Expected: 6)`);
  console.log(`Footer links: EN=${enNav.footerLinks.length}, ID=${idNav.footerLinks.length} (Expected: 7)`);

  if (enNav.headerLinks.length !== 6 || idNav.headerLinks.length !== 6) {
    console.error('FAIL: Header links count mismatch. Expected 6.');
    process.exit(1);
  }

  if (enNav.footerLinks.length !== 7 || idNav.footerLinks.length !== 7) {
    console.error('FAIL: Footer links count mismatch. Expected 7.');
    process.exit(1);
  }

  // 2. Parity check against dictionary
  const enDict = getDictionary('en').t;
  const idDict = getDictionary('id').t;

  const expectedHeaderKeys = ['nav.menu', 'nav.experience', 'nav.events', 'nav.occasions', 'nav.about', 'nav.visit'];
  const expectedFooterKeys = ['nav.menu', 'nav.experience', 'nav.occasions', 'nav.events', 'nav.about', 'nav.journal', 'nav.recognition'];

  console.log('\n2. Verifying Header links parity:');
  for (let i = 0; i < 6; i++) {
    const key = expectedHeaderKeys[i];
    const enLabel = enNav.headerLinks[i].label;
    const idLabel = idNav.headerLinks[i].label;
    console.log(`   [${i}] ${enNav.headerLinks[i].url} -> EN: "${enLabel}" (${enDict(key)}), ID: "${idLabel}" (${idDict(key)})`);
    if (enLabel !== enDict(key) || idLabel !== idDict(key)) {
      console.error(`FAIL: Header link ${i} label mismatch.`);
      process.exit(1);
    }
  }

  console.log('\n3. Verifying Footer links parity:');
  for (let i = 0; i < 7; i++) {
    const key = expectedFooterKeys[i];
    const enLabel = enNav.footerLinks[i].label;
    const idLabel = idNav.footerLinks[i].label;
    console.log(`   [${i}] ${enNav.footerLinks[i].url} -> EN: "${enLabel}" (${enDict(key)}), ID: "${idLabel}" (${idDict(key)})`);
    if (enLabel !== enDict(key) || idLabel !== idDict(key)) {
      console.error(`FAIL: Footer link ${i} label mismatch.`);
      process.exit(1);
    }
  }

  // 3. Direct CMS Edit Test
  console.log('\n4. Direct CMS Edit Test:');
  const originalHeaderLabel = enNav.headerLinks[0].label;
  const testLabel = 'CMS TEST MENU';

  console.log(`   Updating first headerLink label in EN to: "${testLabel}"...`);
  const updatedEnHeaderLinks = enNav.headerLinks.map((link, idx) =>
    idx === 0 ? { ...link, label: testLabel } : link
  );

  await payload.updateGlobal({
    slug: 'navigation',
    locale: 'en',
    data: {
      headerLinks: updatedEnHeaderLinks,
      footerLinks: enNav.footerLinks,
    },
  });

  const updatedNav = await getNavigation('en');
  console.log(`   Observed label in getNavigation('en'): "${updatedNav?.headerLinks[0].label}"`);
  if (updatedNav?.headerLinks[0].label !== testLabel) {
    console.error('FAIL: Direct CMS edit did not reflect in getNavigation!');
    process.exit(1);
  }

  console.log(`   Restoring original label: "${originalHeaderLabel}"...`);
  const restoredEnHeaderLinks = enNav.headerLinks.map((link, idx) =>
    idx === 0 ? { ...link, label: originalHeaderLabel } : link
  );

  await payload.updateGlobal({
    slug: 'navigation',
    locale: 'en',
    data: {
      headerLinks: restoredEnHeaderLinks,
      footerLinks: enNav.footerLinks,
    },
  });

  const restoredNav = await getNavigation('en');
  if (restoredNav?.headerLinks[0].label !== originalHeaderLabel) {
    console.error('FAIL: Direct CMS edit could not be restored!');
    process.exit(1);
  }
  console.log('   Direct CMS edit successfully verified and restored.');

  console.log('\n=== NAVIGATION DOMAIN TEST PASS ===');
  process.exit(0);
}

testNavigationDomain().catch((err) => {
  console.error('Error during Navigation domain test:', err);
  process.exit(1);
});
