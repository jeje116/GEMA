import { getPayload } from 'payload';
import config from '../src/payload.config';
import { getSiteData } from '../src/content/provider';
import { siteData as fixtureSiteData } from '../src/content/fixtures/site';

async function testSiteSettingsDomain() {
  console.log('=== TESTING SITE SETTINGS DOMAIN (CMS-003) ===\n');
  const payload = await getPayload({ config });

  // 1. Fetch site data from provider
  const liveSiteData = await getSiteData('en');

  console.log('1. Checking preserved operational values parity:');
  console.log('   Name:', liveSiteData.name, '===', fixtureSiteData.name);
  console.log('   Full Address:', liveSiteData.fullAddress, '===', fixtureSiteData.fullAddress);
  console.log('   Phone:', liveSiteData.phone, '===', fixtureSiteData.phone);
  console.log('   WhatsApp:', liveSiteData.whatsappNumber, '===', fixtureSiteData.whatsappNumber);
  console.log('   Email:', liveSiteData.email, '===', fixtureSiteData.email);
  console.log('   Instagram:', liveSiteData.instagramUrl, '===', fixtureSiteData.instagramUrl);
  console.log('   Map URL:', liveSiteData.mapUrl, '===', fixtureSiteData.mapUrl);
  console.log('   Services:', JSON.stringify(liveSiteData.services), '===', JSON.stringify(fixtureSiteData.services));

  if (
    liveSiteData.name !== fixtureSiteData.name ||
    liveSiteData.fullAddress !== fixtureSiteData.fullAddress ||
    liveSiteData.phone !== fixtureSiteData.phone ||
    liveSiteData.whatsappNumber !== fixtureSiteData.whatsappNumber ||
    liveSiteData.email !== fixtureSiteData.email ||
    liveSiteData.instagramUrl !== fixtureSiteData.instagramUrl ||
    liveSiteData.mapUrl !== fixtureSiteData.mapUrl ||
    JSON.stringify(liveSiteData.services) !== JSON.stringify(fixtureSiteData.services)
  ) {
    console.error('FAIL: Site settings operational values parity check failed.');
    process.exit(1);
  }

  // 2. Prohibited restorations check
  console.log('\n2. Checking Prohibited Restorations (Section 21):');
  console.log('   openingHours length:', liveSiteData.openingHours.length, '(Must be 0)');
  if (liveSiteData.openingHours.length !== 0) {
    console.error('FAIL: Prohibited opening hours detected.');
    process.exit(1);
  }
  console.log('   services includes "takeaway":', liveSiteData.services.includes('takeaway'), '(Must be false)');
  if (liveSiteData.services.includes('takeaway')) {
    console.error('FAIL: Prohibited "takeaway" service detected.');
    process.exit(1);
  }

  // 3. Direct CMS Edit Test
  console.log('\n3. Direct CMS Edit Test:');
  const originalPhone = liveSiteData.phone;
  const testPhone = '+62 800-TEST-000';

  console.log(`   Updating phone to: "${testPhone}"...`);
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      phone: testPhone,
    },
  });

  const updatedSiteData = await getSiteData('en');
  console.log(`   Observed phone in getSiteData(): "${updatedSiteData.phone}"`);
  if (updatedSiteData.phone !== testPhone) {
    console.error('FAIL: Direct CMS edit did not reflect in getSiteData!');
    process.exit(1);
  }

  console.log(`   Restoring original phone: "${originalPhone}"...`);
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      phone: originalPhone,
    },
  });

  const restoredSiteData = await getSiteData('en');
  if (restoredSiteData.phone !== originalPhone) {
    console.error('FAIL: Direct CMS edit could not be restored!');
    process.exit(1);
  }
  console.log('   Direct CMS edit successfully verified and restored.');

  console.log('\n=== SITE SETTINGS DOMAIN TEST PASS ===');
  process.exit(0);
}

testSiteSettingsDomain().catch((err) => {
  console.error('Error during Site Settings domain test:', err);
  process.exit(1);
});
