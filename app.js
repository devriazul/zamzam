document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------
    // 1. Mobile Menu Navigation Toggler
    // ----------------------------------------------------------------
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });

        // Close menu when a navigation link is clicked
        const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
            });
        });
    }

    // ----------------------------------------------------------------
    // 2. Active Link Highlighting on Scroll
    // ----------------------------------------------------------------
    const sections = document.querySelectorAll('section');
    const navLinksList = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinksList.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ----------------------------------------------------------------
    // 3. Scroll Reveal Animation (Intersection Observer)
    // ----------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ----------------------------------------------------------------
    // 4. Package Selection Auto-fill Helper
    // ----------------------------------------------------------------
    const packageButtons = document.querySelectorAll('.select-pack');
    const packageSelect = document.getElementById('packageSelect');

    packageButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const packName = btn.getAttribute('data-package');
            if (packageSelect) {
                packageSelect.value = packName;
            }
        });
    });

    // ----------------------------------------------------------------
    // 5. Gallery Lightbox Logic
    // ----------------------------------------------------------------
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    let currentGalleryIndex = 0;
    const galleryImages = [];

    // Populate gallery arrays
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('.gallery-img');
        const caption = item.querySelector('.gallery-overlay span').textContent;
        galleryImages.push({ src: img.src, alt: img.alt, caption: caption });

        item.addEventListener('click', () => {
            currentGalleryIndex = index;
            openLightbox();
        });
    });

    function openLightbox() {
        if (!lightboxModal) return;
        updateLightboxContent();
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Lock scrolling
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto'; // Unlock scrolling
    }

    function updateLightboxContent() {
        const item = galleryImages[currentGalleryIndex];
        if (lightboxImg && lightboxCaption) {
            lightboxImg.src = item.src;
            lightboxImg.alt = item.alt;
            lightboxCaption.textContent = item.caption;
        }
    }

    function showPrevImage(e) {
        if (e) e.stopPropagation();
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxContent();
    }

    function showNextImage(e) {
        if (e) e.stopPropagation();
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
        updateLightboxContent();
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
    if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) {
                closeLightbox();
            }
        });
    }

    // Keyboard support for Lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });

    // ----------------------------------------------------------------
    // 6. WhatsApp Automation (Form redirection)
    // ----------------------------------------------------------------
    const whatsappForm = document.getElementById('whatsappForm');
    const targetPhoneNumber = '8801739847814'; // Target Phone: 01739-847814 formatted with country code

    if (whatsappForm) {
        whatsappForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('userName').value.trim();
            const phone = document.getElementById('userPhone').value.trim();
            const selectedPackage = document.getElementById('packageSelect').value;
            const message = document.getElementById('userMessage').value.trim();

            if (!name || !phone || !selectedPackage) {
                alert('দয়া করে সব আবশ্যক ক্ষেত্রগুলো পূরণ করুন।');
                return;
            }

            // Constructing WhatsApp message in beautiful Bengali formatting
            let text = `*নতুন হজ্জ ও ওমরাহ বুকিং আবেদন*\n\n`;
            text += `👤 *নাম:* ${name}\n`;
            text += `📞 *মোবাইল নম্বর:* ${phone}\n`;
            text += `🕋 *প্যাকেজ:* ${selectedPackage}\n`;
            
            if (message) {
                text += `📝 *বার্তা:* ${message}\n`;
            } else {
                text += `📝 *বার্তা:* (কোনো অতিরিক্ত বার্তা নেই)\n`;
            }
            
            text += `\n_জমজম ট্রাভেলস এন্ড হজ্জ কাফেলা ওয়েবসাইট থেকে প্রেরিত।_`;

            // URL Encode the message
            const encodedText = encodeURIComponent(text);
            
            // Build the WhatsApp redirection URL (wa.me link is best and opens on mobile and desktop)
            const whatsappUrl = `https://wa.me/${targetPhoneNumber}?text=${encodedText}`;

            // Redirect in a new tab
            window.open(whatsappUrl, '_blank');
        });
    }
});
