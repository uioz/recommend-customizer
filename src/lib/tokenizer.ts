import kuromoji from "kuromoji";

let tokenizer: kuromoji.Tokenizer<kuromoji.IpadicFeatures>;

function kuromojiWrap() {
  return new Promise<kuromoji.Tokenizer<kuromoji.IpadicFeatures>>(
    (resolve, reject) => {
      kuromoji
        .builder({
          dicPath: "./dict",
        })
        .build((error, tokenizer) => {
          if (error) {
            reject(error);
          } else {
            resolve(tokenizer);
          }
        });
    }
  );
}

export async function init() {
  if (!tokenizer) {
    tokenizer = await kuromojiWrap();
  }
  return tokenizer;
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

function filter(data: kuromoji.IpadicFeatures[]) {
  const keywords = [];

  for (const item of data) {
    const word = processNormal(item);

    if (word) {
      keywords.push(word);
    }
  }

  return keywords;
}

export async function tokenilize(str: string): Promise<Array<string>> {
  const tokenizer = await init();

  return filter(tokenizer.tokenize(str));
}
