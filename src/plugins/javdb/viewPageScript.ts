import { pathToRegexp } from "path-to-regexp";
import { UpdateRequest } from "../../controller/update";
import { PluginBody, MessageBody } from "../types";

export const viewPath = pathToRegexp("/v/:id");

export function script() {
  const code = (
    document.querySelector(".value") as HTMLElement
  ).innerText.trim();
  const title = (document.querySelector("h2.title") as HTMLElement).innerText
    .trim()
    .replace(new RegExp(code, "i"), "")
    .trim();

  function sendToBackground() {
    chrome.runtime.sendMessage<MessageBody<UpdateRequest>>({
      event: "update",
      data: {
        code,
        title,
      },
    });
  }

  const isJav = (title: string): boolean =>
    Array.from(title.matchAll(/[a-z\. ]/gi)).length / title.length < 0.5;

  if (code && isJav(title)) {
    const reviewButtons = document
      .querySelector(".review-buttons.buttons")
      ?.querySelectorAll<HTMLButtonElement>("button");

    if (reviewButtons) {
      for (const reviewButton of Array.from(reviewButtons)) {
        reviewButton.addEventListener(
          "click",
          () => {
            // TODO: 对于同一个影片禁止发送两次, 可以基于 code 过滤
            sendToBackground();
          },
          {
            passive: true,
          }
        );
      }
    }

    const magnetButtons = document.querySelectorAll<HTMLButtonElement>(
      ".magnet-links [data-clipboard-text]"
    );

    for (const button of Array.from(magnetButtons)) {
      button.addEventListener(
        "click",
        () => {
          // TODO: 对于同一个影片禁止发送两次, 可以基于 code 过滤
          sendToBackground();
        },
        {
          passive: true,
        }
      );
    }
  } else {
    // TODO: maybe warning on popup page
    console.warn("NOT MATCH!");
  }
}

export default {
  host: "javdb",
  path: viewPath,
  script,
} as PluginBody;
