(function(){
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function clamp(v,min,max){return Math.min(Math.max(v,min),max)}

  function initHeroParallax(){
    const hero=document.querySelector('.hero');
    if(!hero || reduceMotion) return;
    const orb=hero.querySelector('.hero-orb');
    const grid=hero.querySelector('.hero-grid');
    let mx=0,my=0,tx=0,ty=0,raf=0;
    function frame(){
      tx+=(mx-tx)*.08; ty+=(my-ty)*.08;
      if(orb) orb.style.transform=`translate3d(${tx*28}px,${ty*28}px,0)`;
      if(grid) grid.style.transform=`translate3d(${tx*-10}px,${ty*-10}px,0)`;
      raf=0;
    }
    hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();mx=(e.clientX-r.left-r.width/2)/(r.width/2);my=(e.clientY-r.top-r.height/2)/(r.height/2);if(!raf)raf=requestAnimationFrame(frame)},{passive:true});
    hero.addEventListener('pointerleave',()=>{mx=0;my=0;if(!raf)raf=requestAnimationFrame(frame)},{passive:true});
  }

  function initMagicText(){
    document.querySelectorAll('[data-magic-text]').forEach(el=>{
      if(el.dataset.ready) return; el.dataset.ready='1';
      const text=el.textContent.trim(); el.textContent='';
      text.split(/\s+/).forEach((word,i)=>{
        const wrap=document.createElement('span');wrap.className='magic-word';
        const ghost=document.createElement('span');ghost.className='magic-word-ghost';ghost.textContent=word;
        const fill=document.createElement('span');fill.className='magic-word-fill';fill.textContent=word;
        wrap.append(ghost,fill);el.appendChild(wrap);el.appendChild(document.createTextNode(' '));
      });
      const words=[...el.querySelectorAll('.magic-word-fill')];
      function update(){const r=el.getBoundingClientRect(),vh=innerHeight;const p=clamp((vh*.9-r.top)/(vh*.9-vh*.22),0,1);words.forEach((w,i)=>{const local=clamp((p-i/words.length)/(1/words.length),0,1);w.style.opacity=local})}
      if(reduceMotion){words.forEach(w=>w.style.opacity=1);return}
      const io=new IntersectionObserver(()=>requestAnimationFrame(update),{threshold:[0,.1,.25,.5,.75,1]});io.observe(el);addEventListener('scroll',update,{passive:true});addEventListener('resize',update);update();
    });
  }

  function revealObserver(){
    const els=document.querySelectorAll('.gallery-item,.testimonial-card,.project-gallery-item,[data-reveal]');
    if(reduceMotion){els.forEach(e=>e.classList.add('is-visible'));return}
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    els.forEach(e=>io.observe(e));
  }

  function initProjectHero(){
    const hero=document.querySelector('.project-hero');const img=hero?.querySelector('.project-hero-media img');
    if(!hero||!img||reduceMotion)return;
    let ticking=false;
    function update(){const r=hero.getBoundingClientRect();const p=clamp(-r.top/Math.max(hero.offsetHeight,1),0,1);img.style.transform=`translate3d(0,${p*70}px,0) scale(1.06)`;ticking=false}
    addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true}},{passive:true});update();
  }


  function initProjectParallax(){
    const sections=document.querySelectorAll('[data-project-parallax]');
    if(!sections.length||reduceMotion)return;
    sections.forEach(section=>{
      if(section.dataset.parallaxReady)return; section.dataset.parallaxReady='1';
      const layers=[...section.querySelectorAll('[data-parallax-speed]')]; let ticking=false;
      function update(){
        const r=section.getBoundingClientRect(),vh=innerHeight;
        const progress=clamp(((vh/2)-(r.top+r.height/2))/(vh/2+r.height/2),-1,1);
        layers.forEach(layer=>{const speed=parseFloat(layer.dataset.parallaxSpeed)||.3;layer.style.transform=`translate3d(0,${progress*speed*120}px,0) scale(1.08)`});
        ticking=false;
      }
      const request=()=>{if(!ticking){requestAnimationFrame(update);ticking=true}};
      addEventListener('scroll',request,{passive:true}); addEventListener('resize',request); update();
    });
  }

  function initGalleryTilt(){
    const items=document.querySelectorAll('.p-gallery-item');
    if(!items.length||reduceMotion)return;
    items.forEach(item=>{
      if(item.dataset.tiltReady)return; item.dataset.tiltReady='1';
      item.addEventListener('pointermove',e=>{const r=item.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;item.style.transform=`perspective(900px) rotateX(${y*-3}deg) rotateY(${x*3}deg) scale(1.025)`});
      item.addEventListener('pointerleave',()=>item.style.transform='');
    });
  }

  function initProjectMedia(){initProjectParallax();initGalleryTilt();revealObserver()}
  document.addEventListener('portfolio:project-rendered',initProjectMedia);

  function init(){initHeroParallax();initMagicText();revealObserver();initProjectHero();initProjectMedia();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.portfolioAnimations={reveal:revealObserver,projectHero:initProjectHero,projectParallax:initProjectParallax,galleryTilt:initGalleryTilt};
})();
