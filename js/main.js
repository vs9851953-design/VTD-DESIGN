(function(){
  function init(){
    const nav=document.getElementById('headerNav');
    if(nav) nav.innerHTML='<a href="#trabalhos">Trabalhos</a><a href="#depoimentos">Depoimentos</a><a href="#contato">Contato</a>';
    const year=document.getElementById('copyYear');if(year)year.textContent=new Date().getFullYear();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
