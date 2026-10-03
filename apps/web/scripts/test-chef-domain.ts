import { getPayload } from 'payload';
import config from '../src/payload.config';
import { getChefData } from '../src/content/provider';

async function testChefDomain() {
  console.log('=== [CMS-003 QA] TESTING DOMAIN 4: CHEF EDITORIAL ===\n');

  // 1. Fetch Chef Data for both locales
  const chefEn = await getChefData('en');
  const chefId = await getChefData('id');

  if (!chefEn || !chefId) {
    throw new Error('Failed to fetch chef data from Payload!');
  }

  console.log(`Chef Name: "${chefEn.name}"`);
  console.log(`Chef Role (EN): "${chefEn.role}"`);
  console.log(`Chef Role (ID): "${chefId.role}"`);
  console.log(`Chef Quote (EN): "${chefEn.quote}"`);
  console.log(`Chef Quote (ID): "${chefId.quote}"`);
  console.log(`Chef Portrait: "${chefEn.portrait?.src}"`);
  console.log(`Chef Video: "${chefEn.video?.src}"`);

  if (chefEn.name !== 'Mandif Warokka') throw new Error('Chef name mismatch!');
  if (chefEn.role !== 'Culinary Director') throw new Error('Chef EN role mismatch!');
  if (chefId.role !== 'Direktur Kuliner') throw new Error('Chef ID role mismatch!');
  if (!chefEn.portrait?.src || !chefEn.video?.src) throw new Error('Chef media relations missing!');
  if (!chefEn.biography.includes('With over two decades')) throw new Error('Chef EN biography missing content!');
  if (!chefId.biography.includes('Dengan lebih dari dua dekade')) throw new Error('Chef ID biography missing content!');

  console.log('✓ Chef editorial content and media relations verified.');

  // 2. Direct CMS Edit Test
  console.log('\n--- Direct CMS Edit Test on Chef Global ---');
  const payload = await getPayload({ config });
  const originalQuote = chefEn.quote;

  console.log('Updating Chef quote in Payload...');
  await payload.updateGlobal({
    slug: 'chef',
    data: {
      quote: 'CMS-EDIT-TEST: The kitchen is a sanctuary of craftsmanship.',
    },
    locale: 'en',
    overrideAccess: true,
  });

  const publicAfterEdit = await getChefData('en');
  console.log(`Public quote after edit: "${publicAfterEdit?.quote}"`);
  if (publicAfterEdit?.quote !== 'CMS-EDIT-TEST: The kitchen is a sanctuary of craftsmanship.') {
    throw new Error('Direct CMS edit not reflected in public chef provider!');
  }
  console.log('✓ Direct CMS edit reflected in public provider.');

  console.log('Restoring original Chef quote in Payload...');
  await payload.updateGlobal({
    slug: 'chef',
    data: {
      quote: originalQuote,
    },
    locale: 'en',
    overrideAccess: true,
  });

  const publicRestored = await getChefData('en');
  if (publicRestored?.quote !== originalQuote) {
    throw new Error('Failed to restore original Chef quote!');
  }
  console.log('✓ Original quote successfully restored.');

  console.log('\n=== DOMAIN 4: CHEF EDITORIAL PASS ===\n');
}

testChefDomain()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Chef domain test failed:', err);
    process.exit(1);
  });
