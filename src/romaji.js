import { toHiragana } from "./kana.js";

const MONO = {
  あ: "a", い: "i", う: "u", え: "e", お: "o",
  ぁ: "a", ぃ: "i", ぅ: "u", ぇ: "e", ぉ: "o",
  か: "ka", き: "ki", く: "ku", け: "ke", こ: "ko",
  ゕ: "ka", ゖ: "ke",
  が: "ga", ぎ: "gi", ぐ: "gu", げ: "ge", ご: "go",
  さ: "sa", し: "shi", す: "su", せ: "se", そ: "so",
  ざ: "za", じ: "ji", ず: "zu", ぜ: "ze", ぞ: "zo",
  た: "ta", ち: "chi", つ: "tsu", て: "te", と: "to",
  だ: "da", ぢ: "ji", づ: "zu", で: "de", ど: "do",
  な: "na", に: "ni", ぬ: "nu", ね: "ne", の: "no",
  は: "ha", ひ: "hi", ふ: "fu", へ: "he", ほ: "ho",
  ば: "ba", び: "bi", ぶ: "bu", べ: "be", ぼ: "bo",
  ぱ: "pa", ぴ: "pi", ぷ: "pu", ぺ: "pe", ぽ: "po",
  ま: "ma", み: "mi", む: "mu", め: "me", も: "mo",
  や: "ya", ゆ: "yu", よ: "yo", ゃ: "ya", ゅ: "yu", ょ: "yo",
  ら: "ra", り: "ri", る: "ru", れ: "re", ろ: "ro",
  わ: "wa", ゐ: "i", ゑ: "e", を: "o", ゎ: "wa",
  ん: "n",
  ゔ: "vu",
};

const DIGRAPHS = {
  きゃ: "kya", きゅ: "kyu", きょ: "kyo",
  ぎゃ: "gya", ぎゅ: "gyu", ぎょ: "gyo",
  しゃ: "sha", しゅ: "shu", しょ: "sho",
  じゃ: "ja", じゅ: "ju", じょ: "jo",
  ちゃ: "cha", ちゅ: "chu", ちょ: "cho",
  ぢゃ: "ja", ぢゅ: "ju", ぢょ: "jo",
  にゃ: "nya", にゅ: "nyu", にょ: "nyo",
  ひゃ: "hya", ひゅ: "hyu", ひょ: "hyo",
  びゃ: "bya", びゅ: "byu", びょ: "byo",
  ぴゃ: "pya", ぴゅ: "pyu", ぴょ: "pyo",
  みゃ: "mya", みゅ: "myu", みょ: "myo",
  りゃ: "rya", りゅ: "ryu", りょ: "ryo",
  ふぁ: "fa", ふぃ: "fi", ふぇ: "fe", ふぉ: "fo", ふゅ: "fyu",
  てぃ: "ti", でぃ: "di", とぅ: "tu", どぅ: "du",
  つぁ: "tsa", つぃ: "tsi", つぇ: "tse", つぉ: "tso",
  うぃ: "wi", うぇ: "we", うぉ: "wo",
  しぇ: "she", じぇ: "je", ちぇ: "che", いぇ: "ye",
  きぇ: "kye", ぎぇ: "gye", にぇ: "nye", ひぇ: "hye",
  びぇ: "bye", ぴぇ: "pye", みぇ: "mye", りぇ: "rye",
  くぁ: "kwa", くぃ: "kwi", くぇ: "kwe", くぉ: "kwo",
  ぐぁ: "gwa", ぐぃ: "gwi", ぐぇ: "gwe", ぐぉ: "gwo",
  すぃ: "si", ずぃ: "zi",
  ゔぁ: "va", ゔぃ: "vi", ゔぇ: "ve", ゔぉ: "vo",
};

const KUNREI_ALIASES = {
  si: "し", ti: "ち", tu: "つ", hu: "ふ", zi: "じ", di: "ぢ",
  sya: "しゃ", syu: "しゅ", syo: "しょ",
  tya: "ちゃ", tyu: "ちゅ", tyo: "ちょ",
  zya: "じゃ", zyu: "じゅ", zyo: "じょ",
  dya: "ぢゃ", dyu: "ぢゅ", dyo: "ぢょ",
  cya: "ちゃ", cyu: "ちゅ", cyo: "ちょ",
  jya: "じゃ", jyu: "じゅ", jyo: "じょ",
};

const MACRONS = { a: "ā", i: "ī", u: "ū", e: "ē", o: "ō" };
const MACRON_TO_VOWEL = { ā: "a", ī: "i", ū: "u", ē: "e", ō: "o" };
const VOWELS = new Set(["a", "i", "u", "e", "o"]);
const GEMINATE_CONSONANTS = new Set("bcdfghjklmpqrstvwxyz".split(""));
const LONG_VOWEL_STYLES = new Set(["macron", "double", "ignore"]);

const N_APOSTROPHE_NEXT = /^[あいうえおやゆよぁぃぅぇぉゃゅょ]/;
const MACRON_PATTERN = /[āīūēō]/g;

let reverseMap;

/**
 * Convert kana to Hepburn-style rōmaji.
 *
 * Only the long vowel mark `ー` is expanded; `おう` stays `ou` because
 * contracting it would need word-level knowledge (`がっこう` → `gakkou`,
 * but `おもう` → `omou`).
 *
 * @param {string} input
 * @param {{ longVowel?: "macron" | "double" | "ignore", wo?: string }} [options]
 * @returns {string}
 */
export function toRomaji(input, options = {}) {
  const { longVowel = "macron", wo = "o" } = options ?? {};
  if (!LONG_VOWEL_STYLES.has(longVowel)) {
    throw new RangeError(
      `Unknown longVowel style: ${longVowel}. Expected "macron", "double", or "ignore".`,
    );
  }

  const text = toHiragana(String(input));
  let result = "";
  let geminate = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (char === "っ") {
      geminate = true;
      continue;
    }

    if (char === "ー") {
      result = applyLongVowel(result, longVowel);
      geminate = false;
      continue;
    }

    if (char === "ん") {
      result += "n" + (N_APOSTROPHE_NEXT.test(text[i + 1] ?? "") ? "'" : "");
      geminate = false;
      continue;
    }

    if (char === "を") {
      result += wo === "wo" ? "wo" : "o";
      geminate = false;
      continue;
    }

    const pair = text.slice(i, i + 2);
    let romaji;
    if (Object.hasOwn(DIGRAPHS, pair)) {
      romaji = DIGRAPHS[pair];
      i += 1;
    } else if (Object.hasOwn(MONO, char)) {
      romaji = MONO[char];
    } else {
      result += char;
      geminate = false;
      continue;
    }

    if (geminate) {
      romaji = geminateRomaji(romaji);
      geminate = false;
    }
    result += romaji;
  }

  return result;
}

/**
 * Convert rōmaji to hiragana. Input is phonetic, not orthographic.
 *
 * @param {string} input
 * @returns {string}
 */
export function fromRomaji(input) {
  const text = String(input)
    .toLowerCase()
    .replace(MACRON_PATTERN, (char) => MACRON_TO_VOWEL[char] + "ー");
  const reverse = getReverseMap();

  let result = "";
  let i = 0;

  while (i < text.length) {
    const char = text[i];

    if (text.startsWith("tch", i)) {
      result += "っ";
      i += 1;
      continue;
    }

    if (char === "n") {
      const next = text[i + 1] ?? "";
      if (next === "'") {
        result += "ん";
        i += 2;
        continue;
      }
      if (next === "n") {
        result += "ん";
        i += isVowelOrY(text[i + 2] ?? "") ? 1 : 2;
        continue;
      }
      if (!isVowelOrY(next)) {
        result += "ん";
        i += 1;
        continue;
      }
      // Otherwise fall through so na / ni / nya ... can match below.
    }

    if (char === text[i + 1] && GEMINATE_CONSONANTS.has(char)) {
      result += "っ";
      i += 1;
      continue;
    }

    let matched = false;
    for (const length of [3, 2, 1]) {
      const kana = reverse.get(text.slice(i, i + length));
      if (kana !== undefined) {
        result += kana;
        i += length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    result += char;
    i += 1;
  }

  return result;
}

function geminateRomaji(romaji) {
  if (romaji.startsWith("ch")) return `t${romaji}`;
  if (VOWELS.has(romaji[0])) return romaji;
  return romaji[0] + romaji;
}

function applyLongVowel(result, style) {
  if (style === "ignore") return result;
  const last = result.at(-1);
  if (last !== undefined && Object.hasOwn(MACRONS, last)) {
    return style === "macron" ? result.slice(0, -1) + MACRONS[last] : result + last;
  }
  return result + "ー";
}

function isVowelOrY(char) {
  return VOWELS.has(char) || char === "y";
}

function getReverseMap() {
  if (reverseMap) return reverseMap;

  reverseMap = new Map();
  for (const [kana, romaji] of Object.entries(MONO)) {
    if (!reverseMap.has(romaji)) reverseMap.set(romaji, kana);
  }
  for (const [kana, romaji] of Object.entries(DIGRAPHS)) {
    if (!reverseMap.has(romaji)) reverseMap.set(romaji, kana);
  }
  for (const [romaji, kana] of Object.entries(KUNREI_ALIASES)) {
    reverseMap.set(romaji, kana);
  }
  reverseMap.set("wo", "を");

  return reverseMap;
}
