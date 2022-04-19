import { initDatabase, STATE, STATE_KEY } from "./db/index";

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
  if (reason === "install") {
    await chrome.storage.local.set({ [STATE_KEY]: STATE.INIT });
    await initDatabase();
    await chrome.storage.local.set({ [STATE_KEY]: STATE.READY });
  }
});
