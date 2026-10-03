import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import { fileURLToPath } from 'url';

import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { MenuCategories } from './collections/MenuCategories';
import { MenuItems } from './collections/MenuItems';
import { Events } from './collections/Events';
import { JournalPosts } from './collections/JournalPosts';
import { Recognitions } from './collections/Recognitions';
import { Reviews } from './collections/Reviews';

import { Homepage } from './globals/Homepage';
import { Chef } from './globals/Chef';
import { PageMedia } from './globals/PageMedia';
import { SiteSettings } from './globals/SiteSettings';
import { Navigation } from './globals/Navigation';
import { MenuPage } from './globals/MenuPage';
import { AboutPage } from './globals/AboutPage';
import { ExperiencePage } from './globals/ExperiencePage';
import { OccasionsPage } from './globals/OccasionsPage';
import { VisitPage } from './globals/VisitPage';
import { RecognitionPage } from './globals/RecognitionPage';
import { EventsPage } from './globals/EventsPage';
import { JournalPage } from './globals/JournalPage';

import { s3Storage } from '@payloadcms/storage-s3';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// R2 Atomic Configuration Validation
const r2EnvVars = {
  bucket: process.env.R2_BUCKET,
  endpoint: process.env.R2_ENDPOINT,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  publicUrl: process.env.R2_PUBLIC_URL,
};

const r2Values = Object.values(r2EnvVars);
const someR2Set = r2Values.some(Boolean);
const allR2Set = r2Values.every(Boolean);

if (someR2Set && !allR2Set) {
  const missing = Object.entries(r2EnvVars)
    .filter(([_, v]) => !v)
    .map(([k]) => k);
  throw new Error(`[R2 Configuration Error] Partial R2 storage configuration detected! Missing: ${missing.join(', ')}`);
}

const plugins = [];
if (allR2Set) {
  plugins.push(
    s3Storage({
      collections: {
        media: {
          disableLocalStorage: true,
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename: fn }: { filename: string }) => {
            const baseUrl = (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '');
            return `${baseUrl}/${fn}`;
          },
        },
      },
      bucket: process.env.R2_BUCKET || '',
      config: {
        endpoint: process.env.R2_ENDPOINT || '',
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
        region: 'auto',
        forcePathStyle: true,
      },
    })
  );
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    MenuCategories,
    MenuItems,
    Events,
    JournalPosts,
    Recognitions,
    Reviews,
  ],
  globals: [
    Homepage,
    Chef,
    PageMedia,
    SiteSettings,
    Navigation,
    MenuPage,
    AboutPage,
    ExperiencePage,
    OccasionsPage,
    VisitPage,
    RecognitionPage,
    EventsPage,
    JournalPage,
  ],
  plugins,
  localization: {
    locales: [
      { label: 'English', code: 'en' },
      { label: 'Indonesian', code: 'id' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'types/payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    push: false,
  }),
});

