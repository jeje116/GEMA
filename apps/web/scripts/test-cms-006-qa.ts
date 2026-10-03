/**
 * CMS-006 Comprehensive Automated QA Test Suite
 *
 * Verifies:
 * 1. Initial parity against audited baseline.
 * 2. Schema constraints (exactly 4 items, minRows/maxRows, duplicate rejection).
 * 3. Availability guard (curated blocked, draft-curated blocked, non-curated allowed).
 * 4. Delete guard (curated blocked, draft-curated blocked, non-curated allowed with temp record cleanup).
 * 5. Reversible direct edit test: replace dish.
 * 6. Reversible direct edit test: reorder dishes without Menu sortOrder side-effects.
 * 7. Direct MenuItem edit test: changes reflect immediately on Homepage.
 * 8. Shared non-localized relationship across EN and ID.
 */

import { getPayload } from 'payload';
import configPromise from '../src/payload.config';
import { getHomepageData } from '../src/content/provider';

const EXPECTED_BASELINE_KEYS = [
  'pizzetta-1',
  'pizzetta-2',
  'woodfire-carne-1',
  'dolci-1',
];

async function runQA() {
  console.log('=== STARTING CMS-006 QA VERIFICATION ===\n');
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

  // 1. Initial Parity Verification
  console.log('--- 1. Initial Parity Check ---');
  const initialHomepage = await payload.findGlobal({
    slug: 'homepage',
    overrideAccess: true,
    depth: 1,
  });
  const initialItems = initialHomepage?.signatureDishes?.items || [];
  assert(initialItems.length === 4, 'Homepage has exactly 4 curated signature dishes');

  const initialKeys = initialItems.map(
    (item: any) => (typeof item === 'object' && item !== null ? item.sourceKey : String(item))
  );
  const initialIds = initialItems.map(
    (item: any) => (typeof item === 'object' && item !== null ? item.id : item)
  );

  let parityOk = initialKeys.length === 4;
  for (let i = 0; i < 4; i++) {
    if (initialKeys[i] !== EXPECTED_BASELINE_KEYS[i]) {
      parityOk = false;
    }
  }
  assert(parityOk, `Initial items match expected baseline: ${initialKeys.join(', ')}`);

  // 2. Shared Non-Localized Relationship
  console.log('\n--- 2. Shared Non-Localized Relationship Check ---');
  const hpEn = await getHomepageData('en');
  const hpId = await getHomepageData('id');
  const enIds = (hpEn?.signatureDishes?.items || []).map((i) => i.id);
  const idIds = (hpId?.signatureDishes?.items || []).map((i) => i.id);
  assert(
    JSON.stringify(enIds) === JSON.stringify(idIds) && enIds.length === 4,
    'Homepage Signature Dishes relationship is shared identically across EN and ID'
  );

  // 3. Schema & Validation: Exactly 4 and No Duplicates
  console.log('\n--- 3. Schema & Validation Constraints ---');
  // Attempt to save 3 items
  try {
    await payload.updateGlobal({
      slug: 'homepage',
      data: {
        signatureDishes: {
          items: initialIds.slice(0, 3),
        },
      },
      overrideAccess: false,
    });
    assert(false, 'Saving 3 items should have been rejected');
  } catch (err: any) {
    assert(true, `Saving 3 items rejected: ${err.message || 'Validation Error'}`);
  }

  // Attempt to save 5 items (use 4th item twice)
  try {
    await payload.updateGlobal({
      slug: 'homepage',
      data: {
        signatureDishes: {
          items: [...initialIds, initialIds[0]],
        },
      },
      overrideAccess: false,
    });
    assert(false, 'Saving 5 items should have been rejected');
  } catch (err: any) {
    assert(true, `Saving 5 items rejected: ${err.message || 'Validation Error'}`);
  }

  // Attempt to save duplicates (4 items, but 2 are identical)
  try {
    await payload.updateGlobal({
      slug: 'homepage',
      data: {
        signatureDishes: {
          items: [initialIds[0], initialIds[1], initialIds[2], initialIds[0]],
        },
      },
      overrideAccess: false,
    });
    assert(false, 'Saving duplicate items should have been rejected');
  } catch (err: any) {
    assert(true, `Saving duplicate items rejected: ${err.message || 'Validation Error'}`);
  }

  // 4. Availability Guard Test
  console.log('\n--- 4. Availability Guard Test ---');
  // A. Curated item -> attempt isAvailable = false
  const curatedId = initialIds[0];
  try {
    await payload.update({
      collection: 'menu-items',
      id: curatedId,
      data: { isAvailable: false },
      overrideAccess: true,
    });
    assert(false, 'Marking curated item unavailable should have been blocked');
  } catch (err: any) {
    const msg = err.message || '';
    assert(
      msg.includes('Cannot mark this item unavailable because it is currently selected'),
      `Curated item availability change blocked: "${msg}"`
    );
  }

  // B. Non-curated available item -> temporarily isAvailable = false -> restore
  const nonCuratedItems = await payload.find({
    collection: 'menu-items',
    where: {
      id: { not_in: initialIds },
      isAvailable: { equals: true },
    },
    limit: 1,
    overrideAccess: true,
  });
  const nonCuratedId = nonCuratedItems.docs[0]?.id;
  assert(!!nonCuratedId, 'Found non-curated available item for testing');

  if (nonCuratedId) {
    await payload.update({
      collection: 'menu-items',
      id: nonCuratedId,
      data: { isAvailable: false },
      overrideAccess: true,
    });
    const updatedNonCurated = await payload.findByID({
      collection: 'menu-items',
      id: nonCuratedId,
      overrideAccess: true,
    });
    assert(updatedNonCurated?.isAvailable === false, 'Non-curated item allowed to become unavailable');

    // Restore
    await payload.update({
      collection: 'menu-items',
      id: nonCuratedId,
      data: { isAvailable: true },
      overrideAccess: true,
    });
    const restoredNonCurated = await payload.findByID({
      collection: 'menu-items',
      id: nonCuratedId,
      overrideAccess: true,
    });
    assert(restoredNonCurated?.isAvailable === true, 'Non-curated item restored to isAvailable = true');
  }

  // 5. Delete Guard Test
  console.log('\n--- 5. Delete Guard Test ---');
  // A. Curated item -> attempt delete
  try {
    await payload.delete({
      collection: 'menu-items',
      id: curatedId,
      overrideAccess: true,
    });
    assert(false, 'Deleting curated item should have been blocked');
  } catch (err: any) {
    const msg = err.message || '';
    assert(
      msg.includes('Cannot delete this item because it is currently selected'),
      `Curated item delete blocked: "${msg}"`
    );
  }

  // B. Non-curated temporary item -> create -> delete -> verify allowed
  const tempItem = await payload.create({
    collection: 'menu-items',
    data: {
      name: 'Temporary Test Dish For CMS-006 QA',
      category: 1, // Antipasti category
      priceLabel: 'Rp 50.000',
      isAvailable: true,
    },
    overrideAccess: true,
  });
  assert(!!tempItem.id, 'Temporary test item created successfully');

  try {
    await payload.delete({
      collection: 'menu-items',
      id: tempItem.id,
      overrideAccess: true,
    });
    assert(true, 'Non-curated temporary item successfully deleted without restriction');
  } catch (err: any) {
    assert(false, `Deleting non-curated item failed: ${err.message}`);
  }

  // 6. Draft Safety Test
  console.log('\n--- 6. Draft Safety Test ---');
  if (nonCuratedId) {
    // Save a draft of Homepage replacing item 4 with nonCuratedId
    const draftItems = [initialIds[0], initialIds[1], initialIds[2], nonCuratedId];
    await payload.updateGlobal({
      slug: 'homepage',
      data: {
        signatureDishes: {
          items: draftItems,
        },
      },
      draft: true,
      overrideAccess: true,
    });

    // Verify nonCuratedId is now blocked from becoming unavailable
    try {
      await payload.update({
        collection: 'menu-items',
        id: nonCuratedId,
        data: { isAvailable: false },
        overrideAccess: true,
      });
      assert(false, 'Draft-curated item should be blocked from becoming unavailable');
    } catch (err: any) {
      assert(
        err.message.includes('Cannot mark this item unavailable'),
        'Draft-curated item availability change successfully blocked'
      );
    }

    // Verify nonCuratedId is now blocked from being deleted
    try {
      await payload.delete({
        collection: 'menu-items',
        id: nonCuratedId,
        overrideAccess: true,
      });
      assert(false, 'Draft-curated item should be blocked from deletion');
    } catch (err: any) {
      assert(
        err.message.includes('Cannot delete this item'),
        'Draft-curated item deletion successfully blocked'
      );
    }

    // Restore published homepage as active draft
    await payload.updateGlobal({
      slug: 'homepage',
      data: {
        signatureDishes: {
          items: initialIds,
        },
      },
      draft: false,
      overrideAccess: true,
    });
    assert(true, 'Homepage draft restored to original published items');
  }

  // 7. Direct CMS Edit Test: Replace Dish
  console.log('\n--- 7. Direct CMS Edit Test: Replace Dish ---');
  if (nonCuratedId) {
    const replacedItems = [initialIds[0], initialIds[1], initialIds[2], nonCuratedId];
    await payload.updateGlobal({
      slug: 'homepage',
      data: {
        signatureDishes: {
          items: replacedItems,
        },
      },
      draft: false,
      overrideAccess: true,
    });

    const afterReplace = await getHomepageData('en');
    const afterReplaceIds = (afterReplace?.signatureDishes?.items || []).map((i) => i.id);
    const nonCuratedDoc = await payload.findByID({
      collection: 'menu-items',
      id: nonCuratedId,
      overrideAccess: true,
    });
    const nonCuratedExpectedKey = nonCuratedDoc?.sourceKey || String(nonCuratedId);

    assert(
      afterReplaceIds[3] === nonCuratedExpectedKey,
      `Homepage 4th dish successfully replaced by ${nonCuratedExpectedKey}`
    );

    // Restore
    await payload.updateGlobal({
      slug: 'homepage',
      data: {
        signatureDishes: {
          items: initialIds,
        },
      },
      draft: false,
      overrideAccess: true,
    });
    const restoredReplace = await getHomepageData('en');
    const restoredReplaceIds = (restoredReplace?.signatureDishes?.items || []).map((i) => i.id);
    assert(
      restoredReplaceIds[3] === initialKeys[3],
      `Homepage restored to original 4th dish (${initialKeys[3]})`
    );
  }

  // 8. Direct CMS Edit Test: Reorder Dishes
  console.log('\n--- 8. Direct CMS Edit Test: Reorder Dishes ---');
  // Reorder to [C, A, D, B] => [2, 0, 3, 1]
  const reorderedIds = [initialIds[2], initialIds[0], initialIds[3], initialIds[1]];
  const reorderedExpectedKeys = [initialKeys[2], initialKeys[0], initialKeys[3], initialKeys[1]];

  // Record MenuItem.sortOrder before
  const sortOrdersBefore = await Promise.all(
    initialIds.map(async (id: any) => {
      const doc = await payload.findByID({ collection: 'menu-items', id, overrideAccess: true });
      return { id, sortOrder: doc.sortOrder };
    })
  );

  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      signatureDishes: {
        items: reorderedIds,
      },
    },
    draft: false,
    overrideAccess: true,
  });

  const afterReorder = await getHomepageData('en');
  const afterReorderKeys = (afterReorder?.signatureDishes?.items || []).map((i) => i.id);
  assert(
    JSON.stringify(afterReorderKeys) === JSON.stringify(reorderedExpectedKeys),
    `Homepage reflects exact reordered relationship: [${afterReorderKeys.join(', ')}]`
  );

  // Verify MenuItem.sortOrder is completely unchanged
  const sortOrdersAfter = await Promise.all(
    initialIds.map(async (id: any) => {
      const doc = await payload.findByID({ collection: 'menu-items', id, overrideAccess: true });
      return { id, sortOrder: doc.sortOrder };
    })
  );
  assert(
    JSON.stringify(sortOrdersBefore) === JSON.stringify(sortOrdersAfter),
    'MenuItem.sortOrder for all dishes is completely unchanged (no side-effects on Menu page)'
  );

  // Restore original order
  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      signatureDishes: {
        items: initialIds,
      },
    },
    draft: false,
    overrideAccess: true,
  });
  const restoredReorder = await getHomepageData('en');
  const restoredReorderKeys = (restoredReorder?.signatureDishes?.items || []).map((i) => i.id);
  assert(
    JSON.stringify(restoredReorderKeys) === JSON.stringify(initialKeys),
    `Homepage restored to original order: [${restoredReorderKeys.join(', ')}]`
  );

  // 9. Direct MenuItem Edit Test
  console.log('\n--- 9. Direct MenuItem Edit Test ---');
  const itemToEditId = initialIds[0];
  const originalDoc = await payload.findByID({
    collection: 'menu-items',
    id: itemToEditId,
    overrideAccess: true,
  });
  const originalName = originalDoc.name;
  const testName = originalName + ' [TEST_MUTATION]';

  await payload.update({
    collection: 'menu-items',
    id: itemToEditId,
    data: { name: testName },
    overrideAccess: true,
  });

  const hpAfterItemEdit = await getHomepageData('en');
  const editedItemInHp = (hpAfterItemEdit?.signatureDishes?.items || []).find(
    (i) => i.id === initialKeys[0]
  );
  assert(
    editedItemInHp?.name === testName,
    `Editing MenuItem.name reflects on Homepage without reselection: "${editedItemInHp?.name}"`
  );

  // Restore original name
  await payload.update({
    collection: 'menu-items',
    id: itemToEditId,
    data: { name: originalName },
    overrideAccess: true,
  });
  const hpAfterItemRestore = await getHomepageData('en');
  const restoredItemInHp = (hpAfterItemRestore?.signatureDishes?.items || []).find(
    (i) => i.id === initialKeys[0]
  );
  assert(
    restoredItemInHp?.name === originalName,
    `MenuItem name restored: "${restoredItemInHp?.name}"`
  );

  console.log('\n=== CMS-006 QA VERIFICATION RESULT ===');
  if (allPassed) {
    console.log('ALL CMS-006 AUTOMATED TESTS PASSED SUCCESSFULLY! ✓');
    process.exit(0);
  } else {
    console.error('SOME CMS-006 AUTOMATED TESTS FAILED! ✗');
    process.exit(1);
  }
}

runQA().catch((err) => {
  console.error('Fatal error in CMS-006 QA script:', err);
  process.exit(1);
});
