CREATE TABLE IF NOT EXISTS "workshop-2025_mobile_todo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(256) NOT NULL,
	"desc" text,
	"is_completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workshop-2025_refresh_token" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "workshop-2025_refresh_token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workshop-2025_user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(256) NOT NULL,
	"password" varchar(256) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "workshop-2025_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "workshop-2025_todo" RENAME TO "workshop-2025_web_todo";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workshop-2025_mobile_todo" ADD CONSTRAINT "workshop-2025_mobile_todo_user_id_workshop-2025_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."workshop-2025_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workshop-2025_refresh_token" ADD CONSTRAINT "workshop-2025_refresh_token_user_id_workshop-2025_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."workshop-2025_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
