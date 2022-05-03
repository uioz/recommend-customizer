import { pathToRegexp } from "path-to-regexp";
import { PluginBody, MessageBody } from "../types";
import { SortResponse } from "../../controller/sort";
import { CodeRequest } from "../../controller/types";
import * as viewPage from "./viewPageScript";

export function script(meta: unknown, detailPathReg: string) {
  const matchKey = new RegExp(detailPathReg);

  function extract(elem: HTMLAnchorElement): CodeRequest | undefined {
    try {
      const key = elem.getAttribute("href") as string;
      const title = elem.getAttribute("title")?.trim() as string;
      const code = elem.querySelector("strong")?.innerText.trim() as string;
      const rank = parseFloat(
        // @ts-ignore
        elem.querySelector(".value")?.innerText.trim().substring(0, 3)
      );

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

  const keyToRank = new Map<string, number>();

  const data = Array.from<HTMLAnchorElement>(
    document.querySelectorAll(".box")
  ).map((item) => {
    const result = extract(item);
    if (result) {
      keyToRank.set(result.key, result?.rank ?? 0);
    }
    return result;
  });

  function sorting(sortedMap: Array<{ key: string; weight: number }>) {
    const container = document.querySelector(".movie-list") as HTMLElement;
    const freshItems: Array<HTMLElement> = [];
    const lowRankItems: Array<HTMLElement> = [];

    for (const { key, weight } of sortedMap) {
      const anchor = container.querySelector(`[href="${key}"]`) as HTMLElement;
      const span = document.createElement("span");
      span.className = "tag is-success";
      span.innerText = weight.toFixed(2);
      anchor.querySelector(".tags.has-addons")?.appendChild(span);

      const rank = keyToRank.get(key);

      if (rank !== undefined && rank < 3.5) {
        lowRankItems.push(anchor.parentElement as HTMLElement);
        continue;
      }

      freshItems.push(anchor.parentElement as HTMLElement);
    }

    const lowRankHead = document.createElement("h1");
    lowRankHead.innerText = "低分";

    const lowRankContainer = container.cloneNode(false) as HTMLElement;
    lowRankContainer.append(...lowRankItems);

    const toolbar = document.querySelector(".index-toolbar") as HTMLElement;
    const pagination = document.querySelector(".pagination") as HTMLElement;
    pagination.style.position = "sticky";
    pagination.style.top = "65px";
    pagination.style.borderRadius = "1em";
    pagination.style.zIndex = "100";
    pagination.style.background = "#ffffffd9";
    pagination.style.padding = "1em";
    // @ts-ignore
    pagination.style.backdropFilter = "blur(7px)";

    toolbar.after(pagination);
    container.replaceChildren(...freshItems);
    container.after(lowRankHead, lowRankContainer);
  }

  let gotResponse = false;

  setTimeout(() => {
    if (!gotResponse) {
      alert("time exceed");
    }
  }, 3000);

  try {
    chrome.runtime.sendMessage<MessageBody, SortResponse>(
      {
        event: "sort",
        data,
      },
      ({ sort }) => {
        gotResponse = true;
        if (sort) {
          sorting(sort);
        }
      }
    );
  } catch (error) {
    console.error(error);
    alert(error);
  }
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
