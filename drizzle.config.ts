import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";
dotenv.config();
export default defineConfig({
  strict: true,
  verbose: true,
  out: "./drizzle",
  schema: "./src/schema/user.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
