// @ts-nocheck — repo eslint-config is plain JS without types
import eslintPluginAstro from "eslint-plugin-astro";
import { config as baseConfig } from "@repo/eslint-config/base";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...baseConfig,
  ...eslintPluginAstro.configs.recommended,
  {
    files: ["**/*.astro"],
    rules: {},
  },
];
