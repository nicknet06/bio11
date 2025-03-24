/*
* Portfolio Website - 3D Card Effects
* Author: nicknet06
* Version: 1.0
* Last Update: 2025-03-22 21:49:49
*/

// Self-executing function to keep variables scoped
(function() {
    'use strict';

    // Configuration options
    const config = {
        perspective: 1000,      // Perspective value for 3D effects (lower = more intense)
        scale: 1.05,            // Scale factor on hover
        rotateXMax: 10,         // Maximum X rotation in degrees
        rotateYMax: 10,         // Maximum Y rotation in degrees
        transitionSpeed: 0.3,   // Transition speed in seconds
        zoomOnHover: true,      // Enable zoom effect on hover
        easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)', // Easing function
        glare: true,            // Enable glare effect
        glareOpacity: 0.1,      // Glare opacity
        gyroscope: true,        // Enable gyroscope effect on mobile
        resetOnLeave: true      // Reset card position on mouse leave
    };

    // List of selectors for elements that should receive 3D effects
    const cardSelectors = [
        '.work-card-inner',
        '.skill-card',
        '.blog-card',
        '.contact-card',
        '.testimonial-card',
        '.tool-card',
        '.soft-skill'
    ];
    
    // Store references to cards with 3D effect
    let cards = [];
    
    // Flag to check if effects are enabled
    let effectsEnabled = true;

    // Track device support and capabilities
    const deviceCapabilities = {
        hasGyroscope: 'DeviceOrientationEvent' in window,
        hasTouchScreen: ('ontouchstart' in window) || window.navigator.maxTouchPoints > 0,
        isLowPerfDevice: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768,
        isReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };

    // Initialize 3D card effects
    function init3DCardEffects() {
        // Check for saved preferences
        const cardEffectsPreference = localStorage.getItem('card-effects');
        effectsEnabled = cardEffectsPreference === null || cardEffectsPreference === 'enabled';
        
        // Update body class based on preference
        if (effectsEnabled) {
            document.body.classList.add('card-effects-enabled');
        } else {
            document.body.classList.remove('card-effects-enabled');
        }
        
        // Select all cards that should have 3D effects
        selectCards();
        
        // Initialize card listeners
        initCardListeners();
        
        // Initialize gyroscope effect on supported devices
        if (config.gyroscope && deviceCapabilities.hasGyroscope && effectsEnabled) {
            initGyroscopeEffect();
        }
        
        // Add window resize listener to re-select cards if needed
        window.addEventListener('resize', debounce(handleResize, 200));
        
        // Add reduced motion listener
        window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', handleReducedMotionChange);
        
        // Log initialization
        console.log('3D Cards initialized - 2025-03-22 21:49:49');
    }

    // Select all cards that should have 3D effects
    function selectCards() {
        // Clear previous cards array
        cards = [];
        
        // Select cards based on selectors
        cardSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                prepareCardElement(element);
                cards.push(element);
            });
        });
    }

    // Prepare card element for 3D effects
    function prepareCardElement(element) {
        // Add necessary classes
        element.classList.add('card-3d-effect');
        
        // Set initial styles
        setCardStyles(element);
        
        // Create glare element if enabled
        if (config.glare && !element.querySelector('.card-glare')) {
            const glareElement = document.createElement('div');
            glareElement.className = 'card-glare';
            glareElement.style.position = 'absolute';
            glareElement.style.top = '0';
            glareElement.style.left = '0';
            glareElement.style.width = '100%';
            glareElement.style.height = '100%';
            glareElement.style.pointerEvents = 'none';
            glareElement.style.background = 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,' + config.glareOpacity + ') 80%)';
            glareElement.style.transform = 'rotate(0deg)';
            glareElement.style.opacity = '0';
            glareElement.style.transition = 'opacity ' + config.transitionSpeed + 's ' + config.easing;
            glareElement.style.borderRadius = 'inherit';
            glareElement.style.zIndex = '2';
            
            // Ensure the element has position relative for absolute positioning of glare
            if (getComputedStyle(element).position === 'static') {
                element.style.position = 'relative';
            }
            
            element.appendChild(glareElement);
        }
    }

    // Set default card styles
    function setCardStyles(element) {
        element.style.transition = 'transform ' + config.transitionSpeed + 's ' + config.easing;
        
        // Ensure the element has perspective for 3D effects
        if (element.parentElement) {
            element.parentElement.style.perspective = config.perspective + 'px';
            element.parentElement.style.transformStyle = 'preserve-3d';
            element.parentElement.style.overflow = 'visible';
        }
        
        // Add transform-style: preserve-3d to enable true 3D
        element.style.transformStyle = 'preserve-3d';
        
        // Add will-change for performance optimization
        element.style.willChange = 'transform';
    }

    // Initialize card event listeners
    function initCardListeners() {
        cards.forEach(card => {
            // Remove existing listeners if any
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseenter', handleMouseEnter);
            card.removeEventListener('mouseleave', handleMouseLeave);
            card.removeEventListener('touchmove', handleTouchMove);
            card.removeEventListener('touchstart', handleTouchStart);
            card.removeEventListener('touchend', handleTouchEnd);
            
            // Add new listeners if effects are enabled
            if (effectsEnabled && !deviceCapabilities.isReducedMotion) {
                // Mouse events
                card.addEventListener('mousemove', handleMouseMove);
                card.addEventListener('mouseenter', handleMouseEnter);
                card.addEventListener('mouseleave', handleMouseLeave);
                
                // Touch events for mobile
                if (deviceCapabilities.hasTouchScreen) {
                    card.addEventListener('touchmove', handleTouchMove, { passive: true });
                    card.addEventListener('touchstart', handleTouchStart, { passive: true });
                    card.addEventListener('touchend', handleTouchEnd, { passive: true });
                }
            } else {
                // Reset any active transformations
                resetCardTransform(card);
            }
        });
    }

    // Handle mouse movement over card
    function handleMouseMove(e) {
        if (!effectsEnabled) return;
        
        const card = this;
        const cardRect = card.getBoundingClientRect();
        
        // Calculate mouse position relative to card center
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        const mouseX = e.clientX - cardCenterX;
        const mouseY = e.clientY - cardCenterY;
        
        // Calculate rotation values (invert for natural feel)
        const rotateY = mouseX / (cardRect.width / 2) * config.rotateYMax;
        const rotateX = -mouseY / (cardRect.height / 2) * config.rotateXMax;
        
        // Apply 3D transforms
        updateCardTransform(card, rotateX, rotateY);
        
        // Update glare position
        updateGlareEffect(card, mouseX, mouseY, cardRect);
    }

    // Handle mouse enter
    function handleMouseEnter() {
        if (!effectsEnabled) return;
        
        const card = this;
        
        // Add active class
        card.classList.add('card-3d-active');
        
        // Show glare
        const glare = card.querySelector('.card-glare');
        if (glare) {
            glare.style.opacity = '1';
        }
    }

    // Handle mouse leave
    function handleMouseLeave() {
        if (!effectsEnabled || !config.resetOnLeave) return;
        
        resetCardTransform(this);
    }

    // Handle touch move
    function handleTouchMove(e) {
        if (!effectsEnabled || e.touches.length !== 1) return;
        
        const card = this;
        const cardRect = card.getBoundingClientRect();
        const touch = e.touches[0];
        
        // Calculate touch position relative to card center
        const cardCenterX = cardRect.left + cardRect.width / 2;
        const cardCenterY = cardRect.top + cardRect.height / 2;
        const touchX = touch.clientX - cardCenterX;
        const touchY = touch.clientY - cardCenterY;
        
        // Calculate rotation values (reduce intensity for touch)
        const rotateY = touchX / (cardRect.width / 2) * config.rotateYMax * 0.7;
        const rotateX = -touchY / (cardRect.height / 2) * config.rotateXMax * 0.7;
        
        // Apply 3D transforms
        updateCardTransform(card, rotateX, rotateY);
        
        // Update glare position
        updateGlareEffect(card, touchX, touchY, cardRect);
    }

    // Handle touch start
    function handleTouchStart() {
        if (!effectsEnabled) return;
        
        const card = this;
        
        // Add active class
        card.classList.add('card-3d-active');
        
        // Show glare
        const glare = card.querySelector('.card-glare');
        if (glare) {
            glare.style.opacity = '1';
        }
    }

    // Handle touch end
    function handleTouchEnd() {
        if (!effectsEnabled || !config.resetOnLeave) return;
        
        resetCardTransform(this);
    }

    // Update card transformation
    function updateCardTransform(card, rotateX, rotateY) {
        // Apply transformations
        let transform = `perspective(${config.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        
        // Add scale if enabled
        if (config.zoomOnHover) {
            transform += ` scale3d(${config.scale}, ${config.scale}, ${config.scale})`;
        }
        
        card.style.transform = transform;
    }

    // Update glare effect position
    function updateGlareEffect(card, mouseX, mouseY, cardRect) {
        const glare = card.querySelector('.card-glare');
        if (!glare) return;
        
        // Calculate angle for glare based on mouse position
        const glareAngle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);
        
        // Calculate glare position (opposite to mouse)
        const glareOpacity = Math.min(
            Math.max(
                Math.sqrt(Math.pow(mouseX, 2) + Math.pow(mouseY, 2)) / 
                Math.sqrt(Math.pow(cardRect.width / 2, 2) + Math.pow(cardRect.height / 2, 2)),
                0
            ) * config.glareOpacity,
            config.glareOpacity
        );
        
        // Update glare styling
        glare.style.transform = `rotate(${glareAngle}deg)`;
        glare.style.opacity = glareOpacity.toString();
    }

    // Reset card transform to initial state
    function resetCardTransform(card) {
        // Remove active class
        card.classList.remove('card-3d-active');
        
        // Reset transform
        card.style.transform = '';
        
        // Hide glare
        const glare = card.querySelector('.card-glare');
        if (glare) {
            glare.style.opacity = '0';
        }
    }

    // Initialize gyroscope effect for mobile devices
    function initGyroscopeEffect() {
        if (!deviceCapabilities.hasGyroscope) return;
        
        // Store last gyroscope values
        let lastGamma = 0;
        let lastBeta = 0;
        
        // Add device orientation listener
        window.addEventListener('deviceorientation', function(e) {
            if (!effectsEnabled) return;
            
            // Get gyroscope data
            const gamma = Math.min(Math.max(e.gamma, -15), 15); // Left/right tilt (limit to -15/15 degrees)
            const beta = Math.min(Math.max(e.beta, -15), 15);   // Front/back tilt (limit to -15/15 degrees)
            
            // Apply smoothing
            lastGamma = lastGamma * 0.8 + gamma * 0.2;
            lastBeta = lastBeta * 0.8 + beta * 0.2;
            
            // Apply rotations to active cards
            cards.forEach(card => {
                if (isElementInViewport(card)) {
                    // Map gyroscope values to rotation
                    const rotateY = (lastGamma / 15) * config.rotateYMax * 0.5;
                    const rotateX = (lastBeta / 15) * config.rotateXMax * 0.5;
                    
                    // Apply transformations
                    updateCardTransform(card, rotateX, rotateY);
                }
            });
        }, true);
    }

    // Handle window resize
    function handleResize() {
        // Re-select cards in case DOM has changed
        selectCards();
        
        // Reinitialize listeners
        initCardListeners();
    }

    // Handle reduced motion preference change
    function handleReducedMotionChange(e) {
        deviceCapabilities.isReducedMotion = e.matches;
        
        if (e.matches) {
            // Reset all cards
            cards.forEach(resetCardTransform);
        }
        
        // Reinitialize listeners
        initCardListeners();
    }

    // Toggle 3D card effects
    function toggle3DCardEffects(enable) {
        effectsEnabled = enable;
        
        if (enable) {
            document.body.classList.add('card-effects-enabled');
            localStorage.setItem('card-effects', 'enabled');
        } else {
            document.body.classList.remove('card-effects-enabled');
            localStorage.setItem('card-effects', 'disabled');
            
            // Reset all cards
            cards.forEach(resetCardTransform);
        }
        
        // Reinitialize listeners
        initCardListeners();
    }

    // Add CSS for card effects
    function addCardEffectsCSS() {
        const styleElement = document.createElement('style');
        styleElement.id = 'card-3d-effects-css';
        styleElement.textContent = `
            .card-3d-effect {
                transition: transform ${config.transitionSpeed}s ${config.easing};
                transform-style: preserve-3d;
                will-change: transform;
            }
            
            .card-3d-active {
                z-index: 5;
            }
            
            .card-3d-effect > * {
                transform: translateZ(1px);
            }
            
            @media (prefers-reduced-motion: reduce) {
                .card-3d-effect {
                    transition: none !important;
                    transform: none !important;
                }
            }
        `;
        document.head.appendChild(styleElement);
    }

    // Utility functions
    
    // Check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0 &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
            rect.right >= 0
        );
    }
    
    // Debounce function to limit function calls
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // Initialize when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Add CSS for card effects
        addCardEffectsCSS();
        
        // Initialize 3D card effects
        init3DCardEffects();
    });

    // Expose public methods
    window.cardEffects = {
        init: init3DCardEffects,
        toggle: toggle3DCardEffects,
        resetAll: function() {
            cards.forEach(resetCardTransform);
        },
        refreshCards: function() {
            selectCards();
            initCardListeners();
        }
    };
})();

// Log initialization
console.log('3D Cards module loaded - User: nicknet06 - 2025-03-22 21:49:49');