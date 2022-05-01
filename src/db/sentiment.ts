import { type MainDb } from "./index";

export interface Sentiment {
  word: string;
  weight: number;
}

export const indexes = "word,weight";

export async function totalWeight(db: MainDb, tokenSet: Array<string>) {
  let sum = 0;

  for (const item of await db.sentiment.bulkGet(tokenSet)) {
    if (item !== undefined) {
      sum += item.weight;
    }
  }
  return sum;
}

export function update(db: MainDb, tokens: Array<string>) {
  return db.transaction("rw", db.sentiment, async () => {
    await db.sentiment
      .where("word")
      .anyOf(tokens)
      .modify((data) => {
        data.weight += tokens.filter((word) => word === data.word).length;
      });

    try {
      await db.sentiment.bulkAdd(tokens.map((word) => ({ word, weight: 1 })));
    } catch (error) {}
  });
}
