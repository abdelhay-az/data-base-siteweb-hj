(function(){
  const THEME_KEY="bd_theme_fr_v1";
  const root=document.documentElement;
  root.setAttribute("data-theme", localStorage.getItem(THEME_KEY) || "dark");
  const btn=document.getElementById("toggleTheme");
  if(btn){
    btn.addEventListener("click", ()=>{
      const cur=root.getAttribute("data-theme") || "dark";
      const next=cur==="dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      root.setAttribute("data-theme", next);
    });
  }
  document.addEventListener("click",(e)=>{
    const b=e.target.closest("[data-copy]");
    if(!b) return;
    const sel=b.getAttribute("data-copy");
    const el=document.querySelector(sel);
    if(!el) return;
    navigator.clipboard.writeText(el.innerText).then(()=>{
      const old=b.textContent;
      b.textContent="✅ Copié";
      setTimeout(()=>b.textContent=old, 900);
    });
  });
})();