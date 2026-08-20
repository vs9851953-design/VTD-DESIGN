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
     Scroll: cada camada se desloca no Y proporcional ao progresso
     de rolagem da seção, criando profundidade real.
     Mouse: ao mover o ponteiro sobre a seção, as camadas reagem
     em X e Y com velocidades distintas (efeito de paralaxe 2D).
     O listener de scroll é registrado uma única vez e persiste;
     a busca pelos elementos acontece a cada frame (lazy), para
     funcionar mesmo quando chamado após fetch assíncrono.
  ────────────────────────────────────────────────────────── */
  var _parallaxScrollBound=false;

  function updateParallaxScroll(){
    var sections=document.querySelectorAll('[data-parallax]');
    if(!sections.length) return;
    sections.forEach(function(section){
      var r=section.getBoundingClientRect();
      var vh=window.innerHeight;
      // progress: negativo quando seção está abaixo, positivo quando acima
      var progress=(vh/2-(r.top+r.height/2))/vh;
      // guarda scroll offset na seção para combinar com mouse depois
      section._scrollShifts=section._scrollShifts||{};
      section.querySelectorAll('.p-parallax-layer[data-parallax-speed]').forEach(function(layer){
        var speed=parseFloat(layer.dataset.parallaxSpeed)||0.1;
        var scrollShift=progress*speed*180;
        section._scrollShifts[layer.dataset.parallaxSpeed]=scrollShift;
        var mx=layer._mouseX||0;
        var my=layer._mouseY||0;
        layer.style.transform='translate3d('+(mx)+'px,'+(scrollShift+my)+'px,0)';
      });
    });
  }

  function initParallaxSections(){
    if(reduceMotion) return;

    // Registra listeners globais apenas uma vez
    if(!_parallaxScrollBound){
      _parallaxScrollBound=true;
      var ticking=false;
      window.addEventListener('scroll',function(){
        if(!ticking){ requestAnimationFrame(function(){ updateParallaxScroll(); ticking=false; }); ticking=true; }
      },{passive:true});
      window.addEventListener('resize',updateParallaxScroll);
    }

    // Busca seções presentes agora (chamado após render assíncrono)
    var sections=document.querySelectorAll('[data-parallax]');
    if(!sections.length) return;

    sections.forEach(function(section){
      if(section._parallaxMouseBound) return;
      section._parallaxMouseBound=true;

      var mouseX=0,mouseY=0,tmx=0,tmy=0,mraf=0;

      function mouseFrame(){
        tmx+=(mouseX-tmx)*.08;
        tmy+=(mouseY-tmy)*.08;
        section.querySelectorAll('.p-parallax-layer[data-parallax-speed]').forEach(function(layer){
          var speed=parseFloat(layer.dataset.parallaxSpeed)||0.1;
          var mx=tmx*speed*60;
          var my=tmy*speed*60;
          layer._mouseX=mx;
          layer._mouseY=my;
          // pega scroll shift já calculado
          var scrollShifts=section._scrollShifts||{};
          var scrollShift=scrollShifts[layer.dataset.parallaxSpeed]||0;
          layer.style.transform='translate3d('+mx+'px,'+(scrollShift+my)+'px,0)';
        });
        if(Math.abs(mouseX-tmx)>0.2||Math.abs(mouseY-tmy)>0.2){
          mraf=requestAnimationFrame(mouseFrame);
        } else {
          mraf=0;
        }
      }

      section.addEventListener('pointermove',function(e){
        var r=section.getBoundingClientRect();
        mouseX=(e.clientX-r.left-r.width/2)/(r.width/2);
        mouseY=(e.clientY-r.top -r.height/2)/(r.height/2);
        if(!mraf) mraf=requestAnimationFrame(mouseFrame);
      },{passive:true});

      section.addEventListener('pointerleave',function(){
        mouseX=0; mouseY=0;
        if(!mraf) mraf=requestAnimationFrame(mouseFrame);
      },{passive:true});
    });

    // Dispara update imediato para posicionar as camadas já no render
    updateParallaxScroll();
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
