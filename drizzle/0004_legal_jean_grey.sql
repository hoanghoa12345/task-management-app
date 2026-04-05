DO $$ BEGIN
 CREATE TYPE "public"."action" AS ENUM('create', 'update', 'delete');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."entityType" AS ENUM('board', 'list', 'card');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "auditLog" (
	"id" text PRIMARY KEY NOT NULL,
	"orgId" text NOT NULL,
	"entityId" text,
	"entityType" "entityType",
	"entityTitle" text,
	"userId" text NOT NULL,
	"action" "action",
	"userImage" text,
	"userName" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auditLog" ADD CONSTRAINT "auditLog_orgId_organization_id_fk" FOREIGN KEY ("orgId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auditLog" ADD CONSTRAINT "auditLog_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
