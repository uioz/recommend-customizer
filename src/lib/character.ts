export const isHiragana = (str: string) => /^[\u{3041}-\u{3096}]+$/u.test(str);

export const isKatakana = (str: string) => /^[\u{30a0}-\u{30ff}]+$/u.test(str);

export const iskanji = (str: string) => /^[\u{4e00}-\u{9faf}]+$/u.test(str);

export const isPureNumber = (str: string) => /^[0-9]+$/.test(str);
