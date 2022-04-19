import { Dexie } from "dexie";

export const STATE_KEY = "database-status";

export enum STATE {
  INIT,
  READY,
}

export async function initDatabase() {
  console.log(Dexie);
  console.log(Date().toLocaleLowerCase());
}
