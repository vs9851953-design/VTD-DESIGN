/**
 * Effects
 * Versão em JavaScript puro (sem React/GSAP/Motion/Lenis) de três efeitos:
 *
 * 1. Parallax scrolling — camadas de imagem se movendo em velocidades
 *    diferentes conforme a seção passa pela tela.
 * 2. Magic Text — texto revelando palavra por palavra conforme o scroll
 *    avança sobre o bloco.
 * 3. Testimonials — cards de depoimento montados a partir dos dados que
 *    já existem no portfolio.json (campos feedback/feedbackAutor/feedbackCargo),
 *    sem precisar cadastrar nada de novo.
 */
(function () {

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  // ===== 1. PARALLAX =====
  function initParallax() {
    const section = document.querySelector('.parallax-section');
    if (!section) return;

    const layers = section.querySelectorAll('[data-parallax-speed]');
    if (layers.length === 0) return;

    let ticking = false;

    function update() {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      // progress vai de 0 (seção entrando por baixo) a 1 (seção saindo por cima)
      const progress = clamp((vh - rect.top) / total, 0, 1);

      layers.forEach((layer) => {
        const speed = parseFloat(layer.dataset.parallaxSpeed) || 0;
        const offset = (progress - 0.5) * speed;
        layer.style.transform = layer.classList.contains('parallax-layer--title')
          ? `translate(-50%, calc(-50% + ${offset}px))`
          : `translateY(${offset}px)`;
      });

      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  // ===== 2. MAGIC TEXT =====
  function splitIntoWords(el) {
    const text = el.textContent.trim();
    el.textContent = '';
    text.split(/\s+/).forEach((word) => {
      const wrap = document.createElement('span');
      wrap.className = 'magic-word';

      const ghost = document.createElement('span');
      ghost.className = 'magic-word-ghost';
      ghost.textContent = word;

      const fill = document.createElement('span');
      fill.className = 'magic-word-fill';
      fill.textContent = word;

      wrap.appendChild(ghost);
      wrap.appendChild(fill);
      el.appendChild(wrap);
      el.appendChild(document.createTextNode(' '));
    });
  }

  function initMagicText() {
    const containers = document.querySelectorAll('[data-magic-text]');
    if (containers.length === 0) return;

    containers.forEach(splitIntoWords);

    let ticking = false;

    function update() {
      containers.forEach((container) => {
        const rect = container.getBoundingClientRect();
        const vh = window.innerHeight;
        // Equivalente ao offset ["start 0.9", "start 0.25"] do componente original:
        // começa a revelar quando o topo do bloco chega a 90% da viewport,
        // termina quando chega a 25%.
        const startPoint = vh * 0.9;
        const endPoint = vh * 0.25;
        const progress = clamp((startPoint - rect.top) / (startPoint - endPoint), 0, 1);

        const words = container.querySelectorAll('.magic-word-fill');
        words.forEach((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          const local = clamp((progress - start) / (end - start), 0, 1);
          word.style.opacity = local;
        });
      });
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
  }

  // ===== 3. TESTIMONIALS =====
  function getInitials(name) {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join('');
  }

  function quoteIconSVG() {
    return `
      <svg class="testimonial-quote-icon" width="28" height="22" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 22V13.75C0 9.58 1.17 6.25 3.5 3.75C5.83 1.25 8.83 0 12.5 0V4.5C10.33 4.5 8.58 5.25 7.25 6.75C5.92 8.25 5.25 10.08 5.25 12.25H12.5V22H0ZM15.5 22V13.75C15.5 9.58 16.67 6.25 19 3.75C21.33 1.25 24.33 0 28 0V4.5C25.83 4.5 24.08 5.25 22.75 6.75C21.42 8.25 20.75 10.08 20.75 12.25H28V22H15.5Z" fill="currentColor"/>
      </svg>
    `;
  }

  function createTestimonialCard(project) {
    const card = document.createElement('article');
    card.className = 'testimonial-card';
    card.innerHTML = `
      ${quoteIconSVG()}
      <p class="testimonial-text">"${project.feedback}"</p>
      <div class="testimonial-footer">
        <div class="testimonial-avatar">${getInitials(project.feedbackAutor || '?')}</div>
        <div class="testimonial-author">
          <strong>${project.feedbackAutor}</strong>
          <span>${project.feedbackCargo}</span>
        </div>
      </div>
    `;
    return card;
  }

  function renderTestimonials(projects) {
    const grid = document.getElementById('testimonialsGrid');
    if (!grid) return;

    const withFeedback = projects.filter((p) => p.feedback && p.feedbackAutor);

    if (withFeedback.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1;">
          <h3 class="empty-state-title">Nenhum depoimento cadastrado</h3>
          <p class="empty-state-text">Adicione "feedback" e "feedbackAutor" aos projetos no portfolio.json</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = '';
    withFeedback.forEach((project) => {
      grid.appendChild(createTestimonialCard(project));
    });
  }

  function initTestimonials() {
    if (!document.getElementById('testimonialsGrid')) return;

    // Os projetos já foram (ou serão) carregados por js/portfolio-loader.js.
    // Reaproveitamos os mesmos dados em vez de fazer um novo fetch.
    if (window.portfolioLoader && window.portfolioLoader.projects && window.portfolioLoader.projects.length > 0) {
      renderTestimonials(window.portfolioLoader.projects);
    } else {
      document.addEventListener('portfolio:rendered', () => {
        if (window.portfolioLoader) {
          renderTestimonials(window.portfolioLoader.projects);
        }
      }, { once: true });
    }
  }

  function init() {
    initParallax();
    initMagicText();
    initTestimonials();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
