import { plugin as shadcn } from "@shadcn/lint";
import pluginQuery from "@tanstack/eslint-plugin-query";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Catches TanStack Query mistakes such as unstable query keys or a missing dependency in the key.
  ...pluginQuery.configs["flat/recommended"],
  // Design-system guardrails: keep styling on theme tokens and component variants.
  // Rules start at "warn" for existing code; the lint script's --max-warnings cap
  // stops the count from growing. Lower the cap as findings are fixed, then promote
  // each rule to "error" once it is clean.
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { shadcn },
    rules: {
      "shadcn/no-restyle": ["warn", { allow: ["layout"] }],
      "shadcn/no-arbitrary-values": "warn",
      "shadcn/no-raw-colors": "warn",
      "shadcn/no-inline-styles": "warn",
      "shadcn/no-unknown-classes": "warn",
      "shadcn/require-static-classes": "warn",
    },
  },
  // Components own their appearance and may need structural values.
  {
    files: ["components/ui/**"],
    rules: {
      "shadcn/no-restyle": "off",
      "shadcn/no-arbitrary-values": "off",
      "shadcn/require-static-classes": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
