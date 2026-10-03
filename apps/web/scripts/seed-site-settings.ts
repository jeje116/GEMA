import { getPayload } from 'payload';
import config from '../src/payload.config';
import { siteData } from '../src/content/fixtures/site';

async function seedSiteSettings() {
  console.log('=== SEEDING SITE SETTINGS GLOBAL (CMS-003) ===\n');
  const payload = await getPayload({ config });

  console.log('Updating site-settings with preserved operational facts:');
  console.log('   restaurantName:', siteData.name);
  console.log('   fullAddress:', siteData.fullAddress);
  console.log('   phone:', siteData.phone);
  console.log('   whatsappNumber:', siteData.whatsappNumber);
  console.log('   email:', siteData.email);
  console.log('   instagramUrl:', siteData.instagramUrl);
  console.log('   tiktokUrl: https://www.tiktok.com/@gemarestaurant');
  console.log('   mapUrl:', siteData.mapUrl);
  console.log('   services:', siteData.services);

  await payload.updateGlobal({
    slug: 'site-settings',
    overrideAccess: true,
    data: {
      restaurantName: siteData.name,
      fullAddress: siteData.fullAddress,
      phone: siteData.phone,
      whatsappNumber: siteData.whatsappNumber,
      email: siteData.email,
      instagramUrl: siteData.instagramUrl,
      tiktokUrl: 'https://www.tiktok.com/@gemarestaurant',
      mapUrl: siteData.mapUrl,
      dietaryPolicy: 'No Pork, No Lard',
      services: ['dine-in'],
    },
  });

  console.log('\n=== SITE SETTINGS GLOBAL SEEDED SUCCESSFULLY ===');
}

export { seedSiteSettings };

if (import.meta.url === `file://${process.argv[1]}`) {
  seedSiteSettings()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Error seeding Site Settings:', err);
      process.exit(1);
    });
}
