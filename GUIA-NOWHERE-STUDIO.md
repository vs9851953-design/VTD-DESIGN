# 📘 NOWHERE STUDIO — Guia Completo

Estrutura modular e otimizada para seu portfólio de Motion Design

---

## 📂 Estrutura de Projeto Recomendada

```
seu-portfolio/
├── index.html                    # Página principal (listagem de projetos)
├── project.html                  # Página individual de projeto
├── portfolio.json                # Base de dados dos projetos
│
├── css/
│   ├── tokens.css               # Variáveis de design
│   ├── base.css                 # Reset e estilos base
│   ├── components.css           # Componentes reutilizáveis
│   └── index.css                # Estilos específicos da página inicial
│
├── js/
│   ├── portfolio-loader.js      # Carrega e filtra projetos
│   ├── filter-handler.js        # Lógica de filtros
│   └── main.js                  # Scripts gerais
│
├── assets/
│   ├── logo-icon.svg            # Logo (28x28px)
│   ├── favicon.png              # Favicon
│   ├── og-image.jpg             # Imagem para redes sociais
│   ├── placeholder.jpg          # Imagem de fallback
│   │
│   └── projects/                # Pasta de projetos
│       ├── edit-tipografica-pecadores/
│       │   ├── thumb.jpg        # Thumbnail (380x213px)
│       │   ├── cover.jpg        # Cover (1280x720px)
│       │   ├── video.mp4        # Vídeo do projeto
│       │   └── gallery-*.jpg    # Imagens da galeria
│       │
│       ├── seu-projeto-novo/
│       │   ├── thumb.jpg
│       │   ├── cover.jpg
│       │   ├── video.mp4
│       │   └── gallery-*.jpg
│       │
│       └── ... (mais projetos)
│
├── .gitignore
├── README.md
└── vercel.json                  # Configuração do Vercel
```

---

## 🚀 Como Começar

### 1. Setup Inicial

```bash
# Clonar ou criar novo repositório
git init
git remote add origin https://github.com/seu-usuario/seu-portfolio.git

# Criar estrutura de pastas
mkdir -p css js assets/projects

# Copiar arquivos base
# index-melhorado.html → index.html
# project-melhorado.html → project.html
# portfolio.json (fornecido)
```

### 2. Servir Localmente

```bash
# Opção 1: Python
python -m http.server 8000

# Opção 2: Node.js (com http-server)
npm install -g http-server
http-server

# Opção 3: VS Code (Live Server)
# Instalar extensão Live Server e clicar em "Go Live"

# Acesso: http://localhost:8000
```

### 3. Deploy no Vercel

```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login (primeira vez)
vercel login

# Deploy
vercel

# Ou automático com Git
# Conectar repositório GitHub ao Vercel via dashboard
```

---

## 📝 Adicionando Novos Projetos

### Passo 1: Preparar Arquivos

Organize os arquivos do projeto:

```
projects/seu-novo-projeto/
├── thumb.jpg          # 380x213px (para galeria)
├── cover.jpg          # 1280x720px (hero do projeto)
├── video.mp4          # Opcional (vídeo principal)
├── gallery-1.jpg      # Galeria (múltiplas imagens)
├── gallery-2.jpg
└── gallery-3.jpg
```

### Passo 2: Otimizar Imagens

```bash
# Usar ImageMagick ou ferramenta online
convert projeto.jpg -resize 380x213! -quality 85 thumb.jpg
convert projeto.jpg -resize 1280x720! -quality 85 cover.jpg

# Ou usar: tinypng.com, squoosh.app
```

### Passo 3: Adicionar ao portfolio.json

```json
{
  "id": "seu-novo-projeto",
  "titulo": "Seu Novo Projeto",
  "cliente": "Nome do Cliente",
  "categoria": "Motion 2D",  // ou Motion 3D, Apresentação, Posts, Stories
  "ano": 2026,
  "descricao": "Descrição detalhada do projeto e o que foi feito.",
  "feedback": "Depoimento ou resultado do projeto.",
  "feedbackAutor": "Nome do cliente ou sua studio",
  "feedbackCargo": "Cargo/Título",
  "thumb": "projects/seu-novo-projeto/thumb.jpg",
  "cover": "projects/seu-novo-projeto/cover.jpg",
  "gallery": [
    "projects/seu-novo-projeto/gallery-1.jpg",
    "projects/seu-novo-projeto/gallery-2.jpg",
    "projects/seu-novo-projeto/gallery-3.jpg"
  ],
  "video": "projects/seu-novo-projeto/video.mp4"
}
```

### Passo 4: Fazer Commit e Push

```bash
git add .
git commit -m "feat: adicionar novo projeto - Seu Novo Projeto"
git push origin main

# Vercel fará deploy automático!
```

---

## 🎨 Customizando Cores e Estilos

### Paleta de Cores (tokens.css)

```css
:root {
  /* Cores Primárias */
  --black: #0B0B0B;              /* Fundo principal */
  --pure-black: #000000;         /* Preto puro (opcional) */
  --orange: #FF5A00;             /* Cor de destaque */
  --white: #FFFFFF;              /* Branco */

  /* Transparências */
  --white-70: rgba(255, 255, 255, 0.68);
  --white-45: rgba(255, 255, 255, 0.42);
  --white-10: rgba(255, 255, 255, 0.09);
  --white-06: rgba(255, 255, 255, 0.05);
}
```

### Mudando Cor de Destaque

Para trocar de laranja (#FF5A00) para outra cor:

```css
:root {
  --orange: #00D9FF;  /* Ciano */
  /* Ou qualquer outra cor */
}
```

Isso afeta automaticamente:
- Botões
- Links hover
- Filtros ativos
- Border da eyebrow

### Tipografia

```css
:root {
  --display: 'Space Grotesk', sans-serif;  /* Títulos */
  --body: 'Inter', sans-serif;             /* Corpo */
  --mono: 'JetBrains Mono', monospace;     /* Código/Meta */
}
```

Para usar outras fontes:

1. Adicionar link no `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
```

2. Atualizar variável:
```css
--display: 'Playfair Display', serif;
```

---

## 🔧 Configurações Avançadas

### 1. Adicionar Google Analytics

```html
<!-- No final do body, antes de </body> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-SEU_GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G_SEU_GA_ID');
</script>
```

### 2. Adicionar Meta Tags Customizadas

```html
<meta name="description" content="Seu portfólio com descrição customizada">
<meta name="keywords" content="motion design, animation, creative">
<meta property="og:title" content="Seu Nome — Motion Designer">
<meta property="og:description" content="Portfólio de projetos">
<meta property="og:image" content="assets/og-image.jpg">
```

### 3. Adicionar Redes Sociais

No footer (`index.html`):

```html
<div class="footer-links">
  <a href="https://instagram.com/seu-usuario" target="_blank">Instagram</a>
  <a href="https://linkedin.com/in/seu-usuario" target="_blank">LinkedIn</a>
  <a href="https://behance.net/seu-usuario" target="_blank">Behance</a>
  <a href="mailto:seu-email@exemplo.com">Email</a>
</div>
```

### 4. Customizar Textos do Hero

```html
<div class="eyebrow">
  <span class="line"></span>
  SEU TEXTO AQUI
</div>

<h1 class="hero-title">Seu Título Principal</h1>

<p class="hero-description">
  Sua descrição personalizada aqui...
</p>
```

---

## 🚀 Performance & Otimizações

### 1. Lazy Loading de Imagens

Já implementado com `loading="lazy"` nos elementos `<img>`

### 2. Lazy Loading de Vídeos

```html
<!-- Mudar tipo de vídeo -->
<video 
  src="projeto.mp4" 
  controls
  preload="none"        <!-- Não precarregar -->
  poster="thumb.jpg"    <!-- Mostrar thumbnail enquanto carrega -->
  style="width:100%; border-radius: 4px;"
></video>
```

### 3. Otimizar Vídeos

```bash
# Converter para HEVC (mais eficiente)
ffmpeg -i original.mp4 -vcodec hevc -crf 28 optimized.mp4

# Ou H.264 com menos qualidade
ffmpeg -i original.mp4 -vcodec libx264 -crf 28 optimized.mp4
```

### 4. Minificar CSS/JS

```bash
# CSS
npm install -g csso-cli
csso styles.css -o styles.min.css

# JavaScript
npm install -g terser
terser script.js -o script.min.js
```

### 5. Configurar Vercel para Performance

Criar `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".",
  "env": {
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/portfolio.json",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600"
        }
      ]
    }
  ]
}
```

---

## 🔍 SEO e Acessibilidade

### 1. Alt Text em Imagens

✅ **Bom:**
```html
<img 
  src="thumb.jpg" 
  alt="Projeto: Animação tipográfica da música Pecadores"
>
```

❌ **Ruim:**
```html
<img src="thumb.jpg" alt="imagem">
```

### 2. Structured Data (Schema.org)

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Seu Nome",
  "jobTitle": "Motion Designer",
  "url": "https://seu-portfolio.com",
  "image": "https://seu-portfolio.com/foto.jpg",
  "sameAs": [
    "https://instagram.com/seu-usuario",
    "https://behance.net/seu-usuario",
    "https://linkedin.com/in/seu-usuario"
  ]
}
</script>
```

### 3. Teste de Performance

- [Google PageSpeed](https://pagespeed.web.dev)
- [GTmetrix](https://gtmetrix.com)
- [WebPageTest](https://www.webpagetest.org)

---

## 🐛 Troubleshooting

### Problema: Filtros não funcionam
**Solução:** Certifique-se de que `portfolio.json` está sendo servido por um servidor (não por file://)

### Problema: Imagens não carregam
**Solução:** Verifique se o caminho está correto no `portfolio.json`:
```json
"thumb": "projects/nome-do-projeto/thumb.jpg"  // ✓ Correto
"thumb": "/projects/nome-do-projeto/thumb.jpg" // ✗ Errado (não adicionar /)
```

### Problema: Vídeo não toca
**Solução:** Adicionar atributo `muted` para autoplay funcionar:
```html
<video src="video.mp4" controls muted autoplay></video>
```

### Problema: Performance baixa
**Solução:** 
1. Comprimir imagens com TinyPNG
2. Converter vídeos para MP4 H.264
3. Remover arquivos desnecessários
4. Usar `loading="lazy"` nas imagens

---

## 📊 Monitoramento e Análise

### 1. Google Search Console
- [Google Search Console](https://search.google.com/search-console)
- Submeter sitemap.xml
- Monitorar cliques e impressões

### 2. Google Analytics
- Rastrear visitantes
- Fonte de tráfego
- Comportamento dos usuários

### 3. Ferramentas de Teste

```bash
# Verificar erros de console
# Abrir DevTools (F12) > Console

# Testar responsividade
# Abrir DevTools (F12) > Ctrl+Shift+M

# Auditar performance
# DevTools > Lighthouse
```

---

## 📚 Recursos Úteis

**Design & Cores:**
- [Coolors.co](https://coolors.co) - Paleta de cores
- [Color Hunt](https://colorhunt.co) - Inspiração
- [Dribbble](https://dribbble.com) - Inspiração design

**Tipografia:**
- [Google Fonts](https://fonts.google.com)
- [Font Pair](https://www.fontpair.co)
- [Typo Guide](https://www.typogui.de)

**Imagens & Vídeo:**
- [TinyPNG](https://tinypng.com) - Comprimir imagens
- [Squoosh](https://squoosh.app) - Editor online
- [HandBrake](https://handbrake.fr) - Converter vídeos

**Ferramentas:**
- [Figma](https://figma.com) - Design
- [VS Code](https://code.visualstudio.com) - Editor
- [Git/GitHub](https://github.com) - Versionamento

---

## ✅ Checklist de Deploy

Antes de fazer deploy no Vercel:

- [ ] Todos os projetos adicionados ao `portfolio.json`
- [ ] Imagens otimizadas (máx 200KB para thumbnails)
- [ ] Vídeos testados e tocando
- [ ] Links internos funcionando
- [ ] Links externos abrindo em nova aba
- [ ] Meta tags preenchidas
- [ ] Google Analytics configurado
- [ ] Favicon aparecendo
- [ ] Responsividade testada em mobile
- [ ] Sem erros de console (F12)
- [ ] Lighthouse score > 90

---

## 🎓 Próximas Melhorias

1. **Blog/Artigos** - Para SEO e engajamento
2. **Filtro Avançado** - Por ano, cliente, etc
3. **Dark/Light Toggle** - Tema alternativo
4. **Formulário de Contato** - Receber mensagens
5. **Newsletter** - Coletar emails
6. **Multi-idioma** - PT/EN
7. **Lazy Load Progressive** - Mostrar imagens gradualmente
8. **PWA** - App offline

---

**Última atualização:** Agosto 2024
**Versão:** 2.0
**Compatibilidade:** Todos os navegadores modernos

---

## 📞 Suporte

Se tiver dúvidas:
1. Verificar este guia
2. Consultar documentação oficial
3. Abrir issue no GitHub
4. Contactar desenvolvedor

**Welcome to the nowhere that means everything.** 🚀
