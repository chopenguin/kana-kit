import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const KANA_BIN = fileURLToPath(new URL("../bin/kana.js", import.meta.url));

function run(args, options = {}) {
  return execFileSync(process.execPath, [KANA_BIN, ...args], {
    encoding: "utf8",
    ...options,
  });
}

test("CLI converts between kana scripts", () => {
  assert.equal(run(["hiragana", "カタカナ"]).trim(), "かたかな");
  assert.equal(run(["katakana", "ひらがな"]).trim(), "ヒラガナ");
});

test("CLI converts kana to romaji and back", () => {
  assert.equal(run(["romaji", "こんにちは"]).trim(), "konnichiha");
  assert.equal(run(["kana", "matcha"]).trim(), "まっちゃ");
});

test("CLI reads text from stdin", () => {
  assert.equal(run(["hiragana"], { input: "カタカナ" }).trim(), "かたかな");
});

test("CLI supports flags and multiple words", () => {
  assert.equal(run(["romaji", "--long-vowel", "double", "コーヒー"]).trim(), "koohii");
  assert.equal(run(["romaji", "--wo", "を"]).trim(), "wo");
  assert.equal(run(["hiragana", "カタ", "カナ"]).trim(), "かた かな");
});

test("CLI prints usage", () => {
  assert.match(run(["--help"]), /Usage:/);
});
