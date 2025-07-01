// ===== Consulting JavaScript - رفيق توريق =====

// Global Variables
let consultingData = {
    currentStep: 1,
    totalSteps: 4,
    formData: {},
    selectedConsultant: null,
    selectedDate: null,
    selectedTime: null,
    isSubmitting: false,
    autoSaveEnabled: true
};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeConsulting();
});

// Initialize Consulting System
function initializeConsulting() {
    console.log('🏢 Initializing Consulting System...');
    
    initializeAOS();
    initializeCounters();
    initializeFormHandlers();
    initializeFilterHandlers();
    initializeModalHandlers();
    initializeMobileMenu();
    initializeScrollEffects();
    initializeTooltips();
    initializeAutoSave();
    initializeCalendar();
    initializeNotifications();
    initializeProfileNavigation();
    initializePortfolioFilter();
    initializeFAQ();
    initializeContactForm();
    initializeLoadMore();
    
    console.log('✅ Consulting system initialized successfully!');
}

// Initialize AOS (Animate On Scroll)
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic',
            disable: window.innerWidth < 768 ? true : false
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
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
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
            element.classList.add('animate-pulse');
            setTimeout(() => {
                element.classList.remove('animate-pulse');
            }, 1000);
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
    initializePaymentHandlers();
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
        if (consultingData.currentStep < consultingData.totalSteps) {
            consultingData.currentStep++;
            updateStep(consultingData.currentStep);
            
            if (consultingData.currentStep === consultingData.totalSteps) {
                updateApplicationSummary();
            }
            
            // Auto-save progress
            autoSaveFormData();
            
            // Show success notification
            showNotification('تم الانتقال للخطوة التالية بنجاح', 'success');
        }
    }
}

function handlePrevStep() {
    if (consultingData.currentStep > 1) {
        consultingData.currentStep--;
        updateStep(consultingData.currentStep);
        autoSaveFormData();
    }
}

function updateStep(step) {
    // Hide all steps
    document.querySelectorAll('.form-step').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });
    
    // Show current step with animation
    const currentStepElement = document.querySelector(`[data-step="${step}"]`);
    if (currentStepElement) {
        currentStepElement.style.display = 'block';
        setTimeout(() => {
            currentStepElement.classList.add('active');
        }, 50);
    }
    
    // Update step indicators
    updateStepIndicators(step);
    
    // Update progress bar
    updateProgressBar(step);
    
    // Scroll to top of form
    currentStepElement?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
    
    // Update URL hash
    window.history.replaceState(null, null, `#step-${step}`);
}

function updateStepIndicators(step) {
    const indicators = document.querySelectorAll('.step-indicator');
    const lines = document.querySelectorAll('.step-line');
    
    indicators.forEach((indicator, index) => {
        if (index + 1 <= step) {
            indicator.classList.add('active');
            indicator.classList.remove('bg-gray-300', 'text-gray-600');
            indicator.classList.add('bg-gradient-to-r', 'from-teal-600', 'to-teal-700', 'text-white');
        } else {
            indicator.classList.remove('active');
            indicator.classList.remove('bg-gradient-to-r', 'from-teal-600', 'to-teal-700', 'text-white');
            indicator.classList.add('bg-gray-300', 'text-gray-600');
        }
    });
    
    lines.forEach((line, index) => {
        if (index + 1 < step) {
            line.classList.add('active');
            line.classList.remove('bg-gray-300');
            line.classList.add('bg-gradient-to-r', 'from-teal-600', 'to-teal-700');
        } else {
            line.classList.remove('active');
            line.classList.remove('bg-gradient-to-r', 'from-teal-600', 'to-teal-700');
            line.classList.add('bg-gray-300');
        }
    });
}

function updateProgressBar(step) {
    const progressBar = document.querySelector('.progress-bar-fill');
    if (progressBar) {
        const percentage = (step / consultingData.totalSteps) * 100;
        progressBar.style.width = `${percentage}%`;
    }
}

// Form Validation
function initializeFormValidation() {
    const form = document.getElementById('booking-form') || document.getElementById('contact-form');
    if (!form) return;
    
    // Real-time validation
    form.addEventListener('input', handleFieldValidation);
    form.addEventListener('change', handleFieldValidation);
    
    // Add validation to specific fields
    const emailFields = form.querySelectorAll('input[type="email"]');
    const phoneFields = form.querySelectorAll('input[type="tel"]');
    const numberFields = form.querySelectorAll('input[type="number"]');
    
    emailFields.forEach(field => {
        field.addEventListener('blur', () => validateEmail(field));
    });
    
    phoneFields.forEach(field => {
        field.addEventListener('blur', () => validatePhone(field));
    });
    
    numberFields.forEach(field => {
        field.addEventListener('blur', () => validateNumber(field));
    });
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
        } else if (field.type === 'number') {
            isValid = validateNumber(field);
        }
    }
    
    updateFieldAppearance(field, isValid, errorMessage);
    return isValid;
}

function validateEmail(field) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(field.value);
    
    if (!isValid && field.value.trim()) {
        updateFieldAppearance(field, false, 'يرجى إدخال بريد إلكتروني صحيح');
    }
    
    return isValid;
}

function validatePhone(field) {
    const phoneRegex = /^0[567][0-9]{8}$/;
    const isValid = phoneRegex.test(field.value);
    
    if (!isValid && field.value.trim()) {
        updateFieldAppearance(field, false, 'يرجى إدخال رقم هاتف صحيح (05/06/07)');
    }
    
    return isValid;
}

function validateNumber(field) {
    const value = parseFloat(field.value);
    const min = field.getAttribute('min');
    const max = field.getAttribute('max');
    
    let isValid = true;
    let errorMessage = '';
    
    if (isNaN(value)) {
        isValid = false;
        errorMessage = 'يرجى إدخال رقم صحيح';
    } else if (min && value < parseFloat(min)) {
        isValid = false;
        errorMessage = `القيمة يجب أن تكون أكبر من ${min}`;
    } else if (max && value > parseFloat(max)) {
        isValid = false;
        errorMessage = `القيمة يجب أن تكون أصغر من ${max}`;
    }
    
    if (!isValid) {
        updateFieldAppearance(field, false, errorMessage);
    }
    
    return isValid;
}

function updateFieldAppearance(field, isValid, errorMessage = '') {
    const errorElement = field.parentNode.querySelector('.error-message');
    
    // Remove previous classes
    field.classList.remove('border-red-500', 'border-green-500');
    
    if (isValid) {
        field.classList.add('border-green-500');
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
        
        // Add success animation
        field.style.transform = 'scale(1.02)';
        setTimeout(() => {
            field.style.transform = 'scale(1)';
        }, 150);
    } else {
        field.classList.add('border-red-500');
        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.classList.remove('hidden');
        }
        
        // Add error animation
        field.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            field.style.animation = '';
        }, 500);
    }
}

function validateCurrentStep() {
    const currentStepElement = document.querySelector(`[data-step="${consultingData.currentStep}"]`);
    if (!currentStepElement) return true;
    
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Custom validations per step
    switch (consultingData.currentStep) {
        case 1:
            isValid = validateStep1() && isValid;
            break;
        case 2:
            isValid = validateStep2() && isValid;
            break;
        case 3:
            isValid = validateStep3() && isValid;
            break;
    }
    
    if (!isValid) {
        showNotification('يرجى إكمال جميع الحقول المطلوبة', 'error');
    }
    
    return isValid;
}

function validateStep1() {
    const selectedConsultant = document.querySelector('input[name="consultant"]:checked');
    const consultationType = document.querySelector('input[name="consultation-type"]:checked');
    
    if (!selectedConsultant) {
        showNotification('يرجى اختيار مستشار', 'warning');
        return false;
    }
    
    if (!consultationType) {
        showNotification('يرجى اختيار نوع الاستشارة', 'warning');
        return false;
    }
    
    return true;
}

function validateStep2() {
    const selectedTime = document.querySelector('input[name="appointment-time"]:checked');
    const selectedDuration = document.querySelector('input[name="duration"]:checked');
    
    if (!selectedTime) {
        showNotification('يرجى اختيار موعد', 'warning');
        return false;
    }
    
    if (!selectedDuration) {
        showNotification('يرجى اختيار مدة الاستشارة', 'warning');
        return false;
    }
    
    return true;
}

function validateStep3() {
    const name = document.getElementById('client-name')?.value.trim();
    const email = document.getElementById('client-email')?.value.trim();
    const phone = document.getElementById('client-phone')?.value.trim();
    
    if (!name || !email || !phone) {
        showNotification('يرجى ملء جميع الحقول المطلوبة', 'warning');
        return false;
    }
    
    return true;
}

// Dynamic Fields
function initializeDynamicFields() {
    // Consultant selection
    document.querySelectorAll('input[name="consultant"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updateConsultantSelection();
            consultingData.selectedConsultant = this.value;
        });
    });
    
    // Time slot selection
    document.addEventListener('change', function(e) {
        if (e.target.name === 'appointment-time') {
            updateTimeSlotSelection();
            consultingData.selectedTime = e.target.value;
        }
    });
    
    // Duration selection
    document.querySelectorAll('input[name="duration"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updateBookingSummary();
        });
    });
    
    // Payment method change
    document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
        radio.addEventListener('change', function() {
            togglePaymentFields();
        });
    });
}

function updateConsultantSelection() {
    document.querySelectorAll('.consultant-option').forEach(option => {
        const radio = option.querySelector('input[type="radio"]');
        const card = option.querySelector('.consultant-card');
        
        if (radio.checked) {
            card.classList.add('border-teal-500', 'bg-teal-50', 'glow-effect');
            card.classList.remove('border-gray-200');
            
            // Add selection animation
            card.style.transform = 'scale(1.02)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 200);
        } else {
            card.classList.remove('border-teal-500', 'bg-teal-50', 'glow-effect');
            card.classList.add('border-gray-200');
        }
    });
    
    updateBookingSummary();
}

function updateTimeSlotSelection() {
    document.querySelectorAll('.time-slot').forEach(slot => {
        const radio = slot.querySelector('input[type="radio"]');
        const btn = slot.querySelector('.time-slot-btn');
        
        if (radio.checked) {
            btn.classList.add('border-teal-500', 'bg-teal-100', 'glow-effect');
            btn.classList.remove('border-gray-200');
        } else {
            btn.classList.remove('border-teal-500', 'bg-teal-100', 'glow-effect');
            btn.classList.add('border-gray-200');
        }
    });
    
    updateBookingSummary();
}

// Payment Handlers
function initializePaymentHandlers() {
    // Card number formatting
    const cardNumberField = document.getElementById('card-number');
    if (cardNumberField) {
        cardNumberField.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    // Expiry date formatting
    const expiryField = document.getElementById('expiry-date');
    if (expiryField) {
        expiryField.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // CVV validation
    const cvvField = document.getElementById('cvv');
    if (cvvField) {
        cvvField.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
        });
    }
}

function togglePaymentFields() {
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value;
    const cardDetails = document.getElementById('card-details');
    
    if (cardDetails) {
        if (paymentMethod === 'card') {
            cardDetails.style.display = 'block';
            cardDetails.classList.add('animate-fadeIn');
        } else {
            cardDetails.style.display = 'none';
            cardDetails.classList.remove('animate-fadeIn');
        }
    }
}

// Form Submission
function initializeFormSubmission() {
    const bookingForm = document.getElementById('booking-form');
    const contactForm = document.getElementById('contact-form');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmission);
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
    }
}

function handleBookingSubmission(event) {
    event.preventDefault();
    
    if (consultingData.isSubmitting) return;
    
    // Validate terms agreement
    const termsCheckbox = document.getElementById('terms-agreement');
    if (termsCheckbox && !termsCheckbox.checked) {
        showNotification('يجب الموافقة على الشروط والأحكام', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = document.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin ml-2"></i> جاري المعالجة...';
    submitBtn.disabled = true;
    consultingData.isSubmitting = true;
    
    // Collect form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate booking process
    setTimeout(() => {
        showBookingSuccess();
        clearAutoSavedData();
        
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        consultingData.isSubmitting = false;
        
        // Send confirmation email (simulation)
        sendConfirmationEmail(data);
        
    }, 3000);
}

function handleContactSubmission(event) {
    event.preventDefault();
    
    if (consultingData.isSubmitting) return;
    
    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin ml-2"></i> جاري الإرسال...';
    submitBtn.disabled = true;
    consultingData.isSubmitting = true;
    
    // Collect form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate form submission
    setTimeout(() => {
        showNotification('تم إرسال رسالتك بنجاح! سنقوم بالرد عليك خلال 24 ساعة.', 'success');
        
        // Reset form
        event.target.reset();
        
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        consultingData.isSubmitting = false;
        
    }, 2000);
}

function showBookingSuccess() {
    const form = document.getElementById('booking-form');
    const successMessage = document.getElementById('booking-success');
    
    if (form && successMessage) {
        form.style.display = 'none';
        successMessage.classList.remove('hidden');
        successMessage.classList.add('animate-fadeIn');
        
        // Generate booking number
        const bookingNumber = generateBookingNumber();
        const bookingNumberElement = document.getElementById('booking-number');
        if (bookingNumberElement) {
            bookingNumberElement.textContent = bookingNumber;
        }
        
        // Scroll to success message
        successMessage.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        // Show celebration animation
        createCelebrationEffect();
    }
}

function generateBookingNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `CONS-${year}${month}${day}-${random}`;
}

function sendConfirmationEmail(data) {
    //
    // Simulate sending confirmation email
    console.log('📧 Sending confirmation email to:', data.email);
    showNotification('تم إرسال رسالة تأكيد إلى بريدك الإلكتروني', 'info');
}

function createCelebrationEffect() {
    // Create confetti effect
    for (let i = 0; i < 50; i++) {
        createConfetti();
    }
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = ['#0d9488', '#06b6d4', '#f59e0b', '#10b981'][Math.floor(Math.random() * 4)];
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-10px';
    confetti.style.zIndex = '9999';
    confetti.style.borderRadius = '50%';
    confetti.style.pointerEvents = 'none';
    
    document.body.appendChild(confetti);
    
    const animation = confetti.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(100vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], {
        duration: Math.random() * 3000 + 2000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    
    animation.onfinish = () => {
        confetti.remove();
    };
}

// Application Summary
function updateApplicationSummary() {
    const form = document.getElementById('booking-form');
    if (!form) return;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    const summaryHTML = generateSummaryHTML(data);
    
    const summaryElement = document.getElementById('booking-summary');
    const finalSummaryElement = document.getElementById('final-booking-summary');
    
    if (summaryElement) {
        summaryElement.innerHTML = summaryHTML;
    }
    
    if (finalSummaryElement) {
        finalSummaryElement.innerHTML = summaryHTML;
    }
}

function updateBookingSummary() {
    const selectedConsultant = document.querySelector('input[name="consultant"]:checked');
    const selectedDate = document.querySelector('input[name="appointment-time"]:checked');
    const selectedDuration = document.querySelector('input[name="duration"]:checked');
    const consultationType = document.querySelector('input[name="consultation-type"]:checked');
    
    const summaryContainer = document.getElementById('booking-summary');
    const finalSummaryContainer = document.getElementById('final-booking-summary');
    
    let summaryHTML = '';
    let totalPrice = 0;
    
    if (selectedConsultant) {
        const consultantCard = selectedConsultant.closest('.consultant-option').querySelector('.consultant-card');
        const consultantName = consultantCard.querySelector('h3').textContent;
        const priceElement = consultantCard.querySelector('.font-bold');
        const consultantPrice = priceElement ? priceElement.textContent : '5,000 دج';
        
        // Extract price number
        const priceMatch = consultantPrice.match(/(\d+,?\d*)/);
        if (priceMatch) {
            totalPrice = parseInt(priceMatch[1].replace(',', ''));
        }
        
        summaryHTML += `
            <div class="flex justify-between py-2 border-b border-gray-200">
                <strong>المستشار:</strong> 
                <span>${consultantName}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-200">
                <strong>السعر الأساسي:</strong> 
                <span>${consultantPrice}</span>
            </div>
        `;
    }
    
    if (consultationType) {
        const typeLabel = consultationType.closest('label').querySelector('span').textContent;
        summaryHTML += `
            <div class="flex justify-between py-2 border-b border-gray-200">
                <strong>نوع الاستشارة:</strong> 
                <span>${typeLabel}</span>
            </div>
        `;
    }
    
    if (selectedDuration) {
        const duration = selectedDuration.value;
        let durationMultiplier = 1;
        
        if (duration === '30') {
            durationMultiplier = 0.6;
        } else if (duration === '90') {
            durationMultiplier = 1.5;
        }
        
        const finalPrice = Math.round(totalPrice * durationMultiplier);
        
        summaryHTML += `
            <div class="flex justify-between py-2 border-b border-gray-200">
                <strong>المدة:</strong> 
                <span>${duration} دقيقة</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-200">
                <strong>السعر النهائي:</strong> 
                <span class="text-green-600 font-bold">${finalPrice.toLocaleString()} دج</span>
            </div>
        `;
    }
    
    if (selectedDate) {
        const calendar = document.querySelector('#booking-calendar');
        let selectedDateStr = '';
        
        if (calendar && calendar._flatpickr && calendar._flatpickr.selectedDates[0]) {
            selectedDateStr = calendar._flatpickr.selectedDates[0].toLocaleDateString('ar-SA');
        }
        
        summaryHTML += `
            <div class="flex justify-between py-2 border-b border-gray-200">
                <strong>التاريخ:</strong> 
                <span>${selectedDateStr}</span>
            </div>
            <div class="flex justify-between py-2">
                <strong>الوقت:</strong> 
                <span>${selectedDate.value}</span>
            </div>
        `;
    }
    
    if (summaryContainer) {
        summaryContainer.innerHTML = summaryHTML;
    }
    
    if (finalSummaryContainer) {
        finalSummaryContainer.innerHTML = summaryHTML;
    }
}

function generateSummaryHTML(data) {
    return `
        <div class="summary-item flex justify-between py-2 border-b border-gray-200">
            <strong class="text-gray-700">الاسم الكامل:</strong> 
            <span class="text-gray-900">${data['client-name'] || 'غير محدد'}</span>
        </div>
        <div class="summary-item flex justify-between py-2 border-b border-gray-200">
            <strong class="text-gray-700">البريد الإلكتروني:</strong> 
            <span class="text-gray-900">${data['client-email'] || 'غير محدد'}</span>
        </div>
        <div class="summary-item flex justify-between py-2 border-b border-gray-200">
            <strong class="text-gray-700">رقم الهاتف:</strong> 
            <span class="text-gray-900">${data['client-phone'] || 'غير محدد'}</span>
        </div>
        <div class="summary-item flex justify-between py-2 border-b border-gray-200">
            <strong class="text-gray-700">نوع الاستشارة:</strong> 
            <span class="text-gray-900">${getConsultationTypeName(data['consultation-type']) || 'غير محدد'}</span>
        </div>
        <div class="summary-item flex justify-between py-2 border-b border-gray-200">
            <strong class="text-gray-700">المدة:</strong> 
            <span class="text-gray-900">${data['duration'] || 'غير محدد'} دقيقة</span>
        </div>
        <div class="summary-item flex justify-between py-2">
            <strong class="text-gray-700">طريقة الدفع:</strong> 
            <span class="text-gray-900">${getPaymentMethodName(data['payment-method']) || 'غير محدد'}</span>
        </div>
    `;
}

// Helper functions for display names
function getConsultationTypeName(type) {
    const types = {
        'video': 'استشارة عبر الفيديو',
        'office': 'استشارة في المكتب',
        'phone': 'استشارة هاتفية'
    };
    return types[type] || type;
}

function getPaymentMethodName(method) {
    const methods = {
        'card': 'بطاقة ائتمان/خصم',
        'paypal': 'PayPal',
        'cash': 'دفع نقدي'
    };
    return methods[method] || method;
}

// Auto Save Functionality
function initializeAutoSave() {
    if (!consultingData.autoSaveEnabled) return;
    
    const forms = document.querySelectorAll('#booking-form, #contact-form');
    
    forms.forEach(form => {
        if (form) {
            // Load saved data on page load
            loadAutoSavedData(form);
            
            // Auto-save on input change
            form.addEventListener('input', debounce(() => autoSaveFormData(form), 1000));
            form.addEventListener('change', () => autoSaveFormData(form));
        }
    });
}

function autoSaveFormData(form) {
    if (!consultingData.autoSaveEnabled) return;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const formId = form.id;
    
    try {
        localStorage.setItem(`${formId}Data`, JSON.stringify({
            data: data,
            timestamp: Date.now(),
            step: consultingData.currentStep
        }));
        showAutoSaveIndicator();
    } catch (error) {
        console.error('Error saving form data:', error);
    }
}

function loadAutoSavedData(form) {
    try {
        const formId = form.id;
        const savedData = localStorage.getItem(`${formId}Data`);
        if (!savedData) return;
        
        const { data, timestamp, step } = JSON.parse(savedData);
        
        // Check if data is not too old (24 hours)
        if (Date.now() - timestamp > 24 * 60 * 60 * 1000) {
            localStorage.removeItem(`${formId}Data`);
            return;
        }
        
        // Populate form fields
        Object.keys(data).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'radio') {
                    const radioField = form.querySelector(`[name="${key}"][value="${data[key]}"]`);
                    if (radioField) radioField.checked = true;
                } else if (field.type === 'checkbox') {
                    field.checked = data[key] === 'on';
                } else {
                    field.value = data[key];
                }
            }
        });
        
        // Restore step if booking form
        if (formId === 'booking-form' && step) {
            consultingData.currentStep = step;
            updateStep(step);
        }
        
        // Update UI based on loaded data
        updateConsultantSelection();
        updateTimeSlotSelection();
        updateBookingSummary();
        
        console.log('✅ Auto-saved data loaded successfully');
        showNotification('تم استرداد البيانات المحفوظة', 'info');
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
}

function clearAutoSavedData() {
    try {
        localStorage.removeItem('booking-formData');
        localStorage.removeItem('contact-formData');
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
    indicator.className = 'auto-save-indicator';
    indicator.innerHTML = '<i class="fas fa-check ml-2"></i>تم الحفظ تلقائياً';
    
    document.body.appendChild(indicator);
    
    // Show indicator
    setTimeout(() => {
        indicator.style.opacity = '1';
        indicator.style.transform = 'translateX(0)';
    }, 100);
    
    // Hide and remove indicator
    setTimeout(() => {
        indicator.style.opacity = '0';
        indicator.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(indicator)) {
                document.body.removeChild(indicator);
            }
        }, 300);
    }, 2000);
}

// Calendar Initialization
function initializeCalendar() {
    const calendarElement = document.getElementById('booking-calendar');
    if (!calendarElement || typeof flatpickr === 'undefined') return;
    
    const calendar = flatpickr(calendarElement, {
        locale: 'ar',
        inline: true,
        minDate: 'today',
        maxDate: new Date().fp_incr(60), // 60 days from today
        disable: [
            function(date) {
                // Disable Fridays (5) and Saturdays (6)
                return (date.getDay() === 5 || date.getDay() === 6);
            }
        ],
        onChange: function(selectedDates, dateStr, instance) {
            if (selectedDates.length > 0) {
                consultingData.selectedDate = selectedDates[0];
                generateTimeSlots(selectedDates[0]);
                updateBookingSummary();
            }
        },
        onDayCreate: function(dObj, dStr, fp, dayElem) {
            // Add custom styling to available days
            if (!dayElem.classList.contains('flatpickr-disabled')) {
                dayElem.classList.add('available-day');
            }
        }
    });
    
    // Store calendar instance
    calendarElement._flatpickr = calendar;
}

function generateTimeSlots(selectedDate) {
    const timeSlotsContainer = document.getElementById('time-slots');
    if (!timeSlotsContainer) return;
    
    // Define available time slots
    const timeSlots = [
        { time: '09:00', available: true },
        { time: '09:30', available: true },
        { time: '10:00', available: false }, // Example: already booked
        { time: '10:30', available: true },
        { time: '11:00', available: true },
        { time: '11:30', available: true },
        { time: '14:00', available: true },
        { time: '14:30', available: true },
        { time: '15:00', available: true },
        { time: '15:30', available: false }, // Example: already booked
        { time: '16:00', available: true },
        { time: '16:30', available: true }
    ];
    
    timeSlotsContainer.innerHTML = '';
    
    timeSlots.forEach(slot => {
        const slotElement = document.createElement('label');
        slotElement.className = `time-slot cursor-pointer ${!slot.available ? 'opacity-50 cursor-not-allowed' : ''}`;
        
        slotElement.innerHTML = `
            <input type="radio" name="appointment-time" value="${slot.time}" class="hidden" ${!slot.available ? 'disabled' : ''}>
            <div class="time-slot-btn bg-white border-2 border-gray-200 rounded-lg p-3 text-center hover:border-teal-500 hover:bg-teal-50 transition-all">
                <div class="font-bold text-gray-800">${slot.time}</div>
                <div class="text-xs ${slot.available ? 'text-green-500' : 'text-red-500'}">
                    ${slot.available ? 'متاح' : 'محجوز'}
                </div>
            </div>
        `;
        
        timeSlotsContainer.appendChild(slotElement);
    });
    
    // Add event listeners to time slots
    document.querySelectorAll('input[name="appointment-time"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updateTimeSlotSelection();
            consultingData.selectedTime = this.value;
        });
    });
    
    // Animate time slots appearance
    timeSlotsContainer.classList.add('animate-fadeIn');
}

// Filter Handlers
function initializeFilterHandlers() {
    const searchInput = document.getElementById('consultant-search') || document.getElementById('story-search');
    const filterSelects = document.querySelectorAll('.consultant-filter, .story-filter');
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(filterItems, 300));
    }
    
    filterSelects.forEach(select => {
        select.addEventListener('change', filterItems);
    });
}

function filterItems() {
    const searchTerm = (document.getElementById('consultant-search')?.value || 
                       document.getElementById('story-search')?.value || '').toLowerCase();
    
    const filters = {};
    document.querySelectorAll('.consultant-filter, .story-filter').forEach(select => {
        const filterType = select.getAttribute('data-filter');
        if (filterType && select.value) {
            filters[filterType] = select.value;
        }
    });
    
    const items = document.querySelectorAll('.consultant-card, .success-story-card');
    
    items.forEach(item => {
        const itemContainer = item.closest('.consultant-card, .success-story-card') || item;
        const title = item.querySelector('h3, h4')?.textContent.toLowerCase() || '';
        const description = item.querySelector('p')?.textContent.toLowerCase() || '';
        
        const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
        
        let matchesFilters = true;
        Object.keys(filters).forEach(filterType => {
            const itemValue = itemContainer.getAttribute(`data-${filterType}`);
            if (itemValue && itemValue !== filters[filterType]) {
                matchesFilters = false;
            }
        });
        
        if (matchesSearch && matchesFilters) {
            itemContainer.style.display = 'block';
            itemContainer.style.opacity = '0';
            setTimeout(() => {
                itemContainer.style.opacity = '1';
                itemContainer.classList.add('animate-fadeIn');
            }, 100);
        } else {
            itemContainer.style.display = 'none';
            itemContainer.classList.remove('animate-fadeIn');
        }
    });
    
    // Update results count
    updateResultsCount();
}

function updateResultsCount() {
    const visibleItems = document.querySelectorAll('.consultant-card:not([style*="display: none"]), .success-story-card:not([style*="display: none"])');
    const countElement = document.querySelector('.results-count');
    
    if (countElement) {
        countElement.textContent = `(${visibleItems.length} نتيجة)`;
    }
}

// Modal Handlers
function initializeModalHandlers() {
    // Close modal when clicking outside
    document.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
    
    // Close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });
}

function openModal(modalId, data = {}) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // Populate modal content if data provided
    if (data.title) {
        const titleElement = modal.querySelector('.modal-title');
        if (titleElement) titleElement.textContent = data.title;
    }
    
    if (data.content) {
        const contentElement = modal.querySelector('.modal-content-body');
        if (contentElement) contentElement.innerHTML = data.content;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus management for accessibility
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
        firstFocusable.focus();
    }
}

function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
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
                document.body.style.overflow = '';
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                document.body.style.overflow = 'hidden';
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileMenuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 1024) {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = '';
            }
        });
    }
}

// Scroll Effects
function initializeScrollEffects() {
    initializeBackToTop();
    initializeHeaderScroll();
    initializeScrollProgress();
    initializeParallaxEffects();
}

function initializeBackToTop() {
    let backToTopBtn = document.getElementById('back-to-top');
    
    // Create back to top button if it doesn't exist
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'back-to-top';
        backToTopBtn.className = 'fixed bottom-6 left-6 bg-teal-600 text-white p-3 rounded-full shadow-lg hover:bg-teal-700 transition-all transform hover:scale-110 opacity-0 invisible z-50';
        backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        document.body.appendChild(backToTopBtn);
    }
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.remove('opacity-0', 'invisible');
            backToTopBtn.classList.add('animate-fadeIn');
        } else {
            backToTopBtn.classList.add('opacity-0', 'invisible');
            backToTopBtn.classList.remove('animate-fadeIn');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
}

function initializeHeaderScroll() {
    const header = document.getElementById('main-header');
    if (!header) return;
    
    let lastScrollY = window.scrollY;
    let isScrolling = false;
    
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                const currentScrollY = window.scrollY;
                
                // Add background blur on scroll
                if (currentScrollY > 100) {
                    header.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-lg');
                } else {
                    header.classList.remove('bg-white/95', 'backdrop-blur-md');
                }
                
                // Hide/show header on scroll direction
                if (currentScrollY > lastScrollY && currentScrollY > 200) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
                
                lastScrollY = currentScrollY;
                isScrolling = false;
            });
            
            isScrolling = true;
        }
    });
}

function initializeScrollProgress() {
    let progressBar = document.querySelector('.scroll-progress');
    
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress fixed top-0 left-0 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 z-50 transition-all duration-300';
        progressBar.style.width = '0%';
        document.body.appendChild(progressBar);
    }
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    });
}

function initializeParallaxEffects() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.scrollY;
        
        parallaxElements.forEach(element => {
            const rate = scrolled * -0.5;
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Notifications
function initializeNotifications() {
    // Create notification container if it doesn't exist
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'fixed top-24 right-4 z-50 space-y-4 max-w-sm';
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'info', duration = 5000) {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification bg-white border-l-4 rounded-lg shadow-xl p-4 transform translate-x-full transition-all duration-300 ${getNotificationClasses(type)}`;
    
    const icon = getNotificationIcon(type);
    
    notification.innerHTML = `
        <div class="flex items-start">
            <div class="flex-shrink-0">
                <i class="${icon} text-lg"></i>
            </div>
            <div class="mr-3 flex-1">
                <p class="text-sm font-medium text-gray-800">${message}</p>
            </div>
            <button class="notification-close flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    container.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
        notification.classList.add('translate-x-0');
    }, 100);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            removeNotification(notification);
        }, duration);
    }
    
    return notification;
}

function removeNotification(notification) {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function getNotificationClasses(type) {
    const classes = {
        success: 'border-green-500',
        error: 'border-red-500',
        warning: 'border-yellow-500',
        info: 'border-blue-500'
    };
    return classes[type] || classes.info;
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fas fa-check-circle text-green-500',
        error: 'fas fa-times-circle text-red-500',
        warning: 'fas fa-exclamation-triangle text-yellow-500',
        info: 'fas fa-info-circle text-blue-500'
    };
    return icons[type] || icons.info;
}

// Profile Navigation
function initializeProfileNavigation() {
    const navLinks = document.querySelectorAll('.profile-nav-link');
    if (navLinks.length === 0) return;
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => {
                l.classList.remove('active', 'text-teal-600', 'font-bold');
                l.classList.add('text-gray-700');
            });
            
            // Add active class to clicked link
            this.classList.add('active', 'text-teal-600', 'font-bold');
            this.classList.remove('text-gray-700');
            
            // Smooth scroll to section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', debounce(updateActiveNavLink, 100));
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.profile-nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active', 'text-teal-600', 'font-bold');
        link.classList.add('text-gray-700');
        
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active', 'text-teal-600', 'font-bold');
            link.classList.remove('text-gray-700');
        }
    });
}

// Portfolio Filter
function initializePortfolioFilter() {
    const filterButtons = document.querySelectorAll('.portfolio-filter');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-teal-600', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            });
            
            this.classList.add('active', 'bg-teal-600', 'text-white');
            this.classList.remove('bg-gray-200', 'text-gray-700');
            
            // Filter portfolio items
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                        item.classList.add('animate-fadeIn');
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                        item.classList.remove('animate-fadeIn');
                    }, 300);
                }
            });
        });
    });
}

// FAQ Functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', function() {
                toggleFAQ(this);
            });
        }
    });
}

function toggleFAQ(button) {
    const faqItem = button.closest('.faq-item');
    const answer = faqItem.querySelector('.faq-answer');
    const icon = button.querySelector('i');
    
    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            const otherAnswer = item.querySelector('.faq-answer');
            const otherIcon = item.querySelector('.faq-question i');
            
            if (otherAnswer && !otherAnswer.classList.contains('hidden')) {
                otherAnswer.classList.add('hidden');
                otherIcon.style.transform = 'rotate(0deg)';
            }
        }
    });
    
    // Toggle current FAQ item
    if (answer.classList.contains('hidden')) {
        answer.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
        answer.style.maxHeight = answer.scrollHeight + 'px';
    } else {
        answer.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
        answer.style.maxHeight = '0';
    }
}

// Contact Form
function initializeContactForm() {
    const contactForms = document.querySelectorAll('#contact-form, .contact-form');
    
    contactForms.forEach(form => {
        form.addEventListener('submit', handleContactSubmission);
    });
}

// Load More Functionality
function initializeLoadMore() {
    const loadMoreBtns = document.querySelectorAll('[id^="load-more"]');
    
    loadMoreBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin ml-2"></i>جاري التحميل...';
            this.disabled = true;
            
            // Simulate loading
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
                showNotification('تم تحميل المزيد من المحتوى', 'success');
                
                // Add loading animation to new content
                const newItems = document.querySelectorAll('.new-item');
                newItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate-fadeIn');
                        item.classList.remove('new-item');
                    }, index * 100);
                });
            }, 1500);
        });
    });
}

// Tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('focus', showTooltip);
        element.addEventListener('blur', hideTooltip);
    });
}

function showTooltip(event) {
    const element = event.target;
    const tooltipText = element.getAttribute('data-tooltip');
    
    let tooltip = document.getElementById('tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.className = 'absolute bg-gray-800 text-white px-2 py-1 rounded text-sm z-50 opacity-0 transition-opacity duration-200 pointer-events-none';
        document.body.appendChild(tooltip);
    }
    
    tooltip.textContent = tooltipText;
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
    tooltip.style.opacity = '1';
}

function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
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

function smoothScrollTo(target, offset = 0) {
    const element = document.querySelector(target);
    if (element) {
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function formatPhoneNumber(phone) {
    // Format phone number according to preferences[2]
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10 && /^0[567]/.test(cleaned)) {
        return cleaned.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
    }
    return phone;
}

function validatePhoneNumber(phone) {
    // Validate phone number according to preferences[2]
    const phoneRegex = /^0[567][0-9]{8}$/;
    return phoneRegex.test(phone);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('ar-DZ', {
        style: 'currency',
        currency: 'DZD',
        minimumFractionDigits: 0
    }).format(amount);
}

function getTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'منذ لحظات';
    if (diffInSeconds < 3600) return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
    if (diffInSeconds < 86400) return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
    if (diffInSeconds < 2592000) return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;
    if (diffInSeconds < 31536000) return `منذ ${Math.floor(diffInSeconds / 2592000)} شهر`;
    return `منذ ${Math.floor(diffInSeconds / 31536000)} سنة`;
}

// Animation helpers
function addShakeAnimation(element) {
    element.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        element.style.animation = '';
    }, 500);
}

function addPulseEffect(element, duration = 1000) {
    element.classList.add('pulse-effect');
    setTimeout(() => {
        element.classList.remove('pulse-effect');
    }, duration);
}

// Export functions for global use
window.ConsultingJS = {
    showNotification,
    openModal,
    closeModal,
    smoothScrollTo,
    validateField,
    updateStep,
    toggleFAQ,
    formatPhoneNumber,
    validatePhoneNumber,
    formatCurrency,
    debounce,
    throttle
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .available-day {
        position: relative;
    }
    
    .available-day::after {
        content: '';
        position: absolute;
        bottom: 2px;
        left: 50%;
        transform: translateX(-50%);
        width: 4px;
        height: 4px;
        background: #0d9488;
        border-radius: 50%;
    }
`;
document.head.appendChild(style);

console.log('🎯 Consulting JavaScript loaded successfully!');
