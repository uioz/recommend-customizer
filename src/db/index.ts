import { Dexie } from "dexie";
import { type CodeInDb, indexes as code } from "./code";
import { type Sentiment, indexes as sentiment } from "./sentiment";
import { type Actress, indexes as actress } from "./actress";

export const DB_NAME = "main";

export class MainDb extends Dexie {
  code!: Dexie.Table<CodeInDb, string>;
  sentiment!: Dexie.Table<Sentiment, string>;
  actress!: Dexie.Table<Actress, string>;

  constructor(dbName = DB_NAME) {
    super(dbName, {
      autoOpen: true,
    });

    this.version(1).stores({
      code,
      sentiment,
      actress,
    });
  }
}

export const DB = new MainDb();
