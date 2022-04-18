import typescript from "rollup-plugin-typescript2";
import copy from "rollup-plugin-copy";
// import multiInput from "rollup-plugin-multi-input";
import resolve from "@rollup/plugin-node-resolve";
import clear from "rollup-plugin-clear";

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: "./src/background.ts",
  output: {
    dir: "dist",
    format: "esm",
    preserveModules: true,
    preserveModulesRoot: "src",
  },
  plugins: [
    resolve(),
    // multiInput(),
    typescript({
      clean: true,
    }),
    copy({
      targets: [
        {
          src: "public/*",
          dest: "dist",
        },
      ],
    }),
    clear({
      targets: ["dist"],
    }),
  ],
};

export default config;
