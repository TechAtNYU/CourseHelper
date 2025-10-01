/** biome-ignore-all lint/style/noNonNullAssertion: env variables must exist */
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: "./.env" });

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID!;
const databaseId = process.env.CLOUDFLARE_DATABASE_ID!;
const token = process.env.CLOUDFLARE_D1_TOKEN!;

export default defineConfig({
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/schema.ts",
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId,
    databaseId,
    token,
  },
});
