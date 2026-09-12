const demos={
  add:{messages:[["user","Запиши: продукты, сегодня, 2450 рублей"],["agent","Готово. Добавил расход: продукты — 2450 ₽."]],flow:"INPUT → VALIDATE → ADD_ROW → DONE"},
  find:{messages:[["user","Покажи расходы на продукты за эту неделю"],["agent","Нашёл 4 записи. Общая сумма — 6 874 ₽."]],flow:"INPUT → PARSE_PERIOD → SEARCH_ROWS → SUMMARIZE"},
  edit:{messages:[["user","Вчерашние продукты исправь на 1862 рубля"],["agent","Нашёл нужную запись и изменил сумму: 2450 ₽ → 1862 ₽."]],flow:"INPUT → SEARCH_ROW → GET_ID → EDIT_ROW → DONE"},
  calc:{messages:[["user","Проверь расчёт: 10% от 175 000 ₽"],["agent calc-error","175 000 ₽ → 1 750 000 ₽"],["agent","Функция пересчитала: 17 500 ₽."]],flow:"ИИ понимает запрос → функция считает → агент формулирует ответ.",note:"Точные расчёты лучше отдавать функциям, а ИИ — понимание запроса и объяснение результата."}
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
  window.setTimeout(()=>{
    if(data.note){
      flow.innerHTML=`<div class="calc-flow"><div class="calc-route">${data.flow}</div><div class="calc-note">${data.note}</div></div>`;
    }else{
      flow.textContent=data.flow;
    }
  },500);
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

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}});
},{threshold:.13});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

const glow=document.querySelector(".cursor-glow");
window.addEventListener("pointermove",e=>{glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px"});
