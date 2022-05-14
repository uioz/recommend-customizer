import "./db/index";
import "./controller";
import * as injector from "./injector";
import * as ActressStore from "./lib/actress-store";
import * as Fuzz from "./lib/fuzz";

async function main() {
  injector.init();
  await ActressStore.init();
  await Fuzz.init();
}

main();
