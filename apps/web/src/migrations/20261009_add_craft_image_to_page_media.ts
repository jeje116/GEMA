import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- 1. Add experience_craft_image_id column to page_media
    ALTER TABLE "page_media" ADD COLUMN IF NOT EXISTS "experience_craft_image_id" integer REFERENCES "media"("id") ON DELETE SET NULL;
    CREATE INDEX IF NOT EXISTS "page_media_experience_craft_image_idx" ON "page_media" ("experience_craft_image_id");

    -- 2. Ingest Photo B into media if not already present
    DO $$
    DECLARE
      v_media_id integer;
    BEGIN
      SELECT id INTO v_media_id FROM "media" WHERE "source_key" = 'experience.craft' OR "filename" = 'experience-the-craft-chef-plating.webp' LIMIT 1;
      
      IF v_media_id IS NULL THEN
        INSERT INTO "media" (
          "source_key",
          "updated_at",
          "created_at",
          "url",
          "filename",
          "mime_type",
          "filesize",
          "width",
          "height",
          "focal_x",
          "focal_y"
        ) VALUES (
          'experience.craft',
          now(),
          now(),
          '/api/media/file/experience-the-craft-chef-plating.webp',
          'experience-the-craft-chef-plating.webp',
          'image/webp',
          119636,
          1600,
          2400,
          50,
          35
        ) RETURNING id INTO v_media_id;

        INSERT INTO "media_locales" ("alt", "caption", "_locale", "_parent_id")
        VALUES 
          ('Chef plating a dish at GEMA', '', 'en', v_media_id),
          ('Chef menata hidangan di GEMA', '', 'id', v_media_id);
      END IF;

      -- 3. Set Photo B as The Craft's selected image in page_media
      UPDATE "page_media"
      SET "experience_craft_image_id" = v_media_id
      WHERE "experience_craft_image_id" IS NULL OR "experience_craft_image_id" != v_media_id;
    END $$;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "page_media" SET "experience_craft_image_id" = NULL;
    DROP INDEX IF EXISTS "page_media_experience_craft_image_idx";
    ALTER TABLE "page_media" DROP COLUMN IF EXISTS "experience_craft_image_id";
    DELETE FROM "media_locales" WHERE "_parent_id" IN (SELECT "id" FROM "media" WHERE "source_key" = 'experience.craft');
    DELETE FROM "media" WHERE "source_key" = 'experience.craft';
  `);
}
