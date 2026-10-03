import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_menu_categories_menu_type" AS ENUM('food', 'beverage');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_published_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_journal_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__journal_posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__journal_posts_v_published_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_recognitions_scope" AS ENUM('restaurant', 'chef');
  CREATE TYPE "public"."enum_recognitions_content_status" AS ENUM('verified', 'demo', 'needs-confirmation');
  CREATE TYPE "public"."enum_homepage_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__homepage_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__homepage_v_published_locale" AS ENUM('en', 'id');
  CREATE TYPE "public"."enum_site_settings_services" AS ENUM('dine-in');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"source_key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "menu_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"menu_type" "enum_menu_categories_menu_type" DEFAULT 'food' NOT NULL,
  	"sort_order" numeric DEFAULT 0 NOT NULL,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "menu_categories_locales" (
  	"name" varchar NOT NULL,
  	"section_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "menu_items_price_variants" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"portion" varchar,
  	"label" varchar,
  	"price_label" varchar NOT NULL
  );
  
  CREATE TABLE "menu_items_additional_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"note" varchar NOT NULL
  );
  
  CREATE TABLE "menu_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"source_key" varchar,
  	"category_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"price_label" varchar,
  	"portion" varchar,
  	"is_intro_block" boolean DEFAULT false,
  	"featured" boolean DEFAULT false,
  	"signature" boolean DEFAULT false,
  	"is_available" boolean DEFAULT true,
  	"sort_order" numeric DEFAULT 0,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "menu_items_locales" (
  	"description" varchar,
  	"subhead" varchar,
  	"subhead_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"start_date_time" timestamp(3) with time zone,
  	"end_date_time" timestamp(3) with time zone,
  	"cover_image_id" integer,
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "events_locales" (
  	"title" varchar,
  	"eyebrow" varchar,
  	"short_description" varchar,
  	"full_description" varchar,
  	"price_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_start_date_time" timestamp(3) with time zone,
  	"version_end_date_time" timestamp(3) with time zone,
  	"version_cover_image_id" integer,
  	"version_featured" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__events_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_events_v_locales" (
  	"version_title" varchar,
  	"version_eyebrow" varchar,
  	"version_short_description" varchar,
  	"version_full_description" varchar,
  	"version_price_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "journal_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar,
  	"cover_image_id" integer,
  	"publish_date" timestamp(3) with time zone,
  	"author_label" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_journal_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "journal_posts_locales" (
  	"title" varchar,
  	"category" varchar,
  	"excerpt" varchar,
  	"content" jsonb,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_journal_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_slug" varchar,
  	"version_cover_image_id" integer,
  	"version_publish_date" timestamp(3) with time zone,
  	"version_author_label" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__journal_posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__journal_posts_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_journal_posts_v_locales" (
  	"version_title" varchar,
  	"version_category" varchar,
  	"version_excerpt" varchar,
  	"version_content" jsonb,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "recognitions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar NOT NULL,
  	"awarding_body" varchar NOT NULL,
  	"scope" "enum_recognitions_scope" NOT NULL,
  	"content_status" "enum_recognitions_content_status" DEFAULT 'needs-confirmation' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "recognitions_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"menu_categories_id" integer,
  	"menu_items_id" integer,
  	"events_id" integer,
  	"journal_posts_id" integer,
  	"recognitions_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
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
  
  CREATE TABLE "homepage_signature_dish_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item_key" varchar,
  	"image_id" integer
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"space_image_primary_id" integer,
  	"space_image_secondary_id" integer,
  	"_status" "enum_homepage_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "homepage_locales" (
  	"hero_headline" varchar,
  	"hero_kicker" varchar,
  	"hero_support" varchar,
  	"hero_location" varchar,
  	"hero_cta_primary" varchar,
  	"hero_cta_secondary" varchar,
  	"hero_cta_label" varchar,
  	"positioning_text" varchar,
  	"positioning_dietary" varchar,
  	"signature_dishes_title" varchar,
  	"chef_preview_text" varchar,
  	"chef_preview_cta_label" varchar,
  	"recognition_intro_title" varchar,
  	"recognition_intro_cta_label" varchar,
  	"events_intro_cta_label" varchar,
  	"journal_intro_title" varchar,
  	"journal_intro_cta_label" varchar,
  	"visit_intro_title" varchar,
  	"space_title" varchar,
  	"space_text" varchar,
  	"space_cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
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
  
  CREATE TABLE "_homepage_v_version_signature_dish_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item_key" varchar,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_homepage_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_image_id" integer,
  	"version_space_image_primary_id" integer,
  	"version_space_image_secondary_id" integer,
  	"version__status" "enum__homepage_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__homepage_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_homepage_v_locales" (
  	"version_hero_headline" varchar,
  	"version_hero_kicker" varchar,
  	"version_hero_support" varchar,
  	"version_hero_location" varchar,
  	"version_hero_cta_primary" varchar,
  	"version_hero_cta_secondary" varchar,
  	"version_hero_cta_label" varchar,
  	"version_positioning_text" varchar,
  	"version_positioning_dietary" varchar,
  	"version_signature_dishes_title" varchar,
  	"version_chef_preview_text" varchar,
  	"version_chef_preview_cta_label" varchar,
  	"version_recognition_intro_title" varchar,
  	"version_recognition_intro_cta_label" varchar,
  	"version_events_intro_cta_label" varchar,
  	"version_journal_intro_title" varchar,
  	"version_journal_intro_cta_label" varchar,
  	"version_visit_intro_title" varchar,
  	"version_space_title" varchar,
  	"version_space_text" varchar,
  	"version_space_cta_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "chef" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar DEFAULT 'Mandif Warokka' NOT NULL,
  	"portrait_id" integer NOT NULL,
  	"video_file_id" integer NOT NULL,
  	"video_poster_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "chef_locales" (
  	"role" varchar,
  	"biography" varchar,
  	"quote" varchar,
  	"cta_label" varchar,
  	"preview_text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
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
  
  CREATE TABLE "page_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"menu_food_image_id" integer NOT NULL,
  	"menu_beverage_image_id" integer NOT NULL,
  	"about_origin_image_id" integer NOT NULL,
  	"about_philosophy_image_id" integer NOT NULL,
  	"about_architecture_image_id" integer NOT NULL,
  	"experience_hero_image_id" integer NOT NULL,
  	"experience_morning_image_id" integer NOT NULL,
  	"experience_evening_image_id" integer NOT NULL,
  	"experience_details_image_id" integer NOT NULL,
  	"occasions_hero_image_id" integer NOT NULL,
  	"occasions_private_dining_image_id" integer NOT NULL,
  	"occasions_wedding_image_id" integer NOT NULL,
  	"occasions_birthday_image_id" integer NOT NULL,
  	"occasions_brand_mondial_image_id" integer NOT NULL,
  	"occasions_brand_frank_co_image_id" integer NOT NULL,
  	"occasions_brand_maharva_image_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_services" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_site_settings_services",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"restaurant_name" varchar DEFAULT 'GEMA Restaurant & Societiet' NOT NULL,
  	"full_address" varchar DEFAULT 'Jl. Musi No.32, Darmo, Kec. Wonokromo, Surabaya, Jawa Timur 60241',
  	"phone" varchar DEFAULT '+62 811-3000-888',
  	"whatsapp_number" varchar DEFAULT '6281252200049',
  	"email" varchar DEFAULT 'reservations@gemasurabaya.com',
  	"instagram_url" varchar DEFAULT 'https://instagram.com/gema.surabaya',
  	"tiktok_url" varchar DEFAULT 'https://www.tiktok.com/@gemarestaurant',
  	"map_url" varchar DEFAULT 'https://maps.google.com/?q=Jl.+Musi+No.+32,+Darmo,+Kec.+Wonokromo,+Surabaya,+Jawa+Timur+60241,+Indonesia',
  	"dietary_policy" varchar DEFAULT 'No Pork, No Lard',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "navigation_header_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_header_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "menu_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "menu_page_locales" (
  	"title" varchar DEFAULT 'The Menu' NOT NULL,
  	"philosophy" varchar DEFAULT 'Honest ingredients, prepared with precision and a touch of art.',
  	"tax_service_footnote" varchar DEFAULT 'All prices are subject to 10% government tax and 10% service charges.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_categories_locales" ADD CONSTRAINT "menu_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_items_price_variants" ADD CONSTRAINT "menu_items_price_variants_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_items_additional_notes" ADD CONSTRAINT "menu_items_additional_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_category_id_menu_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."menu_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "menu_items_locales" ADD CONSTRAINT "menu_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_locales" ADD CONSTRAINT "events_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_locales" ADD CONSTRAINT "_events_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "journal_posts" ADD CONSTRAINT "journal_posts_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "journal_posts_locales" ADD CONSTRAINT "journal_posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."journal_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_journal_posts_v" ADD CONSTRAINT "_journal_posts_v_parent_id_journal_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."journal_posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journal_posts_v" ADD CONSTRAINT "_journal_posts_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_journal_posts_v_locales" ADD CONSTRAINT "_journal_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_journal_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "recognitions_locales" ADD CONSTRAINT "recognitions_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."recognitions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_menu_categories_fk" FOREIGN KEY ("menu_categories_id") REFERENCES "public"."menu_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_menu_items_fk" FOREIGN KEY ("menu_items_id") REFERENCES "public"."menu_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_journal_posts_fk" FOREIGN KEY ("journal_posts_id") REFERENCES "public"."journal_posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_recognitions_fk" FOREIGN KEY ("recognitions_id") REFERENCES "public"."recognitions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_cuisine_teaser" ADD CONSTRAINT "homepage_cuisine_teaser_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_cuisine_teaser" ADD CONSTRAINT "homepage_cuisine_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_cuisine_teaser_locales" ADD CONSTRAINT "homepage_cuisine_teaser_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_cuisine_teaser"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_signature_dish_media" ADD CONSTRAINT "homepage_signature_dish_media_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_signature_dish_media" ADD CONSTRAINT "homepage_signature_dish_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_space_image_primary_id_media_id_fk" FOREIGN KEY ("space_image_primary_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage" ADD CONSTRAINT "homepage_space_image_secondary_id_media_id_fk" FOREIGN KEY ("space_image_secondary_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "homepage_locales" ADD CONSTRAINT "homepage_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_cuisine_teaser" ADD CONSTRAINT "_homepage_v_version_cuisine_teaser_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_cuisine_teaser" ADD CONSTRAINT "_homepage_v_version_cuisine_teaser_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_cuisine_teaser_locales" ADD CONSTRAINT "_homepage_v_version_cuisine_teaser_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v_version_cuisine_teaser"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_signature_dish_media" ADD CONSTRAINT "_homepage_v_version_signature_dish_media_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_version_signature_dish_media" ADD CONSTRAINT "_homepage_v_version_signature_dish_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_space_image_primary_id_media_id_fk" FOREIGN KEY ("version_space_image_primary_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v" ADD CONSTRAINT "_homepage_v_version_space_image_secondary_id_media_id_fk" FOREIGN KEY ("version_space_image_secondary_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_homepage_v_locales" ADD CONSTRAINT "_homepage_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_homepage_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "chef" ADD CONSTRAINT "chef_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "chef" ADD CONSTRAINT "chef_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "chef" ADD CONSTRAINT "chef_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "chef_locales" ADD CONSTRAINT "chef_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."chef"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_media_events" ADD CONSTRAINT "page_media_events_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_media_events" ADD CONSTRAINT "page_media_events_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_media_journal" ADD CONSTRAINT "page_media_journal_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_media_journal" ADD CONSTRAINT "page_media_journal_body_image_id_media_id_fk" FOREIGN KEY ("body_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_media_journal" ADD CONSTRAINT "page_media_journal_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."page_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "page_media" ADD CONSTRAINT "page_media_menu_food_image_id_media_id_fk" FOREIGN KEY ("menu_food_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_media" ADD CONSTRAINT "page_media_menu_beverage_image_id_media_id_fk" FOREIGN KEY ("menu_beverage_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_media" ADD CONSTRAINT "page_media_about_origin_image_id_media_id_fk" FOREIGN KEY ("about_origin_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_media" ADD CONSTRAINT "page_media_about_philosophy_image_id_media_id_fk" FOREIGN KEY ("about_philosophy_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_media" ADD CONSTRAINT "page_media_about_architecture_image_id_media_id_fk" FOREIGN KEY ("about_architecture_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_media" ADD CONSTRAINT "page_media_experience_hero_image_id_media_id_fk" FOREIGN KEY ("experience_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_media" ADD CONSTRAINT "page_media_experience_morning_image_id_media_id_fk" FOREIGN KEY ("experience_morning_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_media" ADD CONSTRAINT "page_media_experience_evening_image_id_media_id_fk" FOREIGN KEY ("experience_evening_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_media" ADD CONSTRAINT "page_media_experience_details_image_id_media_id_fk" FOREIGN KEY ("experience_details_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_media" ADD CONSTRAINT "page_media_occasions_hero_image_id_media_id_fk" FOREIGN KEY ("occasions_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_media" ADD CONSTRAINT "page_media_occasions_private_dining_image_id_media_id_fk" FOREIGN KEY ("occasions_private_dining_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_media" ADD CONSTRAINT "page_media_occasions_wedding_image_id_media_id_fk" FOREIGN KEY ("occasions_wedding_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_media" ADD CONSTRAINT "page_media_occasions_birthday_image_id_media_id_fk" FOREIGN KEY ("occasions_birthday_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_media" ADD CONSTRAINT "page_media_occasions_brand_mondial_image_id_media_id_fk" FOREIGN KEY ("occasions_brand_mondial_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_media" ADD CONSTRAINT "page_media_occasions_brand_frank_co_image_id_media_id_fk" FOREIGN KEY ("occasions_brand_frank_co_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "page_media" ADD CONSTRAINT "page_media_occasions_brand_maharva_image_id_media_id_fk" FOREIGN KEY ("occasions_brand_maharva_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_services" ADD CONSTRAINT "site_settings_services_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header_links" ADD CONSTRAINT "navigation_header_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header_links_locales" ADD CONSTRAINT "navigation_header_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_header_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_links" ADD CONSTRAINT "navigation_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_links_locales" ADD CONSTRAINT "navigation_footer_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "menu_page_locales" ADD CONSTRAINT "menu_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."menu_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "media_source_key_idx" ON "media" USING btree ("source_key");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "menu_categories_slug_idx" ON "menu_categories" USING btree ("slug");
  CREATE INDEX "menu_categories_updated_at_idx" ON "menu_categories" USING btree ("updated_at");
  CREATE INDEX "menu_categories_created_at_idx" ON "menu_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "menu_categories_locales_locale_parent_id_unique" ON "menu_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "menu_items_price_variants_order_idx" ON "menu_items_price_variants" USING btree ("_order");
  CREATE INDEX "menu_items_price_variants_parent_id_idx" ON "menu_items_price_variants" USING btree ("_parent_id");
  CREATE INDEX "menu_items_additional_notes_order_idx" ON "menu_items_additional_notes" USING btree ("_order");
  CREATE INDEX "menu_items_additional_notes_parent_id_idx" ON "menu_items_additional_notes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "menu_items_source_key_idx" ON "menu_items" USING btree ("source_key");
  CREATE INDEX "menu_items_category_idx" ON "menu_items" USING btree ("category_id");
  CREATE INDEX "menu_items_image_idx" ON "menu_items" USING btree ("image_id");
  CREATE INDEX "menu_items_updated_at_idx" ON "menu_items" USING btree ("updated_at");
  CREATE INDEX "menu_items_created_at_idx" ON "menu_items" USING btree ("created_at");
  CREATE UNIQUE INDEX "menu_items_locales_locale_parent_id_unique" ON "menu_items_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_cover_image_idx" ON "events" USING btree ("cover_image_id");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE UNIQUE INDEX "events_locales_locale_parent_id_unique" ON "events_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_cover_image_idx" ON "_events_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_snapshot_idx" ON "_events_v" USING btree ("snapshot");
  CREATE INDEX "_events_v_published_locale_idx" ON "_events_v" USING btree ("published_locale");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_events_v_locales_locale_parent_id_unique" ON "_events_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "journal_posts_slug_idx" ON "journal_posts" USING btree ("slug");
  CREATE INDEX "journal_posts_cover_image_idx" ON "journal_posts" USING btree ("cover_image_id");
  CREATE INDEX "journal_posts_updated_at_idx" ON "journal_posts" USING btree ("updated_at");
  CREATE INDEX "journal_posts_created_at_idx" ON "journal_posts" USING btree ("created_at");
  CREATE INDEX "journal_posts__status_idx" ON "journal_posts" USING btree ("_status");
  CREATE UNIQUE INDEX "journal_posts_locales_locale_parent_id_unique" ON "journal_posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_journal_posts_v_parent_idx" ON "_journal_posts_v" USING btree ("parent_id");
  CREATE INDEX "_journal_posts_v_version_version_slug_idx" ON "_journal_posts_v" USING btree ("version_slug");
  CREATE INDEX "_journal_posts_v_version_version_cover_image_idx" ON "_journal_posts_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_journal_posts_v_version_version_updated_at_idx" ON "_journal_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_journal_posts_v_version_version_created_at_idx" ON "_journal_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_journal_posts_v_version_version__status_idx" ON "_journal_posts_v" USING btree ("version__status");
  CREATE INDEX "_journal_posts_v_created_at_idx" ON "_journal_posts_v" USING btree ("created_at");
  CREATE INDEX "_journal_posts_v_updated_at_idx" ON "_journal_posts_v" USING btree ("updated_at");
  CREATE INDEX "_journal_posts_v_snapshot_idx" ON "_journal_posts_v" USING btree ("snapshot");
  CREATE INDEX "_journal_posts_v_published_locale_idx" ON "_journal_posts_v" USING btree ("published_locale");
  CREATE INDEX "_journal_posts_v_latest_idx" ON "_journal_posts_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_journal_posts_v_locales_locale_parent_id_unique" ON "_journal_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "recognitions_updated_at_idx" ON "recognitions" USING btree ("updated_at");
  CREATE INDEX "recognitions_created_at_idx" ON "recognitions" USING btree ("created_at");
  CREATE UNIQUE INDEX "recognitions_locales_locale_parent_id_unique" ON "recognitions_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_menu_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("menu_categories_id");
  CREATE INDEX "payload_locked_documents_rels_menu_items_id_idx" ON "payload_locked_documents_rels" USING btree ("menu_items_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_journal_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("journal_posts_id");
  CREATE INDEX "payload_locked_documents_rels_recognitions_id_idx" ON "payload_locked_documents_rels" USING btree ("recognitions_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "homepage_cuisine_teaser_order_idx" ON "homepage_cuisine_teaser" USING btree ("_order");
  CREATE INDEX "homepage_cuisine_teaser_parent_id_idx" ON "homepage_cuisine_teaser" USING btree ("_parent_id");
  CREATE INDEX "homepage_cuisine_teaser_image_idx" ON "homepage_cuisine_teaser" USING btree ("image_id");
  CREATE UNIQUE INDEX "homepage_cuisine_teaser_locales_locale_parent_id_unique" ON "homepage_cuisine_teaser_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_signature_dish_media_order_idx" ON "homepage_signature_dish_media" USING btree ("_order");
  CREATE INDEX "homepage_signature_dish_media_parent_id_idx" ON "homepage_signature_dish_media" USING btree ("_parent_id");
  CREATE INDEX "homepage_signature_dish_media_image_idx" ON "homepage_signature_dish_media" USING btree ("image_id");
  CREATE INDEX "homepage_hero_hero_image_idx" ON "homepage" USING btree ("hero_image_id");
  CREATE INDEX "homepage_space_space_image_primary_idx" ON "homepage" USING btree ("space_image_primary_id");
  CREATE INDEX "homepage_space_space_image_secondary_idx" ON "homepage" USING btree ("space_image_secondary_id");
  CREATE INDEX "homepage__status_idx" ON "homepage" USING btree ("_status");
  CREATE UNIQUE INDEX "homepage_locales_locale_parent_id_unique" ON "homepage_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_version_cuisine_teaser_order_idx" ON "_homepage_v_version_cuisine_teaser" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_cuisine_teaser_parent_id_idx" ON "_homepage_v_version_cuisine_teaser" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_cuisine_teaser_image_idx" ON "_homepage_v_version_cuisine_teaser" USING btree ("image_id");
  CREATE UNIQUE INDEX "_homepage_v_version_cuisine_teaser_locales_locale_parent_id_" ON "_homepage_v_version_cuisine_teaser_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_homepage_v_version_signature_dish_media_order_idx" ON "_homepage_v_version_signature_dish_media" USING btree ("_order");
  CREATE INDEX "_homepage_v_version_signature_dish_media_parent_id_idx" ON "_homepage_v_version_signature_dish_media" USING btree ("_parent_id");
  CREATE INDEX "_homepage_v_version_signature_dish_media_image_idx" ON "_homepage_v_version_signature_dish_media" USING btree ("image_id");
  CREATE INDEX "_homepage_v_version_hero_version_hero_image_idx" ON "_homepage_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_homepage_v_version_space_version_space_image_primary_idx" ON "_homepage_v" USING btree ("version_space_image_primary_id");
  CREATE INDEX "_homepage_v_version_space_version_space_image_secondary_idx" ON "_homepage_v" USING btree ("version_space_image_secondary_id");
  CREATE INDEX "_homepage_v_version_version__status_idx" ON "_homepage_v" USING btree ("version__status");
  CREATE INDEX "_homepage_v_created_at_idx" ON "_homepage_v" USING btree ("created_at");
  CREATE INDEX "_homepage_v_updated_at_idx" ON "_homepage_v" USING btree ("updated_at");
  CREATE INDEX "_homepage_v_snapshot_idx" ON "_homepage_v" USING btree ("snapshot");
  CREATE INDEX "_homepage_v_published_locale_idx" ON "_homepage_v" USING btree ("published_locale");
  CREATE INDEX "_homepage_v_latest_idx" ON "_homepage_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_homepage_v_locales_locale_parent_id_unique" ON "_homepage_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "chef_portrait_idx" ON "chef" USING btree ("portrait_id");
  CREATE INDEX "chef_video_file_idx" ON "chef" USING btree ("video_file_id");
  CREATE INDEX "chef_video_poster_idx" ON "chef" USING btree ("video_poster_id");
  CREATE UNIQUE INDEX "chef_locales_locale_parent_id_unique" ON "chef_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "page_media_events_order_idx" ON "page_media_events" USING btree ("_order");
  CREATE INDEX "page_media_events_parent_id_idx" ON "page_media_events" USING btree ("_parent_id");
  CREATE INDEX "page_media_events_cover_image_idx" ON "page_media_events" USING btree ("cover_image_id");
  CREATE INDEX "page_media_journal_order_idx" ON "page_media_journal" USING btree ("_order");
  CREATE INDEX "page_media_journal_parent_id_idx" ON "page_media_journal" USING btree ("_parent_id");
  CREATE INDEX "page_media_journal_cover_image_idx" ON "page_media_journal" USING btree ("cover_image_id");
  CREATE INDEX "page_media_journal_body_image_idx" ON "page_media_journal" USING btree ("body_image_id");
  CREATE INDEX "page_media_menu_menu_food_image_idx" ON "page_media" USING btree ("menu_food_image_id");
  CREATE INDEX "page_media_menu_menu_beverage_image_idx" ON "page_media" USING btree ("menu_beverage_image_id");
  CREATE INDEX "page_media_about_about_origin_image_idx" ON "page_media" USING btree ("about_origin_image_id");
  CREATE INDEX "page_media_about_about_philosophy_image_idx" ON "page_media" USING btree ("about_philosophy_image_id");
  CREATE INDEX "page_media_about_about_architecture_image_idx" ON "page_media" USING btree ("about_architecture_image_id");
  CREATE INDEX "page_media_experience_experience_hero_image_idx" ON "page_media" USING btree ("experience_hero_image_id");
  CREATE INDEX "page_media_experience_experience_morning_image_idx" ON "page_media" USING btree ("experience_morning_image_id");
  CREATE INDEX "page_media_experience_experience_evening_image_idx" ON "page_media" USING btree ("experience_evening_image_id");
  CREATE INDEX "page_media_experience_experience_details_image_idx" ON "page_media" USING btree ("experience_details_image_id");
  CREATE INDEX "page_media_occasions_occasions_hero_image_idx" ON "page_media" USING btree ("occasions_hero_image_id");
  CREATE INDEX "page_media_occasions_occasions_private_dining_image_idx" ON "page_media" USING btree ("occasions_private_dining_image_id");
  CREATE INDEX "page_media_occasions_occasions_wedding_image_idx" ON "page_media" USING btree ("occasions_wedding_image_id");
  CREATE INDEX "page_media_occasions_occasions_birthday_image_idx" ON "page_media" USING btree ("occasions_birthday_image_id");
  CREATE INDEX "page_media_occasions_occasions_brand_mondial_image_idx" ON "page_media" USING btree ("occasions_brand_mondial_image_id");
  CREATE INDEX "page_media_occasions_occasions_brand_frank_co_image_idx" ON "page_media" USING btree ("occasions_brand_frank_co_image_id");
  CREATE INDEX "page_media_occasions_occasions_brand_maharva_image_idx" ON "page_media" USING btree ("occasions_brand_maharva_image_id");
  CREATE INDEX "site_settings_services_order_idx" ON "site_settings_services" USING btree ("order");
  CREATE INDEX "site_settings_services_parent_idx" ON "site_settings_services" USING btree ("parent_id");
  CREATE INDEX "navigation_header_links_order_idx" ON "navigation_header_links" USING btree ("_order");
  CREATE INDEX "navigation_header_links_parent_id_idx" ON "navigation_header_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_header_links_locales_locale_parent_id_unique" ON "navigation_header_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_footer_links_order_idx" ON "navigation_footer_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_links_parent_id_idx" ON "navigation_footer_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "navigation_footer_links_locales_locale_parent_id_unique" ON "navigation_footer_links_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "menu_page_locales_locale_parent_id_unique" ON "menu_page_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "menu_categories" CASCADE;
  DROP TABLE "menu_categories_locales" CASCADE;
  DROP TABLE "menu_items_price_variants" CASCADE;
  DROP TABLE "menu_items_additional_notes" CASCADE;
  DROP TABLE "menu_items" CASCADE;
  DROP TABLE "menu_items_locales" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_locales" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "_events_v_locales" CASCADE;
  DROP TABLE "journal_posts" CASCADE;
  DROP TABLE "journal_posts_locales" CASCADE;
  DROP TABLE "_journal_posts_v" CASCADE;
  DROP TABLE "_journal_posts_v_locales" CASCADE;
  DROP TABLE "recognitions" CASCADE;
  DROP TABLE "recognitions_locales" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "homepage_cuisine_teaser" CASCADE;
  DROP TABLE "homepage_cuisine_teaser_locales" CASCADE;
  DROP TABLE "homepage_signature_dish_media" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TABLE "homepage_locales" CASCADE;
  DROP TABLE "_homepage_v_version_cuisine_teaser" CASCADE;
  DROP TABLE "_homepage_v_version_cuisine_teaser_locales" CASCADE;
  DROP TABLE "_homepage_v_version_signature_dish_media" CASCADE;
  DROP TABLE "_homepage_v" CASCADE;
  DROP TABLE "_homepage_v_locales" CASCADE;
  DROP TABLE "chef" CASCADE;
  DROP TABLE "chef_locales" CASCADE;
  DROP TABLE "page_media_events" CASCADE;
  DROP TABLE "page_media_journal" CASCADE;
  DROP TABLE "page_media" CASCADE;
  DROP TABLE "site_settings_services" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "navigation_header_links" CASCADE;
  DROP TABLE "navigation_header_links_locales" CASCADE;
  DROP TABLE "navigation_footer_links" CASCADE;
  DROP TABLE "navigation_footer_links_locales" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "menu_page" CASCADE;
  DROP TABLE "menu_page_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_menu_categories_menu_type";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum__events_v_published_locale";
  DROP TYPE "public"."enum_journal_posts_status";
  DROP TYPE "public"."enum__journal_posts_v_version_status";
  DROP TYPE "public"."enum__journal_posts_v_published_locale";
  DROP TYPE "public"."enum_recognitions_scope";
  DROP TYPE "public"."enum_recognitions_content_status";
  DROP TYPE "public"."enum_homepage_status";
  DROP TYPE "public"."enum__homepage_v_version_status";
  DROP TYPE "public"."enum__homepage_v_published_locale";
  DROP TYPE "public"."enum_site_settings_services";`)
}
