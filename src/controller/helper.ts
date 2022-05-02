type matchAble = (
  regexp: RegExp,
  defaultStr?: string
) => (str: string) => null | string;

export const matchWraper: matchAble = (regexp, defaultStr) => (str) => {
  const result = regexp.exec(str);
  if (result) {
    return defaultStr ?? result[1];
  }
  return result;
};

// match code liek fc2-ppv-1234567
export const fc2PrefixCode = matchWraper(/^(fc2)-(?:ppv-|)\d{7}$/i);
// match code like t-28000
export const t28PrefixCode = matchWraper(/^(?:t-28\d{3})|t28-\d{3}$/i, "t28");
// match code like
// 000xxx-000
// XXX-000Z
// 300XXX-000
export const numberPrefixCode = matchWraper(
  /^((?:\d{3})?[a-z]{2,7}-\d{2,5}(?:[a-z])?)$/i
);

export const codePatterns = [numberPrefixCode, fc2PrefixCode, t28PrefixCode];

export function getCodePrefix(fullCode: string): string | null {
  for (const pattern of codePatterns) {
    const prefix = pattern(fullCode);
    if (prefix) {
      return prefix;
    }
  }
  return null;
}
