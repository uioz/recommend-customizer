import { DB } from "../db/index";
import { CodeRequest } from "./types";
import * as Code from "../db/code";
import * as Sentiment from "../db/sentiment";
import * as Actress from "../db/actress";
import { tokenilize } from "../lib/tokenizer";
import { getCodePrefix } from "./helper";
import { findActors } from "../lib/fuzz";

export interface SortResponse {
  sort: Array<{
    key: string;
    weight: number;
  }>;
}

interface Item {
  key: string;
  /**
   * min 0 max 5.0
   */
  rank: number;
  codeWeight: number;
  tokenWeight: number;
  actressWeight: number;
}

async function analyse(data: Array<CodeRequest>) {
  const results: Array<Item> = [];

  // TODO: batch operation, improvement later
  await Promise.all(
    data.map(async ({ code: fullCode, title, key, rank }) => {
      const item: Item = {
        key,
        rank,
        codeWeight: 0,
        tokenWeight: 0,
        actressWeight: 0,
      };

      const code = getCodePrefix(fullCode);

      if (code) {
        item.codeWeight = await Code.singleQuery(DB, code);
      }

      const tokens = await tokenilize(title);

      if (tokens.length) {
        item.tokenWeight = await Sentiment.totalWeight(
          DB,
          Array.from(new Set(tokens))
        );
      }

      const actress = await findActors(title);

      if (actress.length) {
        item.actressWeight = await Actress.totalWeight(DB, actress);
      }

      results.push(item);
    })
  );

  return results;
}

function unifying(data: Array<Item>) {
  let codeMax = 0,
    tokenMax = 0,
    actressMax = 0;

  for (const item of data) {
    codeMax = Math.max(codeMax, item.codeWeight);
    tokenMax = Math.max(tokenMax, item.tokenWeight);
    actressMax = Math.max(actressMax, item.actressWeight);
  }

  for (const item of data) {
    // 4.5 * 20 = 90
    item.rank *= 20;
    if (codeMax > 0) {
      item.codeWeight = (item.codeWeight / codeMax) * 100;
    }
    if (tokenMax > 0) {
      item.tokenWeight = (item.tokenWeight / tokenMax) * 100;
    }
    if (actressMax > 0) {
      item.actressWeight = (item.actressWeight / actressMax) * 100;
    }
  }

  return data;
}

function sorting(data: Array<Item>): Array<{
  key: string;
  weight: number;
}> {
  return data
    .map(({ actressWeight, codeWeight, key, rank, tokenWeight }) => {
      return {
        key,
        weight: actressWeight + codeWeight + rank + tokenWeight,
      };
    })
    .sort((prev, next) => next.weight - prev.weight);
}

export default async (data: Array<CodeRequest>): Promise<SortResponse> => {
  debugger;
  return {
    sort: sorting(unifying(await analyse(data))),
  };
};
