import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Step 1: Pre-migration safety check - verify legacy data exists
  const checkRes = await db.execute(sql`
    SELECT "_order", "image_id"
    FROM "homepage_cuisine_teaser"
    ORDER BY "_order" ASC
  `);

  const hasLegacyData = Boolean(checkRes.rows && checkRes.rows.length > 0);

  if (hasLegacyData && checkRes.rows.length !== 4) {
    throw new Error(
      `CMS-007 Migration Safety Abort: Expected exactly 4 legacy cuisineTeaser records, found ${checkRes.rows?.length || 0}.`
    );
  }

  // Step 2: Add new fixed group columns and constraints
  await db.execute(sql`
    ALTER TABLE "homepage" ADD COLUMN "cuisine_teaser_item01_image_id" integer;
    ALTER TABLE "homepage" ADD COLUMN "cuisine_teaser_item02_image_id" integer;
    ALTER TABLE "homepage" ADD COLUMN "cuisine_teaser_item03_image_id" integer;
    ALTER TABLE "homepage" ADD COLUMN "cuisine_teaser_item04_image_id" integer;

    ALTER TABLE "homepage_locales" ADD COLUMN "cuisine_teaser_item01_label" varchar;
    ALTER TABLE "homepage_locales" ADD COLUMN "cuisine_teaser_item02_label" varchar;
    ALTER TABLE "homepage_locales" ADD COLUMN "cuisine_teaser_item03_label" varchar;
    ALTER TABLE "homepage_locales" ADD COLUMN "cuisine_teaser_item04_label" varchar;

    ALTER TABLE "_homepage_v" ADD COLUMN "version_cuisine_teaser_item01_image_id" integer;
    ALTER TABLE "_homepage_v" ADD COLUMN "version_cuisine_teaser_item02_image_id" integer;
    ALTER TABLE "_homepage_v" ADD COLUMN "version_cuisine_teaser_item03_image_id" integer;
    ALTER TABLE "_homepage_v" ADD COLUMN "version_cuisine_teaser_item04_image_id" integer;

    ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_cuisine_teaser_item01_label" varchar;
    ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_cuisine_teaser_item02_label" varchar;
    ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_cuisine_teaser_item03_label" varchar;
    ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_cuisine_teaser_item04_label" varchar;

    ALTER TABLE "homepage" ADD CONSTRAINT "homepage_cuisine_teaser_item01_image_id_media_id_fk" FOREIGN KEY ("cuisine_teaser_item01_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "homepage" ADD CONSTRAINT "homepage_cuisine_teaser_item02_image_id_media_id_fk" FOREIGN KEY ("cuisine_teaser_item02_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "homepage" ADD CONSTRAINT "homepage_cuisine_teaser_item03_image_id_media_id_fk" FOREIGN KEY ("cuisine_teaser_item03_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "homepage" ADD CONSTRAINT "homepage_cuisine_teaser_item04_image_id_media_id_fk" FOREIGN KEY ("cuisine_teaser_item04_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_cuisine_teaser_item01_image_id_media_id_fk" FOREIGN KEY ("version_cuisine_teaser_item01_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_cuisine_teaser_item02_image_id_media_id_fk" FOREIGN KEY ("version_cuisine_teaser_item02_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_cuisine_teaser_item03_image_id_media_id_fk" FOREIGN KEY ("version_cuisine_teaser_item03_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_cuisine_teaser_item04_image_id_media_id_fk" FOREIGN KEY ("version_cuisine_teaser_item04_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

    CREATE INDEX "homepage_cuisine_teaser_item01_cuisine_teaser_item01_ima_idx" ON "homepage" USING btree ("cuisine_teaser_item01_image_id");
    CREATE INDEX "homepage_cuisine_teaser_item02_cuisine_teaser_item02_ima_idx" ON "homepage" USING btree ("cuisine_teaser_item02_image_id");
    CREATE INDEX "homepage_cuisine_teaser_item03_cuisine_teaser_item03_ima_idx" ON "homepage" USING btree ("cuisine_teaser_item03_image_id");
    CREATE INDEX "homepage_cuisine_teaser_item04_cuisine_teaser_item04_ima_idx" ON "homepage" USING btree ("cuisine_teaser_item04_image_id");

    CREATE INDEX "_homepage_v_version_cuisine_teaser_item01_version_cuisin_idx" ON "_homepage_v" USING btree ("version_cuisine_teaser_item01_image_id");
    CREATE INDEX "_homepage_v_version_cuisine_teaser_item02_version_cuisin_idx" ON "_homepage_v" USING btree ("version_cuisine_teaser_item02_image_id");
    CREATE INDEX "_homepage_v_version_cuisine_teaser_item03_version_cuisin_idx" ON "_homepage_v" USING btree ("version_cuisine_teaser_item03_image_id");
    CREATE INDEX "_homepage_v_version_cuisine_teaser_item04_version_cuisin_idx" ON "_homepage_v" USING btree ("version_cuisine_teaser_item04_image_id");
  `);

  if (hasLegacyData) {
    // Step 3: Copy existing Media relationships to new columns BEFORE dropping tables
    await db.execute(sql`
      UPDATE "homepage" h
      SET 
        "cuisine_teaser_item01_image_id" = (SELECT "image_id" FROM "homepage_cuisine_teaser" WHERE "_parent_id" = h."id" AND "_order" = 1 LIMIT 1),
        "cuisine_teaser_item02_image_id" = (SELECT "image_id" FROM "homepage_cuisine_teaser" WHERE "_parent_id" = h."id" AND "_order" = 2 LIMIT 1),
        "cuisine_teaser_item03_image_id" = (SELECT "image_id" FROM "homepage_cuisine_teaser" WHERE "_parent_id" = h."id" AND "_order" = 3 LIMIT 1),
        "cuisine_teaser_item04_image_id" = (SELECT "image_id" FROM "homepage_cuisine_teaser" WHERE "_parent_id" = h."id" AND "_order" = 4 LIMIT 1);

      UPDATE "_homepage_v" v
      SET 
        "version_cuisine_teaser_item01_image_id" = (SELECT "image_id" FROM "_homepage_v_version_cuisine_teaser" WHERE "_parent_id" = v."id" AND "_order" = 1 LIMIT 1),
        "version_cuisine_teaser_item02_image_id" = (SELECT "image_id" FROM "_homepage_v_version_cuisine_teaser" WHERE "_parent_id" = v."id" AND "_order" = 2 LIMIT 1),
        "version_cuisine_teaser_item03_image_id" = (SELECT "image_id" FROM "_homepage_v_version_cuisine_teaser" WHERE "_parent_id" = v."id" AND "_order" = 3 LIMIT 1),
        "version_cuisine_teaser_item04_image_id" = (SELECT "image_id" FROM "_homepage_v_version_cuisine_teaser" WHERE "_parent_id" = v."id" AND "_order" = 4 LIMIT 1);
    `);

    // Step 4: Populate initial localized labels
    await db.execute(sql`
      UPDATE "homepage_locales"
      SET
        "cuisine_teaser_item01_label" = 'Antipasti',
        "cuisine_teaser_item02_label" = 'Primi Piatti',
        "cuisine_teaser_item03_label" = 'Secondi & Grill',
        "cuisine_teaser_item04_label" = 'Dolci'
      WHERE "_locale" = 'en';

      UPDATE "homepage_locales"
      SET
        "cuisine_teaser_item01_label" = 'Antipasti',
        "cuisine_teaser_item02_label" = 'Primi Piatti',
        "cuisine_teaser_item03_label" = 'Secondi & Panggang',
        "cuisine_teaser_item04_label" = 'Dolci'
      WHERE "_locale" = 'id';

      UPDATE "_homepage_v_locales"
      SET
        "version_cuisine_teaser_item01_label" = 'Antipasti',
        "version_cuisine_teaser_item02_label" = 'Primi Piatti',
        "version_cuisine_teaser_item03_label" = 'Secondi & Grill',
        "version_cuisine_teaser_item04_label" = 'Dolci'
      WHERE "_locale" = 'en';

      UPDATE "_homepage_v_locales"
      SET
        "version_cuisine_teaser_item01_label" = 'Antipasti',
        "version_cuisine_teaser_item02_label" = 'Primi Piatti',
        "version_cuisine_teaser_item03_label" = 'Secondi & Panggang',
        "version_cuisine_teaser_item04_label" = 'Dolci'
      WHERE "_locale" = 'id';
    `);

    // Step 5: Verify all 4 images were successfully copied to homepage
    const verifyRes = await db.execute(sql`
      SELECT 
        "cuisine_teaser_item01_image_id",
        "cuisine_teaser_item02_image_id",
        "cuisine_teaser_item03_image_id",
        "cuisine_teaser_item04_image_id"
      FROM "homepage"
      LIMIT 1
    `);

    const row = verifyRes.rows?.[0] as any;
    if (
      !row ||
      !row.cuisine_teaser_item01_image_id ||
      !row.cuisine_teaser_item02_image_id ||
      !row.cuisine_teaser_item03_image_id ||
      !row.cuisine_teaser_item04_image_id
    ) {
      throw new Error(
        'CMS-007 Migration Verification Abort: One or more cuisine teaser image columns failed to populate.'
      );
    }
  }

  // Step 6: Safe to drop obsolete array tables now that data has been copied and verified
  await db.execute(sql`
    ALTER TABLE "homepage_cuisine_teaser" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "homepage_cuisine_teaser_locales" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_homepage_v_version_cuisine_teaser" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "_homepage_v_version_cuisine_teaser_locales" DISABLE ROW LEVEL SECURITY;

    DROP TABLE "homepage_cuisine_teaser" CASCADE;
    DROP TABLE "homepage_cuisine_teaser_locales" CASCADE;
    DROP TABLE "_homepage_v_version_cuisine_teaser" CASCADE;
    DROP TABLE "_homepage_v_version_cuisine_teaser_locales" CASCADE;
  `);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Re-create the array tables
  await db.execute(sql`
    CREATE TABLE "homepage_cuisine_teaser" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "key" varchar,
      "image_id" integer,
      "object_position" varchar
    );

    CREATE TABLE "homepage_cuisine_teaser_locales" (
      "name" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    CREATE TABLE "_homepage_v_version_cuisine_teaser" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "key" varchar,
      "image_id" integer,
      "object_position" varchar,
      "_uuid" varchar
    );

    CREATE TABLE "_homepage_v_version_cuisine_teaser_locales" (
      "name" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    ALTER TABLE "homepage_cuisine_teaser" ADD CONSTRAINT "homepage_cuisine_teaser_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "homepage_cuisine_teaser" ADD CONSTRAINT "homepage_cuisine_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "homepage_cuisine_teaser_locales" ADD CONSTRAINT "homepage_cuisine_teaser_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_cuisine_teaser"("id") ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "_homepage_v_version_cuisine_teaser" ADD CONSTRAINT "_homepage_v_version_cuisine_teaser_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "_homepage_v_version_cuisine_teaser" ADD CONSTRAINT "_homepage_v_version_cuisine_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "_homepage_v_version_cuisine_teaser_locales" ADD CONSTRAINT "_homepage_v_version_cuisine_teaser_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_version_cuisine_teaser"("id") ON DELETE cascade ON UPDATE no action;

    CREATE INDEX "homepage_cuisine_teaser_order_idx" ON "homepage_cuisine_teaser" USING btree ("_order");
    CREATE INDEX "homepage_cuisine_teaser_parent_id_idx" ON "homepage_cuisine_teaser" USING btree ("_parent_id");
    CREATE INDEX "homepage_cuisine_teaser_image_idx" ON "homepage_cuisine_teaser" USING btree ("image_id");
    CREATE UNIQUE INDEX "homepage_cuisine_teaser_locales_locale_parent_id_unique" ON "homepage_cuisine_teaser_locales" USING btree ("_locale","_parent_id");

    CREATE INDEX "_homepage_v_version_cuisine_teaser_order_idx" ON "_homepage_v_version_cuisine_teaser" USING btree ("_order");
    CREATE INDEX "_homepage_v_version_cuisine_teaser_parent_id_idx" ON "_homepage_v_version_cuisine_teaser" USING btree ("_parent_id");
    CREATE INDEX "_homepage_v_version_cuisine_teaser_image_idx" ON "_homepage_v_version_cuisine_teaser" USING btree ("image_id");
    CREATE UNIQUE INDEX "_homepage_v_version_cuisine_teaser_locales_locale_parent_id_" ON "_homepage_v_version_cuisine_teaser_locales" USING btree ("_locale","_parent_id");
  `);

  // Copy data from fixed columns back to array rows
  await db.execute(sql`
    INSERT INTO "homepage_cuisine_teaser" ("_order", "_parent_id", "id", "key", "image_id", "object_position")
    SELECT 1, h."id", 'item01', 'ANTIPASTI', h."cuisine_teaser_item01_image_id", 'object-center' FROM "homepage" h
    WHERE h."cuisine_teaser_item01_image_id" IS NOT NULL;

    INSERT INTO "homepage_cuisine_teaser" ("_order", "_parent_id", "id", "key", "image_id", "object_position")
    SELECT 2, h."id", 'item02', 'PASTA', h."cuisine_teaser_item02_image_id", 'object-center' FROM "homepage" h
    WHERE h."cuisine_teaser_item02_image_id" IS NOT NULL;

    INSERT INTO "homepage_cuisine_teaser" ("_order", "_parent_id", "id", "key", "image_id", "object_position")
    SELECT 3, h."id", 'item03', 'WOODFIRE & GRILL', h."cuisine_teaser_item03_image_id", 'object-[center_35%]' FROM "homepage" h
    WHERE h."cuisine_teaser_item03_image_id" IS NOT NULL;

    INSERT INTO "homepage_cuisine_teaser" ("_order", "_parent_id", "id", "key", "image_id", "object_position")
    SELECT 4, h."id", 'item04', 'DOLCI', h."cuisine_teaser_item04_image_id", 'object-center' FROM "homepage" h
    WHERE h."cuisine_teaser_item04_image_id" IS NOT NULL;
  `);

  // Drop fixed columns and constraints
  await db.execute(sql`
    ALTER TABLE "homepage" DROP CONSTRAINT "homepage_cuisine_teaser_item01_image_id_media_id_fk";
    ALTER TABLE "homepage" DROP CONSTRAINT "homepage_cuisine_teaser_item02_image_id_media_id_fk";
    ALTER TABLE "homepage" DROP CONSTRAINT "homepage_cuisine_teaser_item03_image_id_media_id_fk";
    ALTER TABLE "homepage" DROP CONSTRAINT "homepage_cuisine_teaser_item04_image_id_media_id_fk";

    ALTER TABLE "_homepage_v" DROP CONSTRAINT "_homepage_v_version_cuisine_teaser_item01_image_id_media_id_fk";
    ALTER TABLE "_homepage_v" DROP CONSTRAINT "_homepage_v_version_cuisine_teaser_item02_image_id_media_id_fk";
    ALTER TABLE "_homepage_v" DROP CONSTRAINT "_homepage_v_version_cuisine_teaser_item03_image_id_media_id_fk";
    ALTER TABLE "_homepage_v" DROP CONSTRAINT "_homepage_v_version_cuisine_teaser_item04_image_id_media_id_fk";

    DROP INDEX "homepage_cuisine_teaser_item01_cuisine_teaser_item01_ima_idx";
    DROP INDEX "homepage_cuisine_teaser_item02_cuisine_teaser_item02_ima_idx";
    DROP INDEX "homepage_cuisine_teaser_item03_cuisine_teaser_item03_ima_idx";
    DROP INDEX "homepage_cuisine_teaser_item04_cuisine_teaser_item04_ima_idx";

    DROP INDEX "_homepage_v_version_cuisine_teaser_item01_version_cuisin_idx";
    DROP INDEX "_homepage_v_version_cuisine_teaser_item02_version_cuisin_idx";
    DROP INDEX "_homepage_v_version_cuisine_teaser_item03_version_cuisin_idx";
    DROP INDEX "_homepage_v_version_cuisine_teaser_item04_version_cuisin_idx";

    ALTER TABLE "homepage" DROP COLUMN "cuisine_teaser_item01_image_id";
    ALTER TABLE "homepage" DROP COLUMN "cuisine_teaser_item02_image_id";
    ALTER TABLE "homepage" DROP COLUMN "cuisine_teaser_item03_image_id";
    ALTER TABLE "homepage" DROP COLUMN "cuisine_teaser_item04_image_id";

    ALTER TABLE "homepage_locales" DROP COLUMN "cuisine_teaser_item01_label";
    ALTER TABLE "homepage_locales" DROP COLUMN "cuisine_teaser_item02_label";
    ALTER TABLE "homepage_locales" DROP COLUMN "cuisine_teaser_item03_label";
    ALTER TABLE "homepage_locales" DROP COLUMN "cuisine_teaser_item04_label";

    ALTER TABLE "_homepage_v" DROP COLUMN "version_cuisine_teaser_item01_image_id";
    ALTER TABLE "_homepage_v" DROP COLUMN "version_cuisine_teaser_item02_image_id";
    ALTER TABLE "_homepage_v" DROP COLUMN "version_cuisine_teaser_item03_image_id";
    ALTER TABLE "_homepage_v" DROP COLUMN "version_cuisine_teaser_item04_image_id";

    ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_cuisine_teaser_item01_label";
    ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_cuisine_teaser_item02_label";
    ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_cuisine_teaser_item03_label";
    ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_cuisine_teaser_item04_label";
  `);
}
