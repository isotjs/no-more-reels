# Changelog

All notable changes to the "No More Reels!" Firefox extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [3.1] - 2025-10-11

### 🆕 Added
- **Debug Toggle Button**: The debug button in the popup now includes an explicit on/off toggle for quick developer toggling
- **Merged Documentation**: All documentation files under `Docs/` were consolidated and referenced together for clarity
- **Merged Assets**: Icons and assets consolidated in the `Assets/` folder for simplified packaging

### 🔧 Enhanced
- **Popup UX**: Minor improvements to popup version display and debug feedback

### 📚 Documentation
- **Docs Consolidation**: Noted in changelog that Docs folder now contains consolidated guides and manifest documentation


## [3.0] - 2025-07-11

### 🆕 Added
- **Threads Button Hiding**: New toggle to hide Instagram's Threads button
- **Debug Mode System**: Developer-friendly debugging capabilities
- **Interactive Hidden Item Tags**: Enhanced user interface
- **Enhanced Mobile Support**: Better responsive design
- **Improved Error Handling**: More robust fallback mechanisms

### 🔧 Enhanced
- **State Management**: Improved synchronization across components
- **Content Blocking**: More comprehensive Instagram element targeting
- **User Interface**: Modern dark-themed design improvements
- **Internationalization**: Enhanced multi-language support

### 🐛 Fixed
- **Storage Issues**: Resolved storage operation failures
- **Performance Issues**: Optimized extension performance
- **UI Responsiveness**: Fixed UI update issues

### 📚 Documentation
- **Comprehensive Guides**: Enhanced developer documentation
- **User Documentation**: Better user guides

### 🔒 Security & Privacy
- **Enhanced Privacy**: Improved privacy protections

## [2.0] - 2025-05-29

### 🆕 Added
- **Grayscale Mode**: Optional grayscale filter for reduced visual stimulation
- **Enhanced UI**: Modern dark-themed popup interface
- **Internationalization**: Support for 5 languages (EN, DE, FR, RU, TR)
- **Cross-Browser Compatibility**: Full Firefox and Chrome support
- **Professional Documentation**: Comprehensive guides and documentation

### 🔧 Enhanced
- **Manifest V3**: Upgraded to modern extension manifest format
- **Performance**: Better content blocking with MutationObserver
- **Storage**: Sync storage with local fallback
- **Error Handling**: Improved fallback mechanisms

### 🐛 Fixed
- **Content Detection**: More reliable Instagram element targeting
- **State Persistence**: Better storage operation reliability
- **UI Updates**: Improved popup-background communication

### 📚 Documentation
- **Development Guide**: Comprehensive developer documentation
- **Manifest Documentation**: Detailed manifest.json explanation
- **User Guides**: Enhanced installation and usage instructions
  - Comprehensive selector targeting for Threads button elements
  - State persistence across browser sessions
  - Real-time application when toggled
- **Debug Mode System**: Developer-friendly debugging capabilities
  - Toggle debug mode via popup interface
  - localStorage persistence for immediate access
  - Enhanced logging across all components
  - Visual feedback for debug state
- **Interactive Hidden Item Tags**: Enhanced user interface
  - Clickable tags for Reels and Explore items
  - Visual feedback showing current hiding state
  - Individual toggle functionality for each content type
  - Improved user experience with immediate feedback
- **Enhanced Mobile Support**: Better responsive design
  - Improved touch interactions
  - Better mobile layout and spacing
  - Touch-optimized button sizes and interactions
  - High DPI display support
- **Improved Error Handling**: More robust fallback mechanisms
  - Better storage operation error handling
  - Enhanced cross-browser compatibility
  - Graceful degradation when APIs are unavailable
  - Comprehensive error logging

### 🔧 Enhanced
- **State Management**: Improved synchronization across components
  - Better state persistence with sync/local fallback
  - Enhanced communication between popup and content scripts
  - More reliable state updates across tabs
  - Improved state validation and error recovery
- **Content Blocking**: More comprehensive Instagram element targeting
  - Enhanced selector coverage for dynamic content
  - Better MutationObserver implementation
  - Improved performance with optimized DOM queries
  - More reliable content detection and hiding
- **User Interface**: Modern dark-themed design improvements
  - Better visual hierarchy and spacing
  - Enhanced accessibility features
  - Improved color contrast and readability
  - Better visual feedback for user interactions
- **Internationalization**: Enhanced multi-language support
  - Better message handling and fallbacks
  - Improved localization coverage
  - Enhanced error message localization
  - Better support for right-to-left languages

### 🐛 Fixed
- **Storage Issues**: Resolved storage operation failures
  - Fixed sync storage fallback to local storage
  - Improved error handling for storage operations
  - Better state recovery after storage failures
  - Enhanced storage validation
- **Performance Issues**: Optimized extension performance
  - Reduced DOM query frequency
  - Better MutationObserver efficiency
  - Improved memory usage
  - Faster content detection and hiding
- **UI Responsiveness**: Fixed UI update issues
  - Better popup-background communication
  - Improved state synchronization
  - Enhanced error recovery in UI updates
  - Better handling of rapid state changes

### 📚 Documentation
- **Comprehensive Guides**: Enhanced developer documentation
  - Updated README.md with new features
  - Enhanced DEVELOPMENT_GUIDE.md with debugging information
  - Added new feature documentation
  - Improved code comments and JSDoc
- **User Documentation**: Better user guides
  - Updated feature descriptions
  - Enhanced installation instructions
  - Better troubleshooting guides
  - Improved accessibility documentation

### 🔒 Security & Privacy
- **Enhanced Privacy**: Improved privacy protections
  - No changes to privacy model (still no data collection)
  - Enhanced local-only operation
  - Better permission usage documentation
  - Improved security practices

## [1.0] - 2025-05-28

### 🆕 Added
- Initial release of No More Reels! extension
- Basic Reels and Explore hiding functionality
- Simple toggle interface
- Page blocking for direct access to reels/explore URLs
- Cross-browser compatibility (Firefox and Chrome)
- Basic internationalization support
- Storage persistence for user preferences

### 🔧 Features
- **Content Hiding**: Hide Instagram Reels and Explore tabs
- **Page Blocking**: Block direct access to reels and explore pages
- **Toggle Interface**: Simple on/off switch in popup
- **Persistent Settings**: Remember user preferences across sessions
- **Mobile Support**: Work on both desktop and mobile Instagram layouts
- **Real-time Updates**: Instantly apply changes as you browse

---

## Version History Summary

| Version | Release Date | Key Features |
|---------|--------------|--------------|
| 3.1 | 2025-10-11 | Debug toggle, Docs & Assets consolidation, minor popup UX tweaks |
| 3.0 | 2025-07-11 | Threads hiding, Debug mode, Interactive UI, Enhanced mobile support |
| 2.0 | 2025-05-29 | Manifest V3 upgrade, grayscale mode, enhanced UI |
| 1.0 | 2025-05-28 | Initial release with basic Reels/Explore hiding |

## Contributing

When contributing to this project, please update this changelog with your changes following the format above. Include:

- **Added** for new features
- **Changed** for changes in existing functionality
- **Deprecated** for soon-to-be removed features
- **Removed** for now removed features
- **Fixed** for any bug fixes
- **Security** in case of vulnerabilities

## Notes

- All dates are in YYYY-MM-DD format
- Features are categorized by type and impact
- Breaking changes are clearly marked
- Security updates are prioritized in documentation 