import { pathToRegexp } from "path-to-regexp";
import { PluginBody } from "../types";
import * as detail from "./detailPageScript";

interface Node {
  code: string;
  key: string;
  title: string;
  resFreshDate: Date;
}

export const path = pathToRegexp("/");

// trying ExecutionWorld = main
// trying RegisteredContentScript
export function script(detailPathReg: RegExp) {
  console.log(detailPathReg.test('test'));

  function extract(elem: HTMLAnchorElement) {
    console.log(elem.href);
  }

  const Nodes = Array.from<HTMLAnchorElement>(
    document.querySelectorAll(".box")
  ).map(extract);
}

export default {
  host: "javdb",
  path,
  script,
  args: [detail.path],
} as PluginBody<Array<RegExp>>;
