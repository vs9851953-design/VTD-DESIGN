/**
 * Main
 * Comportamentos globais da página inicial: monta a navegação do header,
 * destaca a seção ativa durante o scroll e mantém o ano do rodapé atualizado.
 */
(function () {
  function renderHeaderNav() {
    const nav = document.getElementById('headerNav');
    if (!nav) return;

    const links = [
      { href: '#trabalhos', label: 'Trabalhos' },
      { href: '#contato', label: 'Contato' }
    ];

    nav.innerHTML = links
      .map(l => `<a href="${l.href}" data-section="${l.href.replace('#', '')}">${l.label}</a>`)
      .join('');
  }

  function setupActiveSectionHighlight() {
    const nav = document.getElementById('headerNav');
    if (!nav) return;

    const sections = ['trabalhos', 'contato']
      .map(id => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0 || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          nav.querySelectorAll('a').forEach(a => {
            a.classList.toggle('active', a.dataset.section === id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });

    sections.forEach(section => observer.observe(section));
  }

  function updateFooterYear() {
    const el = document.getElementById('copyYear');
    if (el) el.textContent = new Date().getFullYear();
  }

  function init() {
    renderHeaderNav();
    setupActiveSectionHighlight();
    updateFooterYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
