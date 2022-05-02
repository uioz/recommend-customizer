import kuromoji from "kuromoji";
import { isJapanese } from "../lib/is-japenese";

const LOG_TARGET = "tokenizer";

let tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures>;
let fetchTokenizer:
  | Promise<kuromoji.Tokenizer<kuromoji.IpadicFeatures>>
  | undefined;

export function init() {
  if (tokenizer) {
    return Promise.resolve(tokenizer);
  }

  if (fetchTokenizer) {
    return fetchTokenizer;
  }
  console.log(`${LOG_TARGET} init`);

  return (fetchTokenizer = new Promise<
    kuromoji.Tokenizer<kuromoji.IpadicFeatures>
  >((resolve, reject) => {
    kuromoji
      .builder({
        dicPath: "./dict",
      })
      .build((error, tokenizer) => {
        if (error) {
          console.error(`${LOG_TARGET} init failed ${error}`);
          reject(error);
        } else {
          console.log(`${LOG_TARGET} init success`);
          resolve(tokenizer);
        }
      });
  }));
}

const normalWordMap = new Map<string, Set<string>>([
  [
    "名詞",
    new Set(["一般", "形容動詞語幹", "サ変接続", "形容動詞語幹", "固有名詞"]),
  ],
  ["動詞", new Set(["自立"])],
]);

function processNormal(data: kuromoji.IpadicFeatures) {
  if (normalWordMap.get(data.pos)?.has(data.pos_detail_1)) {
    return data.surface_form;
  }
}

const effectiveWords = /^[a-z]{2,}$/i;

function filter(data: kuromoji.IpadicFeatures[]) {
  const keywords = [];

  for (const item of data) {
    const word = processNormal(item);

    if (word) {
      if (isJapanese(word) || effectiveWords.test(word)) {
        keywords.push(word);
      }
    }
  }

  return keywords;
}

export async function tokenilize(str: string): Promise<Array<string>> {
  const tokenizer = await init();

  return filter(tokenizer.tokenize(str));
}
