import { type MainDb } from "./index";

export interface SentimentTable {
  word: string;
  weight: number;
}

export const indexes = "word,weight";

export async function totalWeight(db: MainDb, tokenSet: Array<string>) {
  let sum = 0;

  const results = await db.sentiment.bulkGet(tokenSet);

  for (const item of results) {
    if (item !== undefined) {
      sum += item.weight;
    }
  }
  // more result = more weight
  return sum * results.length;
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
