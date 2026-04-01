// @ts-check
import { defineConfig } from "astro/config";

// Same origin as web at /astro/* via Vercel rewrites from the web project.
// https://astro.build/config
export default defineConfig({
  base: "/astro",
});
