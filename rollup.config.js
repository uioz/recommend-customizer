import typescript from "rollup-plugin-typescript2";
import copy from "rollup-plugin-copy";
// import multiInput from "rollup-plugin-multi-input";
import resolve from "@rollup/plugin-node-resolve";
import clear from "rollup-plugin-clear";
import commonjs from "@rollup/plugin-commonjs";
import { env } from "process";

/**
 * @type {import('rollup').RollupOptions}
 */
let config;

if (env.PRE_BUILD) {
  config = {
    input: "./node_modules/kuromoji/build/kuromoji.js",
    output: {
      file: "./node_modules/kuromoji/src/kuromoji.js",
      format: "es",
    },
    plugins: [
      resolve({
        browser: true,
        preferBuiltins: true,
      }),
      commonjs(),
      copy({
        targets: [
          {
            src: "./node_modules/kuromoji/dict/*",
            dest: "./public/dict",
          },
        ],
      }),
    ],
  };
} else {
  config = {
    input: "./src/background.ts",
    output: {
      dir: "dist",
      format: "esm",
      preserveModules: true,
      preserveModulesRoot: "src",
    },
    plugins: [
      resolve(),
      typescript(
        env.NODE_ENV === "development"
          ? {}
          : {
              tsconfigOverride: {
                compilerOptions: {
                  declaration: true,
                  declarationMap: true,
                  sourceMap: true,
                },
              },
            }
      ),
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
}

export default config;
