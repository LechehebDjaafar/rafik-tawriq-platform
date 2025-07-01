/**
 * Events JavaScript Module - Enhanced
 * رفيق توريق - قسم الفعاليات الشامل
 */

class EventsManager {
    constructor() {
        this.initialized = false;
        this.events = [];
        this.filters = {};
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.searchTimeout = null;
        this.favorites = [];
        this.registrations = [];
        this.notifications = [];
        
        // Configuration
        this.config = {
            animationDuration: 300,
            debounceDelay: 300,
            notificationDuration: 5000,
            autoSlideInterval: 5000,
            maxFavorites: 50,
            apiEndpoint: '/api/events',
            storagePrefix: 'events_'
        };
        
        // Event types configuration
        this.eventTypes = {
            exhibition: {
                name: 'معرض',
                color: '#2563eb',
                icon: 'fas fa-store'
            },
            competition: {
                name: 'مسابقة',
                color: '#10b981',
                icon: 'fas fa-trophy'
            },
            conference: {
                name: 'مؤتمر',
                color: '#7c3aed',
                icon: 'fas fa-users'
            },
            workshop: {
                name: 'ورشة عمل',
                color: '#ea580c',
                icon: 'fas fa-tools'
            }
        };
        
        this.init();
    }

    /**
     * تهيئة النظام
     */
    init() {
        if (this.initialized) return;
        
        console.log('🎉 تهيئة نظام إدارة الفعاليات...');
        
        try {
            // تهيئة المكونات الأساسية
            this.initializeEventListeners();
            this.initializeFilters();
            this.initializeSearch();
            this.initializeNotifications();
            this.initializeFavorites();
            this.initializeRegistration();
            this.initializeCountdown();
            this.initializeMap();
            this.initializeImageGallery();
            this.initializeSocialSharing();
            this.initializeCalendarIntegration();
            this.initializeAnalytics();
            
            // تحميل البيانات المحفوظة
            this.loadSavedData();
            
            // تهيئة المكونات الخاصة بكل صفحة
            this.initializePageSpecific();
            
            this.initialized = true;
            console.log('✅ تم تهيئة نظام إدارة الفعاليات بنجاح');
            
            // إرسال حدث التهيئة
            this.dispatchEvent('eventsInitialized');
            
        } catch (error) {
            console.error('❌ خطأ في تهيئة نظام الفعاليات:', error);
            this.showNotification('حدث خطأ في تحميل النظام', 'error');
        }
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
        
        // تهيئة اختصارات لوحة المفاتيح
        this.initializeKeyboardShortcuts();
        
        // تهيئة مستمعي الأحداث المخصصة
        this.initializeCustomEventListeners();
    }

    /**
     * تهيئة اختصارات لوحة المفاتيح
     */
    initializeKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K للبحث
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('[id*="search"]');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            // Escape لإغلاق النوافذ المنبثقة
            if (e.key === 'Escape') {
                this.closeAllModals();
                this.hideAllPanels();
            }
            
            // F للبحث السريع
            if (e.key === 'f' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                this.openQuickSearch();
            }
            
            // R للتسجيل السريع
            if (e.key === 'r' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.openQuickRegistration();
            }
        });
    }

    /**
     * تهيئة مستمعي الأحداث المخصصة
     */
    initializeCustomEventListeners() {
        // مستمع تغيير حجم النافذة
        window.addEventListener('resize', this.debounce(() => {
            this.handleWindowResize();
        }, 250));
        
        // مستمع تغيير الاتصال
        window.addEventListener('online', () => {
            this.showNotification('تم استعادة الاتصال بالإنترنت', 'success');
            this.syncOfflineData();
        });
        
        window.addEventListener('offline', () => {
            this.showNotification('تم فقدان الاتصال بالإنترنت', 'warning');
        });
        
        // مستمع تغيير الصفحة
        window.addEventListener('beforeunload', () => {
            this.saveCurrentState();
        });
        
        // مستمع التمرير للتحميل التدريجي
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 100));
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
                this.logAnalyticsEvent('filter_used', {
                    filter_type: filterType,
                    filter_value: filterValue
                });
            });
        });
        
        // تهيئة فلاتر النطاق السعري والتاريخ
        this.initializeDateRangeFilter();
        this.initializePriceRangeFilter();
        this.initializeLocationFilter();
    }

    /**
     * تهيئة فلتر النطاق الزمني
     */
    initializeDateRangeFilter() {
        const dateInputs = document.querySelectorAll('input[type="date"]');
        
        dateInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.updateDateFilter();
            });
        });
    }

    /**
     * تهيئة فلتر النطاق السعري
     */
    initializePriceRangeFilter() {
        const priceSliders = document.querySelectorAll('input[type="range"][data-price]');
        
        priceSliders.forEach(slider => {
            slider.addEventListener('input', () => {
                this.updatePriceFilter();
            });
        });
    }

    /**
     * تهيئة فلتر الموقع
     */
    initializeLocationFilter() {
        const locationSelect = document.querySelector('[data-filter="location"]');
        
        if (locationSelect) {
            // إضافة خيار "قريب مني" إذا كان الموقع الجغرافي متاحاً
            if (navigator.geolocation) {
                const nearMeOption = document.createElement('option');
                nearMeOption.value = 'near-me';
                nearMeOption.textContent = 'قريب مني';
                locationSelect.appendChild(nearMeOption);
            }
            
            locationSelect.addEventListener('change', (e) => {
                if (e.target.value === 'near-me') {
                    this.filterByLocation();
                }
            });
        }
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
        this.saveFilters();
        
        // تحديث URL
        this.updateURL();
    }

    /**
     * تطبيق الفلاتر
     */
    applyFilters() {
        const events = document.querySelectorAll('.event-card, .exhibition-card, .competition-card, .conference-card, .workshop-card');
        let visibleCount = 0;
        
        events.forEach(event => {
            let shouldShow = true;
            
            // فحص كل فلتر
            Object.keys(this.filters).forEach(filterType => {
                const eventValue = event.getAttribute(`data-${filterType}`);
                if (eventValue && !this.matchesFilter(eventValue, this.filters[filterType], filterType)) {
                    shouldShow = false;
                }
            });
            
            // إظهار أو إخفاء الفعالية
            if (shouldShow) {
                this.showEvent(event);
                visibleCount++;
            } else {
                this.hideEvent(event);
            }
        });
        
        // تحديث عداد النتائج
        this.updateResultsCount(visibleCount);
        
        // إظهار رسالة إذا لم توجد نتائج
        this.toggleNoResultsMessage(visibleCount === 0);
    }

    /**
     * فحص تطابق الفلتر
     */
    matchesFilter(eventValue, filterValue, filterType) {
        switch (filterType) {
            case 'price':
                return this.matchesPriceRange(eventValue, filterValue);
            case 'date':
                return this.matchesDateRange(eventValue, filterValue);
            case 'location':
                return this.matchesLocation(eventValue, filterValue);
            default:
                return eventValue === filterValue;
        }
    }

    /**
     * إظهار الفعالية
     */
    showEvent(event) {
        event.style.display = 'block';
        event.style.opacity = '0';
        event.classList.add('fade-in');
        setTimeout(() => {
            event.style.opacity = '1';
        }, 100);
    }

    /**
     * إخفاء الفعالية
     */
    hideEvent(event) {
        event.style.opacity = '0';
        setTimeout(() => {
            event.style.display = 'none';
            event.classList.remove('fade-in');
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
        
        const counterText = document.getElementById('results-text');
        if (counterText) {
            counterText.textContent = count === 1 ? 'فعالية' : 'فعالية';
        }
    }

    /**
     * تبديل رسالة عدم وجود نتائج
     */
    toggleNoResultsMessage(show) {
        const noResults = document.getElementById('no-results');
        if (noResults) {
            noResults.style.display = show ? 'block' : 'none';
        }
    }

    /**
     * تهيئة البحث
     */
    initializeSearch() {
        const searchInputs = document.querySelectorAll('[id*="search"], [data-search]');
        
        searchInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.performSearch(e.target.value);
                }, this.config.debounceDelay);
            });
            
            // إضافة اقتراحات البحث
            this.addSearchSuggestions(input);
        });
        
        // تهيئة البحث المتقدم
        this.initializeAdvancedSearch();
    }

    /**
     * إضافة اقتراحات البحث
     */
    addSearchSuggestions(input) {
        const suggestions = [
            'مؤتمر الذكاء الاصطناعي',
            'ورشة تطوير الويب',
            'معرض التكنولوجيا',
            'مسابقة البرمجة',
            'ورشة التصميم',
            'مؤتمر ريادة الأعمال'
        ];
        
        const datalist = document.createElement('datalist');
        datalist.id = `suggestions-${Date.now()}`;
        
        suggestions.forEach(suggestion => {
            const option = document.createElement('option');
            option.value = suggestion;
            datalist.appendChild(option);
        });
        
        document.body.appendChild(datalist);
        input.setAttribute('list', datalist.id);
    }

    /**
     * تنفيذ البحث
     */
    performSearch(query) {
        const events = document.querySelectorAll('.event-card, .exhibition-card, .competition-card, .conference-card, .workshop-card');
        const searchQuery = query.toLowerCase().trim();
        
        if (searchQuery === '') {
            events.forEach(event => this.showEvent(event));
            this.updateResultsCount(events.length);
            return;
        }
        
        let visibleCount = 0;
        
        events.forEach(event => {
            const title = event.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = event.querySelector('p')?.textContent.toLowerCase() || '';
            const location = event.querySelector('[class*="location"]')?.textContent.toLowerCase() || '';
            const tags = event.getAttribute('data-tags')?.toLowerCase() || '';
            
            const matches = title.includes(searchQuery) || 
                          description.includes(searchQuery) || 
                          location.includes(searchQuery) ||
                          tags.includes(searchQuery);
            
            if (matches) {
                this.showEvent(event);
                visibleCount++;
            } else {
                this.hideEvent(event);
            }
        });
        
        this.updateResultsCount(visibleCount);
        this.toggleNoResultsMessage(visibleCount === 0);
        
        // تسجيل حدث البحث
        this.logAnalyticsEvent('search_performed', {
            query: searchQuery,
            results_count: visibleCount
        });
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
        
        // تحميل الإشعارات المحفوظة
        this.loadNotifications();
    }

    /**
     * إظهار إشعار
     */
    showNotification(message, type = 'info', duration = null) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.pointerEvents = 'auto';
        
        const icons = {
            success: 'fas fa-check-circle text-green-500',
            error: 'fas fa-times-circle text-red-500',
            warning: 'fas fa-exclamation-triangle text-yellow-500',
            info: 'fas fa-info-circle text-blue-500'
        };
        
        const notificationId = `notification-${Date.now()}`;
        notification.id = notificationId;
        
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
        const autoRemoveDuration = duration || this.config.notificationDuration;
        setTimeout(() => {
            this.removeNotification(notification);
        }, autoRemoveDuration);
        
        // حفظ الإشعار
        this.saveNotification({
            id: notificationId,
            message,
            type,
            timestamp: new Date().toISOString()
        });
        
        return notificationId;
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
        this.favorites = this.loadFromStorage('favorites') || [];
        this.updateFavoritesUI();
        
        // إضافة مستمعي الأحداث لأزرار المفضلة
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-favorite]')) {
                const eventId = e.target.closest('[data-favorite]').getAttribute('data-favorite');
                this.toggleFavorite(eventId);
            }
        });
    }

    /**
     * تبديل حالة المفضلة
     */
    toggleFavorite(eventId) {
        const index = this.favorites.indexOf(eventId);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
            this.showNotification('تم إزالة الفعالية من المفضلة', 'info');
            this.logAnalyticsEvent('favorite_removed', { event_id: eventId });
        } else {
            if (this.favorites.length >= this.config.maxFavorites) {
                this.showNotification(`يمكنك إضافة ${this.config.maxFavorites} فعالية كحد أقصى للمفضلة`, 'warning');
                return;
            }
            
            this.favorites.push(eventId);
            this.showNotification('تم إضافة الفعالية إلى المفضلة', 'success');
            this.logAnalyticsEvent('favorite_added', { event_id: eventId });
        }
        
        this.saveFavorites();
        this.updateFavoritesUI();
    }

    /**
     * حفظ المفضلة
     */
    saveFavorites() {
        this.saveToStorage('favorites', this.favorites);
    }

    /**
     * تحديث واجهة المفضلة
     */
    updateFavoritesUI() {
        const favoriteButtons = document.querySelectorAll('[data-favorite]');
        
        favoriteButtons.forEach(button => {
            const eventId = button.getAttribute('data-favorite');
            const isFavorite = this.favorites.includes(eventId);
            const icon = button.querySelector('i');
            
            if (isFavorite) {
                icon.classList.remove('far');
                icon.classList.add('fas', 'text-red-500');
                button.setAttribute('title', 'إزالة من المفضلة');
            } else {
                icon.classList.remove('fas', 'text-red-500');
                icon.classList.add('far');
                button.setAttribute('title', 'إضافة للمفضلة');
            }
        });
        
        // تحديث عداد المفضلة
        const favoriteCounter = document.getElementById('favorites-counter');
        if (favoriteCounter) {
            favoriteCounter.textContent = this.favorites.length;
        }
    }

    /**
     * تهيئة نظام التسجيل
     */
    initializeRegistration() {
        this.registrations = this.loadFromStorage('registrations') || [];
        
        // تهيئة نماذج التسجيل
        const registrationForms = document.querySelectorAll('form[data-registration]');
        
        registrationForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegistration(form);
            });
            
            // التحقق من صحة البيانات في الوقت الفعلي
            this.initializeFormValidation(form);
        });
        
        // تهيئة التسجيل السريع
        this.initializeQuickRegistration();
    }

    /**
     * معالجة التسجيل
     */
    handleRegistration(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // التحقق من صحة البيانات
        if (!this.validateRegistrationForm(form)) {
            return;
        }
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // إظهار حالة التحميل
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin ml-2"></i>جاري التسجيل...';
        submitBtn.disabled = true;
        
        // محاكاة إرسال البيانات
        setTimeout(() => {
            const registrationId = this.generateRegistrationId();
            
            // حفظ بيانات التسجيل
            const registration = {
                id: registrationId,
                eventId: data['event-name'],
                eventType: data['event-type'],
                personalInfo: {
                    firstName: data['first-name'],
                    lastName: data['last-name'],
                    email: data['email'],
                    phone: data['phone']
                },
                professionalInfo: {
                    jobTitle: data['job-title'],
                    company: data['company'],
                    experience: data['experience'],
                    industry: data['industry']
                },
                specialRequirements: {
                    dietary: data['dietary'],
                    accessibility: data['accessibility']
                },
                preferences: {
                    newsletter: data['newsletter'] === 'on',
                    sms: data['sms'] === 'on',
                    events: data['events'] === 'on'
                },
                timestamp: new Date().toISOString(),
                status: 'pending'
            };
            
            this.registrations.push(registration);
            this.saveRegistrations();
            
            // إظهار رسالة النجاح
            this.showRegistrationSuccess(registration);
            
            // إرسال بريد إلكتروني تأكيدي (محاكاة)
            this.sendConfirmationEmail(registration);
            
            // تسجيل حدث التحليل
            this.logAnalyticsEvent('registration_completed', {
                event_id: registration.eventId,
                event_type: registration.eventType,
                registration_id: registrationId
            });
            
            // إعادة تعيين النموذج
            form.reset();
            this.updateRegistrationSummary('');
            
            // إعادة تعيين الزر
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            
        }, 2000);
    }

    /**
     * تهيئة العد التنازلي
     */
    initializeCountdown() {
        const countdownElements = document.querySelectorAll('[data-countdown]');
        
        countdownElements.forEach(element => {
            const targetDate = element.getAttribute('data-countdown');
            if (targetDate) {
                this.startCountdown(element, new Date(targetDate));
            }
        });
    }

    /**
     * بدء العد التنازلي
     */
    startCountdown(element, targetDate) {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;
            
            if (distance < 0) {
                element.innerHTML = '<div class="text-red-500 font-bold">انتهت الفعالية</div>';
                return;
            }
            
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            element.innerHTML = `
                <div class="countdown-timer">
                    <div class="countdown-item">
                        <div class="countdown-number">${days}</div>
                        <div class="countdown-label">يوم</div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-number">${hours}</div>
                        <div class="countdown-label">ساعة</div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-number">${minutes}</div>
                        <div class="countdown-label">دقيقة</div>
                    </div>
                    <div class="countdown-item">
                        <div class="countdown-number">${seconds}</div>
                        <div class="countdown-label">ثانية</div>
                    </div>
                </div>
            `;
        };
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    /**
     * تهيئة الخريطة
     */
    initializeMap() {
        const mapContainers = document.querySelectorAll('[id*="map"]');
        
        mapContainers.forEach(container => {
            if (typeof L !== 'undefined') {
                this.createMap(container);
            }
        });
    }

    /**
     * إنشاء خريطة
     */
    createMap(container) {
        const lat = container.getAttribute('data-lat') || 36.7538;
        const lng = container.getAttribute('data-lng') || 3.0588;
        const zoom = container.getAttribute('data-zoom') || 15;
        
        const map = L.map(container.id).setView([lat, lng], zoom);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        const marker = L.marker([lat, lng]).addTo(map);
        
        const popupText = container.getAttribute('data-popup') || 'موقع الفعالية';
        marker.bindPopup(popupText).openPopup();
        
        return map;
    }

    /**
     * تهيئة معرض الصور
     */
    initializeImageGallery() {
        const galleries = document.querySelectorAll('.image-gallery, .event-gallery');
        
        galleries.forEach(gallery => {
            this.createImageGallery(gallery);
        });
    }

    /**
     * إنشاء معرض صور
     */
    createImageGallery(gallery) {
        const mainImage = gallery.querySelector('.gallery-main img');
        const thumbnails = gallery.querySelectorAll('.gallery-thumbnail');
        const prevBtn = gallery.querySelector('.gallery-nav.prev');
        const nextBtn = gallery.querySelector('.gallery-nav.next');
        
        if (!mainImage || !thumbnails.length) return;
        
        let currentIndex = 0;
        const images = Array.from(thumbnails).map(thumb => ({
            src: thumb.querySelector('img').src,
            alt: thumb.querySelector('img').alt
        }));
        
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
        
        // دعم لوحة المفاتيح
        gallery.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                nextBtn?.click();
            } else if (e.key === 'ArrowRight') {
                prevBtn?.click();
            }
        });
        
        // عرض الشرائح التلقائي
        if (gallery.hasAttribute('data-autoplay')) {
            this.startAutoSlideshow(mainImage, thumbnails, images);
        }
    }

    /**
     * عرض صورة معينة
     */
    showImage(index, mainImage, thumbnails) {
        const newSrc = thumbnails[index].querySelector('img').src;
        const newAlt = thumbnails[index].querySelector('img').alt;
        
        // تأثير الانتقال
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.src = newSrc;
            mainImage.alt = newAlt;
            mainImage.style.opacity = '1';
        }, 150);
        
        // تحديث الصور المصغرة النشطة
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnails[index].classList.add('active');
    }

    /**
     * بدء عرض الشرائح التلقائي
     */
    startAutoSlideshow(mainImage, thumbnails, images) {
        let currentIndex = 0;
        
        const interval = setInterval(() => {
            if (thumbnails.length > 1) {
                currentIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
                this.showImage(currentIndex, mainImage, thumbnails);
            }
        }, this.config.autoSlideInterval);
        
        // إيقاف العرض التلقائي عند التفاعل
        const gallery = mainImage.closest('.image-gallery, .event-gallery');
        gallery.addEventListener('mouseenter', () => clearInterval(interval));
    }

    /**
     * تهيئة المشاركة الاجتماعية
     */
    initializeSocialSharing() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-share]')) {
                const shareBtn = e.target.closest('[data-share]');
                const eventId = shareBtn.getAttribute('data-share');
                const platform = shareBtn.getAttribute('data-platform') || 'general';
                
                this.shareEvent(eventId, platform);
            }
        });
    }

    /**
     * مشاركة الفعالية
     */
    shareEvent(eventId, platform) {
        const eventElement = document.querySelector(`[data-event-id="${eventId}"]`);
        const eventTitle = eventElement?.querySelector('h3')?.textContent || 'فعالية مميزة';
        const eventUrl = `${window.location.origin}/events/event-details.html?id=${eventId}`;
        const eventDescription = eventElement?.querySelector('p')?.textContent || 'انضم إلى هذه الفعالية المميزة';
        
        const shareData = {
            title: eventTitle,
            text: eventDescription,
            url: eventUrl
        };
        
        switch (platform) {
            case 'facebook':
                this.shareOnFacebook(shareData);
                break;
            case 'twitter':
                this.shareOnTwitter(shareData);
                break;
            case 'linkedin':
                this.shareOnLinkedIn(shareData);
                break;
            case 'whatsapp':
                this.shareOnWhatsApp(shareData);
                break;
            default:
                this.shareGeneral(shareData);
        }
        
        // تسجيل حدث المشاركة
        this.logAnalyticsEvent('event_shared', {
            event_id: eventId,
            platform: platform
        });
    }

    /**
     * مشاركة عامة
     */
    shareGeneral(shareData) {
        if (navigator.share) {
            navigator.share(shareData).catch(err => {
                console.log('Error sharing:', err);
                this.fallbackShare(shareData);
            });
        } else {
            this.fallbackShare(shareData);
        }
    }

    /**
     * مشاركة احتياطية
     */
    fallbackShare(shareData) {
        navigator.clipboard.writeText(shareData.url).then(() => {
            this.showNotification('تم نسخ رابط الفعالية إلى الحافظة', 'success');
        }).catch(() => {
            this.showNotification('فشل في نسخ الرابط', 'error');
        });
    }

    /**
     * تهيئة تكامل التقويم
     */
    initializeCalendarIntegration() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-add-to-calendar]')) {
                const eventId = e.target.closest('[data-add-to-calendar]').getAttribute('data-add-to-calendar');
                this.addToCalendar(eventId);
            }
        });
    }

    /**
     * إضافة للتقويم
     */
    addToCalendar(eventId) {
        const eventData = this.getEventData(eventId);
        if (!eventData) return;
        
        const startDate = new Date(eventData.startDate);
        const endDate = new Date(eventData.endDate);
        
        const icsContent = this.generateICSContent({
            title: eventData.title,
            description: eventData.description,
            location: eventData.location,
            startDate: startDate,
            endDate: endDate,
            url: eventData.url
        });
        
        this.downloadICSFile(icsContent, `${eventData.title}.ics`);
        
        this.logAnalyticsEvent('calendar_added', {
            event_id: eventId
        });
    }

    /**
     * توليد محتوى ICS
     */
    generateICSContent(eventData) {
        const formatDate = (date) => {
            return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
        };
        
        return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//رفيق توريق//Events//AR
BEGIN:VEVENT
UID:${Date.now()}@rafiktawriq.dz
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(eventData.startDate)}
DTEND:${formatDate(eventData.endDate)}
SUMMARY:${eventData.title}
DESCRIPTION:${eventData.description}
LOCATION:${eventData.location}
URL:${eventData.url}
END:VEVENT
END:VCALENDAR`;
    }

    /**
     * تحميل ملف ICS
     */
    downloadICSFile(content, filename) {
        const blob = new Blob([content], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * تهيئة التحليلات
     */
    initializeAnalytics() {
        // تتبع مشاهدة الفعاليات
        this.trackEventViews();
        
        // تتبع التفاعل مع الأزرار
        this.trackButtonClicks();
        
        // تتبع وقت البقاء في الصفحة
        this.trackPageTime();
        
        // تتبع الأخطاء
        this.trackErrors();
    }

    /**
     * تتبع مشاهدة الفعاليات
     */
    trackEventViews() {
        const eventCards = document.querySelectorAll('.event-card, .exhibition-card, .competition-card, .conference-card, .workshop-card');
        
        const viewObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const eventId = entry.target.getAttribute('data-event-id');
                    if (eventId && !entry.target.hasAttribute('data-viewed')) {
                        entry.target.setAttribute('data-viewed', 'true');
                        this.logAnalyticsEvent('event_viewed', {
                            event_id: eventId,
                            timestamp: new Date().toISOString(),
                            viewport_percentage: entry.intersectionRatio
                        });
                    }
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        });
        
        eventCards.forEach(card => {
            viewObserver.observe(card);
        });
    }

    /**
     * تتبع النقرات على الأزرار
     */
    trackButtonClicks() {
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button, .btn, a[class*="btn"]');
            if (button) {
                const action = button.getAttribute('data-action') || 
                              button.textContent.trim() || 
                              'unknown_action';
                
                this.logAnalyticsEvent('button_clicked', {
                    action: action,
                    element: button.tagName.toLowerCase(),
                    classes: button.className,
                    page: window.location.pathname
                });
            }
        });
    }

    /**
     * تسجيل حدث تحليلي
     */
    logAnalyticsEvent(eventName, data) {
        // حفظ في localStorage للتحليل المحلي
        const analytics = this.loadFromStorage('analytics') || [];
        analytics.push({
            event: eventName,
            data: data,
            timestamp: new Date().toISOString(),
            page: window.location.pathname,
            userAgent: navigator.userAgent,
            sessionId: this.getSessionId()
        });
        
        // الاحتفاظ بآخر 1000 حدث فقط
        if (analytics.length > 1000) {
            analytics.splice(0, analytics.length - 1000);
        }
        
        this.saveToStorage('analytics', analytics);
        
        // إرسال إلى خدمة التحليل (إذا كانت متاحة)
        if (window.gtag) {
            window.gtag('event', eventName, data);
        }
        
        // إرسال إلى خدمة تحليل مخصصة
        this.sendToAnalyticsService(eventName, data);
    }

    /**
     * تحميل البيانات المحفوظة
     */
    loadSavedData() {
        try {
            // تحميل الفلاتر المحفوظة
            this.filters = this.loadFromStorage('filters') || {};
            this.applyFiltersFromStorage();
            
            // تحميل المفضلة
            this.favorites = this.loadFromStorage('favorites') || [];
            
            // تحميل التسجيلات
            this.registrations = this.loadFromStorage('registrations') || [];
            
            // تحديث الواجهة
            this.updateFavoritesUI();
            
        } catch (error) {
            console.error('خطأ في تحميل البيانات المحفوظة:', error);
        }
    }

    /**
     * تهيئة المكونات الخاصة بكل صفحة
     */
    initializePageSpecific() {
        const currentPage = window.location.pathname.split('/').pop().split('.')[0];
        
        switch (currentPage) {
            case 'index':
                this.initializeEventsHomePage();
                break;
            case 'exhibitions':
                this.initializeExhibitionsPage();
                break;
            case 'competitions':
                this.initializeCompetitionsPage();
                break;
            case 'conferences':
                this.initializeConferencesPage();
                break;
            case 'workshops':
                this.initializeWorkshopsPage();
                break;
            case 'event-details':
                this.initializeEventDetailsPage();
                break;
            case 'registration':
                this.initializeRegistrationPage();
                break;
        }
    }

    /**
     * تهيئة الصفحة الرئيسية للفعاليات
     */
    initializeEventsHomePage() {
        // تهيئة العدادات المتحركة
        this.initializeCounters();
        
        // تهيئة عرض الفعاليات المميزة
        this.initializeFeaturedEvents();
        
        // تهيئة التنقل السريع
        this.initializeQuickNavigation();
    }

    /**
     * تهيئة صفحة المعارض
     */
    initializeExhibitionsPage() {
        // تهيئة فلاتر المعارض الخاصة
        this.initializeExhibitionFilters();
        
        // تهيئة خريطة المعارض
        this.initializeExhibitionMap();
    }

    /**
     * تهيئة صفحة المسابقات
     */
    initializeCompetitionsPage() {
        // تهيئة عداد المسابقات النشطة
        this.initializeActiveCompetitions();
        
        // تهيئة نظام التصويت
        this.initializeVotingSystem();
    }

    /**
     * تهيئة صفحة المؤتمرات
     */
    initializeConferencesPage() {
        // تهيئة جدول المتحدثين
        this.initializeSpeakersSchedule();
        
        // تهيئة البث المباشر
        this.initializeLiveStream();
    }

    /**
     * تهيئة صفحة ورش العمل
     */
    initializeWorkshopsPage() {
        // تهيئة نظام الحجز
        this.initializeWorkshopBooking();
        
        // تهيئة تقييم المدربين
        this.initializeTrainerRating();
    }

    /**
     * تهيئة صفحة تفاصيل الفعالية
     */
    initializeEventDetailsPage() {
        // تهيئة العد التنازلي للفعالية
        this.initializeEventCountdown();
        
        // تهيئة نظام الأسئلة والأجوبة
        this.initializeQASystem();
        
        // تهيئة التقييمات والمراجعات
        this.initializeReviews();
    }

    /**
     * تهيئة صفحة التسجيل
     */
    initializeRegistrationPage() {
        // تهيئة ملخص التسجيل التفاعلي
        this.initializeRegistrationSummary();
        
        // تهيئة حاسبة التكلفة
        this.initializeCostCalculator();
        
        // تهيئة نظام الدفع
        this.initializePaymentSystem();
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
     * تنسيق التاريخ
     */
    formatDate(date, options = {}) {
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            ...options
        };
        
        return new Intl.DateTimeFormat('ar-DZ', defaultOptions).format(new Date(date));
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
            if (this.filters[key]) {
                url.searchParams.set(key, this.filters[key]);
            } else {
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

    /**
     * تقييد معدل التنفيذ
     */
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

    /**
     * حفظ في التخزين المحلي
     */
    saveToStorage(key, data) {
        try {
            localStorage.setItem(this.config.storagePrefix + key, JSON.stringify(data));
        } catch (error) {
            console.error('خطأ في حفظ البيانات:', error);
        }
    }

    /**
     * تحميل من التخزين المحلي
     */
    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(this.config.storagePrefix + key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('خطأ في تحميل البيانات:', error);
            return null;
        }
    }

    /**
     * إرسال حدث مخصص
     */
    dispatchEvent(eventName, data = {}) {
        const event = new CustomEvent(eventName, {
            detail: data,
            bubbles: true,
            cancelable: true
        });
        document.dispatchEvent(event);
    }

    /**
     * الحصول على معرف الجلسة
     */
    getSessionId() {
        let sessionId = sessionStorage.getItem('events_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('events_session_id', sessionId);
        }
        return sessionId;
    }

    /**
     * توليد معرف التسجيل
     */
    generateRegistrationId() {
        return 'reg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * إغلاق جميع النوافذ المنبثقة
     */
    closeAllModals() {
        const modals = document.querySelectorAll('.modal.active');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
    }

    /**
     * إخفاء جميع اللوحات
     */
    hideAllPanels() {
        const panels = document.querySelectorAll('[data-panel].show');
        panels.forEach(panel => {
            panel.classList.remove('show');
        });
    }
}

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.EventsManager = new EventsManager();
});

// تصدير الوظائف للاستخدام العام
window.EventsUtils = {
    showNotification: (message, type, duration) => window.EventsManager.showNotification(message, type, duration),
    toggleFavorite: (eventId) => window.EventsManager.toggleFavorite(eventId),
    shareEvent: (eventId, platform) => window.EventsManager.shareEvent(eventId, platform),
    addToCalendar: (eventId) => window.EventsManager.addToCalendar(eventId),
    formatCurrency: (amount) => window.EventsManager.formatCurrency(amount),
    formatDate: (date, options) => window.EventsManager.formatDate(date, options)
};

console.log('🎉 تم تحميل نظام إدارة الفعاليات بنجاح!');
