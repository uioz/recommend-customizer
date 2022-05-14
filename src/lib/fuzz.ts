import * as ActressStore from "../lib/actress-store";
import Trie from "mnemonist/trie";

const LOG_TARGET = "register";

let searchEngine = new Trie<string>();

export async function init() {
  console.log(`${LOG_TARGET} init`);

  searchEngine = Trie.from(await ActressStore.read());

  ActressStore.event.on((actress) => {
    for (const item of actress) {
      searchEngine.add(item);
    }
  });

  console.log(`${LOG_TARGET} success`);
}

export function findActors(str: string) {
  const machedNames = new Set<string>();

  let offset = 0,
    len = str.length;

  while (offset < len) {
    for (const result of searchEngine.find(str[offset]).reverse()) {
      if (result === str.slice(offset, offset + result.length)) {
        machedNames.add(result);
        break;
      }
    }

    offset++;
  }


  return Array.from(machedNames);
}
