import { type MainDb } from "./index";

export interface Sentiment {
  word: string;
  weight: number;
}

export const indexes = "word,weight";

export async function queryWeight(db: MainDb, tokenSet: Set<string>) {}
