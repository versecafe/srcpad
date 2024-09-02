/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/configs/eslint/react-internal.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.lint.json",
    tsconfigRootDir: __dirname,
  },
};
