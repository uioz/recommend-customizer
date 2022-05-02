import { DB } from "../db/index";
import { getAllActress } from "../db/actress";

const LOG_TARGET = "actress-store";

export const ACTRESS_STORE_KEY = "actress";

type Actress = Array<string>;

export const event: {
  hook: ((actress: Array<string>) => void) | undefined;
  on: (handler: (actress: Array<string>) => void) => void;
  emit: (actress: Array<string>) => void;
} = {
  hook: undefined,
  on(handler) {
    this.hook = handler;
  },
  emit(actress) {
    this.hook?.(actress);
  },
};

export function write(actress: Array<string>, preventEmit = false) {
  /**
   * some borwser doesn't support return promise yet
   */
  return new Promise((resolve) => {
    chrome.storage.local.set(
      {
        [ACTRESS_STORE_KEY]: actress,
      },
      () => {
        if (!preventEmit) {
          event.emit(actress);
        }
        resolve(undefined);
      }
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
  write(await getAllActress(DB), true);
  console.log(`${LOG_TARGET} success`);
}
