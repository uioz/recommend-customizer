import { pathToRegexp } from "path-to-regexp";
import { PluginBody, MessageBody, SortResponse, WriteResponse } from "../types";
import { Code } from "../../db/code";
import * as detail from "./detailPageScript";

export function script(meta: unknown, detailPathReg: string) {
  const matchKey = new RegExp(detailPathReg);

  function extract(elem: HTMLAnchorElement): Code | undefined {
    try {
      const href = elem.getAttribute("href") as string;
      const title = elem.getAttribute("title")?.trim() as string;
      const code = elem.querySelector("strong")?.innerText.trim() as string;
      const rank = parseFloat(
        // @ts-ignore
        elem.querySelector(".value")?.innerText.trim().substring(0, 3)
      );
      // @ts-ignore
      const date = elem.querySelector(".meta").innerText.trim();
      const resFreshDate = new Date(`${date}T00:00:00.000Z`);
      // @ts-ignore
      const [_, key] = matchKey.exec(href);

      return {
        // @ts-ignore
        key,
        title,
        code,
        rank,
        resFreshDate,
        createDate: new Date(),
      };
    } catch (error) {
      console.error(error);
    }
  }

  const data = Array.from<HTMLAnchorElement>(
    document.querySelectorAll(".box")
  ).map(extract);

  chrome.runtime.sendMessage<MessageBody, SortResponse<Code>>(
    {
      event: "sort",
      data,
    },
    (response) => {
      console.log(response);
    }
  );
  chrome.runtime.sendMessage<MessageBody, WriteResponse>(
    {
      event: "write",
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
