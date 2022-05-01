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

// match code like 000xxx-000
export const numberPrefixCode = matchWraper(/^\d{3}([a-z]{2,6})-\d{3,5}$/i);
// match code liek fc2-ppv-1234567
export const fc2PrefixCode = matchWraper(/^(fc2)-(?:ppv-|)\d{7}$/i);
// match code like t-28000
export const t28PrefixCode = matchWraper(/^(?:t-28\d{3})|t28-\d{3}$/i, "t28");
// match code like
export const normalCode = matchWraper(/^([a-z]{2,6})-\d{3,5}$/i);

export const codePatterns = [
  numberPrefixCode,
  fc2PrefixCode,
  t28PrefixCode,
  normalCode,
];

export function getCodePrefix(fullCode: string): string | null {
  for (const pattern of codePatterns) {
    const prefix = pattern(fullCode);
    if (prefix) {
      return prefix;
    }
  }
  return null;
}
