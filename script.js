document.addEventListener('DOMContentLoaded', function() {
    // ==================== TRANSLATIONS ====================
    let translations = {};
    let currentLang = localStorage.getItem('lang') || 'vi';

    // Load translations
    fetch('translations.json')
        .then(response => response.json())
        .then(data => {
            translations = data;
            applyTranslations(currentLang);
            updateLangButton();
        })
        .catch(error => console.error('Error loading translations:', error));

    // Apply translations to page
    function applyTranslations(lang) {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = getNestedTranslation(translations[lang], key);
            if (translation) {
                element.textContent = translation;
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = getNestedTranslation(translations[lang], key);
            if (translation) {
                element.placeholder = translation;
            }
        });

        document.documentElement.lang = lang;
    }

    // Get nested translation value (e.g., "nav.home" -> translations.nav.home)
    function getNestedTranslation(obj, key) {
        return key.split('.').reduce((o, k) => (o || {})[k], obj);
    }

    // Update language button text
    function updateLangButton() {
        const langToggle = document.getElementById('langToggle');
        langToggle.querySelector('span').textContent = currentLang.toUpperCase();
    }

    // Language toggle
    const langToggle = document.getElementById('langToggle');
    langToggle.addEventListener('click', function() {
        currentLang = currentLang === 'vi' ? 'en' : 'vi';
        localStorage.setItem('lang', currentLang);
        applyTranslations(currentLang);
        updateLangButton();
    });

    // ==================== THEME TOGGLE ====================
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    let currentTheme = localStorage.getItem('theme') || 'light';

    // Apply saved theme on load
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
    }

    themeToggle.addEventListener('click', function() {
        if (currentTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.textContent = '☀️';
            currentTheme = 'dark';
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.textContent = '🌙';
            currentTheme = 'light';
        }
        localStorage.setItem('theme', currentTheme);
    });

    // ==================== MOBILE NAVIGATION ====================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==================== SKILL BARS ANIMATION ====================
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const animateSkillBars = () => {
        skillBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
            
            if (isVisible) {
                const progress = bar.getAttribute('data-progress');
                bar.style.width = progress + '%';
            }
        });
    };

    // Initial check
    animateSkillBars();
    
    // Check on scroll
    window.addEventListener('scroll', animateSkillBars);

    // ==================== FORM HANDLING ====================
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get success message based on current language
        const successMessage = translations[currentLang]?.contact?.successMessage || 
            'Cảm ơn bạn đã gửi tin nhắn! Tôi sẽ phản hồi sớm nhất có thể.';
        
        alert(successMessage);
        this.reset();
    });

    // ==================== SECTION ANIMATIONS ====================
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Fade in when entering viewport
                entry.target.classList.add('visible');
                entry.target.classList.remove('hidden');
            } else {
                // Fade out when leaving viewport
                entry.target.classList.remove('visible');
                entry.target.classList.add('hidden');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.classList.add('fade-section', 'hidden');
        sectionObserver.observe(section);
    });

    // Hero section should be visible immediately
    const heroSection = document.getElementById('home');
    if (heroSection) {
        heroSection.classList.remove('hidden');
        heroSection.classList.add('visible');
    }

    // ==================== BANNER SLIDER ====================
    const bannerTrack = document.querySelector('.banner-track');
    const bannerDots = document.querySelectorAll('.banner-dot');
    const prevBtn = document.getElementById('bannerPrev');
    const nextBtn = document.getElementById('bannerNext');
    
    if (bannerTrack && bannerDots.length > 0) {
        let currentSlide = 0;
        const totalSlides = bannerDots.length;
        let autoSlideInterval;

        function goToSlide(index) {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            
            currentSlide = index;
            bannerTrack.style.transform = `translateX(-${currentSlide * 100}vw)`;
            
            // Update dots
            bannerDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }

        function nextSlide() {
            goToSlide(currentSlide + 1);
        }

        function prevSlide() {
            goToSlide(currentSlide - 1);
        }

        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }

        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }

        // Arrow buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoSlide();
            });
        }

        // Dot navigation
        bannerDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoSlide();
            });
        });

        // Touch/Swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        bannerTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            clearInterval(autoSlideInterval);
        });

        bannerTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
            startAutoSlide();
        });

        // Start auto slide
        startAutoSlide();
    }

    // ==================== LIGHTBOX GALLERY ====================
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const galleries = document.querySelectorAll('.exp-gallery');

    let currentGalleryImages = [];
    let currentImageIndex = 0;

    if (lightbox && galleries.length > 0) {
        // Open lightbox when clicking gallery image
        galleries.forEach(gallery => {
            const images = gallery.querySelectorAll('img');
            images.forEach((img, index) => {
                img.addEventListener('click', () => {
                    currentGalleryImages = Array.from(images).map(i => i.src);
                    currentImageIndex = index;
                    openLightbox();
                });
            });
        });

        function openLightbox() {
            lightbox.classList.add('active');
            updateLightboxImage();
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.add('closing');
            setTimeout(() => {
                lightbox.classList.remove('active', 'closing');
                document.body.style.overflow = '';
            }, 300);
        }

        function updateLightboxImage() {
            lightboxImg.src = currentGalleryImages[currentImageIndex];
            lightboxCounter.textContent = `${currentImageIndex + 1} / ${currentGalleryImages.length}`;
        }

        function nextImage() {
            currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
            updateLightboxImage();
        }

        function prevImage() {
            currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
            updateLightboxImage();
        }

        // Event listeners
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxNext.addEventListener('click', nextImage);
        lightboxPrev.addEventListener('click', prevImage);

        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        });

        // Touch swipe support
        let touchStartX = 0;
        lightboxImg.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        lightboxImg.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextImage();
                } else {
                    prevImage();
                }
            }
        });
    }
});
