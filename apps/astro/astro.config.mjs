// @ts-check
import { defineConfig } from "astro/config";

// Public URL of the Next “shell” (WEB_MICROFRONTEND_URL in .env) — sitemap, canonicals, etc.
const site = process.env.WEB_MICROFRONTEND_URL?.replace(/\/$/, "") || undefined;

// Served at / on the Astro host. On the main Next domain, `apps/web` rewrites /blogs and /_astro.
// https://astro.build/config
export default defineConfig({
  ...(site ? { site } : {}),
});
