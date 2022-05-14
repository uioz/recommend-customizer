import { isHiragana, isKatakana, isPureNumber } from "./character";

const LOG_TARGET = "tokenizer";

// @ts-ignore
const Segmenter = new Intl.Segmenter("ja-JP", { granularity: "word" });

function filter(data: Iterable<any>) {
  const keywords = [];

  for (const item of data) {
    if (!item.isWordLike) {
      continue;
    }

    if (isPureNumber(item.segment)) {
      continue;
    }

    if (
      item.segment.length === 1 &&
      (isHiragana(item.segment) || isKatakana(item.segment))
    ) {
      continue;
    }

    keywords.push(item.segment);
  }

  return keywords;
}

export async function tokenilize(str: string): Promise<Array<string>> {
  return filter(Segmenter.segment(str));
}
