export type PluginBody<Args extends any[] = []> = {
  host: string | RegExp;
  path?: string | RegExp;
  script: (...args: Args) => void;
  args?: Args;
};

export interface Plugin {
  name: string;
  version: string;
  scripts: Array<PluginBody>;
}
