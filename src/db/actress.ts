import { type MainDb } from "./index";
export const indexes = "name,weight";

export interface Actress {
  name: string;
  weight: number;
  // consider later
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
