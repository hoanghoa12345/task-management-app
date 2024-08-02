CREATE TABLE IF NOT EXISTS "image" (
	"id" text PRIMARY KEY NOT NULL,
	"thumbnailUrl" text,
	"fullUrl" text,
	"username" text,
	"linkHTML" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
