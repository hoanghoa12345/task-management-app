CREATE TABLE IF NOT EXISTS "settings" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "board" ADD COLUMN "deletedAt" timestamp;--> statement-breakpoint
ALTER TABLE "card" ADD COLUMN "deletedAt" timestamp;--> statement-breakpoint
ALTER TABLE "image" ADD COLUMN "deletedAt" timestamp;--> statement-breakpoint
ALTER TABLE "list" ADD COLUMN "deletedAt" timestamp;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "key_idx" ON "settings" USING btree ("key");