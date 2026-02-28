# Manifest Documentation

This document explains the current `manifest.json` used by No More Reels.

## Current Snapshot

Key metadata from `manifest.json`:

- `manifest_version`: `3`
- `name`: `__MSG_extensionName__`
- `version`: `3.1`
- `description`: `__MSG_extensionDescription__`
- `default_locale`: `en`
- `homepage_url`: `https://github.com/isotjs/no-more-reels`

Firefox-specific extension ID:

```json
"browser_specific_settings": {
  "gecko": {
    "id": "{0a8749fa-2007-435e-bc3a-6dd582ca56b0}"
  }
}
```

## Permissions

```json
"permissions": [
  "storage",
  "tabs",
  "scripting"
]
```

Purpose:

- `storage`: Save feature state and user preferences
- `tabs`: Send state updates to open Instagram tabs
- `scripting`: Extension scripting capability in MV3 context

## Host Permissions

```json
"host_permissions": [
  "*://*.instagram.com/*"
]
```

The extension only targets Instagram domains.

## Content Scripts

```json
"content_scripts": [
  {
    "matches": ["*://*.instagram.com/*"],
    "js": ["content.js"],
    "run_at": "document_start"
  }
]
```

`content.js` starts early so hiding logic can run before most UI becomes visible.

## Popup and Icons

```json
"action": {
  "default_popup": "popup.html",
  "default_title": "__MSG_extensionName__",
  "default_icon": {
    "48": "Assets/icon48.png",
    "96": "Assets/icon96.png"
  }
}
```

Global extension icons:

```json
"icons": {
  "48": "Assets/icon48.png",
  "96": "Assets/icon96.png"
}
```

## Options UI

```json
"options_ui": {
  "page": "popup.html",
  "open_in_tab": false
}
```

The popup UI is reused as options UI.

## Background

Current background declaration:

```json
"background": {
  "scripts": ["background.js"]
}
```

The codebase includes background initialization logic and tab/state broadcasting in `background.js`.

## Web Accessible Resources

```json
"web_accessible_resources": [
  {
    "resources": [
      "Assets/icon48.png",
      "Assets/icon96.png"
    ],
    "matches": ["*://*.instagram.com/*"]
  }
]
```

## Localization

The manifest uses `__MSG_*__` keys and `default_locale` for localized metadata.

Supported locale folders currently include:

- `_locales/en`
- `_locales/de`
- `_locales/fr`
- `_locales/ru`
- `_locales/tr`

## Maintenance Checklist

When updating `manifest.json`:

1. Keep permission scope minimal.
2. Keep host scope limited to required domains.
3. Ensure all referenced files exist in repository paths.
4. Keep `version` in sync with `Docs/CHANGELOG.md`.
5. Verify localization keys exist for manifest name/description.

## References

- MDN manifest docs: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json
- MDN content scripts: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts
