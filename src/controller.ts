import { log } from "./db/index";
import { MessageBody } from "./plugins/types";
import SortJob from "./controller/sort";
import UpdateJob from "./controller/update";

function isMessageBody(data: unknown): data is MessageBody {
  if (data) {
    if ((data as MessageBody).event && (data as MessageBody).data) {
      return true;
    }
  }
  return false;
}

const LOG_TARGET = "controller";
const SORT_JOB = "sort";
const UPDATE_JOB = "update";
const acceptableJobs = new Set([SORT_JOB, UPDATE_JOB]);

function pickJobs(data: MessageBody): Array<string> {
  if (Array.isArray(data.event)) {
    return data.event.filter((item) => acceptableJobs.has(item));
  }

  const event: Array<string> = [];

  if (acceptableJobs.has(data.event)) {
    event.push(data.event);
  }

  return event;
}

async function distributeJobs(
  jobs: Array<string>,
  data: any,
  sendResponse: (response?: any) => void
) {
  const asyncWrap = [];

  for (const job of jobs) {
    /**
     * write operation first
     */
    switch (job) {
      case UPDATE_JOB:
        asyncWrap.push(UpdateJob(data));
        break;
      case SORT_JOB:
        asyncWrap.push(SortJob(data));
        break;
    }
  }

  const results = [];

  for (const job of asyncWrap) {
    results.push(await job);
  }

  sendResponse(
    results.reduce((prev, next) => Object.assign(prev, next), {} as any)
  );

  // Promise.allSettled(asyncWrap).then((results) =>
  //   sendResponse(
  //     results.reduce(
  //       (prev, next) =>
  //         Object.assign(
  //           prev,
  //           next.status === "fulfilled" ? next.value : next.reason
  //         ),
  //       {} as any
  //     )
  //   )
  // );
}

const ASYNC_RESPONSE_FLAG = true;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (!isMessageBody(request)) {
    log("warn", LOG_TARGET, {
      message: "request body not validate",
      sender,
      request,
    });
    return;
  }

  const jobs = pickJobs(request);

  log("info", LOG_TARGET, {
    message: "job picked",
    url: sender.url,
    jobs,
  });

  distributeJobs(jobs, request.data, sendResponse)
    .then(() =>
      log("info", LOG_TARGET, {
        message: "job completed",
        jobs,
        url: sender.url,
      })
    )
    .catch((error) => {
      log("error", LOG_TARGET, {
        message: "job failed",
        url: sender.url,
        jobs,
        request,
        error,
      });
    });

  return ASYNC_RESPONSE_FLAG;
});
