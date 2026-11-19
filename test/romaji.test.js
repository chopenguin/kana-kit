import test from "node:test";
import assert from "node:assert/strict";

import { fromRomaji, toRomaji } from "../src/index.js";

test("toRomaji uses Hepburn consonants", () => {
  assert.equal(toRomaji("こんにちは"), "konnichiha");
  assert.equal(toRomaji("しんぶん"), "shinbun");
  assert.equal(toRomaji("ちかてつ"), "chikatetsu");
  assert.equal(toRomaji("ふじさん"), "fujisan");
  assert.equal(toRomaji("ぢづ"), "jizu");
});

test("toRomaji handles small tsu and small kana", () => {
  assert.equal(toRomaji("がっこう"), "gakkou");
  assert.equal(toRomaji("ちょっと"), "chotto");
  assert.equal(toRomaji("まっちゃ"), "matcha");
  assert.equal(toRomaji("きって"), "kitte");
  assert.equal(toRomaji("しゃしん"), "shashin");
});

test("toRomaji writes syllabic n with an apostrophe before vowels and y", () => {
  assert.equal(toRomaji("しんよう"), "shin'you");
  assert.equal(toRomaji("かんい"), "kan'i");
  assert.equal(toRomaji("こんにちは"), "konnichiha");
  assert.equal(toRomaji("ん"), "n");
});

test("toRomaji expands the long vowel mark", () => {
  assert.equal(toRomaji("コーヒー"), "kōhī");
  assert.equal(toRomaji("スーパー"), "sūpā");
  assert.equal(toRomaji("ケーキ"), "kēki");
  assert.equal(toRomaji("コーヒー", { longVowel: "double" }), "koohii");
  assert.equal(toRomaji("コーヒー", { longVowel: "ignore" }), "kohi");
  assert.throws(() => toRomaji("あ", { longVowel: "nope" }), RangeError);
});

test("toRomaji supports loanword combinations", () => {
  assert.equal(toRomaji("ヴァイオリン"), "vaiorin");
  assert.equal(toRomaji("ウィキペディア"), "wikipedia");
  assert.equal(toRomaji("ジェット"), "jetto");
  assert.equal(toRomaji("チェス"), "chesu");
  assert.equal(toRomaji("ティー"), "tī");
});

test("toRomaji can write を as wo", () => {
  assert.equal(toRomaji("を"), "o");
  assert.equal(toRomaji("を", { wo: "wo" }), "wo");
});

test("fromRomaji handles gemination, tch and syllabic n", () => {
  assert.equal(fromRomaji("konnichiwa"), "こんにちわ");
  assert.equal(fromRomaji("gakkou"), "がっこう");
  assert.equal(fromRomaji("kitte"), "きって");
  assert.equal(fromRomaji("matcha"), "まっちゃ");
  assert.equal(fromRomaji("maccha"), "まっちゃ");
  assert.equal(fromRomaji("shin'you"), "しんよう");
  assert.equal(fromRomaji("shinyou"), "しにょう");
  assert.equal(fromRomaji("kan'i"), "かんい");
  assert.equal(fromRomaji("senpai"), "せんぱい");
  assert.equal(fromRomaji("anna"), "あんな");
  assert.equal(fromRomaji("konn"), "こん");
});

test("fromRomaji handles digraphs and aliases", () => {
  assert.equal(fromRomaji("kya"), "きゃ");
  assert.equal(fromRomaji("sha"), "しゃ");
  assert.equal(fromRomaji("tsunami"), "つなみ");
  assert.equal(fromRomaji("ja"), "じゃ");
  assert.equal(fromRomaji("she"), "しぇ");
  assert.equal(fromRomaji("je"), "じぇ");
  assert.equal(fromRomaji("fa"), "ふぁ");
  assert.equal(fromRomaji("wi"), "うぃ");
  assert.equal(fromRomaji("si"), "し");
  assert.equal(fromRomaji("ti"), "ち");
  assert.equal(fromRomaji("tu"), "つ");
  assert.equal(fromRomaji("hu"), "ふ");
  assert.equal(fromRomaji("zi"), "じ");
  assert.equal(fromRomaji("di"), "ぢ");
});

test("fromRomaji handles を, macrons and passthrough", () => {
  assert.equal(fromRomaji("wo"), "を");
  assert.equal(fromRomaji("o"), "お");
  assert.equal(fromRomaji("kōhī"), "こーひー");
  assert.equal(fromRomaji("こんにちは"), "こんにちは");
  assert.equal(fromRomaji("チェス"), "チェス");
});

test("conversion can round-trip unambiguous kana", () => {
  for (const text of ["がっこう", "きって", "しんよう", "まっちゃ", "かんい"]) {
    assert.equal(fromRomaji(toRomaji(text, { longVowel: "double" })), text);
  }
});
