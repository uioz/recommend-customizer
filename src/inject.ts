import javdb from "./plugins/javdb";
import { plugin } from "./plugins/types";

chrome.webNavigation.onDOMContentLoaded.addListener(({ tabId, url }) => {
  console.log(tabId);
  console.log(url);
  new URL(url).host;
});

// function injector(plugins:Array<plugin>) {
//   for (const plugin of plugins) {

//   }
// }

interface CompiledPlugin {
  name: string;
  version: string;
  pattern: RegExp;
  script: () => void;
}

export function compile() {
  const plugins = [javdb];
  const map = new Set<CompiledPlugin>();

  for (const plugin of plugins) {
  }
}
