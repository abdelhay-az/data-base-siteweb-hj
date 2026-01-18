(function(){
  if(typeof window.glossary==="undefined") return;
  const gList=document.getElementById("gList");
  const gSearch=document.getElementById("gSearch");
  const fcTerm=document.getElementById("fcTerm");
  const fcDef=document.getElementById("fcDef");
  const prev=document.getElementById("prevFc");
  const next=document.getElementById("nextFc");
  const flip=document.getElementById("flipFc");
  const box=document.getElementById("cardBox");
  let idx=0, flipped=false;

  function render(items){
    gList.innerHTML="";
    items.forEach(it=>{
      const div=document.createElement("div");
      div.className="item";
      div.innerHTML=`<b style="color:var(--text)">${it.term}</b><div class="muted" style="margin-top:6px">${it.def}</div>`;
      gList.appendChild(div);
    });
  }
  function show(){
    const it=glossary[idx]; if(!it) return;
    fcTerm.textContent = flipped ? "Définition" : it.term;
    fcDef.textContent  = it.def;
  }
  function clamp(){ if(idx<0) idx=glossary.length-1; if(idx>=glossary.length) idx=0; }
  function step(d){ idx+=d; clamp(); flipped=false; show(); }
  function filter(){
    const q=(gSearch?.value||"").toLowerCase().trim();
    const items=!q?glossary:glossary.filter(x => (x.term+" "+x.def).toLowerCase().includes(q));
    render(items);
  }
  if(gList) render(glossary);
  if(gSearch) gSearch.addEventListener("input", filter);
  if(prev) prev.onclick=()=>step(-1);
  if(next) next.onclick=()=>step(1);
  if(flip) flip.onclick=()=>{flipped=!flipped; show();};
  if(box) box.onclick=()=>{flipped=!flipped; show();};
  idx=0; flipped=false; show();
})();