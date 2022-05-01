import { Dexie } from "dexie";
import { type CodeTable, indexes as code } from "./code";
import { type SentimentTable, indexes as sentimentIndex } from "./sentiment";
import { type ActressTable, indexes as actressIndex } from "./actress";
import {
  type LogTable,
  indexes as logIndex,
  log as logger,
  LOG_TYPE,
} from "./log";

export const DB_NAME = "main";

export class MainDb extends Dexie {
  code!: Dexie.Table<CodeTable, string>;
  sentiment!: Dexie.Table<SentimentTable, string>;
  actress!: Dexie.Table<ActressTable, string>;
  log!: Dexie.Table<LogTable, string>;

  constructor(dbName = DB_NAME) {
    super(dbName, {
      autoOpen: true,
    });

    this.version(1).stores({
      code,
      sentiment: sentimentIndex,
      actress: actressIndex,
      log: logIndex,
    });
  }
}

export const DB = new MainDb();

export function log(
  type: keyof typeof LOG_TYPE,
  target: string,
  payload: any
) {
  return logger(DB, type, target, payload);
}
