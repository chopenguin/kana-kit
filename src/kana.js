const HIRAGANA_FIRST = 0x3041; // ぁ
const HIRAGANA_LAST = 0x3096; // ゖ
const KATAKANA_FIRST = 0x30a1; // ァ
const KATAKANA_LAST = 0x30f6; // ヶ
const KATAKANA_OFFSET = 0x60;

const HALFWIDTH_KATAKANA_RUN = /[\uff66-\uff9f]+/g;

/**
 * Normalize half-width katakana (for example `ｶﾞ` → `ガ`) and leave other
 * characters untouched.
 *
 * @param {string} input
 * @returns {string}
 */
export function normalizeWidth(input) {
  return String(input).replace(HALFWIDTH_KATAKANA_RUN, (run) => run.normalize("NFKC"));
}

/**
 * Convert hiragana to full-width katakana. Other characters are preserved.
 *
 * @param {string} input
 * @returns {string}
 */
export function toKatakana(input) {
  return convertRange(String(input), HIRAGANA_FIRST, HIRAGANA_LAST, KATAKANA_OFFSET);
}

/**
 * Convert full-width katakana to hiragana. Other characters are preserved.
 *
 * @param {string} input
 * @returns {string}
 */
export function toHiragana(input) {
  return convertRange(String(input), KATAKANA_FIRST, KATAKANA_LAST, -KATAKANA_OFFSET);
}

/**
 * @param {string} text
 * @param {number} first
 * @param {number} last
 * @param {number} offset
 * @returns {string}
 */
function convertRange(text, first, last, offset) {
  let result = "";
  for (const char of normalizeWidth(text)) {
    const code = char.codePointAt(0);
    result += code >= first && code <= last ? String.fromCodePoint(code + offset) : char;
  }
  return result;
}
