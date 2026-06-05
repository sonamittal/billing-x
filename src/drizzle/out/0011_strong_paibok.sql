ALTER TABLE "customer_address" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "customer_address" CASCADE;--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "street_1" text NOT NULL;--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "street_2" text;--> statement-breakpoint
ALTER TABLE "customer" DROP COLUMN "address";--> statement-breakpoint
ALTER TABLE "customer_other_details" ADD CONSTRAINT "customer_other_details_customer_id_unique" UNIQUE("customer_id");