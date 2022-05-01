import { type MainDb } from "./index";

export interface CodeTable {
  code: string;
  weight: number;
}

export const indexes = "code,weight";

export async function singleQuery(db: MainDb, code: string): Promise<number> {
  const data = await db.code.get({
    code,
  });

  if (data) {
    return data.weight;
  }

  return 0;
}

export function update(db: MainDb, codes: Array<string>) {
  return db.transaction("rw", db.code, async () => {
    await db.code
      .where("code")
      .anyOf(codes)
      .modify((data) => {
        data.weight += codes.filter((code) => data.code === code).length;
      });

    try {
      await db.code.bulkAdd(codes.map((code) => ({ code, weight: 1 })));
    } catch (error) {}
  });
}
