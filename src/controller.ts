import { MessageBody, SortResponse, WriteResponse } from "./plugins/types";
import { CodeResponse } from "./db/code";

function isMessageBody(data: unknown): data is MessageBody {
  if (data) {
    if ((data as MessageBody).event && (data as MessageBody).data) {
      return true;
    }
  }
  return false;
}

const SORT_JOB = "sort";
const WRITE_JOB = "write";
const acceptableJobs = new Set([SORT_JOB, WRITE_JOB]);

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
      case SORT_JOB:
        asyncWrap.push(
          new Promise<SortResponse<CodeResponse>>((resolve) => {
            resolve({
              sort: (data as Array<any>).map(({ key }, weight) => ({
                key,
                weight,
              })),
            });
          })
        );
        break;
      case WRITE_JOB:
        asyncWrap.push(
          new Promise<WriteResponse>((resolve, reject) => {
            reject({
              [WRITE_JOB]: "error",
            });
          })
        );
        break;
    }
  }

  Promise.allSettled(asyncWrap).then((results) =>
    sendResponse(
      results.reduce(
        (prev, next) =>
          Object.assign(
            prev,
            next.status === "fulfilled" ? next.value : next.reason
          ),
        {} as any
      )
    )
  );
}

const ASYNC_RESPONSE_FLAG = true;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!isMessageBody(request)) {
    return;
  }

  const jobs = pickJobs(request);

  distributeJobs(jobs, request.data, sendResponse);

  return ASYNC_RESPONSE_FLAG;
});
