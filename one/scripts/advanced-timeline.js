/*
* Ultra-Advanced Timeline Component
* Author: nicknet06
* Version: 1.0
* Last Update: 2025-03-23 12:31:18
*/

// Self-executing function to prevent global scope pollution
(function() {
    'use strict';
    
    // DOM Elements
    let timelineContainer;
    let timelineNodes = [];
    let currentView = 'vertical';
    let timelineProgress;
    let horizontalProgress;
    let modalElement;
    let filterOptions = {
        education: true,
        work: true,
        awards: true,
        projects: true,
        certifications: true
    };
    let zoomLevel = 3;
    let currentYear = 2021;
    
    // Timeline data (could be loaded from an external JSON file)
    const timelineData = [
        {
            id: 1,
            category: 'education',
            title: 'Master\'s Degree in Computer Science',
            subtitle: 'Stanford University',
            description: 'Specialized in AI and Machine Learning with a focus on neural networks.',
            startDate: '2023-01-01',
            endDate: '2025-01-01',
            dateDisplay: '2023 - 2025',
            year: 2023,
            importance: 5,
            stats: [
                { label: 'GPA', value: '3.9' },
                { label: 'Papers', value: '2' },
                { label: 'Projects', value: '4' }
            ],
            tags: ['Machine Learning', 'Neural Networks', 'Research'],
            media: {
                type: 'image',
                url: 'images/stanford-campus.jpg',
                count: 5
            }
        },
        {
            id: 2,
            category: 'work',
            title: 'Senior Frontend Developer',
            subtitle: 'Google, Mountain View',
            description: 'Led a team of developers in creating next-generation web applications.',
            startDate: '2022-03-01',
            endDate: '2023-12-31',
            dateDisplay: '2022 - 2023',
            year: 2022,
            importance: 4,
            achievements: [
                'Improved app performance by 40%',
                'Led migration from Angular to React',
                'Mentored 12 junior developers'
            ],
            tags: ['React', 'TypeScript', 'WebAssembly'],
            chartData: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                datasets: [
                    {
                        label: 'Performance Gains',
                        data: [10, 25, 35, 40],
                        borderColor: '#4169e1'
                    }
                ]
            }
        },
        {
            id: 3,
            category: 'awards',
            title: 'Developer of the Year',
            subtitle: 'TechCrunch Awards',
            description: 'Recognized for outstanding contributions to open source and web technologies.',
            date: '2021-12-15',
            dateDisplay: 'December 2021',
            year: 2021,
            importance: 5,
            media: {
                type: 'video',
                url: 'images/award-ceremony.jpg',
                videoTitle: 'Award Speech'
            },
            quote: {
                text: 'A visionary developer whose work has significantly advanced the field of web development.',
                attribution: 'TechCrunch Committee'
            },
            tags: ['Recognition', 'Open Source', 'Innovation']
        },
        {
            id: 4,
            category: 'projects',
            title: 'AI-Powered Accessibility Tool',
            subtitle: 'Open Source Project',
            description: 'Created a tool that translates visual content into audio descriptions for visually impaired users.',
            startDate: '2020-03-01',
            endDate: '2020-07-31',
            dateDisplay: 'March 2020 - July 2020',
            year: 2020,
            importance: 3,
            githubStats: {
                stars: '2.4k',
                forks: '420',
                contributors: '32'
            },
            techStack: ['Python', 'TensorFlow', 'React', 'Node.js'],
            techIcons: [
                { name: 'Python', icon: 'fab fa-python' },
                { name: 'TensorFlow', image: 'images/tensorflow.svg' },
                { name: 'React', icon: 'fab fa-react' },
                { name: 'Node.js', icon: 'fab fa-node-js' }
            ],
            tags: ['Accessibility', 'AI', 'Open Source']
        },
        {
            id: 5,
            category: 'certifications',
            title: 'AWS Solutions Architect Professional',
            subtitle: 'Amazon Web Services',
            description: 'Certified as a professional-level solutions architect for AWS cloud services.',
            date: '2019-08-15',
            dateDisplay: 'August 2019',
            year: 2019,
            importance: 2,
            credential: {
                id: 'AWS-PSA-7823941',
                issued: 'August 2019',
                expires: 'August 2022',
                logo: 'images/aws-logo.svg',
                badge: 'images/aws-badge.png'
            },
            skills: [
                { name: 'Cloud Architecture', level: 95 },
                { name: 'Security & Compliance', level: 90 },
                { name: 'Cost Optimization', level: 85 }
            ],
            tags: ['AWS', 'Cloud', 'Architecture']
        }
    ];
    
    // Initialize the timeline
    function initTimeline() {
        // Cache DOM elements
        timelineContainer = document.querySelector('.timeline-container');
        if (!timelineContainer) return;
        
        timelineProgress = document.querySelector('.timeline-progress');
        horizontalProgress = document.querySelector('.horizontal-progress');
        modalElement = document.getElementById('timeline-details-modal');
        
        // Set up event listeners
        setupEventListeners();
        
        // Render vertical timeline (default view)
        renderVerticalTimeline();
        
        // Render the horizontal timeline
        renderHorizontalTimeline();
        
        // Render the radial timeline
        renderRadialTimeline();
        
        // Initialize the timeline progress
        initTimelineProgress();
        
        // Check if any timeline nodes are in viewport
        checkTimelineNodesVisibility();
        
        // Initialize charts if any
        initCharts();
        
        console.log('Advanced Timeline initialized - nicknet06 - 2025-03-23 12:31:18');
    }
    
    // Set up event listeners
    function setupEventListeners() {
        // View buttons
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const view = this.getAttribute('data-view');
                changeTimelineView(view);
                
                // Update active state
                viewButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Filter checkboxes
        const filterCheckboxes = document.querySelectorAll('.filter-option input');
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const filter = this.getAttribute('data-filter');
                filterOptions[filter] = this.checked;
                applyFilters();
            });
        });
        
        // Search input
        const searchInput = document.querySelector('.timeline-search');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(function() {
                searchTimeline(this.value);
            }, 300));
        }
        
        // Zoom controls
        const zoomSlider = document.querySelector('.zoom-slider');
        if (zoomSlider) {
            zoomSlider.addEventListener('input', function() {
                zoomLevel = parseInt(this.value);
                applyZoom();
            });
        }
        
        const zoomButtons = document.querySelectorAll('.zoom-btn');
        zoomButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const direction = this.getAttribute('data-zoom');
                if (direction === 'in' && zoomLevel < 5) {
                    zoomLevel++;
                } else if (direction === 'out' && zoomLevel > 1) {
                    zoomLevel--;
                }
                
                if (zoomSlider) {
                    zoomSlider.value = zoomLevel;
                }
                
                applyZoom();
            });
        });
        
        // Decade buttons
        const decadeButtons = document.querySelectorAll('.decade-btn');
        decadeButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const year = parseInt(this.getAttribute('data-year'));
                navigateToYear(year);
                
                // Update active state
                decadeButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Timeline slider
        const timelineSlider = document.querySelector('.timeline-slider');
        if (timelineSlider) {
            timelineSlider.addEventListener('input', function() {
                const year = parseInt(this.value);
                navigateToYear(year, false);
                
                // Update decade buttons
                const decadeButtons = document.querySelectorAll('.decade-btn');
                decadeButtons.forEach(btn => {
                    const btnYear = parseInt(btn.getAttribute('data-year'));
                    btn.classList.toggle('active', btnYear === Math.floor(year / 3) * 3);
                });
            });
        }
        
        // Timeline details buttons
        document.addEventListener('click', function(e) {
            if (e.target.closest('.timeline-details-btn')) {
                const node = e.target.closest('.timeline-node');
                if (node) {
                    const nodeId = node.getAttribute('data-id');
                    openTimelineModal(nodeId);
                }
            }
        });
        
        // Modal close button
        const modalCloseBtn = document.querySelector('.modal-close-btn');
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', closeTimelineModal);
        }
        
        // Modal backdrop click
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', closeTimelineModal);
        }
        
        // Modal navigation buttons
        const modalPrevBtn = document.querySelector('.modal-prev-btn');
        const modalNextBtn = document.querySelector('.modal-next-btn');
        
        if (modalPrevBtn) {
            modalPrevBtn.addEventListener('click', navigateToPrevNode);
        }
        
        if (modalNextBtn) {
            modalNextBtn.addEventListener('click', navigateToNextNode);
        }
        
        // Share buttons
        document.addEventListener('click', function(e) {
            if (e.target.closest('[data-action="share"]')) {
                const node = e.target.closest('.timeline-node');
                if (node) {
                    const nodeId = node.getAttribute('data-id');
                    shareTimelineNode(nodeId);
                }
            }
        });
        
        // Expand buttons
        document.addEventListener('click', function(e) {
            if (e.target.closest('[data-action="expand"]')) {
                const node = e.target.closest('.timeline-node');
                if (node) {
                    const nodeId = node.getAttribute('data-id');
                    openTimelineModal(nodeId);
                }
            }
        });
        
        // Window scroll and resize events
        window.addEventListener('scroll', throttle(function() {
            checkTimelineNodesVisibility();
            updateTimelineProgress();
        }, 100));
        
        window.addEventListener('resize', debounce(function() {
            updateTimelineDimensions();
        }, 200));
        
        // Add 3D effect to cards if enabled
        if (document.body.classList.contains('card-effects-enabled')) {
            add3DEffectToCards();
        }
    }
    
    // Render vertical timeline
    function renderVerticalTimeline() {
        const verticalTimeline = document.getElementById('vertical-timeline');
        if (!verticalTimeline) return;
        
        const timelineTrack = verticalTimeline.querySelector('.timeline-track');
        if (!timelineTrack) return;
        
        // Clear existing nodes
        const existingNodes = timelineTrack.querySelectorAll('.timeline-node');
        existingNodes.forEach(node => node.remove());
        
        // Sort data by year (descending)
        const sortedData = [...timelineData].sort((a, b) => b.year - a.year);
        
        // Create timeline nodes
        sortedData.forEach(item => {
            const node = createTimelineNode(item);
            timelineTrack.appendChild(node);
        });
        
        // Cache nodes for later use
        timelineNodes = document.querySelectorAll('.timeline-node');
    }
    
    // Create timeline node element
    function createTimelineNode(item) {
        const node = document.createElement('div');
        node.className = 'timeline-node';
        node.setAttribute('data-category', item.category);
        node.setAttribute('data-year', item.year);
        node.setAttribute('data-importance', item.importance);
        node.setAttribute('data-id', item.id);
        
        const nodeHTML = `
            <div class="timeline-pulse"></div>
            <div class="timeline-node-point">
                <i class="${getCategoryIcon(item.category)}"></i>
            </div>
            <div class="timeline-content">
                <div class="timeline-card">
                    <div class="timeline-card-header">
                        <div class="timeline-date">${item.dateDisplay}</div>
                        <div class="timeline-category">
                            <span class="badge ${item.category}">${formatCategory(item.category)}</span>
                        </div>
                        <div class="timeline-actions">
                            <button class="timeline-action-btn" data-action="share">
                                <i class="fas fa-share-alt"></i>
                            </button>
                            <button class="timeline-action-btn" data-action="expand">
                                <i class="fas fa-expand-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="timeline-card-body">
                        <h3 class="timeline-title">${item.title}</h3>
                        <h4 class="timeline-subtitle">${item.subtitle}</h4>
                        <div class="timeline-details">
                            <p>${item.description}</p>
                            ${renderTimelineItemContent(item)}
                        </div>
                    </div>
                    <div class="timeline-card-footer">
                        <div class="timeline-tags">
                            ${item.tags.map(tag => `<span class="timeline-tag">${tag}</span>`).join('')}
                        </div>
                        <button class="timeline-details-btn">
                            <span>View Details</span>
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        node.innerHTML = nodeHTML;
        return node;
    }
    
    // Render specific content based on item type
    function renderTimelineItemContent(item) {
        let content = '';
        
        // Add media (image or video)
        if (item.media) {
            if (item.media.type === 'image') {
                content += `
                    <div class="timeline-media">
                        <div class="media-thumbnail" style="background-image: url('${item.media.url}')">
                            <div class="media-overlay">
                                <i class="fas fa-images"></i>
                                <span>${item.media.count} Photos</span>
                            </div>
                        </div>
                    </div>
                `;
            } else if (item.media.type === 'video') {
                content += `
                    <div class="timeline-media">
                        <div class="video-thumbnail" style="background-image: url('${item.media.url}')">
                            <div class="video-play-button">
                                <i class="fas fa-play"></i>
                            </div>
                            <div class="media-overlay">
                                <i class="fas fa-video"></i>
                                <span>${item.media.videoTitle}</span>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
        
        // Add quote
        if (item.quote) {
            content += `
                <div class="timeline-quote">
                    <i class="fas fa-quote-left"></i>
                    <p>"${item.quote.text}"</p>
                    <div class="quote-attribution">— ${item.quote.attribution}</div>
                </div>
            `;
        }
        
        // Add stats
        if (item.stats) {
            content += `
                <div class="timeline-stats">
                    ${item.stats.map(stat => `
                        <div class="stat-item">
                            <div class="stat-value">${stat.value}</div>
                            <div class="stat-label">${stat.label}</div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        // Add achievements
        if (item.achievements) {
            content += `
                <div class="timeline-achievements">
                    ${item.achievements.map(achievement => `
                        <div class="achievement-item">
                            <i class="fas fa-check-circle"></i>
                            <span>${achievement}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        // Add GitHub stats
        if (item.githubStats) {
            content += `
                <div class="timeline-github-stats">
                    <div class="github-stat">
                        <i class="fas fa-star"></i>
                        <span>${item.githubStats.stars} Stars</span>
                    </div>
                    <div class="github-stat">
                        <i class="fas fa-code-branch"></i>
                        <span>${item.githubStats.forks} Forks</span>
                    </div>
                    <div class="github-stat">
                        <i class="fas fa-users"></i>
                        <span>${item.githubStats.contributors} Contributors</span>
                    </div>
                </div>
            `;
        }
        
        // Add tech stack
        if (item.techIcons) {
            content += `
                <div class="timeline-tech-stack">
                    <div class="tech-stack-title">Tech Stack:</div>
                    <div class="tech-icons">
                        ${item.techIcons.map(tech => {
                            if (tech.icon) {
                                return `
                                    <div class="tech-icon" title="${tech.name}">
                                        <i class="${tech.icon}"></i>
                                    </div>
                                `;
                            } else if (tech.image) {
                                return `
                                    <div class="tech-icon" title="${tech.name}">
                                        <img src="${tech.image}" alt="${tech.name}">
                                    </div>
                                `;
                            }
                            return '';
                        }).join('')}
                    </div>
                </div>
            `;
        }
        
        // Add chart
        if (item.chartData) {
            content += `
                <div class="timeline-chart">
                    <canvas class="performance-chart" width="300" height="150" data-chart='${JSON.stringify(item.chartData)}'></canvas>
                    <div class="chart-caption">Project Performance Metrics</div>
                </div>
            `;
        }
        
        // Add credential
        if (item.credential) {
            content += `
                <div class="timeline-credential">
                    <div class="credential-logo">
                        <img src="${item.credential.logo}" alt="Credential Logo">
                    </div>
                    <div class="credential-details">
                        <div class="credential-id">Credential ID: ${item.credential.id}</div>
                        <div class="credential-issued">Issued: ${item.credential.issued}</div>
                        <div class="credential-expires">Expires: ${item.credential.expires}</div>
                    </div>
                    <div class="credential-badge">
                        <img src="${item.credential.badge}" alt="Credential Badge">
                    </div>
                </div>
            `;
        }
        
        // Add skills
        if (item.skills) {
            content += `
                <div class="timeline-skills">
                    ${item.skills.map(skill => `
                        <div class="skill-item">
                            <div class="skill-name">${skill.name}</div>
                            <div class="skill-bar">
                                <div class="skill-progress" style="width: ${skill.level}%"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        return content;
    }
    
    // Render horizontal timeline
    function renderHorizontalTimeline() {
        const horizontalTimeline = document.getElementById('horizontal-timeline');
        if (!horizontalTimeline) return;
        
        const horizontalNodes = horizontalTimeline.querySelector('.horizontal-nodes');
        if (!horizontalNodes) return;
        
        // Clear existing nodes
        horizontalNodes.innerHTML = '';
        
        // Sort data by year (ascending)
        const sortedData = [...timelineData].sort((a, b) => a.year - b.year);
        
        // Calculate positions
        const minYear = Math.min(...sortedData.map(item => item.year));
        const maxYear = Math.max(...sortedData.map(item => item.year));
        const timespan = maxYear - minYear;
        
        // Create timeline nodes
        sortedData.forEach(item => {
            const position = ((item.year - minYear) / timespan) * 100;
            
            const node = document.createElement('div');
            node.className = 'horizontal-node';
            node.setAttribute('data-id', item.id);
            node.setAttribute('data-category', item.category);
            node.setAttribute('data-year', item.year);
            node.style.position = 'absolute';
            node.style.left = `${position}%`;
            node.style.top = item.category === 'education' || item.category === 'awards' ? '30px' : '150px';
            node.innerHTML = `
                <div class="horizontal-node-point">
                    <i class="${getCategoryIcon(item.category)}"></i>
                </div>
                <div class="horizontal-node-label">${item.title}</div>
            `;
            
            // Add click event
            node.addEventListener('click', function() {
                showHorizontalDetails(item.id);
            });
            
            horizontalNodes.appendChild(node);
        });
    }
    
    // Render radial timeline
    function renderRadialTimeline() {
        const radialTimeline = document.getElementById('radial-timeline');
        if (!radialTimeline) return;
        
        const radialContainer = radialTimeline.querySelector('.radial-container');
        const radialOrbits = radialTimeline.querySelector('.radial-orbits');
        const radialNodes = radialTimeline.querySelector('.radial-nodes');
        const radialCenter = radialTimeline.querySelector('.radial-center-content');
        
        if (!radialContainer || !radialOrbits || !radialNodes || !radialCenter) return;
        
        // Clear existing content
        radialOrbits.innerHTML = '';
        radialNodes.innerHTML = '';
        
        // Set center year
        radialCenter.querySelector('.radial-year').textContent = currentYear;
        
        // Sort data by year
        const sortedData = [...timelineData].sort((a, b) => a.year - b.year);
        
        // Create orbits
        const years = [...new Set(sortedData.map(item => item.year))];
        years.forEach((year, index) => {
            const orbit = document.createElement('div');
            orbit.className = 'radial-orbit';
            orbit.setAttribute('data-year', year);
            
            // Calculate orbit size
            const size = 150 + (index * 100);
            orbit.style.width = `${size}px`;
            orbit.style.height = `${size}px`;
            
            // Highlight current year orbit
            if (year === currentYear) {
                orbit.style.borderColor = 'var(--timeline-primary)';
                orbit.style.borderWidth = '2px';
                orbit.style.borderStyle = 'solid';
            }
            
            radialOrbits.appendChild(orbit);
        });
        
        // Create nodes
        sortedData.forEach((item, index) => {
            // Calculate node position on its orbit
            const orbitIndex = years.indexOf(item.year);
            const orbitSize = 150 + (orbitIndex * 100);
            const angle = (index % 8) * (360 / 8) * (Math.PI / 180); // Convert to radians
            
            const x = Math.cos(angle) * (orbitSize / 2);
            const y = Math.sin(angle) * (orbitSize / 2);
            
            const node = document.createElement('div');
            node.className = 'radial-node';
            node.setAttribute('data-id', item.id);
            node.setAttribute('data-category', item.category);
            node.setAttribute('data-year', item.year);
            node.style.position = 'absolute';
            node.style.top = `calc(50% + ${y}px)`;
            node.style.left = `calc(50% + ${x}px)`;
            node.style.transform = 'translate(-50%, -50%)';
            
            node.innerHTML = `
                <div class="radial-node-point">
                    <i class="${getCategoryIcon(item.category)}"></i>
                </div>
            `;
            
            // Add click event
            node.addEventListener('click', function() {
                showRadialDetails(item.id);
            });
            
            radialNodes.appendChild(node);
        });
    }
    
    // Initialize timeline progress
    function initTimelineProgress() {
        if (timelineProgress) {
            // Animate progress line on load
            setTimeout(() => {
                timelineProgress.style.height = '100%';
            }, 500);
        }
        
        if (horizontalProgress) {
            // Animate progress line on load
            setTimeout(() => {
                horizontalProgress.style.width = '100%';
            }, 500);
        }
    }
    
    // Check if timeline nodes are in viewport
    function checkTimelineNodesVisibility() {
        if (!timelineNodes.length) return;
        
        timelineNodes.forEach(node => {
            if (isElementInViewport(node)) {
                node.classList.add('visible');
            }
        });
    }
    
    // Update timeline progress based on scroll position
    function updateTimelineProgress() {
        if (!timelineProgress) return;
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const trackStart = timelineProgress.parentElement.offsetTop;
        const trackHeight = timelineProgress.parentElement.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Calculate progress percentage based on scroll position
        let progress = (scrollTop + windowHeight - trackStart) / trackHeight;
        progress = Math.min(Math.max(progress, 0), 1); // Clamp between 0 and 1
        
        timelineProgress.style.height = `${progress * 100}%`;
    }
    
    // Change timeline view
    function changeTimelineView(view) {
        if (currentView === view) return;
        
        const views = document.querySelectorAll('.timeline-view');
        views.forEach(v => v.classList.remove('active'));
        
        const newView = document.getElementById(`${view}-timeline`);
        if (newView) {
            newView.classList.add('active');
            currentView = view;
            
            // Additional view-specific initializations
            if (view === 'horizontal') {
                updateHorizontalTimelineView();
            } else if (view === 'radial') {
                updateRadialTimelineView();
            }
        }
    }
    
    // Apply filters to timeline nodes
    function applyFilters() {
        timelineNodes.forEach(node => {
            const category = node.getAttribute('data-category');
            const visible = filterOptions[category];
            
            node.style.display = visible ? '' : 'none';
        });
        
        // Update horizontal and radial views as well
        if (currentView === 'horizontal') {
            updateHorizontalTimelineView();
        } else if (currentView === 'radial') {
            updateRadialTimelineView();
        }
    }
    
    // Search timeline
    function searchTimeline(query) {
        if (!query) {
            // Reset all nodes to their filtered state
            timelineNodes.forEach(node => {
                const category = node.getAttribute('data-category');
                node.style.display = filterOptions[category] ? '' : 'none';
            });
            return;
        }
        
        query = query.toLowerCase();
        
        timelineNodes.forEach(node => {
            const nodeId = node.getAttribute('data-id');
            const item = timelineData.find(d => d.id.toString() === nodeId);
            
            if (!item) return;
            
            // Search in title, subtitle, description, and tags
            const searchText = `
                ${item.title} ${item.subtitle} ${item.description} 
                ${item.tags.join(' ')}
            `.toLowerCase();
            
            const match = searchText.includes(query);
            const categoryVisible = filterOptions[item.category];
            
            node.style.display = (match && categoryVisible) ? '' : 'none';
        });
    }
    
    // Apply zoom level
    function applyZoom() {
        document.documentElement.style.setProperty('--timeline-card-width', `${350 + (zoomLevel * 50)}px`);
        document.documentElement.style.setProperty('--timeline-node-size', `${40 + (zoomLevel * 5)}px`);
    }
    
    // Navigate to specific year
    function navigateToYear(year, updateSlider = true) {
        currentYear = year;
        
        // Update year display
        const radialYearDisplay = document.querySelector('.radial-year');
        if (radialYearDisplay) {
            radialYearDisplay.textContent = year;
        }
        
        // Update slider if needed
        if (updateSlider) {
            const timelineSlider = document.querySelector('.timeline-slider');
            if (timelineSlider) {
                timelineSlider.value = year;
            }
        }
        
        // Scroll to the first visible node from that year
        const nodes = document.querySelectorAll(`.timeline-node[data-year="${year}"]`);
        if (nodes.length && currentView === 'vertical') {
            let visibleNode = null;
            
            for (let i = 0; i < nodes.length; i++) {
                const category = nodes[i].getAttribute('data-category');
                if (filterOptions[category]) {
                    visibleNode = nodes[i];
                    break;
                }
            }
            
            if (visibleNode) {
                visibleNode.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        // Update radial view
        if (currentView === 'radial') {
            updateRadialTimelineView();
        }
    }
    
    // Update horizontal timeline view
    function updateHorizontalTimelineView() {
        const horizontalNodes = document.querySelectorAll('.horizontal-node');
        
        horizontalNodes.forEach(node => {
            const category = node.getAttribute('data-category');
            node.style.display = filterOptions[category] ? '' : 'none';
        });
    }
    
    // Update radial timeline view
    function updateRadialTimelineView() {
        // Update center year
        const radialYearDisplay = document.querySelector('.radial-year');
        if (radialYearDisplay) {
            radialYearDisplay.textContent = currentYear;
        }
        
        // Update orbits
        const orbits = document.querySelectorAll('.radial-orbit');
        orbits.forEach(orbit => {
            const orbitYear = parseInt(orbit.getAttribute('data-year'));
            orbit.style.borderColor = orbitYear === currentYear ? 'var(--timeline-primary)' : '';
            orbit.style.borderWidth = orbitYear === currentYear ? '2px' : '1px';
            orbit.style.borderStyle = orbitYear === currentYear ? 'solid' : 'dashed';
        });
        
        // Update nodes
        const radialNodes = document.querySelectorAll('.radial-node');
        radialNodes.forEach(node => {
            const category = node.getAttribute('data-category');
            const nodeYear = parseInt(node.getAttribute('data-year'));
            
            // Filter by category and highlight by year
            node.style.display = filterOptions[category] ? '' : 'none';
            node.classList.toggle('highlight', nodeYear === currentYear);
        });
    }
    
    // Show horizontal timeline details
    function showHorizontalDetails(id) {
        const horizontalDetails = document.querySelector('.horizontal-details-container');
        if (!horizontalDetails) return;
        
        const item = timelineData.find(d => d.id.toString() === id.toString());
        if (!item) return;
        
        horizontalDetails.innerHTML = `
            <div class="timeline-card">
                <div class="timeline-card-header">
                    <div class="timeline-date">${item.dateDisplay}</div>
                    <div class="timeline-category">
                        <span class="badge ${item.category}">${formatCategory(item.category)}</span>
                    </div>
                </div>
                <div class="timeline-card-body">
                    <h3 class="timeline-title">${item.title}</h3>
                    <h4 class="timeline-subtitle">${item.subtitle}</h4>
                    <div class="timeline-details">
                        <p>${item.description}</p>
                        ${renderTimelineItemContent(item)}
                    </div>
                </div>
                <div class="timeline-card-footer">
                    <div class="timeline-tags">
                        ${item.tags.map(tag => `<span class="timeline-tag">${tag}</span>`).join('')}
                    </div>
                    <button class="timeline-details-btn" data-id="${item.id}">
                        <span>View Details</span>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Attach event listener to the details button
        const detailsBtn = horizontalDetails.querySelector('.timeline-details-btn');
        if (detailsBtn) {
            detailsBtn.addEventListener('click', function() {
                openTimelineModal(item.id);
            });
        }
        
        // Initialize charts if needed
        initCharts();
        
        // Add 3D effect if enabled
        if (document.body.classList.contains('card-effects-enabled')) {
            add3DEffectToCards();
        }
    }
    
    // Show radial timeline details
    function showRadialDetails(id) {
        const radialDetails = document.querySelector('.radial-details-container');
        if (!radialDetails) return;
        
        const item = timelineData.find(d => d.id.toString() === id.toString());
        if (!item) return;
        
        radialDetails.innerHTML = `
            <div class="timeline-card">
                <div class="timeline-card-header">
                    <div class="timeline-date">${item.dateDisplay}</div>
                    <div class="timeline-category">
                        <span class="badge ${item.category}">${formatCategory(item.category)}</span>
                    </div>
                </div>
                <div class="timeline-card-body">
                    <h3 class="timeline-title">${item.title}</h3>
                    <h4 class="timeline-subtitle">${item.subtitle}</h4>
                    <div class="timeline-details">
                        <p>${item.description}</p>
                    </div>
                </div>
                <div class="timeline-card-footer">
                    <button class="timeline-details-btn" data-id="${item.id}">
                        <span>View Details</span>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Attach event listener to the details button
        const detailsBtn = radialDetails.querySelector('.timeline-details-btn');
        if (detailsBtn) {
            detailsBtn.addEventListener('click', function() {
                openTimelineModal(item.id);
            });
        }
        
        // Add 3D effect if enabled
        if (document.body.classList.contains('card-effects-enabled')) {
            add3DEffectToCards();
        }
    }
    
    // Open timeline details modal
    function openTimelineModal(id) {
        if (!modalElement) return;
        
        const item = timelineData.find(d => d.id.toString() === id.toString());
        if (!item) return;
        
        // Update modal content
        const modalBody = modalElement.querySelector('.modal-body');
        const modalCategory = modalElement.querySelector('.modal-category');
        
        if (modalBody && modalCategory) {
            modalCategory.innerHTML = `<span class="badge ${item.category}">${formatCategory(item.category)}</span>`;
            
            modalBody.innerHTML = `
                <div class="modal-date">${item.dateDisplay}</div>
                <h2 class="modal-title">${item.title}</h2>
                <h3 class="modal-subtitle">${item.subtitle}</h3>
                <div class="modal-description">
                    <p>${item.description}</p>
                    ${renderTimelineItemContent(item)}
                </div>
                <div class="modal-tags">
                    ${item.tags.map(tag => `<span class="timeline-tag">${tag}</span>`).join('')}
                </div>
            `;
        }
        
        // Show modal
        modalElement.classList.add('active');
        
        // Add event data for navigation
        modalElement.setAttribute('data-current-id', item.id);
        
        // Prevent body scrolling
        document.body.style.overflow = 'hidden';
        
        // Initialize charts if needed
        initCharts();
    }
    
    // Close timeline modal
    function closeTimelineModal() {
        if (!modalElement) return;
        
        modalElement.classList.remove('active');
        
        // Restore body scrolling
        document.body.style.overflow = '';
    }
    
    // Navigate to previous node in modal
    function navigateToPrevNode() {
        if (!modalElement) return;
        
        const currentId = parseInt(modalElement.getAttribute('data-current-id'));
        const currentIndex = timelineData.findIndex(item => item.id === currentId);
        
        if (currentIndex > 0) {
            const prevItem = timelineData[currentIndex - 1];
            openTimelineModal(prevItem.id);
        }
    }
    
    // Navigate to next node in modal
    function navigateToNextNode() {
        if (!modalElement) return;
        
        const currentId = parseInt(modalElement.getAttribute('data-current-id'));
        const currentIndex = timelineData.findIndex(item => item.id === currentId);
        
        if (currentIndex < timelineData.length - 1) {
            const nextItem = timelineData[currentIndex + 1];
            openTimelineModal(nextItem.id);
        }
    }
    
    // Share timeline node
    function shareTimelineNode(id) {
        const item = timelineData.find(d => d.id.toString() === id.toString());
        if (!item) return;
        
        // Create share data
        const shareData = {
            title: `${item.title} - My Timeline`,
            text: `Check out ${item.title} at ${item.subtitle} (${item.dateDisplay})`,
            url: `${window.location.href.split('#')[0]}#timeline-${id}`
        };
        
        // Use Web Share API if available
        if (navigator.share) {
            navigator.share(shareData)
                .catch(error => console.log('Error sharing:', error));
        } else {
            // Fallback: copy to clipboard
            const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
            copyToClipboard(shareText);
            
            // Show a temporary notification
            showNotification('Link copied to clipboard!');
        }
    }
    
    // Copy text to clipboard
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
    
    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'timeline-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('active');
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Initialize charts
    function initCharts() {
        if (typeof Chart === 'undefined') return;
        
        const chartCanvases = document.querySelectorAll('.performance-chart');
        chartCanvases.forEach(canvas => {
            // Skip already initialized charts
            if (canvas.chart) return;
            
            const chartData = JSON.parse(canvas.getAttribute('data-chart'));
            if (!chartData) return;
            
            // Create chart
            const ctx = canvas.getContext('2d');
            canvas.chart = new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        });
    }
    
    // Update timeline dimensions on resize
    function updateTimelineDimensions() {
        // Recalculate positions for horizontal timeline
        if (currentView === 'horizontal') {
            renderHorizontalTimeline();
        } else if (currentView === 'radial') {
            renderRadialTimeline();
        }
        
        // Update zoom
        applyZoom();
    }
    
    // Add 3D effect to cards
    function add3DEffectToCards() {
        const cards = document.querySelectorAll('.timeline-card');
        
        cards.forEach(card => {
            // Skip already initialized cards
            if (card.getAttribute('data-3d-initialized')) return;
            
            card.setAttribute('data-3d-initialized', 'true');
            
            card.addEventListener('mousemove', function(e) {
                if (!document.body.classList.contains('card-effects-enabled')) return;
                
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const deltaX = (x - centerX) / centerX;
                const deltaY = (y - centerY) / centerY;
                
                this.style.transform = `perspective(800px) rotateX(${-deltaY * 8}deg) rotateY(${deltaX * 8}deg) scale3d(1.02, 1.02, 1.02)`;
                
                // Add highlight effect
                const intensity = 0.2;
                this.style.background = `
                    radial-gradient(
                        circle at ${x}px ${y}px,
                        rgba(var(--color-primary-rgb), ${intensity}) 0%,
                        transparent 80%
                    ),
                    var(--card-bg)
                `;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.background = '';
            });
        });
    }
    
    // Helper function: Get icon for category
    function getCategoryIcon(category) {
        switch (category) {
            case 'education': return 'fas fa-graduation-cap';
            case 'work': return 'fas fa-briefcase';
            case 'awards': return 'fas fa-trophy';
            case 'projects': return 'fas fa-project-diagram';
            case 'certifications': return 'fas fa-certificate';
            default: return 'fas fa-calendar-alt';
        }
    }
    
    // Helper function: Format category name
    function formatCategory(category) {
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
    
    // Helper function: Check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0 &&
            rect.left >= 0 &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Helper function: Debounce
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    // Helper function: Throttle
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const context = this;
            const args = arguments;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Initialize when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', initTimeline);
    
    // Export public API
    window.advancedTimeline = {
        init: initTimeline,
        changeView: changeTimelineView,
        navigateToYear: navigateToYear,
        applyFilters: applyFilters,
        applyZoom: applyZoom
    };
    
})();

console.log('Advanced Timeline initialized - nicknet06 - 2025-03-23 12:31:18');