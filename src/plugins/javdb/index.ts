import { plugin } from "../types";

export default {
  name: "javdb",
  version: "0.0.0",
  scripts: [
    {
      host: "javdb",
      script: function () {
        console.log("hello world");
      },
    },
  ],
} as plugin;
