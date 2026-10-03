import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- 1. Experience Materials in PageMedia
    ALTER TABLE "page_media" ADD COLUMN IF NOT EXISTS "experience_material_image01_id" integer;
    ALTER TABLE "page_media" ADD COLUMN IF NOT EXISTS "experience_material_image02_id" integer;
    ALTER TABLE "page_media" ADD COLUMN IF NOT EXISTS "experience_material_image03_id" integer;
    ALTER TABLE "page_media" ADD COLUMN IF NOT EXISTS "experience_material_image04_id" integer;

    ALTER TABLE "page_media" DROP CONSTRAINT IF EXISTS "page_media_experience_material_image01_id_media_id_fk";
    ALTER TABLE "page_media" ADD CONSTRAINT "page_media_experience_material_image01_id_media_id_fk" FOREIGN KEY ("experience_material_image01_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    ALTER TABLE "page_media" DROP CONSTRAINT IF EXISTS "page_media_experience_material_image02_id_media_id_fk";
    ALTER TABLE "page_media" ADD CONSTRAINT "page_media_experience_material_image02_id_media_id_fk" FOREIGN KEY ("experience_material_image02_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    ALTER TABLE "page_media" DROP CONSTRAINT IF EXISTS "page_media_experience_material_image03_id_media_id_fk";
    ALTER TABLE "page_media" ADD CONSTRAINT "page_media_experience_material_image03_id_media_id_fk" FOREIGN KEY ("experience_material_image03_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    ALTER TABLE "page_media" DROP CONSTRAINT IF EXISTS "page_media_experience_material_image04_id_media_id_fk";
    ALTER TABLE "page_media" ADD CONSTRAINT "page_media_experience_material_image04_id_media_id_fk" FOREIGN KEY ("experience_material_image04_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "page_media_experience_material_image01_idx" ON "page_media" USING btree ("experience_material_image01_id");
    CREATE INDEX IF NOT EXISTS "page_media_experience_material_image02_idx" ON "page_media" USING btree ("experience_material_image02_id");
    CREATE INDEX IF NOT EXISTS "page_media_experience_material_image03_idx" ON "page_media" USING btree ("experience_material_image03_id");
    CREATE INDEX IF NOT EXISTS "page_media_experience_material_image04_idx" ON "page_media" USING btree ("experience_material_image04_id");

    -- 2. Journal caption in journal_posts_locales and _journal_posts_v_locales
    ALTER TABLE "journal_posts_locales" ADD COLUMN IF NOT EXISTS "image_caption" varchar;
    ALTER TABLE "_journal_posts_v_locales" ADD COLUMN IF NOT EXISTS "version_image_caption" varchar;

    -- 3. Recognitions Collection fields
    ALTER TABLE "recognitions" ADD COLUMN IF NOT EXISTS "slug" varchar;
    ALTER TABLE "recognitions" ADD COLUMN IF NOT EXISTS "cover_image_id" integer;

    ALTER TABLE "recognitions" DROP CONSTRAINT IF EXISTS "recognitions_cover_image_id_media_id_fk";
    ALTER TABLE "recognitions" ADD CONSTRAINT "recognitions_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "recognitions_cover_image_id_idx" ON "recognitions" USING btree ("cover_image_id");

    UPDATE "recognitions" SET "slug" = 'recognition-' || "id" WHERE "slug" IS NULL;
    ALTER TABLE "recognitions" ALTER COLUMN "slug" SET NOT NULL;

    CREATE UNIQUE INDEX IF NOT EXISTS "recognitions_slug_idx" ON "recognitions" USING btree ("slug");

    -- 4. Recognitions Locales fields
    ALTER TABLE "recognitions_locales" ADD COLUMN IF NOT EXISTS "image_caption" varchar;
    ALTER TABLE "recognitions_locales" ADD COLUMN IF NOT EXISTS "excerpt" varchar;
    ALTER TABLE "recognitions_locales" ADD COLUMN IF NOT EXISTS "content" jsonb;
    ALTER TABLE "recognitions_locales" ADD COLUMN IF NOT EXISTS "seo_meta_title" varchar;
    ALTER TABLE "recognitions_locales" ADD COLUMN IF NOT EXISTS "seo_meta_description" varchar;

    -- 5. Homepage recognitionIntro removal (published and version schema)
    ALTER TABLE "homepage_locales" DROP COLUMN IF EXISTS "recognition_intro_title";
    ALTER TABLE "homepage_locales" DROP COLUMN IF EXISTS "recognition_intro_cta_label";
    ALTER TABLE "_homepage_v_locales" DROP COLUMN IF EXISTS "version_recognition_intro_title";
    ALTER TABLE "_homepage_v_locales" DROP COLUMN IF EXISTS "version_recognition_intro_cta_label";
  `);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- 5. Revert Homepage recognitionIntro
    ALTER TABLE "homepage_locales" ADD COLUMN IF NOT EXISTS "recognition_intro_title" varchar DEFAULT 'Recognition';
    ALTER TABLE "homepage_locales" ADD COLUMN IF NOT EXISTS "recognition_intro_cta_label" varchar DEFAULT 'View Archive';
    ALTER TABLE "_homepage_v_locales" ADD COLUMN IF NOT EXISTS "version_recognition_intro_title" varchar DEFAULT 'Recognition';
    ALTER TABLE "_homepage_v_locales" ADD COLUMN IF NOT EXISTS "version_recognition_intro_cta_label" varchar DEFAULT 'View Archive';

    -- 4. Revert Recognitions Locales fields
    ALTER TABLE "recognitions_locales" DROP COLUMN IF EXISTS "image_caption";
    ALTER TABLE "recognitions_locales" DROP COLUMN IF EXISTS "excerpt";
    ALTER TABLE "recognitions_locales" DROP COLUMN IF EXISTS "content";
    ALTER TABLE "recognitions_locales" DROP COLUMN IF EXISTS "seo_meta_title";
    ALTER TABLE "recognitions_locales" DROP COLUMN IF EXISTS "seo_meta_description";

    -- 3. Revert Recognitions Collection fields
    DROP INDEX IF EXISTS "recognitions_slug_idx";
    ALTER TABLE "recognitions" DROP CONSTRAINT IF EXISTS "recognitions_cover_image_id_media_id_fk";
    DROP INDEX IF EXISTS "recognitions_cover_image_id_idx";
    ALTER TABLE "recognitions" DROP COLUMN IF EXISTS "slug";
    ALTER TABLE "recognitions" DROP COLUMN IF EXISTS "cover_image_id";

    -- 2. Revert Journal caption
    ALTER TABLE "journal_posts_locales" DROP COLUMN IF EXISTS "image_caption";
    ALTER TABLE "_journal_posts_v_locales" DROP COLUMN IF EXISTS "version_image_caption";

    -- 1. Revert Experience Materials in PageMedia
    ALTER TABLE "page_media" DROP CONSTRAINT IF EXISTS "page_media_experience_material_image01_id_media_id_fk";
    ALTER TABLE "page_media" DROP CONSTRAINT IF EXISTS "page_media_experience_material_image02_id_media_id_fk";
    ALTER TABLE "page_media" DROP CONSTRAINT IF EXISTS "page_media_experience_material_image03_id_media_id_fk";
    ALTER TABLE "page_media" DROP CONSTRAINT IF EXISTS "page_media_experience_material_image04_id_media_id_fk";

    DROP INDEX IF EXISTS "page_media_experience_material_image01_idx";
    DROP INDEX IF EXISTS "page_media_experience_material_image02_idx";
    DROP INDEX IF EXISTS "page_media_experience_material_image03_idx";
    DROP INDEX IF EXISTS "page_media_experience_material_image04_idx";

    ALTER TABLE "page_media" DROP COLUMN IF EXISTS "experience_material_image01_id";
    ALTER TABLE "page_media" DROP COLUMN IF EXISTS "experience_material_image02_id";
    ALTER TABLE "page_media" DROP COLUMN IF EXISTS "experience_material_image03_id";
    ALTER TABLE "page_media" DROP COLUMN IF EXISTS "experience_material_image04_id";
  `);
}
