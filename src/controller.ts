import { MessageBody, SortResponse, WriteResponse } from "./plugins/types";
import { Code } from "./db/code";

function isMessageBody(data: unknown): data is MessageBody {
  if (data) {
    if ((data as MessageBody).event && (data as MessageBody).data) {
      return true;
    }
  }
  return false;
}

const acceptableJobs = new Set(["sort", "write"]);

function pickJobs(data: MessageBody): Array<string> {
  if (Array.isArray(data.event)) {
    return data.event.filter((item) => acceptableJobs.has(item));
  }

  const event = [];

  if (acceptableJobs.has(data.event)) {
    event.push(data.event);
  }

  return event;
}

function distributeJobs(
  jobs: Array<string>,
  data: any,
  sendResponse: (response?: any) => void
) {
  const asyncWrap = [];

  for (const job of jobs) {
    switch (job) {
      case "sort":
        asyncWrap.push(
          new Promise<SortResponse<Code>>((resolve, reject) => {
            resolve({
              sort: [],
            });
          })
        );
        break;
      case "write":
        asyncWrap.push(
          new Promise<WriteResponse>((resolve, reject) => {
            reject({
              write: new Error(),
            });
          })
        );
        break;
    }
  }

  Promise.allSettled(asyncWrap).then((results) =>
    sendResponse(results.reduce((prev, next) => Object.assign(prev, next), {}))
  );
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!isMessageBody(request)) {
    return;
  }

  const jobs = pickJobs(request);

  distributeJobs(jobs, request.data, sendResponse);
});
