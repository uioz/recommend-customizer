import { pathToRegexp } from "path-to-regexp";
import { PluginBody, MessageBody } from "../types";
import { SortResponse } from "../../controller/sort";
import { CodeRequest } from "../../controller/types";
import * as viewPage from "./viewPageScript";

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

  function sorting(sortedMap: Array<{ key: string; weight: number }>) {
    const container = document.querySelector(".movie-list") as HTMLElement;
    const elems = sortedMap.map(({ key, weight }) => {
      const item = container.querySelector(`[href="/v/${key}"]`) as HTMLElement;
      const span = document.createElement("span");
      span.className = "tag is-success";
      span.innerText = weight + "";
      item.querySelector(".tags.has-addons")?.appendChild(span);
      return item.parentElement as HTMLElement;
    });

    container.replaceChildren(...elems);
  }

  chrome.runtime.sendMessage<MessageBody, SortResponse>(
    {
      event: "sort",
      data,
    },
    ({ sort }) => {
      if (sort) {
        sorting(sort);
      }
    }
  );
}

const indexPath = pathToRegexp("/");
const indexCensoredPath = pathToRegexp("/censored");
const indexUncensoredPath = pathToRegexp("/uncensored");
const searchPath = pathToRegexp("/search");
const seriesPath = pathToRegexp("/video_codes/:seriesId");
const makderIdPath = pathToRegexp("/makers/:makerId");
const actorIdPath = pathToRegexp("/actors/:actorId");
const animePath = pathToRegexp("/tags/anime");

export default {
  host: "javdb",
  path: [
    indexPath,
    indexCensoredPath,
    indexUncensoredPath,
    searchPath,
    seriesPath,
    makderIdPath,
    actorIdPath,
    animePath,
  ],
  script,
  args: [viewPage.viewPath.source],
} as PluginBody<Array<string>>;
