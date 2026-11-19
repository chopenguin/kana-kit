import { fromRomaji, toHiragana, toKatakana, toRomaji } from "../src/index.js";

const MODES = {
  romaji: {
    inputLabel: "kana",
    samples: ["こんにちは、世界。", "がっこう", "コーヒー", "しんよう", "まっちゃ", "ヴァイオリン"],
    note: "Particles are read as written: こんにちは → konnichiha.",
    convert: (text, options) => toRomaji(text, options),
  },
  kana: {
    inputLabel: "rōmaji",
    samples: ["konnichiwa", "gakkou", "koohii", "shin'you", "matcha", "vaiorin"],
    note: "Phonetic input: konnichiwa → こんにちわ, not こんにちは.",
    convert: (text) => fromRomaji(text),
  },
  hiragana: {
    inputLabel: "hiragana",
    samples: ["ひらがな", "がっこう", "こんにちは", "ゔぁいおりん"],
    note: "Half-width katakana is normalized automatically.",
    convert: (text) => toKatakana(text),
  },
  katakana: {
    inputLabel: "katakana",
    samples: ["カタカナ", "コーヒー", "ヴァイオリン", "コンピューター"],
    note: "Half-width katakana is normalized automatically.",
    convert: (text) => toHiragana(text),
  },
};

const input = document.querySelector("#input");
const output = document.querySelector("#output");
const inputLabel = document.querySelector("#input-label");
const longVowelControl = document.querySelector("#long-vowel-control");
const longVowel = document.querySelector("#long-vowel");
const note = document.querySelector("#note");
const examples = document.querySelector("#examples");
const copyButton = document.querySelector("#copy");
const tabs = [...document.querySelectorAll(".tab")];

let mode = "romaji";
let copyTimer;

function convert() {
  const config = MODES[mode];
  const options = mode === "romaji" ? { longVowel: longVowel.value } : undefined;
  output.textContent = config.convert(input.value, options);
}

function renderSamples() {
  examples.replaceChildren();

  const label = document.createElement("span");
  label.className = "examples-label";
  label.textContent = "Try";
  examples.append(label);

  for (const sample of MODES[mode].samples) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    button.textContent = sample;
    button.addEventListener("click", () => {
      input.value = sample;
      convert();
      input.focus();
    });
    examples.append(button);
  }
}

function setMode(next) {
  if (!Object.hasOwn(MODES, next)) return;
  mode = next;

  for (const tab of tabs) {
    tab.setAttribute("aria-pressed", String(tab.dataset.mode === mode));
  }

  inputLabel.textContent = MODES[mode].inputLabel;
  longVowelControl.hidden = mode !== "romaji";
  note.textContent = MODES[mode].note;
  input.value = MODES[mode].samples[0];

  renderSamples();
  convert();
}

for (const tab of tabs) {
  tab.addEventListener("click", () => setMode(tab.dataset.mode));
}

input.addEventListener("input", convert);
longVowel.addEventListener("change", convert);

copyButton.addEventListener("click", async () => {
  const text = output.textContent;
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const helper = document.createElement("textarea");
    helper.value = text;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.append(helper);
    helper.select();
    document.execCommand("copy");
    helper.remove();
  }

  copyButton.textContent = "Copied";
  copyButton.classList.add("done");
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => {
    copyButton.textContent = "Copy";
    copyButton.classList.remove("done");
  }, 1200);
});

setMode("romaji");
