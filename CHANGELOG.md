# Changelog

All notable changes to this project are documented in this file. The format is
based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-11-19

### Added

- Hiragana ⇄ katakana conversion, with normalization of half-width katakana.
- Kana → Hepburn rōmaji conversion, including small tsu, syllabic n, long vowel
  marks, and common loanword digraphs.
- Rōmaji → hiragana conversion, including gemination, `n'`, and Kunrei aliases.
- `longVowel` and `wo` options for `toRomaji`.
- Command-line interface with stdin support.
- Browser playground in `demo/`.
- Test suite using Node's built-in test runner and a GitHub Actions CI workflow.
