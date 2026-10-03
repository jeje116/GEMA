import { getPayload, type Payload } from 'payload';
import config from '../src/payload.config';
import { seedMedia } from './seed-media';
import { seedMenu } from './seed-menu';
import { seedJournal } from './seed-journal';
import { seedEvents } from './seed-events';
import { seedHomepage } from './seed-homepage';
import { seedChef } from './seed-chef';
import { seedSiteSettings } from './seed-site-settings';
import { seedNavigation } from './seed-navigation';
import { seedCMS005Pages } from './seed-cms-005-pages';
import { seedCMS006Signatures } from './seed-cms-006-signatures';
import { seedCuisineTeaser } from './seed-cms-007-cuisine-teaser';

// Fixture imports for deterministic bootstrap
import { menuCategories as rawCategories, menuItems as rawItems } from '../src/content/fixtures/menu';
import { journalEntries as rawJournal } from '../src/content/fixtures/journal';
import { events as rawEvents } from '../src/content/fixtures/events';

export type BootstrapMode = 'initial' | 'verify' | 'force';

export async function runBootstrap(mode: BootstrapMode = 'initial') {
  console.log(`\n==================================================`);
  console.log(`  GEMA CMS CONTENT BOOTSTRAP — MODE: [${mode.toUpperCase()}]`);
  console.log(`==================================================\n`);

  const payload = await getPayload({ config });

  if (mode === 'verify') {
    return verifyContent(payload);
  }

  if (mode === 'force') {
    console.log('⚠️  [FORCE MODE] Performing full destructive re-seed of initial content...\n');
    await seedMedia();
    await seedMenu();
    await seedJournal();
    await seedEvents();
    await seedHomepage();
    await seedChef();
    await seedSiteSettings();
    await seedNavigation();
    await seedCMS005Pages();
    console.log('✓ Force bootstrap completed successfully.\n');
    return verifyContent(payload);
  }

  // --- INITIAL MODE (Non-destructive, safe rerun) ---
  console.log('📋 [INITIAL MODE] Ensuring required baseline records exist without overwriting live edits...\n');

  // 1. Check & Bootstrap Media
  const existingMedia = await payload.find({
    collection: 'media',
    limit: 500,
    overrideAccess: true,
  });

  let mediaCreated = 0;
  if (existingMedia.totalDocs === 0) {
    console.log('No media found. Bootstrapping initial 35 media records...');
    await seedMedia();
    mediaCreated = 35;
  } else {
    console.log(`✓ Media collection contains ${existingMedia.totalDocs} records. Preserved existing media.`);
  }

  // Re-fetch media map for relationships
  const allMedia = await payload.find({ collection: 'media', limit: 500, overrideAccess: true });
  const mediaMap = new Map<string, any>();
  allMedia.docs.forEach((doc: any) => {
    if (doc.sourceKey) mediaMap.set(doc.sourceKey, doc);
    mediaMap.set(doc.filename, doc);
  });

  // 2. Check & Bootstrap Menu Categories
  const existingCategories = await payload.find({
    collection: 'menu-categories',
    limit: 100,
    overrideAccess: true,
  });
  const existingCatSlugs = new Set(existingCategories.docs.map((c: any) => c.slug));
  let categoriesCreated = 0;

  for (const cat of rawCategories) {
    if (!existingCatSlugs.has(cat.id)) {
      console.log(`Creating missing MenuCategory: ${cat.id}...`);
      await payload.create({
        collection: 'menu-categories',
        data: {
          slug: cat.id,
          name: cat.name.en,
          menuType: (cat.menuType || 'food') as 'food' | 'beverage',
          sortOrder: (cat as any).sortOrder || 0,
          isActive: true,
          sectionNote: cat.sectionNote?.en || null,
        },
        overrideAccess: true,
      });
      // Add ID translation
      const created = await payload.find({
        collection: 'menu-categories',
        where: { slug: { equals: cat.id } },
        limit: 1,
        overrideAccess: true,
      });
      if (created.docs[0]) {
        await payload.update({
          collection: 'menu-categories',
          id: created.docs[0].id,
          data: {
            name: cat.name.id,
            sectionNote: cat.sectionNote?.id || null,
          },
          locale: 'id',
          overrideAccess: true,
        });
      }
      categoriesCreated++;
    }
  }
  console.log(`✓ MenuCategories: ${categoriesCreated} created, ${existingCategories.totalDocs} preserved.`);

  // 3. Check & Bootstrap Menu Items
  const SIGNATURE_MEDIA_MAP: Record<string, string> = {
    'woodfire-carne-1': 'home.signature.steak',
    'dolci-1': 'home.signature.tiramisu',
    'pizzetta-1': 'shared.unsplash.1551183053-bf91a1d81141',
    'pizzetta-2': 'shared.unsplash.1513104890138-7c749659a591',
  };

  const catDocs = await payload.find({ collection: 'menu-categories', limit: 100, overrideAccess: true });
  const catMap = new Map(catDocs.docs.map((c: any) => [c.slug, c.id]));

  const existingItems = await payload.find({ collection: 'menu-items', limit: 200, overrideAccess: true });
  const existingItemKeys = new Set(existingItems.docs.map((i: any) => i.sourceKey));
  let itemsCreated = 0;

  for (const item of rawItems) {
    if (!existingItemKeys.has(item.id)) {
      const categoryId = catMap.get(item.categoryId);
      if (!categoryId) {
        console.warn(`[WARNING] Category "${item.categoryId}" not found for item "${item.id}"`);
        continue;
      }

      const sigKey = SIGNATURE_MEDIA_MAP[item.id];
      const imageId = sigKey ? mediaMap.get(sigKey)?.id : null;

      await payload.create({
        collection: 'menu-items',
        data: {
          sourceKey: item.id,
          category: categoryId,
          name: item.name,
          priceLabel: item.priceLabel || null,
          portion: typeof item.portion === 'string' ? item.portion : (item.portion as any)?.en || null,
          description: item.description?.en || null,
          subhead: item.subhead?.en || null,
          subheadNote: item.subheadNote?.en || null,
          isIntroBlock: Boolean(item.isIntroBlock),
          featured: Boolean(item.featured),
          signature: Boolean(item.signature),
          sortOrder: (item as any).sortOrder || 0,
          image: imageId,
        },
        overrideAccess: true,
      });

      // ID translation
      const createdItem = await payload.find({
        collection: 'menu-items',
        where: { sourceKey: { equals: item.id } },
        limit: 1,
        overrideAccess: true,
      });
      if (createdItem.docs[0]) {
        await payload.update({
          collection: 'menu-items',
          id: createdItem.docs[0].id,
          data: {
            description: item.description?.id || item.description?.en || null,
            subhead: item.subhead?.id || item.subhead?.en || null,
            subheadNote: item.subheadNote?.id || item.subheadNote?.en || null,
          },
          locale: 'id',
          overrideAccess: true,
        });
      }
      itemsCreated++;
    }
  }
  console.log(`✓ MenuItems: ${itemsCreated} created, ${existingItems.totalDocs} preserved.`);

  // 4. Check & Bootstrap Events
  const EVENT_MEDIA_MAP: Record<string, string> = {
    'private-table-series': 'events.private-table-series',
    'seasonal-tasting': 'events.seasonal-tasting',
    'sunday-society': 'events.sunday-society',
    'an-evening-of-fresh-pasta': 'shared.unsplash.1551183053-bf91a1d81141',
    'fire-and-flour': 'shared.unsplash.1513104890138-7c749659a591',
    'a-table-for-two': 'shared.unsplash.1517248135467-4c7edcad34c4',
  };

  const existingEvents = await payload.find({ collection: 'events', limit: 100, overrideAccess: true });
  const existingEventSlugs = new Set(existingEvents.docs.map((e: any) => e.slug));
  let eventsCreated = 0;

  for (const event of rawEvents) {
    if (!existingEventSlugs.has(event.slug)) {
      const mediaKey = EVENT_MEDIA_MAP[event.slug];
      const coverDoc = mediaKey ? mediaMap.get(mediaKey) : null;
      const coverId = coverDoc ? coverDoc.id : null;

      await payload.create({
        collection: 'events',
        data: {
          slug: event.slug,
          title: event.title.en,
          eyebrow: event.eyebrow?.en || null,
          shortDescription: event.shortDescription?.en || null,
          fullDescription: event.fullDescription?.en || null,
          startDateTime: event.startDateTime,
          endDateTime: event.endDateTime || null,
          priceLabel: event.priceLabel?.en || null,
          coverImage: coverId,
          featured: Boolean(event.featured),
          _status: 'published',
        },
        overrideAccess: true,
      });

      const createdEvt = await payload.find({
        collection: 'events',
        where: { slug: { equals: event.slug } },
        limit: 1,
        overrideAccess: true,
      });
      if (createdEvt.docs[0]) {
        await payload.update({
          collection: 'events',
          id: createdEvt.docs[0].id,
          data: {
            title: event.title.id,
            eyebrow: event.eyebrow?.id || null,
            shortDescription: event.shortDescription?.id || null,
            fullDescription: event.fullDescription?.id || null,
            priceLabel: event.priceLabel?.id || null,
          },
          locale: 'id',
          overrideAccess: true,
        });
      }
      eventsCreated++;
    }
  }
  console.log(`✓ Events: ${eventsCreated} created, ${existingEvents.totalDocs} preserved.`);

  // 5. Check & Bootstrap Journal
  const JOURNAL_MEDIA_MAP: Record<string, string> = {
    'inside-gemas-fresh-pasta': 'journal.fresh-pasta.cover',
    'from-dough-to-fire': 'shared.unsplash.1513104890138-7c749659a591',
    'a-table-for-two': 'shared.unsplash.1517248135467-4c7edcad34c4',
  };

  const existingJournal = await payload.find({ collection: 'journal-posts', limit: 100, overrideAccess: true });
  const existingJournalSlugs = new Set(existingJournal.docs.map((j: any) => j.slug));
  let journalCreated = 0;

  for (const entry of rawJournal) {
    if (!existingJournalSlugs.has(entry.slug)) {
      const mediaKey = JOURNAL_MEDIA_MAP[entry.slug];
      const coverDoc = mediaKey ? mediaMap.get(mediaKey) : null;
      const coverId = coverDoc ? coverDoc.id : null;

      await payload.create({
        collection: 'journal-posts',
        data: {
          slug: entry.slug,
          title: entry.title.en,
          category: entry.category.en,
          excerpt: entry.excerpt?.en || null,
          authorLabel: entry.authorLabel || 'GEMA Team',
          publishDate: entry.publishDate,
          coverImage: coverId,
          _status: 'published',
        },
        overrideAccess: true,
      });

      const createdJrn = await payload.find({
        collection: 'journal-posts',
        where: { slug: { equals: entry.slug } },
        limit: 1,
        overrideAccess: true,
      });
      if (createdJrn.docs[0]) {
        await payload.update({
          collection: 'journal-posts',
          id: createdJrn.docs[0].id,
          data: {
            title: entry.title.id,
            category: entry.category.id,
            excerpt: entry.excerpt?.id || null,
          },
          locale: 'id',
          overrideAccess: true,
        });
      }
      journalCreated++;
    }
  }
  console.log(`✓ JournalPosts: ${journalCreated} created, ${existingJournal.totalDocs} preserved.`);

  // 6. Check & Bootstrap Recognitions
  const existingRecognitions = await payload.find({ collection: 'recognitions', limit: 100, overrideAccess: true });
  let recognitionsCreated = 0;
  if (existingRecognitions.totalDocs === 0) {
    const { recognitions: rawRecs } = await import('../src/content/fixtures/recognition');
    for (const rec of rawRecs) {
      await payload.create({
        collection: 'recognitions',
        data: {
          slug: rec.slug,
          year: rec.year,
          title: rec.title.en,
          awardingBody: rec.awardingBody,
          scope: rec.scope,
          contentStatus: rec.contentStatus,
        },
        overrideAccess: true,
      });
      recognitionsCreated++;
    }
    console.log(`✓ Recognitions: ${recognitionsCreated} created.`);
  } else {
    console.log(`✓ Recognitions: ${existingRecognitions.totalDocs} preserved.`);
  }

  // 7. Check & Bootstrap Globals
  const hp = await payload.findGlobal({ slug: 'homepage', overrideAccess: true });
  if (!hp.hero?.headline) {
    console.log('Homepage Global unset. Bootstrapping initial homepage...');
    await seedHomepage();
  } else {
    console.log('✓ Homepage Global already initialized. Preserved.');
  }

  const ch = await payload.findGlobal({ slug: 'chef', overrideAccess: true });
  if (!ch.name || !ch.portrait) {
    console.log('Chef Global unset. Bootstrapping initial chef...');
    await seedChef();
  } else {
    console.log('✓ Chef Global already initialized. Preserved.');
  }

  const ss = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true });
  if (!ss.phone) {
    console.log('SiteSettings Global unset. Bootstrapping initial site settings...');
    await seedSiteSettings();
  } else {
    console.log('✓ SiteSettings Global already initialized. Preserved.');
  }

  const nav = await payload.findGlobal({ slug: 'navigation', overrideAccess: true });
  if (!nav.headerLinks || nav.headerLinks.length === 0) {
    console.log('Navigation Global unset. Bootstrapping initial navigation...');
    await seedNavigation();
  } else {
    console.log('✓ Navigation Global already initialized. Preserved.');
  }

  // 8. Check & Bootstrap CMS-005 Page Globals (About, Experience, Occasions, Visit, Recognition)
  const about = await payload.findGlobal({ slug: 'about-page', overrideAccess: true });
  if (!about.hero?.headline) {
    console.log('AboutPage Global unset. Bootstrapping CMS-005 page globals...');
    await seedCMS005Pages();
  } else {
    console.log('✓ CMS-005 Page Globals already initialized. Preserved.');
  }

  // 9. Check & Bootstrap CMS-006 Homepage Signature Dishes Curation
  const hpSignatures = await payload.findGlobal({ slug: 'homepage', overrideAccess: true });
  if (!hpSignatures.signatureDishes?.items || hpSignatures.signatureDishes.items.length < 4) {
    console.log('Homepage Signature Dishes unset or incomplete. Bootstrapping CMS-006 signature dishes...');
    await seedCMS006Signatures();
  } else {
    console.log('✓ Homepage Signature Dishes already initialized. Preserved.');
  }

  // 10. Check & Bootstrap CMS-007 Homepage Cuisine Teaser
  const hpCuisine = await payload.findGlobal({ slug: 'homepage', overrideAccess: true });
  if (
    !hpCuisine.cuisineTeaser?.item01?.image ||
    !hpCuisine.cuisineTeaser?.item02?.image ||
    !hpCuisine.cuisineTeaser?.item03?.image ||
    !hpCuisine.cuisineTeaser?.item04?.image
  ) {
    console.log('Homepage Cuisine Teaser unset or incomplete. Bootstrapping CMS-007 cuisine teaser...');
    await seedCuisineTeaser();
  } else {
    console.log('✓ Homepage Cuisine Teaser already initialized. Preserved.');
  }

  console.log('\n=== [INITIAL BOOTSTRAP FINISHED] ===\n');
  return verifyContent(payload);
}

async function verifyContent(payload: Payload) {
  console.log('=== [CMS CONTENT INTEGRITY VERIFICATION] ===');
  const media = await payload.find({ collection: 'media', limit: 500, overrideAccess: true });
  const categories = await payload.find({ collection: 'menu-categories', limit: 100, overrideAccess: true });
  const menuItems = await payload.find({ collection: 'menu-items', limit: 200, overrideAccess: true });
  const events = await payload.find({ collection: 'events', limit: 100, overrideAccess: true });
  const journal = await payload.find({ collection: 'journal-posts', limit: 100, overrideAccess: true });
  const recognitions = await payload.find({ collection: 'recognitions', limit: 100, overrideAccess: true });

  const homepage = await payload.findGlobal({ slug: 'homepage', overrideAccess: true });
  const chef = await payload.findGlobal({ slug: 'chef', overrideAccess: true });
  const pageMedia = await payload.findGlobal({ slug: 'page-media', overrideAccess: true });
  const siteSettings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true });
  const navigation = await payload.findGlobal({ slug: 'navigation', overrideAccess: true });
  const menuPage = await payload.findGlobal({ slug: 'menu-page', overrideAccess: true });
  const about = await payload.findGlobal({ slug: 'about-page', overrideAccess: true });
  const experience = await payload.findGlobal({ slug: 'experience-page', overrideAccess: true });
  const occasions = await payload.findGlobal({ slug: 'occasions-page', overrideAccess: true });
  const visit = await payload.findGlobal({ slug: 'visit-page', overrideAccess: true });
  const recognition = await payload.findGlobal({ slug: 'recognition-page', overrideAccess: true });

  const signatureDishesCount = homepage.signatureDishes?.items?.length || 0;
  const cuisineTeaserConfigured = Boolean(
    homepage.cuisineTeaser?.item01?.image &&
    homepage.cuisineTeaser?.item02?.image &&
    homepage.cuisineTeaser?.item03?.image &&
    homepage.cuisineTeaser?.item04?.image &&
    homepage.cuisineTeaser?.item01?.label &&
    homepage.cuisineTeaser?.item02?.label &&
    homepage.cuisineTeaser?.item03?.label &&
    homepage.cuisineTeaser?.item04?.label
  );

  console.log(`Media Records:         ${media.totalDocs} (expected: 35)`);
  console.log(`Menu Categories:       ${categories.totalDocs} (expected: 20)`);
  console.log(`Menu Items:            ${menuItems.totalDocs} (expected: 118)`);
  console.log(`Events:                ${events.totalDocs} (expected: 6)`);
  console.log(`Journal Posts:         ${journal.totalDocs} (expected: 3)`);
  console.log(`Recognitions:          ${recognitions.totalDocs} (expected: >= 0)`);
  console.log(`Homepage Headline:     "${homepage.hero?.headline || 'NOT SET'}"`);
  console.log(`Homepage Signatures:   ${signatureDishesCount} (expected: 4)`);
  console.log(`Homepage Cuisine:      ${cuisineTeaserConfigured ? 'CONFIGURED (4 slots)' : 'NOT SET'}`);
  console.log(`Chef Name:             "${chef.name || 'NOT SET'}"`);
  console.log(`Site Phone:            "${siteSettings.phone || 'NOT SET'}"`);
  console.log(`Navigation Links:      ${navigation.headerLinks?.length || 0} header, ${navigation.footerLinks?.length || 0} footer`);
  console.log(`PageMedia Menu Food:   ${pageMedia.menu?.foodImage ? 'CONFIGURED' : 'NOT SET'}`);
  console.log(`Menu Page Title:       "${menuPage.title || 'NOT SET'}"`);
  console.log(`About Headline:        "${about.hero?.headline || 'NOT SET'}"`);
  console.log(`Experience Headline:   "${experience.hero?.headline || 'NOT SET'}"`);
  console.log(`Occasions Private:     "${occasions.privateDining?.title || 'NOT SET'}"`);
  console.log(`Visit Note:            "${visit.reservationsNote ? 'CONFIGURED' : 'NOT SET'}"`);
  console.log(`Recognition Kicker:    "${recognition.kicker || 'NOT SET'}"`);

  const isHealthy =
    media.totalDocs >= 35 &&
    categories.totalDocs === 20 &&
    menuItems.totalDocs === 118 &&
    events.totalDocs === 6 &&
    journal.totalDocs === 3 &&
    Boolean(homepage.hero?.headline) &&
    signatureDishesCount === 4 &&
    cuisineTeaserConfigured &&
    Boolean(chef.name) &&
    Boolean(siteSettings.phone) &&
    Boolean(about.hero?.headline) &&
    Boolean(experience.hero?.headline) &&
    Boolean(occasions.privateDining?.title) &&
    Boolean(visit.reservationsNote) &&
    Boolean(recognition.kicker);

  console.log(`\nOverall Content Integrity: [${isHealthy ? 'PASS' : 'FAIL'}]\n`);
  return {
    isHealthy,
    counts: {
      media: media.totalDocs,
      categories: categories.totalDocs,
      menuItems: menuItems.totalDocs,
      events: events.totalDocs,
      journal: journal.totalDocs,
    },
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = process.argv[2] || '--initial';
  const mode: BootstrapMode = arg.replace(/^--/, '') as BootstrapMode;
  runBootstrap(mode)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Bootstrap failed:', err);
      process.exit(1);
    });
}
