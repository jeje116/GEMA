/**
 * CMS-006 Initial Seeding & Parity Script for Homepage Signature Dishes
 *
 * Programmatically derives legacy Homepage signature dishes selection from active MenuItems,
 * verifies exact parity against audited baseline, and seeds the non-localized
 * Homepage.signatureDishes.items relationship.
 */

import { getPayload } from 'payload';
import config from '../src/payload.config';

const EXPECTED_BASELINE = [
  'pizzetta-1',
  'pizzetta-2',
  'woodfire-carne-1',
  'dolci-1',
];

export async function seedCMS006Signatures() {
  console.log('\n==================================================');
  console.log('  SEEDING CMS-006 HOMEPAGE SIGNATURE DISHES');
  console.log('==================================================\n');

  const payload = await getPayload({ config });

  // 1. Programmatically derive legacy selection
  console.log('1. Querying active MenuItems using legacy derivation rules...');
  const menuItemsRes = await payload.find({
    collection: 'menu-items',
    where: {
      isAvailable: { equals: true },
      signature: { equals: true },
    },
    sort: 'sortOrder',
    limit: 20,
    depth: 0,
    overrideAccess: true,
  });

  const legacyDerivedDocs = menuItemsRes.docs.slice(0, 4);
  const legacyDerivedKeys = legacyDerivedDocs.map(
    (doc: any) => doc.sourceKey || String(doc.id)
  );
  const legacyDerivedIds = legacyDerivedDocs.map((doc: any) => doc.id);

  console.log('\nLEGACY DERIVED:');
  legacyDerivedDocs.forEach((doc: any, idx: number) => {
    console.log(`  0${idx + 1} ID=${doc.id} sourceKey=${doc.sourceKey} name="${doc.name}"`);
  });

  // 2. Parity Guard: compare to expected audited baseline
  console.log('\n2. Verifying parity against audited baseline...');
  let parityMatch = true;
  if (legacyDerivedKeys.length !== EXPECTED_BASELINE.length) {
    parityMatch = false;
  } else {
    for (let i = 0; i < EXPECTED_BASELINE.length; i++) {
      if (legacyDerivedKeys[i] !== EXPECTED_BASELINE[i]) {
        parityMatch = false;
        break;
      }
    }
  }

  if (!parityMatch) {
    console.error('\n✗ PARITY GUARD FAILED!');
    console.error('Expected Baseline:', EXPECTED_BASELINE);
    console.error('Legacy Derived:   ', legacyDerivedKeys);
    throw new Error(
      'CMS-006 Parity Guard Mismatch: Legacy derived signature dishes differ from the audited baseline.'
    );
  }
  console.log('✓ PARITY GUARD PASSED: Derived dishes match audited baseline exactly.');

  // 3. Populate Homepage.signatureDishes.items (non-localized relationship)
  console.log('\n3. Populating Homepage.signatureDishes.items...');
  const currentHomepage = await payload.findGlobal({
    slug: 'homepage',
    overrideAccess: true,
    depth: 0,
  });

  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      signatureDishes: {
        ...currentHomepage?.signatureDishes,
        items: legacyDerivedIds,
      },
    },
    overrideAccess: true,
    draft: false, // publish
  });

  // 4. Verify post-seed state
  const updatedHomepage = await payload.findGlobal({
    slug: 'homepage',
    overrideAccess: true,
    depth: 1,
  });

  const populatedItems = (updatedHomepage?.signatureDishes?.items || []).map(
    (item: any) => (typeof item === 'object' && item !== null ? item.id : item)
  );

  console.log('\nAFTER RELATIONSHIP:');
  (updatedHomepage?.signatureDishes?.items || []).forEach((item: any, idx: number) => {
    const name = typeof item === 'object' && item !== null ? item.name : 'Unknown';
    const id = typeof item === 'object' && item !== null ? item.id : item;
    const sourceKey = typeof item === 'object' && item !== null ? item.sourceKey : id;
    console.log(`  0${idx + 1} ID=${id} sourceKey=${sourceKey} name="${name}"`);
  });

  console.log('\nParity: PASS');
  console.log('\n==================================================');
  console.log('  CMS-006 SIGNATURE DISHES SEEDED SUCCESSFULLY');
  console.log('==================================================\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedCMS006Signatures()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal error seeding CMS-006 signatures:', err);
      process.exit(1);
    });
}
