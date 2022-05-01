import { tokenilize } from "../lib/tokenizer";
import { getCodePrefix } from "./helper";
import { DB } from "../db/index";
import * as Actress from "../db/actress";
import * as Code from "../db/code";
import * as Sentiment from "../db/sentiment";

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
      }

      if (Array.isArray(actress)) {
        actressArr.push(...actress);
      }

      keywords.push(...(await tokenilize(title)));
    })
  );

  try {
    await Actress.update(DB, actressArr);
    await Code.update(DB, codePrefixs);
    await Sentiment.update(DB, keywords);
  } catch (error) {
    return {
      update: errorToString(error),
    };
  }

  return {
    update: null,
  };
};
