import { getPayload } from 'payload';
import config from '../src/payload.config';

const CHEF_BIO_EN = `With over two decades of culinary experience spanning the globe, Chef Mandif Warokka brings a profound understanding of international techniques and flavor profiles to GEMA.

His journey began with a deep appreciation for the fundamental building blocks of European cuisine, which he honed through rigorous training and practice in acclaimed kitchens across Europe and the Middle East before making his mark in Southeast Asia.

Known for his meticulous attention to detail and uncompromising standards, Mandif approaches Italian cuisine not merely as a set of traditional recipes, but as a philosophy of ingredient respect.

At GEMA, he translates this philosophy into a menu that is both elevated and approachable. By insisting on the finest produce and refusing shortcuts, he ensures that every plate leaving the kitchen is a testament to culinary craftsmanship.`;

const CHEF_BIO_ID = `Dengan lebih dari dua dekade pengalaman kuliner di seluruh dunia, Chef Mandif Warokka membawa pemahaman mendalam tentang teknik internasional dan profil rasa ke GEMA.

Perjalanannya dimulai dengan apresiasi mendalam terhadap elemen dasar masakan Eropa, yang diasah melalui pelatihan dan praktik ketat di dapur terkemuka di seluruh Eropa dan Timur Tengah sebelum berkarya di Asia Tenggara.

Dikenal dengan perhatian cermat terhadap detail dan standar tanpa kompromi, Mandif mendekati masakan Italia bukan sekadar sebagai rangkaian resep tradisional, tetapi sebagai filosofi penghormatan terhadap bahan.

Di GEMA, ia menerjemahkan filosofi ini ke dalam menu yang elegan namun tetap mudah dinikmati. Dengan mengutamakan hasil bumi terbaik dan menolak jalan pintas, ia memastikan setiap hidangan yang keluar dari dapur adalah bukti keahlian kuliner sejati.`;

export async function seedChef() {
  console.log('=== [CMS-003] SEEDING CHEF EDITORIAL CONTENT ===');

  const payload = await getPayload({ config });

  // 1. Fetch current Chef global to preserve media relationships
  const currentChef = await payload.findGlobal({
    slug: 'chef',
    overrideAccess: true,
  });

  const portraitId = typeof currentChef.portrait === 'object' ? currentChef.portrait?.id : currentChef.portrait;
  const videoFileId = typeof currentChef.videoFile === 'object' ? currentChef.videoFile?.id : currentChef.videoFile;
  const videoPosterId = typeof currentChef.videoPoster === 'object' ? currentChef.videoPoster?.id : currentChef.videoPoster;

  console.log(`Preserved media relations: portrait=${portraitId}, videoFile=${videoFileId}, videoPoster=${videoPosterId}`);

  // 2. Update EN locale
  await payload.updateGlobal({
    slug: 'chef',
    data: {
      name: 'Mandif Warokka',
      role: 'Culinary Director',
      biography: CHEF_BIO_EN,
      quote: 'Surabaya has a vibrant, sophisticated palate. GEMA is my response to that—a place where technique serves comfort, and every dish is crafted for the table.',
      ctaLabel: 'Meet Chef Mandif',
      previewText: 'More than 20 years cooking across the world. One new vision in Surabaya.',
      portrait: portraitId,
      videoFile: videoFileId,
      videoPoster: videoPosterId,
    },
    locale: 'en',
    overrideAccess: true,
  });

  // 3. Update ID locale
  await payload.updateGlobal({
    slug: 'chef',
    data: {
      role: 'Direktur Kuliner',
      biography: CHEF_BIO_ID,
      quote: 'Surabaya memiliki cita rasa yang hidup dan berkelas. GEMA adalah tanggapan saya untuk itu—tempat di mana teknik melayani kenyamanan, dan setiap hidangan dibuat untuk dinikmati bersama.',
      ctaLabel: 'Kenali Chef Mandif',
      previewText: 'Lebih dari 20 tahun memasak di seluruh dunia. Satu visi baru di Surabaya.',
    },
    locale: 'id',
    overrideAccess: true,
  });

  console.log('✓ Chef Global editorial content seeded for EN and ID.');

  // 4. Verify
  const verifyEn = await payload.findGlobal({ slug: 'chef', locale: 'en', overrideAccess: true });
  const verifyId = await payload.findGlobal({ slug: 'chef', locale: 'id', overrideAccess: true });

  console.log(`Verified Chef name: "${verifyEn.name}"`);
  console.log(`Verified Chef role (EN): "${verifyEn.role}", (ID): "${verifyId.role}"`);
  console.log(`Verified Chef quote (EN): "${verifyEn.quote?.substring(0, 40)}..."`);
  console.log(`Verified Chef CTA (EN): "${verifyEn.ctaLabel}", (ID): "${verifyId.ctaLabel}"`);

  if (!verifyEn.biography || !verifyId.biography || !verifyEn.quote || !verifyId.quote) {
    throw new Error('Chef editorial verification failed!');
  }

  console.log('=== [CMS-003] CHEF SEED COMPLETE & VERIFIED ===\n');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedChef()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Chef seed failed:', err);
      process.exit(1);
    });
}
