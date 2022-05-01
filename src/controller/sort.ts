import { DB } from "../db/index";
import { CodeRequest } from "./types";
import * as Code from "../db/code";
import * as Sentiment from "../db/sentiment";
import { tokenilize } from "../lib/tokenizer";
import { getCodePrefix } from "./helper";

export interface SortResponse {
  sort: Array<{
    key: string;
    weight: number;
  }>;
}

async function analyse({ code: fullCode, key, rank, title }: CodeRequest) {
  const temp = {
    key,
    rank,
    codeWeight: 0,
    tokenWeight: 0,
    actressWeight: 0,
  };

  let code = getCodePrefix(fullCode);

  if (code !== null) {
    temp.codeWeight = await Code.query(DB, code);
  }

  await Sentiment.query(DB, new Set(await tokenilize(title)));
}

function unifying() {}

function sorting() {}

export default (data: Array<CodeRequest>) => {
  return new Promise<SortResponse>((resolve) => {
    resolve({
      sort: [],
    });
  });
};
