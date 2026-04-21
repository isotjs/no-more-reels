/**
 * No More Reels - Firefox Extension Popup Script
 * 
 * This script manages the extension's popup interface, including:
 * - UI state management and updates
 * - User interaction handling
 * - Storage operations with fallback mechanisms
 * - Communication with background and content scripts
 * - Internationalization support
 * - NEW: Threads button toggle functionality
 * - NEW: Debug mode toggle with localStorage persistence
 * - NEW: Interactive hidden item tags with click feedback
 * - NEW: Enhanced mobile-responsive design
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
 * Configuration constants for the popup
 * @type {Object}
 */
const CONFIG = {
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
    /** Storage key for debug mode state */
    STORAGE_KEY_DEBUG: 'debugModeEnabled',
    /** Local storage key for debug mode (for immediate access) */
    LOCAL_STORAGE_DEBUG: 'nmr_debug',
    /** Duration for status messages in milliseconds */
    MESSAGE_DURATION: 2000,
    /** Delay before closing popup after action in milliseconds */
    CLOSE_DELAY: 1000
};

/** Debug mode flag - set to false for production releases */
const DEBUG = false;

/**
 * Logs debug messages when DEBUG mode is enabled
 * @param {...any} args - Arguments to log
 */
function log(...args) {
    try {
        const runtimeDebug = (popupState && popupState.currentState && popupState.currentState.debugEnabled) === true;
        if (runtimeDebug || DEBUG) console.log('NoMoreReels Popup:', ...args);
    } catch (e) {
        if (DEBUG) console.log('NoMoreReels Popup:', ...args);
    }
}

/**
 * Logs error messages (always logged regardless of DEBUG mode)
 * @param {...any} args - Arguments to log
 */
function logError(...args) {
    console.error('NoMoreReels Popup:', ...args);
}

/**
 * Localizes HTML elements with data-i18n attributes
 * Replaces text content with localized messages from the extension
 */
function localizeHtmlPage() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const messageKey = element.getAttribute('data-i18n');
        if (messageKey) {
            element.textContent = browserAPI.i18n.getMessage(messageKey);
        }
    });
    
    // Update version text with localized extension name
    const versionElement = document.getElementById('versionText');
        if(versionElement) {
            const extName = browserAPI.i18n.getMessage("extensionName");
            versionElement.textContent = `v3.1 • ${extName}`;
        }
}

/**
 * Popup State Management Class
 * 
 * Handles all popup-related operations including:
 * - DOM element management
 * - UI state updates
 * - User interaction handling
 * - Storage operations
 * - Message communication
 */
class PopupState {
    /**
     * Creates a new PopupState instance
     */
    constructor() {
        /** Cached DOM elements for performance */
        this.elements = {};
        /** Flag indicating if elements have been initialized */
        this.isInitialized = false;
    }

    /**
     * Initializes and caches all required DOM elements
     * @returns {boolean} True if all elements were found, false otherwise
     */
    initializeElements() {
        const elementIds = ['toggleSwitch', 'grayscaleSwitch', 'statusText', 'hiddenItems', 'messageContainer'];
        
        for (const id of elementIds) {
            this.elements[id] = document.getElementById(id);
            if (!this.elements[id]) {
                logError(`Element not found: ${id}`);
                return false;
            }
        }
        
        // Optional element for threads switch
        this.elements.threadsSwitch = document.getElementById('threadsSwitch');
        
        // Hidden tags for reels and explore
        this.elements.reelsTag = document.getElementById('reelsTag');
        this.elements.exploreTag = document.getElementById('exploreTag');
        
        // Debug toggle button
        this.elements.debugToggle = document.getElementById('debugToggle');
        
        // Hidden tags for reels and explore (interactive elements)
        this.elements.reelsTag = document.getElementById('reelsTag');
        this.elements.exploreTag = document.getElementById('exploreTag');
        
        log('All popup elements initialized');
        this.isInitialized = true;
        return true;
    }

    /**
     * Sets up event listeners for user interactions
     * Attaches handlers to toggle switches
     */
    setupEventListeners() {
        if (!this.isInitialized) return;

        this.elements.toggleSwitch.addEventListener('change', (e) => this.handleToggleChange(e));
        this.elements.grayscaleSwitch.addEventListener('change', (e) => this.handleToggleChange(e));
        
        if (this.elements.threadsSwitch) {
            this.elements.threadsSwitch.addEventListener('change', (e) => this.handleToggleChange(e));
        }
        
        // Add click listeners for interactive hidden tags
        if (this.elements.reelsTag) {
            this.elements.reelsTag.addEventListener('click', () => this.handleTagClick('reels'));
        }
        
        if (this.elements.exploreTag) {
            this.elements.exploreTag.addEventListener('click', () => this.handleTagClick('explore'));
        }
        
        // Debug toggle event listener with localStorage persistence
        if (this.elements.debugToggle) {
            this.elements.debugToggle.addEventListener('click', () => this.handleDebugToggle());
        }
        
        log('Event listeners attached');
    }

    /**
     * Updates the UI to reflect the current extension state
     * @param {Object} state - Current extension state
     * @param {boolean} state.mainEnabled - Main functionality state
     * @param {boolean} state.grayscaleEnabled - Grayscale mode state
     * @param {boolean} state.threadsHidden - Threads button hiding state
     * @param {boolean} state.reelsHidden - Reels hiding state
     * @param {boolean} state.exploreHidden - Explore hiding state
     * @param {boolean} state.debugEnabled - Debug mode state (NEW)
     */
    updateUI(state) {
        if (!this.isInitialized) return;

        this.currentState = state;
        
        this.elements.toggleSwitch.checked = state.mainEnabled;
        this.elements.grayscaleSwitch.checked = state.grayscaleEnabled;
        if (this.elements.threadsSwitch) {
            this.elements.threadsSwitch.checked = state.threadsHidden;
        }
        
        this.updateStatus(state.mainEnabled);
        this.updateTagStates();
        this.updateDebugButton();
    }

    /**
     * Updates the status display based on extension state
     * @param {boolean} isEnabled - Whether the main functionality is enabled
     */
    updateStatus(isEnabled) {
        if (!this.elements.statusText) return;
        
        if (isEnabled) {
            this.elements.statusText.className = 'status-text status-active';
        } else {
            this.elements.statusText.className = 'status-text status-inactive';
        }
        
        // Hidden items should always be visible so users can control individual features
        this.elements.hiddenItems.style.display = 'block';
    }

    /**
     * Updates the visual state of interactive hidden item tags
     * Shows which items are currently being hidden with visual feedback
     * NEW: Enhanced visual states for better user experience
     */
    updateTagStates() {
        if (!this.currentState || !this.isInitialized) return;
        
        // Update reels tag state with visual feedback
        if (this.elements.reelsTag) {
            if (this.currentState.reelsHidden) {
                this.elements.reelsTag.classList.add('active');
            } else {
                this.elements.reelsTag.classList.remove('active');
            }
        }
        
        // Update explore tag state with visual feedback
        if (this.elements.exploreTag) {
            if (this.currentState.exploreHidden) {
                this.elements.exploreTag.classList.add('active');
            } else {
                this.elements.exploreTag.classList.remove('active');
            }
        }
    }

    /**
     * Updates the visual state of debug button
     * NEW: Visual feedback for debug mode state
     */
    updateDebugButton() {
        if (!this.currentState || !this.isInitialized || !this.elements.debugToggle) return;
        
        if (this.currentState.debugEnabled) {
            this.elements.debugToggle.classList.add('active');
            this.elements.debugToggle.setAttribute('aria-pressed', 'true');
            this.elements.debugToggle.setAttribute('title', 'Dev Tools: On');
            this.elements.debugToggle.setAttribute('aria-label', 'Dev Tools: On');
        } else {
            this.elements.debugToggle.classList.remove('active');
            this.elements.debugToggle.setAttribute('aria-pressed', 'false');
            this.elements.debugToggle.setAttribute('title', 'Dev Tools: Off');
            this.elements.debugToggle.setAttribute('aria-label', 'Dev Tools: Off');
        }
    }

    /**
     * Shows a temporary message to the user
     * @param {string} textKey - Message key for internationalization
     * @param {number} [duration=CONFIG.MESSAGE_DURATION] - Duration to show message in milliseconds
     */
    showMessage(textKey, duration = CONFIG.MESSAGE_DURATION) {
        if (!this.elements.messageContainer) return;
        
        this.elements.messageContainer.textContent = browserAPI.i18n.getMessage(textKey);
        this.elements.messageContainer.classList.add('show');
        
        setTimeout(() => {
            this.elements.messageContainer.classList.remove('show');
        }, duration);
    }

    /**
     * Handles toggle switch changes
     * Updates state, saves to storage, and communicates with content scripts
     * @param {Event} event - Change event from toggle switch
     */
    handleToggleChange(event) {
        // preserve existing debug flag when changing other settings
        const preservedDebug = this.currentState?.debugEnabled === true;
        const state = {
            mainEnabled: this.elements.toggleSwitch.checked,
            grayscaleEnabled: this.elements.grayscaleSwitch.checked,
            threadsHidden: this.elements.threadsSwitch ? this.elements.threadsSwitch.checked : false,
            reelsHidden: this.currentState?.reelsHidden ?? true,
            exploreHidden: this.currentState?.exploreHidden ?? true,
            debugEnabled: preservedDebug
        };
        
        log('Toggle changed to:', state);

    this.currentState = state;
        this.updateStatus(state.mainEnabled);
        this.updateTagStates();
        this.saveExtensionState(state);
        
        this.sendMessageToInstagramTabs({
            action: 'setState',
            state: state
        });
        
        this.showMessage('settingsUpdated');
    }

    /**
     * Handles clicks on interactive hidden item tags
     * Toggles individual hiding states for reels and explore
     * NEW: Enhanced user interaction with visual feedback
     * @param {string} type - Type of content ('reels' or 'explore')
     */
    handleTagClick(type) {
        if (!this.currentState) return;
        // preserve existing debug flag when toggling tags
        const preservedDebug = this.currentState?.debugEnabled === true;
        const newState = { ...this.currentState };
        
        if (type === 'reels') {
            newState.reelsHidden = !newState.reelsHidden;
        } else if (type === 'explore') {
            newState.exploreHidden = !newState.exploreHidden;
        }
        
    newState.debugEnabled = preservedDebug;
    this.currentState = newState;
        this.updateTagStates();
        this.saveExtensionState(newState);
        
        this.sendMessageToInstagramTabs({
            action: 'setState',
            state: newState
        });
        
        this.showMessage('settingsUpdated');
    }

    /**
     * Handles debug toggle button clicks
     * Toggles debug mode and updates content scripts
     * NEW: localStorage persistence for immediate debug state access
     */
    handleDebugToggle() {
        if (!this.currentState) return;
        
        const newState = { ...this.currentState };
        newState.debugEnabled = !newState.debugEnabled;
        
        this.currentState = newState;
        this.updateDebugButton();
        // Persist via background so storage sync and broadcasts are handled centrally
        try {
            // Update immediate-access local flag
            localStorage.setItem(CONFIG.LOCAL_STORAGE_DEBUG, newState.debugEnabled ? 'true' : 'false');
        } catch (e) {}

        browserAPI.runtime.sendMessage({ action: 'setDebugMode', debugEnabled: newState.debugEnabled })
            .then(response => {
                log('Background acknowledged debug toggle', response);
                // Also save the overall state so popup UI remains consistent
                this.saveExtensionState(newState);
            })
            .catch(err => {
                logError('Failed to send setDebugMode to background:', err);
                // Fallback: save locally and try to notify tabs directly
                this.saveExtensionState(newState);
                this.sendMessageToInstagramTabs({ action: 'setDebugMode', debugEnabled: newState.debugEnabled });
            });
        
        this.showMessage(newState.debugEnabled ? 'debugEnabled' : 'debugDisabled');
    }

    /**
     * Loads the current extension state from storage
     * Attempts sync storage first, falls back to local storage
     * @returns {Promise<void>}
     */
    async loadExtensionState() {
        log('Loading extension state...');
        
        if (!browserAPI?.storage) {
            logError('Browser storage API not available');
            this.updateUI({mainEnabled: true, grayscaleEnabled: false});
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
            log('Loaded settings from sync:', result);
            const state = {
                mainEnabled: result[CONFIG.STORAGE_KEY_MAIN] !== false,
                grayscaleEnabled: result[CONFIG.STORAGE_KEY_GRAYSCALE] === true,
                threadsHidden: result[CONFIG.STORAGE_KEY_THREADS] === true,
                reelsHidden: result[CONFIG.STORAGE_KEY_REELS] !== false,
                exploreHidden: result[CONFIG.STORAGE_KEY_EXPLORE] !== false,
                debugEnabled: result[CONFIG.STORAGE_KEY_DEBUG] === true
            };
            // persist immediate access flag for content scripts
            try { localStorage.setItem(CONFIG.LOCAL_STORAGE_DEBUG, state.debugEnabled ? 'true' : 'false'); } catch (e) {}
            this.updateUI(state);
        } catch (syncError) {
            log('Sync storage failed, trying local:', syncError);
            
            try {
                const result = await browserAPI.storage.local.get([
                    CONFIG.STORAGE_KEY_MAIN,
                    CONFIG.STORAGE_KEY_GRAYSCALE,
                    CONFIG.STORAGE_KEY_THREADS,
                    CONFIG.STORAGE_KEY_REELS,
                    CONFIG.STORAGE_KEY_EXPLORE,
                    CONFIG.STORAGE_KEY_DEBUG
                ]);
                log('Loaded settings from local:', result);
                const state = {
                    mainEnabled: result[CONFIG.STORAGE_KEY_MAIN] !== false,
                    grayscaleEnabled: result[CONFIG.STORAGE_KEY_GRAYSCALE] === true,
                    threadsHidden: result[CONFIG.STORAGE_KEY_THREADS] === true,
                    reelsHidden: result[CONFIG.STORAGE_KEY_REELS] !== false,
                    exploreHidden: result[CONFIG.STORAGE_KEY_EXPLORE] !== false,
                    debugEnabled: result[CONFIG.STORAGE_KEY_DEBUG] === true
                };
                try { localStorage.setItem(CONFIG.LOCAL_STORAGE_DEBUG, state.debugEnabled ? 'true' : 'false'); } catch (e) {}
                this.updateUI(state);
            } catch (localError) {
                logError('Both storage types failed:', localError);
                const defaultState = {mainEnabled: true, grayscaleEnabled: false, threadsHidden: false, reelsHidden: true, exploreHidden: true, debugEnabled: false};
                try { localStorage.setItem(CONFIG.LOCAL_STORAGE_DEBUG, 'false'); } catch (e) {}
                this.updateUI(defaultState); // Default to enabled
            }
        }
    }

    /**
     * Saves the extension state to storage
     * Attempts sync storage first, falls back to local storage
     * @param {Object} state - State object to save
     * @param {boolean} state.mainEnabled - Main functionality state
     * @param {boolean} state.grayscaleEnabled - Grayscale mode state
     * @returns {Promise<void>}
     */
    async saveExtensionState(state) {
        if (!browserAPI?.storage) {
            logError('Browser storage API not available');
            this.showMessage('Storage not available');
            return;
        }

        // Preserve debug flag unless explicitly specified
        const debugValue = (typeof state.debugEnabled !== 'undefined') ? (state.debugEnabled === true) : (this.currentState?.debugEnabled === true);

        const saveData = { 
            [CONFIG.STORAGE_KEY_MAIN]: state.mainEnabled,
            [CONFIG.STORAGE_KEY_GRAYSCALE]: state.grayscaleEnabled,
            [CONFIG.STORAGE_KEY_THREADS]: state.threadsHidden,
            [CONFIG.STORAGE_KEY_REELS]: state.reelsHidden,
            [CONFIG.STORAGE_KEY_EXPLORE]: state.exploreHidden,
            [CONFIG.STORAGE_KEY_DEBUG]: debugValue
        };
    // persist immediate debug flag for content scripts (use preserved debugValue)
    try { localStorage.setItem(CONFIG.LOCAL_STORAGE_DEBUG, debugValue ? 'true' : 'false'); } catch (e) {}
        
        try {
            await browserAPI.storage.sync.set(saveData);
            log('Settings saved to sync storage');
            
            // Backup to local storage
            try {
                await browserAPI.storage.local.set(saveData);
            } catch (error) {
                log('Local storage backup failed:', error);
            }
            
        } catch (syncError) {
            log('Sync storage failed, trying local:', syncError);
            
            try {
                await browserAPI.storage.local.set(saveData);
                log('Settings saved to local storage');
            } catch (localError) {
                logError('Both storage types failed:', localError);
                this.showMessage('Save failed - Please try again');
            }
        }
    }

    /**
     * Sends a message to all Instagram tabs
     * @param {Object} message - Message object to send
     * @param {string} message.action - Action to perform
     * @param {Object} [message.state] - State data to send
     */
    sendMessageToInstagramTabs(message) {
        if (!browserAPI?.tabs) {
            log('Browser tabs API not available');
            return;
        }

        browserAPI.tabs.query({url: "*://*.instagram.com/*"})
            .then(tabs => {
                log('Found Instagram tabs:', tabs.length);
                
                tabs.forEach(tab => {
                    browserAPI.tabs.sendMessage(tab.id, message)
                        .then(response => {
                            log('Message sent to tab:', tab.id, response);
                        })
                        .catch(error => {
                            log('Could not send message to tab:', tab.id, error.message);
                        });
                });
            })
            .catch(error => {
                logError('Error finding Instagram tabs:', error);
            });
    }
}

// Initialize the popup state manager
const popupState = new PopupState();

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    log('Popup DOM loaded');
    localizeHtmlPage();
    
    if (popupState.initializeElements()) {
        popupState.setupEventListeners();
        popupState.loadExtensionState();
    }
});

// Listen for storage changes to update UI
if (browserAPI?.storage) {
    browserAPI.storage.onChanged.addListener(function(changes, namespace) {
        if (namespace === 'sync') {
            popupState.loadExtensionState();
        }
    });
}

// Cleanup when popup closes
window.addEventListener('beforeunload', function() {
    log('Popup closing');
});
