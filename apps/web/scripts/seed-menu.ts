import { getPayload } from 'payload';
import config from '../src/payload.config';
import { menuCategories, menuItems } from '../src/content/fixtures/menu';

const SIGNATURE_MEDIA_MAP: Record<string, string> = {
  'woodfire-carne-1': 'home.signature.steak',
  'dolci-1': 'home.signature.tiramisu',
  'pizzetta-1': 'shared.unsplash.1551183053-bf91a1d81141',
  'pizzetta-2': 'shared.unsplash.1513104890138-7c749659a591',
};

export async function seedMenu() {
  console.log('=== [CMS-003] SEEDING MENU (CATEGORIES, ITEMS, MENU-PAGE GLOBAL) ===');

  // 1. Audit Source Fixture Counts
  const foodCats = menuCategories.filter((c) => c.menuType === 'food');
  const bevCats = menuCategories.filter((c) => c.menuType === 'beverage');
  const foodItems = menuItems.filter((i) => {
    const cat = menuCategories.find((c) => c.id === i.categoryId);
    return cat?.menuType === 'food';
  });
  const bevItems = menuItems.filter((i) => {
    const cat = menuCategories.find((c) => c.id === i.categoryId);
    return cat?.menuType === 'beverage';
  });

  console.log(`Source Food Categories: ${foodCats.length} (Expected: 11)`);
  console.log(`Source Beverage Categories: ${bevCats.length} (Expected: 9)`);
  console.log(`Total Source Categories: ${menuCategories.length} (Expected: 20)`);
  console.log(`Source Food Items: ${foodItems.length} (Expected: 71)`);
  console.log(`Source Beverage Items: ${bevItems.length} (Expected: 47)`);
  console.log(`Total Source Items: ${menuItems.length} (Expected: 118)`);

  if (foodCats.length !== 11 || bevCats.length !== 9 || menuCategories.length !== 20) {
    throw new Error(`Category count mismatch! Food: ${foodCats.length}, Bev: ${bevCats.length}, Total: ${menuCategories.length}`);
  }
  if (foodItems.length !== 71 || bevItems.length !== 47 || menuItems.length !== 118) {
    throw new Error(`Item count mismatch! Food: ${foodItems.length}, Bev: ${bevItems.length}, Total: ${menuItems.length}`);
  }

  const payload = await getPayload({ config });

  // 2. Fetch Media records for signature dishes
  console.log('Fetching media records for signature dishes...');
  const mediaRecords = await payload.find({
    collection: 'media',
    where: {
      sourceKey: {
        in: Object.values(SIGNATURE_MEDIA_MAP),
      },
    },
    limit: 10,
    overrideAccess: true,
  });
  const mediaByKey = new Map<string, number | string>();
  mediaRecords.docs.forEach((m: any) => {
    if (m.sourceKey) mediaByKey.set(m.sourceKey, m.id);
  });
  console.log(`Found ${mediaByKey.size} media records for signature dishes.`);

  // 3. Seed Menu Categories
  console.log('Seeding 20 Menu Categories...');
  const categoryDocMap = new Map<string, number | string>();

  for (const cat of menuCategories) {
    const existing = await payload.find({
      collection: 'menu-categories',
      where: {
        slug: {
          equals: cat.id,
        },
      },
      limit: 1,
      overrideAccess: true,
    });

    const categoryData: any = {
      name: cat.name.en,
      slug: cat.id,
      menuType: cat.menuType,
      sortOrder: cat.order,
      isActive: true,
      sectionNote: cat.sectionNote?.en,
    };

    let docId: number | string;
    if (existing.docs.length > 0) {
      docId = existing.docs[0].id;
      // Update EN
      await payload.update({
        collection: 'menu-categories',
        id: docId,
        data: categoryData,
        locale: 'en',
        overrideAccess: true,
      });
      // Update ID
      await payload.update({
        collection: 'menu-categories',
        id: docId,
        data: {
          name: cat.name.id,
          sectionNote: cat.sectionNote?.id,
        },
        locale: 'id',
        overrideAccess: true,
      });
    } else {
      // Create with EN
      const created = await payload.create({
        collection: 'menu-categories',
        data: categoryData,
        locale: 'en',
        overrideAccess: true,
      });
      docId = created.id;
      // Update ID locale
      await payload.update({
        collection: 'menu-categories',
        id: docId,
        data: {
          name: cat.name.id,
          sectionNote: cat.sectionNote?.id,
        },
        locale: 'id',
        overrideAccess: true,
      });
    }

    categoryDocMap.set(cat.id, docId);
  }
  console.log(`✓ 20 Menu Categories seeded.`);

  // 4. Seed Menu Items
  console.log('Seeding 118 Menu Items...');
  let seededItemCount = 0;

  for (let idx = 0; idx < menuItems.length; idx++) {
    const item = menuItems[idx];
    const categoryDocId = categoryDocMap.get(item.categoryId);
    if (!categoryDocId) {
      throw new Error(`Category document not found for categoryId: ${item.categoryId} (Item: ${item.id})`);
    }

    // Check media relation for signature dishes
    let mediaDocId: number | string | undefined = undefined;
    const mediaSourceKey = SIGNATURE_MEDIA_MAP[item.id];
    if (mediaSourceKey) {
      mediaDocId = mediaByKey.get(mediaSourceKey);
    }

    const existing = await payload.find({
      collection: 'menu-items',
      where: {
        sourceKey: {
          equals: item.id,
        },
      },
      limit: 1,
      overrideAccess: true,
    });

    const itemDataEn: any = {
      sourceKey: item.id,
      category: categoryDocId,
      name: item.name,
      description: item.description?.en || '',
      priceLabel: item.priceLabel,
      portion: item.portion || undefined,
      priceVariants: item.priceVariants || undefined,
      subhead: item.subhead?.en || undefined,
      subheadNote: item.subheadNote?.en || undefined,
      additionalNotes: item.additionalNotes ? item.additionalNotes.map((n) => ({ note: n })) : undefined,
      isIntroBlock: Boolean(item.isIntroBlock),
      featured: Boolean(item.featured),
      signature: Boolean(item.signature),
      isAvailable: true,
      sortOrder: idx + 1,
      image: mediaDocId || undefined,
    };

    let docId: number | string;
    if (existing.docs.length > 0) {
      docId = existing.docs[0].id;
      await payload.update({
        collection: 'menu-items',
        id: docId,
        data: itemDataEn,
        locale: 'en',
        overrideAccess: true,
      });
      // Update ID locale
      await payload.update({
        collection: 'menu-items',
        id: docId,
        data: {
          description: item.description?.id || '',
          subhead: item.subhead?.id || undefined,
          subheadNote: item.subheadNote?.id || undefined,
        },
        locale: 'id',
        overrideAccess: true,
      });
    } else {
      const created = await payload.create({
        collection: 'menu-items',
        data: itemDataEn,
        locale: 'en',
        overrideAccess: true,
      });
      docId = created.id;
      await payload.update({
        collection: 'menu-items',
        id: docId,
        data: {
          description: item.description?.id || '',
          subhead: item.subhead?.id || undefined,
          subheadNote: item.subheadNote?.id || undefined,
        },
        locale: 'id',
        overrideAccess: true,
      });
    }
    seededItemCount++;
  }
  console.log(`✓ ${seededItemCount} Menu Items seeded.`);

  // 5. Seed MenuPage Global
  console.log('Seeding MenuPage Global...');
  await payload.updateGlobal({
    slug: 'menu-page',
    data: {
      title: 'The Menu',
      philosophy: 'Honest ingredients, prepared with precision and a touch of art.',
      taxServiceFootnote: 'All prices are subject to 10% government tax and 10% service charges.',
    },
    locale: 'en',
    overrideAccess: true,
  });

  await payload.updateGlobal({
    slug: 'menu-page',
    data: {
      title: 'Menu',
      philosophy: 'Bahan-bahan jujur, disiapkan dengan presisi dan sentuhan seni.',
      taxServiceFootnote: 'Semua harga dikenakan pajak pemerintah 10% dan biaya layanan 10%.',
    },
    locale: 'id',
    overrideAccess: true,
  });
  console.log('✓ MenuPage Global seeded for EN and ID.');

  // 6. Verification and Taxonomy Printout
  const verifyCats = await payload.find({
    collection: 'menu-categories',
    limit: 50,
    overrideAccess: true,
  });
  const verifyItems = await payload.find({
    collection: 'menu-items',
    limit: 200,
    overrideAccess: true,
  });

  const verifiedFood = verifyCats.docs.filter((c: any) => c.menuType === 'food').sort((a: any, b: any) => a.sortOrder - b.sortOrder);
  const verifiedBev = verifyCats.docs.filter((c: any) => c.menuType === 'beverage').sort((a: any, b: any) => a.sortOrder - b.sortOrder);

  console.log('\n================ MENU TAXONOMY AUDIT ================');
  console.log('Ordered Food Categories:');
  verifiedFood.forEach((c: any, i: number) => {
    console.log(`  ${i + 1}. [${c.slug}] ${c.name}`);
  });
  console.log('\nOrdered Beverage Categories:');
  verifiedBev.forEach((c: any, i: number) => {
    console.log(`  ${i + 1}. [${c.slug}] ${c.name}`);
  });
  console.log('=====================================================\n');

  console.log(`Final DB Counts: Categories = ${verifyCats.totalDocs}, Items = ${verifyItems.totalDocs}`);
  if (verifyCats.totalDocs !== 20 || verifyItems.totalDocs !== 118) {
    throw new Error(`DB verification failed! Categories: ${verifyCats.totalDocs} (expected 20), Items: ${verifyItems.totalDocs} (expected 118)`);
  }
  console.log('=== [CMS-003] MENU SEED COMPLETE & VERIFIED ===\n');
}

// Self-execution if run via node/tsx
if (import.meta.url === `file://${process.argv[1]}`) {
  seedMenu()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Menu seed failed:', err);
      process.exit(1);
    });
}
