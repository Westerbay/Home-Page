import { tanstackConfig } from "@tanstack/eslint-config"
export default [
  {
    ignores: [
      "**/generated/**",
      "**/routeTree.gen.ts",
      "**/dist/**",
      "**/node_modules/**",
      "design/**",
    ],
  },
  ...tanstackConfig,
  {
    rules: {
      "import/no-cycle": "off",
      "import/order": "off",
      "sort-imports": "off",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/require-await": "off",
      "pnpm/json-enforce-catalog": "off",
    },
  },
]
