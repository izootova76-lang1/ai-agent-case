const demos={
  add:{messages:[["user","Запиши: продукты, сегодня, 2450 рублей"],["agent","Готово. Добавил расход: продукты — 2450 ₽."]],flow:"INPUT → VALIDATE → ADD_ROW → DONE"},
  find:{messages:[["user","Покажи расходы на продукты за эту неделю"],["agent","Нашёл 4 записи. Общая сумма — 6 874 ₽."]],flow:"INPUT → PARSE_PERIOD → SEARCH_ROWS → SUMMARIZE"},
  edit:{messages:[["user","Вчерашние продукты исправь на 1862 рубля"],["agent","Нашёл нужную запись и изменил сумму: 2450 ₽ → 1862 ₽."]],flow:"INPUT → SEARCH_ROW → GET_ID → EDIT_ROW → DONE"}
};
const chat=document.querySelector("#chat");
const flow=document.querySelector("#flow");
function renderDemo(key){
  const data=demos[key];
  chat.innerHTML="";
  flow.textContent="processing...";
  data.messages.forEach(([role,text],i)=>{
    const el=document.createElement("div");
    el.className="bubble "+role+(i?" delay":"");
    el.textContent=text;
    chat.appendChild(el);
  });
  window.setTimeout(()=>{flow.textContent=data.flow},500);
}
document.querySelectorAll(".demo-chip").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".demo-chip").forEach(item=>item.classList.remove("active"));
  btn.classList.add("active");
  renderDemo(btn.dataset.action);
}));
renderDemo("add");

const modal=document.querySelector("#contact-modal");
const textarea=document.querySelector("#task-text");
function openModal(){
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
  window.setTimeout(()=>textarea.focus(),180);
}
function closeModal(){
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
  document.body.style.overflow="";
}
document.querySelectorAll(".js-open-modal").forEach(el=>el.addEventListener("click",openModal));
document.querySelectorAll(".js-close-modal").forEach(el=>el.addEventListener("click",closeModal));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});

const copyBtn=document.querySelector("#copy-btn");
copyBtn.addEventListener("click",async()=>{
  const task=textarea.value.trim();
  const message=task||"Здравствуйте, Светлана! Хочу обсудить создание AI-агента под мою задачу.";
  try{
    await navigator.clipboard.writeText(message);
    copyBtn.textContent="Текст скопирован ✓";
  }catch{
    textarea.value=message;
    textarea.select();
    document.execCommand("copy");
    copyBtn.textContent="Текст скопирован ✓";
  }
  window.setTimeout(()=>copyBtn.textContent="Скопировать текст для сообщения",1800);
});

// Stagger only related groups so the story unfolds without constant motion.
document.querySelectorAll(".bug-list, .pipeline, .case-grid").forEach(group=>{
  group.querySelectorAll(".reveal").forEach((el,index)=>{
    el.style.setProperty("--delay",Math.min(index*70,280)+"ms");
  });
});

const mathCase=document.querySelector("#math-case");
const mathToggle=document.querySelector("#math-toggle");
const mathSolution=document.querySelector("#math-solution");
let mathTimers=[];
function clearMathTimers(){
  mathTimers.forEach(timer=>window.clearTimeout(timer));
  mathTimers=[];
}
if(mathCase&&mathToggle&&mathSolution){
  mathToggle.addEventListener("click",()=>{
    const solved=!mathCase.classList.contains("solved");
    clearMathTimers();
    mathCase.classList.toggle("solved",solved);
    mathToggle.setAttribute("aria-expanded",String(solved));
    mathSolution.setAttribute("aria-hidden",String(!solved));
    mathToggle.innerHTML=solved
      ? 'Вернуть ошибочный расчёт <span>↶</span>'
      : 'Показать правильный маршрут <span>→</span>';
    const steps=mathCase.querySelectorAll(".solution-step");
    steps.forEach(step=>step.classList.remove("active"));
    if(solved){
      steps.forEach((step,index)=>{
        mathTimers.push(window.setTimeout(()=>step.classList.add("active"),280+index*330));
      });
    }
  });
}

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}});
},{threshold:.13});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

const glow=document.querySelector(".cursor-glow");
window.addEventListener("pointermove",e=>{glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px"});
