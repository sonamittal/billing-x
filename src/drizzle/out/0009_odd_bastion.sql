ALTER TABLE "customer" ADD COLUMN "mobile" text;--> statement-breakpoint
ALTER TABLE "customer_other_details" ADD COLUMN "remarks" text;--> statement-breakpoint
ALTER TABLE "customer" DROP COLUMN "phone";