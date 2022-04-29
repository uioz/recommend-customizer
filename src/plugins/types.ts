export type PluginBody<Args extends any[] = []> = {
  host: string | RegExp;
  path?: string | RegExp;
  script: (
    meta: { name: string; host: string; version: string },
    ...args: Args
  ) => void;
  args?: Args;
};

export interface Plugin {
  name: string;
  version: string;
  scripts: Array<PluginBody>;
}

export type MessageEvent = "sort" | "write" | string;

export interface MessageBody {
  meta?: {
    host: string;
    name: string;
    verison: string;
  };
  event: Array<MessageEvent> | MessageEvent;
  data: any;
}

export interface SortResponse<T> {
  sort: Array<T>;
}

export interface WriteResponse {
  write: string | null;
}
