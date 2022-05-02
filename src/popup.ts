import { importDB, exportDB } from "dexie-export-import";
import { DB, DB_NAME } from "./db/index";
import save from "./lib/save-blob";

const importButton = document.getElementById("import") as HTMLInputElement;
const exportButton = document.getElementById("export") as HTMLButtonElement;

importButton.addEventListener(
  "change",
  async () => {
    const file = importButton.files ? Array.from(importButton.files)[0] : null;

    if (file) {
      try {
        await importDB(file);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
  },
  {
    passive: true,
  }
);

exportButton.addEventListener(
  "click",
  async () => {
    try {
      save(
        await exportDB(DB, {
          filter: (table) => table !== "log",
        }),
        `${DB_NAME}.json`
      );
    } catch (error) {
      console.error(error);
      alert(error);
    }
  },
  {
    passive: true,
  }
);
