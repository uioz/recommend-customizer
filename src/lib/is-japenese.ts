/**
 * LICENSE https://github.com/liyt96/is-japanese/blob/main/LICENSE
 * @author Yuetian Li <daily.wel@hotmail.com>
 */

const japaneseRange = [
  [0x3041, 0x3096], // Hiragana
  [0x30a0, 0x30ff], // Katakana
  [0xff00, 0xffef], // Full-width roman characters and half-width katakana
  [0x4e00, 0x9faf], // Common and uncommon kanji
  // [0xff01, 0xff5e], // Alphanumeric and Punctuation (Full Width)
  // [0x3000, 0x303f], // Japanese Symbols and Punctuation
  // [0x0020, 0x005c], // Basic Punctuation
  // [0x2000, 0x206f], // General Punctuation
  // [0x0030, 0x0039], // Number 0-9
];

const jpReStr = japaneseRange
  .map((range) => {
    if (!Array.isArray(range)) {
      // @ts-ignore
      return `\\u{${range.toString(16)}}`;
    }
    return `[\\u{${range[0].toString(16)}}-\\u{${range[1].toString(16)}}]`;
  })
  .join("|");

const jpRe = new RegExp(`^(${jpReStr})+$`, "u");

const commonAsciiCharsRe = /[a-zA-Z_]|\t|\r/;

export const isJapanese = function (str: string) {
  // Exclusion of common scenarios
  if (commonAsciiCharsRe.test(str)) {
    return false;
  }
  return jpRe.test(str);
};
