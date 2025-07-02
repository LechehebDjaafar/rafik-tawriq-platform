/**
 * Legal Section JavaScript
 * Handles all interactive functionality for the legal pages
 */

class LegalManager {
    constructor() {
        this.notifications = [];
        this.forms = new Map();
        this.validators = new Map();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeForms();
        this.setupProgressTracking();
        this.initializeTooltips();
        this.setupAccessibility();
        console.log('🏛️ Legal Manager initialized successfully');
    }

    setupEventListeners() {
        // Document ready
        document.addEventListener('DOMContentLoaded', () => {
            this.animateCounters();
            this.initializeChecklists();
        });

        // Form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.classList.contains('legal-form')) {
                this.handleFormSubmission(e);
            }
        });

        // Checklist interactions
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('legal-checklist-checkbox')) {
                this.handleChecklistChange(e);
            }
        });

        // Notification close buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('legal-notification-close')) {
                this.closeNotification(e.target.closest('.legal-notification'));
            }
        });
    }

    // Form Management
    initializeForms() {
        const forms = document.querySelectorAll('.legal-form');
        forms.forEach(form => {
            const formId = form.id || `form-${Date.now()}`;
            this.forms.set(formId, {
                element: form,
                fields: this.getFormFields(form),
                validators: this.setupFormValidators(form)
            });
        });
    }

    getFormFields(form) {
        return Array.from(form.querySelectorAll('.legal-form-input')).map(input => ({
            element: input,
            name: input.name,
            type: input.type,
            required: input.hasAttribute('required'),
            value: input.value
        }));
    }

    setupFormValidators(form) {
        const validators = {
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
            },
            maxLength: (value, max) => {
                return value.length <= max ? null : `يجب أن يكون النص ${max} أحرف على الأكثر`;
            }
        };

        return validators;
    }

    validateField(field, validators) {
        const { element, value, required } = field;
        const errors = [];

        // Required validation
        if (required && !value.trim()) {
            errors.push(validators.required(value));
        }

        // Type-specific validation
        if (value.trim()) {
            switch (element.type) {
                case 'email':
                    const emailError = validators.email(value);
                    if (emailError) errors.push(emailError);
                    break;
                case 'tel':
                    const phoneError = validators.phone(value);
                    if (phoneError) errors.push(phoneError);
                    break;
            }

            // Length validation
            const minLength = element.getAttribute('minlength');
            const maxLength = element.getAttribute('maxlength');
            
            if (minLength) {
                const minError = validators.minLength(value, parseInt(minLength));
                if (minError) errors.push(minError);
            }
            
            if (maxLength) {
                const maxError = validators.maxLength(value, parseInt(maxLength));
                if (maxError) errors.push(maxError);
            }
        }

        return errors.filter(Boolean);
    }

    showFieldError(field, errors) {
        const { element } = field;
        
        // Remove existing errors
        this.clearFieldError(element);
        
        if (errors.length > 0) {
            element.classList.add('error');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'legal-form-error';
            errorDiv.textContent = errors[0];
            
            element.parentNode.appendChild(errorDiv);
        } else {
            element.classList.add('success');
            setTimeout(() => element.classList.remove('success'), 2000);
        }
    }

    clearFieldError(element) {
        element.classList.remove('error', 'success');
        const existingError = element.parentNode.querySelector('.legal-form-error');
        if (existingError) {
            existingError.remove();
        }
    }

    handleFormSubmission(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const formId = form.id || `form-${Date.now()}`;
        
        // Show loading state
        const submitBtn = form.querySelector('.legal-form-submit');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="legal-loading"></span> جاري الإرسال...';
        submitBtn.disabled = true;

        // Validate form
        const formInfo = this.forms.get(formId);
        if (formInfo) {
            const isValid = this.validateForm(formInfo);
            
            if (isValid) {
                this.submitForm(formData, form)
                    .then(response => {
                        this.showNotification('تم إرسال النموذج بنجاح!', 'success');
                        form.reset();
                    })
                    .catch(error => {
                        this.showNotification('حدث خطأ في الإرسال. يرجى المحاولة مرة أخرى.', 'error');
                    })
                    .finally(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    });
            } else {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                this.showNotification('يرجى تصحيح الأخطاء في النموذج', 'warning');
            }
        }
    }

    validateForm(formInfo) {
        let isValid = true;
        
        formInfo.fields.forEach(field => {
            field.value = field.element.value;
            const errors = this.validateField(field, formInfo.validators);
            
            if (errors.length > 0) {
                isValid = false;
                this.showFieldError(field, errors);
            } else {
                this.clearFieldError(field.element);
            }
        });
        
        return isValid;
    }

    async submitForm(formData, form) {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                if (Math.random() > 0.1) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }

    // Notification System
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `legal-notification ${type}`;
        
        const notificationId = `notification-${Date.now()}`;
        notification.id = notificationId;
        
        notification.innerHTML = `
            <div class="legal-notification-header">
                <div class="legal-notification-title">
                    ${this.getNotificationTitle(type)}
                </div>
                <button class="legal-notification-close" aria-label="إغلاق الإشعار">
                    ×
                </button>
            </div>
            <div class="legal-notification-message">
                ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
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
    }

    getNotificationTitle(type) {
        const titles = {
            success: 'نجح!',
            error: 'خطأ!',
            warning: 'تحذير!',
            info: 'معلومة'
        };
        return titles[type] || 'إشعار';
    }

    closeNotification(notification) {
        if (notification) {
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

    // Progress Tracking
    setupProgressTracking() {
        const progressBars = document.querySelectorAll('.legal-progress-bar');
        progressBars.forEach(bar => {
            this.animateProgressBar(bar);
        });
    }

    animateProgressBar(bar) {
        const targetWidth = bar.getAttribute('data-progress') || '0';
        let currentWidth = 0;
        const increment = parseInt(targetWidth) / 50;
        
        const animate = () => {
            if (currentWidth < parseInt(targetWidth)) {
                currentWidth += increment;
                bar.style.width = `${Math.min(currentWidth, parseInt(targetWidth))}%`;
                requestAnimationFrame(animate);
            }
        };
        
        // Start animation when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(bar);
    }

    // Counter Animation
    animateCounters() {
        const counters = document.querySelectorAll('.legal-stat-number[data-counter]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-counter'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const animate = () => {
                if (current < target) {
                    current += step;
                    counter.textContent = Math.floor(Math.min(current, target));
                    requestAnimationFrame(animate);
                }
            };
            
            // Start animation when visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animate();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }

    // Checklist Management
    initializeChecklists() {
        const checklists = document.querySelectorAll('.legal-checklist');
        checklists.forEach(checklist => {
            this.updateChecklistProgress(checklist);
        });
    }

    handleChecklistChange(e) {
        const checkbox = e.target;
        const item = checkbox.closest('.legal-checklist-item');
        const checklist = checkbox.closest('.legal-checklist');
        
        if (checkbox.checked) {
            item.classList.add('checked');
        } else {
            item.classList.remove('checked');
        }
        
        this.updateChecklistProgress(checklist);
    }

    updateChecklistProgress(checklist) {
        const checkboxes = checklist.querySelectorAll('.legal-checklist-checkbox');
        const checkedBoxes = checklist.querySelectorAll('.legal-checklist-checkbox:checked');
        const progress = (checkedBoxes.length / checkboxes.length) * 100;
        
        const progressBar = checklist.querySelector('.legal-progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        // Show completion notification
        if (progress === 100) {
            this.showNotification('تم إكمال جميع المتطلبات!', 'success');
        }
    }

    // Tooltip Management
    initializeTooltips() {
        const tooltips = document.querySelectorAll('.legal-tooltip');
        
        tooltips.forEach(tooltip => {
            const text = tooltip.getAttribute('data-tooltip');
            if (text) {
                const tooltipText = document.createElement('span');
                tooltipText.className = 'legal-tooltip-text';
                tooltipText.textContent = text;
                tooltip.appendChild(tooltipText);
            }
        });
    }

    // Accessibility Features
    setupAccessibility() {
        // Add ARIA labels
        this.addAriaLabels();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Focus management
        this.setupFocusManagement();
    }

    addAriaLabels() {
        // Add labels to interactive elements
        document.querySelectorAll('.legal-service-btn').forEach((btn, index) => {
            if (!btn.getAttribute('aria-label')) {
                btn.setAttribute('aria-label', `خدمة رقم ${index + 1}`);
            }
        });
        
        document.querySelectorAll('.legal-checklist-checkbox').forEach((checkbox, index) => {
            if (!checkbox.getAttribute('aria-label')) {
                const text = checkbox.nextElementSibling?.textContent || `عنصر رقم ${index + 1}`;
                checkbox.setAttribute('aria-label', text);
            }
        });
    }

    setupKeyboardNavigation() {
        // Tab navigation for custom elements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                if (e.target.classList.contains('legal-checklist-item')) {
                    e.preventDefault();
                    const checkbox = e.target.querySelector('.legal-checklist-checkbox');
                    if (checkbox) {
                        checkbox.checked = !checkbox.checked;
                        checkbox.dispatchEvent(new Event('change'));
                    }
                }
            }
            
            if (e.key === 'Escape') {
                // Close notifications
                const notifications = document.querySelectorAll('.legal-notification.show');
                notifications.forEach(notification => {
                    this.closeNotification(notification);
                });
            }
        });
    }

    setupFocusManagement() {
        // Focus visible class for better accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('using-keyboard');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('using-keyboard');
        });
    }

    // Utility Methods
    formatCurrency(amount) {
        return new Intl.NumberFormat('ar-DZ', {
            style: 'currency',
            currency: 'DZD'
        }).format(amount);
    }

    formatDate(date) {
        return new Intl.DateTimeFormat('ar-DZ', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
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

    // API Integration
    async makeRequest(url, options = {}) {
        const defaultOptions = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        
        const config = { ...defaultOptions, ...options };
        
        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    // Local Storage Management
    saveToStorage(key, data) {
        try {
            localStorage.setItem(`legal_${key}`, JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    }

    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(`legal_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.warn('Failed to load from localStorage:', error);
            return null;
        }
    }

    removeFromStorage(key) {
        try {
            localStorage.removeItem(`legal_${key}`);
        } catch (error) {
            console.warn('Failed to remove from localStorage:', error);
        }
    }
}

// Document Type Checker
class DocumentChecker {
    constructor() {
        this.requiredDocuments = new Map();
        this.setupDocumentTypes();
    }

    setupDocumentTypes() {
        this.requiredDocuments.set('business-setup', [
            'نسخة من بطاقة الهوية الوطنية',
            'شهادة الإقامة',
            'صحيفة السوابق العدلية',
            'شهادة الجنسية',
            'القانون الأساسي للشركة',
            'عقد التأسيس',
            'شهادة إيداع رأس المال'
        ]);

        this.requiredDocuments.set('commercial-register', [
            'طلب التسجيل',
            'القانون الأساسي للشركة',
            'محضر الجمعية التأسيسية',
            'قرار تعيين المسيرين',
            'شهادة إيداع رأس المال',
            'الوثائق الشخصية للمسيرين'
        ]);

        this.requiredDocuments.set('casnos', [
            'طلب موقع على استمارة CASNOS',
            'نسخة من السجل التجاري',
            'نسخة من القانون الأساسي',
            'شهادة ميلاد المسير',
            'نسخة من بطاقة الهوية الوطنية',
            'شهادة الإقامة'
        ]);
    }

    getRequiredDocuments(type) {
        return this.requiredDocuments.get(type) || [];
    }

    checkDocumentCompleteness(type, submittedDocuments) {
        const required = this.getRequiredDocuments(type);
        const missing = required.filter(doc => !submittedDocuments.includes(doc));
        
        return {
            total: required.length,
            submitted: submittedDocuments.length,
            missing: missing,
            completeness: ((required.length - missing.length) / required.length) * 100
        };
    }
}

// Cost Calculator
class CostCalculator {
    constructor() {
        this.baseCosts = new Map();
        this.setupBaseCosts();
    }

    setupBaseCosts() {
        this.baseCosts.set('commercial-register', 5000);
        this.baseCosts.set('extract', 1000);
        this.baseCosts.set('modification', 3000);
        this.baseCosts.set('publication', 20000);
        this.baseCosts.set('notarization', 5000);
        this.baseCosts.set('translation', 3000);
    }

    calculateTotalCost(services, additionalServices = []) {
        let total = 0;
        
        services.forEach(service => {
            total += this.baseCosts.get(service) || 0;
        });
        
        additionalServices.forEach(service => {
            total += service.cost || 0;
        });
        
        return total;
    }

    getServiceCost(service) {
        return this.baseCosts.get(service) || 0;
    }
}

// Initialize Legal Manager
const legalManager = new LegalManager();
const documentChecker = new DocumentChecker();
const costCalculator = new CostCalculator();

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        LegalManager,
        DocumentChecker,
        CostCalculator
    };
}

// Global utility functions
window.legalUtils = {
    showNotification: (message, type, duration) => 
        legalManager.showNotification(message, type, duration),
    
    formatCurrency: (amount) => 
        legalManager.formatCurrency(amount),
    
    formatDate: (date) => 
        legalManager.formatDate(date),
    
    checkDocuments: (type, documents) => 
        documentChecker.checkDocumentCompleteness(type, documents),
    
    calculateCost: (services, additional) => 
        costCalculator.calculateTotalCost(services, additional)
};
