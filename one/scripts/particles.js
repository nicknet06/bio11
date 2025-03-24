/*
* Portfolio Website - Particles Background
* Author: nicknet06
* Version: 1.0
* Last Update: 2025-03-22 21:46:52
*/

// Self-executing function to keep variables scoped
(function() {
    'use strict';

    // Store the particles instance
    let particlesInstance = null;
    
    // Default colors for different themes and color schemes
    const themeColors = {
        light: {
            default: {
                particles: '#4169e1',
                links: '#4169e1'
            },
            midnight: {
                particles: '#9d4edd',
                links: '#7b2cbf'
            },
            sunset: {
                particles: '#ff6b6b',
                links: '#ff922b'
            },
            forest: {
                particles: '#38b2ac',
                links: '#2f855a'
            }
        },
        dark: {
            default: {
                particles: '#667eea',
                links: '#5a67d8'
            },
            midnight: {
                particles: '#b04ded',
                links: '#9d4edd'
            },
            sunset: {
                particles: '#ff8787',
                links: '#ff922b'
            },
            forest: {
                particles: '#4fd1c5',
                links: '#38a169'
            }
        },
        contrast: {
            default: {
                particles: '#0056b3',
                links: '#004080'
            },
            midnight: {
                particles: '#9d4edd',
                links: '#5a189a'
            },
            sunset: {
                particles: '#fa5252',
                links: '#f76707'
            },
            forest: {
                particles: '#2c7a7b',
                links: '#276749'
            }
        }
    };

    // Generate particle configuration based on current theme
    function getParticlesConfig() {
        const themeMode = document.body.getAttribute('data-theme-mode') || 'light';
        const colorScheme = document.body.getAttribute('data-color-scheme') || 'default';
        
        const colors = themeColors[themeMode][colorScheme];
        
        return {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": colors.particles
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    },
                    "image": {
                        "src": "img/github.svg",
                        "width": 100,
                        "height": 100
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": colors.links,
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
    }

    // Function to initialize particles
    function initParticles() {
        const particlesContainer = document.getElementById('particles-js');
        
        if (!particlesContainer || typeof particlesJS === 'undefined') {
            console.warn('Particles.js container not found or library not loaded');
            return;
        }
        
        // Check if particles are disabled in settings
        if (localStorage.getItem('particles') === 'disabled') {
            particlesContainer.style.opacity = '0';
            return;
        }
        
        // Generate config based on current theme
        const config = getParticlesConfig();
        
        // Initialize particles
        particlesJS('particles-js', config);
        
        // Store reference to the particles instance
        if (window.pJSDom && window.pJSDom.length > 0) {
            particlesInstance = window.pJSDom[0].pJS;
        }
    }

    // Function to update particles colors
    function updateParticlesColors() {
        const themeMode = document.body.getAttribute('data-theme-mode') || 'light';
        const colorScheme = document.body.getAttribute('data-color-scheme') || 'default';
        
        const colors = themeColors[themeMode][colorScheme];
        
        if (particlesInstance) {
            // Update particle colors
            for (let i = 0; i < particlesInstance.particles.array.length; i++) {
                const particle = particlesInstance.particles.array[i];
                particle.color.value = colors.particles;
                particle.color.rgb = hexToRgb(colors.particles);
            }
            
            // Update line linked colors
            particlesInstance.particles.line_linked.color = colors.links;
            particlesInstance.particles.line_linked.color_rgb_line = hexToRgb(colors.links);
            
            // Refresh particles
            particlesInstance.particles.draw();
        } else {
            // If no instance exists, reinitialize
            const particlesContainer = document.getElementById('particles-js');
            if (particlesContainer) {
                particlesContainer.innerHTML = '';
                initParticles();
            }
        }
    }

    // Helper function to convert hex color to RGB
    function hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace(/^#/, '');
        
        // Parse hex values
        const bigint = parseInt(hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        
        return {
            r: r,
            g: g,
            b: b
        };
    }

    // Function to toggle particles visibility
    function toggleParticlesVisibility(show) {
        const particlesContainer = document.getElementById('particles-js');
        
        if (!particlesContainer) return;
        
        if (show) {
            particlesContainer.style.opacity = '1';
            localStorage.setItem('particles', 'enabled');
            
            // If particles were previously hidden, reinitialize them
            if (!particlesInstance || particlesContainer.innerHTML === '') {
                initParticles();
            }
        } else {
            particlesContainer.style.opacity = '0';
            localStorage.setItem('particles', 'disabled');
        }
    }

    // Function to adjust particles density based on device performance
    function adjustForPerformance() {
        // Simple performance check based on device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLowPerfDevice = isMobile || window.innerWidth < 768;
        
        if (isLowPerfDevice && particlesInstance) {
            // Reduce particle count for better performance
            particlesInstance.particles.number.value = 30;
            particlesInstance.particles.number.density.value_area = 800;
            
            // Refresh particles
            particlesInstance.fn.particlesRefresh();
        }
    }

    // Listen for theme changes
    document.addEventListener('themechange', updateParticlesColors);
    
    // Listen for theme and color scheme attribute changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'data-theme-mode' || 
                mutation.attributeName === 'data-color-scheme') {
                updateParticlesColors();
            }
        });
    });
    
    observer.observe(document.body, { attributes: true });

    // Initialize when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize particles
        initParticles();
        
        // Add resize handler
        window.addEventListener('resize', function() {
            if (particlesInstance) {
                particlesInstance.fn.canvasClear();
                particlesInstance.fn.canvasInit();
                particlesInstance.fn.canvasSize();
                particlesInstance.fn.canvasPaint();
                particlesInstance.fn.particlesCreate();
                particlesInstance.fn.densityAutoParticles();
            }
            
            // Adjust for performance
            adjustForPerformance();
        });
        
        // Pause particles animation when tab is not visible for performance
        document.addEventListener('visibilitychange', function() {
            if (particlesInstance) {
                if (document.hidden) {
                    particlesInstance.fn.particlesEmpty();
                } else {
                    particlesInstance.fn.particlesRefresh();
                }
            }
        });
        
        // Check for performance issues
        adjustForPerformance();
    });

    // Expose public methods
    window.particlesFunctions = {
        init: initParticles,
        updateColors: updateParticlesColors,
        toggle: toggleParticlesVisibility,
        adjustPerformance: adjustForPerformance
    };
})();

// Log initialization
console.log('Particles.js initialized - 2025-03-22 21:46:52');