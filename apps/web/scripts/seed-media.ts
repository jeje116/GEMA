import { getPayload } from 'payload';
import config from '../src/payload.config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface UniqueAssetDef {
  sourceKey: string;
  sourceType: 'local' | 'remote';
  source: string; // relative to public/ or remote URL
  filename: string;
  mimetype: string;
  alt: { en: string; id?: string };
}

const UNIQUE_ASSETS: UniqueAssetDef[] = [
  // Homepage assets
  {
    sourceKey: 'home.hero.open-kitchen',
    sourceType: 'local',
    source: 'media/hero/home-hero-open-kitchen.jpg',
    filename: 'home-hero-open-kitchen.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'GEMA Open Kitchen' },
  },
  {
    sourceKey: 'home.teaser.antipasti',
    sourceType: 'local',
    source: 'media/teaser/home-menu-teaser-antipasti.jpg',
    filename: 'home-menu-teaser-antipasti.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'GEMA Antipasti — Crispy Fritto Misto' },
  },
  {
    sourceKey: 'home.teaser.pasta',
    sourceType: 'local',
    source: 'media/teaser/home-menu-teaser-pasta.jpg',
    filename: 'home-menu-teaser-pasta.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'GEMA Pasta — Fresh Spaghetti Sauté Plating' },
  },
  {
    sourceKey: 'home.teaser.grill',
    sourceType: 'local',
    source: 'media/teaser/home-menu-teaser-grill.jpg',
    filename: 'home-menu-teaser-grill.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'GEMA Woodfire & Grill — Sliced Grilled Wagyu Steak' },
  },
  {
    sourceKey: 'home.teaser.dolci',
    sourceType: 'local',
    source: 'media/teaser/home-menu-teaser-dolci.jpg',
    filename: 'home-menu-teaser-dolci.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'GEMA Dolci — Cocoa Dusted Signature Tiramisu' },
  },
  {
    sourceKey: 'home.signature.steak',
    sourceType: 'local',
    source: 'media/signature/home-signature-steak.jpg',
    filename: 'home-signature-steak.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'Toploin Kiwami Eye Fillet MB9+' },
  },
  {
    sourceKey: 'home.signature.tiramisu',
    sourceType: 'local',
    source: 'media/signature/home-signature-tiramisu.jpg',
    filename: 'home-signature-tiramisu.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'Classic Tiramisu' },
  },
  {
    sourceKey: 'home.space.indoor',
    sourceType: 'local',
    source: 'media/experience/home-experience-indoor.jpg',
    filename: 'home-experience-indoor.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'GEMA Indoor Dining Room Architecture' },
  },
  {
    sourceKey: 'home.space.patio',
    sourceType: 'local',
    source: 'media/experience/home-experience-patio.jpg',
    filename: 'home-experience-patio.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'GEMA Lush Garden Patio Dining' },
  },

  // Chef assets
  {
    sourceKey: 'chef.mandif.home-video',
    sourceType: 'local',
    source: 'media/video/chef-home-loop.mp4',
    filename: 'chef-home-loop.mp4',
    mimetype: 'video/mp4',
    alt: { en: 'Chef Mandif Warokka culinary preparation loop' },
  },
  {
    sourceKey: 'chef.mandif.home-video-poster',
    sourceType: 'remote',
    source: 'https://lh3.googleusercontent.com/d/1-FyV-tjBSYFPREnlLVztF09dCSut5Zv8',
    filename: 'chef-home-video-poster.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'Chef Mandif Warokka Video Poster' },
  },
  {
    sourceKey: 'chef.mandif.portrait',
    sourceType: 'local',
    source: 'media/chef/chef-mandif-warokka.jpg',
    filename: 'chef-mandif-warokka.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'Chef Mandif Warokka' },
  },

  // Menu contextual panels
  {
    sourceKey: 'menu.panel.food',
    sourceType: 'local',
    source: 'media/menu/menu-food-overview.jpg',
    filename: 'menu-food-overview.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'A selection of dishes served at GEMA', id: 'Pilihan hidangan yang disajikan di GEMA' },
  },
  {
    sourceKey: 'menu.panel.beverage',
    sourceType: 'local',
    source: 'media/menu/menu-beverage-cocktail.jpg',
    filename: 'menu-beverage-cocktail.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'A cocktail being prepared at GEMA', id: 'Koktail sedang disiapkan di GEMA' },
  },

  // About assets
  {
    sourceKey: 'about.origin',
    sourceType: 'local',
    source: 'media/about/about-origin.jpg',
    filename: 'about-origin.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'GEMA branded tableware detail' },
  },
  {
    sourceKey: 'about.philosophy',
    sourceType: 'local',
    source: 'media/about/about-philosophy.jpg',
    filename: 'about-philosophy.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'Culinary spices and aromatics' },
  },
  {
    sourceKey: 'about.architecture',
    sourceType: 'local',
    source: 'media/about/about-architecture.jpg',
    filename: 'about-architecture.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'GEMA interior architecture' },
  },

  // Experience assets
  {
    sourceKey: 'experience.hero',
    sourceType: 'local',
    source: 'media/experience/experience-hero.jpg',
    filename: 'experience-hero.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'GEMA dining room and garden terrace' },
  },
  {
    sourceKey: 'experience.morning',
    sourceType: 'local',
    source: 'media/experience/experience-day-morning.jpg',
    filename: 'experience-day-morning.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'Morning dining table at GEMA' },
  },
  {
    sourceKey: 'experience.evening',
    sourceType: 'remote',
    source: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80',
    filename: 'experience-evening.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'Evening atmosphere' },
  },
  {
    sourceKey: 'experience.details',
    sourceType: 'local',
    source: 'media/experience/experience-culinary-details.jpg',
    filename: 'experience-culinary-details.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'GEMA branded tableware and hospitality details' },
  },

  // Occasions assets
  {
    sourceKey: 'occasions.hero',
    sourceType: 'local',
    source: 'media/occasions/occasions-hero.jpg',
    filename: 'occasions-hero.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'GEMA Occasions' },
  },
  {
    sourceKey: 'occasions.private-dining',
    sourceType: 'local',
    source: 'media/occasions/occasions-private-dining.jpg',
    filename: 'occasions-private-dining.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'Private Dinings' },
  },
  {
    sourceKey: 'occasions.wedding',
    sourceType: 'remote',
    source: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80',
    filename: 'occasions-wedding.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'Weddings' },
  },
  {
    sourceKey: 'occasions.birthday',
    sourceType: 'remote',
    source: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80',
    filename: 'occasions-birthday.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'Birthdays' },
  },
  {
    sourceKey: 'occasions.brand.mondial',
    sourceType: 'remote',
    source: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80',
    filename: 'occasions-brand-mondial.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'Mondial' },
  },
  {
    sourceKey: 'occasions.brand.frank-co',
    sourceType: 'remote',
    source: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80',
    filename: 'occasions-brand-frank-co.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'Frank & Co' },
  },
  {
    sourceKey: 'occasions.brand.maharva',
    sourceType: 'remote',
    source: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?auto=format&fit=crop&q=80',
    filename: 'occasions-brand-maharva.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'Maharva' },
  },

  // Events unique assets
  {
    sourceKey: 'events.private-table-series',
    sourceType: 'remote',
    source: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80',
    filename: 'event-private-table-series.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'Private Table Series' },
  },
  {
    sourceKey: 'events.seasonal-tasting',
    sourceType: 'remote',
    source: 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&q=80',
    filename: 'event-seasonal-tasting.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'Seasonal Tasting' },
  },
  {
    sourceKey: 'events.sunday-society',
    sourceType: 'remote',
    source: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80',
    filename: 'event-sunday-society.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'Sunday Society' },
  },

  // Deduplicated Shared assets
  {
    sourceKey: 'shared.unsplash.1551183053-bf91a1d81141',
    sourceType: 'remote',
    source: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80',
    filename: 'shared-unsplash-1551183053.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'Italian Culinary Experience' },
  },
  {
    sourceKey: 'shared.unsplash.1513104890138-7c749659a591',
    sourceType: 'remote',
    source: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80',
    filename: 'shared-unsplash-1513104890.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'Wood-Fired Pizza and Craft' },
  },
  {
    sourceKey: 'shared.unsplash.1517248135467-4c7edcad34c4',
    sourceType: 'remote',
    source: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80',
    filename: 'shared-unsplash-1517248135.jpg',
    mimetype: 'image/jpeg',
    alt: { en: 'A Table for Two at GEMA' },
  },

  // Journal specific
  {
    sourceKey: 'journal.fresh-pasta.cover',
    sourceType: 'remote',
    source: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&q=80',
    filename: 'journal-fresh-pasta.jpg',
    mimetype: 'image/jpeg',
    alt: { en: "Inside GEMA's Fresh Pasta" },
  },
];

async function runSeed() {
  console.log('Initializing Payload...');
  const payload = await getPayload({ config });

  const publicDir = path.resolve(__dirname, '../public');
  const cmsMediaDir = path.resolve(publicDir, 'media/cms');
  if (!fs.existsSync(cmsMediaDir)) {
    fs.mkdirSync(cmsMediaDir, { recursive: true });
  }

  const mediaRecordMap = new Map<string, any>();

  console.log(`Processing ${UNIQUE_ASSETS.length} unique media assets...`);

  for (const asset of UNIQUE_ASSETS) {
    // Check if already seeded
    const existing = await payload.find({
      collection: 'media',
      where: {
        sourceKey: {
          equals: asset.sourceKey,
        },
      },
      overrideAccess: true,
    });

    if (existing.totalDocs > 0) {
      console.log(`✓ Exists: [${asset.sourceKey}] (ID: ${existing.docs[0].id})`);
      mediaRecordMap.set(asset.sourceKey, existing.docs[0]);
      continue;
    }

    console.log(`→ Importing: [${asset.sourceKey}]...`);
    let fileBuffer: Buffer;

    if (asset.sourceType === 'local') {
      const localPath = path.resolve(publicDir, asset.source);
      if (!fs.existsSync(localPath)) {
        throw new Error(`Local file not found: ${localPath}`);
      }
      fileBuffer = fs.readFileSync(localPath);
    } else {
      console.log(`  Downloading remote: ${asset.source}`);
      const res = await fetch(asset.source);
      if (!res.ok) {
        throw new Error(`Failed to download ${asset.source}: HTTP ${res.status}`);
      }
      const arrayBuffer = await res.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
    }

    // Save to CMS directory (local development fallback only)
    const isR2Configured = Boolean(
      process.env.R2_BUCKET &&
      process.env.R2_ENDPOINT &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_PUBLIC_URL
    );
    if (!isR2Configured) {
      const targetFilePath = path.resolve(cmsMediaDir, asset.filename);
      fs.writeFileSync(targetFilePath, fileBuffer);
    }

    // Create Media record in Payload (uploads to R2 if configured, else saves to staticDir)
    const createdMedia = await payload.create({
      collection: 'media',
      data: {
        sourceKey: asset.sourceKey,
        alt: asset.alt.en,
        caption: '',
      },
      file: {
        data: fileBuffer,
        name: asset.filename,
        mimetype: asset.mimetype,
        size: fileBuffer.length,
      },
      overrideAccess: true,
    });

    // If ID alt exists, update ID localization
    if (asset.alt.id) {
      await payload.update({
        collection: 'media',
        id: createdMedia.id,
        locale: 'id',
        data: {
          alt: asset.alt.id,
        },
        overrideAccess: true,
      });
    }

    console.log(`  ✓ Created Media record ID: ${createdMedia.id}`);
    mediaRecordMap.set(asset.sourceKey, createdMedia);
  }

  console.log(`\nAll ${UNIQUE_ASSETS.length} unique media records ready.`);

  // 1. Update Homepage Global
  console.log('Populating Homepage Global media relationships...');
  const heroMedia = mediaRecordMap.get('home.hero.open-kitchen');
  const antipastiMedia = mediaRecordMap.get('home.teaser.antipasti');
  const pastaMedia = mediaRecordMap.get('home.teaser.pasta');
  const grillMedia = mediaRecordMap.get('home.teaser.grill');
  const dolciMedia = mediaRecordMap.get('home.teaser.dolci');
  const spaceIndoor = mediaRecordMap.get('home.space.indoor');
  const spacePatio = mediaRecordMap.get('home.space.patio');
  const sigSteak = mediaRecordMap.get('home.signature.steak');
  const sigTiramisu = mediaRecordMap.get('home.signature.tiramisu');
  const sigPizzetta1 = mediaRecordMap.get('shared.unsplash.1551183053-bf91a1d81141');
  const sigPizzetta2 = mediaRecordMap.get('shared.unsplash.1513104890138-7c749659a591');

  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      hero: {
        image: heroMedia.id,
      },
      cuisineTeaser: {
        item01: { label: 'Antipasti', image: antipastiMedia.id },
        item02: { label: 'Primi Piatti', image: pastaMedia.id },
        item03: { label: 'Secondi & Grill', image: grillMedia.id },
        item04: { label: 'Dolci', image: dolciMedia.id },
      },
      space: {
        imagePrimary: spaceIndoor.id,
        imageSecondary: spacePatio.id,
      },
      _status: 'published',
    },
    overrideAccess: true,
  });
  console.log('✓ Homepage Global updated and published.');

  // 2. Update Chef Global
  console.log('Populating Chef Global media relationships...');
  const chefPortrait = mediaRecordMap.get('chef.mandif.portrait');
  const chefVideo = mediaRecordMap.get('chef.mandif.home-video');
  const chefPoster = mediaRecordMap.get('chef.mandif.home-video-poster');

  await payload.updateGlobal({
    slug: 'chef',
    data: {
      name: 'Mandif Warokka',
      portrait: chefPortrait.id,
      videoFile: chefVideo.id,
      videoPoster: chefPoster.id,
    },
    overrideAccess: true,
  });
  console.log('✓ Chef Global updated.');

  // 3. Update PageMedia Global
  console.log('Populating PageMedia Global relationships...');
  const menuFood = mediaRecordMap.get('menu.panel.food');
  const menuBev = mediaRecordMap.get('menu.panel.beverage');
  const aboutOrig = mediaRecordMap.get('about.origin');
  const aboutPhil = mediaRecordMap.get('about.philosophy');
  const aboutArch = mediaRecordMap.get('about.architecture');
  const expHero = mediaRecordMap.get('experience.hero');
  const expMorn = mediaRecordMap.get('experience.morning');
  const expEve = mediaRecordMap.get('experience.evening');
  const expDet = mediaRecordMap.get('experience.details');
  const occHero = mediaRecordMap.get('occasions.hero');
  const occPriv = mediaRecordMap.get('occasions.private-dining');
  const occWed = mediaRecordMap.get('occasions.wedding');
  const occBday = mediaRecordMap.get('occasions.birthday');
  const occMon = mediaRecordMap.get('occasions.brand.mondial');
  const occFrank = mediaRecordMap.get('occasions.brand.frank-co');
  const occMah = mediaRecordMap.get('occasions.brand.maharva');

  await payload.updateGlobal({
    slug: 'page-media',
    data: {
      menu: {
        foodImage: menuFood.id,
        beverageImage: menuBev.id,
      },
      about: {
        originImage: aboutOrig.id,
        philosophyImage: aboutPhil.id,
        architectureImage: aboutArch.id,
      },
      experience: {
        heroImage: expHero.id,
        morningImage: expMorn.id,
        eveningImage: expEve.id,
        detailsImage: expDet.id,
      },
      occasions: {
        heroImage: occHero.id,
        privateDiningImage: occPriv.id,
        weddingImage: occWed.id,
        birthdayImage: occBday.id,
        brandMondialImage: occMon.id,
        brandFrankCoImage: occFrank.id,
        brandMaharvaImage: occMah.id,
      },
    },
    overrideAccess: true,
  });
  console.log('✓ PageMedia Global updated.');

  console.log('\n=== CMS-002 MEDIA SEED COMPLETED SUCCESSFULLY ===');
}

export { runSeed as seedMedia };

if (import.meta.url === `file://${process.argv[1]}`) {
  runSeed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Migration seed failed:', err);
      process.exit(1);
    });
}
