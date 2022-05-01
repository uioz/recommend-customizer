import { DB } from "../db/index";
import { getAllActress } from "../db/actress";
import Fuse from "fuse.js";

// let engine: InstanceType<typeof Fuse>;

// export async function init() {
//   if (engine === undefined) {
//     engine = new Fuse(await getAllActress(DB), {
//       threshold: 0.95,
//     });
//   }
//   return engine;
// }

export async function findActors(str: string) {
  // TODO: improvement later
  const searchEngine = new Fuse(await getAllActress(DB), {
    threshold: 0.93,
  });

  return searchEngine.search(str).map(({ item }) => item);
}
