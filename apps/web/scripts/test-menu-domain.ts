import { getPayload } from 'payload';
import config from '../src/payload.config';
import { getMenuCategories, getMenuItems, getMenuPageData } from '../src/content/provider';
import { menuCategories as fixtureCats, menuItems as fixtureItems } from '../src/content/fixtures/menu';

async function testMenuDomain() {
  console.log('=== [CMS-003 QA] TESTING DOMAIN 1: MENU ===\n');

  // 1. Categories Parity
  const catsEn = await getMenuCategories('en');
  const catsId = await getMenuCategories('id');

  console.log(`Fetched ${catsEn.length} categories (EN) and ${catsId.length} (ID) from Payload.`);
  if (catsEn.length !== 20 || catsId.length !== 20) {
    throw new Error(`Category count mismatch! Expected 20, got EN: ${catsEn.length}, ID: ${catsId.length}`);
  }

  const foodCats = catsEn.filter(c => c.menuType === 'food');
  const bevCats = catsEn.filter(c => c.menuType === 'beverage');

  console.log(`Food categories: ${foodCats.length} (Expected: 11)`);
  console.log(`Beverage categories: ${bevCats.length} (Expected: 9)`);

  if (foodCats.length !== 11 || bevCats.length !== 9) {
    throw new Error(`Category breakdown mismatch! Food: ${foodCats.length}, Bev: ${bevCats.length}`);
  }

  // Check category titles
  fixtureCats.forEach(fc => {
    const pcEn = catsEn.find(c => c.id === fc.id);
    const pcId = catsId.find(c => c.id === fc.id);
    if (!pcEn || !pcId) {
      throw new Error(`Missing category in Payload: ${fc.id}`);
    }
    if (pcEn.name.en !== fc.name.en || pcId.name.id !== fc.name.id) {
      throw new Error(`Category name mismatch for ${fc.id}! Expected "${fc.name.en}"/"${fc.name.id}", got "${pcEn.name.en}"/"${pcId.name.id}"`);
    }
  });
  console.log('✓ All 20 category names and slugs match fixture exactly.');

  // 2. Menu Items Parity
  const itemsEn = await getMenuItems('en');
  const itemsId = await getMenuItems('id');

  console.log(`\nFetched ${itemsEn.length} items (EN) and ${itemsId.length} (ID) from Payload.`);
  if (itemsEn.length !== 118 || itemsId.length !== 118) {
    throw new Error(`Item count mismatch! Expected 118, got EN: ${itemsEn.length}, ID: ${itemsId.length}`);
  }

  // Check food/bev items count
  const foodItemCount = itemsEn.filter(i => {
    const cat = catsEn.find(c => c.id === i.categoryId);
    return cat?.menuType === 'food';
  }).length;
  const bevItemCount = itemsEn.filter(i => {
    const cat = catsEn.find(c => c.id === i.categoryId);
    return cat?.menuType === 'beverage';
  }).length;

  console.log(`Food items: ${foodItemCount} (Expected: 71)`);
  console.log(`Beverage items: ${bevItemCount} (Expected: 47)`);

  if (foodItemCount !== 71 || bevItemCount !== 47) {
    throw new Error(`Item breakdown mismatch! Food: ${foodItemCount}, Bev: ${bevItemCount}`);
  }

  // Check signature dish images
  const sigDishes = ['woodfire-carne-1', 'dolci-1', 'pizzetta-1', 'pizzetta-2'];
  sigDishes.forEach(id => {
    const item = itemsEn.find(i => i.id === id);
    if (!item?.image) {
      throw new Error(`Signature dish ${id} is missing image from Payload!`);
    }
    console.log(`✓ Signature dish ${id} has image: ${item.image}`);
  });

  // 3. MenuPage Global Parity
  const pageEn = await getMenuPageData('en');
  const pageId = await getMenuPageData('id');

  console.log('\nMenuPage Global:');
  console.log(`  EN Title: "${pageEn?.title}"`);
  console.log(`  ID Title: "${pageId?.title}"`);
  console.log(`  EN Tax: "${pageEn?.taxServiceFootnote}"`);
  console.log(`  ID Tax: "${pageId?.taxServiceFootnote}"`);

  if (pageEn?.title !== 'The Menu' || pageId?.title !== 'Menu') {
    throw new Error('MenuPage title mismatch!');
  }
  if (!pageEn?.taxServiceFootnote?.includes('10% government tax') || !pageId?.taxServiceFootnote?.includes('10%')) {
    throw new Error('MenuPage taxServiceFootnote mismatch!');
  }
  console.log('✓ MenuPage Global verified.');

  // 4. Direct CMS Edit Test
  console.log('\n--- Direct CMS Edit Test on MenuItem ---');
  const payload = await getPayload({ config });
  const testItem = await payload.find({
    collection: 'menu-items',
    where: { sourceKey: { equals: 'cicchetti-1' } },
    locale: 'en',
    limit: 1,
    overrideAccess: true,
  });
  const testDoc = testItem.docs[0];
  const originalDesc = testDoc.description;

  console.log(`Editing cicchetti-1 description in Payload...`);
  await payload.update({
    collection: 'menu-items',
    id: testDoc.id,
    data: { description: 'CMS-EDIT-TEST: Crisp ravioli parcel' },
    locale: 'en',
    overrideAccess: true,
  });

  const editedItems = await getMenuItems('en');
  const editedDoc = editedItems.find(i => i.id === 'cicchetti-1');
  console.log(`Observed updated description via provider: "${editedDoc?.description?.en}"`);
  if (editedDoc?.description?.en !== 'CMS-EDIT-TEST: Crisp ravioli parcel') {
    throw new Error('Direct CMS edit not reflected via provider!');
  }
  console.log('✓ Direct CMS edit reflected in public provider.');

  // Restore original
  console.log('Restoring original description in Payload...');
  await payload.update({
    collection: 'menu-items',
    id: testDoc.id,
    data: { description: originalDesc },
    locale: 'en',
    overrideAccess: true,
  });

  const restoredItems = await getMenuItems('en');
  const restoredDoc = restoredItems.find(i => i.id === 'cicchetti-1');
  if (restoredDoc?.description?.en !== originalDesc) {
    throw new Error('Failed to restore original description!');
  }
  console.log('✓ Original description successfully restored.');

  console.log('\n=== DOMAIN 1: MENU PASS ===\n');
}

testMenuDomain()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Menu domain test failed:', err);
    process.exit(1);
  });
