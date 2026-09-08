const root=document.getElementById('projectRoot');
const q=new URLSearchParams(location.search);
const safe=v=>String(v??'').replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]));
const uniq=a=>[...new Set(a.filter(Boolean))];
const VIDEO_EXT=/\.(mp4|webm|ogg|mov)(?:$|[?#])/i;
const isVideo=src=>VIDEO_EXT.test(String(src||''));
function img(src,alt,cls=''){return `<img class="${cls}" src="${safe(src||'assets/placeholder.jpg')}" alt="${safe(alt)}" onerror="this.onerror=null;this.src='assets/placeholder.jpg'">`}
function video(src,title,cls='',poster=''){return `<video class="${cls}" src="${safe(src)}" ${poster?`poster="${safe(poster)}"`:''} controls autoplay muted loop playsinline preload="metadata">Seu navegador não suporta vídeo.</video>`}
function projectMedia(p){
  const gallery=Array.isArray(p.gallery)?p.gallery:[];
  const images=uniq(gallery.filter(src=>!isVideo(src)&&src!==p.thumb&&src!==p.cover));
  const videos=uniq([...gallery,...(Array.isArray(p.videos)?p.videos:[]),...(p.video?[p.video]:[])].filter(isVideo));
  return {images,videos};
}
function relatedMedia(p){const m=projectMedia(p);return p.thumb||m.images[0]||p.cover||'assets/placeholder.jpg'}
async function init(){try{const r=await fetch('portfolio.json');if(!r.ok)throw new Error('portfolio.json');const projects=await r.json();const project=projects.find(p=>p.id===q.get('id'))||projects[0];if(!project)throw new Error('Projeto não encontrado');document.title=`${project.titulo} — NOWHERE STUDIO`;render(project,projects);bindHeroParallax()}catch(e){console.error(e);root.innerHTML='<div class="loading">Não foi possível carregar este projeto.</div>'}}
function render(p,projects){
 const media=projectMedia(p),images=media.images,videos=media.videos;
 const related=projects.filter(x=>x.id!==p.id&&x.categoria===p.categoria),fallbackRelated=related.length?related:projects.filter(x=>x.id!==p.id).slice(0,8);
 const heroSrc=p.cover||p.thumb||images[0]||'assets/placeholder.jpg';
 const conceptImage=p.concept||p.conceptImage||'assets/concept-visual.svg';
 root.innerHTML=`
<section class="project-hero" id="projectHero"><div class="project-hero-bg" id="projectHeroBg">${img(heroSrc,'')}</div><div class="project-hero-overlay"></div><div class="project-hero-content"><div class="project-kicker">${safe(p.categoria||'Projeto')}</div><h1 class="project-title">${safe(p.titulo)}</h1></div></section>
<section class="project-details"><div class="project-meta"><div><span class="meta-label">Cliente</span><span class="meta-value">${safe(p.cliente||'—')}</span></div><div><span class="meta-label">Categoria</span><span class="meta-value">${safe(p.categoria||'—')}</span></div><div><span class="meta-label">Ano</span><span class="meta-value">${safe(p.ano||'—')}</span></div><div><p class="project-description">${safe(p.descricao||'')}</p></div></div></section>
<section class="project-showcase"><div class="showcase-head"><span class="mini">${videos.length?'Projeto em movimento':'Projeto em destaque'}</span><h2>${videos.length?'Visualização do projeto':'Galeria do projeto'}</h2></div>
${videos.length?`<div class="video-showcase">${videos.map(src=>`<div class="video-main">${video(src,p.titulo,'',p.thumb||p.cover||'')}</div>`).join('')}</div>`:''}
${images.length?`<div class="showcase" id="showcase"><div class="showcase-main" id="showcaseMain"></div><div class="showcase-stack" id="showcaseStack"></div></div><p class="showcase-caption">Visualização automática <span>·</span> ${images.length} imagem${images.length!==1?'ns':''}</p>`:''}
${!videos.length&&!images.length?`<div class="showcase-none">Este projeto ainda não possui mídia cadastrada.</div>`:''}
</section>
<section class="concept"><div class="concept-inner"><div class="concept-media">${img(conceptImage,p.titulo)}</div><div class="concept-copy"><h2>Conceito</h2><p>${safe(p.conceito||p.conceptText||p.descricao||'')}</p>${p.feedback?`<div class="feedback">“${safe(p.feedback)}”<br><strong>${safe(p.feedbackAutor||'')}</strong>${p.feedbackCargo?` · ${safe(p.feedbackCargo)}`:''}</div>`:''}</div></div></section>
<section class="related"><div class="related-head"><span class="mini">${safe(p.categoria||'Projetos')}</span><h2>Outros projetos</h2></div><div class="related-rail" id="relatedRail">${fallbackRelated.map(x=>`<a class="related-card" href="project.html?id=${encodeURIComponent(x.id)}">${img(relatedMedia(x),x.titulo)}<span>${safe(x.titulo)}</span></a>`).join('')}</div></section>`;
 if(images.length)setupShowcase(images,p.titulo);setupRelatedRail();
}
function setupShowcase(images,title){const main=document.getElementById('showcaseMain'),stack=document.getElementById('showcaseStack');if(!main||!stack)return;let index=0;const draw=()=>{main.classList.add('changing');setTimeout(()=>{main.innerHTML=img(images[index],title);main.classList.remove('changing')},140);stack.innerHTML='';const sideCount=Math.min(3,Math.max(0,images.length-1));for(let i=1;i<=sideCount;i++){const src=images[(index+i)%images.length];stack.innerHTML+=`<div class="showcase-thumb incoming">${img(src,`${title} — visualização`)}</div>`}if(images.length===1)stack.classList.add('is-empty');else stack.classList.remove('is-empty')};draw();if(images.length>1)setInterval(()=>{index=(index+1)%images.length;draw()},4200)}
function setupRelatedRail(){const rail=document.getElementById('relatedRail');if(!rail||rail.children.length<2)return;const items=[...rail.children];items.forEach(item=>rail.appendChild(item.cloneNode(true)));let paused=false,last=0;const tick=t=>{if(!last)last=t;const delta=Math.min(40,t-last);last=t;if(!paused&&rail.scrollWidth>rail.clientWidth){rail.scrollLeft+=delta*.03;if(rail.scrollLeft>=rail.scrollWidth/2-2)rail.scrollLeft=0}requestAnimationFrame(tick)};rail.addEventListener('mouseenter',()=>paused=true);rail.addEventListener('mouseleave',()=>paused=false);requestAnimationFrame(tick)}
function bindHeroParallax(){const hero=document.getElementById('projectHero'),bg=document.getElementById('projectHeroBg');if(!hero||!bg)return;hero.addEventListener('mousemove',e=>{const r=hero.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;bg.style.transform=`scale(1.05) translate(${x*-12}px,${y*-9}px)`});hero.addEventListener('mouseleave',()=>bg.style.transform='scale(1.05)')}
document.getElementById('year').textContent=new Date().getFullYear();init();
