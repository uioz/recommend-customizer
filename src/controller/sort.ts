import { DB, log } from "../db/index";
import { CodeRequest } from "./types";
import * as Code from "../db/code";
import * as Sentiment from "../db/sentiment";
import * as Actress from "../db/actress";
import { tokenilize } from "../lib/tokenizer";
import { getCodePrefix } from "./helper";
import { findActors } from "../lib/fuzz";

const LOG_TARGET = "controller:sort";

export interface SortResponse {
  sort: Array<{
    key: string;
    weight: number;
  }> | null;
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

  let i = 0,
    len = data.length;

  const indexList = []; // capacity equal to data
  const codeList = []; // contain validated code only

  while (i < len) {
    results.push({
      key: data[i].key,
      rank: data[i].rank ?? 0,
      codeWeight: 0,
      tokenWeight: 0,
      actressWeight: 0,
    });

    const code = getCodePrefix(data[i].code);

    indexList[i] = code;

    if (code) {
      codeList.push(code);
    } else {
      log("warn", LOG_TARGET, {
        message: "code prefix missing",
        code: data[i].code,
        title: data[i].title,
      });
    }

    i++;
  }

  const queryResults = await Code.query(DB, codeList);

  i = 0;

  while (i < len) {
    if (indexList[i] !== null) {
      results[i].codeWeight = queryResults.shift() as number;
    }
    i++;
  }

  // TODO: batch operation, improvement later
  await Promise.all(
    data.map(async ({ code: fullCode, title }, index) => {
      const tokens = await tokenilize(title);

      if (tokens.length) {
        results[index].tokenWeight = await Sentiment.totalWeight(
          DB,
          Array.from(new Set(tokens))
        );
      } else {
        log("info", LOG_TARGET, {
          message: "token match missing",
          code: fullCode,
          title,
        });
      }

      const actress = findActors(title);

      if (actress.length) {
        results[index].actressWeight = await Actress.totalWeight(DB, actress);
      } /* else {
        log("info", LOG_TARGET, {
          message: "actress match missing",
          code: fullCode,
          title,
        });
      } */
    })
  );

  return results;
}

function unifying(data: Array<Item>) {
  let codeMax = 0,
    tokenMax = 0,
    actressMax = 0,
    rankMin = 0,
    rankMax = 0,
    rankRange = 0;

  const codeWeights = [];
  const tokenWeights = [];
  const actressWeights = [];
  const ranks = [];

  for (const { codeWeight, tokenWeight, actressWeight, rank } of data) {
    codeWeights.push(codeWeight);
    tokenWeights.push(tokenWeight);
    actressWeights.push(actressWeight);
    ranks.push(rank);
  }

  codeMax = Math.max(...codeWeights);
  tokenMax = Math.max(...tokenWeights);
  actressMax = Math.max(...actressWeights);
  rankMin = Math.min(...ranks);
  rankMax = Math.max(...ranks);
  rankRange = rankMax - rankMin;

  for (const item of data) {
    if (item.rank > 0) {
      item.rank = ((item.rank - rankMin) / rankRange) * 100;
    }

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
        weight:
          rank * 0.3 +
          tokenWeight * 0.3 +
          codeWeight * 0.2 +
          actressWeight * 0.2,
      };
    })
    .sort((prev, next) => next.weight - prev.weight);
}

export default async (data: Array<CodeRequest>): Promise<SortResponse> => {
  try {
    const sort = sorting(unifying(await analyse(data)));
    return {
      sort,
    };
  } catch (error) {
    log("error", LOG_TARGET, {
      message: "sorting failed",
      error,
    });
  }

  return {
    sort: null,
  };
};
