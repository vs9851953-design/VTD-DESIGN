(function(){
  const root=document.getElementById('projectApp');
  if(!root)return;
  const path=p=>p?(p.startsWith('/')?p:`/${p}`):'';
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const id=new URLSearchParams(location.search).get('id');
  async function load(){
    if(!id){root.innerHTML='<div class="empty-state"><h1 class="empty-state-title">Projeto não encontrado</h1></div>';return}
    try{
      const r=await fetch('/portfolio.json',{cache:'no-store'});if(!r.ok)throw new Error('portfolio.json');
      const projects=await r.json();const project=projects.find(p=>p.id===id);if(!project)throw new Error('Projeto não encontrado');
      const index=projects.findIndex(p=>p.id===id);const next=projects[(index+1)%projects.length];
      document.title=`${project.titulo} — NOWHERE STUDIO`;
      root.innerHTML=`
      <section class="project-hero">
        <div class="project-hero-media">${project.cover?`<img src="${path(project.cover)}" alt="" aria-hidden="true">`:''}</div>
        <div class="wrap project-hero-content">
          <div class="project-eyebrow">${esc(project.categoria)} · ${esc(project.ano)}</div>
          <h1 class="project-title"><span class="title-line"><span class="title-inner">${esc(project.titulo)}</span></span></h1>
          <div class="project-meta-row">
            <div class="project-meta"><span class="project-meta-label">Cliente</span><span class="project-meta-value">${esc(project.cliente||'—')}</span></div>
            <div class="project-meta"><span class="project-meta-label">Categoria</span><span class="project-meta-value">${esc(project.categoria||'—')}</span></div>
            <div class="project-meta"><span class="project-meta-label">Ano</span><span class="project-meta-value">${esc(project.ano||'—')}</span></div>
          </div>
        </div>
      </section>
      ${project.cover?`<section class="project-cover"><img src="${path(project.cover)}" alt="${esc(project.titulo)} — capa"></section>`:''}
      <section class="wrap project-info">
        <div><span class="project-label">Sobre o projeto</span><p class="project-description">${esc(project.descricao||'')}</p></div>
        <div>${project.feedback?`<span class="project-label">Depoimento</span><blockquote class="project-feedback">“${esc(project.feedback)}”</blockquote><p class="project-feedback-author"><strong>${esc(project.feedbackAutor||'')}</strong>${project.feedbackCargo?` · ${esc(project.feedbackCargo)}`:''}</p>`:''}</div>
      </section>
      ${Array.isArray(project.gallery)&&project.gallery.length?`<section class="project-gallery"><div class="wrap"><div class="gallery-heading"><h2>Galeria</h2><span>${project.gallery.length} imagens</span></div><div class="project-gallery-grid">${project.gallery.map((src,i)=>`<figure class="project-gallery-item"><img src="${path(src)}" alt="${esc(project.titulo)} — imagem ${i+1}" loading="lazy"></figure>`).join('')}</div></div></section>`:''}
      <section class="project-next"><div class="wrap"><a class="next-link" href="project.html?id=${encodeURIComponent(next.id)}"><div class="next-label">Próximo projeto</div><div class="next-title">${esc(next.titulo)} ↗</div></a></div></section>`;
      window.portfolioAnimations?.reveal(); window.portfolioAnimations?.projectHero();
    }catch(e){console.error(e);root.innerHTML='<div class="empty-state"><h1 class="empty-state-title">Projeto não encontrado</h1><p class="empty-state-text">Confira o ID do projeto no portfolio.json.</p></div>'}
  }
  load();
})();
