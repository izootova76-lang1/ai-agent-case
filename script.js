const demoDialog=document.querySelector('#demo-dialog');
const sheetPanel=document.querySelector('#sheet-panel');
let demoTimers=[];

const demos={
  add:{
    messages:[['user','Запиши 740 ₽ на продукты сегодня.'],['agent','Добавил расход: 740 ₽ · Продукты · Сегодня.']],
    sheet:{status:'ЗАПИСЬ НАЙДЕНА',amount:'740 ₽',category:'Продукты',time:'Сегодня · сейчас'}
  },
  find:{
    messages:[['user','Найди покупку на 1 290 ₽ за вчера.'],['agent','Нашёл запись. Показываю данные, чтобы вы могли её проверить.']],
    sheet:{status:'ЗАПИСЬ НАЙДЕНА',amount:'1 290 ₽',category:'Дом',time:'Вчера · 18:40'}
  },
  edit:{
    messages:[['user','Вчерашние 1 862 ₽ перенеси из категории «Продукты» в категорию «Дом».'],['agent','Нашёл запись: вчера · 1 862 ₽ · Продукты. Изменить категорию на «Дом»?']],
    sheet:{status:'ЗАПИСЬ НАЙДЕНА',amount:'1 862 ₽',category:'Продукты',time:'Вчера · 17:25'},confirm:true
  },
  multi:{
    messages:[['user','Поменяй вчерашние 850 ₽ на категорию «Дом».'],['agent','Нашёл две похожие записи. Какую изменить?']],multi:true
  },
  calc:{
    messages:[['user','Посчитай 10% от 175 000 ₽.'],['agent','Запрос понят: нужно найти 10% от суммы.'],['agent error','175 000 ₽ → 1 750 000 ₽']],calc:true
  }
};

function clearDemoTimers(){demoTimers.forEach(window.clearTimeout);demoTimers=[]}
function bubble(role,text){return `<div class="demo-bubble ${role}">${text}</div>`}
function sheetCard(data,changed=false){
  return `<div class="sheet-head"><span>GOOGLE SHEET</span><i></i></div>
    <div class="record-card">
      <span class="record-status">${data.status}</span>
      <h3>${data.amount}</h3>
      <div class="record-data"><span>Категория<b class="${changed?'changed':''}">${data.category}</b></span><span>Время<b>${data.time}</b></span></div>
    </div>`;
}
function renderDemo(key){
  clearDemoTimers();
  const data=demos[key];
  demoDialog.innerHTML=data.messages.map(([role,text])=>bubble(role,text)).join('');
  if(data.sheet)sheetPanel.innerHTML=sheetCard(data.sheet);
  if(data.confirm){
    demoDialog.insertAdjacentHTML('beforeend','<div class="demo-choice-row"><button class="demo-choice" id="confirm-edit">Да, изменить</button></div>');
    document.querySelector('#confirm-edit').addEventListener('click',()=>{
      demoDialog.insertAdjacentHTML('beforeend',bubble('agent','Готово. Категория изменена: Продукты → Дом.'));
      sheetPanel.innerHTML=sheetCard({...data.sheet,status:'ЗАПИСЬ ОБНОВЛЕНА',category:'Дом'},true);
    },{once:true});
  }
  if(data.multi){
    sheetPanel.innerHTML=`<div class="sheet-head"><span>НАЙДЕНО 2 ЗАПИСИ</span><i></i></div><div class="multi-records">
      <button class="mini-record" data-record="Продукты · 14:32"><b>850 ₽</b><span>Продукты · 14:32</span></button>
      <button class="mini-record" data-record="Хозяйственные товары · 19:07"><b>850 ₽</b><span>Хозяйственные товары · 19:07</span></button>
      </div><p class="calc-conclusion">Хороший агент понимает, когда самостоятельно действовать нельзя.</p>`;
    document.querySelectorAll('.mini-record').forEach(btn=>btn.addEventListener('click',()=>{
      document.querySelectorAll('.mini-record').forEach(item=>item.classList.remove('selected'));
      btn.classList.add('selected');
      demoDialog.insertAdjacentHTML('beforeend',bubble('agent',`Выбрана запись: ${btn.dataset.record}. Категория изменена на «Дом».`));
    },{once:true}));
  }
  if(data.calc){
    sheetPanel.innerHTML=`<div class="sheet-head"><span>ПРОВЕРКА РАСЧЁТА</span><i class="error-dot"></i></div>
      <div class="calc-result"><span class="record-status">ОШИБОЧНЫЙ РЕЗУЛЬТАТ</span><strong>175 000 ₽ → 1 750 000 ₽</strong></div>
      <div class="calc-route" id="calc-route" hidden><span>ИИ понимает запрос</span><span>функция считает</span><span>агент формулирует ответ</span></div>
      <p class="calc-conclusion" id="calc-conclusion" hidden>Точные расчёты лучше отдавать функциям, а ИИ — понимание запроса и объяснение результата.</p>`;
    demoTimers.push(window.setTimeout(()=>{
      if(!document.querySelector('[data-demo="calc"].active'))return;
      const route=document.querySelector('#calc-route');
      const conclusion=document.querySelector('#calc-conclusion');
      route.hidden=false;conclusion.hidden=false;
      demoDialog.insertAdjacentHTML('beforeend',bubble('agent','Функция пересчитала: 17 500 ₽.'));
    },1050));
  }
}

document.querySelectorAll('.demo-tab').forEach(tab=>tab.addEventListener('click',()=>{
  document.querySelectorAll('.demo-tab').forEach(item=>{item.classList.remove('active');item.setAttribute('aria-selected','false')});
  tab.classList.add('active');tab.setAttribute('aria-selected','true');
  renderDemo(tab.dataset.demo);
}));
renderDemo('add');

document.querySelectorAll('[data-accordion]').forEach(group=>{
  group.querySelectorAll('article>button').forEach(button=>button.addEventListener('click',()=>{
    const item=button.parentElement;
    const wasOpen=item.classList.contains('open');
    group.querySelectorAll(':scope>article').forEach(article=>{
      article.classList.remove('open');
      const trigger=article.querySelector(':scope>button');
      trigger.setAttribute('aria-expanded','false');
      trigger.querySelector('i').textContent='+';
    });
    if(!wasOpen){item.classList.add('open');button.setAttribute('aria-expanded','true');button.querySelector('i').textContent='×'}
  }));
});

const pathMessages=[
  ['Запрос получен','Человек написал обычными словами'],
  ['Агент определяет задачу','Проверяю, хватает ли информации'],
  ['Ищу нужные данные','Запись найдена'],
  ['Проверяю совпадения','Нужно уточнение / данных достаточно'],
  ['Выполняю действие','Получаю обновлённые данные'],
  ['Проверяю результат','Результат проверен']
];
const pathSteps=[...document.querySelectorAll('.path-step')];
const consoleLines=document.querySelector('#console-lines');
let replayTimers=[];
function activatePath(index){
  pathSteps.forEach((step,i)=>{step.classList.toggle('active',i===index);step.classList.toggle('done',i<index)});
  consoleLines.innerHTML=pathMessages.slice(0,index+1).flat().map((line,i,arr)=>`<p class="console-line ${i===arr.length-1&&index===5?'ok':''}">${line}</p>`).join('');
}
pathSteps.forEach(step=>step.addEventListener('click',()=>{replayTimers.forEach(window.clearTimeout);replayTimers=[];activatePath(Number(step.dataset.step))}));
document.querySelector('#replay-path').addEventListener('click',()=>{
  replayTimers.forEach(window.clearTimeout);replayTimers=[];
  pathSteps.forEach((_,i)=>replayTimers.push(window.setTimeout(()=>activatePath(i),i*480)));
});
activatePath(0);

const comparisons={
  before:['«Назовите ID»','Агент делает не то действие','«Готово» ещё ничего не гарантирует','Человек подстраивается под систему'],
  after:['«Я нашёл подходящую запись»','Агент следует нужной логике','Результат действительно проверен','Система понимает обычную речь человека']
};
const compare=document.querySelector('.compare');
const compareList=document.querySelector('#compare-list');
function renderCompare(key){
  compare.classList.toggle('after',key==='after');
  compareList.innerHTML=comparisons[key].map(item=>`<div class="compare-item">${item}</div>`).join('');
  document.querySelectorAll('[data-compare]').forEach(button=>button.classList.toggle('active',button.dataset.compare===key));
}
document.querySelectorAll('[data-compare]').forEach(button=>button.addEventListener('click',()=>renderCompare(button.dataset.compare)));
renderCompare('before');

const modal=document.querySelector('#contact-modal');
const textarea=document.querySelector('#task-text');
function openModal(){modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';window.setTimeout(()=>textarea.focus(),180)}
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow=''}
document.querySelectorAll('.js-open-modal').forEach(item=>item.addEventListener('click',openModal));
document.querySelectorAll('.js-close-modal').forEach(item=>item.addEventListener('click',closeModal));
document.addEventListener('keydown',event=>{if(event.key==='Escape')closeModal()});
document.querySelector('#copy-btn').addEventListener('click',async event=>{
  const button=event.currentTarget;
  const message=textarea.value.trim()||'Здравствуйте, Светлана! Хочу обсудить создание AI-агента под мою задачу.';
  try{await navigator.clipboard.writeText(message)}catch{textarea.value=message;textarea.select();document.execCommand('copy')}
  button.textContent='Текст скопирован ✓';
  window.setTimeout(()=>button.textContent='Скопировать текст для сообщения',1800);
});

const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));
const glow=document.querySelector('.cursor-glow');
window.addEventListener('pointermove',event=>{glow.style.left=event.clientX+'px';glow.style.top=event.clientY+'px'});
