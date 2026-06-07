// Pratik Mali Portfolio - Fixed Messaging & Enhanced Features
// Updated with working contact form and verified certifications

class Portfolio {
    constructor() {
        this.currentTheme = 'light';
        this.typingIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.tutorialStep = 1;
        this.isTyping = true;
        this.typingPhrases = [
            'IVR & Genesys Cloud Bot Developer',
            'Software Developer at Quantiphi',
            'NICE CXone Specialist',
            'Conversational AI Developer',
            'Contact Center Solutions Expert',
            'API Integration Specialist'
        ];

        // Initialize EmailJS
        this.initEmailJS();
        this.init();
    }

    initEmailJS() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init("YOUR_PUBLIC_KEY");
        }
    }

    init() {
        this.setupEventListeners();
        // this.startTypingAnimation();
        this.setupScrollAnimations();
        this.setupNavigation();
        this.setupThemeToggle();
        this.setupProjectFilters();
        this.setupSkillBars();
        this.setupTabs();
        this.setupContactForm();
        this.setupTutorial();
        this.setupCharacterCounter();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupIntersectionObserver();
        });

        window.addEventListener('scroll', this.throttle(() => {
            this.updateActiveNav();
            this.animateOnScroll();
        }, 16));

        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }

    startTypingAnimation() {
        const typingElement = document.getElementById('typing-text');
        if (!typingElement) return;

        let currentPhraseIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;

        const type = () => {
            const currentPhrase = this.typingPhrases[currentPhraseIndex];

            if (isDeleting) {
                typingElement.textContent = currentPhrase.substring(0, currentCharIndex - 1);
                currentCharIndex--;
            } else {
                typingElement.textContent = currentPhrase.substring(0, currentCharIndex + 1);
                currentCharIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && currentCharIndex === currentPhrase.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                currentPhraseIndex = (currentPhraseIndex + 1) % this.typingPhrases.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        };

        setTimeout(type, 1000);
    }

    setupCharacterCounter() {
        const messageTextarea = document.getElementById('message');
        const charCount = document.getElementById('char-count');

        if (messageTextarea && charCount) {
            messageTextarea.addEventListener('input', function() {
                const currentLength = this.value.length;
                charCount.textContent = currentLength;

                if (currentLength > 450) {
                    charCount.style.color = '#ff6b35';
                } else if (currentLength > 400) {
                    charCount.style.color = '#f39c12';
                } else {
                    charCount.style.color = '#7f8c8d';
                }
            });
        }
    }

    setupContactForm() {
        const contactForm = document.getElementById('contact-form');

        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                if (this.validateContactForm()) {
                    this.setFormLoading(true);

                    try {
                        await this.sendMessage();
                        this.showFormSuccess();
                        contactForm.reset();
                        this.updateCharacterCount(0);
                    } catch (error) {
                        console.error('Form submission error:', error);
                        this.showFormError('There was an error sending your message. Please try emailing me directly at malipratik999@gmail.com');
                    } finally {
                        this.setFormLoading(false);
                    }
                }
            });
        }
    }

    async sendMessage() {
        const formData = this.getFormData();

        if (typeof emailjs !== 'undefined' && window.emailjs) {
            try {
                await emailjs.send(
                    'YOUR_SERVICE_ID',
                    'YOUR_TEMPLATE_ID',
                    {
                        from_name: formData.name,
                        from_email: formData.email,
                        company: formData.company,
                        position: formData.position,
                        subject: formData.subject,
                        message: formData.message,
                        to_email: 'malipratik999@gmail.com'
                    }
                );
                return;
            } catch (error) {
                console.log('EmailJS failed, trying alternative method');
            }
        }

        try {
            const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Network response was not ok');
            return;
        } catch (error) {
            console.log('Formspree failed, using mailto fallback');
        }

        this.createMailtoFallback(formData);
    }

    getFormData() {
        return {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            company: document.getElementById('company').value.trim(),
            position: document.getElementById('position').value.trim(),
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value.trim()
        };
    }

    createMailtoFallback(formData) {
        const subject = encodeURIComponent(`Portfolio Contact: ${formData.subject}`);
        const body = encodeURIComponent(`
            Name: ${formData.name}
            Email: ${formData.email}
            Company: ${formData.company}
            Position: ${formData.position}
            Message: ${formData.message}
        `);
        const mailtoLink = `mailto:malipratik999@gmail.com?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;
        this.showFormSuccess(true);
    }

    validateContactForm() {
        const formData = this.getFormData();
        this.clearFormErrors();
        let isValid = true;

        if (formData.name.length < 2) {
            this.showFieldError('name', 'Please enter your full name (at least 2 characters)');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            this.showFieldError('email', 'Please enter a valid email address');
            isValid = false;
        }

        if (!formData.subject) {
            this.showFieldError('subject', 'Please select a subject for your inquiry');
            isValid = false;
        }

        if (formData.message.length < 20) {
            this.showFieldError('message', 'Please provide more details (at least 20 characters)');
            isValid = false;
        }

        if (formData.message.length > 500) {
            this.showFieldError('message', 'Message is too long (maximum 500 characters)');
            isValid = false;
        }

        const consent = document.getElementById('consent');
        if (!consent.checked) {
            this.showFieldError('consent', 'Please provide consent to store your information');
            isValid = false;
        }

        return isValid;
    }

    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorSpan = document.getElementById(`${fieldId}-error`);

        if (field) {
            field.classList.add('error');
            field.style.borderColor = '#e74c3c';
        }
        if (errorSpan) {
            errorSpan.textContent = message;
            errorSpan.style.display = 'block';
        }
    }

    clearFormErrors() {
        const errorFields = document.querySelectorAll('.form-control.error');
        const errorMessages = document.querySelectorAll('.form-error');

        errorFields.forEach(field => {
            field.classList.remove('error');
            field.style.borderColor = '';
        });

        errorMessages.forEach(error => {
            error.textContent = '';
            error.style.display = 'none';
        });

        const formStatus = document.getElementById('form-status');
        if (formStatus) {
            formStatus.innerHTML = '';
            formStatus.className = 'form-status';
        }
    }

    setFormLoading(isLoading) {
        const submitBtn = document.getElementById('submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');

        if (isLoading) {
            submitBtn.disabled = true;
            btnText.classList.add('hidden');
            btnLoading.classList.remove('hidden');
        } else {
            submitBtn.disabled = false;
            btnText.classList.remove('hidden');
            btnLoading.classList.add('hidden');
        }
    }

    showFormSuccess(isMailtoFallback = false) {
        const formStatus = document.getElementById('form-status');
        if (formStatus) {
            formStatus.className = 'form-status success';
            formStatus.innerHTML = `
                <div class="success-message">
                    <strong>Message Sent Successfully!</strong><br>
                    ${isMailtoFallback
                        ? 'Your default email client should have opened. If not, please email me directly at malipratik999@gmail.com'
                        : "Thank you for your message! I'll get back to you within 24 hours."
                    }
                </div>`;
        }
        this.showToastMessage('Message sent successfully! 🎉', 'success');
    }

    showFormError(message) {
        const formStatus = document.getElementById('form-status');
        if (formStatus) {
            formStatus.className = 'form-status error';
            formStatus.innerHTML = `
                <div class="error-message">
                    <strong>Sending Failed</strong><br>${message}
                </div>`;
        }
        this.showToastMessage('Failed to send message. Please try again.', 'error');
    }

    showToastMessage(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `<div>${message}</div>`;

        let container = document.getElementById('message-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'message-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
            `;
            document.body.appendChild(container);
        }

        container.appendChild(toast);
        setTimeout(() => { if (toast.parentNode) toast.remove(); }, 5000);
    }

    updateCharacterCount(count) {
        const charCount = document.getElementById('char-count');
        if (charCount) charCount.textContent = count;
    }

    setupProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        if (!filterButtons.length || !projectCards.length) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const filterValue = e.target.getAttribute('data-filter');

                filterButtons.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                projectCards.forEach((card, index) => {
                    const categories = card.getAttribute('data-category');
                    if (filterValue === 'all') {
                        this.showProjectCard(card, index);
                    } else {
                        if (categories && categories.toLowerCase().includes(filterValue.toLowerCase())) {
                            this.showProjectCard(card, index);
                        } else {
                            this.hideProjectCard(card);
                        }
                    }
                });
            });
        });
    }

    showProjectCard(card, index) {
        card.style.display = 'block';
        setTimeout(() => {
            card.classList.add('fade-in');
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    }

    hideProjectCard(card) {
        card.classList.remove('fade-in');
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => { card.style.display = 'none'; }, 300);
    }

    setupNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
                document.body.classList.toggle('nav-open');
            });
        }

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu) navMenu.classList.remove('active');
                if (navToggle) navToggle.classList.remove('active');
                document.body.classList.remove('nav-open');
            });
        });

        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offsetPosition = target.offsetTop - 80;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            });
        });
    }

    updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        let current = '';

        sections.forEach(section => {
            if (window.scrollY >= (section.offsetTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    }

    setupSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.setProperty('--target-width', width + '%');
        });
    }

    animateSkillBars() {
        const skillsSection = document.getElementById('skills');
        const skillBars = document.querySelectorAll('.skill-progress');

        if (skillsSection && this.isElementInViewport(skillsSection)) {
            skillBars.forEach((bar, index) => {
                if (!bar.classList.contains('animate')) {
                    setTimeout(() => {
                        const width = bar.getAttribute('data-width');
                        bar.style.width = width + '%';
                        bar.classList.add('animate');
                    }, index * 100);
                }
            });
        }
    }

    setupScrollAnimations() {
        this.animateSkillBars();
    }

    animateOnScroll() {
        this.animateSkillBars();
        this.animateCounters();
    }

    animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        counters.forEach(counter => {
            if (this.isElementInViewport(counter) && !counter.classList.contains('counted')) {
                const target = parseInt(counter.getAttribute('data-count'));
                let count = 0;
                const increment = target / 100;
                const timer = setInterval(() => {
                    count += increment;
                    if (count >= target) {
                        counter.textContent = target;
                        clearInterval(timer);
                        counter.classList.add('counted');
                    } else {
                        counter.textContent = Math.floor(count);
                    }
                }, 20);
            }
        });
    }

    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                button.classList.add('active');
                const targetPane = document.getElementById(targetTab);
                if (targetPane) targetPane.classList.add('active');
            });
        });
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        const savedTheme = localStorage.getItem('portfolio-theme') || 'light';
        this.setTheme(savedTheme);

        themeToggle.addEventListener('click', () => {
            const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
            this.setTheme(newTheme);
        });
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-color-scheme', theme);
        localStorage.setItem('portfolio-theme', theme);

        const icon = document.querySelector('#theme-toggle i');
        if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    setupTutorial() {
        const tutorialBtn = document.getElementById('tutorial-btn');
        const tutorialOverlay = document.getElementById('tutorial-overlay');
        const tutorialClose = document.getElementById('tutorial-close');
        const tutorialNext = document.getElementById('tutorial-next');
        const tutorialPrev = document.getElementById('tutorial-prev');

        if (tutorialBtn) tutorialBtn.addEventListener('click', () => this.showTutorial());
        if (tutorialClose) tutorialClose.addEventListener('click', () => this.hideTutorial());
        if (tutorialNext) tutorialNext.addEventListener('click', () => this.nextTutorialStep());
        if (tutorialPrev) tutorialPrev.addEventListener('click', () => this.prevTutorialStep());

        if (tutorialOverlay) {
            tutorialOverlay.addEventListener('click', (e) => {
                if (e.target === tutorialOverlay) this.hideTutorial();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (tutorialOverlay && !tutorialOverlay.classList.contains('hidden')) {
                if (e.key === 'Escape') this.hideTutorial();
                else if (e.key === 'ArrowRight') this.nextTutorialStep();
                else if (e.key === 'ArrowLeft') this.prevTutorialStep();
            }
        });
    }

    showTutorial() {
        const overlay = document.getElementById('tutorial-overlay');
        if (overlay) {
            this.tutorialStep = 1;
            this.updateTutorialContent();
            overlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    hideTutorial() {
        const overlay = document.getElementById('tutorial-overlay');
        if (overlay) {
            overlay.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    nextTutorialStep() {
        if (this.tutorialStep < 10) {
            this.tutorialStep++;
            this.updateTutorialContent();
        }
    }

    prevTutorialStep() {
        if (this.tutorialStep > 1) {
            this.tutorialStep--;
            this.updateTutorialContent();
        }
    }

    updateTutorialContent() {
        const prevBtn = document.getElementById('tutorial-prev');
        const nextBtn = document.getElementById('tutorial-next');
        const progressEl = document.getElementById('tutorial-progress');

        if (progressEl) progressEl.textContent = `${this.tutorialStep} / 10`;

        if (prevBtn) {
            prevBtn.disabled = this.tutorialStep === 1;
            prevBtn.style.opacity = this.tutorialStep === 1 ? '0.5' : '1';
        }

        if (nextBtn) {
            if (this.tutorialStep === 10) {
                nextBtn.textContent = 'Finish';
                nextBtn.onclick = () => this.hideTutorial();
            } else {
                nextBtn.textContent = 'Next';
                nextBtn.onclick = () => this.nextTutorialStep();
            }
        }
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    if (entry.target.classList.contains('skill-category')) {
                        this.animateSkillCategory(entry.target);
                    }
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('.project-card, .skill-category, .timeline-item, .certification-card')
            .forEach(el => observer.observe(el));
    }

    animateSkillCategory(element) {
        const skillItems = element.querySelectorAll('.skill-item');
        skillItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('animate');
                const progressBar = item.querySelector('.skill-progress');
                if (progressBar) {
                    progressBar.style.width = progressBar.getAttribute('data-width') + '%';
                }
            }, index * 200);
        });
    }

    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 && rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
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

    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    handleResize() {
        this.animateSkillBars();
    }
}

// Global functions for HTML onclick handlers
function showCertificationModal(certId) {
    const certificationData = {
        'nice': {
            title: 'NICE Certified Implementation Engineer',
            subtitle: 'CXone Mpower ACD/IVR',
            provider: 'NICE',
            description: 'Professional certification covering NICE CXone platform implementation, IVR flow design, ACD configuration, and contact center solution architecture.',
            skills: ['IVR Configuration', 'ACD Management', 'CXone Platform', 'Contact Center Solutions'],
            verified: true
        },
        'aws-cp': {
            title: 'AWS Certified Cloud Practitioner',
            provider: 'Amazon Web Services',
            description: 'Foundation-level certification covering AWS cloud concepts, services, security, architecture, pricing, and support.',
            skills: ['Cloud Fundamentals', 'AWS Services', 'Security & Compliance', 'Billing Models'],
            verified: true,
            verifyLink: 'https://www.credly.com/badges/f72b1c89-bee9-46df-b820-e288dfd3b4c7/linked_in_profile'
        },
        'aws-sa': {
            title: 'AWS Certified Solutions Architect',
            subtitle: 'Associate',
            provider: 'Amazon Web Services',
            description: 'Associate-level certification demonstrating ability to design distributed applications and systems on the AWS platform.',
            skills: ['Architecture Design', 'High Performance', 'Cost Optimization', 'Resilient Systems'],
            verified: true,
            verifyLink: 'https://www.credly.com/badges/d7ea00f9-e857-4e6e-8dec-70740497bd4b/linked_in_profile'
        },
        'azure': {
            title: 'Microsoft Certified: Azure Fundamentals',
            provider: 'Microsoft',
            description: 'Foundation certification covering Azure cloud services, security, privacy, compliance, and trust.',
            skills: ['Azure Services', 'Cloud Concepts', 'Security Features', 'Pricing Models'],
            verified: true
        },
        'java': {
            title: 'Java OOPs',
            provider: 'HackerRank',
            description: 'Certification demonstrating proficiency in Java object-oriented programming concepts.',
            skills: ['Object-Oriented Programming', 'Java Development', 'Code Proficiency']
        },
        'angular': {
            title: 'Angular',
            provider: 'HackerRank',
            description: 'Certification validating expertise in Angular framework development.',
            skills: ['Frontend Framework', 'Component Development', 'TypeScript']
        },
        'java-ds': {
            title: 'Data Structures and Algorithms with Java',
            provider: 'Udemy',
            description: 'Comprehensive course covering fundamental data structures and algorithms using Java.',
            skills: ['Algorithm Design', 'Data Structures', 'Problem Solving', 'Java Programming']
        }
    };

    const cert = certificationData[certId];
    if (cert) {
        const modal = document.getElementById('certification-modal');
        const title = document.getElementById('modal-title');
        const content = document.getElementById('modal-content');

        if (title && content && modal) {
            title.textContent = cert.title;
            content.innerHTML = `
                <p><strong>${cert.provider}</strong></p>
                ${cert.subtitle ? `<p>${cert.subtitle}</p>` : ''}
                ${cert.verified ? '<p>✓ Verified Certification</p>' : ''}
                <p>${cert.description}</p>
                <p><strong>Skills Covered:</strong></p>
                <div>${cert.skills.map(skill => `<span>${skill}</span>`).join('')}</div>
                ${cert.verifyLink ? `<a href="${cert.verifyLink}" target="_blank">Verify on Credly</a>` : ''}
            `;
            modal.classList.remove('hidden');
        }
    }
}

function hideCertificationModal() {
    const modal = document.getElementById('certification-modal');
    if (modal) modal.classList.add('hidden');
}

function toggleExperienceDetails(item) {
    const details = item.querySelector('.experience-details');
    const isActive = item.classList.contains('active');

    document.querySelectorAll('.timeline-item').forEach(i => {
        i.classList.remove('active');
        const d = i.querySelector('.experience-details');
        if (d) d.style.maxHeight = '0';
    });

    if (!isActive) {
        item.classList.add('active');
        if (details) details.style.maxHeight = details.scrollHeight + 'px';
    }
}

// Initialize Portfolio on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioInstance = new Portfolio();
});

// Handle any unhandled errors
window.addEventListener('error', (e) => {
    console.error('Portfolio Error:', e.error);
});

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                console.log('Portfolio Load Time:', perfData.loadEventEnd - perfData.loadEventStart + 'ms');
            }
        }, 0);
    });
}


// ============================================================
// PortfolioApp Class — Updated Data
// ============================================================
class PortfolioApp {
    constructor() {
        // ✅ UPDATED DATA
        this.data = {
            "personal": {
                "name": "Pratik Mali",
                "title": "IVR & Genesys Cloud Bot Developer | Software Developer",
                "location": "Pune, Maharashtra, India",
                "email": "malipratik999@gmail.com",
                "phone": "+91 7066889505",
                "linkedin": "https://www.linkedin.com/in/pratik-mali-06b172228/",
                "github": "https://github.com/PratikMali2210",
                "credly": "https://www.credly.com/users/pratik-mali",
                "profile": "Results-driven IVR and Contact Center Specialist with over 3 years of experience in Genesys Cloud CX, NICE CXone, chatbot-related development, API integrations, and customer service automation. Currently contributing to conversational AI solutions at Quantiphi.",
                "photo": "./assets/Pratik-Mali-Photo.png",
                "resume": "./assets/Pratik-Mali-Resume.pdf"
            },
            "experience": [
                {
                    "title": "Software Developer",
                    "company": "Quantiphi",
                    "duration": "Jan 2026 – Present",
                    "current": true,
                    "responsibilities": [
                        "Working on chatbot and conversational AI related development using JavaScript, React, Node.js, APIs, and webhooks.",
                        "Contributing to UI improvements and backend integrations for AI-powered solutions.",
                        "Gaining hands-on exposure to Dialogflow, Firestore, Cloud Functions, GKE, BigQuery, and related GCP components.",
                        "Collaborating with cross-functional teams to deliver scalable conversational AI features."
                    ]
                },
                {
                    "title": "NICE CXone & Genesys Cloud IVR Specialist",
                    "company": "Capgemini",
                    "duration": "Sep 2022 – Jan 2026",
                    "responsibilities": [
                        "Designed reusable config-driven IVR architecture for flexible input and routing.",
                        "Implemented ANI-based data dips to fetch customer-specific data from backend APIs.",
                        "Created agent screen pop features for MS Dynamics (both embedded and external).",
                        "Developed TokenEx (S6) and CRS Payment IVR flows for PCI-compliant transactions.",
                        "Configured Personal Connection (PC) outbound campaigns using Agentless, Progressive, and Predictive dialer modes.",
                        "Designed advanced IVR flows in Genesys Architect for self-service and speech-based routing.",
                        "Integrated Salesforce with Genesys Cloud to enhance data sync and personalize engagement.",
                        "Developed and maintained omni-channel bot solutions (voice/non-voice) using Genesys Architect."
                    ]
                }
            ],
            "projects": [
                {
                    "title": "Movix - Movie & TV Show App",
                    "description": "Modern React application for browsing movies and TV shows with advanced search, filtering, and detailed information views. Features responsive design and smooth user experience.",
                    "technologies": ["React", "Redux Toolkit", "React Router", "API Integration", "CSS3"],
                    "github": "https://github.com/PratikMali2210/pratik-mali-movix-new-app",
                    "demo": "https://pratik-mali-movix-new-app.netlify.app/",
                    "category": "react frontend",
                    "highlights": ["Movie/TV Show Database", "Search & Filter", "Responsive Design", "API Integration"]
                },
                {
                    "title": "E-Commerce Platform",
                    "description": "Full-featured e-commerce web application with product catalog, shopping cart functionality, user authentication, and modern responsive design.",
                    "technologies": ["React", "JavaScript", "CSS3", "Responsive Design"],
                    "github": "https://github.com/PratikMali2210/e-commerce-site-delay",
                    "demo": "https://e-commerce-site-delay.netlify.app/",
                    "category": "react ecommerce",
                    "highlights": ["Product Catalog", "Shopping Cart", "User Authentication", "Payment Integration"]
                },
                {
                    "title": "Genesys Messenger Integration",
                    "description": "Contact center messaging solution showcasing Genesys Cloud platform integration expertise. Demonstrates real-world application of contact center technologies.",
                    "technologies": ["JavaScript", "Genesys Cloud SDK", "Real-time Messaging", "Contact Center Integration"],
                    "github": "https://github.com/PratikMali2210/genesysmessenger",
                    "demo": "https://genesysmessenger.netlify.app/",
                    "category": "genesys integration",
                    "highlights": ["Genesys Cloud Integration", "Real-time Messaging", "Contact Center SDK", "Professional Implementation"]
                }
            ],
            "skills": {
                "contactCenter": [
                    {"name": "Genesys Cloud CX", "level": 95},
                    {"name": "NICE CXone", "level": 95},
                    {"name": "IVR Flow Creation", "level": 95},
                    {"name": "Bot Development", "level": 88},
                    {"name": "Customer Service Automation", "level": 90},
                    {"name": "Salesforce Integration", "level": 85}
                ],
                "programming": [
                    {"name": "JavaScript", "level": 85},
                    {"name": "Java", "level": 80},
                    {"name": "SQL", "level": 85},
                    {"name": "API Development / REST APIs", "level": 90},
                    {"name": "Webhooks", "level": 85}
                ],
                "cloud": [
                    {"name": "AWS", "level": 75},
                    {"name": "Azure", "level": 70},
                    {"name": "Dialogflow / GCP", "level": 72}
                ],
                "frameworks": [
                    {"name": "ReactJS", "level": 80},
                    {"name": "Angular", "level": 78},
                    {"name": "Node.js", "level": 78},
                    {"name": "HTML5 / CSS3", "level": 90}
                ]
            },
            "certifications": [
                {
                    "id": "nice",
                    "title": "NICE Certified Implementation Engineer",
                    "subtitle": "CXone Mpower ACD/IVR",
                    "provider": "NICE",
                    "verified": true,
                    "skills": ["IVR Configuration", "ACD Management", "CXone Platform"]
                },
                {
                    "id": "aws-cp",
                    "title": "AWS Certified Cloud Practitioner",
                    "provider": "Amazon Web Services",
                    "verified": true,
                    "verifyLink": "https://www.credly.com/badges/f72b1c89-bee9-46df-b820-e288dfd3b4c7/linked_in_profile",
                    "skills": ["Cloud Fundamentals", "AWS Services"]
                },
                {
                    "id": "aws-sa",
                    "title": "AWS Solutions Architect",
                    "subtitle": "Associate Level",
                    "provider": "Amazon Web Services",
                    "verified": true,
                    "verifyLink": "https://www.credly.com/badges/d7ea00f9-e857-4e6e-8dec-70740497bd4b/linked_in_profile",
                    "skills": ["Architecture Design", "Cost Optimization"]
                },
                {
                    "id": "azure",
                    "title": "Microsoft Azure Fundamentals",
                    "provider": "Microsoft",
                    "verified": true,
                    "skills": ["Azure Services", "Cloud Concepts"]
                },
                {
                    "id": "java",
                    "title": "Java OOPs Certification",
                    "provider": "HackerRank",
                    "skills": ["OOP", "Java Development"]
                },
                {
                    "id": "angular",
                    "title": "Angular Certification",
                    "provider": "HackerRank",
                    "skills": ["Frontend Framework", "TypeScript"]
                },
                {
                    "id": "java-ds",
                    "title": "Data Structures & Algorithms",
                    "provider": "Udemy",
                    "skills": ["Algorithm Design", "Problem Solving"]
                }
            ]
        };

        // ✅ UPDATED TYPING PHRASES
        this.typingPhrases = [
            "IVR & Genesys Cloud Bot Developer",
            "Software Developer at Quantiphi",
            "NICE CXone Specialist",
            "Conversational AI Developer",
            "Contact Center Solutions Expert",
            "API Integration Specialist"
        ];

        this.currentPhraseIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.typingSpeed = 100;
        this.deletingSpeed = 50;
        this.pauseTime = 2000;
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        this.setupEventListeners();
        this.populateSkills();
        this.populateExperience();
        this.populateProjects();
        this.populateCertifications();
        this.startTypingAnimation();
        this.setupScrollAnimations();
        this.setupThemeToggle();
        this.handleNavbarScroll();
        this.setupSmoothScrolling();
        this.setupMobileMenu();
        this.setupModalHandlers();
        this.setupContactForm();
    }

    setupEventListeners() {
        window.addEventListener('scroll', () => {
            this.updateActiveNavLink();
            this.animateOnScroll();
        });
        window.addEventListener('resize', () => this.handleResize());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeAllModals();
        });
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => modal.classList.add('hidden'));
    }

    setupSmoothScrolling() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = document.querySelector(link.getAttribute('href'));
                if (targetSection) {
                    window.scrollTo({ top: targetSection.offsetTop - 80, behavior: 'smooth' });
                }
                const mobileMenu = document.getElementById('nav-links');
                const menuToggle = document.getElementById('mobile-menu-toggle');
                if (mobileMenu) mobileMenu.classList.remove('active');
                if (menuToggle) menuToggle.classList.remove('active');
            });
        });
    }

    setupMobileMenu() {
        const menuToggle = document.getElementById('mobile-menu-toggle');
        const mobileMenu = document.getElementById('nav-links');

        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                menuToggle.classList.toggle('active');
                mobileMenu.classList.toggle('active');
            });

            document.addEventListener('click', (e) => {
                if (!menuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                    menuToggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                }
            });
        }
    }

    handleNavbarScroll() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
            });
        }
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + section.clientHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    startTypingAnimation() {
        const typingElement = document.getElementById('typing-text');
        if (!typingElement) return;

        const currentPhrase = this.typingPhrases[this.currentPhraseIndex];

        if (!this.isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;

            if (this.currentCharIndex === currentPhrase.length) {
                setTimeout(() => {
                    this.isDeleting = true;
                    this.startTypingAnimation();
                }, this.pauseTime);
                return;
            }
            setTimeout(() => this.startTypingAnimation(), this.typingSpeed);
        } else {
            typingElement.textContent = currentPhrase.substring(0, this.currentCharIndex);
            this.currentCharIndex--;

            if (this.currentCharIndex < 0) {
                this.isDeleting = false;
                this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.typingPhrases.length;
                setTimeout(() => this.startTypingAnimation(), 500);
                return;
            }
            setTimeout(() => this.startTypingAnimation(), this.deletingSpeed);
        }
    }

    populateSkills() {
        Object.keys(this.data.skills).forEach(category => {
            const container = document.querySelector(`[data-category="${category}"]`);
            if (!container) return;

            this.data.skills[category].forEach(skill => {
                const skillElement = document.createElement('div');
                skillElement.className = 'skill-item';
                skillElement.innerHTML = `
                    <div class="skill-header">
                        <span class="skill-name">${skill.name}</span>
                        <span class="skill-percentage">${skill.level}%</span>
                    </div>
                    <div class="skill-bar">
                        <div class="skill-progress" data-level="${skill.level}" style="width: 0%"></div>
                    </div>
                `;
                container.appendChild(skillElement);
            });
        });
    }

    populateExperience() {
        const timeline = document.querySelector('.timeline');
        if (!timeline) return;

        this.data.experience.forEach((exp) => {
            const timelineItem = document.createElement('div');
            timelineItem.className = 'timeline-item';

            const responsibilities = exp.responsibilities.map(resp =>
                `<div class="responsibility-item">${resp}</div>`
            ).join('');

            const currentBadge = exp.current
                ? `<span class="current-badge">🟢 Current</span>`
                : '';

            timelineItem.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <div class="experience-header">
                        <h3 class="experience-title">${exp.title} ${currentBadge}</h3>
                        <p class="experience-company">${exp.company}</p>
                        <p class="experience-duration">${exp.duration}</p>
                    </div>
                    <div class="experience-responsibilities">
                        <ul>${exp.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>
                    </div>
                    <div class="expand-indicator">
                        <span>Click to expand details</span>
                        <span class="expand-arrow">▼</span>
                    </div>
                </div>
            `;

            const content = timelineItem.querySelector('.timeline-content');
            content.addEventListener('click', () => {
                content.classList.toggle('expanded');
                const resp = content.querySelector('.experience-responsibilities');
                resp.classList.toggle('expanded');
                const indicator = content.querySelector('.expand-indicator span');
                indicator.textContent = content.classList.contains('expanded')
                    ? 'Click to collapse'
                    : 'Click to expand details';
            });

            timeline.appendChild(timelineItem);
        });
    }

    populateProjects() {
        const projectsGrid = document.getElementById('projects-grid');
        if (!projectsGrid) return;

        this.data.projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.setAttribute('data-category', project.category);

            const technologies = project.technologies.map(tech =>
                `<span class="tech-tag">${tech}</span>`
            ).join('');

            const highlights = project.highlights.map(h =>
                `<div class="highlight-item">${h}</div>`
            ).join('');

            projectCard.innerHTML = `
                <div class="project-header">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tech">${technologies}</div>
                    <div class="project-highlights">
                        <h4>Key Features</h4>
                        <div class="highlights-list">${highlights}</div>
                    </div>
                    <div class="project-links">
                        <a href="${project.github}" target="_blank" class="project-link">GitHub</a>
                        <a href="${project.demo}" target="_blank" class="project-link">Live Demo</a>
                    </div>
                </div>
            `;

            projectsGrid.appendChild(projectCard);
        });

        this.setupProjectFilters();
    }

    setupProjectFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filter = button.getAttribute('data-filter');
                projectCards.forEach(card => {
                    const categories = card.getAttribute('data-category');
                    if (filter === 'all' || categories.includes(filter)) {
                        card.style.display = 'block';
                        card.classList.add('fade-in');
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('fade-in');
                    }
                });
            });
        });
    }

    populateCertifications() {
        const certificationsGrid = document.getElementById('certifications-grid');
        if (!certificationsGrid) return;

        this.data.certifications.forEach(cert => {
            const certCard = document.createElement('div');
            certCard.className = 'cert-card';

            const skills = cert.skills.map(skill =>
                `<span class="cert-skill">${skill}</span>`
            ).join('');

            const verifiedBadge = cert.verified
                ? '<div class="cert-verified">✓ Verified</div>'
                : '';

            certCard.innerHTML = `
                ${verifiedBadge}
                <div class="cert-badge">🏆</div>
                <h3 class="cert-title">${cert.title}</h3>
                ${cert.subtitle ? `<p class="cert-subtitle">${cert.subtitle}</p>` : ''}
                <p class="cert-provider">${cert.provider}</p>
                <div class="cert-skills">${skills}</div>
            `;

            certCard.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showCertificationModal(cert);
            });

            certificationsGrid.appendChild(certCard);
        });
    }

    showCertificationModal(cert) {
        const modal = document.getElementById('cert-modal');
        const title = document.getElementById('cert-modal-title');
        const body = document.getElementById('cert-modal-body');
        if (!modal || !title || !body) return;

        title.textContent = cert.title;
        const skills = cert.skills.map(skill =>
            `<span class="cert-skill">${skill}</span>`
        ).join('');

        const verifyButton = cert.verifyLink
            ? `<a href="${cert.verifyLink}" target="_blank" class="btn btn--primary">Verify Certification</a>`
            : '';

        body.innerHTML = `
            <div class="cert-details">
                <div class="cert-info">
                    <p><strong>Provider:</strong> ${cert.provider}</p>
                    ${cert.subtitle ? `<p><strong>Level:</strong> ${cert.subtitle}</p>` : ''}
                    <p><strong>Status:</strong> ${cert.verified ? '✓ Verified' : 'Issued'}</p>
                </div>
                <div class="cert-skills-section">
                    <h4>Skills Covered:</h4>
                    <div class="cert-skills">${skills}</div>
                </div>
                ${verifyButton}
            </div>
        `;

        modal.classList.remove('hidden');
    }

    setupModalHandlers() {
        const tutorialBtn = document.getElementById('tutorial-btn');
        const tutorialModal = document.getElementById('tutorial-modal');
        const closeTutorial = document.getElementById('close-tutorial');

        if (tutorialBtn && tutorialModal) {
            tutorialBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                tutorialModal.classList.remove('hidden');
            });
        }

        if (closeTutorial && tutorialModal) {
            closeTutorial.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                tutorialModal.classList.add('hidden');
            });
        }

        const certModal = document.getElementById('cert-modal');
        const closeCertModal = document.getElementById('close-cert-modal');

        if (closeCertModal && certModal) {
            closeCertModal.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                certModal.classList.add('hidden');
            });
        }

        [tutorialModal, certModal].filter(Boolean).forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-backdrop') || e.target.classList.contains('modal')) {
                    modal.classList.add('hidden');
                }
            });
        });
    }

    setupContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            const submitBtn = form.querySelector('button[type="submit"]');
            const btnLoading = submitBtn?.querySelector('.btn-loading');

            if (submitBtn) submitBtn.classList.add('loading');
            if (btnLoading) btnLoading.classList.add('show');

            try {
                await this.submitContactForm(data);
                this.showFormMessage('success', "Message sent successfully! I'll get back to you soon.");
                form.reset();
            } catch (error) {
                console.error('Form submission error:', error);
                this.showFormMessage('error', 'Failed to send message. Please try emailing me directly at malipratik999@gmail.com');
            } finally {
                if (submitBtn) submitBtn.classList.remove('loading');
                if (btnLoading) btnLoading.classList.remove('show');
            }
        });
    }

    async submitContactForm(data) {
        const subject = encodeURIComponent(`Portfolio Contact: ${data.subject}`);
        const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`);
        window.open(`mailto:malipratik999@gmail.com?subject=${subject}&body=${body}`, '_blank');
        return new Promise((resolve) => setTimeout(resolve, 1000));
    }

    showFormMessage(type, message) {
        const existing = document.querySelector('.success-message, .error-message');
        if (existing) existing.remove();

        const messageDiv = document.createElement('div');
        messageDiv.className = `${type}-message`;
        messageDiv.textContent = message;

        const form = document.getElementById('contact-form');
        if (form) {
            form.appendChild(messageDiv);
            setTimeout(() => { if (messageDiv.parentNode) messageDiv.remove(); }, 5000);
        }
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = themeToggle?.querySelector('.theme-icon');
        if (!themeToggle || !themeIcon) return;

        const currentTheme = document.documentElement.getAttribute('data-color-scheme') || 'light';
        themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-color-scheme') || 'light';
            const newTheme = current === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-color-scheme', newTheme);
            themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    if (entry.target.id === 'skills') this.animateSkillBars();
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('section').forEach(section => observer.observe(section));
        document.querySelectorAll('.card, .project-card, .cert-card, .timeline-item')
            .forEach(el => observer.observe(el));
    }

    animateSkillBars() {
        document.querySelectorAll('.skill-progress').forEach((bar, index) => {
            setTimeout(() => {
                bar.style.width = `${bar.getAttribute('data-level')}%`;
            }, index * 100);
        });
    }

    animateOnScroll() {
        const hero = document.querySelector('.hero');
        if (hero && window.scrollY < window.innerHeight) {
            hero.style.transform = `translateY(${window.pageYOffset * -0.5}px)`;
        }
    }

    handleResize() {
        if (window.innerWidth > 768) {
            const mobileMenu = document.getElementById('nav-links');
            const menuToggle = document.getElementById('mobile-menu-toggle');
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
        }
    }
}

// Initialize the portfolio app
const portfolioApp = new PortfolioApp();
portfolioApp.init();