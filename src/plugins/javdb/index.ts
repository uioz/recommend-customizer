import { Plugin } from "../types";
import indexPage from "./indexPage";
import viewPage from "./viewPageScript";

export default {
  name: "javdb",
  version: "0.0.0",
  scripts: [indexPage, viewPage],
} as Plugin;
