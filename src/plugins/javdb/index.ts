import { Plugin } from "../types";
import index from "./indexPage";
import * as detail from "./detailPageScript";

export default {
  name: "javdb",
  version: "0.0.0",
  scripts: [
    index,
    {
      host: "javdb",
      path: detail.path,
      script: detail.script,
    },
  ],
} as Plugin;
