import { tokenilize } from "../lib/tokenizer";
import { getCodePrefix } from "./helper";
import { DB, log } from "../db/index";
import * as Actress from "../db/actress";
import * as Code from "../db/code";
import * as Sentiment from "../db/sentiment";
import * as ActressStore from "../lib/actress-store";

const LOG_TARGET = "controller:update";

export interface UpdateRequest {
  code: string;
  title: string;
  actress?: Array<string>;
}

export interface UpdateResponse {
  update: string | null;
}

function errorToString(error: unknown) {
  if (error instanceof Error) {
    return error + "";
  }

  if (error instanceof Object) {
    return error.toString();
  }

  console.error(error);

  return "unknow error";
}

export default async (
  data: Array<UpdateRequest> | UpdateRequest
): Promise<UpdateResponse> => {
  const actressArr: Array<string> = [];
  const codePrefixs: Array<string> = [];
  const keywords: Array<string> = [];

  if (!Array.isArray(data)) {
    data = [data];
  }

  await Promise.all(
    data.map(async ({ title, code, actress }) => {
      const prefix = getCodePrefix(code)?.toLowerCase();

      if (prefix) {
        codePrefixs.push(prefix);
      } else {
        log("warn", LOG_TARGET, {
          message: "code prefix missing",
          code,
          title,
        });
      }

      if (Array.isArray(actress)) {
        actressArr.push(...actress);
      }

      keywords.push(...(await tokenilize(title)));
    })
  );

  try {
    if (actressArr.length) {
      await Actress.update(DB, actressArr);
      ActressStore.write(actressArr);
    }
  } catch (error) {
    log("error", LOG_TARGET, {
      message: "actress update failed",
      data,
      error,
    });
    return {
      update: errorToString(error),
    };
  }
  try {
    if (codePrefixs.length) {
      await Code.update(DB, codePrefixs);
    }
  } catch (error) {
    log("error", LOG_TARGET, {
      message: "code update failed",
      data,
      error,
    });
    return {
      update: errorToString(error),
    };
  }

  try {
    if (keywords.length) {
      await Sentiment.update(DB, keywords);
    }
  } catch (error) {
    log("error", LOG_TARGET, {
      message: "token update failed",
      data,
      error,
    });
    return {
      update: errorToString(error),
    };
  }

  return {
    update: null,
  };
};
