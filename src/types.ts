export interface plugin {
  name: string;
  version: string;
  scripts: Array<{
    host: Array<RegExp | string> | string | RegExp;
    script: () => void;
  }>;
}
