import { config } from "@dotenvx/dotenvx";
import { defineConfig } from "drizzle-kit";

config({
    overload: true,
});

export default defineConfig({
    out: './drizzle',
    schema: './src/drizzle/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});