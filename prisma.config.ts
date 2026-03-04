import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";

// This explicitly forces Prisma to read your .env file
dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
    directUrl: env("DIRECT_URL"),
  },
});