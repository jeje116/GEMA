import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_reviews_source_type" AS ENUM('direct', 'google', 'instagram', 'press', 'other');
  CREATE TYPE "public"."enum_reviews_verification_status" AS ENUM('unverified', 'verified');
  CREATE TABLE "reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar NOT NULL,
  	"attribution" varchar,
  	"source_type" "enum_reviews_source_type" DEFAULT 'direct' NOT NULL,
  	"source_label" varchar,
  	"source_url" varchar,
  	"verification_status" "enum_reviews_verification_status" DEFAULT 'unverified' NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "events_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "events_page_locales" (
  	"title" varchar DEFAULT 'Events' NOT NULL,
  	"subtitle" varchar DEFAULT 'Discover what''s happening around the table.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "journal_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "journal_page_locales" (
  	"title" varchar DEFAULT 'Journal' NOT NULL,
  	"subtitle" varchar DEFAULT 'Stories from the kitchen, the farm, and the dining room.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "reviews_id" integer;
  ALTER TABLE "homepage_locales" ADD COLUMN "reviews_kicker" varchar DEFAULT 'Selected Guest Words';
  ALTER TABLE "homepage_locales" ADD COLUMN "visit_intro_location_heading" varchar DEFAULT 'Location';
  ALTER TABLE "homepage_locales" ADD COLUMN "visit_intro_services_heading" varchar DEFAULT 'Services';
  ALTER TABLE "homepage_rels" ADD COLUMN "reviews_id" integer;
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_reviews_kicker" varchar DEFAULT 'Selected Guest Words';
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_visit_intro_location_heading" varchar DEFAULT 'Location';
  ALTER TABLE "_homepage_v_locales" ADD COLUMN "version_visit_intro_services_heading" varchar DEFAULT 'Services';
  ALTER TABLE "_homepage_v_rels" ADD COLUMN "reviews_id" integer;
  ALTER TABLE "site_settings_locales" ADD COLUMN "location_label" varchar DEFAULT 'Surabaya, Indonesia';
  ALTER TABLE "occasions_page_locales" ADD COLUMN "hero_title" varchar DEFAULT 'Occasions';
  ALTER TABLE "_occasions_page_v_locales" ADD COLUMN "version_hero_title" varchar DEFAULT 'Occasions';
  ALTER TABLE "visit_page_locales" ADD COLUMN "title" varchar DEFAULT 'Visit';
  ALTER TABLE "visit_page_locales" ADD COLUMN "contact_heading" varchar DEFAULT 'Contact';
  ALTER TABLE "visit_page_locales" ADD COLUMN "reservations_heading" varchar DEFAULT 'Reservations';
  ALTER TABLE "_visit_page_v_locales" ADD COLUMN "version_title" varchar DEFAULT 'Visit';
  ALTER TABLE "_visit_page_v_locales" ADD COLUMN "version_contact_heading" varchar DEFAULT 'Contact';
  ALTER TABLE "_visit_page_v_locales" ADD COLUMN "version_reservations_heading" varchar DEFAULT 'Reservations';
  ALTER TABLE "recognition_page_locales" ADD COLUMN "title" varchar DEFAULT 'Recognition';
  ALTER TABLE "_recognition_page_v_locales" ADD COLUMN "version_title" varchar DEFAULT 'Recognition';
  ALTER TABLE "events_page_locales" ADD CONSTRAINT "events_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journal_page_locales" ADD CONSTRAINT "journal_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journal_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "reviews_updated_at_idx" ON "reviews" USING btree ("updated_at");
  CREATE INDEX "reviews_created_at_idx" ON "reviews" USING btree ("created_at");
  CREATE UNIQUE INDEX "events_page_locales_locale_parent_id_unique" ON "events_page_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "journal_page_locales_locale_parent_id_unique" ON "journal_page_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_rels" ADD CONSTRAINT "homepage_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_rels" ADD CONSTRAINT "_homepage_v_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("reviews_id");
  CREATE INDEX "homepage_rels_reviews_id_idx" ON "homepage_rels" USING btree ("reviews_id");
  CREATE INDEX "_homepage_v_rels_reviews_id_idx" ON "_homepage_v_rels" USING btree ("reviews_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "reviews" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "events_page_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "journal_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "journal_page_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "reviews" CASCADE;
  DROP TABLE "events_page" CASCADE;
  DROP TABLE "events_page_locales" CASCADE;
  DROP TABLE "journal_page" CASCADE;
  DROP TABLE "journal_page_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_reviews_fk";
  
  ALTER TABLE "homepage_rels" DROP CONSTRAINT "homepage_rels_reviews_fk";
  
  ALTER TABLE "_homepage_v_rels" DROP CONSTRAINT "_homepage_v_rels_reviews_fk";
  
  DROP INDEX "payload_locked_documents_rels_reviews_id_idx";
  DROP INDEX "homepage_rels_reviews_id_idx";
  DROP INDEX "_homepage_v_rels_reviews_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "reviews_id";
  ALTER TABLE "homepage_locales" DROP COLUMN "reviews_kicker";
  ALTER TABLE "homepage_locales" DROP COLUMN "visit_intro_location_heading";
  ALTER TABLE "homepage_locales" DROP COLUMN "visit_intro_services_heading";
  ALTER TABLE "homepage_rels" DROP COLUMN "reviews_id";
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_reviews_kicker";
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_visit_intro_location_heading";
  ALTER TABLE "_homepage_v_locales" DROP COLUMN "version_visit_intro_services_heading";
  ALTER TABLE "_homepage_v_rels" DROP COLUMN "reviews_id";
  ALTER TABLE "site_settings_locales" DROP COLUMN "location_label";
  ALTER TABLE "occasions_page_locales" DROP COLUMN "hero_title";
  ALTER TABLE "_occasions_page_v_locales" DROP COLUMN "version_hero_title";
  ALTER TABLE "visit_page_locales" DROP COLUMN "title";
  ALTER TABLE "visit_page_locales" DROP COLUMN "contact_heading";
  ALTER TABLE "visit_page_locales" DROP COLUMN "reservations_heading";
  ALTER TABLE "_visit_page_v_locales" DROP COLUMN "version_title";
  ALTER TABLE "_visit_page_v_locales" DROP COLUMN "version_contact_heading";
  ALTER TABLE "_visit_page_v_locales" DROP COLUMN "version_reservations_heading";
  ALTER TABLE "recognition_page_locales" DROP COLUMN "title";
  ALTER TABLE "_recognition_page_v_locales" DROP COLUMN "version_title";
  DROP TYPE "public"."enum_reviews_source_type";
  DROP TYPE "public"."enum_reviews_verification_status";`)
}
