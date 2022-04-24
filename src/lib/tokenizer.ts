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
  tokenizer = await kuromojiWrap();
}
