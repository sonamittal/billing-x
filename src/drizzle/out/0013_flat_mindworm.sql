ALTER TABLE "customer_other_details" ADD COLUMN "documents" json;--> statement-breakpoint
ALTER TABLE "customer" DROP COLUMN "salutation";--> statement-breakpoint
ALTER TABLE "customer" DROP COLUMN "first_name";--> statement-breakpoint
ALTER TABLE "customer" DROP COLUMN "last_name";