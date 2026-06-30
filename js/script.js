/* ===========================================================
   DFCA CONSTRUÇÃO E ACABAMENTOS — SCRIPT PRINCIPAL
=========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------------
     1. PRÉ-LOADER
  ------------------------------------------------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 350);
  });
  // Salvaguarda: esconder o preloader mesmo que 'load' demore
  setTimeout(() => preloader && preloader.classList.add('hidden'), 2500);

  /* -------------------------------------------------
     2. HEADER: efeito ao rolar (blur + encolher)
  ------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  const onScrollHeader = () => {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* -------------------------------------------------
     3. MENU MOBILE (HAMBURGER)
  ------------------------------------------------- */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');

  function openMobileNav(){
    mobileNav.classList.add('open');
    mobileNavBackdrop.classList.add('open');
    hamburgerBtn.classList.add('open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileNav(){
    mobileNav.classList.remove('open');
    mobileNavBackdrop.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  hamburgerBtn.addEventListener('click', () => {
    mobileNav.classList.contains('open') ? closeMobileNav() : openMobileNav();
  });
  mobileNavBackdrop.addEventListener('click', closeMobileNav);
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });
  // Fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileNav();
  });

  /* -------------------------------------------------
     3.5 CARROSSEL DE FUNDO DO HERO (autoplay + dots)
  ------------------------------------------------- */
  const heroCarousel = document.getElementById('heroCarousel');
  if (heroCarousel){
    const slides = Array.from(heroCarousel.querySelectorAll('.hero-slide'));
    const dots = Array.from(document.querySelectorAll('#heroDots .hero-dot'));
    const SLIDE_DURATION = 6000; // ms que cada imagem fica visível
    let current = slides.findIndex(s => s.classList.contains('active'));
    if (current < 0) current = 0;
    let autoplayTimer = null;

    function goToSlide(index){
      if (index === current) return;
      slides[current].classList.remove('active');
      dots[current]?.classList.remove('active');
      dots[current]?.setAttribute('aria-selected', 'false');

      current = (index + slides.length) % slides.length;

      slides[current].classList.add('active');
      dots[current]?.classList.add('active');
      dots[current]?.setAttribute('aria-selected', 'true');
    }

    function nextSlide(){ goToSlide(current + 1); }

    function startAutoplay(){
      stopAutoplay();
      autoplayTimer = setInterval(nextSlide, SLIDE_DURATION);
    }
    function stopAutoplay(){
      if (autoplayTimer) clearInterval(autoplayTimer);
    }

    // Clique nos indicadores
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        goToSlide(i);
        startAutoplay(); // reinicia a contagem ao trocar manualmente
      });
    });

    // Pausa o carrossel quando a aba não está visível (poupa recursos)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAutoplay();
      else startAutoplay();
    });

    // Pausa suavemente ao passar o rato sobre o hero (controlo do utilizador)
    const heroSection = heroCarousel.closest('.hero');
    if (heroSection){
      heroSection.addEventListener('mouseenter', stopAutoplay);
      heroSection.addEventListener('mouseleave', startAutoplay);
    }

    startAutoplay();
  }

  /* -------------------------------------------------
     4. NAVEGAÇÃO ACTIVA CONFORME SECÇÃO VISÍVEL
  ------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id], main[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(sec => sectionObserver.observe(sec));

  /* -------------------------------------------------
     5. REVEAL ON SCROLL (animação ao aparecer)
  ------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting){
        setTimeout(() => entry.target.classList.add('in-view'), i * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* -------------------------------------------------
     6. CONTADOR ANIMADO (estatísticas do hero)
  ------------------------------------------------- */
  const statNums = document.querySelectorAll('.stat-num');
  function animateCount(el){
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const startTime = performance.now();
    function tick(now){
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        statNums.forEach(animateCount);
        statsObserver.disconnect();
      }
    });
  }, { threshold: 0.4 });
  if (statNums.length) statsObserver.observe(statNums[0].closest('.hero-stats'));

  /* -------------------------------------------------
     7. ANEL DE PROGRESSO (secção Diferencial)
  ------------------------------------------------- */
  const ringFg = document.querySelector('.ring-fg');
  if (ringFg){
    const ringObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          ringFg.classList.add('animated');
          ringObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });
    ringObserver.observe(ringFg);
  }

  /* -------------------------------------------------
     8. BOTÃO VOLTAR AO TOPO
  ------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* -------------------------------------------------
     9. FORMULÁRIO DE CONTACTO -> ENVIO VIA WHATSAPP
  ------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const WHATSAPP_NUMBER = '244943566999';

  if (contactForm){
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const email = document.getElementById('email').value.trim();
      const service = document.getElementById('service');
      const serviceLabel = service.options[service.selectedIndex]?.text || '';
      const message = document.getElementById('message').value.trim();

      if (!name || !phone || !message){
        formNote.textContent = 'Por favor, preencha os campos obrigatórios.';
        formNote.style.color = '#c0392b';
        return;
      }

      const lines = [
        `Olá, meu nome é ${name}.`,
        `Telefone: ${phone}`,
        email ? `E-mail: ${email}` : null,
        service.value ? `Serviço de interesse: ${serviceLabel}` : null,
        `Mensagem: ${message}`
      ].filter(Boolean);

      const text = encodeURIComponent(lines.join('\n'));
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;

      formNote.textContent = 'A abrir o WhatsApp para enviar a sua mensagem...';
      formNote.style.color = '#0b1f3a';

      window.open(url, '_blank', 'noopener');
      contactForm.reset();
    });
  }

  /* -------------------------------------------------
     10. ANO ACTUAL NO FOOTER
  ------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------------------------------------
     11. SCROLL SUAVE COM OFFSET (compensar header fixo)
  ------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;
      e.preventDefault();
      const offset = 84;
      const top = targetEl.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});