export interface Meta {
  host: string;
  name: string;
  verison: string;
}

export type PluginBody<Args extends any[] = []> = {
  host: string | RegExp;
  path?: string | RegExp | Array<string | RegExp>;
  script: (meta: Meta, ...args: Args) => void;
  args?: Args;
};

export interface Plugin {
  name: string;
  version: string;
  scripts: Array<PluginBody>;
}

export type MessageEvent = "sort" | "update" | string;

export interface MessageBody {
  meta?: Meta;
  event: Array<MessageEvent> | MessageEvent;
  data: any;
}
