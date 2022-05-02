import "./lib/xhr.js";
import "./db/index";
import "./controller";
import * as tokenizer from "./lib/tokenizer";
import * as injector from "./injector";
import * as ActressStore from "./lib/actress-store";
import * as Fuzz from "./lib/fuzz";

async function main() {
  tokenizer.init();
  injector.init();
  await ActressStore.init();
  await Fuzz.init();
}

main();
