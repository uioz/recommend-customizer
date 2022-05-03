import { pathToRegexp } from "path-to-regexp";
import { UpdateRequest, UpdateResponse } from "../../controller/update";
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

  const actress = Array.from(
    document.querySelectorAll<HTMLElement>(".symbol.female")
  ).map((elem) => (elem.previousSibling as HTMLAnchorElement).innerText.trim());

  function sendToBackground() {
    let sendFeedback = false;
    setTimeout(() => {
      if (!sendFeedback) {
        alert("time exceed");
      }
    }, 3000);
    try {
      chrome.runtime.sendMessage<MessageBody<UpdateRequest>, UpdateResponse>(
        {
          event: "update",
          data: {
            code,
            title,
            actress,
          },
        },
        (response) => {
          sendFeedback = true;
          console.log(response.update);
        }
      );
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  // 只要英文在整个标题中的占比低于 90% 即可
  const isJav = (title: string): boolean =>
    Array.from(title.matchAll(/[a-z\. ]/gi)).length / title.length < 0.9;

  const parser = new DOMParser();

  const node = parser
    .parseFromString(
      `
      <div id="jdb-plugin-indicator">
      <style>
        #jdb-plugin-indicator {
          position: fixed;
          top: 5vw;
          transform: translateX(calc(-100% + 30px));
          background: white;
          border: 2px solid #3472dc;
          padding: 1em;
          border-radius: 0 1em 1em 0;
          cursor: pointer;
          will-change: transform;
          transition: 200ms all;
        }
    
        #jdb-plugin-indicator:hover {
          transform: translateX(0%);
        }
      </style>
      <ul>
        <li><span>isjav:&nbsp;</span><span>${isJav(title)}</span></li>
        <li><span>code:&nbsp;</span><span>${code}</span></li>
        <li><span>title:&nbsp;</span><span>${title}</span></li>
        <li><span>actress:&nbsp;</span><span>${actress}</span></li>
      </ul>
    </div>
  `,
      "text/html"
    )
    .getElementById("jdb-plugin-indicator") as HTMLElement;

  document.body.appendChild(node);

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

    document
      .getElementById("modal-save-list")
      ?.addEventListener("change", ({ target }) => {
        if (target instanceof HTMLInputElement && target.checked) {
          sendToBackground();
        }
      });
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
