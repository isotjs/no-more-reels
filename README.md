# 🚫 No More Reels! - Firefox Extension

[![License: CC BY-NC-ND 4.0](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-nd/4.0/)

> Hide Instagram Reels & Explore for focused browsing.

**No More Reels!** is a Firefox extension designed to help you break free from endless scrolling by hiding Instagram's Reels and Explore sections. Focus on meaningful content and connections instead of getting lost in algorithmic feeds.

## ✨ Features

- **🎯 Smart Blocking**: Automatically hides Reels and Explore tabs from Instagram's navigation
- **🔒 Page Protection**: Blocks direct access to `/reels` and `/explore` pages with a friendly reminder
- **🎛️ Easy Toggle**: Simple on/off switch in the popup interface
- **📱 Mobile Support**: Works on both desktop and mobile Instagram layouts
- **⚡ Real-time**: Instantly applies changes as you browse Instagram
- **🔄 Persistent**: Remembers your preferences across browser sessions
- **🌐 Grayscale Mode**: Optional grayscale filter for reduced visual stimulation
- **🧵 Threads Button Hiding**: Hide the Threads button to reduce distractions
- **🐛 Debug Mode**: Developer-friendly debug toggle for troubleshooting
- **🏷️ Interactive Tags**: Clickable hidden item indicators with status feedback
- **🌍 Internationalization**: Supports multiple languages (EN, DE, FR, RU, TR)
- **🔒 Privacy-First**: No data collection, everything runs locally

## 🚀 Installation

### From Firefox Add-ons Store
1. Visit the [Firefox Add-ons store](https://addons.mozilla.org/en-GB/firefox/addon/no-more-reels/)
2. Click "Add to Firefox"
3. Confirm the installation

### Manual Installation (Development)
1. Clone or download this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" tab
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file from the project directory

**Note for Developers**: This extension uses Manifest V3 which requires an extension key. For development purposes, the browser will automatically generate a key when you load the extension. For production builds, you should add your own extension key to the manifest.json file.

#### Adding Extension Key (Optional for Development)
If you need a consistent extension ID for development:
1. Load the extension in Firefox/Chrome
2. Go to `about:debugging` (Firefox) or `chrome://extensions/` (Chrome)
3. Find your extension and copy the generated key
4. Add it to the `manifest.json` file as a `"key"` field

**Security Note**: For open source projects, it's recommended to not include the extension key in the repository to prevent others from publishing extensions with the same ID.

## 🎮 How to Use

1. **Install the extension** and visit [Instagram](https://instagram.com)
2. **Click the extension icon** in your browser toolbar to open the popup
3. **Toggle the switch** to enable/disable the extension
4. **Browse Instagram** without distractions from Reels and Explore

### What Gets Hidden

- ✅ Reels tab in navigation
- ✅ Explore tab in navigation  
- ✅ Direct links to Reels and Explore pages
- ✅ Reels suggestions in your feed
- ✅ Mobile navigation buttons
- ✅ Reels content in main feed
- ✅ Threads button (optional)
- ✅ Instagram content in grayscale (optional)

### Page Blocking

When you try to visit blocked pages directly, you'll see a friendly message with an option to return to your main Instagram feed.

## 🛠️ Development Setup

### Prerequisites
- Firefox browser
- Basic knowledge of JavaScript and browser extensions

### Project Structure
```
no-more-reels/
├── manifest.json          # Extension manifest (Manifest V3)
├── background.js          # Background service worker
├── content.js            # Content script for Instagram pages
├── popup.html            # Popup interface HTML
├── popup.js              # Popup interface logic
├── Assets/icon48.png            # New Extension icon (48x48)
├── Assets/icon96.png            # New Extension icon (96x96)
├── _locales/             # Internationalization files
│   ├── en/
│   ├── de/
│   ├── fr/
│   ├── ru/
│   └── tr/
└── README.md             # This file
```

### Key Components

#### Background Script (`background.js`)
- Manages extension state and persistence
- Handles communication between popup and content scripts
- Manages tab events and storage operations
- Provides cross-browser API abstraction
- **NEW**: Enhanced state management for threads button and debug mode

#### Content Script (`content.js`)
- Runs on Instagram pages
- Hides reels and explore content using CSS selectors
- Implements real-time content blocking with MutationObserver
- Handles page blocking for reels/explore URLs
- Applies grayscale mode when enabled
- **NEW**: Threads button hiding functionality
- **NEW**: Enhanced debug logging system

#### Popup Interface (`popup.html` + `popup.js`)
- Provides user interface for extension settings
- Handles user interactions and state management
- Implements internationalization support
- Communicates with background and content scripts
- **NEW**: Threads button toggle
- **NEW**: Debug mode toggle
- **NEW**: Interactive hidden item tags
- **NEW**: Enhanced UI with better mobile support

## 🔧 Technical Details

- **Manifest Version**: 3 (Modern Firefox/Chrome compatible)
- **Permissions**: Only requests access to Instagram domains and local storage
- **Privacy**: No data collection, everything runs locally
- **Performance**: Lightweight with minimal impact on browsing speed
- **Cross-Browser**: Works on both Firefox and Chrome
- **Storage**: Sync storage with local fallback
- **NEW**: Enhanced error handling and fallback mechanisms
- **NEW**: Debug mode for development and troubleshooting

### Architecture
- **Manifest V3**: Uses modern extension manifest format
- **Service Worker**: Background script runs as service worker
- **Content Scripts**: Injected into Instagram pages
- **Message Passing**: Communication between scripts via runtime messaging
- **Storage API**: Uses browser storage with sync/local fallback
- **NEW**: Improved state synchronization across components

### Content Blocking Strategy
1. **CSS Selectors**: Targets specific Instagram elements
2. **MutationObserver**: Watches for DOM changes
3. **URL Monitoring**: Detects page navigation
4. **Visibility API**: Handles tab switching
5. **NEW**: Enhanced selector targeting for threads button
6. **NEW**: Improved dynamic content detection

## 🌐 Supported Languages

- English (en)
- German (de)
- French (fr)
- Russian (ru)
- Turkish (tr)

**Contact with developer (@isotjs), if you want your language on extension!**

## 🔒 Privacy & Security

- **No Data Collection**: Extension doesn't collect or transmit user data
- **Local Processing**: All operations happen locally
- **Minimal Permissions**: Only requests necessary permissions
- **Open Source**: Code is transparent and auditable

### Privacy Policy

No More Reels! respects your privacy:

- ❌ **No data collection**: We don't collect, store, or transmit any personal data
- ❌ **No tracking**: No analytics or user behavior tracking
- ❌ **No external connections**: All functionality runs locally in your browser
- ✅ **Local storage only**: Settings are stored locally on your device

## 📝 Permissions

- `storage`: Save and retrieve extension settings
- `tabs`: Communicate with Instagram tabs
- `scripting`: Inject content scripts
- `host_permissions`: Access Instagram domains

## 🐛 Known Issues

- Haven't found one yet!

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report Issues**: Found a bug? [Open an issue](https://github.com/isotjs/no-more-reels/issues)
2. **Suggest Features**: Have an idea? We'd love to hear it
3. **Submit PRs**: Code contributions are always welcome

### Before Contributing
1. Check existing issues and pull requests
2. Discuss major changes in an issue first
3. Follow the coding standards in [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)
4. Test thoroughly before submitting

## 📄 License

This project is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License (CC BY-NC-ND 4.0).

**What this means:**
- ✅ **Share**: You can copy and redistribute the material
- ✅ **Attribution**: You must give appropriate credit and link to the license
- ❌ **Commercial Use**: You may not use the material for commercial purposes
- ❌ **Derivatives**: You may not remix, transform, or build upon the material

For full license details, see [LICENSE](LICENSE) file or visit [Creative Commons](https://creativecommons.org/licenses/by-nc-nd/4.0/).

## 📜 Changelog

-### v3.1 (Latest)
- **⚙️ Debug Toggle Button**: Debug button now includes an explicit on/off toggle for quick developer toggling
- **� Docs Consolidation**: Documentation merged and consolidated under `Docs/` for easier navigation
- **🖼️ Assets Consolidation**: Icons and assets merged into the `Assets/` folder for simplified packaging
- **🧪 Interactive UI**: Clickable hidden item tags with visual feedback
- **📱 Enhanced Mobile Support**: Improved touch interactions and responsive design
- **🔧 Better Error Handling**: Robust fallback mechanisms for storage operations
- **🌐 Improved i18n**: Enhanced internationalization with better message handling
- **⚡ Performance Optimizations**: Faster content detection and blocking
- **🎨 UI Improvements**: Modern dark theme with better visual hierarchy
- **🔍 Enhanced Selectors**: More comprehensive Instagram element targeting
- **📊 State Management**: Improved synchronization between popup and content scripts

### v1.0
- Initial release
- Hide Reels and Explore tabs
- Block direct page access

## 🙏 Acknowledgments

- **Developer**: [@isotjs](https://github.com/isotjs)
- Instagram for providing the platform
- Firefox team for the extension APIs
- Contributors and users for feedback and improvements
- Inspired by users who want more mindful social media consumption
- Built with ❤️ for digital wellbeing

## 📚 Guides

### For Users
- **[Quick Start Guide](DEVELOPMENT_GUIDE.md#-getting-started)**: Get up and running in minutes
- **[Troubleshooting](DEVELOPMENT_GUIDE.md#-debugging)**: Common issues and solutions
- **[Privacy & Security](README.md#-privacy--security)**: How we protect your data

### For Developers
- **[Development Setup](DEVELOPMENT_GUIDE.md#-getting-started)**: Complete development environment setup
- **[Architecture Overview](DEVELOPMENT_GUIDE.md#-project-architecture)**: Understanding the codebase
- **[Contributing Guidelines](DEVELOPMENT_GUIDE.md#-contributing)**: How to contribute to the project
- **[Coding Standards](DEVELOPMENT_GUIDE.md#-coding-standards)**: Code style and best practices

### Technical Documentation
- **[Manifest Documentation](MANIFEST_DOCUMENTATION.md)**: Detailed manifest.json explanation
- **[API Reference](DEVELOPMENT_GUIDE.md#-resources)**: Browser extension APIs used
- **[License Information](LICENSE_SUMMARY.md)**: Complete license details and terms

## 📞 Support

For issues, questions, or contributions:
- Create an issue on [GitHub](https://github.com/isotjs/no-more-reels)
- Contact the developer: [@isotjs](https://github.com/isotjs)
- Check the debugging section in [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)
- Review the technical documentation

---

**Note**: Instagram is a registered trademark of Facebook, Inc. This extension is not affiliated with or endorsed by Facebook, Inc.

*Take control of your Instagram experience. Your time and attention are valuable.* 🌟 