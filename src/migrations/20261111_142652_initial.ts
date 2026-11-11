import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_services_group" AS ENUM('Roads and earthworks', 'Buildings and interiors', 'Planning and delivery');
  CREATE TYPE "public"."enum_services_form_type" AS ENUM('project', 'consultation');
  CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_version_group" AS ENUM('Roads and earthworks', 'Buildings and interiors', 'Planning and delivery');
  CREATE TYPE "public"."enum__services_v_version_form_type" AS ENUM('project', 'consultation');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_projects_client_type" AS ENUM('Commercial & Hospitality', 'Hospitality', 'Hospitality & Residential', 'Residential', 'Public / Roads', 'Commercial');
  CREATE TYPE "public"."enum_projects_delivery_status" AS ENUM('Completed', 'In progress');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_client_type" AS ENUM('Commercial & Hospitality', 'Hospitality', 'Hospitality & Residential', 'Residential', 'Public / Roads', 'Commercial');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_equipment_categories_article" AS ENUM('a', 'an');
  CREATE TYPE "public"."enum_equipment_categories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__equipment_categories_v_version_article" AS ENUM('a', 'an');
  CREATE TYPE "public"."enum__equipment_categories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_equipment_availability" AS ENUM('available', 'on_hire');
  CREATE TYPE "public"."enum_equipment_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__equipment_v_version_availability" AS ENUM('available', 'on_hire');
  CREATE TYPE "public"."enum__equipment_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_credentials_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__credentials_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_team_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__team_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_testimonials_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__testimonials_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_locations_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__locations_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_enquiries_type" AS ENUM('project', 'hire', 'consultation', 'other');
  CREATE TYPE "public"."enum_enquiries_status" AS ENUM('new', 'contacted', 'quoted', 'won', 'closed_lost', 'spam');
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
  	"alt" varchar NOT NULL,
  	"caption" varchar NOT NULL,
  	"credit" varchar,
  	"prefix" varchar DEFAULT 'media',
  	"_objectkey" varchar,
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
  	"focal_y" numeric,
  	"sizes_square_url" varchar,
  	"sizes_square_width" numeric,
  	"sizes_square_height" numeric,
  	"sizes_square_mime_type" varchar,
  	"sizes_square_filesize" numeric,
  	"sizes_square_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_wide_url" varchar,
  	"sizes_wide_width" numeric,
  	"sizes_wide_height" numeric,
  	"sizes_wide_mime_type" varchar,
  	"sizes_wide_filesize" numeric,
  	"sizes_wide_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "enquiry_attachments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enquiry_reference" varchar,
  	"prefix" varchar DEFAULT 'enquiries',
  	"_objectkey" varchar,
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
  
  CREATE TABLE "services_key_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"term" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "services_scope" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "services_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "services_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"short_title" varchar,
  	"slug" varchar,
  	"parent_id" integer,
  	"group" "enum_services_group",
  	"order" numeric DEFAULT 0,
  	"requires_registration" boolean DEFAULT false,
  	"registered_professional_name" varchar,
  	"registration_body_and_number" varchar,
  	"hero_image_id" integer,
  	"hero_headline" varchar,
  	"hero_lead" varchar,
  	"summary" varchar,
  	"intro" varchar,
  	"form_type" "enum_services_form_type" DEFAULT 'project',
  	"cta_label" varchar,
  	"form_heading" varchar,
  	"form_intro" varchar,
  	"primary_keyword" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_services_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_services_v_version_key_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"term" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_scope" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_process" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_short_title" varchar,
  	"version_slug" varchar,
  	"version_parent_id" integer,
  	"version_group" "enum__services_v_version_group",
  	"version_order" numeric DEFAULT 0,
  	"version_requires_registration" boolean DEFAULT false,
  	"version_registered_professional_name" varchar,
  	"version_registration_body_and_number" varchar,
  	"version_hero_image_id" integer,
  	"version_hero_headline" varchar,
  	"version_hero_lead" varchar,
  	"version_summary" varchar,
  	"version_intro" varchar,
  	"version_form_type" "enum__services_v_version_form_type" DEFAULT 'project',
  	"version_cta_label" varchar,
  	"version_form_heading" varchar,
  	"version_form_intro" varchar,
  	"version_primary_keyword" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "projects_key_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "projects_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"featured" boolean DEFAULT false,
  	"location_town" varchar,
  	"location_county" varchar,
  	"location_lat" numeric,
  	"location_lng" numeric,
  	"client_type" "enum_projects_client_type",
  	"year" varchar,
  	"status" "enum_projects_delivery_status" DEFAULT 'Completed',
  	"role" varchar,
  	"delivering_company" varchar,
  	"verification_evidence_note" varchar,
  	"hero_image_id" integer,
  	"brief" varchar,
  	"work" varchar,
  	"result" varchar,
  	"show_value_band" boolean DEFAULT false,
  	"value_band" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "_projects_v_version_key_figures" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"caption" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_location_town" varchar,
  	"version_location_county" varchar,
  	"version_location_lat" numeric,
  	"version_location_lng" numeric,
  	"version_client_type" "enum__projects_v_version_client_type",
  	"version_year" varchar,
  	"version_status" "enum_projects_delivery_status" DEFAULT 'Completed',
  	"version_role" varchar,
  	"version_delivering_company" varchar,
  	"version_verification_evidence_note" varchar,
  	"version_hero_image_id" integer,
  	"version_brief" varchar,
  	"version_work" varchar,
  	"version_result" varchar,
  	"version_show_value_band" boolean DEFAULT false,
  	"version_value_band" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "equipment_categories_uses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "equipment_categories_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "equipment_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"singular" varchar,
  	"article" "enum_equipment_categories_article" DEFAULT 'an',
  	"slug" varchar,
  	"order" numeric DEFAULT 0,
  	"hero_image_id" integer,
  	"hero_headline" varchar,
  	"hero_lead" varchar,
  	"summary" varchar,
  	"intro" varchar,
  	"primary_keyword" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_equipment_categories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_equipment_categories_v_version_uses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_equipment_categories_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_equipment_categories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_singular" varchar,
  	"version_article" "enum__equipment_categories_v_version_article" DEFAULT 'an',
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_hero_image_id" integer,
  	"version_hero_headline" varchar,
  	"version_hero_lead" varchar,
  	"version_summary" varchar,
  	"version_intro" varchar,
  	"version_primary_keyword" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__equipment_categories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "equipment_specs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "equipment_uses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "equipment_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "equipment" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"category_id" integer,
  	"featured" boolean DEFAULT true,
  	"make" varchar,
  	"model" varchar,
  	"year" numeric,
  	"capacity" varchar,
  	"owning_entity" varchar DEFAULT 'Shena Works Limited',
  	"hire_terms_operator" varchar,
  	"hire_terms_fuel" varchar,
  	"hire_terms_transport" varchar,
  	"hire_terms_minimum_hire" varchar,
  	"hire_terms_service_area" varchar,
  	"hire_terms_indicative_rate" varchar,
  	"availability" "enum_equipment_availability" DEFAULT 'available',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_equipment_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_equipment_v_version_specs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_equipment_v_version_uses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_equipment_v_version_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_equipment_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_category_id" integer,
  	"version_featured" boolean DEFAULT true,
  	"version_make" varchar,
  	"version_model" varchar,
  	"version_year" numeric,
  	"version_capacity" varchar,
  	"version_owning_entity" varchar DEFAULT 'Shena Works Limited',
  	"version_hire_terms_operator" varchar,
  	"version_hire_terms_fuel" varchar,
  	"version_hire_terms_transport" varchar,
  	"version_hire_terms_minimum_hire" varchar,
  	"version_hire_terms_service_area" varchar,
  	"version_hire_terms_indicative_rate" varchar,
  	"version_availability" "enum__equipment_v_version_availability" DEFAULT 'available',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__equipment_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "credentials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"issuer" varchar,
  	"number" varchar,
  	"category" varchar,
  	"valid_until" timestamp(3) with time zone,
  	"is_perpetual" boolean DEFAULT false,
  	"certificate_file_id" integer,
  	"holder_id" integer,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_credentials_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_credentials_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_issuer" varchar,
  	"version_number" varchar,
  	"version_category" varchar,
  	"version_valid_until" timestamp(3) with time zone,
  	"version_is_perpetual" boolean DEFAULT false,
  	"version_certificate_file_id" integer,
  	"version_holder_id" integer,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__credentials_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "team_experience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"period" varchar,
  	"role" varchar,
  	"organisation" varchar,
  	"location" varchar,
  	"summary" varchar
  );
  
  CREATE TABLE "team_areas_of_work" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"term" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "team" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"role" varchar,
  	"summary" varchar,
  	"portrait_id" integer,
  	"bio" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"linkedin_url" varchar,
  	"ebk_reg_number" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_team_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_team_v_version_experience" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"period" varchar,
  	"role" varchar,
  	"organisation" varchar,
  	"location" varchar,
  	"summary" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_team_v_version_areas_of_work" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"term" varchar,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_team_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_role" varchar,
  	"version_summary" varchar,
  	"version_portrait_id" integer,
  	"version_bio" varchar,
  	"version_phone" varchar,
  	"version_email" varchar,
  	"version_linkedin_url" varchar,
  	"version_ebk_reg_number" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__team_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "testimonials" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"person" varchar,
  	"title" varchar,
  	"organisation" varchar,
  	"date" timestamp(3) with time zone,
  	"project_id" integer,
  	"is_public_official" boolean DEFAULT false,
  	"permission_file_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_testimonials_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "testimonials_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "_testimonials_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_quote" varchar,
  	"version_person" varchar,
  	"version_title" varchar,
  	"version_organisation" varchar,
  	"version_date" timestamp(3) with time zone,
  	"version_project_id" integer,
  	"version_is_public_official" boolean DEFAULT false,
  	"version_permission_file_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__testimonials_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_testimonials_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "post_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"category_id" integer,
  	"author_id" integer,
  	"published_date" timestamp(3) with time zone,
  	"reading_time_minutes" numeric DEFAULT 5,
  	"cover_image_id" integer,
  	"body" varchar,
  	"related_service_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_category_id" integer,
  	"version_author_id" integer,
  	"version_published_date" timestamp(3) with time zone,
  	"version_reading_time_minutes" numeric DEFAULT 5,
  	"version_cover_image_id" integer,
  	"version_body" varchar,
  	"version_related_service_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "locations_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "locations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"town" varchar,
  	"county" varchar,
  	"slug" varchar,
  	"hero_image_id" integer,
  	"hero_headline" varchar,
  	"hero_lead" varchar,
  	"address" varchar,
  	"phone" varchar,
  	"email" varchar,
  	"hours" varchar,
  	"directions_url" varchar,
  	"map_embed_url" varchar,
  	"geo_lat" numeric,
  	"geo_lng" numeric,
  	"intro" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_locations_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_locations_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_locations_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_town" varchar,
  	"version_county" varchar,
  	"version_slug" varchar,
  	"version_hero_image_id" integer,
  	"version_hero_headline" varchar,
  	"version_hero_lead" varchar,
  	"version_address" varchar,
  	"version_phone" varchar,
  	"version_email" varchar,
  	"version_hours" varchar,
  	"version_directions_url" varchar,
  	"version_map_embed_url" varchar,
  	"version_geo_lat" numeric,
  	"version_geo_lng" numeric,
  	"version_intro" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__locations_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "legal_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"last_updated" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "enquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference" varchar NOT NULL,
  	"type" "enum_enquiries_type" NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar,
  	"organisation" varchar,
  	"service" varchar,
  	"equipment" varchar,
  	"hire_start" timestamp(3) with time zone,
  	"hire_duration" varchar,
  	"location" varchar,
  	"budget_band" varchar,
  	"timeline" varchar,
  	"message" varchar,
  	"consent_accepted_at" timestamp(3) with time zone NOT NULL,
  	"source_page" varchar,
  	"utm_source" varchar,
  	"utm_medium" varchar,
  	"utm_campaign" varchar,
  	"utm_term" varchar,
  	"utm_content" varchar,
  	"utm_gclid" varchar,
  	"status" "enum_enquiries_status" DEFAULT 'new',
  	"assigned_to_id" integer,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "enquiries_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"enquiry_attachments_id" integer
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
  	"enquiry_attachments_id" integer,
  	"services_id" integer,
  	"projects_id" integer,
  	"equipment_categories_id" integer,
  	"equipment_id" integer,
  	"credentials_id" integer,
  	"team_id" integer,
  	"testimonials_id" integer,
  	"post_categories_id" integer,
  	"posts_id" integer,
  	"locations_id" integer,
  	"legal_pages_id" integer,
  	"enquiries_id" integer
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
  
  CREATE TABLE "site_settings_proof_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL,
  	"label" varchar NOT NULL,
  	"verified" boolean DEFAULT false
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_legal_name" varchar DEFAULT 'Shena Works Limited',
  	"company_trading_name" varchar DEFAULT 'Shena Works',
  	"company_tagline" varchar DEFAULT 'Roads & Building Construction Contractors',
  	"company_motto" varchar DEFAULT 'Connecting communities. Building the future.',
  	"company_reg_number" varchar,
  	"company_incorporation_date" varchar,
  	"company_kra_pin" varchar,
  	"company_directors" varchar,
  	"contact_phone_e164" varchar DEFAULT '+254718971896',
  	"contact_phone_display" varchar DEFAULT '+254 718 971 896',
  	"contact_whatsapp_number" varchar DEFAULT '254718971896',
  	"contact_email" varchar DEFAULT 'shenaworksltd@gmail.com',
  	"contact_office_hours" varchar,
  	"contact_response_time_statement" varchar,
  	"social_linkedin_url" varchar,
  	"social_facebook_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_overline" varchar,
  	"hero_headline" varchar,
  	"hero_lead" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_headline" varchar,
  	"intro" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "credentials_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"safety_summary" varchar,
  	"insurance_summary" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "services_index" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_lead" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "projects_index" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_lead" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "equipment_index" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hire_terms_operator" varchar,
  	"hire_terms_fuel" varchar,
  	"hire_terms_transport" varchar,
  	"hire_terms_service_area" varchar,
  	"hire_terms_minimum_hire" varchar,
  	"hire_terms_rates" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_key_facts" ADD CONSTRAINT "services_key_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_scope" ADD CONSTRAINT "services_scope_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_process" ADD CONSTRAINT "services_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_faqs" ADD CONSTRAINT "services_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "services" ADD CONSTRAINT "services_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v_version_key_facts" ADD CONSTRAINT "_services_v_version_key_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_scope" ADD CONSTRAINT "_services_v_version_scope_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_process" ADD CONSTRAINT "_services_v_version_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_faqs" ADD CONSTRAINT "_services_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_parent_id_services_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_key_figures" ADD CONSTRAINT "projects_key_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_gallery" ADD CONSTRAINT "projects_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_key_figures" ADD CONSTRAINT "_projects_v_version_key_figures_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_gallery" ADD CONSTRAINT "_projects_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_gallery" ADD CONSTRAINT "_projects_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "equipment_categories_uses" ADD CONSTRAINT "equipment_categories_uses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."equipment_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "equipment_categories_faqs" ADD CONSTRAINT "equipment_categories_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."equipment_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "equipment_categories" ADD CONSTRAINT "equipment_categories_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_equipment_categories_v_version_uses" ADD CONSTRAINT "_equipment_categories_v_version_uses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_equipment_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_equipment_categories_v_version_faqs" ADD CONSTRAINT "_equipment_categories_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_equipment_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_equipment_categories_v" ADD CONSTRAINT "_equipment_categories_v_parent_id_equipment_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."equipment_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_equipment_categories_v" ADD CONSTRAINT "_equipment_categories_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "equipment_specs" ADD CONSTRAINT "equipment_specs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "equipment_uses" ADD CONSTRAINT "equipment_uses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "equipment_images" ADD CONSTRAINT "equipment_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "equipment_images" ADD CONSTRAINT "equipment_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "equipment" ADD CONSTRAINT "equipment_category_id_equipment_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."equipment_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_equipment_v_version_specs" ADD CONSTRAINT "_equipment_v_version_specs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_equipment_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_equipment_v_version_uses" ADD CONSTRAINT "_equipment_v_version_uses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_equipment_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_equipment_v_version_images" ADD CONSTRAINT "_equipment_v_version_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_equipment_v_version_images" ADD CONSTRAINT "_equipment_v_version_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_equipment_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_equipment_v" ADD CONSTRAINT "_equipment_v_parent_id_equipment_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."equipment"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_equipment_v" ADD CONSTRAINT "_equipment_v_version_category_id_equipment_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."equipment_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "credentials" ADD CONSTRAINT "credentials_certificate_file_id_media_id_fk" FOREIGN KEY ("certificate_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "credentials" ADD CONSTRAINT "credentials_holder_id_team_id_fk" FOREIGN KEY ("holder_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_credentials_v" ADD CONSTRAINT "_credentials_v_parent_id_credentials_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."credentials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_credentials_v" ADD CONSTRAINT "_credentials_v_version_certificate_file_id_media_id_fk" FOREIGN KEY ("version_certificate_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_credentials_v" ADD CONSTRAINT "_credentials_v_version_holder_id_team_id_fk" FOREIGN KEY ("version_holder_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_experience" ADD CONSTRAINT "team_experience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_areas_of_work" ADD CONSTRAINT "team_areas_of_work_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team" ADD CONSTRAINT "team_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_v_version_experience" ADD CONSTRAINT "_team_v_version_experience_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_team_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_team_v_version_areas_of_work" ADD CONSTRAINT "_team_v_version_areas_of_work_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_team_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_team_v" ADD CONSTRAINT "_team_v_parent_id_team_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_team_v" ADD CONSTRAINT "_team_v_version_portrait_id_media_id_fk" FOREIGN KEY ("version_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_permission_file_id_media_id_fk" FOREIGN KEY ("permission_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "testimonials_rels" ADD CONSTRAINT "testimonials_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "testimonials_rels" ADD CONSTRAINT "testimonials_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_parent_id_testimonials_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."testimonials"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_project_id_projects_id_fk" FOREIGN KEY ("version_project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v" ADD CONSTRAINT "_testimonials_v_version_permission_file_id_media_id_fk" FOREIGN KEY ("version_permission_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_testimonials_v_rels" ADD CONSTRAINT "_testimonials_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_testimonials_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_testimonials_v_rels" ADD CONSTRAINT "_testimonials_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_post_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."post_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_team_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_related_service_id_services_id_fk" FOREIGN KEY ("related_service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_category_id_post_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."post_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_author_id_team_id_fk" FOREIGN KEY ("version_author_id") REFERENCES "public"."team"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_related_service_id_services_id_fk" FOREIGN KEY ("version_related_service_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "locations_faqs" ADD CONSTRAINT "locations_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "locations" ADD CONSTRAINT "locations_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_locations_v_version_faqs" ADD CONSTRAINT "_locations_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_locations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_locations_v" ADD CONSTRAINT "_locations_v_parent_id_locations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_locations_v" ADD CONSTRAINT "_locations_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "enquiries_rels" ADD CONSTRAINT "enquiries_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "enquiries_rels" ADD CONSTRAINT "enquiries_rels_enquiry_attachments_fk" FOREIGN KEY ("enquiry_attachments_id") REFERENCES "public"."enquiry_attachments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enquiry_attachments_fk" FOREIGN KEY ("enquiry_attachments_id") REFERENCES "public"."enquiry_attachments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_equipment_categories_fk" FOREIGN KEY ("equipment_categories_id") REFERENCES "public"."equipment_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_equipment_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_credentials_fk" FOREIGN KEY ("credentials_id") REFERENCES "public"."credentials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_fk" FOREIGN KEY ("team_id") REFERENCES "public"."team"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_testimonials_fk" FOREIGN KEY ("testimonials_id") REFERENCES "public"."testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_post_categories_fk" FOREIGN KEY ("post_categories_id") REFERENCES "public"."post_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_locations_fk" FOREIGN KEY ("locations_id") REFERENCES "public"."locations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_legal_pages_fk" FOREIGN KEY ("legal_pages_id") REFERENCES "public"."legal_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enquiries_fk" FOREIGN KEY ("enquiries_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_proof_items" ADD CONSTRAINT "site_settings_proof_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_square_sizes_square_filename_idx" ON "media" USING btree ("sizes_square_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_wide_sizes_wide_filename_idx" ON "media" USING btree ("sizes_wide_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE INDEX "enquiry_attachments_updated_at_idx" ON "enquiry_attachments" USING btree ("updated_at");
  CREATE INDEX "enquiry_attachments_created_at_idx" ON "enquiry_attachments" USING btree ("created_at");
  CREATE UNIQUE INDEX "enquiry_attachments_filename_idx" ON "enquiry_attachments" USING btree ("filename");
  CREATE INDEX "services_key_facts_order_idx" ON "services_key_facts" USING btree ("_order");
  CREATE INDEX "services_key_facts_parent_id_idx" ON "services_key_facts" USING btree ("_parent_id");
  CREATE INDEX "services_scope_order_idx" ON "services_scope" USING btree ("_order");
  CREATE INDEX "services_scope_parent_id_idx" ON "services_scope" USING btree ("_parent_id");
  CREATE INDEX "services_process_order_idx" ON "services_process" USING btree ("_order");
  CREATE INDEX "services_process_parent_id_idx" ON "services_process" USING btree ("_parent_id");
  CREATE INDEX "services_faqs_order_idx" ON "services_faqs" USING btree ("_order");
  CREATE INDEX "services_faqs_parent_id_idx" ON "services_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_parent_idx" ON "services" USING btree ("parent_id");
  CREATE INDEX "services_hero_image_idx" ON "services" USING btree ("hero_image_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE INDEX "_services_v_version_key_facts_order_idx" ON "_services_v_version_key_facts" USING btree ("_order");
  CREATE INDEX "_services_v_version_key_facts_parent_id_idx" ON "_services_v_version_key_facts" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_scope_order_idx" ON "_services_v_version_scope" USING btree ("_order");
  CREATE INDEX "_services_v_version_scope_parent_id_idx" ON "_services_v_version_scope" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_process_order_idx" ON "_services_v_version_process" USING btree ("_order");
  CREATE INDEX "_services_v_version_process_parent_id_idx" ON "_services_v_version_process" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_faqs_order_idx" ON "_services_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_services_v_version_faqs_parent_id_idx" ON "_services_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_slug_idx" ON "_services_v" USING btree ("version_slug");
  CREATE INDEX "_services_v_version_version_parent_idx" ON "_services_v" USING btree ("version_parent_id");
  CREATE INDEX "_services_v_version_version_hero_image_idx" ON "_services_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  CREATE INDEX "projects_key_figures_order_idx" ON "projects_key_figures" USING btree ("_order");
  CREATE INDEX "projects_key_figures_parent_id_idx" ON "projects_key_figures" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_order_idx" ON "projects_gallery" USING btree ("_order");
  CREATE INDEX "projects_gallery_parent_id_idx" ON "projects_gallery" USING btree ("_parent_id");
  CREATE INDEX "projects_gallery_image_idx" ON "projects_gallery" USING btree ("image_id");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_hero_image_idx" ON "projects" USING btree ("hero_image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_services_id_idx" ON "projects_rels" USING btree ("services_id");
  CREATE INDEX "_projects_v_version_key_figures_order_idx" ON "_projects_v_version_key_figures" USING btree ("_order");
  CREATE INDEX "_projects_v_version_key_figures_parent_id_idx" ON "_projects_v_version_key_figures" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_gallery_order_idx" ON "_projects_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_projects_v_version_gallery_parent_id_idx" ON "_projects_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_gallery_image_idx" ON "_projects_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_hero_image_idx" ON "_projects_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_services_id_idx" ON "_projects_v_rels" USING btree ("services_id");
  CREATE INDEX "equipment_categories_uses_order_idx" ON "equipment_categories_uses" USING btree ("_order");
  CREATE INDEX "equipment_categories_uses_parent_id_idx" ON "equipment_categories_uses" USING btree ("_parent_id");
  CREATE INDEX "equipment_categories_faqs_order_idx" ON "equipment_categories_faqs" USING btree ("_order");
  CREATE INDEX "equipment_categories_faqs_parent_id_idx" ON "equipment_categories_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "equipment_categories_slug_idx" ON "equipment_categories" USING btree ("slug");
  CREATE INDEX "equipment_categories_hero_image_idx" ON "equipment_categories" USING btree ("hero_image_id");
  CREATE INDEX "equipment_categories_updated_at_idx" ON "equipment_categories" USING btree ("updated_at");
  CREATE INDEX "equipment_categories_created_at_idx" ON "equipment_categories" USING btree ("created_at");
  CREATE INDEX "equipment_categories__status_idx" ON "equipment_categories" USING btree ("_status");
  CREATE INDEX "_equipment_categories_v_version_uses_order_idx" ON "_equipment_categories_v_version_uses" USING btree ("_order");
  CREATE INDEX "_equipment_categories_v_version_uses_parent_id_idx" ON "_equipment_categories_v_version_uses" USING btree ("_parent_id");
  CREATE INDEX "_equipment_categories_v_version_faqs_order_idx" ON "_equipment_categories_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_equipment_categories_v_version_faqs_parent_id_idx" ON "_equipment_categories_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_equipment_categories_v_parent_idx" ON "_equipment_categories_v" USING btree ("parent_id");
  CREATE INDEX "_equipment_categories_v_version_version_slug_idx" ON "_equipment_categories_v" USING btree ("version_slug");
  CREATE INDEX "_equipment_categories_v_version_version_hero_image_idx" ON "_equipment_categories_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_equipment_categories_v_version_version_updated_at_idx" ON "_equipment_categories_v" USING btree ("version_updated_at");
  CREATE INDEX "_equipment_categories_v_version_version_created_at_idx" ON "_equipment_categories_v" USING btree ("version_created_at");
  CREATE INDEX "_equipment_categories_v_version_version__status_idx" ON "_equipment_categories_v" USING btree ("version__status");
  CREATE INDEX "_equipment_categories_v_created_at_idx" ON "_equipment_categories_v" USING btree ("created_at");
  CREATE INDEX "_equipment_categories_v_updated_at_idx" ON "_equipment_categories_v" USING btree ("updated_at");
  CREATE INDEX "_equipment_categories_v_latest_idx" ON "_equipment_categories_v" USING btree ("latest");
  CREATE INDEX "equipment_specs_order_idx" ON "equipment_specs" USING btree ("_order");
  CREATE INDEX "equipment_specs_parent_id_idx" ON "equipment_specs" USING btree ("_parent_id");
  CREATE INDEX "equipment_uses_order_idx" ON "equipment_uses" USING btree ("_order");
  CREATE INDEX "equipment_uses_parent_id_idx" ON "equipment_uses" USING btree ("_parent_id");
  CREATE INDEX "equipment_images_order_idx" ON "equipment_images" USING btree ("_order");
  CREATE INDEX "equipment_images_parent_id_idx" ON "equipment_images" USING btree ("_parent_id");
  CREATE INDEX "equipment_images_image_idx" ON "equipment_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "equipment_slug_idx" ON "equipment" USING btree ("slug");
  CREATE INDEX "equipment_category_idx" ON "equipment" USING btree ("category_id");
  CREATE INDEX "equipment_updated_at_idx" ON "equipment" USING btree ("updated_at");
  CREATE INDEX "equipment_created_at_idx" ON "equipment" USING btree ("created_at");
  CREATE INDEX "equipment__status_idx" ON "equipment" USING btree ("_status");
  CREATE INDEX "_equipment_v_version_specs_order_idx" ON "_equipment_v_version_specs" USING btree ("_order");
  CREATE INDEX "_equipment_v_version_specs_parent_id_idx" ON "_equipment_v_version_specs" USING btree ("_parent_id");
  CREATE INDEX "_equipment_v_version_uses_order_idx" ON "_equipment_v_version_uses" USING btree ("_order");
  CREATE INDEX "_equipment_v_version_uses_parent_id_idx" ON "_equipment_v_version_uses" USING btree ("_parent_id");
  CREATE INDEX "_equipment_v_version_images_order_idx" ON "_equipment_v_version_images" USING btree ("_order");
  CREATE INDEX "_equipment_v_version_images_parent_id_idx" ON "_equipment_v_version_images" USING btree ("_parent_id");
  CREATE INDEX "_equipment_v_version_images_image_idx" ON "_equipment_v_version_images" USING btree ("image_id");
  CREATE INDEX "_equipment_v_parent_idx" ON "_equipment_v" USING btree ("parent_id");
  CREATE INDEX "_equipment_v_version_version_slug_idx" ON "_equipment_v" USING btree ("version_slug");
  CREATE INDEX "_equipment_v_version_version_category_idx" ON "_equipment_v" USING btree ("version_category_id");
  CREATE INDEX "_equipment_v_version_version_updated_at_idx" ON "_equipment_v" USING btree ("version_updated_at");
  CREATE INDEX "_equipment_v_version_version_created_at_idx" ON "_equipment_v" USING btree ("version_created_at");
  CREATE INDEX "_equipment_v_version_version__status_idx" ON "_equipment_v" USING btree ("version__status");
  CREATE INDEX "_equipment_v_created_at_idx" ON "_equipment_v" USING btree ("created_at");
  CREATE INDEX "_equipment_v_updated_at_idx" ON "_equipment_v" USING btree ("updated_at");
  CREATE INDEX "_equipment_v_latest_idx" ON "_equipment_v" USING btree ("latest");
  CREATE INDEX "credentials_certificate_file_idx" ON "credentials" USING btree ("certificate_file_id");
  CREATE INDEX "credentials_holder_idx" ON "credentials" USING btree ("holder_id");
  CREATE INDEX "credentials_updated_at_idx" ON "credentials" USING btree ("updated_at");
  CREATE INDEX "credentials_created_at_idx" ON "credentials" USING btree ("created_at");
  CREATE INDEX "credentials__status_idx" ON "credentials" USING btree ("_status");
  CREATE INDEX "_credentials_v_parent_idx" ON "_credentials_v" USING btree ("parent_id");
  CREATE INDEX "_credentials_v_version_version_certificate_file_idx" ON "_credentials_v" USING btree ("version_certificate_file_id");
  CREATE INDEX "_credentials_v_version_version_holder_idx" ON "_credentials_v" USING btree ("version_holder_id");
  CREATE INDEX "_credentials_v_version_version_updated_at_idx" ON "_credentials_v" USING btree ("version_updated_at");
  CREATE INDEX "_credentials_v_version_version_created_at_idx" ON "_credentials_v" USING btree ("version_created_at");
  CREATE INDEX "_credentials_v_version_version__status_idx" ON "_credentials_v" USING btree ("version__status");
  CREATE INDEX "_credentials_v_created_at_idx" ON "_credentials_v" USING btree ("created_at");
  CREATE INDEX "_credentials_v_updated_at_idx" ON "_credentials_v" USING btree ("updated_at");
  CREATE INDEX "_credentials_v_latest_idx" ON "_credentials_v" USING btree ("latest");
  CREATE INDEX "team_experience_order_idx" ON "team_experience" USING btree ("_order");
  CREATE INDEX "team_experience_parent_id_idx" ON "team_experience" USING btree ("_parent_id");
  CREATE INDEX "team_areas_of_work_order_idx" ON "team_areas_of_work" USING btree ("_order");
  CREATE INDEX "team_areas_of_work_parent_id_idx" ON "team_areas_of_work" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "team_slug_idx" ON "team" USING btree ("slug");
  CREATE INDEX "team_portrait_idx" ON "team" USING btree ("portrait_id");
  CREATE INDEX "team_updated_at_idx" ON "team" USING btree ("updated_at");
  CREATE INDEX "team_created_at_idx" ON "team" USING btree ("created_at");
  CREATE INDEX "team__status_idx" ON "team" USING btree ("_status");
  CREATE INDEX "_team_v_version_experience_order_idx" ON "_team_v_version_experience" USING btree ("_order");
  CREATE INDEX "_team_v_version_experience_parent_id_idx" ON "_team_v_version_experience" USING btree ("_parent_id");
  CREATE INDEX "_team_v_version_areas_of_work_order_idx" ON "_team_v_version_areas_of_work" USING btree ("_order");
  CREATE INDEX "_team_v_version_areas_of_work_parent_id_idx" ON "_team_v_version_areas_of_work" USING btree ("_parent_id");
  CREATE INDEX "_team_v_parent_idx" ON "_team_v" USING btree ("parent_id");
  CREATE INDEX "_team_v_version_version_slug_idx" ON "_team_v" USING btree ("version_slug");
  CREATE INDEX "_team_v_version_version_portrait_idx" ON "_team_v" USING btree ("version_portrait_id");
  CREATE INDEX "_team_v_version_version_updated_at_idx" ON "_team_v" USING btree ("version_updated_at");
  CREATE INDEX "_team_v_version_version_created_at_idx" ON "_team_v" USING btree ("version_created_at");
  CREATE INDEX "_team_v_version_version__status_idx" ON "_team_v" USING btree ("version__status");
  CREATE INDEX "_team_v_created_at_idx" ON "_team_v" USING btree ("created_at");
  CREATE INDEX "_team_v_updated_at_idx" ON "_team_v" USING btree ("updated_at");
  CREATE INDEX "_team_v_latest_idx" ON "_team_v" USING btree ("latest");
  CREATE INDEX "testimonials_project_idx" ON "testimonials" USING btree ("project_id");
  CREATE INDEX "testimonials_permission_file_idx" ON "testimonials" USING btree ("permission_file_id");
  CREATE INDEX "testimonials_updated_at_idx" ON "testimonials" USING btree ("updated_at");
  CREATE INDEX "testimonials_created_at_idx" ON "testimonials" USING btree ("created_at");
  CREATE INDEX "testimonials__status_idx" ON "testimonials" USING btree ("_status");
  CREATE INDEX "testimonials_rels_order_idx" ON "testimonials_rels" USING btree ("order");
  CREATE INDEX "testimonials_rels_parent_idx" ON "testimonials_rels" USING btree ("parent_id");
  CREATE INDEX "testimonials_rels_path_idx" ON "testimonials_rels" USING btree ("path");
  CREATE INDEX "testimonials_rels_services_id_idx" ON "testimonials_rels" USING btree ("services_id");
  CREATE INDEX "_testimonials_v_parent_idx" ON "_testimonials_v" USING btree ("parent_id");
  CREATE INDEX "_testimonials_v_version_version_project_idx" ON "_testimonials_v" USING btree ("version_project_id");
  CREATE INDEX "_testimonials_v_version_version_permission_file_idx" ON "_testimonials_v" USING btree ("version_permission_file_id");
  CREATE INDEX "_testimonials_v_version_version_updated_at_idx" ON "_testimonials_v" USING btree ("version_updated_at");
  CREATE INDEX "_testimonials_v_version_version_created_at_idx" ON "_testimonials_v" USING btree ("version_created_at");
  CREATE INDEX "_testimonials_v_version_version__status_idx" ON "_testimonials_v" USING btree ("version__status");
  CREATE INDEX "_testimonials_v_created_at_idx" ON "_testimonials_v" USING btree ("created_at");
  CREATE INDEX "_testimonials_v_updated_at_idx" ON "_testimonials_v" USING btree ("updated_at");
  CREATE INDEX "_testimonials_v_latest_idx" ON "_testimonials_v" USING btree ("latest");
  CREATE INDEX "_testimonials_v_rels_order_idx" ON "_testimonials_v_rels" USING btree ("order");
  CREATE INDEX "_testimonials_v_rels_parent_idx" ON "_testimonials_v_rels" USING btree ("parent_id");
  CREATE INDEX "_testimonials_v_rels_path_idx" ON "_testimonials_v_rels" USING btree ("path");
  CREATE INDEX "_testimonials_v_rels_services_id_idx" ON "_testimonials_v_rels" USING btree ("services_id");
  CREATE UNIQUE INDEX "post_categories_slug_idx" ON "post_categories" USING btree ("slug");
  CREATE INDEX "post_categories_updated_at_idx" ON "post_categories" USING btree ("updated_at");
  CREATE INDEX "post_categories_created_at_idx" ON "post_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_category_idx" ON "posts" USING btree ("category_id");
  CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");
  CREATE INDEX "posts_cover_image_idx" ON "posts" USING btree ("cover_image_id");
  CREATE INDEX "posts_related_service_idx" ON "posts" USING btree ("related_service_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_category_idx" ON "_posts_v" USING btree ("version_category_id");
  CREATE INDEX "_posts_v_version_version_author_idx" ON "_posts_v" USING btree ("version_author_id");
  CREATE INDEX "_posts_v_version_version_cover_image_idx" ON "_posts_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_posts_v_version_version_related_service_idx" ON "_posts_v" USING btree ("version_related_service_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "locations_faqs_order_idx" ON "locations_faqs" USING btree ("_order");
  CREATE INDEX "locations_faqs_parent_id_idx" ON "locations_faqs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "locations_slug_idx" ON "locations" USING btree ("slug");
  CREATE INDEX "locations_hero_image_idx" ON "locations" USING btree ("hero_image_id");
  CREATE INDEX "locations_updated_at_idx" ON "locations" USING btree ("updated_at");
  CREATE INDEX "locations_created_at_idx" ON "locations" USING btree ("created_at");
  CREATE INDEX "locations__status_idx" ON "locations" USING btree ("_status");
  CREATE INDEX "_locations_v_version_faqs_order_idx" ON "_locations_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_locations_v_version_faqs_parent_id_idx" ON "_locations_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_locations_v_parent_idx" ON "_locations_v" USING btree ("parent_id");
  CREATE INDEX "_locations_v_version_version_slug_idx" ON "_locations_v" USING btree ("version_slug");
  CREATE INDEX "_locations_v_version_version_hero_image_idx" ON "_locations_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_locations_v_version_version_updated_at_idx" ON "_locations_v" USING btree ("version_updated_at");
  CREATE INDEX "_locations_v_version_version_created_at_idx" ON "_locations_v" USING btree ("version_created_at");
  CREATE INDEX "_locations_v_version_version__status_idx" ON "_locations_v" USING btree ("version__status");
  CREATE INDEX "_locations_v_created_at_idx" ON "_locations_v" USING btree ("created_at");
  CREATE INDEX "_locations_v_updated_at_idx" ON "_locations_v" USING btree ("updated_at");
  CREATE INDEX "_locations_v_latest_idx" ON "_locations_v" USING btree ("latest");
  CREATE UNIQUE INDEX "legal_pages_slug_idx" ON "legal_pages" USING btree ("slug");
  CREATE INDEX "legal_pages_updated_at_idx" ON "legal_pages" USING btree ("updated_at");
  CREATE INDEX "legal_pages_created_at_idx" ON "legal_pages" USING btree ("created_at");
  CREATE UNIQUE INDEX "enquiries_reference_idx" ON "enquiries" USING btree ("reference");
  CREATE INDEX "enquiries_assigned_to_idx" ON "enquiries" USING btree ("assigned_to_id");
  CREATE INDEX "enquiries_updated_at_idx" ON "enquiries" USING btree ("updated_at");
  CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");
  CREATE INDEX "enquiries_rels_order_idx" ON "enquiries_rels" USING btree ("order");
  CREATE INDEX "enquiries_rels_parent_idx" ON "enquiries_rels" USING btree ("parent_id");
  CREATE INDEX "enquiries_rels_path_idx" ON "enquiries_rels" USING btree ("path");
  CREATE INDEX "enquiries_rels_enquiry_attachments_id_idx" ON "enquiries_rels" USING btree ("enquiry_attachments_id");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_enquiry_attachments_id_idx" ON "payload_locked_documents_rels" USING btree ("enquiry_attachments_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_equipment_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("equipment_categories_id");
  CREATE INDEX "payload_locked_documents_rels_equipment_id_idx" ON "payload_locked_documents_rels" USING btree ("equipment_id");
  CREATE INDEX "payload_locked_documents_rels_credentials_id_idx" ON "payload_locked_documents_rels" USING btree ("credentials_id");
  CREATE INDEX "payload_locked_documents_rels_team_id_idx" ON "payload_locked_documents_rels" USING btree ("team_id");
  CREATE INDEX "payload_locked_documents_rels_testimonials_id_idx" ON "payload_locked_documents_rels" USING btree ("testimonials_id");
  CREATE INDEX "payload_locked_documents_rels_post_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("post_categories_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_locations_id_idx" ON "payload_locked_documents_rels" USING btree ("locations_id");
  CREATE INDEX "payload_locked_documents_rels_legal_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("legal_pages_id");
  CREATE INDEX "payload_locked_documents_rels_enquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("enquiries_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_proof_items_order_idx" ON "site_settings_proof_items" USING btree ("_order");
  CREATE INDEX "site_settings_proof_items_parent_id_idx" ON "site_settings_proof_items" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "enquiry_attachments" CASCADE;
  DROP TABLE "services_key_facts" CASCADE;
  DROP TABLE "services_scope" CASCADE;
  DROP TABLE "services_process" CASCADE;
  DROP TABLE "services_faqs" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "_services_v_version_key_facts" CASCADE;
  DROP TABLE "_services_v_version_scope" CASCADE;
  DROP TABLE "_services_v_version_process" CASCADE;
  DROP TABLE "_services_v_version_faqs" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "projects_key_figures" CASCADE;
  DROP TABLE "projects_gallery" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "_projects_v_version_key_figures" CASCADE;
  DROP TABLE "_projects_v_version_gallery" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_rels" CASCADE;
  DROP TABLE "equipment_categories_uses" CASCADE;
  DROP TABLE "equipment_categories_faqs" CASCADE;
  DROP TABLE "equipment_categories" CASCADE;
  DROP TABLE "_equipment_categories_v_version_uses" CASCADE;
  DROP TABLE "_equipment_categories_v_version_faqs" CASCADE;
  DROP TABLE "_equipment_categories_v" CASCADE;
  DROP TABLE "equipment_specs" CASCADE;
  DROP TABLE "equipment_uses" CASCADE;
  DROP TABLE "equipment_images" CASCADE;
  DROP TABLE "equipment" CASCADE;
  DROP TABLE "_equipment_v_version_specs" CASCADE;
  DROP TABLE "_equipment_v_version_uses" CASCADE;
  DROP TABLE "_equipment_v_version_images" CASCADE;
  DROP TABLE "_equipment_v" CASCADE;
  DROP TABLE "credentials" CASCADE;
  DROP TABLE "_credentials_v" CASCADE;
  DROP TABLE "team_experience" CASCADE;
  DROP TABLE "team_areas_of_work" CASCADE;
  DROP TABLE "team" CASCADE;
  DROP TABLE "_team_v_version_experience" CASCADE;
  DROP TABLE "_team_v_version_areas_of_work" CASCADE;
  DROP TABLE "_team_v" CASCADE;
  DROP TABLE "testimonials" CASCADE;
  DROP TABLE "testimonials_rels" CASCADE;
  DROP TABLE "_testimonials_v" CASCADE;
  DROP TABLE "_testimonials_v_rels" CASCADE;
  DROP TABLE "post_categories" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "locations_faqs" CASCADE;
  DROP TABLE "locations" CASCADE;
  DROP TABLE "_locations_v_version_faqs" CASCADE;
  DROP TABLE "_locations_v" CASCADE;
  DROP TABLE "legal_pages" CASCADE;
  DROP TABLE "enquiries" CASCADE;
  DROP TABLE "enquiries_rels" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_proof_items" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "credentials_page" CASCADE;
  DROP TABLE "services_index" CASCADE;
  DROP TABLE "projects_index" CASCADE;
  DROP TABLE "equipment_index" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_services_group";
  DROP TYPE "public"."enum_services_form_type";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_version_group";
  DROP TYPE "public"."enum__services_v_version_form_type";
  DROP TYPE "public"."enum__services_v_version_status";
  DROP TYPE "public"."enum_projects_client_type";
  DROP TYPE "public"."enum_projects_delivery_status";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_client_type";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum_equipment_categories_article";
  DROP TYPE "public"."enum_equipment_categories_status";
  DROP TYPE "public"."enum__equipment_categories_v_version_article";
  DROP TYPE "public"."enum__equipment_categories_v_version_status";
  DROP TYPE "public"."enum_equipment_availability";
  DROP TYPE "public"."enum_equipment_status";
  DROP TYPE "public"."enum__equipment_v_version_availability";
  DROP TYPE "public"."enum__equipment_v_version_status";
  DROP TYPE "public"."enum_credentials_status";
  DROP TYPE "public"."enum__credentials_v_version_status";
  DROP TYPE "public"."enum_team_status";
  DROP TYPE "public"."enum__team_v_version_status";
  DROP TYPE "public"."enum_testimonials_status";
  DROP TYPE "public"."enum__testimonials_v_version_status";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_locations_status";
  DROP TYPE "public"."enum__locations_v_version_status";
  DROP TYPE "public"."enum_enquiries_type";
  DROP TYPE "public"."enum_enquiries_status";`)
}
