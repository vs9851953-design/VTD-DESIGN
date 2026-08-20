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

  /* ── NEW: PARALLAX 3 LAYERS ──────────────────────────────
     Reads data-parallax-speed from each layer div.
     background: slower (0.18), middle (0.10), foreground (0.05).
     On scroll, each layer translates on Y proportionally to its
     speed × section scroll progress, creating depth.
  ────────────────────────────────────────────────────────── */
  function initParallaxSections(){
    const sections=document.querySelectorAll('[data-parallax]');
    if(!sections.length) return;

    if(reduceMotion) return; // respect user preference

    let ticking=false;

    function updateAll(){
      sections.forEach(section=>{
        const r=section.getBoundingClientRect();
        const vh=window.innerHeight;

        // progress: -1 (above viewport) → 0 (centred) → 1 (below viewport)
        const progress=(vh/2 - (r.top + r.height/2)) / vh;

        section.querySelectorAll('.p-parallax-layer[data-parallax-speed]').forEach(layer=>{
          const speed=parseFloat(layer.dataset.parallaxSpeed)||0.1;
          const shift=progress * speed * 180; // px range
          layer.style.transform=`translate3d(0,${shift}px,0)`;
        });
      });
      ticking=false;
    }

    window.addEventListener('scroll',()=>{
      if(!ticking){ requestAnimationFrame(updateAll); ticking=true; }
    },{passive:true});

    window.addEventListener('resize',updateAll);
    updateAll();
  }

  /* ── NEW: TILT SUTIL NAS MINIATURAS ──────────────────────
     Pequena rotação 3D + scale leve no hover/pointermove.
     Max tilt: 4°. Scale: 1.03.
  ────────────────────────────────────────────────────────── */
  function initThumbTilt(){
    const thumbs=document.querySelectorAll('.p-gallery-thumb');
    if(!thumbs.length || reduceMotion) return;

    const MAX_DEG=4;
    const SCALE=1.03;

    thumbs.forEach(thumb=>{
      let raf=0;
      let targetX=0,targetY=0,curX=0,curY=0;

      function frame(){
        curX+=(targetX-curX)*.12;
        curY+=(targetY-curY)*.12;
        thumb.style.transform=`perspective(600px) rotateX(${curY}deg) rotateY(${curX}deg) scale(${SCALE})`;
        if(Math.abs(targetX-curX)>0.01 || Math.abs(targetY-curY)>0.01){
          raf=requestAnimationFrame(frame);
        } else {
          raf=0;
        }
      }

      thumb.addEventListener('pointermove',e=>{
        const r=thumb.getBoundingClientRect();
        const nx=((e.clientX-r.left)/r.width  - 0.5)*2; // -1..1
        const ny=((e.clientY-r.top) /r.height - 0.5)*2;
        targetX= nx*MAX_DEG;
        targetY=-ny*MAX_DEG;
        if(!raf) raf=requestAnimationFrame(frame);
      },{passive:true});

      thumb.addEventListener('pointerleave',()=>{
        targetX=0; targetY=0;
        thumb.style.transform=''; // snap back immediately on leave
        if(raf){ cancelAnimationFrame(raf); raf=0; }
      },{passive:true});
    });
  }

  /* ── INIT ────────────────────────────────────────────── */
  function init(){
    initHeroParallax();
    initMagicText();
    revealObserver();
    initProjectHero();
    initParallaxSections();
    initThumbTilt();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init);
  else init();

  // Expose existing + new functions for external calls (project.html uses these)
  window.portfolioAnimations={
    reveal:revealObserver,
    projectHero:initProjectHero,
    parallax:initParallaxSections,
    tilt:initThumbTilt
  };
})();
