# Development Guide

This guide provides detailed information for developers who want to contribute to or modify the No More Reels Firefox extension.

## 🚀 Getting Started

### Prerequisites
- Firefox browser (latest version recommended)
- Basic knowledge of JavaScript, HTML, and CSS
- Understanding of browser extension APIs
- Git for version control

### Development Environment Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/isotjs/no-more-reels.git
   cd no-more-reels
   ```

2. **Load Extension in Firefox**
   - Open Firefox and navigate to `about:debugging`
   - Click "This Firefox" tab
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file from the project directory

3. **Enable Debug Mode**
   - **Method 1**: Use the debug toggle in the popup interface (recommended)
   - **Method 2**: Set `DEBUG = true` in the following files:
     - `background.js` (line 25)
     - `content.js` (line 35)
     - `popup.js` (line 25)

## 📁 Project Architecture

### File Structure
```
no-more-reels/
├── manifest.json              # Extension configuration
├── background.js              # Service worker (background script)
├── content.js                 # Content script for Instagram pages
├── popup.html                 # Popup interface HTML
├── popup.js                   # Popup interface logic
├── Assets/icon48.png                 # Extension icon (48x48)
├── Assets/icon96.png                 # Extension icon (96x96)
├── _locales/                  # Internationalization files
│   ├── en/messages.json       # English messages
│   ├── de/messages.json       # German messages
│   ├── fr/messages.json       # French messages
│   ├── ru/messages.json       # Russian messages
│   └── tr/messages.json       # Turkish messages
├── README.md                  # Project documentation
├── MANIFEST_DOCUMENTATION.md  # Manifest file documentation
└── DEVELOPMENT_GUIDE.md       # This file
```

### Component Overview

#### Background Script (`background.js`)
- **Purpose**: Manages extension state and coordinates between components
- **Key Responsibilities**:
  - State persistence and management
  - Communication hub between popup and content scripts
  - Tab event handling
  - Storage operations with fallback mechanisms
  - **NEW**: Threads button state management
  - **NEW**: Debug mode state synchronization
- **Key Classes**: `BackgroundManager`

#### Content Script (`content.js`)
- **Purpose**: Runs on Instagram pages to hide content
- **Key Responsibilities**:
  - DOM manipulation to hide reels and explore content
  - Real-time content blocking with MutationObserver
  - Page blocking for specific URLs
  - Grayscale mode application
  - **NEW**: Threads button hiding functionality
  - **NEW**: Enhanced debug logging system
  - **NEW**: Improved selector targeting
- **Key Classes**: `NoMoreReelsExtension`

#### Popup Interface (`popup.html` + `popup.js`)
- **Purpose**: User interface for extension settings
- **Key Responsibilities**:
  - User interaction handling
  - UI state management
  - Internationalization support
  - Communication with background script
  - **NEW**: Threads button toggle interface
  - **NEW**: Debug mode toggle
  - **NEW**: Interactive hidden item tags
  - **NEW**: Enhanced mobile-responsive design
- **Key Classes**: `PopupState`

## 🔧 Development Workflow

### Making Changes

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Edit the relevant files
   - Follow the coding standards below
   - Add appropriate documentation
   - **NEW**: Test debug mode functionality
   - **NEW**: Verify threads button hiding works correctly

3. **Test Your Changes**
   - Reload the extension in `about:debugging`
   - Test on different Instagram page types
   - Verify functionality in different browsers
   - Check for console errors
   - **NEW**: Test debug mode toggle
   - **NEW**: Test threads button hiding
   - **NEW**: Test interactive tag functionality

4. **Debug Issues**
   - Use browser developer tools
   - Check console logs (enable DEBUG mode via popup)
   - Monitor network requests and storage
   - **NEW**: Use debug mode for enhanced logging
   - **NEW**: Check localStorage for debug state

5. **Submit Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

### Testing Checklist

- [ ] Extension loads without errors
- [ ] Popup interface works correctly
- [ ] Content hiding works on Instagram pages
- [ ] Settings persist across browser sessions
- [ ] Internationalization works in different languages
- [ ] No console errors or warnings
- [ ] Cross-browser compatibility (Firefox/Chrome)
- [ ] **NEW**: Debug mode toggle works correctly
- [ ] **NEW**: Threads button hiding functions properly
- [ ] **NEW**: Interactive tags respond to clicks
- [ ] **NEW**: Mobile-responsive design works on different screen sizes

## 📝 Coding Standards

### JavaScript

#### JSDoc Documentation
All functions and classes must have JSDoc comments:

```javascript
/**
 * Brief description of the function
 * 
 * @param {string} param1 - Description of parameter
 * @param {number} [param2] - Optional parameter
 * @returns {Promise<boolean>} Description of return value
 * @throws {Error} Description of when error is thrown
 */
async function exampleFunction(param1, param2 = 0) {
    // Implementation
}
```

#### Class Documentation
```javascript
/**
 * Class description
 * 
 * Handles specific functionality including:
 * - Feature 1
 * - Feature 2
 * - Feature 3
 */
class ExampleClass {
    /**
     * Creates a new ExampleClass instance
     * @param {Object} config - Configuration object
     */
    constructor(config) {
        /** Configuration object */
        this.config = config;
    }
}
```

#### Error Handling
Always include proper error handling:

```javascript
try {
    const result = await someAsyncOperation();
    return result;
} catch (error) {
    logError('Operation failed:', error);
    // Provide fallback or re-throw as appropriate
    throw new Error('User-friendly error message');
}
```

#### Debug Mode Integration
When adding new functionality, integrate with the debug system:

```javascript
/**
 * Example function with debug integration
 * @param {string} message - Message to log
 */
function exampleWithDebug(message) {
    // Always log errors regardless of debug mode
    if (error) {
        logError('Error occurred:', error);
        return;
    }
    
    // Only log debug info when debug mode is enabled
    log('Debug info:', message);
    
    // Implementation
}
```

### HTML/CSS

#### Semantic HTML
Use semantic HTML elements and proper accessibility:

```html
<!-- Good -->
<button type="button" aria-label="Toggle extension">
    <span class="toggle-label">Enable</span>
</button>

<!-- Avoid -->
<div class="button" onclick="toggle()">Enable</div>
```

#### CSS Organization
- Use consistent naming conventions (BEM or similar)
- Group related styles together
- Include comments for complex selectors
- Use CSS custom properties for theming

### Internationalization

#### Message Keys
Use descriptive, hierarchical message keys:

```json
{
  "popupTitle": {
    "message": "No More Reels!",
    "description": "Title in the popup header"
  },
  "settingsUpdated": {
    "message": "✅ Settings updated!",
    "description": "Confirmation message after changing settings"
  }
}
```

#### Dynamic Content
Use placeholders for dynamic content:

```javascript
const message = browserAPI.i18n.getMessage("welcomeMessage", [username]);
```

## 🆕 New Features in v3.0

## 🆕 New Features in v3.1

### Debug Toggle Button
The popup's debug button now supports a dedicated on/off toggle which persists state and provides immediate localStorage access for content scripts. Use this to enable verbose logging during development and testing.

### Docs & Assets Consolidation
Documentation files and icon assets were consolidated under the `Docs/` and `Assets/` folders respectively to simplify packaging and contributor navigation.


### Threads Button Hiding
The extension now includes functionality to hide Instagram's Threads button:

```javascript
// In content.js - Threads button selectors
const THREADS_SELECTORS = [
    'a[href*="threads.net"]',
    'a[href*="threads.com"]',
    'div[role="button"][aria-label*="Threads"]',
    // ... more selectors
];

// Toggle threads button visibility
function handleThreadsButton() {
    if (state.threadsHidden) {
        applyStyles(SELECTORS.THREADS.BOTTOM_LEFT, 'none');
    }
}
```

### Debug Mode
A new debug mode system for development and troubleshooting:

```javascript
// Debug mode state management
function loadDebugFlag() {
    try {
        const stored = localStorage.getItem('nmr_debug');
        if (stored === 'true') DEBUG = true;
        if (stored === 'false') DEBUG = false;
    } catch (e) {}
}

// Enhanced logging
function log(...args) { 
    if (DEBUG) console.log('NoMoreReels Content:', ...args); 
}
```

### Interactive UI Elements
New interactive elements in the popup interface:

```javascript
// Interactive tag handling
handleTagClick(type) {
    const tag = this.elements[`${type}Tag`];
    if (tag) {
        tag.classList.toggle('active');
        this.showMessage(`${type}TagClicked`);
    }
}
```

### Enhanced State Management
Improved state synchronization across components:

```javascript
// Enhanced state object
this.currentState = {
    mainEnabled: CONFIG.DEFAULT_ENABLED,
    grayscaleEnabled: CONFIG.DEFAULT_GRAYSCALE,
    threadsHidden: CONFIG.DEFAULT_THREADS_HIDDEN,  // NEW
    reelsHidden: CONFIG.DEFAULT_REELS_HIDDEN,
    exploreHidden: CONFIG.DEFAULT_EXPLORE_HIDDEN
};
```

## 🔍 Debugging Guide

### Using Debug Mode
1. **Enable Debug Mode**: Click the debug toggle button in the popup
2. **Check Console**: Open browser developer tools and check console logs
3. **Monitor Storage**: Check localStorage for debug state
4. **Test Features**: Debug mode provides enhanced logging for all operations

### Common Debug Scenarios
- **Content not hiding**: Check selector targeting and debug logs
- **State not persisting**: Verify storage operations and fallback mechanisms
- **UI not updating**: Check popup-background communication
- **Performance issues**: Monitor MutationObserver and DOM operations

### Debug Tools
- **Console Logging**: Enhanced logging when debug mode is enabled
- **Storage Inspection**: Check browser storage for state consistency
- **Network Monitoring**: Verify no unnecessary network requests
- **Performance Profiling**: Monitor extension impact on page performance

## 📚 Resources

### Official Documentation
- [Firefox Extension Development](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Manifest V3 Documentation](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/manifest_version)
- [Content Scripts Guide](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Content_scripts)

### Tools
- [Firefox Add-on Debugger](https://extensionworkshop.com/documentation/develop/debugging/)
- [WebExtensions API Reference](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API)

### Best Practices
- [Extension Security Best Practices](https://extensionworkshop.com/documentation/develop/build-a-secure-extension/)
- [Performance Best Practices](https://extensionworkshop.com/documentation/develop/performance-best-practices/)

## 🤝 Contributing

**Important Note**: This project is licensed under CC BY-NC-ND 4.0, which means:
- You can share and use the code for non-commercial purposes
- You must provide attribution
- You cannot create derivative works (modifications) for distribution
- You cannot use it for commercial purposes

### Before Contributing
1. Check existing issues and pull requests
2. Discuss major changes in an issue first
3. Follow the coding standards above
4. Test thoroughly before submitting
5. Understand the license restrictions

### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Update documentation
6. Submit a pull request with detailed description

### Code Review
All contributions will be reviewed for:
- Code quality and standards
- Functionality and testing
- Documentation completeness
- Security considerations
- License compliance

---

**Note**: This guide is a living document. Please update it when making significant changes to the development process or architecture. 