# Development Guide

This guide describes how to run, debug, and modify the No More Reels browser extension in this repository.

## Scope

The project is a Firefox-first WebExtension that targets Instagram pages and hides distraction-oriented UI sections (Reels, Explore, optional Threads) while preserving normal browsing.

## Requirements

- Firefox (latest stable recommended)
- Git
- Basic JavaScript, HTML, and CSS knowledge
- Familiarity with WebExtensions APIs (`storage`, `tabs`, `runtime`)

## Local Setup

1. Clone the repository:

```bash
git clone https://github.com/isotjs/no-more-reels.git
cd no-more-reels
```

2. Load extension in Firefox:
   - Open `about:debugging`
   - Select **This Firefox**
   - Click **Load Temporary Add-on**
   - Choose `manifest.json`

3. Open Instagram in a tab and verify the popup is functional.

## Runtime Architecture

### `background.js`

Background coordinator responsible for:

- Loading and saving extension state
- Sync/local storage fallback
- Handling `runtime.onMessage` actions:
  - `getState`
  - `setState`
  - `setDebugMode`
- Broadcasting state to Instagram tabs

### `content.js`

Instagram page controller responsible for:

- Hiding Reels/Explore/Threads elements with selectors
- Blocking direct `/reels/` and `/explore/` page routes
- Applying grayscale mode
- Reacting to state updates from background/popup
- Re-running checks on DOM mutations and URL changes

### `popup.html` + `popup.js`

User control panel responsible for:

- Main enable/disable switch
- Reels/Explore tag toggles
- Grayscale and Threads toggles
- Debug toggle
- Localized UI text via `_locales/*/messages.json`

## State Model

The extension state is shared across popup/background/content:

```js
{
  mainEnabled: true,
  grayscaleEnabled: false,
  threadsHidden: false,
  reelsHidden: true,
  exploreHidden: true,
  debugEnabled: false
}
```

Storage keys used:

- `reelsExploreHiderEnabled`
- `grayscaleEnabled`
- `threadsButtonHidden`
- `reelsHidden`
- `exploreHidden`
- `debugModeEnabled`

Debug fast-access local key:

- `nmr_debug`

## Development Workflow

1. Create a branch.
2. Make focused changes.
3. Reload the extension in `about:debugging` after each change.
4. Test both desktop and mobile Instagram layouts.
5. Verify state persistence after browser restart.
6. Update docs in `README.md` and `Docs/` when behavior changes.

## Manual Test Checklist

- Popup opens and localizes text correctly.
- Main toggle hides/shows targeted content.
- Reels tag toggle works independently.
- Explore tag toggle works independently.
- Threads toggle hides/shows Threads entry.
- Grayscale toggle applies and removes page filter.
- Direct `/reels/` and `/explore/` routes show block page when enabled.
- Settings persist after reopening popup/browser.
- Debug toggle updates logs and propagates to open Instagram tabs.
- No uncaught errors in popup/background/content consoles.

## Debugging

### Where to inspect

- Popup: inspect popup window from extension debugging tools.
- Content script: Instagram tab devtools console.
- Background script: extension background page/service worker console.

### Common issues

- UI changed on Instagram: selectors in `content.js` need updates.
- State not reflected in tabs: check message flow and `tabs.query` host match.
- Storage mismatch: verify sync fallback to local in `background.js` and `popup.js`.

## Internationalization

- Locale files are in `_locales/<lang>/messages.json`.
- `manifest.json` uses `default_locale: "en"`.
- Popup and blocked-page text use `browser.i18n.getMessage`.

When adding a message key, add it to all supported locale files.

## Packaging Notes

- Ensure `manifest.json`, scripts, popup, locales, and icons are included.
- Validate manifest JSON before release.
- Keep version in `manifest.json` aligned with release notes in `Docs/CHANGELOG.md`.

## Related Docs

- Manifest reference: `Docs/MANIFEST_DOCUMENTATION.md`
- Changelog: `Docs/CHANGELOG.md`
- License summary: `Docs/LICENSE_SUMMARY.md`
