import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Add The Craft fields to experience_page_locales
    ALTER TABLE "experience_page_locales" ADD COLUMN IF NOT EXISTS "craft_heading" varchar;
    ALTER TABLE "experience_page_locales" ADD COLUMN IF NOT EXISTS "craft_intro" varchar;
    ALTER TABLE "experience_page_locales" ADD COLUMN IF NOT EXISTS "craft_body" varchar;

    -- Add The Craft fields to _experience_page_v_locales (versions)
    ALTER TABLE "_experience_page_v_locales" ADD COLUMN IF NOT EXISTS "version_craft_heading" varchar;
    ALTER TABLE "_experience_page_v_locales" ADD COLUMN IF NOT EXISTS "version_craft_intro" varchar;
    ALTER TABLE "_experience_page_v_locales" ADD COLUMN IF NOT EXISTS "version_craft_body" varchar;

    -- Seed approved English copy for The Craft
    UPDATE "experience_page_locales"
    SET "craft_heading" = 'The Craft',
        "craft_intro" = E'Behind every plate is a rhythm\nof preparation and precision.',
        "craft_body" = 'The experience at GEMA is shaped as much by what happens behind the pass as what arrives at the table. Open-kitchen energy, careful plating, and handmade detail give every dish its character.'
    WHERE "_locale" = 'en';

    UPDATE "_experience_page_v_locales"
    SET "version_craft_heading" = 'The Craft',
        "version_craft_intro" = E'Behind every plate is a rhythm\nof preparation and precision.',
        "version_craft_body" = 'The experience at GEMA is shaped as much by what happens behind the pass as what arrives at the table. Open-kitchen energy, careful plating, and handmade detail give every dish its character.'
    WHERE "_locale" = 'en';
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "experience_page_locales" DROP COLUMN IF EXISTS "craft_heading";
    ALTER TABLE "experience_page_locales" DROP COLUMN IF EXISTS "craft_intro";
    ALTER TABLE "experience_page_locales" DROP COLUMN IF EXISTS "craft_body";

    ALTER TABLE "_experience_page_v_locales" DROP COLUMN IF EXISTS "version_craft_heading";
    ALTER TABLE "_experience_page_v_locales" DROP COLUMN IF EXISTS "version_craft_intro";
    ALTER TABLE "_experience_page_v_locales" DROP COLUMN IF EXISTS "version_craft_body";
  `);
}
