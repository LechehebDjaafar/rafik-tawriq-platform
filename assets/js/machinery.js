/**
 * Machinery JavaScript Module
 * رفيق توريق - قسم الآلات والمعدات
 */

class MachineryManager {
    constructor() {
        this.initialized = false;
        this.filters = {};
        this.products = [];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.searchTimeout = null;
        
        this.init();
    }

    /**
     * تهيئة النظام
     */
    init() {
        if (this.initialized) return;
        
        console.log('🔧 تهيئة نظام إدارة الآلات...');
        
        // تهيئة المكونات
        this.initializeEventListeners();
        this.initializeFilters();
        this.initializeSearch();
        this.initializeModals();
        this.initializeCounters();
        this.initializeNotifications();
        this.initializeLazyLoading();
        this.initializeWishlist();
        this.initializeComparison();
        
        this.initialized = true;
        console.log('✅ تم تهيئة نظام إدارة الآلات بنجاح');
    }

    /**
     * تهيئة مستمعي الأحداث
     */
    initializeEventListeners() {
        // تهيئة القائمة المحمولة
        this.initializeMobileMenu();
        
        // تهيئة تأثير التمرير للهيدر
        this.initializeHeaderScroll();
        
        // تهيئة أزرار التحميل
        this.initializeLoadMoreButtons();
        
        // تهيئة نماذج الاتصال
        this.initializeContactForms();
    }

    /**
     * تهيئة القائمة المحمولة
     */
    initializeMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                
                if (mobileMenu.classList.contains('hidden')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                } else {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                }
            });
        }
    }

    /**
     * تهيئة تأثير التمرير للهيدر
     */
    initializeHeaderScroll() {
        const header = document.getElementById('main-header');
        if (!header) return;
        
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.classList.add('bg-white/95', 'backdrop-blur-md');
                
                if (currentScrollY > lastScrollY) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
            } else {
                header.classList.remove('bg-white/95', 'backdrop-blur-md');
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }

    /**
     * تهيئة الفلاتر
     */
    initializeFilters() {
        const filterElements = document.querySelectorAll('[data-filter]');
        
        filterElements.forEach(element => {
            element.addEventListener('change', (e) => {
                const filterType = e.target.getAttribute('data-filter');
                const filterValue = e.target.value;
                
                this.updateFilter(filterType, filterValue);
                this.applyFilters();
            });
        });
    }

    /**
     * تحديث الفلتر
     */
    updateFilter(type, value) {
        if (value === '') {
            delete this.filters[type];
        } else {
            this.filters[type] = value;
        }
    }

    /**
     * تطبيق الفلاتر
     */
    applyFilters() {
        const products = document.querySelectorAll('.product-card, .machinery-card');
        let visibleCount = 0;
        
        products.forEach(product => {
            let shouldShow = true;
            
            // فحص كل فلتر
            Object.keys(this.filters).forEach(filterType => {
                const productValue = product.getAttribute(`data-${filterType}`);
                if (productValue && productValue !== this.filters[filterType]) {
                    shouldShow = false;
                }
            });
            
            // إظهار أو إخفاء المنتج
            if (shouldShow) {
                this.showProduct(product);
                visibleCount++;
            } else {
                this.hideProduct(product);
            }
        });
        
        // تحديث عداد النتائج
        this.updateResultsCount(visibleCount);
    }

    /**
     * إظهار المنتج
     */
    showProduct(product) {
        product.style.display = 'block';
        product.style.opacity = '0';
        setTimeout(() => {
            product.style.opacity = '1';
        }, 100);
    }

    /**
     * إخفاء المنتج
     */
    hideProduct(product) {
        product.style.opacity = '0';
        setTimeout(() => {
            product.style.display = 'none';
        }, 300);
    }

    /**
     * تحديث عداد النتائج
     */
    updateResultsCount(count) {
        const counter = document.getElementById('results-count');
        if (counter) {
            counter.textContent = count;
        }
    }

    /**
     * تهيئة البحث
     */
    initializeSearch() {
        const searchInputs = document.querySelectorAll('[id*="search"]');
        
        searchInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, 300);
            });
        });
    }

    /**
     * تنفيذ البحث
     */
    performSearch(query) {
        const products = document.querySelectorAll('.product-card, .machinery-card');
        const searchQuery = query.toLowerCase().trim();
        
        if (searchQuery === '') {
            products.forEach(product => this.showProduct(product));
            return;
        }
        
        products.forEach(product => {
            const title = product.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = product.querySelector('p')?.textContent.toLowerCase() || '';
            const category = product.getAttribute('data-category') || '';
            
            const matches = title.includes(searchQuery) || 
                          description.includes(searchQuery) || 
                          category.includes(searchQuery);
            
            if (matches) {
                this.showProduct(product);
            } else {
                this.hideProduct(product);
            }
        });
    }

    /**
     * تهيئة النوافذ المنبثقة
     */
    initializeModals() {
        // إغلاق النوافذ عند النقر خارجها
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
        
        // إغلاق النوافذ بمفتاح Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    /**
     * فتح النافذة المنبثقة
     */
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            document.body.style.overflow = 'hidden';
            
            // تأثير الظهور
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
        }
    }

    /**
     * إغلاق النافذة المنبثقة
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            
            setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                document.body.style.overflow = '';
            }, 300);
        }
    }

    /**
     * إغلاق جميع النوافذ
     */
    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            this.closeModal(modal.id);
        });
    }

    /**
     * تهيئة العدادات المتحركة
     */
    initializeCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
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

    /**
     * تحريك العداد
     */
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
    }

    /**
     * تهيئة نظام الإشعارات
     */
    initializeNotifications() {
        this.notificationContainer = document.createElement('div');
        this.notificationContainer.id = 'notification-container';
        this.notificationContainer.style.cssText = `
            position: fixed;
            top: 6rem;
            right: 1rem;
            z-index: 1001;
            pointer-events: none;
        `;
        document.body.appendChild(this.notificationContainer);
    }

    /**
     * إظهار إشعار
     */
    showNotification(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.pointerEvents = 'auto';
        
        const icons = {
            success: 'fas fa-check-circle text-green-500',
            error: 'fas fa-times-circle text-red-500',
            warning: 'fas fa-exclamation-triangle text-yellow-500',
            info: 'fas fa-info-circle text-blue-500'
        };
        
        notification.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <i class="${icons[type]} text-lg"></i>
                </div>
                <div class="mr-3 flex-1">
                    <p class="text-sm font-medium text-gray-800">${message}</p>
                </div>
                <button class="notification-close flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        this.notificationContainer.appendChild(notification);
        
        // إظهار الإشعار
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // إضافة وظيفة الإغلاق
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        // إزالة تلقائية
        setTimeout(() => {
            this.removeNotification(notification);
        }, duration);
    }

    /**
     * إزالة الإشعار
     */
    removeNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    /**
     * تهيئة التحميل التدريجي
     */
    initializeLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }

    /**
     * تهيئة أزرار التحميل
     */
    initializeLoadMoreButtons() {
        const loadMoreButtons = document.querySelectorAll('[id*="load-more"]');
        
        loadMoreButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.loadMoreProducts(button);
            });
        });
    }

    /**
     * تحميل المزيد من المنتجات
     */
    loadMoreProducts(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin ml-2"></i>جاري التحميل...';
        button.disabled = true;
        
        // محاكاة تحميل البيانات
        setTimeout(() => {
            // هنا يمكن إضافة منتجات جديدة
            this.showNotification('تم تحميل المزيد من المنتجات', 'success');
            
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1500);
    }

    /**
     * تهيئة نماذج الاتصال
     */
    initializeContactForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        });
    }

    /**
     * معالجة إرسال النماذج
     */
    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // التحقق من صحة البيانات
        if (!this.validateForm(form)) {
            return;
        }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // إظهار حالة التحميل
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin ml-2"></i>جاري الإرسال...';
        submitBtn.disabled = true;
        
        // محاكاة إرسال البيانات
        setTimeout(() => {
            this.showNotification('تم إرسال طلبك بنجاح! سنتواصل معك قريباً.', 'success');
            form.reset();
            
            // إعادة تعيين الزر
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
            // إغلاق النافذة إذا كانت مفتوحة
            const modal = form.closest('.modal');
            if (modal) {
                this.closeModal(modal.id);
            }
        }, 2000);
    }

    /**
     * التحقق من صحة النموذج
     */
    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                this.showFieldError(field, 'هذا الحقل مطلوب');
                isValid = false;
            } else if (field.type === 'email' && !this.isValidEmail(field.value)) {
                this.showFieldError(field, 'يرجى إدخال بريد إلكتروني صحيح');
                isValid = false;
            } else if (field.type === 'tel' && !this.isValidPhone(field.value)) {
                this.showFieldError(field, 'يرجى إدخال رقم هاتف صحيح');
                isValid = false;
            } else {
                this.clearFieldError(field);
            }
        });
        
        return isValid;
    }

    /**
     * إظهار خطأ الحقل
     */
    showFieldError(field, message) {
        field.classList.add('border-red-500');
        
        let errorElement = field.parentNode.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error text-red-500 text-sm mt-1';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    /**
     * إزالة خطأ الحقل
     */
    clearFieldError(field) {
        field.classList.remove('border-red-500');
        
        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    /**
     * التحقق من صحة البريد الإلكتروني
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * التحقق من صحة رقم الهاتف
     */
    isValidPhone(phone) {
        const phoneRegex = /^0[567][0-9]{8}$/;
        return phoneRegex.test(phone);
    }

    /**
     * تهيئة قائمة المفضلة
     */
    initializeWishlist() {
        this.wishlist = JSON.parse(localStorage.getItem('machinery_wishlist') || '[]');
        this.updateWishlistUI();
    }

    /**
     * إضافة إلى المفضلة
     */
    addToWishlist(productId) {
        if (!this.wishlist.includes(productId)) {
            this.wishlist.push(productId);
            this.saveWishlist();
            this.showNotification('تم إضافة المنتج إلى المفضلة', 'success');
            this.updateWishlistUI();
        } else {
            this.showNotification('المنتج موجود بالفعل في المفضلة', 'info');
        }
    }

    /**
     * إزالة من المفضلة
     */
    removeFromWishlist(productId) {
        const index = this.wishlist.indexOf(productId);
        if (index > -1) {
            this.wishlist.splice(index, 1);
            this.saveWishlist();
            this.showNotification('تم إزالة المنتج من المفضلة', 'info');
            this.updateWishlistUI();
        }
    }

    /**
     * حفظ المفضلة
     */
    saveWishlist() {
        localStorage.setItem('machinery_wishlist', JSON.stringify(this.wishlist));
    }

    /**
     * تحديث واجهة المفضلة
     */
    updateWishlistUI() {
        const wishlistButtons = document.querySelectorAll('[data-wishlist]');
        
        wishlistButtons.forEach(button => {
            const productId = button.getAttribute('data-wishlist');
            const isInWishlist = this.wishlist.includes(productId);
            
            if (isInWishlist) {
                button.classList.add('text-red-500');
                button.innerHTML = '<i class="fas fa-heart"></i>';
            } else {
                button.classList.remove('text-red-500');
                button.innerHTML = '<i class="far fa-heart"></i>';
            }
        });
        
        // تحديث عداد المفضلة
        const wishlistCounter = document.getElementById('wishlist-counter');
        if (wishlistCounter) {
            wishlistCounter.textContent = this.wishlist.length;
        }
    }

    /**
     * تهيئة نظام المقارنة
     */
    initializeComparison() {
        this.comparison = JSON.parse(localStorage.getItem('machinery_comparison') || '[]');
        this.updateComparisonUI();
    }

    /**
     * إضافة للمقارنة
     */
    addToComparison(productId) {
        if (this.comparison.length >= 4) {
            this.showNotification('يمكن مقارنة 4 منتجات كحد أقصى', 'warning');
            return;
        }
        
        if (!this.comparison.includes(productId)) {
            this.comparison.push(productId);
            this.saveComparison();
            this.showNotification('تم إضافة المنتج للمقارنة', 'success');
            this.updateComparisonUI();
        } else {
            this.showNotification('المنتج موجود بالفعل في المقارنة', 'info');
        }
    }

    /**
     * إزالة من المقارنة
     */
    removeFromComparison(productId) {
        const index = this.comparison.indexOf(productId);
        if (index > -1) {
            this.comparison.splice(index, 1);
            this.saveComparison();
            this.showNotification('تم إزالة المنتج من المقارنة', 'info');
            this.updateComparisonUI();
        }
    }

    /**
     * حفظ المقارنة
     */
    saveComparison() {
        localStorage.setItem('machinery_comparison', JSON.stringify(this.comparison));
    }

    /**
     * تحديث واجهة المقارنة
     */
    updateComparisonUI() {
        const comparisonButtons = document.querySelectorAll('[data-compare]');
        
        comparisonButtons.forEach(button => {
            const productId = button.getAttribute('data-compare');
            const isInComparison = this.comparison.includes(productId);
            
            if (isInComparison) {
                button.classList.add('bg-blue-600', 'text-white');
                button.innerHTML = '<i class="fas fa-check ml-1"></i>في المقارنة';
            } else {
                button.classList.remove('bg-blue-600', 'text-white');
                button.innerHTML = '<i class="fas fa-balance-scale ml-1"></i>مقارنة';
            }
        });
        
        // تحديث عداد المقارنة
        const comparisonCounter = document.getElementById('comparison-counter');
        if (comparisonCounter) {
            comparisonCounter.textContent = this.comparison.length;
        }
    }

    /**
     * وظائف مساعدة
     */
    
    /**
     * تأخير التنفيذ
     */
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

    /**
     * تنسيق الأرقام
     */
    formatNumber(num) {
        return new Intl.NumberFormat('ar-DZ').format(num);
    }

    /**
     * تنسيق العملة
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('ar-DZ', {
            style: 'currency',
            currency: 'DZD'
        }).format(amount);
    }

    /**
     * الحصول على معاملات URL
     */
    getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    /**
     * تحديث معاملات URL
     */
    updateUrlParameter(name, value) {
        const url = new URL(window.location);
        if (value) {
            url.searchParams.set(name, value);
        } else {
            url.searchParams.delete(name);
        }
        window.history.replaceState({}, '', url);
    }
}

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.MachineryManager = new MachineryManager();
});

// تصدير الوظائف للاستخدام العام
window.MachineryUtils = {
    openModal: (modalId) => window.MachineryManager.openModal(modalId),
    closeModal: (modalId) => window.MachineryManager.closeModal(modalId),
    showNotification: (message, type, duration) => window.MachineryManager.showNotification(message, type, duration),
    addToWishlist: (productId) => window.MachineryManager.addToWishlist(productId),
    removeFromWishlist: (productId) => window.MachineryManager.removeFromWishlist(productId),
    addToComparison: (productId) => window.MachineryManager.addToComparison(productId),
    removeFromComparison: (productId) => window.MachineryManager.removeFromComparison(productId)
};

console.log('🚀 تم تحميل نظام إدارة الآلات بنجاح!');
