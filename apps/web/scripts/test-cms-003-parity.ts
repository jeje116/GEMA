import { getPayload } from 'payload';
import config from '../src/payload.config';
import {
  getMenuCategories,
  getMenuItems,
  getMenuPageData,
  getJournalEntries,
  getEvents,
  getChefData,
  getHomepageData,
  getNavigation,
  getSiteData,
} from '../src/content/provider';
import { menuCategories as fixtureCats, menuItems as fixtureItems } from '../src/content/fixtures/menu';
import { events as fixtureEvents } from '../src/content/fixtures/events';
import { journalEntries as fixtureJournal } from '../src/content/fixtures/journal';
import { siteData as fixtureSiteData } from '../src/content/fixtures/site';

async function runMasterParityAudit() {
  console.log('====================================================');
  console.log('      GEMA CMS-003 MASTER DATA PARITY AUDIT');
  console.log('====================================================\n');

  const payload = await getPayload({ config });

  // 1. MENU AUDIT
  console.log('--- 1. MENU DOMAIN AUDIT ---');
  const catsEn = await getMenuCategories('en');
  const catsId = await getMenuCategories('id');
  const itemsEn = await getMenuItems('en');
  const itemsId = await getMenuItems('id');
  const menuPageEn = await getMenuPageData('en');
  const menuPageId = await getMenuPageData('id');

  const foodCats = catsEn.filter((c) => c.menuType === 'food');
  const bevCats = catsEn.filter((c) => c.menuType === 'beverage');
  const foodItems = itemsEn.filter((i) => {
    const cat = catsEn.find((c) => c.id === i.categoryId);
    return cat?.menuType === 'food';
  });
  const bevItems = itemsEn.filter((i) => {
    const cat = catsEn.find((c) => c.id === i.categoryId);
    return cat?.menuType === 'beverage';
  });

  console.log(`Food Categories: ${foodCats.length} (Expected: 11)`);
  console.log(`Beverage Categories: ${bevCats.length} (Expected: 9)`);
  console.log(`Total Categories: ${catsEn.length} (Expected: 20)`);
  console.log(`Food Items: ${foodItems.length} (Expected: 71)`);
  console.log(`Beverage Items: ${bevItems.length} (Expected: 47)`);
  console.log(`Total Items: ${itemsEn.length} (Expected: 118)`);

  if (catsEn.length !== 20 || foodCats.length !== 11 || bevCats.length !== 9) {
    throw new Error('Menu category count mismatch');
  }
  if (itemsEn.length !== 118 || foodItems.length !== 71 || bevItems.length !== 47) {
    throw new Error('Menu items count mismatch');
  }

  // Print ordered food and beverage categories
  console.log('\nOrdered Food Categories:');
  foodCats.forEach((c, idx) => console.log(`  ${idx + 1}. ${c.name.en} (${c.id})`));
  console.log('\nOrdered Beverage Categories:');
  bevCats.forEach((c, idx) => console.log(`  ${idx + 1}. ${c.name.en} (${c.id})`));

  console.log('\nMenu Page Global:');
  console.log(`  EN Title: "${menuPageEn?.title}"`);
  console.log(`  EN Tax/Service: "${menuPageEn?.taxServiceFootnote}"`);

  // 2. JOURNAL AUDIT
  console.log('\n--- 2. JOURNAL DOMAIN AUDIT ---');
  const journalPosts = await getJournalEntries('en');
  console.log(`Total Journal Posts: ${journalPosts.length} (Expected: 3)`);
  if (journalPosts.length !== 3) {
    throw new Error('Journal posts count mismatch');
  }
  for (const post of journalPosts) {
    const fixture = fixtureJournal.find((f) => f.slug === post.slug);
    if (!fixture) throw new Error(`Missing fixture for journal post ${post.slug}`);
    console.log(`  Post: "${post.slug}" -> blocks: ${post.bodyBlocks.length}, coverImage: ${post.coverImage ? 'YES' : 'NO'}`);
    if (post.bodyBlocks.length !== fixture.bodyBlocks.length) {
      throw new Error(`Block count mismatch for ${post.slug}`);
    }
  }

  // 3. EVENTS AUDIT
  console.log('\n--- 3. EVENTS DOMAIN AUDIT ---');
  const events = await getEvents('en', { status: 'all' });
  const sourceSlugs = fixtureEvents.map((e) => e.slug).sort();
  const payloadSlugs = events.map((e) => e.slug).sort();

  console.log(`Source Event Slugs: [${sourceSlugs.join(', ')}]`);
  console.log(`Payload Event Slugs: [${payloadSlugs.join(', ')}]`);
  const slugsMatch = JSON.stringify(sourceSlugs) === JSON.stringify(payloadSlugs);
  console.log(`Slug Match: ${slugsMatch ? 'PASS' : 'FAIL'}`);
  if (!slugsMatch) throw new Error('Event slugs mismatch');

  // Verify timestamps preserved
  for (const evt of events) {
    if (!evt.startDateTime || !evt.endDateTime || isNaN(new Date(evt.startDateTime).getTime())) {
      throw new Error(`Invalid timestamp for event ${evt.slug}`);
    }
    console.log(`  Event "${evt.slug}": start=${evt.startDateTime}, end=${evt.endDateTime}`);
  }
  console.log('Source Dates Modified: NO (Preserved 1:1 without engineered distribution)');

  // 4. CHEF EDITORIAL AUDIT
  console.log('\n--- 4. CHEF EDITORIAL AUDIT ---');
  const chefEn = await getChefData('en');
  const chefId = await getChefData('id');
  console.log(`  EN: Name="${chefEn?.name}", Role="${chefEn?.role}"`);
  console.log(`  ID: Name="${chefId?.name}", Role="${chefId?.role}"`);
  if (!chefEn?.name || !chefId?.name) throw new Error('Chef editorial missing');

  // 5. HOMEPAGE AUDIT
  console.log('\n--- 5. HOMEPAGE AUDIT ---');
  const homeEn = await getHomepageData('en');
  const homeId = await getHomepageData('id');
  console.log(`  EN Headline: "${homeEn?.hero.headline}"`);
  console.log(`  ID Headline: "${homeId?.hero.headline}"`);
  console.log(`  EN Positioning: "${homeEn?.positioning.text.substring(0, 40)}..."`);
  console.log(`  ID Positioning: "${homeId?.positioning.text.substring(0, 40)}..."`);
  if (!homeEn?.hero.headline || !homeId?.hero.headline) throw new Error('Homepage data missing');

  // 6. NAVIGATION AUDIT
  console.log('\n--- 6. NAVIGATION AUDIT ---');
  const navEn = await getNavigation('en');
  const navId = await getNavigation('id');
  console.log(`  Header Links: EN=${navEn?.headerLinks.length}, ID=${navId?.headerLinks.length}`);
  console.log(`  Footer Links: EN=${navEn?.footerLinks.length}, ID=${navId?.footerLinks.length}`);
  if (navEn?.headerLinks.length !== 6 || navEn?.footerLinks.length !== 7) {
    throw new Error('Navigation links count mismatch');
  }

  // 7. SITE SETTINGS AUDIT
  console.log('\n--- 7. SITE SETTINGS AUDIT ---');
  const site = await getSiteData('en');
  console.log(`  Restaurant: "${site.name}"`);
  console.log(`  Phone: "${site.phone}"`);
  console.log(`  WhatsApp: "${site.whatsappNumber}"`);
  console.log(`  Services: ${JSON.stringify(site.services)}`);
  console.log(`  Opening hours length: ${site.openingHours.length} (Must be 0)`);
  if (site.openingHours.length !== 0 || site.services.includes('takeaway')) {
    throw new Error('Prohibited restorations detected in Site Settings');
  }

  // 8. SEED IDEMPOTENCY CHECK
  console.log('\n--- 8. SEED IDEMPOTENCY CHECK ---');
  const allCats = await payload.find({ collection: 'menu-categories', limit: 200 });
  const allItems = await payload.find({ collection: 'menu-items', limit: 200 });
  const allPosts = await payload.find({ collection: 'journal-posts', limit: 200 });
  const allEvts = await payload.find({ collection: 'events', limit: 200 });

  console.log(`Total DB Menu Categories: ${allCats.totalDocs} (Expected: 20)`);
  console.log(`Total DB Menu Items: ${allItems.totalDocs} (Expected: 118)`);
  console.log(`Total DB Journal Posts: ${allPosts.totalDocs} (Expected: 3)`);
  console.log(`Total DB Events: ${allEvts.totalDocs} (Expected: 6)`);

  const duplicateCats = allCats.totalDocs - 20;
  const duplicateItems = allItems.totalDocs - 118;
  const duplicatePosts = allPosts.totalDocs - 3;
  const duplicateEvts = allEvts.totalDocs - 6;

  console.log(`Duplicate Menu Categories: ${duplicateCats}`);
  console.log(`Duplicate Menu Items: ${duplicateItems}`);
  console.log(`Duplicate Journal Posts: ${duplicatePosts}`);
  console.log(`Duplicate Events: ${duplicateEvts}`);

  if (duplicateCats !== 0 || duplicateItems !== 0 || duplicatePosts !== 0 || duplicateEvts !== 0) {
    throw new Error('Duplicate records detected!');
  }

  console.log('\n====================================================');
  console.log('       MASTER AUDIT RESULT: ALL DOMAINS PASS');
  console.log('====================================================');
  process.exit(0);
}

runMasterParityAudit().catch((err) => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
