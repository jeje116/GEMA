import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_about_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__about_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__about_page_v_published_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_experience_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__experience_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__experience_page_v_published_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_occasions_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__occasions_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__occasions_page_v_published_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_visit_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__visit_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__visit_page_v_published_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_recognition_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__recognition_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__recognition_page_v_published_locale" AS ENUM('en', 'id');
  CREATE TABLE "site_settings_locales" (
  	"dietary_policy" varchar DEFAULT 'No Pork, No Lard',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_about_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_locales" (
  	"hero_headline" varchar,
  	"hero_subtitle" varchar,
  	"origin_title" varchar,
  	"origin_body1" varchar,
  	"origin_body2" varchar,
  	"philosophy_title" varchar,
  	"philosophy_body1" varchar,
  	"philosophy_dietary_prefix" varchar,
  	"philosophy_dietary_suffix" varchar,
  	"architecture_title" varchar,
  	"architecture_body1" varchar,
  	"architecture_body2" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_about_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__about_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__about_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_about_page_v_locales" (
  	"version_hero_headline" varchar,
  	"version_hero_subtitle" varchar,
  	"version_origin_title" varchar,
  	"version_origin_body1" varchar,
  	"version_origin_body2" varchar,
  	"version_philosophy_title" varchar,
  	"version_philosophy_body1" varchar,
  	"version_philosophy_dietary_prefix" varchar,
  	"version_philosophy_dietary_suffix" varchar,
  	"version_architecture_title" varchar,
  	"version_architecture_body1" varchar,
  	"version_architecture_body2" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "experience_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_experience_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "experience_page_locales" (
  	"hero_kicker" varchar,
  	"hero_headline" varchar,
  	"quote" varchar,
  	"day_to_night_heading" varchar,
  	"day_to_night_subtitle" varchar,
  	"day_to_night_morning_heading" varchar,
  	"day_to_night_morning_description" varchar,
  	"day_to_night_transition_quote" varchar,
  	"day_to_night_evening_heading" varchar,
  	"day_to_night_evening_description" varchar,
  	"materials_heading" varchar,
  	"materials_body1" varchar,
  	"materials_body2" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_experience_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__experience_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__experience_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_experience_page_v_locales" (
  	"version_hero_kicker" varchar,
  	"version_hero_headline" varchar,
  	"version_quote" varchar,
  	"version_day_to_night_heading" varchar,
  	"version_day_to_night_subtitle" varchar,
  	"version_day_to_night_morning_heading" varchar,
  	"version_day_to_night_morning_description" varchar,
  	"version_day_to_night_transition_quote" varchar,
  	"version_day_to_night_evening_heading" varchar,
  	"version_day_to_night_evening_description" varchar,
  	"version_materials_heading" varchar,
  	"version_materials_body1" varchar,
  	"version_materials_body2" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "occasions_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_events_mondial_brand" varchar DEFAULT 'Mondial',
  	"brand_events_frank_co_brand" varchar DEFAULT 'Frank & Co',
  	"brand_events_maharva_brand" varchar DEFAULT 'Maharva',
  	"_status" "enum_occasions_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "occasions_page_locales" (
  	"hero_subtitle" varchar,
  	"private_dining_title" varchar,
  	"private_dining_description" varchar,
  	"private_dining_feature1" varchar,
  	"private_dining_feature2" varchar,
  	"private_dining_feature3" varchar,
  	"wedding_title" varchar,
  	"wedding_description" varchar,
  	"wedding_feature1" varchar,
  	"wedding_feature2" varchar,
  	"wedding_feature3" varchar,
  	"birthday_title" varchar,
  	"birthday_description" varchar,
  	"birthday_feature1" varchar,
  	"birthday_feature2" varchar,
  	"birthday_feature3" varchar,
  	"brand_exclusives_heading" varchar,
  	"brand_exclusives_description" varchar,
  	"brand_events_mondial_title" varchar,
  	"brand_events_frank_co_title" varchar,
  	"brand_events_maharva_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_occasions_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_brand_events_mondial_brand" varchar DEFAULT 'Mondial',
  	"version_brand_events_frank_co_brand" varchar DEFAULT 'Frank & Co',
  	"version_brand_events_maharva_brand" varchar DEFAULT 'Maharva',
  	"version__status" "enum__occasions_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__occasions_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_occasions_page_v_locales" (
  	"version_hero_subtitle" varchar,
  	"version_private_dining_title" varchar,
  	"version_private_dining_description" varchar,
  	"version_private_dining_feature1" varchar,
  	"version_private_dining_feature2" varchar,
  	"version_private_dining_feature3" varchar,
  	"version_wedding_title" varchar,
  	"version_wedding_description" varchar,
  	"version_wedding_feature1" varchar,
  	"version_wedding_feature2" varchar,
  	"version_wedding_feature3" varchar,
  	"version_birthday_title" varchar,
  	"version_birthday_description" varchar,
  	"version_birthday_feature1" varchar,
  	"version_birthday_feature2" varchar,
  	"version_birthday_feature3" varchar,
  	"version_brand_exclusives_heading" varchar,
  	"version_brand_exclusives_description" varchar,
  	"version_brand_events_mondial_title" varchar,
  	"version_brand_events_frank_co_title" varchar,
  	"version_brand_events_maharva_title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "visit_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_visit_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "visit_page_locales" (
  	"reservations_note" varchar,
  	"dietary_policy_heading" varchar,
  	"dietary_policy_description" varchar,
  	"dress_code_policy_heading" varchar,
  	"dress_code_policy_description" varchar,
  	"parking_policy_heading" varchar,
  	"parking_policy_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_visit_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__visit_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__visit_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_visit_page_v_locales" (
  	"version_reservations_note" varchar,
  	"version_dietary_policy_heading" varchar,
  	"version_dietary_policy_description" varchar,
  	"version_dress_code_policy_heading" varchar,
  	"version_dress_code_policy_description" varchar,
  	"version_parking_policy_heading" varchar,
  	"version_parking_policy_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "recognition_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_status" "enum_recognition_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "recognition_page_locales" (
  	"kicker" varchar,
  	"subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_recognition_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version__status" "enum__recognition_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__recognition_page_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_recognition_page_v_locales" (
  	"version_kicker" varchar,
  	"version_subtitle" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_locales" ADD CONSTRAINT "about_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_page_v_locales" ADD CONSTRAINT "_about_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "experience_page_locales" ADD CONSTRAINT "experience_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."experience_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_experience_page_v_locales" ADD CONSTRAINT "_experience_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_experience_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "occasions_page_locales" ADD CONSTRAINT "occasions_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."occasions_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_occasions_page_v_locales" ADD CONSTRAINT "_occasions_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_occasions_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "visit_page_locales" ADD CONSTRAINT "visit_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."visit_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_visit_page_v_locales" ADD CONSTRAINT "_visit_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_visit_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "recognition_page_locales" ADD CONSTRAINT "recognition_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."recognition_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_recognition_page_v_locales" ADD CONSTRAINT "_recognition_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_recognition_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page__status_idx" ON "about_page" USING btree ("_status");
  CREATE UNIQUE INDEX "about_page_locales_locale_parent_id_unique" ON "about_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_about_page_v_version_version__status_idx" ON "_about_page_v" USING btree ("version__status");
  CREATE INDEX "_about_page_v_created_at_idx" ON "_about_page_v" USING btree ("created_at");
  CREATE INDEX "_about_page_v_updated_at_idx" ON "_about_page_v" USING btree ("updated_at");
  CREATE INDEX "_about_page_v_snapshot_idx" ON "_about_page_v" USING btree ("snapshot");
  CREATE INDEX "_about_page_v_published_locale_idx" ON "_about_page_v" USING btree ("published_locale");
  CREATE INDEX "_about_page_v_latest_idx" ON "_about_page_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_about_page_v_locales_locale_parent_id_unique" ON "_about_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "experience_page__status_idx" ON "experience_page" USING btree ("_status");
  CREATE UNIQUE INDEX "experience_page_locales_locale_parent_id_unique" ON "experience_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_experience_page_v_version_version__status_idx" ON "_experience_page_v" USING btree ("version__status");
  CREATE INDEX "_experience_page_v_created_at_idx" ON "_experience_page_v" USING btree ("created_at");
  CREATE INDEX "_experience_page_v_updated_at_idx" ON "_experience_page_v" USING btree ("updated_at");
  CREATE INDEX "_experience_page_v_snapshot_idx" ON "_experience_page_v" USING btree ("snapshot");
  CREATE INDEX "_experience_page_v_published_locale_idx" ON "_experience_page_v" USING btree ("published_locale");
  CREATE INDEX "_experience_page_v_latest_idx" ON "_experience_page_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_experience_page_v_locales_locale_parent_id_unique" ON "_experience_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "occasions_page__status_idx" ON "occasions_page" USING btree ("_status");
  CREATE UNIQUE INDEX "occasions_page_locales_locale_parent_id_unique" ON "occasions_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_occasions_page_v_version_version__status_idx" ON "_occasions_page_v" USING btree ("version__status");
  CREATE INDEX "_occasions_page_v_created_at_idx" ON "_occasions_page_v" USING btree ("created_at");
  CREATE INDEX "_occasions_page_v_updated_at_idx" ON "_occasions_page_v" USING btree ("updated_at");
  CREATE INDEX "_occasions_page_v_snapshot_idx" ON "_occasions_page_v" USING btree ("snapshot");
  CREATE INDEX "_occasions_page_v_published_locale_idx" ON "_occasions_page_v" USING btree ("published_locale");
  CREATE INDEX "_occasions_page_v_latest_idx" ON "_occasions_page_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_occasions_page_v_locales_locale_parent_id_unique" ON "_occasions_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "visit_page__status_idx" ON "visit_page" USING btree ("_status");
  CREATE UNIQUE INDEX "visit_page_locales_locale_parent_id_unique" ON "visit_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_visit_page_v_version_version__status_idx" ON "_visit_page_v" USING btree ("version__status");
  CREATE INDEX "_visit_page_v_created_at_idx" ON "_visit_page_v" USING btree ("created_at");
  CREATE INDEX "_visit_page_v_updated_at_idx" ON "_visit_page_v" USING btree ("updated_at");
  CREATE INDEX "_visit_page_v_snapshot_idx" ON "_visit_page_v" USING btree ("snapshot");
  CREATE INDEX "_visit_page_v_published_locale_idx" ON "_visit_page_v" USING btree ("published_locale");
  CREATE INDEX "_visit_page_v_latest_idx" ON "_visit_page_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_visit_page_v_locales_locale_parent_id_unique" ON "_visit_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "recognition_page__status_idx" ON "recognition_page" USING btree ("_status");
  CREATE UNIQUE INDEX "recognition_page_locales_locale_parent_id_unique" ON "recognition_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_recognition_page_v_version_version__status_idx" ON "_recognition_page_v" USING btree ("version__status");
  CREATE INDEX "_recognition_page_v_created_at_idx" ON "_recognition_page_v" USING btree ("created_at");
  CREATE INDEX "_recognition_page_v_updated_at_idx" ON "_recognition_page_v" USING btree ("updated_at");
  CREATE INDEX "_recognition_page_v_snapshot_idx" ON "_recognition_page_v" USING btree ("snapshot");
  CREATE INDEX "_recognition_page_v_published_locale_idx" ON "_recognition_page_v" USING btree ("published_locale");
  CREATE INDEX "_recognition_page_v_latest_idx" ON "_recognition_page_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_recognition_page_v_locales_locale_parent_id_unique" ON "_recognition_page_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "site_settings" DROP COLUMN "dietary_policy";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "about_page_locales" CASCADE;
  DROP TABLE "_about_page_v" CASCADE;
  DROP TABLE "_about_page_v_locales" CASCADE;
  DROP TABLE "experience_page" CASCADE;
  DROP TABLE "experience_page_locales" CASCADE;
  DROP TABLE "_experience_page_v" CASCADE;
  DROP TABLE "_experience_page_v_locales" CASCADE;
  DROP TABLE "occasions_page" CASCADE;
  DROP TABLE "occasions_page_locales" CASCADE;
  DROP TABLE "_occasions_page_v" CASCADE;
  DROP TABLE "_occasions_page_v_locales" CASCADE;
  DROP TABLE "visit_page" CASCADE;
  DROP TABLE "visit_page_locales" CASCADE;
  DROP TABLE "_visit_page_v" CASCADE;
  DROP TABLE "_visit_page_v_locales" CASCADE;
  DROP TABLE "recognition_page" CASCADE;
  DROP TABLE "recognition_page_locales" CASCADE;
  DROP TABLE "_recognition_page_v" CASCADE;
  DROP TABLE "_recognition_page_v_locales" CASCADE;
  ALTER TABLE "site_settings" ADD COLUMN "dietary_policy" varchar DEFAULT 'No Pork, No Lard';
  DROP TYPE "public"."enum_about_page_status";
  DROP TYPE "public"."enum__about_page_v_version_status";
  DROP TYPE "public"."enum__about_page_v_published_locale";
  DROP TYPE "public"."enum_experience_page_status";
  DROP TYPE "public"."enum__experience_page_v_version_status";
  DROP TYPE "public"."enum__experience_page_v_published_locale";
  DROP TYPE "public"."enum_occasions_page_status";
  DROP TYPE "public"."enum__occasions_page_v_version_status";
  DROP TYPE "public"."enum__occasions_page_v_published_locale";
  DROP TYPE "public"."enum_visit_page_status";
  DROP TYPE "public"."enum__visit_page_v_version_status";
  DROP TYPE "public"."enum__visit_page_v_published_locale";
  DROP TYPE "public"."enum_recognition_page_status";
  DROP TYPE "public"."enum__recognition_page_v_version_status";
  DROP TYPE "public"."enum__recognition_page_v_published_locale";`)
}
