import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    ignores: ["migrations/", "models/", "__tests__/", "app.js"],
  },
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
];
