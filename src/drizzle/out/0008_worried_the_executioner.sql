CREATE TABLE "contact_person" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_id" text NOT NULL,
	"salutation" text,
	"first_name" text,
	"last_name" text,
	"email" text,
	"work_phone" text,
	"mobile" text,
	"designation" text,
	"department" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_address" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_id" text NOT NULL,
	"type" text NOT NULL,
	"country" text,
	"state" text,
	"city" text,
	"pin_code" text,
	"street_1" text,
	"street_2" text,
	"phone" text
);
--> statement-breakpoint
CREATE TABLE "customer_other_details" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_id" text NOT NULL,
	"pan" text,
	"payment_term_id" text,
	"documents" text,
	"website_url" text,
	"department" text,
	"designation" text,
	"x" text,
	"facebook" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_terms" (
	"id" text PRIMARY KEY NOT NULL,
	"term_name" text NOT NULL,
	"due_after" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "customer_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "salutation" text;--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "first_name" text;--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "last_name" text;--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "work_phone" text;--> statement-breakpoint
ALTER TABLE "customer" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "contact_person" ADD CONSTRAINT "contact_person_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_address" ADD CONSTRAINT "customer_address_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_other_details" ADD CONSTRAINT "customer_other_details_customer_id_customer_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_other_details" ADD CONSTRAINT "customer_other_details_payment_term_id_payment_terms_id_fk" FOREIGN KEY ("payment_term_id") REFERENCES "public"."payment_terms"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer" DROP COLUMN "partner_type";--> statement-breakpoint
ALTER TABLE "customer" DROP COLUMN "display_name";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "phone_no";