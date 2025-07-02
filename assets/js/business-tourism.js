/**
 * Business Tourism JavaScript Module
 * Handles all interactive functionality for the business tourism section
 */

class BusinessTourismManager {
    constructor() {
        this.destinations = ['turkey', 'france', 'china', 'uae'];
        this.currentDestination = 'turkey';
        this.bookingData = {};
        this.notifications = [];
        this.animationObserver = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupIntersectionObserver();
        this.initializeCounters();
        this.setupFormValidation();
        this.initializeNotificationSystem();
        console.log('🌍 Business Tourism Manager initialized successfully');
    }

    setupEventListeners() {
        // Destination switching
        document.addEventListener('click', (e) => {
            if (e.target.closest('.destination-selector')) {
                this.handleDestinationSwitch(e);
            }
        });

        // Card hover effects
        document.addEventListener('mouseenter', (e) => {
            if (e.target.closest('.destination-card')) {
                this.handleCardHover(e.target.closest('.destination-card'), true);
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            if (e.target.closest('.destination-card')) {
                this.handleCardHover(e.target.closest('.destination-card'), false);
            }
        }, true);

        // Form interactions
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('booking-form')) {
                this.handleFormSubmission(e);
            }
        });

        // FAQ toggles
        document.addEventListener('click', (e) => {
            if (e.target.closest('.faq-question')) {
                this.toggleFAQ(e.target.closest('.faq-item'));
            }
        });

        // Notification close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('notification-close')) {
                this.closeNotification(e.target.closest('.notification'));
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Window events
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16));

        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }

    handleDestinationSwitch(e) {
        const destination = e.target.closest('.destination-selector').dataset.destination;
        if (destination && destination !== this.currentDestination) {
            this.switchDestination(destination);
        }
    }

    switchDestination(destination) {
        this.currentDestination = destination;
        
        // Update UI
        this.updateDestinationUI(destination);
        
        // Update content
        this.loadDestinationContent(destination);
        
        // Analytics
        this.trackDestinationSwitch(destination);
    }

    updateDestinationUI(destination) {
        // Update active states
        document.querySelectorAll('.destination-selector').forEach(selector => {
            selector.classList.toggle('active', selector.dataset.destination === destination);
        });

        // Update color scheme
        this.updateColorScheme(destination);
    }

    updateColorScheme(destination) {
        const colorSchemes = {
            turkey: { primary: '#dc2626', secondary: '#f87171' },
            france: { primary: '#2563eb', secondary: '#60a5fa' },
            china: { primary: '#eab308', secondary: '#fbbf24' },
            uae: { primary: '#059669', secondary: '#34d399' }
        };

        const scheme = colorSchemes[destination];
        if (scheme) {
            document.documentElement.style.setProperty('--bt-primary', scheme.primary);
            document.documentElement.style.setProperty('--bt-secondary', scheme.secondary);
        }
    }

    async loadDestinationContent(destination) {
        try {
            // Show loading state
            this.showLoadingState();
            
            // Simulate API call
            await this.delay(500);
            
            // Update content
            this.updateDestinationContent(destination);
            
            // Hide loading state
            this.hideLoadingState();
            
            // Re-initialize animations
            this.reinitializeAnimations();
            
        } catch (error) {
            console.error('Error loading destination content:', error);
            this.showNotification('حدث خطأ في تحميل المحتوى', 'error');
        }
    }

    updateDestinationContent(destination) {
        const contentData = this.getDestinationData(destination);
        
        // Update hero section
        this.updateHeroSection(contentData);
        
        // Update itinerary
        this.updateItinerary(contentData);
        
        // Update pricing
        this.updatePricing(contentData);
    }

    getDestinationData(destination) {
        const data = {
            turkey: {
                title: 'رحلة تركيا التجارية',
                subtitle: 'اكتشف الفرص التجارية والاستثمارية',
                description: 'رحلة شاملة إلى تركيا تتضمن زيارة المصانع والمعارض التجارية',
                duration: '7-15 أيام',
                priceFrom: '€1,500',
                highlights: ['زيارة المصانع', 'لقاءات تجارية', 'المعارض التجارية', 'الثقافة التركية']
            },
            france: {
                title: 'رحلة فرنسا التقنية',
                subtitle: 'التكنولوجيا والابتكار',
                description: 'استكشف التكنولوجيا والابتكار في فرنسا',
                duration: '8-15 أيام',
                priceFrom: '€2,200',
                highlights: ['شركات التكنولوجيا', 'مراكز الابتكار', 'الاستثمار', 'الثقافة الفرنسية']
            },
            china: {
                title: 'رحلة الصين الصناعية',
                subtitle: 'التصنيع ومعرض كانتون',
                description: 'اكتشف عالم التصنيع في الصين',
                duration: '10-21 أيام',
                priceFrom: '€1,800',
                highlights: ['المصانع الكبرى', 'معرض كانتون', 'شبكة التوريد', 'الثقافة الصينية']
            },
            uae: {
                title: 'رحلة الإمارات الاستثمارية',
                subtitle: 'الاستثمار والمناطق الحرة',
                description: 'استكشف الفرص الاستثمارية في الإمارات',
                duration: '6-14 أيام',
                priceFrom: '€1,200',
                highlights: ['المناطق الحرة', 'الاستثمار', 'الشركات', 'الثقافة الإماراتية']
            }
        };

        return data[destination] || data.turkey;
    }

    handleCardHover(card, isEntering) {
        if (isEntering) {
            card.style.transform = 'translateY(-15px) scale(1.02)';
            card.style.boxShadow = 'var(--bt-shadow-lg)';
            
            // Animate flag
            const flag = card.querySelector('.destination-flag');
            if (flag) {
                flag.style.transform = 'scale(1.2) rotate(10deg)';
            }
        } else {
            card.style.transform = 'translateY(0) scale(1)';
            card.style.boxShadow = 'var(--bt-shadow)';
            
            // Reset flag
            const flag = card.querySelector('.destination-flag');
            if (flag) {
                flag.style.transform = 'scale(1) rotate(0deg)';
            }
        }
    }

    // Form Management
    setupFormValidation() {
        this.validators = {
            email: (value) => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value) ? null : 'يرجى إدخال بريد إلكتروني صحيح';
            },
            phone: (value) => {
                const phoneRegex = /^(\+213|0)[567][0-9]{8}$/;
                return phoneRegex.test(value.replace(/\s/g, '')) ? null : 'يرجى إدخال رقم هاتف صحيح';
            },
            required: (value) => {
                return value.trim() ? null : 'هذا الحقل مطلوب';
            },
            minLength: (value, min) => {
                return value.length >= min ? null : `يجب أن يكون النص ${min} أحرف على الأقل`;
            }
        };
    }

    validateField(field) {
        const value = field.value;
        const errors = [];

        // Required validation
        if (field.hasAttribute('required') && !value.trim()) {
            errors.push(this.validators.required(value));
        }

        // Type-specific validation
        if (value.trim()) {
            switch (field.type) {
                case 'email':
                    const emailError = this.validators.email(value);
                    if (emailError) errors.push(emailError);
                    break;
                case 'tel':
                    const phoneError = this.validators.phone(value);
                    if (phoneError) errors.push(phoneError);
                    break;
            }

            // Length validation
            const minLength = field.getAttribute('minlength');
            if (minLength) {
                const minError = this.validators.minLength(value, parseInt(minLength));
                if (minError) errors.push(minError);
            }
        }

        return errors.filter(Boolean);
    }

    showFieldError(field, errors) {
        this.clearFieldError(field);
        
        if (errors.length > 0) {
            field.classList.add('error');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = errors[0];
            
            field.parentNode.appendChild(errorDiv);
        } else {
            field.classList.add('success');
            setTimeout(() => field.classList.remove('success'), 2000);
        }
    }

    clearFieldError(field) {
        field.classList.remove('error', 'success');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    async handleFormSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        // Validate form
        const isValid = this.validateForm(form);
        
        if (isValid) {
            try {
                // Show loading state
                this.showFormLoading(form);
                
                // Submit form
                await this.submitForm(formData);
                
                // Show success
                this.showNotification('تم إرسال النموذج بنجاح!', 'success');
                form.reset();
                
            } catch (error) {
                this.showNotification('حدث خطأ في الإرسال. يرجى المحاولة مرة أخرى.', 'error');
            } finally {
                this.hideFormLoading(form);
            }
        } else {
            this.showNotification('يرجى تصحيح الأخطاء في النموذج', 'warning');
        }
    }

    validateForm(form) {
        const fields = form.querySelectorAll('.form-input[required]');
        let isValid = true;
        
        fields.forEach(field => {
            const errors = this.validateField(field);
            if (errors.length > 0) {
                isValid = false;
                this.showFieldError(field, errors);
            } else {
                this.clearFieldError(field);
            }
        });
        
        return isValid;
    }

    async submitForm(formData) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }

    showFormLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading-spinner"></span> جاري الإرسال...';
        }
    }

    hideFormLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = submitBtn.dataset.originalText || 'إرسال';
        }
    }

    // Animation Management
    initializeAnimations() {
        // Initialize AOS if available
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true,
                offset: 100,
                easing: 'ease-out-cubic'
            });
        }
        
        // Custom animations
        this.setupCustomAnimations();
    }

    setupCustomAnimations() {
        // Stagger animations for cards
        const cards = document.querySelectorAll('.destination-card, .service-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 100}ms`;
        });
        
        // Parallax effect for hero sections
        this.setupParallaxEffect();
    }

    setupParallaxEffect() {
        const heroSections = document.querySelectorAll('.business-tourism-hero');
        
        heroSections.forEach(hero => {
            const parallaxElements = hero.querySelectorAll('.parallax-element');
            
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                parallaxElements.forEach(element => {
                    element.style.transform = `translateY(${rate}px)`;
                });
            });
        });
    }

    reinitializeAnimations() {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
        this.setupCustomAnimations();
    }

    // Intersection Observer for performance
    setupIntersectionObserver() {
        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    this.animationObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observe elements
        const observeElements = document.querySelectorAll('.destination-card, .service-card, .testimonial-card');
        observeElements.forEach(el => this.animationObserver.observe(el));
    }

    // Counter Animation
    initializeCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-counter'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, 16);
    }

    // Notification System
    initializeNotificationSystem() {
        this.notificationContainer = document.createElement('div');
        this.notificationContainer.className = 'notification-container';
        this.notificationContainer.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            z-index: 1000;
            pointer-events: none;
        `;
        document.body.appendChild(this.notificationContainer);
    }

    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.pointerEvents = 'auto';
        
        const notificationId = `notification-${Date.now()}`;
        notification.id = notificationId;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        
        const titles = {
            success: 'نجح!',
            error: 'خطأ!',
            warning: 'تحذير!',
            info: 'معلومة'
        };
        
        notification.innerHTML = `
            <div class="notification-header">
                <div class="notification-title">
                    <i class="${icons[type]} ml-2"></i>
                    ${titles[type]}
                </div>
                <button class="notification-close" aria-label="إغلاق الإشعار">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="notification-message">
                ${message}
            </div>
        `;
        
        this.notificationContainer.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            this.closeNotification(notification);
        }, duration);
        
        this.notifications.push({
            id: notificationId,
            element: notification,
            type,
            message
        });
        
        return notificationId;
    }

    closeNotification(notification) {
        if (notification && notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
            
            // Remove from notifications array
            this.notifications = this.notifications.filter(
                n => n.element !== notification
            );
        }
    }

    // FAQ Management
    toggleFAQ(faqItem) {
        const answer = faqItem.querySelector('.faq-answer');
        const icon = faqItem.querySelector('.question-icon');
        
        const isOpen = !answer.classList.contains('hidden');
        
        // Close all other FAQs
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) {
                item.querySelector('.faq-answer').classList.add('hidden');
                item.querySelector('.question-icon').classList.remove('rotate-180');
            }
        });
        
        // Toggle current FAQ
        if (isOpen) {
            answer.classList.add('hidden');
            icon.classList.remove('rotate-180');
        } else {
            answer.classList.remove('hidden');
            icon.classList.add('rotate-180');
        }
    }

    // Event Handlers
    handleScroll() {
        // Update header on scroll
        const header = document.getElementById('main-header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Parallax effects
        this.updateParallaxElements();
    }

    updateParallaxElements() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    handleResize() {
        // Recalculate animations
        this.reinitializeAnimations();
        
        // Update responsive elements
        this.updateResponsiveElements();
    }

    updateResponsiveElements() {
        const isMobile = window.innerWidth < 768;
        
        // Update mobile-specific behaviors
        document.querySelectorAll('.destination-card').forEach(card => {
            if (isMobile) {
                card.style.transform = 'none';
            }
        });
    }

    handleKeyboardNavigation(e) {
        // Escape key closes notifications and modals
        if (e.key === 'Escape') {
            this.notifications.forEach(notification => {
                this.closeNotification(notification.element);
            });
        }
        
        // Tab navigation improvements
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
        }
    }

    // Utility Functions
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
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

    formatCurrency(amount, currency = 'EUR') {
        return new Intl.NumberFormat('ar-DZ', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0
        }).format(amount);
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('ar-DZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    // Analytics and Tracking
    trackDestinationSwitch(destination) {
        // Google Analytics or other tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'destination_switch', {
                'destination': destination,
                'timestamp': new Date().toISOString()
            });
        }
    }

    trackFormSubmission(formType, success) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submission', {
                'form_type': formType,
                'success': success,
                'timestamp': new Date().toISOString()
            });
        }
    }

    // Loading States
    showLoadingState() {
        const loader = document.createElement('div');
        loader.className = 'loading-overlay';
        loader.innerHTML = `
            <div class="loading-spinner"></div>
            <div>جاري التحميل...</div>
        `;
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            gap: 1rem;
        `;
        
        document.body.appendChild(loader);
    }

    hideLoadingState() {
        const loader = document.querySelector('.loading-overlay');
        if (loader) {
            loader.remove();
        }
    }

    // Cleanup
    destroy() {
        // Remove event listeners
        if (this.animationObserver) {
            this.animationObserver.disconnect();
        }
        
        // Clear notifications
        this.notifications.forEach(notification => {
            this.closeNotification(notification.element);
        });
        
        // Remove notification container
        if (this.notificationContainer && this.notificationContainer.parentNode) {
            this.notificationContainer.parentNode.removeChild(this.notificationContainer);
        }
        
        console.log('🌍 Business Tourism Manager destroyed');
    }
}

// Price Calculator Class
class PriceCalculator {
    constructor() {
        this.basePrices = {
            turkey: { 7: 1500, 10: 2200, 15: 3500 },
            france: { 8: 2200, 12: 3800, 15: 5500 },
            china: { 10: 1800, 14: 2800, 21: 4200 },
            uae: { 6: 1200, 10: 2000, 14: 3200 }
        };
        this.discounts = {
            '3-5': 0.05,
            '6-10': 0.10,
            '11-20': 0.15,
            '20+': 0.20
        };
    }

    calculatePrice(destination, duration, travelers) {
        const basePrice = this.basePrices[destination]?.[duration] || 0;
        const travelerCount = this.getTravelerCount(travelers);
        const discount = this.discounts[travelers] || 0;
        
        const subtotal = basePrice * travelerCount;
        const discountAmount = subtotal * discount;
        const total = subtotal - discountAmount;
        
        return {
            basePrice,
            travelerCount,
            subtotal,
            discount: discount * 100,
            discountAmount,
            total
        };
    }

    getTravelerCount(travelers) {
        if (travelers === '1') return 1;
        if (travelers === '2') return 2;
        if (travelers === '3-5') return 4;
        if (travelers === '6-10') return 8;
        if (travelers === '11-20') return 15;
        if (travelers === '20+') return 25;
        return 1;
    }
}

// Booking Form Manager Class
class BookingFormManager {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
        this.priceCalculator = new PriceCalculator();
        this.init();
    }

    init() {
        this.setupStepNavigation();
        this.setupFormValidation();
        this.setupPriceCalculation();
    }

    setupStepNavigation() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-next')) {
                this.nextStep();
            } else if (e.target.classList.contains('btn-prev')) {
                this.prevStep();
            }
        });
    }

    nextStep() {
        if (this.validateCurrentStep() && this.currentStep < this.totalSteps) {
            this.hideStep(this.currentStep);
            this.currentStep++;
            this.showStep(this.currentStep);
            this.updateStepIndicator();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.hideStep(this.currentStep);
            this.currentStep--;
            this.showStep(this.currentStep);
            this.updateStepIndicator();
        }
    }

    showStep(step) {
        const stepElement = document.getElementById(`step-${step}`);
        if (stepElement) {
            stepElement.classList.add('active');
        }
    }

    hideStep(step) {
        const stepElement = document.getElementById(`step-${step}`);
        if (stepElement) {
            stepElement.classList.remove('active');
        }
    }

    updateStepIndicator() {
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            const stepNumber = index + 1;
            if (stepNumber < this.currentStep) {
                indicator.classList.add('completed');
                indicator.classList.remove('active');
            } else if (stepNumber === this.currentStep) {
                indicator.classList.add('active');
                indicator.classList.remove('completed');
            } else {
                indicator.classList.remove('active', 'completed');
            }
        });
    }

    validateCurrentStep() {
        const currentStepElement = document.getElementById(`step-${this.currentStep}`);
        if (!currentStepElement) return true;

        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            const errors = this.validateField(field);
            if (errors.length > 0) {
                isValid = false;
                this.showFieldError(field, errors);
            } else {
                this.clearFieldError(field);
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const errors = [];

        // Required validation
        if (field.hasAttribute('required') && !value) {
            errors.push('هذا الحقل مطلوب');
            return errors;
        }

        // Type-specific validation
        if (value) {
            switch (field.type) {
                case 'email':
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        errors.push('يرجى إدخال بريد إلكتروني صحيح');
                    }
                    break;
                case 'tel':
                    if (!/^(\+213|0)[567][0-9]{8}$/.test(value.replace(/\s/g, ''))) {
                        errors.push('يرجى إدخال رقم هاتف صحيح');
                    }
                    break;
                case 'date':
                    const selectedDate = new Date(value);
                    const today = new Date();
                    if (selectedDate <= today) {
                        errors.push('يجب أن يكون التاريخ في المستقبل');
                    }
                    break;
            }
        }

        return errors;
    }

    showFieldError(field, errors) {
        this.clearFieldError(field);
        
        if (errors.length > 0) {
            field.classList.add('error');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = errors[0];
            
            field.parentNode.appendChild(errorDiv);
        }
    }

    clearFieldError(field) {
        field.classList.remove('error', 'success');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    setupPriceCalculation() {
        const inputs = ['destination', 'program-duration', 'travelers'];
        
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('change', () => this.updatePriceCalculation());
            }
        });
    }

    updatePriceCalculation() {
        const destination = document.getElementById('destination')?.value;
        const duration = document.getElementById('program-duration')?.value;
        const travelers = document.getElementById('travelers')?.value;

        if (destination && duration && travelers) {
            const durationDays = parseInt(duration.split('-')[0]);
            const calculation = this.priceCalculator.calculatePrice(destination, durationDays, travelers);
            
            this.displayPriceCalculation(calculation);
        }
    }

    displayPriceCalculation(calculation) {
        const priceDisplay = document.getElementById('calc-total');
        if (priceDisplay) {
            priceDisplay.textContent = `€${calculation.total.toLocaleString()}`;
        }

        // Update detailed breakdown if exists
        const breakdown = document.getElementById('price-breakdown');
        if (breakdown) {
            breakdown.innerHTML = `
                <div class="price-breakdown-item">
                    <span>السعر الأساسي:</span>
                    <span>€${calculation.basePrice.toLocaleString()}</span>
                </div>
                <div class="price-breakdown-item">
                    <span>عدد المسافرين:</span>
                    <span>${calculation.travelerCount}</span>
                </div>
                <div class="price-breakdown-item">
                    <span>المجموع الفرعي:</span>
                    <span>€${calculation.subtotal.toLocaleString()}</span>
                </div>
                ${calculation.discount > 0 ? `
                <div class="price-breakdown-item discount">
                    <span>خصم المجموعة (${calculation.discount}%):</span>
                    <span>-€${calculation.discountAmount.toLocaleString()}</span>
                </div>
                ` : ''}
                <div class="price-breakdown-item total">
                    <span>المجموع النهائي:</span>
                    <span>€${calculation.total.toLocaleString()}</span>
                </div>
            `;
        }
    }
}

// Trip Details Manager Class
class TripDetailsManager {
    constructor() {
        this.currentDestination = 'turkey';
        this.tripData = this.initializeTripData();
        this.init();
    }

    initializeTripData() {
        return {
            turkey: {
                title: 'رحلة تركيا التجارية',
                subtitle: 'اكتشف الفرص التجارية والاستثمارية',
                description: 'رحلة تجارية شاملة إلى تركيا تتضمن زيارة أهم المصانع والمعارض التجارية في إسطنبول وأنقرة.',
                duration: '7-15 أيام',
                groupSize: '2-20 شخص',
                difficulty: 'متوسط',
                priceFrom: '€1,500',
                color: 'red',
                programs: [
                    { days: 7, name: 'الأساسي', price: '€1,500' },
                    { days: 10, name: 'المتوسط', price: '€2,200' },
                    { days: 15, name: 'الشامل', price: '€3,500' }
                ],
                itinerary: [
                    {
                        day: 1,
                        title: 'الوصول إلى إسطنبول',
                        activities: [
                            { time: '09:00', activity: 'الوصول إلى المطار', icon: 'plane' },
                            { time: '11:00', activity: 'تسجيل الوصول في الفندق', icon: 'hotel' },
                            { time: '13:00', activity: 'غداء ترحيبي', icon: 'utensils' }
                        ]
                    },
                    {
                        day: 2,
                        title: 'زيارة المصانع',
                        activities: [
                            { time: '08:00', activity: 'إفطار في الفندق', icon: 'coffee' },
                            { time: '10:00', activity: 'زيارة مصنع النسيج', icon: 'industry' },
                            { time: '14:00', activity: 'لقاء تجاري', icon: 'handshake' }
                        ]
                    }
                ]
            },
            france: {
                title: 'رحلة فرنسا التقنية',
                subtitle: 'التكنولوجيا والابتكار',
                description: 'رحلة تجارية متخصصة إلى فرنسا لاستكشاف التكنولوجيا والابتكار في باريس وليون.',
                duration: '8-15 أيام',
                groupSize: '2-15 شخص',
                difficulty: 'متقدم',
                priceFrom: '€2,200',
                color: 'blue',
                programs: [
                    { days: 8, name: 'التكنولوجيا', price: '€2,200' },
                    { days: 12, name: 'الشامل', price: '€3,800' },
                    { days: 15, name: 'الاستثماري', price: '€5,500' }
                ]
            },
            china: {
                title: 'رحلة الصين الصناعية',
                subtitle: 'التصنيع ومعرض كانتون',
                description: 'رحلة تجارية إلى الصين لاستكشاف عالم التصنيع وحضور معرض كانتون الشهير.',
                duration: '10-21 أيام',
                groupSize: '3-25 شخص',
                difficulty: 'متوسط',
                priceFrom: '€1,800',
                color: 'yellow',
                programs: [
                    { days: 10, name: 'التصنيع', price: '€1,800' },
                    { days: 14, name: 'الشامل', price: '€2,800' },
                    { days: 21, name: 'الكامل', price: '€4,200' }
                ]
            },
            uae: {
                title: 'رحلة الإمارات الاستثمارية',
                subtitle: 'الاستثمار والمناطق الحرة',
                description: 'رحلة تجارية إلى دولة الإمارات لاستكشاف الفرص الاستثمارية والمناطق الحرة.',
                duration: '6-14 أيام',
                groupSize: '2-20 شخص',
                difficulty: 'سهل',
                priceFrom: '€1,200',
                color: 'green',
                programs: [
                    { days: 6, name: 'الاستكشافي', price: '€1,200' },
                    { days: 10, name: 'الشامل', price: '€2,000' },
                    { days: 14, name: 'الكامل', price: '€3,200' }
                ]
            }
        };
    }

    init() {
        this.setupDestinationSwitcher();
        this.updateTripDetails();
    }

    setupDestinationSwitcher() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.trip-selector')) {
                const destination = e.target.closest('.trip-selector').dataset.destination;
                this.switchDestination(destination);
            }
        });
    }

    switchDestination(destination) {
        if (this.tripData[destination]) {
            this.currentDestination = destination;
            this.updateActiveSelector(destination);
            this.updateTripDetails();
        }
    }

    updateActiveSelector(destination) {
        document.querySelectorAll('.trip-selector').forEach(selector => {
            selector.classList.toggle('active', selector.dataset.destination === destination);
        });
    }

    updateTripDetails() {
        const trip = this.tripData[this.currentDestination];
        this.updateOverviewSection(trip);
        this.updateItinerarySection(trip);
        this.updatePricingSection(trip);
    }

    updateOverviewSection(trip) {
        const overview = document.querySelector('.trip-overview');
        if (overview) {
            // Update content dynamically
            const title = overview.querySelector('.trip-title');
            const subtitle = overview.querySelector('.trip-subtitle');
            const description = overview.querySelector('.trip-description');
            
            if (title) title.textContent = trip.title;
            if (subtitle) subtitle.textContent = trip.subtitle;
            if (description) description.textContent = trip.description;
        }
    }

    updateItinerarySection(trip) {
        if (trip.itinerary) {
            const itineraryContainer = document.querySelector('.trip-itinerary');
            if (itineraryContainer) {
                this.renderItinerary(trip.itinerary, itineraryContainer);
            }
        }
    }

    renderItinerary(itinerary, container) {
        const itineraryHTML = itinerary.map(day => `
            <div class="itinerary-day" data-aos="fade-up">
                <div class="day-number">${day.day}</div>
                <div class="day-content">
                    <h3 class="day-title">اليوم ${day.day} - ${day.title}</h3>
                    <div class="day-activities">
                        ${day.activities.map(activity => `
                            <div class="itinerary-activity">
                                <div class="activity-time">
                                    <i class="fas fa-${activity.icon}"></i>
                                    ${activity.time} - ${activity.activity}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = itineraryHTML;
    }

    updatePricingSection(trip) {
        const pricingContainer = document.querySelector('.pricing-options');
        if (pricingContainer && trip.programs) {
            const pricingHTML = trip.programs.map(program => `
                <div class="price-option" data-program="${program.days}">
                    <div class="program-info">
                        <div class="program-name">برنامج ${program.days} أيام</div>
                        <div class="program-type">${program.name}</div>
                    </div>
                    <div class="program-price">${program.price}</div>
                </div>
            `).join('');
            
            pricingContainer.innerHTML = pricingHTML;
        }
    }
}

// Initialize all managers when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main business tourism manager
    window.businessTourismManager = new BusinessTourismManager();
    
    // Initialize booking form manager if booking form exists
    if (document.querySelector('.booking-form')) {
        window.bookingFormManager = new BookingFormManager();
    }
    
    // Initialize trip details manager if trip details page
    if (document.querySelector('.trip-details')) {
        window.tripDetailsManager = new TripDetailsManager();
    }
    
    // Initialize price calculator if price calculator exists
    if (document.querySelector('.price-calculator')) {
        window.priceCalculator = new PriceCalculator();
    }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BusinessTourismManager,
        BookingFormManager,
        TripDetailsManager,
        PriceCalculator
    };
}

// Global utility functions
window.BusinessTourismUtils = {
    formatCurrency: (amount, currency = 'EUR') => {
        return new Intl.NumberFormat('ar-DZ', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0
        }).format(amount);
    },
    
    formatDate: (date) => {
        return new Intl.DateTimeFormat('ar-DZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    },
    
    showNotification: (message, type = 'info') => {
        if (window.businessTourismManager) {
            return window.businessTourismManager.showNotification(message, type);
        }
    },
    
    validateEmail: (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    validatePhone: (phone) => {
        return /^(\+213|0)[567][0-9]{8}$/.test(phone.replace(/\s/g, ''));
    }
};

console.log('🌍 Business Tourism JavaScript modules loaded successfully!');
