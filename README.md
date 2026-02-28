# No More Reels! - Firefox Extension

[![License: CC BY-NC-ND 4.0](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-nd/4.0/)

Hide Instagram Reels and Explore so you can use Instagram with fewer distractions.

## What It Does

No More Reels! removes common attention traps from Instagram while keeping the rest of the app usable.

- Hides Reels and Explore navigation entries
- Blocks direct visits to `/reels/` and `/explore/` with a redirect prompt
- Supports desktop and mobile Instagram layouts
- Includes optional grayscale mode
- Includes optional Threads button hiding
- Provides an optional debug toggle for development and troubleshooting
- Stores preferences locally via browser extension storage
- Supports English, German, French, Russian, and Turkish

## Installation

### Firefox Add-ons Store

1. Open the [Firefox Add-ons page](https://addons.mozilla.org/en-GB/firefox/addon/no-more-reels/)
2. Click **Add to Firefox**
3. Confirm installation

### Local Development Install

1. Clone this repository
2. Open Firefox and go to `about:debugging`
3. Select **This Firefox**
4. Click **Load Temporary Add-on**
5. Choose `manifest.json` from this project

## Usage

1. Open Instagram
2. Click the extension icon
3. Toggle features in the popup

Available controls in the popup:

- Main enable/disable switch
- Grayscale mode switch
- Hide Threads button switch
- Reels and Explore hidden-item tags
- Debug mode toggle

When blocked URLs are opened directly, the extension shows a local block page with a return button to Instagram home.

## For Developers

### Architecture at a Glance

- `content.js`: Applies DOM hiding, page blocking, observers, and runtime updates on Instagram pages
- `background.js`: Manages persisted state, extension messaging, and tab update propagation
- `popup.html` + `popup.js`: Renders controls, localizes UI text, and updates state
- `_locales/*/messages.json`: Localization dictionaries
- `manifest.json`: Permissions, scripts, host access, icons, and metadata

### Permission Summary

From `manifest.json`:

- `storage`: Persist extension settings
- `tabs`: Notify and sync state with Instagram tabs
- `scripting`: Script coordination support
- `host_permissions` on `*://*.instagram.com/*`: Limit content access to Instagram domains

### Project Structure

```text
no-more-reels/
|- manifest.json
|- background.js
|- content.js
|- popup.html
|- popup.js
|- Assets/
|  |- icon48.png
|  `- icon96.png
|- _locales/
|  |- en/messages.json
|  |- de/messages.json
|  |- fr/messages.json
|  |- ru/messages.json
|  `- tr/messages.json
|- Docs/
|  |- CHANGELOG.md
|  |- DEVELOPMENT_GUIDE.md
|  |- LICENSE_SUMMARY.md
|  `- MANIFEST_DOCUMENTATION.md
`- README.md
```

## Compatibility

- Manifest Version: 3
- Primary target: Firefox WebExtensions
- Browser API abstraction is included for Firefox/Chrome compatibility paths in source

## Privacy

- No analytics
- No external telemetry
- No user data collection
- Settings are stored in browser extension storage

## Internationalization

Current locale folders:

- `en`
- `de`
- `fr`
- `ru`
- `tr`

If you want to help add another language, open an issue.

## Contributing

1. Open an issue for bugs or proposals: [GitHub Issues](https://github.com/isotjs/no-more-reels/issues)
2. For development workflow and standards, read [Docs/DEVELOPMENT_GUIDE.md](Docs/DEVELOPMENT_GUIDE.md)
3. Keep pull requests focused and tested against Instagram desktop/mobile flows

## Documentation

- Developer guide: [Docs/DEVELOPMENT_GUIDE.md](Docs/DEVELOPMENT_GUIDE.md)
- Manifest details: [Docs/MANIFEST_DOCUMENTATION.md](Docs/MANIFEST_DOCUMENTATION.md)
- Change history: [Docs/CHANGELOG.md](Docs/CHANGELOG.md)
- License summary: [Docs/LICENSE_SUMMARY.md](Docs/LICENSE_SUMMARY.md)

## License

This project is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International license.

- Full text: [LICENSE](LICENSE)
- Human-readable summary: [Docs/LICENSE_SUMMARY.md](Docs/LICENSE_SUMMARY.md)
- Official page: [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/)

## Support

- Repository: [github.com/isotjs/no-more-reels](https://github.com/isotjs/no-more-reels)
- Issues and feedback: [GitHub Issues](https://github.com/isotjs/no-more-reels/issues)
- Developer: [@isotjs](https://github.com/isotjs)

Instagram is a registered trademark of Meta Platforms, Inc. This project is independent and is not affiliated with or endorsed by Instagram/Meta.
