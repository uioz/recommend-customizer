import * as ActressStore from "../lib/actress-store";
import Fuse from "fuse.js";

const LOG_TARGET = "fuzz";

const searchEngine = new Fuse<string>([], {
  threshold: 0.94,
  minMatchCharLength: 3,
});

export async function init() {
  console.log(`${LOG_TARGET} init`);
  searchEngine.setCollection(await ActressStore.read());

  ActressStore.event.on((actress) => {
    for (const item of actress) {
      searchEngine.add(item);
    }
  });

  console.log(`${LOG_TARGET} success`);
}

export async function findActors(str: string) {
  return searchEngine.search(str).map(({ item }) => item);
}
