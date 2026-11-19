#!/usr/bin/env node
import { readFileSync } from "node:fs";

import { fromRomaji, toHiragana, toKatakana, toRomaji } from "../src/index.js";

const USAGE = `Convert Japanese kana and rōmaji from the command line.

Usage:
  kana <mode> [text...]
  echo "text" | kana <mode>

Modes:
  hiragana   katakana → hiragana
  katakana   hiragana → katakana
  romaji     kana → rōmaji
  kana       rōmaji → kana

Options:
  --long-vowel <style>   macron (default), double, or ignore
  --wo                   write を as "wo" instead of "o"
  -h, --help             show this help

Examples:
  kana romaji "こんにちは"        # konnichiha
  kana kana "matcha"              # まっちゃ
  kana romaji --long-vowel double "コーヒー"
  echo "カタカナ" | kana hiragana`;

const MODES = {
  hiragana: (text) => toHiragana(text),
  katakana: (text) => toKatakana(text),
  romaji: (text, options) => toRomaji(text, options),
  kana: (text) => fromRomaji(text),
};

function fail(message) {
  console.error(`${message}\n\n${USAGE}`);
  process.exit(1);
}

function main(argv) {
  const args = [...argv];

  if (args.length === 0 || args.includes("-h") || args.includes("--help")) {
    console.log(USAGE);
    return;
  }

  let mode;
  let longVowel = "macron";
  let wo = "o";
  const words = [];

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    if (arg === "--long-vowel") {
      longVowel = args[i + 1];
      if (longVowel === undefined) fail("--long-vowel needs a value.");
      i += 1;
    } else if (arg.startsWith("--long-vowel=")) {
      longVowel = arg.slice("--long-vowel=".length);
    } else if (arg === "--wo") {
      wo = "wo";
    } else if (mode === undefined && Object.hasOwn(MODES, arg)) {
      mode = arg;
    } else {
      words.push(arg);
    }
  }

  if (mode === undefined) {
    fail("Missing a mode: hiragana, katakana, romaji, or kana.");
  }

  let text = words.join(" ");
  if (text.length === 0) {
    if (process.stdin.isTTY) {
      fail("No input. Pass text as an argument or pipe it via stdin.");
    }
    text = readFileSync(0, "utf8").replace(/\r?\n$/, "");
  }

  console.log(MODES[mode](text, { longVowel, wo }));
}

try {
  main(process.argv.slice(2));
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
