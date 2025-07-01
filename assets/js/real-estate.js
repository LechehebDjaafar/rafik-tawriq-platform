/**
 * Real Estate JavaScript Module
 * رفيق توريق - قسم العقارات
 */

class RealEstateManager {
    constructor() {
        this.initialized = false;
        this.properties = [];
        this.filters = {};
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.searchTimeout = null;
        this.map = null;
        this.imageGallery = null;
        this.virtualTour = null;
        
        this.init();
    }

    /**
     * تهيئة النظام
     */
    init() {
        if (this.initialized) return;
        
        console.log('🏠 تهيئة نظام إدارة العقارات...');
        
        // تهيئة المكونات
        this.initializeEventListeners();
        this.initializeFilters();
        this.initializeSearch();
        this.initializeImageGallery();
        this.initializeMap();
        this.initializeMortgageCalculator();
        this.initializeVirtualTour();
        this.initializeNotifications();
        this.initializeFavorites();
        this.initializeComparison();
        this.initializeLazyLoading();
        
        this.initialized = true;
        console.log('✅ تم تهيئة نظام إدارة العقارات بنجاح');
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
        
        // تهيئة مشاركة العقارات
        this.initializePropertySharing();
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
        
        // تهيئة فلاتر النطاق السعري
        this.initializePriceRangeFilter();
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
        
        // حفظ الفلاتر في localStorage
        localStorage.setItem('real_estate_filters', JSON.stringify(this.filters));
    }

    /**
     * تطبيق الفلاتر
     */
    applyFilters() {
        const properties = document.querySelectorAll('.property-card');
        let visibleCount = 0;
        
        properties.forEach(property => {
            let shouldShow = true;
            
            // فحص كل فلتر
            Object.keys(this.filters).forEach(filterType => {
                const propertyValue = property.getAttribute(`data-${filterType}`);
                if (propertyValue && propertyValue !== this.filters[filterType]) {
                    shouldShow = false;
                }
            });
            
            // إظهار أو إخفاء العقار
            if (shouldShow) {
                this.showProperty(property);
                visibleCount++;
            } else {
                this.hideProperty(property);
            }
        });
        
        // تحديث عداد النتائج
        this.updateResultsCount(visibleCount);
        
        // تحديث URL
        this.updateURL();
    }

    /**
     * إظهار العقار
     */
    showProperty(property) {
        property.style.display = 'block';
        property.style.opacity = '0';
        setTimeout(() => {
            property.style.opacity = '1';
        }, 100);
    }

    /**
     * إخفاء العقار
     */
    hideProperty(property) {
        property.style.opacity = '0';
        setTimeout(() => {
            property.style.display = 'none';
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
        
        // إظهار رسالة إذا لم توجد نتائج
        const noResults = document.getElementById('no-results');
        if (noResults) {
            noResults.style.display = count === 0 ? 'block' : 'none';
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
        const properties = document.querySelectorAll('.property-card');
        const searchQuery = query.toLowerCase().trim();
        
        if (searchQuery === '') {
            properties.forEach(property => this.showProperty(property));
            return;
        }
        
        properties.forEach(property => {
            const title = property.querySelector('h3')?.textContent.toLowerCase() || '';
            const location = property.querySelector('[class*="location"]')?.textContent.toLowerCase() || '';
            const description = property.querySelector('p')?.textContent.toLowerCase() || '';
            
            const matches = title.includes(searchQuery) || 
                          location.includes(searchQuery) || 
                          description.includes(searchQuery);
            
            if (matches) {
                this.showProperty(property);
            } else {
                this.hideProperty(property);
            }
        });
    }

    /**
     * تهيئة معرض الصور
     */
    initializeImageGallery() {
        const galleryContainer = document.querySelector('.image-gallery');
        if (!galleryContainer) return;
        
        const mainImage = galleryContainer.querySelector('.gallery-main img');
        const thumbnails = galleryContainer.querySelectorAll('.gallery-thumbnail');
        const prevBtn = galleryContainer.querySelector('.gallery-nav.prev');
        const nextBtn = galleryContainer.querySelector('.gallery-nav.next');
        
        let currentIndex = 0;
        const images = Array.from(thumbnails).map(thumb => thumb.querySelector('img').src);
        
        // تهيئة الصور المصغرة
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', () => {
                this.showImage(index, mainImage, thumbnails);
                currentIndex = index;
            });
        });
        
        // أزرار التنقل
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
                this.showImage(currentIndex, mainImage, thumbnails);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
                this.showImage(currentIndex, mainImage, thumbnails);
            });
        }
        
        // تهيئة عرض الشرائح التلقائي
        this.initializeAutoSlideshow(mainImage, thumbnails, images);
    }

    /**
     * عرض صورة معينة
     */
    showImage(index, mainImage, thumbnails) {
        const newSrc = thumbnails[index].querySelector('img').src;
        mainImage.src = newSrc;
        
        // تحديث الصور المصغرة النشطة
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnails[index].classList.add('active');
    }

    /**
     * تهيئة عرض الشرائح التلقائي
     */
    initializeAutoSlideshow(mainImage, thumbnails, images) {
        let currentIndex = 0;
        
        setInterval(() => {
            if (thumbnails.length > 1) {
                currentIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
                this.showImage(currentIndex, mainImage, thumbnails);
            }
        }, 5000);
    }

    /**
     * تهيئة الخريطة
     */
    initializeMap() {
        const mapContainer = document.getElementById('property-map');
        if (!mapContainer || typeof L === 'undefined') return;
        
        // إحداثيات افتراضية (الجزائر العاصمة)
        const defaultLat = 36.7538;
        const defaultLng = 3.0588;
        
        // إنشاء الخريطة
        this.map = L.map('property-map').setView([defaultLat, defaultLng], 15);
        
        // إضافة طبقة الخريطة
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);
        
        // إضافة علامة للعقار
        const marker = L.marker([defaultLat, defaultLng]).addTo(this.map);
        marker.bindPopup('موقع العقار').openPopup();
        
        // تهيئة الخريطة التفاعلية
        this.initializeInteractiveMap();
    }

    /**
     * تهيئة الخريطة التفاعلية
     */
    initializeInteractiveMap() {
        if (!this.map) return;
        
        // إضافة أدوات التحكم
        const searchControl = L.Control.extend({
            onAdd: function() {
                const div = L.DomUtil.create('div', 'map-search-control');
                div.innerHTML = `
                    <input type="text" placeholder="ابحث عن موقع..." 
                           class="map-search-input px-3 py-2 border rounded-lg">
                `;
                return div;
            }
        });
        
        new searchControl({ position: 'topright' }).addTo(this.map);
    }

    /**
     * تهيئة حاسبة القرض
     */
    initializeMortgageCalculator() {
        const calculator = document.querySelector('.mortgage-calculator');
        if (!calculator) return;
        
        const priceInput = calculator.querySelector('#property-price');
        const downPaymentSlider = calculator.querySelector('#down-payment');
        const downPaymentValue = calculator.querySelector('#down-payment-value');
        const loanTermSelect = calculator.querySelector('#loan-term');
        const interestRateInput = calculator.querySelector('#interest-rate');
        const monthlyPaymentDisplay = calculator.querySelector('#monthly-payment');
        
        // تحديث القيم عند التغيير
        [priceInput, downPaymentSlider, loanTermSelect, interestRateInput].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    this.calculateMortgage(calculator);
                });
            }
        });
        
        // تحديث عرض نسبة الدفعة الأولى
        if (downPaymentSlider && downPaymentValue) {
            downPaymentSlider.addEventListener('input', () => {
                downPaymentValue.textContent = downPaymentSlider.value + '%';
            });
        }
        
        // حساب أولي
        this.calculateMortgage(calculator);
    }

    /**
     * حساب القرض العقاري
     */
    calculateMortgage(calculator) {
        const price = parseFloat(calculator.querySelector('#property-price')?.value) || 0;
        const downPaymentPercent = parseFloat(calculator.querySelector('#down-payment')?.value) || 20;
        const loanTermYears = parseFloat(calculator.querySelector('#loan-term')?.value) || 25;
        const annualRate = parseFloat(calculator.querySelector('#interest-rate')?.value) || 5;
        
        const downPayment = price * (downPaymentPercent / 100);
        const loanAmount = price - downPayment;
        const monthlyRate = annualRate / 100 / 12;
        const numberOfPayments = loanTermYears * 12;
        
        let monthlyPayment = 0;
        if (monthlyRate > 0) {
            monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                           (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        } else {
            monthlyPayment = loanAmount / numberOfPayments;
        }
        
        const monthlyPaymentDisplay = calculator.querySelector('#monthly-payment');
        if (monthlyPaymentDisplay) {
            monthlyPaymentDisplay.textContent = this.formatCurrency(monthlyPayment);
        }
        
        // تحديث معلومات إضافية
        this.updateMortgageDetails(calculator, {
            downPayment,
            loanAmount,
            monthlyPayment,
            totalPayment: monthlyPayment * numberOfPayments,
            totalInterest: (monthlyPayment * numberOfPayments) - loanAmount
        });
    }

    /**
     * تحديث تفاصيل القرض
     */
    updateMortgageDetails(calculator, details) {
        const detailsContainer = calculator.querySelector('.mortgage-details');
        if (!detailsContainer) return;
        
        detailsContainer.innerHTML = `
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <span class="text-gray-600">الدفعة الأولى:</span>
                    <div class="font-bold">${this.formatCurrency(details.downPayment)}</div>
                </div>
                <div>
                    <span class="text-gray-600">مبلغ القرض:</span>
                    <div class="font-bold">${this.formatCurrency(details.loanAmount)}</div>
                </div>
                <div>
                    <span class="text-gray-600">إجمالي المدفوعات:</span>
                    <div class="font-bold">${this.formatCurrency(details.totalPayment)}</div>
                </div>
                <div>
                    <span class="text-gray-600">إجمالي الفوائد:</span>
                    <div class="font-bold">${this.formatCurrency(details.totalInterest)}</div>
                </div>
            </div>
        `;
    }

    /**
     * تهيئة الجولة الافتراضية
     */
    initializeVirtualTour() {
        const tourContainer = document.querySelector('.virtual-tour-container');
        if (!tourContainer) return;
        
        // تهيئة أدوات التحكم في الجولة
        this.initializeTourControls();
        
        // تهيئة التنقل بين الغرف
        this.initializeRoomNavigation();
        
        // تهيئة النقاط التفاعلية
        this.initializeHotspots();
    }

    /**
     * تهيئة أدوات التحكم في الجولة
     */
    initializeTourControls() {
        const autoRotateBtn = document.getElementById('auto-rotate-btn');
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        const vrBtn = document.getElementById('vr-btn');
        const infoBtn = document.getElementById('info-btn');
        
        if (autoRotateBtn) {
            autoRotateBtn.addEventListener('click', () => {
                this.toggleAutoRotate();
            });
        }
        
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }
        
        if (vrBtn) {
            vrBtn.addEventListener('click', () => {
                this.enterVRMode();
            });
        }
        
        if (infoBtn) {
            infoBtn.addEventListener('click', () => {
                this.toggleInfoPanel();
            });
        }
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
     * تهيئة المفضلة
     */
    initializeFavorites() {
        this.favorites = JSON.parse(localStorage.getItem('real_estate_favorites') || '[]');
        this.updateFavoritesUI();
        
        // إضافة مستمعي الأحداث لأزرار المفضلة
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-favorite]')) {
                const propertyId = e.target.closest('[data-favorite]').getAttribute('data-favorite');
                this.toggleFavorite(propertyId);
            }
        });
    }

    /**
     * تبديل حالة المفضلة
     */
    toggleFavorite(propertyId) {
        const index = this.favorites.indexOf(propertyId);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showNotification('تم إزالة العقار من المفضلة', 'info');
        } else {
            this.favorites.push(propertyId);
            this.showNotification('تم إضافة العقار إلى المفضلة', 'success');
        }
        
        this.saveFavorites();
        this.updateFavoritesUI();
    }

    /**
     * حفظ المفضلة
     */
    saveFavorites() {
        localStorage.setItem('real_estate_favorites', JSON.stringify(this.favorites));
    }

    /**
     * تحديث واجهة المفضلة
     */
    updateFavoritesUI() {
        const favoriteButtons = document.querySelectorAll('[data-favorite]');
        
        favoriteButtons.forEach(button => {
            const propertyId = button.getAttribute('data-favorite');
            const isFavorite = this.favorites.includes(propertyId);
            const icon = button.querySelector('i');
            
            if (isFavorite) {
                icon.classList.remove('far');
                icon.classList.add('fas', 'text-red-500');
            } else {
                icon.classList.remove('fas', 'text-red-500');
                icon.classList.add('far');
            }
        });
        
        // تحديث عداد المفضلة
        const favoriteCounter = document.getElementById('favorites-counter');
        if (favoriteCounter) {
            favoriteCounter.textContent = this.favorites.length;
        }
    }

    /**
     * تهيئة نظام المقارنة
     */
    initializeComparison() {
        this.comparison = JSON.parse(localStorage.getItem('real_estate_comparison') || '[]');
        this.updateComparisonUI();
        
        // إضافة مستمعي الأحداث لأزرار المقارنة
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-compare]')) {
                const propertyId = e.target.closest('[data-compare]').getAttribute('data-compare');
                this.toggleComparison(propertyId);
            }
        });
    }

    /**
     * تبديل حالة المقارنة
     */
    toggleComparison(propertyId) {
        if (this.comparison.length >= 4 && !this.comparison.includes(propertyId)) {
            this.showNotification('يمكن مقارنة 4 عقارات كحد أقصى', 'warning');
            return;
        }
        
        const index = this.comparison.indexOf(propertyId);
        
        if (index > -1) {
            this.comparison.splice(index, 1);
            this.showNotification('تم إزالة العقار من المقارنة', 'info');
        } else {
            this.comparison.push(propertyId);
            this.showNotification('تم إضافة العقار للمقارنة', 'success');
        }
        
        this.saveComparison();
        this.updateComparisonUI();
    }

    /**
     * حفظ المقارنة
     */
    saveComparison() {
        localStorage.setItem('real_estate_comparison', JSON.stringify(this.comparison));
    }

    /**
     * تحديث واجهة المقارنة
     */
    updateComparisonUI() {
        const compareButtons = document.querySelectorAll('[data-compare]');
        
        compareButtons.forEach(button => {
            const propertyId = button.getAttribute('data-compare');
            const isInComparison = this.comparison.includes(propertyId);
            
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
                    img.classList.remove('loading-skeleton');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            img.classList.add('loading-skeleton');
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
                this.loadMoreProperties(button);
            });
        });
    }

    /**
     * تحميل المزيد من العقارات
     */
    loadMoreProperties(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin ml-2"></i>جاري التحميل...';
        button.disabled = true;
        
        // محاكاة تحميل البيانات
        setTimeout(() => {
            // هنا يمكن إضافة عقارات جديدة من API
            this.showNotification('تم تحميل المزيد من العقارات', 'success');
            
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
     * تهيئة مشاركة العقارات
     */
    initializePropertySharing() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-share]')) {
                const propertyId = e.target.closest('[data-share]').getAttribute('data-share');
                this.shareProperty(propertyId);
            }
        });
    }

    /**
     * مشاركة العقار
     */
    shareProperty(propertyId) {
        const propertyUrl = `${window.location.origin}/real-estate/property-details.html?id=${propertyId}`;
        const propertyTitle = document.querySelector(`[data-property-id="${propertyId}"] h3`)?.textContent || 'عقار مميز';
        
        if (navigator.share) {
            navigator.share({
                title: propertyTitle,
                text: 'شاهد هذا العقار المميز',
                url: propertyUrl
            }).catch(err => console.log('Error sharing:', err));
        } else {
            // نسخ الرابط للحافظة
            navigator.clipboard.writeText(propertyUrl).then(() => {
                this.showNotification('تم نسخ رابط العقار إلى الحافظة', 'success');
            }).catch(() => {
                this.showNotification('فشل في نسخ الرابط', 'error');
            });
        }
    }

    /**
     * وظائف مساعدة
     */
    
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
     * تنسيق العملة
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('ar-DZ', {
            style: 'currency',
            currency: 'DZD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    /**
     * تنسيق الأرقام
     */
    formatNumber(num) {
        return new Intl.NumberFormat('ar-DZ').format(num);
    }

    /**
     * الحصول على معاملات URL
     */
    getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    /**
     * تحديث URL
     */
    updateURL() {
        const url = new URL(window.location);
        
        // إضافة الفلاتر إلى URL
        Object.keys(this.filters).forEach(key => {
            url.searchParams.set(key, this.filters[key]);
        });
        
        // إزالة الفلاتر الفارغة
        Object.keys(this.filters).forEach(key => {
            if (!this.filters[key]) {
                url.searchParams.delete(key);
            }
        });
        
        window.history.replaceState({}, '', url);
    }

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
}

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.RealEstateManager = new RealEstateManager();
});

// تصدير الوظائف للاستخدام العام
window.RealEstateUtils = {
    showNotification: (message, type, duration) => window.RealEstateManager.showNotification(message, type, duration),
    toggleFavorite: (propertyId) => window.RealEstateManager.toggleFavorite(propertyId),
    toggleComparison: (propertyId) => window.RealEstateManager.toggleComparison(propertyId),
    shareProperty: (propertyId) => window.RealEstateManager.shareProperty(propertyId),
    formatCurrency: (amount) => window.RealEstateManager.formatCurrency(amount)
};

console.log('🏠 تم تحميل نظام إدارة العقارات بنجاح!');
