(function(){
  const filters=document.querySelectorAll("[data-filter]");
  const cards=document.querySelectorAll("[data-ex-card]");
  filters.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const tag=btn.getAttribute("data-filter");
      filters.forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      cards.forEach(c=>{
        const tags=(c.getAttribute("data-tags")||"").split(",").map(s=>s.trim());
        c.style.display = (tag==="all" || tags.includes(tag)) ? "" : "none";
      });
    });
  });
})();