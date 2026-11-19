# Contributing to kana-kit

Thanks for taking a look! Issues and pull requests are welcome.

## Development

kana-kit has no runtime dependencies and no build step. You only need Node.js 20
or newer.

```sh
npm test
```

## Guidelines

- Keep the library dependency-free and usable without a bundler.
- Add a test for every behaviour change.
- Conversion stays **phonetic**. Please don't add dictionary or word-level rules;
  kana-kit is not a morphological analyzer.
- Keep the bundle small and the code readable. A focused patch is easier to
  review than a rewrite.
- Use [Conventional Commits](https://www.conventionalcommits.org/) for commit
  messages (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).

## Reporting a conversion bug

Please include:

1. the exact input,
2. the output you expected,
3. the output you got,
4. the function or CLI mode you used.

A small snippet like this is perfect:

```js
toRomaji("こんにちは"); // expected "konnichiha", got ...
```

Be kind. This project follows the spirit of the
[Contributor Covenant](https://www.contributor-covenant.org/).
