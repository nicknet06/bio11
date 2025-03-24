/**
 * Portfolio Timeline Component
 * Author: nicknet06
 * Version: 1.0.0
 * Last Update: 2025-03-23 13:13:36
 * 
 * This script handles all interactive functionality for the timeline component,
 * including scroll animations, progress tracking, and interactive effects.
 */

(function() {
    'use strict';
    
    // Configuration options
    const config = {
        animationThreshold: 100, // Distance from viewport to trigger animations (px)
        animationDelay: 300,     // Delay before initial animation check (ms)
        progressUpdateInterval: 100, // Throttle interval for progress updates (ms)
        enableScrollEffects: true,   // Enable/disable scroll-based animations
        enable3DEffects: true,       // Enable/disable 3D hover effects
        maxTiltAngle: 10,            // Maximum tilt angle for 3D effects (degrees)
        useSmoothScrolling: true,    // Use smooth scrolling for navigation
        animationDuration: 800       // Base duration for animations (ms)
    };
    
    // DOM Elements
    let timelineSection;
    let timelineContainer;
    let timelineItems = [];
    let progressLine;
    let isInitialized = false;
    
    /**
     * Initialize the timeline component
     */
    function initTimeline() {
        // Only initialize once
        if (isInitialized) return;
        
        // Cache DOM elements
        timelineSection = document.querySelector('.experience');
        if (!timelineSection) return;
        
        timelineContainer = timelineSection.querySelector('.timeline');
        if (!timelineContainer) return;
        
        timelineItems = timelineSection.querySelectorAll('.timeline-item');
        if (!timelineItems.length) return;
        
        // Initialize features
        createProgressLine();
        setupEventListeners();
        startAnimationSequence();
        
        // Mark as initialized
        isInitialized = true;
        console.log('Timeline initialized - nicknet06 - 2025-03-23 13:13:36');
    }
    
    /**
     * Create and append the timeline progress line
     */
    function createProgressLine() {
        progressLine = document.createElement('div');
        progressLine.className = 'timeline-progress';
        
        // Append to timeline container
        timelineContainer.appendChild(progressLine);
        
        // Initial update of the progress line
        updateProgressLine();
    }
    
    /**
     * Setup all event listeners for the timeline
     */
    function setupEventListeners() {
        // Scroll event for animations and progress tracking
        window.addEventListener('scroll', throttle(function() {
            if (config.enableScrollEffects) {
                handleScrollAnimations();
                updateProgressLine();
            }
        }, config.progressUpdateInterval));
        
        // Resize event to recalculate dimensions
        window.addEventListener('resize', debounce(function() {
            updateProgressLine();
        }, 200));
        
        // Add hover effects for timeline items
        addTimelineHoverEffects();
        
        // Add 3D effects for timeline cards if enabled
        if (config.enable3DEffects && shouldEnable3DEffects()) {
            add3DEffectToCards();
        }
        
        // Listen for theme changes
        document.addEventListener('themeChanged', function() {
            // Re-calculate any theme-dependent styles
            setTimeout(updateProgressLine, 300);
        });
    }
    
    /**
     * Start the initial animation sequence
     */
    function startAnimationSequence() {
        // Add a class to the body to indicate timeline is loaded
        document.body.classList.add('timeline-loaded');
        
        // Initial check for items in viewport with a slight delay
        setTimeout(() => {
            handleScrollAnimations();
            
            // Animate the first item if not visible in viewport
            const firstItem = timelineItems[0];
            if (firstItem && !isElementInViewport(firstItem)) {
                firstItem.classList.add('show');
            }
        }, config.animationDelay);
    }
    
    /**
     * Handle scroll-based animations for timeline items
     */
    function handleScrollAnimations() {
        const animateItems = document.querySelectorAll('.animate-on-scroll');
        
        animateItems.forEach(item => {
            if (isElementInViewport(item, config.animationThreshold)) {
                item.classList.add('show');
                
                // Optional: trigger any custom animations
                if (item.hasAttribute('data-animation-trigger')) {
                    const triggerName = item.getAttribute('data-animation-trigger');
                    triggerCustomAnimation(item, triggerName);
                }
            }
        });
    }
    
    /**
     * Update the timeline progress line based on scroll position
     */
    function updateProgressLine() {
        if (!progressLine || !timelineContainer) return;
        
        const timelineRect = timelineContainer.getBoundingClientRect();
        const timelineTop = timelineRect.top;
        const timelineHeight = timelineRect.height;
        const viewportHeight = window.innerHeight;
        
        // Calculate how much of the timeline is visible
        let visiblePercentage = 0;
        
        if (timelineTop < viewportHeight) {
            // Some part of the timeline is visible
            if (timelineTop + timelineHeight < viewportHeight) {
                // Entire timeline is visible
                visiblePercentage = 100;
            } else {
                // Calculate what percentage is visible
                const visibleHeight = viewportHeight - timelineTop;
                visiblePercentage = (visibleHeight / timelineHeight) * 100;
                
                // Cap at 100%
                visiblePercentage = Math.min(visiblePercentage, 100);
            }
        }
        
        // Update the progress line
        progressLine.style.bottom = (100 - Math.max(0, visiblePercentage)) + '%';
    }
    
    /**
     * Add hover effects to timeline items
     */
    function addTimelineHoverEffects() {
        timelineItems.forEach(item => {
            const dot = item.querySelector('.timeline-dot');
            const content = item.querySelector('.timeline-content');
            
            if (!content) return;
            
            // Mouse enter effects
            item.addEventListener('mouseenter', function() {
                content.style.transform = 'translateY(-5px)';
                content.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
                
                if (dot) {
                    dot.style.transform = 'scale(1.2)';
                    dot.style.boxShadow = '0 0 0 8px rgba(var(--primary-color-rgb), 0.2)';
                }
            });
            
            // Mouse leave effects
            item.addEventListener('mouseleave', function() {
                content.style.transform = '';
                content.style.boxShadow = '';
                
                if (dot) {
                    dot.style.transform = '';
                    dot.style.boxShadow = '';
                }
            });
            
            // Add highlight behavior for click/tap
            item.addEventListener('click', function() {
                // Remove highlight from other items
                timelineItems.forEach(i => i.classList.remove('active-item'));
                
                // Highlight this item
                this.classList.add('active-item');
            });
        });
    }
    
    /**
     * Add 3D tilt effect to timeline cards
     */
    function add3DEffectToCards() {
        const cards = document.querySelectorAll('.timeline-content');
        
        cards.forEach(card => {
            // Track if the card is being touched (for mobile)
            let isTouching = false;
            
            // Mouse move handler for 3D effect
            card.addEventListener('mousemove', function(e) {
                // Skip if being touched or 3D effects are disabled
                if (isTouching || !config.enable3DEffects) return;
                
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Calculate tilt angle based on mouse position
                const tiltX = ((y - centerY) / centerY) * config.maxTiltAngle;
                const tiltY = ((centerX - x) / centerX) * config.maxTiltAngle;
                
                // Apply the 3D transform
                this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
                
                // Add light reflection effect
                const shine = ((x / rect.width) * 100) + '% ' + ((y / rect.height) * 100) + '%';
                this.style.backgroundImage = `radial-gradient(circle at ${shine}, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 80%)`;
            });
            
            // Mouse leave handler to reset
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.backgroundImage = '';
            });
            
            // Touch start handler
            card.addEventListener('touchstart', function() {
                isTouching = true;
            });
            
            // Touch end handler
            card.addEventListener('touchend', function() {
                isTouching = false;
            });
        });
    }
    
    /**
     * Trigger a custom animation on an element
     * @param {HTMLElement} element - The target element
     * @param {string} animationName - Name of the animation to trigger
     */
    function triggerCustomAnimation(element, animationName) {
        if (!element || !animationName) return;
        
        switch (animationName) {
            case 'highlight':
                // Apply a brief highlight effect
                element.classList.add('highlight-effect');
                setTimeout(() => {
                    element.classList.remove('highlight-effect');
                }, 1000);
                break;
            
            case 'bounce':
                // Apply a bounce animation
                element.classList.add('bounce-effect');
                setTimeout(() => {
                    element.classList.remove('bounce-effect');
                }, 1000);
                break;
                
            // Add more custom animations as needed
            
            default:
                console.warn(`Unknown animation name: ${animationName}`);
        }
    }
    
    /**
     * Navigate to a specific timeline item
     * @param {number} index - The index of the timeline item to scroll to
     */
    function navigateToTimelineItem(index) {
        if (!timelineItems || index < 0 || index >= timelineItems.length) return;
        
        const targetItem = timelineItems[index];
        
        if (config.useSmoothScrolling && 'scrollBehavior' in document.documentElement.style) {
            targetItem.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        } else {
            // Fallback for browsers that don't support smooth scrolling
            const targetPosition = targetItem.getBoundingClientRect().top + window.pageYOffset - 100;
            window.scrollTo(0, targetPosition);
        }
        
        // Highlight the target item
        setTimeout(() => {
            timelineItems.forEach(item => item.classList.remove('active-item'));
            targetItem.classList.add('active-item');
        }, 500);
    }
    
    /**
     * Check if the browser/device should enable 3D effects
     * @return {boolean} - True if 3D effects should be enabled
     */
    function shouldEnable3DEffects() {
        // Check if the document has a class that explicitly enables card effects
        if (document.body.classList.contains('card-effects-enabled')) {
            return true;
        }
        
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return false;
        }
        
        // Check if device is likely a mobile/touch device
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Check if an element is in the viewport
     * @param {HTMLElement} el - The element to check
     * @param {number} offset - Offset from the viewport edge (px)
     * @return {boolean} - True if the element is in the viewport
     */
    function isElementInViewport(el, offset = 0) {
        if (!el) return false;
        
        const rect = el.getBoundingClientRect();
        
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
            rect.bottom >= 0 &&
            rect.left >= 0 &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    /**
     * Throttle a function to limit how often it can be called
     * @param {Function} func - The function to throttle
     * @param {number} limit - The time limit in milliseconds
     * @return {Function} - The throttled function
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    /**
     * Debounce a function to group multiple calls into a single execution
     * @param {Function} func - The function to debounce
     * @param {number} wait - The time to wait in milliseconds
     * @return {Function} - The debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    /**
     * Create a new timeline item dynamically
     * @param {Object} data - The data for the new timeline item
     * @param {string} data.date - The date or date range text
     * @param {string} data.title - The title of the timeline item
     * @param {string} data.subtitle - The subtitle or organization
     * @param {string} data.description - The description text
     * @param {Array<string>} data.tags - Array of tag strings
     * @param {number} [data.position] - Index position to insert the item (optional)
     */
    function addTimelineItem(data) {
        if (!timelineContainer) return;
        
        // Create the new timeline item element
        const newItem = document.createElement('div');
        newItem.className = 'timeline-item animate-on-scroll';
        
        // Add the HTML structure
        newItem.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="timeline-date">${data.date}</div>
                <h3>${data.title}</h3>
                <h4>${data.subtitle}</h4>
                <p>${data.description}</p>
                <div class="tags">
                    ${data.tags.map(tag => `<span>${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        // Insert at the specified position or append to the end
        if (typeof data.position === 'number' && data.position >= 0 && timelineItems.length > 0) {
            if (data.position < timelineItems.length) {
                timelineContainer.insertBefore(newItem, timelineItems[data.position]);
            } else {
                timelineContainer.appendChild(newItem);
            }
        } else {
            timelineContainer.appendChild(newItem);
        }
        
        // Refresh the timeline items array
        timelineItems = timelineSection.querySelectorAll('.timeline-item');
        
        // Add hover effects to the new item
        addTimelineHoverEffects();
        
        // Add 3D effects if enabled
        if (config.enable3DEffects && shouldEnable3DEffects()) {
            add3DEffectToCards();
        }
        
        // Animate the new item
        setTimeout(() => {
            newItem.classList.add('show');
        }, 100);
        
        // Update the progress line
        updateProgressLine();
    }
    
    /**
     * Public API for the timeline component
     */
    window.timelineComponent = {
        init: initTimeline,
        navigateTo: navigateToTimelineItem,
        addItem: addTimelineItem,
        updateProgress: updateProgressLine
    };
    
    // Initialize when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', initTimeline);
    
    // Also initialize if the document is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initTimeline();
    }
})();

// Log initialization
console.log('Timeline script loaded - nicknet06 - 2025-03-23 13:13:36');

// Add missing data for the timeline section
document.addEventListener('DOMContentLoaded', function() {
    const timelineData = [
        {
            date: '2023 - Present',
            title: 'Senior Web Developer',
            subtitle: 'Tech Innovations Inc.',
            description: 'Leading development of enterprise web applications, managing a team of 5 developers, and implementing CI/CD pipelines to streamline deployment processes.',
            tags: ['React', 'Node.js', 'AWS', 'Team Lead']
        },
        {
            date: '2020 - 2023',
            title: 'Full Stack Developer',
            subtitle: 'Digital Solutions Group',
            description: 'Developed responsive web applications and RESTful APIs. Collaborated with design team to implement modern user interfaces and improve user experience.',
            tags: ['JavaScript', 'Vue.js', 'Express', 'MongoDB']
        },
        {
            date: '2018 - 2020',
            title: 'Frontend Developer',
            subtitle: 'WebCraft Studios',
            description: 'Created responsive websites and implemented interactive UI components. Optimized website performance and collaborated with backend developers on API integration.',
            tags: ['HTML5', 'CSS3', 'JavaScript', 'jQuery']
        },
        {
            date: '2016 - 2018',
            title: 'Web Design Intern',
            subtitle: 'Creative Minds Agency',
            description: 'Assisted senior designers with website mockups and basic frontend implementation. Learned fundamental web development principles and best practices.',
            tags: ['UI Design', 'HTML', 'CSS', 'WordPress']
        }
    ];

    timelineData.forEach(item => {
        window.timelineComponent.addItem(item);
    });
});
