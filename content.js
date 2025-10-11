/**
 * No More Reels - Firefox Extension Content Script
 * 
 * This script runs on Instagram pages and handles:
 * - DOM manipulation to hide reels and explore content
 * - Real-time content blocking with MutationObserver
 * - Page blocking for reels/explore URLs
 * - Grayscale mode application
 * - Communication with background script
 * - NEW: Threads button hiding functionality
 * - NEW: Enhanced debug logging system with localStorage integration
 * - NEW: Improved selector targeting for dynamic content
 * 
 * @author isotjs (@isotjs)
 * @version 3.1
 * @since 2025
 */

(function() {
    'use strict';

    /**
     * Cross-browser API abstraction layer
     * Provides unified access to browser APIs for both Firefox and Chrome
     * @type {Object|null}
     */
    const browserAPI = (() => {
        if (typeof browser !== 'undefined') return browser; // Firefox
        if (typeof chrome !== 'undefined') return chrome; // Chrome
        return null;
    })();

    /**
     * Configuration constants for the content script
     * @type {Object}
     */
    const CONFIG = {
        /** Storage key for main functionality state */
        STORAGE_KEY_MAIN: 'reelsExploreHiderEnabled',
        /** Storage key for grayscale mode state */
        STORAGE_KEY_GRAYSCALE: 'grayscaleEnabled',
        /** Default state for main functionality */
        DEFAULT_ENABLED: true,
        /** Timeout configurations for various operations */
        TIMEOUTS: {
            /** Initial hide delay after page load */
            INITIAL_HIDE: 100,
            /** Delayed hide for dynamic content */
            DELAYED_HIDE: 500,
            /** Observer delay for DOM changes */
            OBSERVER_DELAY: 50,
            /** Navigation hide delay */
            NAVIGATION_HIDE: 100,
            /** Visibility change hide delay */
            VISIBILITY_HIDE: 200,
            /** Page change hide delay */
            PAGE_CHANGE_HIDE: 500,
            /** Fixed element hide delay */
            FIXED_ELEMENT_DELAY: 750
        },
        /** Instagram URL paths to block */
        PATHS: {
            /** Reels page path */
            REELS: '/reels/',
            /** Explore page path */
            EXPLORE: '/explore/'
        }
    };

    /** Debug mode flag - set to false for production releases */
    let DEBUG = false;

    /**
     * Loads debug flag from localStorage for immediate access
     * NEW: Allows content script to access debug state without waiting for background
     */
    function loadDebugFlag() {
        try {
            const stored = localStorage.getItem('nmr_debug');
            if (stored === 'true') DEBUG = true;
            if (stored === 'false') DEBUG = false;
        } catch (e) {
            logError('Failed to load debug flag from localStorage:', e);
        }
    }
    loadDebugFlag();

    /**
     * Logs debug messages when DEBUG mode is enabled
     * NEW: Enhanced logging system with better error handling
     * @param {...any} args - Arguments to log
     */
    function log(...args) { 
        if (DEBUG) console.log('NoMoreReels Content:', ...args); 
    }

    /**
     * CSS selectors for targeting Instagram elements
     * @type {Object}
     */
    const SELECTORS = {
        /** Navigation-related selectors */
        NAVIGATION: {
            /** Reels navigation links */
            REELS: ['nav a[href="/reels/"]', 'nav a[href*="/reels/"]'],
            /** Explore navigation links */
            EXPLORE: ['nav a[href="/explore/"]', 'nav a[href*="/explore/"]'],
            /** Mobile tab navigation */
            MOBILE_TABS: ['div[role="tablist"] a[href="/reels/"]', 'div[role="tablist"] a[href="/explore/"]'],
            /** Fixed bottom navigation */
            FIXED_BOTTOM_NAV: 'div[style*="position: fixed"][style*="bottom: 0px"]'
        },
        /** General link selectors (excluding menu items) */
        LINKS: ['a[href*="/reels/"]:not([role="menuitem"])', 'a[href*="/explore/"]:not([role="menuitem"])'],
        /** Content-related selectors */
        CONTENT: {
            /** Reels suggestions in main content */
            REELS_SUGGESTIONS: 'main section:has(h2):has(a[href*="/reels/"])',
            /** Individual reel elements */
            REEL_ELEMENTS: ['article[data-testid*="reel"]', 'div[data-testid*="reel-item"]']
        },
        /** Threads button selectors */
        THREADS: {
            /** Threads button in bottom left corner */
            BOTTOM_LEFT: [
                'a[href*="threads.net"]',
                'a[href*="threads.com"]',
                'div[role="button"][aria-label*="Threads"]',
                'div[role="button"][aria-label*="threads"]',
                'a[aria-label*="Threads"]',
                'a[aria-label*="threads"]',
                'div[data-testid*="threads"]',
                'a[data-testid*="threads"]'
            ]
        }
    };

    /** Combined array of all selectors for bulk operations */
    const ALL_SELECTORS = [
        ...SELECTORS.NAVIGATION.REELS,
        ...SELECTORS.NAVIGATION.EXPLORE,
        ...SELECTORS.NAVIGATION.MOBILE_TABS,
        ...SELECTORS.LINKS,
        SELECTORS.CONTENT.REELS_SUGGESTIONS,
        ...SELECTORS.CONTENT.REEL_ELEMENTS,
        ...SELECTORS.THREADS.BOTTOM_LEFT
    ];

    /**
     * Generates the HTML template for the block message
     * @returns {string} HTML string for the block message
     */
    const getBlockMessageTemplate = () => `
        <div class="nmr-block-message">
            <div class="nmr-block-content">
                <h1>${browserAPI.i18n.getMessage("blockedPageTitle") || '🚫 This Page is Blocked'}</h1>
                <p>${browserAPI.i18n.getMessage("blockedPageSubtitle") || 'This page has been hidden by the extension.'}</p>
                <p>${browserAPI.i18n.getMessage("blockedPagePrompt") || 'Return to the homepage.'}</p>
                <a href="https://www.instagram.com/" class="nmr-back-button">${browserAPI.i18n.getMessage("blockedPageButton") || 'Return to Homepage'}</a>
            </div>
        </div>
        <style>
            .nmr-block-message { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(20, 20, 20, 0.98); display: flex; align-items: center; justify-content: center; z-index: 999999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; backdrop-filter: blur(10px); }
            .nmr-block-content { background: #1a1a1a; padding: 40px; border-radius: 16px; text-align: center; color: white; max-width: 450px; box-shadow: 0 8px 32px rgba(0,0,0,0.7); border: 1px solid rgba(255,255,255,0.1); }
            .nmr-block-content h1 { font-size: 28px; margin-bottom: 16px; font-weight: 700; }
            .nmr-block-content p { margin-bottom: 16px; color: #a8a8a8; line-height: 1.5; font-size: 16px; }
            .nmr-back-button { display: inline-block; background: #3b82f6; color: white !important; text-decoration: none !important; padding: 12px 24px; border-radius: 12px; font-weight: 600; font-size: 16px; transition: all 0.3s ease; }
            .nmr-back-button:hover { background: #2563eb; }
        </style>
    `;

    /**
     * Main extension class for content script functionality
     * Handles all DOM manipulation and content blocking operations
     */
    class NoMoreReelsExtension {
        /**
         * Creates a new NoMoreReelsExtension instance
         */
        constructor() {
            /** Current extension state */
            this.state = { mainEnabled: true, grayscaleEnabled: false, threadsHidden: false, reelsHidden: true, exploreHidden: true };
            /** Reference to the block message element */
            this.blockElement = null;
            /** MutationObserver instance for watching DOM changes */
            this.observerInstance = null;
            /** Current page URL for change detection */
            this.currentUrl = location.href;
            /** URL change observer */
            this.urlObserver = null;
            log('Extension initialized');
        }

        /**
         * Initializes the extension
         * Loads state, sets up event listeners, and starts observers
         * @returns {Promise<void>}
         */
        async initialize() {
            log('Starting initialization...');
            await this.loadInitialState();
            this.setupEventListeners();
            this.startUrlObserver();
            setTimeout(() => this.runAllChecks(), CONFIG.TIMEOUTS.PAGE_CHANGE_HIDE);
        }

        /**
         * Loads initial state from the background script
         * @returns {Promise<void>}
         */
        async loadInitialState() {
            log('Requesting initial state from background script...');
            try {
                const response = await browserAPI.runtime.sendMessage({ action: 'getState' });
                if (response && response.success) {
                    log('Received initial state:', response.state);
                    this.setState(response.state);
                } else {
                    log('Failed to get state from background, using defaults.');
                    this.setState({ mainEnabled: true, grayscaleEnabled: false });
                }
            } catch (e) {
                console.error("NoMoreReels: Failed to request state from background", e);
                this.setState({ mainEnabled: true, grayscaleEnabled: false });
            }
        }

        /**
         * Updates the extension state and triggers UI updates
         * @param {Object} newState - New state object
         * @param {boolean} newState.mainEnabled - Main functionality state
         * @param {boolean} newState.grayscaleEnabled - Grayscale mode state
         */
        setState(newState) {
            this.state = newState;
            this.runAllChecks();
        }

        /**
         * Runs all content checking and hiding operations
         * Applies current state to the page
         */
        runAllChecks() {
            log('Running all checks with state:', this.state);
            
            if (this.state.mainEnabled) {
                log('Main toggle is ON - applying individual features');
                // Main toggle is on - apply individual feature states
                this.handleReelsAndExplore();
                this.handleThreadsButton();
                this.checkAndBlockPage();
                this.startObserver();
            } else {
                log('Main toggle is OFF - showing everything');
                // Main toggle is off - show everything
                this.applyStyles(ALL_SELECTORS, '');
                this.removeBlockMessage();
                this.stopObserver();
            }

            // Apply grayscale filter to entire page
            document.documentElement.style.filter = this.state.grayscaleEnabled ? 'grayscale(100%)' : '';

            this.unfixBottomNav();
        }

        /**
         * Applies display styles to elements matching selectors
         * @param {string[]} selectors - Array of CSS selectors
         * @param {string} displayValue - CSS display value to apply
         */
        applyStyles(selectors, displayValue) {
            selectors.forEach(selector => {
                document.querySelectorAll(selector).forEach(el => {
                    el.style.display = displayValue;
                });
            });
        }

        /**
         * Shows the block message overlay for blocked pages
         */
        showBlockMessage() {
            if (this.blockElement) return;
            this.blockElement = document.createElement('div');
            this.blockElement.innerHTML = getBlockMessageTemplate();
            document.body.appendChild(this.blockElement);
            document.body.style.overflow = 'hidden';
            log('Block message shown');
        }

        /**
         * Removes the block message overlay
         */
        removeBlockMessage() {
            if (this.blockElement) {
                this.blockElement.remove();
                this.blockElement = null;
                document.body.style.overflow = '';
                log('Block message removed');
            }
        }

        /**
         * Checks if current page should be blocked and shows/hides block message
         */
        checkAndBlockPage() {
            const currentPath = window.location.pathname;
            const isReelsPage = currentPath.startsWith(CONFIG.PATHS.REELS);
            const isExplorePage = currentPath.startsWith(CONFIG.PATHS.EXPLORE);
            
            // Only block if the specific feature is hidden
            if ((isReelsPage && this.state.reelsHidden) || (isExplorePage && this.state.exploreHidden)) {
                this.showBlockMessage();
            } else {
                this.removeBlockMessage();
            }
        }

        /**
         * Handles Reels and Explore visibility based on individual states
         */
        handleReelsAndExplore() {
            log('Handling Reels and Explore - reelsHidden:', this.state.reelsHidden, 'exploreHidden:', this.state.exploreHidden);
            
            // Handle Reels
            if (this.state.reelsHidden) {
                log('Hiding Reels elements');
                this.applyStyles([...SELECTORS.NAVIGATION.REELS, ...SELECTORS.NAVIGATION.MOBILE_TABS.filter(s => s.includes('/reels/')), ...SELECTORS.CONTENT.REEL_ELEMENTS], 'none');
            } else {
                log('Showing Reels elements');
                this.applyStyles([...SELECTORS.NAVIGATION.REELS, ...SELECTORS.NAVIGATION.MOBILE_TABS.filter(s => s.includes('/reels/')), ...SELECTORS.CONTENT.REEL_ELEMENTS], '');
            }
            
            // Handle Explore
            if (this.state.exploreHidden) {
                log('Hiding Explore elements');
                this.applyStyles([...SELECTORS.NAVIGATION.EXPLORE, ...SELECTORS.NAVIGATION.MOBILE_TABS.filter(s => s.includes('/explore/'))], 'none');
            } else {
                log('Showing Explore elements');
                this.applyStyles([...SELECTORS.NAVIGATION.EXPLORE, ...SELECTORS.NAVIGATION.MOBILE_TABS.filter(s => s.includes('/explore/'))], '');
            }
            
            // Handle general links
            const linksToHide = [];
            if (this.state.reelsHidden) {
                linksToHide.push(...SELECTORS.LINKS.filter(s => s.includes('/reels/')));
            }
            if (this.state.exploreHidden) {
                linksToHide.push(...SELECTORS.LINKS.filter(s => s.includes('/explore/')));
            }
            
            // First show all links, then hide specific ones
            this.applyStyles(SELECTORS.LINKS, '');
            if (linksToHide.length > 0) {
                log('Hiding links:', linksToHide);
                this.applyStyles(linksToHide, 'none');
            }
        }

        /**
         * Handles Threads button visibility based on state
         */
        handleThreadsButton() {
            if (this.state.threadsHidden) {
                this.applyStyles(SELECTORS.THREADS.BOTTOM_LEFT, 'none');
            } else {
                this.applyStyles(SELECTORS.THREADS.BOTTOM_LEFT, '');
            }
        }

        /**
         * Unfixes bottom navigation to prevent layout issues
         */
        unfixBottomNav() {
            const navElement = document.querySelector(SELECTORS.NAVIGATION.FIXED_BOTTOM_NAV);
            if (navElement) {
                navElement.style.position = 'relative';
            }
        }

        /**
         * Starts the MutationObserver to watch for DOM changes
         */
        startObserver() {
            if (this.observerInstance) return;
            this.observerInstance = new MutationObserver(() => {
                this.runAllChecks();
            });
            this.observerInstance.observe(document.body, { childList: true, subtree: true });
        }

        /**
         * Stops the MutationObserver
         */
        stopObserver() {
            if (this.observerInstance) {
                this.observerInstance.disconnect();
                this.observerInstance = null;
            }
        }

        /**
         * Starts URL change observer for SPA navigation
         */
        startUrlObserver() {
            if (this.urlObserver) return;
            const debouncedCheck = (() => {
                let timeout;
                return () => {
                    clearTimeout(timeout);
                    timeout = setTimeout(() => {
                        if (location.href !== this.currentUrl) {
                            this.currentUrl = location.href;
                            log('URL changed to:', this.currentUrl);
                            this.runAllChecks();
                        }
                    }, 100);
                };
            })();
            this.urlObserver = new MutationObserver(debouncedCheck);
            this.urlObserver.observe(document.body, { childList: true, subtree: true });
        }

        /**
         * Sets up event listeners for message handling and visibility changes
         */
        setupEventListeners() {
            // Listen for messages from background script
            browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
                if (request.action === 'setState') {
                    this.setState(request.state);
                    sendResponse({ success: true });
                }
                // Debug modunu popup'tan güncelle
                if (request.action === 'setDebugMode') {
                    DEBUG = !!request.debugEnabled;
                    try { localStorage.setItem('nmr_debug', DEBUG ? 'true' : 'false'); } catch (e) {}
                    log('Debug mode set to', DEBUG);
                    sendResponse({ success: true });
                }
                return true;
            });
            
            // Re-run checks when page becomes visible (tab switching)
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) {
                    this.runAllChecks();
                }
            });
        }
    }

    // Initialize the extension when the script loads
    const extension = new NoMoreReelsExtension();
    extension.initialize();

})();