const root = document.getElementById('projectRoot');

const q = new URLSearchParams(location.search);

const safe = v =>
  String(v ?? '').replace(/[&<>'"]/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[m]));

const uniq = a => [...new Set(a.filter(Boolean))];

const VIDEO_EXT = /\.(mp4|webm|ogg|mov)(?:$|[?#])/i;

const isVideo = src =>
  VIDEO_EXT.test(String(src || ''));


/* =========================================================
   IMAGENS
========================================================= */

function img(src, alt, cls = '') {
  return `
    <img
      class="${cls}"
      src="${safe(src || 'assets/placeholder.jpg')}"
      alt="${safe(alt)}"
      onerror="
        this.onerror=null;
        this.src='assets/placeholder.jpg';
      "
    >
  `;
}


/* =========================================================
   VÍDEOS
========================================================= */

function getVideoType(src) {

  const clean = String(src || '')
    .split('?')[0]
    .split('#')[0]
    .toLowerCase();

  if (clean.endsWith('.webm')) {
    return 'video/webm';
  }

  if (clean.endsWith('.ogg')) {
    return 'video/ogg';
  }

  if (clean.endsWith('.mov')) {
    return 'video/quicktime';
  }

  return 'video/mp4';
}


function video(src, title, cls = '', poster = '') {

  return `
    <video
      class="${cls}"
      controls
      muted
      loop
      playsinline
      preload="metadata"
      ${poster ? `poster="${safe(poster)}"` : ''}
      aria-label="${safe(title)}"
    >
      <source
        src="${safe(src)}"
        type="${getVideoType(src)}"
      >

      Seu navegador não suporta vídeo.
    </video>
  `;
}


/* =========================================================
   ORGANIZAÇÃO DAS MÍDIAS
========================================================= */

function projectMedia(p) {

  const gallery = Array.isArray(p.gallery)
    ? p.gallery
    : [];


  /*
    IMAGENS DA GALERIA

    Thumb NÃO entra.

    Cover NÃO entra.

    Apenas imagens reais
    do projeto entram.
  */

  const images = uniq(
    gallery.filter(src =>
      !isVideo(src) &&
      src !== p.thumb &&
      src !== p.cover
    )
  );


  /*
    VÍDEOS

    Aceita:

    gallery
    videos
    video
  */

  const videos = uniq(
    [
      ...gallery,
      ...(Array.isArray(p.videos) ? p.videos : []),
      ...(p.video ? [p.video] : [])
    ].filter(isVideo)
  );


  return {
    images,
    videos
  };
}


/* =========================================================
   MÍDIA PARA PROJETOS RELACIONADOS
========================================================= */

function relatedMedia(p) {

  const media = projectMedia(p);

  return (
    p.thumb ||
    media.images[0] ||
    p.cover ||
    'assets/placeholder.jpg'
  );
}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

async function init() {

  try {

    const response = await fetch('portfolio.json');

    if (!response.ok) {
      throw new Error('portfolio.json');
    }


    const projects = await response.json();


    const project =
      projects.find(
        p => p.id === q.get('id')
      ) || projects[0];


    if (!project) {
      throw new Error('Projeto não encontrado');
    }


    document.title =
      `${project.titulo} — NOWHERE STUDIO`;


    render(project, projects);


    bindHeroParallax();

  } catch (error) {

    console.error(error);

    root.innerHTML = `
      <div class="loading">
        Não foi possível carregar este projeto.
      </div>
    `;

  }

}


/* =========================================================
   RENDERIZAÇÃO DO PROJETO
========================================================= */

function render(p, projects) {


  const media = projectMedia(p);


  const images = media.images;

  const videos = media.videos;


  const related = projects.filter(
    x =>
      x.id !== p.id &&
      x.categoria === p.categoria
  );


  const fallbackRelated =
    related.length
      ? related
      : projects
          .filter(x => x.id !== p.id)
          .slice(0, 8);


  /*
    HERO

    Cover é usado somente
    no Hero.

    NÃO entra na galeria.
  */

  const heroSrc =
    p.cover ||
    p.thumb ||
    images[0] ||
    'assets/placeholder.jpg';


  /*
    CONCEITO
  */

  const conceptImage =
    p.concept ||
    p.conceptImage ||
    'assets/concept-visual.svg';


  root.innerHTML = `


    <!-- HERO -->

    <section
      class="project-hero"
      id="projectHero"
    >

      <div
        class="project-hero-bg"
        id="projectHeroBg"
      >

        ${img(heroSrc, '')}

      </div>


      <div class="project-hero-overlay"></div>


      <div class="project-hero-content">

        <div class="project-kicker">

          ${safe(p.categoria || 'Projeto')}

        </div>


        <h1 class="project-title">

          ${safe(p.titulo)}

        </h1>

      </div>

    </section>



    <!-- INFORMAÇÕES -->

    <section class="project-details">

      <div class="project-meta">


        <div>

          <span class="meta-label">

            Cliente

          </span>

          <span class="meta-value">

            ${safe(p.cliente || '—')}

          </span>

        </div>



        <div>

          <span class="meta-label">

            Categoria

          </span>

          <span class="meta-value">

            ${safe(p.categoria || '—')}

          </span>

        </div>



        <div>

          <span class="meta-label">

            Ano

          </span>

          <span class="meta-value">

            ${safe(p.ano || '—')}

          </span>

        </div>



        <div>

          <p class="project-description">

            ${safe(p.descricao || '')}

          </p>

        </div>


      </div>

    </section>



    <!-- PROJETO -->

    <section class="project-showcase">


      <div class="showcase-head">

        <span class="mini">

          ${
            videos.length
              ? 'Projeto em movimento'
              : 'Projeto em destaque'
          }

        </span>


        <h2>

          ${
            videos.length
              ? 'Visualização do projeto'
              : 'Galeria do projeto'
          }

        </h2>

      </div>



      <!-- VÍDEOS -->

      ${
        videos.length
          ? `

          <div class="video-showcase">

            ${videos.map(src => `

              <div class="video-main">

                ${video(
                  src,
                  p.titulo,
                  '',
                  p.thumb || p.cover || ''
                )}

              </div>

            `).join('')}

          </div>

          `
          : ''
      }



      <!-- IMAGENS -->

      ${
        images.length
          ? `

          <div
            class="showcase"
            id="showcase"
          >

            <div
              class="showcase-main"
              id="showcaseMain"
            ></div>


            <div
              class="showcase-stack"
              id="showcaseStack"
            ></div>

          </div>


          <p class="showcase-caption">

            Visualização automática

            <span>·</span>

            ${images.length}

            imagem${images.length !== 1 ? 'ns' : ''}

          </p>

          `
          : ''
      }



      <!-- SEM MÍDIA -->

      ${
        !videos.length && !images.length
          ? `

          <div class="showcase-none">

            Este projeto ainda não possui mídia cadastrada.

          </div>

          `
          : ''
      }


    </section>



    <!-- CONCEITO -->

    <section class="concept">

      <div class="concept-inner">


        <div class="concept-media">

          ${img(
            conceptImage,
            p.titulo
          )}

        </div>



        <div class="concept-copy">

          <h2>

            Conceito

          </h2>


          <p>

            ${safe(
              p.conceito ||
              p.conceptText ||
              p.descricao ||
              ''
            )}

          </p>



          ${
            p.feedback
              ? `

              <div class="feedback">

                “${safe(p.feedback)}”

                <br>

                <strong>

                  ${safe(
                    p.feedbackAutor || ''
                  )}

                </strong>


                ${
                  p.feedbackCargo
                    ? ` · ${safe(
                        p.feedbackCargo
                      )}`
                    : ''
                }

              </div>

              `
              : ''
          }


        </div>


      </div>

    </section>



    <!-- OUTROS PROJETOS -->

    <section class="related">


      <div class="related-head">


        <span class="mini">

          ${safe(
            p.categoria ||
            'Projetos'
          )}

        </span>


        <h2>

          Outros projetos

        </h2>


      </div>



      <div
        class="related-rail"
        id="relatedRail"
      >


        ${fallbackRelated.map(x => `


          <a
            class="related-card"
            href="project.html?id=${encodeURIComponent(x.id)}"
          >


            ${img(
              relatedMedia(x),
              x.titulo
            )}


            <span>

              ${safe(x.titulo)}

            </span>


          </a>


        `).join('')}


      </div>


    </section>


  `;


  /*
    INICIALIZAÇÕES
  */


  if (videos.length) {

    setupProjectVideos();

  }


  if (images.length) {

    setupShowcase(
      images,
      p.titulo
    );

  }


  setupRelatedRail();


}


/* =========================================================
   INICIALIZAÇÃO DOS VÍDEOS
========================================================= */

function setupProjectVideos() {


  const videoElements =
    document.querySelectorAll(
      '.video-main video'
    );


  videoElements.forEach(videoElement => {


    /*
      Configurações importantes
    */

    videoElement.muted = true;

    videoElement.playsInline = true;

    videoElement.loop = true;


    /*
      FORÇA O CARREGAMENTO
    */

    videoElement.load();


    /*
      TENTA REPRODUZIR
    */

    const tryPlay = () => {


      const promise =
        videoElement.play();


      if (promise !== undefined) {

        promise.catch(error => {

          /*
            Não interrompe o vídeo.

            Apenas registra o erro.
          */

          console.log(
            'Vídeo aguardando interação:',
            error
          );

        });

      }

    };


    /*
      QUANDO OS METADADOS
      ESTIVEREM DISPONÍVEIS
    */

    videoElement.addEventListener(
      'loadedmetadata',
      tryPlay,
      { once: true }
    );


    /*
      QUANDO O VÍDEO
      PUDER SER REPRODUZIDO
    */

    videoElement.addEventListener(
      'canplay',
      tryPlay,
      { once: true }
    );


    /*
      CASO JÁ ESTEJA PRONTO
    */

    if (
      videoElement.readyState >= 2
    ) {

      tryPlay();

    }


    /*
      CLIQUE MANUAL
    */

    videoElement.addEventListener(
      'click',
      () => {

        if (
          videoElement.paused
        ) {

          tryPlay();

        }

      }
    );


    /*
      ERRO

      Isso vai aparecer
      no Console do navegador.
    */

    videoElement.addEventListener(
      'error',
      () => {

        console.error(
          'ERRO AO CARREGAR O VÍDEO:',
          videoElement.currentSrc ||
          videoElement.src
        );

      }
    );


  });


}


/* =========================================================
   GALERIA DE IMAGENS
========================================================= */

function setupShowcase(images, title) {


  const main =
    document.getElementById(
      'showcaseMain'
    );


  const stack =
    document.getElementById(
      'showcaseStack'
    );


  if (!main || !stack) return;


  let index = 0;


  const draw = () => {


    main.classList.add(
      'changing'
    );


    setTimeout(() => {


      main.innerHTML = img(
        images[index],
        title
      );


      main.classList.remove(
        'changing'
      );


    }, 140);



    stack.innerHTML = '';


    const sideCount =
      Math.min(
        3,
        Math.max(
          0,
          images.length - 1
        )
      );


    for (
      let i = 1;
      i <= sideCount;
      i++
    ) {


      const src =
        images[
          (index + i) %
          images.length
        ];


      stack.innerHTML += `

        <div
          class="showcase-thumb incoming"
        >

          ${img(
            src,
            `${title} — visualização`
          )}

        </div>

      `;


    }


    if (
      images.length === 1
    ) {

      stack.classList.add(
        'is-empty'
      );

    } else {

      stack.classList.remove(
        'is-empty'
      );

    }


  };


  draw();


  if (
    images.length > 1
  ) {

    setInterval(() => {

      index =
        (index + 1) %
        images.length;


      draw();


    }, 4200);

  }


}


/* =========================================================
   CARROSSEL AUTOMÁTICO
   OUTROS PROJETOS
========================================================= */

function setupRelatedRail() {


  const rail =
    document.getElementById(
      'relatedRail'
    );


  if (
    !rail ||
    rail.children.length < 2
  ) return;


  const items =
    [...rail.children];


  items.forEach(item => {

    rail.appendChild(
      item.cloneNode(true)
    );

  });


  let paused = false;

  let last = 0;


  const tick = time => {


    if (!last) {

      last = time;

    }


    const delta =
      Math.min(
        40,
        time - last
      );


    last = time;


    if (
      !paused &&
      rail.scrollWidth >
      rail.clientWidth
    ) {


      rail.scrollLeft +=
        delta * 0.03;


      if (
        rail.scrollLeft >=
        rail.scrollWidth / 2 - 2
      ) {

        rail.scrollLeft = 0;

      }

    }


    requestAnimationFrame(
      tick
    );


  };


  rail.addEventListener(
    'mouseenter',
    () => {

      paused = true;

    }
  );


  rail.addEventListener(
    'mouseleave',
    () => {

      paused = false;

    }
  );


  requestAnimationFrame(
    tick
  );


}


/* =========================================================
   PARALLAX DO HERO
========================================================= */

function bindHeroParallax() {


  const hero =
    document.getElementById(
      'projectHero'
    );


  const bg =
    document.getElementById(
      'projectHeroBg'
    );


  if (
    !hero ||
    !bg
  ) return;


  hero.addEventListener(
    'mousemove',
    event => {


      const rect =
        hero.getBoundingClientRect();


      const x =
        (event.clientX - rect.left) /
        rect.width -
        0.5;


      const y =
        (event.clientY - rect.top) /
        rect.height -
        0.5;


      bg.style.transform =
        `scale(1.05)
         translate(
           ${x * -12}px,
           ${y * -9}px
         )`;


    }
  );


  hero.addEventListener(
    'mouseleave',
    () => {

      bg.style.transform =
        'scale(1.05)';

    }
  );


}


/* =========================================================
   ANO
========================================================= */

document
  .getElementById('year')
  .textContent =
  new Date().getFullYear();


init();
