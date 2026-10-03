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

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

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

