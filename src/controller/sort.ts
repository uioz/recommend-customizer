import { DB } from "../db/index";
import { CodeRequest } from "./types";
import { queryWeight as queryCodeWeight } from "../db/code";
import { queryWeight as querySentimentWeight } from "../db/sentiment";
import { tokenilize } from "../lib/tokenizer";

export interface SortResponse {
  sort: Array<{
    key: string;
    weight: number;
  }>;
}

type matchAble = (
  regexp: RegExp,
  defaultStr?: string
) => (str: string) => null | string;

const matchWraper: matchAble = (regexp, defaultStr) => (str) => {
  const result = regexp.exec(str);
  if (result) {
    return defaultStr ?? result[1];
  }
  return result;
};

// match code like 000xxx-000
const numberPrefixCode = matchWraper(/^\d{3}([a-z]{2,5})-\d{3,5}$/i);
// match code liek fc2-ppv-1234567
const fc2PrefixCode = matchWraper(/^(fc2)-(?:ppv-|)\d{7}$/i);
// match code like t-28000
const t28PrefixCode = matchWraper(/^(?:t-28\d{3})|t28-\d{3}$/i, "t28");
// match code like
const normalCode = matchWraper(/^([a-z]{2,5})-\d{3,5}$/i);

const codeMathers = [
  numberPrefixCode,
  fc2PrefixCode,
  t28PrefixCode,
  normalCode,
];

async function analyse({ code: fullCode, key, rank, title }: CodeRequest) {
  const temp = {
    key,
    rank,
    codeWeight: 0,
    tokenWeight: 0,
    actressWeight: 0,
  };

  let code = null;

  for (const exec of codeMathers) {
    code = exec(fullCode);
    if (code) {
      break;
    }
  }

  if (code !== null) {
    temp.codeWeight = await queryCodeWeight(DB, code);
  }

  await querySentimentWeight(DB, new Set(await tokenilize(title)));
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
