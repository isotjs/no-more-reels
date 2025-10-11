# Manifest.json Documentation

This document explains the structure and configuration of the `manifest.json` file for the No More Reels Firefox extension.

## Overview

The manifest file uses **Manifest V3** format, which is the modern standard for browser extensions. It defines the extension's metadata, permissions, and behavior.

## File Structure

### Basic Information
```json
{
  "manifest_version": 3,                    // Manifest V3 format
  "name": "__MSG_extensionName__",          // Localized extension name
  "version": "2.0",                         // Extension version
  "description": "__MSG_extensionDescription__", // Localized description
  "homepage_url": "https://github.com/isotjs/no-more-reels", // Project URL
  "default_locale": "en"                    // Default language
}
```

### Permissions
```json
"permissions": [
  "storage",    // Access to browser storage API
  "tabs",       // Access to tabs API for communication
  "scripting"   // Ability to inject content scripts
]
```

### Host Permissions
```json
"host_permissions": [
  "*://*.instagram.com/*"  // Access to Instagram domains
]
```

### Content Scripts
```json
"content_scripts": [
  {
    "matches": ["*://*.instagram.com/*"],  // Run on Instagram pages
    "js": ["content.js"],                  // Script to inject
    "run_at": "document_start"             // Inject early
  }
]
```

### Action (Popup)
```json
"action": {
  "default_popup": "popup.html",           // Popup interface
  "default_title": "__MSG_extensionName__", // Tooltip text
  "default_icon": {                        // Extension icons
    "48": "Assets/icon48.png",
    "96": "Assets/icon96.png"
  }
}
```

### Icons
```json
  "icons": {
  "48": "Assets/icon48.png",    // 48x48 icon
  "96": "Assets/icon96.png"     // 96x96 icon
}
```

### Options UI
```json
"options_ui": {
  "page": "popup.html",     // Options page (same as popup)
  "open_in_tab": false      // Open as popup, not new tab
}
```

### Background Script
```json
"background": {
  "service_worker": "background.js"  // Service worker script
}
```

### Web Accessible Resources
```json
"web_accessible_resources": [
  {
    "resources": ["icon48.png", "icon96.png"],  // Resources to expose
    "matches": ["*://*.instagram.com/*"]        // Where they can be accessed
  }
]
```

## Key Features

### Internationalization
- Uses `__MSG_messageKey__` format for localized strings
- Messages are defined in `_locales/[language]/messages.json`
- Supports multiple languages: EN, DE, FR, RU, TR
- **NEW**: Enhanced message handling with better fallbacks

### Security
- Minimal permissions required
- Only accesses Instagram domains
- No external data collection
- **NEW**: Enhanced privacy protections and local-only operation

### Performance
- Content script runs at `document_start` for early blocking
- Service worker for background processing
- Efficient resource loading
- **NEW**: Optimized DOM queries and MutationObserver usage
- **NEW**: Improved memory management and performance monitoring

### NEW: Enhanced Functionality
- **Threads Button Hiding**: Comprehensive selector targeting for Threads elements
- **Debug Mode**: Developer-friendly debugging with localStorage persistence
- **Interactive UI**: Enhanced user interface with clickable elements
- **Mobile Optimization**: Better responsive design and touch interactions

## Development Notes

### Debugging
- Use `about:debugging` in Firefox to load temporary add-ons
- Check console logs in browser developer tools
- Monitor network requests and storage operations
- **NEW**: Use debug mode toggle in popup for enhanced logging
- **NEW**: Check localStorage for debug state persistence

### Testing
- Test on different Instagram page types
- Verify cross-browser compatibility
- Check internationalization in different languages
- **NEW**: Test threads button hiding functionality
- **NEW**: Verify debug mode works across all components
- **NEW**: Test interactive UI elements and mobile responsiveness

### Deployment
- Package as ZIP file for Firefox Add-ons store
- Ensure all referenced files are included
- Validate manifest syntax before submission

## Troubleshooting

### Common Issues
1. **Permission Denied**: Check host permissions match target URLs
2. **Script Not Loading**: Verify file paths and manifest syntax
3. **Storage Not Working**: Ensure storage permission is granted
4. **Popup Not Opening**: Check popup HTML file exists and is valid

### Validation
- Use Firefox's built-in manifest validator
- Check for syntax errors in JSON
- Verify all referenced files exist
- Test permissions and host permissions

## References

- [Firefox Extension Manifest Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json)
- [Manifest V3 Migration Guide](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/manifest_version)
- [Content Scripts Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts)

## Developer Information

- **Developer**: [@isotjs](https://github.com/isotjs)
- **Project Repository**: [No More Reels Extension](https://github.com/isotjs/no-more-reels)
- **License**: CC BY-NC-ND 4.0 