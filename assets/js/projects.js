/**
 * Projects Section JavaScript
 * Enhanced functionality for project pages
 */

class ProjectsManager {
    constructor() {
        this.init();
        this.bindEvents();
        this.setupAnimations();
    }

    init() {
        this.currentFilter = 'all';
        this.currentTab = 'overview';
        this.projects = [];
        this.isLoading = false;
        
        // Initialize components
        this.initializeCounters();
        this.initializeProgressBars();
        this.initializeTabs();
        this.initializeFilters();
        this.initializeGallery();
        this.initializeForms();
    }

    bindEvents() {
        // Window events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Form events
        document.addEventListener('submit', this.handleFormSubmit.bind(this));
        
        // Click events
        document.addEventListener('click', this.handleClick.bind(this));
        
        // Keyboard events
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    setupAnimations() {
        // Setup intersection observer for animations
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver(
            this.handleIntersection.bind(this),
            this.observerOptions
        );

        // Observe elements
        this.observeElements();
    }

    // ===== INITIALIZATION METHODS =====

    initializeCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        counters.forEach(counter => {
            this.observer.observe(counter);
        });
    }

    initializeProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            this.observer.observe(bar);
        });
    }

    initializeTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', this.handleTabClick.bind(this));
        });
    }

    initializeFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', this.handleFilterClick.bind(this));
        });
    }

    initializeGallery() {
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', this.handleThumbnailClick.bind(this));
        });
    }

    initializeForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            this.setupFormValidation(form);
        });
    }

    // ===== EVENT HANDLERS =====

    handleScroll() {
        const header = document.getElementById('main-header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Parallax effect for hero sections
        this.updateParallax();
    }

    handleResize() {
        // Recalculate layouts on resize
        this.updateLayoutOnResize();
    }

    handleClick(e) {
        // Handle various click events
        if (e.target.matches('.faq-btn')) {
            this.toggleFaq(e.target);
        }
        
        if (e.target.matches('.load-more-btn')) {
            this.loadMoreProjects();
        }
        
        if (e.target.matches('.ripple-effect')) {
            this.createRipple(e);
        }
    }

    handleKeydown(e) {
        // Handle keyboard navigation
        if (e.key === 'Escape') {
            this.closeModals();
        }
        
        if (e.key === 'Tab') {
            this.handleTabNavigation(e);
        }
    }

    handleFormSubmit(e) {
        if (e.target.matches('#feasibility-form')) {
            e.preventDefault();
            this.submitFeasibilityForm(e.target);
        }
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.hasAttribute('data-counter')) {
                    this.animateCounter(entry.target);
                }
                
                if (entry.target.classList.contains('progress-fill')) {
                    this.animateProgressBar(entry.target);
                }
                
                if (entry.target.classList.contains('project-card')) {
                    this.animateProjectCard(entry.target);
                }
            }
        });
    }

    // ===== TAB FUNCTIONALITY =====

    handleTabClick(e) {
        const tabId = e.target.getAttribute('data-tab');
        if (tabId) {
            this.switchTab(tabId);
        }
    }

    switchTab(tabId) {
        // Remove active class from all tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
            pane.classList.add('hidden');
        });
        
        // Add active class to current tab
        const activeBtn = document.querySelector(`[data-tab="${tabId}"]`);
        const activePane = document.getElementById(tabId);
        
        if (activeBtn && activePane) {
            activeBtn.classList.add('active');
            activePane.classList.remove('hidden');
            activePane.classList.add('active');
            
            // Trigger animations for the new tab
            this.triggerTabAnimations(activePane);
        }
        
        this.currentTab = tabId;
    }

    triggerTabAnimations(pane) {
        // Animate elements in the new tab
        const elements = pane.querySelectorAll('[data-aos]');
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('aos-animate');
            }, index * 100);
        });
    }

    // ===== FILTER FUNCTIONALITY =====

    handleFilterClick(e) {
        const filter = e.target.getAttribute('data-filter');
        if (filter) {
            this.applyFilter(filter);
        }
    }

    applyFilter(filter) {
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        // Filter projects
        this.filterProjects(filter);
        this.currentFilter = filter;
    }

    filterProjects(filter) {
        const projects = document.querySelectorAll('.project-card, .investment-project, .partnership-project, .purchase-project');
        
        projects.forEach(project => {
            if (filter === 'all' || project.classList.contains(filter)) {
                project.style.display = 'block';
                project.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                project.style.display = 'none';
            }
        });
        
        // Update results count
        this.updateResultsCount(filter);
    }

    updateResultsCount(filter) {
        const visibleProjects = document.querySelectorAll('.project-card:not([style*="display: none"])').length;
        const countElement = document.querySelector('.results-count');
        
        if (countElement) {
            countElement.textContent = `عرض ${visibleProjects} مشروع`;
        }
    }

    // ===== GALLERY FUNCTIONALITY =====

    handleThumbnailClick(e) {
        const thumbnail = e.target;
        const mainImage = document.getElementById('main-image');
        
        if (mainImage && thumbnail.src) {
            // Update main image
            mainImage.src = thumbnail.src;
            mainImage.alt = thumbnail.alt;
            
            // Update active thumbnail
            document.querySelectorAll('.thumbnail').forEach(thumb => {
                thumb.classList.remove('active');
            });
            thumbnail.classList.add('active');
            
            // Add transition effect
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.style.opacity = '1';
            }, 150);
        }
    }

    // ===== ANIMATION METHODS =====

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-counter'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
        
        // Remove from observer
        this.observer.unobserve(element);
    }

    animateProgressBar(element) {
        const targetWidth = element.getAttribute('data-width') || '75%';
        element.style.width = '0%';
        
        setTimeout(() => {
            element.style.width = targetWidth;
        }, 500);
        
        this.observer.unobserve(element);
    }

    animateProjectCard(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
        
        this.observer.unobserve(element);
    }

    // ===== FORM FUNCTIONALITY =====

    setupFormValidation(form) {
        const inputs = form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', this.validateField.bind(this));
            input.addEventListener('input', this.clearFieldError.bind(this));
        });
    }

    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        const isRequired = field.hasAttribute('required');
        
        if (isRequired && !value) {
            this.showFieldError(field, 'هذا الحقل مطلوب');
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showFieldError(field, 'يرجى إدخال بريد إلكتروني صحيح');
                return false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[+]?[\d\s-()]+$/;
            if (!phoneRegex.test(value)) {
                this.showFieldError(field, 'يرجى إدخال رقم هاتف صحيح');
                return false;
            }
        }
        
        this.clearFieldError(field);
        return true;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error text-red-600 text-sm mt-1';
        errorDiv.textContent = message;
        
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    submitFeasibilityForm(form) {
        // Validate all fields
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField({ target: input })) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showNotification('يرجى تصحيح الأخطاء في النموذج', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<div class="spinner"></div> جاري الإرسال...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            this.showNotification('تم إرسال طلبك بنجاح! سيتواصل معك فريقنا خلال 24 ساعة.', 'success');
            form.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    // ===== UTILITY METHODS =====

    toggleFaq(button) {
        const faqItem = button.closest('.faq-item');
        const content = faqItem.querySelector('.faq-content');
        const icon = button.querySelector('i');
        
        // Close all other FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                const otherContent = item.querySelector('.faq-content');
                const otherIcon = item.querySelector('i');
                otherContent.classList.add('hidden');
                otherIcon.classList.remove('fa-chevron-up');
                otherIcon.classList.add('fa-chevron-down');
            }
        });
        
        // Toggle current FAQ item
        content.classList.toggle('hidden');
        icon.classList.toggle('fa-chevron-down');
        icon.classList.toggle('fa-chevron-up');
    }

    loadMoreProjects() {
        const button = document.querySelector('.load-more-btn');
        if (button && !this.isLoading) {
            this.isLoading = true;
            
            const originalText = button.innerHTML;
            button.innerHTML = '<div class="spinner"></div> جاري التحميل...';
            
            // Simulate loading
            setTimeout(() => {
                this.addMoreProjects();
                button.innerHTML = originalText;
                this.isLoading = false;
            }, 1500);
        }
    }

    addMoreProjects() {
        // This would typically load more projects via AJAX
        console.log('Loading more projects...');
    }

    createRipple(e) {
        const button = e.target;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    updateParallax() {
        const parallaxElements = document.querySelectorAll('.parallax');
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rate = scrolled * -0.5;
            element.style.transform = `translateY(${rate}px)`;
        });
    }

    updateLayoutOnResize() {
        // Recalculate masonry layouts if needed
        const masonryContainers = document.querySelectorAll('.masonry');
        masonryContainers.forEach(container => {
            this.recalculateMasonry(container);
        });
    }

    observeElements() {
        // Observe project cards
        document.querySelectorAll('.project-card').forEach(card => {
            this.observer.observe(card);
        });
        
        // Observe benefit cards
        document.querySelectorAll('.benefit-card').forEach(card => {
            this.observer.observe(card);
        });
        
        // Observe pricing cards
        document.querySelectorAll('.pricing-card').forEach(card => {
            this.observer.observe(card);
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} fixed top-4 right-4 bg-white border-l-4 p-4 rounded shadow-lg z-50 transform translate-x-full transition-transform`;
        
        if (type === 'success') {
            notification.classList.add('border-green-500');
            notification.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-check-circle text-green-500 ml-2"></i>
                    <span>${message}</span>
                </div>
            `;
        } else if (type === 'error') {
            notification.classList.add('border-red-500');
            notification.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-exclamation-circle text-red-500 ml-2"></i>
                    <span>${message}</span>
                </div>
            `;
        } else {
            notification.classList.add('border-blue-500');
            notification.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-info-circle text-blue-500 ml-2"></i>
                    <span>${message}</span>
                </div>
            `;
        }
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 100);
        
        // Hide notification after 5 seconds
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    closeModals() {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
    }

    handleTabNavigation(e) {
        // Improve keyboard navigation
        const focusableElements = document.querySelectorAll(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    // ===== PUBLIC API =====

    // Method to programmatically switch tabs
    switchToTab(tabId) {
        this.switchTab(tabId);
    }

    // Method to programmatically apply filters
    filterBy(filter) {
        this.applyFilter(filter);
    }

    // Method to get current state
    getState() {
        return {
            currentFilter: this.currentFilter,
            currentTab: this.currentTab,
            isLoading: this.isLoading
        };
    }

    // Method to destroy the instance
    destroy() {
        this.observer.disconnect();
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('submit', this.handleFormSubmit);
        document.removeEventListener('click', this.handleClick);
        document.removeEventListener('keydown', this.handleKeydown);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.projectsManager = new ProjectsManager();
    console.log('Projects Manager initialized successfully!');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectsManager;
}
