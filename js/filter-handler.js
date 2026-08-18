/**
 * Filter Handler
 * Sincroniza o filtro de categoria ativo com a query string da URL
 * (?cat=Motion+2D), permitindo links diretos e compartilháveis para
 * uma categoria específica do portfólio.
 *
 * Depende de js/portfolio-loader.js (deve ser carregado antes deste script).
 */
(function () {
  // 1. Lê a categoria da URL, se existir, e disponibiliza para o loader
  //    ANTES da primeira renderização (ver portfolio-loader.js -> initialize()).
  const params = new URLSearchParams(window.location.search);
  const initialCategory = params.get('cat');
  if (initialCategory) {
    window.PORTFOLIO_INITIAL_FILTER = initialCategory;
  }

  // 2. Sempre que o filtro mudar (clique do usuário), atualiza a URL
  //    sem recarregar a página.
  document.addEventListener('portfolio:filtered', (e) => {
    const category = e.detail.filter;
    const url = new URL(window.location.href);

    if (category === 'all') {
      url.searchParams.delete('cat');
    } else {
      url.searchParams.set('cat', category);
    }

    window.history.replaceState({}, '', url);
  });
})();
