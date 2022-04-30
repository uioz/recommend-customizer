import { pathToRegexp } from "path-to-regexp";
import { PluginBody, MessageBody } from "../types";
import { SortResponse } from "../../controller/sort";
import { UpdateResponse } from "../../controller/update";
import { CodeRequest } from "../../controller/types";
import * as detail from "./detailPageScript";

export function script(meta: unknown, detailPathReg: string) {
  const matchKey = new RegExp(detailPathReg);

  function extract(elem: HTMLAnchorElement): CodeRequest | undefined {
    try {
      const href = elem.getAttribute("href") as string;
      const title = elem.getAttribute("title")?.trim() as string;
      const code = elem.querySelector("strong")?.innerText.trim() as string;
      const rank = parseFloat(
        // @ts-ignore
        elem.querySelector(".value")?.innerText.trim().substring(0, 3)
      );
      // @ts-ignore
      const [_, key] = matchKey.exec(href);

      return {
        // @ts-ignore
        key,
        title,
        code,
        rank,
      };
    } catch (error) {
      console.error(error);
    }
  }

  const data = Array.from<HTMLAnchorElement>(
    document.querySelectorAll(".box")
  ).map(extract);

  chrome.runtime.sendMessage<MessageBody, SortResponse & UpdateResponse>(
    {
      event: ["sort", "update"],
      data,
    },
    (response) => {
      console.log(response);
    }
  );
}

export const path = pathToRegexp("/");

export default {
  host: "javdb",
  path,
  script,
  args: [detail.path.source],
} as PluginBody<Array<string>>;
