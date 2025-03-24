/*
* Portfolio Website - Theme Manager
* Author: nicknet06
* Version: 1.0
* Last Update: 2025-03-22 21:53:18
*/

// Self-executing function to keep variables scoped
(function() {
    'use strict';

    // Available theme options
    const themeOptions = {
        modes: ['light', 'dark', 'contrast'],
        colorSchemes: ['default', 'midnight', 'sunset', 'forest']
    };

    // Default theme settings
    const defaultTheme = {
        mode: 'light',
        colorScheme: 'default'
    };

    // Current theme settings
    let currentTheme = { ...defaultTheme };

    // Theme panel elements
    let themePanel;
    let themePanelToggle;
    let themeOptionElements = {};
    let themeToggles = {};
    
    // Theme indicators
    let lightIcon;
    let darkIcon;
    let modeToggler;

    // Custom event for theme changes
    const themeChangeEvent = new CustomEvent('themechange', {
        detail: { 
            theme: currentTheme 
        },
        bubbles: true
    });

    // Initialize the theme manager
    function initThemeManager() {
        // Get DOM elements
        cacheElements();
        
        // Load saved theme or detect system preference
        loadThemePreferences();
        
        // Setup event listeners
        setupEventListeners();
        
        // Listen for system preference changes
        setupSystemPreferenceListeners();
        
        // Set up theme panel
        setupThemePanel();
        
        // Log initialization
        console.log('Theme Manager initialized - User: nicknet06 - 2025-03-22 21:53:18');
    }

    // Cache DOM elements
    function cacheElements() {
        // Theme toggle elements
        lightIcon = document.querySelector('.light-icon');
        darkIcon = document.querySelector('.dark-icon');
        modeToggler = document.querySelector('.mode-switcher');
        
        // Theme panel elements
        themePanel = document.querySelector('.theme-panel');
        themePanelToggle = document.querySelector('.theme-panel-toggle');
        
        // Theme options
        document.querySelectorAll('.theme-option').forEach(option => {
            if (option.hasAttribute('data-theme-mode')) {
                const mode = option.getAttribute('data-theme-mode');
                themeOptionElements[`mode-${mode}`] = option;
            } else if (option.hasAttribute('data-color-scheme')) {
                const scheme = option.getAttribute('data-color-scheme');
                themeOptionElements[`scheme-${scheme}`] = option;
            }
        });
        
        // Feature toggles
        themeToggles = {
            particles: document.getElementById('particles-toggle'),
            cardEffects: document.getElementById('card-effects-toggle'),
            cursor: document.getElementById('cursor-toggle')
        };
    }

    // Load theme preferences from local storage or system preferences
    function loadThemePreferences() {
        // Get stored theme mode
        const savedThemeMode = localStorage.getItem('theme-mode');
        if (savedThemeMode && themeOptions.modes.includes(savedThemeMode)) {
            currentTheme.mode = savedThemeMode;
        } else {
            // Check system preference
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                currentTheme.mode = 'dark';
            }
        }
        
        // Get stored color scheme
        const savedColorScheme = localStorage.getItem('color-scheme');
        if (savedColorScheme && themeOptions.colorSchemes.includes(savedColorScheme)) {
            currentTheme.colorScheme = savedColorScheme;
        }
        
        // Apply saved theme
        applyTheme(currentTheme.mode, currentTheme.colorScheme);
        
        // Load feature preferences
        loadFeaturePreferences();
    }

    // Load feature toggle preferences
    function loadFeaturePreferences() {
        // Particles feature
        const particlesPreference = localStorage.getItem('particles');
        if (themeToggles.particles) {
            themeToggles.particles.checked = particlesPreference !== 'disabled';
            toggleFeature('particles', particlesPreference !== 'disabled');
        }
        
        // Card effects feature
        const cardEffectsPreference = localStorage.getItem('card-effects');
        if (themeToggles.cardEffects) {
            themeToggles.cardEffects.checked = cardEffectsPreference !== 'disabled';
            toggleFeature('card-effects', cardEffectsPreference !== 'disabled');
        }
        
        // Custom cursor feature
        const cursorPreference = localStorage.getItem('custom-cursor');
        if (themeToggles.cursor) {
            themeToggles.cursor.checked = cursorPreference !== 'disabled';
            toggleFeature('custom-cursor', cursorPreference !== 'disabled');
        }
    }

    // Set up event listeners
    function setupEventListeners() {
        // Mode toggle click
        if (modeToggler) {
            modeToggler.addEventListener('click', toggleThemeMode);
        }
        
        // Feature toggles
        if (themeToggles.particles) {
            themeToggles.particles.addEventListener('change', function() {
                toggleFeature('particles', this.checked);
            });
        }
        
        if (themeToggles.cardEffects) {
            themeToggles.cardEffects.addEventListener('change', function() {
                toggleFeature('card-effects', this.checked);
            });
        }
        
        if (themeToggles.cursor) {
            themeToggles.cursor.addEventListener('change', function() {
                toggleFeature('custom-cursor', this.checked);
            });
        }
    }

    // Set up system preference listeners
    function setupSystemPreferenceListeners() {
        // Listen for system color scheme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            // Only update if user hasn't explicitly set a preference
            if (!localStorage.getItem('theme-mode')) {
                const newMode = e.matches ? 'dark' : 'light';
                applyTheme(newMode, currentTheme.colorScheme);
            }
        });
        
        // Listen for reduced motion preference
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function(e) {
            // Update CSS animations based on preference
            document.body.classList.toggle('reduced-motion', e.matches);
        });
    }

    // Set up theme panel
    function setupThemePanel() {
        if (!themePanel || !themePanelToggle) return;
        
        // Toggle panel open/close
        themePanelToggle.addEventListener('click', function() {
            themePanel.classList.toggle('open');
        });
        
        // Close panel when clicking outside
        document.addEventListener('click', function(e) {
            if (themePanel.classList.contains('open') && 
                !themePanel.contains(e.target) && 
                !themePanelToggle.contains(e.target)) {
                themePanel.classList.remove('open');
            }
        });
        
        // Theme option clicks
        Object.values(themeOptionElements).forEach(option => {
            option.addEventListener('click', function() {
                // Handle theme mode change
                if (this.hasAttribute('data-theme-mode')) {
                    const mode = this.getAttribute('data-theme-mode');
                    changeThemeMode(mode);
                } 
                // Handle color scheme change
                else if (this.hasAttribute('data-color-scheme')) {
                    const scheme = this.getAttribute('data-color-scheme');
                    changeColorScheme(scheme);
                }
                
                // Update active state in the UI
                updateThemePanelUI();
            });
        });
        
        // Update UI to match current settings
        updateThemePanelUI();
    }

    // Toggle between light and dark theme modes
    function toggleThemeMode() {
        const newMode = currentTheme.mode === 'dark' ? 'light' : 'dark';
        changeThemeMode(newMode);
    }

    // Change theme mode
    function changeThemeMode(mode) {
        if (!themeOptions.modes.includes(mode)) return;
        
        currentTheme.mode = mode;
        applyTheme(mode, currentTheme.colorScheme);
        saveThemePreference('theme-mode', mode);
    }

    // Change color scheme
    function changeColorScheme(scheme) {
        if (!themeOptions.colorSchemes.includes(scheme)) return;
        
        currentTheme.colorScheme = scheme;
        applyTheme(currentTheme.mode, scheme);
        saveThemePreference('color-scheme', scheme);
    }

    // Apply theme changes to the document
    function applyTheme(mode, colorScheme) {
        // Update theme attributes
        document.body.setAttribute('data-theme-mode', mode);
        document.body.setAttribute('data-color-scheme', colorScheme);
        
        // Update current theme object
        currentTheme.mode = mode;
        currentTheme.colorScheme = colorScheme;
        
        // Update UI indicators
        updateModeIndicators(mode);
        
        // Dispatch theme change event
        document.dispatchEvent(themeChangeEvent);
    }

    // Update mode indicator icons
    function updateModeIndicators(mode) {
        if (!lightIcon || !darkIcon) return;
        
        if (mode === 'dark') {
            lightIcon.classList.add('active');
            darkIcon.classList.remove('active');
        } else {
            lightIcon.classList.remove('active');
            darkIcon.classList.add('active');
        }
    }

    // Update theme panel UI to reflect current settings
    function updateThemePanelUI() {
        // Update mode options
        Object.keys(themeOptionElements).forEach(key => {
            const element = themeOptionElements[key];
            
            if (key.startsWith('mode-') && element) {
                const mode = element.getAttribute('data-theme-mode');
                element.classList.toggle('active', mode === currentTheme.mode);
            } 
            else if (key.startsWith('scheme-') && element) {
                const scheme = element.getAttribute('data-color-scheme');
                element.classList.toggle('active', scheme === currentTheme.colorScheme);
            }
        });
    }

    // Toggle features (particles, card effects, cursor)
    function toggleFeature(feature, enabled) {
        switch (feature) {
            case 'particles':
                const particlesContainer = document.getElementById('particles-js');
                if (particlesContainer) {
                    particlesContainer.style.opacity = enabled ? '1' : '0';
                }
                // Call particles functions if they exist
                if (window.particlesFunctions && enabled) {
                    window.particlesFunctions.init();
                }
                break;
                
            case 'card-effects':
                document.body.classList.toggle('card-effects-enabled', enabled);
                // Update card effects if the module exists
                if (window.cardEffects) {
                    if (enabled) {
                        window.cardEffects.init();
                    } else {
                        window.cardEffects.resetAll();
                    }
                }
                break;
                
            case 'custom-cursor':
                document.body.classList.toggle('custom-cursor-active', enabled);
                break;
        }
        
        // Save preference
        localStorage.setItem(feature, enabled ? 'enabled' : 'disabled');
    }

    // Save theme preference to local storage
    function saveThemePreference(key, value) {
        localStorage.setItem(key, value);
    }

    // Reset all theme settings to defaults
    function resetThemeSettings() {
        // Clear stored preferences
        localStorage.removeItem('theme-mode');
        localStorage.removeItem('color-scheme');
        localStorage.removeItem('particles');
        localStorage.removeItem('card-effects');
        localStorage.removeItem('custom-cursor');
        
        // Reset to defaults
        currentTheme = { ...defaultTheme };
        
        // Check system preference for dark mode
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            currentTheme.mode = 'dark';
        }
        
        // Apply default theme
        applyTheme(currentTheme.mode, currentTheme.colorScheme);
        
        // Reset toggles to default (enabled)
        if (themeToggles.particles) themeToggles.particles.checked = true;
        if (themeToggles.cardEffects) themeToggles.cardEffects.checked = true;
        if (themeToggles.cursor) themeToggles.cursor.checked = true;
        
        // Enable features
        toggleFeature('particles', true);
        toggleFeature('card-effects', true);
        toggleFeature('custom-cursor', true);
        
        // Update UI
        updateThemePanelUI();
    }

    // Export theme as CSS variables string
    function exportThemeAsCSS() {
        const style = getComputedStyle(document.documentElement);
        let cssText = `:root {\n`;
        
        // List of variables to export
        const variables = [
            'color-primary', 'color-secondary', 'background', 'foreground',
            'card-bg', 'text-primary', 'text-secondary', 'border-color'
        ];
        
        variables.forEach(variable => {
            const value = style.getPropertyValue(`--${variable}`).trim();
            if (value) {
                cssText += `  --${variable}: ${value};\n`;
            }
        });
        
        cssText += `}`;
        return cssText;
    }

    // Get current theme object
    function getCurrentTheme() {
        return { ...currentTheme };
    }

    // Initialize when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', initThemeManager);

    // Check if document is already loaded
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        initThemeManager();
    }

    // Expose public methods
    window.themeManager = {
        setThemeMode: changeThemeMode,
        setColorScheme: changeColorScheme,
        toggleThemeMode: toggleThemeMode,
        getCurrentTheme: getCurrentTheme,
        resetSettings: resetThemeSettings,
        toggleFeature: toggleFeature,
        exportAsCSS: exportThemeAsCSS
    };
})();

// Log initialization
console.log('Theme Manager module loaded - User: nicknet06 - 2025-03-22 21:53:18');