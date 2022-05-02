import * as ActressStore from "../lib/actress-store";
import Fuse from "fuse.js";

const LOG_TARGET = "fuzz";

const searchEngine = new Fuse<string>([], {
  threshold: 0.93,
});

export async function init() {
  console.log(`${LOG_TARGET} init`);
  searchEngine.setCollection(await ActressStore.read());
  console.log(`${LOG_TARGET} success`);
}

export async function findActors(str: string) {
  return searchEngine.search(str).map(({ item }) => item);
}
