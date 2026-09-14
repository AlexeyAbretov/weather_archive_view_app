import createConfig from "@llm/linting";

export default createConfig({
  files: ["src/**/*.ts", "src/**/*.tsx"],
  ignores: ["dist/**"],
  tsconfigRootDir: import.meta.dirname,
});
