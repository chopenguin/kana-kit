import test from "node:test";
import assert from "node:assert/strict";

import { toHiragana, toKatakana } from "../src/index.js";

test("toKatakana converts hiragana and leaves everything else alone", () => {
  assert.equal(toKatakana("ひらがな"), "ヒラガナ");
  assert.equal(toKatakana("ゔぁいおりん"), "ヴァイオリン");
  assert.equal(toKatakana("こんにちは、世界。"), "コンニチハ、世界。");
  assert.equal(toKatakana("abc 123"), "abc 123");
});

test("toHiragana converts full-width katakana", () => {
  assert.equal(toHiragana("カタカナ"), "かたかな");
  assert.equal(toHiragana("ヴァイオリン"), "ゔぁいおりん");
  assert.equal(toHiragana("コーヒー"), "こーひー");
});

test("both directions normalize half-width katakana", () => {
  assert.equal(toHiragana("ｶﾀｶﾅ"), "かたかな");
  assert.equal(toHiragana("ｺﾞﾊﾝ"), "ごはん");
  assert.equal(toKatakana("ﾊﾝｶｸ"), "ハンカク");
});

test("small kana are converted", () => {
  assert.equal(toKatakana("ゃゅょっぁぃぅぇぉ"), "ャュョッァィゥェォ");
  assert.equal(toHiragana("ャュョッァィゥェォ"), "ゃゅょっぁぃぅぇぉ");
});

test("conversion is reversible for kana-only strings", () => {
  const text = "あいうえお かきくけこ がぎぐげご ぱぴぷぺぽ ゃゅょ";
  assert.equal(toHiragana(toKatakana(text)), text);
  assert.equal(toKatakana(toHiragana(toKatakana(text))), toKatakana(text));
});
