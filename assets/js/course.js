(function(){
  if(typeof window.lessons==="undefined") return;
  const list=document.getElementById("lessonList");
  const view=document.getElementById("lessonView");
  const search=document.getElementById("search");
  const bar=document.getElementById("bar");
  const ptxt=document.getElementById("progressText");
  const DONE_KEY="bd_done_fr_v1";
  const done=new Set(JSON.parse(localStorage.getItem(DONE_KEY)||"[]"));
  const state={current:0};

  function save(){localStorage.setItem(DONE_KEY, JSON.stringify(Array.from(done)));}
  function pct(){return lessons.length? Math.round((done.size/lessons.length)*100):0;}
  function updateProgress(){
    const p=pct();
    if(bar) bar.style.width=p+"%";
    if(ptxt) ptxt.textContent=p+"% terminé ("+done.size+"/"+lessons.length+")";
  }
  function strip(html){return html.replace(/<[^>]*>/g," ").replace(/\s+/g," ");}
  function filtered(){
    const q=(search?.value||"").toLowerCase().trim();
    if(!q) return lessons.map((l,i)=>({l,i}));
    return lessons.map((l,i)=>({l,i})).filter(x => (x.l.title+" "+strip(x.l.html)).toLowerCase().includes(q));
  }
  function render(items){
    list.innerHTML="";
    items.forEach(({l,i})=>{
      const div=document.createElement("div");
      div.className="item"+(i===state.current?" active":"");
      div.dataset.index=i;
      div.innerHTML=(done.has(i)?"✅ ":"📘 ")+l.title;
      div.addEventListener("click", ()=>open(i));
      list.appendChild(div);
    });
  }
  function wireQuiz(root){
    const q=root.querySelector("[data-quiz]");
    if(!q) return;
    const ans=Number(q.querySelector("[data-answer]").value);
    const explain=q.querySelector("[data-explain]");
    const opts=Array.from(q.querySelectorAll(".qopt"));
    const reset=q.querySelector("[data-reset]");
    function clear(){opts.forEach(o=>o.classList.remove("correct","wrong")); if(explain) explain.hidden=true;}
    opts.forEach(opt=>{
      opt.addEventListener("click", ()=>{
        const i=Number(opt.dataset.opt);
        clear();
        if(i===ans) opt.classList.add("correct");
        else { opt.classList.add("wrong"); if(opts[ans]) opts[ans].classList.add("correct"); }
        if(explain) explain.hidden=false;
      });
    });
    if(reset) reset.addEventListener("click", clear);
  }
  function open(i){
    state.current=i;
    const l=lessons[i];
    view.innerHTML=`
      <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap">
        <h2 style="margin:0">${l.title}</h2>
        <div style="display:flex; gap:10px; flex-wrap:wrap">
          <button class="btn small ghost" id="prevLesson">⬅️ Précédent</button>
          <button class="btn small ghost" id="nextLesson">Suivant ➡️</button>
          <button class="btn small" id="markDone">${done.has(i)?"✅ Terminé":"☑️ Marquer terminé"}</button>
        </div>
      </div>
      <div class="muted" style="margin-top:6px">${l.subtitle||""}</div>
      <hr/>${l.html}`;
    const prev=view.querySelector("#prevLesson");
    const next=view.querySelector("#nextLesson");
    if(prev) prev.onclick=()=>open(Math.max(0,i-1));
    if(next) next.onclick=()=>open(Math.min(lessons.length-1,i+1));
    const md=view.querySelector("#markDone");
    if(md) md.onclick=()=>{done.add(i); save(); updateProgress(); render(filtered()); open(i);};
    wireQuiz(view);
    Array.from(list.children).forEach(el=>el.classList.toggle("active", Number(el.dataset.index)===i));
    window.scrollTo({top:0, behavior:"smooth"});
  }
  if(search){
    search.addEventListener("input", ()=>{
      const it=filtered();
      render(it);
      if(it.length) open(it[0].i);
      else view.innerHTML="<h2>Aucun résultat</h2><p class='muted'>Essayez : JOIN, 3NF, contrainte, index…</p>";
    });
  }
  updateProgress();
  const it=filtered();
  render(it);
  open(it.length?it[0].i:0);
})();