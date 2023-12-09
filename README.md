# Browser Extension for FavRec

![Build / Lint](https://github.com/smallkirby/favrec-ext/actions/workflows/build-lint.yml/badge.svg)
![Nightly Release](https://github.com/smallkirby/favrec-ext/actions/workflows/nightly.yml/badge.svg)

Chrome extension for [FavRec](https://github.com/smallkirby/favrec).

## Development

```bash
# You have to run Firebase emulators beforehand
npm run ci
npr run build:chrome:dev
```

## Installation

Download nightly build from [Release Page](https://github.com/smallkirby/favrec-ext/releases/tag/nightly).
Then, drag and drop the downloaded `favrec-ext.chrome.zip` to your Chrome page `chrome://extensions`.

## Known Issues

- [Extension manifest V3 does not allow any popup and redirects](https://github.com/firebase/quickstart-js/issues/634). So login method is not straightforward.

---

Forked from [hiterm/web-ext-react-template](https://github.com/hiterm/web-ext-react-template)
