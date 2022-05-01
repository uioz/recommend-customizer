import { type MainDb } from "./index";

export interface LogTable {
  id?: number;
  type: number;
  createAt: Date;
  target: string;
  payload: string;
}

export const indexes = "++id,type,createAt,payload.message";

export enum LOG_TYPE {
  error,
  warn,
  info,
}

export async function log(
  db: MainDb,
  type: keyof typeof LOG_TYPE,
  target: string,
  payload: any
) {
  await db.log.add({
    type: LOG_TYPE[type],
    target,
    payload,
    createAt: new Date(),
  });
}
