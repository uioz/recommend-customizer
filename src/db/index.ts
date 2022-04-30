import { Dexie } from "dexie";
import { type CodeInDb } from "./code";

export const DB_NAME = "mainDb";

export interface Sentiment {
  word: string;
  weight: number;
  updateDate: Date;
}

export interface Actress {
  name: string;
  weight: number;
  alias: Array<string>;
}

class db extends Dexie {
  code!: Dexie.Table<CodeInDb, string>;
  sentiment!: Dexie.Table<Sentiment, string>;
  actress!: Dexie.Table<Actress, string>;

  constructor(dbName = DB_NAME) {
    super(dbName);

    this.version(1).stores({
      code: "code,weight,rank,resFreshDate,createDate",
      sentiment: "word,weight,updateDate",
      actress: "name,weight,*alias",
    });
  }
}

export const DB = new db();
