import { DB } from "../db/index";
import { getAllActress } from "../db/actress";

const LOG_TARGET = "actress-store";

export const ACTRESS_STORE_KEY = "actress";

type Actress = Array<string>;

export function write(actress: Array<string>) {
  /**
   * some borwser doesn't support return promise yet
   */
  return new Promise((resolve) => {
    chrome.storage.local.set(
      {
        [ACTRESS_STORE_KEY]: actress,
      },
      () => resolve(undefined)
    );
  });
}

export async function read() {
  /**
   * some borwser doesn't support return promise yet
   */
  return new Promise<Actress>((resolve) => {
    chrome.storage.local.get([ACTRESS_STORE_KEY], (data) => {
      if (data[ACTRESS_STORE_KEY]) {
        return resolve(data[ACTRESS_STORE_KEY]);
      }
      // using database as fallback
      resolve(getAllActress(DB));
    });
  });
}

/**
 * currently session storage is still pending
 * we need reset state manually when script running
 */
export async function init() {
  console.log(`${LOG_TARGET} init`);
  write(await getAllActress(DB));
  console.log(`${LOG_TARGET} success`);
}
