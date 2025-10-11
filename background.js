/**
 * No More Reels - Firefox Extension Background Script
 * 
 * This script manages the extension's background processes, including:
 * - State management and persistence
 * - Communication between popup and content scripts
 * - Tab event handling for Instagram pages
 * - Storage operations with fallback mechanisms
 * - NEW: Enhanced state management for threads button hiding
 * - NEW: Debug mode state synchronization across components
 * - NEW: Improved error handling and fallback mechanisms
 * 
 * @author isotjs (@isotjs)
 * @version 3.1
 * @since 2025
 */

/**
 * Cross-browser API abstraction layer
 * Provides unified access to browser APIs for both Firefox and Chrome
 * @type {Object|null}
 */
const browserAPI = (() => {
    if (typeof browser !== 'undefined') {
        return browser; // Firefox
    } else if (typeof chrome !== 'undefined') {
        return chrome; // Chrome
    }
    return null;
})();

/**
 * Configuration constants for the extension
 * @type {Object}
 */
const CONFIG = {
    /** Default state for main functionality */
    DEFAULT_ENABLED: true,
    /** Default state for grayscale mode */
    DEFAULT_GRAYSCALE: false,
    /** Default state for threads button hiding */
    DEFAULT_THREADS_HIDDEN: false,
    /** Default state for reels hiding */
    DEFAULT_REELS_HIDDEN: true,
    /** Default state for explore hiding */
    DEFAULT_EXPLORE_HIDDEN: true,
    /** Default debug mode state */
    DEFAULT_DEBUG: false,
    /** Storage key for debug mode state */
    STORAGE_KEY_DEBUG: 'debugModeEnabled',
    /** Storage key for main functionality state */
    STORAGE_KEY_MAIN: 'reelsExploreHiderEnabled',
    /** Storage key for grayscale mode state */
    STORAGE_KEY_GRAYSCALE: 'grayscaleEnabled',
    /** Storage key for threads button hiding state */
    STORAGE_KEY_THREADS: 'threadsButtonHidden',
    /** Storage key for reels hiding state */
    STORAGE_KEY_REELS: 'reelsHidden',
    /** Storage key for explore hiding state */
    STORAGE_KEY_EXPLORE: 'exploreHidden',
    /** URL pattern for Instagram domains */
    INSTAGRAM_URL_PATTERN: '*://*.instagram.com/*'
};

/** Debug mode flag - set to false for production releases */
const DEBUG = false;

/**
 * Logs debug messages when DEBUG mode is enabled
 * @param {...any} args - Arguments to log
 */
function log(...args) {
    try {
        const runtimeDebug = (typeof backgroundManager !== 'undefined' && backgroundManager.currentState && backgroundManager.currentState.debugEnabled) === true;
        if (runtimeDebug || DEBUG) {
            console.log('NoMoreReels Background:', ...args);
        }
    } catch (e) {
        if (DEBUG) console.log('NoMoreReels Background:', ...args);
    }
}

/**
 * Logs error messages (always logged regardless of DEBUG mode)
 * @param {...any} args - Arguments to log
 */
function logError(...args) {
    console.error('NoMoreReels Background:', ...args);
}

/**
 * Background Manager Class
 * 
 * Handles all background operations including:
 * - Extension state management
 * - Storage operations with sync/local fallback
 * - Event listener setup and management
 * - Communication with content scripts
 * - Tab update handling
 */
class BackgroundManager {
    /**
     * Creates a new BackgroundManager instance
     */
    constructor() {
        /** Flag indicating if the manager has been initialized */
        this.isInitialized = false;
        
        /** Current extension state */
        this.currentState = {
            /** Main functionality enabled/disabled */
            mainEnabled: CONFIG.DEFAULT_ENABLED,
            /** Grayscale mode enabled/disabled */
            grayscaleEnabled: CONFIG.DEFAULT_GRAYSCALE,
            /** Threads button hidden/shown */
            threadsHidden: CONFIG.DEFAULT_THREADS_HIDDEN,
            /** Reels hidden/shown */
            reelsHidden: CONFIG.DEFAULT_REELS_HIDDEN,
            /** Explore hidden/shown */
            exploreHidden: CONFIG.DEFAULT_EXPLORE_HIDDEN,
            /** Debug mode enabled/disabled (NEW) */
            debugEnabled: false
        };
    }

    /**
     * Initializes the background manager
     * Loads stored state and sets up event listeners
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this.isInitialized) return;
        
        log('Background script initializing...');
        
        try {
            await this.loadStoredState();
            this.setupEventListeners();
            this.isInitialized = true;
            log('Background script initialized successfully');
        } catch (error) {
            logError('Failed to initialize background script:', error);
        }
    }

    /**
     * Loads the extension state from browser storage
     * Attempts sync storage first, falls back to local storage
     * @returns {Promise<void>}
     */
    async loadStoredState() {
        if (!browserAPI?.storage) {
            log('Storage API not available, using defaults');
            return;
        }

        try {
            const result = await browserAPI.storage.sync.get([
                CONFIG.STORAGE_KEY_MAIN, 
                CONFIG.STORAGE_KEY_GRAYSCALE,
                CONFIG.STORAGE_KEY_THREADS,
                CONFIG.STORAGE_KEY_REELS,
                CONFIG.STORAGE_KEY_EXPLORE,
                CONFIG.STORAGE_KEY_DEBUG
            ]);
            
            this.currentState = {
                mainEnabled: result[CONFIG.STORAGE_KEY_MAIN] !== false,
                grayscaleEnabled: result[CONFIG.STORAGE_KEY_GRAYSCALE] === true,
                threadsHidden: result[CONFIG.STORAGE_KEY_THREADS] === true,
                reelsHidden: result[CONFIG.STORAGE_KEY_REELS] !== false,
                exploreHidden: result[CONFIG.STORAGE_KEY_EXPLORE] !== false,
                debugEnabled: result[CONFIG.STORAGE_KEY_DEBUG] === true
            };
            
            log('Loaded state from storage:', this.currentState);
        } catch (syncError) {
            log('Sync storage failed, trying local storage:', syncError);
            
            try {
                const result = await browserAPI.storage.local.get([
                    CONFIG.STORAGE_KEY_MAIN, 
                    CONFIG.STORAGE_KEY_GRAYSCALE,
                    CONFIG.STORAGE_KEY_THREADS,
                    CONFIG.STORAGE_KEY_REELS,
                    CONFIG.STORAGE_KEY_EXPLORE,
                    CONFIG.STORAGE_KEY_DEBUG
                ]);
                
                this.currentState = {
                    mainEnabled: result[CONFIG.STORAGE_KEY_MAIN] !== false,
                    grayscaleEnabled: result[CONFIG.STORAGE_KEY_GRAYSCALE] === true,
                    threadsHidden: result[CONFIG.STORAGE_KEY_THREADS] === true,
                    reelsHidden: result[CONFIG.STORAGE_KEY_REELS] !== false,
                    exploreHidden: result[CONFIG.STORAGE_KEY_EXPLORE] !== false,
                    debugEnabled: result[CONFIG.STORAGE_KEY_DEBUG] === true
                };
                
                log('Loaded state from local storage:', this.currentState);
            } catch (localError) {
                logError('Both storage types failed, using defaults:', localError);
            }
        }
    }

    /**
     * Sets up all necessary event listeners for the extension
     * Includes install, tab updates, storage changes, and message handling
     */
    setupEventListeners() {
        if (browserAPI?.runtime?.onInstalled) {
            browserAPI.runtime.onInstalled.addListener(this.handleInstall.bind(this));
        }

        if (browserAPI?.tabs?.onUpdated) {
            browserAPI.tabs.onUpdated.addListener(this.handleTabUpdate.bind(this));
        }

        if (browserAPI?.storage?.onChanged) {
            browserAPI.storage.onChanged.addListener(this.handleStorageChange.bind(this));
        }

        if (browserAPI?.runtime?.onMessage) {
            browserAPI.runtime.onMessage.addListener(this.handleMessage.bind(this));
        }

        log('Event listeners set up');
    }

    /**
     * Handles extension installation and update events
     * @param {Object} details - Installation details from browser API
     * @param {string} details.reason - Reason for the event ('install', 'update', etc.)
     * @returns {Promise<void>}
     */
    async handleInstall(details) {
        log('Extension installed/updated:', details.reason);
        
        if (details.reason === 'install') {
            await this.initializeDefaultSettings();
            log('Default settings initialized for new installation');
        } else if (details.reason === 'update') {
            log('Extension updated, maintaining existing settings');
        }
    }

    /**
     * Initializes default settings for new installations
     * Saves default values to storage
     * @returns {Promise<void>}
     */
    async initializeDefaultSettings() {
        if (!browserAPI?.storage) return;

        const defaultSettings = {
            [CONFIG.STORAGE_KEY_MAIN]: CONFIG.DEFAULT_ENABLED,
            [CONFIG.STORAGE_KEY_GRAYSCALE]: CONFIG.DEFAULT_GRAYSCALE,
            [CONFIG.STORAGE_KEY_THREADS]: CONFIG.DEFAULT_THREADS_HIDDEN,
            [CONFIG.STORAGE_KEY_REELS]: CONFIG.DEFAULT_REELS_HIDDEN,
            [CONFIG.STORAGE_KEY_EXPLORE]: CONFIG.DEFAULT_EXPLORE_HIDDEN,
            [CONFIG.STORAGE_KEY_DEBUG]: CONFIG.DEFAULT_DEBUG
        };

        try {
            await browserAPI.storage.sync.set(defaultSettings);
            log('Default settings saved to sync storage');
        } catch (error) {
            log('Sync storage failed, using local storage:', error);
            try {
                await browserAPI.storage.local.set(defaultSettings);
                log('Default settings saved to local storage');
            } catch (localError) {
                logError('Failed to save default settings:', localError);
            }
        }
    }

    /**
     * Handles tab update events
     * Sends current state to Instagram tabs when they load
     * @param {number} tabId - ID of the updated tab
     * @param {Object} changeInfo - Information about the change
     * @param {string} changeInfo.status - Status of the tab ('complete', 'loading', etc.)
     * @param {Object} tab - Tab object containing URL and other information
     */
    handleTabUpdate(tabId, changeInfo, tab) {
        if (changeInfo.status === 'complete' && 
            tab.url && 
            tab.url.includes('instagram.com')) {
            
            log('Instagram tab updated:', tab.url);
            
            this.sendStateToTab(tabId);
        }
    }

    /**
     * Handles storage change events
     * Updates internal state and broadcasts changes to content scripts
     * @param {Object} changes - Object containing changed storage items
     * @param {string} namespace - Storage namespace ('sync' or 'local')
     */
    handleStorageChange(changes, namespace) {
        log('Storage changed:', changes, 'in', namespace);
        
        let stateChanged = false;
        const newState = { ...this.currentState };

        if (changes[CONFIG.STORAGE_KEY_MAIN]) {
            newState.mainEnabled = changes[CONFIG.STORAGE_KEY_MAIN].newValue !== false;
            stateChanged = true;
        }

        if (changes[CONFIG.STORAGE_KEY_GRAYSCALE]) {
            newState.grayscaleEnabled = changes[CONFIG.STORAGE_KEY_GRAYSCALE].newValue === true;
            stateChanged = true;
        }

        if (changes[CONFIG.STORAGE_KEY_THREADS]) {
            newState.threadsHidden = changes[CONFIG.STORAGE_KEY_THREADS].newValue === true;
            stateChanged = true;
        }

        if (changes[CONFIG.STORAGE_KEY_REELS]) {
            newState.reelsHidden = changes[CONFIG.STORAGE_KEY_REELS].newValue !== false;
            stateChanged = true;
        }

        if (changes[CONFIG.STORAGE_KEY_EXPLORE]) {
            newState.exploreHidden = changes[CONFIG.STORAGE_KEY_EXPLORE].newValue !== false;
            stateChanged = true;
        }
        if (changes[CONFIG.STORAGE_KEY_DEBUG]) {
            newState.debugEnabled = changes[CONFIG.STORAGE_KEY_DEBUG].newValue === true;
            stateChanged = true;
        }
        
        if(stateChanged){
            this.currentState = newState;
            log('Updated current state:', this.currentState);
            this.broadcastStateToInstagramTabs();
        }
    }

    /**
     * Handles messages from popup and content scripts
     * @param {Object} request - Message request object
     * @param {string} request.action - Action to perform ('getState', 'setState')
     * @param {Object} [request.state] - New state object (for setState action)
     * @param {Object} sender - Information about the message sender
     * @param {Function} sendResponse - Function to send response back
     * @returns {boolean} True if response will be sent asynchronously
     */
    handleMessage(request, sender, sendResponse) {
        log('Received message:', request, 'from:', sender.tab?.url || 'popup');
        
        switch (request.action) {
            case 'getState':
                sendResponse({
                    success: true,
                    state: this.currentState
                });
                break;
                
            case 'setState':
                if (request.state) {
                    this.saveState(request.state);
                    sendResponse({ success: true });
                } else {
                    sendResponse({ success: false, error: 'Invalid state' });
                }
                break;

            case 'setDebugMode':
                if (typeof request.debugEnabled !== 'undefined') {
                    const newState = { ...this.currentState, debugEnabled: !!request.debugEnabled };
                    this.saveState(newState);
                    // immediately broadcast state (including debug) to tabs
                    this.broadcastStateToInstagramTabs();
                    sendResponse({ success: true });
                } else {
                    sendResponse({ success: false, error: 'Invalid debug value' });
                }
                break;
                
            default:
                sendResponse({ success: false, error: 'Unknown action' });
        }
        
        return true; 
    }

    /**
     * Saves the current state to browser storage
     * Attempts sync storage first, falls back to local storage
     * @param {Object} state - State object to save
     * @param {boolean} state.mainEnabled - Main functionality state
     * @param {boolean} state.grayscaleEnabled - Grayscale mode state
     * @returns {Promise<void>}
     */
    async saveState(state) {
        if (!browserAPI?.storage) return;

        // Preserve current debugEnabled unless explicitly provided
        const debugValue = (typeof state.debugEnabled !== 'undefined') ? (state.debugEnabled === true) : (this.currentState?.debugEnabled === true);

        const saveData = {
            [CONFIG.STORAGE_KEY_MAIN]: state.mainEnabled,
            [CONFIG.STORAGE_KEY_GRAYSCALE]: state.grayscaleEnabled,
            [CONFIG.STORAGE_KEY_THREADS]: state.threadsHidden,
            [CONFIG.STORAGE_KEY_REELS]: state.reelsHidden,
            [CONFIG.STORAGE_KEY_EXPLORE]: state.exploreHidden,
            [CONFIG.STORAGE_KEY_DEBUG]: debugValue
        };

        try {
            await browserAPI.storage.sync.set(saveData);
            log('State saved to sync storage');
            
            // Backup to local storage
            try {
                await browserAPI.storage.local.set(saveData);
            } catch (error) {
                log('Local storage backup failed:', error);
            }
        } catch (syncError) {
            log('Sync storage failed, using local storage:', syncError);
            try {
                await browserAPI.storage.local.set(saveData);
                log('State saved to local storage');
            } catch (localError) {
                logError('Failed to save state:', localError);
            }
        }
    }

    /**
     * Sends current state to a specific tab
     * @param {number} tabId - ID of the target tab
     * @returns {Promise<void>}
     */
    async sendStateToTab(tabId) {
        if (!browserAPI?.tabs) return;

        try {
            await browserAPI.tabs.sendMessage(tabId, {
                action: 'setState',
                state: this.currentState
            });
            log('State sent to tab:', tabId);
        } catch (error) {
            log('Could not send state to tab:', tabId, error.message);
        }
    }

    /**
     * Broadcasts current state to all Instagram tabs
     * Used when settings change to update all open Instagram pages
     * @returns {Promise<void>}
     */
    async broadcastStateToInstagramTabs() {
        if (!browserAPI?.tabs) return;

        try {
            const tabs = await browserAPI.tabs.query({
                url: CONFIG.INSTAGRAM_URL_PATTERN
            });
            
            log('Broadcasting state to', tabs.length, 'Instagram tabs');
            
            const promises = tabs.map(tab => 
                this.sendStateToTab(tab.id).catch(error => {
                    log('Failed to send to tab:', tab.id, error.message);
                })
            );
            
            await Promise.all(promises);
        } catch (error) {
            logError('Failed to broadcast state:', error);
        }
    }
}

// Initialize the background manager instance
const backgroundManager = new BackgroundManager();

// Handle browser startup events (Firefox specific)
if (browserAPI?.runtime?.onStartup) {
    browserAPI.runtime.onStartup.addListener(() => {
        log('Extension startup');
        backgroundManager.initialize();
    });
}

// Initialize the background manager immediately
backgroundManager.initialize();

// Chrome-specific heartbeat to keep service worker alive
if (typeof chrome !== 'undefined' && chrome.runtime.onMessage) {
    setInterval(() => {
        if (DEBUG) {
            log('Background script heartbeat');
        }
    }, 25000); // 25 seconds
}

log('Background script loaded');