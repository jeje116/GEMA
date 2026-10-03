import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "homepage_signature_dish_media" CASCADE;
  DROP TABLE "_homepage_v_version_signature_dish_media" CASCADE;
  DROP TABLE "page_media_events" CASCADE;
  DROP TABLE "page_media_journal" CASCADE;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "homepage_signature_dish_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item_key" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "_homepage_v_version_signature_dish_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item_key" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "page_media_events" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"event_key" varchar NOT NULL,
  	"cover_image_id" integer NOT NULL
  );
  
  CREATE TABLE "page_media_journal" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"journal_key" varchar NOT NULL,
  	"cover_image_id" integer NOT NULL,
  	"body_image_id" integer
  );
  
  ALTER TABLE "homepage_signature_dish_media" ADD CONSTRAINT "homepage_signature_dish_media_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_signature_dish_media" ADD CONSTRAINT "homepage_signature_dish_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_signature_dish_media" ADD CONSTRAINT "_homepage_v_version_signature_dish_media_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_signature_dish_media" ADD CONSTRAINT "_homepage_v_version_signature_dish_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_media_events" ADD CONSTRAINT "page_media_events_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_media_events" ADD CONSTRAINT "page_media_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_media_journal" ADD CONSTRAINT "page_media_journal_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_media_journal" ADD CONSTRAINT "page_media_journal_body_image_id_media_id_fk" FOREIGN KEY ("body_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_media_journal" ADD CONSTRAINT "page_media_journal_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "homepage_signature_dish_media_order_idx" ON "homepage_signature_dish_media" USING btree ("_order");
  CREATE INDEX "homepage_signature_dish_media_parent_id_idx" ON "homepage_signature_dish_media" USING btree ("_parent_id");
  CREATE INDEX "homepage_signature_dish_media_image_idx" ON "homepage_signature_dish_media" USING btree ("image_id");
  CREATE INDEX "_homepage_v_version_signature_dish_media_order_idx" ON "_homepage_v_version_signature_dish_media" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_signature_dish_media_parent_id_idx" ON "_homepage_v_version_signature_dish_media" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_signature_dish_media_image_idx" ON "_homepage_v_version_signature_dish_media" USING btree ("image_id");
  CREATE INDEX "page_media_events_order_idx" ON "page_media_events" USING btree ("_order");
  CREATE INDEX "page_media_events_parent_id_idx" ON "page_media_events" USING btree ("_parent_id");
  CREATE INDEX "page_media_events_cover_image_idx" ON "page_media_events" USING btree ("cover_image_id");
  CREATE INDEX "page_media_journal_order_idx" ON "page_media_journal" USING btree ("_order");
  CREATE INDEX "page_media_journal_parent_id_idx" ON "page_media_journal" USING btree ("_parent_id");
  CREATE INDEX "page_media_journal_cover_image_idx" ON "page_media_journal" USING btree ("cover_image_id");
  CREATE INDEX "page_media_journal_body_image_idx" ON "page_media_journal" USING btree ("body_image_id");`)
}
