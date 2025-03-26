import globals from "globals";
import pluginJs from "@eslint/js";
import pluginN from "eslint-plugin-n";
import pluginImport from "eslint-plugin-import";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],       // apply config to all .js files
    languageOptions: {
      sourceType: "module",   // instead of commonjs.
      globals: {
        ...globals.node,      // add Node global variables (module, require, etc)
      },
    },
    plugins: {
      n: pluginN,             // use plugin n
      import: pluginImport,   // adds rules for managing imports
    },
    rules: {
      // Recommended rules from @eslint/js
      ...pluginJs.configs.recommended.rules,

      // Node.js best practices
      "n/no-unpublished-require": "error",   // Ensure required modules are published
      "n/no-missing-require": "error",       // Ensure required modules exist
      "n/no-extraneous-require": "error",     // Prevent unnecessary dependencies
      "n/no-unsupported-features/es-syntax": "off", // Allows import/export ES syntax
      // "node/no-unsupported-features/es-syntax": ["error", {
      //   "version": ">=8.0.0",
      //   "ignores": []
      // }], //prevent unsupported ES features
      // "node/no-unsupported-features/es-syntax": ["error", { "ignores": ["modules"] }], // Allows import/export ES syntax

      // Import/export rules
      "import/no-unresolved": "error",                  // Ensure imports are valid
      "import/no-extraneous-dependencies": ["error", { devDependencies: true }],     // Prevent unnecessary dependencies
      "import/order": ["error", { "newlines-between": "always" }],  // Enforce import order
      "import/extensions": ["error", "ignorePackages"], // Allow missing extensions for packages

      // Custom rules
      "no-console": "error",    // Warn about console.log statements
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],     // Flag unused variables: except some arguments
    }
  },
];
