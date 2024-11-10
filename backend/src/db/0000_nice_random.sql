-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "law_status" (
	"affected_law_id" integer,
	"affecting_law_id" integer,
	"status" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "law_data" (
	"id" integer PRIMARY KEY NOT NULL,
	"type" varchar,
	"region" varchar,
	"year" varchar,
	"title" varchar,
	"about" varchar,
	"category" varchar,
	"detail_url" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "law_url" (
	"law_id" integer,
	"id" varchar,
	"download_url" varchar,
	CONSTRAINT "law_url_id_key" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "law_status" ADD CONSTRAINT "fk_affected_law_id" FOREIGN KEY ("affected_law_id") REFERENCES "public"."law_data"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "law_status" ADD CONSTRAINT "fk_affecting_law_id" FOREIGN KEY ("affecting_law_id") REFERENCES "public"."law_data"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "law_url" ADD CONSTRAINT "law_url_law_id_fkey" FOREIGN KEY ("law_id") REFERENCES "public"."law_data"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_id_index" ON "law_url" USING btree ("id" text_ops);
*/