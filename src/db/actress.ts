import { type MainDb } from "./index";
export const indexes = "name,weight";

export interface Actress {
  name: string;
  weight: number;
  // consider alias later
  // alias: Array<string>;
}

export function update(db: MainDb, actress: Array<string>) {
  return db.transaction("rw", db.actress, async () => {
    await db.actress
      .where("name")
      .anyOf(actress)
      .modify((data) => {
        data.weight += actress.filter((name) => name === data.name).length;
      });
    try {
      await db.actress.bulkAdd(actress.map((name) => ({ name, weight: 1 })));
    } catch (error) {}
  });
}

export async function totalWeight(db: MainDb, actress: Array<string>) {
  let sum = 0;

  for (const item of await db.actress.bulkGet(actress)) {
    if (item !== undefined) {
      sum += item.weight;
    }
  }
  return sum;
}

export function getAllActress(db: MainDb) {
  return db.actress.toCollection().primaryKeys();
}
