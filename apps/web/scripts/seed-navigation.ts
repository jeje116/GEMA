import { getPayload } from 'payload';
import config from '../src/payload.config';

async function seedNavigation() {
  console.log('=== SEEDING NAVIGATION GLOBAL (CMS-003) ===\n');
  const payload = await getPayload({ config });

  const enHeaderLinks = [
    { label: 'Menu', url: '/menu' },
    { label: 'Experience', url: '/experience' },
    { label: 'Events', url: '/events' },
    { label: 'Occasions', url: '/occasions' },
    { label: 'About', url: '/about' },
    { label: 'Visit', url: '/visit' },
  ];

  const idHeaderLinks = [
    { label: 'Menu', url: '/menu' },
    { label: 'Pengalaman', url: '/experience' },
    { label: 'Acara', url: '/events' },
    { label: 'Acara Khusus', url: '/occasions' },
    { label: 'Tentang', url: '/about' },
    { label: 'Kunjungi', url: '/visit' },
  ];

  const enFooterLinks = [
    { label: 'Menu', url: '/menu' },
    { label: 'Experience', url: '/experience' },
    { label: 'Occasions', url: '/occasions' },
    { label: 'Events', url: '/events' },
    { label: 'About', url: '/about' },
    { label: 'Journal', url: '/journal' },
    { label: 'Recognition', url: '/recognition' },
  ];

  const idFooterLinks = [
    { label: 'Menu', url: '/menu' },
    { label: 'Pengalaman', url: '/experience' },
    { label: 'Acara Khusus', url: '/occasions' },
    { label: 'Acara', url: '/events' },
    { label: 'Tentang', url: '/about' },
    { label: 'Jurnal', url: '/journal' },
    { label: 'Pengakuan', url: '/recognition' },
  ];

  console.log('Seeding Navigation for EN...');
  const enResult = await payload.updateGlobal({
    slug: 'navigation',
    locale: 'en',
    overrideAccess: true,
    data: {
      headerLinks: enHeaderLinks,
      footerLinks: enFooterLinks,
    },
  });

  console.log('Seeding Navigation for ID...');
  const idHeaderWithIds = idHeaderLinks.map((link, i) => ({
    id: enResult.headerLinks?.[i]?.id,
    ...link,
  }));
  const idFooterWithIds = idFooterLinks.map((link, i) => ({
    id: enResult.footerLinks?.[i]?.id,
    ...link,
  }));

  await payload.updateGlobal({
    slug: 'navigation',
    locale: 'id',
    overrideAccess: true,
    data: {
      headerLinks: idHeaderWithIds,
      footerLinks: idFooterWithIds,
    },
  });

  console.log('\n=== NAVIGATION GLOBAL SEEDED SUCCESSFULLY ===');
}

export { seedNavigation };

if (import.meta.url === `file://${process.argv[1]}`) {
  seedNavigation()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Error seeding Navigation:', err);
      process.exit(1);
    });
}
