/**
 * Portfolio Loader
 * Carrega projetos do portfolio.json e renderiza na página
 */

class PortfolioLoader {
  constructor() {
    this.projects = [];
    this.filteredProjects = [];
    this.currentFilter = 'all';
    this.categories = [];
  }

  async loadProjects() {
    try {
      const response = await fetch('portfolio.json');
      if (!response.ok) throw new Error('Falha ao carregar portfolio.json');
      
      this.projects = await response.json();
      this.extractCategories();
      this.filteredProjects = [...this.projects];
      
      return this.projects;
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      this.handleError();
      return [];
    }
  }

  extractCategories() {
    this.categories = [...new Set(this.projects.map(p => p.categoria))].sort();
  }

  filterByCategory(category) {
    this.currentFilter = category;
    
    if (category === 'all') {
      this.filteredProjects = [...this.projects];
    } else {
      this.filteredProjects = this.projects.filter(p => p.categoria === category);
    }
  }

  renderFilterButtons() {
    const filterGroup = document.getElementById('filterGroup');
    if (!filterGroup) return;

    filterGroup.innerHTML = '';
    
    // Botão "Todos"
    const allBtn = document.createElement('button');
    allBtn.className = `filter-btn ${this.currentFilter === 'all' ? 'active' : ''}`;
    allBtn.textContent = 'Todos';
    allBtn.dataset.category = 'all';
    filterGroup.appendChild(allBtn);

    // Botões de categoria
    this.categories.forEach(category => {
      const btn = document.createElement('button');
      btn.className = `filter-btn ${this.currentFilter === category ? 'active' : ''}`;
      btn.textContent = category;
      btn.dataset.category = category;
      filterGroup.appendChild(btn);
    });

    // Event listeners
    filterGroup.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.handleFilterClick(e.target);
      });
    });
  }

  handleFilterClick(button) {
    // Remover classe active de todos
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    
    // Adicionar classe active ao clicado
    button.classList.add('active');
    
    // Filtrar projetos
    const category = button.dataset.category;
    this.filterByCategory(category);
    
    // Renderizar galeria
    this.renderGallery();
    
    // Scroll suave para galeria
    document.getElementById('trabalhos')?.scrollIntoView({ behavior: 'smooth' });
  }

  renderGallery() {
    const gallery = document.getElementById('galleryGrid');
    if (!gallery) return;

    if (this.filteredProjects.length === 0) {
      gallery.innerHTML = `
        <div class="empty-state">
          <h3 class="empty-state-title">Nenhum projeto encontrado</h3>
          <p class="empty-state-text">Tente outra categoria</p>
        </div>
      `;
      return;
    }

    gallery.innerHTML = this.filteredProjects
      .map(project => this.createGalleryItem(project))
      .join('');

    // Adicionar event listeners
    gallery.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const projectId = item.dataset.projectId;
        window.location.href = `project.html?id=${encodeURIComponent(projectId)}`;
      });
    });
  }

  createGalleryItem(project) {
    const thumb = project.thumb || project.cover;
    return `
      <article class="gallery-item" data-project-id="${project.id}">
        <img 
          src="${thumb}" 
          alt="${project.titulo}"
          class="gallery-item-image"
          loading="lazy"
          onerror="this.src='assets/placeholder.jpg'"
        >
        <div class="gallery-overlay">
          <h3>${project.titulo}</h3>
          <p>${project.categoria} • ${project.ano}</p>
        </div>
      </article>
    `;
  }

  handleError() {
    const gallery = document.getElementById('galleryGrid');
    if (!gallery) return;

    gallery.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <h3 class="empty-state-title">Erro ao carregar portfólio</h3>
        <p class="empty-state-text">
          Certifique-se de que portfolio.json está no diretório raiz e está sendo servido por um servidor local.
        </p>
      </div>
    `;
  }

  async initialize() {
    await this.loadProjects();
    this.renderFilterButtons();
    this.renderGallery();
  }
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const loader = new PortfolioLoader();
    loader.initialize();
  });
} else {
  const loader = new PortfolioLoader();
  loader.initialize();
}
