import javdb from "./plugins/javdb";
import { Plugin } from "./plugins/types";
import { log } from "./db/index";

const LOG_TARGET = "injector";
const pluginsCollection: Array<PluginCompiled> = [];
const pluginMap = new Map<string, Array<PluginCompiled>>();

interface PluginCompiled {
  name: string;
  version: string;
  host: RegExp;
  path?: Array<RegExp>;
  args?: Array<any>;
  script: (...args: any) => void;
}

function turnToRegexp(str: RegExp | string) {
  if (typeof str === "string") {
    return new RegExp(str);
  }
  return str;
}

function compilePlugin(plugins: Array<Plugin>) {
  for (const { name, scripts, version } of plugins) {
    for (const { host, path, script, args } of scripts) {
      const temp = {
        name,
        version,
        host: turnToRegexp(host),
        script,
      };

      if (path) {
        if (Array.isArray(path)) {
          Object.assign(temp, { path: path.map(turnToRegexp) });
        } else {
          Object.assign(temp, { path: [turnToRegexp(path)] });
        }
      }

      if (Array.isArray(args)) {
        Object.assign(temp, { args });
      }

      pluginsCollection.push(temp);
    }
  }
}

export function init() {
  compilePlugin([javdb]);
}

const MAIN_FRAME = 0;

chrome.webNavigation.onCommitted.addListener(
  ({ frameId, tabId, url, ...rest }) => {
    if (frameId !== MAIN_FRAME) {
      log("warn", LOG_TARGET, {
        message: "not main frame",
        url,
        ...rest,
      });
      return;
    }

    const { host, pathname } = new URL(url);

    const plugins = pluginMap.get(host) ?? [];

    if (plugins.length === 0) {
      for (const plugin of pluginsCollection) {
        if (plugin.host.test(host)) {
          plugins.push(plugin);
        }
      }

      if (plugins.length) {
        pluginMap.set(host, plugins);
      }
    }

    for (const { script, args, path, ...rest } of plugins) {
      if (Array.isArray(path) && path.some((regexp) => regexp.test(pathname))) {
        chrome.scripting.executeScript({
          target: {
            tabId,
          },
          func: script,
          args: args ? [rest, ...args] : [rest],
        });
      }
    }
  }
);
