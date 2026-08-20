(function(){
  const p=new URLSearchParams(location.search);const cat=p.get('cat');if(cat)window.PORTFOLIO_INITIAL_FILTER=cat;
  document.addEventListener('portfolio:filtered',e=>{const u=new URL(location.href);if(e.detail.filter==='all')u.searchParams.delete('cat');else u.searchParams.set('cat',e.detail.filter);history.replaceState({},'',u)});
})();
