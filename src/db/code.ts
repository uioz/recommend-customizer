import { type MainDb } from "./index";

export interface CodeInDb {
  code: string;
  weight: number;
}

export const indexes = "code,weight";

export async function queryWeight(db: MainDb, code: string): Promise<number> {
  const data = await db.code.get({
    code,
  });

  if (data) {
    return data.weight;
  }

  return 0;
}
