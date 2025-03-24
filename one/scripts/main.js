/*
* Portfolio Website - Main JavaScript
* Author: nicknet06
* Version: 1.0
* Last Update: 2025-03-22
*/

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize all components
    initPreloader();
    initNavigation();
    initHeroTypingEffect();
    initScrollAnimations();
    initStats();
    initThemeSwitcher();
    initThemePanel();
    initProjectFilters();
    initSkillsTabs();
    initTimeline();
    initTestimonialSlider();
    initContactForm();
    init3DCards();
    initCustomCursor();
    initBackToTop();
    initParticles();
    
    console.log('Portfolio initialized - 2025-03-22 21:43:12');
});

// ==========================================
// Preloader
// ==========================================
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    
    if (!preloader) return;
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('loaded');
            
            // Enable scroll once loaded
            document.body.style.overflow = 'auto';
            
            // Start animations after preloader
            startHeroAnimations();
        }, 800);
    });
    
    // Fallback if load event already fired
    setTimeout(function() {
        if (!preloader.classList.contains('loaded')) {
            preloader.classList.add('loaded');
            document.body.style.overflow = 'auto';
            startHeroAnimations();
        }
    }, 2500);
}

// ==========================================
// Hero Text Typing Effect
// ==========================================
function initHeroTypingEffect() {
    const dynamicTexts = document.querySelectorAll('.dynamic-text');
    
    if (dynamicTexts.length === 0) return;
    
    let currentIndex = 0;
    setInterval(() => {
        const activeText = document.querySelector('.dynamic-text.active');
        if (activeText) {
            activeText.classList.remove('active');
        }
        
        currentIndex = (currentIndex + 1) % dynamicTexts.length;
        dynamicTexts[currentIndex].classList.add('active');
    }, 3000);
    
    // Set initial state
    dynamicTexts[0].classList.add('active');
}

// Start hero animations
function startHeroAnimations() {
    const elements = document.querySelectorAll('.hero-hello, .hero-name, .hero-title, .hero-description, .hero-cta, .hero-stats, .hero-image, .hero-social');
    
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animated');
        }, 200 * index);
    });
}

// ==========================================
// Navigation
// ==========================================
function initNavigation() {
    const header = document.querySelector('header');
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }
    
    // Close menu when a nav item is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
                nav.classList.remove('active');
            }
            
            // Update active nav link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scroll-active');
        } else {
            header.classList.remove('scroll-active');
        }
        
        // Update active nav link based on scroll position
        updateActiveNavOnScroll();
    });
    
    // Initial check for active section
    updateActiveNavOnScroll();
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// ==========================================
// Scroll Animations
// ==========================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animation]');
    
    if (animatedElements.length === 0) return;
    
    // Create observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // If this is a skill progress bar
                if (entry.target.classList.contains('skill-progress')) {
                    const progressWidth = entry.target.getAttribute('data-progress');
                    entry.target.style.setProperty('--progress-width', progressWidth);
                }
                
                // Unobserve element after animating
                if (!entry.target.classList.contains('keep-observing')) {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all animated elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Specifically handle skill progress bars
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
    
    // Timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
        observer.observe(item);
    });
}

// ==========================================
// Stats Counter
// ==========================================
function initStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    if (stats.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-count'), 10);
                
                let count = 0;
                const interval = setInterval(() => {
                    target.textContent = count;
                    if (count >= countTo) {
                        clearInterval(interval);
                    }
                    count = Math.ceil(count + countTo / 20);
                }, 50);
                
                observer.unobserve(target);
            }
        });
    }, {
        threshold: 1,
        rootMargin: '0px'
    });
    
    stats.forEach(stat => {
        observer.observe(stat);
    });
}

// ==========================================
// Theme Switcher
// ==========================================
// Replace the initThemeSwitcher function in scripts/main.js

function initThemeSwitcher() {
    const lightIcon = document.querySelector('.light-icon');
    const darkIcon = document.querySelector('.dark-icon');
    const modeSwitcher = document.querySelector('.mode-switcher');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme-mode');
    if (savedTheme) {
        document.body.setAttribute('data-theme-mode', savedTheme);
        
        if (savedTheme === 'dark') {
            lightIcon.classList.add('active');
            darkIcon.classList.add('active');
        } else {
            lightIcon.classList.remove('active');
            darkIcon.classList.remove('active');
        }
    } else {
        // Check user's preferred color scheme
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.body.setAttribute('data-theme-mode', 'dark');
            lightIcon.classList.add('active');
            darkIcon.classList.add('active');
        }
    }
    
    // Toggle theme on click
    if (modeSwitcher) {
        modeSwitcher.addEventListener('click', function() {
            const currentTheme = document.body.getAttribute('data-theme-mode');
            
            if (currentTheme === 'dark') {
                document.body.setAttribute('data-theme-mode', 'light');
                lightIcon.classList.remove('active');
                darkIcon.classList.remove('active');
                localStorage.setItem('theme-mode', 'light');
            } else {
                document.body.setAttribute('data-theme-mode', 'dark');
                lightIcon.classList.add('active');
                darkIcon.classList.add('active');
                localStorage.setItem('theme-mode', 'dark');
            }
        });
    }
}

// ==========================================
// Theme Panel
// ==========================================
function initThemePanel() {
    const themePanel = document.querySelector('.theme-panel');
    const themePanelToggle = document.querySelector('.theme-panel-toggle');
    const themeOptions = document.querySelectorAll('.theme-option');
    const themeToggles = {
        particles: document.getElementById('particles-toggle'),
        cardEffects: document.getElementById('card-effects-toggle'),
        cursor: document.getElementById('cursor-toggle')
    };
    
    if (!themePanel || !themePanelToggle) return;
    
    // Toggle panel open/close
    themePanelToggle.addEventListener('click', function() {
        themePanel.classList.toggle('open');
    });
    
    // Close panel when clicking outside
    document.addEventListener('click', function(e) {
        if (!themePanel.contains(e.target) && !themePanelToggle.contains(e.target)) {
            themePanel.classList.remove('open');
        }
    });
    
    // Theme mode and color scheme options
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const themeType = this.parentElement.parentElement.getAttribute('data-theme-type');
            
            if (this.hasAttribute('data-theme-mode')) {
                const themeMode = this.getAttribute('data-theme-mode');
                document.body.setAttribute('data-theme-mode', themeMode);
                localStorage.setItem('theme-mode', themeMode);
                
                // Update mode switcher icons
                if (themeMode === 'dark') {
                    document.querySelector('.light-icon').classList.add('active');
                    document.querySelector('.dark-icon').classList.remove('active');
                } else {
                    document.querySelector('.light-icon').classList.remove('active');
                    document.querySelector('.dark-icon').classList.add('active');
                }
            } else if (this.hasAttribute('data-color-scheme')) {
                const colorScheme = this.getAttribute('data-color-scheme');
                document.body.setAttribute('data-color-scheme', colorScheme);
                localStorage.setItem('color-scheme', colorScheme);
            }
            
            // Add active class to selected option
            const siblings = Array.from(this.parentElement.children);
            siblings.forEach(sibling => sibling.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Effect toggles
    if (themeToggles.particles) {
        themeToggles.particles.addEventListener('change', function() {
            const particlesContainer = document.getElementById('particles-js');
            if (this.checked) {
                particlesContainer.style.opacity = '1';
                localStorage.setItem('particles', 'enabled');
            } else {
                particlesContainer.style.opacity = '0';
                localStorage.setItem('particles', 'disabled');
            }
        });
    }
    
    if (themeToggles.cardEffects) {
        themeToggles.cardEffects.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('card-effects-enabled');
                localStorage.setItem('card-effects', 'enabled');
            } else {
                document.body.classList.remove('card-effects-enabled');
                localStorage.setItem('card-effects', 'disabled');
            }
        });
    }
    
    if (themeToggles.cursor) {
        themeToggles.cursor.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('custom-cursor-active');
                localStorage.setItem('custom-cursor', 'enabled');
            } else {
                document.body.classList.remove('custom-cursor-active');
                localStorage.setItem('custom-cursor', 'disabled');
            }
        });
    }
    
    // Load saved preferences
    loadSavedThemePreferences();
}

function loadSavedThemePreferences() {
    // Color scheme
    const savedColorScheme = localStorage.getItem('color-scheme');
    if (savedColorScheme) {
        document.body.setAttribute('data-color-scheme', savedColorScheme);
        
        const colorOption = document.querySelector(`[data-color-scheme="${savedColorScheme}"]`);
        if (colorOption) {
            const siblings = Array.from(colorOption.parentElement.children);
            siblings.forEach(sibling => sibling.classList.remove('active'));
            colorOption.classList.add('active');
        }
    }
    
    // Theme mode
    const savedThemeMode = localStorage.getItem('theme-mode');
    if (savedThemeMode) {
        const themeOption = document.querySelector(`[data-theme-mode="${savedThemeMode}"]`);
        if (themeOption) {
            const siblings = Array.from(themeOption.parentElement.children);
            siblings.forEach(sibling => sibling.classList.remove('active'));
            themeOption.classList.add('active');
        }
    }
    
    // Effects
    const particles = localStorage.getItem('particles');
    const cardEffects = localStorage.getItem('card-effects');
    const customCursor = localStorage.getItem('custom-cursor');
    
    const toggles = {
        particles: document.getElementById('particles-toggle'),
        cardEffects: document.getElementById('card-effects-toggle'),
        cursor: document.getElementById('cursor-toggle')
    };
    
    if (particles === 'disabled' && toggles.particles) {
        toggles.particles.checked = false;
        const particlesContainer = document.getElementById('particles-js');
        if (particlesContainer) particlesContainer.style.opacity = '0';
    }
    
    if (cardEffects === 'disabled' && toggles.cardEffects) {
        toggles.cardEffects.checked = false;
        document.body.classList.remove('card-effects-enabled');
    } else {
        document.body.classList.add('card-effects-enabled');
    }
    
    if (customCursor === 'disabled' && toggles.cursor) {
        toggles.cursor.checked = false;
        document.body.classList.remove('custom-cursor-active');
    } else {
        document.body.classList.add('custom-cursor-active');
    }
}

// ==========================================
// Project Filters
// ==========================================
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.work-card');
    
    if (filterButtons.length === 0 || projectCards.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.classList.remove('filtered-out');
                    }, 10);
                } else {
                    const categories = card.getAttribute('data-category').split(' ');
                    
                    if (categories.includes(filter)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.classList.remove('filtered-out');
                        }, 10);
                    } else {
                        card.classList.add('filtered-out');
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
}

// ==========================================
// Skills Tabs
// ==========================================
function initSkillsTabs() {
    const skillsTabs = document.querySelectorAll('.skills-tab');
    const skillsData = document.querySelectorAll('.skills-data');
    
    if (skillsTabs.length === 0 || skillsData.length === 0) return;
    
    skillsTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            skillsTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const target = this.getAttribute('data-tab');
            
            // Show/hide content
            skillsData.forEach(content => {
                content.classList.remove('active');
                if (content.id === target) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// ==========================================
// Timeline Tabs
// ==========================================
function initTimeline() {
    const timelineTabs = document.querySelectorAll('.timeline-tab');
    const timelineData = document.querySelectorAll('.timeline-data');
    
    if (timelineTabs.length === 0 || timelineData.length === 0) return;
    
    timelineTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            timelineTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const target = this.getAttribute('data-tab');
            
            // Show/hide content
            timelineData.forEach(content => {
                content.classList.remove('active');
                if (content.id === target) {
                    content.classList.add('active');
                    
                    // Trigger animations for newly visible timeline items
                    const timelineItems = content.querySelectorAll('.timeline-item');
                    timelineItems.forEach((item, index) => {
                        item.classList.remove('animated');
                        setTimeout(() => {
                            item.classList.add('animated');
                        }, 50 * index);
                    });
                }
            });
        });
    });
}

// ==========================================
// Testimonial Slider
// ==========================================
function initTestimonialSlider() {
    const track = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const prevButton = document.querySelector('.testimonial-arrow.prev');
    const nextButton = document.querySelector('.testimonial-arrow.next');
    
    if (!track || slides.length === 0) return;
    
    let currentIndex = 0;
    
    function goToSlide(index) {
        if (index < 0) {
            index = slides.length - 1;
        } else if (index >= slides.length) {
            index = 0;
        }
        
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }
    
    // Initialize
    track.style.width = `${slides.length * 100}%`;
    slides.forEach(slide => {
        slide.style.width = `${100 / slides.length}%`;
    });
    
    // Event listeners
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
        });
    }
    
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goToSlide(i);
        });
    });
    
    // Auto slide
    let interval = setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 5000);
    
    // Pause auto slide on hover
    track.addEventListener('mouseenter', () => {
        clearInterval(interval);
    });
    
    track.addEventListener('mouseleave', () => {
        interval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
    });
    
    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            goToSlide(currentIndex + 1);
        } else if (touchEndX > touchStartX + 50) {
            goToSlide(currentIndex - 1);
        }
    }
}

// ==========================================
// Contact Form
// ==========================================
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const successMessage = document.querySelector('.success-message');
    const errorMessage = document.querySelector('.error-message');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulate form submission (replace with actual backend integration)
        const formData = new FormData(this);
        const formValues = Object.fromEntries(formData.entries());
        
        // Basic form validation
        if (!validateForm(formValues)) {
            showMessage(errorMessage, 'Please fill in all fields correctly.');
            return;
        }
        
        // Simulate sending data
        simulateFormSubmission(formValues)
            .then(response => {
                showMessage(successMessage);
                contactForm.reset();
            })
            .catch(error => {
                showMessage(errorMessage, error);
            });
    });
}

function validateForm(formValues) {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formValues.name || formValues.name.length < 2) {
        return false;
    }
    
    if (!formValues.email || !emailRegex.test(formValues.email)) {
        return false;
    }
    
    if (!formValues.subject || formValues.subject.length < 3) {
        return false;
    }
    
    if (!formValues.message || formValues.message.length < 10) {
        return false;
    }
    
    return true;
}

function simulateFormSubmission(formData) {
    return new Promise((resolve, reject) => {
        // Simulate network delay and processing time
        setTimeout(() => {
            // Simulate successful submission (90% chance)
            if (Math.random() > 0.1) {
                resolve('Message sent successfully!');
            } else {
                reject('Network error. Please try again.');
            }
        }, 1500);
    });
}

function showMessage(messageElement, customText) {
    if (customText && messageElement.querySelector('p')) {
        messageElement.querySelector('p').textContent = customText;
    }
    
    messageElement.style.display = 'flex';
    
    // Hide after 5 seconds
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}

// ==========================================
// 3D Card Effect
// ==========================================
function init3DCards() {
    if (!document.body.classList.contains('card-effects-enabled')) return;
    
    const cards = document.querySelectorAll('.work-card-front, .skill-card, .blog-card, .contact-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const tiltX = (y - centerY) / 10;
            const tiltY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

// ==========================================
// Custom Cursor
// ==========================================
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    
    if (!cursorDot || !cursorOutline) return;
    
    let cursorVisible = false;
    let cursorEnlarged = false;
    
    // Update cursor positions with a small delay for smoother animation
    const endX = window.innerWidth / 2;
    const endY = window.innerHeight / 2;
    let cursorX = endX;
    let cursorY = endY;
    
    window.addEventListener('mousemove', function(e) {
        if (document.body.classList.contains('custom-cursor-active')) {
            cursorVisible = true;
            cursorX = e.clientX;
            cursorY = e.clientY;
            
            // Update the DOM directly for dot for immediate response
            cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
            
            // Check if hovering over clickable elements
            const target = e.target;
            if (
                target.tagName.toLowerCase() === 'a' || 
                target.tagName.toLowerCase() === 'button' ||
                target.classList.contains('clickable') ||
                target.parentElement.tagName.toLowerCase() === 'a' ||
                target.parentElement.tagName.toLowerCase() === 'button'
            ) {
                cursorEnlarged = true;
                cursorOutline.classList.add('hover');
            } else {
                cursorEnlarged = false;
                cursorOutline.classList.remove('hover');
            }
        }
    });
    
    // Animation loop for smoother cursor outline movement
    const render = () => {
        if (cursorVisible && document.body.classList.contains('custom-cursor-active')) {
            cursorOutline.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        }
        requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
    
    // Hide cursor when leaving the window
    document.addEventListener('mouseout', function(e) {
        if (e.relatedTarget === null) {
            cursorVisible = false;
            cursorDot.style.opacity = '0';
            cursorOutline.style.opacity = '0';
        }
    });
    
    document.addEventListener('mouseover', function() {
        if (document.body.classList.contains('custom-cursor-active')) {
            cursorVisible = true;
            cursorDot.style.opacity = '1';
            cursorOutline.style.opacity = '1';
        }
    });
    
    // Additional cursor effects for elements
    document.querySelectorAll('a, button, .clickable').forEach(element => {
        element.addEventListener('mouseenter', function() {
            if (document.body.classList.contains('custom-cursor-active')) {
                cursorEnlarged = true;
                cursorOutline.classList.add('hover');
            }
        });
        
        element.addEventListener('mouseleave', function() {
            if (document.body.classList.contains('custom-cursor-active')) {
                cursorEnlarged = false;
                cursorOutline.classList.remove('hover');
            }
        });
    });
}

// ==========================================
// Back to Top Button
// ==========================================
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 400) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });
    
    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==========================================
// Particles Background
// ==========================================
function initParticles() {
    const particlesContainer = document.getElementById('particles-js');
    
    if (!particlesContainer || typeof particlesJS === 'undefined') return;
    
    // Check if particles are disabled in settings
    if (localStorage.getItem('particles') === 'disabled') {
        particlesContainer.style.opacity = '0';
        return;
    }
    
    // Configure particles
    const particlesConfig = {
        "particles": {
            "number": {
                "value": 50,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#4169e1"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#4169e1",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    };
    
    // Initialize particles
    particlesJS('particles-js', particlesConfig);
    
    // Adjust particles color based on theme
    window.addEventListener('themechange', function() {
        const isDark = document.body.getAttribute('data-theme-mode') === 'dark';
        const scheme = document.body.getAttribute('data-color-scheme');
        
        // Update particles color based on theme
        const particlesCanvas = document.querySelector('#particles-js canvas');
        if (particlesCanvas) {
            // Remove and reinitialize with new colors
            particlesContainer.innerHTML = '';
            particlesJS('particles-js', particlesConfig);
        }
    });
}

// Add ripple effect to buttons
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        const button = e.target;
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
        ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});