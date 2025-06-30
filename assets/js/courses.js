// Courses JavaScript - Comprehensive functionality for all course pages
// Rafik Tawriq Platform - Course Management System

'use strict';

// Global Course Management Object
const CourseManager = {
    // Configuration
    config: {
        apiEndpoint: '/api/courses',
        itemsPerPage: 12,
        animationDuration: 300,
        debounceDelay: 300,
        autoSaveDelay: 2000
    },

    // State Management
    state: {
        currentTab: 'recorded',
        currentPage: 1,
        totalPages: 1,
        filters: {
            category: '',
            level: '',
            price: '',
            duration: '',
            search: ''
        },
        selectedCourse: null,
        registrationStep: 1,
        formData: {},
        isLoading: false
    },

    // Course Data
    courseData: {
        categories: {
            'marketing': 'التسويق',
            'management': 'الإدارة',
            'finance': 'المالية',
            'technology': 'التكنولوجيا',
            'sales': 'المبيعات',
            'industrial': 'الصناعات'
        },
        levels: {
            'beginner': 'مبتدئ',
            'intermediate': 'متوسط',
            'advanced': 'متقدم'
        },
        wilayas: [
            'الجزائر', 'وهران', 'قسنطينة', 'شلف', 'البليدة', 'باتنة', 'سطيف',
            'عنابة', 'سيدي بلعباس', 'بسكرة', 'تلمسان', 'ورقلة', 'بجاية',
            'جيجل', 'تيزي وزو', 'المسيلة', 'الوادي', 'بشار', 'غرداية',
            'الأغواط', 'خنشلة', 'سوق أهراس', 'تبسة', 'أم البواقي', 'البويرة',
            'تيارت', 'الطارف', 'سعيدة', 'سكيكدة', 'معسكر', 'ميلة',
            'عين الدفلى', 'النعامة', 'عين تموشنت', 'غليزان', 'برج بوعريريج',
            'المدية', 'الجلفة', 'جانت', 'أدرار', 'تمنراست', 'إليزي',
            'تيندوف', 'مستغانم', 'الشلف', 'تيسمسيلت', 'الوادي', 'خنشلة'
        ]
    },

    // Initialize the course management system
    init() {
        this.bindEvents();
        this.initializePage();
        this.loadCourseData();
        this.setupFormValidation();
        this.initializeAnimations();
        console.log('Course Management System initialized successfully');
    },

    // Bind all event listeners
    bindEvents() {
        // Tab navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('tab-btn')) {
                this.handleTabChange(e.target);
            }
        });

        // Course filters
        const filterElements = document.querySelectorAll('.course-filter');
        filterElements.forEach(filter => {
            filter.addEventListener('change', this.handleFilterChange.bind(this));
        });

        // Search functionality
        const searchInput = document.getElementById('course-search');
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), this.config.debounceDelay));
        }

        // Course cards
        document.addEventListener('click', (e) => {
            if (e.target.closest('.course-card')) {
                this.handleCourseClick(e.target.closest('.course-card'));
            }
        });

        // Registration form
        const registrationForm = document.getElementById('course-registration-form');
        if (registrationForm) {
            this.bindRegistrationEvents(registrationForm);
        }

        // Content tabs (course details)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('content-tab')) {
                this.handleContentTabChange(e.target);
            }
        });

        // FAQ toggles
        document.addEventListener('click', (e) => {
            if (e.target.closest('.faq-question')) {
                this.toggleFAQ(e.target.closest('.faq-question'));
            }
        });

        // Help form
        const helpForms = document.querySelectorAll('.help-form');
        helpForms.forEach(form => {
            form.addEventListener('submit', this.handleHelpFormSubmit.bind(this));
        });

        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Course category selection
        const categorySelect = document.getElementById('course-category');
        if (categorySelect) {
            categorySelect.addEventListener('change', this.handleCategoryChange.bind(this));
        }

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));

        // Window events
        window.addEventListener('scroll', this.handleScroll.bind(this));
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
    },

    // Initialize page-specific functionality
    initializePage() {
        const currentPage = this.getCurrentPage();
        
        switch (currentPage) {
            case 'courses-main':
                this.initializeCoursesMain();
                break;
            case 'recorded-courses':
                this.initializeRecordedCourses();
                break;
            case 'live-courses':
                this.initializeLiveCourses();
                break;
            case 'industrial-courses':
                this.initializeIndustrialCourses();
                break;
            case 'management-courses':
                this.initializeManagementCourses();
                break;
            case 'course-details':
                this.initializeCourseDetails();
                break;
            case 'registration':
                this.initializeRegistration();
                break;
        }
    },

    // Get current page type
    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('recorded-courses')) return 'recorded-courses';
        if (path.includes('live-courses')) return 'live-courses';
        if (path.includes('industrial-courses')) return 'industrial-courses';
        if (path.includes('management-courses')) return 'management-courses';
        if (path.includes('course-details')) return 'course-details';
        if (path.includes('registration')) return 'registration';
        return 'courses-main';
    },

    // Tab Management
    handleTabChange(tabButton) {
        const tabId = tabButton.getAttribute('data-tab');
        
        // Update active tab
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        tabButton.classList.add('active');
        
        // Update content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        const targetContent = document.getElementById(`${tabId}-tab`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
        
        this.state.currentTab = tabId;
        this.loadTabContent(tabId);
    },

    // Load content for specific tab
    loadTabContent(tabId) {
        this.showLoading();
        
        // Simulate API call
        setTimeout(() => {
            this.hideLoading();
            this.animateTabContent(tabId);
        }, 500);
    },

    // Animate tab content
    animateTabContent(tabId) {
        const content = document.getElementById(`${tabId}-tab`);
        if (content) {
            content.style.opacity = '0';
            content.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                content.style.transition = 'all 0.3s ease-out';
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }, 50);
        }
    },

    // Filter Management
    handleFilterChange(event) {
        const filterType = event.target.getAttribute('data-filter');
        const filterValue = event.target.value;
        
        this.state.filters[filterType] = filterValue;
        this.applyFilters();
    },

    // Apply all active filters
    applyFilters() {
        this.showLoading();
        
        const courseCards = document.querySelectorAll('.course-card');
        let visibleCount = 0;
        
        courseCards.forEach(card => {
            const shouldShow = this.shouldShowCourse(card);
            
            if (shouldShow) {
                this.showCourseCard(card, visibleCount * 100);
                visibleCount++;
            } else {
                this.hideCourseCard(card);
            }
        });
        
        this.updateResultsCount(visibleCount);
        this.hideLoading();
    },

    // Check if course should be shown based on filters
    shouldShowCourse(courseCard) {
        const filters = this.state.filters;
        
        // Category filter
        if (filters.category) {
            const courseCategory = courseCard.getAttribute('data-category');
            if (courseCategory !== filters.category) return false;
        }
        
        // Level filter
        if (filters.level) {
            const courseLevel = courseCard.getAttribute('data-level');
            if (courseLevel !== filters.level) return false;
        }
        
        // Duration filter
        if (filters.duration) {
            const courseDuration = courseCard.getAttribute('data-duration');
            if (courseDuration !== filters.duration) return false;
        }
        
        // Search filter
        if (filters.search) {
            const courseTitle = courseCard.querySelector('.course-title')?.textContent.toLowerCase() || '';
            const courseDescription = courseCard.querySelector('.course-description')?.textContent.toLowerCase() || '';
            const searchTerm = filters.search.toLowerCase();
            
            if (!courseTitle.includes(searchTerm) && !courseDescription.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    },

    // Show course card with animation
    showCourseCard(card, delay = 0) {
        setTimeout(() => {
            card.style.display = 'block';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.3s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        }, delay);
    },

    // Hide course card with animation
    hideCourseCard(card) {
        card.style.transition = 'all 0.3s ease-out';
        card.style.opacity = '0';
        card.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            card.style.display = 'none';
        }, 300);
    },

    // Search functionality
    handleSearch(event) {
        this.state.filters.search = event.target.value;
        this.applyFilters();
    },

    // Course interaction
    handleCourseClick(courseCard) {
        const courseId = courseCard.getAttribute('data-course-id');
        const courseType = courseCard.getAttribute('data-course-type');
        
        // Add click animation
        courseCard.style.transform = 'scale(0.98)';
        setTimeout(() => {
            courseCard.style.transform = '';
        }, 150);
        
        // Navigate to course details or handle enrollment
        if (courseType === 'live') {
            this.handleLiveCourseEnrollment(courseId);
        } else {
            this.navigateToCourseDetails(courseId);
        }
    },

    // Navigate to course details page
    navigateToCourseDetails(courseId) {
        // Store course ID for details page
        sessionStorage.setItem('selectedCourseId', courseId);
        
        // Navigate to details page
        window.location.href = `course-details.html?id=${courseId}`;
    },

    // Handle live course enrollment
    handleLiveCourseEnrollment(courseId) {
        this.showEnrollmentModal(courseId);
    },

    // Registration Form Management
    bindRegistrationEvents(form) {
        // Step navigation
        const nextButtons = form.querySelectorAll('.next-step');
        const prevButtons = form.querySelectorAll('.prev-step');
        
        nextButtons.forEach(btn => {
            btn.addEventListener('click', this.nextRegistrationStep.bind(this));
        });
        
        prevButtons.forEach(btn => {
            btn.addEventListener('click', this.prevRegistrationStep.bind(this));
        });
        
        // Form submission
        form.addEventListener('submit', this.handleRegistrationSubmit.bind(this));
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', this.validateField.bind(this));
            input.addEventListener('input', this.clearFieldError.bind(this));
        });
        
        // Auto-save functionality
        inputs.forEach(input => {
            input.addEventListener('input', this.debounce(this.autoSaveFormData.bind(this), this.config.autoSaveDelay));
        });
    },

    // Move to next registration step
    nextRegistrationStep() {
        if (this.validateCurrentStep()) {
            this.state.registrationStep++;
            this.updateRegistrationStep();
        }
    },

    // Move to previous registration step
    prevRegistrationStep() {
        this.state.registrationStep--;
        this.updateRegistrationStep();
    },

    // Update registration step display
    updateRegistrationStep() {
        const steps = document.querySelectorAll('.form-step');
        const indicators = document.querySelectorAll('.step-indicator');
        const lines = document.querySelectorAll('.step-line');
        
        // Update steps
        steps.forEach((step, index) => {
            if (index + 1 === this.state.registrationStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            if (index + 1 <= this.state.registrationStep) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        
        // Update lines
        lines.forEach((line, index) => {
            if (index + 1 < this.state.registrationStep) {
                line.classList.add('active');
            } else {
                line.classList.remove('active');
            }
        });
        
        // Update summary if on final step
        if (this.state.registrationStep === 3) {
            this.updateRegistrationSummary();
        }
    },

    // Validate current registration step
    validateCurrentStep() {
        const currentStep = document.querySelector(`.form-step[data-step="${this.state.registrationStep}"]`);
        const requiredFields = currentStep.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!this.validateField({ target: field })) {
                isValid = false;
            }
        });
        
        return isValid;
    },

    // Field validation
    validateField(event) {
        const field = event.target;
        const value = field.value.trim();
        const fieldType = field.type;
        const fieldName = field.name;
        
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'هذا الحقل مطلوب';
        }
        
        // Specific field validations
        if (value && fieldType === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'يرجى إدخال بريد إلكتروني صحيح';
            }
        }
        
        if (value && fieldType === 'tel') {
            const phoneRegex = /^0[567][0-9]{8}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'يرجى إدخال رقم هاتف صحيح (05/06/07)';
            }
        }
        
        // Update field appearance
        this.updateFieldValidation(field, isValid, errorMessage);
        
        return isValid;
    },

    // Update field validation appearance
    updateFieldValidation(field, isValid, errorMessage) {
        const errorElement = field.parentNode.querySelector('.error-message');
        
        if (isValid) {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.classList.remove('show');
            }
        } else {
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.classList.add('show');
            }
        }
    },

    // Clear field error
    clearFieldError(event) {
        const field = event.target;
        field.classList.remove('error');
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    },

    // Auto-save form data
    autoSaveFormData() {
        const formData = new FormData(document.getElementById('course-registration-form'));
        const data = Object.fromEntries(formData.entries());
        
        localStorage.setItem('courseRegistrationData', JSON.stringify(data));
        this.showAutoSaveIndicator();
    },

    // Show auto-save indicator
    showAutoSaveIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'auto-save-indicator';
        indicator.textContent = 'تم الحفظ تلقائياً';
        indicator.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #10B981;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(indicator);
        
        setTimeout(() => indicator.style.opacity = '1', 100);
        setTimeout(() => {
            indicator.style.opacity = '0';
            setTimeout(() => document.body.removeChild(indicator), 300);
        }, 2000);
    },

    // Handle registration form submission
    handleRegistrationSubmit(event) {
        event.preventDefault();
        
        if (!this.validateCurrentStep()) {
            return;
        }
        
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        
        this.submitRegistration(data);
    },

    // Submit registration data
    async submitRegistration(data) {
        this.showLoading();
        
        try {
            // Simulate API call
            await this.delay(2000);
            
            // Show success message
            this.showRegistrationSuccess();
            
            // Clear saved data
            localStorage.removeItem('courseRegistrationData');
            
        } catch (error) {
            this.showError('حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.');
        } finally {
            this.hideLoading();
        }
    },

    // Show registration success
    showRegistrationSuccess() {
        const form = document.getElementById('course-registration-form');
        const successMessage = document.getElementById('success-message');
        
        if (form && successMessage) {
            form.style.display = 'none';
            successMessage.classList.remove('hidden');
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth' });
        }
    },

    // Update registration summary
    updateRegistrationSummary() {
        const summaryContainer = document.getElementById('registration-summary');
        if (!summaryContainer) return;
        
        const formData = new FormData(document.getElementById('course-registration-form'));
        const data = Object.fromEntries(formData.entries());
        
        const summaryHTML = `
            <div class="summary-item">
                <strong>الاسم:</strong> ${data['full-name'] || 'غير محدد'}
            </div>
            <div class="summary-item">
                <strong>البريد الإلكتروني:</strong> ${data['email'] || 'غير محدد'}
            </div>
            <div class="summary-item">
                <strong>الهاتف:</strong> ${data['phone'] || 'غير محدد'}
            </div>
            <div class="summary-item">
                <strong>المدينة:</strong> ${data['city'] || 'غير محدد'}
            </div>
            <div class="summary-item">
                <strong>فئة الدورة:</strong> ${data['course-category'] || 'غير محدد'}
            </div>
            <div class="summary-item">
                <strong>الدورة المختارة:</strong> ${data['course-select'] || 'غير محدد'}
            </div>
        `;
        
        summaryContainer.innerHTML = summaryHTML;
    },

    // Content tab management (course details page)
    handleContentTabChange(tabButton) {
        const tabId = tabButton.getAttribute('data-tab');
        
        // Update active tab
        document.querySelectorAll('.content-tab').forEach(tab => tab.classList.remove('active'));
        tabButton.classList.add('active');
        
        // Update content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        const targetContent = document.getElementById(`${tabId}-content`);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    },

    // FAQ Management
    toggleFAQ(questionButton) {
        const answer = questionButton.nextElementSibling;
        const icon = questionButton.querySelector('.question-icon');
        
        if (answer.classList.contains('show')) {
            answer.classList.remove('show');
            icon.style.transform = 'rotate(0deg)';
        } else {
            // Close other FAQs
            document.querySelectorAll('.faq-answer.show').forEach(openAnswer => {
                openAnswer.classList.remove('show');
                const openIcon = openAnswer.previousElementSibling.querySelector('.question-icon');
                if (openIcon) openIcon.style.transform = 'rotate(0deg)';
            });
            
            // Open current FAQ
            answer.classList.add('show');
            icon.style.transform = 'rotate(180deg)';
        }
    },

    // Help form submission
    handleHelpFormSubmit(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        
        this.submitHelpRequest(data);
    },

    // Submit help request
    async submitHelpRequest(data) {
        this.showLoading();
        
        try {
            // Simulate API call
            await this.delay(1500);
            
            this.showNotification('تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً.', 'success');
            
        } catch (error) {
            this.showNotification('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.', 'error');
        } finally {
            this.hideLoading();
        }
    },

    // Course category change handler
    handleCategoryChange(event) {
        const category = event.target.value;
        const courseSelect = document.getElementById('course-select');
        
        if (courseSelect) {
            this.populateCourseOptions(courseSelect, category);
        }
    },

    // Populate course options based on category
    populateCourseOptions(selectElement, category) {
        // Clear existing options
        selectElement.innerHTML = '<option value="">اختر الدورة</option>';
        
        // Sample course data - in real app, this would come from API
        const coursesByCategory = {
            'recorded': [
                'التسويق الرقمي المتقدم',
                'إدارة المشاريع الاحترافية',
                'أساسيات التحليل المالي',
                'مهارات البيع المتقدمة'
            ],
            'live': [
                'ورشة التسويق الرقمي المتقدم',
                'دورة إدارة الموارد البشرية',
                'ورشة ريادة الأعمال'
            ],
            'industrial': [
                'تصنيع الحلويات والمخبوزات',
                'تقنيات اللحام الصناعي',
                'تركيب أنظمة الطاقة الشمسية'
            ],
            'management': [
                'إدارة وحدات الإنتاج',
                'التخطيط الصناعي',
                'مراقبة الجودة',
                'إعداد دراسة الجدوى'
            ]
        };
        
        const courses = coursesByCategory[category] || [];
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course;
            option.textContent = course;
            selectElement.appendChild(option);
        });
    },

    // Mobile menu toggle
    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        const menuBtn = document.getElementById('mobile-menu-btn');
        
        if (mobileMenu) {
            mobileMenu.classList.toggle('hidden');
            
            // Update button icon
            const icon = menuBtn.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        }
    },

    // Keyboard navigation
    handleKeyboardNavigation(event) {
        // ESC key closes modals and mobile menu
        if (event.key === 'Escape') {
            this.closeAllModals();
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                this.toggleMobileMenu();
            }
        }
        
        // Enter key on course cards
        if (event.key === 'Enter' && event.target.closest('.course-card')) {
            this.handleCourseClick(event.target.closest('.course-card'));
        }
    },

    // Scroll handling
    handleScroll() {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Lazy loading for course images
        this.lazyLoadImages();
    },

    // Lazy load images
    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    },

    // Window resize handling
    handleResize() {
        // Update layout calculations
        this.updateLayoutCalculations();
        
        // Close mobile menu on desktop
        if (window.innerWidth >= 1024) {
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                this.toggleMobileMenu();
            }
        }
    },

    // Update layout calculations
    updateLayoutCalculations() {
        // Recalculate sticky elements
        const stickyElements = document.querySelectorAll('.sticky');
        stickyElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            // Update calculations as needed
        });
    },

    // Page-specific initializations
    initializeCoursesMain() {
        this.initializeCounters();
        this.setupInfiniteScroll();
    },

    initializeRecordedCourses() {
        this.setupAdvancedFilters();
        this.initializeCourseComparison();
    },

    initializeLiveCourses() {
        this.initializeCalendar();
        this.setupAvailabilityTracking();
    },

    initializeIndustrialCourses() {
        this.initializeCategoryAnimations();
        this.setupIndustryFilters();
    },

    initializeManagementCourses() {
        this.initializeProgressTracking();
        this.setupCertificationInfo();
    },

    initializeCourseDetails() {
        this.initializeVideoPlayer();
        this.setupCurriculumExpansion();
        this.loadRelatedCourses();
    },

    initializeRegistration() {
        this.loadSavedFormData();
        this.setupFormAutocomplete();
    },

    // Counter animations
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
    },

    // Animate counter
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-counter'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };
        
        updateCounter();
    },

    // Setup infinite scroll
    setupInfiniteScroll() {
        const loadMoreBtn = document.querySelector('.load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', this.loadMoreCourses.bind(this));
        }
        
        // Auto-load on scroll
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !this.state.isLoading) {
                this.loadMoreCourses();
            }
        });
        
        const sentinel = document.querySelector('.scroll-sentinel');
        if (sentinel) {
            observer.observe(sentinel);
        }
    },

    // Load more courses
    async loadMoreCourses() {
        if (this.state.isLoading) return;
        
        this.state.isLoading = true;
        this.showLoading();
        
        try {
            // Simulate API call
            await this.delay(1000);
            
            // Add new courses to the grid
            this.appendNewCourses();
            
        } catch (error) {
            this.showError('فشل في تحميل المزيد من الدورات');
        } finally {
            this.state.isLoading = false;
            this.hideLoading();
        }
    },

    // Append new courses to grid
    appendNewCourses() {
        const coursesGrid = document.getElementById('courses-grid');
        if (!coursesGrid) return;
        
        // Sample new courses - in real app, this would come from API
        const newCourses = this.generateSampleCourses(6);
        newCourses.forEach((course, index) => {
            setTimeout(() => {
                coursesGrid.appendChild(this.createCourseCard(course));
            }, index * 100);
        });
    },

    // Generate sample courses
    generateSampleCourses(count) {
        const sampleCourses = [];
        for (let i = 0; i < count; i++) {
            sampleCourses.push({
                id: Date.now() + i,
                title: `دورة تدريبية ${i + 1}`,
                description: 'وصف الدورة التدريبية...',
                price: Math.floor(Math.random() * 10000) + 2000,
                category: 'marketing',
                level: 'beginner',
                duration: '10 ساعات'
            });
        }
        return sampleCourses;
    },

    // Create course card element
    createCourseCard(course) {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.setAttribute('data-course-id', course.id);
        card.setAttribute('data-category', course.category);
        card.setAttribute('data-level', course.level);
        
        card.innerHTML = `
            <img src="assets/images/courses/placeholder.jpg" alt="${course.title}">
            <div class="card-content">
                <span class="course-category category-${course.category}">${this.courseData.categories[course.category]}</span>
                <h3 class="course-title">${course.title}</h3>
                <p class="course-description">${course.description}</p>
                <div class="course-meta">
                    <span>${course.duration}</span>
                    <div class="course-rating">
                        <i class="fas fa-star"></i>
                        <span>4.5 (120)</span>
                    </div>
                </div>
                <div class="course-price">
                    <span class="current-price">${course.price.toLocaleString()} دج</span>
                    <button class="course-btn">ابدأ الآن</button>
                </div>
            </div>
        `;
        
        return card;
    },

    // Load saved form data
    loadSavedFormData() {
        const savedData = localStorage.getItem('courseRegistrationData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                this.populateFormData(data);
            } catch (error) {
                console.error('Error loading saved form data:', error);
            }
        }
    },

    // Populate form with saved data
    populateFormData(data) {
        Object.keys(data).forEach(key => {
            const field = document.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = data[key];
            }
        });
    },

    // Setup form validation
    setupFormValidation() {
        // Add custom validation messages
        const inputs = document.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('invalid', (e) => {
                e.preventDefault();
                this.showCustomValidationMessage(input);
            });
        });
    },

    // Show custom validation message
    showCustomValidationMessage(field) {
        const messages = {
            'valueMissing': 'هذا الحقل مطلوب',
            'typeMismatch': 'يرجى إدخال قيمة صحيحة',
            'patternMismatch': 'التنسيق غير صحيح'
        };
        
        const validity = field.validity;
        let message = 'يرجى تصحيح هذا الحقل';
        
        for (const key in messages) {
            if (validity[key]) {
                message = messages[key];
                break;
            }
        }
        
        this.updateFieldValidation(field, false, message);
    },

    // Initialize animations
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
        this.setupScrollAnimations();
    },

    // Setup scroll animations
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        });
        
        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    },

    // Load course data
    async loadCourseData() {
        try {
            // In a real application, this would fetch from an API
            // For now, we'll use sample data
            this.state.courseData = await this.fetchCourseData();
        } catch (error) {
            console.error('Error loading course data:', error);
        }
    },

    // Fetch course data (simulated)
    async fetchCourseData() {
        await this.delay(500);
        return {
            courses: this.generateSampleCourses(20),
            categories: this.courseData.categories,
            levels: this.courseData.levels
        };
    },

    // Utility Functions
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
    },

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    showLoading() {
        const loader = document.querySelector('.loading-spinner') || this.createLoader();
        loader.style.display = 'block';
    },

    hideLoading() {
        const loader = document.querySelector('.loading-spinner');
        if (loader) {
            loader.style.display = 'none';
        }
    },

    createLoader() {
        const loader = document.createElement('div');
        loader.className = 'loading-spinner';
        loader.innerHTML = `
            <div class="spinner">
                <div class="bounce1"></div>
                <div class="bounce2"></div>
                <div class="bounce3"></div>
            </div>
        `;
        loader.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            display: none;
        `;
        document.body.appendChild(loader);
        return loader;
    },

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const colors = {
            success: '#10B981',
            error: '#EF4444',
            warning: '#F59E0B',
            info: '#3B82F6'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    },

    showError(message) {
        this.showNotification(message, 'error');
    },

    updateResultsCount(count) {
        const resultsElement = document.querySelector('.results-count');
        if (resultsElement) {
            resultsElement.textContent = `النتائج (${count} دورة)`;
        }
    },

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.add('hidden');
        });
    },

    showEnrollmentModal(courseId) {
        // Implementation for enrollment modal
        console.log('Show enrollment modal for course:', courseId);
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    CourseManager.init();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CourseManager;
}
// إضافة وظائف التنقل
const NavigationManager = {
    // التنقل بين صفحات الدورات
    navigateToCoursePage(pageType) {
        const pages = {
            'recorded': 'recorded-courses.html',
            'live': 'live-courses.html',
            'industrial': 'industrial-courses.html',
            'management': 'management-courses.html',
            'registration': 'registration.html'
        };
        
        if (pages[pageType]) {
            window.location.href = pages[pageType];
        }
    },

    // التنقل إلى تفاصيل الدورة
    navigateToCourseDetails(courseId) {
        sessionStorage.setItem('selectedCourseId', courseId);
        window.location.href = `course-details.html?id=${courseId}`;
    },

    // التنقل إلى صفحة التسجيل
    navigateToRegistration(courseId = null) {
        if (courseId) {
            sessionStorage.setItem('registrationCourseId', courseId);
        }
        window.location.href = 'registration.html';
    },

    // العودة للصفحة السابقة
    goBack() {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = 'index.html';
        }
    }
};

// ربط الأحداث بالأزرار
document.addEventListener('DOMContentLoaded', function() {
    // أزرار التبويبات
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabType = this.getAttribute('data-tab');
            if (tabType && tabType !== 'recorded') { // إذا لم نكن في التبويب الحالي
                NavigationManager.navigateToCoursePage(tabType);
            }
        });
    });

    // أزرار الدورات
    document.querySelectorAll('.course-card').forEach(card => {
        const button = card.querySelector('button');
        if (button) {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                const courseId = card.getAttribute('data-course-id') || 'default';
                NavigationManager.navigateToCourseDetails(courseId);
            });
        }
    });

    // أزرار التسجيل
    document.querySelectorAll('[data-action="register"]').forEach(btn => {
        btn.addEventListener('click', function() {
            const courseId = this.getAttribute('data-course-id');
            NavigationManager.navigateToRegistration(courseId);
        });
    });

    // أزرار العودة
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', NavigationManager.goBack);
    });
});

// إضافة إلى CourseManager الموجود
CourseManager.navigation = NavigationManager;

// Global access
window.CourseManager = CourseManager;
