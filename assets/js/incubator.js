// ===== Incubator JavaScript - رفيق توريق =====

// Global Variables
let currentStep = 1;
let totalSteps = 4;
let formData = {};
let isSubmitting = false;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeIncubator();
});

// Initialize Incubator Functions
function initializeIncubator() {
    initializeAOS();
    initializeCounters();
    initializeFormHandlers();
    initializeFilterHandlers();
    initializeModalHandlers();
    initializeMobileMenu();
    initializeScrollEffects();
    initializeTooltips();
    initializeAutoSave();
    
    console.log('🚀 Incubator initialized successfully!');
}

// Initialize AOS (Animate On Scroll)
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }
}

// Counter Animation
function initializeCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
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
}

// Form Handlers
function initializeFormHandlers() {
    initializeStepNavigation();
    initializeFormValidation();
    initializeFormSubmission();
    initializeDynamicFields();
}

// Step Navigation
function initializeStepNavigation() {
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    nextButtons.forEach(btn => {
        btn.addEventListener('click', handleNextStep);
    });
    
    prevButtons.forEach(btn => {
        btn.addEventListener('click', handlePrevStep);
    });
}

function handleNextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStep(currentStep);
            
            if (currentStep === totalSteps) {
                updateApplicationSummary();
            }
        }
    }
}

function handlePrevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStep(currentStep);
    }
}

function updateStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(s => {
        s.classList.remove('active');
    });
    
    // Show current step
    const currentStepElement = document.querySelector(`[data-step="${step}"]`);
    if (currentStepElement) {
        currentStepElement.classList.add('active');
    }
    
    // Update step indicators
    updateStepIndicators(step);
    
    // Scroll to top of form
    currentStepElement?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

function updateStepIndicators(step) {
    document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
        if (index + 1 <= step) {
            indicator.classList.add('active');
            indicator.classList.remove('bg-gray-300', 'text-gray-600');
            indicator.classList.add('bg-green-600', 'text-white');
        } else {
            indicator.classList.remove('active');
            indicator.classList.remove('bg-green-600', 'text-white');
            indicator.classList.add('bg-gray-300', 'text-gray-600');
        }
    });
    
    // Update step lines
    document.querySelectorAll('.step-line').forEach((line, index) => {
        if (index + 1 < step) {
            line.classList.remove('bg-gray-300');
            line.classList.add('bg-green-600');
        } else {
            line.classList.remove('bg-green-600');
            line.classList.add('bg-gray-300');
        }
    });
}

// Form Validation
function initializeFormValidation() {
    const form = document.getElementById('incubator-registration-form');
    if (!form) return;
    
    // Real-time validation
    form.addEventListener('input', handleFieldValidation);
    form.addEventListener('change', handleFieldValidation);
    
    // Add validation to specific fields
    const emailField = document.getElementById('email');
    const phoneField = document.getElementById('phone');
    const ageField = document.getElementById('age');
    
    if (emailField) {
        emailField.addEventListener('blur', () => validateEmail(emailField));
    }
    
    if (phoneField) {
        phoneField.addEventListener('blur', () => validatePhone(phoneField));
    }
    
    if (ageField) {
        ageField.addEventListener('blur', () => validateAge(ageField));
    }
}

function handleFieldValidation(event) {
    const field = event.target;
    if (field.hasAttribute('required') || field.type === 'email' || field.type === 'tel') {
        validateField(field);
    }
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'هذا الحقل مطلوب';
    }
    
    // Specific validations
    if (value) {
        if (field.type === 'email') {
            isValid = validateEmail(field);
        } else if (field.type === 'tel') {
            isValid = validatePhone(field);
        } else if (field.type === 'number' && field.id === 'age') {
            isValid = validateAge(field);
        }
    }
    
    updateFieldAppearance(field, isValid, errorMessage);
    return isValid;
}

function validateEmail(field) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(field.value);
    
    if (!isValid) {
        updateFieldAppearance(field, false, 'يرجى إدخال بريد إلكتروني صحيح');
    }
    
    return isValid;
}

function validatePhone(field) {
    const phoneRegex = /^0[567][0-9]{8}$/;
    const isValid = phoneRegex.test(field.value);
    
    if (!isValid) {
        updateFieldAppearance(field, false, 'يرجى إدخال رقم هاتف صحيح (05/06/07)');
    }
    
    return isValid;
}

function validateAge(field) {
    const age = parseInt(field.value);
    const isValid = age >= 18 && age <= 65;
    
    if (!isValid) {
        updateFieldAppearance(field, false, 'يجب أن يكون العمر بين 18 و 65 سنة');
    }
    
    return isValid;
}

function updateFieldAppearance(field, isValid, errorMessage = '') {
    const errorElement = field.parentNode.querySelector('.error-message');
    
    if (isValid) {
        field.classList.remove('border-red-500');
        field.classList.add('border-green-500');
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
    } else {
        field.classList.remove('border-green-500');
        field.classList.add('border-red-500');
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.classList.remove('hidden');
        }
    }
}

function validateCurrentStep() {
    const currentStepElement = document.querySelector(`[data-step="${currentStep}"]`);
    if (!currentStepElement) return true;
    
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Dynamic Fields
function initializeDynamicFields() {
    // Team size field toggle
    const hasTeamRadios = document.querySelectorAll('input[name="has-team"]');
    const teamDetails = document.querySelector('.team-details');
    
    hasTeamRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'yes' && teamDetails) {
                teamDetails.classList.remove('hidden');
            } else if (teamDetails) {
                teamDetails.classList.add('hidden');
            }
        });
    });
    
    // Project type specific fields
    const projectTypeSelect = document.getElementById('project-type');
    if (projectTypeSelect) {
        projectTypeSelect.addEventListener('change', handleProjectTypeChange);
    }
}

function handleProjectTypeChange(event) {
    const selectedType = event.target.value;
    
    // Add specific fields based on project type
    // This can be expanded based on requirements
    console.log('Project type changed to:', selectedType);
}

// Form Submission
function initializeFormSubmission() {
    const form = document.getElementById('incubator-registration-form');
    if (!form) return;
    
    form.addEventListener('submit', handleFormSubmission);
}

function handleFormSubmission(event) {
    event.preventDefault();
    
    if (isSubmitting) return;
    
    // Validate terms agreement
    const termsCheckbox = document.getElementById('terms-agreement');
    if (termsCheckbox && !termsCheckbox.checked) {
        const errorElement = termsCheckbox.closest('.form-group')?.querySelector('.error-message');
        if (errorElement) {
            errorElement.classList.remove('hidden');
        }
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin ml-2"></i> جاري الإرسال...';
    submitBtn.disabled = true;
    isSubmitting = true;
    
    // Collect form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate form submission
    setTimeout(() => {
        showSuccessMessage();
        clearAutoSavedData();
        
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        isSubmitting = false;
        
    }, 2000);
}

function showSuccessMessage() {
    const form = document.getElementById('incubator-registration-form');
    const successMessage = document.getElementById('success-message');
    
    if (form && successMessage) {
        form.style.display = 'none';
        successMessage.classList.remove('hidden');
        
        // Generate application number
        const appNumber = generateApplicationNumber();
        const appNumberElement = document.getElementById('application-number');
        if (appNumberElement) {
            appNumberElement.textContent = appNumber;
        }
        
        // Scroll to success message
        successMessage.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        // Show notification
        showNotification('تم إرسال طلبك بنجاح!', 'success');
    }
}

function generateApplicationNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `INC-${year}${month}${day}-${random}`;
}

// Application Summary
function updateApplicationSummary() {
    const form = document.getElementById('incubator-registration-form');
    if (!form) return;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const summaryHTML = `
        <div class="summary-item flex justify-between py-2 border-b border-gray-200">
            <strong class="text-gray-700">الاسم الكامل:</strong> 
            <span class="text-gray-900">${data['full-name'] || 'غير محدد'}</span>
        </div>
        <div class="summary-item flex justify-between py-2 border-b border-gray-200">
            <strong class="text-gray-700">البريد الإلكتروني:</strong> 
            <span class="text-gray-900">${data['email'] || 'غير محدد'}</span>
        </div>
        <div class="summary-item flex justify-between py-2 border-b border-gray-200">
            <strong class="text-gray-700">رقم الهاتف:</strong> 
            <span class="text-gray-900">${data['phone'] || 'غير محدد'}</span>
        </div>
        <div class="summary-item flex justify-between py-2 border-b border-gray-200">
            <strong class="text-gray-700">اسم المشروع:</strong> 
            <span class="text-gray-900">${data['project-name'] || 'غير محدد'}</span>
        </div>
        <div class="summary-item flex justify-between py-2 border-b border-gray-200">
            <strong class="text-gray-700">نوع المشروع:</strong> 
            <span class="text-gray-900">${getProjectTypeName(data['project-type']) || 'غير محدد'}</span>
        </div>
        <div class="summary-item flex justify-between py-2 border-b border-gray-200">
            <strong class="text-gray-700">التمويل المطلوب:</strong> 
            <span class="text-gray-900">${getFundingName(data['funding-needed']) || 'غير محدد'}</span>
        </div>
        <div class="summary-item flex justify-between py-2">
            <strong class="text-gray-700">مرحلة المشروع:</strong> 
            <span class="text-gray-900">${getProjectStageName(data['project-stage']) || 'غير محدد'}</span>
        </div>
    `;
    
    const summaryElement = document.getElementById('application-summary');
    if (summaryElement) {
        summaryElement.innerHTML = summaryHTML;
    }
}

// Helper functions for display names
function getProjectTypeName(type) {
    const types = {
        'digital': 'مشروع رقمي/تقني',
        'traditional': 'مشروع تقليدي/صناعي',
        'service': 'خدمات',
        'ecommerce': 'تجارة إلكترونية',
        'manufacturing': 'تصنيع',
        'food': 'صناعات غذائية'
    };
    return types[type] || type;
}

function getFundingName(funding) {
    const fundings = {
        'under-1m': 'أقل من مليون دج',
        '1m-5m': '1-5 مليون دج',
        '5m-10m': '5-10 مليون دج',
        '10m-20m': '10-20 مليون دج',
        '20m-50m': '20-50 مليون دج',
        'over-50m': 'أكثر من 50 مليون دج'
    };
    return fundings[funding] || funding;
}

function getProjectStageName(stage) {
    const stages = {
        'idea': 'مجرد فكرة',
        'planning': 'مرحلة التخطيط',
        'prototype': 'نموذج أولي',
        'mvp': 'منتج أولي',
        'launched': 'تم الإطلاق',
        'scaling': 'مرحلة النمو'
    };
    return stages[stage] || stage;
}

// Auto Save Functionality
function initializeAutoSave() {
    const form = document.getElementById('incubator-registration-form');
    if (!form) return;
    
    // Load saved data on page load
    loadAutoSavedData();
    
    // Auto-save on input change
    form.addEventListener('input', debounce(autoSaveFormData, 1000));
    form.addEventListener('change', autoSaveFormData);
}

function autoSaveFormData() {
    const form = document.getElementById('incubator-registration-form');
    if (!form) return;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
        localStorage.setItem('incubatorRegistrationData', JSON.stringify(data));
        showAutoSaveIndicator();
    } catch (error) {
        console.error('Error saving form data:', error);
    }
}

function loadAutoSavedData() {
    try {
        const savedData = localStorage.getItem('incubatorRegistrationData');
        if (!savedData) return;
        
        const data = JSON.parse(savedData);
        
        // Populate form fields
        Object.keys(data).forEach(key => {
            const field = document.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'radio') {
                    const radioField = document.querySelector(`[name="${key}"][value="${data[key]}"]`);
                    if (radioField) radioField.checked = true;
                } else if (field.type === 'checkbox') {
                    field.checked = data[key] === 'on';
                } else {
                    field.value = data[key];
                }
            }
        });
        
        console.log('Auto-saved data loaded successfully');
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
}

function clearAutoSavedData() {
    try {
        localStorage.removeItem('incubatorRegistrationData');
    } catch (error) {
        console.error('Error clearing saved data:', error);
    }
}

function showAutoSaveIndicator() {
    // Remove existing indicator
    const existingIndicator = document.querySelector('.auto-save-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    const indicator = document.createElement('div');
    indicator.className = 'auto-save-indicator fixed top-24 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50 opacity-0 transition-opacity duration-300';
    indicator.innerHTML = '<i class="fas fa-check ml-2"></i>تم الحفظ تلقائياً';
    
    document.body.appendChild(indicator);
    
    // Show indicator
    setTimeout(() => indicator.style.opacity = '1', 100);
    
    // Hide and remove indicator
    setTimeout(() => {
        indicator.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(indicator)) {
                document.body.removeChild(indicator);
            }
        }, 300);
    }, 2000);
}

// Filter Handlers
function initializeFilterHandlers() {
    const searchInput = document.getElementById('story-search');
    const filterSelects = document.querySelectorAll('.story-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterStories, 300));
    }
    
    filterSelects.forEach(select => {
        select.addEventListener('change', filterStories);
    });
}

function filterStories() {
    const searchTerm = document.getElementById('story-search')?.value.toLowerCase() || '';
    const sectorFilter = document.querySelector('[data-filter="sector"]')?.value || '';
    const typeFilter = document.querySelector('[data-filter="type"]')?.value || '';
    const yearFilter = document.querySelector('[data-filter="year"]')?.value || '';
    
    const storyCards = document.querySelectorAll('.success-story-card');
    
    storyCards.forEach(card => {
        const title = card.querySelector('h4')?.textContent.toLowerCase() || '';
        const description = card.querySelector('p')?.textContent.toLowerCase() || '';
        const sector = card.getAttribute('data-sector') || '';
        const type = card.getAttribute('data-type') || '';
        const year = card.getAttribute('data-year') || '';
        
        const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
        const matchesSector = !sectorFilter || sector === sectorFilter;
        const matchesType = !typeFilter || type === typeFilter;
        const matchesYear = !yearFilter || year === yearFilter;
        
        if (matchesSearch && matchesSector && matchesType && matchesYear) {
            card.style.display = 'block';
            card.style.opacity = '0';
            setTimeout(() => {
                card.style.opacity = '1';
            }, 100);
        } else {
            card.style.display = 'none';
        }
    });
}

// Modal Handlers
function initializeModalHandlers() {
    // Close modal when clicking outside
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('story-modal');
        if (modal && event.target === modal) {
            closeStoryModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeStoryModal();
        }
    });
}

function openStoryModal(storyId) {
    const modal = document.getElementById('story-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    if (!modal || !modalTitle || !modalContent) return;
    
    // Get story data (this would typically come from an API)
    const storyData = getStoryData(storyId);
    
    modalTitle.textContent = storyData.title;
    modalContent.innerHTML = generateStoryContent(storyData);
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeStoryModal() {
    const modal = document.getElementById('story-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function getStoryData(storyId) {
    // This would typically fetch data from an API
    const stories = {
        'featured': {
            title: 'منصة "تعلم معنا" - قصة نجاح ملهمة',
            founder: 'سارة أحمد',
            company: 'منصة تعلم معنا',
            content: `
                <div class="space-y-6">
                    <div class="flex items-center mb-6">
                        <img src="../../assets/images/founders/sarah-ahmed.jpg" alt="سارة أحمد" class="w-20 h-20 rounded-full ml-4">
                        <div>
                            <h4 class="text-xl font-bold">سارة أحمد</h4>
                            <p class="text-gray-600">مؤسسة منصة "تعلم معنا"</p>
                            <p class="text-sm text-gray-500">الجزائر العاصمة • 2023</p>
                        </div>
                    </div>
                    
                    <div class="prose max-w-none">
                        <h5 class="text-lg font-bold mb-3">البداية</h5>
                        <p class="mb-4">بدأت سارة رحلتها كمدرسة في إحدى المدارس الثانوية، ولاحظت صعوبة الطلاب في الوصول لمواد تعليمية عالية الجودة خاصة أثناء جائحة كوفيد-19.</p>
                        
                        <h5 class="text-lg font-bold mb-3">الفكرة</h5>
                        <p class="mb-4">جاءت فكرة إنشاء منصة تعليمية تفاعلية تجمع أفضل المدرسين في الجزائر لتقديم دروس عالية الجودة للطلاب في جميع أنحاء البلاد.</p>
                        
                        <h5 class="text-lg font-bold mb-3">الدعم من الحاضنة</h5>
                        <p class="mb-4">انضمت سارة لحاضنة رفيق توريق في 2022، حيث حصلت على:</p>
                        <ul class="list-disc list-inside mb-4 space-y-1">
                            <li>تمويل أولي بقيمة 5 مليون دج</li>
                            <li>إرشاد تقني من خبراء في التكنولوجيا التعليمية</li>
                            <li>دعم في تطوير نموذج العمل</li>
                            <li>ربط مع شبكة من المستثمرين</li>
                        </ul>
                        
                        <h5 class="text-lg font-bold mb-3">النتائج</h5>
                        <p class="mb-4">خلال سنتين، حققت المنصة نتائج مذهلة:</p>
                        <ul class="list-disc list-inside mb-4 space-y-1">
                            <li>100,000+ طالب مسجل</li>
                            <li>500+ مدرس متخصص</li>
                            <li>50+ دورة تعليمية</li>
                            <li>15 مليون دج إيرادات سنوية</li>
                            <li>توسع في 5 دول عربية</li>
                        </ul>
                        
                        <h5 class="text-lg font-bold mb-3">رسالة للمؤسسين الجدد</h5>
                        <blockquote class="border-r-4 border-blue-500 pr-4 italic">
                            "لا تخافوا من البدء بفكرة بسيطة. المهم هو التنفيذ والمثابرة. حاضنة رفيق توريق لم تقدم لي التمويل فقط، بل وفرت لي شبكة دعم كاملة ساعدتني على تجاوز جميع التحديات."
                        </blockquote>
                    </div>
                </div>
            `
        },
        'delivery-app': {
            title: 'تطبيق التوصيل الذكي',
            founder: 'محمد أحمد',
            company: 'توصيل سريع',
            content: `
                <div class="space-y-6">
                    <p class="text-lg">قصة نجاح تطبيق التوصيل الذكي الذي يستخدم الذكاء الاصطناعي...</p>
                    <!-- Add more detailed content here -->
                </div>
            `
        }
        // Add more stories as needed
    };
    
    return stories[storyId] || {
        title: 'قصة نجاح',
        content: '<p>تفاصيل القصة غير متوفرة حالياً.</p>'
    };
}

function generateStoryContent(storyData) {
    return storyData.content;
}

// Mobile Menu
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            const icon = this.querySelector('i');
            
            if (mobileMenu.classList.contains('hidden')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// Scroll Effects
function initializeScrollEffects() {
    initializeBackToTop();
    initializeHeaderScroll();
    initializeScrollProgress();
}

function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.remove('opacity-0', 'invisible');
        } else {
            backToTopBtn.classList.add('opacity-0', 'invisible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initializeHeaderScroll() {
    const header = document.getElementById('main-header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.classList.add('bg-white/95', 'backdrop-blur-md');
        } else {
            header.classList.remove('bg-white/95', 'backdrop-blur-md');
        }
        
        // Hide/show header on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });
}

function initializeScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'fixed top-0 left-0 h-1 bg-gradient-to-r from-green-500 to-blue-500 z-50 transition-all duration-300';
    progressBar.style.width = '0%';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// Tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event) {
    const element = event.target;
    const tooltipText = element.getAttribute('data-tooltip');
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip-popup absolute bg-gray-800 text-white px-2 py-1 rounded text-sm z-50';
    tooltip.textContent = tooltipText;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
    
    element._tooltip = tooltip;
}

function hideTooltip(event) {
    const element = event.target;
    if (element._tooltip) {
        document.body.removeChild(element._tooltip);
        element._tooltip = null;
    }
}

// Utility Functions
function debounce(func, wait) {
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

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-24 right-4 p-4 rounded-lg shadow-lg text-white z-50 opacity-0 transition-all duration-300 transform translate-x-full`;
    
    const colors = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        warning: 'bg-yellow-600',
        info: 'bg-blue-600'
    };
    
    notification.classList.add(colors[type] || colors.info);
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : type === 'warning' ? 'exclamation' : 'info'} ml-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.remove('opacity-0', 'translate-x-full');
    }, 100);
    
    // Hide notification
    setTimeout(() => {
        notification.classList.add('opacity-0', 'translate-x-full');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Load More Functionality
function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-stories');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin ml-2"></i>جاري التحميل...';
            
            // Simulate loading
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-plus ml-2"></i>عرض المزيد من القصص';
                showNotification('تم تحميل المزيد من القصص', 'success');
            }, 1500);
        });
    }
}

// Initialize load more when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeLoadMore();
});

// Export functions for global use
window.IncubatorJS = {
    openStoryModal,
    closeStoryModal,
    showNotification,
    smoothScrollTo,
    validateField,
    updateStep
};

console.log('🚀 Incubator JavaScript loaded successfully!');
