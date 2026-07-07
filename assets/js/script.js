// ===================================
// TATIANE LEÃO - SITE
// Script Principal
// ===================================

// Esperar o DOM estar pronto
document.addEventListener('DOMContentLoaded', function () {
    initializeMenuToggle();
    initializeThemeToggle();
    initializeScrollToTop();
    initializeFormSubmission();
    initializeContactModal();
    initializeSmoothScroll();
});

// ===================================
// Menu Mobile Toggle
// ===================================
function initializeMenuToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });

        // Fechar menu ao clicar em um link
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', function (event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    }
}

// ===================================
// Theme Toggle (Modo Escuro/Claro)
// ===================================
function initializeThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Verificar tema salvo
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(themeToggle, savedTheme);

    // Detecção automática de preferência do sistema
    /*
    if (savedTheme === 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.setAttribute('data-theme', 'dark');
        updateThemeIcon(themeToggle, 'dark');
        localStorage.setItem('theme', 'dark');
    }
    */
    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(themeToggle, newTheme);
        });
    }
}

function updateThemeIcon(button, theme) {
    if (!button) return;
    const icon = button.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// ===================================
// Scroll to Top Button
// ===================================
function initializeScrollToTop() {
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        });

        scrollToTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===================================
// Smooth Scroll para Links de Navegação
// ===================================
function initializeSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Verificar se é um âncora
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const headerHeight = document.querySelector('.header-fixed').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Atualizar link ativo
                    updateActiveLink(href);
                }
            }
        });
    });

    // Atualizar link ativo ao scrollar
    window.addEventListener('scroll', function () {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (pageYOffset >= sectionTop) {
                current = '#' + section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === current) {
                link.classList.add('active');
            }
        });
    });
}

function updateActiveLink(href) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === href) {
            link.classList.add('active');
        }
    });
}

// ===================================
// Formulário de Contato
// ===================================
function initializeFormSubmission() {
    const contactForm = document.getElementById('contact-form');
    const telefoneInput = document.getElementById('telefone');

    if (telefoneInput) {
        telefoneInput.addEventListener('input', function () {
            telefoneInput.value = formatPhoneNumber(telefoneInput.value);
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const nome = document.getElementById('nome').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefone = document.getElementById('telefone').value.trim();
            const assunto = document.getElementById('assunto').value.trim();
            const mensagem = document.getElementById('mensagem').value.trim();

            // Validação básica
            if (!nome || !email || !assunto || !mensagem) {
                showContactModal('error', 'Campos obrigatorios', 'Por favor, preencha todos os campos obrigatorios.');
                return;
            }

            if (!isValidEmail(email)) {
                showContactModal('error', 'Email invalido', 'Informe um email valido para contato.');
                return;
            }

            if (telefone && telefone.replace(/\D/g, '').length !== 11) {
                showContactModal('error', 'Telefone invalido', 'Informe o telefone no formato (xx) x xxxx-xxxx.');
                return;
            }

            // Enviar dados para contato.php
            // O retorno sera exibido no pop-up
            // Evitar duplo envio

            const submitButton = contactForm.querySelector('.submit-button');
            const originalButtonText = submitButton ? submitButton.textContent : '';
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Enviando...';
            }

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });
                const result = await response.json();

                if (result.success) {
                    showContactModal('success', 'Mensagem enviada', result.message);
                    contactForm.reset();
                } else {
                    showContactModal('error', 'Erro no envio', result.message);
                }
            } catch (error) {
                showContactModal('error', 'Erro no envio', 'Nao foi possivel enviar a mensagem. Tente novamente em instantes.');
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }
            }
        });
        showContactStatusMessage();
    }
}

function formatPhoneNumber(value) {
    const digits = value.replace(/\D/g, '').slice(0, 11);

    if (digits.length <= 2) {
        return digits.length ? `(${digits}` : '';
    }

    if (digits.length <= 3) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }

    if (digits.length <= 7) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3)}`;
    }

    return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function showContactStatusMessage() {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('contato');

    if (!status) {
        return;
    }

    const messages = {
        enviado: {
            type: 'success',
            text: 'Mensagem enviada com sucesso! Em breve entraremos em contato.'
        },
        limite: {
            type: 'error',
            text: 'Mensagem ja enviada recentemente. Aguarde antes de tentar novamente.'
        },
        metodo: {
            type: 'error',
            text: 'Nao foi possivel enviar a mensagem por este metodo.'
        },
        erro: {
            type: 'error',
            text: 'Nao foi possivel enviar a mensagem. Confira os dados e tente novamente.'
        }
    };

    const message = messages[status] || messages.erro;
    showContactModal(message.type, message.type === 'success' ? 'Mensagem enviada' : 'Erro no envio', message.text);
}

function showContactModal(type, title, message) {
    const modal = document.getElementById('contact-modal');
    const modalTitle = document.getElementById('contact-modal-title');
    const modalMessage = document.getElementById('contact-modal-message');
    const modalIcon = document.getElementById('contact-modal-icon');

    if (!modal || !modalTitle || !modalMessage || !modalIcon) {
        return;
    }

    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalIcon.classList.toggle('error', type !== 'success');
    modalIcon.innerHTML = type === 'success' ? '<i class="fas fa-check"></i>' : '<i class="fas fa-exclamation"></i>';
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');

    const closeButton = modal.querySelector('.contact-modal__close');
    if (closeButton) {
        closeButton.focus();
    }
}

function closeContactModal() {
    const modal = document.getElementById('contact-modal');

    if (!modal) {
        return;
    }

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
}

function initializeContactModal() {
    document.querySelectorAll('[data-contact-modal-close]').forEach(element => {
        element.addEventListener('click', closeContactModal);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            closeContactModal();
        }
    });
}

function showSuccessMessage() {
    const form = document.getElementById('contact-form');
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = '✓ Mensagem preparada! Seu cliente de email será aberto.';
    successDiv.style.cssText = `
        background-color: #4CAF50;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        text-align: center;
        font-weight: 600;
        animation: fadeInUp 0.3s ease;
    `;

    form.insertBefore(successDiv, form.firstChild);

    // Remover mensagem após 5 segundos
    setTimeout(() => {
        successDiv.style.animation = 'fadeOutDown 0.3s ease';
        setTimeout(() => successDiv.remove(), 300);
    }, 5000);
}

// ===================================
// Intersection Observer para Animações
// ===================================
function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

// Chamar ao carregar
window.addEventListener('load', initializeIntersectionObserver);

// ===================================
// Utilitários
// ===================================

// Função para enviar mensagem pelo WhatsApp
function sendWhatsApp() {
    const nome = document.getElementById('nome').value;
    const mensagem = document.getElementById('mensagem').value;
    const text = `Olá! Meu nome é ${nome}. ${mensagem}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/5517985853652?text=${encodedText}`);
}

// Log de carregamento
console.log('✓ Site Tatiane Leão carregado com sucesso!');
console.log('✓ Modo acessível ativado.');
