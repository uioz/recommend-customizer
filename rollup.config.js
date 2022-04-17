import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";
import multiInput from "rollup-plugin-multi-input";

/**
 * @type {import('rollup').RollupOptions}
 */
const config = {
  input: ["src/**/*.ts"],
  output: {
    dir: "dist",
    format: "esm",
  },
  plugins: [
    multiInput(),
    typescript(),
    copy({
      targets: [
        {
          src: "public/*",
          dest: "dist",
        },
      ],
    }),
  ],
};

export default config;
