import { getPayload } from 'payload';
import config from '../src/payload.config';
import { getHomepageData } from '../src/content/provider';
import { getDictionary } from '../src/i18n/getDictionary';

async function testHomepageDomain() {
  console.log('=== TESTING HOMEPAGE DOMAIN (CMS-003) ===\n');
  const payload = await getPayload({ config });

  // 1. Fetch homepage data for both locales
  const enData = await getHomepageData('en');
  const idData = await getHomepageData('id');

  if (!enData || !idData) {
    console.error('FAIL: Could not retrieve homepage data from Payload Local API.');
    process.exit(1);
  }

  const enDict = getDictionary('en').t;
  const idDict = getDictionary('id').t;

  // 2. Parity assertions
  console.log('1. Checking Hero parity:');
  console.log('   EN Headline:', enData.hero.headline, '===', enDict('home.hero.headline'));
  console.log('   EN Kicker:', enData.hero.kicker, '===', enDict('home.hero.kicker'));
  console.log('   EN Support:', enData.hero.support, '===', enDict('home.hero.support'));
  console.log('   ID Headline:', idData.hero.headline, '===', idDict('home.hero.headline'));
  console.log('   ID Kicker:', idData.hero.kicker, '===', idDict('home.hero.kicker'));
  console.log('   ID Support:', idData.hero.support, '===', idDict('home.hero.support'));

  if (
    enData.hero.headline !== enDict('home.hero.headline') ||
    enData.hero.kicker !== enDict('home.hero.kicker') ||
    enData.hero.support !== enDict('home.hero.support') ||
    idData.hero.headline !== idDict('home.hero.headline') ||
    idData.hero.kicker !== idDict('home.hero.kicker') ||
    idData.hero.support !== idDict('home.hero.support')
  ) {
    console.error('FAIL: Hero content parity check failed.');
    process.exit(1);
  }

  console.log('2. Checking Positioning & Other Editorial Sections:');
  console.log('   EN Positioning:', enData.positioning.text, '===', enDict('home.positioning.text'));
  console.log('   ID Positioning:', idData.positioning.text, '===', idDict('home.positioning.text'));
  console.log('   EN Chef Preview:', enData.chefPreview.text, '===', enDict('home.chef.text'));
  console.log('   ID Chef Preview:', idData.chefPreview.text, '===', idDict('home.chef.text'));
  console.log('   EN Journal:', enData.journalIntro.title, '===', enDict('home.journal.title'));
  console.log('   ID Journal:', idData.journalIntro.title, '===', idDict('home.journal.title'));

  if (
    enData.positioning.text !== enDict('home.positioning.text') ||
    idData.positioning.text !== idDict('home.positioning.text') ||
    enData.chefPreview.text !== enDict('home.chef.text') ||
    idData.chefPreview.text !== idDict('home.chef.text') ||
    enData.journalIntro.title !== enDict('home.journal.title') ||
    idData.journalIntro.title !== idDict('home.journal.title')
  ) {
    console.error('FAIL: Editorial sections parity check failed.');
    process.exit(1);
  }

  console.log('\n3. Direct CMS Edit Test:');
  const rawHomepageEn = await payload.findGlobal({
    slug: 'homepage',
    locale: 'en',
    depth: 0,
  });

  const originalHeadline = rawHomepageEn.hero?.headline || enData.hero.headline;
  const testHeadline = 'TEMPORARY CMS HEADLINE TEST';

  console.log(`   Updating hero.headline in EN to: "${testHeadline}"...`);
  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'en',
    data: {
      hero: {
        ...rawHomepageEn.hero,
        headline: testHeadline,
      },
    },
  });

  const updatedData = await getHomepageData('en');
  console.log(`   Observed hero.headline in EN: "${updatedData?.hero.headline}"`);
  if (updatedData?.hero.headline !== testHeadline) {
    console.error('FAIL: Direct CMS edit did not reflect in getHomepageData!');
    process.exit(1);
  }

  console.log(`   Restoring hero.headline in EN to: "${originalHeadline}"...`);
  await payload.updateGlobal({
    slug: 'homepage',
    locale: 'en',
    data: {
      hero: {
        ...rawHomepageEn.hero,
        headline: originalHeadline,
      },
    },
  });

  const restoredData = await getHomepageData('en');
  if (restoredData?.hero.headline !== originalHeadline) {
    console.error('FAIL: Direct CMS edit could not be restored!');
    process.exit(1);
  }
  console.log('   Direct CMS edit successfully verified and restored.');

  console.log('\n=== HOMEPAGE DOMAIN TEST PASS ===');
  process.exit(0);
}

testHomepageDomain().catch((err) => {
  console.error('Error during Homepage domain test:', err);
  process.exit(1);
});
