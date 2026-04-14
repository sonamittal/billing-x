ALTER TABLE "user" ALTER COLUMN "phone_no" SET DATA TYPE varchar;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "phone_no" SET DEFAULT 'unknown';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "phone_no" DROP NOT NULL;